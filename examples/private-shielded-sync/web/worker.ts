/**
 * The page's client, in a Web Worker: the wallet's keys, the downloads, the scan, the PIR calls, the tail. Each step
 * is one message from the page (`./page.ts`) and answers with what it did, for the page's debug panels. It runs the
 * client's own code (`../client/`, `../pir/`, `../shared/`, `../kernel/`) bundled for the browser (`./build.ts`).
 *
 * The mnemonic and the keys stay in this worker: no request carries them. Requests go to the page's own origin, whose
 * server (`./serve.ts`) passes `/pss/v1/…` to the module's API; `/debug/…` reads the server's database, for the
 * comparisons the page shows, and is no part of the private protocol.
 */

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { WalletSeeds } from "@midnightntwrk/wallet-sdk-hd";
import { formatShieldedAddress } from "../client/address.ts";
import { PssHttp, type RequestRecord } from "../client/http.ts";
import { keysFromZswapSeed, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { emptyCallStats, lookupNullifiers, paddedCalls, readPositions } from "../client/pir-calls.ts";
import { coinPath } from "../client/send.ts";
import { checkCiphertext, checkSnapshotMatch, rootOverBlocks } from "../client/sync.ts";
import { type Hash2, rootFromPath, TREE_DEPTH } from "../client/tree.ts";
import { Kernel } from "../kernel/index.ts";
import { bucketOf, decodeNullifierRecord, inlineMultiplier, type Matrix, NULLIFIER_RECORD_BYTES, positionOf, setupMatrix } from "../pir/index.ts";
import {
  type ArtifactRef,
  decodeManifest,
  decodeReadRecord,
  decodeTailOutput,
  type Manifest,
  ROUTES,
  splitTail,
  TAIL_OUTPUT_BYTES,
} from "../shared/index.ts";
import { initLedger } from "./ledger-v9.ts";

declare const KERNEL_DIGEST: string;

type Json = Record<string, unknown>;
const hex = (b: Uint8Array): string => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
const fromHexStrict = (s: string, len: number): Uint8Array => {
  const t = s.trim().replace(/^0x/, "").toLowerCase();
  if (!new RegExp(`^[0-9a-f]{${len * 2}}$`).test(t)) throw new Error(`not ${len} bytes of hex: ${s.slice(0, 20)}…`);
  return Uint8Array.from(t.match(/../g)!, (h) => parseInt(h, 16));
};
const equal = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((x, i) => x === b[i]);
const now = (): number => performance.now();
const round = (x: number): number => Math.round(x * 100) / 100;
const sha256 = async (b: Uint8Array): Promise<string> => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", b as Uint8Array<ArrayBuffer>)));

// ── state ───────────────────────────────────────────────────────────────────────────────────────────────────────
let ledger: Ledger | null = null;
let kernel: Kernel | null = null;
let hash: Hash2 = () => {
  throw new Error("the kernel is not loaded");
};
let gpu: { scan(entries: Uint8Array, secret: Uint8Array): Promise<number[]> } | null = null;
let keys: WalletKeys | null = null;
const http = new PssHttp(self.location.origin);
const blobRecords: RequestRecord[] = [];
let recordsSeen = 0;
let manifest: Manifest | null = null;
let manifestId: Uint8Array | null = null;
const files = new Map<string, Uint8Array>();
let readSetup: Matrix | null = null;
let nullifierSetup: Matrix | null = null;
let matches: number[] = [];
interface Coin {
  position: number;
  tokenType: string;
  value: string;
  nonce: string;
  commitment: string;
  nullifier: string;
  lowerPath: string[] | null;
  source: "snapshot" | "tail";
  spent: { height: number; txIndex: number; source: string } | null;
}
const coins = new Map<number, Coin>();
const fetched = new Map<number, { commitment: Uint8Array; lowerPath: readonly Uint8Array[] | null }>();

const need = <T>(value: T | null, what: string): T => {
  if (value === null) throw new Error(`${what} first`);
  return value;
};

/** The requests made since the last step (the module's API and blob downloads), for the page's request log. */
function newRequests(): RequestRecord[] {
  const out = [...http.records.slice(recordsSeen), ...blobRecords.splice(0)];
  recordsSeen = http.records.length;
  return out;
}

async function debugJson(path: string): Promise<Json | null> {
  const r = await fetch(path).catch(() => null);
  if (r === null || !r.ok) return null;
  return (await r.json()) as Json;
}

// ── steps ───────────────────────────────────────────────────────────────────────────────────────────────────────

async function load(): Promise<Json> {
  const t = now();
  const kernelBytes = new Uint8Array(await (await fetch("pss-kernel.wasm")).arrayBuffer());
  const kernelDigest = await sha256(kernelBytes);
  if (kernelDigest !== KERNEL_DIGEST) throw new Error(`the scan kernel's SHA-256 is ${kernelDigest}, not the committed ${KERNEL_DIGEST}`);
  kernel = new Kernel(await WebAssembly.compile(kernelBytes as Uint8Array<ArrayBuffer>));
  hash = (a, b) => kernel!.hash2(a, b)!;
  const kernelMs = now() - t;
  const t2 = now();
  const ledgerInfo = await initLedger("ledger-v9.wasm");
  ledger = ledgerInfo.ledger as unknown as Ledger;
  const ledgerMs = now() - t2;
  const debug = await debugJson("/debug/info");
  return {
    kernel: { bytes: kernelBytes.length, sha256: kernelDigest, ms: round(kernelMs) },
    ledger: { package: "@midnightntwrk/ledger-v9 1.0.1 (ledger-9.1.0.1)", bytes: ledgerInfo.bytes, ms: round(ledgerMs) },
    webgpu: "gpu" in navigator,
    server: self.location.origin,
    debugEndpoints: debug,
  };
}

async function deriveKeys(args: { mnemonic?: string; seedHex?: string; generate?: boolean }): Promise<Json> {
  const k = need(kernel, "load the kernel");
  const l = need(ledger, "load the ledger");
  const t = now();
  let mnemonic: string | null = null;
  let seed: Uint8Array;
  let source: string;
  if (args.generate) mnemonic = generateMnemonic(wordlist, 256);
  const phrase = mnemonic ?? args.mnemonic;
  if (phrase !== undefined && phrase.trim() !== "") {
    const words = phrase.trim().split(/\s+/).join(" ");
    if (!validateMnemonic(words, wordlist)) throw new Error("not a valid BIP-39 English mnemonic");
    const master = mnemonicToSeedSync(words);
    seed = WalletSeeds.fromMasterSeed(master).shielded;
    master.fill(0);
    source = `mnemonic (${words.split(" ").length} words) → BIP-39 seed → HD m/44'/2400'/0'/3/0`;
  } else if (args.seedHex !== undefined && args.seedHex.trim() !== "") {
    seed = fromHexStrict(args.seedHex, 32);
    source = "32-byte Zswap seed";
  } else {
    throw new Error("give a mnemonic, a Zswap seed, or generate one");
  }
  keys = keysFromZswapSeed(l, seed, k);
  seed.fill(0);
  coins.clear();
  fetched.clear();
  matches = [];
  const address = formatShieldedAddress({ coinPublicKey: hex(keys.coinPublicKey), encryptionPublicKey: hex(keys.encryptionPublicKey) }, "preprod");
  return {
    source,
    ...(mnemonic === null ? {} : { generatedMnemonic: mnemonic }),
    shieldedAddress: address,
    coinPublicKey: hex(keys.coinPublicKey),
    encryptionPublicKey: hex(keys.encryptionPublicKey),
    scanSecret: "held in the worker, never shown or sent",
    checks: ["the encryption secret key's scalar gives the package's encryption public key (kernel public_key)"],
    ms: round(now() - t),
  };
}

async function fetchBlob(ref: ArtifactRef, name: string): Promise<Json> {
  const path = `${ROUTES.blob}${ref.digest}`;
  const t = now();
  const response = await fetch(path);
  if (!response.ok) throw new Error(`GET ${path}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const ms = now() - t;
  blobRecords.push({ method: "GET", path, bodyBytes: 0, status: response.status, answerBytes: bytes.length, ms });
  const digest = await sha256(bytes);
  if (digest !== ref.digest || bytes.length !== ref.size) throw new Error(`${name}: got ${bytes.length} bytes with SHA-256 ${digest}, expected ${ref.size} bytes with ${ref.digest}`);
  files.set(ref.digest, bytes);
  return { name, bytes: bytes.length, ms: round(ms), sha256: `${digest.slice(0, 16)}… (equals the manifest's)` };
}

async function getFiles(): Promise<Json> {
  need(kernel, "load the kernel");
  const t = now();
  const served = await http.manifest();
  manifestId = fromHexStrict(await sha256(served.bytes), 32);
  if (served.servedId !== null && served.servedId !== hex(manifestId)) throw new Error("the manifest's SHA-256 is not the identifier the server names");
  manifest = decodeManifest(served.bytes);
  const m = manifest;
  const a = m.artifacts;
  const downloads = [];
  for (const [name, ref] of [["scan file", a.scan], ["block roots", a.blockRoots], ["read table setup", a.readSetup], ["nullifier table setup", a.nullifierSetup]] as const) {
    downloads.push(await fetchBlob(ref, name));
  }
  const blockRoots = files.get(a.blockRoots.digest)!;
  const rootOk = equal(rootOverBlocks(blockRoots, m.pathSplit, hash), fromHexStrict(m.root, 32));
  if (!rootOk) throw new Error("the block roots do not give the manifest's root");
  const t2 = now();
  readSetup = setupMatrix(files.get(a.readSetup.digest)!, a.readTable.rows);
  nullifierSetup = setupMatrix(files.get(a.nullifierSetup.digest)!, a.nullifierTable.rows);
  const setupMs = now() - t2;
  coins.clear();
  fetched.clear();
  matches = [];
  const debug = await debugJson(`/debug/state?height=${m.height}`);
  return {
    snapshotId: hex(manifestId),
    manifest: {
      network: m.network,
      height: m.height,
      blockHash: m.blockHash,
      firstFree: m.firstFree,
      root: m.root,
      pathSplit: m.pathSplit,
      queriesPerCall: m.queriesPerCall,
      pir: m.pir,
      readTable: { rows: a.readTable.rows, cols: a.readTable.cols, recordsPerColumn: a.readTable.perColumn, records: a.readTable.records },
      nullifierTable: { rows: a.nullifierTable.rows, cols: a.nullifierTable.cols, bucketBits: a.nullifierTable.bucketBits, capacity: a.nullifierTable.capacity },
      blocks: a.blockRoots.blocks,
    },
    manifestBytes: served.bytes.length,
    downloads,
    checks: [
      "the manifest's SHA-256 is the identifier the server names",
      "every artifact's size and SHA-256 equal the manifest's",
      "the block roots give the manifest's root",
      ...(debug === null
        ? []
        : [`database (debug): first_free ${String(debug.firstFree)}, root ${String(debug.root)} at ${m.height}: ${debug.firstFree === m.firstFree && debug.root === m.root ? "equal to the manifest" : "DIFFERENT from the manifest"}`]),
    ],
    setupMatricesMs: round(setupMs),
    ms: round(now() - t),
  };
}

async function scan(args: { gpu?: boolean; chunk?: number }, progress: (text: string) => void): Promise<Json> {
  const k = need(kernel, "load the kernel");
  const w = need(keys, "derive the keys");
  const m = need(manifest, "get the files");
  const file = files.get(m.artifacts.scan.digest)!;
  const n = m.firstFree;
  const t = now();
  let found: number[] = [];
  let engine: string;
  if (args.gpu) {
    if (gpu === null) {
      // The GPU modules are type-checked by `deno check` (gpu/deno.json), so they are imported untyped here.
      const { openGpu } = await import("../gpu/device.ts" as string);
      const { GpuScanner } = await import("../gpu/scan.ts" as string);
      const poseidon = (await import("../test/fixtures/poseidon-constants.json")).default;
      const device = await openGpu();
      if (device === null) throw new Error("no WebGPU device in this browser");
      gpu = (await GpuScanner.create(device.device, poseidon)) as NonNullable<typeof gpu>;
    }
    found = await gpu.scan(file, w.scanSecret);
    engine = "WebGPU (gpu/scan.ts)";
  } else {
    const chunk = args.chunk ?? 2000;
    for (let at = 0; at < n; at += chunk) {
      const count = Math.min(chunk, n - at);
      for (const i of k.scan(file.subarray(36 * at, 36 * (at + count)), w.scanSecret)) found.push(at + i);
      progress(`scanned ${at + count} of ${n} entries, ${found.length} match(es)`);
    }
    engine = "WebAssembly scan kernel, one thread";
  }
  const ms = now() - t;
  matches = found.sort((x, y) => x - y);
  return {
    engine,
    entries: n,
    entryBytes: 36,
    matches: matches.map((p) => ({ position: p, entry: hex(file.subarray(36 * p, 36 * p + 36)) })),
    ms: round(ms),
    usPerEntry: n === 0 ? 0 : round((1000 * ms) / n),
    note: "a match means the first 4 bytes of element 0 equal the wallet's pad: about 1 in 4 billion for an output that is not the wallet's",
  };
}

async function read(args: { positions?: number[] }): Promise<Json> {
  const k = need(kernel, "load the kernel");
  const m = need(manifest, "get the files");
  const id = need(manifestId, "get the files");
  const positions = [...new Set(args.positions && args.positions.length > 0 ? args.positions : matches)].sort((x, y) => x - y);
  for (const p of positions) if (!Number.isInteger(p) || p < 0 || p >= m.firstFree) throw new Error(`position ${p} is not in the snapshot (0 to ${m.firstFree - 1})`);
  const ref = m.artifacts.readTable;
  const plan = paddedCalls(positions.map((p) => positionOf(p, ref.perColumn).column), ref.cols, m.queriesPerCall);
  const stats = emptyCallStats();
  const t = now();
  const records = await readPositions(http, m, id, need(readSetup, "get the files"), positions, inlineMultiplier, stats);
  const callMs = now() - t;
  const blockSize = 2 ** m.pathSplit;
  const file = files.get(m.artifacts.scan.digest)!;
  const blockRoots = files.get(m.artifacts.blockRoots.digest)!;
  const out = [];
  for (const p of positions) {
    const r = decodeReadRecord(records.get(p)!, m.pathSplit);
    fetched.set(p, { commitment: r.commitment, lowerPath: r.lowerPath });
    const block = Math.floor(p / blockSize);
    const { column, slot } = positionOf(p, ref.perColumn);
    const item: Json = {
      position: p,
      column,
      slotInColumn: slot,
      commitment: hex(r.commitment),
      ciphertextElements1to5: r.elements === null ? null : hex(r.elements),
      lowerPath: r.lowerPath === null ? `none (block ${block} is not full at the snapshot; the tail gives its path)` : r.lowerPath.map(hex),
    };
    if (r.lowerPath !== null) {
      item.lowerPathCheck = equal(rootFromPath(k.leaf(r.commitment), p % blockSize, r.lowerPath, hash), blockRoots.subarray(32 * block, 32 * block + 32))
        ? "gives the block's root"
        : "DOES NOT give the block's root";
    }
    if (keys !== null) {
      const checked = checkSnapshotMatch(k, keys, file.subarray(36 * p, 36 * p + 36), r, p % blockSize, blockRoots.subarray(32 * block, 32 * block + 32));
      if ("reason" in checked) item.ownership = `not the wallet's: ${checked.reason}`;
      else {
        const coin = coinOf(p, checked.coin, checked.commitment, checked.lowerPath, "snapshot");
        coins.set(p, coin);
        item.ownership = "the wallet's: decrypted, and the commitment of the decrypted coin equals the record's";
        item.coin = { tokenType: coin.tokenType, value: coin.value, nonce: coin.nonce, nullifier: coin.nullifier };
      }
    }
    const db = await debugJson(`/debug/output?position=${p}`);
    if (db !== null) {
      const dbElements = db.ciphertext === null ? null : String(db.ciphertext).slice(128, 448);
      item.database = {
        height: db.height,
        txIndex: db.txIndex,
        evidence: db.evidence,
        equal: db.commitment === hex(r.commitment) && dbElements === (r.elements === null ? null : hex(r.elements)),
      };
    }
    out.push(item);
  }
  return {
    positions,
    calls: plan.map((c, i) => ({
      call: i + 1,
      vectors: c.columns.length,
      realColumns: c.real,
      paddingColumns: c.columns.length - c.real.length,
      note: "the server sees only the number of calls and their sizes, never which columns are real",
    })),
    stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
    records: out,
    ms: round(callMs),
  };
}

function coinOf(position: number, coin: { tokenType: Uint8Array; nonce: Uint8Array; value: bigint }, commitment: Uint8Array, lowerPath: readonly Uint8Array[] | null, source: Coin["source"]): Coin {
  const l = need(ledger, "load the ledger");
  const w = need(keys, "derive the keys");
  const info = { type: hex(coin.tokenType), nonce: hex(coin.nonce), value: coin.value };
  return {
    position,
    tokenType: info.type,
    value: coin.value.toString(),
    nonce: info.nonce,
    commitment: hex(commitment),
    nullifier: l.coinNullifier(info, w.zswap.coinSecretKey),
    lowerPath: lowerPath === null ? null : lowerPath.map(hex),
    source,
    spent: null,
  };
}

async function nullifiers(args: { nullifiers?: string[] }): Promise<Json> {
  const m = need(manifest, "get the files");
  const id = need(manifestId, "get the files");
  const manual = (args.nullifiers ?? []).map((s) => hex(fromHexStrict(s, 32)));
  const own = [...coins.values()].filter((c) => c.source === "snapshot").map((c) => c.nullifier);
  const list = [...new Set([...own, ...manual])];
  const ref = m.artifacts.nullifierTable;
  const plan = paddedCalls(list.map((nf) => bucketOf(fromHexStrict(nf, 32), ref.bucketBits)), ref.cols, m.queriesPerCall);
  const stats = emptyCallStats();
  const t = now();
  const found = await lookupNullifiers(http, m, id, need(nullifierSetup, "get the files"), list, inlineMultiplier, stats);
  const ms = now() - t;
  const results = list.map((nf) => {
    const e = found.get(nf) ?? null;
    const coin = [...coins.values()].find((c) => c.nullifier === nf);
    if (coin !== undefined && e !== null) coin.spent = { height: e.height, txIndex: e.txIndex, source: "snapshot" };
    return {
      nullifier: nf,
      bucket: bucketOf(fromHexStrict(nf, 32), ref.bucketBits),
      of: coin === undefined ? "entered by hand" : `the wallet's coin at ${coin.position}`,
      result: e === null ? "not in the snapshot's nullifier table (unspent at the snapshot)" : `spent at height ${e.height}, transaction ${e.txIndex}`,
    };
  });
  return {
    lookups: list.length,
    calls: plan.map((c, i) => ({ call: i + 1, vectors: c.columns.length, realBuckets: c.real, paddingBuckets: c.columns.length - c.real.length })),
    stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
    results,
    note: list.length === 0 ? "no nullifier to look up: one call is still sent, so the server cannot tell a wallet with no coin" : undefined,
    ms: round(ms),
  };
}

async function tail(): Promise<Json> {
  const k = need(kernel, "load the kernel");
  const m = need(manifest, "get the files");
  const id = need(manifestId, "get the files");
  const t = now();
  const bytes = await http.tail();
  const fetchMs = now() - t;
  const t2 = now();
  const tl = splitTail(bytes);
  if (!equal(tl.header.snapshotId, id)) throw new Error("the tail belongs to another snapshot: get the files again");
  const blockSize = 2 ** m.pathSplit;
  const t0 = Math.floor(m.firstFree / blockSize) * blockSize;
  const blockRoots = files.get(m.artifacts.blockRoots.digest)!;
  const all = new Uint8Array(32 * (t0 / blockSize) + tl.blockRoots.length);
  all.set(blockRoots.subarray(0, 32 * (t0 / blockSize)), 0);
  all.set(tl.blockRoots, 32 * (t0 / blockSize));
  const rootOk = equal(rootOverBlocks(all, m.pathSplit, hash), tl.header.root);
  const outputs = tl.outputs.length / TAIL_OUTPUT_BYTES;
  const decoded = Array.from({ length: outputs }, (_, i) => decodeTailOutput(tl.outputs.subarray(i * TAIL_OUTPUT_BYTES, (i + 1) * TAIL_OUTPUT_BYTES)));
  const tailCoins = [];
  if (keys !== null) {
    const entries = new Uint8Array(36 * outputs);
    decoded.forEach((o, i) => o.ciphertext !== null && entries.set(o.ciphertext.subarray(0, 36), 36 * i));
    for (const i of outputs === 0 ? [] : k.scan(entries, keys.scanSecret)) {
      const o = decoded[i]!;
      const checked = checkCiphertext(k, keys, o.ciphertext!, o.commitment, null);
      if ("reason" in checked) continue;
      const coin = coinOf(m.firstFree + i, checked.coin, checked.commitment, null, "tail");
      coins.set(coin.position, coin);
      tailCoins.push({ position: coin.position, tokenType: coin.tokenType, value: coin.value });
    }
  }
  const tailNullifiers = new Map<string, { height: number; txIndex: number }>();
  for (let off = 0; off < tl.nullifiers.length; off += NULLIFIER_RECORD_BYTES) {
    const e = decodeNullifierRecord(tl.nullifiers.subarray(off, off + NULLIFIER_RECORD_BYTES));
    tailNullifiers.set(hex(e.nullifier), { height: e.height, txIndex: e.txIndex });
  }
  for (const c of coins.values()) {
    const s = c.spent === null ? tailNullifiers.get(c.nullifier) : undefined;
    if (s) c.spent = { ...s, source: "tail" };
  }
  // Each fetched position's full path, as a spend builds it, against the tail's root.
  const view = { pathSplit: m.pathSplit, snapshotFirstFree: m.firstFree, snapshotBlockRoots: blockRoots, tail: tl };
  const paths = [];
  for (const [p, f] of [...fetched].slice(0, 16)) {
    const t3 = now();
    try {
      const { siblings } = coinPath(view, { position: p, commitment: hex(f.commitment), lowerPath: f.lowerPath === null ? null : f.lowerPath.map(hex) }, k);
      paths.push({ position: p, siblings: siblings.length, result: `the ${TREE_DEPTH}-hash path gives the tail's root`, ms: round(now() - t3) });
    } catch (error) {
      paths.push({ position: p, result: `FAILED: ${error instanceof Error ? error.message : String(error)}` });
    }
  }
  const debug = await debugJson(`/debug/state?height=${tl.header.height}`);
  return {
    header: {
      height: tl.header.height,
      blockHash: hex(tl.header.blockHash),
      firstFree: tl.header.firstFree,
      root: hex(tl.header.root),
      sectionBytes: tl.header.sections,
    },
    bytes: bytes.length,
    outputs,
    nullifiers: tailNullifiers.size,
    checks: [
      `the snapshot's full blocks' roots and the tail's block roots give the tail's root: ${rootOk ? "yes" : "NO"}`,
      ...(debug === null ? [] : [`database (debug): root at ${tl.header.height} ${debug.root === hex(tl.header.root) ? "equals" : "DIFFERS FROM"} the tail's`]),
    ],
    walletCoinsInTail: keys === null ? "derive the keys to scan the tail" : tailCoins,
    paths: paths.length === 0 ? "fetch some positions first to check their paths here" : paths,
    fetchMs: round(fetchMs),
    clientMs: round(now() - t2),
  };
}

function summary(): Json {
  const list = [...coins.values()].sort((a, b) => a.position - b.position);
  const balance: Record<string, string> = {};
  for (const c of list) if (c.spent === null) balance[c.tokenType] = (BigInt(balance[c.tokenType] ?? "0") + BigInt(c.value)).toString();
  return { coins: list, unspentBalanceByTokenType: balance };
}

async function sampleSpends(args: { n?: number }): Promise<Json> {
  const m = need(manifest, "get the files");
  const r = await debugJson(`/debug/spends?n=${args.n ?? 5}&maxHeight=${m.height}`);
  if (r === null) throw new Error("the page's server has no database (start serve.ts with --db-url)");
  return r;
}

// ── messages ────────────────────────────────────────────────────────────────────────────────────────────────────

const STEPS: Record<string, (args: never, progress: (text: string) => void) => Promise<Json> | Json> = {
  load,
  keys: deriveKeys,
  files: getFiles,
  scan,
  read,
  nullifiers,
  tail,
  summary,
  sampleSpends,
};

self.onmessage = async (event: MessageEvent<{ id: number; step: string; args: Json }>) => {
  const { id, step, args } = event.data;
  const progress = (text: string) => self.postMessage({ id, progress: text });
  const t = now();
  try {
    const run = STEPS[step];
    if (run === undefined) throw new Error(`no step ${step}`);
    const result = await run((args ?? {}) as never, progress);
    self.postMessage({ id, ok: true, result, requests: newRequests(), ms: round(now() - t) });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? `${error.message}${error.cause ? ` (${String(error.cause)})` : ""}` : String(error), requests: newRequests(), ms: round(now() - t) });
  }
};
