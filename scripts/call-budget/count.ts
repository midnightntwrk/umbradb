/**
 * The call budget's counter: how many node calls one sync of a recorded tape makes, per method and per block. It is a
 * measurement for the node call budget work, not a test, and nothing of it is in the required-test manifest.
 *
 * **Usage.**
 *
 *     UMBRADB_TAPES=<tapes directory> node --import tsx scripts/call-budget/count.ts \
 *       --tape <name> [--start <height>] [--stop <height>] [--head <height>] [--ledger on|off] \
 *       [--settings <JSON>] [--json <file>]
 *
 * - `--tape`: a tape of `test/tape/real/manifest.json`, found in `UMBRADB_TAPES` under its file name, its size and
 *   SHA-256 checked.
 * - `--start`: the `core` entry's start; the tape's first height, or that + 1 for a tape that starts mid-chain (its
 *   first block's parent is not on it).
 * - `--stop`: the `core` entry's stop, the last height committed; the tape's last by default.
 * - `--head`: the finalized head the tape node answers (`chain_getFinalizedHead`); `--stop` by default. A head above
 *   the stop shows what the prefetch asks for above the stop.
 * - `--ledger`: whether `core-ledger-state` runs (it asks `midnight_ledgerStateRoot`); on by default for a tape from
 *   genesis, and refused for one that starts mid-chain, whose ledger state at its start is not on the tape.
 * - `--settings`: more `core` settings, as a JSON object (`{"prefetchWindow":128}`).
 * - `--json`: also writes the counts to this file.
 *
 * **What runs.** The real process (`test/backbone/ingest-harness.ts`: `core-chain`, `core-block-fetch` with the node
 * source `umbradb run` uses, `core-block-commit`, `core-digest`), with `core-chain-events`, `core-block-parsed`,
 * `core-tx-results` and, with `--ledger on`, `core-ledger-state`, on PGlite in a temporary directory (`TMPDIR`), against
 * a tape node (`tools/tape/node.ts`) serving the tape. A tape that starts mid-chain gets its network's genesis hash and
 * header first (`test/ledger/fixtures/networks/<network>.json`), which startup asks for. The tape's finalized head is
 * set to `--head` (`cappedAt`). The run ends when the cursor reaches `--stop`; the process is then stopped.
 *
 * **What it prints.** From the tape node's call log: per method, the requests in all, those at a block of
 * `--start`..`--stop`, below `--start`, above `--stop`, and those naming no block on the tape (subscriptions, the
 * finalized head, the chain's properties); and the requests per block (in range ÷ blocks, and all ÷ blocks). A request
 * names a block by its height (`chain_getBlockHash`) or by a hash the tape maps to a height (from its
 * `chain_getBlockHash` answers and its headers). Outcomes other than `answered` and `subscribed` (a `not-on-tape`, a
 * repeat) are listed too.
 *
 * The node client sends single calls only today: one request is one frame, and a retry is a new request, so these are
 * also the frames the node received. Beside the log, the script reads the process's node client's own counts
 * (`NodeClient.calls`, `src/node/counts.ts`, what `/status` shows as `node.calls`) once the run stopped, and prints
 * whether each method's attempts equal the requests the tape node logged for it.
 *
 * Exit codes: 0 when the run reached `--stop`; 1 when it did not; 2 for a usage error.
 */

import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { NodeClient } from "../../src/node/client.js";
import { readTape, type TapeCall, type TapeRecord, tapeId } from "../../tools/tape/index.js";
import { bigintText, committed, ingest } from "../../test/backbone/ingest-harness.js";
import { cappedAt, devnetSettings, LEDGER_CORE } from "../../test/backbone/ledger-restart.js";
import type { FoundTape, RealTape, RealTapeManifest } from "../../test/tape/real/real-tapes.js";

const USAGE =
  "usage: node --import tsx scripts/call-budget/count.ts --tape <name> [--start <h>] [--stop <h>] [--head <h>] " +
  "[--ledger on|off] [--settings <JSON>] [--json <file>]";

/** A sync of 10,000 blocks on a loaded machine. */
const PATIENCE_MS = 3 * 3_600_000;

function usage(message: string): never {
  process.stderr.write(`count.ts: ${message}\n${USAGE}\n`);
  process.exit(2);
}

function height(name: string, text: string | undefined): bigint | undefined {
  if (text === undefined) return undefined;
  if (!/^\d+$/.test(text)) usage(`--${name} is a height: ${text}`);
  return BigInt(text);
}

const { values } = parseArgs({
  options: {
    tape: { type: "string" },
    start: { type: "string" },
    stop: { type: "string" },
    head: { type: "string" },
    ledger: { type: "string" },
    settings: { type: "string" },
    json: { type: "string" },
  },
  strict: true,
});

