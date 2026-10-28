import { z } from "zod";
import type { ReadOnlyDatabase } from "../../src/db/api.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { quoteIdentifier } from "../../src/deterministic-postgresql/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { hexOf, type Message, type ReadResult } from "../../src/private/messages.js";
import { endedWithin, hello, rawClient, type RawClient } from "./raw-client.js";

/**
 * A172 `[FAULT]` (task 14.2b; PP-4, the threat model draft's gap 1): a private process's `read` whose statements try to
 * leave the read changes nothing in the public database — its contents hash, its row counts and its sequences —, is
 * answered with an error naming the refused statement, and the transport stays up for the next `read`. Shared by
 * `read-confinement.test.ts` (through a running core, on PostgreSQL 18.6 and PGlite 0.5.10) and its committed negative
 * control (`read-confinement.negative-control.test.ts`: the read path before task 14.2b, every statement run as sent);
 * imports nothing of Vitest.
 *
 * **The public database** holds the core's module {@link PUB}: `pub.rows`, a row per height, and `pub.log`, declared
 * `deterministic: false`, whose `serial` key is the sequence `pub.log_id_seq` — the row counts and the sequence a write
 * that escaped would change. {@link publicState} reads what A172 compares, through the core's `db` item: the contents
 * hash (DT-3), every table's row count, every sequence's last value, and the advisory locks held besides the writer's.
 *
 * **The escapes** ({@link ESCAPES}): one `read` each, through a raw client of the core's transport, with the statement
 * the core must refuse and how it names it (`read-result.refused`). Each is followed, on the same connection, by a
 * plain read that must be answered with its rows. {@link DATABASE_REFUSED} are reads whose write the database itself
 * refuses — the read-only transaction the gate keeps the read in —, answered `database-error`.
 */

/** The heights the escapes try to write; no block reaches them. */
const ESCAPED_HEIGHT = 900_001;

/**
 * The public module `pub`: `pub.rows` gets each height's row, `pub.log` (`deterministic: false`) a row whose key its
 * sequence gives.
 */
export const PUB: ModuleDeclaration = {
  id: "pub",
  version: "1.0.0",
  side: "public",
  requires: ["block-header"],
  provides: [
    { name: "pub-rows", lifetimes: ["table"], table: { schema: "pub", tables: ["rows"], kind: "append-only" } },
    { name: "pub-log", lifetimes: ["table"], table: { schema: "pub", tables: ["log"], kind: "append-only", deterministic: false } },
  ],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [
    {
      id: "001",
      sql: "CREATE TABLE pub.rows (height bigint PRIMARY KEY); CREATE TABLE pub.log (id serial PRIMARY KEY, height bigint NOT NULL);",
    },
  ],
  points: {
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO pub.rows (height) VALUES ($1)", [b.height]);
      await w.execute("INSERT INTO pub.log (height) VALUES ($1)", [b.height]);
    },
  },
};

/** `pub`'s entry in the core's configuration. */
export const PUB_ENTRY = Object.freeze({ id: "pub", start: 1, version: "1.0.0", config: {} });

/** The tables `pub` declares `deterministic: false` (the contents hash names them only). */
export const PUB_OPTED_OUT = Object.freeze([Object.freeze({ schema: "pub", table: "log" })]);

/** What A172 compares before and after the escapes. */
export interface PublicState {
  /** The contents hash (DT-3), as `0x` hex. */
  readonly hash: string;
  /** Each table's row count, by `schema.table` (the test backend's own `public.session_log` left out). */
  readonly rows: Readonly<Record<string, string>>;
  /** Each sequence's last value (null before its first use), by `schema.sequence` (the schema `public`'s left out). */
  readonly sequences: Readonly<Record<string, string | null>>;
  /** The advisory locks held in the database besides the writer lock (`class:object:subid`). */
  readonly advisory: readonly string[];
}

const TABLES_SQL =
  "SELECT n.nspname AS schema, c.relname AS name FROM pg_catalog.pg_class c " +
  "JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r', 'p') " +
  "AND n.nspname NOT LIKE 'pg\\_%' AND n.nspname <> 'information_schema' " +
  "AND NOT (n.nspname = 'public' AND c.relname = 'session_log') ORDER BY 1, 2";

const SEQUENCES_SQL =
  "SELECT schemaname || '.' || sequencename AS name, last_value::text AS last FROM pg_catalog.pg_sequences " +
  "WHERE schemaname <> 'public' ORDER BY 1";

const ADVISORY_SQL =
  "SELECT classid::text || ':' || objid::text || ':' || objsubid::text AS lock FROM pg_catalog.pg_locks " +
  "WHERE locktype = 'advisory' AND database = (SELECT oid FROM pg_catalog.pg_database WHERE datname = current_database()) " +
  "AND NOT (classid = 3 AND objsubid = 2 AND objid = (hashtext('umbradb-writer'))::oid) ORDER BY 1";

