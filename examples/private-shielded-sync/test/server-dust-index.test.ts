/**
 * The module's Dust index (spec 00062 FR-001, FR-006, FR-007, FR-011, FR-013) over real Preprod events
 * (`./server-dust-fixture.ts`) decoded with the vendored ledger build: the file it serves, chunk by chunk, against the
 * entries read from the events independently; full chunks that do not change as the file grows; the era's first
 * height; the first coins and updates by owner; the parameters; and what breaks it.
 */

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { decodeDustChunk, dustEntryAt, type DustEntry } from "../shared/index.ts";
import { type DustDecoder, type DustEvent, DustIndex, dustParametersOfText, ledgerDustDecoder } from "../server/dust-index.ts";
import { byHeight, coinRows, dustEventOf, entryOf, FIXTURE, ledger, ownerOf, spendRows } from "./server-dust-fixture.ts";

const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
const decoder = ledgerDustDecoder(ledger);
const ERA = 3_348_434;

function same(a: DustEntry, b: DustEntry): void {
  expect([hex(a.prefix), a.time, a.fee, a.position]).toEqual([hex(b.prefix), b.time, b.fee, b.position]);
}

/** An index fed the fixture's heights up to `upto` from items, with `chunkEntries` entries per chunk. */
function indexUpTo(upto: number, chunkEntries: number, options: { eraHeight?: number; decoder?: DustDecoder } = {}): DustIndex {
  const index = new DustIndex({ eraHeight: options.eraHeight ?? ERA, chunkEntries });
  index.useDecoder(options.decoder ?? decoder);
  for (const group of byHeight(FIXTURE.filter((r) => r.height <= upto))) index.appendHeight(group.height, group.rows.map((r) => dustEventOf(r)));
  index.advanceTo(upto);
  return index;
}

