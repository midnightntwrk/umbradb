/**
 * The module declaration. A module is a TypeScript package that exports a {@link ModuleDeclaration}; the host program
 * imports it, and nothing loads a module by name at run time. Module ids and item names follow the name pattern of
 * `src/db/roles.ts`. [MD-1, DB-8; CORE-ARCH §4.10; design §6, §12]
 *
 * {@link defineModule} is the module author's entry point. It returns the declaration it is given, adds a typed `entry`
 * builder for the module's configuration as a hidden property, and its type rejects a callback under a name that is
 * not a point, even when the declaration is built first and passed in later (`Partial<PointCallbacks>` alone would
 * accept it). Startup checks every declaration again without relying on types (`./validation.ts`), so a module written
 * in JavaScript or built at run time is held to the same rules. [CF-2, A20]
 *
 * Each callback's arguments depend on its point. The database handles come from the database API (`src/db/api.ts`);
 * the contexts, the item sink and the API registry are declared here and built by the runner. [RN-4; design §2]
 */

import type { LedgerTask } from "../ledger/types.js";
import type { z } from "zod";
import { type EntryBuilder, moduleEntryBuilder } from "../config/entries.js";
import type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "../db/api.js";

/** The points: the runner's steps where module callbacks attach, in the order the runner reaches them. [RN-1] */
export const POINTS = Object.freeze([
  "on-start-db",
  "on-start-api",
  "on-best-block",
  "on-fetch",
  "on-parse",
  "on-rollback",
  "on-finalized",
  "on-start-height",
  "on-compute",
  "on-db-write",
  "on-after-db-write",
  "on-stop-height",
] as const);

/** A point's name. */
export type PointName = (typeof POINTS)[number];

/** How long an item lives: set once per process, valid while one block is processed, or stored in tables. [MD-1] */
export const LIFETIMES = Object.freeze(["process", "block", "table"] as const);

/** One lifetime of an item. */
export type Lifetime = (typeof LIFETIMES)[number];

/** A `table` item's kind: rows are only appended, or may also be changed. [MD-1] */
export const TABLE_KINDS = Object.freeze(["append-only", "mutable"] as const);

/** A settings field's kind: recorded in the configuration history, not recorded, or secret and never shown. [CF-4] */
export const FIELD_KINDS = Object.freeze(["data", "operational", "secret"] as const);

/** One settings field's kind. */
export type FieldKind = (typeof FIELD_KINDS)[number];

/**
 * A module's settings schema: a zod 4 object schema in which every field carries `kind: FieldKind` in its metadata.
 * Put `.meta({ kind })` on the field's outermost schema, after `.default()` or `.optional()`. Heights are integers;
 * byte values are hex strings. [CORE-ARCH §4.10, §4.12; design §7; Q44, Q45]
 */
export type FieldSchema = z.ZodObject;

/** A migration. Its checksum is the SHA-256 of its `sql` as UTF-8, and it runs in its own transaction. [DB-9] */
export interface Migration {
  id: string;
  sql: string;
}

/** Where a `table` item's data lives: its schema, its tables and their kind. [MD-1, DB-8, Q76, Q89] */
export interface TableDeclaration {
  /** The module's id with `-` replaced by `_`; for a shared item, the item's name with `-` replaced by `_`. [Q89] */
  schema: string;
  tables: string[];
  kind: (typeof TABLE_KINDS)[number];
  /**
   * `false` exempts the item's tables from the determinism rules, for data that does not follow from the chain alone.
   * Tables are deterministic by default, so `false` is the only value allowed here. [MD-1, DT-3, DT-4, DT-6, Q76]
   */
  deterministic?: false;
}

/** An item a module provides. [MD-1] */
export interface ItemDeclaration {
  /** A plain noun such as "chain-events", matching the name pattern of `src/db/roles.ts`. [DB-8] */
  name: string;
  /** One or more. */
  lifetimes: Lifetime[];
  /** Required when `lifetimes` holds `table`, and only then. */
  table?: TableDeclaration;
}

