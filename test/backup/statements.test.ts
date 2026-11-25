import { describe, expect, it } from "vitest";
import { checkStatements, COPY_CHUNK, type DumpPiece, statementsOf, StatementSplitter } from "../../src/backup/statements.js";
import { restoreArguments } from "../../src/cli/restore.js";

/**
 * The statements of a backup's dump as a restore runs them (`src/backup/statements.ts`): split as PostgreSQL's lexer
 * reads SQL — strings, escape strings, quoted identifiers, dollar-quoted bodies, line and nested block comments —,
 * `psql`'s `\restrict`/`\unrestrict` taken as `psql` takes them, a `COPY … FROM stdin`'s data passed through, and every
 * other meta-command and a file ending inside a statement or a `COPY`'s data refused (`backup-format-unknown`); and
 * `restore`'s arguments.
 */

/** Every piece `statementsOf` gives for `text` (lines after a manifest). */
async function piecesOf(text: string, firstLine?: number): Promise<DumpPiece[]> {
  const lines = (async function* () {
    yield* text.split("\n");
  })();
  const out: DumpPiece[] = [];
  for await (const piece of statementsOf(lines, firstLine)) out.push(piece);
  return out;
}

/** The SQL of every statement of `text`. */
async function sqlOf(text: string): Promise<string[]> {
  return (await piecesOf(text)).flatMap((piece) => ("sql" in piece ? [piece.sql] : []));
}

/** `checkStatements` of `text`'s lines. */
const check = (text: string) =>
  checkStatements(
    (async function* () {
      yield* text.split("\n");
    })(),
  );

describe("splitting a dump into statements", () => {
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
    const text = ["\\restrict abc", "SELECT 1;", "", "SELECT", "2;", "\\unrestrict abc"].join("\n");
    const out = (await piecesOf(text, 2)).map((piece) => ("sql" in piece ? [piece.line, piece.sql] : piece));
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
    ["a COPY's data left open", "COPY m.t (a) FROM stdin;\n1\n", "ends inside a COPY's data"],
    ["a COPY not ending its line", "COPY m.t (a) FROM stdin; SELECT 1;\n\\.", "does not end its line"],
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

  it("passes a COPY … FROM stdin's data through, unparsed, up to its \\. line", async () => {
    const text = [
      "\\restrict k",
      "COPY m.t (a, b) FROM stdin;",
      "1\t\\N",
      "\\x\t'; /* not SQL",
      "\\.",
      "SELECT 1;",
      "\\unrestrict k",
    ].join("\n");
    expect(await piecesOf(text)).toEqual([
      { kind: "copy", sql: "COPY m.t (a, b) FROM stdin;", line: 3 },
      { kind: "copy-data", text: "1\t\\N\n\\x\t'; /* not SQL\n" },
      { kind: "copy-end" },
      { kind: "statement", sql: "SELECT 1;", line: 7 },
    ]);
    expect(await check(text)).toBe(2);
  });

  it("gives a COPY's data in chunks of whole lines that join to the data", async () => {
    const row = "x".repeat(1_000);
    const rows = Array.from({ length: Math.ceil((3 * COPY_CHUNK) / row.length) }, (_, i) => `${i}\t${row}`);
    const pieces = await piecesOf(["COPY m.t (a, b) FROM stdin;", ...rows, "\\.", "COPY m.u (a) FROM stdin;", "\\."].join("\n"));
    const chunks = pieces.flatMap((piece) => (piece.kind === "copy-data" ? [piece.text] : []));
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.endsWith("\n")).toBe(true);
    expect(chunks.join("")).toBe(rows.map((r) => `${r}\n`).join(""));
    // A COPY with no data gives no chunk.
    expect(pieces.slice(-2)).toEqual([{ kind: "copy", sql: "COPY m.u (a) FROM stdin;", line: rows.length + 4 }, { kind: "copy-end" }]);
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
    [[], "restore takes one backup file: umbradb restore <file> [--config <file>] [--overwrite-history]"],
    [["a", "b"], "restore takes one backup file: umbradb restore <file> [--config <file>] [--overwrite-history]"],
    [["a", "--config", "c", "--config", "d"], "restore takes --config once"],
    [["a", "--config", ""], "--config takes a value: the configuration file"],
    [["a", "--out", "x"], "unknown option --out of restore"],
    [["a", "--overwrite-history=yes"], "unknown option --overwrite-history of restore"],
  ])("refuses %j", (args, problem) => {
    expect(restoreArguments(args)).toBe(problem);
  });

  it("takes one file and at most one --config", () => {
    expect(restoreArguments(["a.backup"])).toEqual({ file: "a.backup" });
    expect(restoreArguments(["--config", "c.ts", "a.backup"])).toEqual({ file: "a.backup", config: "c.ts" });
    expect(restoreArguments(["a.backup", "--overwrite-history"])).toEqual({ file: "a.backup", overwriteHistory: true });
  });
});
