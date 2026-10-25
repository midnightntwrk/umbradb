/**
 * The module declaration (`openspec/changes/core-arch/specs/modules/spec.md` MD-1, `design.md` §2, §6, §12; CORE-ARCH
 * §4.10): a module is a TypeScript package exporting a {@link ModuleDeclaration}, which the host program imports — the
 * system loads no module by name at run time. The declaration is CORE-ARCH §4.10's, plus `requiresResync` (DB-10);
 * `ProcessContext` also has `publish` for `process` items (MD-7). Ids and item names match DB-8's pattern
 * (`src/db/roles.ts`).
 *
 * {@link defineModule} is the module author's entry point: it returns the declaration it is given, with the module's
 * typed `entry` builder for the configuration (CF-2) added as a property enumeration does not see, and its type refuses
 * a callback under a name that is not a point (A20) — also in a declaration built first and passed later, which
 * `Partial<PointCallbacks>` alone would accept. Startup validates every declaration again without the types
 * (`./validation.ts`), so a module written in JavaScript or built at run time is held to the same declaration.
 *
 * The callbacks' arguments are typed by their point (CORE-ARCH §4.10): the database handles of RN-4 come from the
 * database API (`src/db/api.ts`); the contexts, the item sink and the API registry are declared here and built by the
 * runner (tasks 5.x).
 */

import type { z } from "zod";
import { type EntryBuilder, moduleEntryBuilder } from "../config/entries.js";
import type { BlockWriteHandle, ReadHandle, SchemaWriteHandle } from "../db/api.js";

/** The points, in `design.md` §2's order: the steps of the runner where callbacks attach (RN-1). */
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
  "on-key",
] as const);

/** A point's name. */
export type PointName = (typeof POINTS)[number];

/** An item's lifetimes (MD-1): set once per process, valid while one block is processed, stored in tables. */
export const LIFETIMES = Object.freeze(["process", "block", "table"] as const);

/** One lifetime of an item. */
export type Lifetime = (typeof LIFETIMES)[number];

/** A `table` item's kind: rows only appended, or also changed (MD-1). */
export const TABLE_KINDS = Object.freeze(["append-only", "mutable"] as const);

/** A settings field's kind (CF-4): recorded in the history, not recorded, never shown. */
export const FIELD_KINDS = Object.freeze(["data", "operational", "secret"] as const);

/** One settings field's kind. */
export type FieldKind = (typeof FIELD_KINDS)[number];

/**
 * A module's settings schema (CORE-ARCH §4.10 and §4.12, Q44, Q45): a zod 4 object schema, every field of which carries
 * `kind: FieldKind` in its metadata — `.meta({ kind })` on the field's outermost schema, after `.default()` or
 * `.optional()` (design §7). Heights are integers; byte values are hex strings.
 */
export type FieldSchema = z.ZodObject;

/** A migration (DB-9): its checksum is SHA-256 of its UTF-8 `sql`; it runs in a transaction of its own. */
export interface Migration {
  id: string;
  sql: string;
}

/** The tables of a `table` item (MD-1, DB-8, Q76, Q89). */
export interface TableDeclaration {
  /** Its module's schema (the id with `-` → `_`), or for a shared item the item's name with `-` → `_` (Q89). */
  schema: string;
  tables: string[];
  kind: (typeof TABLE_KINDS)[number];
  /**
   * `false` opts the item's tables out of the determinism rules (MD-1, DT-3, DT-4, DT-6, Q76): for data that is not a
   * function of the chain. Tables are deterministic unless declared so; only `false` may be written.
   */
  deterministic?: false;
}

/** An item a module provides (MD-1). */
export interface ItemDeclaration {
  /** A plain noun, e.g. "chain-events" (DB-8's pattern). */
  name: string;
  /** One or more. */
  lifetimes: Lifetime[];
  /** Required when `lifetimes` holds `table`, and only then. */
  table?: TableDeclaration;
}

/** A module (MD-1; CORE-ARCH §4.10, plus `requiresResync`, DB-10). */
export interface ModuleDeclaration {
  /** Unique; user modules may not start with "core-" or "on-" (MD-2); DB-8's pattern. */
  id: string;
  /** Semver; recorded in the configuration history (CORE-ARCH §4.12). */
  version: string;
  side: "public" | "private";
  /** Item names, at least one (backbone parts may require none). */
  requires: string[];
  provides: ItemDeclaration[];
  /** Private modules: key kinds the key registry admits (PP-8). */
  keyKinds?: string[];
  /** Required when `keyKinds` is set. */
  validateKey?(kind: string, bytes: Uint8Array): boolean;
  /** CORE-ARCH §4.10, "Mid-chain start"; MD-4. */
  startsMidChain: boolean;
  /** Private modules that read mutable public tables (PP-6). */
  needsLockstep?: boolean;
  /** Needs the development opt-in (MD-5). */
  developmentOnly?: boolean;
  /** Every field marked data, operational or secret (CF-4). */
  configSchema: FieldSchema;
  /** Forward-only, checksummed, cumulative (DB-9). */
  migrations: Migration[];
  /** True when this version may run only on a database no other version of the module wrote (DB-10). */
  requiresResync?: boolean;
  points: Partial<PointCallbacks>;
}

