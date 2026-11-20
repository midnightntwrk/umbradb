import { describe, expect, it } from "vitest";
import { prefixEnd } from "../../../src/features/token-metadata-api/sql.js";

/**
 * The pure parts of the API's SQL module (`src/features/token-metadata-api/sql.ts`). Its statements' plans are
 * `../token-metadata/sql-plans.test.ts`'s; what they answer, the API tests'.
 */

describe("the end of a symbol prefix's range", () => {
  it("is the prefix with its last byte plus one; an empty prefix or one ending in 0xff, never UTF-8 symbols, throws", () => {
    expect([...prefixEnd(new TextEncoder().encode("ABC"))]).toEqual([0x41, 0x42, 0x44]);
    expect([...prefixEnd(new TextEncoder().encode("é"))]).toEqual([0xc3, 0xaa]);
    expect(() => prefixEnd(new Uint8Array())).toThrow(RangeError);
    expect(() => prefixEnd(Uint8Array.of(0x41, 0xff))).toThrow(RangeError);
  });
});
