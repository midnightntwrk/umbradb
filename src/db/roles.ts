/**
 * Module roles and schemas (`openspec/changes/core-arch/design.md` §4, "Roles", "Provider functions", "Identifier
 * lengths"; DB-6, DB-7, DB-8, MD-2; decision record Q46, Q89, Q90).
 *
 * **Names (DB-8).** Module ids and item names match {@link ID_PATTERN} within {@link ID_MAX_BYTES} bytes, so a module's
 * schema — its id with `-` → `_` — is one-to-one, and its role `umbradb_m_<schema>` (an item's
 * `umbradb_i_<schema>`) stays within PostgreSQL's 63-byte names. Module schemas and item names share one namespace
 * that excludes the schemas UmbraDB itself creates ({@link RESERVED_SCHEMAS}, and every name starting with `pg_`). A
 * `table` item declares its schema (CORE-ARCH §4.10): its module's own, or the item's name (`-` → `_`), which makes the
 * item a *shared* item with one schema, owned by its own role, whoever provides it (Q89). A provider of a shared
 * `table` item writes under the item's role — its callbacks, `on-start-db` and migrations — so the item's tables
 * belong to that role and every provider of the item can write them; its own role and schema still exist, empty. The
 * providers of one item must declare it alike: the same schema, the same `deterministic` flag (Q76) and the same
 * migrations (ids and SHA-256 checksums). {@link planSchemas} checks all of this before anything reaches a database
 * and throws the refusal (`bad-id`, `schema-collision`, `shared-item-migrations-differ`, design §11); "startup
 * refuses" is the runner's.
 *
 * **Roles and grants (DB-6, DB-7).** {@link prepareSchemas}, at every startup and before any migration, creates what
 * is missing: the schema `core_chain` (the first step of DB-9's bootstrap, which `./migrate.ts` completes), each role
 * (`NOLOGIN`) and each schema, owned by its role. As each schema's owner (`SET LOCAL ROLE`) it grants every other role
 * of the plan `USAGE` on the schema and `SELECT` on its tables, now and by default privilege; revokes `EXECUTE` on the
 * routines its owner creates from `PUBLIC` (the owner's default privilege, set before any migration creates one); and
 * grants `EXECUTE`, now and by default privilege, to the write roles of the modules that require an item whose
 * provider writes the schema; then it returns to the login's role. A callback, the schema write handle and a
 * migration run after {@link setModuleRole}, whose role writes its own schema and reads the others; the database
 * rejects anything else (`42501`). Modules are trusted (Q46): the roles stop mistakes, nothing more.
 *
 * **The login (Q90).** The writer's login is a superuser, or holds `CREATEROLE` (to create a missing role) and
 * `CREATE` on the database (to create a missing schema). PostgreSQL 16 and later give the creator of a role `ADMIN` on
 * it only — no `SET`, no `INHERIT` — so a login that is not a superuser grants itself each role `WITH INHERIT TRUE,
 * SET TRUE`: `SET` for `SET LOCAL ROLE` and `CREATE SCHEMA … AUTHORIZATION`, `INHERIT` so that its read pool reads
 * every module table and it can attach the `TRUNCATE` triggers (`./truncate-guard.ts`); `SET LOCAL ROLE` still gives a
 * callback exactly its role's privileges. Roles belong to the PostgreSQL server, not to one database, so every UmbraDB
 * database on a server shares them; a login that can neither use nor grant itself a role (another login created it)
 * is refused, as is a login lacking a privilege it needs — `invalid-configuration`, `reason: writer-privileges`,
 * before anything is created, naming each and what an administrator can run. PGlite runs as its superuser,
 * `postgres`.
 */

import { createHash } from "node:crypto";
import { quoteIdentifier } from "../deterministic-postgresql/index.js";
import type { Transaction } from "./api.js";
import { UmbraError } from "./errors.js";

/** Module ids and item names (DB-8, MD-1): lowercase words of letters and digits, joined by single hyphens. */
export const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** The longest id or item name, in bytes: `umbradb_m_` and `umbradb_i_` add 10, within PostgreSQL's 63 (DB-8). */
export const ID_MAX_BYTES = 40;

/**
 * The schemas UmbraDB itself creates (`core_chain`: the database API's bootstrap, DB-9; `core_digest` and
 * `core_digest_shadow`: the digests, DT-4, DT-5) and PostgreSQL's own; with every name starting with `pg_`, no module
 * or item may take one (DB-8). The backbone parts whose ids map to them (`core-chain`, `core-digest`) are not module
 * schemas of a plan.
 */
