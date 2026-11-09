import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import { BACKENDS } from "../db/backends.js";
import { DETERMINISM_BACKENDS } from "../determinism/backends.js";
import { calledNames, parseSource, REPOSITORY, typeScriptFiles } from "./source-scan.js";

/**
 * The suite `test/deterministic-postgresql/` runs every rule of the design's `deterministic_postgresql` component
 * table on PostgreSQL 18 and on PGlite. This file says, row by row, which suite files run the rules, and which parts
 * are still pending. When a row's part is built, it moves from `pending` to `tests` here, with the suite files that
 * run it.
 */

const SUITE = join(REPOSITORY, "test", "deterministic-postgresql");

interface RowCoverage {
  /** The row's first two cells, verbatim. */
  readonly rule: string;
  readonly requirement: string;
  /** The suite's files that run the row's rules built so far. */
  readonly tests: readonly string[];
  /** Each part of the row not built yet, and what builds it. */
  readonly pending: Readonly<Record<string, string>>;
}

const ROWS: readonly RowCoverage[] = [
  {
    rule: "Column types allowed as values and as keys, each refusal with its reason and alternative (the column-type table above)",
    requirement: "DT-1, DT-2, DT-6",
    tests: ["column-rules.test.ts", "column-refusals.test.ts", "both-backends.test.ts"],
    pending: {},
  },
  {
    rule: 'Text keys ordered by bytes (`COLLATE "C"`)',
    requirement: "DT-2",
    tests: ["column-rules.test.ts", "both-backends.test.ts"],
    pending: {},
  },
  {
    rule: "Identity, `serial` and non-immutable defaults refused, detected from `pg_attrdef.adbin` as above",
    requirement: "DT-6",
    tests: ["column-rules.test.ts", "column-refusals.test.ts", "both-backends.test.ts"],
    pending: {},
  },
  {
    rule: "Sequences and unlogged tables in module schemas refused",
    requirement: "DT-6",
    tests: ["column-rules.test.ts", "column-refusals.test.ts", "both-backends.test.ts"],
    pending: {},
  },
  {
    rule: "`core_chain.jsonb_numbers_ok` and `core_chain.numeric_ok` and the `CHECK`s they back",
    requirement: "DT-1, DT-6",
    // The functions and their rules, the CHECK on every such column, and the writes they refuse.
    tests: ["checks.test.ts"],
    pending: {},
  },
  {
    rule: "Block transactions change rows only; the `BEFORE TRUNCATE` trigger",
    requirement: "DB-14",
    tests: ["block-transactions.test.ts"],
    pending: {},
  },
  {
    rule:
      "The pinned session settings, and the zero timeouts (`statement_timeout`, `lock_timeout`, " +
      "`idle_in_transaction_session_timeout`, `transaction_timeout`, `idle_session_timeout`) of the writer and " +
      "callback reads",
    requirement: "DB-2, DB-15",
    tests: ["results.test.ts", "both-backends.test.ts", "zero-timeouts.test.ts"],
    pending: {},
  },
  {
    rule:
      "The result mapping and parameter texts: lossless `jsonb`, arrays element by element, date and time as RFC 3339 " +
      "text, other types as their text",
    requirement: "DB-2",
    tests: ["mapping.test.ts", "results.test.ts", "time-values.test.ts"],
    pending: {},
  },
  {
    rule:
      "The opt-out: a `table` item declared `deterministic: false` — its tables, the sequences their columns own and " +
      "its unlogged tables are skipped by the refusals and the `CHECK`s; the contents hash records each such table as " +
      "`[schema, table, null, null]`; digests skip it; backups carry its rows and its sequences' positions",
    requirement: "MD-1, DT-3, DT-4, DT-6, BK-2",
    // - The declaration, and the skip written once (`opt-out.ts`) that the refusals and the TRUNCATE guard use.
    // - The startup check, the CHECKs and change capture skip such tables; the hash records them by name only.
    // - A backup carries such a table's rows and its sequence's position.
    tests: ["opt-out.test.ts", "opt-out-backup.test.ts"],
    pending: {},
  },
];

/** The calls that start a backend or open a database: a backend list's `start`, the servers' and the API's openers. */
const OPENERS = [
  "start",
  "startPostgres",
  "startPglite",
  "startPostgresServer",
  "startPgliteServer",
  "openPostgres",
  "openPglite",
  "openPgliteOn",
];

/** True when a suite file starts a backend or opens a database. */
function opensDatabase(file: string): boolean {
  const called = calledNames(parseSource(file));
  return OPENERS.some((name) => called.has(name));
}

/**
 * True when a suite file runs its tests on both backends: it iterates one of the backend lists, or starts both
 * backends itself.
 */
function runsOnBothBackends(file: string): boolean {
  const text = readFileSync(file, "utf8");
  return (
    /describe\.each\(\s*(DETERMINISM_BACKENDS|BACKENDS)\s*\)/.test(text) ||
    /for \(const \w+ of (DETERMINISM_BACKENDS|BACKENDS)\)/.test(text) ||
    (/\bstartPostgres\(/.test(text) && /\bstartPglite\(/.test(text))
  );
}

describe("the suite runs every rule of the component table on both backends", () => {
  const suiteFiles = typeScriptFiles(SUITE).filter((file) => file.endsWith(".test.ts"));

  it("runs on PostgreSQL 18 and on PGlite 0.5.10: the backend lists the suite iterates", () => {
    expect(BACKENDS.map((backend) => backend.name)).toEqual(["PostgreSQL 18", "PGlite 0.5.10"]);
    expect(DETERMINISM_BACKENDS.map((backend) => backend.name)).toEqual(["PostgreSQL 18", "PGlite 0.5.10"]);
  });

  it("runs every suite file that opens a database on both backends", () => {
    const opening = suiteFiles.filter(opensDatabase);
    expect(opening.length).toBeGreaterThan(0);
    expect(opening.filter((file) => !runsOnBothBackends(file)).map((file) => basename(file))).toEqual([]);
  });

  it("runs every part of a row built so far in files of the suite, at least one on both backends", () => {
    const problems: string[] = [];
    for (const row of ROWS) {
      for (const test of row.tests) {
        if (!existsSync(join(SUITE, test))) problems.push(`${row.rule}: ${test} is not in the suite`);
      }
      const both = row.tests.filter((test) => existsSync(join(SUITE, test)) && runsOnBothBackends(join(SUITE, test)));
      if (row.tests.length > 0 && both.length === 0) problems.push(`${row.rule}: no file runs it on both backends`);
      if (row.tests.length === 0 && Object.keys(row.pending).length === 0) problems.push(`${row.rule}: not run`);
    }
    expect(problems).toEqual([]);
  });
});
