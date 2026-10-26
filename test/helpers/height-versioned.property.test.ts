import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { HeightVersionedTable, VersionedValue } from "../../src/helpers/height-versioned.js";
import { BACKENDS } from "../db/backends.js";
import type { HelperDatabase } from "./cursor-harness.js";
import {
  GAPS,
  METADATA,
  OVERLAPS,
  type StoredVersion,
  versionedDatabase,
  versionsOf,
} from "./height-versioned-harness.js";

/**
 * A60 [PROP] (SH-2): for random sequences of writes, same-value writes and deletes over heights, reading the
 * height-versioned table at every height equals a reference model; versions of a key never overlap and consecutive
 * versions meet at their boundary (`to` of one = `from` of the next, unless deleted between) — on PostgreSQL 18 and
 * PGlite 0.5.10, through the real block write handles.
 *
 * A sequence is a list of blocks at consecutive heights, each changing a few keys of a small set once (SH-3: one change
 * of a key per block; A61 is the second change's test) — a write of a new value, a write of the value the key has
 * (or, for a key with none, of a new one), or a delete — and some blocks with no write at all, so that a key's versions
 * span several heights; some blocks fail after their writes and roll back, and their height is written again by the
 * next block, as the runner retries a height. The model holds each key's versions, `[from, to)` with `to` null for the
 * current one, built from the committed blocks only by SH-2's rules, and the heights at which a delete closed one.
 *
 * Checked inside each block, after each write, through the block's write handle: the key's current value, and its value
 * as of the block's height and the height before (the block's writes are at its height). After each block, through a
 * read at the committed height (which the read reports): each key's stored versions — the history table's and the
 * current one — never overlap, are not empty, meet at their boundary unless the key was deleted there, and equal the
 * model's; and the key read at every height from the sequence's first to one past the last, and its current value,
 * equal the model's. Everything a block finds wrong is reported together, as an `Error` starting with `A60`.
 *
 * The committed negative controls (`height-versioned-harness.ts`): a table whose versions overlap (a version closed one
 * height late) and one that leaves a gap where nothing was deleted (closed one height early) fail the property, with
 * the same seed.
 */

const SEED = 20261026;

/** Keys of one sequence: few, so that a key changes in many blocks; case and a non-ASCII letter, compared by bytes. */
const KEYS = ["a", "b", "B", "é", ""] as const;
type Key = (typeof KEYS)[number];

const text = fc.string({ unit: "grapheme", maxLength: 6 }).filter((s) => !s.includes("\u0000"));

/** A canonical JSON value (DT-1, owner decision Q57): integers only, within the signed 64-bit range. */
const { value } = fc.letrec<{ value: VersionedValue }>((tie) => ({
  value: fc.oneof(
    { depthSize: "small", maxDepth: 3 },
    fc.constant(null),
    fc.boolean(),
    fc.integer({ min: -3, max: 3 }),
    fc.integer(),
    fc.bigInt({ min: -(2n ** 63n), max: 2n ** 63n - 1n }),
    text,
    fc.array(tie("value"), { maxLength: 3 }),
    fc.dictionary(text, tie("value"), { maxKeys: 3, noNullPrototype: true }),
  ),
}));

/** One change a block makes to a key. */
type Op =
  | { readonly kind: "write"; readonly value: VersionedValue }
  /** The value the key has (no version, SH-2); for a key with none, `fallback`. */
  | { readonly kind: "same"; readonly fallback: VersionedValue }
  | { readonly kind: "delete" };

const op: fc.Arbitrary<Op> = fc.oneof(
  { arbitrary: fc.record({ kind: fc.constant("write" as const), value }), weight: 3 },
  { arbitrary: fc.record({ kind: fc.constant("same" as const), fallback: value }), weight: 1 },
  { arbitrary: fc.record({ kind: fc.constant("delete" as const) }), weight: 1 },
);

interface Block {
  /** At most one change per key (SH-3). */
  readonly ops: readonly (readonly [Key, Op])[];
  /** The block fails after its writes, and rolls back. */
  readonly fails: boolean;
}

