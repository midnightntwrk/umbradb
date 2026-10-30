/**
 * Module roles and schemas. [DB-6, DB-7, DB-8, MD-2, Q46, Q89, Q90; design §4]
 *
 * **Names.** Module ids and item names match {@link ID_PATTERN} within {@link ID_MAX_BYTES} bytes. So a module's
 * schema (its id with `-` → `_`) is one-to-one, and its role `umbradb_m_<schema>` (an item's `umbradb_i_<schema>`)
 * stays within PostgreSQL's 63-byte names. Module schemas and item names, the items of UmbraDB's own parts
 * ({@link OwnPart}) included, share one namespace. It excludes the schemas UmbraDB itself creates
 * ({@link RESERVED_SCHEMAS}) and every name starting with `pg_`. [DB-8]
 *
 * A `table` item declares its schema: its module's own, or the item's name (`-` → `_`). The second makes the item a
 * *shared* item with one schema, owned by its own role, whoever provides it. A provider of a shared `table` item writes
 * under the item's role (its callbacks, `on-start-db` and migrations), so the item's tables belong to that role and
 * every provider of the item can write them; the provider's own role and schema still exist, empty.
 * [Q89; CORE-ARCH §4.10]
 *
 * The providers of one item must declare it alike: the same schema, the same `deterministic` flag and the same
 * migrations (ids and SHA-256 checksums). {@link planSchemas} checks all of this before anything reaches a database,
 * and throws the refusal (`bad-id`, `schema-collision`, `shared-item-migrations-differ`); stopping startup is the
 * runner's job. [DB-8, Q76; design §11]
 *
 * **Roles and grants.** At every startup and before any migration, {@link prepareSchemas} creates what is missing:
 * the schema `core_chain` (the first step of the bootstrap, which `./migrate.ts` completes), each role (`NOLOGIN`), and
 * each schema, owned by its role. Then, as each schema's owner (`SET LOCAL ROLE`), it:
 * - grants every other role of the plan `USAGE` on the schema and `SELECT` on its tables, now and by default privilege;
 * - revokes from `PUBLIC` `EXECUTE` on the routines its owner creates (the owner's default privilege, set before any
 *   migration creates one);
 * - grants `EXECUTE`, now and by default privilege, to the write roles of the modules that require an item whose
 *   provider writes the schema.
 *
 * Then it returns to the login's role. A callback, the schema write handle and a migration run after
 * {@link setModuleRole}, whose role writes its own schema and reads the others; the database rejects anything else
 * (`42501`). Modules are trusted: the roles stop mistakes, nothing more. [DB-6, DB-7, DB-9, Q46]
 *
 * **The login.** The writer's login is a superuser, or holds `CREATEROLE` (to create a missing role) and `CREATE` on
 * the database (to create a missing schema). PostgreSQL 16 and later give the creator of a role only `ADMIN` on it, no
 * `SET` and no `INHERIT`. So a login that is not a superuser grants itself each role `WITH INHERIT TRUE, SET TRUE`:
 * - `SET` for `SET LOCAL ROLE` and `CREATE SCHEMA … AUTHORIZATION`;
 * - `INHERIT` so that its read pool reads every module table and it can attach the `TRUNCATE` triggers
 *   (`./truncate-guard.ts`).
 *
 * `SET LOCAL ROLE` still gives a callback exactly its role's privileges. [Q90]
 *
 * Roles belong to the PostgreSQL server, not to one database, so every UmbraDB database on a server shares them. A
 * login that can neither use nor grant itself a role (another login created it) is rejected, as is a login lacking a
 * privilege it needs. The error is `invalid-configuration`, `reason: writer-privileges`, raised before anything is
 * created, naming each lack and what an administrator can run. PGlite runs as its superuser, `postgres`. [Q90]
 */

import { createHash } from "node:crypto";
import { quoteIdentifier } from "../deterministic-postgresql/index.js";
import type { Transaction } from "./api.js";
import { UmbraError } from "./errors.js";

/** Module ids and item names: lowercase words of letters and digits, joined by single hyphens. [DB-8, MD-1] */
export const ID_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/** The longest id or item name, in bytes: `umbradb_m_` and `umbradb_i_` add 10, within PostgreSQL's 63. [DB-8] */
export const ID_MAX_BYTES = 40;

/**
 * The schemas UmbraDB itself creates, and PostgreSQL's own. No module or item may take one of them, nor any name
 * starting with `pg_`. The backbone parts whose ids map to them (`core-chain`, `core-digest`) are not module schemas of
 * a plan. [DB-8]
 * - `core_chain`: the database API's bootstrap [DB-9];
 * - `core_digest` and `core_digest_shadow`: the digests [DT-4, DT-5].
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

/** A module's or item's schema name: its id with `-` replaced by `_`. [DB-8] */
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

/** A migration's checksum: SHA-256 of its UTF-8 SQL, in hex. [DB-9] */
export function migrationChecksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

