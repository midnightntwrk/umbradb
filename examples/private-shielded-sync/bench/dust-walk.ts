/**
 * Times the Dust walk (spec 00062 phase 8) on a synthetic Dust file: `walkDustChains`, one pass over the file for all
 * chains, against `walkDustChainsOneByOne`, a search of the file per chain, for several chain counts. The ledger's
 * functions are stand-ins that cost nothing (a coin's nullifier is a number it carries, its successor the next number
 * of its chain), so only the reading of the file is timed. Both walks must give the same chains; the run stops if not.
 *
 *   node examples/private-shielded-sync/bench/dust-walk.ts [--entries 10000000] [--chains 1,100,10000] [--spends 5]
 *        [--runs 3]
 *
 * The file is built in memory as the wallet holds it, decoded chunks of 4,096 entries (about 280 MB for 10,000,000
 * entries: 4-byte prefixes, times and positions as `Float64Array`s, one shared fee), and never written. The chains
 * start at entries spread evenly over the file's first half (a single chain at the first entry) and each spends
 * `--spends` times at random later entries; the other entries' prefixes are random, so a few of them match a chain's
 * prefix, in both walks alike. Times are the best of `--runs`; the search per chain is run once when it would take more
 * than about a minute.
 */

import { randomFillSync } from "node:crypto";
import { parseArgs } from "node:util";
import { type DustChainStart, type DustCoin, DustFileView, type DustFunctions, walkDustChains, walkDustChainsOneByOne } from "../client/dust.ts";
import { DUST_CHUNK_ENTRIES, type DustChunk } from "../shared/index.ts";

const { values } = parseArgs({
  options: {
    entries: { type: "string", default: "10000000" },
    chains: { type: "string", default: "1,100,10000" },
    spends: { type: "string", default: "5" },
    runs: { type: "string", default: "3" },
  },
});
const entries = Number(values.entries);
const chainCounts = values.chains!.split(",").map(Number);
const spendsPerChain = Number(values.spends);
const runs = Number(values.runs);

// ── the file ─────────────────────────────────────────────────────────────────────────────────────────────────────

let t = performance.now();
const prefixes = new Uint8Array(entries * 4);
randomFillSync(prefixes);
const times = new Float64Array(entries);
const positions = new Float64Array(entries);
for (let i = 0; i < entries; i++) {
  times[i] = 1_794_000_000 + Math.floor(i / 10);
  positions[i] = 1_000 + i;
}
const fee = 1_000n;
const chunks: DustChunk[] = [];
for (let first = 0; first < entries; first += DUST_CHUNK_ENTRIES) {
  const count = Math.min(DUST_CHUNK_ENTRIES, entries - first);
  chunks.push({
    first,
    firstHeight: first,
    prefixBytes: 4,
    count,
    prefixes: prefixes.subarray(first * 4, (first + count) * 4),
    times: times.subarray(first, first + count),
    fees: new Array<bigint>(count).fill(fee),
    positions: positions.subarray(first, first + count),
  });
}
const file = new DustFileView(chunks, 4);
const buildMs = performance.now() - t;

// ── the chains: each coin's nullifier is the next number of its chain ────────────────────────────────────────────────

const random32 = (): number => randomFillSync(new Uint32Array(1))[0]!;
/** Each chain's nullifiers, coin by coin, by the chain's name. */
const nullifiers = new Map<string, number[]>();
const fake: DustFunctions = {
  // A chain that took another wallet's entry (a random prefix that matched) goes on with fresh random numbers.
  nullifier: (coin) => {
    const numbers = nullifiers.get(coin.backingNight)!;
    while (numbers.length <= coin.seq) numbers.push(random32());
    return BigInt(numbers[coin.seq]!);
  },
  successor: (coin, time, fee, position) => ({ ...coin, seq: coin.seq + 1, ctime: time, initialValue: coin.initialValue - fee, mtIndex: position }),
};

