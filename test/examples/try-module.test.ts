import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { type CodeBlock, codeBlocks, importsOf, REPOSITORY, section, typeCheck } from "./example-checks.js";

/**
 * The module guide's "trying a module" recipe is `examples/try-module/try-module.ts` itself, the module test that
 * the pack smoke runs from the installed package (`test/smoke/pack-install.mjs`): the guide's code block is the
 * file, line for line, and it starts UmbraDB with `startUmbraDB`. The file type-checks against `src/index.ts` (as
 * `npm run typecheck` checks it too).
 */

const FIXTURE = join(REPOSITORY, "examples", "try-module", "try-module.ts");
const read = (file: string): string => readFileSync(join(REPOSITORY, file), "utf8");

/** The problems of the guide's §17: no TypeScript block that is `fixture`'s text, or a block not using startUmbraDB. */
function recipeProblems(guide: string, fixture: string): string[] {
  const blocks: CodeBlock[] = codeBlocks(section(guide, "17. ")).filter(({ language }) => language === "ts");
  const recipe = blocks.find(({ text }) => text.trim() === fixture.trim());
  if (recipe === undefined) {
    return ["docs/module-guide.md §17 has no ts code block equal to examples/try-module/try-module.ts (L59)"];
  }
  const fromPackage = importsOf(recipe.text).filter(({ from }) => from === "umbradb").flatMap(({ names }) => names);
  return fromPackage.includes("startUmbraDB") ? [] : ["the §17 recipe does not import startUmbraDB from umbradb (L59)"];
}

describe("the module guide's recipe is the module test", () => {
  it("examples/try-module type-checks against src/index.ts", async () => {
    const result = await typeCheck(join(REPOSITORY, "examples", "try-module", "tsconfig.json"));
    expect(result.output).toBe("");
    expect(result.code).toBe(0);
  }, 120_000);

  it("§17 shows examples/try-module/try-module.ts verbatim, starting UmbraDB with startUmbraDB", () => {
    expect(recipeProblems(read("docs/module-guide.md"), readFileSync(FIXTURE, "utf8"))).toEqual([]);
  });

  describe("negative controls", () => {
    const fixture = readFileSync(FIXTURE, "utf8");
    const guide = (block: string) => ["# Guide", "", "## 17. Trying a module", "", "```ts", block, "```", "", "## 18. Next"].join("\n");

    it("passes the file as the block; fails a block with one line changed, and no block", () => {
      expect(recipeProblems(guide(fixture.trimEnd()), fixture)).toEqual([]);
      const changed = fixture.replace("head: 10n", "head: 11n");
      expect(changed).not.toBe(fixture);
      expect(recipeProblems(guide(changed.trimEnd()), fixture)).toEqual([
        "docs/module-guide.md §17 has no ts code block equal to examples/try-module/try-module.ts (L59)",
      ]);
      expect(recipeProblems("# Guide\n\n## 17. Trying a module\n\nNone.\n", fixture)).toHaveLength(1);
    });

    it("fails a recipe in another section, and one that does not import startUmbraDB", () => {
      expect(recipeProblems(guide(fixture.trimEnd()).replace("## 17.", "## 16."), fixture)).toHaveLength(1);
      const other = 'import { defineModule } from "umbradb";\n';
      expect(recipeProblems(guide(other.trimEnd()), other)).toEqual([
        "the §17 recipe does not import startUmbraDB from umbradb (L59)",
      ]);
    });
  });
});