/** A `table` item's tables. [CORE-ARCH §4.10] */
export interface SchemaTable {
  readonly schema: string;
  readonly tables: readonly string[];
  /** `false` opts the tables out of the determinism rules; they keep no `TRUNCATE` trigger. [MD-1, Q76, DB-14] */
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
 * What the roles and schemas need of a module's declaration. `schemaModule` (`src/modules/adapters.ts`) takes it from a
 * validated `ModuleDeclaration`. The requirement graph (`src/modules/graph.ts`) decides which declarations a plan
 * holds: every module of the database. [MD-1]
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

/** The schemas and roles of one database's modules, checked. [DB-8] */
export interface SchemaPlan {
  /** Every module's schema, in the modules' order, then every shared item's. */
  readonly schemas: readonly PlannedSchema[];
  /** The tables declared `deterministic: false`. */
  readonly optedOut: readonly QualifiedTable[];
  /** The role a module's callbacks, `on-start-db` and migrations run under: its own, or its shared item's. [Q89] */
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
      `them are one-to-one and within PostgreSQL's 63-byte names; it is ${bytes} bytes long`,
    { id, of, ...(module === undefined ? {} : { module }), bytes, limit: ID_MAX_BYTES, pattern: ID_PATTERN.source },
  );
}

function collision(schema: string, first: string, second: string): UmbraError {
  return new UmbraError(
    "schema-collision",
    `${first} and ${second} both name the schema ${schema}: every module, shared item and reserved schema needs a ` +
      "schema of its own; rename the module or the item",
    { schema, first, second },
  );
}

/**
 * Rejects with `bad-id` the first id or item name of `module` that the name pattern and length do not allow: its id,
 * then each item it provides, then each item it requires. {@link planSchemas} checks every module of a plan with it,
 * and declaration validation (`src/modules/validation.ts`) every declaration of a build, before anything else reads
 * their names. [DB-8, MD-2]
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
 * One of UmbraDB's own parts whose schemas are reserved ({@link OWN_PARTS}). It is no module of a plan, but the names
 * of the items it provides belong to the plan's one namespace like any other item's, so that no module takes one as its
 * id: a user module named `db` or `config` would otherwise share a name with `core-chain`'s items. [DB-8]
 */
export interface OwnPart {
  readonly id: string;
  readonly provides: readonly { readonly name: string }[];
}

/**
 * Checks the names of one database's modules and plans their schemas and roles. `ownParts` are UmbraDB's own parts of
 * the same database, whose items' names join the namespace and nothing else (`src/modules/adapters.ts`'s `schemaPlan`
 * gives them). Throws `bad-id`, `schema-collision` or `shared-item-migrations-differ` (not retryable), naming what
 * collides or differs. [DB-8, MD-2]
 */
export function planSchemas(modules: readonly SchemaModule[], ownParts: readonly OwnPart[] = []): SchemaPlan {
  for (const module of modules) checkNames(module);
  for (const part of ownParts) checkNames({ id: part.id, provides: part.provides, requires: [] });

  // Each module writes one schema: its own, or a shared item's. [Q89]
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
            "its shared item's",
          { schema: item.table.schema, module: module.id, item: item.name, allowed },
        );
      }
      if (!declared.includes(item.table.schema)) declared.push(item.table.schema);
    }
    if (declared.length > 1) {
      throw new UmbraError(
        "schema-collision",
        `module ${module.id} declares table items in the schemas ${declared.join(" and ")}: a module writes one ` +
          "schema, under one role — its own, or its shared item's",
        { module: module.id, schemas: declared },
      );
    }
    writeSchemas.set(module.id, declared[0] ?? own);
  }

  // One namespace: module schemas, item names (the own parts' too), reserved schemas.
  const providers = new Map<string, Provision[]>();
  const providerIds = new Map<string, string[]>();
  for (const module of modules) {
    for (const item of module.provides) {
      providers.set(item.name, [...(providers.get(item.name) ?? []), { module, item }]);
      providerIds.set(item.name, [...(providerIds.get(item.name) ?? []), module.id]);
    }
  }
  for (const part of ownParts) {
    for (const item of part.provides) providerIds.set(item.name, [...(providerIds.get(item.name) ?? []), part.id]);
  }
  const names: [string, string][] = [
    ...modules.map((module): [string, string] => [schemaName(module.id), `module ${module.id}`]),
    ...[...providerIds].map(([name, ids]): [string, string] => [
      schemaName(name),
      `item ${name} (provided by ${ids.join(", ")})`,
    ]),
  ];
  const seen = new Map<string, string>();
  for (const [schema, label] of names) {
    if (isReserved(schema)) throw collision(schema, label, `reserved schema ${schema}`);
    const earlier = seen.get(schema);
    if (earlier !== undefined) throw collision(schema, earlier, label);
    seen.set(schema, label);
  }

  // The providers of one table item declare it alike. [DB-8, Q76]
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
          "same migrations",
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