/** A module: what it requires and provides, its settings, migrations and callbacks. [MD-1, DB-10; CORE-ARCH §4.10] */
export interface ModuleDeclaration {
  /**
   * Unique, and matching the name pattern of `src/db/roles.ts`. A user module's id may not start with "core-" or "on-".
   * [MD-2, DB-8]
   */
  id: string;
  /** A semver version, recorded in the configuration history. [CORE-ARCH §4.12] */
  version: string;
  side: "public" | "private";
  /** The names of the items it needs: at least one, except for backbone parts, which may need none. */
  requires: string[];
  provides: ItemDeclaration[];
  /** Whether the module can start at a height after genesis, without the blocks before it. [MD-4; CORE-ARCH §4.10] */
  startsMidChain: boolean;
  /** Set by a private module that reads mutable public tables, so it runs in step with the public side. [PP-6] */
  needsLockstep?: boolean;
  /** The module runs only when development modules are explicitly enabled. [MD-5] */
  developmentOnly?: boolean;
  /** The module's settings; every field is marked data, operational or secret. [CF-4] */
  configSchema: FieldSchema;
  /** Applied in order and never undone; each is checksummed, and a new version keeps all earlier ones. [DB-9] */
  migrations: Migration[];
  /** True when this version may only run on a database that no other version of the module has written. [DB-10] */
  requiresResync?: boolean;
  /**
   * Functions the ledger worker runs on each block's native parsed objects. Each result becomes a `block` item of the
   * module, named after the task. A module with ledger tasks requires `block-parsed`, and also `ledger-state` if any
   * task declares `needsState`. [LG-17; design §5.5]
   */
  ledgerTasks?: readonly LedgerTask[];
  points: Partial<PointCallbacks>;
}

/** One revision of the calling module's configuration entry: its heights, version and settings. [CORE-ARCH §4.12] */
export interface Revision {
  start: bigint;
  stop: bigint | null;
  version: string;
  settings: Readonly<Record<string, unknown>>;
}

/** What every callback of a module receives. [MD-7; CORE-ARCH §4.10] */
export interface ProcessContext {
  /** The `process` items: `config`, `node-client` (core modules only), `db` (read-only) and `ledger-table`. [Q73] */
  items: ReadonlyMap<string, unknown>;
  /** The calling module's revisions, in start order. */
  revisions: readonly Revision[];
  /** Publishes a `process` item the module provides. Call it once, from `on-start-db`. [MD-7] */
  publish(item: string, value: unknown): void;
}

/** A block header from the block source: either announced as the best block, or dropped in a rollback. [IN-6] */
export interface BlockHeader {
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
}

/** What a callback receives for the block at one height. [RN-5; CORE-ARCH §4.10] */
export interface BlockContext {
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
  /** This block's `block` items. */
  items: ReadonlyMap<string, unknown>;
  /** The settings of the calling module's revision that covers this height. */
  settings: Readonly<Record<string, unknown>>;
  /** Whether the module with this id has an entry covering this height. */
  active: (moduleId: string) => boolean;
}

/** Where a module puts each `block` item it provides, once per block. [RN-5] */
export interface ItemSink {
  put(item: string, value: unknown): void;
}

/** Where `on-start-api` registers the module's HTTP routes and subscriptions. [RN-15, RN-16; CORE-ARCH §4.10] */
export interface ApiRegistry {
  http(
    method: "GET" | "POST",
    path: string,
    handler: (
      req: { params: Record<string, string>; body: unknown },
      read: ReadHandle,
    ) => Promise<{ status: number; headers?: Record<string, string>; body: unknown }>,
  ): void;
  /** `handler` returns its unsubscribe. */
  subscription(name: string, handler: (args: unknown, emit: (value: unknown) => void) => () => void): void;
}

