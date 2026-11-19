/**
 * MIP-0018 "Keys MUST be valid UTF-8" (Testing R5: invalid UTF-8 in a key rejects the whole event), as the codec
 * enforces it (`src/features/token-metadata/codec/decode.ts`): the reason is `invalid-utf8-key`, at the record of
 * the key. The encoder refuses such a key, so the payloads here are written byte by byte.
 */
import { describe, expect, it } from "vitest";
import { MetadataState } from "./model.js";
import { classifyEvent, decodeUtf8, EVENT_NAME, encodePayload } from "../../../src/features/token-metadata/codec/index.js";
import { ALL_CODEC_RULES, classifyEventWith } from "../../../src/features/token-metadata/codec/internal.js";

const DS = new Uint8Array(32).fill(0x11);
const hex = (h: string): Uint8Array => Uint8Array.from(Buffer.from(h, "hex"));
const text = (s: string): Uint8Array => new TextEncoder().encode(s);

interface Raw {
  key: Uint8Array;
  valType: number;
  value: Uint8Array;
}

/** A `Misc` event of the v1 name whose payload holds `records` as given, kind 3, with no check of any of them. */
function misc(records: readonly Raw[]): { type: string; name: Uint8Array; payload: Uint8Array } {
  const payload = new Uint8Array(256);
  payload.set(DS, 0);
  payload[32] = 3;
  let at = 33;
  for (const r of records) {
    payload[at++] = r.key.length;
    payload.set(r.key, at);
    at += r.key.length;
    payload[at++] = r.valType;
    payload[at++] = r.value.length;
    payload.set(r.value, at);
    at += r.value.length;
  }
  return { type: "Misc", name: EVENT_NAME, payload };
}
const utf8 = (key: Uint8Array, value: string): Raw => ({ key, valType: 1, value: text(value) });

describe("MIP-0018 classification: keys MUST be valid UTF-8", () => {
  it("a non-UTF-8 key rejects the whole event with invalid-utf8-key at its record; without the rule it is accepted", () => {
    const one = misc([utf8(hex("ff6b6579"), "ok")]);
    expect(classifyEvent(one)).toEqual({ result: "reject", reason: "invalid-utf8-key", offset: 33 });
    // [NEG] The rule is what rejects it: with it off, the same event is accepted.
    expect(classifyEventWith(one, { ...ALL_CODEC_RULES, keyUtf8: false }).result).toBe("accept");

    // Whole event: a valid record before the bad key is not applied either; the offset is the bad record's.
    const two = misc([utf8(text("name"), "Acme"), utf8(hex("6e616d65ff"), "x")]);
    expect(classifyEvent(two)).toEqual({ result: "reject", reason: "invalid-utf8-key", offset: 33 + 1 + 4 + 2 + 4 });
    const s = new MetadataState();
    s.apply({ network: "n", position: { block: 1, tx: 0, event: 0 }, contractAddress: "aa".repeat(32), ...two });
    expect(s.identities()).toEqual([]);
    expect(s.rejections("n", "aa".repeat(32)).map((r) => r.reason)).toEqual(["invalid-utf8-key"]);
  });

  it("ill-formed UTF-8 of every kind is refused; NUL, multi-byte and 4-byte keys are accepted", () => {
    for (const bad of ["c0af", "eda080", "f4908080", "e282", "80", "ff"]) {
      expect(decodeUtf8(hex(bad)), bad).toBeUndefined();
      expect(classifyEvent(misc([utf8(hex(bad), "v")])), bad).toMatchObject({ result: "reject", reason: "invalid-utf8-key" });
    }
    for (const good of ["73796d626f6c00", "00", "c3a9", "e282ac", "f09f988e", "efbbbf6b"]) {
      expect(decodeUtf8(hex(good)), good).not.toBeUndefined();
      expect(classifyEvent(misc([utf8(hex(good), "v")])).result, good).toBe("accept");
    }
  });

  it("the key is checked before its value; an event of another type is ignored; the encoder refuses such a key", () => {
    // A bad key whose value type is reserved too: the key's reason, since the key is read first.
    expect(classifyEvent(misc([{ key: hex("ff"), valType: 9, value: new Uint8Array(0) }]))).toMatchObject({ reason: "invalid-utf8-key" });
    expect(classifyEvent({ ...misc([utf8(hex("ff"), "v")]), type: "Contract" })).toEqual({ result: "ignore", reason: "not-misc" });
    expect(() => encodePayload({ domainSep: DS, kind: 3 }, [utf8(hex("ff"), "v")])).toThrow(/valid UTF-8/);
  });
});
