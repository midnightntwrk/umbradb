import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockWriteHandle, Transaction } from "../../src/db/api.js";
import { endBlock } from "../../src/db/block-end.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { runCase, where } from "./loop-chunk-runs.js";
import { RUNNER_BACKENDS } from "./loop-harness.js";

/**
 * The negative controls of `loop-chunk-block-end.test.ts`, on PostgreSQL 18 and PGlite 0.5.10, heights 1 to 10 in
 * chunks of 5, each turning one part of a block's end off through the loop's protected seam:
 * - no end sent between the blocks of a chunk: a deferred foreign key that block 8 violates and block 9 repairs is
 *   checked only at the chunk's `COMMIT`, so both blocks are stored, where the real loop halts at 8;
 * - the end sent, its answer that the transaction must end ignored: a constraint that is deferrable and initially
 *   immediate stays deferred for the chunk's later blocks, so block 8, which breaks it for one statement, is stored,
 *   where the real loop halts at 8.
 */

/** Nothing is sent where a block of a chunk ends. */
class NoBlockEnd extends FinalizedLoop {
  protected override async endBlock(): Promise<boolean> {
    return true;
  }
}

/** The end is sent, and the transaction goes on whatever it answers. */
class GoesOn extends FinalizedLoop {
  protected override async endBlock(tx: Transaction, _run: HeightRun): Promise<boolean> {
    await endBlock(tx);
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

const immediateKey = (): ModuleDeclaration =>
  constrained("CREATE TABLE c.once (height bigint PRIMARY KEY, k bigint NOT NULL, CONSTRAINT k_once UNIQUE (k) DEFERRABLE INITIALLY IMMEDIATE)", ["once"], async (w, height) => {
    await w.execute("INSERT INTO c.once (height, k) VALUES ($1, $2)", [height, height]);
    if (height !== 8n) return;
    await w.execute("UPDATE c.once SET k = 7 WHERE height = 8");
    await w.execute("UPDATE c.once SET k = 70 WHERE height = 7");
  });

describe.each(RUNNER_BACKENDS)("the negative controls of a block's end inside a chunk, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("no end sent between blocks: the deferred key block 8 violates and block 9 repairs is not checked at 8, and both are stored", async () => {
    const real = await runCase(backend, { head: 10n, blocks: 5, modules: [deferredKey()] });
    expect(real.failures.map(where)).toEqual([{ height: 8n, point: undefined, module: undefined, committed: false }]);
    expect(real.cursor).toBe(7n);
    const control = await runCase(backend, { head: 10n, blocks: 5, modules: [deferredKey()], loop: NoBlockEnd });
    expect(control.failures).toEqual([]);
    expect(control.cursor).toBe(10n);
  }, 120_000);

  it("the end's answer ignored: the constraint declared initially immediate stays deferred, and block 8, which breaks it for one statement, is stored", async () => {
    const real = await runCase(backend, { head: 10n, blocks: 5, modules: [immediateKey()] });
    expect(real.failures.map(where)).toEqual([{ height: 8n, point: "on-db-write", module: "c", committed: false }]);
    expect(real.cursor).toBe(7n);
    const control = await runCase(backend, { head: 10n, blocks: 5, modules: [immediateKey()], loop: GoesOn });
    expect(control.failures).toEqual([]);
    expect(control.cursor).toBe(10n);
  }, 120_000);
});