/** One entry revision of the calling module (CORE-ARCH §4.12). */
export interface Revision {
  start: bigint;
  stop: bigint | null;
  version: string;
  settings: Readonly<Record<string, unknown>>;
}

/** What every callback of a module gets (CORE-ARCH §4.10, MD-7). */
export interface ProcessContext {
  /** `process` items: config, node-client (core only), db (read-only, Q73), ledger-table. */
  items: ReadonlyMap<string, unknown>;
  /** The calling module's revisions, in start order. */
  revisions: readonly Revision[];
  /** Publishes a `process` item the module provides, once, from its `on-start-db` (MD-7). */
  publish(item: string, value: unknown): void;
}

/** A block's header as the block source's queue sees it: announced as the best block, or dropped (IN-6). */
export interface BlockHeader {
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
}

/** What a callback of one height gets (CORE-ARCH §4.10, RN-5). */
export interface BlockContext {
  height: bigint;
  hash: Uint8Array;
  parentHash: Uint8Array;
  /** This block's `block` items. */
  items: ReadonlyMap<string, unknown>;
  /** The calling module's revision covering this height. */
  settings: Readonly<Record<string, unknown>>;
  /** Entry ranges at this height. */
  active: (moduleId: string) => boolean;
}

/** Where a module puts a `block` item it provides, once per block (RN-5). */
export interface ItemSink {
  put(item: string, value: unknown): void;
}

/** A key that became pending in a private process (PP-8): its id, SHA-256(UTF-8 kind ‖ bytes), its kind and bytes. */
export interface PendingKey {
  keyId: Uint8Array;
  kind: string;
  bytes: Uint8Array;
}

/** What `on-start-api` registers the module's API on (CORE-ARCH §4.10, RN-15, RN-16). */
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

/** The callbacks a module may register, by point (CORE-ARCH §4.10; `design.md` §2 gives each its handle). */
export interface PointCallbacks {
  "on-start-db"(p: ProcessContext, w: SchemaWriteHandle): Promise<void>;
  "on-start-api"(p: ProcessContext, api: ApiRegistry): Promise<void>;
  "on-best-block"(p: ProcessContext, header: BlockHeader): Promise<void>;
  "on-fetch"(p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void>;
  "on-parse"(p: ProcessContext, b: BlockContext, out: ItemSink): Promise<void>;
  "on-rollback"(p: ProcessContext, dropped: BlockHeader[]): Promise<void>;
  "on-finalized"(p: ProcessContext, head: { height: bigint; hash: Uint8Array }): Promise<void>;
  "on-start-height"(p: ProcessContext, e: { entryId: string; height: bigint }): Promise<void>;
  "on-compute"(p: ProcessContext, b: BlockContext, read: ReadHandle, out: ItemSink): Promise<void>;
  "on-db-write"(p: ProcessContext, b: BlockContext, w: BlockWriteHandle): Promise<void>;
  "on-after-db-write"(p: ProcessContext, b: BlockContext, read: ReadHandle): Promise<void>;
  "on-stop-height"(p: ProcessContext, e: { entryId: string; height: bigint }): Promise<void>;
  "on-key"(p: ProcessContext, key: PendingKey): Promise<void>;
}

/**
 * The part of {@link defineModule}'s parameter that refuses a callback under a name that is not a point: each such
 * name must hold a value of a type no callback has, whose name is the compiler's message.
 */
export type KnownPointsOnly<D extends ModuleDeclaration> = {
  readonly points: {
    readonly [K in Exclude<keyof D["points"], PointName>]: `${K & string} is not a point name (unknown-point, MD-1)`;
  };
};

/** A declaration `defineModule` returned: the declaration, with its `entry` builder (CF-2). */
export type DefinedModule<D extends ModuleDeclaration> = D & {
  /**
   * The module's configuration entry for one revision (CF-2): `{ id, start, stop?, version, config }`, its id and
   * version the declaration's, its `config` typed by the module's settings schema. A module package exports it.
   */
  readonly entry: EntryBuilder<D>;
};

/**
 * Declares a module (MD-1): returns `declaration` itself, with its `entry` builder (CF-2) defined on it as a
 * non-enumerable, read-only property — so `Object.keys`, a spread, JSON and the validation (`./validation.ts`, whose
 * known properties do not include it) see the declaration unchanged. Its type checks the declaration — and, unlike
 * `ModuleDeclaration` alone, refuses a callback under a name that is not a point also when the declaration was built
 * first and passed later (A20). Startup validates it again at run time. Throws a `TypeError` for a declaration that
 * cannot take a property (frozen, sealed or not extensible): freeze it after `defineModule`.
 */
export function defineModule<D extends ModuleDeclaration>(declaration: D & KnownPointsOnly<D>): DefinedModule<D> {
  if (!Object.isExtensible(declaration)) {
    throw new TypeError(
      `defineModule adds the entry builder to the declaration of ${String(declaration.id)}, which is frozen, sealed or ` +
        "not extensible (CF-2): freeze the declaration after defineModule, not before",
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
