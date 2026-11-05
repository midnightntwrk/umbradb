import { readFileSync } from "node:fs";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import * as v9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import * as v9rc3 from "../../../vendor/ledger/v9-rc3/pkg/midnight_ledger_wasm_v9_fs.js";
import { miscAtom, UnknownLogSerialization } from "../../../src/features/token-metadata/log-reader.js";
import {
  classifyEvent,
  EVENT_NAME,
  splitMiscData,
} from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";

/**
 * The log reader: a `Misc` log's data, the ledger's tagged serialization of the logged value, is a candidate's bytes
 * only when it is a cell holding one atom of at most 288 bytes; any other value under the known tag is not; an unknown
 * tag is an error. Checked on the real stagenet logs `core-contract-logs-fast` stored, and differentially against both
 * vendored v9 packages' own serialization. [TM-2, TM-3; M4, M5, M6]
 */

type Package = typeof v9;
const PACKAGES: readonly (readonly [string, Package])[] = [
  ["v9 (rc.5)", v9],
  ["v9-rc3", v9rc3 as unknown as Package],
];

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const fromHex = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));

/** A cell of one byte atom, declared `Bytes<declared>` as Compact declares a field; `bytes` is in normal form. */
function cell(api: Package, bytes: Uint8Array, declared: number): v9.StateValue {
  return api.StateValue.newCell({ value: [bytes], alignment: [{ tag: "atom", value: { tag: "bytes", length: declared } }] });
}

/** `bytes` in the ledger's normal form: no trailing zero byte. */
function normal(bytes: Uint8Array): Uint8Array {
  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) end--;
  return bytes.slice(0, end);
}

const FIXTURE = JSON.parse(readFileSync("test/features/token-metadata/fixtures/stagenet-misc-logs.json", "utf8")) as {
  logs: { height: number; txIndex: number; logIndex: number; contract: string; version: number; data: string }[];
};

describe("the log reader on stagenet's stored Misc logs (M4, M6's real half)", () => {
  it("reads every stored Misc log as one atom of at most 288 bytes", () => {
    expect(FIXTURE.logs.length).toBe(49);
    for (const log of FIXTURE.logs) {
      const atom = miscAtom(fromHex(log.data));
      expect(atom, `${log.height}/${log.txIndex}/${log.logIndex}`).not.toBeNull();
      expect(atom!.length).toBeLessThanOrEqual(288);
    }
  });

  it("gives case C01's event at 714501: the v1 name, and an accepted payload naming Acme Gold", () => {
    const log = FIXTURE.logs.find((l) => l.height === 714501)!;
    expect(log.contract).toBe("98a90519419e2ebb514b7c6ce87ee7f6f4f9753d9ee6f533c5d1c25b9d437dcf");
    const split = splitMiscData(miscAtom(fromHex(log.data))!)!;
    expect(hex(split.name)).toBe(hex(EVENT_NAME));
    const classified = classifyEvent({ type: "Misc", name: split.name, payload: split.payload });
    expect(classified.result).toBe("accept");
    if (classified.result !== "accept") return;
    const name = classified.records.find((r) => Buffer.from(r.key).toString("utf8") === "name");
    expect(Buffer.from(name!.value).toString("utf8")).toBe("Acme Gold");
  });

  it("leaves other Misc names to the classifier, which ignores them", () => {
    const other = FIXTURE.logs.filter((l) => !l.data.includes(hex(EVENT_NAME).slice(0, 54)));
    expect(other.length).toBeGreaterThan(0);
    for (const log of other) {
      const split = splitMiscData(miscAtom(fromHex(log.data))!)!;
      expect(classifyEvent({ type: "Misc", name: split.name, payload: split.payload }).result).toBe("ignore");
    }
  });
});

for (const [label, api] of PACKAGES) {
  describe(`the log reader against ${label}'s own serialization (M5)`, () => {
    it("reads back every atom of 0 to 288 bytes, declared as itself or as Bytes<288> [[token-metadata.log-reader.atoms]]", () => {
      fc.assert(
        fc.property(fc.uint8Array({ minLength: 0, maxLength: 288 }), fc.boolean(), (raw, compactShape) => {
          const bytes = normal(raw);
          const serialized = api.serializeStateValue(cell(api, bytes, compactShape ? 288 : Math.max(bytes.length, 1)));
          expect(hex(miscAtom(serialized)!)).toBe(hex(bytes));
        }),
        { seed: 18_0018, numRuns: 600 },
      );
    });

    it("reads every length 0 to 288 exactly, the single-byte atoms below 32 included", () => {
      for (let length = 0; length <= 288; length++) {
        const bytes = Uint8Array.from({ length }, (_, i) => ((i * 37 + length) % 255) + 1);
        expect(hex(miscAtom(api.serializeStateValue(cell(api, bytes, 288)))!)).toBe(hex(bytes));
      }
      for (let byte = 1; byte < 64; byte++) {
        expect(hex(miscAtom(api.serializeStateValue(cell(api, Uint8Array.of(byte), 1)))!)).toBe(hex(Uint8Array.of(byte)));
      }
    });

    it("gives no candidate for any other value: null, a map, an array, a cell of two atoms, an atom over 288 bytes", () => {
      const two = api.StateValue.newCell({
        value: [Uint8Array.of(0x40), Uint8Array.of(0x41)],
        alignment: [
          { tag: "atom", value: { tag: "bytes", length: 32 } },
          { tag: "atom", value: { tag: "bytes", length: 256 } },
        ],
      });
      const others = [
        api.StateValue.newNull(),
        api.StateValue.newMap(new api.StateMap()),
        api.StateValue.newArray().arrayPush(cell(api, Uint8Array.of(0x40), 1)),
        two,
        cell(api, new Uint8Array(289).fill(7), 289),
      ];
      for (const value of others) expect(miscAtom(api.serializeStateValue(value))).toBeNull();
    });
  });
}

describe("the log reader's refusals (M6)", () => {
  const known = (): Uint8Array => v9.serializeStateValue(cell(v9, Uint8Array.of(0x40, 0x41), 288));

  it("throws UnknownLogSerialization for a tag it does not know, naming the tag", () => {
    const bytes = known();
    const text = Buffer.from(bytes).toString("latin1").replace("impact-state-value[v2]", "impact-state-value[v3]");
    expect(() => miscAtom(Uint8Array.from(Buffer.from(text, "latin1")))).toThrow(UnknownLogSerialization);
    expect(() => miscAtom(Uint8Array.from(Buffer.from(text, "latin1")))).toThrow(/impact-state-value\[v3\]/);
  });

  it("throws UnknownLogSerialization for bytes that are not a tagged serialization", () => {
    expect(() => miscAtom(Uint8Array.of(1, 2, 3))).toThrow(UnknownLogSerialization);
    expect(() => miscAtom(new Uint8Array())).toThrow(UnknownLogSerialization);
  });

  it("gives no candidate for a known tag whose body is cut short or has bytes left over", () => {
    const bytes = known();
    for (let cut = 1; cut < 12; cut++) expect(miscAtom(bytes.slice(0, bytes.length - cut))).toBeNull();
    expect(miscAtom(Uint8Array.of(...bytes, 0))).toBeNull();
  });
});
