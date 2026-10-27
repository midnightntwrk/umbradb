import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { described, keyLeftovers, scannedFiles } from "./key-handling-checks.js";

/**
 * Task 14.4a `[STATIC]` (owner decision Q154 A2; `openspec/changes/core-arch/tasks.md` 14.4a): key handling has left
 * the core — no file of the removed parts exists, and no name of them is left in the code, the tests, the module guide
 * or the change's design (`./key-handling-checks.ts` says what is read and looked for). The committed negative control,
 * a key part left in place, is `./key-handling-removed.negative-control.test.ts`'s.
 */

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

describe("task 14.4a: key handling is a module's, not the core's (Q154 A2)", () => {
  it("leaves no file and no name of core-key-registry, on-key, testKeys, keyKinds, validateKey or test-key-conflict", () => {
    // What the check reads: the code and the documents, not a sample.
    const files = scannedFiles(ROOT);
    expect(files).toEqual(
      expect.arrayContaining([
        "src/modules/declaration.ts",
        "src/runner/loop.ts",
        "src/config/validate.ts",
        "browser/build.ts",
        "test/runner/code-registry.ts",
        "docs/module-guide.md",
        "openspec/changes/core-arch/design.md",
      ]),
    );
    expect(files.length).toBeGreaterThan(500);
    expect(keyLeftovers(ROOT).map(described)).toEqual([]);
  });
});
