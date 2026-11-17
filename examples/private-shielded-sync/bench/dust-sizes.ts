/**
 * Measures the Dust file on a real chain (spec 00062 FR-030): reads every `dust-spend-processed` event the core stored,
 * builds the file (`../shared/dust-file.ts`) and reports its size field by field.
 *
 *   node examples/private-shielded-sync/bench/dust-sizes.ts --db-url postgres://postgres@127.0.0.1:51158/poc_ipir \
 *     --db-password-file <file> --out examples/private-shielded-sync/bench/results/<date>-preprod-dust
 *
 * The Dust state restarts where the ledger's event format changes (the commitment positions start again), so each
 * format is its own file: `earlier` (events tagged `midnight:event[v9]:`, decoded with ledger-v8) and `current`
 * (`midnight:event[v14]:`, decoded with ledger-v9). Only `current` is what the module serves; `earlier` is measured for
 * its size alone. Needs the client's install for the two ledger packages.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { brotliCompressSync, constants, gzipSync, zstdCompressSync } from "node:zlib";
import postgres from "postgres";
import { loadLedger, loadLedgerV8 } from "../client/ledger.ts";
import {
  decodeDustChunk,
  DUST_CHUNK_ENTRIES,
  DUST_PREFIX_BYTES,
  dustChunkLayout,
  dustChunkOf,
  dustChunkRanges,
  type DustEntry,
  dustPrefix,
  encodeDustChunk,
} from "../shared/index.ts";

const { values } = parseArgs({
  options: {
    "db-url": { type: "string" },
    "db-password-file": { type: "string" },
    out: { type: "string" },
    "prefix-bytes": { type: "string", default: String(DUST_PREFIX_BYTES) },
    "chunk-entries": { type: "string", default: String(DUST_CHUNK_ENTRIES) },
  },
});
if (values["db-url"] === undefined || values.out === undefined) throw new Error("--db-url and --out are required");
const prefixBytes = Number(values["prefix-bytes"]);
const chunkEntries = Number(values["chunk-entries"]);

const ledgers = { earlier: await loadLedgerV8(), current: await loadLedger() } as const;
type Era = keyof typeof ledgers;
const CURRENT_TAG = "midnight:event[v14]:";

interface Spend extends DustEntry {
  readonly height: number;
  readonly transaction: number;
}

const password = values["db-password-file"] === undefined ? undefined : readFileSync(values["db-password-file"], "utf8").trim();
const sql = postgres(values["db-url"], { password, max: 2 });

const started = performance.now();
const spends: Record<Era, Spend[]> = { earlier: [], current: [] };
let lastHeight = 0;
await sql`select height, tx_index, bytes, nullifier, tree_index from core_ledger_state.events where kind = 'dust-spend-processed' order by height, tx_index, event_index`.cursor(20_000, (rows) => {
  for (const r of rows) {
    const bytes = r.bytes as Uint8Array;
    const era: Era = Buffer.from(bytes.subarray(0, CURRENT_TAG.length)).toString("latin1") === CURRENT_TAG ? "current" : "earlier";
    const content = ledgers[era].Event.deserialize(bytes).content as unknown as { vFee: bigint; declaredTime: Date; commitmentIndex: bigint };
    lastHeight = Number(r.height);
    spends[era].push({
      height: lastHeight,
      transaction: Number(r.tx_index),
      prefix: dustPrefix(r.nullifier as Uint8Array, prefixBytes),
      time: Math.round(content.declaredTime.getTime() / 1000),
      fee: content.vFee,
      position: Number(content.commitmentIndex),
    });
    if (Number(r.tree_index) !== Number(content.commitmentIndex)) throw new Error(`height ${r.height}: the stored position differs from the event's`);
  }
});
await sql.end();
const readMs = performance.now() - started;

const zstd = (b: Uint8Array): number => zstdCompressSync(b, { params: { [constants.ZSTD_c_compressionLevel]: 19 } }).length;
const brotli = (b: Uint8Array): number => brotliCompressSync(b, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;

function measure(era: Era, all: Spend[]) {
  const t0 = performance.now();
  const chunks = dustChunkRanges(all.length, chunkEntries).map(({ first, count }) =>
    encodeDustChunk(dustChunkOf(first, all[first]!.height, all.slice(first, first + count), prefixBytes)),
  );
  const buildMs = performance.now() - t0;

  // Every chunk decodes to the entries it was built from.
  chunks.forEach((bytes, c) => {
    const chunk = decodeDustChunk(bytes);
    for (let i = 0; i < chunk.count; i++) {
      const e = all[chunk.first + i]!;
      if (chunk.times[i] !== e.time || chunk.fees[i] !== e.fee || chunk.positions[i] !== e.position) throw new Error(`${era}: chunk ${c} entry ${i} does not round-trip`);
    }
  });

  const parts = { header: 0, prefixes: 0, feeList: 0, times: 0, fees: 0, positions: 0, total: 0 };
  let feesByIndex = 0;
  for (const bytes of chunks) {
    const layout = dustChunkLayout(bytes);
    for (const k of Object.keys(parts) as (keyof typeof parts)[]) parts[k] += layout[k];
    feesByIndex += layout.feesByIndex;
  }
  const n = all.length;
  const whole = Buffer.concat(chunks);

  // Fees over the whole file.
  const feeCount = new Map<bigint, number>();
  for (const s of all) feeCount.set(s.fee, (feeCount.get(s.fee) ?? 0) + 1);
  const repeated = [...feeCount.values()].filter((c) => c > 1).reduce((a, c) => a + c, 0);
  const top = [...feeCount].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([fee, count]) => ({ fee: fee.toString(), count }));
  const feeBits = all.map((s) => s.fee.toString(2).length).sort((a, b) => a - b);

  // Spends per transaction: a payment made with several coins has several spends.
  const perTransaction = new Map<string, number>();
  for (const s of all) {
    const key = `${s.height}/${s.transaction}`;
    perTransaction.set(key, (perTransaction.get(key) ?? 0) + 1);
  }
  const transactionSizes = new Map<number, number>();
  for (const c of perTransaction.values()) transactionSizes.set(c, (transactionSizes.get(c) ?? 0) + 1);
  const inMultiSpend = [...perTransaction.values()].filter((c) => c > 1).reduce((a, c) => a + c, 0);

  // Time differences between consecutive entries.
  let negative = 0;
  let oneByte = 0;
  let maxBack = 0;
  for (let i = 1; i < n; i++) {
    const d = all[i]!.time - all[i - 1]!.time;
    if (d < 0) negative++;
    if (d >= -64 && d <= 63) oneByte++;
    if (-d > maxBack) maxBack = -d;
  }
  let positionJumps = 0;
  for (let i = 1; i < n; i++) if (all[i]!.position !== all[i - 1]!.position + 1) positionJumps++;

  return {
    era,
    entries: n,
    firstHeight: all[0]?.height ?? null,
    lastHeight: all.at(-1)?.height ?? null,
    chunks: chunks.length,
    buildMs,
    bytes: parts,
    perEntry: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, n === 0 ? 0 : v / n])),
    feesByIndex,
    feesByIndexShare: n === 0 ? 0 : feesByIndex / n,
    fees: {
      distinct: feeCount.size,
      entriesWhoseFeeRepeatsInTheFile: repeated,
      medianBits: feeBits[Math.floor(n / 2)] ?? 0,
      maxBits: feeBits.at(-1) ?? 0,
      top,
    },
    transactions: {
      withSpends: perTransaction.size,
      spendsInTransactionsWithSeveral: inMultiSpend,
      bySpendCount: Object.fromEntries([...transactionSizes].sort((a, b) => a[0] - b[0])),
    },
    times: { negativeDifferences: negative, differencesInOneByte: oneByte, largestStepBackSeconds: maxBack },
    positionJumps,
    compressed: {
      gzipPerChunk: chunks.reduce((a, c) => a + gzipSync(c, { level: 9 }).length, 0),
      brotliPerChunk: chunks.reduce((a, c) => a + brotli(c), 0),
      zstdPerChunk: chunks.reduce((a, c) => a + zstd(c), 0),
      zstdWholeFile: n === 0 ? 0 : zstd(whole),
    },
    sha256: createHash("sha256").update(whole).digest("hex"),
  };
}

const results = {
  at: new Date().toISOString(),
  database: new URL(values["db-url"]).pathname.slice(1),
  lastHeight,
  prefixBytes,
  chunkEntries,
  readMs,
  files: (Object.keys(spends) as Era[]).map((era) => measure(era, spends[era])),
};

const f1 = (v: number): string => v.toFixed(2);
const mb = (v: number): string => `${(v / 1e6).toFixed(2)} MB`;
const lines: string[] = [
  "# The Dust file on Preprod",
  "",
  `Built from the \`dust-spend-processed\` events of database \`${results.database}\`, to height ${lastHeight.toLocaleString("en-US")}. ` +
    `Prefix ${prefixBytes} bytes, ${chunkEntries.toLocaleString("en-US")} entries per chunk. Reading and decoding the events took ${(readMs / 1000).toFixed(1)} s.`,
  "",
  "The Dust state restarts where the ledger's event format changes, so each format is its own file. `current` is what the module serves.",
  "",
];
for (const f of results.files) {
  if (f.entries === 0) continue;
  const n = f.entries;
  lines.push(
    `## ${f.era}: ${n.toLocaleString("en-US")} spends, heights ${f.firstHeight?.toLocaleString("en-US")} to ${f.lastHeight?.toLocaleString("en-US")}`,
    "",
    "| Part | Bytes | Per entry |",
    "|---|---|---|",
    `| Nullifier prefixes | ${f.bytes.prefixes.toLocaleString("en-US")} | ${f1(f.perEntry.prefixes!)} |`,
    `| Declared times | ${f.bytes.times.toLocaleString("en-US")} | ${f1(f.perEntry.times!)} |`,
    `| Fees | ${f.bytes.fees.toLocaleString("en-US")} | ${f1(f.perEntry.fees!)} |`,
    `| Fee lists | ${f.bytes.feeList.toLocaleString("en-US")} | ${f1(f.perEntry.feeList!)} |`,
    `| Commitment positions | ${f.bytes.positions.toLocaleString("en-US")} | ${f1(f.perEntry.positions!)} |`,
    `| Chunk headers | ${f.bytes.header.toLocaleString("en-US")} | ${f1(f.perEntry.header!)} |`,
    `| **Total** | **${f.bytes.total.toLocaleString("en-US")}** (${mb(f.bytes.total)}) | **${f1(f.perEntry.total!)}** |`,
    "",
    `- Chunks: ${f.chunks.toLocaleString("en-US")}; built in ${f.buildMs.toFixed(0)} ms.`,
    `- Compressed, chunk by chunk: gzip ${mb(f.compressed.gzipPerChunk)} (${f1(f.compressed.gzipPerChunk / n)} per entry), brotli ${mb(f.compressed.brotliPerChunk)} (${f1(f.compressed.brotliPerChunk / n)}), zstd ${mb(f.compressed.zstdPerChunk)} (${f1(f.compressed.zstdPerChunk / n)}). The whole file under zstd: ${mb(f.compressed.zstdWholeFile)}.`,
    `- Fees stored by their place in the chunk's list: ${f.feesByIndex.toLocaleString("en-US")} (${(100 * f.feesByIndexShare).toFixed(1)}%).`,
    `- Distinct fee values in the file: ${f.fees.distinct.toLocaleString("en-US")}; entries whose fee occurs more than once in the file: ${f.fees.entriesWhoseFeeRepeatsInTheFile.toLocaleString("en-US")} (${((100 * f.fees.entriesWhoseFeeRepeatsInTheFile) / n).toFixed(1)}%). A fee is ${f.fees.medianBits} bits at the median, ${f.fees.maxBits} at most.`,
    `- Transactions with a Dust spend: ${f.transactions.withSpends.toLocaleString("en-US")}; spends in transactions that hold several: ${f.transactions.spendsInTransactionsWithSeveral.toLocaleString("en-US")} (${((100 * f.transactions.spendsInTransactionsWithSeveral) / n).toFixed(1)}%).`,
    `- Time differences that fit one byte: ${((100 * f.times.differencesInOneByte) / Math.max(1, n - 1)).toFixed(1)}%; negative: ${f.times.negativeDifferences.toLocaleString("en-US")}; largest step back: ${f.times.largestStepBackSeconds.toLocaleString("en-US")} s.`,
    `- Entries whose commitment position is not the previous one plus one: ${f.positionJumps.toLocaleString("en-US")} (${((100 * f.positionJumps) / n).toFixed(1)}%).`,
    "",
    "Most frequent fees (Specks, occurrences): " + f.fees.top.map((t) => `${t.fee} × ${t.count.toLocaleString("en-US")}`).join("; ") + ".",
    "",
  );
}
mkdirSync(values.out, { recursive: true });
writeFileSync(join(values.out, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(values.out, "REPORT.md"), lines.join("\n"));
console.log(lines.join("\n"));
