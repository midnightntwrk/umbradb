/**
 * The one-pass walk of all chains (`walkDustChains`, spec 00062 phase 8) against the search per chain it replaced
 * (`walkDustChainsOneByOne`, kept as the reference): on the same files, both must give the same chains, entry for
 * entry: the same spends, file entries, coins, dropped matches, statuses, and the same check batches.
 *
 * The files are built here, with stand-in ledger functions shaped as the ledger's (the next coin's nonce depends on its
 * sequence number only, its value and creation time on the spend; the nullifier on all three) and with the vendored
 * ledger's own functions. They hold: many chains, false matches placed before real spends, chains starting in the
 * middle of the file, two chains wanting the same prefix at the same time (one of them starting later), chains with no
 * spend, and prefixes of 4, 2 and 6 bytes.
 */

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import {
  type DustBatchCheck,
  type DustChain,
  type DustChainStart,
  type DustCoin,
  DustFileView,
  type DustFunctions,
  type DustUpdate,
  ledgerDustFunctions,
  walkDustChains,
  walkDustChainsOneByOne,
} from "../client/dust.ts";
import type { DustCheckOutcome } from "../client/dust-check.ts";
import { decodeDustChunk, dustChunkOf, dustChunkRanges, type DustEntry, dustPrefixOfField, encodeDustChunk } from "../shared/index.ts";

const field = (...parts: unknown[]): bigint => BigInt(`0x${createHash("sha256").update(parts.map(String).join("/")).digest("hex")}`) >> 4n;

const fake: DustFunctions = {
  nullifier: (coin) => field("nullifier", coin.nonce, coin.initialValue, coin.ctime.getTime()),
  successor: (coin, time, fee, position) => ({ ...coin, seq: coin.seq + 1, nonce: field("nonce", coin.backingNight, coin.seq + 1), ctime: time, initialValue: coin.initialValue - fee, mtIndex: position }),
};
const commitmentOf = (coin: DustCoin): bigint => field("commitment", coin.nonce, coin.initialValue, coin.ctime.getTime());

/** A deterministic generator. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}

/** Entries at positions 100, 102, …; random prefixes; times that mostly rise; fees that vary. */
function baseEntries(count: number, width: number, r: () => number): DustEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    prefix: Uint8Array.from({ length: width }, () => Math.floor(r() * 256)),
    time: 1_794_000_000 + 30 * i - Math.floor(r() * 20),
    fee: 1_000n + BigInt(Math.floor(r() * 50)),
    position: 100 + 2 * i,
  }));
}

/** The file as a wallet holds it: chunks encoded and decoded again. */
function fileOf(entries: readonly DustEntry[], width: number, chunkEntries: number): DustFileView {
  const chunks = dustChunkRanges(entries.length, chunkEntries).map(({ first, count }) => decodeDustChunk(encodeDustChunk(dustChunkOf(first, 1 + first, entries.slice(first, first + count), width))));
  return new DustFileView(chunks, width);
}

function start(name: string, position: number, sameAs?: DustChainStart): DustChainStart {
  const owner = 1n;
  const backingNight = name.padEnd(64, "0");
  // A chain made to want the same first prefix as `sameAs`: the same nonce, value and creation time.
  const coin: DustCoin = sameAs
    ? { ...sameAs.coin, backingNight, mtIndex: BigInt(position) }
    : { initialValue: 10_000_000n, owner, nonce: field("first", name), seq: 0, ctime: new Date(1_794_000_000_000), backingNight, mtIndex: BigInt(position) };
  return { height: 1, generationIndex: BigInt(position), coin, generation: { value: 1_000n, owner, nonce: backingNight, dtime: undefined } };
}

interface World {
  readonly file: DustFileView;
  readonly starts: DustChainStart[];
  /** Commitments the chain records, by position: what a check reads. */
  readonly recorded: Map<bigint, bigint>;
  readonly limit: number;
}

/**
 * A file of `count` entries with `chains` chains: each starts at a random position (some in the middle of the file),
 * spends 0 to 4 times at random later entries, and one in three gets another wallet's entry with its current prefix
 * before one of its spends. The last two chains want the same first prefix (the second starting later).
 */
