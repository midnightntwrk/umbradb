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
import { PssHttp } from "../client/http.ts";
import { keysFromZswapSeed, type WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { emptyCallStats, lookupNullifiers, paddedCalls, readCell, readPaths, readPositions } from "../client/pir-calls.ts";
import { coinPath } from "../client/send.ts";
import { checkCiphertext, checkLowerPath, checkSnapshotMatch, rootOverBlocks } from "../client/sync.ts";
import { type Hash2, rootFromPath, TREE_DEPTH } from "../client/tree.ts";
import { Kernel } from "../kernel/index.ts";
import { bucketOf, decodeNullifierRecord, inlineMultiplier, type Matrix, NULLIFIER_RECORD_BYTES, setupMatrix } from "../pir/index.ts";
import {
  type ArtifactRef,
  decodeManifest,
  decodePathRecord,
  decodeReadRecord,
  decodeTailHeader,
  decodeTailOutput,
  type Manifest,
  positionAtSlot,
  ROUTES,
  slotCount,
  slotOf,
  splitTail,
  TAIL_OUTPUT_BYTES,
} from "../shared/index.ts";
import { initLedger } from "./ledger-v9.ts";
import { sha256 as sha256Noble } from "@noble/hashes/sha2.js";

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
const sha256Sync = (b: Uint8Array): Uint8Array => sha256Noble(b);
const sha256 = async (b: Uint8Array): Promise<string> => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", b as Uint8Array<ArrayBuffer>)));

// ── state ───────────────────────────────────────────────────────────────────────────────────────────────────────
let ledger: Ledger | null = null;
let kernel: Kernel | null = null;
let hash: Hash2 = () => {
  throw new Error("the kernel is not loaded");
};
type GpuScan = { scan(entries: Uint8Array, secret: Uint8Array): Promise<number[]> };
let gpu: Promise<GpuScan> | null = null;

/**
 * The GPU scanner, made once: opens the device, compiles the shader, and scans a few made-up entries so the pipelines
 * and buffers have been used. `load` starts it, so a scan does not wait for any of that.
 */
function startGpu(): Promise<GpuScan> {
  gpu ??= (async () => {
    // The GPU modules are type-checked by `deno check` (gpu/deno.json), so they are imported untyped here.
    const { openGpu } = await import("../gpu/device.ts" as string);
    const { GpuScanner } = await import("../gpu/scan.ts" as string);
    const poseidon = (await import("../test/fixtures/poseidon-constants.json")).default;
    const device = await openGpu();
    if (device === null) throw new Error("no WebGPU device in this browser");
    const scanner = (await GpuScanner.create(device.device, poseidon)) as GpuScan;
    const entries = new Uint8Array(36 * 64);
    for (let i = 0; i < entries.length; i++) entries[i] = (i * 151 + 7) & 255;
    const one = new Uint8Array(32);
    one[0] = 1;
    await scanner.scan(entries, one);
    return scanner;
  })();
  return gpu;
}
let keys: WalletKeys | null = null;

// ── every request, kept whole ───────────────────────────────────────────────────────────────────────────────────

/** One request to the module's API and its answer, bodies included (the page shows them on demand). */
interface Exchange {
  readonly id: number;
  readonly at: string;
  readonly method: string;
  readonly path: string;
  readonly requestHeaders: Record<string, string>;
  readonly requestBody: Uint8Array | null;
  readonly status: number;
  readonly responseHeaders: Record<string, string>;
  readonly responseBody: Uint8Array;
  readonly ms: number;
}
const exchanges = new Map<number, Exchange>();
let nextExchange = 1;
let reported = 0;
const KEEP_EXCHANGES = 300;

/** `fetch`, keeping the request's and the answer's bodies and headers; the answer is handed on unchanged. */
async function capturingFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const started = now();
  const at = new Date().toISOString();
  const raw: unknown = init.body;
  const requestBody: Uint8Array | null = raw instanceof Uint8Array ? new Uint8Array(raw) : null;
  const requestHeaders: Record<string, string> = {};
  new Headers(init.headers).forEach((v, k) => (requestHeaders[k] = v));
  const response = await fetch(url, init);
  const responseBody = new Uint8Array(await response.arrayBuffer());
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((v, k) => (responseHeaders[k] = v));
  const id = nextExchange++;
  exchanges.set(id, {
    id,
    at,
    method: init.method ?? "GET",
    path: new URL(url, self.location.origin).pathname,
    requestHeaders,
    requestBody,
    status: response.status,
    responseHeaders,
    responseBody,
    ms: now() - started,
  });
  for (const old of exchanges.keys()) if (exchanges.size > KEEP_EXCHANGES) exchanges.delete(old);
  return new Response(responseBody as Uint8Array<ArrayBuffer>, { status: response.status, statusText: response.statusText, headers: response.headers });
}

