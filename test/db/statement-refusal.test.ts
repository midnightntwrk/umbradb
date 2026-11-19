import { describe, expect, it } from "vitest";
import { controlRefused } from "../../src/db/errors.js";
import { controlStatement } from "../../src/db/statement-refusal.js";

/**
 * The check a module's handles run before they send a statement (`src/db/statement-refusal.ts`): a statement whose
 * first word ends or nests the transaction, or that sets the session authorization, is named; any other statement, and
 * a text the server refuses as a syntax error, passes (null). Leading empty statements, and spaces, `--` comments and
 * nested `/* *\/` comments before and between the words, are skipped, and ASCII letters are folded. A setting's name
 * is read unquoted, double-quoted, and as a Unicode name (`U&"…"`) with its escapes.
 */

describe("the statements a module's handles refuse", () => {
  it.each([
    ["BEGIN", "BEGIN"],
    ["begin isolation level serializable", "BEGIN"],
    ["BEGIN;", "BEGIN"],
    ["START TRANSACTION", "START"],
    ["start transaction read write", "START"],
    ["COMMIT", "COMMIT"],
    ["commit and chain", "COMMIT"],
    ["COMMIT PREPARED 'x'", "COMMIT"],
    ["CoMmIt", "COMMIT"],
    ["END", "END"],
    ["end transaction", "END"],
    ["ROLLBACK", "ROLLBACK"],
    ["ROLLBACK AND CHAIN", "ROLLBACK"],
    ["ROLLBACK TO SAVEPOINT s", "ROLLBACK"],
    ["rollback to s", "ROLLBACK"],
    ["ROLLBACK PREPARED 'x'", "ROLLBACK"],
    ["ABORT", "ABORT"],
    ["SAVEPOINT s", "SAVEPOINT"],
    ["RELEASE s", "RELEASE"],
    ["RELEASE SAVEPOINT s", "RELEASE"],
    ["PREPARE TRANSACTION 'x'", "PREPARE TRANSACTION"],
    ["prepare /* a */ transaction 'x'", "PREPARE TRANSACTION"],
    ["SET SESSION AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["set session authorization default", "SET SESSION AUTHORIZATION"],
    ["SET LOCAL SESSION AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["SET SESSION SESSION AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["SET /* a */ SESSION -- b\n AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["SET session_authorization = r", "SET SESSION AUTHORIZATION"],
    ["SET LOCAL session_authorization TO DEFAULT", "SET SESSION AUTHORIZATION"],
    ["SET SESSION Session_Authorization = 'r'", "SET SESSION AUTHORIZATION"],
    ['SET "session_authorization" = r', "SET SESSION AUTHORIZATION"],
    ['set local "SESSION_AUTHORIZATION" to default', "SET SESSION AUTHORIZATION"],
    ["/* a comment */ COMMIT", "COMMIT"],
    ["-- a comment\nCOMMIT", "COMMIT"],
    ["-- a comment\rcommit", "COMMIT"],
    ["/* a comment */ -- another\n  commit", "COMMIT"],
    ["/* outer /* nested */ still a comment */ COMMIT", "COMMIT"],
    [" \t\n\r\f\vCOMMIT", "COMMIT"],
    // Behind empty statements, which the server drops.
    ["; COMMIT", "COMMIT"],
    [";; ROLLBACK", "ROLLBACK"],
    [";SAVEPOINT s", "SAVEPOINT"],
    [" ; /* a comment */ ; -- another\n ; commit", "COMMIT"],
    ["; SET SESSION AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    [";; PREPARE TRANSACTION 'x'", "PREPARE TRANSACTION"],
    // A text of two statements is refused by its first.
    ["COMMIT; SELECT 1", "COMMIT"],
    ["SAVEPOINT s; INSERT INTO t.rows VALUES (1, 'x')", "SAVEPOINT"],
    // PREPARE TRANSACTION and its string, however the string is written; without `AS` or a type list after it, also
    // when the server would refuse the text.
    ["PREPARE TRANSACTION E'x'", "PREPARE TRANSACTION"],
    ["PREPARE TRANSACTION $$x$$", "PREPARE TRANSACTION"],
    ["prepare transaction U&'x'", "PREPARE TRANSACTION"],
    ["PREPARE TRANSACTION", "PREPARE TRANSACTION"],
    ["PREPARE TRANSACTION x", "PREPARE TRANSACTION"],
    // The scope and the words of SET SESSION AUTHORIZATION with comments between them.
    ["SET /* a */ LOCAL -- b\n /* c */ SESSION /* d */ AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["SET SESSION /* a */ SESSION /* b */ AUTHORIZATION r", "SET SESSION AUTHORIZATION"],
    ["SET LOCAL/**/session_authorization/**/= r", "SET SESSION AUTHORIZATION"],
    // The setting's name as a Unicode name, its escapes read.
    ['SET U&"session_authorization" = \'r\'', "SET SESSION AUTHORIZATION"],
    ['set u&"SESSION_authorization" to default', "SET SESSION AUTHORIZATION"],
    ['SET U&"\\0073ession_authorization" = \'r\'', "SET SESSION AUTHORIZATION"],
    ['SET U&"\\0053ESSION_AUTHORIZATION" = \'r\'', "SET SESSION AUTHORIZATION"],
    ['SET U&"sess\\+000069on_authorization" = r', "SET SESSION AUTHORIZATION"],
    ['SET LOCAL U&"session\\005Fauthorization" = r', "SET SESSION AUTHORIZATION"],
    ['SET SESSION U&"\\0073ession_authorization" TO r', "SET SESSION AUTHORIZATION"],
    ['SET U&"!0073ession_authorization" UESCAPE \'!\' = r', "SET SESSION AUTHORIZATION"],
    ['SET U&"!0073ession_authorization" /* a */ uescape -- b\n \'!\' = r', "SET SESSION AUTHORIZATION"],
    ['SET U&"session#005fauthorization"UESCAPE\'#\'= r', "SET SESSION AUTHORIZATION"],
    // A Unicode name whose UESCAPE is not a plain string of one character is not decoded: refused as a setting's name.
    ['SET U&"!0073ession_authorization" UESCAPE E\'!\' = r', "SET SESSION AUTHORIZATION"],
    ['SET U&"!0073ession_authorization" UESCAPE $$!$$ = r', "SET SESSION AUTHORIZATION"],
    ['SET LOCAL U&"x" UESCAPE \'!!\' = 1', "SET SESSION AUTHORIZATION"],
    ['SET U&"x" UESCAPE \'!\'\'\' = 1', "SET SESSION AUTHORIZATION"],
    ['SET U&"x" UESCAPE \'\' = 1', "SET SESSION AUTHORIZATION"],
    ['SET U&"x" UESCAPE', "SET SESSION AUTHORIZATION"],
    ['SET U&"x" UESCAPE \'', "SET SESSION AUTHORIZATION"],
  ])("refuses %j as %s", (sql, command) => {
    expect(controlStatement(sql)).toBe(command);
  });

  it.each([
    "SELECT 1",
    "SELECT 'COMMIT'",
    "  select 1 -- COMMIT",
    "/* COMMIT */ SELECT 1",
    "-- COMMIT\nSELECT 1",
    "WITH c AS (SELECT 1) SELECT * FROM c",
    "INSERT INTO t.rows VALUES (1, 'COMMIT')",
    "PREPARE p AS SELECT 1",
    "PREPARE p (bigint) AS SELECT $1",
    "PREPARE transactions AS SELECT 1",
    "EXECUTE p",
    "DEALLOCATE p",
    "SET ROLE r",
    "SET LOCAL ROLE r",
    "RESET ROLE",
    "RESET SESSION AUTHORIZATION",
    "RESET session_authorization",
    "SET TimeZone = 'UTC'",
    "SET LOCAL statement_timeout = 0",
    "SET SESSION search_path = t",
    "SET TRANSACTION READ WRITE",
    "SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE",
    "SET session_authorization_x = 1",
    'SET "session authorization" = 1',
    'SET "session""_authorization" = 1',
    "SET",
    "SET LOCAL",
    "SET SESSION",
    "SET SESSION AUTHORIZATIONS",
    "SELECT set_config('session_authorization', 'r', false)",
    "DO $$ BEGIN COMMIT; END $$",
    "CALL t.commits()",
    "COMMITTED",
    "BEGINNING",
    "ENDS",
    "SAVEPOINTS",
    '"COMMIT"',
    "(COMMIT)",
    "COMMİT",
    "",
    "   ",
    "-- only a comment",
    "/* an unterminated comment COMMIT",
    "/* outer /* nested */ COMMIT",
    'SET "session_authorization',
    // A statement prepared by name, also one named `transaction`.
    "PREPARE transaction AS SELECT 1",
    "PREPARE transaction (bigint) AS SELECT $1",
    "prepare TRANSACTION /* a */ as select 1",
    "PREPARE transaction\n(int, text) AS SELECT 1",
    'PREPARE "transaction" AS SELECT 1',
    'PREPARE U&"transaction" AS SELECT 1',
    'PREPARE U&"p" UESCAPE E\'!\' AS SELECT 1',
    "PREPARE TRANSACTION AS",
    'PREPARE TRANSACTION "x',
    "PREPARE TRANSACTION /* an unterminated comment",
    "PREPARE /* an unterminated comment",
    // Empty statements, alone or before a statement that is accepted; two statements, which the server refuses.
    ";",
    ";;",
    " ; -- a comment\n ; ",
    "; SELECT 1",
    ";; /* a comment */ SELECT 'COMMIT'",
    "; /* an unterminated comment ; COMMIT",
    "SELECT 1; COMMIT",
    // Unicode names of other settings, and Unicode names the server refuses.
    'SET U&"TimeZone" = \'UTC\'',
    'SET U&"\\0074imezone" = \'UTC\'',
    'SET LOCAL U&"!0074imezone" UESCAPE \'!\' = \'UTC\'',
    'SET U&"session""_authorization" = 1',
    'SET U&"\\\\0073ession_authorization" = 1',
    'SET U&"session!!_authorization" UESCAPE \'!\' = 1',
    'SET U&"session_authorization\\zzzz" = 1',
    'SET U&"session_authorization\\+00zz00" = 1',
    'SET U&"\\+FFFFFFsession_authorization" = 1',
    'SET U&"\\0073ession_authorization',
    'SET U&"session_authorization" /* an unterminated comment',
    'SET U&"session_authorization" UESCAPE /* an unterminated comment',
    'SET U&"a0073ession_authorization" UESCAPE \'a\' = 1',
    'SET U&"+0073ession_authorization" UESCAPE \'+\' = 1',
    'SET U&"session_authorization" UESCAPE \' \' = 1',
    'SET U&"session_authorization" UESCAPE \'"\' = 1',
    'U&"commit"',
    'u&"\\0063ommit"',
    "U&'commit'",
    // A setting of another name that starts with `session_authorization.`.
    "SET session_authorization.x = 1",
    'SET LOCAL "session_authorization" /* a comment */ . x TO 1',
    'SET U&"session_authorization".x = 1',
    "SET session_authorization /* an unterminated comment",
    // Words that are no keyword where they stand.
    'SET SESSION "authorization" r',
    'SET "session" AUTHORIZATION r',
    'SET "local" session_authorization_x = 1',
    "SET LOCAL SESSION",
    "SET LOCAL SESSION authorizations",
    'SET LOCAL "x',
    "\uFEFFCOMMIT",
    "\u00A0COMMIT",
  ])("lets %j through", (sql) => {
    expect(controlStatement(sql)).toBeNull();
  });
});

describe("the refusal's error", () => {
  it("is database-error, not retryable, with reason control-refused and the command", () => {
    const error = controlRefused("COMMIT");
    expect(error.code).toBe("database-error");
    expect(error.retryable).toBe(false);
    expect(error.details).toEqual({ reason: "control-refused", command: "COMMIT" });
    expect(error.message).toContain("COMMIT");
  });
});
