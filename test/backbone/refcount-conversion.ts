import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import type { CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { type Ledger, RAW } from "../ledger/adapter-fixtures.js";
import { free, hex, taggedRootKey, untag } from "../ledger/node-format.js";
import { rebuildTagged } from "../ledger/stored-values.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import type { FoundTape } from "../tape/real/real-tapes.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";
import { cappedAt } from "./ledger-restart.js";
import { closureProblems, leakProblems, type Reach, reachIn, reachProblems, referencesOf, retainedProblems } from "./refcount-checks.js";
import { recordingWorker, seenTables, sweepCore, sweepTables, sweepWatcher, type TableSnapshot, workerRecord } from "./sweep-tapes.js";

/**
 * The ledger conversion on the recorded devnet v8 → v9 tape, through the real process with `core-contract-states`
 * (`ledger-refcount-conversion.test.ts`): a run from genesis to F + 4 recording the tables after every height and each
 * block's batch, and the checks on it. Each check lists what it finds broken, none when it holds. Imports nothing of
 * Vitest. [R22, LG-9, LG-13, LG-14]
 * - {@link conversionR3}: R3's clauses (a)–(d) at the heights given, `R_{h−1}`, `R_h` and `K_h` computed from the
 *   stored rows and the block's batch ({@link storedKeep}), with the rows outside `R_{h−1} ∪ R_h` counted;
 * - {@link releaseProblems}: each v8 state held until the block its window sets releases it, its rows kept until the
 *   block after, and those outside `K_{b+1}` deleted there;
 * - {@link loadProblems}: every contract state and zswap state stored below F loads from its stored key at the end.
 */

/** The devnet's v8 → v9 conversion block: the first block applied with ledger v9. [LG-9] */
export const DEVNET_F = 103n;

/** The last height of a run: F + 4. */
export const CONVERSION_LAST = DEVNET_F + 4n;

/** The devnet's `core` settings: a custom network, its genesis from the manifest, its table v8 then v9. */
export const devnetSettings = (found: FoundTape): Readonly<Record<string, unknown>> => ({
  network: "custom",
  genesisHash: (found.tape.notes as { genesis: { hash: string } }).genesis.hash,
  ledgerTable: { rows: [{ specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" }, { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" }] },
});

/** A `core_contract_states.states` row: its height, contract (hex) and keys (hex). */
export interface ContractRow {
  readonly height: bigint;
  readonly address: string;
  readonly stateKey: string;
  readonly zswapKey: string;
}

/** What a run gave. */
export interface ConversionRun {
  readonly retainStates: number;
  /** The tables after every height 0 … {@link CONVERSION_LAST}, the last read once the process stopped. */
  readonly tables: ReadonlyMap<bigint, TableSnapshot>;
  /** Each block's batch (the worker's answer to the block's last apply). */
  readonly batches: ReadonlyMap<bigint, NodeBatch>;
  /** Each block's ledger, from `core_block_commit.blocks`. */
  readonly ledgers: ReadonlyMap<bigint, string>;
  /** `core_ledger_state.nodes` once the process stopped, by hex key: each row's payload and child list. */
  readonly nodes: ReadonlyMap<string, { readonly data: Uint8Array; readonly children: Uint8Array }>;
  /** `core_contract_states.states` once the process stopped. */
  readonly contracts: readonly ContractRow[];
}

const bytesOf = (value: unknown): Uint8Array => Uint8Array.from(value as Uint8Array);

/**
 * Runs the devnet tape `found` on `db` from genesis to {@link CONVERSION_LAST} with `core-contract-states` and
 * `retainStates` (`core` gives `core-ledger-state`'s rules: a diagnostic's fault; none for the criterion), and reads
 * what the checks need once the process stopped. [R22]
 */
export async function conversionRun(
  db: ProcessDatabase,
  found: FoundTape,
  retainStates: number,
  core: CoreLedgerStateOptions = {},
): Promise<ConversionRun> {
  const record = workerRecord();
  const seen = seenTables();
  const process = await ingest(db, cappedAt(found.read().records, CONVERSION_LAST), {
    start: 0n,
    core: [...sweepCore(core), CORE_CONTRACT_STATES],
    settings: { ...devnetSettings(found), retainStates },
    user: [sweepWatcher(seen, record)],
    ledgerWorker: () => recordingWorker(startLedgerWorker(), record),
  });
  try {
    await committed(process, CONVERSION_LAST, PATIENCE_MS * 2);
  } finally {
    await process.close();
  }
  const tables = new Map(seen.tables);
  tables.set(CONVERSION_LAST, await sweepTables(db));
  const ledgers = new Map(
    (await db.query("SELECT height::text AS h, ledger_version AS l FROM core_block_commit.blocks ORDER BY height")).map((r) => [BigInt(r.h as string), r.l as string]),
  );
  const nodes = new Map(
    (await db.query("SELECT encode(node_key, 'hex') AS k, data, children FROM core_ledger_state.nodes")).map((r) => [
      r.k as string,
      { data: bytesOf(r.data), children: bytesOf(r.children) },
    ]),
  );
  const contracts = (
    await db.query(
      `SELECT height::text AS h, encode(contract_address, 'hex') AS a, encode(state_key, 'hex') AS s, encode(zswap_state_key, 'hex') AS z
       FROM core_contract_states.states ORDER BY height, contract_address`,
    )
  ).map((r) => ({ height: BigInt(r.h as string), address: r.a as string, stateKey: r.s as string, zswapKey: r.z as string }));
  return { retainStates, tables, batches: seen.batches, ledgers, nodes, contracts };
}

/** The keys with a root count in `tables`: the persisted keys after its block. [design §1] */
const persisted = (tables: TableSnapshot): string[] => [...tables.roots].filter(([, count]) => count > 0).map(([key]) => key);

/** What block h keeps by the stored rows' account, and how many rows after h are outside `R_{h−1} ∪ R_h`. */
export interface StoredKeep extends Reach {
  readonly outside: number;
}

/**
 * `R_{h−1}`, `R_h` and `K_h` computed from the stored rows: `before` the tables after h − 1 (none at genesis), `after`
 * those after h, `batch` block h's. The persisted keys are those with a root count; `N` and `W` are the batch's nodes
 * absent from `before`'s rows or stored there with another child list; a reach goes through the child lists stored
 * after the block it names (a node of the batch through its own). [R3 (c) on the tapes; design §1]
 */
export function storedKeep(before: TableSnapshot | undefined, after: TableSnapshot, batch: NodeBatch): StoredKeep {
  const previous: ReadonlyMap<string, Uint8Array> = before?.rows ?? new Map();
  const written = new Map(batch.inserts.map((node) => [hex(node.key), node.children]));
  const fresh = [...written.keys()].filter((key) => !previous.has(key));
  const rewritten = [...written.keys()].filter((key) => previous.has(key) && Buffer.compare(previous.get(key) as Uint8Array, written.get(key) as Uint8Array) !== 0);
  const lists = new Map([...written, ...after.rows]);
  const prior = before === undefined ? new Set<string>() : reachIn(previous, persisted(before)).reached;
  const reached = reachIn(after.rows, persisted(after)).reached;
  const kept = new Set([
    ...prior,
    ...reachIn(lists, [...persisted(after), ...fresh, ...rewritten]).reached,
    ...reachIn(previous, rewritten.flatMap((key) => referencesOf(previous.get(key) as Uint8Array))).reached,
  ]);
  const outside = [...after.rows.keys()].filter((key) => !prior.has(key) && !reached.has(key)).length;
  return { before: prior, reached, kept, outside };
}

/** The tables after `h`, or an error naming the height. */
function tablesAt(run: ConversionRun, h: bigint): TableSnapshot {
  const tables = run.tables.get(h);
  if (tables === undefined) throw new Error(`no tables recorded after ${h}`);
  return tables;
}

/** Block `h`'s batch, or an error naming the height. */
function batchAt(run: ConversionRun, h: bigint): NodeBatch {
  const batch = run.batches.get(h);
  if (batch === undefined) throw new Error(`no batch recorded for ${h}`);
  return batch;
}

/**
 * R3's clauses (a)–(d) after every height of `heights`, `sweep` on, the retention window after h from h − `retainStates`
 * (no later revision): each problem with its height; and, by height, the rows outside `R_{h−1} ∪ R_h`. [R3, R22]
 */
export function conversionR3(run: ConversionRun, heights: readonly bigint[]): { readonly problems: string[]; readonly outside: Map<bigint, number> } {
  const problems: string[] = [];
  const outside = new Map<bigint, number>();
  for (const h of heights) {
    const before = h === 0n ? undefined : tablesAt(run, h - 1n);
    const after = tablesAt(run, h);
    const batch = batchAt(run, h);
    const reach = storedKeep(before, after, batch);
    outside.set(h, reach.outside);
    const windowFrom = h - BigInt(run.retainStates) > 0n ? h - BigInt(run.retainStates) : 0n;
    const found = [
      ...closureProblems(after).map((p) => `(a) ${p}`),
      ...retainedProblems(after, windowFrom).map((p) => `(b) ${p}`),
      ...reachProblems(after, reach, true).map((p) => `(c) ${p}`),
      ...(before === undefined ? [] : leakProblems(before, after, batch, true).map((p) => `(d) ${p}`)),
    ];
    problems.push(...found.map((p) => `after ${h}: ${p}`));
  }
  return { problems, outside };
}

/** The v8 states: the heights below the first block applied with v9, which must be `DEVNET_F`. [LG-9] */
export function v8Heights(run: ConversionRun): bigint[] {
  const first = [...run.ledgers].find(([, ledger]) => ledger !== "v8");
  if (first === undefined || first[1] !== "v9" || first[0] !== DEVNET_F) {
    throw new Error(`the first block not applied with v8 is ${first === undefined ? "none" : `${first[0]} (${first[1]})`}, not ${DEVNET_F} (v9)`);
  }
  return Array.from({ length: Number(DEVNET_F) }, (_, i) => BigInt(i));
}

/** What the release of the v8 states gave: each problem, and the rows of the state after F − 1 deleted at its b + 1. */
export interface Released {
  readonly problems: string[];
  /** The state after F − 1: the block that released it, its rows then, and how many of them its b + 1 deleted. */
  readonly last: { readonly released: bigint; readonly rows: number; readonly deleted: number };
}

/**
 * Each v8 state, the state after h for h below F, its key `s` (the tape's state keys are distinct, so each is held by
 * one state alone) released by b = h + 1 + `retainStates`, the block whose retention window first leaves h out:
 * - `s` has root count 1 after h … b − 1, and b's batch gives it −1, leaving no root count after b;
 * - none of its rows is deleted before b + 1: at each t of h … b, what `s` reaches through the child lists stored
 *   after t is stored, and no row it reached after t − 1 is gone after t;
 * - after b + 1 no row it reached after b is stored unless it is in `K_{b+1}` ({@link storedKeep}).
 * [R22, LG-14; design §5, §9.2]
 */
export function releaseProblems(run: ConversionRun): Released {
  const problems: string[] = [];
  const keys = tablesAt(run, CONVERSION_LAST).states;
  const distinct = new Set(keys.values());
  if (distinct.size !== keys.size) problems.push(`the state keys after 0 … ${CONVERSION_LAST} are not distinct: ${keys.size} heights, ${distinct.size} keys`);
  let last = { released: -1n, rows: 0, deleted: 0 };
  for (const h of v8Heights(run)) {
    const s = keys.get(h);
    if (s === undefined) {
      problems.push(`no state key stored for ${h}`);
      continue;
    }
    const b = h + 1n + BigInt(run.retainStates);
    for (let t = h; t < b; t++) {
      const count = tablesAt(run, t).roots.get(s) ?? 0;
      if (count !== 1) problems.push(`the state of ${h} has root count ${count} after ${t}, not 1`);
    }
    const delta = batchAt(run, b).rootCounts.filter((change) => hex(change.key) === s).reduce((sum, change) => sum + change.delta, 0);
    if (delta !== -1) problems.push(`block ${b} changes the root count of the state of ${h} by ${delta}, not −1`);
    if (tablesAt(run, b).roots.has(s)) problems.push(`the state of ${h} still has a root count after ${b}`);
    for (let t = h; t <= b; t++) {
      for (const lost of reachIn(tablesAt(run, t).rows, [s]).missing) problems.push(`after ${t} the state of ${h} reaches ${lost}, which is not stored`);
      if (t > h) {
        const gone = [...reachIn(tablesAt(run, t - 1n).rows, [s]).reached].filter((key) => !tablesAt(run, t).rows.has(key));
        for (const key of gone.sort()) problems.push(`${key}, a row of the state of ${h} after ${t - 1n}, is deleted by ${t}, before ${b + 1n}`);
      }
    }
    const rows = [...reachIn(tablesAt(run, b).rows, [s]).reached];
    const next = tablesAt(run, b + 1n);
    const keep = storedKeep(tablesAt(run, b), next, batchAt(run, b + 1n)).kept;
    const unkept = rows.filter((key) => !keep.has(key));
    for (const key of unkept.filter((k) => next.rows.has(k)).sort()) {
      problems.push(`${key}, a row of the state of ${h} after its release at ${b}, is outside K_${b + 1n} and still stored after ${b + 1n}`);
    }
    if (h === DEVNET_F - 1n) last = { released: b, rows: rows.length, deleted: unkept.length };
  }
  return { problems, last };
}

/** A v8 or v9 package's tags for a contract state and a zswap state, as its own blank values carry them. */
function tagsOf(ledger: Ledger): { readonly state: string; readonly zswap: string } {
  const pkg = RAW[ledger];
  const state = new pkg.ContractState();
  const zswap = new pkg.ZswapChainState();
  try {
    return { state: untag(state.serialize()).tag, zswap: untag(zswap.serialize()).tag };
  } finally {
    free(state);
    free(zswap);
  }
}

/**
 * Every contract state and zswap state `core_contract_states.states` stores below F loads from its stored key once
 * the run ended: the key has a root count, the value rebuilt from the stored nodes alone (`../ledger/stored-values.ts`)
 * is deserialized by the package of the row's block's ledger, and that value's root key is the stored key. Each loaded
 * row is listed as `<height> <address>`. [R22, LG-13]
 */
export function loadProblems(run: ConversionRun): { readonly problems: string[]; readonly loaded: string[] } {
  const problems: string[] = [];
  const loaded: string[] = [];
  const end = tablesAt(run, CONVERSION_LAST);
  for (const row of run.contracts.filter((r) => r.height < DEVNET_F)) {
    const ledger = run.ledgers.get(row.height) as Ledger | undefined;
    if (ledger === undefined) {
      problems.push(`no block stored at ${row.height}`);
      continue;
    }
    const pkg = RAW[ledger];
    const tags = tagsOf(ledger);
    let loads = true;
    for (const [name, key, tag, load] of [
      ["state", row.stateKey, tags.state, (bytes: Uint8Array) => pkg.ContractState.deserialize(bytes)],
      ["zswap state", row.zswapKey, tags.zswap, (bytes: Uint8Array) => pkg.ZswapChainState.deserialize(bytes)],
    ] as const) {
      const what = `${row.address}'s ${name} stored at ${row.height}`;
      if ((end.roots.get(key) ?? 0) < 1) problems.push(`${what} has no root count after ${CONVERSION_LAST}`);
      try {
        const value = load(rebuildTagged(tag, Uint8Array.from(Buffer.from(key, "hex")), (k) => run.nodes.get(k)));
        try {
          const root = hex(taggedRootKey(value.serialize()).key);
          if (root !== key) problems.push(`${what} loads as a value whose key is ${root}, not ${key}`);
        } finally {
          free(value);
        }
      } catch (error) {
        loads = false;
        problems.push(`${what} does not load from its key after ${CONVERSION_LAST}: ${String(error)}`);
      }
    }
    if (loads) loaded.push(`${row.height} ${row.address}`);
  }
  return { problems, loaded };
}