const name = values.tape ?? usage("--tape is required");
const directory = process.env.UMBRADB_TAPES ?? "";
if (directory === "") usage("set UMBRADB_TAPES to the recorded tapes' directory");

const manifest = JSON.parse(
  readFileSync(new URL("../../test/tape/real/manifest.json", import.meta.url), "utf8"),
) as RealTapeManifest;
const entry = manifest.tapes.find((tape) => tape.name === name) ?? usage(`the manifest has no tape named ${name}`);

/** The tape's file, checked by size and SHA-256 as `findTape` checks it (without its Vitest import). */
function found(tape: RealTape): FoundTape {
  const path = join(directory, tape.file);
  if (statSync(path, { throwIfNoEntry: false })?.size !== tape.bytes) usage(`${path} is absent or not ${tape.bytes} bytes`);
  const bytes = new Uint8Array(readFileSync(path));
  if (tapeId(bytes) !== tape.sha256) usage(`${path} is not the tape's SHA-256 ${tape.sha256}`);
  const read = readTape(bytes);
  return { found: true, tape, path, bytes, read: () => read };
}

const tape = found(entry);
const fromGenesis = entry.from === 0;
const start = height("start", values.start) ?? BigInt(fromGenesis ? entry.from : entry.from + 1);
const stop = height("stop", values.stop) ?? BigInt(entry.to);
const head = height("head", values.head) ?? stop;
if (start < BigInt(entry.from) || stop > BigInt(entry.to) || start > stop) {
  usage(`--start and --stop are within the tape's ${entry.from}..${entry.to}, start ≤ stop`);
}
if (head < stop || head > BigInt(entry.to)) usage(`--head is from --stop to the tape's last height ${entry.to}`);
if (values.ledger !== undefined && values.ledger !== "on" && values.ledger !== "off") usage("--ledger is on or off");
const ledger = (values.ledger ?? (fromGenesis ? "on" : "off")) === "on";
if (ledger && !fromGenesis) usage(`tape ${entry.name} starts mid-chain: its ledger state at ${entry.from} is not on it`);
let extra: Record<string, unknown> = {};
if (values.settings !== undefined) {
  try {
    extra = JSON.parse(values.settings) as Record<string, unknown>;
  } catch {
    usage("--settings is a JSON object");
  }
}

/** The genesis hash's and header's records of `network`, as its node answered them (`delayed-upgrade.test.ts`'s). */
function genesisRecords(network: string): TapeRecord[] {
  const fixture = JSON.parse(
    readFileSync(new URL(`../../test/ledger/fixtures/networks/${network}.json`, import.meta.url), "utf8"),
  ) as { genesis: { hash: string }; calls: TapeRecord[] };
  return fixture.calls.filter(
    (record) =>
      "method" in record &&
      ((record.method === "chain_getBlockHash" && JSON.stringify(record.params) === "[0]") ||
        (record.method === "chain_getHeader" && JSON.stringify(record.params) === JSON.stringify([fixture.genesis.hash]))),
  );
}

const own = tape.read().records;
const records = cappedAt(fromGenesis ? own : [...genesisRecords(entry.network), ...own], head);

/** The height of each block hash the tape names: its `chain_getBlockHash` answers and its headers. */
const heights = new Map<string, bigint>();
for (const record of records) {
  if (!("method" in record) || !("result" in record)) continue;
  const params = (record.params ?? []) as readonly unknown[];
  if (record.method === "chain_getBlockHash" && typeof record.result === "string" && typeof params[0] === "number") {
    heights.set(record.result.toLowerCase(), BigInt(params[0]));
  } else if (record.method === "chain_getHeader" && typeof params[0] === "string") {
    const number = (record.result as { number?: unknown } | null)?.number;
    if (typeof number === "string") heights.set(params[0].toLowerCase(), BigInt(number));
  }
}

/** The block a request names: its height for `chain_getBlockHash`, else the first parameter that is a known hash. */
function blockOf(call: TapeCall): bigint | null {
  const params = Array.isArray(call.params) ? (call.params as readonly unknown[]) : [];
  if (call.method === "chain_getBlockHash") return typeof params[0] === "number" ? BigInt(params[0]) : null;
  for (const param of params) {
    if (typeof param !== "string") continue;
    const known = heights.get(param.toLowerCase());
    if (known !== undefined) return known;
  }
  return null;
}

const core: ModuleDeclaration[] = ledger ? [...LEDGER_CORE] : [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS];
const settings = {
  ...(entry.name.startsWith("devnet-") ? devnetSettings(tape) : { network: entry.network }),
  ...extra,
};

interface Row {
  total: number;
  inRange: number;
  belowStart: number;
  aboveStop: number;
  noBlock: number;
}

