import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { BACKENDS } from "../db/backends.js";
import { DETERMINISM_BACKENDS } from "../determinism/backends.js";
import { calledNames, parseSource, REPOSITORY, typeScriptFiles } from "./source-scan.js";

/**
 * A138's first half (task 2.2a, owner decision Q69): the suite `test/deterministic-postgresql/` runs every rule of
 * `design.md` §4's component table on PostgreSQL 18 and on PGlite. Some rows are built by later tasks; this file is
 * where the suite says, row by row, which of its files run the rules built so far and which task builds the rest. A
 * task that builds a row's part moves it from `pending` to `tests` here, with the suite files that run it; a part
 * left pending after its task is checked in `tasks.md` fails this test, and so does a row of the design that this
 * list does not mirror verbatim.
 */

const MARKER = "**The `deterministic_postgresql` component (Q69).**";
const HEADER = "| Rule | Requirement | Decided in |";
const SUITE = join(REPOSITORY, "test", "deterministic-postgresql");

interface RowCoverage {
  /** The row's first two cells, verbatim. */
  readonly rule: string;
  readonly requirement: string;
  /** The suite's files that run the row's rules built so far. */
  readonly tests: readonly string[];
  /** Each part of the row no task has built yet, and the task of `tasks.md` that builds it. */
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
    tests: [],
    pending: { "the two functions and the CHECKs on jsonb and numeric columns and their arrays": "7.1" },
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
      "`idle_in_transaction_session_timeout`, `transaction_timeout`) of the writer and callback reads",
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
    tests: [],
    pending: {
      "the declaration deterministic: false on a table item": "3.1",
      "opted-out tables skipped by the refusals and the CHECKs, and hashed by name only": "7.1",
    },
  },
];

interface DesignTable {
  readonly path: string;
  readonly rows: readonly (readonly [string, string, string])[];
}

/** §4's component table, found by its heading anywhere under `openspec/` (an archived change included), once. */
function readComponentTable(): DesignTable {
  const openspec = join(REPOSITORY, "openspec");
  const paths = (readdirSync(openspec, { recursive: true, encoding: "utf8" }) as string[])
    .filter((path) => basename(path) === "design.md")
    .map((path) => join(openspec, path))
    .filter((path) => readFileSync(path, "utf8").includes(MARKER));
  if (paths.length !== 1) {
    throw new Error(`expected one design.md under openspec/ holding ${MARKER}, found ${JSON.stringify(paths)}`);
  }
  const path = paths[0] as string;
  const lines = readFileSync(path, "utf8").split("\n");
  const start = lines.findIndex((line) => line.startsWith(MARKER));
  const header = lines.indexOf(HEADER, start);
  if (start < 0 || header < 0) throw new Error(`no component table after ${MARKER} in ${path}`);
  const rows: [string, string, string][] = [];
  for (let index = header + 2; (lines[index] ?? "").startsWith("|"); index++) {
    const cells = (lines[index] as string).split(" | ").map((cell) => cell.replace(/^\| ?| ?\|$/g, "").trim());
    if (cells.length !== 3) throw new Error(`row ${index + 1} of ${path} has ${cells.length} cells`);
    rows.push(cells as [string, string, string]);
  }
  return { path, rows };
}

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

/** The ids of the tasks `tasks.md` (next to the design) lists as not done, `- [ ] <id> …`. */
function openTasks(designPath: string): Set<string> {
  const tasks = join(dirname(designPath), "tasks.md");
  const text = readFileSync(tasks, "utf8");
  return new Set([...text.matchAll(/^- \[ \] ([0-9]+\.[0-9]+[a-z]?) /gm)].map((match) => match[1] as string));
}

describe("A138: the suite runs every rule of design.md §4's component table on both backends", () => {
  const table = readComponentTable();
  const suiteFiles = typeScriptFiles(SUITE).filter((file) => file.endsWith(".test.ts"));

  it("finds the component table once, under openspec/, with its nine rows", () => {
    expect(table.rows).toHaveLength(9);
  });

  it("mirrors every row of the table, verbatim and in order", () => {
    expect(ROWS.map((row) => [row.rule, row.requirement])).toEqual(table.rows.map(([rule, requirement]) => [rule, requirement]));
  });

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

  it("names, for each part not built yet, a task that tasks.md still lists as open", () => {
    const open = openTasks(table.path);
    const done = ROWS.flatMap((row) =>
      Object.entries(row.pending)
        .filter(([, task]) => !open.has(task))
        .map(([part, task]) => `${part}: task ${task} is no longer open; move the part to the row's tests`),
    );
    expect(done).toEqual([]);
    // What A138 covers now, and what waits for which task (`tasks.md` 2.2a's done note says the same).
    expect(Object.fromEntries(ROWS.flatMap((row) => Object.entries(row.pending)))).toEqual({
      "the two functions and the CHECKs on jsonb and numeric columns and their arrays": "7.1",
      "the declaration deterministic: false on a table item": "3.1",
      "opted-out tables skipped by the refusals and the CHECKs, and hashed by name only": "7.1",
    });
  });
});
