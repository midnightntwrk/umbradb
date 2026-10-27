import { z } from "zod";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { ApplyOutput, LedgerEvent, TransactionResult, VmLog } from "../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessStatus } from "../../src/runner/process.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { hex } from "./fetch-fixtures.js";
import type { LedgerScenario } from "./ledger-tapes.js";

/**
 * The oracles of task 12.3's criteria (A82, A99, A106, A107), shared by `ledger-state.test.ts` and its negative
 * controls: each reads the database after a process ran a scenario (`./ledger-tapes.ts`) and lists what differs from
 * what the scenario's chain and its replay hold — empty when the criterion holds. Imports nothing of Vitest.
 */

const text = (value: unknown): string => JSON.stringify(value, (_key, v: unknown) => (typeof v === "bigint" ? `${v}n` : v));
const plainHex = (bytes: Uint8Array | null): string | null => (bytes === null ? null : Buffer.from(bytes).toString("hex"));

/** What the ledger items watcher saw at each height's `on-compute`: `core-ledger-state`'s `block` items. */
export interface LedgerItemsSeen {
  readonly state: Map<bigint, Record<string, unknown>>;
  readonly events: Map<bigint, readonly LedgerEvent[]>;
  readonly segments: Map<bigint, readonly TransactionResult[]>;
  readonly logs: Map<bigint, readonly VmLog[]>;
}

export function ledgerItemsSeen(): LedgerItemsSeen {
  return { state: new Map(), events: new Map(), segments: new Map(), logs: new Map() };
}

