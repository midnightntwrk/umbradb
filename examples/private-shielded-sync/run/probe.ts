/**
 * Checks a running private shielded sync server against the UmbraDB database it is built from, without a wallet:
 *
 *     node examples/private-shielded-sync/run/probe.ts --server http://127.0.0.1:10480 \
 *       --db-url postgres://postgres@127.0.0.1:58171/umbradb --db-password-file <file> \
 *       [--build --admin-secret-file <file>] [--samples 64] [--nullifiers 32] [--threads 4] [--out <file.json>]
 *
 * 1. With `--build`, builds a snapshot at the module's indexed height through the admin route and waits for it.
 * 2. The manifest: its first_free and root against the core's `states` row at its height; the block roots against the
 *    manifest's root.
 * 3. The scan file: every entry against the stored output's ciphertext (point and 4 bytes of element 0; zeros for an
 *    output without one).
 * 4. Read calls by PIR, through the client's own code, for a sample of positions (the first, the last, the last full
 *    block's, outputs without a ciphertext, random ones): each record's commitment and elements 1–5 against the stored
 *    output, and its lower path against the block root.
 * 4b. The tail, and each sampled position's full path (the client's `coinPath`, as a spend builds it) against the tail's
 *    root and the core's zswap_root at the tail's height.
 * 5. Nullifier calls by PIR: a sample of stored spends must be found with their height and transaction, random
 *    nullifiers must not.
 *
 * Exit code 1 if any check fails. Prints a summary and, with `--out`, writes it as JSON. Public data only: no key.
 */

import { createHash, randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { BlobCache } from "../client/cache.ts";
import { PssHttp } from "../client/http.ts";
import { emptyCallStats, lookupNullifiers, readPositions } from "../client/pir-calls.ts";
import { coinPath } from "../client/send.ts";
import { rootOverBlocks } from "../client/sync.ts";
import { type Hash2, rootFromPath } from "../client/tree.ts";
import { compileKernel, Kernel } from "../kernel/index.ts";
import { setupMatrix, WorkerMultiplier } from "../pir/index.ts";
import { decodeManifest, decodeReadRecord, slotCount, slotOf, splitTail } from "../shared/index.ts";

const { values: opt } = parseArgs({
  options: {
    server: { type: "string" },
    "db-url": { type: "string" },
    "db-password-file": { type: "string" },
    build: { type: "boolean", default: false },
    "admin-secret-file": { type: "string" },
    samples: { type: "string", default: "64" },
    nullifiers: { type: "string", default: "32" },
    threads: { type: "string", default: "4" },
    out: { type: "string" },
  },
});
if (!opt.server || !opt["db-url"] || !opt["db-password-file"]) {
  process.stderr.write("usage: probe.ts --server <url> --db-url <url> --db-password-file <file> [--build --admin-secret-file <file>]\n");
  process.exit(2);
}

const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
const equal = (a: Uint8Array | null, b: Uint8Array | null): boolean =>
  a === null || b === null ? a === b : a.length === b.length && Buffer.from(a).equals(Buffer.from(b));
const failures: string[] = [];
const check = (ok: boolean, what: string): void => {
  if (!ok) failures.push(what);
};
const ms = (t: number): number => Math.round((performance.now() - t) * 10) / 10;

// The database (the repository's own `postgres` package).
const { default: postgres } = (await import("postgres" as string)) as {
  default: (url: string, o: Record<string, unknown>) => { unsafe(q: string, p?: unknown[]): Promise<Record<string, unknown>[]>; end(): Promise<void> };
};
const sql = postgres(opt["db-url"], { password: readFileSync(opt["db-password-file"], "utf8").trim(), max: 2, onnotice: () => {} });

const server = opt.server.replace(/\/$/, "");
const report: Record<string, unknown> = { server, at: new Date().toISOString() };

// 1. A snapshot at the module's indexed height.
if (opt.build) {
  if (!opt["admin-secret-file"]) throw new Error("--build needs --admin-secret-file");
  const auth = { Authorization: `Bearer ${readFileSync(opt["admin-secret-file"], "utf8").trim()}` };
  const t = performance.now();
  const started = await fetch(`${server}/pss/v1/admin/snapshot`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: "{}" });
  const startBody = (await started.json()) as { building?: { height: number } };
  if (started.status !== 202) throw new Error(`the build did not start: ${started.status} ${JSON.stringify(startBody)}`);
  const height = startBody.building!.height;
  for (;;) {
    await new Promise((r) => setTimeout(r, 500));
    const s = (await (await fetch(`${server}/pss/v1/admin/snapshot`, { headers: auth })).json()) as {
      building: unknown;
      last: { height: number; ok: boolean; error?: string } | null;
      current: { id: string; height: number } | null;
    };
    if (s.building !== null) continue;
    if (s.last?.height !== height || !s.last.ok) throw new Error(`the build at ${height} failed: ${JSON.stringify(s.last)}`);
    report.build = { height, ms: ms(t), id: s.current?.id };
    process.stdout.write(`built a snapshot at height ${height} in ${ms(t)} ms\n`);
    break;
  }
}

