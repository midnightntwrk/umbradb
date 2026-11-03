import { createHash } from "node:crypto";
import fc from "fast-check";
import { z } from "zod";
import { cursorHeight } from "../../src/backbone/core-block-commit/sql.js";
import { LEDGER_NODE_TABLES } from "../../src/backbone/core-ledger-state/node-set.js";
import type { ReadHandle } from "../../src/db/api.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { contentsHash, contentsHashOf } from "../../src/library/contents-hash.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory, type Keeping } from "../ledger/fixtures/sweep-test-loader.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { contentDefinedLedgerState } from "./content-defined-build.js";
import { bigintText, committed, ingest, PATIENCE_MS, until } from "./ingest-harness.js";
import { cappedAt, LEDGER_CORE, recordingLoads, restartAt, type SeenLoad } from "./ledger-restart.js";
import { nodeSet } from "./refcount-model.js";
import { type DagRun, runDag } from "./refcount-process.js";
import type { TableSnapshot } from "./sweep-tapes.js";

/**
 * Runs of one chain with different worker histories, and what they hold after every block, for the determinism tests
 * across worker histories. Imports nothing of Vitest. [R28, DT-3, LG-11; design §4.4]
 *
 * - A run is one or more segments, each a new UmbraDB process with a new ledger worker thread, the first from genesis
 *   and each later one from the cursor the one before stopped at, so a restarted segment reads back only the database:
 *   on the DAG fixture through `./refcount-process.ts` (`runDag`, its test package told how to keep nodes), on a
 *   recorded tape through `./ingest-harness.ts` with the ledger's core modules and the real packages, the two runs of
 *   a tape side by side ({@link tapeDeterminism}).
 * - A user module ({@link historyWatcher}) records, at each height's `on-compute`, what the database holds after the
 *   block before ({@link historyFacets}); the last height is read from outside once the process stopped
 *   ({@link readStopped}). Each block's rows are read as `key:md5(children)`, and a row's child list is read and
 *   parsed once per run for each child list it has ({@link NodeSetCache}).
 * - {@link historyDifferences} lists the heights at which two runs differ in what they must agree on: the node set,
 *   `root_counts`, the rows of `states`, `segment_results` and `events`, `core_digest.tables` and the contents hash.
 *   The rows of `nodes` (their child lists) may differ, which is what the runs show.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const sha = (text: string): string => createHash("sha256").update(text).digest("hex");

/** What a run holds after a block, each part as text (a digest where it is long), by the name of what it is. */
export type Facets = ReadonlyMap<string, string>;

/** The facet of the contents hash with `nodes` taken by its raw rows: only what the negative control compares. */
export const RAW_HASH = "contents hash, nodes by their raw rows";

/** The facet of the rows of `nodes` with their child lists: allowed to differ between worker histories. */
export const NODE_ROWS = "nodes";

/** The contents hash with `nodes` taken by its raw rows, `ref_counts` and `unreferenced` still checked (DT-3 before). */
const rawHash = contentsHashOf([
  contentDefinedLedgerState({ contentDefined: { tables: ["ref_counts", "unreferenced"], content: LEDGER_NODE_TABLES.content } }),
]);

/** What {@link historyFacets} takes beyond what it always takes. */
export interface FacetOptions {
  /** The contents hash, as UmbraDB computes it (`contentsHash`). */
  readonly hash?: boolean;
  /** Also the contents hash with `nodes` taken by its raw rows ({@link RAW_HASH}). */
  readonly raw?: boolean;
  /** Also every row of `states`, `segment_results` and `events`, not only those of the height. */
  readonly whole?: boolean;
}

/** The tables of `core_ledger_state` keyed by height first, whose rows R28 compares. */
const HEIGHT_TABLES = ["states", "segment_results", "events"] as const;

/**
 * The keys each stored row gives the node set (its own and its embedded nodes'), by `key:md5(children)`: a row is
 * parsed once per child list, so a run reads every row's child list only when it is new or changed.
 */
export type NodeSetCache = Map<string, readonly string[]>;

/** Every row of `nodes` as `key:md5(children)`, in key order, one text. */
const NODE_ROWS_SQL = `SELECT coalesce(string_agg(encode(node_key, 'hex') || ':' || md5(children), ',' ORDER BY node_key), '') AS rows
  FROM core_ledger_state.nodes`;

