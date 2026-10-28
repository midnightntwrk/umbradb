#!/usr/bin/env node
/**
 * The packed-tarball smoke test (`npm run test:smoke`; core-arch task 17.3: LS-1, LS-2, LS-3, LS-6; acceptance A2, A6;
 * `design.md` §12, §13 "Public API pins"). It packs UmbraDB as npm would publish it, installs the tarball in a throwaway
 * consumer project and uses it from there as a user would — never the repository's `src/`.
 *
 *   Without Docker (always run):
 *     1. `npm pack`: the tarball ships `dist/index.d.ts` and the vendored ledger packages — for each ledger version its
 *        `SHA256SUMS`, `upstream.json` and every `pkg/` file the manifest lists, and nothing else of `vendor/` (without
 *        them an installed process refuses or halts once `core-block-parsed` runs: `src/ledger/load.ts` imports them);
 *     1b. nothing of `legacy/` and nothing of TransactionHistory in the tarball (task 17.1: A3, LS-3);
 *     2. the tarball installed in the scratch project;
 *     3. a deep import (`umbradb/dist/runner/process.js`) fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`: `exports` names
 *        only `"."`;
 *     4. a consumer importing every value and every type of §12 (read from `design.md`, as A1's pin reads it) from
 *        "umbradb", none `any`, and writing a configuration with them, type-checks under `--strict` (A2's first file);
 *     4c. a consumer importing any of 0.9.5's retired names — `PgTemporalKV`, `PgCheckpointStore`, `PgWatermarks`,
 *        `PgTransactionLeaseLayer`, `PgWalletStateEnvelopeStore`, `saveAndAdvance` (LS-2) or TransactionHistory's
 *        (LS-3) — fails to type-check, each name reported as not exported (A2's second file);
 *     4b. the installed `umbradb` command (package.json `bin`; LS-6, A6): with no argument and with `sync` it prints the
 *        usage and exits 2; `run`, `backup` and `restore` are recognized (each parses its own arguments or reads its
 *        configuration file); `config check` passes a configuration file that imports §12's builders from "umbradb"
 *        and enables `core-chain-events` and `core-block-parsed`, having run the TypeScript compiler on it.
 *
 *   With Docker:
 *     5. a tape sync on PostgreSQL: a PostgreSQL container (the repository's one image), a tape node serving the browser
 *        tests' synthetic chain (`./tape-node.ts`, run with `tsx`: `tools/tape/` is not in the package), and the
 *        installed `umbradb run` on the same configuration file pointed at both — it commits S = 3 to 9 with
 *        `core-block-parsed` parsing the ledger v9 transactions at 4 and 6 in its ledger worker (the vendored
 *        packages, checked at startup), then exits 0 on SIGTERM.
 *
 * Gating: oracles 1–4 never skip. Oracle 5 needs Docker: in CI (`process.env.CI`) a missing Docker fails the run (a
 * required workflow must never report green having tested nothing); locally only oracle 5 is skipped, with a notice.
 * The two long-running children (the tape node and `umbradb run`) are started with the tests' `spawnChild`
 * (`test/child-processes.ts`, read by Node.js's type stripping), so they end with this script however it ends; the
 * script also ends them itself.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
// Node.js's own TypeScript type stripping reads these three (none imports another file of the repository).
import { spawnChild } from "../child-processes.ts";
import { POSTGRES_IMAGE } from "../postgres-image.ts";
import { section12Surface } from "../library-surface/surface.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const shell = process.platform === "win32";

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell, ...opts });
  return { status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/** A failed oracle: thrown, so that the cleanup below ends every child and the container before the script exits. */
class SmokeFailure extends Error {}

function fail(msg) {
  throw new SmokeFailure(msg);
}

const dockerAvailable = run("docker", ["info", "--format", "{{.ServerVersion}}"]).status === 0;
const isCI = !!process.env.CI && process.env.CI !== "false" && process.env.CI !== "0";

for (const f of ["dist/index.js", "dist/index.d.ts", "dist/cli/main.js"]) {
  if (!existsSync(join(repoRoot, f))) {
    fail(`${f} missing -- run \`npm run build\` first (\`npm run test:smoke\` does this for you).`);
  }
}
const tscBin = join(repoRoot, "node_modules", "typescript", "bin", "tsc");
if (!existsSync(tscBin)) fail(`typescript compiler not found at ${tscBin} -- install the devDependencies first.`);

