import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import type { SchemaPlan } from "../../src/db/roles.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import type { BlockContext, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { type ResolvedGraph, resolveGraph, utf8Order } from "../../src/modules/graph.js";
import { BACKENDS } from "../db/backends.js";
import { declaration } from "./declarations.js";
import { consumer, entry, graphInput } from "./graph-fixtures.js";

/**
 * The resolved graph's outputs fed to the database API's real inputs, on both backends:
 * - `schemaPlan(graph.modules)` to `planSchemas` and `prepareSchemas`;
 * - `graph.modules.map(migrationPart)` to `startDatabase`, whose order puts every provider's migrations before its
 *   consumers' [RN-3, DB-9, Q95];
 * - a consumer reads one continuous table: two providers of a shared item with adjacent ranges write its one table
 *   under the item's role, each at the heights the graph gives it, and the consumer reads every height once
 *   [A25, MD-6, DB-6, DB-8, Q89].
 *
 * The block loop here stands in for the runner's: one transaction per height, running the `on-db-write` callbacks of
 * the range's `writeOrder` through block write handles. The refusals themselves are tested in `graph.test.ts`.
 */

const CONTEXT: ProcessContext = { items: new Map(), revisions: [], publish: () => undefined };

/** The block context of height `h`: no items or settings are needed here. [CORE-ARCH §4.10] */
function blockAt(h: bigint): BlockContext {
  return {
    height: h,
    hash: new Uint8Array(32),
    parentHash: new Uint8Array(32),
    items: new Map(),
    settings: {},
    active: () => true,
  };
}

/** Starts the database with the graph's modules: its plan and its parts in startup order. */
async function start(db: Database, modules: readonly ModuleDeclaration[]) {
  const plan = schemaPlan(modules);
  const applied = await startDatabase(db, {
    plan,
    parts: modules.map((d) => migrationPart(d, CONTEXT)),
    committedVersions: new Map(),
    handles: { height: null },
  });
  return { plan, applied };
}

/** One transaction per height from `from` to `to`, each running the range's `on-db-write` callbacks in order. */
async function runHeights(db: Database, graph: ResolvedGraph, plan: SchemaPlan, from: bigint, to: bigint) {
  for (let h = from; h <= to; h++) {
    const range = graph.rangeAt(h);
    if (range === undefined) throw new Error(`no range holds ${h}`);
    await db.transaction(async (tx) => {
      const writes = openBlockWrites(tx, plan, { height: h === from ? null : h - 1n });
      for (const part of range.writeOrder) {
        const write = part.points["on-db-write"];
        if (write === undefined) continue;
        await writes.write(part.id, (w) => write.call(part.points, CONTEXT, blockAt(h), w));
      }
    });
  }
}

/** A provider of the shared table item `contract-logs`, writing its row of each height and who wrote it. */
function logsProvider(id: string): ModuleDeclaration {
  return declaration(id, {
    provides: [
      {
        name: "contract-logs",
        lifetimes: ["block", "table"],
        table: { schema: "contract_logs", tables: ["logs"], kind: "append-only" },
      },
    ],
    migrations: [
      {
        id: "001",
        sql: "CREATE TABLE contract_logs.logs (height bigint PRIMARY KEY, written_by text NOT NULL, role text NOT NULL)",
      },
    ],
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO contract_logs.logs (height, written_by, role) VALUES ($1, $2, current_user)", [
          b.height,
          id,
        ]);
      },
    },
  });
}

/** A consumer of `contract-logs` that reads the whole table at each height, under its own role. */
function reader(seen: Map<bigint, { heights: bigint[]; role: string }>): ModuleDeclaration {
  return consumer("logs-reader", ["contract-logs"], {
    points: {
      async "on-db-write"(_p, b, w) {
        const rows = await w.query("SELECT height FROM contract_logs.logs ORDER BY height");
        const [me] = await w.query("SELECT current_user AS role");
        seen.set(b.height, { heights: rows.map((row) => row.height as bigint), role: me?.role as string });
      },
    },
  });
}