const CHILDREN_SQL = "SELECT encode(node_key, 'hex') AS k, children FROM core_ledger_state.nodes WHERE node_key = ANY($1::bytea[])";

/** `root_counts` and `core_digest.tables` whole, and the rows the height wrote in each of {@link HEIGHT_TABLES}. */
const PARTS_SQL = `SELECT
  (SELECT count(*)::text || ' rows ' || md5(coalesce(string_agg(encode(node_key, 'hex') || ':' || count, ',' ORDER BY node_key), ''))
     FROM core_ledger_state.root_counts) AS root_counts,
  (SELECT count(*)::text || ' rows ' || md5(coalesce(string_agg("schema" || '.' || "table" || '@' || height || ':' || encode(digest, 'hex'), ','
     ORDER BY "schema", "table"), '')) FROM core_digest.tables) AS digests,
  ${HEIGHT_TABLES.map((table) => `(SELECT count(*)::text || ' rows ' || md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), ''))
     FROM core_ledger_state.${table} r WHERE height = $1) AS ${table}`).join(",\n  ")}`;

/** Every row of each of {@link HEIGHT_TABLES}. */
const WHOLE_SQL = `SELECT
  ${HEIGHT_TABLES.map((table) => `(SELECT count(*)::text || ' rows ' || md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), ''))
     FROM core_ledger_state.${table} r) AS ${table}`).join(",\n  ")}`;

/** The node set `read` sees (sorted hex keys) and a digest of its `nodes` rows, the rows parsed through `cache`. */
async function nodeSetOf(read: Pick<ReadHandle, "query">, cache: NodeSetCache): Promise<{ readonly set: string[]; readonly rows: string }> {
  const [summary] = await read.query(NODE_ROWS_SQL);
  const text = (summary?.rows as string | undefined) ?? "";
  const entries = text === "" ? [] : text.split(",");
  const missing = entries.filter((entry) => !cache.has(entry));
  if (missing.length > 0) {
    const fetched = await read.query(CHILDREN_SQL, [missing.map((entry) => Uint8Array.from(Buffer.from(entry.slice(0, 64), "hex")))]);
    for (const row of fetched) {
      const children = Uint8Array.from(row.children as Uint8Array);
      const key = row.k as string;
      cache.set(`${key}:${createHash("md5").update(children).digest("hex")}`, [...nodeSet([[key, children]])]);
    }
  }
  const set = new Set<string>();
  for (const entry of entries) {
    const keys = cache.get(entry);
    if (keys === undefined) throw new Error(`the stored row ${entry} was not read back with that child list`);
    for (const key of keys) set.add(key);
  }
  return { set: [...set].sort(), rows: `${entries.length} rows ${sha(text)}` };
}

/**
 * What the database `read` sees holds after block `height`: the node set (its size and a digest of its keys, rows and
 * embedded nodes), the rows of `nodes` with their child lists ({@link NODE_ROWS}), `root_counts`, the rows `height`
 * wrote in `states`, `segment_results` and `events`, and `core_digest.tables` (each captured table's digest, chained
 * over every block, so equal digests mean equal changes at every block); with `options`, the contents hashes and every
 * row of the three tables. Rows are parsed through `cache`, one per run. [R28, DT-3, DT-5]
 */
export async function historyFacets(
  read: Pick<ReadHandle, "query">,
  height: bigint,
  options: FacetOptions = {},
  cache: NodeSetCache = new Map(),
): Promise<Map<string, string>> {
  const facets = new Map<string, string>();
  const { set, rows } = await nodeSetOf(read, cache);
  facets.set("node set", `${set.length} keys ${sha(set.join(","))}`);
  facets.set(NODE_ROWS, rows);
  const [parts] = await read.query(PARTS_SQL, [height]);
  facets.set("root_counts", parts?.root_counts as string);
  facets.set("core_digest.tables", parts?.digests as string);
  for (const table of HEIGHT_TABLES) facets.set(`${table} at the height`, parts?.[table] as string);
  if (options.whole === true) {
    const [whole] = await read.query(WHOLE_SQL);
    for (const table of HEIGHT_TABLES) facets.set(`${table}, every row`, whole?.[table] as string);
  }
  if (options.hash === true) facets.set("contents hash", hex(await contentsHash(read)));
  if (options.raw === true) facets.set(RAW_HASH, hex(await rawHash(read)));
  return facets;
}

