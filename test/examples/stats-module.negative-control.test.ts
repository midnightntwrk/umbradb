import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  exampleCopy,
  importProblems,
  type InstalledProject,
  installedProject,
  linesMissing,
  runNode,
  surfaceNames,
  typeCheck,
} from "./example-checks.js";

/**
 * Negative controls of `./stats-module.test.ts` (task 17.3a): each check fails on a copy of the example, or a
 * document, changed in the one way it guards against — so a passing check means the example still matches the code.
 */

describe("the example's checks fail on a changed copy (task 17.3a)", () => {
  let project: InstalledProject;

  beforeAll(async () => {
    project = await installedProject();
  }, 300_000);

  afterAll(() => project?.remove());

  it("the type check fails when the module imports a name src/index.ts does not export", async () => {
    const copy = exampleCopy((file, text) =>
      file === "stats-module.ts" ? text.replace("answerChainData, defineModule", "answerChainData, commandBuild, defineModule") : text,
    );
    try {
      const result = await typeCheck(`${copy.dir}/tsconfig.json`);
      expect(result.code).not.toBe(0);
      expect(result.output).toMatch(/TS2305|TS2724/);
      expect(result.output).toContain("commandBuild");
    } finally {
      copy.remove();
    }
  }, 120_000);

  it("umbradb config check fails when a setting breaks the module's schema", async () => {
    project.copyExample(["sql.ts", "stats-module.ts", "umbradb.config.ts"], (file, text) =>
      file === "umbradb.config.ts" ? text.replace("recentLimit: 5", "recentLimit: 500") : text,
    );
    const result = await runNode([project.command, "config", "check", "umbradb.config.ts"], project.dir);
    expect(result.code).toBe(1);
    expect(result.output).toContain("recentLimit");
  }, 120_000);

  it("the documents' check names an import from a dist/ path and a name the surface lacks", () => {
    const text = [
      "```ts",
      'import { defineModule } from "../../dist/modules/declaration.js";',
      'import { commandBuild, type ReadHandle } from "umbradb";',
      "```",
    ].join("\n");
    expect(importProblems([{ file: "doc.md", text }], surfaceNames())).toEqual([
      "doc.md:2: imports from ../../dist/modules/declaration.js",
      "doc.md:2: imports commandBuild, which src/index.ts does not export",
    ]);
  }, 60_000);

  it("the walk-through check names a guide line the example does not hold", () => {
    const block = { language: "ts", line: 10, text: 'id: "stats-module",\nversion: "2.0.0",' };
    expect(linesMissing([block], ['  id: "stats-module",\n  version: "1.0.0",'])).toEqual(['line 11: version: "2.0.0",']);
  });
});
