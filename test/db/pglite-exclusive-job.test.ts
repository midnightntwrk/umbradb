import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { exclusiveJob, openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { askedLater } from "./backends.js";
import { connectionOfUrl } from "./connection.js";

/**
 * The PGlite backend's exclusive job (`exclusiveJob`, `src/db/pglite.ts`): one job of the database's queue whose body
 * reads committed data and uses the engine itself. A PGlite backup's manifest and its `pg_dump` of
 * `@electric-sql/pglite-tools` run in it, so that nothing commits between them. [DB-4, BK-1]
 *
 * The tests check that:
 * - a transaction asked for while the job runs waits until it ends;
 * - what the body leaves on the one session (a setting, an open transaction) never reaches a later job;
 * - a call of the database's own `read` from inside the job is refused by the guard against calls from inside a
 *   running job; [Q73]
 * - a database that is not a PGlite one has no exclusive job.
 *
 * Each database is the backend's own, opened with `openPglite` on `memory://` (the job is registered on the database
 * the backend opened).
 */

/** A height of the tests' own: the rows of `t`. */
const rows = async (read: { query(sql: string): Promise<Record<string, unknown>[]> }) =>
  BigInt((await read.query("SELECT count(*)::int AS n FROM t"))[0]?.n as number);

/** A new in-memory PGlite database with the table `t`. */
async function newDatabase(): Promise<Database> {
  const opened = await openPglite({ dataDir: "memory://", committedHeight: rows, developmentOptIn: true });
  await opened.transaction((tx) => tx.execute("CREATE TABLE t (k bigint PRIMARY KEY)"));
  return opened;
}

let db: Database;

beforeAll(async () => {
  db = await newDatabase();
});

afterAll(async () => {
  await db?.close();
});

const settingOf = async (name: string): Promise<string> =>
  db.transaction(async (tx) => (await tx.query(`SELECT current_setting('${name}') AS v`))[0]?.v as string);

describe("the PGlite exclusive job (DB-4, BK-1)", () => {
  it("runs as one job: a transaction asked for meanwhile commits only after it, and its reads see one height", async () => {
    await db.transaction((tx) => tx.execute("INSERT INTO t (k) VALUES (1)"));
    const order: string[] = [];
    // Asked for from outside the job (a writer elsewhere), once the job has read its first height.
    const later = askedLater(() => db.transaction((tx) => tx.execute("INSERT INTO t (k) VALUES (2)")));
    const result = await exclusiveJob(db, async ({ read }) => {
      const first = await read(async (r) => r.height);
      later.gate();
      order.push("job");
      // Let the transaction asked for run if it could: it cannot, the job holds the queue.
      await new Promise((resolve) => setTimeout(resolve, 50));
      const second = await read(async (r) => r.height);
      return [first, second];
    });
    order.push("after");
    expect(result).toEqual([1n, 1n]);
    expect(await later.result).toBe(1);
    expect(order).toEqual(["job", "after"]);
    expect(await db.read(async (r) => r.height)).toBe(2n);
  });

  it("leaves nothing of what its body did on the session: settings reset, a transaction left open rolled back", async () => {
    expect(await settingOf("extra_float_digits")).toBe("1");
    await exclusiveJob(db, async ({ engine }) => {
      await engine.exec("SET extra_float_digits = 3; SET synchronize_seqscans = off; BEGIN; INSERT INTO t (k) VALUES (99)");
      expect(engine.isInTransaction()).toBe(true);
    });
    expect(await settingOf("extra_float_digits")).toBe("1");
    expect(await settingOf("synchronize_seqscans")).toBe("on");
    expect(await db.read(async (r) => r.query("SELECT k FROM t WHERE k = 99"))).toEqual([]);
  });

  it("refuses the database's own read from inside it, and a read handle after the job ended", async () => {
    let kept: ((body: (r: { readonly height: bigint | null }) => Promise<unknown>) => Promise<unknown>) | undefined;
    const nested = await exclusiveJob(db, async ({ read }) => {
      kept = read;
      return db.read(async () => "ran").then(
        () => null,
        (error: unknown) => error,
      );
    });
    expect(nested).toMatchObject({ code: "database-error", details: { reason: "nested-call" } });
    await expect(kept?.(async () => "ran")).rejects.toMatchObject({ code: "handle-closed" });
  });

  it("passes its body's error on, the session reset and the queue running on", async () => {
    const failure = new Error("the body failed");
    await expect(
      exclusiveJob(db, async ({ engine }) => {
        await engine.exec("SET extra_float_digits = 2");
        throw failure;
      }) as Promise<unknown>,
    ).rejects.toBe(failure);
    expect(await settingOf("extra_float_digits")).toBe("1");
  });

  it("is null for a database that is not a PGlite one", async () => {
    const postgres = openPostgres({ connection: connectionOfUrl("postgres://u:p@127.0.0.1:1/x"), committedHeight: async () => null });
    try {
      expect(exclusiveJob(postgres, async () => "ran")).toBeNull();
    } finally {
      await postgres.close();
    }
  });

  it("refuses once the database is closed, and a close waits for a running job", async () => {
    const own = await newDatabase();
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let entered!: () => void;
    const inside = new Promise<void>((resolve) => {
      entered = resolve;
    });
    const job = exclusiveJob(own, async ({ engine }) => {
      entered();
      await held;
      return (await engine.query<{ one: number }>("SELECT 1 AS one")).rows[0]?.one;
    });
    await inside;
    const closing = own.close();
    release();
    expect(await job).toBe(1);
    await closing;
    await expect(exclusiveJob(own, async () => "ran") as Promise<unknown>).rejects.toMatchObject({ code: "handle-closed" });
  });
});
