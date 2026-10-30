/**
 * Turns validated declarations (`./validation.ts`) into the database API's inputs: the modules of the schema plan
 * (`planSchemas`, `src/db/roles.ts`) and the parts the migration runner runs (`startDatabase`, `src/db/migrate.ts`).
 * Which declarations go in, and in which order, comes from the requirement graph's `modules` (`./graph.ts`); the
 * runner runs them. [MD-1, DB-6, DB-8, DB-9, DB-10; design §4, §6]
 */

import type { SchemaWriteHandle } from "../db/api.js";
import { type MigrationPart, OWN_PARTS } from "../db/migrate.js";
import { planSchemas, type SchemaItem, type SchemaModule, type SchemaPlan } from "../db/roles.js";
import type { ItemDeclaration, ModuleDeclaration, ProcessContext } from "./declaration.js";

/** An item as the schema plan reads it: its name and, for a `table` item, its schema, tables and `deterministic` flag. */
function schemaItem(item: ItemDeclaration): SchemaItem {
  if (item.table === undefined) return { name: item.name };
  const { schema, tables, deterministic } = item.table;
  return { name: item.name, table: { schema, tables, ...(deterministic === false ? { deterministic } : {}) } };
}

/** What the schema plan reads of a declaration: id, requirements, items with their tables, migrations. [DB-6, DB-8] */
export function schemaModule(declaration: ModuleDeclaration): SchemaModule {
  return {
    id: declaration.id,
    requires: declaration.requires,
    provides: declaration.provides.map(schemaItem),
    migrations: declaration.migrations.map(({ id, sql }) => ({ id, sql })),
  };
}

/**
 * The schema plan's modules for `declarations`: all of them except UmbraDB's own parts with reserved schemas
 * (`OWN_PARTS`: `core-chain`, `core-digest`), which run as the writer's login and get no module schema.
 */
export function schemaModules(declarations: readonly ModuleDeclaration[]): SchemaModule[] {
  return declarations.filter((declaration) => !OWN_PARTS.includes(declaration.id)).map(schemaModule);
}

/**
 * The schema plan for one database's parts. Runs `planSchemas` on its modules ({@link schemaModules}) and also puts the
 * item names of the own parts (`core-chain`, `core-digest`) in the plan's single namespace, so no module can use one of
 * them (`db`, `config`, …) as its id; such a module is a `schema-collision`. `declarations` are the requirement graph's
 * `modules` (`./graph.ts`): every part of the database, in startup order. [DB-6, DB-8]
 */
export function schemaPlan(declarations: readonly ModuleDeclaration[]): SchemaPlan {
  const own = declarations
    .filter((declaration) => OWN_PARTS.includes(declaration.id))
    .map(({ id, provides }) => ({ id, provides: provides.map(({ name }) => ({ name })) }));
  return planSchemas(schemaModules(declarations), own);
}

/**
 * The part of a declaration the migration runner runs: its id, version, `requiresResync` as declared, its migrations,
 * and its `on-start-db` callback. The callback is called as a method of `points`, with `context` (the module's process
 * context) and the schema write handle the runner opens (`src/db/write-handles.ts`); its errors pass through unchanged.
 * [DB-9, DB-10]
 */
export function migrationPart(declaration: ModuleDeclaration, context: ProcessContext): MigrationPart {
  const { points } = declaration;
  const setup = points["on-start-db"];
  return {
    id: declaration.id,
    version: declaration.version,
    ...(declaration.requiresResync === undefined ? {} : { requiresResync: declaration.requiresResync }),
    migrations: declaration.migrations.map(({ id, sql }) => ({ id, sql })),
    ...(setup === undefined ? {} : { onStartDb: (w: SchemaWriteHandle) => setup.call(points, context, w) }),
  };
}