// 2. The manifest and the downloads.
const http = new PssHttp(server);
const served = await http.manifest();
const manifestId = createHash("sha256").update(served.bytes).digest();
check(served.servedId === null || served.servedId === hex(manifestId), "the manifest's bytes hash to the identifier the server names");
const manifest = decodeManifest(served.bytes);
const H = manifest.height;
const k = manifest.pathSplit;
const blockSize = 2 ** k;
const cacheDir = mkdtempSync(join(tmpdir(), "pss-probe-"));
const cache = new BlobCache(cacheDir);
const a = manifest.artifacts;
let t = performance.now();
for (const ref of [a.scan, a.blockRoots, a.readSetup, a.nullifierSetup]) await cache.fetch(http, ref);
const downloadMs = ms(t);
const kernel = new Kernel(compileKernel());
const hash: Hash2 = (x, y) => kernel.hash2(x, y)!;
const blockRoots = cache.read(a.blockRoots);
const scan = cache.read(a.scan);

const [state] = await sql.unsafe(
  "SELECT zswap_first_free, zswap_root FROM core_ledger_state.states WHERE height = $1::bigint",
  [H],
);
if (state === undefined) throw new Error(`the database has no state row at the manifest's height ${H}`);
const storedRoot = new Uint8Array(state.zswap_root as Uint8Array);
// The stored root is a SCALE-compact field element: 0x73 (32 value bytes) then the value, little-endian.
const coreRoot = new Uint8Array(32);
if (storedRoot[0] === 0x73 && storedRoot.length === 33) coreRoot.set(storedRoot.subarray(1));
else failures.push(`unexpected stored root encoding ${hex(storedRoot)}`);
check(Number(state.zswap_first_free) === manifest.firstFree, `first_free ${manifest.firstFree} = core's ${String(state.zswap_first_free)}`);
check(equal(Buffer.from(manifest.root, "hex"), coreRoot), "the manifest's root = the core's zswap_root at its height");
check(equal(rootOverBlocks(blockRoots, k, hash), Buffer.from(manifest.root, "hex")), "the block roots give the manifest's root");
process.stdout.write(
  `manifest ${hex(manifestId).slice(0, 16)}…: height ${H}, first_free ${manifest.firstFree}, k ${k}, ` +
    `read table ${a.readTable.rows} × ${a.readTable.cols}, nullifier table ${a.nullifierTable.rows} × ${a.nullifierTable.cols}; ` +
    `downloads ${downloadMs} ms\n`,
);

// The stored outputs and spends at or below the snapshot's height.
t = performance.now();
const outputs = await sql.unsafe(
  `SELECT tree_index, commitment, ciphertext FROM core_ledger_state.events
   WHERE kind = 'zswap-output' AND height <= $1::bigint ORDER BY tree_index`,
  [H],
);
const spends = await sql.unsafe(
  `SELECT height, tx_index, nullifier FROM core_ledger_state.events
   WHERE kind = 'zswap-input' AND height <= $1::bigint ORDER BY height, tx_index, event_index`,
  [H],
);
const dbMs = ms(t);
check(outputs.length === manifest.firstFree, `${outputs.length} stored outputs = first_free ${manifest.firstFree}`);
const stored = outputs.map((r, i) => {
  check(Number(r.tree_index) === i, `stored output ${i} has tree index ${String(r.tree_index)}`);
  return {
    commitment: new Uint8Array(r.commitment as Uint8Array),
    ciphertext: r.ciphertext === null ? null : new Uint8Array(r.ciphertext as Uint8Array),
  };
});