const http = new PssHttp(self.location.origin, { fetch: capturingFetch });
let manifest: Manifest | null = null;
let manifestId: Uint8Array | null = null;
const files = new Map<string, Uint8Array>();
let readSetup: Matrix | null = null;
let nullifierSetup: Matrix | null = null;
/** The path table's setup data: downloaded only when the page reads paths, as a spend would (Q58). */
let pathSetup: Matrix | null = null;
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
/** Positions read: the full commitment when known (a coin of the wallet's), and the lower path once read. */
const fetched = new Map<number, { commitment: Uint8Array | null; lowerPath: readonly Uint8Array[] | null }>();

const need = <T>(value: T | null, what: string): T => {
  if (value === null) throw new Error(`${what} first`);
  return value;
};

/** The requests made since the last step, for the page's request log; their bodies stay here (`exchange`). */
function newRequests(): Json[] {
  const out: Json[] = [];
  for (const e of exchanges.values()) {
    if (e.id <= reported) continue;
    out.push({ id: e.id, method: e.method, path: e.path, bodyBytes: e.requestBody?.length ?? 0, status: e.status, answerBytes: e.responseBody.length, ms: e.ms });
  }
  reported = nextExchange - 1;
  return out;
}

const ascii4 = (b: Uint8Array): string => String.fromCharCode(...b.subarray(0, 4));
const u32s = (b: Uint8Array, at: number, n: number): number[] => {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const out: number[] = [];
  for (let i = 0; i < n && at + 4 * i + 4 <= b.length; i++) out.push(v.getUint32(at + 4 * i, true));
  return out;
};

/** What a body is, field by field, where its format is known (`../shared/wire.ts`, the manifest, the artifacts). */
function decodeBody(e: Exchange, side: "request" | "response"): Json | null {
  const b = side === "request" ? e.requestBody : e.responseBody;
  if (b === null || b.length === 0) return null;
  const route = e.path.replace("/pss/v1", "");
  if (e.status >= 400 && side === "response") return null;
  if (route === "/manifest") return { format: "manifest (canonical JSON); its SHA-256 is the snapshot identifier" };
  if (route.startsWith("/query/")) {
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const count = v.getUint16(38, true);
    const perVector = (b.length - 40) / 4 / Math.max(1, count);
    return {
      format: side === "request" ? "query body: 40-byte header, then the query vectors (u32, little-endian)" : "answer body: 40-byte header, then the answer vectors (u32, little-endian)",
      magic: ascii4(b),
      formatVersion: v.getUint16(4, true),
      snapshotId: hex(b.subarray(6, 38)),
      vectors: count,
      valuesPerVector: perVector,
      meaning:
        side === "request"
          ? `each vector is A·s + e + Δ·u over the table's ${perVector} columns: one is the wanted column (or a random padding column), the server cannot tell which`
          : `each vector is the table (${perVector} rows) times one query vector; only the client can remove A·s and read its column`,
      firstValuesOfVector0: u32s(b, 40, 8),
    };
  }
  if (route === "/tail") {
    const h = decodeTailHeader(b);
    return {
      format: "tail: 132-byte header, then commitments, outputs, nullifiers, block roots",
      magic: ascii4(b),
      snapshotId: hex(h.snapshotId),
      height: h.height,
      blockHash: hex(h.blockHash),
      firstFree: h.firstFree,
      root: hex(h.root),
      sectionBytes: h.sections,
    };
  }
  if (route.startsWith("/blob/")) {
    const digest = route.slice("/blob/".length);
    const a = manifest?.artifacts;
    const name =
      a === undefined
        ? "artifact"
        : a.scan.digest === digest
          ? "scan file"
          : a.blockRoots.digest === digest
            ? "block roots"
            : a.readSetup.digest === digest
              ? "read table setup"
              : a.pathSetup?.digest === digest
                ? "path table setup"
                : a.nullifierSetup.digest === digest
                  ? "nullifier table setup"
                  : "artifact";
    const out: Json = { format: `${name}, addressed by its SHA-256`, digest };
    if (name === "scan file") {
      out.entries = b.length / 36;
      out.first = Array.from({ length: Math.min(4, b.length / 36) }, (_, i) => ({ position: i, point: hex(b.subarray(36 * i, 36 * i + 32)), element0Prefix: hex(b.subarray(36 * i + 32, 36 * i + 36)) }));
    } else if (name === "block roots") {
      out.roots = Array.from({ length: Math.min(16, b.length / 32) }, (_, i) => hex(b.subarray(32 * i, 32 * i + 32)));
    } else if (name.endsWith("setup")) {
      out.layout = `rows × 1024 u32 (H = table × A), ${b.length / 4 / 1024} rows`;
      out.firstValues = u32s(b, 0, 8);
    }
    return out;
  }
  return null;
}

