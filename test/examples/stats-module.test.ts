import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  codeBlocks,
  EXAMPLE,
  importProblems,
  type InstalledProject,
  installedProject,
  linesMissing,
  REPOSITORY,
  runNode,
  section,
  surfaceNames,
  typeCheck,
} from "./example-checks.js";

/**
 * Task 17.3a's acceptance (owner decisions Q160 A, Q161 A): the module guide's example, `examples/stats-module/`,
 * type-checks against `src/index.ts`, and `umbradb config check` passes on its configuration file; the guide's and the
 * README's code import only the package's surface, and the guide's walk-through (§2) is the example's code.
 * `./stats-module.negative-control.test.ts` shows each check failing on a changed copy.
 */

const read = (file: string): string => readFileSync(join(REPOSITORY, file), "utf8");

describe("examples/stats-module (task 17.3a)", () => {
  let project: InstalledProject;

  beforeAll(async () => {
    project = await installedProject();
    project.copyExample(["stats-module.ts", "umbradb.config.ts"]);
  }, 300_000);

  afterAll(() => project?.remove());

  it("type-checks against src/index.ts", async () => {
    const result = await typeCheck(join(EXAMPLE, "tsconfig.json"));
    expect(result.output).toBe("");
    expect(result.code).toBe(0);
  }, 120_000);

  it("passes umbradb config check on its configuration file, as an installed project runs it", async () => {
    const result = await runNode([project.command, "config", "check", "umbradb.config.ts"], project.dir);
    expect(result.output).toContain("passed: every check that ran passed");
    expect(result.code).toBe(0);
  }, 120_000);
});

describe("the documents' code (task 17.3a, Q161 A)", () => {
  const documents = ["docs/module-guide.md", "README.md"].map((file) => ({ file, text: read(file) }));

  it("imports only from umbradb, zod, Node.js and the example's module, and only names src/index.ts exports", () => {
    expect(importProblems(documents, surfaceNames())).toEqual([]);
  }, 60_000);

  it("shows in the guide's §2 the example's own lines", () => {
    const guide = read("docs/module-guide.md");
    const walkthrough = codeBlocks(section(guide, "2. ")).filter(({ language }) => language === "ts");
    expect(walkthrough.length).toBeGreaterThanOrEqual(5);
    const files = ["stats-module.ts", "umbradb.config.ts"].map((file) => readFileSync(join(EXAMPLE, file), "utf8"));
    expect(linesMissing(walkthrough, files)).toEqual([]);
  });
});
