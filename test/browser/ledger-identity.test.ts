import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkLedgerPackage, checkLedgerPackages } from "../../browser/src/ledger/identity.js";
import { SUBSTITUTES } from "../../browser/build.js";

/**
 * The browser build's startup check of the vendored ledger packages: `browser/src/ledger/identity.ts`, bundled in place
 * of `src/ledger/identity.ts` (which reads files), so the process and the ledger worker call the same functions as in
 * Node.js. It refuses `ledgerSources: released` as Node.js's check does, naming the setting; it reads no file — the
 * build checked every package file it bundles (`browser/build.ts`), and the ledger worker checks the WebAssembly it
 * fetches (`browser/src/ledger/instantiate.ts`). [LG-5, A173; design §5.2, §9.2]
 */

describe("the browser's startup check of the ledger packages (task 12.2b)", () => {
  it("is the build's replacement of src/ledger/identity.ts", () => {
    expect(SUBSTITUTES["src/ledger/identity.ts"]).toBe("browser/src/ledger/identity.ts");
  });

  it("refuses ledgerSources released for a version the build carries, naming the setting; v10 is not read", () => {
    for (const ledger of ["v8", "v9-rc3", "v9"] as const) {
      let refusal: unknown;
      try {
        checkLedgerPackages({ sources: { [ledger]: "released" } });
      } catch (error) {
        refusal = error;
      }
      expect(refusal, ledger).toMatchObject({
        code: "invalid-configuration",
        details: { reason: "ledger-source-unavailable", ledger, source: "released" },
      });
      expect((refusal as Error).message).toContain(`ledgerSources.${ledger} is released`);
    }
    expect(() => checkLedgerPackages({ sources: { v8: "vendored", "v9-rc3": "vendored", v9: "vendored", v10: "released" } })).not.toThrow();
  });

  it("reads no file: a directory without packages passes", () => {
    const empty = mkdtempSync(join(tmpdir(), "umbradb-12.2b-browser-"));
    try {
      expect(() => checkLedgerPackages({ root: empty })).not.toThrow();
      for (const ledger of ["v8", "v9-rc3", "v9"] as const) expect(() => checkLedgerPackage(ledger, { root: empty })).not.toThrow();
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  });
});
