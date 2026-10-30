import { z } from "zod";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import type { Database } from "../../../src/db/api.js";
import { startDatabase } from "../../../src/db/migrate.js";
import type { SchemaPlan } from "../../../src/db/roles.js";
import { openBlockWrites } from "../../../src/db/write-handles.js";
import { migrationPart, schemaPlan } from "../../../src/modules/adapters.js";
import {
  type BlockContext,
  defineModule,
  type ModuleDeclaration,
  type ProcessContext,
} from "../../../src/modules/declaration.js";
import { validateDeclarations } from "../../../src/modules/validation.js";

/**
 * A chain for the digests' tests: the real `core-digest` declaration, a stand-in for `core-block-commit`, and the
 * test's modules. They are started through `schemaPlan` and `startDatabase` and run through the block write handles,
 * with a block loop standing in for the runner's (as the requirement graph's tests do). [DT-4, DT-5, A25]
 *
 * The orders are the fixed backbone order as the requirement graph gives them (`src/modules/graph.ts`):
 * - at startup, the backbone first (`core-digest` right after `core-block-commit`), then the modules;
 * - at `on-db-write`, `core-block-commit` first and `core-digest` last.
 * [RN-3, Q95]
 */

/** One process context per test chain: the digests need no items, revisions or published items. */
export function processContext(): ProcessContext {
  return { items: new Map(), revisions: [], publish: () => undefined };
}

/** The block context of height `h`: no items or settings are needed here. [CORE-ARCH §4.10] */
export function blockAt(h: bigint): BlockContext {
  return {
    height: h,
    hash: new Uint8Array(32),
    parentHash: new Uint8Array(32),
    items: new Map(),
    settings: {},
    active: () => true,
  };
}

/** A stand-in for `core-block-commit`: the `blocks` item, one row per height, written first in each block. */
export const BLOCK_COMMIT = defineModule({
  id: "core-block-commit",
  version: "0.10.0",
  side: "public",
  requires: [],
  provides: [
    {
      name: "blocks",
      lifetimes: ["table"],
      table: { schema: "core_block_commit", tables: ["blocks"], kind: "append-only" },
    },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [{ id: "001", sql: "CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY)" }],
  points: {
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO core_block_commit.blocks (height) VALUES ($1)", [b.height]);
    },
  },
});

/**
 * A user module every check accepts, with the rest given: requires `blocks`, provides nothing and migrates nothing unless
 * `rest` says otherwise (built here, not from `test/modules/`, so these tests depend only on the declaration's type).
 */
export function testModule(id: string, rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  return defineModule({
    id,
    version: "1.0.0",
    side: "public",
    requires: ["blocks"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {},
    ...rest,
  });
}

/** A started chain: its database, plan, and the parts in each order. */
export interface Chain {
  readonly db: Database;
  readonly plan: SchemaPlan;
  /** Startup's order. [DB-9, Q95] */
  readonly startup: readonly ModuleDeclaration[];
  /** `on-db-write`'s order: `core-digest` last. [RN-3] */
  readonly writeOrder: readonly ModuleDeclaration[];
  /** The first height processed (S). */
  readonly start: bigint;
  /** The last height committed, or null before the first block. */
  cursor: bigint | null;
}

/** What {@link startChain} takes besides the modules. */
export interface ChainOptions {
  /** S, the first height (default 1). */
  readonly start?: bigint;
  /** Changes the plan before startup (a negative control's deliberately wrong plan). */
  readonly plan?: (plan: SchemaPlan) => SchemaPlan;
}

/** Validates the parts, plans their schemas and starts the database with them. [DB-9] */
export async function startChain(
  db: Database,
  modules: readonly ModuleDeclaration[],
  options: ChainOptions = {},
): Promise<Chain> {
  const set = validateDeclarations({ backbone: [BLOCK_COMMIT, CORE_DIGEST], core: [], user: modules });
  const backbone = set.backbone;
  const startup = [...backbone, ...set.user];
  const plan = (options.plan ?? ((p: SchemaPlan) => p))(schemaPlan(startup));
  const context = processContext();
  await startDatabase(db, {
    plan,
    parts: startup.map((d) => migrationPart(d, context)),
    committedVersions: new Map(),
    handles: { height: null },
  });
  const [blockCommit, digest] = backbone as [ModuleDeclaration, ModuleDeclaration];
  return {
    db,
    plan,
    startup,
    writeOrder: [blockCommit, ...set.user, digest],
    start: options.start ?? 1n,
    cursor: null,
  };
}

/** Runs the block of the next height: one transaction, every part's `on-db-write` in order. [RN-3, RN-4] */
export async function runBlock(chain: Chain): Promise<bigint> {
  const h = chain.cursor === null ? chain.start : chain.cursor + 1n;
  const context = processContext();
  await chain.db.transaction(async (tx) => {
    const writes = openBlockWrites(tx, chain.plan, { height: chain.cursor });
    for (const part of chain.writeOrder) {
      const write = part.points["on-db-write"];
      if (write === undefined) continue;
      await writes.write(part.id, (w) => write.call(part.points, context, blockAt(h), w));
    }
  });
  chain.cursor = h;
  return h;
}

/** Runs blocks up to and including height `to`. */
export async function runBlocks(chain: Chain, to: bigint, after?: (h: bigint) => Promise<void>): Promise<void> {
  while ((chain.cursor ?? chain.start - 1n) < to) {
    const h = await runBlock(chain);
    await after?.(h);
  }
}

/** A row of `core_digest.tables`, by `schema.table`. */
export interface DigestRow {
  readonly height: bigint;
  readonly digest: string;
}

/** The rows of `core_digest.tables`, by `schema.table`, digests in hex. */
export async function digestRows(db: Database): Promise<Record<string, DigestRow>> {
  const rows = await db.read((read) => read.query('SELECT "schema", "table", height, digest FROM core_digest.tables'));
  return Object.fromEntries(
    rows.map((row) => [
      `${row.schema as string}.${row.table as string}`,
      { height: row.height as bigint, digest: Buffer.from(row.digest as Uint8Array).toString("hex") },
    ]),
  );
}

/** The rows of `core_digest.checkpoints`: by height, then `schema.table`, digests in hex. */
export async function checkpointRows(db: Database): Promise<Record<string, Record<string, string>>> {
  const rows = await db.read((read) =>
    read.query('SELECT height, "schema", "table", digest FROM core_digest.checkpoints ORDER BY height'),
  );
  const out: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    const at = (out[String(row.height)] ??= {});
    at[`${row.schema as string}.${row.table as string}`] = Buffer.from(row.digest as Uint8Array).toString("hex");
  }
  return out;
}
