import { describe, expect, it } from "vitest";
import {
  BUILD_FILE, changelogProblems, NOTICE_HEADING, RELEASE_VERSION, scanDeclarations, type SourceText, stringConstants,
  versionLiteralProblems,
} from "./release-version.js";

/**
 * Task 17.5b (the mutation pass task 17.4 deferred): `./release-version.ts`'s scan on small sources — the import forms
 * `versionBindings` must skip (a bare specifier, a side-effect import, a default or namespace import, another name of
 * `build.ts`), `build.ts`'s own binding, a name an anonymous function cannot hide, constants given twice, sides that
 * are not literals, the version constant's own declaration — and `changelogProblems`' section and notice bounds.
 */

const FILE = "src/backbone/core-x/core-x.ts";
const at = (text: string, file = FILE): SourceText => ({ file, text });
const scan = (text: string, file = FILE) => scanDeclarations(at(text, file), stringConstants([at(text, file)])).problems;
const rule = "not the build's UMBRADB_VERSION imported from src/config/build.ts (task 17.4)";
const BODY = 'export const X = { id: "core-x", version: UMBRADB_VERSION, side: "public" };';

describe("release-version.ts's scan, form by form (task 17.5b)", () => {
  it("binds only a named value import of UMBRADB_VERSION from build.ts by a relative path", () => {
    const refused = [`${FILE}:2: core-x declares version UMBRADB_VERSION, ${rule}`];
    // A bare specifier that would join to build.ts's path from the root is a package, not the file.
    expect(scan(`import { UMBRADB_VERSION } from "src/config/build.js";\n${BODY}`, "main.ts")).toEqual([
      `main.ts:2: core-x declares version UMBRADB_VERSION, ${rule}`,
    ]);
    expect(scan(`import { UMBRADB_VERSION } from "./src/config/build.js";\n${BODY}`, "main.ts")).toEqual([]);
    // A side-effect import, a default import and a namespace import bind no name.
    expect(scan(`import "../../config/build.js";\n${BODY}`)).toEqual(refused);
    expect(scan(`import UMBRADB_VERSION from "../../config/build.js";\n${BODY}`)).toEqual(refused);
    expect(scan(`import * as UMBRADB_VERSION from "../../config/build.js";\n${BODY}`)).toEqual(refused);
    // Another export of build.ts is not the version, under its own name or the version's.
    expect(scan(`import { OTHER } from "../../config/build.js";\n${BODY.replace("version: UMBRADB_VERSION", "version: OTHER")}`))
      .toEqual([`${FILE}:2: core-x declares version OTHER, ${rule}`]);
    expect(scan(`import { OTHER as UMBRADB_VERSION } from "../../config/build.js";\n${BODY}`)).toEqual(refused);
    expect(scan(`import { type UMBRADB_VERSION } from "../../config/build.js";\n${BODY}`)).toEqual(refused);
    expect(scan(`import { UMBRADB_VERSION } from "../../config/build.js";\n${BODY}`)).toEqual([]);
  });

  it("lets build.ts use its own constant, and reads a declaration there like any other", () => {
    const own = `export const UMBRADB_VERSION = "0.10.0";\n${BODY}`;
    expect(scan(own, BUILD_FILE)).toEqual([]);
    expect(scan(own.replace("version: UMBRADB_VERSION", "version: OTHER"), BUILD_FILE)).toEqual([
      `${BUILD_FILE}:2: core-x declares version OTHER, ${rule}`,
    ]);
  });

  it("does not stop at an anonymous function or class while it looks for a name hiding the version", () => {
    const text = `import { UMBRADB_VERSION } from "../../config/build.js";\n${BODY}\n` +
      "export default function () {\n  return 1;\n}\nexport const C = class {};";
    expect(scan(text)).toEqual([]);
  });

  it("reads string constants by name at any depth, a name given two values as null, and nothing else", () => {
    const constants = stringConstants([
      at('const A = "a";\nfunction f() {\n  const B = `b`;\n  const { C } = o;\n  let D;\n  const E = 1;\n}'),
      at('const A = "a";\nconst F = "f";\nconst F2 = F;', "src/y.ts"),
      at('const F = "g";', "src/z.ts"),
    ]);
    expect(Object.fromEntries(constants)).toEqual({ A: "a", B: "b", F: null });
    // A property, a parameter's default and a class field are no constants.
    const others = 'const o = { P: "p" };\nfunction g(Q = "q") {}\nclass K {\n  R = "r";\n}\nconst { S = "s" } = o;';
    expect(Object.fromEntries(stringConstants([at(others)]))).toEqual({});
  });

  it("finds a declaration by a literal side only, and reads its id through a constant", () => {
    const declared = (side: string) =>
      `import { UMBRADB_VERSION } from "../../config/build.js";\nconst ID = "core-x";\n` +
      `export const X = { id: ID, version: "1", side: ${side} };`;
    expect(scan(declared('"public"'))).toEqual([`${FILE}:3: core-x declares version "1", ${rule}`]);
    expect(scan(declared("`private`"))).toEqual([`${FILE}:3: core-x declares version "1", ${rule}`]);
    expect(scan(declared('"both"'))).toEqual([]);
    expect(scan(declared("SIDE"))).toEqual([]);
    expect(scan(declared("sideOf()"))).toEqual([]);
  });

  it("looks for a hidden version only in a file that imports it, and not in build.ts", () => {
    expect(scan('function f(UMBRADB_VERSION) {\n  return UMBRADB_VERSION;\n}')).toEqual([]);
    expect(scan(`export const UMBRADB_VERSION = "0.10.0";\nfunction f(UMBRADB_VERSION) {}`, BUILD_FILE)).toEqual([]);
    const imported = 'import { UMBRADB_VERSION as V } from "../../config/build.js";\nfunction f(V) {}';
    expect(scan(imported)).toEqual([`${FILE}:2: declares its own V, hiding the build's version`]);
  });

  it("counts build.ts's constant once, only as its own UMBRADB_VERSION's initial value", () => {
    expect(versionLiteralProblems([at('export const OTHER = "0.10.0";', BUILD_FILE)], "0.10.0")).toEqual([
      `${BUILD_FILE}:1: writes the build's version "0.10.0" (task 17.4)`,
      `${BUILD_FILE}'s UMBRADB_VERSION is [], not package.json's "0.10.0" once (task 17.4)`,
    ]);
    expect(versionLiteralProblems([at('export const UMBRADB_VERSION = "0.10.0";', "src/config/other.ts")], "0.10.0"))
      .toEqual([
        `src/config/other.ts:1: writes the build's version "0.10.0" (task 17.4)`,
        `${BUILD_FILE}'s UMBRADB_VERSION is [], not package.json's "0.10.0" once (task 17.4)`,
      ]);
    expect(versionLiteralProblems([at('let UMBRADB_VERSION;\nUMBRADB_VERSION = "0.10.0";', BUILD_FILE)], "0.10.0"))
      .toEqual([
        `${BUILD_FILE}:2: writes the build's version "0.10.0" (task 17.4)`,
        `${BUILD_FILE}'s UMBRADB_VERSION is [], not package.json's "0.10.0" once (task 17.4)`,
      ]);
    expect(versionLiteralProblems([at('export const UMBRADB_VERSION = "0.10.0", B = "0.10.0";', BUILD_FILE)], "0.10.0"))
      .toEqual([`${BUILD_FILE}:1: writes the build's version "0.10.0" (task 17.4)`]);
    const twice = at('export const UMBRADB_VERSION = "0.10.0";\nfunction f() {\n  const UMBRADB_VERSION = "0.10.0";\n}', BUILD_FILE);
    expect(versionLiteralProblems([twice], "0.10.0")).toEqual([
      `${BUILD_FILE}'s UMBRADB_VERSION is ["0.10.0","0.10.0"], not package.json's "0.10.0" once (task 17.4)`,
    ]);
  });
});