export const RESERVED_SCHEMAS: readonly string[] = [
  "core_chain",
  "core_digest",
  "core_digest_shadow",
  "information_schema",
  "public",
];

/**
 * UmbraDB's own backbone parts whose schemas are reserved ({@link RESERVED_SCHEMAS}: `core_chain`, `core_digest`): not in
 * a schema plan, so their migrations (`./migrate.ts`) and their callbacks' write handles (`./write-handles.ts`) run as
 * the writer's login, which owns those schemas.
 */
export const OWN_PARTS: readonly string[] = ["core-chain", "core-digest"];

/** A module's or item's schema name: its id with `-` replaced by `_` (DB-8). */
export function schemaName(id: string): string {
  return id.replace(/-/g, "_");
}

/** The role of the module whose schema is `schema`. */
export function moduleRoleName(schema: string): string {
  return `umbradb_m_${schema}`;
}

/** The role of the shared item whose schema is `schema`. */
export function itemRoleName(schema: string): string {
  return `umbradb_i_${schema}`;
}

/** A migration's checksum: SHA-256 of its UTF-8 SQL, in hex (DB-9). */
export function migrationChecksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

/** A `table` item's tables (CORE-ARCH §4.10). */
export interface SchemaTable {
  readonly schema: string;
  readonly tables: readonly string[];
  /** `false` opts the tables out of the determinism rules (MD-1, Q76); they keep no `TRUNCATE` trigger (DB-14). */
  readonly deterministic?: false;
}

/** An item a module provides. */
export interface SchemaItem {
  readonly name: string;
  readonly table?: SchemaTable;
}

/** A migration, as a module declares it. */
export interface SchemaMigration {
  readonly id: string;
  readonly sql: string;
}

/**
 * What the roles and schemas need of a module's declaration (MD-1): `schemaModule` (`src/modules/adapters.ts`, task 3.1)
 * takes it from a validated `ModuleDeclaration`; task 3.2 decides which declarations a plan holds.
 */
export interface SchemaModule {
  readonly id: string;
  readonly requires: readonly string[];
  readonly provides: readonly SchemaItem[];
  readonly migrations: readonly SchemaMigration[];
}

/** A schema of the plan and the role that owns it. */
export interface PlannedSchema {
  readonly name: string;
  readonly role: string;
  readonly of: { readonly module: string } | { readonly item: string };
}

/** A table by schema and name. */
export interface QualifiedTable {
  readonly schema: string;
  readonly table: string;
}

/** The schemas and roles of one database's modules, checked (DB-8). */
export interface SchemaPlan {
  /** Every module's schema, in the modules' order, then every shared item's. */
  readonly schemas: readonly PlannedSchema[];
  /** The tables declared `deterministic: false`. */
  readonly optedOut: readonly QualifiedTable[];
  /** The role a module's callbacks, `on-start-db` and migrations run under: its own, or its shared item's (Q89). */
  writeRole(moduleId: string): string;
  /** The schema that role owns. */
  writeSchema(moduleId: string): string;
  /** The roles that may execute the routines of `schema`: the modules' requiring an item its writers provide. */
  functionUsers(schema: string): readonly string[];
}

const LIMIT_TEXT =
  `match ${ID_PATTERN.source} (lowercase letters and digits in words joined by single hyphens, starting with a ` +
  `letter) and be at most ${ID_MAX_BYTES} bytes long`;

function checkId(id: string, of: "module" | "item", module: string | undefined): void {
  const bytes = Buffer.byteLength(id, "utf8");
  if (ID_PATTERN.test(id) && bytes <= ID_MAX_BYTES) return;
  const name = JSON.stringify(id);
  const what = of === "module" ? `the module id ${name}` : `the item name ${name} (of module ${module})`;
  throw new UmbraError(
    "bad-id",
    `${what} is refused: module ids and item names must ${LIMIT_TEXT}, so that the schema and role names made from ` +
      `them are one-to-one and within PostgreSQL's 63-byte names (DB-8); it is ${bytes} bytes long`,
    { id, of, ...(module === undefined ? {} : { module }), bytes, limit: ID_MAX_BYTES, pattern: ID_PATTERN.source },
  );
}

function collision(schema: string, first: string, second: string): UmbraError {
  return new UmbraError(
    "schema-collision",
    `${first} and ${second} both name the schema ${schema}: every module, shared item and reserved schema needs a ` +
      "schema of its own (DB-8); rename the module or the item",
    { schema, first, second },
  );
}

/**
 * Refuses with `bad-id` the first id or item name of `module` that DB-8's pattern and length do not allow: its id,
 * then each item it provides, then each item it requires (MD-2). {@link planSchemas} checks every module of a plan with
 * it, and declaration validation (`src/modules/validation.ts`) every declaration of a build, before anything else
 * reads their names.
 */
