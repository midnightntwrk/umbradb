import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import type { BlockWriteHandle, Database, SchemaWriteHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type MigrationPart, startDatabase } from "../../src/db/migrate.js";
import { runMultiStatement } from "../../src/db/multi-statement.js";
import { planSchemas, type SchemaModule, type SchemaPlan, setModuleRole } from "../../src/db/roles.js";
import {
  type BlockWrites,
  openBlockWrites,
  runOnStartDb,
  type WriteHandleOptions,
} from "../../src/db/write-handles.js";
import { MIGRATION_MARK } from "../../src/deterministic-postgresql/index.js";
import { askedLater, BACKENDS, settlesWithin } from "./backends.js";

/**
 * The write handles of DB-3 and their closing (task 2.6; A10), on both backends. A block write handle is what one
 * part's `on-db-write` gets inside the block transaction, under the part's role (DB-6; a shared item's provider under
 * the item's, Q89; UmbraDB's own parts as the writer's login); a schema write handle is what its `on-start-db` gets, in
 * a transaction of its own (`src/db/migrate.ts` runs it after the part's migrations). Each closes when its callback
 * returns or throws: every later use — from a stored reference, from a timer, while the block transaction is still
 * open or after it ended — fails at once with `handle-closed`, never reaches the database, never runs under the role
 * of the part that runs now, and is reported to the runner (`onClosedUse`), which turns it into the `callback-error`
 * halt (RN-8): that half of A10, "which halts processing", is the runner's (task 5.x).
 *
 * The runner's loop over the parts (RN-3's order, task 3.2/5.x) is played here by the test calling
 * {@link BlockWrites.write} once per part inside one transaction of the database API, as the runner will.
 */

/** The parts: two modules, a provider of a shared `table` item (Q89), each with one table. */
const MODULES: readonly (SchemaModule & MigrationPart)[] = [
  tablePart("a", "a"),
  tablePart("b", "b"),
  { ...tablePart("p", "shared_s"), provides: [{ name: "shared-s", table: { schema: "shared_s", tables: ["t"] } }] },
];

