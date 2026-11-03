import type { NodeBatch } from "../../src/ledger/types.js";
import { type FixtureDag, rootOf } from "../ledger/fixtures/sweep-fixture.js";
import { decodeChildren, hex, refsOf } from "../ledger/node-format.js";
import type { TableSnapshot } from "./sweep-tapes.js";

/**
 * R3's database check: what the database holds after a block, read through the check's own queries (the snapshots of
 * `./sweep-tapes.ts`, `sweepTables`) and its child lists parsed by `test/ledger/node-format.ts`, never through the
 * step's code (`src/backbone/core-ledger-state/refcount.ts`). Each clause lists what it finds broken, none when it
 * holds: [R3, LG-11, LG-14; design §2.3]
 * - (a) I1, I2 and I3, each count recomputed from every stored child list with repeats counted
 *   ({@link closureProblems});
 * - (b) I4, and every state key of `states` inside the retention window and every key `core_contract_states.states`
 *   stores a row whose whole reachable set is stored ({@link retainedProblems});
 * - (c) `R_{h−1} ⊆ S_h`, and with `sweep` on at h `S_h = K_h`, `R_{h−1}`, `R_h` and `K_h` computed elsewhere: on the
 *   DAG fixture by {@link fixtureReach}, from the fixture's states and the blocks' written nodes, not from the database;
 *   on the recorded tapes by {@link storedReach}, from the stored rows and the block's written nodes
 *   ({@link reachProblems});
 * - (d) with `sweep` on at h, I5 against the queue read at h − 1 ({@link leakProblems}).
 *
 * Imports nothing of Vitest.
 */

/** The references of a stored child list, through embedded children, a key listed twice given twice (hex). */
export const referencesOf = (children: Uint8Array): string[] => refsOf(decodeChildren(children)).map(hex);

/** Each key's references in the child lists of `rows`, repeats counted. */
function referenceCounts(rows: ReadonlyMap<string, Uint8Array>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const children of rows.values()) for (const key of referencesOf(children)) counts.set(key, (counts.get(key) ?? 0) + 1);
  return counts;
}

/** (a): I1, I2 and I3 on the tables after a block. [R3; design §2.3] */
export function closureProblems(after: TableSnapshot): string[] {
  const problems: string[] = [];
  for (const [key, children] of after.rows) {
    for (const ref of referencesOf(children)) if (!after.rows.has(ref)) problems.push(`I1: ${key} references ${ref}, which is not a row`);
  }
  const counted = referenceCounts(after.rows);
  for (const key of [...new Set([...counted.keys(), ...after.refs.keys()])].sort()) {
    const stored = after.refs.get(key) ?? 0;
    const recounted = counted.get(key) ?? 0;
    if (stored !== recounted) problems.push(`I2: ${key} is counted ${stored}, and the stored child lists reference it ${recounted} times`);
  }
  const queue = [...after.rows.keys()].filter((key) => (counted.get(key) ?? 0) === 0 && (after.roots.get(key) ?? 0) === 0);
  for (const key of queue) if (!after.queue.has(key)) problems.push(`I3: ${key} has no reference and no root count, and is not queued`);
  for (const key of after.queue) if (!queue.includes(key)) problems.push(`I3: ${key} is queued, and is ${after.rows.has(key) ? "referenced or persisted" : "not a row"}`);
  return problems;
}

/** The keys `starts` reach through the child lists of `rows` (themselves included), and those of them that are no row. */
export function reachIn(rows: ReadonlyMap<string, Uint8Array>, starts: Iterable<string>): { readonly reached: Set<string>; readonly missing: Set<string> } {
  const reached = new Set<string>();
  const missing = new Set<string>();
  const frontier = [...starts];
  while (frontier.length > 0) {
    const key = frontier.pop() as string;
    if (reached.has(key)) continue;
    reached.add(key);
    const children = rows.get(key);
    if (children === undefined) missing.add(key);
    else frontier.push(...referencesOf(children));
  }
  return { reached, missing };
}

/**
 * (b): I4, and every state key of `states` from height `windowFrom` on (the retention window after the block) and every
 * key `core_contract_states.states` stores is a row whose whole reachable set is stored. [R3; design §2.3]
 */