describe("changelogProblems' bounds (task 17.5b)", () => {
  const LINE = "UmbraDB 0.10.0 is a new architecture: nothing of 0.9.5's API or databases is carried over.";
  const problems = (text: string) => changelogProblems(text, RELEASE_VERSION, ["PgTemporalKV"]);

  it("takes the section as the first one with its heading at a line's start, up to the next level-2 heading", () => {
    // The version's section first in the file, and last: no heading after it.
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n${LINE}`)).toEqual([]);
    expect(problems(`# Changelog\n\n## [0.10.0]\n\n${NOTICE_HEADING}\n\n${LINE}\n\n- \`PgTemporalKV\``)).toEqual([
      "the 0.10.0 notice is 2 lines, not one (A4)",
      "the 0.10.0 notice is a list, not one line (A4)",
      "the 0.10.0 section names 0.9.5's export `PgTemporalKV`: no per-export list (A4)",
    ]);
    // An older section after it holds its own names.
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n${LINE}\n## [0.9.5]\n- \`PgTemporalKV\``)).toEqual([]);
    // The heading's text inside a line is no heading.
    expect(problems(`text ## [0.10.0]\n${NOTICE_HEADING}\n${LINE}`)).toEqual([
      "CHANGELOG.md has no 0.10.0 section (## [0.10.0] …; A4)",
    ]);
  });

  it("opens the notice at its first line, blank lines aside, and ends it at the next level-3 heading", () => {
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n${LINE}\n### Added\n- more\n- lines`)).toEqual([]);
    expect(problems(`## [0.10.0]\n  \n${NOTICE_HEADING}\n${LINE}`)).toEqual([]);
    expect(problems(`## [0.10.0]\n ${NOTICE_HEADING}\n${LINE}`)).toEqual([
      `CHANGELOG.md's 0.10.0 section does not open with "${NOTICE_HEADING}" (A4, LS-4)`,
    ]);
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n   \n${LINE}\n  `)).toEqual([]);
  });

  it("reads a list item by its marker after spaces only, and the length up to 120 characters inclusive", () => {
    const one = (line: string) => problems(`## [0.10.0]\n${NOTICE_HEADING}\n${line}`);
    expect(one(`  * ${LINE}`)).toEqual(["the 0.10.0 notice is a list, not one line (A4)"]);
    expect(one(`12) ${LINE}`)).toEqual(["the 0.10.0 notice is a list, not one line (A4)"]);
    expect(one(`1. ${LINE}`)).toEqual(["the 0.10.0 notice is a list, not one line (A4)"]);
    expect(one(`x- ${LINE}`)).toEqual([]);
    expect(one(`1x ${LINE}`)).toEqual([]);
    expect(one(`1.${LINE}`)).toEqual([]);
    const padded = (length: number) => `${LINE}${" ".repeat(length - LINE.length - 1)}.`;
    expect(one(padded(120))).toEqual([]);
    expect(one(padded(121))).toEqual(["the 0.10.0 notice is longer than 120 characters (A4)"]);
  });

  it("reads the notice's terms within its lines, not across them", () => {
    const text = `## [0.10.0]\n${NOTICE_HEADING}\nUmbraDB 0.10.0 is a new\narchitecture: nothing of 0.9.5's API or databases.`;
    expect(problems(text)).toEqual(["the 0.10.0 notice is 2 lines, not one (A4)"]);
  });

  it("finds a name across lines of the section only as written in backticks", () => {
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n${LINE}\n### Removed\n\`PgTemporal\nKV\``)).toEqual([]);
    const text = `## [0.10.0]\n${NOTICE_HEADING}\n${LINE}\n### Removed\nThe \`PgTemporalKV\`\nPgTemporalKV`;
    expect(problems(text)).toEqual(["the 0.10.0 section names 0.9.5's export `PgTemporalKV`: no per-export list (A4)"]);
    expect(problems(`## [0.10.0]\n${NOTICE_HEADING}\n${LINE}\n### Removed\n\`Pg\`\n\`TemporalKV\``)).toEqual([]);
  });
});