// 3. The scan file, every entry.
let scanMismatches = 0;
let withoutCiphertext = 0;
check(scan.length === 36 * slotCount(manifest), `scan file ${scan.length} bytes = 36 × ${slotCount(manifest)}`);
stored.forEach((o, i) => {
  const s = slotOf(manifest, i);
  const entry = scan.subarray(36 * s, 36 * s + 36);
  const want = o.ciphertext === null ? new Uint8Array(36) : o.ciphertext.subarray(0, 36);
  if (o.ciphertext === null) withoutCiphertext++;
  if (!equal(entry, want)) scanMismatches++;
});
check(scanMismatches === 0, `${scanMismatches} scan entries differ from the stored ciphertexts`);

// 4. Read calls for a sample of positions.
const n = manifest.firstFree;
const fullBlocks = Math.floor(n / blockSize);
const sample = new Set<number>([0, n - 1]);
if (fullBlocks > 0) sample.add(fullBlocks * blockSize - 1);
for (let i = 0, added = 0; i < n && added < 4; i++) {
  if (stored[i]!.ciphertext === null) {
    sample.add(i);
    added++;
  }
}
while (sample.size < Math.min(n, Number(opt.samples))) sample.add(randomBytes(4).readUInt32BE() % n);
const positions = [...sample].sort((x, y) => x - y);
const multiplier = new WorkerMultiplier(Number(opt.threads));
const readStats = emptyCallStats();
t = performance.now();
const records = await readPositions(http, manifest, manifestId, setupMatrix(cache.read(a.readSetup), a.readTable.rows), positions, multiplier, readStats);
const readMs = ms(t);
let pathsChecked = 0;
for (const p of positions) {
  const r = decodeReadRecord(records.get(p)!, k);
  const o = stored[p]!;
  check(equal(r.commitment, o.commitment), `position ${p}: commitment`);
  check(equal(r.elements, o.ciphertext === null ? null : o.ciphertext.subarray(64, 224)), `position ${p}: elements 1–5`);
  const block = Math.floor(p / blockSize);
  if (block < fullBlocks) {
    check(r.lowerPath !== null, `position ${p}: a lower path in a full block`);
    if (r.lowerPath !== null) {
      const root = rootFromPath(kernel.leaf(r.commitment), p % blockSize, r.lowerPath, hash);
      check(equal(root, blockRoots.subarray(32 * block, 32 * block + 32)), `position ${p}: lower path gives block ${block}'s root`);
      pathsChecked++;
    }
  } else {
    check(r.lowerPath === null, `position ${p}: no lower path in the partial block`);
  }
}

