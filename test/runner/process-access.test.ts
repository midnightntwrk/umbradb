import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { ALLOWED, checked, processAccesses } from "./process-access.js";
import { boundarySources, hostWith, REPOSITORY } from "./resolver-boundary.js";

/**
 * Under `src/`, outside `src/cli/` and `src/library/start-umbradb.ts`, no module reads the global
 * `process` but as `./process-access.ts`'s allowed reads let it, and none calls `path.resolve` with one argument
 * (which reads the working directory); `loadConfig` takes its `cwd` with no default. The negative control appends to a
 * fixture copy of `src/runner/loop.ts` (the file on disk is untouched) each forbidden form — the global `process`,
 * `globalThis.process`, `global.process`, `globalThis["process"]`, `(globalThis as T).process`, a one-argument
 * `path.resolve` under two names — and sees each reported, while a local binding named `process`, a comment, a string,
 * a type position and an allowed read in its own file are not.
 */

// Building the program over every source takes a few seconds; on a loaded machine, more.
const TIMEOUT_MS = 120_000;

const { files, options } = boundarySources();
const LOOP = join(REPOSITORY, "src/runner/loop.ts");

/** The forbidden forms, appended to `src/runner/loop.ts` (see the module comment). */
const FORBIDDEN = [
  'import { resolve as absolute } from "node:path";',
  'import * as nodePath from "node:path";',
  "export const leakedCwd = () => process.cwd();",
  "export const leakedGlobal = () => globalThis.process;",
  "export const leakedNode = () => global.process;",
  'export const leakedElement = () => globalThis["process"];',
  "export const leakedCast = () => (globalThis as { readonly process?: unknown }).process;",
  'export const leakedResolve = () => absolute("data");',
  'export const leakedNamespace = () => nodePath.resolve("data");',
  "export const leakedShorthand = () => ({ process });",
];

/** Forms that are no access, appended after them. */
const ALLOWED_FORMS = [
  "export const local = (process: { readonly settings: unknown }) => process.settings;",
  "// process.exit(1) in a comment reads nothing, nor does the string below.",
  'export const named = "process.env";',
  "export type Kind = typeof process;",
  'export const based = (base: string) => absolute(base, "data");',
];

describe("the process-access check over src/", () => {
  it("reads src/ outside src/cli/ and the Node entry", () => {
    expect(checked("src/runner/process.ts")).toBe(true);
    expect(checked("src/library/options.ts")).toBe(true);
    expect(checked("src/cli/run.ts")).toBe(false);
    expect(checked("src/library/start-umbradb.ts")).toBe(false);
    expect(checked("browser/src/process-worker.ts")).toBe(false);
    expect(ALLOWED.map((read) => `${read.file}: ${read.property}`)).toEqual([
      "src/runner/heartbeat.ts: hrtime",
      "src/admin/process-admin.ts: hrtime",
      "src/admin/serve.ts: hrtime",
      "src/backup/backup.ts: pid",
      "src/backup/backup.ts: env",
      "src/db/pglite-lock.ts: emitWarning",
    ]);
  });

  it("no module reads the global process but as G10 lets it, nor resolves a path against the working directory", () => {
    expect(processAccesses(files, options)).toEqual([]);
  }, TIMEOUT_MS);

  it("loadConfig takes its working directory with no default", () => {
    const source = ts.createSourceFile("load.ts", readFileSync(join(REPOSITORY, "src/config/load.ts"), "utf8"), ts.ScriptTarget.Latest, true);
    const load = source.statements.find(
      (statement): statement is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(statement) && statement.name.text === "LoadOptions",
    );
    const cwd = load?.members.find((member) => member.name !== undefined && ts.isIdentifier(member.name) && member.name.text === "cwd");
    expect(cwd).toBeDefined();
    expect((cwd as ts.PropertySignature).questionToken).toBeUndefined();
  });

  it("negative control: each forbidden form added to src/runner/loop.ts (a fixture copy) is reported, and no other", () => {
    const original = readFileSync(LOOP, "utf8");
    const first = original.split("\n").length + 1;
    const text = `${original}\n${[...FORBIDDEN, ...ALLOWED_FORMS].join("\n")}\n`;
    const accesses = processAccesses(files, options, hostWith(options, LOOP, text));
    const line = (form: string) => first + FORBIDDEN.indexOf(form);
    expect(accesses).toEqual([
      `src/runner/loop.ts:${line(FORBIDDEN[2] as string)}: process.cwd`,
      `src/runner/loop.ts:${line(FORBIDDEN[3] as string)}: globalThis.process`,
      `src/runner/loop.ts:${line(FORBIDDEN[4] as string)}: global.process`,
      `src/runner/loop.ts:${line(FORBIDDEN[5] as string)}: globalThis.process`,
      `src/runner/loop.ts:${line(FORBIDDEN[6] as string)}: globalThis.process`,
      `src/runner/loop.ts:${line(FORBIDDEN[7] as string)}: path.resolve(1 argument)`,
      `src/runner/loop.ts:${line(FORBIDDEN[8] as string)}: path.resolve(1 argument)`,
      `src/runner/loop.ts:${line(FORBIDDEN[9] as string)}: process`,
    ]);
  }, TIMEOUT_MS);

  it("negative control: an allowed read is allowed in its own file only", () => {
    const original = readFileSync(LOOP, "utf8");
    const first = original.split("\n").length + 1;
    const text = `${original}\nexport const clock = () => process.hrtime.bigint();\n`;
    expect(processAccesses(files, options, hostWith(options, LOOP, text))).toEqual([`src/runner/loop.ts:${first}: process.hrtime`]);
  }, TIMEOUT_MS);
});
