/**
 * The wallet's walk of its Dust chains through the file (spec 00062 story 2, FR-021 to FR-023; `client/dust.ts`):
 *
 * - with stand-in ledger functions, on files built here: a chain of several spends across chunks, a match below the
 *   coin's own position (not searched), a false match before the real one (taken without a check; dropped with one,
 *   and the search resumed after it), a chain with no spend, two chains in one file;
 * - with the vendored ledger's own functions: a chain derived with `successorDustUtxo`, found again from the encoded
 *   file; what a generation record's `dtime` changes in the derived coin;
 * - the coins answer decoded from real Preprod events.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import {
  type DustChainStart,
  type DustCoin,
  type DustFunctions,
  type DustGeneration,
  DustFileView,
  decodeDustCoins,
  generationOf,
  ledgerDustFunctions,
  walkDustChain,
} from "../client/dust.ts";
import { decodeDustChunk, dustChunkOf, dustChunkRanges, type DustEntry, dustPrefixOfField, encodeDustChunk } from "../shared/index.ts";

const field = (...parts: unknown[]): bigint => BigInt(`0x${createHash("sha256").update(parts.map(String).join("/")).digest("hex")}`) >> 4n;

/**
 * Stand-ins for the ledger, shaped as its functions are: the next coin's nonce depends on the sequence number only,
 * its value and creation time on the spend's fee and declared time, and the nullifier on all three (so a coin derived
 * from another wallet's entry has another nullifier).
 */
const fake: DustFunctions = {
  nullifier: (coin) => field("nullifier", coin.nonce, coin.initialValue, coin.ctime.getTime()),
  successor: (coin, time, fee, position) => ({ ...coin, seq: coin.seq + 1, nonce: field("nonce", coin.backingNight, coin.seq + 1), ctime: time, initialValue: coin.initialValue - fee, mtIndex: position }),
};
/** A coin's commitment, for the check: what the chain records at the coin's position. */
const commitmentOf = (coin: DustCoin): bigint => field("commitment", coin.nonce, coin.initialValue, coin.ctime.getTime());

function start(name: string, position: number, owner = 1n): DustChainStart {
  const nonce = field("first", name);
  const generation: DustGeneration = { value: 1_000n, owner, nonce: name.padEnd(64, "0"), dtime: undefined };
  return {
    height: 10,
    generationIndex: 0n,
    coin: { initialValue: 1_000_000n, owner, nonce, seq: 0, ctime: new Date(1_794_000_000_000), backingNight: generation.nonce, mtIndex: BigInt(position) },
    generation,
  };
}

/** A file's entries: `noise` entries of random prefixes, with `placed[i]` put at entry `i`; positions rise from 100. */
function entriesWith(noise: number, placed: ReadonlyMap<number, Omit<DustEntry, "position">>): DustEntry[] {
  const out: DustEntry[] = [];
  let seed = 7;
  for (let i = 0; i < noise; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const p = placed.get(i);
    out.push({ prefix: p?.prefix ?? Uint8Array.of(seed & 0xff, (seed >> 8) & 0xff, (seed >> 16) & 0xff, 0xee), time: p?.time ?? 1_794_000_100 + i, fee: p?.fee ?? 5n, position: 100 + 2 * i });
  }
  return out;
}

/** The file as a wallet holds it: chunks of `chunkEntries`, encoded and decoded again. */
function fileOf(entries: readonly DustEntry[], chunkEntries = 8): DustFileView {
  const chunks = dustChunkRanges(entries.length, chunkEntries).map(({ first, count }) => decodeDustChunk(encodeDustChunk(dustChunkOf(first, 1000 + first, entries.slice(first, first + count)))));
  return new DustFileView(chunks, 4);
}

/**
 * A chain's spends placed at `at` (entry numbers): each entry carries the prefix of the coin it spends; returns the
 * placed entries and the coins the walk must derive.
 */
function chainAt(s: DustChainStart, at: readonly number[], fn: DustFunctions = fake): { placed: Map<number, Omit<DustEntry, "position">>; coins: DustCoin[] } {
  const placed = new Map<number, Omit<DustEntry, "position">>();
  const coins: DustCoin[] = [];
  let coin = s.coin;
  at.forEach((i, k) => {
    const entry = { prefix: dustPrefixOfField(fn.nullifier(coin)), time: 1_794_000_100 + i, fee: BigInt(10 + k) };
    placed.set(i, entry);
    coin = fn.successor(coin, new Date(entry.time * 1000), entry.fee, BigInt(100 + 2 * i), s.generation);
    coins.push(coin);
  });
  return { placed, coins };
}

const merge = (...maps: Map<number, Omit<DustEntry, "position">>[]): Map<number, Omit<DustEntry, "position">> => new Map(maps.flatMap((m) => [...m]));

