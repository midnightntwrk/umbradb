import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CursorTable, CursorValue } from "../../src/helpers/cursor-table.js";
import { BACKENDS } from "../db/backends.js";
import { CURSORS, type CursorDatabase, cursorDatabase } from "./cursor-harness.js";

/**
 * A59 [PROP] (SH-1; P9 retargeted, Law W1 of `Formal/STORAGE_ALGEBRA.md` §3): for random sequences of writes over
 * heights, reading a cursor-table key returns its last write — on PostgreSQL 18 and PGlite 0.5.10.
 *
 * A sequence is a list of blocks at consecutive heights, each a list of writes (a key from a small set, so that keys
 * are written again within a block and across blocks, and a canonical JSON value) through the module's block write
 * handle, as `on-db-write` makes them; some blocks fail after their writes, so they roll back and the height is written
 * again by the next block, as the runner retries a height. The model is a map holding each key's last write of the
 * committed blocks. The property: inside a block, reading a key through the block's handle returns the write just made
 * (DB-3: the handle reads the block's own writes); after each block, a read at the committed height reports that height
 * and returns, for every key, the model's value — the last committed write — or nothing for a key never written.
 *
 * 0.9.5's P9 (`test/postgres/watermarks.property.test.ts`, on `PgWatermarks`) stays as it is while that class does
 * (task 17.2 retires both); this is its retargeting onto the helper (`design.md` §13).
 *
 * The committed negative control: a helper that keeps a key's first write instead of its last fails the property.
 */

const SEED = 20261026;

/** Keys of one sequence: few, so that writes meet; case and a non-ASCII letter, compared as text by bytes. */
const KEYS = ["a", "b", "B", "é", ""] as const;

const text = fc.string({ unit: "grapheme", maxLength: 6 }).filter((s) => !s.includes("\u0000"));

/** A canonical JSON value (DT-1, owner decision Q57): integers only, within the signed 64-bit range. */
const { value } = fc.letrec<{ value: CursorValue }>((tie) => ({
  value: fc.oneof(
    { depthSize: "small", maxDepth: 3 },
    fc.constant(null),
    fc.boolean(),
    fc.integer(),
    fc.bigInt({ min: -(2n ** 63n), max: 2n ** 63n - 1n }),
    text,
    fc.array(tie("value"), { maxLength: 3 }),
    fc.dictionary(text, tie("value"), { maxKeys: 3, noNullPrototype: true }),
  ),
}));

interface Write {
  readonly key: (typeof KEYS)[number];
  readonly value: CursorValue;
}

interface Block {
  readonly writes: readonly Write[];
  /** The block fails after its writes, and rolls back. */
  readonly fails: boolean;
}

const block: fc.Arbitrary<Block> = fc.record({
  writes: fc.array(fc.record({ key: fc.constantFrom(...KEYS), value }), { maxLength: 5 }),
  fails: fc.oneof({ arbitrary: fc.constant(false), weight: 4 }, { arbitrary: fc.constant(true), weight: 1 }),
});

const sequences = fc.array(block, { minLength: 1, maxLength: 10 });

/**
 * A value as a read gives it back (DB-2): the database API's lossless reader gives an integer within ±(2^53 − 1) as a
 * `number` and one beyond as a `bigint`; objects come back as plain objects.
 */
function readBack(written: CursorValue): CursorValue {
  if (typeof written === "bigint") {
    return written >= BigInt(Number.MIN_SAFE_INTEGER) && written <= BigInt(Number.MAX_SAFE_INTEGER)
      ? Number(written)
      : written;
  }
  if (Array.isArray(written)) return written.map(readBack);
  if (written !== null && typeof written === "object") {
    return Object.fromEntries(Object.entries(written).map(([key, member]) => [key, readBack(member as CursorValue)]));
  }
  return written;
}

/** `actual` is what reading a key must give: nothing for a key never written, else its last write as read back. */
function expectValue(actual: CursorValue | undefined, written: CursorValue | undefined): void {
  if (written === undefined) expect(actual).toBeUndefined();
  else expect(actual).toEqual(readBack(written));
}

/** What a sequence did, so that the property's runs can be shown not to be vacuous. */
interface Counts {
  /** Writes in committed blocks of a key the committed data already held. */
  overwrites: number;
  /** Writes in committed blocks of a key the same block had already written. */
  rewritesInBlock: number;
  /** Writes in blocks that rolled back. */
  rolledBack: number;
  /** Reads checked after blocks. */
  reads: number;
}

class BlockFails extends Error {}

/** The read and write functions under test: the helper's, or a negative control's. */
type Access = Pick<CursorTable, "read" | "write">;

let sequenceNumber = 0;

