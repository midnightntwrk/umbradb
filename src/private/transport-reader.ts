/**
 * The login of the process transport's reads on PostgreSQL (`openspec/changes/core-arch/specs/configuration/spec.md`
 * CF-4, `specs/private-processes/spec.md` PP-4; `design.md` §8 **Confined reads**; owner decision Q175 A; task 4.5): a
 * public process whose database is PostgreSQL and which has `listen.transport` runs the transport's reads — a private
 * process's `read`s and the checks of its `report`s — on a read pool of their own, logged in as `core.transportReader`
 * (`{ user, password }`; the host, port, name and `ssl` are `database`'s). Startup checks first, on that pool, that the
 * login cannot write, and refuses with `transport-reader-can-write`, naming the login and what it found, when it:
 *
 * - is a superuser (nothing else is listed then: a superuser passes every check);
 * - holds `CREATEROLE`, `CREATEDB` or `BYPASSRLS`;
 * - is a member of `database`'s login, the writer (`pg_has_role(…, 'MEMBER')`: directly or through other roles, and
 *   the writer's login itself);
 * - holds any privilege other than `SELECT` on a table, view or sequence of a public schema — `INSERT`, `UPDATE`,
 *   `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `MAINTAIN` (`has_table_privilege`), `USAGE` or `UPDATE` on a sequence
 *   (`nextval`, `setval`; `has_sequence_privilege`) —, `CREATE` on a public schema, or `CREATE` on the database (a
 *   schema of its own). The `has_*_privilege` functions count what the login holds directly, through `PUBLIC`, through
 *   roles it is a member of and through `pg_write_all_data`.
 *
 * A public schema is any schema of the database but `pg_catalog`, `information_schema` and those starting with `pg_`
 * (`pg_toast`, the temporary schemas). The check runs once the migrations of startup made the tables, before the
 * transport listens; a table made later by a migration is checked at the next start. What the login may still do — read,
 * call functions, take advisory locks, use temporary tables — task 14.2b's gate (`./read-gate.ts`) keeps confined on
 * both backends; it stays in front of this login.
 */

import type { ReadHandle } from "../db/api.js";
import { UmbraError } from "../db/errors.js";

/** What the check reads about the transport reader's login. */
export interface TransportReaderFacts {
  /** The login (`current_user` of the pool's session). */
  readonly user: string;
  /** `database`'s login: the writer. */
  readonly writer: string;
  readonly superuser: boolean;
  readonly createRole: boolean;
  readonly createDb: boolean;
  readonly bypassRls: boolean;
  /** Whether the login is a member of the writer's login (or is it). */
  readonly memberOfWriter: boolean;
  /** Each privilege beyond reading it holds, in order: its kind, the object (`schema.table`) and the privilege. */
  readonly privileges: readonly { readonly kind: string; readonly object: string; readonly privilege: string }[];
}

/** The login's attributes and its membership in the writer's login. */
const ROLE_SQL = `SELECT current_user::text AS login, r.rolsuper AS superuser, r.rolcreaterole AS create_role,
  r.rolcreatedb AS create_db, r.rolbypassrls AS bypass_rls,
  coalesce(pg_has_role(current_user, (SELECT oid FROM pg_roles WHERE rolname = $1), 'MEMBER'), false) AS member_of_writer
FROM pg_roles r WHERE r.rolname = current_user`;

/** The schemas the check covers (see the module comment). */
const PUBLIC_SCHEMA = "n.nspname NOT IN ('pg_catalog', 'information_schema') AND n.nspname NOT LIKE 'pg\\_%'";

/** Every privilege beyond reading the login holds on the database, a public schema or a relation in one. */
const PRIVILEGES_SQL = `SELECT kind, object, privilege FROM (
  SELECT 'database' AS kind, current_database()::text AS object, 'CREATE' AS privilege
  WHERE has_database_privilege(current_user, current_database(), 'CREATE')
  UNION ALL
  SELECT 'schema', n.nspname::text, 'CREATE' FROM pg_namespace n
  WHERE ${PUBLIC_SCHEMA} AND has_schema_privilege(current_user, n.oid, 'CREATE')
  UNION ALL
  SELECT 'table', n.nspname || '.' || c.relname, p.privilege
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  CROSS JOIN unnest(ARRAY['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN']) AS p(privilege)
  WHERE ${PUBLIC_SCHEMA} AND c.relkind IN ('r', 'p', 'v', 'm', 'f') AND has_table_privilege(current_user, c.oid, p.privilege)
  UNION ALL
  SELECT 'sequence', n.nspname || '.' || c.relname, p.privilege
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace CROSS JOIN unnest(ARRAY['USAGE', 'UPDATE']) AS p(privilege)
  WHERE ${PUBLIC_SCHEMA} AND c.relkind = 'S' AND has_sequence_privilege(current_user, c.oid, p.privilege)
) AS found ORDER BY kind, object, privilege`;

/** Reads the facts of the login `read` runs as, `writer` being `database`'s login. */
export async function transportReaderFacts(read: Pick<ReadHandle, "query">, writer: string): Promise<TransportReaderFacts> {
  const [role] = await read.query(ROLE_SQL, [writer]);
  const rows = await read.query(PRIVILEGES_SQL);
  return {
    user: String(role?.login),
    writer,
    superuser: role?.superuser === true,
    createRole: role?.create_role === true,
    createDb: role?.create_db === true,
    bypassRls: role?.bypass_rls === true,
    memberOfWriter: role?.member_of_writer === true,
    privileges: rows.map((row) => ({ kind: String(row.kind), object: String(row.object), privilege: String(row.privilege) })),
  };
}

/** What makes the login of `facts` able to write, each as the refusal names it; empty when it may only read. */
export function canWriteFindings(facts: TransportReaderFacts): string[] {
  if (facts.superuser) return ["is a superuser"];
  const found: string[] = [];
  if (facts.createRole) found.push("holds CREATEROLE");
  if (facts.createDb) found.push("holds CREATEDB");
  if (facts.bypassRls) found.push("holds BYPASSRLS");
  if (facts.memberOfWriter) found.push(`is a member of the database login "${facts.writer}"`);
  for (const { kind, object, privilege } of facts.privileges) found.push(`holds ${privilege} on ${kind} ${object}`);
  return found;
}

/** How many of the findings the refusal's message lists (all are in its details). */
const LISTED = 10;

/**
 * Refuses with `transport-reader-can-write` when `judge` (`canWriteFindings` unless given: the negative control's) finds
 * that the login of `facts` could write (see the module comment).
 */
export function refuseWritingReader(
  facts: TransportReaderFacts,
  judge: (facts: TransportReaderFacts) => readonly string[] = canWriteFindings,
): void {
  const found = judge(facts);
  if (found.length === 0) return;
  const more = found.length > LISTED ? `, and ${found.length - LISTED} more` : "";
  throw new UmbraError(
    "transport-reader-can-write",
    `the transportReader login "${facts.user}" ${found.slice(0, LISTED).join(", ")}${more}: the transport's reads ` +
      "need a login that may only read — SELECT on the public tables and USAGE on their schemas, such as a member of " +
      "pg_read_all_data and nothing more (CF-4, owner decision Q175)",
    { user: facts.user, found },
  );
}