describe.each(BACKENDS)("the resolved graph through planSchemas and startDatabase on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  it("A25: providers with adjacent ranges write one table under the item's role, and the consumer reads it whole", async () => {
    const { db } = await backend.database("SELECT 1");
    const seen = new Map<bigint, { heights: bigint[]; role: string }>();
    const graph = resolveGraph(
      graphInput(
        [logsProvider("logs-full"), logsProvider("logs-fast"), reader(seen)],
        [entry("logs-full", 1, 9), entry("logs-fast", 10), entry("logs-reader", 1)],
      ),
    );
    const { plan, applied } = await start(db, graph.modules);
    // The item's migration is recorded once, under the item, after the backbone's. [DB-8, DB-9]
    expect(applied).toEqual([
      { module: "core-chain", migration: "001", position: 1 },
      { module: "core-block-commit", migration: "001", position: 1 },
      { module: "core-digest", migration: "001", position: 1 },
      { module: "contract-logs", migration: "001", position: 1 },
    ]);
    expect(plan.writeRole("logs-full")).toBe("umbradb_i_contract_logs");
    expect(plan.writeRole("logs-fast")).toBe("umbradb_i_contract_logs");

    await runHeights(db, graph, plan, 1n, 15n);

    const rows = await db.read((read) => read.query("SELECT height, written_by, role FROM contract_logs.logs ORDER BY height"));
    expect(rows).toEqual(
      Array.from({ length: 15 }, (_, i) => ({
        height: BigInt(i + 1),
        written_by: i + 1 <= 9 ? "logs-full" : "logs-fast",
        role: "umbradb_i_contract_logs",
      })),
    );
    // At every height the consumer, under its own role, read one table holding every height up to its own, once.
    for (let h = 1n; h <= 15n; h++) {
      expect(seen.get(h)).toEqual({
        heights: Array.from({ length: Number(h) }, (_, i) => BigInt(i + 1)),
        role: "umbradb_m_logs_reader",
      });
    }
  }, 120_000);

  /** z-source provides a table; a-view's migration creates a view over it: its id sorts first, its provider must run first. */
  const zSource = declaration("z-source");
  const aView = consumer("a-view", ["z-source-rows"], {
    migrations: [{ id: "001", sql: "CREATE VIEW a_view.heights AS SELECT height FROM z_source.rows" }],
  });

  it("runs each provider's migrations before its consumer's, whose view over the provider's table needs them", async () => {
    const { db } = await backend.database("SELECT 1");
    const graph = resolveGraph(graphInput([aView, zSource], [entry("a-view", 1), entry("z-source", 1)]));
    const { applied } = await start(db, graph.modules);
    expect(applied.map((m) => m.module)).toEqual(["core-chain", "core-block-commit", "core-digest", "z-source", "a-view"]);
    await db.transaction((tx) => tx.execute("INSERT INTO z_source.rows (height) VALUES (7)"));
    expect(await db.read((read) => read.query("SELECT height FROM a_view.heights"))).toEqual([{ height: 7n }]);
  }, 60_000);

  it("negative control: the same parts in plain id order fail the consumer's migration", async () => {
    const { db } = await backend.database("SELECT 1");
    const graph = resolveGraph(graphInput([aView, zSource], [entry("a-view", 1), entry("z-source", 1)]));
    const byId = [...graph.modules.slice(0, 4), ...[...graph.modules.slice(4)].sort((a, b) => utf8Order(a.id, b.id))];
    expect(byId.map((d) => d.id).slice(4)).toEqual(["a-view", "z-source"]);
    const refused = await start(db, byId).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).code).toBe("migration-failed");
    expect((refused as UmbraError).details).toMatchObject({ module: "a-view", migration: "001" });
  }, 60_000);

  it("creates the schemas of every module of the database, one whose revisions ended included, and none for others", async () => {
    const { db } = await backend.database("SELECT 1");
    const graph = resolveGraph(
      graphInput(
        [consumer("graph-old", ["block-header"]), consumer("graph-live", ["block-header"]), consumer("graph-unused", ["block-header"])],
        [entry("graph-old", 1, 10), entry("graph-live", 1)],
      ),
    );
    await start(db, graph.modules);
    const schemas = await db.read((read) =>
      read.query(
        "SELECT nspname FROM pg_namespace WHERE nspname IN ('graph_old', 'graph_live', 'graph_unused', 'core_digest') " +
          "ORDER BY nspname",
      ),
    );
    expect(schemas.map((row) => row.nspname)).toEqual(["core_digest", "graph_live", "graph_old"]);
  }, 60_000);
});