/** Runs `sequence` through `access` on `database` and checks the property (see the module comment). */
async function holds(
  database: CursorDatabase,
  access: Access,
  sequence: readonly Block[],
  counts: Counts,
): Promise<void> {
  sequenceNumber++;
  const keyOf = (key: string) => `sequence-${sequenceNumber}/${key}`;
  let model = new Map<string, CursorValue>();
  for (const { writes, fails } of sequence) {
    const pending = new Map(model);
    const inBlock = new Set<string>();
    const ran = database.block(async (w) => {
      for (const { key, value: written } of writes) {
        await access.write(w, keyOf(key), written);
        if (!fails) {
          if (inBlock.has(key)) counts.rewritesInBlock++;
          else if (model.has(key)) counts.overwrites++;
        } else {
          counts.rolledBack++;
        }
        inBlock.add(key);
        pending.set(key, written);
        expectValue(await access.read(w, keyOf(key)), written);
      }
      if (fails) throw new BlockFails("the block fails after its writes");
    });
    if (fails) {
      await expect(ran).rejects.toBeInstanceOf(BlockFails);
    } else {
      await ran;
      model = pending;
    }
    await database.db.read(async (read) => {
      expect(read.height).toBe(database.committed);
      for (const key of KEYS) {
        expectValue(await access.read(read, keyOf(key)), model.get(key));
        counts.reads++;
      }
    });
  }
}

/** A value's text with object keys sorted and `bigint`s marked, so that equal values as read back have equal texts. */
function canonicalText(written: CursorValue): string {
  const sorted = (v: CursorValue): unknown => {
    if (typeof v === "bigint") return `${v}n`;
    if (Array.isArray(v)) return v.map(sorted);
    if (v !== null && typeof v === "object") {
      return Object.fromEntries(
        Object.keys(v)
          .sort()
          .map((key) => [key, sorted((v as Record<string, CursorValue>)[key] as CursorValue)]),
      );
    }
    return v;
  };
  return JSON.stringify(sorted(readBack(written)));
}

/**
 * True if some write of `sequence` gives a key another value than the one it held then — committed earlier, or written
 * earlier in the same block — else no helper could fail by keeping a key's first write.
 */
function rewritesAKey(sequence: readonly Block[]): boolean {
  let committed = new Map<string, string>();
  for (const { writes, fails } of sequence) {
    const current = new Map(committed);
    for (const { key, value: written } of writes) {
      const text = canonicalText(written);
      const before = current.get(key);
      if (before !== undefined && before !== text) return true;
      current.set(key, text);
    }
    if (!fails) committed = current;
  }
  return false;
}

/** Negative control: a cursor table that keeps each key's first write (an insert that does nothing on a conflict). */
const keepsFirst: Access = {
  read: (handle, key) => CURSORS.read(handle, key),
  async write(w, key, written) {
    await w.execute(
      `INSERT INTO "wallet_scan"."cursors" (key, value) VALUES ($1, ($2::jsonb) -> 'value') ` +
        "ON CONFLICT (key) DO NOTHING",
      [key, { value: written }],
    );
  },
};

// The suite starts a database and runs about 40 sequences of up to 10 blocks; under the full parallel conformance run
// (load average 20-35) a run of the property takes tens of seconds, so each test has 10 minutes.
const TITLE = "A59: the cursor table returns each key's last write, on $name (SH-1, P9)";

describe.each(BACKENDS)(TITLE, { timeout: 600_000 }, (backend) => {
  let database: CursorDatabase;

  beforeAll(async () => {
    await backend.start();
    database = await cursorDatabase(backend);
  }, 180_000);

  afterAll(() => backend.stop(), 60_000);

  it(`holds for random sequences of writes over heights, blocks rolling back among them (seed ${SEED})`, async () => {
    const counts: Counts = { overwrites: 0, rewritesInBlock: 0, rolledBack: 0, reads: 0 };
    await fc.assert(
      fc.asyncProperty(sequences, (sequence) => holds(database, CURSORS, sequence, counts)),
      { seed: SEED, numRuns: 40 },
    );
    // Not vacuous: keys were written again across blocks and within one, and rolled-back writes were left out.
    expect(counts.overwrites).toBeGreaterThan(40);
    expect(counts.rewritesInBlock).toBeGreaterThan(20);
    expect(counts.rolledBack).toBeGreaterThan(20);
    expect(counts.reads).toBeGreaterThan(500);
  });

  it("negative control: a cursor table that keeps each key's first write fails the property", async () => {
    const counts: Counts = { overwrites: 0, rewritesInBlock: 0, rolledBack: 0, reads: 0 };
    const result = await fc.check(
      fc.asyncProperty(sequences, (sequence) => holds(database, keepsFirst, sequence, counts)),
      { seed: SEED, numRuns: 40, endOnFailure: true },
    );
    expect(result.failed).toBe(true);
    expect(rewritesAKey(result.counterexample?.[0] as readonly Block[])).toBe(true);
  });
});