/** §12's surface, as A1's pin reads it from `design.md`. */
const SURFACE = section12Surface(readFileSync(join(repoRoot, "openspec/changes/core-arch/design.md"), "utf8"));
if (SURFACE.values.length === 0 || SURFACE.types.length === 0) fail("design.md §12 lists no values or no types.");

/** The ledger versions the build carries: each a directory of `vendor/ledger/`. */
const LEDGERS = ["v8", "v9-rc3", "v9"];

/** The retired names whose import must fail: 0.9.5's storage parts (LS-2) and TransactionHistory's (LS-3). */
const RETIRED_VALUES = [
  "PgTemporalKV", "PgCheckpointStore", "PgWatermarks", "PgTransactionLeaseLayer", "PgWalletStateEnvelopeStore",
  "saveAndAdvance", "PgTransactionHistoryStorage",
];
const RETIRED_TYPES = ["TransactionHistoryStorage"];

/** The ledger table of the smoke's `custom` network: every `spec_version` is ledger v9's (the browser tests' chain). */
const LEDGER_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] };

const scratch = mkdtempSync(join(tmpdir(), "umbradb-smoke-"));
const children = new Set();
let container;

/** The configuration file the command checks and runs: §12's builders and two core modules' declarations. */
function configFile({ start, genesis, node, database }) {
  const settings = {
    network: "custom",
    genesisHash: genesis,
    ledgerTable: LEDGER_TABLE,
    database,
    node,
    developmentOptIn: true,
    listen: { admin: "127.0.0.1:0" },
  };
  return [
    'import { CORE_BLOCK_PARSED, CORE_CHAIN_EVENTS, coreEntry, defineConfig } from "umbradb";',
    "",
    "export default defineConfig({",
    "  entries: [",
    `    coreEntry({ start: ${start}, config: ${JSON.stringify(settings)} }),`,
    `    CORE_CHAIN_EVENTS.entry({ start: ${start}, config: {} }),`,
    `    CORE_BLOCK_PARSED.entry({ start: ${start}, config: {} }),`,
    "  ],",
    "});",
    "",
  ].join("\n");
}

