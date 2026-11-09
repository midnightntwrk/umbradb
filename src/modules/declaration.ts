/**
 * The module declaration. A module is a TypeScript package that exports a {@link ModuleDeclaration}; the host program
 * imports it, and nothing loads a module by name at run time. Module ids and item names follow the name pattern of
 * `src/db/roles.ts`.
 *
 * {@link defineModule} is the module author's entry point. It returns the declaration it is given, adds a typed `entry`
 * builder for the module's configuration as a hidden property, and its type rejects a callback under a name that is
 * not a point, even when the declaration is built first and passed in later (`Partial<PointCallbacks>` alone would
 * accept it). Startup checks every declaration again without relying on types (`./validation.ts`), so a module written
 * in JavaScript or built at run time is held to the same rules.
 *
 * Each callback's arguments depend on its point. The database handles come from the database API (`src/db/api.ts`);
 * the contexts, the item sink and the API registry are declared here and built by the runner.
 */

import type { LedgerTask } from "../ledger/types.js";
import type { z } from "zod";
import { type EntryBuilder, moduleEntryBuilder } from "../config/entries.js";
import type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "../db/api.js";
import type { ContentFunction } from "../determinism/contents-hash.js";

/** The points: the runner's steps where module callbacks attach, in the order the runner reaches them. */
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

/** How long an item lives: set once per process, valid while one block is processed, or stored in tables. */
export const LIFETIMES = Object.freeze(["process", "block", "table"] as const);

/** One lifetime of an item. */
export type Lifetime = (typeof LIFETIMES)[number];

/** A `table` item's kind: rows are only appended, or may also be changed. */
export const TABLE_KINDS = Object.freeze(["append-only", "mutable"] as const);

/** A settings field's kind: recorded in the configuration history, not recorded, or secret and never shown. */
export const FIELD_KINDS = Object.freeze(["data", "operational", "secret"] as const);

/** One settings field's kind. */
export type FieldKind = (typeof FIELD_KINDS)[number];

/**
 * A module's settings schema: a zod 4 object schema in which every field carries `kind: FieldKind` in its metadata.
 * Put `.meta({ kind })` on the field's outermost schema, after `.default()` or `.optional()`. Heights are integers;
 * byte values are hex strings.
 */
export type FieldSchema = z.ZodObject;

/** A migration. Its checksum is the SHA-256 of its `sql` as UTF-8, and it runs in its own transaction. */
export interface Migration {
  id: string;
  sql: string;
}

/**
 * Tables of a `table` item that take part in the contents hash by what they hold rather than by their bytes, and the
 * function that gives it (`src/determinism/contents-hash.ts`). They are not captured or digested per block; they stay
 * deterministic, so the column rules and the `TRUNCATE` guard apply to them. Only UmbraDB's own backbone parts and
 * core modules declare them: a user module that does is refused (`invalid-declaration`), since its tables are hashed
 * by their rows.
 */
export interface ContentDefinition {
  /** Some of the item's tables, at least one. */
  tables: string[];
  /** Their content, read from the snapshot the contents hash reads. */
  content: ContentFunction;
}

/** Where a `table` item's data lives: its schema, its tables and their kind. */
export interface TableDeclaration {
  /** The module's id with `-` replaced by `_`; for a shared item, the item's name with `-` replaced by `_`. */
  schema: string;
  tables: string[];
  kind: (typeof TABLE_KINDS)[number];
  /**
   * `false` exempts the item's tables from the determinism rules, for data that does not follow from the chain alone.
   * Tables are deterministic by default, so `false` is the only value allowed here.
   */
  deterministic?: false;
  /** The item's content-defined tables ({@link ContentDefinition}): UmbraDB's own parts only. */
  contentDefined?: ContentDefinition;
}

/** An item a module provides. */
export interface ItemDeclaration {
  /** A plain noun such as "chain-events", matching the name pattern of `src/db/roles.ts`. */
  name: string;
  /** One or more. */
  lifetimes: Lifetime[];
  /** Required when `lifetimes` holds `table`, and only then. */
  table?: TableDeclaration;
}

/** A module: what it requires and provides, its settings, migrations and callbacks. */
export interface ModuleDeclaration {
  /**
   * Unique, and matching the name pattern of `src/db/roles.ts`. A user module's id may not start with "core-" or "on-".
   */
  id: string;
  /** A semver version, recorded in the configuration history. */
  version: string;
  side: "public" | "private";
  /** The names of the items it needs: at least one, except for backbone parts, which may need none. */
  requires: string[];
  provides: ItemDeclaration[];
  /** Whether the module can start at a height after genesis, without the blocks before it. */
  startsMidChain: boolean;
  /** Set by a private module that reads mutable public tables, so it runs in step with the public side. */
  needsLockstep?: boolean;
  /** The module runs only when development modules are explicitly enabled. */
  developmentOnly?: boolean;
  /** The module's settings; every field is marked data, operational or secret. */
  configSchema: FieldSchema;
  /** Applied in order and never undone; each is checksummed, and a new version keeps all earlier ones. */
  migrations: Migration[];
  /** True when this version may only run on a database that no other version of the module has written. */
  requiresResync?: boolean;
  /**
   * Functions the ledger worker runs on each block's native parsed objects. Each result becomes a `block` item of the
   * module, named after the task. A module with ledger tasks requires `block-parsed`, and also `ledger-state` if any
   * task declares `needsState`.
   */
  ledgerTasks?: readonly LedgerTask[];
  points: Partial<PointCallbacks>;
}

/** One revision of the calling module's configuration entry: its heights, version and settings. */
export interface Revision {
  start: bigint;
  stop: bigint | null;
  version: string;
  settings: Readonly<Record<string, unknown>>;
}

/** What every callback of a module receives. */
export interface ProcessContext {
  /** The `process` items: `config`, `node-client` (core modules only), `db` (read-only) and `ledger-table`. */
  items: ReadonlyMap<string, unknown>;
  /** The calling module's revisions, in start order. */
  revisions: readonly Revision[];
  /** Publishes a `process` item the module provides. Call it once, from `on-start-db`. */
  publish(item: string, value: unknown): void;
}

/** A block header from the block source: either announced as the best block, or dropped in a rollback. */
export interface BlockHeader {
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
}

/** What a callback receives for the block at one height. */
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

/** Where a module puts each `block` item it provides, once per block. */
export interface ItemSink {
  put(item: string, value: unknown): void;
}

/** Where `on-start-api` registers the module's HTTP routes and subscriptions. */
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

/** What `defineModule` returns: the same declaration, with its `entry` builder added. */
export type DefinedModule<D extends ModuleDeclaration> = D & {
  /**
   * Builds the module's configuration entry for one revision: `{ id, start, stop?, version, config }`. The id and
   * version come from the declaration, and `config` is typed by the module's settings schema. A module package exports
   * this builder.
   */
  readonly entry: EntryBuilder<D>;
};

/**
 * Declares a module. Returns `declaration` itself, with its `entry` builder added as a non-enumerable, read-only
 * property, so `Object.keys`, spreads, JSON and the validation in `./validation.ts` see the declaration unchanged.
 *
 * The parameter type checks the declaration and rejects a callback under a name that is not a point, even when the
 * declaration was built first and passed in later (`ModuleDeclaration` alone would accept it). Startup checks the
 * declaration again at run time.
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
