import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import {
  type LedgerTable,
  mnsvSpecVersion,
  selectLedgerVersion,
  U32_MAX,
} from "../../src/ledger/version-table.js";
import { hashAnswer, headerAnswer, toHex } from "../../src/node/decode.js";
import {
  blockWith,
  expectBadVersionDigestHalts,
  expectPinsChecked,
  expectUnknownRuntimeHalts,
  haltOf,
  hashOf,
  mnsvItem,
  OTHER_ITEMS,
  SYNTHETIC_TABLE,
} from "./version-checks.js";

/**
 * Each block's ledger version is the row of the ledger version table covering the `spec_version` of its `MNSV`
 * digest, and pins check the table. The halts are typed `UmbraError`s, which the finalized loop turns into a halt:
 * - a block with an unknown `spec_version` halts with `unknown-runtime`;
 * - a block with no `MNSV` digest, or two, with `bad-version-digest`;
 * - a block contradicting a pin, with `pin-mismatch`.
 *
 * Synthetic tables and headers are used here, and the real mainnet header of block 3,174,332 as the node returned it
 * (`test/node/fixtures/mainnet-answers.json`). [A94 CI, LG-1, LG-2; acceptance §12; design §11]
 *
 * That the mainnet header of block 1,774,492 passes the built-in pin needs the pin and the recorded header:
 * `networks.test.ts` runs every built-in pin against the header its boundary's source records. [A94 CI]
 */

describe("A94: the version digest, the rows and the pins (LG-1, LG-2)", () => {
  it("halts a block whose spec_version no row covers with unknown-runtime (LG-1's scenario)", () => {
    expectUnknownRuntimeHalts(selectLedgerVersion);
  });

  it("halts a block with no MNSV digest, or with two, with bad-version-digest", () => {
    expectBadVersionDigestHalts(selectLedgerVersion);
  });

  it("halts a block contradicting a pin with pin-mismatch, and passes one agreeing with it", () => {
    expectPinsChecked(selectLedgerVersion);
  });

  it("halts a spec_version that two rows cover with unknown-runtime, naming both rows", () => {
    // The configuration's validation refuses overlapping rows; a table built otherwise still never picks one.
    const overlapping: LedgerTable = {
      rows: [
        { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
        { specVersionMin: 1_500_000, specVersionMax: 2_999_999, ledger: "v9" },
      ],
      pins: [],
    };
    const halt = haltOf(() => selectLedgerVersion(overlapping, blockWith(4, [mnsvItem(1_600_000)])));
    expect(halt.code).toBe("unknown-runtime");
    expect(halt.details).toMatchObject({ height: 4n, specVersion: 1_600_000, rows: 2 });
    expect(halt.message).toContain("two rows");
    expect(selectLedgerVersion(overlapping, blockWith(4, [mnsvItem(1_499_999)]))).toEqual({ specVersion: 1_499_999, ledger: "v8" });
    const three = { rows: [...overlapping.rows, { specVersionMin: 1_600_000, specVersionMax: 1_600_000, ledger: "v9" as const }], pins: [] };
    const halt3 = haltOf(() => selectLedgerVersion(three, blockWith(4, [mnsvItem(1_600_000)])));
    expect(halt3.details).toMatchObject({ rows: 3 });
    expect(halt3.message).toContain("3 rows");
    expect(selectLedgerVersion(overlapping, blockWith(4, [mnsvItem(2_000_000)]))).toEqual({ specVersion: 2_000_000, ledger: "v9" });
  });

  it("checks the pin before the rows: a pinned block with an unknown runtime is a pin-mismatch", () => {
    const halt = haltOf(() => selectLedgerVersion(SYNTHETIC_TABLE, blockWith(1_000, [mnsvItem(3_000_000)])));
    expect(halt.code).toBe("pin-mismatch");
    expect(halt.details).toMatchObject({ differs: ["specVersion"] });
  });

  it("checks every pin at the block's height, so a table with two pins there cannot pass a block one refuses", () => {
    const table: LedgerTable = {
      rows: SYNTHETIC_TABLE.rows,
      pins: [
        { height: 9, hash: toHex(hashOf(9)), specVersion: 1_000_000 },
        { height: 9, hash: toHex(hashOf(90)), specVersion: 1_000_000 },
      ],
    };
    expect(haltOf(() => selectLedgerVersion(table, blockWith(9, [mnsvItem(1_000_000)]))).code).toBe("pin-mismatch");
    expect(haltOf(() => selectLedgerVersion(table, blockWith(9, [mnsvItem(1_000_000)], hashOf(90)))).code).toBe("pin-mismatch");
  });

  it("returns a frozen selection", () => {
    const selection = selectLedgerVersion(SYNTHETIC_TABLE, blockWith(2, [mnsvItem(22_000)]));
    expect(selection).toEqual({ specVersion: 22_000, ledger: "v8" });
    expect(Object.isFrozen(selection)).toBe(true);
  });
});

describe("the MNSV digest item (LG-1; midnight-node pallets/version: DigestItem::Consensus(*b\"MNSV\", spec_version))", () => {
  it("reads the u32 little-endian spec_version of the one Consensus MNSV item, among others in any order", () => {
    for (const specVersion of [0, 22_000, 1_000_300, 2_000_000, U32_MAX]) {
      expect(mnsvSpecVersion(blockWith(1, [mnsvItem(specVersion)]))).toBe(specVersion);
      expect(mnsvSpecVersion(blockWith(1, [...OTHER_ITEMS, mnsvItem(specVersion)]))).toBe(specVersion);
      expect(mnsvSpecVersion(blockWith(1, [mnsvItem(specVersion), ...OTHER_ITEMS]))).toBe(specVersion);
    }
  });

  it("is only a Consensus item: a PreRuntime, Seal or Other item with the engine MNSV is not the version digest", () => {
    for (const kind of [0x00, 0x05, 0x06, 0x08]) {
      const item = mnsvItem(1_000_000);
      item[0] = kind;
      const halt = haltOf(() => mnsvSpecVersion(blockWith(3, [item])));
      expect(halt.code, `kind ${kind}`).toBe("bad-version-digest");
      expect(halt.details).toMatchObject({ reason: "missing", items: 0 });
    }
    const otherEngine = mnsvItem(1_000_000);
    otherEngine[4] = 0x57; // "MNSW"
    expect(haltOf(() => mnsvSpecVersion(blockWith(3, [otherEngine]))).details).toMatchObject({ reason: "missing" });
  });

  it("refuses a malformed MNSV item: a payload of another length, a wrong length prefix, a truncated item", () => {
    const malformed = [
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x0c, 0x40, 0x42, 0x0f), // 3 bytes
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x14, 0x40, 0x42, 0x0f, 0x00, 0x00), // 5 bytes
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x10, 0x40, 0x42, 0x0f), // prefix 4, three bytes follow
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x10, 0x40, 0x42, 0x0f, 0x00, 0x00), // prefix 4, five bytes follow
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x11, 0x00, 0x40, 0x42, 0x0f, 0x00), // 4 in compact's two-byte mode
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56, 0x0c, 0x40, 0x42, 0x0f, 0x00), // ten bytes, the prefix saying 3
      Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56), // no payload
    ];
    for (const item of malformed) {
      const halt = haltOf(() => mnsvSpecVersion(blockWith(3, [...OTHER_ITEMS, item])));
      expect(halt.code, toHex(item)).toBe("bad-version-digest");
      expect(halt.details, toHex(item)).toEqual({ height: 3n, hash: toHex(hashOf(3)), reason: "malformed", items: 1, item: toHex(item) });
    }
    // Too short to name an engine: not an MNSV item at all.
    expect(haltOf(() => mnsvSpecVersion(blockWith(3, [Uint8Array.of(0x04, 0x4d, 0x4e, 0x53)]))).details).toMatchObject({
      reason: "missing",
    });
  });

  it("counts a malformed MNSV item among several: two items, either malformed, halt as several", () => {
    const bad = Uint8Array.of(0x04, 0x4d, 0x4e, 0x53, 0x56);
    expect(haltOf(() => mnsvSpecVersion(blockWith(3, [bad, mnsvItem(1)]))).details).toMatchObject({ reason: "several", items: 2 });
    expect(haltOf(() => mnsvSpecVersion(blockWith(3, [mnsvItem(1), mnsvItem(2), mnsvItem(3)]))).details).toMatchObject({
      reason: "several",
      items: 3,
    });
  });
});