export function retainedProblems(after: TableSnapshot, windowFrom: bigint): string[] {
  const problems: string[] = [];
  for (const [key, count] of after.roots) if (!after.rows.has(key)) problems.push(`I4: ${key} has root count ${count} and is not a row`);
  const held = [
    ...[...after.states].filter(([height]) => height >= windowFrom).map(([height, key]) => [`the state key of ${height}`, key] as const),
    ...after.contracts.map((key) => [`the contract key ${key}`, key] as const),
  ];
  for (const [what, key] of held) {
    const { missing } = reachIn(after.rows, [key]);
    for (const lost of [...missing].sort()) problems.push(`${what} reaches ${lost}, which is not stored`);
  }
  return problems;
}

/** What block h keeps, by the oracle's account: `R_{h−1}`, `R_h` and `K_h`. [design §1] */
export interface Reach {
  readonly before: ReadonlySet<string>;
  readonly reached: ReadonlySet<string>;
  readonly kept: ReadonlySet<string>;
}

/** (c): `R_{h−1} ⊆ S_h`, and with `sweep` on `S_h = K_h`. [R3; design §2.3 I6] */
export function reachProblems(after: TableSnapshot, reach: Reach, on: boolean): string[] {
  const problems: string[] = [];
  for (const key of [...reach.before].sort()) if (!after.rows.has(key)) problems.push(`${key} of R_{h−1} is not stored`);
  if (on) {
    for (const key of [...after.rows.keys()].sort()) if (!reach.kept.has(key)) problems.push(`S_h ≠ K_h: ${key} is stored and not in K_h`);
    for (const key of [...reach.kept].sort()) {
      if (!after.rows.has(key) && !reach.before.has(key)) problems.push(`S_h ≠ K_h: ${key} of K_h is not stored`);
    }
  }
  return problems;
}

/** A batch's nodes, by hex key, with their child lists. */
const writtenOf = (batch: NodeBatch): Map<string, Uint8Array> => new Map(batch.inserts.map((node) => [hex(node.key), node.children]));

/**
 * (d): with `sweep` on at h, I5 against the queue read at h − 1: every row queued at h − 1 that is not protected in h
 * and gains no reference in h is gone after h; and every row whose referencing rows at h − 1 were all deleted in h,
 * that gains no reference in h from a node the batch writes and is not protected in h, is gone too. [R3; design §2.3]
 */
export function leakProblems(before: TableSnapshot, after: TableSnapshot, batch: NodeBatch, on: boolean): string[] {
  if (!on) return [];
  const written = writtenOf(batch);
  const fresh = [...written.keys()].filter((key) => !before.rows.has(key));
  const rewritten = [...written.keys()].filter((key) => before.rows.has(key) && Buffer.compare(before.rows.get(key) as Uint8Array, written.get(key) as Uint8Array) !== 0);
  const gains = new Set([...fresh, ...rewritten].flatMap((key) => referencesOf(written.get(key) as Uint8Array)));
  const protectedKeys = new Set([
    ...before.roots.keys(),
    ...after.roots.keys(),
    ...rewritten.flatMap((key) => referencesOf(before.rows.get(key) as Uint8Array)),
    ...fresh,
  ]);
  const deleted = new Set([...before.rows.keys()].filter((key) => !after.rows.has(key)));
  const referrers = new Map<string, string[]>();
  for (const [key, children] of before.rows) for (const ref of referencesOf(children)) referrers.set(ref, [...(referrers.get(ref) ?? []), key]);
  const problems: string[] = [];
  for (const key of [...before.rows.keys()].sort()) {
    if (!after.rows.has(key) || protectedKeys.has(key) || gains.has(key)) continue;
    const from = referrers.get(key) ?? [];
    if (before.queue.has(key)) problems.push(`I5: ${key}, queued at h − 1, is still stored`);
    else if (from.length > 0 && from.every((parent) => deleted.has(parent))) {
      problems.push(`I5: ${key}, whose referencing rows at h − 1 were all deleted, is still stored`);
    }
  }
  return problems;
}

/**
 * A run's configuration as the oracle takes it: `retainStates` (0 unless given), or `retainedFrom`, the lowest height
 * whose state is alive after block h, for a window a revision changes (`retainStates` R gives `max(0, h − R)`);
 * whether `sweep` is on at a height (on unless `on` says otherwise); and the keys a test package persists itself after
 * a height (`persisted`). [R3, R27, LG-12]
 */
export interface FixtureConfig {
  readonly retainStates?: number;
  readonly retainedFrom?: (h: number) => number;
  readonly on?: (h: number) => boolean;
  readonly persisted?: (h: number) => readonly string[];
}