/** Oracles 1–4 (see the module comment): no Docker needed. */
async function dockerIndependentOracles() {
  // ---- 1. npm pack: dist/index.d.ts and the vendored ledger packages ship ------------------------------------------
  const pack = run("npm", ["pack", "--json", "--pack-destination", scratch], { cwd: repoRoot });
  if (pack.status !== 0) fail(`npm pack failed:\n${pack.stderr}`);
  let entry;
  try {
    entry = JSON.parse(pack.stdout.slice(pack.stdout.indexOf("[")))[0];
  } catch (e) {
    fail(`could not parse \`npm pack --json\` output: ${String(e)}\n${pack.stdout}`);
  }
  const tarballPath = join(scratch, entry.filename);
  const shipped = (entry.files ?? []).map((f) => f.path);
  if (!shipped.includes("dist/index.d.ts")) fail(`dist/index.d.ts is NOT in the packed tarball. Shipped:\n${shipped.join("\n")}`);
  const vendored = new Set();
  for (const ledger of LEDGERS) {
    const base = `vendor/ledger/${ledger}`;
    const manifest = readFileSync(join(repoRoot, base, "SHA256SUMS"), "utf8").trim().split("\n");
    const expected = [`${base}/SHA256SUMS`, `${base}/upstream.json`, ...manifest.map((line) => `${base}/${line.slice(66)}`)];
    const missing = expected.filter((path) => !shipped.includes(path));
    if (missing.length > 0) {
      fail(`the packed tarball lacks the vendored ledger ${ledger} package's files (src/ledger/load.ts imports them):\n${missing.join("\n")}`);
    }
    for (const path of expected) vendored.add(path);
  }
  const strayVendor = shipped.filter((p) => p.startsWith("vendor/") && !vendored.has(p));
  if (strayVendor.length > 0) fail(`the packed tarball holds vendor/ files beyond the ledger packages:\n${strayVendor.join("\n")}`);
  console.log(`pack-install smoke: packed ${entry.filename}: dist/index.d.ts and the ${vendored.size} files of the vendored ledger packages (${LEDGERS.join(", ")}), nothing else of vendor/.`);

  // ---- 1b. nothing of legacy/ and nothing of TransactionHistory (A3, LS-3) --------------------------------------------
  const kept = shipped.filter(
    (p) => p === "legacy" || p.startsWith("legacy/") || /transaction[-_]?history|tx[-_]?history/i.test(p),
  );
  if (kept.length > 0) fail(`the packed tarball holds files of legacy/ or of TransactionHistory (A3, LS-3):\n${kept.join("\n")}`);
  console.log(`pack-install smoke: no file of legacy/ or of TransactionHistory among the tarball's ${shipped.length} files (A3, LS-3).`);

  // ---- 2. install the tarball in the scratch project -----------------------------------------------------------------
  writeFileSync(
    join(scratch, "package.json"),
    `${JSON.stringify({ name: "umbradb-smoke-consumer", version: "0.0.0", private: true, type: "module" }, null, 2)}\n`,
  );
  const install = run("npm", ["install", tarballPath, "--no-audit", "--no-fund", "--loglevel=error"], { cwd: scratch });
  if (install.status !== 0) fail(`npm install of the tarball failed:\n${install.stderr}`);
  if (!existsSync(join(scratch, "node_modules", "umbradb", "dist", "index.d.ts"))) fail("the installed package is missing dist/index.d.ts.");
  console.log("pack-install smoke: tarball installed in the scratch project.");

  // ---- 3. a deep import fails: exports names only "." ---------------------------------------------------------------
  writeFileSync(
    join(scratch, "deep-import.mjs"),
    [
      "try {",
      "  await import('umbradb/dist/runner/process.js');",
      "  console.error('DEEP_IMPORT_RESOLVED');",
      "  process.exit(5);",
      "} catch (e) {",
      "  if (e && e.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') { console.log('DEEP_IMPORT_BLOCKED'); process.exit(0); }",
      "  console.error('DEEP_IMPORT_WRONG_ERROR ' + (e && e.code) + ' ' + String(e));",
      "  process.exit(6);",
      "}",
      "",
    ].join("\n"),
  );
  const deep = run(process.execPath, ["deep-import.mjs"], { cwd: scratch });
  if (deep.status !== 0 || !deep.stdout.includes("DEEP_IMPORT_BLOCKED")) {
    fail(`the deep import umbradb/dist/runner/process.js was not blocked:\n${deep.stdout}\n${deep.stderr}`);
  }
  console.log("pack-install smoke: the deep import umbradb/dist/runner/process.js is blocked (ERR_PACKAGE_PATH_NOT_EXPORTED).");

  // ---- 4. a consumer of every §12 export type-checks against the installed declarations (A2) ------------------------
  const compilerOptions = {
    module: "nodenext",
    moduleResolution: "nodenext",
    target: "es2022",
    lib: ["es2022"],
    strict: true,
    noImplicitAny: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
  };
  const typeCheck = (name, source) => {
    writeFileSync(join(scratch, `${name}.ts`), source);
    writeFileSync(join(scratch, `tsconfig.${name}.json`), `${JSON.stringify({ compilerOptions, files: [`${name}.ts`] }, null, 2)}\n`);
    const tsc = run(process.execPath, [tscBin, "--noEmit", "--project", `tsconfig.${name}.json`], { cwd: scratch });
    return { status: tsc.status, out: `${tsc.stdout}\n${tsc.stderr}` };
  };
  const consumer = typeCheck("consumer", consumerSource());
  if (consumer.status !== 0 || /error TS\d+/.test(consumer.out)) {
    fail(`a consumer of every §12 export did not type-check against the installed package (A2):\n${consumer.out}`);
  }
  console.log(`pack-install smoke: a consumer importing all ${SURFACE.values.length} values and ${SURFACE.types.length} types of §12 from umbradb type-checks under --strict, none of them any (A2).`);

  // ---- 4c. each retired name fails to type-check (A2, LS-2, LS-3) ----------------------------------------------------
  const retired = typeCheck(
    "retired",
    [
      `import { ${RETIRED_VALUES.join(", ")} } from "umbradb";`,
      `import type { ${RETIRED_TYPES.join(", ")} } from "umbradb";`,
      `export type { ${RETIRED_TYPES.join(", ")} };`,
      `void [${RETIRED_VALUES.join(", ")}];`,
      "",
    ].join("\n"),
  );
  for (const name of [...RETIRED_VALUES, ...RETIRED_TYPES]) {
    if (retired.status === 0 || !new RegExp(`no exported member (named )?'${name}'`).test(retired.out)) {
      fail(`importing ${name} from the installed umbradb did not fail as not exported (A2):\n${retired.out}`);
    }
  }
  console.log(`pack-install smoke: importing any of ${[...RETIRED_VALUES, ...RETIRED_TYPES].join(", ")} from umbradb fails to type-check (A2, LS-2, LS-3).`);

  // ---- 4b. the installed umbradb command (LS-6, A6) ------------------------------------------------------------------
  const umbradb = join(scratch, "node_modules", ".bin", shell ? "umbradb.cmd" : "umbradb");
  if (!existsSync(umbradb)) fail(`the installed package has no umbradb command at ${umbradb} (package.json bin, LS-6).`);
  const command = (args, cwd = scratch) => run(umbradb, args, { cwd });
  for (const args of [[], ["sync"]]) {
    const usage = command(args);
    if (usage.status !== 2 || !usage.stderr.includes("Usage: umbradb <command>") || usage.stdout !== "") {
      fail(`umbradb ${args.join(" ")} did not print the usage and exit 2 (A6):\n${usage.status}\n${usage.stdout}\n${usage.stderr}`);
    }
  }
  const runArguments = command(["run", "--confg", "umbradb.config.ts"]);
  if (runArguments.status !== 2 || !runArguments.stderr.includes("umbradb: unknown option --confg of run")) {
    fail(`umbradb run did not parse its own arguments as a recognized command (A6):\n${runArguments.status}\n${runArguments.stderr}`);
  }
  // backup and restore read their configuration file (none in an empty directory) and write nothing.
  const empty = join(scratch, "empty");
  mkdirSync(empty);
  for (const [name, args] of [["backup", ["backup", "--out", "backup.sql"]], ["restore", ["restore", "backup.sql"]]]) {
    const result = command(args, empty);
    if (result.status !== 1 || !result.stderr.includes(`umbradb ${name}: invalid-configuration: `) || !result.stderr.includes("file-not-found")) {
      fail(`umbradb ${name} was not recognized: it should read its configuration file and exit 1 (A6):\n${result.status}\n${result.stdout}\n${result.stderr}`);
    }
  }
  if (readdirSync(empty).length !== 0) fail(`umbradb backup or restore wrote into a directory without a configuration: ${readdirSync(empty).join(", ")}`);
  writeFileSync(
    join(scratch, "umbradb.config.ts"),
    configFile({
      start: 3,
      genesis: `0x${"11".repeat(32)}`,
      node: "ws://127.0.0.1:9",
      database: { kind: "postgres", host: "127.0.0.1", port: 1, user: "indexer", name: "indexer", ssl: "disable" },
    }),
  );
  checkConfig(command, "a configuration file importing from umbradb");
  console.log("pack-install smoke: the installed umbradb command prints its usage (exit 2), knows run, backup and restore, and config check passes a file importing §12's builders from umbradb (LS-6, A6, A35).");
  return command;
}

