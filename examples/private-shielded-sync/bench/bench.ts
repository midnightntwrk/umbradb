/**
 * The benchmark of the private shielded sync (spec FR-150–154, story 6): runs the flow of spec §1 against a running
 * server for one or more wallets and writes `results.json` and `REPORT.md` under
 * `examples/private-shielded-sync/bench/results/<date>-<network>/` (or `--out`).
 *
 *   npm ci --ignore-scripts --prefix examples/private-shielded-sync/client      # once: the client's packages
 *   node --env-file=<secrets.env> examples/private-shielded-sync/bench/bench.ts run --wallet A --wallet B \
 *     --server http://127.0.0.1:10480 --db-url postgres://postgres@127.0.0.1:58171/umbradb --db-password-file <file> \
 *     --pss-data <out>/pss-data --sync-records <out> --server-container pss-patched-run --status-url <admin>/status
 *   node examples/private-shielded-sync/bench/bench.ts report <results.json> [--transfer <record>]
 *
 * `report` renders `REPORT.md` again from a `results.json`, adding the transfer record `send` wrote when given. Run
 * `bench.ts help` for every option. Secrets come only from the environment (mnemonics) and from files named on the
 * command line (database password, admin secret); none is printed or written.
 */

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { availableParallelism, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { loadLedger } from "../client/ledger.ts";
import { loadSdk } from "../client/sdk-api.ts";
import { readSyncRecords } from "./bench-chain.ts";
import { dockerProbe, type MemoryProbe, pidProbe } from "./bench-probes.ts";
import { missingCells, renderReport } from "./bench-report.ts";
import type { BenchResults } from "./bench-results.ts";
import { type BenchWallet, runBench, transferRow } from "./bench-run.ts";
import { dockerLogLines, logFileLines } from "./bench-server-log.ts";
import type { Reader } from "./bench-splits.ts";

const HELP = `usage:
  node [--env-file=<secrets.env>] examples/private-shielded-sync/bench/bench.ts run [options]
  node examples/private-shielded-sync/bench/bench.ts report <results.json> [--transfer <record>] [--out <dir>]

wallets (at least one; each syncs as a fresh client):
  --wallet <name>               mnemonic from the environment variable PSS_MNEMONIC_<NAME> (repeatable)
  --zswap-seed-file <path>      a generated wallet's 32-byte Zswap seed as hex; labelled by the file's name (repeatable)
  --generated                   also a freshly generated wallet that holds nothing (label "fresh")

server:
  --server <url>                the module API (default http://127.0.0.1:10480)
  --network <name>              the network the server must serve (default PSS_NETWORK when set)
  --build                       first ask the server for a snapshot at its latest height (admin route) and wait
  --build-height <h>            … at this height instead
  --admin-secret-file <path>    the admin secret (for --build)
  --pss-data <dir>              the module's data directory: the snapshot's build-stats.json (server rows)
  --server-container <name>     the server's container: memory by docker stats, request lines by docker logs
  --server-pid <pid>            a local server process: memory by ps
  --server-log <file>           the server's output (e.g. run.log) instead of docker logs
  --status-url <url>            the admin /status (module versions), e.g. http://127.0.0.1:10481/status

database and sync (read only):
  --db-url <url>                postgres://user@host:port/database: database size, event read, FR-153 builds
  --db-password-file <path>     its password
  --sync-records <dir>          run/sync.mjs's output folder (status.jsonl, runs.jsonl): heights per second

measurement:
  --threads <n>                 client scan and PIR threads (default: CPUs − 1, at most 8)
  --scan-threads <list>         thread counts of the scan by thread count (default 1,2,4,8)
  --path-splits <list>          FR-153's k values (default 16,8,0)
  --build-threads <n>           threads of the in-process builds (default: the server's, else 4)
  --transfer <file>             the transfer record send wrote (the "transfer" row; "not run" without it)

output:
  --out <dir>                   the results folder (default bench/results/<date>-<network>/)
  --work <dir>                  scratch for caches, states and builds (default: a temporary folder, removed after)
`;

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    server: { type: "string", default: "http://127.0.0.1:10480" },
    wallet: { type: "string", multiple: true, default: [] },
    "zswap-seed-file": { type: "string", multiple: true, default: [] },
    generated: { type: "boolean", default: false },
    network: { type: "string" },
    build: { type: "boolean", default: false },
    "build-height": { type: "string" },
    "admin-secret-file": { type: "string" },
    "pss-data": { type: "string" },
    "server-container": { type: "string" },
    "server-pid": { type: "string" },
    "server-log": { type: "string" },
    "status-url": { type: "string" },
    "db-url": { type: "string" },
    "db-password-file": { type: "string" },
    "sync-records": { type: "string" },
    threads: { type: "string" },
    "scan-threads": { type: "string", default: "1,2,4,8" },
    "path-splits": { type: "string", default: "16,8,0" },
    "build-threads": { type: "string" },
    transfer: { type: "string" },
    out: { type: "string" },
    work: { type: "string" },
    help: { type: "boolean", default: false },
  },
});