/** The lowest height whose state is alive after block `h`, by `options`. */
const lowestAlive = (options: FixtureConfig, h: number): number => options.retainedFrom?.(h) ?? Math.max(0, h - (options.retainStates ?? 0));

/**
 * The oracle's account of the DAG fixture `dag`, heights 0 to `last`: at each height h, `R_{h−1}`, `R_h` and `K_h`,
 * from the fixture's states (the persisted keys after h: the roots of the states alive after h, those after
 * `h − retainStates` to h unless `retainedFrom` says otherwise, and the keys `persisted` adds, a test package's own)
 * and the nodes `batches` wrote (each key's child list the one last written for it), never from the database. The
 * stored set it carries from block to block is `K_h` where `on` says `sweep` is on, else the set before with the new
 * nodes. [R3; design §1, §4.3]
 */
export function fixtureReach(
  dag: FixtureDag,
  batches: ReadonlyMap<bigint, NodeBatch>,
  last: number,
  options: FixtureConfig = {},
): Map<bigint, Reach> {
  const persisted = (h: number): string[] => {
    const from = lowestAlive(options, h);
    return [
      ...Array.from({ length: h - from + 1 }, (_, i) => hex(rootOf(h - i, dag).slice(1))),
      ...(options.persisted?.(h) ?? []),
    ];
  };
  const reachFrom = (starts: Iterable<string>, lists: ReadonlyMap<string, Uint8Array>): Set<string> => {
    const reached = new Set<string>();
    const frontier = [...starts];
    while (frontier.length > 0) {
      const key = frontier.pop() as string;
      if (reached.has(key)) continue;
      reached.add(key);
      const children = lists.get(key);
      if (children !== undefined) frontier.push(...referencesOf(children));
    }
    return reached;
  };
  const account = new Map<bigint, Reach>();
  let lists = new Map<string, Uint8Array>();
  let stored = new Set<string>();
  let before = new Set<string>();
  for (let h = 0; h <= last; h++) {
    const batch = batches.get(BigInt(h));
    if (batch === undefined) throw new Error(`no batch recorded for height ${h}`);
    const written = writtenOf(batch);
    const fresh = [...written.keys()].filter((key) => !stored.has(key));
    const rewritten = [...written.keys()].filter((key) => stored.has(key) && Buffer.compare(lists.get(key) ?? new Uint8Array(0), written.get(key) as Uint8Array) !== 0);
    const previous = lists;
    lists = new Map([...previous, ...written]);
    const reached = reachFrom(persisted(h), lists);
    const kept = new Set([
      ...before,
      ...reachFrom([...persisted(h), ...fresh, ...rewritten], lists),
      ...reachFrom(rewritten.flatMap((key) => referencesOf(previous.get(key) as Uint8Array)), previous),
    ]);
    account.set(BigInt(h), { before, reached, kept });
    stored = (options.on?.(h) ?? true) ? kept : new Set([...stored, ...fresh]);
    before = reached;
  }
  return account;
}

/**
 * R3's clauses (a)–(d) after every height of a run on the DAG fixture `dag`, heights 0 to `last`: `tables` after every
 * height, `batches` every block's, `options` the run's window and whether `sweep` is on at a height. Each problem names
 * its height. [R3]
 */
export function fixtureProblems(
  dag: FixtureDag,
  tables: ReadonlyMap<bigint, TableSnapshot>,
  batches: ReadonlyMap<bigint, NodeBatch>,
  last: number,
  options: FixtureConfig = {},
): string[] {
  const reach = fixtureReach(dag, batches, last, options);
  const problems: string[] = [];
  for (let h = 0; h <= last; h++) {
    const after = tables.get(BigInt(h));
    if (after === undefined) {
      problems.push(`after ${h}: no tables recorded`);
      continue;
    }
    const on = options.on?.(h) ?? true;
    const before = tables.get(BigInt(h - 1));
    const found = [
      ...closureProblems(after).map((p) => `(a) ${p}`),
      ...retainedProblems(after, BigInt(lowestAlive(options, h))).map((p) => `(b) ${p}`),
      ...reachProblems(after, reach.get(BigInt(h)) as Reach, on).map((p) => `(c) ${p}`),
      ...(before === undefined ? [] : leakProblems(before, after, batches.get(BigInt(h)) as NodeBatch, on).map((p) => `(d) ${p}`)),
    ];
    problems.push(...found.map((p) => `after ${h}: ${p}`));
  }
  return problems;
}

