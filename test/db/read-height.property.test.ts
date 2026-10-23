import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle } from "../../src/db/api.js";
import { BACKENDS, TEST_CURSOR, TEST_SCHEMA, type TestDatabase } from "./backends.js";

/**
 * A8 [PROP] (DB-2): for random interleavings of a writer committing heights and readers running multi-statement reads,
 * every read handle's statements see one height, and the handle reports it — on every backend of `backends.ts`.
 *
 * An interleaving is a list of steps run one after another, each awaited: the writer commits the next height (one
 * transaction writing `t.blocks` and `t.rows`), or reader r opens a read, runs one statement in it, or ends it. A
 * reader's statements cycle through three that see the height in different ways (the maximum of each table and the
 * row count), so a statement that saw a later commit disagrees with the handle. Two negative controls run the same
 * property on handles that do not pin one snapshot, and must fail it.
 */

const SEED = 20261023;
const READERS = 3;

type Step =
  | { readonly kind: "commit" }
  | { readonly kind: "open" | "statement" | "end"; readonly reader: number };

const step: fc.Arbitrary<Step> = fc.oneof(
  fc.constant<Step>({ kind: "commit" }),
  fc.record({ kind: fc.constantFrom("open" as const, "statement" as const, "end" as const), reader: fc.nat(READERS - 1) }),
);

const STATEMENTS = [
  "SELECT max(height) AS height FROM t.blocks",
  "SELECT max(height) AS height FROM t.rows",
  "SELECT nullif(count(*), 0) AS height FROM t.rows",
] as const;

/** Something that runs a body with a read handle: the database API, or one of the negative controls. */
type Reads = (body: (read: ReadHandle) => Promise<void>) => Promise<void>;

interface OpenRead {
  readonly reported: bigint | null;
  readonly expected: bigint | null;
  readonly seen: (bigint | null)[];
  statement(): Promise<void>;
  end(): Promise<void>;
}

/** A read held open between steps: its body waits for each command. */
async function openRead(reads: Reads, expected: bigint | null): Promise<OpenRead> {
  type Command = { readonly end: boolean; readonly done: () => void };
  let next: ((command: Command) => void) | undefined;
  let reported: bigint | null = null;
  const seen: (bigint | null)[] = [];
  let ready!: () => void;
  const opened = new Promise<void>((resolve) => {
    ready = resolve;
  });
  const finished = reads(async (read) => {
    reported = read.height;
    for (let index = 0; ; index++) {
      const command = await new Promise<Command>((resolve) => {
        next = resolve;
        if (index === 0) ready();
      });
      if (command.end) return command.done();
      const [row] = await read.query(STATEMENTS[index % STATEMENTS.length] as string);
      seen.push((row?.height ?? null) as bigint | null);
      command.done();
    }
  });
  await Promise.race([opened, finished]);
  const send = (end: boolean) =>
    new Promise<void>((resolve, reject) => {
      finished.catch(reject);
      next?.({ end, done: resolve });
    });
  return {
    get reported() {
      return reported;
    },
    expected,
    seen,
    statement: () => send(false),
    end: async () => {
      await send(true);
      await finished;
    },
  };
}

/** Runs `steps`; returns every read's reported height, the height committed when it opened, and what it saw. */
async function run(database: TestDatabase, reads: Reads, steps: readonly Step[]) {
  await database.exec("TRUNCATE t.blocks, t.rows");
  let committed = 0n;
  const open = new Map<number, OpenRead>();
  const finished: OpenRead[] = [];
  const commit = async () => {
    const height = committed + 1n;
    await database.db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'row')", [height]);
    });
    committed = height;
  };
  const opening = async (reader: number) => {
    const read = await openRead(reads, committed === 0n ? null : committed);
    open.set(reader, read);
    return read;
  };
  for (const s of steps) {
    if (s.kind === "commit") {
      await commit();
      continue;
    }
    const current = open.get(s.reader);
    if (s.kind === "open") {
      if (current === undefined) await opening(s.reader);
      else await current.statement();
    } else if (s.kind === "statement") {
      await (current ?? (await opening(s.reader))).statement();
    } else if (current !== undefined) {
      await current.end();
      open.delete(s.reader);
      finished.push(current);
    }
  }
  for (const read of open.values()) {
    await read.end();
    finished.push(read);
  }
  return finished;
}

