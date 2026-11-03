import { readFileSync } from "node:fs";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import { RAW } from "./adapter-fixtures.js";
import { type Child, decodeChildren, encodeChildren, free, hex, LENGTH_BOUNDARIES, refsOf, scaleIn, spellingsOf } from "./node-format.js";

// The main thread reads a stored node's referenced keys from its serialized child list, without the ledger package,
// which it never loads; a miss prefetches those keys. The oracle is the independent node format
// (`./node-format.ts`) and the vendored package's own `childRefs` over the nodes a real state flushes. [design §5.3]

/** The fast-check seed of the property below. */
const SEED = 20261026;

const key = fc.uint8Array({ minLength: 32, maxLength: 32 });
const child: fc.Arbitrary<Child> = fc.letrec<{ child: Child }>((tie) => ({
  child: fc.oneof(
    { depthSize: "small" },
    key.map((ref): Child => ({ ref })),
    fc
      .record({ data: fc.uint8Array({ maxLength: 80 }), children: fc.array(tie("child"), { maxLength: 3 }) })
      .map((direct): Child => ({ direct })),
  ),
})).child;

describe("childRefKeys: a stored node's referenced keys, read on the main thread (design §5.3)", () => {
  it(`gives the by-reference keys of any child list, through embedded children, in order (seed ${SEED})`, () => {
    fc.assert(
      fc.property(fc.array(child, { maxLength: 6 }), (children) => {
        const bytes = encodeChildren(children);
        expect(childRefKeys(bytes).map(hex)).toEqual(refsOf(children).map(hex));
      }),
      { seed: SEED, numRuns: 300 },
    );
  });

  it("agrees with the vendored package's childRefs on every node a real genesis state flushes", () => {
    for (const [ledger, file] of [
      ["v8", "genesis_state_preview.mn"],
      ["v9", "genesis_state_undeployed.mn"],
    ] as const) {
      const raw = RAW[ledger];
      const state = raw.LedgerState.deserialize(readFileSync(new URL(`./fixtures/genesis/${file}`, import.meta.url)));
      raw.persistKey(raw.stateKey(state));
      const batch = raw.flushNodes();
      expect(batch.inserts.length).toBeGreaterThan(3);
      for (const node of batch.inserts) {
        // The package lists them in another order (its own walk); the keys are the same.
        expect(childRefKeys(node.children).map(hex).sort()).toEqual(raw.childRefs(node.children).map(hex).sort());
        expect(childRefKeys(node.children).map(hex)).toEqual(refsOf(decodeChildren(node.children)).map(hex));
      }
      raw.releaseKey(raw.stateKey(state));
      raw.flushNodes();
      free(state);
    }
  });

  it("refuses bytes that are no child list", () => {
    expect(() => childRefKeys(Uint8Array.of())).toThrow(/child list/);
    expect(() => childRefKeys(Uint8Array.of(4, 2))).toThrow(/child list/);
    expect(() => childRefKeys(Uint8Array.of(4, 0, 1, 2))).toThrow(/child list/);
    // One child, then a byte too many.
    expect(() => childRefKeys(Uint8Array.from([4, 0, ...new Array<number>(32).fill(7), 9]))).toThrow(/child list/);
    // A length that claims more children than there are bytes.
    expect(() => childRefKeys(Uint8Array.of(0b11, 0xff, 0xff, 0xff, 0xff))).toThrow(/child list/);
    // A two-byte length of 255 children in two bytes.
    expect(() => childRefKeys(Uint8Array.of(0xfd, 0x03))).toThrow(/a length of 255/);
    expect(childRefKeys(Uint8Array.of(0))).toEqual([]);
  });

  it("reads a length in the fewest bytes that spell it and refuses it in more, as the ledger does, for the number of children and an embedded payload's length: 0, 1, 63/64, 16383/16384 in each width (LG-11, R29)", () => {
    for (const value of LENGTH_BOUNDARIES) {
      const refs = Array.from({ length: value }, (_, i) => new Uint8Array(32).fill(i & 0xff));
      const listed = Buffer.concat(refs.flatMap((ref) => [Uint8Array.of(0), ref]));
      for (const { width, canonical } of spellingsOf(value)) {
        const what = `${value} in ${width} bytes`;
        const count = Uint8Array.from(Buffer.concat([scaleIn(value, width), listed]));
        // One embedded child of `value` payload bytes and no child of its own.
        const payload = Uint8Array.from(Buffer.concat([Uint8Array.of(4, 1), scaleIn(value, width), new Uint8Array(value).fill(5), Uint8Array.of(0)]));
        if (canonical) {
          expect(childRefKeys(count).map(hex), what).toEqual(refs.map(hex));
          expect(childRefKeys(payload), what).toEqual([]);
        } else {
          const refused = new RegExp(`^not a ledger node's child list: a length of ${value} in ${width} bytes, more than it needs `);
          expect(() => childRefKeys(count), what).toThrow(refused);
          expect(() => childRefKeys(payload), what).toThrow(refused);
        }
      }
    }
    // The ledger's own two refusals, byte by byte: a second byte of 0 in 2 bytes, a third and a fourth of 0 in 4.
    expect(() => childRefKeys(Uint8Array.of(0b01, 0))).toThrow(/a length of 0 in 2 bytes, more than it needs/);
    expect(() => childRefKeys(Uint8Array.of(0b10, 0, 0, 0))).toThrow(/a length of 0 in 4 bytes, more than it needs/);
    expect(() => childRefKeys(Uint8Array.of(0xfe, 0xff, 0, 0))).toThrow(/a length of 16383 in 4 bytes, more than it needs/);
  });

  it("reads every SCALE length form: one, two and four bytes", () => {
    const refs = Array.from({ length: 70 }, (_, i) => ({ ref: new Uint8Array(32).fill(i) }));
    expect(childRefKeys(encodeChildren(refs)).map(hex)).toEqual(refs.map((r) => hex(r.ref)));
    const big = new Uint8Array(20_000).fill(3);
    const embedded: Child[] = [{ direct: { data: big, children: [{ ref: new Uint8Array(32).fill(9) }] } }];
    expect(childRefKeys(encodeChildren(embedded)).map(hex)).toEqual([hex(new Uint8Array(32).fill(9))]);
  });
});
