import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { boundaryOf, boundarySources, hostWith, REPOSITORY } from "./resolver-boundary.js";

/**
 * L56 `[STATIC][NEG]`: no module outside `src/runner/resolve.ts` calls `commandBuild`, `buildDeclarations`,
 * `inferSide`, `validateConfig` or `processCoreEntry`, and none outside the engine (`src/runner/process.ts`) calls
 * `planNetwork` — over every non-test source the repository compiles (`./resolver-boundary.ts`). The negative control
 * adds such calls to a fixture copy of `src/cli/backup.ts` (the repository's file is left as it is), in each form a
 * module could take one, and sees each reported, while a comment, a string and a type position are not. [L56, LM-1]
 *
 * `buildDeclarations` was removed with the resolver: a guard whose function no source declares guards nothing, and the
 * test names which guards the sources declare. `planNetwork` is declared in the resolver and called by the engine
 * only.
 */

// Building the program over every source takes a few seconds; on a loaded machine, more.
const TIMEOUT_MS = 120_000;

const { files, options } = boundarySources();
const BACKUP = join(REPOSITORY, "src/cli/backup.ts");

/** The forms a module could take a guarded function in, appended to `src/cli/backup.ts` (see the module comment). */
const FORBIDDEN = [
  'import { validateConfig } from "../config/validate.js";',
  'import { processCoreEntry as chooseCore } from "../config/process.js";',
  'import * as build from "./build-modules.js";',
  'import * as resolver from "../runner/resolve.js";',
  "export const leakedValidation = (input: Parameters<typeof validateConfig>[0]) => validateConfig(input);",
  "export const leakedCore = chooseCore;",
  "export const leakedBuild = () => build.commandBuild([]);",
  'export const leakedSide = (data: unknown) => resolver["inferSide"](data);',
  "export const leakedList = [{ validateConfig }];",
  'export const leakedPlan = (input: Parameters<typeof resolver.planNetwork>[0]) => resolver.planNetwork(input, "configured");',
  "// validateConfig(input) in a comment calls nothing, nor does the string below.",
  'export const named = "processCoreEntry";',
];

describe("L56: the resolver's boundary over the repository's sources", () => {
  it("reads every non-test source: src/, browser/, bench/, tools/", () => {
    const relative = files.map((file) => file.slice(REPOSITORY.length));
    for (const expected of ["src/cli/backup.ts", "src/runner/resolve.ts", "browser/src/process-worker.ts", "bench/core.ts"]) {
      expect(relative).toContain(expected);
    }
    expect(relative.some((file) => file.startsWith("tools/"))).toBe(true);
    expect(relative.some((file) => file.startsWith("test/"))).toBe(false);
  });

  it("no module but the resolver calls its steps, and none but the engine plans the network", () => {
    const boundary = boundaryOf(files, options);
    expect(boundary.guarded).toEqual(["commandBuild", "inferSide", "planNetwork", "processCoreEntry", "validateConfig"]);
    expect(boundary.crossings).toEqual([]);
  }, TIMEOUT_MS);

  it("negative control: each form of such a call added to src/cli/backup.ts (a fixture copy) is reported", () => {
    const original = readFileSync(BACKUP, "utf8");
    const first = original.split("\n").length + 1;
    const text = `${original}\n${FORBIDDEN.join("\n")}\n`;
    const boundary = boundaryOf(files, options, hostWith(options, BACKUP, text));
    const line = (form: string) => first + FORBIDDEN.indexOf(form);
    expect(boundary.crossings).toEqual([
      `src/cli/backup.ts:${line(FORBIDDEN[4] as string)}: validateConfig`,
      `src/cli/backup.ts:${line(FORBIDDEN[5] as string)}: processCoreEntry`,
      `src/cli/backup.ts:${line(FORBIDDEN[6] as string)}: commandBuild`,
      `src/cli/backup.ts:${line(FORBIDDEN[7] as string)}: inferSide`,
      `src/cli/backup.ts:${line(FORBIDDEN[8] as string)}: validateConfig`,
      `src/cli/backup.ts:${line(FORBIDDEN[9] as string)}: planNetwork`,
    ]);
    // The repository's own file is unchanged: the fixture copy is the compiler host's only.
    expect(readFileSync(BACKUP, "utf8")).toBe(original);
  }, TIMEOUT_MS);

  it("the same calls in the resolver itself are its own: nothing is reported", () => {
    const file = join(REPOSITORY, "src/runner/resolve.ts");
    const original = readFileSync(file, "utf8");
    const own = [
      'import * as ownBuild from "../cli/build-modules.js";',
      "export const ownCall = () => validateConfig === processCoreEntry || ownBuild.commandBuild([]) === null;",
    ];
    const boundary = boundaryOf(files, options, hostWith(options, file, `${original}\n${own.join("\n")}\n`));
    expect(boundary.crossings).toEqual([]);
  }, TIMEOUT_MS);
});