/**
 * A user module requiring `ledger-state` that records, at each height h's `on-compute`, what the database holds after
 * h − 1 ({@link historyFacets} with `options(h − 1)`, its rows parsed through `cache`), in `seen`. [R28]
 */
export function historyWatcher(
  seen: Map<bigint, Facets>,
  options: (height: bigint) => FacetOptions,
  cache: NodeSetCache = new Map(),
): ModuleDeclaration {
  return {
    id: "history-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "history-watch-rows", lifetimes: ["table"], table: { schema: "history_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE history_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height > 0n) seen.set(b.height - 1n, await historyFacets(read, b.height - 1n, options(b.height - 1n), cache));
      },
    },
  };
}

/** Runs `body` on a read of `db` through the database API, once no process holds it (PGlite's directory included). */
export async function readStopped<T>(db: ProcessDatabase, body: (read: ReadHandle) => Promise<T>): Promise<T> {
  const setting = db.setting;
  let database;
  if (setting.kind === "postgres") {
    const { kind: _kind, ...connection } = setting;
    database = await openPostgres({ connection, committedHeight: cursorHeight });
  } else {
    if (db.directory === undefined) throw new Error("a PGlite database of the process tests has a directory");
    database = await openPglite({ dataDir: db.directory, committedHeight: cursorHeight, developmentOptIn: true });
  }
  try {
    return await database.read(body);
  } finally {
    await database.close();
  }
}

/**
 * The heights at which `got` differs from `want` in `names` (every facet but the rows of `nodes` and the raw contents
 * hash unless given), each with what differs; a height one of them lacks is a difference too. [R28]
 */
export function historyDifferences(got: ReadonlyMap<bigint, Facets>, want: ReadonlyMap<bigint, Facets>, names?: readonly string[]): string[] {
  const problems: string[] = [];
  for (const [height, expected] of [...want].sort(([a], [b]) => (a < b ? -1 : 1))) {
    const have = got.get(height);
    if (have === undefined) {
      problems.push(`after ${height}: nothing recorded`);
      continue;
    }
    const compared = names ?? [...new Set([...expected.keys(), ...have.keys()])].filter((name) => name !== NODE_ROWS && name !== RAW_HASH);
    const differing = compared.filter((name) => have.get(name) !== expected.get(name));
    if (differing.length > 0) problems.push(`after ${height}: ${differing.join(", ")} differ`);
  }
  for (const height of got.keys()) if (!want.has(height)) problems.push(`after ${height}: recorded in one run only`);
  return problems;
}

/**
 * `count` distinct heights from `from` to `to`, drawn uniformly with fast-check from `seed` (without its bias towards
 * the bounds), in order. [R28]
 */
export function seededHeights(seed: number, count: number, from: number, to: number): bigint[] {
  const heights = fc.uniqueArray(fc.noBias(fc.integer({ min: from, max: to })), { minLength: count, maxLength: count });
  const [drawn] = fc.sample(fc.noBias(heights), { seed, numRuns: 1 });
  if (drawn === undefined) throw new Error("fast-check drew no heights");
  return [...drawn].sort((a, b) => a - b).map(BigInt);
}

// ── The DAG fixture ────────────────────────────────────────────────────────────────────────────────────────────────

/** What a run of the extended DAG gave, its segments joined. */
export interface DagHistory {
  /** Each segment's run, in order: one for a run that never restarts. */
  readonly runs: readonly DagRun[];
  /** What the database held after every height, contents hashes (both) and every row included. */
  readonly facets: Map<bigint, Facets>;
  /** `core_ledger_state`'s tables after every height, and every block's batch (`./sweep-tapes.ts`). */
  readonly tables: Map<bigint, TableSnapshot>;
  readonly batches: Map<bigint, NodeBatch>;
  /** The test package's counters over every thread of every segment, by {@link COUNTERS}' names. */
  readonly counters: Readonly<Record<keyof typeof COUNTERS, number>>;
}

/** What the DAG fixture's runs record after every height: everything, both contents hashes included. */
const DAG_FACETS: FacetOptions = { hash: true, raw: true, whole: true };

