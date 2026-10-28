import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { checkedLedgers } from "../../browser/build.js";
import { copyVendoredLedger, VENDORED_ROOT } from "../ledger/version-checks.js";

/**
 * Task 17.5b (the mutation pass task 12.2b deferred): the browser build's reading of the vendored ledger packages
 * (`checkedLedgers`, `browser/build.ts`) on its own — the manifest as the build records it, the `.wasm` files it lists,
 * a file's bytes once their SHA-256 is its line's, and the refusals: a file the manifest does not list, a version the
 * build does not carry, a changed file. The bundle itself is `build.test.ts`' and the Chrome tests'.
 */

const sha = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");
const copy = copyVendoredLedger();
afterAll(() => copy.remove());

describe("checkedLedgers (task 17.5b)", () => {
  it("gives each version's manifest as recorded, its .wasm files, and a listed file's bytes", async () => {
    const ledgers = await checkedLedgers(VENDORED_ROOT);
    for (const version of ["v8", "v9-rc3", "v9"]) {
      expect(ledgers.manifest(version), version).toBe(readFileSync(join(VENDORED_ROOT, version, "SHA256SUMS"), "utf8"));
      const wasm = ledgers.wasm(version);
      expect(wasm.length, version).toBe(1);
      expect(wasm[0], version).toMatch(/^pkg\/[^/]+\.wasm$/);
    }
    const file = "pkg/midnight_ledger_wasm_v9_fs.js";
    expect(ledgers.read("v9", file).equals(readFileSync(join(VENDORED_ROOT, "v9", file)))).toBe(true);
    expect(`${sha(ledgers.read("v9", file))}  ${file}\n`).toBe(ledgers.manifest("v9").split(/(?<=\n)/).find((line) => line.endsWith(`  ${file}\n`)));
  });

  it("refuses a file the manifest does not list, a version the build does not carry, and a changed file", async () => {
    const ledgers = await checkedLedgers(VENDORED_ROOT);
    expect(() => ledgers.read("v9", "pkg/not-listed.js")).toThrow(
      "vendor/ledger/v9/pkg/not-listed.js is bundled, and its SHA256SUMS does not list it",
    );
    expect(() => ledgers.manifest("v10")).toThrow("the browser build carries no vendored ledger v10");
    expect(() => ledgers.wasm("v10")).toThrow("the browser build carries no vendored ledger v10");
    const changed = await checkedLedgers(copy.root);
    const file = "pkg/midnight_ledger_wasm_v9_fs.js";
    const { writeFileSync } = await import("node:fs");
    writeFileSync(join(copy.root, "v9", file), "changed");
    expect(() => changed.read("v9", file)).toThrow(/package-hash-mismatch|has SHA-256/);
  });
});
