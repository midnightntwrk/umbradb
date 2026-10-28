import { describe, expect, it } from "vitest";
import {
  isRefusedName,
  NAME_MAX,
  READ_COMMANDS,
  READ_REFUSAL_REASONS,
  readRefusal,
  REFUSED_FUNCTIONS,
  REFUSED_PREFIXES,
  refusedStatement,
} from "../../src/private/read-gate.js";
import { MESSAGE_SCHEMAS, parseMessage, messageText, type ReadResult } from "../../src/private/messages.js";
import { ESCAPES } from "./read-confinement-checks.js";

/**
 * A172's gate, statement by statement (task 14.2b; PP-4, `design.md` §8 **Confined reads**,
 * `src/private/read-gate.ts`): every escape A172 sends is refused as the core names it; the reads a private process
 * makes — its own source's and a module's — pass; and the text is read as PostgreSQL 18's lexer reads it — comments,
 * nested comments, strings of each kind, dollar quotes, quoted names, parameters, numbers —, with
 * `standard_conforming_strings` on and off, a text the gate could read otherwise than the server refused
 * (`unreadable`). The `refused` field of `read-result` (A115's schema, as amended) is there exactly when the error is
 * `read-refused`.
 */

const command = (name: string | null) => ({ reason: "command", name });
const fn = (name: string) => ({ reason: "function", name });
const UNREADABLE = { reason: "unreadable", name: null };