function world(seed: number, count: number, chains: number, width: number, fns: DustFunctions = fake): World {
  const r = rng(seed);
  const entries = baseEntries(count, width, r);
  const used = new Set<number>();
  const free = (from: number): number => {
    for (let tries = 0; tries < 1000; tries++) {
      const i = from + Math.floor(r() * (count - from));
      if (i < count && !used.has(i)) {
        used.add(i);
        return i;
      }
    }
    return -1;
  };
  const prefixOf = (coin: DustCoin): Uint8Array => dustPrefixOfField(fns.nullifier(coin), width);
  const recorded = new Map<bigint, bigint>();
  const starts: DustChainStart[] = [];
  for (let c = 0; c < chains; c++) {
    const startEntry = Math.floor(r() * count * (c % 3 === 0 ? 0.6 : 0.1));
    const sameAs = c === chains - 1 ? starts[chains - 2] : undefined;
    const s = start(`chain-${seed}-${c}`, sameAs !== undefined ? Number(sameAs.coin.mtIndex) + 1 : 99 + 2 * startEntry, sameAs);
    starts.push(s);
    recorded.set(s.coin.mtIndex, commitmentOf(s.coin));
    let coin = s.coin;
    let from = startEntry;
    const spends = c % 5 === 4 ? 0 : 1 + Math.floor(r() * 4);
    for (let k = 0; k < spends && from < count - 1; k++) {
      const at = free(from);
      if (at < 0) break;
      if (c % 3 === 1 && k === 0 && at > from) {
        // Another wallet's spend with this chain's prefix, before its own.
        for (let f = from; f < at; f++) {
          if (!used.has(f)) {
            used.add(f);
            entries[f] = { ...entries[f]!, prefix: prefixOf(coin) };
            break;
          }
        }
      }
      entries[at] = { ...entries[at]!, prefix: prefixOf(coin) };
      const e = entries[at]!;
      coin = fns.successor(coin, new Date(e.time * 1000), e.fee, BigInt(e.position), s.generation);
      recorded.set(coin.mtIndex, commitmentOf(coin));
      from = at + 1;
    }
  }
  return { file: fileOf(entries, width, 128), starts, recorded, limit: 100 + 2 * Math.floor(count * 0.9) };
}

/** A check over `recorded`: the commitment at the coin's position; positions at or beyond `limit` not readable. Logs each batch. */
function checkOf(w: World, log: unknown[]): DustBatchCheck {
  return async (ends) => {
    const outcomes: DustCheckOutcome[] = ends.map((e) => (Number(e.coin.mtIndex) >= w.limit ? "beyond" : w.recorded.get(e.coin.mtIndex) === commitmentOf(e.coin) ? "match" : "mismatch"));
    log.push(ends.map((e, i) => [e.entry, Number(e.coin.mtIndex), outcomes[i]]));
    return outcomes;
  };
}

const view = (chains: readonly DustChain[]) => chains.map((c) => ({ entries: c.steps.map((s) => s.entry), steps: c.steps, dropped: c.dropped, coin: c.coin, status: c.status }));

async function compare(w: World, updates: readonly DustUpdate[] = [], fns: DustFunctions = fake): Promise<{ one: DustChain[]; checked: DustChain[] }> {
  const one = await walkDustChains(w.file, w.starts, updates, fns);
  const each = await walkDustChainsOneByOne(w.file, w.starts, updates, fns);
  expect(view(one)).toEqual(view(each));
  const logOne: unknown[] = [];
  const logEach: unknown[] = [];
  const checked = await walkDustChains(w.file, w.starts, updates, fns, checkOf(w, logOne));
  const checkedEach = await walkDustChainsOneByOne(w.file, w.starts, updates, fns, checkOf(w, logEach));
  expect(view(checked)).toEqual(view(checkedEach));
  expect(logOne).toEqual(logEach);
  return { one, checked };
}