/** `count` chains planted in the file (their entries' prefixes set); the file is restored by `unplant`. */
function plant(count: number): { starts: DustChainStart[]; unplant: () => void } {
  const used = new Set<number>();
  const saved: [number, number][] = [];
  const starts: DustChainStart[] = [];
  const view = new DataView(prefixes.buffer, prefixes.byteOffset, prefixes.byteLength);
  for (let c = 0; c < count; c++) {
    const name = `chain-${c}`;
    // Starts spread evenly over the file's first half (one chain starts at the first entry).
    const startEntry = Math.floor((c * entries) / (2 * count));
    const numbers = Array.from({ length: spendsPerChain + 1 }, random32);
    nullifiers.set(name, numbers);
    const at = new Set<number>();
    while (at.size < spendsPerChain) {
      const i = startEntry + 1 + Math.floor(Math.random() * (entries - startEntry - 1));
      if (!used.has(i)) {
        used.add(i);
        at.add(i);
      }
    }
    [...at].sort((a, b) => a - b).forEach((i, k) => {
      saved.push([i, view.getUint32(i * 4, true)]);
      view.setUint32(i * 4, numbers[k]!, true);
    });
    const coin: DustCoin = { initialValue: 1n << 60n, owner: 1n, nonce: 0n, seq: 0, ctime: new Date(0), backingNight: name, mtIndex: BigInt(positions[startEntry]!) };
    starts.push({ height: 0, generationIndex: BigInt(c), coin, generation: { value: 1n, owner: 1n, nonce: name, dtime: undefined } });
  }
  return { starts, unplant: () => saved.reverse().forEach(([i, v]) => view.setUint32(i * 4, v, true)) };
}

const summary = (chains: Awaited<ReturnType<typeof walkDustChains>>): string => chains.map((c) => c.steps.map((s) => s.entry).join(",")).join(";");

async function best(walk: () => Promise<unknown>, times: number): Promise<number> {
  let out = Number.POSITIVE_INFINITY;
  for (let r = 0; r < times; r++) {
    const started = performance.now();
    await walk();
    out = Math.min(out, performance.now() - started);
  }
  return out;
}

const rows: { chains: number; spends: number; onePassMs: number; perChainMs: number; perChainRuns: number }[] = [];
let perChainMsPerChain = 0;
for (const count of chainCounts) {
  const { starts, unplant } = plant(count);
  const one = await walkDustChains(file, starts, [], fake);
  const spends = one.reduce((n, c) => n + c.steps.length, 0);
  const onePassMs = await best(() => walkDustChains(file, starts, [], fake), runs);
  // The search per chain: once when it would take more than about a minute.
  const perChainRuns = perChainMsPerChain * count > 60_000 ? 1 : runs;
  let each: Awaited<ReturnType<typeof walkDustChains>> = [];
  const perChainMs = await best(async () => {
    each = await walkDustChainsOneByOne(file, starts, [], fake);
  }, perChainRuns);
  if (summary(each) !== summary(one)) throw new Error(`the two walks differ for ${count} chains`);
  perChainMsPerChain = perChainMs / count;
  rows.push({ chains: count, spends, onePassMs, perChainMs, perChainRuns });
  unplant();
}

const f = (ms: number): string => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(1)} ms`);
const lines = [
  `Dust walk over ${entries.toLocaleString("en-US")} entries (${chunks.length.toLocaleString("en-US")} chunks; built in ${f(buildMs)}), ${spendsPerChain} spends per chain, stand-in ledger functions; best of ${runs}`,
  "",
  "| Chains | Spends found | One pass for all chains | A search per chain | Ratio |",
  "|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.chains.toLocaleString("en-US")} | ${r.spends.toLocaleString("en-US")} | ${f(r.onePassMs)} | ${f(r.perChainMs)}${r.perChainRuns === 1 ? " (one run)" : ""} | ${(r.perChainMs / r.onePassMs).toFixed(1)}× |`),
];
process.stdout.write(`${lines.join("\n")}\n\n${JSON.stringify({ entries, spendsPerChain, runs, buildMs, node: process.version, rows }, null, 2)}\n`);
