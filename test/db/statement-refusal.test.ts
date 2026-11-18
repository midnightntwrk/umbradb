import { describe, expect, it } from "vitest";
import { controlRefused } from "../../src/db/errors.js";
import { controlStatement } from "../../src/db/statement-refusal.js";

/**
 * The check a module's handles run before they send a statement (`src/db/statement-refusal.ts`): a statement whose
 * first word ends or nests the transaction, or that sets the session authorization, is named; any other statement, and
 * a text the check cannot read, passes (null). Spaces, `--` comments and nested `/* *\/` comments before and between
 * the words are skipped, and ASCII letters are folded.
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