// 4b. The tail, and the full 32-hash path a spend would use for each sampled position (the client's own `coinPath`:
// the lower path from the record, or from the tail's commitments in the snapshot's partial block; the upper path from
// the block roots), checked against the tail's root and the core's zswap_root at the tail's height.
t = performance.now();
const tail = splitTail(await http.tail());
const tailMs = ms(t);
check(equal(tail.header.snapshotId, manifestId), "the tail belongs to the manifest's snapshot");
const t0 = Math.floor(n / blockSize) * blockSize;
let tailCommitmentMismatches = 0;
for (let i = t0; i < n; i++) {
  if (!equal(tail.commitments.subarray(32 * (i - t0), 32 * (i - t0) + 32), stored[i]!.commitment)) tailCommitmentMismatches++;
}
check(tailCommitmentMismatches === 0, `${tailCommitmentMismatches} of the tail's partial-block commitments differ from the stored ones`);
const [tailState] = await sql.unsafe("SELECT zswap_first_free, zswap_root FROM core_ledger_state.states WHERE height = $1::bigint", [tail.header.height]);
const tailCoreRoot = new Uint8Array(32);
if (tailState !== undefined) tailCoreRoot.set(new Uint8Array(tailState.zswap_root as Uint8Array).subarray(1, 33));
check(tailState !== undefined && Number(tailState.zswap_first_free) === tail.header.firstFree, `the tail's first_free ${tail.header.firstFree} = core's at ${tail.header.height}`);
check(equal(tail.header.root, tailCoreRoot), `the tail's root = the core's zswap_root at ${tail.header.height}`);
const view = { pathSplit: k, snapshotFirstFree: n, snapshotBlockRoots: blockRoots, tail };
let fullPaths = 0;
t = performance.now();
for (const p of positions) {
  const r = decodeReadRecord(records.get(p)!, k);
  try {
    const { root } = coinPath(view, { position: p, commitment: hex(r.commitment), lowerPath: r.lowerPath === null ? null : r.lowerPath.map(hex) }, kernel);
    check(equal(root, tailCoreRoot), `position ${p}: full path gives the core's root`);
    fullPaths++;
  } catch (error) {
    failures.push(`position ${p}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
const pathMs = ms(t);

// 5. Nullifier calls: stored spends found with their place, random ones not.
const want = Math.min(spends.length, Number(opt.nullifiers));
const picked = new Map<string, { height: number; txIndex: number }>();
while (picked.size < want) {
  const s = spends[randomBytes(4).readUInt32BE() % spends.length]!;
  picked.set(hex(new Uint8Array(s.nullifier as Uint8Array)), { height: Number(s.height), txIndex: Number(s.tx_index) });
}
const randomOnes = Array.from({ length: Number(opt.nullifiers) }, () => hex(randomBytes(32)));
const nullifierStats = emptyCallStats();
t = performance.now();
const found = await lookupNullifiers(http, manifest, manifestId, setupMatrix(cache.read(a.nullifierSetup), a.nullifierTable.rows), [...picked.keys(), ...randomOnes], multiplier, nullifierStats);
const nullifierMs = ms(t);
for (const [nf, place] of picked) {
  const e = found.get(nf);
  check(e != null && e.height === place.height && e.txIndex === place.txIndex, `stored spend ${nf.slice(0, 16)}… found at ${place.height}/${place.txIndex}`);
}
for (const nf of randomOnes) check(found.get(nf) === null, `random nullifier ${nf.slice(0, 16)}… not found`);

await multiplier.close();
await sql.end();
rmSync(cacheDir, { recursive: true, force: true });

Object.assign(report, {
  snapshot: { id: hex(manifestId), height: H, firstFree: n, pathSplit: k, fullBlocks },
  database: { outputs: outputs.length, outputsWithoutCiphertext: withoutCiphertext, spends: spends.length, readMs: dbMs },
  downloads: { ms: downloadMs, bytes: [a.scan, a.blockRoots, a.readSetup, a.nullifierSetup].reduce((s, r) => s + r.size, 0) },
  scan: { entries: n, mismatches: scanMismatches },
  tail: { height: tail.header.height, firstFree: tail.header.firstFree, ms: tailMs, fullPaths, pathMs },
  read: { positions: positions.length, pathsChecked, ms: readMs, calls: readStats.calls, bytesUp: readStats.bytesUp, bytesDown: readStats.bytesDown },
  nullifier: { stored: picked.size, random: randomOnes.length, ms: nullifierMs, calls: nullifierStats.calls, bytesUp: nullifierStats.bytesUp, bytesDown: nullifierStats.bytesDown },
  failures,
});
process.stdout.write(
  `scan file: ${n} entries checked, ${scanMismatches} differ (${withoutCiphertext} outputs without a ciphertext)\n` +
    `read: ${positions.length} positions in ${readStats.calls} call(s), ${readMs} ms; commitments, elements and ${pathsChecked} lower paths checked\n` +
    `tail: height ${tail.header.height}, first_free ${tail.header.firstFree}, ${tailMs} ms; ${fullPaths} full 32-hash paths give the core's root (${pathMs} ms)\n` +
    `nullifier: ${picked.size} stored spends and ${randomOnes.length} random in ${nullifierStats.calls} call(s), ${nullifierMs} ms\n` +
    (failures.length === 0 ? "every check passed\n" : `${failures.length} check(s) failed:\n${failures.slice(0, 20).map((f) => `  - ${f}`).join("\n")}\n`),
);
if (opt.out) writeFileSync(opt.out, `${JSON.stringify(report, null, 2)}\n`);
process.exit(failures.length === 0 ? 0 : 1);
