import { describe, expect, it } from "vitest";
import { storagePrefix, twox128, xxh64 } from "../../tools/tape/index.js";

/**
 * Substrate's `twox128` (`tools/tape/twox.ts`; task 0.3): checked against storage keys whose bytes are known — the
 * `System` pallet's `Number` and `Events` items (`test/node/fixtures/mainnet-answers.json` reads `System.Number` by
 * its key) — and against XXH64's own reference values, for inputs of every length class the algorithm branches on.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe("twox128 and storage prefixes", () => {
  it("gives the System pallet's known storage keys", () => {
    expect(hex(twox128("System"))).toBe("26aa394eea5630e07c48ae0c9558cef7");
    expect(hex(storagePrefix("System", "Number"))).toBe("26aa394eea5630e07c48ae0c9558cef702a5c1b19ab7a04f536c519aca4983ac");
    expect(hex(storagePrefix("System", "Events"))).toBe("26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7");
  });

  it("gives XXH64's reference values, for empty, short and 32-byte-and-longer inputs", () => {
    const bytes = (text: string) => new TextEncoder().encode(text);
    expect(xxh64(bytes(""), 0n)).toBe(0xef46db3751d8e999n);
    expect(xxh64(bytes("a"), 0n)).toBe(0xd24ec4f1a98c6e5bn);
    expect(xxh64(bytes("abc"), 0n)).toBe(0x44bc2cf5ad770999n);
    expect(xxh64(bytes("message digest"), 0n)).toBe(0x066ed728fceeb3ben);
    expect(xxh64(bytes("abcdefghijklmnopqrstuvwxyz"), 0n)).toBe(0xcfe1f278fa89835cn);
    expect(xxh64(bytes("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), 0n)).toBe(0xaaa46907d3047814n);
    expect(xxh64(bytes("12345678901234567890123456789012345678901234567890123456789012345678901234567890"), 0n)).toBe(
      0xe04a477f19ee145dn,
    );
  });
});