describe("a real mainnet header through the node client's decoder and the built-in mainnet table", () => {
  type Answers = { calls: { method: string; params: unknown[]; result: unknown }[] };
  const answers = JSON.parse(
    readFileSync(new URL("../node/fixtures/mainnet-answers.json", import.meta.url), "utf8"),
  ) as Answers;
  const answer = (method: string) => answers.calls.find((call) => call.method === method && call.params.length > 0);

  it("block 3,174,332: its MNSV digest is the spec_version state_getRuntimeVersion reports there, mapped to v8", () => {
    const hashCall = answers.calls.find((call) => call.method === "chain_getBlockHash" && call.params[0] === 3_174_332);
    const hash = hashAnswer("chain_getBlockHash", "result", hashCall?.result);
    const header = headerAnswer("chain_getHeader", "result", answer("chain_getHeader")?.result);
    const runtime = answer("state_getRuntimeVersion")?.result as { specVersion: number };
    expect(header.number).toBe(3_174_332n);
    const block = { height: header.number, hash, digest: header.digest };
    expect(mnsvSpecVersion(block)).toBe(runtime.specVersion);
    expect(runtime.specVersion).toBe(1_000_300);
    const mainnet = builtInLedgerTable("mainnet");
    expect(mainnet).not.toBeNull();
    expect(selectLedgerVersion(mainnet as LedgerTable, block)).toEqual({ specVersion: 1_000_300, ledger: "v8" });
    // A pin made from the three answers passes it; one naming the block's parent's hash does not.
    const pinned = { rows: (mainnet as LedgerTable).rows, pins: [{ height: 3_174_332, hash: toHex(hash), specVersion: 1_000_300 }] };
    expect(selectLedgerVersion(pinned, block)).toEqual({ specVersion: 1_000_300, ledger: "v8" });
    const wrong = { ...pinned, pins: [{ ...pinned.pins[0]!, hash: toHex(header.parentHash) }] };
    expect(haltOf(() => selectLedgerVersion(wrong, block)).code).toBe("pin-mismatch");
  });
});
