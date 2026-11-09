import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { hasColor, tokenColor } from "../../../src/features/token-metadata/color.ts";
import * as v8 from "../../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import * as v9rc3 from "../../../vendor/ledger/v9-rc3/pkg/midnight_ledger_wasm_v9_fs.js";

/**
 * A token's color, computed without the ledger, equals `rawTokenType` of each vendored ledger
 * package (v8, v9-rc3, v9) for generated domain separators and contracts; only kinds 1 and 2 have one.
 */

const PACKAGES = [
  ["v8", v8.rawTokenType],
  ["v9-rc3", v9rc3.rawTokenType],
  ["v9", v9.rawTokenType],
] as const;

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe("token colors", () => {
  for (const [label, rawTokenType] of PACKAGES) {
    it(`equal ${label}'s rawTokenType`, () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 32, maxLength: 32 }), fc.uint8Array({ minLength: 32, maxLength: 32 }), (domainSep, contract) => {
          expect(hex(tokenColor(domainSep, contract))).toBe(String(rawTokenType(domainSep, hex(contract))).toLowerCase());
        }),
        { seed: 18_0012, numRuns: 200 },
      );
    });
  }

  it("negative control: swapping the domain separator and the contract gives another color", () => {
    const domainSep = new Uint8Array(32).fill(1);
    const contract = new Uint8Array(32).fill(2);
    expect(hex(tokenColor(contract, domainSep))).not.toBe(String(v9.rawTokenType(domainSep, hex(contract))).toLowerCase());
  });

  it("only kinds 1 and 2 have a color; other lengths are refused", () => {
    expect([1, 2, 3].map(hasColor)).toEqual([true, true, false]);
    expect(() => tokenColor(new Uint8Array(31), new Uint8Array(32))).toThrow(RangeError);
  });
});