describe("one pass over the file for all chains gives what a search per chain gives", () => {
  it("many chains, false matches, chains starting in the middle, two chains wanting one prefix, chains with no spend (4-byte prefixes, several files)", async () => {
    let sawDropped = 0;
    let sawShared = 0;
    let sawNoSpend = 0;
    let sawMiddle = 0;
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const w = world(seed, 4_000, 40, 4);
      const { one, checked } = await compare(w);
      sawDropped += checked.reduce((n, c) => n + c.dropped.length, 0);
      sawNoSpend += one.filter((c) => c.status === "no-spend").length;
      sawMiddle += w.starts.filter((s) => Number(s.coin.mtIndex) > 100 + 2 * 1_000 && one.find((c) => c.start === s)!.steps.length > 0).length;
      // The last two chains wanted one prefix at once: the later one takes the shared entry only from its own place.
      const [a, b] = [one.at(-2)!, one.at(-1)!];
      if (a.steps.length > 0 && b.steps.length > 0 && a.steps[0]!.entry === b.steps[0]!.entry) sawShared++;
    }
    // The files hold every case the comparison is about.
    expect(sawDropped).toBeGreaterThan(0);
    expect(sawShared).toBeGreaterThan(0);
    expect(sawNoSpend).toBeGreaterThan(0);
    expect(sawMiddle).toBeGreaterThan(0);
  });

  it("two chains wanting one prefix take the same entry, each from its own coin; a chain whose place is later does not take an earlier entry", async () => {
    const r = rng(9);
    const entries = baseEntries(200, 4, r);
    const a = start("shared-a", 99);
    const b = start("shared-b", 99, a);
    const late = start("shared-late", 99 + 2 * 120, a);
    const prefix = dustPrefixOfField(fake.nullifier(a.coin), 4);
    entries[50] = { ...entries[50]!, prefix };
    entries[150] = { ...entries[150]!, prefix };
    const file = fileOf(entries, 4, 64);
    const w: World = { file, starts: [a, b, late], recorded: new Map(), limit: 1e9 };
    const { one } = await compare(w);
    expect(one.map((c) => c.steps.map((s) => s.entry))).toEqual([[50], [50], [150]]);
    // Each derived its own next coin (its nonce comes from its own Night output).
    expect(one[0]!.coin.nonce).not.toBe(one[1]!.coin.nonce);
  });

  it("prefixes of 2 and 6 bytes", async () => {
    for (const width of [2, 6]) {
      // With 2-byte prefixes, other wallets' entries match often: the check drops many of them.
      const w = world(11 + width, 1_500, 12, width);
      const { checked } = await compare(w);
      expect(checked.length).toBe(12);
    }
  });

  it("the vendored ledger's own functions", async () => {
    const secretKey = ledger.DustSecretKey.fromSeed(new Uint8Array(32).fill(5));
    const fns = ledgerDustFunctions(ledger as never, secretKey, new ledger.DustParameters(5_000_000_000n, 8_267n, 10_800n));
    const owner = secretKey.publicKey;
    const r = rng(21);
    const entries = baseEntries(600, 4, r);
    const starts: DustChainStart[] = [];
    let used = 10;
    for (let c = 0; c < 6; c++) {
      const backingNight = `${c}`.repeat(64);
      const s: DustChainStart = {
        height: 1,
        generationIndex: BigInt(c),
        coin: { initialValue: 0n, owner, nonce: ledger.dustFirstNonce(backingNight, owner), seq: 0, ctime: new Date(1_793_999_000_000), backingNight, mtIndex: BigInt(99 + 40 * c) },
        generation: { value: 1_000_000_000n, owner, nonce: backingNight, dtime: undefined },
      };
      starts.push(s);
      let coin = s.coin;
      for (let k = 0; k < c % 4; k++) {
        used += 7 + c;
        const at = used + 20 * c;
        entries[at] = { ...entries[at]!, prefix: dustPrefixOfField(fns.nullifier(coin), 4) };
        const e = entries[at]!;
        coin = fns.successor(coin, new Date(e.time * 1000), e.fee, BigInt(e.position), s.generation);
      }
    }
    const w: World = { file: fileOf(entries, 4, 100), starts, recorded: new Map(), limit: 1e9 };
    const one = await walkDustChains(w.file, starts, [], fns);
    const each = await walkDustChainsOneByOne(w.file, starts, [], fns);
    expect(view(one)).toEqual(view(each));
    expect(one.map((c) => c.steps.length)).toEqual([0, 1, 2, 3, 0, 1]);
  });

  it("an empty file, and no chain", async () => {
    const empty = new DustFileView([], 4);
    const s = start("alone", 99);
    expect(view(await walkDustChains(empty, [s], [], fake))).toEqual(view(await walkDustChainsOneByOne(empty, [s], [], fake)));
    expect(await walkDustChains(empty, [], [], fake)).toEqual([]);
  });
});
