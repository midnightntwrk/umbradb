import { describe, expect, it } from "vitest";
import { readRefusal, REFUSED_FUNCTIONS } from "../../src/private/read-gate.js";

/**
 * Task 17.5b (the mutation pass task 14.2b deferred): the gate's lexer on texts where reading a construct one
 * character too long or too short would hide a refused name or show one that is inside a literal — whitespace,
 * identifiers with digits, `_` and characters beyond ASCII, doubled quotes, line and nested block comments, quoted
 * names, numbers and exponents, `U&` strings, `E` and `N` strings in either case, dollar quotes, quoted semicolons and
 * parentheses — and the list of refused functions as written.
 */

const fn = (name: string) => ({ reason: "function", name });
const UNREADABLE = { reason: "unreadable", name: null };

describe("the read gate's lexer, construct by construct (task 17.5b)", () => {
  it("lists exactly the refused functions", () => {
    expect([...REFUSED_FUNCTIONS].sort()).toEqual(
      [
        "set_config", "setseed", "nextval", "setval", "query_to_xml", "query_to_xmlschema", "query_to_xml_and_xmlschema",
        "cursor_to_xml", "cursor_to_xmlschema", "table_to_xml", "table_to_xmlschema", "table_to_xml_and_xmlschema",
        "schema_to_xml", "schema_to_xmlschema", "schema_to_xml_and_xmlschema", "database_to_xml", "database_to_xmlschema",
        "database_to_xml_and_xmlschema", "ts_stat", "ts_rewrite", "brin_summarize_new_values", "brin_summarize_range",
        "brin_desummarize_range", "gin_clean_pending_list", "lo_close", "lo_creat", "lo_create", "lo_export",
        "lo_from_bytea", "lo_get", "lo_import", "lo_lseek", "lo_lseek64", "lo_open", "lo_put", "lo_tell", "lo_tell64",
        "lo_truncate", "lo_truncate64", "lo_unlink", "loread", "lowrite",
      ].sort(),
    );
  });

  it.each([" ", "\t", "\n", "\r", "\f", "\v"])("reads %j as space, before the command too", (space) => {
    expect(readRefusal(`${space}SELECT${space}1${space}`)).toBeNull();
  });

  it.each([
    // An identifier holds digits, `_`, `$` and characters beyond ASCII: no name starts inside it.
    ["SELECT ab0pg_x", null],
    ["SELECT ab5pg_x", null],
    ["SELECT ab9pg_x", null],
    ["SELECT a1pg_x", null],
    ["SELECT x_pg_y", null],
    ["SELECT a\u0080pg_x", null],
    // A doubled quote inside a string, then code.
    ["SELECT 'a''b', pg_x", fn("pg_x")],
    // A lone minus or slash is code; a line comment ends at a carriage return too.
    ["SELECT 1 -pg_x", fn("pg_x")],
    ["SELECT 4 / 2, pg_x", fn("pg_x")],
    ["SELECT 1 --c\rpg_x", fn("pg_x")],
    // A slash inside a block comment opens nothing; a star alone closes nothing.
    ["SELECT 1 /* a/b */, pg_x", fn("pg_x")],
    ["SELECT 1 /* a * b pg_x */", null],
    // A quoted name keeps its doubled quote.
    ['SELECT "pg_""x"', fn('pg_"x')],
    // Digits with `_` read on, so the name after them is its own; an exponent in either case.
    ["SELECT 1_pg_x", fn("pg_x")],
    ["SELECT 1E5pg_x", fn("pg_x")],
    ["SELECT 1epg_x, 2e5", null],
    // U& strings and names are unreadable; a U or & alone is not.
    ["SELECT u&'x'", UNREADABLE],
    ['SELECT U&"x"', UNREADABLE],
    ["SELECT u,'x'", null],
    ["SELECT a&'x'", null],
    ["SELECT u''", null],
    ["SELECT u&x", null],
    // E strings (backslashes) and N strings (as plain ones) in either case.
    ["SELECT e'a\\'', pg_x --'", fn("pg_x")],
    ["SELECT N'a\\', pg_x, 'b'", fn("pg_x")],
    ["SELECT n'a\\', pg_x, 'b'", fn("pg_x")],
    // A lone dollar before a dollar quote.
    ["SELECT $ + 1, $a$ x $a$", null],
    // Operators are no part of a name: a name after them is seen.
    ["SELECT 'a'||pg_x", fn("pg_x")],
    ["SELECT 2^pg_x", fn("pg_x")],
    // Read with standard_conforming_strings off, an N string takes backslashes and a B or X string does not; a word of
    // two of those letters before a quote starts a plain string.
    ["SELECT N'a\\', 'b'", UNREADABLE],
    ["SELECT n'a\\', 'b'", UNREADABLE],
    ["SELECT X'a\\', 'b'", null],
    ["SELECT nN'a\\', 'b'", UNREADABLE],
    // A quoted semicolon or parenthesis is a name.
    ['SELECT ";", 1', null],
    ['"(" SELECT 1', { reason: "command", name: null }],
  ])("%j", (sql, expected) => {
    expect(readRefusal(sql)).toEqual(expected);
  });
});