/** `umbradb config check umbradb.config.ts` in the scratch project: exit 0, the type check and the validation passed. */
function checkConfig(command, what) {
  const check = command(["config", "check", "umbradb.config.ts"]);
  if (
    check.status !== 0 ||
    !/^type check \(TypeScript \d+\.\d+\.\d+, noEmit\): passed$/m.test(check.stdout) ||
    !check.stdout.includes("configuration (CF-1, CF-3): passed")
  ) {
    fail(`umbradb config check did not pass ${what} (A35, CF-10):\n${check.status}\n${check.stdout}\n${check.stderr}`);
  }
}

/** Starts a child, its output kept; ended in `main`'s cleanup if it is still running. */
function startChild(cmd, args, options) {
  const child = spawnChild(cmd, args, { stdio: ["pipe", "pipe", "pipe"], ...options });
  children.add(child);
  const output = { stdout: "", stderr: "" };
  child.stdout.setEncoding("utf8").on("data", (chunk) => (output.stdout += chunk));
  child.stderr.setEncoding("utf8").on("data", (chunk) => (output.stderr += chunk));
  const exited = new Promise((resolveExit) => child.on("close", (code, signal) => {
    children.delete(child);
    resolveExit(code ?? (signal === null ? -1 : `signal ${signal}`));
  }));
  return { child, output, exited };
}