describe("A172: the gate refuses each escape as the core names it", () => {
  it.each(ESCAPES.map((escape) => [escape.name, escape] as const))("%s", (_name, escape) => {
    const statements = escape.statements.map((sql) => ({ sql }));
    expect(refusedStatement(statements)).toEqual(escape.refused);
  });

  it.each([
    ["START TRANSACTION", command("START")],
    ["ABORT", command("ABORT")],
    ["SAVEPOINT s", command("SAVEPOINT")],
    ["RELEASE SAVEPOINT s", command("RELEASE")],
    ["PREPARE TRANSACTION 'x'", command("PREPARE")],
    ["COMMIT PREPARED 'x'", command("COMMIT")],
    ["PREPARE p AS SELECT 1", command("PREPARE")],
    ["EXECUTE p", command("EXECUTE")],
    ["DECLARE c CURSOR WITH HOLD FOR SELECT 1", command("DECLARE")],
    ["CALL some.procedure()", command("CALL")],
    ["DISCARD ALL", command("DISCARD")],
    ["UNLISTEN *", command("UNLISTEN")],
    ["NOTIFY channel", command("NOTIFY")],
    ["LOCK TABLE pub.rows", command("LOCK")],
    ["SHOW search_path", command("SHOW")],
    ["EXPLAIN ANALYZE SELECT 1", command("EXPLAIN")],
    ["INSERT INTO pub.rows VALUES (1)", command("INSERT")],
    ["update pub.rows SET height = 1", command("UPDATE")],
    ["Delete FROM pub.rows", command("DELETE")],
    ["MERGE INTO pub.rows USING x ON true WHEN MATCHED THEN DELETE", command("MERGE")],
    ["TRUNCATE pub.rows", command("TRUNCATE")],
    ["CREATE TEMP TABLE t (a int)", command("CREATE")],
    ["VACUUM", command("VACUUM")],
    ["ANALYZE pub.rows", command("ANALYZE")],
    ["(COMMIT)", command("COMMIT")],
    ["", command(null)],
    ["   -- nothing\n /* at all */ ", command(null)],
    [";", command(null)],
    ["'SELECT'", command(null)],
    ['"select" 1', command(null)],
    ["$1", command(null)],
    ["$$SELECT$$", command(null)],
    ["42", command(null)],
    ["* FROM pub.rows", command(null)],
    [`${"x".repeat(100)} 1`, command("X".repeat(NAME_MAX))],
    // A name is reported in printable ASCII: the core logs it.
    ["üpdate pub.rows SET height = 1", command("?PDATE")],
  ])("%j is not a read", (sql, refused) => {
    expect(readRefusal(sql)).toEqual(refused);
  });

  it.each([
    ["SELECT set_config('search_path', 'pub', true)", "set_config"],
    ["SELECT pg_catalog.set_config('role', 'none', false)", "pg_catalog"],
    ['SELECT "set_config"(\'role\', \'none\', false)', "set_config"],
    ["SELECT SET_CONFIG('role', 'none', false)", "set_config"],
    ["SELECT setseed(0.5)", "setseed"],
    ["SELECT setval('pub.log_id_seq', 1)", "setval"],
    ["SELECT pg_terminate_backend(1)", "pg_terminate_backend"],
    ["SELECT pg_cancel_backend(1)", "pg_cancel_backend"],
    ["SELECT pg_try_advisory_lock(3, 1)", "pg_try_advisory_lock"],
    ["SELECT pg_advisory_xact_lock(1)", "pg_advisory_xact_lock"],
    ["SELECT pg_read_file('/etc/passwd')", "pg_read_file"],
    ["SELECT pg_sleep(1000)", "pg_sleep"],
    ["SELECT pg_notify('c', 'p')", "pg_notify"],
    ["SELECT rolpassword FROM pg_authid", "pg_authid"],
    ["TABLE pg_catalog.pg_authid", "pg_catalog"],
    ["SELECT * FROM pg_stat_activity", "pg_stat_activity"],
    ["SELECT query_to_xml('SELECT set_config(1)', true, false, '')", "query_to_xml"],
    ["SELECT table_to_xml('pg_authid'::regclass, true, false, '')", "table_to_xml"],
    ["SELECT ts_stat('SELECT 1')", "ts_stat"],
    ["SELECT lo_export(1, '/tmp/x')", "lo_export"],
    ["SELECT lo_from_bytea(0, '\\x00')", "lo_from_bytea"],
    ["SELECT dblink_exec('dbname=x', 'DELETE FROM t')", "dblink_exec"],
    ["SELECT brin_summarize_new_values('i'::regclass)", "brin_summarize_new_values"],
    ["VALUES (pg_advisory_lock(1))", "pg_advisory_lock"],
    ["WITH x AS (SELECT pg_advisory_lock(1)) SELECT * FROM x", "pg_advisory_lock"],
    ["SELECT 1 FROM pub.rows WHERE height = (SELECT nextval('s'))", "nextval"],
    ["SELECT pg_advisory_lock  /* hidden? */ (1)", "pg_advisory_lock"],
    ['SELECT "PG_ADVISORY_LOCK"(1)', "pg_advisory_lock"],
    [`SELECT pg_${"x".repeat(100)}()`, `pg_${"x".repeat(NAME_MAX - 3)}`],
    ['SELECT "pg_x\nINFO: forged line"(1)', "pg_x?info:?forged?line"],
  ])("%j names a function or catalog the core refuses", (sql, name) => {
    expect(readRefusal(sql)).toEqual(fn(name));
  });

  it.each([
    ["SELECT 1; SELECT 2"],
    ["SELECT 1;COMMIT"],
    ["SELECT 1; -- then\n INSERT INTO pub.rows VALUES (1)"],
    ["SELECT 1;; SELECT 2"],
  ])("%j holds more than one statement", (sql) => {
    expect(readRefusal(sql)).toEqual({ reason: "statements", name: null });
  });

  it.each([
    ["SELECT 'unterminated"],
    ['SELECT "unterminated'],
    ["SELECT 1 /* unterminated"],
    ["SELECT 1 /* nested /* only once */"],
    ["SELECT $tag$ unterminated $other$"],
    ["SELECT E'unterminated\\'"],
    ["SELECT B'01"],
    ["SELECT U&'\\0070g_advisory_lock'"],
    ['SELECT U&"\\0070g_advisory_lock"(1)'],
    ["SELECT u&'x'"],
    ["SELECT 1\u0000; COMMIT"],
    // A backslash before the closing quote: with standard_conforming_strings off the string goes on, unterminated.
    ["SELECT 'a\\'"],
  ])("%j cannot be read as the server reads it", (sql) => {
    expect(readRefusal(sql)).toEqual(UNREADABLE);
  });
});

