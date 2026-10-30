import fc from "fast-check";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ReadHandle } from "../../src/db/api.js";
import { BACKENDS, TEST_CURSOR, TEST_SCHEMA, type TestBackend, type TestDatabase } from "./backends.js";

/**
 * For random interleavings of a writer committing heights and readers running multi-statement reads, every read
 * handle's statements see one height, and the handle reports it. This holds on every backend of `backends.ts`.
 * [A8 PROP, DB-2]
 *
 * An interleaving is a list of steps in the order they are asked for: the writer commits the next height (one
 * transaction writing `t.blocks` and `t.rows`), or reader r opens a read, runs one statement in it, or ends it. A
 * reader's statements cycle through three that see the height in different ways (the maximum of each table and the
 * row count), so a statement that saw a later commit disagrees with the handle.
 *
 * Each step is asked for as soon as it comes, and the harness waits for it only when it can finish:
 * - On PostgreSQL always: the writer commits while reads are open, so every step finishes at once. [DB-5]
 * - On PGlite every read and every commit is a job of one queue, run one at a time in the order asked for: a
 *   commit asked for while a read is open waits until that read ends, a read asked for after it waits for the commit,
 *   and a statement of a read still waiting runs when the read starts. The harness keeps the same queue as a model
 *   and waits for a step only when the model says it can run, so it never waits inside a read for a commit queued
 *   behind it. [DB-4]
 * A read must report the number of heights committed when it started (by the model, on PGlite) and every statement
 * must see that height. Two negative controls run the same property on handles that do not pin one snapshot — on
 * PGlite, a handle whose statements are separate queue jobs, and one whose height is read in a job of its own — and
 * must fail it.
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

/** A read asked for by the harness; its body runs one command at a time, as the harness sends them. */
class HeldRead {
  reported: bigint | null = null;
  /** The height the model says the read must see: the commits that finished before it started. */
  expected: bigint | null = null;
  readonly seen: (bigint | null)[] = [];
  /** Commands waiting until the read runs (PGlite: until it reaches the head of the queue). */
  readonly waiting: ("statement" | "end")[] = [];
  started = false;
  ended = false;
  private next: ((command: { end: boolean; done: () => void }) => void) | undefined;
  private readonly opened: Promise<void>;
  readonly finished: Promise<void>;

  constructor(reads: Reads) {
    let ready!: () => void;
    this.opened = new Promise<void>((resolve) => {
      ready = resolve;
    });
    this.finished = reads(async (read) => {
      this.reported = read.height;
      for (let index = 0; ; index++) {
        const command = await new Promise<{ end: boolean; done: () => void }>((resolve) => {
          this.next = resolve;
          if (index === 0) ready();
        });
        if (command.end) return command.done();
        const [row] = await read.query(STATEMENTS[index % STATEMENTS.length] as string);
        this.seen.push((row?.height ?? null) as bigint | null);
        command.done();
      }
    });
    // A read that fails before its body starts must not leave the harness waiting.
    this.finished.catch(() => ready());
  }

  /** Waits until the body runs, and records the model's height for it. */
  async start(committed: bigint): Promise<void> {
    await this.opened;
    this.started = true;
    this.expected = committed === 0n ? null : committed;
  }

  /** Runs one command in the body; for `end`, waits until the read has ended. */
  async send(command: "statement" | "end"): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.finished.catch(reject);
      this.next?.({ end: command === "end", done: resolve });
    });
    if (command === "end") {
      await this.finished;
      this.ended = true;
    }
  }
}

/** What a run of the steps gave: every read, and how many commits were asked for while a read was open. */
interface Outcome {
  readonly reads: readonly HeldRead[];
  readonly commitsWhileOpen: number;
}

/** Asks for `steps` in order and waits for each step as `backend`'s scheduling allows (see the module comment). */
async function run(backend: TestBackend, database: TestDatabase, reads: Reads, steps: readonly Step[]): Promise<Outcome> {
  await database.exec("TRUNCATE t.blocks, t.rows");
  let asked = 0n;
  const commit = (): Promise<void> => {
    const height = ++asked;
    return database.db.transaction(async (tx) => {
      await tx.execute("INSERT INTO t.blocks VALUES ($1)", [height]);
      await tx.execute("INSERT INTO t.rows VALUES ($1, 'row')", [height]);
    });
  };
  return (backend.singleQueue ? queued : concurrent)(reads, steps, commit);
}