function tablePart(id: string, schema: string): SchemaModule & MigrationPart {
  return {
    id,
    version: "1.0.0",
    requires: [],
    provides: [{ name: `${id}-rows`, table: { schema, tables: ["t"] } }],
    migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.t (k bigint PRIMARY KEY, who text NOT NULL)` }],
  };
}

/** Each write records the role it ran under. */
const insert = (schema: string) => `INSERT INTO ${schema}.t (k, who) VALUES ($1::bigint, current_user)`;
const INSERT_A = insert("a");
const INSERT_B = insert("b");

const NO_HANDLES: WriteHandleOptions = { height: null };

async function failure(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  throw new Error("expected an UmbraError, but the call resolved");
}

/** What `run` rejects with, or "resolved". */
function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

/** A10's error: `handle-closed`, not retryable, naming the handle, the part and the point. */
function expectWriteHandleClosed(
  error: unknown,
  handle: "block-write" | "schema-write",
  part: string,
  point: "on-db-write" | "on-start-db",
): void {
  expect(error).toBeInstanceOf(UmbraError);
  const closed = error as UmbraError;
  expect(closed.code).toBe("handle-closed");
  expect(closed.retryable).toBe(false);
  expect(closed.details).toEqual({ handle, module: part, point });
  expect(closed.message).toContain(point);
  expect(closed.message).toContain(part);
}

async function rows(db: Database, table: string): Promise<Record<string, unknown>[]> {
  return db.read((read) => read.query(`SELECT k, who FROM ${table} ORDER BY k`));
}

/** Opens a block's `on-db-write` calls on a transaction: the real one, or a deliberately wrong one (negative controls). */
type BlockOpener = (tx: Transaction, plan: SchemaPlan, options: WriteHandleOptions) => BlockWrites;

/** Runs `body` as one block: one transaction of the database API, its `on-db-write` calls opened by `open`. */
function block<T>(
  db: Database,
  plan: SchemaPlan,
  body: (writes: BlockWrites, tx: Transaction) => Promise<T>,
  options: WriteHandleOptions = { height: 4n },
  open: BlockOpener = openBlockWrites,
): Promise<T> {
  return db.transaction((tx) => body(open(tx, plan, options), tx));
}

/**
 * A10's check while the block transaction is still open: `a`'s block write handle, kept, is used in `b`'s callback to
 * write `b`'s table — which `b`'s role, active now, may write. It must fail at once with `handle-closed`, and nothing it
 * asked for may land; `b`'s own write through its own handle must.
 */
async function expectClosedInNextCallback(db: Database, plan: SchemaPlan, open: BlockOpener): Promise<void> {
  let kept: BlockWriteHandle | undefined;
  let result: unknown;
  await block(
    db,
    plan,
    async (writes) => {
      await writes.write("a", async (w) => {
        kept = w;
      });
      await writes.write("b", async (w) => {
        const use = (kept as BlockWriteHandle).execute(INSERT_B, [7]);
        // On PGlite this runs inside the block's own job: a use that waited in the queue would never settle.
        expect(await settlesWithin(use, 1_000)).toBe(true);
        result = await outcome(use);
        await w.execute(INSERT_B, [8]);
      });
    },
    { height: 4n },
    open,
  );
  expect(result).toBeInstanceOf(UmbraError);
  expectWriteHandleClosed(result, "block-write", "a", "on-db-write");
  expect(await rows(db, "b.t")).toEqual([{ k: 8n, who: "umbradb_m_b" }]);
}

/** The role check: each part's callback runs under its own write role, and the block returns to the login after it. */
async function expectOwnRoles(db: Database, plan: SchemaPlan, login: string, open: BlockOpener): Promise<void> {
  const seen: [string, unknown][] = [];
  await block(
    db,
    plan,
    async (writes, tx) => {
      for (const part of ["a", "b", "p", "core-digest"]) {
        await writes.write(part, async (w) => {
          const [row] = await w.query("SELECT current_user AS role");
          seen.push([part, row?.role]);
        });
        const [between] = await tx.query("SELECT current_user AS role");
        seen.push(["between", between?.role]);
      }
    },
    { height: 4n },
    open,
  );
  expect(seen).toEqual([
    ["a", "umbradb_m_a"],
    ["between", login],
    ["b", "umbradb_m_b"],
    ["between", login],
    ["p", "umbradb_i_shared_s"],
    ["between", login],
    ["core-digest", login],
    ["between", login],
  ]);
}

/**
 * Negative control: a block whose write handles forward to the transaction and never close — roles set and reset as
 * the real one does. A10's check must fail on it.
 */
const staysOpen: BlockOpener = (tx, plan, options) => ({
  async write(part, callback) {
    await setModuleRole(tx, plan, part);
    const result = await callback({
      height: options.height,
      query: (sql, params) => tx.query(sql, params),
      execute: (sql, params) => tx.execute(sql, params),
    });
    await tx.execute("RESET ROLE");
    return result;
  },
});

/**
 * Negative control: a block that sets the role for its first callback only and keeps it — its handles close as the
 * real ones do. The role check must fail on it.
 */
const keepsFirstRole: BlockOpener = (tx, plan, options) => {
  let first = true;
  return {
    async write(part, callback) {
      if (first) await setModuleRole(tx, plan, part);
      first = false;
      let open = true;
      const closed = () => new UmbraError("handle-closed", "closed", { handle: "block-write", module: part, point: "on-db-write" });
      try {
        return await callback({
          height: options.height,
          query: async (sql, params) => {
            if (!open) throw closed();
            return tx.query(sql, params);
          },
          execute: async (sql, params) => {
            if (!open) throw closed();
            return tx.execute(sql, params);
          },
        });
      } finally {
        open = false;
      }
    },
  };
};

describe("the write handles' types (CORE-ARCH §4.10, DB-3)", () => {
  it("gives on-db-write a BlockWriteHandle and on-start-db a SchemaWriteHandle, nothing else", () => {
    expectTypeOf<Parameters<BlockWrites["write"]>[1]>().parameter(0).toEqualTypeOf<BlockWriteHandle>();
    expectTypeOf<Parameters<typeof runOnStartDb>[4]>().parameter(0).toEqualTypeOf<SchemaWriteHandle>();
    expectTypeOf<NonNullable<MigrationPart["onStartDb"]>>().parameter(0).toEqualTypeOf<SchemaWriteHandle>();
    expectTypeOf<WriteHandleOptions["height"]>().toEqualTypeOf<bigint | null>();
  });
});

// Each test opens a fresh database and migrates three parts before its block: about 3-4 s on PostgreSQL under the full
// conformance run's parallel load (one took 5.01 s there, against the default 5 s), so each test gets 30 s.
describe.each(BACKENDS)("write handles and their closing on $name (DB-3, A10)", { timeout: 30_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** A fresh database with the parts migrated by the migration runner, as startup will. */
  async function setUp(): Promise<{ readonly db: Database; readonly plan: SchemaPlan; readonly login: string }> {
    const { db } = await backend.database("SELECT 1");
    const plan = planSchemas(MODULES);
    await startDatabase(db, { plan, parts: MODULES, committedVersions: new Map(), handles: NO_HANDLES });
    const [row] = await db.transaction((tx) => tx.query("SELECT current_user AS login"));
    return { db, plan, login: row?.login as string };
  }

  describe("A10: a block write handle is closed once its on-db-write returns", () => {
    it("fails with handle-closed when kept past the block's commit, and writes nothing", async () => {
      const { db, plan } = await setUp();
      let kept: BlockWriteHandle | undefined;
      await block(db, plan, async (writes) => {
        await writes.write("a", async (w) => {
          kept = w;
          await w.execute(INSERT_A, [1]);
        });
      });
      const handle = kept as BlockWriteHandle;
      for (const use of [() => handle.execute(INSERT_A, [2]), () => handle.query("SELECT 1")]) {
        expectWriteHandleClosed(await failure(use), "block-write", "a", "on-db-write");
      }
      expect(await rows(db, "a.t")).toEqual([{ k: 1n, who: "umbradb_m_a" }]);
    });

    it("fails at once in the next part's callback, while the block is open, and never writes under that part's role", async () => {
      const { db, plan } = await setUp();
      await expectClosedInNextCallback(db, plan, openBlockWrites);
    });

    it("refuses the kept handle's write into its own table too, as handle-closed, not as the active role's permission error", async () => {
      const { db, plan } = await setUp();
      let kept: BlockWriteHandle | undefined;
      let result: unknown;
      await block(db, plan, async (writes) => {
        await writes.write("a", async (w) => {
          kept = w;
        });
        await writes.write("b", async () => {
          result = await outcome((kept as BlockWriteHandle).execute(INSERT_A, [1]));
        });
        // The block is not aborted: the refused use never reached the database.
        await writes.write("a", (w) => w.execute(INSERT_A, [2]));
      });
      expectWriteHandleClosed(result, "block-write", "a", "on-db-write");
      expect(await rows(db, "a.t")).toEqual([{ k: 2n, who: "umbradb_m_a" }]);
    });

    it("fails from a timer its callback set, while the block is open and after it committed", async () => {
      const { db, plan } = await setUp();
      const committed = askedLater(async () => undefined);
      let during!: Promise<unknown>;
      let after!: Promise<unknown>;
      await block(db, plan, async (writes) => {
        await writes.write("a", async (w) => {
          during = new Promise((resolve) => setTimeout(() => resolve(outcome(w.execute(INSERT_A, [5]))), 20));
          after = new Promise((resolve) => {
            setTimeout(() => void committed.result.then(() => resolve(outcome(w.execute(INSERT_A, [6])))), 0);
          });
        });
        await writes.write("b", async (w) => {
          // The timer fires while this callback, and the block, still run.
          expectWriteHandleClosed(await during, "block-write", "a", "on-db-write");
          await w.execute(INSERT_B, [1]);
        });
      });
      committed.gate();
      expectWriteHandleClosed(await after, "block-write", "a", "on-db-write");
      expect(await rows(db, "a.t")).toEqual([]);
      expect(await rows(db, "b.t")).toEqual([{ k: 1n, who: "umbradb_m_b" }]);
    });

    it("closes the handle of a callback that threw, whose error passes through unchanged and rolls the block back", async () => {
      const { db, plan } = await setUp();
      let kept: BlockWriteHandle | undefined;
      const own = new Error("the callback's own");
      await expect(
        block(db, plan, (writes) =>
          writes.write("a", async (w) => {
            kept = w;
            await w.execute(INSERT_A, [1]);
            throw own;
          }),
        ),
      ).rejects.toBe(own);
      expectWriteHandleClosed(await failure(() => (kept as BlockWriteHandle).execute(INSERT_A, [2])), "block-write", "a", "on-db-write");
      expect(await rows(db, "a.t")).toEqual([]);
    });

    it("fails at once while another transaction holds the writer (on PGlite: the one queue)", async () => {
      const { db, plan } = await setUp();
      let kept: BlockWriteHandle | undefined;
      await block(db, plan, (writes) =>
        writes.write("a", async (w) => {
          kept = w;
        }),
      );
      const release = askedLater(async () => undefined);
      let holding!: () => void;
      const held = new Promise<void>((resolve) => {
        holding = resolve;
      });
      const other = db.transaction(async () => {
        holding();
        await release.result;
      });
      await held;
      const use = (kept as BlockWriteHandle).execute(INSERT_A, [1]);
      expect(await settlesWithin(use, 1_000)).toBe(true);
      expectWriteHandleClosed(await outcome(use), "block-write", "a", "on-db-write");
      release.gate();
      await other;
      expect(await rows(db, "a.t")).toEqual([]);
    });

    it("reports every use after closing to onClosedUse — also one the module's own code catches — so the runner can halt (RN-8)", async () => {
      const { db, plan } = await setUp();
      const reported: UmbraError[] = [];
      let kept: BlockWriteHandle | undefined;
      let caught: unknown;
      const options: WriteHandleOptions = { height: 4n, onClosedUse: (error) => reported.push(error) };
      await block(
        db,
        plan,
        async (writes) => {
          await writes.write("a", async (w) => {
            kept = w;
            await w.execute(INSERT_A, [1]);
          });
          // The module's next callback catches the error itself and goes on.
          await writes.write("b", async (w) => {
            caught = await outcome((kept as BlockWriteHandle).query("SELECT 1"));
            await w.execute(INSERT_B, [1]);
          });
        },
        options,
      );
      expect(reported).toHaveLength(1);
      expect(reported[0]).toBe(caught);
      expectWriteHandleClosed(reported[0], "block-write", "a", "on-db-write");
      await outcome((kept as BlockWriteHandle).execute(INSERT_A, [2]));
      expect(reported).toHaveLength(2);
      expectWriteHandleClosed(reported[1], "block-write", "a", "on-db-write");
    });
  });

  describe("A10: a schema write handle is closed once its on-start-db returns", () => {
    it("fails with handle-closed when kept past startup, and in the next part's on-start-db, never under that part's role", async () => {
      const { db } = await backend.database("SELECT 1");
      const reported: UmbraError[] = [];
      let kept: SchemaWriteHandle | undefined;
      const inNext: unknown[] = [];
      const parts = [
        {
          ...(MODULES[0] as SchemaModule & MigrationPart),
          onStartDb: async (w: SchemaWriteHandle) => {
            kept = w;
            await w.execute(INSERT_A, [1]);
          },
        },
        {
          ...(MODULES[1] as SchemaModule & MigrationPart),
          onStartDb: async (w: SchemaWriteHandle) => {
            for (const sql of [INSERT_B, INSERT_A]) inNext.push(await outcome((kept as SchemaWriteHandle).execute(sql, [7])));
            await w.execute(INSERT_B, [2]);
          },
        },
      ];
      await startDatabase(db, {
        plan: planSchemas(parts),
        parts,
        committedVersions: new Map(),
        handles: { height: 12n, onClosedUse: (error) => reported.push(error) },
      });
      // The cursor at startup, as the runner gives it, is the height each on-start-db's handle reports.
      expect(kept?.height).toBe(12n);
      for (const result of inNext) expectWriteHandleClosed(result, "schema-write", "a", "on-start-db");
      for (const use of [() => (kept as SchemaWriteHandle).execute(INSERT_A, [3]), () => (kept as SchemaWriteHandle).query("SELECT 1")]) {
        expectWriteHandleClosed(await failure(use), "schema-write", "a", "on-start-db");
      }
      expect(reported).toHaveLength(4);
      for (const error of reported) expectWriteHandleClosed(error, "schema-write", "a", "on-start-db");
      expect(await rows(db, "a.t")).toEqual([{ k: 1n, who: "umbradb_m_a" }]);
      expect(await rows(db, "b.t")).toEqual([{ k: 2n, who: "umbradb_m_b" }]);
    });

    it("leaves no role on the writer's session after an on-start-db that selected one itself", async () => {
      const { db, plan, login } = await setUp();
      // A mistake (Q46): a session-level SET ROLE would outlive the transaction on the writer's one session.
      await runOnStartDb(db, plan, "a", NO_HANDLES, (w) => w.execute("SET ROLE umbradb_m_b").then(() => undefined));
      expect(await db.transaction((tx) => tx.query("SELECT current_user AS role"))).toEqual([{ role: login }]);
    });

    it("fails from a timer its on-start-db set", async () => {
      const { db, plan } = await setUp();
      let fired!: Promise<unknown>;
      await runOnStartDb(db, plan, "a", NO_HANDLES, async (w) => {
        fired = new Promise((resolve) => setTimeout(() => resolve(outcome(w.execute(INSERT_A, [1]))), 20));
      });
      expectWriteHandleClosed(await fired, "schema-write", "a", "on-start-db");
      expect(await rows(db, "a.t")).toEqual([]);
    });

    it("runs on-start-db in a transaction of its own under the part's role, and closes the handle of one that threw, rolling it back", async () => {
      const { db, plan, login } = await setUp();
      const roles: unknown[] = [];
      for (const part of ["a", "p", "core-digest"]) {
        await runOnStartDb(db, plan, part, NO_HANDLES, async (w) => {
          const [row] = await w.query("SELECT current_user AS role");
          roles.push(row?.role);
        });
      }
      expect(roles).toEqual(["umbradb_m_a", "umbradb_i_shared_s", login]);
      let kept: SchemaWriteHandle | undefined;
      const own = new Error("the setup's own");
      await expect(
        runOnStartDb(db, plan, "a", NO_HANDLES, async (w) => {
          kept = w;
          await w.execute(INSERT_A, [1]);
          throw own;
        }),
      ).rejects.toBe(own);
      expectWriteHandleClosed(await failure(() => (kept as SchemaWriteHandle).execute(INSERT_A, [2])), "schema-write", "a", "on-start-db");
      expect(await rows(db, "a.t")).toEqual([]);
      // Its own transaction: committed when it returns, whatever runs next.
      await runOnStartDb(db, plan, "a", NO_HANDLES, (w) => w.execute(INSERT_A, [3]).then(() => undefined));
      expect(await rows(db, "a.t")).toEqual([{ k: 3n, who: "umbradb_m_a" }]);
    });
  });

  describe("one block transaction, several parts' callbacks in series (RN-3, RN-4, DB-6)", () => {
    it("runs each callback under its own role — a shared item's provider under the item's (Q89), UmbraDB's own parts as the login — and returns to the login after each", async () => {
      const { db, plan, login } = await setUp();
      await expectOwnRoles(db, plan, login, openBlockWrites);
    });

    it("gives the next part its own role even when a callback changed the role itself, and leaves no role on the writer's session", async () => {
      const { db, plan, login } = await setUp();
      const seen: unknown[] = [];
      await block(db, plan, async (writes) => {
        // A mistake (modules are trusted, Q46: nothing stops it); the next callback must not inherit it.
        await writes.write("a", (w) => w.execute("SET ROLE umbradb_m_b"));
        for (const part of ["core-digest", "a"]) {
          await writes.write(part, async (w) => {
            const [row] = await w.query("SELECT current_user AS role");
            seen.push(row?.role);
          });
        }
        await writes.write("a", (w) => w.execute("SET LOCAL ROLE umbradb_m_b"));
        await writes.write("core-digest", async (w) => {
          const [row] = await w.query("SELECT current_user AS role");
          seen.push(row?.role);
        });
      });
      expect(seen).toEqual([login, "umbradb_m_a", login]);
      expect(await db.transaction((tx) => tx.query("SELECT current_user AS role"))).toEqual([{ role: login }]);
    });

    it("ends a part's role with the block transaction (SET LOCAL), also after a callback that threw in a block that committed anyway", async () => {
      const { db, plan, login } = await setUp();
      const own = new Error("the callback's own");
      // The runner rolls such a block back (RN-8); a body that commits it must still not leave a's role on the session.
      await block(db, plan, async (writes) => {
        await expect(
          writes.write("a", async () => {
            throw own;
          }),
        ).rejects.toBe(own);
      });
      expect(await db.transaction((tx) => tx.query("SELECT current_user AS role"))).toEqual([{ role: login }]);
    });

    it("runs UmbraDB's own parts as the login even when the writer's session was left in another role", async () => {
      const { db, plan, login } = await setUp();
      // A session-level SET ROLE some other code committed: it outlives its transaction on the writer's one session.
      const leave = () => db.transaction((tx) => tx.execute("SET ROLE umbradb_m_b"));
      await leave();
      const roles = await block(db, plan, async (writes) => [
        ...(await writes.write("core-digest", (w) => w.query("SELECT current_user AS role"))),
        ...(await writes.write("a", (w) => w.query("SELECT current_user AS role"))),
      ]);
      await leave();
      let atStart: unknown;
      await runOnStartDb(db, plan, "core-chain", NO_HANDLES, async (w) => {
        [{ role: atStart }] = (await w.query("SELECT current_user AS role")) as [{ role: unknown }];
      });
      expect([...roles, { role: atStart }]).toEqual([{ role: login }, { role: "umbradb_m_a" }, { role: login }]);
    });

    it("runs a statement the callback started and did not await under the callback's role, before the next callback", async () => {
      const { db, plan } = await setUp();
      await block(db, plan, async (writes) => {
        await writes.write("a", async (w) => {
          void w.execute(INSERT_A, [1]);
        });
        await writes.write("b", (w) => w.execute(INSERT_B, [2]));
      });
      expect(await rows(db, "a.t")).toEqual([{ k: 1n, who: "umbradb_m_a" }]);
      expect(await rows(db, "b.t")).toEqual([{ k: 2n, who: "umbradb_m_b" }]);
    });

    it("refuses a second callback started while one runs (in series, RN-3), before it sends anything", async () => {
      const { db, plan } = await setUp();
      let refused: unknown;
      let role: unknown;
      let ran = false;
      await block(db, plan, (writes) =>
        writes.write("a", async (w) => {
          refused = await outcome(
            writes.write("b", async () => {
              ran = true;
            }),
          );
          [{ role }] = (await w.query("SELECT current_user AS role")) as [{ role: unknown }];
        }),
      );
      expect(refused).toBeInstanceOf(Error);
      expect((refused as Error).message).toMatch(/in series/);
      expect(ran).toBe(false);
      expect(role).toBe("umbradb_m_a");
    });

    it("refuses a part neither in the plan nor UmbraDB's own before its callback runs", async () => {
      const { db, plan } = await setUp();
      let ran = false;
      const run = async () => {
        ran = true;
      };
      await expect(block(db, plan, (writes) => writes.write("zz", run))).rejects.toThrow(/zz/);
      await expect(runOnStartDb(db, plan, "zz", NO_HANDLES, run)).rejects.toThrow(/zz/);
      expect(ran).toBe(false);
    });

    it("reads committed data plus the rows earlier callbacks wrote in the block (DB-3), which other readers see only after its commit", async () => {
      const { db, plan } = await setUp();
      await block(db, plan, (writes) => writes.write("a", (w) => w.execute(INSERT_A, [1])));
      let outside: unknown;
      const inside = await block(db, plan, async (writes) => {
        await writes.write("a", (w) => w.execute(INSERT_A, [2]));
        return writes.write("b", async (w) => {
          // PGlite: a read from elsewhere waits for the block (DB-4), so it is asked for only on PostgreSQL.
          if (!backend.singleQueue) outside = await db.read((read) => read.query("SELECT k FROM a.t ORDER BY k"));
          return w.query("SELECT k, who FROM a.t ORDER BY k");
        });
      });
      expect(inside).toEqual([
        { k: 1n, who: "umbradb_m_a" },
        { k: 2n, who: "umbradb_m_a" },
      ]);
      if (!backend.singleQueue) expect(outside).toEqual([{ k: 1n }]);
      expect(await rows(db, "a.t")).toEqual(inside);
    });

    it("writes its own schema only: another part's table is refused by the database and the block rolls back (DB-6)", async () => {
      const { db, plan } = await setUp();
      const result = await outcome(
        block(db, plan, async (writes) => {
          await writes.write("b", (w) => w.execute(INSERT_B, [1]));
          await writes.write("a", (w) => w.execute(INSERT_B, [2]));
        }),
      );
      expect(result).toBeInstanceOf(UmbraError);
      expect((result as UmbraError).details.sqlstate).toBe("42501");
      expect(await rows(db, "b.t")).toEqual([]);
    });

    it("returns each callback's result, and reports the height it was given", async () => {
      const { db, plan } = await setUp();
      const heights = await block(
        db,
        plan,
        async (writes) => [await writes.write("a", async (w) => w.height), await writes.write("core-digest", async (w) => w.height)],
        { height: 41n },
      );
      expect(heights).toEqual([41n, 41n]);
      expect(await block(db, plan, (writes) => writes.write("a", async (w) => w.height), { height: null })).toBeNull();
      let atStart: unknown;
      await runOnStartDb(db, plan, "a", { height: 9n }, async (w) => {
        atStart = w.height;
      });
      expect(atStart).toBe(9n);
    });

    it("never carries the migration mark: on-db-write and on-start-db run unmarked", async () => {
      const { db, plan } = await setUp();
      const mark = `SELECT coalesce(current_setting('${MIGRATION_MARK}', true), '') AS mark`;
      const marks: unknown[] = [];
      await block(db, plan, async (writes) => {
        for (const part of ["a", "core-digest"]) marks.push(...(await writes.write(part, (w) => w.query(mark))));
      });
      await runOnStartDb(db, plan, "a", NO_HANDLES, async (w) => {
        marks.push(...(await w.query(mark)));
      });
      expect(marks).toEqual([{ mark: "" }, { mark: "" }, { mark: "" }]);
    });

    it("offers exactly CORE-ARCH §4.10's members, and no way to the migrations' script path", async () => {
      const { db, plan } = await setUp();
      const handles: object[] = [];
      await block(db, plan, (writes) =>
        writes.write("a", async (w) => {
          handles.push(w);
          await expect(runMultiStatement(w as unknown as Transaction, "SELECT 1; SELECT 2")).rejects.toThrow(/not a transaction/);
        }),
      );
      await runOnStartDb(db, plan, "a", NO_HANDLES, async (w) => {
        handles.push(w);
        await expect(runMultiStatement(w as unknown as Transaction, "SELECT 1; SELECT 2")).rejects.toThrow(/not a transaction/);
      });
      for (const handle of handles) expect(Object.keys(handle).sort()).toEqual(["execute", "height", "query"]);
    });
  });

  describe("negative controls", () => {
    it("A10's check fails on a block write handle that stays usable after its callback returns", async () => {
      const { db, plan } = await setUp();
      await expect(expectClosedInNextCallback(db, plan, staysOpen)).rejects.toThrow(
        /expected 'resolved' to be an instance of UmbraError/,
      );
      // Shown directly: the kept handle wrote b's table under b's role.
      expect(await rows(db, "b.t")).toEqual([
        { k: 7n, who: "umbradb_m_b" },
        { k: 8n, who: "umbradb_m_b" },
      ]);
    });

    it("the role check fails on a block that keeps the first callback's role", async () => {
      const { db, plan, login } = await setUp();
      await expect(expectOwnRoles(db, plan, login, keepsFirstRole)).rejects.toThrow(/expected \[/);
    });
  });
});
