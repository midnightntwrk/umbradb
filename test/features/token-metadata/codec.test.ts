import { describe, expect, it } from "vitest";
import {
  commonRecords,
  decodePayload,
  encodePayload,
  encodeUint,
  InvalidHeader,
  InvalidRecord,
  minimalUintWidth,
  PayloadTooLarge,
  record,
  recordsSize,
  ValType,
  withdrawRecords,
} from "../../../src/features/token-metadata/codec/index.js";
import { ALL_CODEC_RULES, type CodecRules, checkValue, classifyEventWith, decodeUintWith } from "../../../src/features/token-metadata/codec/internal.js";
import { decodeInput, decodeResponse, type Json } from "./vector-adapter.js";
import { REFERENCE_VECTORS_DIR } from "./vector-sets.js";
import { loadVectors, runVectors } from "./vector-runner/runner-core.js";

/**
 * The codec on its own (`src/features/token-metadata/codec/`).
 *
 * - **Each MIP rule is needed.** With every rule on, the codec alone passes every reference payload vector (it has no
 *   UTF-8 key rule, which `classify.ts` adds, so A3c is accepted as the reference expects). With any one rule off,
 *   at least one normative payload vector fails (an informative one for zero extension, which the MIP tests only
 *   informatively): no rule is dead code the vectors do not reach.
 * - **The encoder** refuses each header, record and size the MIP forbids, before writing anything, and what it writes
 *   decodes back to the same header and records, for every value type.
 * - **Integers** are little-endian, 1 to 31 bytes, unsigned.
 */

const payloadVectors = loadVectors({ dir: REFERENCE_VECTORS_DIR }).filter((v) => v.entry.kind === "payload");
const domainSep = Uint8Array.from({ length: 32 }, (_, i) => i + 1);

/** A consumer answering decode requests with the codec alone, under `rules`. */
const codecWith = (rules: CodecRules) => async (req: Json): Promise<Json> => ({ id: req.id, ...decodeResponse(classifyEventWith(decodeInput(req), rules)) });

describe("each of the codec's MIP rules is needed", () => {
  it("with every rule on, the codec alone passes every reference payload vector", async () => {
    const report = await runVectors(payloadVectors, codecWith(ALL_CODEC_RULES));
    expect(report.results.filter((r) => !r.ok).map((r) => r.id)).toEqual([]);
    expect(report.normative.total).toBeGreaterThan(30);
  });

  // The MIP's "Consuming" rule (zero extension) has no normative test: its vectors are the informative ones.
  const caughtBy = (rule: string) => (rule === "zeroExtend" ? "informative" : "normative");

  it.each(Object.keys(ALL_CODEC_RULES))("with %s off, a payload vector fails", async (rule) => {
    const report = await runVectors(payloadVectors, codecWith({ ...ALL_CODEC_RULES, [rule]: false }));
    const counts = report[caughtBy(rule)];
    expect(counts.passed, `${rule} off: ${caughtBy(rule)} vectors`).toBeLessThan(counts.total);
  });
});