export function checkNames(module: Pick<SchemaModule, "id" | "provides" | "requires">): void {
  checkId(module.id, "module", undefined);
  for (const item of module.provides) checkId(item.name, "item", module.id);
  for (const name of module.requires) checkId(name, "item", module.id);
}

function isReserved(schema: string): boolean {
  return RESERVED_SCHEMAS.includes(schema) || schema.startsWith("pg_");
}

/** One provider's declaration of an item. */
interface Provision {
  readonly module: SchemaModule;
  readonly item: SchemaItem;
}

/** How two providers' declarations of one item differ: the words of the refusal, and its details. */
interface Difference {
  readonly what: string;
  readonly details: Record<string, unknown>;
}

/** The first difference between two providers' declarations of one item, or undefined. */
function provisionDifference(first: Provision, other: Provision): Difference | undefined {
  const schemas = [first.item.table?.schema ?? null, other.item.table?.schema ?? null];
  if (schemas[0] !== schemas[1]) return { what: "declare its tables in different schemas", details: { schemas } };
  const deterministic = [first, other].map((provision) => provision.item.table?.deterministic !== false);
  if (deterministic[0] !== deterministic[1]) {
    return { what: "declare it with different deterministic flags", details: { deterministic } };
  }
  const length = Math.max(first.module.migrations.length, other.module.migrations.length);
  for (let index = 0; index < length; index++) {
    const pair = [first.module.migrations[index], other.module.migrations[index]];
    const ids = pair.map((migration) => migration?.id ?? null);
    const checksums = pair.map((migration) => (migration === undefined ? null : migrationChecksum(migration.sql)));
    if (ids[0] !== ids[1] || checksums[0] !== checksums[1]) {
      const migration = ids[0] ?? ids[1];
      return { what: `declare different migrations (first at ${migration})`, details: { migration, ids, checksums } };
    }
  }
  return undefined;
}

/**
 * Checks the names of one database's modules (DB-8, MD-2) and plans their schemas and roles. Throws `bad-id`,
 * `schema-collision` or `shared-item-migrations-differ` (not retryable), naming what collides or differs.
 */