describe("A172: the gate reads the text as PostgreSQL does", () => {
  it.each([
    // The private process's own reads of public data (`public-database.ts` and the parts it reuses).
    ["SELECT to_regclass('core_chain.identity') IS NOT NULL AS present"],
    ["SELECT genesis_hash, start_height, anchor_hash FROM core_chain.identity WHERE id = 1"],
    ["SELECT entry_id, start, stop, provides FROM core_chain.config"],
    ["SELECT height, hash, parent_hash FROM core_block_commit.blocks ORDER BY height DESC LIMIT 1"],
    ["SELECT height, hash, parent_hash FROM core_block_commit.blocks WHERE height = $1"],
    // Reads a module makes, and every way of writing one.
    ["  select count(*) from pub.rows;"],
    ["SELECT 1;;  -- trailing\n ; "],
    ["(SELECT 1) UNION (SELECT 2)"],
    ["((VALUES (1), (2)))"],
    ["TABLE pub.rows"],
    ["WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM n WHERE x < 3) SELECT * FROM n"],
    ["/* a comment /* nested */ still */ SELECT 1"],
    ["-- a comment\nSELECT 1"],
    ["SELECT 'it''s' AS s, E'tab\\there' AS e, $$dollar ' quote$$ AS d, $q$ $$ nested $q$ AS q"],
    ["SELECT '\\x00ff10'::bytea AS y, X'ff' AS h, B'0101' AS b, N'national' AS n"],
    ['SELECT "height" FROM pub."weird ""name"""'],
    ["SELECT 1.5e10 AS r, .5 AS h, 1_000 AS u, $1::bigint AS p, $12 AS q"],
    ["SELECT a$b$ FROM t"],
    ["SELECT jsonb_path_query(j, '$.a') FROM t"],
    ["SELECT encode(hash, 'hex'), current_setting('TimeZone'), now(), count(*) FROM pub.rows GROUP BY 1, 2, 3"],
    ["SELECT 'pg_advisory_lock(1)' AS text, 'set_config' AS name"],
    ["SELECT 1 -- pg_advisory_lock(1)"],
    ["SELECT 1 /* COMMIT; pg_terminate_backend(1) */"],
    ["SELECT $fn$pg_advisory_lock(1)$fn$ AS body"],
    ["SELECT ü_column FROM t"],
    ["SELECT 1 FROM t WHERE x = $$a$$ AND y = $x$b$x$"],
    ["SELECT * FROM lots_of_rows WHERE lo_value > 1"],
  ])("%j is one read", (sql) => {
    expect(readRefusal(sql)).toBeNull();
  });

  it("reads a plain string both ways: one the server reads with standard_conforming_strings off is checked too", () => {
    // On: 'a\' is a string, and pg_advisory_lock(1) is code. Off: the string runs on to the last quote.
    expect(readRefusal("SELECT 'a\\', pg_advisory_lock(1), 'b'")).toEqual(fn("pg_advisory_lock"));
    // On: two strings around `AS a,`. Off: 'x\' AS a, ' is one string, then pg_advisory_lock(1) is code, then a
    // comment.
    expect(readRefusal("SELECT 'x\\' AS a, ' AS b, pg_advisory_lock(1) AS c --'")).toEqual(fn("pg_advisory_lock"));
    // On: the string never ends (`\''` is a backslash and a quote); off it ends and pg_advisory_lock is code: refused.
    expect(readRefusal("SELECT 'a\\'', pg_advisory_lock(1), ''")).toEqual(UNREADABLE);
    // An E-string reads alike both ways: \' is a quote inside it.
    expect(readRefusal("SELECT E'a\\'', pg_advisory_lock(1) --'")).toEqual(fn("pg_advisory_lock"));
    expect(readRefusal("SELECT E'a\\' pg_advisory_lock(1) '")).toBeNull();
  });

  it("ends a B or X string at its first quote, as the server does", () => {
    // B'0', then a plain string: off, '\' AS a, ' is one string and pg_advisory_lock(1) is code. A B string read with
    // '' as a quote would swallow both strings, and the name with them.
    expect(readRefusal("SELECT B'0''\\' AS a, ' AS b, pg_advisory_lock(1) AS c --'")).toEqual(fn("pg_advisory_lock"));
    expect(readRefusal("SELECT X'ff'")).toBeNull();
  });

  it("reads a number followed by a letter as two tokens, so a name after it is seen", () => {
    expect(readRefusal("SELECT 1pg_advisory_lock(1)")).toEqual(fn("pg_advisory_lock"));
    expect(readRefusal("SELECT 0xset_config")).toBeNull();
    expect(readRefusal("SELECT 1e5set_config")).toEqual(fn("set_config"));
    expect(readRefusal("SELECT 1e+5, 2E-3")).toBeNull();
  });

  it("tells a parameter, a dollar quote and a lone dollar apart", () => {
    expect(readRefusal("SELECT $1, $a$x$a$, $")).toBeNull();
    expect(readRefusal("SELECT $pg_x")).toEqual(fn("pg_x"));
  });

  it("refuses a name by its prefix or the list, folded to ASCII lower case", () => {
    expect(isRefusedName("PG_anything")).toBe(true);
    expect(isRefusedName("dblink_connect")).toBe(true);
    expect(isRefusedName("binary_upgrade_set_next_heap_pg_class_oid")).toBe(true);
    expect(isRefusedName("Set_Config")).toBe(true);
    expect(isRefusedName("currval")).toBe(false);
    expect(isRefusedName("lastval")).toBe(false);
    expect(isRefusedName("height")).toBe(false);
    for (const name of REFUSED_FUNCTIONS) expect(isRefusedName(name)).toBe(true);
    expect(REFUSED_PREFIXES).toEqual(["pg_", "dblink", "binary_upgrade_"]);
    expect(READ_COMMANDS).toEqual(["select", "with", "values", "table"]);
  });

  it("refuses the first statement of a read that is not one read, by its index; none of an empty read", () => {
    expect(refusedStatement([])).toBeNull();
    expect(refusedStatement([{ sql: "SELECT 1" }, { sql: "TABLE pub.rows" }])).toBeNull();
    expect(refusedStatement([{ sql: "SELECT 1" }, { sql: "SET x = 1" }, { sql: "COMMIT" }])).toEqual({
      statement: 1,
      reason: "command",
      name: "SET",
    });
  });
});