describe("the encoder", () => {
  it("round-trips a record of every value type through the decoder", () => {
    const records = [
      record.bytes("b", Uint8Array.of(0, 255)),
      record.utf8("name", "Token ✓"),
      record.uint("decimals", 6),
      record.uint("wide", 1n << 100n, 13),
      record.json("meta", '{"a":[1,2]}'),
      record.uri("image", "ipfs://bafy/x.png"),
      ...withdrawRecords().slice(0, 1),
    ];
    const payload = encodePayload({ domainSep, kind: 1 }, records);
    expect(payload).toHaveLength(256);
    const decoded = decodePayload(payload);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.header).toEqual({ domainSep, kind: 1 });
    expect(decoded.records.map((r) => ({ key: r.key, valType: r.valType, value: r.value }))).toEqual(records);
    expect(decoded.contentEnd).toBe(33 + recordsSize(records));
  });

  it("writes the common fields and the withdrawal of all four", () => {
    const common = commonRecords({ name: "Gold", symbol: "GLD", decimals: 2 });
    expect(common.map((r) => [new TextDecoder().decode(r.key), r.valType])).toEqual([
      ["name", ValType.Utf8],
      ["symbol", ValType.Utf8],
      ["decimals", ValType.UInt],
    ]);
    expect(withdrawRecords().every((r) => r.valType === ValType.Null && r.value.length === 0)).toBe(true);
  });

  it("refuses a header, a record or a size the MIP forbids", () => {
    const one = [record.utf8("name", "x")];
    expect(() => encodePayload({ domainSep: domainSep.slice(1), kind: 1 }, one)).toThrow(InvalidHeader);
    expect(() => encodePayload({ domainSep, kind: 4 as 1 }, one)).toThrow(/kind must be 1, 2 or 3, got 4/);
    expect(() => encodePayload({ domainSep, kind: 1 }, [])).toThrow(InvalidRecord);
    expect(() => encodePayload({ domainSep, kind: 1 }, [{ key: new Uint8Array(), valType: 1, value: new Uint8Array() }])).toThrow(/record 0: key must be 1-255 bytes/);
    expect(() => encodePayload({ domainSep, kind: 1 }, [{ key: Uint8Array.of(1), valType: 1, value: new Uint8Array(256) }])).toThrow(/value must be 0-255 bytes/);
    expect(() => encodePayload({ domainSep, kind: 1 }, [{ key: Uint8Array.of(1), valType: 6, value: new Uint8Array() }])).toThrow(/valType must be 0-5, got 6/);
    expect(() => encodePayload({ domainSep, kind: 1 }, [{ key: Uint8Array.of(1), valType: ValType.Null, value: Uint8Array.of(0) }])).toThrow(/bad-null-length/);
    const big = [record.bytes("a", new Uint8Array(200)), record.bytes("b", new Uint8Array(30))];
    const tooLarge = (() => {
      try {
        encodePayload({ domainSep, kind: 2 }, big);
      } catch (error) {
        return error;
      }
    })();
    expect(tooLarge).toBeInstanceOf(PayloadTooLarge);
    expect((tooLarge as PayloadTooLarge).size).toBe(33 + recordsSize(big));
  });
});

describe("integers and values", () => {
  it("encode little-endian in 1 to 31 bytes, unsigned, and read back with the rule on, not with it off", () => {
    expect(encodeUint(0x0102, 2)).toEqual(Uint8Array.of(2, 1));
    expect(minimalUintWidth(0)).toBe(1);
    expect(minimalUintWidth(256)).toBe(2);
    expect(() => encodeUint(1, 0)).toThrow(/width must be 1-31 bytes, got 0/);
    expect(() => encodeUint(1, 32)).toThrow(RangeError);
    expect(() => encodeUint(-1, 1)).toThrow(/unsigned/);
    expect(() => encodeUint(256, 1)).toThrow(/does not fit in 1 bytes/);
    expect(() => minimalUintWidth(-1n)).toThrow(/unsigned/);
    expect(decodeUintWith(Uint8Array.of(2, 1), ALL_CODEC_RULES)).toBe(0x0102n);
    expect(decodeUintWith(Uint8Array.of(2, 1), { ...ALL_CODEC_RULES, littleEndian: false })).toBe(0x0201n);
  });

  it("check each type's rule, and each switch turns its check off", () => {
    const bad = Uint8Array.of(0xff);
    expect(checkValue(ValType.Bytes, bad)).toBeUndefined();
    expect(checkValue(ValType.Utf8, bad)).toBe("invalid-utf8");
    expect(checkValue(ValType.Utf8, bad, { ...ALL_CODEC_RULES, utf8: false })).toBeUndefined();
    expect(checkValue(ValType.UInt, new Uint8Array())).toBe("bad-integer-length");
    expect(checkValue(ValType.UInt, new Uint8Array(32), { ...ALL_CODEC_RULES, integerLength: false })).toBeUndefined();
    expect(checkValue(ValType.Json, bad)).toBe("invalid-utf8");
    expect(checkValue(ValType.Json, new TextEncoder().encode("{"))).toBe("invalid-json");
    expect(checkValue(ValType.Json, new TextEncoder().encode("{"), { ...ALL_CODEC_RULES, json: false })).toBeUndefined();
    expect(checkValue(ValType.Json, bad, { ...ALL_CODEC_RULES, utf8: false, json: false })).toBeUndefined();
    expect(checkValue(ValType.Uri, bad)).toBe("invalid-utf8");
    expect(checkValue(ValType.Uri, new TextEncoder().encode("no scheme"))).toBe("invalid-uri");
    expect(checkValue(ValType.Uri, bad, { ...ALL_CODEC_RULES, utf8: false, uri: false })).toBeUndefined();
    expect(checkValue(ValType.Null, bad)).toBe("bad-null-length");
    expect(checkValue(ValType.Null, bad, { ...ALL_CODEC_RULES, nullLength: false })).toBeUndefined();
    expect(checkValue(9, bad)).toBe("reserved-valtype");
    expect(checkValue(9, bad, { ...ALL_CODEC_RULES, reservedTypes: false })).toBeUndefined();
  });
});
