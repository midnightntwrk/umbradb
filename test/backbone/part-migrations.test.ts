import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { TapeRecord } from "../../tools/tape/index.js";
import { NETWORK_ID, RAW } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../runner/process-backends.js";
import {
  CATALOG_SQL,
  EARLIER_BUILD,
  earlierBootstrapSql,
  earlierRefusalProblems,
  earlierRowsSql,
  type FoldedPart,
  MIGRATION_ROWS_SQL,
  rowsSql,
  THIS_BUILD,
} from "./earlier-build.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";
import { type LedgerScenario, ledgerScenario } from "./ledger-tapes.js";

/**
 * One migration per part, through the real process with the ledger's core modules from genesis, on PostgreSQL 18 and
 * PGlite 0.5.10. [R16, LG-11, DB-9]
 *
 * - A new database gets `core_ledger_state.ref_counts` and `core_ledger_state.unreferenced` from `core-ledger-state`'s
 *   `001`, and none of `sweep`, `grey`, `marks`, and `core_chain.identity` from `core-chain`'s `001`: each part records
 *   one migration, `001`.
 * - A database whose recorded migrations are an earlier build's (a part's `001` and `002`, `./earlier-build.ts`)
 *   refuses startup with `migration-checksum-changed`, naming the part, `001` and both checksums, and runs no migration:
 *   on a database holding only those records every part's migrations are pending, and none runs; on a database this
 *   build wrote, with one part's records an earlier build's, nothing changes, and the same database starts again once
 *   its records are this build's.
 *
 * `core-private-source`'s, on a private process, is `../private/part-migrations.test.ts`; a backup carrying an earlier
 * build's migrations, `../backup/restore-earlier-build.test.ts`.
 */

/** Two empty v9 blocks from a blank genesis state: enough for startup, the migrations and a committed head. */
const scenario = (): Promise<LedgerScenario> =>
  ledgerScenario({ ledger: "v9", genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(), includesBlockZero: false, blocks: [[], []] });

/** Runs each of `statements` on `db` from outside the process, one at a time. */
async function run(db: ProcessDatabase, statements: readonly string[]): Promise<void> {
  for (const statement of statements) await db.query(statement);
}

/** The rows of `core_chain.migrations` and every schema and table of `db`, from outside the process. */
async function stateOf(db: ProcessDatabase): Promise<{ readonly rows: string[]; readonly catalog: string[] }> {
  const rows = (await db.query(MIGRATION_ROWS_SQL)).map((row) => row.row as string);
  const catalog = (await db.query(CATALOG_SQL)).map((row) => row.name as string);
  return { rows, catalog };
}

/** `part`'s recorded migrations as {@link MIGRATION_ROWS_SQL} shows them. */
const shown = (part: FoldedPart, rows: readonly { id: string; position: number; checksum: string }[]): string[] =>
  rows.map((row) => `${part}/${row.id}@${row.position}:${row.checksum}`);

/** Starts the build with the ledger's core modules on `db` and waits for its startup; how it ended, then stopped. */
async function startOn(db: ProcessDatabase, records: readonly TapeRecord[], head?: bigint) {
  const process = await ingest(db, records, { start: 0n, core: LEDGER_CORE });
  try {
    const error = await process.handle.started.then(
      () => null,
      (caught: unknown) => caught,
    );
    if (error === null && head !== undefined) await committed(process, head);
    return { error, status: process.handle.status() };
  } finally {
    await process.close();
  }
}

describe("R16: the parts that had two migrations (LG-11, DB-9)", () => {
  it("R16: core-chain, core-ledger-state and core-private-source each declare one migration, 001", () => {
    for (const part of ["core-chain", "core-ledger-state", "core-private-source"] as const) {
      expect(THIS_BUILD[part].map((row) => row.id), part).toEqual(["001"]);
    }
  });
});