describe("A115 as amended (task 14.2b): read-result's refused", () => {
  const CONFIG = `0x${"ef".repeat(32)}`;
  const refused: ReadResult = {
    v: 1,
    type: "read-result",
    id: "9",
    height: null,
    configHash: CONFIG,
    error: "read-refused",
    refused: { statement: 2, reason: "function", name: "pg_advisory_lock" },
  };

  it("round-trips, its reasons the gate's", () => {
    expect(parseMessage(messageText(refused))).toEqual({ ok: true, message: refused });
    const reasons = READ_REFUSAL_REASONS.map((reason) =>
      MESSAGE_SCHEMAS["read-result"].safeParse({ ...refused, refused: { statement: 0, reason, name: null } }).success,
    );
    expect(reasons).toEqual([true, true, true, true]);
  });

  it.each([
    ["refused without read-refused", { ...refused, error: "database-error" }],
    ["read-refused without refused", { ...refused, refused: undefined }],
    ["refused with results", { ...refused, error: undefined, results: [] }],
    ["an unknown reason", { ...refused, refused: { statement: 0, reason: "other", name: null } }],
    ["a negative statement", { ...refused, refused: { statement: -1, reason: "command", name: null } }],
    ["a fractional statement", { ...refused, refused: { statement: 0.5, reason: "command", name: null } }],
    ["an empty name", { ...refused, refused: { statement: 0, reason: "command", name: "" } }],
    ["a name over the limit", { ...refused, refused: { statement: 0, reason: "command", name: "x".repeat(NAME_MAX + 1) } }],
    ["an extra field", { ...refused, refused: { statement: 0, reason: "command", name: null, text: "COMMIT" } }],
    ["a field missing", { ...refused, refused: { statement: 0, reason: "command" } }],
  ])("%s fails the schema", (_name, message) => {
    expect(parseMessage(JSON.stringify(message))).toMatchObject({ ok: false, fault: "invalid-message" });
  });
});
