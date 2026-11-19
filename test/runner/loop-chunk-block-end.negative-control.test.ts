import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { runCase, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * The negative controls of `loop-chunk-block-end.test.ts`, on PostgreSQL 18 and PGlite 0.5.10, heights 1 to 10 in
 * chunks of 5, with the read at a block's end answering that nothing is there for a `COMMIT`, through the loop's
 * protected seam. Chunks then form over blocks whose transaction's end has work to do:
 * - a deferred foreign key that block 8 violates and block 9 repairs is checked only at the chunk's `COMMIT`, so both
 *   blocks are stored, where the real loop halts at 8;
 * - a cursor `WITH HOLD` whose query fails, declared by block 6 and closed unfetched by block 7, is never run to its
 *   end, so both blocks are stored, where the real loop halts at 6.
 */

/** The read is not sent: every block's end says the transaction may go on. */
class NoBlockEnd extends FinalizedLoop {
  protected override async endBlock(): Promise<boolean> {
    return true;
  }
}

/** Module `c`: its tables from `sql`, and `write` at each `on-db-write`. */
function constrained(sql: string, tables: readonly string[], write: (w: BlockWriteHandle, height: bigint) => Promise<void>): ModuleDeclaration {
  return declaration("c", {
    provides: [{ name: "c-rows", lifetimes: ["block", "table"], table: { schema: "c", tables: ["rows", ...tables], kind: "mutable" } }],
    migrations: [{ id: "001", sql: `CREATE TABLE c.rows (height bigint PRIMARY KEY); ${sql}` }],
    points: {
      "on-db-write": (_p, b: BlockContext, w: BlockWriteHandle) => write(w, b.height),
    },
  });
}

const deferredKey = (): ModuleDeclaration =>
  constrained(
    "CREATE TABLE c.parents (height bigint PRIMARY KEY, id bigint NOT NULL UNIQUE); " +
      "CREATE TABLE c.children (height bigint PRIMARY KEY, parent bigint NOT NULL, " +
      "CONSTRAINT child_parent FOREIGN KEY (parent) REFERENCES c.parents (id) DEFERRABLE INITIALLY DEFERRED)",
    ["parents", "children"],
    async (w, height) => {
      if (height === 8n) await w.execute("INSERT INTO c.children (height, parent) VALUES ($1, 100)", [height]);
      if (height === 9n) await w.execute("INSERT INTO c.parents (height, id) VALUES ($1, 100)", [height]);
    },
  );

const heldCursor = (): ModuleDeclaration =>
  constrained("CREATE TABLE c.denominators (d bigint PRIMARY KEY); INSERT INTO c.denominators (d) VALUES (0)", ["denominators"], async (w, height) => {
    if (height === 6n) await w.execute("DECLARE held CURSOR WITH HOLD FOR SELECT 10 / d FROM c.denominators");
    if (height === 7n) await w.execute("CLOSE held");
  });

describe.each(RUNNER_BACKENDS)("the negative controls of the read at a block's end, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("the read not sent: the deferred key block 8 violates and block 9 repairs is not checked at 8, and both are stored", async () => {
    const real = await runCase(backend, { head: 10n, blocks: 5, modules: [deferredKey()] });
    expect(real.failures.map(where)).toEqual([{ height: 8n, point: undefined, module: undefined, committed: false }]);
    expect(real.cursor).toBe(7n);
    const control = await runCase(backend, { head: 10n, blocks: 5, modules: [deferredKey()], loop: NoBlockEnd });
    expect(control.failures).toEqual([]);
    expect(control.cursor).toBe(10n);
  }, 120_000);

  it("the read not sent: the cursor WITH HOLD block 6 declares and block 7 closes is never run to its end, and both are stored", async () => {
    const real = await runCase(backend, { head: 10n, blocks: 5, modules: [heldCursor()] });
    expect(real.failures.map(where)).toEqual([{ height: 6n, point: undefined, module: undefined, committed: false }]);
    expect(real.cursor).toBe(5n);
    const control = await runCase(backend, { head: 10n, blocks: 5, modules: [heldCursor()], loop: NoBlockEnd });
    expect(control.failures).toEqual([]);
    expect(control.cursor).toBe(10n);
  }, 120_000);
});
