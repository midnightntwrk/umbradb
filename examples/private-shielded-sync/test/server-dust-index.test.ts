/**
 * The module's Dust index (spec 00062 FR-001, FR-006, FR-007, FR-011, FR-012, FR-013) over real Preprod events
 * (`./server-dust-fixture.ts`) decoded with the vendored ledger build: the file it serves, chunk by chunk, against the
 * entries read from the events independently; full chunks that do not change as the file grows; the era's first
 * height; the first coins and updates by owner; the parameters; the commitments by position for the check table; and
 * what breaks it.
 */

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { decodeDustChunk, dustEntryAt, type DustEntry } from "../shared/index.ts";
import { type DustDecoder, type DustEvent, DustIndex, dustParametersOfText, ledgerDustDecoder } from "../server/dust-index.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { dustTree } from "../server/dust-tree.ts";
import { dustStateAt } from "../server/sql.ts";
import { rootFromStored } from "../server/tree.ts";
import { byHeight, coinRows, commitmentsUpTo, dustEventOf, entryOf, FIXTURE, FIXTURE_STATES, ledger, ownerOf, spendRows } from "./server-dust-fixture.ts";

const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
const decoder = ledgerDustDecoder(ledger);
const ERA = 3_348_434;
const LAST = FIXTURE.at(-1)!.height;
const CHUNK = 64;

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
    const index = indexUpTo(LAST, CHUNK);
    const spends = spendRows();
    expect(spends).toHaveLength(144);
    expect(index.entries).toBe(144);
    const manifest = index.manifest();
    expect(manifest).toMatchObject({ version: 1, eraHeight: ERA, height: LAST, entries: 144, chunkEntries: CHUNK, prefixBytes: 4 });
    expect(manifest.chunks.map((c) => [c.first, c.count, c.firstHeight, c.lastHeight])).toEqual([
      [0, 64, spends[0]!.height, spends[63]!.height],
      [64, 64, spends[64]!.height, spends[127]!.height],
      [128, 16, spends[128]!.height, spends[143]!.height],
    ]);
    manifest.chunks.forEach((ref, n) => {
      const chunk = index.chunk(n)!;
      expect([chunk.bytes.length, chunk.sha256, chunk.full]).toEqual([ref.bytes, createHash("sha256").update(chunk.bytes).digest("hex"), n < 2]);
      const decoded = decodeDustChunk(chunk.bytes);
      expect([decoded.first, decoded.firstHeight, decoded.count]).toEqual([ref.first, ref.firstHeight, ref.count]);
      for (let i = 0; i < decoded.count; i++) same(dustEntryAt(decoded, i), entryOf(spends[ref.first + i]!));
    });
    // The new commitments are kept, by entry, for the check table.
    spends.forEach((row, i) => expect(hex(index.commitment(i))).toBe(row.commitment));
    expect(index.chunk(3)).toBeNull();
    expect(index.chunk(-1)).toBeNull();
    expect(index.error).toBeNull();
  });

  it("story 1, scenario 2 (SC-002): as the file grows, the full chunks stay byte-identical and only the last chunk and the manifest change", () => {
    const spends = spendRows();
    // The file at the height of its 100th spend: one full chunk of 64, a last one that grows.
    const at = spends[99]!.height;
    const early = indexUpTo(at, CHUNK);
    const late = indexUpTo(LAST, CHUNK);
    const entries = spends.filter((r) => r.height <= at).length;
    expect(early.entries).toBe(entries);
    expect(entries).toBeGreaterThan(64);
    expect(entries).toBeLessThan(128);
    expect(hex(early.chunk(0)!.bytes)).toBe(hex(late.chunk(0)!.bytes));
    expect(early.chunk(1)!.full).toBe(false);
    expect(hex(early.chunk(1)!.bytes)).not.toBe(hex(late.chunk(1)!.bytes));
    expect(early.manifest().chunks[0]).toEqual(late.manifest().chunks[0]);
    // Chunk n at the count an earlier manifest names is that manifest's chunk, however the file grew since.
    const earlyLast = early.manifest().chunks[1]!;
    const atCount = late.chunk(1, earlyLast.count)!;
    expect([hex(atCount.bytes), atCount.sha256, atCount.full]).toEqual([hex(early.chunk(1)!.bytes), earlyLast.sha256, false]);
    expect(late.chunk(0, 64)).toBe(late.chunk(0));
    expect([late.chunk(2, 17), late.chunk(2, 0), late.chunk(2, 1.5)]).toEqual([null, null, null]);
    // The same index, grown: its kept full chunk is the one encoded before.
    const growing = indexUpTo(at, CHUNK);
    const first = growing.chunk(0)!;
    const before = growing.manifest();
    for (const group of byHeight(FIXTURE.filter((r) => r.height > at))) growing.appendHeight(group.height, group.rows.map((r) => dustEventOf(r)));
    expect(growing.chunk(0)).toBe(first);
    expect(growing.manifest()).not.toBe(before);
    expect(growing.manifest().chunks).toHaveLength(3);
  });

  it("FR-013: events below the era's first height are not read; a manifest below it lists nothing", () => {
    const spends = spendRows();
    // The era starts at the 4th spend's height: the spends below it (and every first coin of the boundary block) are outside.
    const era = spends[3]!.height;
    const index = indexUpTo(LAST, CHUNK, { eraHeight: era });
    expect(index.entries).toBe(spends.filter((r) => r.height >= era).length);
    same(index.entry(0), entryOf(spends.find((r) => r.height >= era)!));
    const early = coinRows().find((r) => r.height < era)!;
    expect(index.coinsOf(ownerOf(early)).firstCoins.every((e) => e.height >= era)).toBe(true);
    const before = indexUpTo(ERA - 1, CHUNK);
    expect(before.manifest()).toMatchObject({ height: ERA - 1, entries: 0, chunks: [] });
  });

  it("FR-011: an owner's first coins and generation updates, each list in chain order, as the events' bytes; another owner's are not given", () => {
    const index = indexUpTo(LAST, 4096);
    const coins = coinRows();
    const owners = [...new Set(coins.map(ownerOf))];
    expect(owners).toHaveLength(47);
    for (const owner of owners) {
      const mine = coins.filter((r) => ownerOf(r) === owner);
      const got = index.coinsOf(owner);
      expect(got.firstCoins.map((e) => [e.height, hex(e.bytes)])).toEqual(mine.filter((r) => r.kind === "dust-initial-utxo").map((r) => [r.height, r.bytes]));
      expect(got.updates.map((e) => [e.height, hex(e.bytes)])).toEqual(mine.filter((r) => r.kind === "dust-generation-dtime-update").map((r) => [r.height, r.bytes]));
    }
    // An owner with two first coins and one update (the second coin's Night spent the first's): the update's record is
    // the first coin's generation record with its dtime set.
    const two = owners.find((o) => index.coinsOf(o).firstCoins.length === 2 && index.coinsOf(o).updates.length === 1)!;
    const update = ledger.Event.deserialize(index.coinsOf(two).updates[0]!.bytes).content as unknown as { update: { annotation: { nonce: string; dtime?: Date } } };
    const firsts = index.coinsOf(two).firstCoins.map((e) => ledger.Event.deserialize(e.bytes).content as unknown as { generation: { nonce: string; dtime?: Date } });
    expect(firsts.map((f) => f.generation.nonce)).toContain(update.update.annotation.nonce);
    expect(firsts.every((f) => f.generation.dtime === undefined)).toBe(true);
    expect(update.update.annotation.dtime).toBeInstanceOf(Date);
    expect(index.coinsOf(12345n)).toEqual({ firstCoins: [], updates: [] });
    expect(index.status()).toMatchObject({ entries: 144, firstCoins: 110, updates: 5, owners: 47, error: null });
  });

  it("the parameters: the ledger's initial ones, until the era has a parameter change; a change's are read from the event's rendering", () => {
    const index = indexUpTo(LAST, 4096);
    expect(index.parameters()).toEqual({ values: { nightDustRatio: 5_000_000_000n, generationDecayRate: 8_267n, dustGracePeriodSeconds: 10_800n }, source: "initial", height: null });
    // As the ledger renders a `LedgerParameters` (here the one Preprod set at height 0, in the earlier format).
    const text = "…, k_withdrawal_minimum_multiple: FixedPoint(0.5) }, dust: DustParameters { night_dust_ratio: 5000000000, generation_decay_rate: 8267, dust_grace_period: Duration(10800) }, fee_prices: FeePrices { …";
    expect(dustParametersOfText(text)).toEqual({ nightDustRatio: 5_000_000_000n, generationDecayRate: 8_267n, dustGracePeriodSeconds: 10_800n });
    expect(() => dustParametersOfText("ParamChange(LedgerParameters { … })")).toThrow(/without its Dust parameters/);
    const changed = { nightDustRatio: 7n, generationDecayRate: 8n, dustGracePeriodSeconds: 9n };
    const withChange = indexUpTo(LAST, 4096, { decoder: { ...decoder, parameters: () => changed } });
    withChange.appendHeight(LAST + 1, [{ height: LAST + 1, txIndex: 0, kind: "param-change", bytes: new Uint8Array(1), nullifier: null, commitment: null, treeIndex: null }]);
    expect(withChange.parameters()).toEqual({ values: changed, source: "param-change", height: LAST + 1 });
    expect(new DustIndex({ eraHeight: 0 }).parameters()).toBeNull();
  });

  it("FR-012: the commitments by position at a height fill 0 to n − 1 exactly once (n the core's dust_commitment_first_free), from the spends' rows and the first coins' outputs; a gap or a position filled twice is refused", () => {
    const index = indexUpTo(LAST, 4096);
    for (const [height, firstFree] of [[ERA, 100], [3_349_459, 113], [LAST, 254]] as const) {
      const table = index.commitments(height);
      expect([table.height, table.count]).toEqual([height, firstFree]);
      const expected = commitmentsUpTo(height);
      expect(expected.size).toBe(firstFree);
      for (let p = 0; p < table.count; p++) expect(hex(table.bytes.subarray(32 * p, 32 * p + 32)), `position ${p}`).toBe(hex(expected.get(p)!));
    }
    expect(index.commitments(ERA - 1).count).toBe(0);
    expect(() => index.commitments(LAST + 1)).toThrow(/is at/);

    // Without the boundary block's first coins (the era set later than it starts), positions 0 to 99 are empty.
    const late = indexUpTo(LAST, 4096, { eraHeight: ERA + 1 });
    expect(() => late.commitments()).toThrow(/position 0 is empty: the era's 144 spends and 10 first coins up to height 3349867 do not fill positions 0 to 253/);
    // A first coin the decoder places on a spend's position: filled twice.
    const spend = spendRows()[0]!;
    const twice = indexUpTo(LAST, 4096, { decoder: { ...decoder, firstCoin: (bytes) => ({ ...decoder.firstCoin(bytes), position: spend.treeIndex! }) } });
    expect(() => twice.commitments()).toThrow(/position 102 is filled twice \(the second time by a first coin at height 3348434\)/);
  });

  it("phase 9, acceptance 1 and 3: at three heights, the commitment tree over the commitments by position (the Zswap tree's leaf and node hashes) and the generation tree over the records (each with its latest dtime, by the ledger) have the core's stored roots", () => {
    const index = indexUpTo(LAST, 4096);
    const kernel = new Kernel(compileKernel());
    const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => kernel.hash2(a, b)!;
    for (const state of FIXTURE_STATES) {
      const table = index.commitments(state.height);
      expect(table.count).toBe(state.commitmentFirstFree);
      for (const k of [0, 2, 16]) {
        const { tree, paths } = dustTree(table.count, k, (i) => kernel.leaf(table.bytes.subarray(32 * i, 32 * i + 32)), hash);
        expect(hex(tree.root), `commitment root at ${state.height}, k ${k}`).toBe(hex(rootFromStored(Buffer.from(state.commitmentRoot, "hex"))));
        expect(paths.length).toBe(table.count * k * 32);
      }
      const records = index.generationRecords(state.height);
      expect(records.length).toBe(state.generationFirstFree);
      const root = index.generationRoot(records)!;
      const stored = rootFromStored(Buffer.from(state.generationRoot, "hex"));
      expect(root.toString(16).padStart(64, "0")).toBe(Buffer.from(stored).reverse().toString("hex"));
    }
    // At the last height, the updated records carry their dtime; the others none.
    const records = index.generationRecords(LAST);
    expect(records.filter((r) => r.dtime !== null)).toHaveLength(5);
    // A record's dtime changes the root: dropping one gives another root than the core's.
    const changed = records.map((r) => (r.dtime === null ? r : { ...r, dtime: null }));
    expect(index.generationRoot(changed)).not.toBe(index.generationRoot(records));
  });

  it("the stored state at a height: the block's time in whole seconds, its milliseconds dropped (as the ledger keys its Dust roots); no row, none", async () => {
    const row = { dust_commitment_first_free: 254n, dust_commitment_root: Buffer.alloc(33, 1), dust_generation_first_free: 110n, dust_generation_root: Buffer.alloc(33, 2) };
    const at = (block_time: unknown) => dustStateAt({ query: async () => [{ ...row, block_time }] } as never, 7);
    expect((await at(new Date("2026-11-17T15:41:06.001Z")))!.blockTime).toBe(Date.parse("2026-11-17T15:41:06Z") / 1000);
    expect((await at(new Date("2026-11-17T15:41:06.999Z")))!.blockTime).toBe(Date.parse("2026-11-17T15:41:06Z") / 1000);
    expect(await at(new Date("2026-11-17T15:41:06Z"))).toMatchObject({ commitmentFirstFree: 254, generationFirstFree: 110, blockTime: Date.parse("2026-11-17T15:41:06Z") / 1000 });
    expect(await dustStateAt({ query: async () => [] } as never, 7)).toBeNull();
  });

  it("refuses what it cannot serve: a position that does not rise breaks it (nothing of that height taken, later heights ignored); an event it cannot decode; no decoder", () => {
    const spends = spendRows();
    const at = spends[4]!.height;
    const index = indexUpTo(at, CHUNK);
    const before = index.entries;
    const lastPosition = spends.filter((r) => r.height <= at).at(-1)!.treeIndex;
    const repeat: DustEvent = { ...dustEventOf(spends[1]!), height: at + 1 };
    index.appendHeight(at + 1, [repeat]);
    expect(index.error).toContain(`cannot be read: a Dust commitment position ${spends[1]!.treeIndex} after ${lastPosition}`);
    expect(index.entries).toBe(before);
    index.appendHeight(at + 2, [dustEventOf(spends[9]!, at + 2)]);
    expect(index.entries).toBe(before);
    expect(index.height).toBe(at + 2);

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