export function planSchemas(modules: readonly SchemaModule[]): SchemaPlan {
  for (const module of modules) checkNames(module);

  // Each module writes one schema: its own, or a shared item's (Q89).
  const writeSchemas = new Map<string, string>();
  for (const module of modules) {
    const own = schemaName(module.id);
    const declared: string[] = [];
    for (const item of module.provides) {
      if (item.table === undefined) continue;
      const allowed = [own, schemaName(item.name)];
      if (!allowed.includes(item.table.schema)) {
        throw new UmbraError(
          "schema-collision",
          `module ${module.id} declares the table item ${item.name} in the schema ${item.table.schema}, which is ` +
            `neither its own (${allowed[0]}) nor the item's (${allowed[1]}): a module writes only its own schema, or ` +
            "its shared item's (DB-6, DB-8)",
          { schema: item.table.schema, module: module.id, item: item.name, allowed },
        );
      }
      if (!declared.includes(item.table.schema)) declared.push(item.table.schema);
    }
    if (declared.length > 1) {
      throw new UmbraError(
        "schema-collision",
        `module ${module.id} declares table items in the schemas ${declared.join(" and ")}: a module writes one ` +
          "schema, under one role — its own, or its shared item's (DB-6, DB-8)",
        { module: module.id, schemas: declared },
      );
    }
    writeSchemas.set(module.id, declared[0] ?? own);
  }

  // One namespace: module schemas, item names, reserved schemas.
  const providers = new Map<string, Provision[]>();
  for (const module of modules) {
    for (const item of module.provides) {
      providers.set(item.name, [...(providers.get(item.name) ?? []), { module, item }]);
    }
  }
  const names: [string, string][] = [
    ...modules.map((module): [string, string] => [schemaName(module.id), `module ${module.id}`]),
    ...[...providers].map(([name, provisions]): [string, string] => [
      schemaName(name),
      `item ${name} (provided by ${provisions.map((provision) => provision.module.id).join(", ")})`,
    ]),
  ];
  const seen = new Map<string, string>();
  for (const [schema, label] of names) {
    if (isReserved(schema)) throw collision(schema, label, `reserved schema ${schema}`);
    const earlier = seen.get(schema);
    if (earlier !== undefined) throw collision(schema, earlier, label);
    seen.set(schema, label);
  }

  // The providers of one table item declare it alike (DB-8, Q76).
  for (const [name, provisions] of providers) {
    if (!provisions.some((provision) => provision.item.table !== undefined)) continue;
    const first = provisions[0] as Provision;
    for (const other of provisions.slice(1)) {
      const difference = provisionDifference(first, other);
      if (difference === undefined) continue;
      const pair = [first.module.id, other.module.id];
      throw new UmbraError(
        "shared-item-migrations-differ",
        `the providers ${pair.join(" and ")} of the shared item ${name} ${difference.what}: every provider of an ` +
          "item writes the same tables, so each must declare the same schema, the same deterministic flag and the " +
          "same migrations (DB-8)",
        { item: name, providers: pair, ...difference.details },
      );
    }
  }

  const schemas: PlannedSchema[] = modules.map((module) => {
    const name = schemaName(module.id);
    return { name, role: moduleRoleName(name), of: { module: module.id } };
  });
  for (const [name, provisions] of providers) {
    const schema = schemaName(name);
    if (provisions.some((provision) => provision.item.table?.schema === schema)) {
      schemas.push({ name: schema, role: itemRoleName(schema), of: { item: name } });
    }
  }
  const roleOf = new Map(schemas.map((schema) => [schema.name, schema.role]));

  const optedOut: QualifiedTable[] = [];
  const optedOutKeys = new Set<string>();
  for (const module of modules) {
    for (const item of module.provides) {
      if (item.table?.deterministic !== false) continue;
      for (const table of item.table.tables) {
        const key = JSON.stringify([item.table.schema, table]);
        if (optedOutKeys.has(key)) continue;
        optedOutKeys.add(key);
        optedOut.push({ schema: item.table.schema, table });
      }
    }
  }

  const writeSchema = (moduleId: string): string => {
    const schema = writeSchemas.get(moduleId);
    if (schema === undefined) throw new Error(`module ${moduleId} is not in the schema plan`);
    return schema;
  };
  const writeRole = (moduleId: string): string => roleOf.get(writeSchema(moduleId)) as string;

  const functionUsers = (schema: string): readonly string[] => {
    const users: string[] = [];
    for (const module of modules) {
      const role = writeRole(module.id);
      const uses = module.requires.some((name) =>
        (providers.get(name) ?? []).some((provision) => writeSchema(provision.module.id) === schema),
      );
      if (uses && role !== roleOf.get(schema) && !users.includes(role)) users.push(role);
    }
    return users;
  };

  return { schemas, optedOut, writeRole, writeSchema, functionUsers };
}

/** Runs `SET LOCAL ROLE` to the module's write role, for the rest of the transaction (DB-6). */
export async function setModuleRole(tx: Transaction, plan: SchemaPlan, moduleId: string): Promise<void> {
  await tx.execute(`SET LOCAL ROLE ${quoteIdentifier(plan.writeRole(moduleId))}`);
}

const LOGIN_FACTS = `SELECT current_user AS login, current_database() AS database, rolsuper AS superuser,
       rolcreaterole AS createrole, has_database_privilege(current_database(), 'CREATE') AS create_schemas
  FROM pg_roles WHERE rolname = current_user`;

const ROLE_FACTS = `SELECT rolname AS role, pg_has_role(current_user, oid, 'SET') AS can_set,
       pg_has_role(current_user, oid, 'USAGE') AS inherits,
       pg_has_role(current_user, oid, 'MEMBER WITH ADMIN OPTION') AS admin
  FROM pg_roles WHERE rolname = ANY($1::text[])`;

const SCHEMA_OWNERS = `SELECT nspname AS schema, pg_get_userbyid(nspowner) AS owner
  FROM pg_namespace WHERE nspname = ANY($1::text[])`;

/**
 * Creates and grants what the plan needs and the database lacks (see the module comment), in the transaction `tx`
 * (the writer's, before any migration). Idempotent: startup runs it every time. Refuses, before creating anything, a
 * schema of the plan that exists and belongs to another role (`schema-collision`) and a login that lacks a privilege
 * or a role it needs (`invalid-configuration`, `reason: writer-privileges`).
 */