/** Waits until `ready()` gives a value other than undefined, or fails after `ms` with `what` and `detail()`. */
async function waitFor(what, ms, ready, detail) {
  const deadline = Date.now() + ms;
  for (;;) {
    const value = await ready();
    if (value !== undefined) return value;
    if (Date.now() > deadline) fail(`${what} within ${ms / 1000} s:\n${detail()}`);
    await sleep(100);
  }
}

/** Oracle 5: a tape sync on PostgreSQL in Docker by the installed `umbradb run` (see the module comment). */
async function tapeSyncOracle(command) {
  const { PostgreSqlContainer } = await import("@testcontainers/postgresql");
  const postgres = (await import("postgres")).default;
  container = await new PostgreSqlContainer(POSTGRES_IMAGE)
    .withDatabase("indexer")
    .withUsername("indexer")
    .withPassword("smoke-indexer-pass")
    .start();
  const parts = {
    kind: "postgres",
    host: container.getHost() === "localhost" ? "127.0.0.1" : container.getHost(),
    port: container.getPort(),
    user: "indexer",
    password: "smoke-indexer-pass",
    name: "indexer",
    ssl: "disable",
  };

  const tsx = join(repoRoot, "node_modules", "tsx", "dist", "cli.mjs");
  const tape = startChild(process.execPath, [tsx, "test/smoke/tape-node.ts"], { cwd: repoRoot });
  const chain = await waitFor(
    "the tape node did not start",
    120_000,
    () => {
      const line = tape.output.stdout.split("\n").find((l) => l.startsWith("{"));
      return line === undefined ? undefined : JSON.parse(line);
    },
    () => `${tape.output.stdout}\n${tape.output.stderr}`,
  );

  writeFileSync(join(scratch, "umbradb.config.ts"), configFile({ start: chain.start, genesis: chain.genesis, node: chain.url, database: parts }));
  checkConfig(command, "the tape sync's configuration file");

  const umbradb = join(scratch, "node_modules", ".bin", shell ? "umbradb.cmd" : "umbradb");
  const indexer = startChild(umbradb, ["run", "--config", "umbradb.config.ts"], { cwd: scratch });
  indexer.child.stdin.end();
  const sql = postgres({ host: parts.host, port: parts.port, user: parts.user, password: parts.password, database: parts.name, max: 1, onnotice: () => {} });
  try {
    const log = () => `${indexer.output.stdout}\n${indexer.output.stderr}`;
    let ended = false;
    void indexer.exited.then(() => (ended = true));
    const rows = await waitFor(
      `umbradb run did not commit heights ${chain.start} to ${chain.last} with core-block-parsed`,
      300_000,
      async () => {
        if (ended) fail(`umbradb run ended before it synced the tape:\n${log()}`);
        // A refused start or a halt keeps the process up (its admin endpoints say why) until it is signalled.
        if (/startup refused: |processing halted /.test(indexer.output.stderr)) {
          fail(`umbradb run refused or halted instead of syncing the tape:\n${log()}`);
        }
        try {
          const [cursor] = await sql`SELECT max(height)::int AS height FROM core_block_commit.blocks`;
          if (cursor?.height !== chain.last) return undefined;
          return await sql`SELECT height::int AS height, count(*)::int AS n FROM core_block_parsed.transactions GROUP BY height ORDER BY height`;
        } catch {
          return undefined; // the schemas are not there until the process migrated its database
        }
      },
      log,
    );
    const parsed = rows.map((row) => `${row.height}:${row.n}`).join(" ");
    if (parsed !== "4:2 6:3") {
      fail(`core-block-parsed stored ${parsed || "no transaction"}, not the chain's 2 at 4 and 3 at 6:\n${log()}`);
    }
    indexer.child.kill("SIGTERM");
    const code = await Promise.race([indexer.exited, sleep(60_000).then(() => "no exit within 60 s")]);
    if (code !== 0) fail(`umbradb run did not exit 0 on SIGTERM (${code}):\n${log()}`);
    console.log(`pack-install smoke: the installed umbradb run synced the tape on PostgreSQL (${POSTGRES_IMAGE.split("@")[0]}) from ${chain.start} to ${chain.last}, core-block-parsed storing the ${chain.transactions} ledger v9 transactions (4:2 6:3) through the vendored packages, and exited 0 on SIGTERM.`);
  } finally {
    await sql.end({ timeout: 5 });
    tape.child.stdin.end();
  }
}