/** The property: each read reports the height committed when it opened, and each of its statements saw that height. */
function holds(reads: readonly OpenRead[]): boolean {
  return reads.every((read) => read.reported === read.expected && read.seen.every((seen) => seen === read.reported));
}

const steps = fc.array(step, { minLength: 1, maxLength: 30 });

for (const backend of BACKENDS) {
  describe(`A8 (DB-2) — a read handle sees one height and reports it, on ${backend.name}`, () => {
    let database: TestDatabase;

    beforeAll(async () => {
      await backend.start();
      database = await backend.database(TEST_SCHEMA, TEST_CURSOR);
    }, 180_000);

    afterAll(() => backend.stop(), 60_000);

    const api: Reads = (body) => database.db.read(body);

    it("holds for random interleavings of commits and multi-statement reads (property, seed 20261023)", async () => {
      await fc.assert(
        fc.asyncProperty(steps, async (s) => {
          const reads = await run(database, api, s);
          for (const read of reads) {
            expect(read.reported).toBe(read.expected);
            for (const seen of read.seen) expect(seen).toBe(read.reported);
          }
        }),
        { seed: SEED, numRuns: 80 },
      );
    }, 180_000);

    it("negative control: a handle whose statements each read the latest commit fails the property", async () => {
      const unpinned: Reads = async (body) => {
        const height = await database.db.read(async (read) => read.height);
        await body({ height, query: (sql, params) => database.db.read((read) => read.query(sql, params)) });
      };
      const result = await fc.check(
        fc.asyncProperty(steps, async (s) => holds(await run(database, unpinned, s))),
        { seed: SEED, numRuns: 80 },
      );
      expect(result.failed).toBe(true);
      const counterexample = result.counterexample?.[0] as readonly Step[];
      expect(counterexample.some((s) => s.kind === "commit")).toBe(true);
    }, 180_000);

    it("negative control: a handle that reads its height outside its snapshot fails the property", async () => {
      let between: (() => Promise<void>) | undefined;
      const late: Reads = async (body) => {
        const height = await database.db.read(async (read) => read.height);
        await between?.();
        await database.db.read((read) => body({ height, query: (sql, params) => read.query(sql, params) }));
      };
      // A commit lands between reading the height and opening the snapshot; the property sees it as a wrong height.
      between = async () => {
        between = undefined;
        await database.db.transaction(async (tx) => {
          const [row] = await tx.query("SELECT coalesce(max(height), 0) + 1 AS next FROM t.blocks");
          await tx.execute("INSERT INTO t.blocks VALUES ($1)", [row?.next]);
          await tx.execute("INSERT INTO t.rows VALUES ($1, 'row')", [row?.next]);
        });
      };
      const reads = await run(database, late, [{ kind: "commit" }, { kind: "statement", reader: 0 }]);
      expect(holds(reads)).toBe(false);
      expect(reads[0]?.reported).toBe(1n);
      expect(reads[0]?.seen).toEqual([2n]);
    }, 60_000);

    it("holds while readers and the writer run at the same time", async () => {
      await database.exec("TRUNCATE t.blocks, t.rows");
      let writing = true;
      const writer = (async () => {
        for (let height = 1n; height <= 40n; height++) {
          await database.db.transaction(async (tx) => {
            await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
            await tx.execute("INSERT INTO t.rows VALUES ($1, 'row')", [height]);
          });
        }
        writing = false;
      })();
      const reader = async () => {
        let reads = 0;
        let last: bigint | null = null;
        while (writing || reads < 3) {
          await database.db.read(async (read) => {
            for (const sql of STATEMENTS) {
              const [row] = await read.query(sql);
              expect(row?.height ?? null).toBe(read.height);
            }
            if (last !== null) expect(read.height).not.toBeNull();
            if (last !== null && read.height !== null) expect(read.height >= last).toBe(true);
            last = read.height;
          });
          reads++;
        }
        return reads;
      };
      const counts = await Promise.all([reader(), reader(), reader(), writer.then(() => 0)]);
      expect(counts.slice(0, 3).every((n) => n >= 3)).toBe(true);
    }, 120_000);
  });
}