const block: fc.Arbitrary<Block> = fc.record({
  ops: fc.uniqueArray(fc.tuple(fc.constantFrom(...KEYS), op), { selector: ([key]) => key, maxLength: 4 }),
  fails: fc.oneof({ arbitrary: fc.constant(false), weight: 4 }, { arbitrary: fc.constant(true), weight: 1 }),
});

const sequences = fc.array(block, { minLength: 1, maxLength: 10 });

/**
 * A value as a read gives it back (DB-2): the database API's lossless reader gives an integer within ±(2^53 − 1) as a
 * `number` and one beyond as a `bigint`; objects come back as plain objects.
 */
function readBack(written: VersionedValue): VersionedValue {
  if (typeof written === "bigint") {
    return written >= BigInt(Number.MIN_SAFE_INTEGER) && written <= BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(written)
      : written;
  }
  if (Array.isArray(written)) return written.map(readBack);
  if (written !== null && typeof written === "object") {
    return Object.fromEntries(
      Object.entries(written).map(([key, member]) => [key, readBack(member as VersionedValue)]),
    );
  }
  return written;
}

/** A value's text with object keys sorted and `bigint`s marked: equal for the values jsonb holds equal. */
function canonicalText(v: VersionedValue | undefined): string {
  if (v === undefined) return "nothing";
  const sorted = (x: VersionedValue): unknown => {
    if (typeof x === "bigint") return `${x}n`;
    if (Array.isArray(x)) return x.map(sorted);
    if (x !== null && typeof x === "object") {
      return Object.fromEntries(
        Object.keys(x)
          .sort()
          .map((key) => [key, sorted((x as Record<string, VersionedValue>)[key] as VersionedValue)]),
      );
    }
    return x;
  };
  return JSON.stringify(sorted(readBack(v)));
}

const same = (a: VersionedValue | undefined, b: VersionedValue | undefined): boolean =>
  canonicalText(a) === canonicalText(b);

/** What a change did to the model. */
type Effect = "new" | "closed-and-new" | "same" | "deleted" | "delete-of-none";

/** SH-2's versions of each key, built from committed changes only. */
class Model {
  constructor(
    private readonly versions: Map<string, StoredVersion[]> = new Map(),
    private readonly deletes: Map<string, Set<bigint>> = new Map(),
  ) {}

  copy(): Model {
    return new Model(
      new Map([...this.versions].map(([key, list]) => [key, [...list]])),
      new Map([...this.deletes].map(([key, set]) => [key, new Set(set)])),
    );
  }

  of(key: string): readonly StoredVersion[] {
    return this.versions.get(key) ?? [];
  }

  deletedAt(key: string): ReadonlySet<bigint> {
    return this.deletes.get(key) ?? new Set();
  }

  current(key: string): VersionedValue | undefined {
    const last = this.of(key).at(-1);
    return last !== undefined && last.to === null ? last.value : undefined;
  }

  at(key: string, height: bigint): VersionedValue | undefined {
    return this.of(key).find((v) => v.from <= height && (v.to === null || height < v.to))?.value;
  }

  /** Applies `op` to `key` at `height` (SH-2), giving the value written (for a write) and what it did. */
  apply(key: string, change: Op, height: bigint): { readonly written?: VersionedValue; readonly effect: Effect } {
    const list = [...this.of(key)];
    const last = list.at(-1);
    const open = last !== undefined && last.to === null ? last : undefined;
    if (change.kind === "delete") {
      if (open === undefined) return { effect: "delete-of-none" };
      list[list.length - 1] = { ...open, to: height };
      this.versions.set(key, list);
      this.deletes.set(key, new Set([...this.deletedAt(key), height]));
      return { effect: "deleted" };
    }
    const written = change.kind === "write" ? change.value : (open?.value ?? change.fallback);
    if (open !== undefined && same(open.value, written)) return { written, effect: "same" };
    if (open !== undefined) list[list.length - 1] = { ...open, to: height };
    list.push({ from: height, to: null, value: written });
    this.versions.set(key, list);
    return { written, effect: open === undefined ? "new" : "closed-and-new" };
  }
}