const HEX_LIMIT = 64 * 1024;
const TEXT_LIMIT = 1024 * 1024;

/** A hex dump: offset, 16 bytes, ASCII. */
function hexDump(b: Uint8Array, limit: number): string {
  const lines: string[] = [];
  for (let off = 0; off < Math.min(b.length, limit); off += 16) {
    const row = b.subarray(off, Math.min(off + 16, b.length));
    const hx = Array.from(row, (x) => x.toString(16).padStart(2, "0")).join(" ");
    const txt = Array.from(row, (x) => (x >= 32 && x < 127 ? String.fromCharCode(x) : ".")).join("");
    lines.push(`${off.toString(16).padStart(8, "0")}  ${hx.padEnd(47)}  ${txt}`);
  }
  return lines.join("\n");
}

function describeBody(e: Exchange, side: "request" | "response", all: boolean): Json {
  const b = side === "request" ? e.requestBody : e.responseBody;
  if (b === null || b.length === 0) return { bytes: 0 };
  const type = (side === "request" ? e.requestHeaders["content-type"] : e.responseHeaders["content-type"]) ?? "";
  const textual = type.includes("json") || type.startsWith("text/");
  const limit = all ? Number.POSITIVE_INFINITY : textual ? TEXT_LIMIT : HEX_LIMIT;
  let text: string | undefined;
  if (textual) {
    text = new TextDecoder().decode(b.subarray(0, Math.min(b.length, limit)));
    try {
      if (b.length <= limit) text = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // not JSON
    }
  }
  return {
    bytes: b.length,
    contentType: type,
    sha256: hex(sha256Sync(b)),
    decoded: decodeBody(e, side),
    ...(text === undefined ? { hex: hexDump(b, limit) } : { text }),
    shown: Math.min(b.length, limit),
  };
}

function exchange(args: { id: number; all?: boolean }): Json {
  const e = exchanges.get(args.id);
  if (e === undefined) throw new Error(`request ${args.id} is no longer kept (the last ${KEEP_EXCHANGES} are)`);
  return {
    id: e.id,
    at: e.at,
    method: e.method,
    path: e.path,
    status: e.status,
    ms: round(e.ms),
    requestHeaders: e.requestHeaders,
    request: describeBody(e, "request", args.all ?? false),
    responseHeaders: e.responseHeaders,
    response: describeBody(e, "response", args.all ?? false),
  };
}

