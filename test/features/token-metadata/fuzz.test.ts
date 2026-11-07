import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { classifyMip0018Event } from "../../../src/features/token-metadata/classify.ts";
import { decodePayloadWith } from "../../../src/features/token-metadata/vendor/mip0018/codec/src/decode.ts";
import {
  decodePayload,
  encodePayload,
  EVENT_NAME,
  type MetadataRecord,
} from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";
import { ALL_CODEC_RULES } from "../../../src/features/token-metadata/vendor/mip0018/codec/src/rules.ts";

/**
 * M19 `[PROP][NEG]`: for 200,000 generated payloads the classifier never throws and reads only inside the 256 bytes.
 * The codec reads every payload byte through `byteAt` and slices through `copy`, each of which throws
 * `BoundsInvariantError` outside 0…255 (`decode.ts`), and nothing catches it but the strict UTF-8 decoding of copies;
 * so a run with no exception is a run with no read outside. The payloads: random bytes of 0–300 bytes, payloads built
 * near the bounds (a header, then records whose lengths land on and past the end; one key ending on the last bytes),
 * and valid encodings mutated (bytes flipped, cut, extended). **Negative control:** with the codec's `bounds` rule off (reads past the end as zeros, the
 * rule-mutation mode), some generated payload classifies differently, and every out-of-bounds reason occurs: the
 * payloads reach the bounds. [TM-15; task 2.2]
 */

const RUNS = 200_000;
const SEED = 180_019;

const bytes = (min: number, max: number) => fc.uint8Array({ minLength: min, maxLength: max });

/** A header, then records whose lengths are chosen to land near and past the 256th byte. */
const nearBounds = fc
  .tuple(
    bytes(32, 32),
    fc.integer({ min: 0, max: 255 }),
    fc.array(fc.tuple(fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 }), fc.integer({ min: 0, max: 255 })), { maxLength: 6 }),
    bytes(0, 256),
  )
  .map(([domain, kind, records, filler]) => {
    const out = new Uint8Array(256);
    out.set(domain, 0);
    out[32] = kind;
    let at = 33;
    for (const [keyLen, valType, valLen] of records) {
      if (at >= 256) break;
      out[at] = keyLen;
      at += 1 + keyLen;
      if (at < 256) out[at] = valType;
      if (at + 1 < 256) out[at + 1] = valLen;
      at += 2 + valLen;
    }
    for (let i = 0; i < filler.length && 33 + i < 256; i++) if (out[33 + i] === 0 && i % 3 === 0) out[33 + i] = filler[i]!;
    return out;
  });

/** A header and one record whose key ends at or around the payload's last bytes (its type or length byte past the end). */
const lastBytes = fc.tuple(bytes(32, 32), fc.integer({ min: 215, max: 225 }), bytes(0, 4)).map(([domain, keyLen, tail]) => {
  const out = new Uint8Array(256).fill(0x61);
  out.set(domain, 0);
  out[32] = 1;
  out[33] = keyLen;
  out.set(tail.subarray(0, Math.max(0, 256 - (34 + keyLen))), Math.min(256, 34 + keyLen));
  return out;
});

const record: fc.Arbitrary<MetadataRecord> = fc.record({
  key: bytes(1, 12),
  valType: fc.integer({ min: 0, max: 6 }),
  value: bytes(0, 40),
});

/** A valid encoding where one fits, mutated: a byte flipped, the end cut or extended. */
const mutated = fc
  .tuple(bytes(32, 32), fc.integer({ min: 1, max: 3 }), fc.array(record, { maxLength: 5 }), fc.nat(255), fc.nat(255), fc.integer({ min: -40, max: 40 }))
  .map(([domainSep, kind, records, at, flip, resize]) => {
    let payload: Uint8Array;
    try {
      payload = encodePayload({ domainSep, kind }, records);
    } catch {
      payload = new Uint8Array(256);
    }
    const out = payload.slice();
    if (out.length > 0) out[at % out.length]! ^= flip;
    if (resize < 0) return out.slice(0, Math.max(0, out.length + resize));
    const longer = new Uint8Array(out.length + resize);
    longer.set(out);
    return longer;
  });

const payloads = fc.oneof({ arbitrary: bytes(0, 300), weight: 2 }, { arbitrary: nearBounds, weight: 3 }, { arbitrary: mutated, weight: 3 }, { arbitrary: lastBytes, weight: 1 });

describe("M19: the classifier on generated payloads", () => {
  it(`never throws and reads only inside the 256 bytes, for ${RUNS} payloads`, () => {
    fc.assert(
      fc.property(payloads, (payload) => {
        const classified = classifyMip0018Event({ type: "Misc", name: EVENT_NAME, payload });
        expect(["accept", "reject"]).toContain(classified.result);
        if (classified.result === "reject") expect(classified.reason).toMatch(/^[a-z0-9-]{1,64}$/);
        decodePayload(payload);
      }),
      { seed: SEED, numRuns: RUNS },
    );
  }, 600_000);

  it("[NEG] with the bounds rule off some payload classifies otherwise, and every out-of-bounds reason occurs", () => {
    const reasons = new Set<string>();
    let differs = 0;
    fc.assert(
      fc.property(payloads, (payload) => {
        const bounded = decodePayload(payload);
        if (!bounded.ok) reasons.add(bounded.reason);
        const unbounded = decodePayloadWith(payload, { ...ALL_CODEC_RULES, bounds: false });
        if (JSON.stringify(bounded, (_k, v) => (typeof v === "bigint" ? `${v}` : v)) !== JSON.stringify(unbounded, (_k, v) => (typeof v === "bigint" ? `${v}` : v))) differs++;
      }),
      { seed: SEED, numRuns: 20_000 },
    );
    expect(differs).toBeGreaterThan(0);
    for (const reason of ["key-out-of-bounds", "valtype-out-of-bounds", "vallen-out-of-bounds", "value-out-of-bounds"]) {
      expect([...reasons]).toContain(reason);
    }
  }, 600_000);
});