/** The consumer of oracle 4: every §12 value and type imported from "umbradb", none `any`, a configuration written. */
function consumerSource() {
  const { values, types } = SURFACE;
  return [
    "// Every value and type of design.md §12, imported from the installed package (A2). If any resolved to `any`,",
    "// NotAny<T> would be [\"UNEXPECTED_ANY\"] and assigning `true` to it would fail to compile.",
    `import { ${values.join(", ")} } from "umbradb";`,
    `import type { ${types.join(", ")} } from "umbradb";`,
    "",
    "type IsAny<T> = 0 extends 1 & T ? true : false;",
    "type NotAny<T> = IsAny<T> extends true ? [\"UNEXPECTED_ANY\"] : true;",
    "",
    ...values.map((name) => `const value_${name}: NotAny<typeof ${name}> = true;`),
    ...types.map((name) => `const type_${name}: NotAny<${name}> = true;`),
    `void [${[...values.map((n) => `value_${n}`), ...types.map((n) => `type_${n}`)].join(", ")}];`,
    "",
    "// A configuration as an operator writes it: the core entry and two core modules' entries.",
    "const config: UmbraConfig = defineConfig({",
    "  entries: [",
    '    coreEntry({ start: 0, config: { network: "preprod", node: "ws://127.0.0.1:9944", database: { kind: "pglite", memory: true } } }),',
    "    CORE_CHAIN_EVENTS.entry({ start: 0, config: {} }),",
    "    CORE_BLOCK_PARSED.entry({ start: 0, config: {} }),",
    "  ],",
    "});",
    "const first: Entry | undefined = config.entries[0];",
    "const version: CoreVersion | string | undefined = first?.version;",
    "const points: readonly PointName[] = POINTS;",
    "const code: ErrorCode = \"invalid-configuration\";",
    "const error: UmbraError = new UmbraError(code, \"a smoke error\");",
    "export { error, points, version };",
    "",
  ].join("\n");
}

async function main() {
  const command = await dockerIndependentOracles();
  if (dockerAvailable) {
    await tapeSyncOracle(command);
    console.log("\npack-install smoke: PASS -- the tarball ships the declarations and the vendored ledger packages; §12 type-checks for a consumer and the retired names do not; the deep import is blocked; the umbradb command runs; the installed process synced a tape on PostgreSQL.");
  } else if (isCI) {
    fail("Docker is REQUIRED in CI but `docker info` failed: the tape sync on PostgreSQL (oracle 5) cannot run and must not be skipped. Oracles 1-4 ran.");
  } else {
    console.log("\npack-install smoke: NOTICE -- Docker absent locally; skipping ONLY the tape sync on PostgreSQL (oracle 5).");
    console.log("pack-install smoke: PASS (oracles 1-4) -- tarball contents, install, deep import, §12 consumer, retired names, the umbradb command.");
  }
}

main()
  .catch((err) => {
    console.error(err instanceof SmokeFailure ? `\npack-install smoke: FAIL -- ${err.message}` : err && err.stack ? err.stack : String(err));
    process.exitCode = 1;
  })
  .finally(async () => {
    for (const child of children) {
      try { child.kill("SIGKILL"); } catch { /* best effort */ }
    }
    try { if (container) await container.stop(); } catch { /* best effort */ }
    try { rmSync(scratch, { recursive: true, force: true }); } catch { /* best effort */ }
    try {
      for (const f of readdirSync(repoRoot)) {
        if (/^umbradb-.*\.tgz$/.test(f)) rmSync(join(repoRoot, f), { force: true });
      }
    } catch { /* best effort */ }
    process.exit();
  });