/** Runs `SET LOCAL ROLE` to the module's write role, for the rest of the transaction. [DB-6] */
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
 * (the writer's, before any migration). Idempotent: startup runs it every time. Before creating anything, it rejects a
 * schema of the plan that exists and belongs to another role (`schema-collision`), and a login that lacks a privilege
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
          "program's schema, or one UmbraDB did not create; drop or rename it, or rename the module",
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
        "role",
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

/** The relations of a schema whose owner a restore sets: tables, partitions, views, sequences no column owns. */
const RESTORED_RELATIONS = `SELECT c.relname AS name, c.relkind AS kind FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = $1 AND c.relkind IN ('r', 'p', 'v', 'm', 'S', 'f')
    AND NOT (c.relkind = 'S' AND EXISTS (SELECT 1 FROM pg_depend d WHERE d.classid = 'pg_class'::regclass
      AND d.objid = c.oid AND d.refclassid = 'pg_class'::regclass AND d.deptype IN ('a', 'i')))
    AND pg_get_userbyid(c.relowner) <> $2
  ORDER BY c.relname`;

/** The routines of a schema, by signature, and its types that no relation defines (an enum, a domain, a range). */
const RESTORED_ROUTINES = `SELECT p.oid::regprocedure::text AS routine FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = $1 AND pg_get_userbyid(p.proowner) <> $2
  ORDER BY 1`;
const RESTORED_TYPES = `SELECT t.oid::regtype::text AS type FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = $1 AND t.typtype IN ('e', 'd', 'r')
    AND pg_get_userbyid(t.typowner) <> $2 ORDER BY 1`;

/** The command that gives a relation of `kind` (`pg_class.relkind`) another owner. */
const ALTER_BY_KIND: Readonly<Record<string, string>> = {
  r: "TABLE",
  p: "TABLE",
  f: "FOREIGN TABLE",
  v: "VIEW",
  m: "MATERIALIZED VIEW",
  S: "SEQUENCE",
};

/**
 * Sets ownership after a restore ran a backup's SQL as the writer's login. The dump was written with `--no-owner`, so
 * the login owns everything it created. This: [BK-3]
 * 1. creates the roles of the plan the server lacks, as {@link prepareSchemas} would create them, and lets a login
 *    that is not a superuser use them;
 * 2. gives each schema of the plan to the schema's role, together with every table, partition, view, sequence no
 *    column owns (a column's follows its table), routine, enum, domain and range in it. This matches what the module's
 *    migrations, run under its role, made on a database built by migrations.
 *
 * UmbraDB's own schemas (`core_chain`, `core_digest`, `core_digest_shadow`) stay the login's, as on a migrated
 * database. Before changing anything, it rejects a login that cannot create a missing role or use one
 * (`invalid-configuration`, `reason: writer-privileges`), as {@link prepareSchemas} does.
 */
export async function restoreOwnership(tx: Transaction, plan: SchemaPlan): Promise<void> {
  const [facts] = await tx.query(LOGIN_FACTS);
  const login = facts?.login as string;
  const superuser = facts?.superuser === true;
  const roleRows = await tx.query(ROLE_FACTS, [plan.schemas.map((schema) => schema.role)]);
  const roles = new Map(roleRows.map((row) => [row.role as string, row]));
  const missingRoles = [...new Set(plan.schemas.filter((schema) => !roles.has(schema.role)).map((schema) => schema.role))];
  if (!superuser && missingRoles.length > 0 && facts?.createrole !== true) {
    throw new UmbraError(
      "invalid-configuration",
      `the database login ${login} cannot create the roles ${missingRoles.join(", ")} the restored database's ` +
        `schemas belong to: it lacks CREATEROLE (ALTER ROLE ${login} CREATEROLE), or an administrator creates them`,
      { reason: "writer-privileges", login, missing: missingRoles },
    );
  }
  for (const role of missingRoles) await tx.execute(`CREATE ROLE ${quoteIdentifier(role)} NOLOGIN`);
  if (!superuser) {
    for (const role of new Set(plan.schemas.map((schema) => schema.role))) {
      const row = roles.get(role);
      if (row?.can_set === true && row.inherits === true) continue;
      await tx.execute(`GRANT ${quoteIdentifier(role)} TO CURRENT_USER WITH INHERIT TRUE, SET TRUE`);
    }
  }
  const owners = new Map(
    (await tx.query(SCHEMA_OWNERS, [plan.schemas.map((schema) => schema.name)])).map((row) => [
      row.schema as string,
      row.owner as string,
    ]),
  );
  for (const schema of plan.schemas) {
    const owner = owners.get(schema.name);
    if (owner === undefined) continue;
    const name = quoteIdentifier(schema.name);
    const role = quoteIdentifier(schema.role);
    if (owner !== schema.role) await tx.execute(`ALTER SCHEMA ${name} OWNER TO ${role}`);
    for (const row of await tx.query(RESTORED_RELATIONS, [schema.name, schema.role])) {
      const what = ALTER_BY_KIND[row.kind as string] as string;
      await tx.execute(`ALTER ${what} ${name}.${quoteIdentifier(row.name as string)} OWNER TO ${role}`);
    }
    for (const row of await tx.query(RESTORED_ROUTINES, [schema.name, schema.role])) {
      await tx.execute(`ALTER ROUTINE ${row.routine as string} OWNER TO ${role}`);
    }
    for (const row of await tx.query(RESTORED_TYPES, [schema.name, schema.role])) {
      await tx.execute(`ALTER TYPE ${row.type as string} OWNER TO ${role}`);
    }
  }
}
