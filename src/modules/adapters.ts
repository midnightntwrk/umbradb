/**
 * From validated declarations (`./validation.ts`) to the database API's inputs (`design.md` §4, §6; MD-1, DB-6, DB-8,
 * DB-9, DB-10): the schema plan's modules (`planSchemas`, `src/db/roles.ts`) and the migration runner's parts
 * (`startDatabase`, `src/db/migrate.ts`), taken from the same declarations. Which declarations a plan holds and in which
 * order the parts run are the requirement graph's (task 3.2); running them is the runner's (tasks 5.x).
 */

import type { SchemaWriteHandle } from "../db/api.js";
import { type MigrationPart, OWN_PARTS } from "../db/migrate.js";
import type { SchemaItem, SchemaModule } from "../db/roles.js";
import type { ItemDeclaration, ModuleDeclaration, ProcessContext } from "./declaration.js";

/** An item as the schema plan reads it: its name and, for a `table` item, its schema, tables and `deterministic` flag. */
function schemaItem(item: ItemDeclaration): SchemaItem {
  if (item.table === undefined) return { name: item.name };
  const { schema, tables, deterministic } = item.table;
  return { name: item.name, table: { schema, tables, ...(deterministic === false ? { deterministic } : {}) } };
}

/** What the schema plan reads of a declaration (DB-6, DB-8): id, requirements, items and their tables, migrations. */
export function schemaModule(declaration: ModuleDeclaration): SchemaModule {
  return {
    id: declaration.id,
    requires: declaration.requires,
    provides: declaration.provides.map(schemaItem),
    migrations: declaration.migrations.map(({ id, sql }) => ({ id, sql })),
  };
}

/**
 * The schema plan's modules of `declarations`: every one except UmbraDB's own parts whose schemas are reserved
 * (`OWN_PARTS`: `core-chain`, `core-digest`), which run as the writer's login and are no module schemas of a plan.
 */
export function schemaModules(declarations: readonly ModuleDeclaration[]): SchemaModule[] {
  return declarations.filter((declaration) => !OWN_PARTS.includes(declaration.id)).map(schemaModule);
}

/**
 * What the migration runner runs of a declaration (DB-9, DB-10): its id, version, `requiresResync` as declared, its
 * migrations, and its `on-start-db` callback — called as a method of its `points` with `context`, the module's process
 * context, and the schema write handle the runner opens (`src/db/write-handles.ts`), its error passed on unchanged.
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
