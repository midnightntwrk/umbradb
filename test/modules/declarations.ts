import { z } from "zod";
import { schemaName } from "../../src/db/roles.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";

/**
 * Declarations for the tests of `src/modules/` (task 3.1; MD-1, MD-2): {@link declaration} builds a module that every
 * check accepts, with one `table` item in its own schema and one migration creating its table, so that a test changes
 * exactly the part it is about.
 */

/** A declaration every check accepts: module `id`, one table item `<id>-rows`, one setting of each kind. */
export function declaration(id: string, rest: Partial<ModuleDeclaration> = {}): ModuleDeclaration {
  const schema = schemaName(id);
  return {
    id,
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [
      { name: `${id}-rows`, lifetimes: ["block", "table"], table: { schema, tables: ["rows"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({
      limit: z.number().int().default(10).meta({ kind: "data" }),
      pollMs: z.number().int().meta({ kind: "operational" }),
      token: z.string().optional().meta({ kind: "secret" }),
    }),
    migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY)` }],
    points: {},
    ...rest,
  };
}

/** A set of declarations: user modules only, unless the backbone or core modules are given. */
export function userModules(
  user: readonly unknown[],
  rest: { readonly backbone?: readonly unknown[]; readonly core?: readonly unknown[] } = {},
): DeclarationSet {
  return { backbone: rest.backbone ?? [], core: rest.core ?? [], user };
}