describe.each(PROCESS_BACKENDS)("R16: one migration per part, through the process, on $name (LG-11, DB-9)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it(
    "R16: a new database gets ref_counts and unreferenced from core-ledger-state's 001, and none of sweep, grey, marks, " +
      "and core_chain.identity from core-chain's 001",
    async () => {
      const ledger = await scenario();
      const db = await backend.database();
      const { error } = await startOn(db, ledger.records, ledger.head);
      expect(error).toBeNull();
      const { rows } = await stateOf(db);
      for (const part of ["core-chain", "core-ledger-state"] as const) {
        expect(rows.filter((row) => row.startsWith(`${part}/`)), part).toEqual(shown(part, THIS_BUILD[part]));
      }
      const [present] = await db.query(
        "SELECT to_regclass('core_ledger_state.ref_counts') IS NOT NULL AS ref_counts, " +
          "to_regclass('core_ledger_state.unreferenced') IS NOT NULL AS unreferenced, " +
          "to_regclass('core_chain.identity') IS NOT NULL AS identity, to_regclass('core_chain.config') IS NOT NULL AS config",
      );
      expect(present).toEqual({ ref_counts: true, unreferenced: true, identity: true, config: true });
      // None of the mark-and-sweep's tables: no relation of `core_ledger_state` (table, view or other) by their names.
      const swept = await db.query(
        "SELECT c.relname AS name FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace " +
          "WHERE n.nspname = 'core_ledger_state' AND c.relname IN ('sweep', 'grey', 'marks') ORDER BY c.relname",
      );
      expect(swept.map((row) => row.name)).toEqual([]);
      // As design §2.1 gives them: a 32-byte key; a count above 0. [LG-11]
      const columns = await db.query(
        "SELECT table_name || '.' || column_name || ' ' || data_type || ' ' || is_nullable AS c FROM information_schema.columns " +
          "WHERE table_schema = 'core_ledger_state' AND table_name IN ('ref_counts', 'unreferenced') ORDER BY table_name, ordinal_position",
      );
      expect(columns.map((row) => row.c)).toEqual([
        "ref_counts.node_key bytea NO",
        "ref_counts.count integer NO",
        "unreferenced.node_key bytea NO",
      ]);
      for (const [table, expected] of [
        ["ref_counts", ["CHECK ((count > 0))", "CHECK ((octet_length(node_key) = 32))", "PRIMARY KEY (node_key)"]],
        ["unreferenced", ["CHECK ((octet_length(node_key) = 32))", "PRIMARY KEY (node_key)"]],
      ] as const) {
        const constraints = await db.query(
          `SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'core_ledger_state.${table}'::regclass`,
        );
        expect(constraints.map((row) => row.def), table).toEqual(expect.arrayContaining([...expected]));
      }
    },
    PATIENCE_MS * 2,
  );

  it(
    "R16: a database holding an earlier build's recorded migrations refuses startup with migration-checksum-changed, " +
      "naming the part, 001 and both checksums, and runs no migration",
    async () => {
      const ledger = await scenario();
      // Only an earlier build's records of core-chain and core-ledger-state: every part's migrations pending.
      const db = await backend.database();
      await run(db, earlierBootstrapSql(["core-chain", "core-ledger-state"]));
      const before = await stateOf(db);
      expect(before.catalog).toEqual(expect.arrayContaining(["core_chain", "core_chain.migrations"]));
      const { error, status } = await startOn(db, ledger.records);
      // The first part startup checks is core-chain's.
      expect(earlierRefusalProblems(error, "core-chain")).toEqual([]);
      expect(status).toMatchObject({ state: "refused", reason: { code: "migration-checksum-changed", module: "core-chain" } });
      expect(await stateOf(db)).toEqual(before);

      // A database this build wrote, with core-ledger-state's records an earlier build's: refused, nothing changed;
      // with its records this build's again, it starts.
      const written = await backend.database();
      expect((await startOn(written, ledger.records, ledger.head)).error).toBeNull();
      await run(written, earlierRowsSql("core-ledger-state"));
      const rewritten = await stateOf(written);
      expect(rewritten.rows.filter((row) => row.startsWith("core-ledger-state/"))).toEqual(
        shown("core-ledger-state", [
          { id: "001", position: 1, checksum: EARLIER_BUILD["core-ledger-state"][0] },
          { id: "002", position: 2, checksum: EARLIER_BUILD["core-ledger-state"][1] },
        ]),
      );
      const refused = await startOn(written, ledger.records);
      expect(earlierRefusalProblems(refused.error, "core-ledger-state")).toEqual([]);
      expect(refused.status).toMatchObject({ state: "refused", reason: { code: "migration-checksum-changed", module: "core-ledger-state" } });
      expect(await stateOf(written)).toEqual(rewritten);
      await run(written, rowsSql("core-ledger-state", THIS_BUILD["core-ledger-state"]));
      expect((await startOn(written, ledger.records, ledger.head)).error).toBeNull();
    },
    PATIENCE_MS * 3,
  );
});