/**
 * Runs the extended DAG fixture on `db` with its test package keeping nodes as `keeping` says, from genesis to its
 * last height, a new process (and worker thread) started at each cursor of `restarts`: each segment stops once it
 * committed its cursor, and the next starts there. [R28, A105]
 */
export async function dagHistory(db: ProcessDatabase, keeping: Keeping, restarts: readonly number[] = []): Promise<DagHistory> {
  const memory = countersMemory();
  const facets = new Map<bigint, Facets>();
  const cache: NodeSetCache = new Map();
  const tables = new Map<bigint, TableSnapshot>();
  const batches = new Map<bigint, NodeBatch>();
  const runs: DagRun[] = [];
  let resume: bigint | undefined;
  for (const last of [...restarts, LAST]) {
    const run = await runDag(db, {
      dag: "extended",
      data: { keeping, counters: memory },
      last,
      user: [historyWatcher(facets, () => DAG_FACETS, cache)],
      ...(resume === undefined ? {} : { resume }),
    });
    runs.push(run);
    for (const [height, snapshot] of run.tables) tables.set(height, snapshot);
    for (const [height, batch] of run.batches) batches.set(height, batch);
    if (run.cursor !== BigInt(last)) break;
    resume = run.cursor;
  }
  const end = (runs.at(-1) as DagRun).cursor;
  facets.set(end, await readStopped(db, (read) => historyFacets(read, end, DAG_FACETS, cache)));
  const shared = new Int32Array(memory);
  const counters = Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
  return { runs, facets, tables, batches, counters };
}

// ── The recorded tapes ─────────────────────────────────────────────────────────────────────────────────────────────

/** What a run of a recorded tape is given. */
export interface TapeHistoryOptions {
  /** The range's last height, at which the records' finalized head is capped. */
  readonly to: bigint;
  /** The `core` settings of the tape's network. */
  readonly settings: Readonly<Record<string, unknown>>;
  /** The cursors at which the run stops and a new process starts; none for a run that never restarts. */
  readonly restarts: readonly bigint[];
  /** Whether the contents hash and every row of the height-keyed tables are taken after `height`. */
  readonly whole: (height: bigint) => boolean;
  /** How long one segment may take. */
  readonly patience?: number;
  /** Called once the first segment's process has started and committed a block (its roles and schemas set up). */
  readonly started?: () => void;
}

/** What a run of a recorded tape gave. */
export interface TapeHistory {
  /** Each segment's cursor and halt reason when it stopped. */
  readonly stops: readonly { readonly cursor: bigint | null; readonly reason: unknown }[];
  /** What the database held after every height. */
  readonly facets: Map<bigint, Facets>;
  /** Every state each segment's ledger worker was asked to load, and whether it read it from the database. */
  readonly loads: readonly SeenLoad[];
}

/**
 * Runs `records` (a recorded tape, its finalized head capped at `options.to`) on `db` from genesis with the ledger's
 * core modules and the real packages, a new process (and worker thread) started at each cursor of `options.restarts`:
 * each segment's records cap the finalized head at its stop, and a later segment's also answer the restart's startup
 * calls at its cursor (`./ledger-restart.ts`). [R28, LG-11]
 */
export async function tapeHistory(db: ProcessDatabase, records: readonly TapeRecord[], options: TapeHistoryOptions): Promise<TapeHistory> {
  const facets = new Map<bigint, Facets>();
  const cache: NodeSetCache = new Map();
  const loads: SeenLoad[] = [];
  const stops: { cursor: bigint | null; reason: unknown }[] = [];
  const of = (height: bigint): FacetOptions => (options.whole(height) ? { hash: true, whole: true } : {});
  let resume: bigint | undefined;
  for (const stop of [...options.restarts, options.to]) {
    const capped = stop === options.to ? records : cappedAt(records, stop);
    const process = await ingest(db, resume === undefined ? capped : restartAt(capped, resume), {
      start: 0n,
      core: LEDGER_CORE,
      settings: options.settings,
      user: [historyWatcher(facets, of, cache)],
      ledgerWorker: () => recordingLoads(startLedgerWorker(), loads),
    });
    try {
      if (resume === undefined) {
        await until(process, () => process.handle.status().cursor !== null, "a committed block", options.patience ?? PATIENCE_MS * 4);
        options.started?.();
      }
      await committed(process, stop, options.patience ?? PATIENCE_MS * 4);
    } finally {
      const status = process.handle.status();
      stops.push({ cursor: status.cursor, reason: status.reason });
      await process.close();
    }
    resume = stop;
  }
  facets.set(options.to, await readStopped(db, (read) => historyFacets(read, options.to, of(options.to), cache)));
  return { stops, facets, loads };
}

