import { readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  COLUMN_TYPE_RULES,
  ERROR_CODES,
  PINNED_SETTINGS,
  RESULT_TYPES,
  SESSION_SETTINGS,
  TABLE_RULES,
  ZERO_TIMEOUTS,
} from "../../src/deterministic-postgresql/index.js";
import {
  boundaryViolations,
  COMPONENT,
  codeFingerprints,
  declaredNames,
  exportedDeclarations,
  isInside,
  moduleReferences,
  parseSource,
  REPOSITORY,
  SRC,
  settingsWritten,
  stringLiterals,
  typeScriptFiles,
} from "./source-scan.js";

/**
 * The test over the sources. `src/deterministic-postgresql/` imports nothing else of `src/`, so the component is tested
 * alone. The pinned session settings, the column-type rules and the result mapping are defined in it and nowhere else
 * of `src/`: `src/db/` and `src/determinism/` take every rule from it and repeat none. [A138, Q69; design §4]
 *
 * "Defined nowhere else" is checked four ways, each over the compiler's parse of every `.ts` file of `src/` outside the
 * component:
 * - no file declares a name the component exports;
 * - no file writes a pinned setting with its value (as an array pair, a property or SQL text), nor the key order's
 *   `COLLATE "C"`; [DT-2]
 * - no file defines a function or a value the component defines, under whatever name (the same parameters and body,
 *   or the same initial value, as the compiler prints them without comments, 80 characters or more);
 * - no file holds a string of the component's of 30 characters or more (a reason, an alternative, a design cell, a
 *   message, a catalog query).
 *
 * Each check is shown catching a copy (the fixtures below).
 */

const COMPONENT_FILES = typeScriptFiles(COMPONENT);
const OUTSIDE_FILES = typeScriptFiles(SRC).filter((file) => !isInside(file, COMPONENT));
/** The component's files that hold code; `index.ts` only re-exports. */
const CODE_FILES = COMPONENT_FILES.filter((file) => basename(file) !== "index.ts");

const MINIMUM_CODE = 80;
const MINIMUM_TEXT = 30;

const where = (file: string, line: number): string => `${relative(REPOSITORY, file)}:${line}`;

/** Where the component's rules are defined: each name declared and exported by that file of the component. [A138] */
const DEFINITIONS: Readonly<Record<string, readonly string[]>> = {
  "settings.ts": ["PINNED_SETTINGS", "ZERO_TIMEOUTS", "SESSION_SETTINGS"],
  "column-rules.ts": [
    "SCALAR_COLUMN_TYPES",
    "COLUMN_TYPE_RULES",
    "TABLE_RULES",
    "DEFAULT_DESIGN",
    "columnVerdict",
    "tableRefusals",
    "relationRefusals",
    "databaseRefusals",
    "refusalMessage",
    "keyOrder",
    "keyOrderTerm",
    "refusalOfTypeName",
    "valueFailureBecause",
    "parseExpressionTree",
    "defaultReferences",
    "notImmutableParts",
  ],
  "catalog.ts": ["ConsistentRead", "catalogTables", "catalogRelations", "compareUtf8"],
  "checks.ts": [
    "INTEGER_RULES",
    "refusedNumbersPath",
    "numericOkPredicate",
    "checkFunctionsSql",
    "CHECK_FUNCTIONS_SQL",
    "CHECKED_TYPES",
    "INTEGER_CHECK_PREFIX",
    "integerCheckName",
    "INTEGER_CHECKS_SQL",
    "integerCheckStatements",
  ],
  "opt-out.ts": ["TableName", "OptOut", "optOut"],
  "mapping.ts": ["RESULT_TYPES", "mapValue", "mapRows", "parseArrayText", "parseJsonLossless", "parameterText"],
  "block-transactions.ts": [
    "TRUNCATE_NOT_ALLOWED_SQLSTATE",
    "MIGRATION_MARK",
    "MARK_MIGRATION_SQL",
    "MIGRATION_MARKED_CONDITION",
    "MIGRATION_MARKED_SQL",
    "TRUNCATE_GUARD_TRIGGER",
    "TRUNCATE_GUARD_FUNCTION_SQL",
    "TRUNCATE_GUARD_TABLES_SQL",
    "truncateGuardStatements",
  ],
};