function exchangeBytes(args: { id: number; side: "request" | "response" }): Json {
  const e = exchanges.get(args.id);
  if (e === undefined) throw new Error(`request ${args.id} is no longer kept`);
  const b = args.side === "request" ? e.requestBody : e.responseBody;
  return { bytes: (b ?? new Uint8Array(0)).slice().buffer, name: `${e.id}-${e.method}-${e.path.replace(/[^a-z0-9]+/gi, "_").slice(0, 60)}-${args.side}.bin` };
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
  // Not awaited: a failure is reported by the scan that asks for the GPU.
  if ("gpu" in navigator) startGpu().catch(() => undefined);
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
  const response = await capturingFetch(`${self.location.origin}${path}`);
  if (!response.ok) throw new Error(`GET ${path}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const ms = now() - t;
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
  pathSetup = null;
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
      padding: m.padding?.size ?? null,
      root: m.root,
      pathSplit: m.pathSplit,
      queriesPerCall: m.queriesPerCall,
      pir: m.pir,
      readTable: { rows: a.readTable.rows, cols: a.readTable.cols, recordsPerColumn: a.readTable.perColumn, records: a.readTable.records, recordBytes: a.readTable.recordBytes },
      pathTable:
        a.pathTable === undefined || a.pathSetup === undefined
          ? null
          : { rows: a.pathTable.rows, cols: a.pathTable.cols, recordsPerColumn: a.pathTable.perColumn, recordBytes: a.pathTable.recordBytes, setupBytes: a.pathSetup.size },
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
  const n = slotCount(m);
  const t = now();
  let found: number[] = [];
  let engine: string;
  if (args.gpu) {
    found = await (await startGpu()).scan(file, w.scanSecret);
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
  // The scan finds slots; in a padded snapshot a slot holds an output's tree position or noise (Q57).
  found.sort((x, y) => x - y);
  const noise = found.filter((s) => positionAtSlot(m, s) === null);
  matches = found.map((s) => positionAtSlot(m, s)).filter((p): p is number => p !== null);
  return {
    engine,
    entries: n,
    entryBytes: 36,
    matches: matches.map((p) => {
      const s = slotOf(m, p);
      return { position: p, slot: s, entry: hex(file.subarray(36 * s, 36 * s + 36)) };
    }),
    ...(noise.length > 0 ? { noiseMatches: noise } : {}),
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
  const plan = paddedCalls(positions.map((p) => readCell(m, p).column), ref.cols, m.queriesPerCall);
  const stats = emptyCallStats();
  const t = now();
  const records = await readPositions(http, m, id, need(readSetup, "get the files"), positions, inlineMultiplier, stats);
  const callMs = now() - t;
  const file = files.get(m.artifacts.scan.digest)!;
  const out = [];
  for (const p of positions) {
    const r = decodeReadRecord(records.get(p)!);
    const { index, column, slot } = readCell(m, p);
    const item: Json = {
      position: p,
      ...(m.padding === undefined ? {} : { tableIndex: index }),
      column,
      slotInColumn: slot,
      commitmentPrefix: hex(r.commitmentPrefix),
      elementsShrunk: r.elements === null ? null : hex(r.elements),
    };
    let commitment: Uint8Array | null = null;
    if (keys !== null) {
      const checked = checkSnapshotMatch(k, keys, file.subarray(36 * index, 36 * index + 36), r);
      if ("reason" in checked) item.ownership = `not the wallet's: ${checked.reason}`;
      else {
        commitment = checked.commitment;
        const coin = coinOf(p, checked.coin, checked.commitment, m.pathSplit === 0 ? [] : null, "snapshot");
        coins.set(p, coin);
        item.ownership = "the wallet's: elements rebuilt from its pads, decrypted, and the decrypted coin's commitment starts with the record's 16 bytes";
        item.coin = { tokenType: coin.tokenType, value: coin.value, nonce: coin.nonce, nullifier: coin.nullifier, commitment: coin.commitment };
      }
    }
    fetched.set(p, { commitment, lowerPath: fetched.get(p)?.lowerPath ?? null });
    // The comparison with the stored output is the page's, one row at a time (its "Compare" button): a lookup by
    // position reads the whole events table, about 140 ms on the full Preprod database.
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

/**
 * Reads lower Merkle paths from the path table by PIR, as a spend does (Q58): only then is the path table's setup data
 * downloaded. Positions default to the wallet's snapshot coins. Each path is checked against its block's root from the
 * coin's commitment (with the debug database, from the stored commitment for a position that is not the wallet's).
 */
async function paths(args: { positions?: number[] }, progress: (text: string) => void): Promise<Json> {
  const k = need(kernel, "load the kernel");
  const m = need(manifest, "get the files");
  const id = need(manifestId, "get the files");
  const ref = m.artifacts.pathTable;
  const setupRef = m.artifacts.pathSetup;
  if (ref === undefined || setupRef === undefined) throw new Error("this snapshot has no path table (its path split is 0): the block roots give every path");
  const blockSize = 2 ** m.pathSplit;
  const fullBlocks = Math.floor(m.firstFree / blockSize);
  const own = [...coins.values()].filter((c) => c.source === "snapshot").map((c) => c.position);
  const asked = [...new Set(args.positions && args.positions.length > 0 ? args.positions : own)].sort((x, y) => x - y);
  if (asked.length === 0) throw new Error("no position: read the wallet's coins first, or enter positions");
  for (const p of asked) if (!Number.isInteger(p) || p < 0 || p >= m.firstFree) throw new Error(`position ${p} is not in the snapshot (0 to ${m.firstFree - 1})`);
  const positions = asked.filter((p) => Math.floor(p / blockSize) < fullBlocks);
  const fromTail = asked.filter((p) => Math.floor(p / blockSize) >= fullBlocks);
  const t = now();
  let download: Json | null = null;
  if (pathSetup === null) {
    progress(`downloading the path table's setup data (${(setupRef.size / 1048576).toFixed(1)} MB), once per snapshot`);
    download = await fetchBlob(setupRef, "path table setup");
    pathSetup = setupMatrix(files.get(setupRef.digest)!, ref.rows);
  }
  const plan = paddedCalls(positions.map((p) => readCell(m, p, ref).column), ref.cols, m.queriesPerCall);
  const stats = emptyCallStats();
  const records = positions.length === 0 ? new Map<number, Uint8Array>() : await readPaths(http, m, id, pathSetup, positions, inlineMultiplier, stats);
  const blockRoots = files.get(m.artifacts.blockRoots.digest)!;
  const out = [];
  for (const p of positions) {
    const lower = decodePathRecord(records.get(p)!, m.pathSplit);
    const { column, slot } = readCell(m, p, ref);
    const item: Json = { position: p, column, slotInColumn: slot };
    if (lower === null) {
      item.result = "FAILED: the path table holds no path for a position in a full block";
      out.push(item);
      continue;
    }
    item.lowerPath = lower.map(hex);
    let commitment = fetched.get(p)?.commitment ?? (coins.has(p) ? fromHexStrict(coins.get(p)!.commitment, 32) : null);
    let from = "the wallet's coin";
    if (commitment === null) {
      const db = await debugJson(`/debug/output?position=${p}`);
      if (db !== null && typeof db.commitment === "string") {
        commitment = fromHexStrict(db.commitment, 32);
        from = "the database (debug)";
      }
    }
    const block = Math.floor(p / blockSize);
    if (commitment === null) item.result = "read; no commitment to check it with (not the wallet's coin, and no debug database)";
    else {
      const ok = checkLowerPath(k, commitment, p % blockSize, lower, blockRoots.subarray(32 * block, 32 * block + 32));
      item.result = ok ? `gives block ${block}'s root from the commitment of ${from}` : `DOES NOT give block ${block}'s root`;
    }
    fetched.set(p, { commitment, lowerPath: lower });
    const coin = coins.get(p);
    if (coin !== undefined) coin.lowerPath = lower.map(hex);
    out.push(item);
  }
  for (const p of fromTail) out.push({ position: p, result: `not read: block ${Math.floor(p / blockSize)} was not full at the snapshot, so the tail gives its path` });
  return {
    positions: asked,
    download,
    calls: plan.map((c, i) => ({ call: i + 1, vectors: c.columns.length, realColumns: c.real, paddingColumns: c.columns.length - c.real.length })),
    table: { rows: ref.rows, cols: ref.cols, recordsPerColumn: ref.perColumn, recordBytes: ref.recordBytes },
    stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
    records: out,
    ms: round(now() - t),
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
    if (f.commitment === null) {
      paths.push({ position: p, result: "skipped: its commitment is not known here (not the wallet's coin; read its path to fetch it from the debug database)" });
      continue;
    }
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
    paths: paths.length === 0 ? "read some positions and their paths first to check their full paths here" : paths,
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
  paths,
  tail,
  summary,
  sampleSpends,
  exchange,
  exchangeBytes,
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
