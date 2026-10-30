import { describe, expect, it } from "vitest";
import { checkStatements, statementsOf, StatementSplitter } from "../../src/backup/statements.js";
import { restoreArguments } from "../../src/cli/restore.js";

/**
 * The statements of a backup's dump as a restore runs them (`src/backup/statements.ts`): split as PostgreSQL's lexer
 * reads SQL — strings, escape strings, quoted identifiers, dollar-quoted bodies, line and nested block comments —,
 * `psql`'s `\restrict`/`\unrestrict` taken as `psql` takes them, and every other meta-command, a `COPY … FROM stdin`
 * and a file ending inside a statement refused (`backup-format-unknown`); and `restore`'s arguments. [BK-3]
 */

/** The SQL of every statement of `text` (lines after a manifest). */
async function sqlOf(text: string): Promise<string[]> {
  const lines = (async function* () {
    yield* text.split("\n");
  })();
  const out: string[] = [];
  for await (const statement of statementsOf(lines)) out.push(statement.sql);
  return out;
}

/** `checkStatements` of `text`'s lines. */
const check = (text: string) =>
  checkStatements(
    (async function* () {
      yield* text.split("\n");
    })(),
  );

describe("splitting a dump into statements (BK-3)", () => {
  it("ends a statement at a semicolon outside strings, identifiers, bodies and comments", async () => {
    const text = [
      "SET statement_timeout = 0;",
      "INSERT INTO m.t VALUES (1, 'a;", "b''c;', E'd\\';e', \"q;\"\"x\");",
      "CREATE FUNCTION m.f() RETURNS int LANGUAGE sql AS $body$ SELECT 1; SELECT 2 $body$;",
      "CREATE FUNCTION m.g() RETURNS int LANGUAGE sql AS $$ SELECT ';' $$;",
      "-- a comment; with a semicolon",
      "/* a /* nested; */ comment; */ SELECT 3;",
      "SELECT 'x' -- trailing; comment",
      ";",
      "--",
      "-- the end",
    ].join("\n");
    expect(await sqlOf(text)).toEqual([
      "SET statement_timeout = 0;",
      "INSERT INTO m.t VALUES (1, 'a;\nb''c;', E'd\\';e', \"q;\"\"x\");",
      "CREATE FUNCTION m.f() RETURNS int LANGUAGE sql AS $body$ SELECT 1; SELECT 2 $body$;",
      "CREATE FUNCTION m.g() RETURNS int LANGUAGE sql AS $$ SELECT ';' $$;",
      "-- a comment; with a semicolon\n/* a /* nested; */ comment; */ SELECT 3;",
      "SELECT 'x' -- trailing; comment\n;",
    ]);
    expect(await check(text)).toBe(6);
  });

  it("reads a dollar sign that opens no body, and an identifier ending in E before a quote, as code", async () => {
    expect(await sqlOf("SELECT $1, a$b, 1 $x;\nSELECT 'it''s', name'x';")).toEqual(["SELECT $1, a$b, 1 $x;", "SELECT 'it''s', name'x';"]);
  });

  it("takes psql's \\restrict and \\unrestrict with one key, and gives each statement its line", async () => {
    const lines = (async function* () {
      yield* ["\\restrict abc", "SELECT 1;", "", "SELECT", "2;", "\\unrestrict abc"];
    })();
    const out = [];
    for await (const statement of statementsOf(lines, 2)) out.push([statement.line, statement.sql]);
    expect(out).toEqual([
      [3, "SELECT 1;"],
      [5, "SELECT\n2;"],
    ]);
  });

  it.each([
    ["another meta-command", "\\! touch x\nSELECT 1;", "the psql meta-command \"\\\\!\""],
    ["a meta-command inside \\restrict", "\\restrict k\n\\connect other\n\\unrestrict k", "inside \\restrict"],
    ["an \\unrestrict whose key is another", "\\restrict k\n\\unrestrict j", "whose key is not"],
    ["a \\restrict without a key", "\\restrict", "the psql meta-command"],
    ["a COPY FROM stdin", "COPY m.t (a) FROM stdin;\n1\n\\.", "COPY … FROM stdin"],
    ["a statement left open", "SELECT 1;\nSELECT 2", "ends inside a statement"],
    ["a string left open", "SELECT 'x;\n", "ends inside a string"],
    ["an identifier left open", 'SELECT "x;\n', "ends inside a quoted identifier"],
    ["a body left open", "SELECT $q$ x;\n", "ends inside a dollar-quoted body"],
    ["a comment left open", "SELECT 1; /* x\n", "ends inside a comment"],
  ])("refuses a file with %s: backup-format-unknown", async (_name, text, why) => {
    const error = await check(text).then(
      () => null,
      (caught: unknown) => caught,
    );
    expect(error).toMatchObject({ code: "backup-format-unknown" });
    expect((error as Error).message).toContain(why);
  });

  it("keeps its state from line to line (a string across lines)", () => {
    const splitter = new StatementSplitter();
    expect(splitter.push("SELECT 'a")).toEqual([]);
    expect(splitter.push("b';")).toEqual([{ kind: "statement", sql: "SELECT 'a\nb';", line: 1 }]);
    expect(() => splitter.end()).not.toThrow();
  });
});

describe("restore's arguments", () => {
  it.each([
    [[], "restore takes one backup file: umbradb restore <file> [--config <file>]"],
    [["a", "b"], "restore takes one backup file: umbradb restore <file> [--config <file>]"],
    [["a", "--config", "c", "--config", "d"], "restore takes --config once"],
    [["a", "--config", ""], "--config takes a value: the configuration file"],
    [["a", "--out", "x"], "unknown option --out of restore"],
  ])("refuses %j", (args, problem) => {
    expect(restoreArguments(args)).toBe(problem);
  });

  it("takes one file and at most one --config", () => {
    expect(restoreArguments(["a.backup"])).toEqual({ file: "a.backup" });
    expect(restoreArguments(["--config", "c.ts", "a.backup"])).toEqual({ file: "a.backup", config: "c.ts" });
  });
});