/** The names each file of the component exports by declaring them. */
function componentExports(): Map<string, string> {
  const owner = new Map<string, string>();
  for (const file of CODE_FILES) {
    for (const name of exportedDeclarations(parseSource(file))) owner.set(name, basename(file));
  }
  return owner;
}

/** Every declaration, outside the component, of a name the component exports. */
function redeclared(files: readonly string[], exported: ReadonlyMap<string, string>): string[] {
  const out: string[] = [];
  for (const file of files) {
    for (const [name, line] of declaredNames(parseSource(file))) {
      const owner = exported.get(name);
      if (owner !== undefined) out.push(`${where(file, line)}: declares ${name} (the component's ${owner})`);
    }
  }
  return out;
}

/** Every session setting — a pinned setting or a zero timeout — written with its value outside the component. */
function settingsElsewhere(files: readonly string[]): string[] {
  return files.flatMap((file) =>
    settingsWritten(parseSource(file), SESSION_SETTINGS).map((found) => `${where(file, found.line)}: writes ${found.setting}`),
  );
}

/** Every string of a file that writes `COLLATE "C"`, the collation of the text-key order (`keyOrderTerm`). [DT-2] */
function collationsWritten(file: string, text?: string): string[] {
  return stringLiterals(parseSource(file, text))
    .filter((literal) => /COLLATE\s+"C"/i.test(literal.text))
    .map((literal) => `${where(file, literal.line)}: writes ${JSON.stringify(literal.text)}`);
}

/** The component's functions and values (80 characters or more as printed) defined again in a file outside it. */
function copiedCode(files: readonly string[], component: ReadonlyMap<string, string>): string[] {
  const out: string[] = [];
  for (const file of files) {
    for (const [fingerprint, line] of codeFingerprints(parseSource(file), MINIMUM_CODE)) {
      const owner = component.get(fingerprint);
      if (owner !== undefined) out.push(`${where(file, line)}: defines again the component's code of ${owner}`);
    }
  }
  return out;
}

/** The component's strings (30 characters or more) found in, or holding, a string of a file outside it. */
function copiedTexts(files: readonly string[], component: readonly string[]): string[] {
  const out: string[] = [];
  for (const file of files) {
    for (const { text, line } of stringLiterals(parseSource(file))) {
      const copied = component.find(
        (own) => (own.length >= MINIMUM_TEXT && text.includes(own)) || (text.length >= MINIMUM_TEXT && own.includes(text)),
      );
      if (copied !== undefined) out.push(`${where(file, line)}: holds the component's text ${JSON.stringify(copied)}`);
    }
  }
  return out;
}

/** The component's code fingerprints, each with where it is. */
function componentCode(): Map<string, string> {
  const code = new Map<string, string>();
  for (const file of CODE_FILES) {
    for (const [fingerprint, line] of codeFingerprints(parseSource(file), MINIMUM_CODE)) {
      if (!code.has(fingerprint)) code.set(fingerprint, where(file, line));
    }
  }
  return code;
}

/**
 * The component's strings of 30 characters or more, except its error codes and the names of its session settings.
 * - `ERROR_CODES` is the database API's vocabulary (`UmbraError` and its codes live in the component), which every
 *   module that refuses or fails with a code names. `durability-full-page-writes-off` is the first code that long.
 *   [Q79, DB-12]
 * - A setting's name is PostgreSQL's, which code outside the component names too: `src/db/postgres.ts` sets two of the
 *   timeouts for a bounded read, and 0.9.5's client refuses them in a URL. A setting written with the component's
 *   value is what {@link settingsElsewhere} checks. `idle_in_transaction_session_timeout` is the first name that long.
 */
function componentTexts(): string[] {
  const vocabulary: ReadonlySet<string> = new Set([...ERROR_CODES, ...SESSION_SETTINGS.map(([name]) => name)]);
  return CODE_FILES.flatMap((file) => stringLiterals(parseSource(file)).map((literal) => literal.text)).filter(
    (text) => text.length >= MINIMUM_TEXT && !vocabulary.has(text),
  );
}