describe("walking a Dust chain through the file (stand-in ledger)", () => {
  it("a chain of several spends across chunks: each spend found at its entry, the last coin the one derived spend by spend", async () => {
    const s = start("a", 50);
    const { placed, coins } = chainAt(s, [3, 9, 10, 22, 37]);
    const file = fileOf(entriesWith(40, placed));
    expect(file.chunks).toHaveLength(5);
    const chain = await walkDustChain(file, s, [], fake);
    expect(chain.steps.map((step) => step.entry)).toEqual([3, 9, 10, 22, 37]);
    expect(chain.steps.map((step) => step.position)).toEqual([106, 118, 120, 144, 174]);
    expect(chain.coin).toEqual(coins.at(-1));
    expect(chain.coin.seq).toBe(5);
    expect(chain.dropped).toEqual([]);
  });

  it("FR-021: an entry at or below the coin's own position is not searched (a spend is appended after the coin it spends)", async () => {
    // The coin sits at position 120 (entry 10's): a match at entry 4 (position 108) is not its spend.
    const s = start("b", 120);
    const early = new Map([[4, { prefix: dustPrefixOfField(fake.nullifier(s.coin)), time: 1_794_000_104, fee: 1n }]]);
    const { placed, coins } = chainAt(s, [15]);
    const chain = await walkDustChain(fileOf(entriesWith(24, merge(early, placed))), s, [], fake);
    expect(chain.steps.map((step) => step.entry)).toEqual([15]);
    expect(chain.coin).toEqual(coins[0]);
  });

  it("story 2, scenario 2 + FR-023: a false match before the real one is taken without a check (its entry reported); a check refusing it drops it and the search resumes after it", async () => {
    const s = start("c", 50);
    const { placed, coins } = chainAt(s, [12, 20]);
    // Another wallet's spend with the same prefix as the first coin's, before the real one.
    const forged = new Map([[6, { prefix: placed.get(12)!.prefix, time: 1_794_000_106, fee: 99n }]]);
    const file = fileOf(entriesWith(30, merge(forged, placed)));

    const unchecked = await walkDustChain(file, s, [], fake);
    expect(unchecked.steps.map((step) => step.entry)).toEqual([6]);
    expect(unchecked.coin).not.toEqual(coins.at(-1));

    // The chain's recorded commitments, by position: what the private check reads.
    const recorded = new Map(coins.map((c) => [c.mtIndex, commitmentOf(c)]));
    const checked: number[] = [];
    const check = (coin: DustCoin, entry: number): boolean => {
      checked.push(entry);
      return recorded.get(coin.mtIndex) === commitmentOf(coin);
    };
    const chain = await walkDustChain(file, s, [], fake, check);
    expect(chain.dropped).toEqual([6]);
    expect(chain.steps.map((step) => step.entry)).toEqual([12, 20]);
    expect(chain.coin).toEqual(coins.at(-1));
    // One check per end of search: the false match's coin, then the real chain's last coin.
    expect(checked).toEqual([6, 20]);
  });

  it("a chain with no spend: its first coin is the current coin, and it is not checked", async () => {
    const s = start("d", 50);
    let checks = 0;
    const chain = await walkDustChain(fileOf(entriesWith(20, new Map())), s, [], fake, () => (checks++, true));
    expect([chain.steps, chain.dropped, chain.coin, checks]).toEqual([[], [], s.coin, 0]);
    // An empty file.
    expect((await walkDustChain(new DustFileView([], 4), s, [], fake)).coin).toEqual(s.coin);
  });

  it("two chains in one file, their spends interleaved: each finds its own", async () => {
    const one = start("e", 50);
    const two = start("f", 104);
    const a = chainAt(one, [1, 5, 9, 30]);
    const b = chainAt(two, [4, 8, 31]);
    const file = fileOf(entriesWith(36, merge(a.placed, b.placed)), 16);
    const [ca, cb] = [await walkDustChain(file, one, [], fake), await walkDustChain(file, two, [], fake)];
    expect(ca.steps.map((step) => step.entry)).toEqual([1, 5, 9, 30]);
    expect(cb.steps.map((step) => step.entry)).toEqual([4, 8, 31]);
    expect([ca.coin, cb.coin]).toEqual([a.coins.at(-1), b.coins.at(-1)]);
  });

  it("the generation record passed: the first coin's, with the dtime of the update of the same record", () => {
    const s = start("g", 50);
    const dtime = new Date(1_794_100_000_000);
    expect(generationOf(s, [])).toBe(s.generation);
    expect(generationOf(s, [{ height: 11, nonce: "other".padEnd(64, "0"), dtime }])).toBe(s.generation);
    expect(generationOf(s, [{ height: 11, nonce: s.generation.nonce, dtime }])).toEqual({ ...s.generation, dtime });
  });

  it("refuses chunks that do not follow each other", () => {
    const chunks = dustChunkRanges(16, 8).map(({ first, count }) => decodeDustChunk(encodeDustChunk(dustChunkOf(first, 1, entriesWith(16, new Map()).slice(first, first + count)))));
    expect(() => new DustFileView([chunks[1]!, chunks[0]!], 4)).toThrow(/starts at entry 8/);
    expect(() => new DustFileView([chunks[0]!], 3)).toThrow(/4-byte prefixes in a file of 3/);
  });
});