/** The public database's state A172 compares, in one read through the core's `db` item. */
export async function publicState(db: ReadOnlyDatabase): Promise<PublicState> {
  return db.read(async (read) => {
    const hash = hexOf(await contentsHash(read, { optedOut: PUB_OPTED_OUT }));
    const rows: Record<string, string> = {};
    for (const table of await read.query(TABLES_SQL)) {
      const name = `${quoteIdentifier(String(table.schema))}.${quoteIdentifier(String(table.name))}`;
      const [count] = await read.query(`SELECT count(*)::bigint AS n FROM ${name}`);
      rows[`${String(table.schema)}.${String(table.name)}`] = String(count?.n);
    }
    const sequences: Record<string, string | null> = {};
    for (const row of await read.query(SEQUENCES_SQL)) sequences[String(row.name)] = row.last === null ? null : String(row.last);
    const advisory = (await read.query(ADVISORY_SQL)).map((row) => String(row.lock));
    return { hash, rows, sequences, advisory };
  });
}

/** How the core names a refused statement (`read-result.refused`). */
export interface Refused {
  readonly statement: number;
  readonly reason: "command" | "function" | "statements" | "unreadable";
  readonly name: string | null;
}

/** One escape: a `read`'s statements and how the core must refuse them. */
export interface Escape {
  readonly name: string;
  readonly statements: readonly string[];
  readonly refused: Refused;
}

const insert = (offset: number): string => `INSERT INTO pub.rows (height) VALUES (${ESCAPED_HEIGHT + offset})`;
const command = (statement: number, name: string): Refused => ({ statement, reason: "command", name });
const fn = (statement: number, name: string): Refused => ({ statement, reason: "function", name });

/** A172's escapes, in its order (see the module comment). */
export const ESCAPES: readonly Escape[] = [
  { name: "COMMIT, then an INSERT", statements: ["COMMIT", insert(0)], refused: command(0, "COMMIT") },
  {
    name: "a read, then COMMIT and an INSERT",
    statements: ["SELECT count(*) AS n FROM pub.rows", "COMMIT", insert(1)],
    refused: command(1, "COMMIT"),
  },
  { name: "ROLLBACK, then an INSERT", statements: ["ROLLBACK", insert(2)], refused: command(0, "ROLLBACK") },
  { name: "END, then an INSERT", statements: ["END", insert(3)], refused: command(0, "END") },
  { name: "BEGIN, then an INSERT", statements: ["BEGIN", insert(4)], refused: command(0, "BEGIN") },
  {
    name: "SET TRANSACTION READ WRITE, then an INSERT",
    statements: ["SET TRANSACTION READ WRITE", insert(5)],
    refused: command(0, "SET"),
  },
  { name: "SET of a setting", statements: ["SET search_path TO pub, public"], refused: command(0, "SET") },
  { name: "SET LOCAL of a timeout", statements: ["SET LOCAL statement_timeout = 0"], refused: command(0, "SET") },
  { name: "RESET ALL", statements: ["RESET ALL"], refused: command(0, "RESET") },
  { name: "SET ROLE", statements: ["SET ROLE NONE"], refused: command(0, "SET") },
  { name: "RESET ROLE", statements: ["RESET ROLE"], refused: command(0, "RESET") },
  { name: "SET SESSION AUTHORIZATION", statements: ["SET SESSION AUTHORIZATION DEFAULT"], refused: command(0, "SET") },
  {
    name: "set_config of the role",
    statements: ["SELECT set_config('role', 'none', false) AS role"],
    refused: fn(0, "set_config"),
  },
  {
    name: "set_config of default_transaction_read_only, COMMIT, then an INSERT",
    statements: ["SELECT set_config('default_transaction_read_only', 'off', false)", "COMMIT", insert(6)],
    refused: fn(0, "set_config"),
  },
  {
    name: "DO with an INSERT",
    statements: [`DO $$ BEGIN INSERT INTO pub.rows (height) VALUES (${ESCAPED_HEIGHT + 7}); END $$`],
    refused: command(0, "DO"),
  },
  { name: "nextval", statements: ["SELECT nextval('pub.log_id_seq') AS n"], refused: fn(0, "nextval") },
  {
    name: "COMMIT, then nextval",
    statements: ["COMMIT", "SELECT nextval('pub.log_id_seq') AS n"],
    refused: command(0, "COMMIT"),
  },
  { name: "pg_advisory_lock", statements: ["SELECT pg_advisory_lock(42) AS locked"], refused: fn(0, "pg_advisory_lock") },
  {
    name: "pg_advisory_lock under a quoted name",
    statements: ['SELECT "pg_advisory_lock"(43) AS locked'],
    refused: fn(0, "pg_advisory_lock"),
  },
  { name: "COPY into a table", statements: ["COPY pub.rows FROM STDIN"], refused: command(0, "COPY") },
  { name: "LISTEN", statements: ["LISTEN umbradb_escape"], refused: command(0, "LISTEN") },
  {
    name: "a comment before COMMIT, then an INSERT",
    statements: ["/* SELECT */ -- SELECT\n COMMIT", insert(8)],
    refused: command(0, "COMMIT"),
  },
  {
    name: "two statements in one",
    statements: ["SELECT 1 AS one; COMMIT"],
    refused: { statement: 0, reason: "statements", name: null },
  },
];