describe("A138: src/deterministic-postgresql/ imports nothing else of src/", () => {
  it("finds the component's sources: its entry, its error type, the settings, the mapping, the rules, the catalog", () => {
    const names = COMPONENT_FILES.map((file) => relative(COMPONENT, file));
    expect(names).toEqual(
      expect.arrayContaining([
        "index.ts",
        "errors.ts",
        "settings.ts",
        "mapping.ts",
        "column-rules.ts",
        "catalog.ts",
        "block-transactions.ts",
        "opt-out.ts",
        "checks.ts",
      ]),
    );
    // The scan is not vacuous: the component's files name modules (each other, Node.js built-ins).
    expect(COMPONENT_FILES.flatMap((file) => moduleReferences(parseSource(file))).length).toBeGreaterThan(5);
    expect(OUTSIDE_FILES.some((file) => file.endsWith(join("src", "db", "postgres.ts")))).toBe(true);
  });

  it("names, in every file of the component, only modules of the component, Node.js built-ins and packages", () => {
    expect(COMPONENT_FILES.flatMap((file) => boundaryViolations(file))).toEqual([]);
  });

  it("fixture: every way of naming a module outside the component is caught, and nothing else is", () => {
    const file = join(COMPONENT, "fixture.ts");
    const text = [
      'import { UmbraError } from "../db/errors.js";',
      'import type { ReadHandle } from "../db/api.js";',
      'export * from "../determinism/cbor.js";',
      'export { contentsHash } from "../determinism/contents-hash.js";',
      'import api = require("../db/api.js");',
      'const later = await import("../db/pglite.js");',
      'const old = require("../postgres/client.js");',
      'type Handle = import("../db/api.js").ReadHandle;',
      'import { encodeRow } from "umbradb";',
      'import "../db";',
      "const dynamic = await import(name);",
      'import { mapRows } from "./mapping.js";',
      'import { createHash } from "node:crypto";',
      'import { PGlite } from "@electric-sql/pglite";',
    ].join("\n");
    const found = boundaryViolations(file, parseSource(file, text));
    expect(found.map((line) => Number(/:(\d+): /.exec(line)?.[1]))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});

describe("A138: the pinned settings, the column-type rules and the result mapping are defined nowhere else", () => {
  it("defines each of them in the component, in the file the design's table points to", () => {
    for (const [file, names] of Object.entries(DEFINITIONS)) {
      const exported = exportedDeclarations(parseSource(join(COMPONENT, file)));
      for (const name of names) expect(exported, `${name} in ${file}`).toContain(name);
    }
    expect(PINNED_SETTINGS.map(([name]) => name)).toEqual([
      "bytea_output",
      "DateStyle",
      "IntervalStyle",
      "TimeZone",
      "extra_float_digits",
    ]);
    expect(ZERO_TIMEOUTS.map(([name]) => name)).toEqual([
      "statement_timeout",
      "lock_timeout",
      "idle_in_transaction_session_timeout",
      "transaction_timeout",
      "idle_session_timeout",
    ]);
    expect(SESSION_SETTINGS).toEqual([...PINNED_SETTINGS, ...ZERO_TIMEOUTS]);
    expect(COLUMN_TYPE_RULES).toHaveLength(17); // the date-and-time row split in two [Q74]
    expect(Object.keys(TABLE_RULES)).toHaveLength(5);
    expect(RESULT_TYPES).toHaveLength(24);
  });

  it("declares none of the component's exported names anywhere else in src/", () => {
    const exported = componentExports();
    expect(exported.size).toBeGreaterThan(50);
    expect(redeclared(OUTSIDE_FILES, exported)).toEqual([]);
  });

  it("writes none of the session settings — pinned settings and zero timeouts — with its value anywhere else in src/", () => {
    // Not vacuous: the component's own settings file writes all ten.
    const own = settingsWritten(parseSource(join(COMPONENT, "settings.ts")), SESSION_SETTINGS);
    expect(new Set(own.map((found) => found.setting)).size).toBe(SESSION_SETTINGS.length);
    expect(SESSION_SETTINGS).toHaveLength(10);
    expect(settingsElsewhere(OUTSIDE_FILES)).toEqual([]);
  });

  it("writes DT-2's key collation, COLLATE \"C\", nowhere else in src/", () => {
    // Not vacuous: the component's rules write it (`keyOrderTerm`).
    expect(collationsWritten(join(COMPONENT, "column-rules.ts"))).not.toEqual([]);
    expect(OUTSIDE_FILES.flatMap((file) => collationsWritten(file))).toEqual([]);
  });

  it("defines none of the component's functions or values again anywhere else in src/, under whatever name", () => {
    const code = componentCode();
    expect(code.size).toBeGreaterThan(100);
    expect(copiedCode(OUTSIDE_FILES, code)).toEqual([]);
  });

  it("holds none of the component's texts anywhere else in src/", () => {
    const texts = componentTexts();
    expect(texts.length).toBeGreaterThan(100);
    expect(copiedTexts(OUTSIDE_FILES, texts)).toEqual([]);
  });

  it("leaves out of the component's texts its error codes and its settings' names only, which the rest of src/ names", () => {
    const all = CODE_FILES.flatMap((file) => stringLiterals(parseSource(file)).map((literal) => literal.text));
    const kept: ReadonlySet<string> = new Set(componentTexts());
    const left = all.filter((text) => text.length >= MINIMUM_TEXT && !kept.has(text));
    expect(left.length).toBeGreaterThan(0);
    const names: readonly string[] = SESSION_SETTINGS.map(([name]) => name);
    expect(left.every((text) => (ERROR_CODES as readonly string[]).includes(text) || names.includes(text))).toBe(true);
    // The one name that long, and a setting written with the component's value outside it is still caught.
    expect(left.filter((text) => names.includes(text))).toEqual(["idle_in_transaction_session_timeout"]);
    const file = join(SRC, "db", "fixture.ts");
    const written = parseSource(file, 'const sql = "SET idle_in_transaction_session_timeout = 0";');
    expect(settingsWritten(written, SESSION_SETTINGS).map((found) => found.setting)).toEqual([
      "idle_in_transaction_session_timeout = 0",
    ]);
  });

  it("fixture: a copy under another name is caught by each check", () => {
    const file = join(SRC, "db", "fixture.ts");
    const mappingSource = readFileSync(join(COMPONENT, "mapping.ts"), "utf8");
    // A function of the mapping copied under another name: its parameters and body are the component's.
    const body = /export function parseJsonLossless[\s\S]*?\n}\n/.exec(mappingSource)?.[0] as string;
    const money = COLUMN_TYPE_RULES.find((rule) => rule.id === "money");
    const text = [
      'const SESSION = [["bytea_output", "hex"], ["TimeZone", "UTC"]];',
      'const connection = { DateStyle: "ISO, MDY" };',
      'const params = ["-c", "IntervalStyle=postgres"];',
      'const sql = "SET extra_float_digits TO 1";',
      'const order = (name: string): string => `"${name}" COLLATE "C"`;',
      `const reason = ${JSON.stringify(money?.allowed === false && "reason" in money.because ? money.because.reason : "")};`,
      body.replace("export function parseJsonLossless", "function readJson"),
      // Names alone are no setting written: a URL check listing what it refuses.
      'const refused = ["bytea_output", "statement_timeout"];',
    ].join("\n");
    const parsed = parseSource(file, text);
    expect(settingsWritten(parsed, PINNED_SETTINGS).map((found) => found.setting)).toEqual([
      "bytea_output = hex",
      "TimeZone = UTC",
      "DateStyle = ISO, MDY",
      "IntervalStyle = postgres",
      "extra_float_digits = 1",
    ]);
    const code = componentCode();
    const copied = [...codeFingerprints(parsed, MINIMUM_CODE).keys()].filter((fingerprint) => code.has(fingerprint));
    // The copied reader itself, and the functions it holds.
    expect(copied.length).toBeGreaterThan(3);
    const texts = componentTexts();
    expect(stringLiterals(parsed).some(({ text: own }) => texts.includes(own))).toBe(true);
    expect(collationsWritten(file, text)).toHaveLength(1);
    // The same names declared again are caught by name.
    const renamed = parseSource(file, "export const PINNED_SETTINGS = [];\nfunction parameterText() {}");
    expect([...declaredNames(renamed).keys()].filter((name) => componentExports().has(name))).toEqual([
      "PINNED_SETTINGS",
      "parameterText",
    ]);
  });
});