/** PostgreSQL: every step finishes at once, so the harness waits for each before asking for the next. [DB-5] */
async function concurrent(reads: Reads, steps: readonly Step[], commit: () => Promise<void>): Promise<Outcome> {
  let committed = 0n;
  let commitsWhileOpen = 0;
  const open = new Map<number, HeldRead>();
  const all: HeldRead[] = [];
  const opening = async (reader: number) => {
    const read = new HeldRead(reads);
    open.set(reader, read);
    all.push(read);
    await read.start(committed);
    return read;
  };
  for (const s of steps) {
    if (s.kind === "commit") {
      if (open.size > 0) commitsWhileOpen++;
      await commit();
      committed++;
      continue;
    }
    const current = open.get(s.reader);
    if (s.kind === "open") {
      if (current === undefined) await opening(s.reader);
      else await current.send("statement");
    } else if (s.kind === "statement") {
      await (current ?? (await opening(s.reader))).send("statement");
    } else if (current !== undefined) {
      await current.send("end");
      open.delete(s.reader);
    }
  }
  for (const read of open.values()) await read.send("end");
  return { reads: all, commitsWhileOpen };
}

type Job = { readonly kind: "commit"; readonly done: Promise<void> } | { readonly kind: "read"; readonly read: HeldRead };

/**
 * PGlite: the harness keeps the backend's one queue as a model (jobs in the order asked for, the head running) and
 * waits only for the head. A commit at the head finishes. A read at the head starts, runs the commands sent to it so
 * far, and stays at the head until it is ended, holding every job behind it. [DB-4]
 */
async function queued(reads: Reads, steps: readonly Step[], commit: () => Promise<void>): Promise<Outcome> {
  let committed = 0n;
  let commitsWhileOpen = 0;
  const queue: Job[] = [];
  const open = new Map<number, HeldRead>();
  const all: HeldRead[] = [];
  const drain = async () => {
    for (let head = queue[0]; head !== undefined; head = queue[0]) {
      if (head.kind === "commit") {
        await head.done;
        committed++;
      } else {
        const read = head.read;
        if (!read.started) await read.start(committed);
        for (let command = read.waiting.shift(); command !== undefined; command = read.waiting.shift()) {
          await read.send(command);
        }
        if (!read.ended) return;
      }
      queue.shift();
    }
  };
  const reading = (reader: number): HeldRead => {
    let read = open.get(reader);
    if (read === undefined) {
      // Asked for now, so the backend's queue holds it in the same place as the model's.
      read = new HeldRead(reads);
      open.set(reader, read);
      all.push(read);
      queue.push({ kind: "read", read });
    }
    return read;
  };
  for (const s of steps) {
    if (s.kind === "commit") {
      if (open.size > 0) commitsWhileOpen++;
      queue.push({ kind: "commit", done: commit() });
    } else if (s.kind === "open") {
      if (open.has(s.reader)) reading(s.reader).waiting.push("statement");
      else reading(s.reader);
    } else if (s.kind === "statement") {
      reading(s.reader).waiting.push("statement");
    } else {
      open.get(s.reader)?.waiting.push("end");
      open.delete(s.reader);
    }
    await drain();
  }
  for (const read of open.values()) read.waiting.push("end");
  await drain();
  return { reads: all, commitsWhileOpen };
}

/** The property: each read reports the height committed when it started, and each of its statements saw that height. */
function holds(reads: readonly HeldRead[]): boolean {
  return reads.every((read) => read.reported === read.expected && read.seen.every((seen) => seen === read.reported));
}

// `size: "max"` draws lengths up to 30 evenly; fast-check's default ("small") keeps them near 10, too short for reads to
// run many statements or for commits to land while they are open.
const steps = fc.array(step, { minLength: 1, maxLength: 30, size: "max" });

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
      let statements = 0;
      let commitsWhileOpen = 0;
      await fc.assert(
        fc.asyncProperty(steps, async (s) => {
          const outcome = await run(backend, database, api, s);
          for (const read of outcome.reads) {
            expect(read.reported).toBe(read.expected);
            for (const seen of read.seen) expect(seen).toBe(read.reported);
            statements += read.seen.length;
          }
          commitsWhileOpen += outcome.commitsWhileOpen;
        }),
        { seed: SEED, numRuns: 80 },
      );
      // Not vacuous: reads ran statements, and commits were asked for while a read was open.
      expect(statements).toBeGreaterThan(200);
      expect(commitsWhileOpen).toBeGreaterThan(50);
    }, 180_000);

    it("negative control: a handle whose statements each read the latest commit fails the property", async () => {
      // Each statement is a read of its own: on PGlite, a job of its own in the queue.
      const unpinned: Reads = async (body) => {
        const height = await database.db.read(async (read) => read.height);
        await body({ height, query: (sql, params) => database.db.read((read) => read.query(sql, params)) });
      };
      const result = await fc.check(
        fc.asyncProperty(steps, async (s) => holds((await run(backend, database, unpinned, s)).reads)),
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
      const { reads } = await run(backend, database, late, [{ kind: "commit" }, { kind: "statement", reader: 0 }]);
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