/** What {@link tapeDeterminism} is given. */
export interface TapeDeterminismOptions {
  /** The range's last height and the `core` settings of the tape's network. */
  readonly to: bigint;
  readonly settings: Readonly<Record<string, unknown>>;
  /** The seed the 20 restart heights are drawn from (1 to `to` − 1). */
  readonly seed: number;
  /** Whether the contents hash and every row of the height-keyed tables are taken after `height`, given the restarts. */
  readonly whole: (height: bigint, restarts: readonly bigint[]) => boolean;
  readonly patience?: number;
}

/** What {@link tapeDeterminism} gave: both runs, the restart heights, and the heights taken whole. */
export interface TapeDeterminism {
  readonly never: TapeHistory;
  readonly restarted: TapeHistory;
  readonly restarts: readonly bigint[];
  readonly whole: (height: bigint) => boolean;
}

/**
 * R28's two runs of a recorded tape on two new databases of `database`: one that never restarts and one restarted at
 * 20 heights drawn from `options.seed`, side by side (each process with its own tape node, database and worker
 * thread). The second starts once the first has committed a block: two first startups at once on one PostgreSQL server
 * race on creating its module roles, which belong to the server. Both settle before either's failure is thrown. [R28]
 */
export async function tapeDeterminism(
  database: () => Promise<ProcessDatabase>,
  records: readonly TapeRecord[],
  options: TapeDeterminismOptions,
): Promise<TapeDeterminism> {
  const restarts = seededHeights(options.seed, 20, 1, Number(options.to) - 1);
  const whole = (height: bigint): boolean => options.whole(height, restarts);
  const base = { to: options.to, settings: options.settings, whole, ...(options.patience === undefined ? {} : { patience: options.patience }) };
  let release = (): void => undefined;
  const started = new Promise<void>((resolve) => (release = resolve));
  const first = database().then((db) => tapeHistory(db, records, { ...base, restarts: [], started: () => release() }));
  first.then(release, release);
  const [never, restarted] = await Promise.allSettled([
    first,
    started.then(() => database()).then((db) => tapeHistory(db, records, { ...base, restarts })),
  ]);
  if (never.status === "rejected") throw never.reason;
  if (restarted.status === "rejected") throw restarted.reason;
  return { never: never.value, restarted: restarted.value, restarts, whole };
}

/**
 * What is wrong with one run of a recorded tape, none when it ran as asked: a segment that did not stop at its cursor
 * or halted; a load from the database other than one at each restart's cursor; a height from 0 to `options.to` with
 * nothing recorded; the contents hash taken at another height than those `options.whole` names. [R28]
 */
export function tapeRunProblems(run: TapeHistory, options: Pick<TapeHistoryOptions, "to" | "restarts" | "whole">): string[] {
  const problems: string[] = [];
  const stops = [...options.restarts, options.to];
  run.stops.forEach((stop, i) => {
    if (stop.cursor !== stops[i] || stop.reason !== null) {
      problems.push(`segment ${i} stopped at ${stop.cursor} (${JSON.stringify(stop.reason, bigintText)}), not at ${stops[i]}`);
    }
  });
  if (run.stops.length !== stops.length) problems.push(`${run.stops.length} segments ran, not ${stops.length}`);
  const read = run.loads.filter((load) => load.loaded).map((load) => load.height);
  if (read.join(",") !== options.restarts.join(",")) problems.push(`states loaded from the database at ${read.join(",") || "no height"}, not at ${options.restarts.join(",") || "no height"}`);
  for (let height = 0n; height <= options.to; height++) {
    const facets = run.facets.get(height);
    if (facets === undefined) problems.push(`after ${height}: nothing recorded`);
    else if (facets.has("contents hash") !== options.whole(height)) problems.push(`after ${height}: the contents hash ${facets.has("contents hash") ? "taken" : "not taken"}`);
  }
  return problems;
}
