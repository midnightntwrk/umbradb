import { CORE_BLOCK_COMMIT, cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_DIGEST } from "../../src/backbone/core-digest/core-digest.js";
import type { BlockWriteHandle, Database } from "../../src/db/api.js";
import type { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import type { SchemaPlan } from "../../src/db/roles.js";
import { openBlockWrites } from "../../src/db/write-handles.js";
import { type CursorTable, cursorTable } from "../../src/helpers/cursor-table.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import type { BlockContext, Migration, ModuleDeclaration, PointCallbacks } from "../../src/modules/declaration.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { standInItems } from "../backbone/block-fetch-stand-in.js";
import type { TestBackend, TestDatabase } from "../db/backends.js";
import { declaration } from "../modules/declarations.js";
import { Contexts } from "../runner/fixtures.js";

/**
 * What the cursor-table helper's tests share. [SH-1, A59]
 *
 * A database on each backend, opened with the committed height of the cursor (`core-block-commit`'s `blocks`,
 * `cursorHeight`). The migration runner starts it with these four parts, in the fixed backbone order: [RN-3]
 * - `core-block-commit`;
 * - the test module `wallet-scan`, whose migrations are the helper's table and an audit of its writes;
 * - the test module `token-scan`, which writes nothing of its own;
 * - the real `core-digest`, so that change capture runs on the helper's table as on any module table. [DT-4]
 *
 * A block, as the runner writes one: one transaction of the database API, with its `on-db-write` callbacks run through
 * the real block write handles (`openBlockWrites`). `core-block-commit`'s row comes first, then one module's callback,
 * then `core-digest`'s. [DB-3, CD-3]
 *
 * The height-versioned table's tests (`height-versioned-harness.ts`) start the same way with their own modules,
 * through {@link helperDatabase}.
 */

/** The cursor table of `wallet-scan`, in its own schema. */
export const CURSORS: CursorTable = cursorTable({ schema: "wallet_scan", table: "cursors" });

/**
 * The oracle of "through the module's handle": every insert or update of `wallet_scan.cursors` records, per key, the
 * role it ran under (`current_user` in a trigger is the role of the statement that fired it) and its transaction. A
 * transaction id does not follow from the chain, so the audit's item is declared `deterministic: false`. [MD-1, Q76]
 */
export const AUDIT_MIGRATION: Migration = {
  id: "002",
  sql: `CREATE TABLE wallet_scan.audit (key text PRIMARY KEY, role text NOT NULL, xid text NOT NULL);
CREATE FUNCTION wallet_scan.audit_write() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO wallet_scan.audit (key, role, xid) VALUES (NEW.key, current_user, pg_current_xact_id()::text)
    ON CONFLICT (key) DO UPDATE SET role = EXCLUDED.role, xid = EXCLUDED.xid;
  RETURN NULL;
END
$$;
CREATE TRIGGER audit_write AFTER INSERT OR UPDATE ON wallet_scan.cursors
  FOR EACH ROW EXECUTE FUNCTION wallet_scan.audit_write();`,
};

/**
 * `wallet-scan`: a module keeping per-key cursors in the helper's table, as in the spec's example. [CORE-ARCH §4.11a]
 */
export function walletScan(points: ModuleDeclaration["points"] = {}): ModuleDeclaration {
  return declaration("wallet-scan", {
    provides: [
      {
        name: "wallet-cursors",
        lifetimes: ["table"],
        table: { schema: "wallet_scan", tables: ["cursors"], kind: "mutable" },
      },
      {
        name: "wallet-audit",
        lifetimes: ["table"],
        table: { schema: "wallet_scan", tables: ["audit"], kind: "mutable", deterministic: false },
      },
    ],
    migrations: [CURSORS.migration("001"), AUDIT_MIGRATION],
    points,
  });
}

/** `token-scan`: another module, with nothing of its own to write; it reads `wallet-scan`'s tables. [DB-6] */
export const TOKEN_SCAN: ModuleDeclaration = declaration("token-scan", { provides: [], migrations: [] });

/** The role `wallet-scan` writes under. [DB-6] */
export const WALLET_SCAN_ROLE = "umbradb_m_wallet_scan";

/** Options of one block. */
export interface BlockOptions {
  /** The part whose `on-db-write` runs `body` (default: the database's main module, `wallet-scan` for a cursor one). */
  readonly part?: string;
  /** Receives the error reported when a write handle is used after its callback ended. [DB-3] */
  readonly onClosedUse?: (error: UmbraError) => void;
}

/**
 * A started database of the storage helpers' tests (the cursor table's and the height-versioned table's), and blocks
 * on it.
 */
export interface HelperDatabase {
  readonly db: Database;
  readonly plan: SchemaPlan;
  /** The test's own access to the database, outside the API (`backends.ts`). */
  readonly outside: TestDatabase;
  /** The writer's login. */
  readonly login: string;
  /** The last committed height; null before the first block commits. */
  readonly committed: bigint | null;
  /**
   * Runs the block at the next height (the committed height + 1, from 1) as the runner does, with `body` as the
   * `on-db-write` callback of `options.part`; resolves once the block committed, rejects with the error that rolled it
   * back (the committed height is then unchanged).
   */
  block(body: (w: BlockWriteHandle, b: BlockContext) => Promise<void>, options?: BlockOptions): Promise<void>;
}

/** A started cursor database. */
export type CursorDatabase = HelperDatabase;

/** A fresh database on `backend`, opened through the API with the cursor's committed height, nothing started. */
export async function freshDatabase(backend: TestBackend): Promise<TestDatabase> {
  return backend.database("SELECT 1", cursorHeight);
}

/** A database on `backend` started with the cursor database's parts, as the runner starts one. */
export async function cursorDatabase(backend: TestBackend): Promise<CursorDatabase> {
  return helperDatabase(backend, [walletScan(), TOKEN_SCAN]);
}

/**
 * A database on `backend` started, as the runner starts one, with the parts `core-block-commit`, `modules` and the real
 * `core-digest`, in the fixed backbone order; its blocks run the first of `modules` unless told otherwise. [RN-3]
 */
export async function helperDatabase(
  backend: TestBackend,
  modules: readonly [ModuleDeclaration, ...ModuleDeclaration[]],
): Promise<HelperDatabase> {
  const parts: readonly ModuleDeclaration[] = [CORE_BLOCK_COMMIT, ...modules, CORE_DIGEST];
  const outside = await freshDatabase(backend);
  const { db } = outside;
  const contexts = new Contexts();
  const plan = schemaPlan(parts);
  await startDatabase(db, {
    plan,
    parts: parts.map((part) => migrationPart(part, contexts.of(part.id))),
    committedVersions: new Map(),
    handles: { height: null },
  });
  const main = modules[0].id;
  const [row] = await db.transaction((tx) => tx.query("SELECT current_user AS login"));
  const commitRow = CORE_BLOCK_COMMIT.points["on-db-write"] as PointCallbacks["on-db-write"];
  const digest = CORE_DIGEST.points["on-db-write"] as PointCallbacks["on-db-write"];
  let committed: bigint | null = null;
  return {
    db,
    plan,
    outside,
    login: row?.login as string,
    get committed() {
      return committed;
    },
    async block(body, options = {}) {
      const height = (committed ?? 0n) + 1n;
      const b: BlockContext = Object.freeze({
        ...inMemoryBlock(height),
        // The block items core-block-commit's row needs, as core-block-fetch puts them.
        items: standInItems(height),
        settings: Object.freeze({}),
        active: () => true,
      });
      const part = options.part ?? main;
      await db.transaction(async (tx) => {
        const writes = openBlockWrites(tx, plan, {
          height: committed,
          ...(options.onClosedUse === undefined ? {} : { onClosedUse: options.onClosedUse }),
        });
        await writes.write(CORE_BLOCK_COMMIT.id, (w) => commitRow(contexts.of(CORE_BLOCK_COMMIT.id), b, w));
        await writes.write(part, (w) => body(w, b));
        await writes.write(CORE_DIGEST.id, (w) => digest(contexts.of(CORE_DIGEST.id), b, w));
      });
      committed = height;
    },
  };
}