const root = mkdtempSync(join(tmpdir(), "umbradb-call-budget-"));
let exitCode = 1;
try {
  const db = { setting: { kind: "pglite" as const, path: join(root, "db") }, query: async () => [] };
  const began = performance.now();
  let client: NodeClient | undefined;
  const run = await ingest(db, records, {
    start,
    stop,
    core,
    settings,
    nodeClient: (options) => (client = new NodeClient(options)),
  });
  let status;
  try {
    await committed(run, stop, PATIENCE_MS);
    exitCode = 0;
  } catch (error) {
    process.stderr.write(`count.ts: ${error instanceof Error ? error.message : String(error)}\n`);
  } finally {
    status = run.handle.status();
    await run.close();
  }
  const seconds = (performance.now() - began) / 1000;
  const calls = run.node.calls;

  const rows = new Map<string, Row>();
  const outcomes = new Map<string, number>();
  for (const call of calls) {
    const method = call.method ?? "(not a request)";
    const row = rows.get(method) ?? { total: 0, inRange: 0, belowStart: 0, aboveStop: 0, noBlock: 0 };
    row.total += 1;
    const block = blockOf(call);
    if (block === null) row.noBlock += 1;
    else if (block < start) row.belowStart += 1;
    else if (block > stop) row.aboveStop += 1;
    else row.inRange += 1;
    rows.set(method, row);
    if (call.outcome !== "answered" && call.outcome !== "subscribed") {
      const key = `${method} ${call.outcome}`;
      outcomes.set(key, (outcomes.get(key) ?? 0) + 1);
    }
  }
  const blocks = Number(stop - start + 1n);
  const sum = (field: keyof Row): number => [...rows.values()].reduce((n, row) => n + row[field], 0);
  const perBlock = (n: number): string => (n / blocks).toFixed(3);
  const sorted = [...rows.entries()].sort(([a, x], [b, y]) => y.total - x.total || a.localeCompare(b));

  const out: string[] = [
    `tape ${entry.name}, heights ${start}..${stop} (${blocks} blocks), finalized head ${head}, ` +
      `core-ledger-state ${ledger ? "on" : "off"}, settings ${JSON.stringify(extra)}`,
    `state ${status.state}, cursor ${status.cursor}, ${calls.length} requests on ${run.node.connections} connection(s), ` +
      `${seconds.toFixed(1)} s`,
    "",
    "| Method | All | In range | Below start | Above stop | No block | In range per block |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const [method, row] of sorted) {
    out.push(
      `| \`${method}\` | ${row.total} | ${row.inRange} | ${row.belowStart} | ${row.aboveStop} | ${row.noBlock} | ${perBlock(row.inRange)} |`,
    );
  }
  out.push(
    `| **Total** | **${sum("total")}** | **${sum("inRange")}** | **${sum("belowStart")}** | **${sum("aboveStop")}** | ` +
      `**${sum("noBlock")}** | **${perBlock(sum("inRange"))}** |`,
    "",
    `All requests per block: ${perBlock(sum("total"))}`,
  );
  if (outcomes.size > 0) {
    out.push(`Outcomes other than answered/subscribed: ${[...outcomes].map(([key, n]) => `${key} ×${n}`).join(", ")}`);
  }
  if (status.reason !== null) out.push(`Reason: ${JSON.stringify(status.reason, bigintText)}`);
  // The client's own counts against the tape node's log: each method's attempts are the requests the node received.
  const counted = client?.calls ?? {};
  const differ = [...new Set([...rows.keys(), ...Object.keys(counted)])].filter(
    (method) => (counted as Record<string, { attempts: number } | undefined>)[method]?.attempts !== rows.get(method)?.total,
  );
  const sumOf = (field: "calls" | "attempts" | "frames"): number =>
    Object.values(counted).reduce((n, counts) => n + (counts?.[field] ?? 0), 0);
  const failures = Object.values(counted).reduce(
    (n, counts) => n + Object.values(counts?.failures ?? {}).reduce((a, b) => a + b, 0),
    0,
  );
  out.push(
    `Node client's counts: ${sumOf("calls")} calls, ${sumOf("attempts")} attempts, ${sumOf("frames")} frames, ` +
      `${failures} failed; attempts ${differ.length === 0 ? "equal the tape node's log for every method" : `differ from the log for ${differ.join(", ")}`}`,
  );
  process.stdout.write(`${out.join("\n")}\n`);

  if (values.json !== undefined) {
    const report = {
      tape: entry.name,
      start: `${start}`,
      stop: `${stop}`,
      head: `${head}`,
      ledger,
      settings: extra,
      blocks,
      state: status.state,
      cursor: status.cursor === null ? null : `${status.cursor}`,
      connections: run.node.connections,
      seconds,
      methods: Object.fromEntries(sorted),
      outcomes: Object.fromEntries(outcomes),
      client: counted,
    };
    writeFileSync(values.json, `${JSON.stringify(report, null, 2)}\n`);
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
process.exit(exitCode);