/** What the property's runs did, so that they can be shown not to be vacuous. */
interface Counts {
  /** Committed writes that closed a version and opened another. */
  closedAndNew: number;
  /** Committed writes of a key with no current version. */
  firstOrAfterDelete: number;
  /** Committed writes of the value the key had (no version). */
  sameValue: number;
  /** Committed deletes that closed a version. */
  deletes: number;
  /** Committed deletes of a key with no current version. */
  deletesOfNone: number;
  /** Changes in blocks that rolled back. */
  rolledBack: number;
  /** Writes after a delete of the same key at a lower height: a gap between two versions. */
  gaps: number;
  /** Reads at a height checked after blocks. */
  reads: number;
}

/**
 * What is wrong with `stored`, the versions of one key as the tables hold them, by SH-2's rules alone: an empty or
 * reversed version, a current version (`to` null) that is not the last, two versions that overlap, two consecutive
 * versions that do not meet although the key was not deleted where the first ends.
 */
function structureProblems(
  name: string,
  stored: readonly StoredVersion[],
  deletedAt: ReadonlySet<bigint>,
): string[] {
  const problems: string[] = [];
  const range = (v: StoredVersion) => `[${v.from}, ${v.to ?? "…"})`;
  for (const [index, v] of stored.entries()) {
    if (v.to !== null && !(v.from < v.to)) problems.push(`${name}: the version ${range(v)} is empty`);
    if (v.to === null && index !== stored.length - 1) problems.push(`${name}: the current version is not the last`);
    const next = stored[index + 1];
    if (next === undefined) continue;
    if (v.to === null || v.to > next.from) {
      problems.push(`${name}: the versions ${range(v)} and ${range(next)} overlap`);
    } else if (v.to < next.from && !deletedAt.has(v.to)) {
      problems.push(`${name}: a gap between ${range(v)} and ${range(next)}, where nothing was deleted`);
    }
  }
  return problems;
}

class BlockFails extends Error {}

let sequenceNumber = 0;

/** Runs `sequence` on `table` of `database` and checks the property (see the module comment). */
async function holds(
  database: HelperDatabase,
  table: HeightVersionedTable,
  sequence: readonly Block[],
  counts: Counts,
): Promise<void> {
  sequenceNumber++;
  const keyOf = (key: string) => `sequence-${sequenceNumber}/${key}`;
  const first = database.committed ?? 0n;
  let model = new Model();
  for (const { ops, fails } of sequence) {
    const height = (database.committed ?? 0n) + 1n;
    const pending = model.copy();
    const problems: string[] = [];
    const ran = database.block(async (w, b) => {
      if (b.height !== height) problems.push(`the block is at ${b.height}, not ${height}`);
      for (const [key, change] of ops) {
        const { written, effect } = pending.apply(key, change, height);
        if (written === undefined) await table.delete(w, b, keyOf(key));
        else await table.write(w, b, keyOf(key), written);
        if (fails) counts.rolledBack++;
        else if (effect === "closed-and-new") counts.closedAndNew++;
        else if (effect === "new") {
          counts.firstOrAfterDelete++;
          if (pending.of(key).length > 1) counts.gaps++;
        } else if (effect === "same") counts.sameValue++;
        else if (effect === "deleted") counts.deletes++;
        else counts.deletesOfNone++;
        // The block's write handle reads the block's own writes, which are at its height.
        const seen = [
          ["now", await table.read(w, keyOf(key)), pending.current(key)],
          [`at ${height}`, await table.read(w, keyOf(key), height), pending.at(key, height)],
          [`at ${height - 1n}`, await table.read(w, keyOf(key), height - 1n), model.at(key, height - 1n)],
        ] as const;
        for (const [when, actual, expected] of seen) {
          if (!same(actual, expected)) {
            problems.push(
              `${key} in block ${height} ${when}: read ${canonicalText(actual)}, not ${canonicalText(expected)}`,
            );
          }
        }
      }
      if (fails) throw new BlockFails("the block fails after its writes");
    });
    try {
      await ran;
      if (fails) problems.push(`block ${height} committed although it failed`);
      else model = pending;
    } catch (error) {
      if (!(fails && error instanceof BlockFails)) problems.push(`block ${height} failed: ${String(error)}`);
    }
    const committed = database.committed ?? 0n;
    await database.db.read(async (read) => {
      if (read.height !== database.committed) problems.push(`the read is at ${read.height}, not ${database.committed}`);
      for (const key of KEYS) {
        const stored = await versionsOf(read, table, keyOf(key));
        problems.push(...structureProblems(`${key} after block ${height}`, stored, model.deletedAt(key)));
        const expected = model.of(key);
        const shown = (list: readonly StoredVersion[]) =>
          list.map((v) => `[${v.from}, ${v.to ?? "…"}) ${canonicalText(v.value)}`).join(" ");
        const equal =
          stored.length === expected.length &&
          stored.every(
            (v, i) => v.from === expected[i]?.from && v.to === expected[i]?.to && same(v.value, expected[i]?.value),
          );
        if (!equal) problems.push(`${key} after block ${height}: versions ${shown(stored)}, not ${shown(expected)}`);
        for (let at = first; at <= committed + 1n; at++) {
          const actual = await table.read(read, keyOf(key), at);
          counts.reads++;
          if (!same(actual, model.at(key, at))) {
            problems.push(
              `${key} after block ${height}, at height ${at}: read ${canonicalText(actual)}, ` +
                `not ${canonicalText(model.at(key, at))}`,
            );
          }
        }
        const now = await table.read(read, keyOf(key));
        if (!same(now, model.current(key))) {
          problems.push(
            `${key} after block ${height}, now: read ${canonicalText(now)}, not ${canonicalText(model.current(key))}`,
          );
        }
      }
    });
    if (problems.length > 0) throw new Error(`A60 failed:\n${problems.join("\n")}`);
  }
}

