import type { ItemDeclaration, ModuleDeclaration } from "../../src/modules/declaration.js";
import type { EntryRange, GraphInput, HeightRange } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration } from "./declarations.js";

/**
 * Declarations and inputs for the requirement graph's tests (task 3.2; MD-3–MD-6, RN-3): a test backbone shaped like
 * CORE-ARCH §4.11's (`core-chain`, `core-block-fetch`, `core-block-commit`, `core-digest`, each able to start mid-chain,
 * as the backbone runs from whatever S a database has), modules that provide or require named items, and the input
 * `resolveGraph` takes, with S = 1 unless a test says otherwise.
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

/** The test backbone, in RN-3's fixed order. */
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

/** What `resolveGraph` takes: the test backbone, `user` modules (and `core` ones), validated; S = 1; no opt-in. */
export function graphInput(
  user: readonly ModuleDeclaration[],
  entries: readonly EntryRange[],
  rest: {
    readonly core?: readonly ModuleDeclaration[];
    readonly backbone?: readonly ModuleDeclaration[];
    readonly start?: bigint;
    readonly developmentOptIn?: boolean;
  } = {},
): GraphInput {
  return {
    declarations: validateDeclarations({ backbone: rest.backbone ?? BACKBONE, core: rest.core ?? [], user }),
    start: rest.start ?? S,
    entries,
    developmentOptIn: rest.developmentOptIn ?? false,
  };
}