describe("walking a Dust chain with the ledger's own functions (vendored ledger 9)", () => {
  const secretKey = ledger.DustSecretKey.fromSeed(new Uint8Array(32).fill(7));
  const owner = secretKey.publicKey;
  const params = new ledger.DustParameters(5_000_000_000n, 8_267n, 10_800n);
  const functions = ledgerDustFunctions(ledger as never, secretKey, params);
  const backingNight = "ab".repeat(32);
  const ctime = new Date(1_794_000_000_000);
  const first: DustChainStart = {
    height: 10,
    generationIndex: 3n,
    coin: { initialValue: 0n, owner, nonce: ledger.dustFirstNonce(backingNight, owner), seq: 0, ctime, backingNight, mtIndex: 3n },
    // 1,000 Night (in Stars) backing the chain.
    generation: { value: 1_000_000_000n, owner, nonce: backingNight, dtime: undefined },
  };

  it("story 2: a chain derived with successorDustUtxo is found again from the encoded file, its last coin and commitment the ledger's", async () => {
    const { placed, coins } = chainAt(first, [2, 11, 12, 29], functions);
    // The ledger's nullifiers, as the file stores their first bytes.
    expect([...placed.values()][0]!.prefix).toEqual(dustPrefixOfField(ledger.dustNullifier(first.coin, secretKey)));
    const chain = await walkDustChain(fileOf(entriesWith(32, placed)), first, [], functions);
    expect(chain.steps.map((step) => step.entry)).toEqual([2, 11, 12, 29]);
    expect(chain.coin).toEqual(coins.at(-1));
    expect(chain.coin.seq).toBe(4);
    expect(chain.coin.mtIndex).toBe(158n);
    expect(ledger.dustCommitment(chain.coin)).toBe(ledger.dustCommitment(coins.at(-1)!));
    // Each coin's value: the one before, grown by the generation until the spend's time, less the fee.
    expect(chain.coin.initialValue).toBeGreaterThan(0n);
  });

  it("a dtime later than the spend's declared time leaves the derived coin unchanged; an earlier one changes its value only", () => {
    const at = new Date(ctime.getTime() + 6 * 3_600_000);
    const derive = (dtime: Date | undefined) => ledger.successorDustUtxo(first.coin, at, 1_000n, 9n, { ...first.generation, dtime }, secretKey, params);
    const none = derive(undefined);
    expect(derive(new Date(at.getTime() + 1_000))).toEqual(none);
    expect(derive(new Date(at.getTime() + 86_400_000))).toEqual(none);
    const before = derive(new Date(ctime.getTime() + 3_600_000));
    expect(before.initialValue).toBeLessThan(none.initialValue);
    expect({ ...before, initialValue: none.initialValue }).toEqual(none);
  });
});

describe("the coins answer, decoded from real Preprod events", () => {
  const events = (JSON.parse(readFileSync(new URL("./fixtures/dust-events.json", import.meta.url), "utf8")) as { events: { height: number; kind: string; bytes: string }[] }).events;
  const ownerOf = (bytes: string): bigint => (ledger.Event.deserialize(Buffer.from(bytes, "hex")).content as unknown as { output: { owner: bigint } }).output.owner;
  const firsts = events.filter((e) => e.kind === "dust-initial-utxo");
  const updates = events.filter((e) => e.kind === "dust-generation-dtime-update");
  const owner = ownerOf(firsts.find((e) => firsts.filter((f) => ownerOf(f.bytes) === ownerOf(e.bytes)).length === 2)!.bytes);
  const mine = firsts.filter((e) => ownerOf(e.bytes) === owner);
  const answer = { owner: owner.toString(), eraHeight: 0, height: 4_000_000, firstCoins: mine.map((e) => ({ height: e.height, bytes: e.bytes })), updates: updates.map((e) => ({ height: e.height, bytes: e.bytes })) };

  it("gives each first coin's coin and generation record, and each update's record nonce and dtime; the update names the first coin's record", () => {
    const decoded = decodeDustCoins(ledger as never, answer, owner);
    expect(decoded.starts).toHaveLength(2);
    for (const s of decoded.starts) expect([s.coin.owner, s.generation.owner, s.coin.seq]).toEqual([owner, owner, 0]);
    expect(decoded.updates).toHaveLength(1);
    expect(decoded.updates[0]!.dtime).toBeInstanceOf(Date);
    expect(generationOf(decoded.starts[0]!, decoded.updates).dtime).toEqual(decoded.updates[0]!.dtime);
    expect(generationOf(decoded.starts[1]!, decoded.updates).dtime).toBeUndefined();
  });

  it("refuses an answer for another owner, an event of another owner, and an event of another kind", () => {
    expect(() => decodeDustCoins(ledger as never, answer, owner + 1n)).toThrow(/another owner/);
    const other = firsts.find((e) => ownerOf(e.bytes) !== owner)!;
    expect(() => decodeDustCoins(ledger as never, { ...answer, firstCoins: [{ height: other.height, bytes: other.bytes }] }, owner)).toThrow(/first coin of another owner/);
    expect(() => decodeDustCoins(ledger as never, { ...answer, firstCoins: [], updates: [{ height: 1, bytes: mine[0]!.bytes }] }, owner)).toThrow(/tagged dustInitialUtxo/);
  });
});