describe("the Dust index over Preprod events", () => {
  it("lists every spend of the era in chain order; each chunk decodes alone to the entries read from the events; the manifest names each chunk's range, heights, length and SHA-256", () => {
    const index = indexUpTo(3_349_867, 4);
    const spends = spendRows();
    expect(index.entries).toBe(10);
    const manifest = index.manifest();
    expect(manifest).toMatchObject({ version: 1, eraHeight: ERA, height: 3_349_867, entries: 10, chunkEntries: 4, prefixBytes: 4 });
    expect(manifest.chunks.map((c) => [c.first, c.count, c.firstHeight, c.lastHeight])).toEqual([
      [0, 4, spends[0]!.height, spends[3]!.height],
      [4, 4, spends[4]!.height, spends[7]!.height],
      [8, 2, spends[8]!.height, spends[9]!.height],
    ]);
    manifest.chunks.forEach((ref, n) => {
      const chunk = index.chunk(n)!;
      expect([chunk.bytes.length, chunk.sha256, chunk.full]).toEqual([ref.bytes, createHash("sha256").update(chunk.bytes).digest("hex"), n < 2]);
      const decoded = decodeDustChunk(chunk.bytes);
      expect([decoded.first, decoded.firstHeight, decoded.count]).toEqual([ref.first, ref.firstHeight, ref.count]);
      for (let i = 0; i < decoded.count; i++) same(dustEntryAt(decoded, i), entryOf(spends[ref.first + i]!));
    });
    // The new commitments are kept, by entry, for the private check.
    spends.forEach((row, i) => expect(hex(index.commitment(i))).toBe(row.commitment));
    expect(index.chunk(3)).toBeNull();
    expect(index.chunk(-1)).toBeNull();
    expect(index.error).toBeNull();
  });

  it("story 1, scenario 2 (SC-002): as the file grows, the full chunks stay byte-identical and only the last chunk and the manifest change", () => {
    const spends = spendRows();
    // The file at the height of its 5th spend: one full chunk of 4, a last one of 1.
    const early = indexUpTo(spends[4]!.height, 4);
    const late = indexUpTo(3_349_867, 4);
    expect(early.entries).toBe(5);
    expect(hex(early.chunk(0)!.bytes)).toBe(hex(late.chunk(0)!.bytes));
    expect(early.chunk(1)!.full).toBe(false);
    expect(hex(early.chunk(1)!.bytes)).not.toBe(hex(late.chunk(1)!.bytes));
    expect(early.manifest().chunks[0]).toEqual(late.manifest().chunks[0]);
    // The same index, grown: its kept full chunk is the one encoded before.
    const growing = indexUpTo(spends[3]!.height, 4);
    const first = growing.chunk(0)!;
    const before = growing.manifest();
    for (const group of byHeight(FIXTURE.filter((r) => r.height > spends[3]!.height))) growing.appendHeight(group.height, group.rows.map((r) => dustEventOf(r)));
    expect(growing.chunk(0)).toBe(first);
    expect(growing.manifest()).not.toBe(before);
    expect(growing.manifest().chunks).toHaveLength(3);
  });

  it("FR-013: events below the era's first height are not read; a manifest below it lists nothing", () => {
    const spends = spendRows();
    // The era starts at the 4th spend's height: the first three spends (two heights) are outside it.
    const index = indexUpTo(3_349_867, 4, { eraHeight: spends[3]!.height });
    expect(index.entries).toBe(7);
    same(index.entry(0), entryOf(spends[3]!));
    // The first coin below that height belongs to no owner here.
    const early = coinRows().find((r) => r.height < spends[3]!.height)!;
    expect(index.coinsOf(ownerOf(early)).firstCoins).toEqual([]);
    const before = indexUpTo(ERA - 1, 4);
    expect(before.manifest()).toMatchObject({ height: ERA - 1, entries: 0, chunks: [] });
  });

  it("FR-011: an owner's first coins and generation updates, each list in chain order, as the events' bytes; another owner's are not given", () => {
    const index = indexUpTo(3_349_867, 4096);
    const coins = coinRows();
    const owners = [...new Set(coins.map(ownerOf))];
    expect(owners).toHaveLength(2);
    for (const owner of owners) {
      const mine = coins.filter((r) => ownerOf(r) === owner);
      const got = index.coinsOf(owner);
      expect(got.firstCoins.map((e) => [e.height, hex(e.bytes)])).toEqual(mine.filter((r) => r.kind === "dust-initial-utxo").map((r) => [r.height, r.bytes]));
      expect(got.updates.map((e) => [e.height, hex(e.bytes)])).toEqual(mine.filter((r) => r.kind === "dust-generation-dtime-update").map((r) => [r.height, r.bytes]));
    }
    // One owner has two first coins and one update (the second coin's Night spent the first's): the update's record is
    // the first coin's generation record with its dtime set.
    const two = owners.find((o) => index.coinsOf(o).firstCoins.length === 2)!;
    const update = ledger.Event.deserialize(index.coinsOf(two).updates[0]!.bytes).content as unknown as { update: { annotation: { nonce: string; dtime?: Date } } };
    const first = ledger.Event.deserialize(index.coinsOf(two).firstCoins[0]!.bytes).content as unknown as { generation: { nonce: string; dtime?: Date } };
    expect(update.update.annotation.nonce).toBe(first.generation.nonce);
    expect(first.generation.dtime).toBeUndefined();
    expect(update.update.annotation.dtime).toBeInstanceOf(Date);
    expect(index.coinsOf(12345n)).toEqual({ firstCoins: [], updates: [] });
    expect(index.status()).toMatchObject({ entries: 10, firstCoins: 3, updates: 1, owners: 2, error: null });
  });

  it("the parameters: the ledger's initial ones, until the era has a parameter change; a change's are read from the event's rendering", () => {
    const index = indexUpTo(3_349_867, 4096);
    expect(index.parameters()).toEqual({ values: { nightDustRatio: 5_000_000_000n, generationDecayRate: 8_267n, dustGracePeriodSeconds: 10_800n }, source: "initial", height: null });
    // As the ledger renders a `LedgerParameters` (here the one Preprod set at height 0, in the earlier format).
    const text = "…, k_withdrawal_minimum_multiple: FixedPoint(0.5) }, dust: DustParameters { night_dust_ratio: 5000000000, generation_decay_rate: 8267, dust_grace_period: Duration(10800) }, fee_prices: FeePrices { …";
    expect(dustParametersOfText(text)).toEqual({ nightDustRatio: 5_000_000_000n, generationDecayRate: 8_267n, dustGracePeriodSeconds: 10_800n });
    expect(() => dustParametersOfText("ParamChange(LedgerParameters { … })")).toThrow(/without its Dust parameters/);
    const changed = { nightDustRatio: 7n, generationDecayRate: 8n, dustGracePeriodSeconds: 9n };
    const withChange = indexUpTo(3_349_867, 4096, { decoder: { ...decoder, parameters: () => changed } });
    withChange.appendHeight(3_349_900, [{ height: 3_349_900, txIndex: 0, kind: "param-change", bytes: new Uint8Array(1), nullifier: null, commitment: null, treeIndex: null }]);
    expect(withChange.parameters()).toEqual({ values: changed, source: "param-change", height: 3_349_900 });
    expect(new DustIndex({ eraHeight: 0 }).parameters()).toBeNull();
  });

  it("refuses what it cannot serve: a position that does not rise breaks it (nothing of that height taken, later heights ignored); an event it cannot decode; no decoder", () => {
    const spends = spendRows();
    const index = indexUpTo(spends[4]!.height, 4);
    const before = index.entries;
    const repeat: DustEvent = { ...dustEventOf(spends[1]!), height: spends[4]!.height + 1 };
    index.appendHeight(spends[4]!.height + 1, [repeat]);
    expect(index.error).toMatch(/cannot be read: a Dust commitment position 103 after 106/);
    expect(index.entries).toBe(before);
    index.appendHeight(spends[4]!.height + 2, [dustEventOf(spends[9]!, spends[4]!.height + 2)]);
    expect(index.entries).toBe(before);
    expect(index.height).toBe(spends[4]!.height + 2);

    const garbled = new DustIndex({ eraHeight: 0 });
    garbled.useDecoder(decoder);
    garbled.appendHeight(5, [{ ...dustEventOf(spends[0]!, 5), bytes: Uint8Array.of(1, 2, 3) }]);
    expect(garbled.error).toMatch(/^the Dust events of height 5 cannot be read: /);

    // A spend row whose position is not its event's.
    const moved = new DustIndex({ eraHeight: 0 });
    moved.useDecoder(decoder);
    moved.appendHeight(5, [{ ...dustEventOf(spends[0]!, 5), treeIndex: 7 }]);
    expect(moved.error).toMatch(/names position 102 and whose row 7/);

    const none = new DustIndex({ eraHeight: 0 });
    none.appendHeight(5, [dustEventOf(spends[0]!, 5)]);
    expect(none.error).toMatch(/no ledger package/);
    // Heights still advance, and must rise.
    expect(() => none.appendHeight(5, [])).toThrow(/must increase/);
    expect(() => none.advanceTo(4)).toThrow(/must not decrease/);
  });
});