const log = (line: string): void => void process.stderr.write(`${new Date().toISOString()} ${line}\n`);
const list = (s: string): number[] => s.split(",").filter((x) => x.trim() !== "").map((x) => {
  const n = Number(x.trim());
  if (!Number.isInteger(n) || n < 0) throw new Error(`not a whole number: ${x}`);
  return n;
});

/** Writes `results.json` and `REPORT.md` into `dir`; prints the cells still without a value. */
function writeOut(dir: string, results: BenchResults): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
  writeFileSync(join(dir, "REPORT.md"), renderReport(results));
  const gaps = missingCells(results);
  log(`wrote ${join(dir, "results.json")} and REPORT.md; ${gaps.length === 0 ? "every cell of spec §8 has a value" : `${gaps.length} cell(s) without a value: ${gaps.map((g) => `${g.part} / ${g.side} / ${g.column}`).join("; ")}`}`);
}

async function wallets(): Promise<BenchWallet[]> {
  const out: BenchWallet[] = [];
  const names = opt.wallet ?? [];
  if (names.length > 0) {
    const sdk = await loadSdk();
    for (const name of names) {
      const variable = `PSS_MNEMONIC_${name.toUpperCase()}`;
      const mnemonic = process.env[variable]?.trim();
      if (!mnemonic) throw new Error(`the environment variable ${variable} is not set (run with node --env-file=<secrets.env>)`);
      out.push({ label: name, source: "mnemonic", zswapSeed: sdk.seedsFromMnemonic(mnemonic).shielded });
    }
  }
  for (const file of opt["zswap-seed-file"] ?? []) {
    const seed = Buffer.from(readFileSync(file, "utf8").trim(), "hex");
    if (seed.length !== 32) throw new Error(`${file}: a Zswap seed file holds 32 bytes as hex`);
    out.push({ label: `seed-${file.split("/").pop()!.replace(/[^A-Za-z0-9_-]/g, "-")}`, source: "seed", zswapSeed: new Uint8Array(seed) });
  }
  if (opt.generated) out.push({ label: "fresh", source: "seed", zswapSeed: new Uint8Array(randomBytes(32)) });
  return out;
}

async function database(): Promise<{ reader: Reader; close(): Promise<void> } | null> {
  if (opt["db-url"] === undefined) return null;
  if (opt["db-password-file"] === undefined) throw new Error("--db-url needs --db-password-file");
  type Sql = { unsafe(q: string, p?: unknown[]): Promise<Record<string, unknown>[]>; end(): Promise<void> };
  const { default: postgres } = (await import("postgres" as string)) as { default: ((url: string, o: Record<string, unknown>) => Sql) & { BigInt: unknown } };
  const sql = postgres(opt["db-url"], {
    password: readFileSync(opt["db-password-file"], "utf8").trim(),
    max: 1,
    onnotice: () => {},
    types: { bigint: postgres.BigInt },
  });
  return {
    reader: { query: async (q, params) => [...(await sql.unsafe(q, (params ?? []) as unknown[]))] },
    close: () => sql.end(),
  };
}

function ledgerPackageName(): string {
  try {
    const pkg = JSON.parse(readFileSync(new URL("../client/node_modules/@midnightntwrk/ledger-v9/package.json", import.meta.url), "utf8")) as { version: string };
    return `@midnightntwrk/ledger-v9 ${pkg.version}`;
  } catch {
    return "@midnightntwrk/ledger-v9";
  }
}