export async function prepareSchemas(tx: Transaction, plan: SchemaPlan): Promise<void> {
  const [facts] = await tx.query(LOGIN_FACTS);
  const login = facts?.login as string;
  const superuser = facts?.superuser === true;
  const roleRows = await tx.query(ROLE_FACTS, [plan.schemas.map((schema) => schema.role)]);
  const roles = new Map(roleRows.map((row) => [row.role as string, row]));
  const owners = new Map(
    (await tx.query(SCHEMA_OWNERS, [[...plan.schemas.map((schema) => schema.name), "core_chain"]])).map((row) => [
      row.schema as string,
      row.owner as string,
    ]),
  );

  for (const schema of plan.schemas) {
    const owner = owners.get(schema.name);
    if (owner !== undefined && owner !== schema.role) {
      throw new UmbraError(
        "schema-collision",
        `the schema ${schema.name} exists already and belongs to the role ${owner}, not to ${schema.role}: another ` +
          "program's schema, or one UmbraDB did not create; drop or rename it, or rename the module (DB-8)",
        { schema: schema.name, owner, role: schema.role },
      );
    }
  }

  const missingRoles = plan.schemas.filter((schema) => !roles.has(schema.role)).map((schema) => schema.role);
  const missingSchemas = [
    ...(owners.has("core_chain") ? [] : ["core_chain"]),
    ...plan.schemas.filter((schema) => !owners.has(schema.name)).map((schema) => schema.name),
  ];
  const lacking: string[] = [];
  if (!superuser) {
    if (missingRoles.length > 0 && facts?.createrole !== true) {
      lacking.push(`CREATEROLE, to create the roles ${missingRoles.join(", ")} (ALTER ROLE ${login} CREATEROLE)`);
    }
    for (const row of roleRows) {
      if ((row.can_set === true && row.inherits === true) || row.admin === true) continue;
      lacking.push(
        `the use of the role ${row.role as string}, which another login created ` +
          `(GRANT ${row.role as string} TO ${login} WITH INHERIT TRUE, SET TRUE)`,
      );
    }
    if (missingSchemas.length > 0 && facts?.create_schemas !== true) {
      lacking.push(
        `CREATE on the database, to create the schemas ${missingSchemas.join(", ")} ` +
          `(GRANT CREATE ON DATABASE ${facts?.database as string} TO ${login})`,
      );
    }
  }
  if (lacking.length > 0) {
    throw new UmbraError(
      "invalid-configuration",
      `the database login ${login} cannot set up the module roles and schemas; it lacks ${lacking.join("; ")}. The ` +
        "login must be a superuser, or hold CREATEROLE and CREATE on the database, and be able to use every module " +
        "role (design.md §4)",
      { reason: "writer-privileges", login, missing: lacking },
    );
  }

  if (!owners.has("core_chain")) await tx.execute("CREATE SCHEMA core_chain");
  for (const role of missingRoles) await tx.execute(`CREATE ROLE ${quoteIdentifier(role)} NOLOGIN`);
  if (!superuser) {
    for (const schema of plan.schemas) {
      const row = roles.get(schema.role);
      if (row?.can_set === true && row.inherits === true) continue;
      await tx.execute(`GRANT ${quoteIdentifier(schema.role)} TO CURRENT_USER WITH INHERIT TRUE, SET TRUE`);
    }
  }
  for (const schema of plan.schemas) {
    if (!owners.has(schema.name)) {
      await tx.execute(`CREATE SCHEMA ${quoteIdentifier(schema.name)} AUTHORIZATION ${quoteIdentifier(schema.role)}`);
    }
  }
  for (const schema of plan.schemas) await grantAsOwner(tx, plan, schema);
}

/** The grants of one schema, made as its owner (see the module comment). */
async function grantAsOwner(tx: Transaction, plan: SchemaPlan, schema: PlannedSchema): Promise<void> {
  const name = quoteIdentifier(schema.name);
  const readers = plan.schemas
    .filter((other) => other.role !== schema.role)
    .map((other) => quoteIdentifier(other.role));
  const users = plan.functionUsers(schema.name).map(quoteIdentifier);
  await tx.execute(`SET LOCAL ROLE ${quoteIdentifier(schema.role)}`);
  await tx.execute("ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC");
  if (readers.length > 0) {
    const to = readers.join(", ");
    await tx.execute(`GRANT USAGE ON SCHEMA ${name} TO ${to}`);
    await tx.execute(`GRANT SELECT ON ALL TABLES IN SCHEMA ${name} TO ${to}`);
    await tx.execute(`ALTER DEFAULT PRIVILEGES IN SCHEMA ${name} GRANT SELECT ON TABLES TO ${to}`);
  }
  if (users.length > 0) {
    const to = users.join(", ");
    await tx.execute(`GRANT EXECUTE ON ALL ROUTINES IN SCHEMA ${name} TO ${to}`);
    await tx.execute(`ALTER DEFAULT PRIVILEGES IN SCHEMA ${name} GRANT EXECUTE ON FUNCTIONS TO ${to}`);
  }
  await tx.execute("RESET ROLE");
}