/**
 * The callbacks a module may register, one per point. The read handles see the database at these heights:
 * `on-finalized` at the cursor, `on-start-height` at h − 1, and `on-stop-height` at h. In a private process,
 * `on-fetch` gets a read of the public database at its committed height (the public cursor, which is at least h), so
 * the module must select the public rows it needs by height. In the core, `on-fetch` gets no read handle.
 * [RN-4, PP-3, PP-5, Q100 A; CORE-ARCH §4.10; design §2]
 */
export interface PointCallbacks {
  "on-start-db"(p: ProcessContext, w: SchemaWriteHandle): Promise<void>;
  "on-start-api"(p: ProcessContext, api: ApiRegistry): Promise<void>;
  "on-best-block"(p: ProcessContext, header: BlockHeader): Promise<void>;
  "on-fetch"(p: ProcessContext, b: BlockContext, out: ItemSink, read?: ReadHandle): Promise<void>;
  "on-parse"(p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void>;
  "on-rollback"(p: ProcessContext, dropped: BlockHeader[]): Promise<void>;
  "on-finalized"(p: ProcessContext, head: { height: bigint; hash: Uint8Array }, read: ReadHandle): Promise<void>;
  "on-start-height"(p: ProcessContext, e: { entryId: string; height: bigint }, read: ReadHandle): Promise<void>;
  "on-compute"(p: ProcessContext, b: BlockContext, read: ReadHandle, out: ItemSink): Promise<void>;
  "on-db-write"(p: ProcessContext, b: BlockContext, w: BlockWriteHandle): Promise<void>;
  "on-after-db-write"(p: ProcessContext, b: BlockContext, read: ReadHandle): Promise<void>;
  "on-stop-height"(p: ProcessContext, e: { entryId: string; height: bigint }, read: ReadHandle): Promise<void>;
}

/**
 * The part of {@link defineModule}'s parameter that refuses a callback under a name that is not a point: each such
 * name must hold a value of a type no callback has, whose name is the compiler's message.
 */
export type KnownPointsOnly<D extends ModuleDeclaration> = {
  readonly points: {
    readonly [K in Exclude<keyof D["points"], PointName>]: `${K & string} is not a point name (unknown-point)`;
  };
};

/** What `defineModule` returns: the same declaration, with its `entry` builder added. [CF-2] */
export type DefinedModule<D extends ModuleDeclaration> = D & {
  /**
   * Builds the module's configuration entry for one revision: `{ id, start, stop?, version, config }`. The id and
   * version come from the declaration, and `config` is typed by the module's settings schema. A module package exports
   * this builder. [CF-2]
   */
  readonly entry: EntryBuilder<D>;
};

/**
 * Declares a module. Returns `declaration` itself, with its `entry` builder added as a non-enumerable, read-only
 * property, so `Object.keys`, spreads, JSON and the validation in `./validation.ts` see the declaration unchanged.
 * [MD-1, CF-2]
 *
 * The parameter type checks the declaration and rejects a callback under a name that is not a point, even when the
 * declaration was built first and passed in later (`ModuleDeclaration` alone would accept it). Startup checks the
 * declaration again at run time. [A20]
 *
 * Throws a `TypeError` if the declaration cannot take a new property (frozen, sealed or not extensible); freeze it
 * after calling `defineModule`, not before.
 */
export function defineModule<D extends ModuleDeclaration>(declaration: D & KnownPointsOnly<D>): DefinedModule<D> {
  if (!Object.isExtensible(declaration)) {
    throw new TypeError(
      `defineModule adds the entry builder to the declaration of ${String(declaration.id)}, which is frozen, sealed ` +
        "or not extensible: freeze the declaration after defineModule, not before",
    );
  }
  Object.defineProperty(declaration, "entry", {
    value: moduleEntryBuilder<D>(declaration),
    enumerable: false,
    writable: false,
    configurable: true,
  });
  return declaration as DefinedModule<D>;
}