const noCounts = (): Counts => ({
  closedAndNew: 0,
  firstOrAfterDelete: 0,
  sameValue: 0,
  deletes: 0,
  deletesOfNone: 0,
  rolledBack: 0,
  gaps: 0,
  reads: 0,
});

// The suite starts a database and runs 40 sequences of up to 10 blocks, each block followed by reads at every
// height; under the full parallel conformance run (load average 20-35) a run takes tens of seconds, so each test has
// 10 minutes.
const TITLE = "A60: the height-versioned table reads as its model at every height, on $name (SH-2)";

describe.each(BACKENDS)(TITLE, { timeout: 600_000 }, (backend) => {
  let database: HelperDatabase;

  beforeAll(async () => {
    await backend.start();
    database = await versionedDatabase(backend);
  }, 180_000);

  afterAll(() => backend.stop(), 60_000);

  it(`holds for random writes, same-value writes and deletes, some blocks rolling back (seed ${SEED})`, async () => {
    const counts = noCounts();
    await fc.assert(
      fc.asyncProperty(sequences, (sequence) => holds(database, METADATA, sequence, counts)),
      { seed: SEED, numRuns: 40 },
    );
    // Not vacuous: versions closed by writes and by deletes, same-value writes, gaps, deletes of keys with no version,
    // and rolled-back changes, all met.
    expect(counts.closedAndNew).toBeGreaterThan(30);
    expect(counts.firstOrAfterDelete).toBeGreaterThan(30);
    expect(counts.sameValue).toBeGreaterThan(10);
    expect(counts.deletes).toBeGreaterThan(10);
    expect(counts.deletesOfNone).toBeGreaterThan(5);
    expect(counts.rolledBack).toBeGreaterThan(10);
    expect(counts.gaps).toBeGreaterThan(3);
    expect(counts.reads).toBeGreaterThan(2_000);
  });

  it("negative control: a table whose versions overlap (closed one height late) fails the property", async () => {
    const result = await fc.check(
      fc.asyncProperty(sequences, (sequence) => holds(database, OVERLAPS.table, sequence, noCounts())),
      { seed: SEED, numRuns: 40, endOnFailure: true },
    );
    expect(result.failed).toBe(true);
    expect(String(result.errorInstance)).toMatch(/^Error: A60 failed:\n/);
    expect(String(result.errorInstance)).toMatch(/overlap/);
  });

  it("negative control: a table leaving a gap where nothing was deleted (closed a height early) fails it", async () => {
    const result = await fc.check(
      fc.asyncProperty(sequences, (sequence) => holds(database, GAPS.table, sequence, noCounts())),
      { seed: SEED, numRuns: 40, endOnFailure: true },
    );
    expect(result.failed).toBe(true);
    expect(String(result.errorInstance)).toMatch(/^Error: A60 failed:\n/);
    expect(String(result.errorInstance)).toMatch(/a gap between/);
  });
});
