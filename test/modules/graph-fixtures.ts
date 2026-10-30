import type { ItemDeclaration, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { EntryRange, GraphInput, HeightRange } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration } from "./declarations.js";

/**
 * Declarations and inputs for the requirement graph's tests:
 * - a test backbone shaped like the real one (`core-chain`, `core-block-fetch`, `core-block-commit`, `core-digest`),
 *   each part able to start mid-chain, since the backbone runs from whatever S a database has [CORE-ARCH §4.11];
 * - modules that provide or require named items;
 * - the input `resolveGraph` takes, with S = 1 and a new database (cursor null) unless a test says otherwise.
 * [MD-3, MD-4, MD-5, MD-6, RN-3]
 *
 * Since S = 1 is above 0 (genesis), every part starting at S here starts mid-chain. So the test backbone and the
 * modules of `declaration` declare `startsMidChain: true`, and a test of a module that cannot start mid-chain sets
 * S = 0 or a cursor at or above its start. [MD-4, Q96]
 */

/** S in these tests: the first `core` entry's start. */
export const S = 1n;

/** An item with the `block` lifetime only: no schema, no table. */
export function blockItem(name: string): ItemDeclaration {
  return { name, lifetimes: ["block"] };
}

/** `core-chain`: requires nothing; provides the process items and `chain-identity` in its reserved schema. */
export const CORE_CHAIN = declaration("core-chain", {
  requires: [],
  provides: [
    { name: "config", lifetimes: ["process"] },
    { name: "node-client", lifetimes: ["process"] },
    { name: "db", lifetimes: ["process"] },
    { name: "ledger-table", lifetimes: ["process"] },
    {
      name: "chain-identity",
      lifetimes: ["table"],
      table: { schema: "core_chain", tables: ["identity"], kind: "mutable" },
    },
  ],
  migrations: [
    {
      id: "001",
      sql: "CREATE TABLE core_chain.identity (id smallint PRIMARY KEY CHECK (id = 1), start_height bigint NOT NULL)",
    },
  ],
});

/** `core-block-fetch`: the block items, from the node client and the ledger table. */
export const CORE_BLOCK_FETCH = declaration("core-block-fetch", {
  requires: ["node-client", "ledger-table"],
  provides: ["block-header", "block-body", "runtime-metadata", "ledger-version"].map(blockItem),
  migrations: [],
});

/** `core-block-commit`: the `blocks` table. */
export const CORE_BLOCK_COMMIT = declaration("core-block-commit", {
  requires: ["block-header", "ledger-version"],
  provides: [
    {
      name: "blocks",
      lifetimes: ["table"],
      table: { schema: "core_block_commit", tables: ["blocks"], kind: "append-only" },
    },
  ],
  migrations: [{ id: "001", sql: "CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY)" }],
});

/** `core-digest`: its two tables in its reserved schema, which its own migration creates (as the login). */
export const CORE_DIGEST = declaration("core-digest", {
  requires: ["blocks"],
  provides: [
    {
      name: "digest-tables",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["tables"], kind: "mutable" },
    },
    {
      name: "digest-checkpoints",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["checkpoints"], kind: "append-only" },
    },
  ],
  migrations: [
    {
      id: "001",
      sql:
        "CREATE SCHEMA core_digest; " +
        "CREATE TABLE core_digest.tables (schema_name text, table_name text, PRIMARY KEY (schema_name, table_name))",
    },
  ],
});

/** The test backbone, in the backbone's fixed order. [RN-3] */
export const BACKBONE: readonly ModuleDeclaration[] = [CORE_CHAIN, CORE_BLOCK_FETCH, CORE_BLOCK_COMMIT, CORE_DIGEST];

/** A module that provides the `block` items `items` and requires `block-header` (unless `rest` says otherwise). */
export function provider(id: string, items: readonly string[], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  return declaration(id, { provides: items.map(blockItem), migrations: [], ...rest });
}

/** A module that requires `items` and provides nothing (unless `rest` says otherwise). */
export function consumer(id: string, items: readonly string[], rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  return declaration(id, { requires: [...items], provides: [], migrations: [], ...rest });
}

/** One revision's range: `start` to `stop` inclusive, or with no stop. */
export function entry(id: string, start: number, stop: number | null = null): EntryRange {
  return { id, start: BigInt(start), stop: stop === null ? null : BigInt(stop) };
}

/** A closed height range, as refusals and resolved ranges name it. */
export function range(from: number, to: number | null): HeightRange {
  return { from: BigInt(from), to: to === null ? null : BigInt(to) };
}

/**
 * What `resolveGraph` takes: the test backbone, `user` modules (and `core` ones), validated; S = 1; no opt-in; a new
 * database (cursor null) unless `cursor` gives the last committed height.
 */
export function graphInput(
  user: readonly ModuleDeclaration[],
  entries: readonly EntryRange[],
  rest: {
    readonly core?: readonly ModuleDeclaration[];
    readonly backbone?: readonly ModuleDeclaration[];
    readonly start?: bigint;
    readonly developmentOptIn?: boolean;
    readonly cursor?: bigint | null;
  } = {},
): GraphInput {
  return {
    declarations: validateDeclarations({ backbone: rest.backbone ?? BACKBONE, core: rest.core ?? [], user }),
    start: rest.start ?? S,
    entries,
    developmentOptIn: rest.developmentOptIn ?? false,
    cursor: rest.cursor ?? null,
  };
}

/**
 * The test backbone with `id`'s part declaring `startsMidChain: false`; the mid-chain start check applies to backbone
 * parts too. [MD-4, Q96]
 */
export function backboneWithout(id: string): ModuleDeclaration[] {
  return BACKBONE.map((part) => (part.id === id ? { ...part, startsMidChain: false } : part));
}