/** The keys persisted after a block: those with a root count. [design §1] */
const persistedIn = (tables: TableSnapshot): string[] => [...tables.roots].filter(([, count]) => count > 0).map(([key]) => key);

/** The tables before block 0. */
export const NO_TABLES: TableSnapshot = Object.freeze({
  rows: new Map(),
  refs: new Map(),
  roots: new Map(),
  queue: new Set<string>(),
  states: new Map(),
  contracts: [],
  digests: new Map(),
});

/**
 * What block h keeps by the stored rows' account, on a recorded tape: `R_{h−1}` and `R_h` reached from the persisted
 * keys (those with a root count) after h − 1 and after h through the child lists stored then, and `K_h` from those, the
 * nodes of `batch` that are new or rewritten, and the stored child lists their rewrites replaced; `before` is
 * {@link NO_TABLES} at block 0. A key reached that is no row is reached all the same, so (c) also names it.
 * [R3, R13; design §1]
 *
 * `K_h`'s reach from the persisted keys after h and the new and rewritten nodes goes through the child lists stored
 * after h, as design §1 defines it; with `through` `"written"`, through those stored after h − 1 with the batch's over
 * them (R13's runs, `./refcount-restart.ts`). The two give the same `K_h` while every key that reach meets is stored
 * after h and holds the child list h − 1 or the batch gave it; where one is not stored, (c) fails either way, the
 * second naming more keys; where the rows after h hold a row or a child list neither gave, the second follows what the
 * block was given, the first what was stored.
 */
export function storedReach(before: TableSnapshot, after: TableSnapshot, batch: NodeBatch, through: "stored" | "written" = "stored"): Reach {
  const written = writtenOf(batch);
  const fresh = [...written.keys()].filter((key) => !before.rows.has(key));
  const rewritten = [...written.keys()].filter((key) => before.rows.has(key) && Buffer.compare(before.rows.get(key) as Uint8Array, written.get(key) as Uint8Array) !== 0);
  const prior = reachIn(before.rows, persistedIn(before)).reached;
  const reached = reachIn(after.rows, persistedIn(after)).reached;
  const lists = through === "stored" ? after.rows : new Map([...before.rows, ...written]);
  const kept = new Set([
    ...prior,
    ...reachIn(lists, [...persistedIn(after), ...fresh, ...rewritten]).reached,
    ...reachIn(before.rows, rewritten.flatMap((key) => referencesOf(before.rows.get(key) as Uint8Array))).reached,
  ]);
  return { before: prior, reached, kept };
}

/** R3's check at one height of a recorded tape: the problems found, and the rows outside `R_{h−1} ∪ R_h`. [R3] */
export interface StoredCheck {
  readonly height: bigint;
  /** `S_h`'s size. */
  readonly rows: number;
  /** The rows of `S_h` in neither `R_{h−1}` nor `R_h`. */
  readonly outside: number;
  readonly problems: readonly string[];
}

/**
 * R3's clauses (a)–(d) after block `height` of a recorded tape: `before` the tables after h − 1 ({@link NO_TABLES}
 * before block 0), `after` those after h, `batch` the block's, `on` whether `sweep` is on at h, the retention window
 * after h from `height − retainStates`, `through` the child lists `K_h`'s reach goes through ({@link storedReach}).
 * Each problem names its height and clause. [R3, R13, R22]
 */
export function storedProblems(
  height: bigint,
  before: TableSnapshot,
  after: TableSnapshot,
  batch: NodeBatch,
  options: { readonly retainStates?: number; readonly on?: boolean; readonly through?: "stored" | "written" } = {},
): StoredCheck {
  const on = options.on ?? true;
  const reach = storedReach(before, after, batch, options.through);
  const windowFrom = height - BigInt(options.retainStates ?? 0);
  const found = [
    ...closureProblems(after).map((p) => `(a) ${p}`),
    ...retainedProblems(after, windowFrom < 0n ? 0n : windowFrom).map((p) => `(b) ${p}`),
    ...reachProblems(after, reach, on).map((p) => `(c) ${p}`),
    ...leakProblems(before, after, batch, on).map((p) => `(d) ${p}`),
  ];
  const outside = [...after.rows.keys()].filter((key) => !reach.before.has(key) && !reach.reached.has(key)).length;
  return { height, rows: after.rows.size, outside, problems: found.map((p) => `after ${height}: ${p}`) };
}
