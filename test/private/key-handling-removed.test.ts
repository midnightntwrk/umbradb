import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { described, keyLeftovers, scannedFiles } from "./key-handling-checks.js";

/**
 * `[STATIC]` Key handling has left the core: no file of the removed parts exists, and no name of them is left in the
 * code, the tests or the module guide (`./key-handling-checks.ts` says what is read and looked for). The committed negative control, a key part left in place, is
 * `./key-handling-removed.negative-control.test.ts`'s.
 */

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

describe("key handling is a module's, not the core's", () => {
  it("leaves no file and no name of core-key-registry, on-key, testKeys, keyKinds, validateKey or test-key-conflict", () => {
    // What the check reads: the code and the documents, not a sample.
    const files = scannedFiles(ROOT);
    expect(files).toEqual(
      expect.arrayContaining([
        "src/modules/declaration.ts",
        "src/runner/loop.ts",
        "src/config/validate.ts",
        "browser/build.ts",
        "docs/module-guide.md",
      ]),
    );
    expect(files.length).toBeGreaterThan(500);
    expect(keyLeftovers(ROOT).map(described)).toEqual([]);
  });
});