/** Reads whose write the database refuses (the read-only transaction): answered `database-error`, nothing changed. */
export const DATABASE_REFUSED: readonly { readonly name: string; readonly sql: string }[] = [
  { name: "a WITH that deletes", sql: "WITH d AS (DELETE FROM pub.rows RETURNING height) SELECT count(*) AS n FROM d" },
  { name: "SELECT … FOR UPDATE", sql: "SELECT height FROM pub.rows FOR UPDATE" },
  { name: "SELECT … INTO a new table", sql: "SELECT height INTO pub.copied FROM pub.rows" },
];

/** The plain read after each escape: it must be answered with its rows. */
const PLAIN = "SELECT count(*)::bigint AS n FROM pub.rows";

/** An answer, for a problem's text. */
function described(answer: ReadResult | null): string {
  if (answer === null) return "nothing";
  if (answer.error !== undefined) return `error ${answer.error}${answer.refused === undefined ? "" : ` ${JSON.stringify(answer.refused)}`}`;
  return "results";
}

/** The next `read-result` of `id` on `client`, or null within `ms`. */
async function answerOf(client: RawClient, id: string, ms = 30_000): Promise<ReadResult | null> {
  const deadline = Date.now() + ms;
  for (;;) {
    const answer = await client.next("read-result", Math.max(1, deadline - Date.now())).catch(() => null);
    if (answer === null || answer.id === id) return answer;
  }
}

/** Differences between two states, one problem each. */
export function stateProblems(before: PublicState, after: PublicState): string[] {
  const problems: string[] = [];
  if (before.hash !== after.hash) problems.push("the public database's contents hash changed");
  const changed = (a: Readonly<Record<string, unknown>>, b: Readonly<Record<string, unknown>>): string[] =>
    [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .sort()
      .filter((key) => a[key] !== b[key])
      .map((key) => `${key} ${String(a[key])} → ${String(b[key])}`);
  const rows = changed(before.rows, after.rows);
  if (rows.length > 0) problems.push(`row counts changed: ${rows.join(", ")}`);
  const sequences = changed(before.sequences, after.sequences);
  if (sequences.length > 0) problems.push(`sequences changed: ${sequences.join(", ")}`);
  const locks = after.advisory.filter((lock) => !before.advisory.includes(lock));
  if (locks.length > 0) problems.push(`advisory locks left held: ${locks.join(", ")}`);
  return problems;
}

/**
 * A172's oracle against the core's transport at `address` over the public database `db`: every problem, none when
 * each escape is answered `read-refused` naming its statement, each read the database refuses is answered
 * `database-error`, a plain read on the same connection is answered after each, the connection stays open, and the
 * public database's state is unchanged.
 */
export async function confinementProblems(address: string, db: ReadOnlyDatabase): Promise<string[]> {
  const problems: string[] = [];
  const before = await publicState(db);
  const client = rawClient(`ws://${address}/`);
  await client.opened;
  client.send(hello("a172-escapes"));
  const ack = await client.next("hello-ack");
  if (ack.refused !== null) problems.push(`the hello was refused: ${ack.refused}`);
  let id = 0;
  const read = async (statements: readonly string[]): Promise<ReadResult | null> => {
    id += 1;
    const message: Message = { v: 1, type: "read", id: `${id}`, statements: statements.map((sql) => ({ sql, params: [] })) };
    client.send(message);
    return answerOf(client, `${id}`);
  };
  const stillUp = async (after: string): Promise<void> => {
    const plain = await read([PLAIN]);
    if (plain?.results?.[0]?.rows.length !== 1) problems.push(`after ${after}: the plain read was answered ${described(plain)}`);
  };
  for (const escape of ESCAPES) {
    const answer = await read(escape.statements);
    const refused = answer?.error === "read-refused" && JSON.stringify(answer.refused) === JSON.stringify(escape.refused);
    if (!refused || answer?.results !== undefined) {
      problems.push(`${escape.name}: answered ${described(answer)}, not read-refused ${JSON.stringify(escape.refused)}`);
    }
    await stillUp(escape.name);
  }
  for (const refusal of DATABASE_REFUSED) {
    const answer = await read([refusal.sql]);
    if (answer?.error !== "database-error") problems.push(`${refusal.name}: answered ${described(answer)}, not database-error`);
    await stillUp(refusal.name);
  }
  const ended = await endedWithin(client, 1).catch(() => null);
  if (ended !== null) problems.push(`the connection closed (${ended.code} ${ended.reason})`);
  client.close();
  problems.push(...stateProblems(before, await publicState(db)));
  return problems;
}