/** A user module requiring `core-ledger-state`'s four items and recording them at `on-compute` (LG-16). */
export function ledgerItemsWatcher(seen: LedgerItemsSeen): ModuleDeclaration {
  return {
    id: "ledger-watch",
    version: "1.0.0",
    side: "public",
    requires: ["ledger-state", "ledger-events", "segment-results", "vm-logs"],
    provides: [{ name: "ledger-watch-rows", lifetimes: ["table"], table: { schema: "ledger_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE ledger_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b) {
        seen.state.set(b.height, b.items.get("ledger-state") as Record<string, unknown>);
        seen.events.set(b.height, b.items.get("ledger-events") as readonly LedgerEvent[]);
        seen.segments.set(b.height, b.items.get("segment-results") as readonly TransactionResult[]);
        seen.logs.set(b.height, b.items.get("vm-logs") as readonly VmLog[]);
      },
    },
  };
}

/** The `states` rows LG-16 holds for `scenario`'s heights up to `through`. */
function expectedStates(scenario: LedgerScenario, through: bigint): string[] {
  return scenario.heights
    .filter((h) => h.height <= through)
    .map((h) =>
      text({
        height: `${h.height}`,
        state_key: plainHex(h.stateKey),
        state_root: plainHex(h.root),
        zswap_first_free: `${h.zswapFirstFree}`,
        zswap_root: null,
        dust_commitment_first_free: null,
        dust_commitment_root: null,
        dust_generation_first_free: null,
        dust_generation_root: null,
      }),
    );
}

/** The `segment_results` rows of one block's output. */
function segmentRows(height: bigint, output: ApplyOutput): string[] {
  return output.results.flatMap((result, tx) =>
    result.segments.map((s) => text({ height: `${height}`, tx_index: `${tx}`, segment: s.segment, success: s.success })),
  );
}

/** The `events` rows of one block's output: each transaction's events numbered from 0 in emission order. */
function eventRows(height: bigint, output: ApplyOutput): string[] {
  const numbers = new Map<number, number>();
  return output.events.map((event) => {
    const index = numbers.get(event.transaction) ?? 0;
    numbers.set(event.transaction, index + 1);
    return text({
      height: `${height}`,
      tx_index: `${event.transaction}`,
      event_index: `${index}`,
      kind: event.kind,
      logical_segment: event.logicalSegment,
      physical_segment: event.physicalSegment,
      bytes: plainHex(event.bytes),
      nullifier: plainHex(event.nullifier),
      commitment: plainHex(event.commitment),
      tree_index: event.treeIndex === null ? null : `${event.treeIndex}`,
      contract_address: plainHex(event.contractAddress),
    });
  });
}

const STATES_SQL = `SELECT height::text, encode(state_key, 'hex') AS state_key, encode(state_root, 'hex') AS state_root,
  zswap_first_free::text, encode(zswap_root, 'hex') AS zswap_root, dust_commitment_first_free::text,
  encode(dust_commitment_root, 'hex') AS dust_commitment_root, dust_generation_first_free::text,
  encode(dust_generation_root, 'hex') AS dust_generation_root
  FROM core_ledger_state.states ORDER BY height`;
const SEGMENTS_SQL = `SELECT height::text, tx_index::text, segment, success FROM core_ledger_state.segment_results
  ORDER BY height, tx_index, segment`;
const EVENTS_SQL = `SELECT height::text, tx_index::text, event_index::text, kind, logical_segment, physical_segment,
  encode(bytes, 'hex') AS bytes, encode(nullifier, 'hex') AS nullifier, encode(commitment, 'hex') AS commitment,
  tree_index::text, encode(contract_address, 'hex') AS contract_address
  FROM core_ledger_state.events ORDER BY height, tx_index, event_index`;

/** Compares two lists of rows, naming each one missing or unexpected. */
function rowProblems(table: string, actual: string[], expected: string[]): string[] {
  const problems: string[] = [];
  if (text(actual) === text(expected)) return problems;
  for (const row of expected) if (!actual.includes(row)) problems.push(`${table} lacks ${row}`);
  for (const row of actual) if (!expected.includes(row)) problems.push(`${table} holds ${row}, not expected`);
  if (problems.length === 0) problems.push(`${table}'s rows are out of order`);
  return problems;
}

/**
 * A107 (LG-16): `core_ledger_state.states`, `segment_results` and `events` hold, for every height of `scenario` up to
 * `through`, the state's key, its root — the node's — and zswap first free index (the five tree values the packages
 * do not export null, decision record question Q138), each segment's success and each ledger event but logs with
 * its kind, segments, bytes and extracted fields, as the test's adapter gave them; and the reference replay agrees on
 * every transaction's outcome.
 */
export async function a107Problems(db: ProcessDatabase, scenario: LedgerScenario, through: bigint = scenario.head): Promise<string[]> {
  const heights = scenario.heights.filter((h) => h.height <= through);
  const states = (await db.query(STATES_SQL)).map(text);
  const segments = (await db.query(SEGMENTS_SQL)).map((row) => text({ ...row, segment: Number(row.segment) }));
  const events = (await db.query(EVENTS_SQL)).map((row) =>
    text({ ...row, logical_segment: Number(row.logical_segment), physical_segment: Number(row.physical_segment) }),
  );
  const problems = [
    ...rowProblems("core_ledger_state.states", states, expectedStates(scenario, through)),
    ...rowProblems("core_ledger_state.segment_results", segments, heights.flatMap((h) => segmentRows(h.height, h.output))),
    ...rowProblems("core_ledger_state.events", events, heights.flatMap((h) => eventRows(h.height, h.output))),
  ];
  // The reference replay's account of each transaction (the packages' own API) against the outcome stored.
  const outcomeOf = (type: string): string =>
    type === "partialSuccess" ? "partial" : type === "success" || type === "system" ? "success" : "failure";
  for (const h of heights) {
    const outcomes = h.output.results.map((r) => r.outcome);
    const reference = h.types.map(outcomeOf);
    if (text(outcomes) !== text(reference)) problems.push(`height ${h.height}: outcomes ${text(outcomes)}, the reference replay's ${text(reference)}`);
  }
  return problems;
}

/**
 * A99 (LG-8, LG-15): the process reached `scenario`'s head without halting, and every height's stored root is the
 * node's (`midnight_ledgerStateRoot`, the tape's answer); `status` is the process's, read before it was stopped.
 */
export async function a99Problems(db: ProcessDatabase, status: ProcessStatus, scenario: LedgerScenario): Promise<string[]> {
  const problems: string[] = [];
  if (status.reason !== null) problems.push(`the process ${status.state} with ${text(status.reason)}`);
  if (status.cursor !== scenario.head) problems.push(`the cursor is ${status.cursor}, not ${scenario.head}`);
  const roots = await db.query("SELECT height::text, encode(state_root, 'hex') AS root FROM core_ledger_state.states ORDER BY height");
  const expected = scenario.heights.map((h) => text({ height: `${h.height}`, root: plainHex(h.root) }));
  problems.push(...rowProblems("the stored roots", roots.map(text), expected));
  return problems;
}

/**
 * The node keys the keys `rootsSql` selects reach through the stored nodes (a walk of `childRefKeys`): every stored
 * state's unless given.
 */
async function reachableNodes(
  db: ProcessDatabase,
  rootsSql = "SELECT encode(state_key, 'hex') AS k FROM core_ledger_state.states",
): Promise<{ reached: Set<string>; stored: Set<string>; missing: string[] }> {
  const nodes = new Map(
    (await db.query("SELECT encode(node_key, 'hex') AS k, encode(children, 'hex') AS c FROM core_ledger_state.nodes")).map((row) => [
      row.k as string,
      Uint8Array.from(Buffer.from(row.c as string, "hex")),
    ]),
  );
  const roots = (await db.query(rootsSql)).map((row) => row.k as string);
  const reached = new Set<string>();
  const missing: string[] = [];
  const frontier = [...roots];
  while (frontier.length > 0) {
    const key = frontier.pop() as string;
    if (reached.has(key)) continue;
    reached.add(key);
    const children = nodes.get(key);
    if (children === undefined) {
      missing.push(key);
      continue;
    }
    for (const ref of childRefKeys(children)) frontier.push(Buffer.from(ref).toString("hex"));
  }
  return { reached, stored: new Set(nodes.keys()), missing };
}

/**
 * LG-11 and LG-14 as the ledger's tables hold them: every node the held keys (`root_counts`) reach is stored — the
 * sweep (task 12.5) deletes only what no held key reaches, so the nodes of released states may be gone —, no stored node
 * is reached by no stored state (nothing but the states' nodes is written: this holds between cycles, and with K at
 * its default every cycle of these tests' small states completes within its block, so it holds after each of theirs),
 * and the root counts are the latest state's key at 1 (the state before it released, `retainStates` 0).
 */
export async function nodeProblems(db: ProcessDatabase): Promise<string[]> {
  const problems: string[] = [];
  const { missing } = await reachableNodes(db, "SELECT encode(node_key, 'hex') AS k FROM core_ledger_state.root_counts");
  for (const key of missing) problems.push(`node ${key} is reached by a held key but not stored`);
  const { reached, stored } = await reachableNodes(db);
  for (const key of stored) if (!reached.has(key)) problems.push(`node ${key} is stored but no stored state reaches it`);
  const counts = (await db.query("SELECT encode(node_key, 'hex') AS k, count FROM core_ledger_state.root_counts")).map((row) => text({ k: row.k, count: Number(row.count) }));
  const [latest] = await db.query("SELECT encode(state_key, 'hex') AS k FROM core_ledger_state.states ORDER BY height DESC LIMIT 1");
  const expected = latest === undefined ? [] : [text({ k: latest.k, count: 1 })];
  if (text(counts) !== text(expected)) problems.push(`core_ledger_state.root_counts holds ${text(counts)}, not ${text(expected)}`);
  return problems;
}

/** The tables holding a row per height, with each one's height column. */
const PER_HEIGHT = [
  "core_block_commit.blocks",
  "core_chain_events.events",
  "core_block_parsed.transactions",
  "core_tx_results.results",
  "core_ledger_state.states",
  "core_ledger_state.segment_results",
  "core_ledger_state.events",
] as const;

/**
 * A106 (LG-15): with a package whose root is wrong at `bad`, the process halted there with `root-mismatch`, in
 * `core-ledger-state`'s `on-compute`, and stored nothing of the block: no row at `bad` in any table, the cursor at
 * `bad` − 1, no node but those the states up to it reach, and the root counts as `bad` − 1 left them; `status` is the
 * process's, read before it was stopped.
 */
export async function a106Problems(db: ProcessDatabase, status: ProcessStatus, bad: bigint): Promise<string[]> {
  const problems: string[] = [];
  const reason = status.reason === null ? null : { ...status.reason };
  const expected = { code: "root-mismatch", height: bad, module: "core-ledger-state", point: "on-compute" };
  if (status.state !== "halted") problems.push(`the process is ${status.state}, not halted`);
  if (text(reason) !== text(expected)) problems.push(`the reason is ${text(reason)}, not ${text(expected)}`);
  if (status.cursor !== bad - 1n) problems.push(`the cursor is ${status.cursor}, not ${bad - 1n}`);
  for (const table of PER_HEIGHT) {
    const [row] = await db.query(`SELECT count(*)::text AS n FROM ${table} WHERE height >= ${bad}`);
    if (row?.n !== "0") problems.push(`${table} holds ${row?.n} rows at or above ${bad}`);
  }
  problems.push(...(await nodeProblems(db)));
  return problems;
}

/** The rows of `core_block_parsed.transactions` and `core_tx_results.results` at block 0: IN-7's body order. */
export async function blockZeroProblems(db: ProcessDatabase, scenario: LedgerScenario): Promise<string[]> {
  const rows = await db.query(
    `SELECT t.tx_index::text, t.kind, encode(t.tx_hash, 'hex') AS hash, r.outcome FROM core_block_parsed.transactions t
     JOIN core_tx_results.results r USING (height, tx_index) WHERE t.height = 0 ORDER BY t.tx_index`,
  );
  const expected = scenario.transactions
    .filter((t) => t.height === 0n)
    .map((t) => text({ tx_index: `${t.index}`, kind: t.kind, hash: hex(t.hash).slice(2), outcome: "success" }));
  return rowProblems("block 0's transactions", rows.map(text), expected);
}