async function cmdRun(): Promise<void> {
  const ws = await wallets();
  if (ws.length === 0) throw new Error("name at least one wallet: --wallet, --zswap-seed-file or --generated");
  const threads = opt.threads === undefined ? Math.min(8, Math.max(1, availableParallelism() - 1)) : Number(opt.threads);
  if (!Number.isInteger(threads) || threads < 1) throw new Error("--threads must be a whole number ≥ 1");
  const container = opt["server-container"];
  let serverMemory: MemoryProbe | null = null;
  if (container !== undefined) serverMemory = dockerProbe(container);
  else if (opt["server-pid"] !== undefined) serverMemory = pidProbe(Number(opt["server-pid"]));
  const serverLog =
    opt["server-log"] !== undefined
      ? { source: `the file ${resolve(opt["server-log"])}`, lines: async () => logFileLines(opt["server-log"]!) }
      : container !== undefined
        ? { source: `docker logs of ${container}`, lines: (since: Date) => dockerLogLines(container, since) }
        : null;
  const work = opt.work === undefined ? mkdtempSync(join(tmpdir(), "pss-bench-")) : resolve(opt.work);
  const db = await database();
  const network = opt.network ?? process.env.PSS_NETWORK?.trim();
  try {
    const results = await runBench({
      server: opt.server!,
      ledger: await loadLedger(),
      ledgerName: ledgerPackageName(),
      wallets: ws,
      workDir: work,
      ...(network ? { network } : {}),
      clientThreads: threads,
      scanThreads: list(opt["scan-threads"]!).filter((t) => t >= 1),
      pathSplits: db === null ? [] : list(opt["path-splits"]!),
      buildThreads: opt["build-threads"] === undefined ? null : Number(opt["build-threads"]),
      db: db?.reader ?? null,
      pssData: opt["pss-data"] === undefined ? null : resolve(opt["pss-data"]),
      syncRecords: opt["sync-records"] === undefined ? null : readSyncRecords(resolve(opt["sync-records"])),
      statusUrl: opt["status-url"] ?? null,
      serverLog,
      serverMemory,
      build: opt.build || opt["build-height"] !== undefined
        ? {
            adminSecret: readFileSync(opt["admin-secret-file"] ?? fail("--build needs --admin-secret-file"), "utf8").trim(),
            ...(opt["build-height"] === undefined ? {} : { height: Number(opt["build-height"]) }),
          }
        : null,
      transfer: opt.transfer === undefined ? null : { record: JSON.parse(readFileSync(opt.transfer, "utf8")) as Record<string, unknown>, source: `the record ${opt.transfer.split("/").pop()}` },
      log,
    });
    const dir = opt.out === undefined ? fileURLDir(`results/${results.startedAt.slice(0, 10)}-${results.network}`) : resolve(opt.out);
    writeOut(dir, results);
  } finally {
    await db?.close();
    if (opt.work === undefined) rmSync(work, { recursive: true, force: true });
  }
}

function fail(message: string): never {
  throw new Error(message);
}

const fileURLDir = (relative: string): string => resolve(dirname(fileURLToPath(import.meta.url)), relative);

function cmdReport(): void {
  const file = positionals[1] ?? fail("report needs the results.json to render");
  const results = JSON.parse(readFileSync(file, "utf8")) as BenchResults;
  const withTransfer: BenchResults =
    opt.transfer === undefined ? results : { ...results, transfer: transferRow(JSON.parse(readFileSync(opt.transfer, "utf8")) as Record<string, unknown>, `the record ${opt.transfer.split("/").pop()}`) };
  writeOut(opt.out === undefined ? dirname(resolve(file)) : resolve(opt.out), withTransfer);
}

try {
  const command = positionals[0] ?? "help";
  if (opt.help || command === "help") process.stdout.write(HELP);
  else if (command === "run") await cmdRun();
  else if (command === "report") cmdReport();
  else throw new Error(`unknown command ${command}; see bench.ts help`);
} catch (error) {
  log(`error: ${error instanceof Error ? error.message : String(error)}`);
  if (error instanceof Error && error.cause instanceof Error) log(`  cause: ${error.cause.message}`);
  process.exitCode = 1;
}
