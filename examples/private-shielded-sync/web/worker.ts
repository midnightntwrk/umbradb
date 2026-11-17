/**
 * The page's client, in a Web Worker: the wallet's keys, the downloads, the scan, the PIR calls, the tail. Each step
 * is one message from the page (`./page.ts`) and answers with what it did, for the page's debug panels. It runs the
 * client's own code (`../client/`, `../pir/`, `../shared/`, `../kernel/`) bundled for the browser (`./build.ts`).
 *
 * The mnemonic and the keys stay in this worker: no request carries them. Requests go to the page's own origin, whose
 * server (`./serve.ts`) passes `/pss/v1/…` to the module's API; `/debug/…` reads the server's database, for the
 * comparisons the page shows, and is no part of the private protocol.
 *
 * PIR follows the manifest's scheme (spec 00058 FR-060), and a call's work is spread over Web Workers the page starts
 * for this worker (`./call-workers.ts`; `CALL_THREADS`: one fewer than the browser's processors, at most 8; this
 * thread alone when the browser reports one processor):
 *
 * - SimplePIR runs in TypeScript; its two multiplications per call (`A × s` to build, `H × s` to decode) are split by
 *   rows over `multiply-worker.js` workers (`./multiply-web.ts`), over shared memory.
 * - IPIR+SP runs in the wallet's WebAssembly (`pss-ipir.wasm`, beside the page): fetched only when a manifest names
 *   `ipir-sp`, compiled only if its SHA-256 equals the committed one built into this file (`IPIR_DIGEST`, FR-031), and
 *   given to the scheme through `ipirWasm`. A call's requests are dealt to `ipir-worker.js` workers
 *   (`../ipir/pool.ts`), each with its own instance of the WebAssembly. Every request's secret comes from the
 *   `crypto.getRandomValues` of the thread that makes it, through the wrapper (`../ipir/wallet.ts`, FR-032).
 *
 * The shielded steps (2 to 8) are `./shielded-steps.ts`; the Wallet tab's sync (phase 10) runs them and the Dust steps
 * in order (`./wallet-sync.ts`, the `walletSync` step) on the same state, so the Details tab's steps show what it did.
 *
 * The Dust steps (spec 00062) are `./dust-steps.ts`, the command line's `dust` cut into four (the last, phase 9's
 * spend in memory, its `dust --spend`): the Dust seed comes from the same mnemonic (HD role 2, `WalletSeeds.dust`) and
 * stays here; chunks and the Dust snapshot's public files are kept by SHA-256 for the page's life, so running the steps
 * again downloads only what is new.
 */

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { WalletSeeds } from "@midnightntwrk/wallet-sdk-hd";
import { formatShieldedAddress } from "../client/address.ts";
import { PssHttp } from "../client/http.ts";
import { keysFromZswapSeed } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { IpirPool } from "../ipir/pool.ts";
import type { IpirReply } from "../ipir/pool-worker.ts";
import { Kernel } from "../kernel/index.ts";
import { inlineMultiplier, type Multiplier, PUBLIC_ARTIFACT } from "../pir/index.ts";
import { decodeDustChunk, decodeManifest, dustChunkLayout, decodeTailHeader } from "../shared/index.ts";
import { callWorkerFailed, startCallWorker } from "./call-workers.ts";
import { DustSteps } from "./dust-steps.ts";
import { initLedger } from "./ledger-v9.ts";
import { WebMultiplier } from "./multiply-web.ts";
import { ascii4, compileChecked, describeCallBody, describePublicArtifact, hex, tableOfRoute } from "./scheme-view.ts";
import { type GpuScan, ShieldedSteps } from "./shielded-steps.ts";
import { runWalletSync, walletSyncSteps } from "./wallet-sync.ts";
import { sha256 as sha256Noble } from "@noble/hashes/sha2.js";

declare const KERNEL_DIGEST: string;
/** The committed SHA-256 of `ipir/pss-ipir.wasm` (`ipir/pss-ipir.wasm.sha256`), injected by `./build.ts`. */
declare const IPIR_DIGEST: string;

type Json = Record<string, unknown>;
const fromHexStrict = (s: string, len: number): Uint8Array => {
  const t = s.trim().replace(/^0x/, "").toLowerCase();
  if (!new RegExp(`^[0-9a-f]{${len * 2}}$`).test(t)) throw new Error(`not ${len} bytes of hex: ${s.slice(0, 20)}…`);
  return Uint8Array.from(t.match(/../g)!, (h) => parseInt(h, 16));
};
const now = (): number => performance.now();
const round = (x: number): number => Math.round(x * 100) / 100;
const sha256Sync = (b: Uint8Array): Uint8Array => sha256Noble(b);
const sha256 = async (b: Uint8Array): Promise<string> => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", b as Uint8Array<ArrayBuffer>)));

// ── state ───────────────────────────────────────────────────────────────────────────────────────────────────────
let ledger: Ledger | null = null;
let kernel: Kernel | null = null;
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
/** The shielded steps (made once the kernel and the ledger are loaded): the snapshot's files, tables and coins. */
let shielded: ShieldedSteps | null = null;
/** The Dust steps (made once the ledger is loaded), and the files they keep by SHA-256 for the page's life. */
let dust: DustSteps | null = null;
const dustCache = new Map<string, Uint8Array>();

/** Threads for a call's work: one fewer than the browser's processors, at most 8. */
const CALL_THREADS = Math.min(8, Math.max(1, (self.navigator?.hardwareConcurrency ?? 1) - 1));

/**
 * SimplePIR's multiplication: on Web Workers over shared memory (started at the first SimplePIR call), or on this
 * thread when there is one thread or the page is not cross-origin isolated (no `SharedArrayBuffer` to hand over).
 */
const multiplier: Multiplier = CALL_THREADS > 1 && self.crossOriginIsolated ? new WebMultiplier(CALL_THREADS) : inlineMultiplier;

/**
 * The Web Workers that make a call's IPIR+SP requests, started when the first IPIR+SP snapshot is opened and kept for
 * the page's life; null when one thread is all there is.
 */
const ipirWorkers: IpirPool | null =
  CALL_THREADS > 1
    ? new IpirPool(CALL_THREADS, () => {
        const worker = startCallWorker("ipir-worker.js");
        return {
          post: (task, transfer) => worker.port.postMessage(task, transfer),
          listen(onReply, onError) {
            worker.port.onmessage = (event: MessageEvent<IpirReply>) => onReply(event.data);
            worker.onFail(onError);
          },
          busy: () => undefined,
          terminate: async () => worker.stop(),
        };
      })
    : null;

/** The wallet's IPIR+SP WebAssembly, compiled once per page load, and what loading it took (shown by the files step). */
let ipirModule: Promise<{ module: WebAssembly.Module; bytes: number; sha256: string; ms: number }> | null = null;

/**
 * Fetches `pss-ipir.wasm` and compiles it if its SHA-256 equals the committed one (FR-031); called by the IPIR+SP
 * scheme only, so a SimplePIR snapshot never fetches it. A failed load is tried again at the next call.
 */
function loadIpirWasm(): Promise<{ module: WebAssembly.Module; bytes: number; sha256: string; ms: number }> {
  ipirModule ??= (async () => {
    const t = now();
    const response = await fetch("pss-ipir.wasm");
    if (!response.ok) throw new Error(`GET pss-ipir.wasm: ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const module = await compileChecked(bytes, IPIR_DIGEST, sha256);
    return { module, bytes: bytes.length, sha256: IPIR_DIGEST, ms: now() - t };
  })();
  ipirModule.catch(() => (ipirModule = null));
  return ipirModule;
}

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

/** What a body is, field by field, where its format is known (`../shared/wire.ts`, the manifest, the artifacts). */
function decodeBody(e: Exchange, side: "request" | "response"): Json | null {
  const b = side === "request" ? e.requestBody : e.responseBody;
  if (b === null || b.length === 0) return null;
  const route = e.path.replace("/pss/v1", "");
  if (e.status >= 400 && side === "response") return null;
  if (route === "/manifest") return { format: "manifest (canonical JSON); its SHA-256 is the snapshot identifier" };
  if (route.startsWith("/dust/")) return decodeDustBody(route, side, b, e.requestBody);
  if (route.startsWith("/query/")) {
    // The call's own snapshot (its header names it), else the current one.
    const manifest = shielded?.manifest ?? null;
    const m = (b.length >= 40 ? shielded?.manifests.get(hex(b.subarray(6, 38))) : undefined) ?? manifest;
    return describeCallBody(m?.scheme ?? "simplepir", side, b, m === null ? null : tableOfRoute(m, route), side === "response" ? e.requestBody : null, sha256Sync);
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
    const manifest = shielded?.manifest ?? null;
    const a = manifest?.artifacts;
    const name =
      a === undefined
        ? "artifact"
        : a.scan.digest === digest
          ? "scan file"
          : a.blockRoots.digest === digest
            ? "block roots"
            : a.readPublic.digest === digest
              ? `read table ${PUBLIC_ARTIFACT[manifest!.scheme]}`
              : a.pathPublic?.digest === digest
                ? `path table ${PUBLIC_ARTIFACT[manifest!.scheme]}`
                : a.nullifierPublic.digest === digest
                  ? `nullifier table ${PUBLIC_ARTIFACT[manifest!.scheme]}`
                  : "artifact";
    const out: Json = { format: `${name}, addressed by its SHA-256`, digest };
    if (name === "scan file") {
      out.entries = b.length / 36;
      out.first = Array.from({ length: Math.min(4, b.length / 36) }, (_, i) => ({ position: i, point: hex(b.subarray(36 * i, 36 * i + 32)), element0Prefix: hex(b.subarray(36 * i + 32, 36 * i + 36)) }));
    } else if (name === "block roots") {
      out.roots = Array.from({ length: Math.min(16, b.length / 32) }, (_, i) => hex(b.subarray(32 * i, 32 * i + 32)));
    } else if (manifest !== null && name.endsWith(PUBLIC_ARTIFACT[manifest.scheme])) {
      const t = name.startsWith("read") ? a!.readTable : name.startsWith("path") ? a!.pathTable : a!.nullifierTable;
      Object.assign(out, describePublicArtifact(manifest.scheme, b, t?.layout.cols ?? null));
    }
    return out;
  }
  return null;
}

/** What a Dust route's body is (spec 00062; the JSON ones show as text). */
function decodeDustBody(route: string, side: "request" | "response", b: Uint8Array, requestBody: Uint8Array | null): Json | null {
  if (route.startsWith("/dust/chunk/") && side === "response") {
    const c = decodeDustChunk(b);
    const layout = dustChunkLayout(b);
    return {
      format: "Dust chunk (shared/dust-file.ts): magic PSSDUST1, header, prefixes, fee list, then times, fees and positions as differences",
      first: c.first,
      count: c.count,
      firstHeight: c.firstHeight,
      prefixBytes: c.prefixBytes,
      firstTime: new Date(c.times[0]! * 1000).toISOString(),
      firstPosition: c.positions[0],
      bytesByPart: layout,
      firstPrefixes: Array.from({ length: Math.min(4, c.count) }, (_, i) => hex(c.prefixes.subarray(i * c.prefixBytes, (i + 1) * c.prefixBytes))),
    };
  }
  if (route === "/dust/check/manifest") return { format: "the Dust snapshot's manifest (canonical JSON); its SHA-256 is the check's identifier" };
  if (route === "/dust/check/query" || route === "/dust/check/path") {
    const path = route === "/dust/check/path";
    const m = (b.length >= 40 ? dust?.checkManifests.get(hex(b.subarray(6, 38))) : undefined) ?? null;
    if (m === null) return { format: `a call to the Dust snapshot's ${path ? "path table" : "check table"} (its manifest is not known here)` };
    if (path && m.tree.pathTable === undefined) return { format: "a call to the Dust snapshot's path table (it has none: the tree is not cut)" };
    return path
      ? { table: `Dust path table (each position's ${m.tree.pathSplit} lower siblings, ${32 * m.tree.pathSplit} bytes)`, ...describeCallBody(m.scheme, side, b, m.tree.pathTable!, side === "response" ? requestBody : null, sha256Sync) }
      : { table: "Dust check table (32-byte commitments by position)", ...describeCallBody(m.scheme, side, b, m.table, side === "response" ? requestBody : null, sha256Sync) };
  }
  if (route.startsWith("/dust/check/blob/") && side === "response") {
    const digest = route.slice("/dust/check/blob/".length);
    for (const m of dust?.checkManifests.values() ?? []) {
      if (m.public.digest === digest) return { format: `the Dust check table's ${PUBLIC_ARTIFACT[m.scheme]}, addressed by its SHA-256`, digest, ...describePublicArtifact(m.scheme, b, m.table.layout.cols) };
      if (m.tree.pathPublic?.digest === digest) return { format: `the Dust path table's ${PUBLIC_ARTIFACT[m.scheme]}, addressed by its SHA-256`, digest, ...describePublicArtifact(m.scheme, b, m.tree.pathTable!.layout.cols) };
      if (m.tree.blockRoots.digest === digest) return { format: `the Dust commitment tree's block roots: ${m.tree.blockRoots.blocks} roots of 32 bytes, one per block of 2^${m.tree.pathSplit} leaves (public)`, digest, firstRoot: hex(b.subarray(0, 32)) };
      if (m.generation.file.digest === digest) return { format: `the generation records (shared/dust-check.ts): magic PSSDGEN1, the count, then ${m.generation.records} records of 88 bytes (value, owner, initial nonce, dtime); public`, digest, records: m.generation.records };
    }
    return { format: "a file of the Dust snapshot, addressed by its SHA-256 (its manifest is not known here)", digest };
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
  const kernelMs = now() - t;
  const t2 = now();
  const ledgerInfo = await initLedger("ledger-v9.wasm");
  ledger = ledgerInfo.ledger as unknown as Ledger;
  const ledgerMs = now() - t2;
  shielded?.dispose();
  shielded = new ShieldedSteps({
    ledger,
    kernel,
    http,
    multiplier,
    ipirWasm: loadIpirWasm,
    ...(ipirWorkers === null ? {} : { ipirWorkers }),
    debugJson,
    gpu: startGpu,
  });
  dust?.dispose();
  dust = new DustSteps({
    ledger,
    http,
    cache: dustCache,
    scheme: { multiplier, ipirWasm: async () => (await loadIpirWasm()).module, ...(ipirWorkers === null ? {} : { ipirWorkers }) },
    kernel: () => kernel!,
    network: async () => (shielded?.manifest ?? decodeManifest((await http.manifest()).bytes)).network,
  });
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
    const seeds = WalletSeeds.fromMasterSeed(master);
    seed = seeds.shielded;
    // The Dust seed (role 2) for the Dust steps: copied there, wiped here.
    need(dust, "load the ledger").setSeed(seeds.dust);
    seeds.dust.fill(0);
    master.fill(0);
    source = `mnemonic (${words.split(" ").length} words) → BIP-39 seed → HD m/44'/2400'/0'/3/0 (Zswap) and m/44'/2400'/0'/2/0 (Dust)`;
  } else if (args.seedHex !== undefined && args.seedHex.trim() !== "") {
    seed = fromHexStrict(args.seedHex, 32);
    need(dust, "load the ledger").setSeed(null);
    source = "32-byte Zswap seed (no Dust key: the Dust steps need a mnemonic)";
  } else {
    throw new Error("give a mnemonic, a Zswap seed, or generate one");
  }
  const keys = keysFromZswapSeed(l, seed, k);
  seed.fill(0);
  need(shielded, "load the ledger").setKeys(keys);
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

/**
 * The Wallet tab's sync (`./wallet-sync.ts`): the keys from the mnemonic (as step 1), then the shielded and Dust steps
 * a wallet needs for its balances, on this worker's state, so the Details tab's steps show what it did.
 */
async function walletSync(args: { mnemonic?: string; seedHex?: string; gpu?: boolean }, progress: (text: string) => void): Promise<Json> {
  const s = need(shielded, "load the kernel");
  const d = need(dust, "load the ledger");
  const steps = walletSyncSteps({ keys: () => deriveKeys({ mnemonic: args.mnemonic ?? "", seedHex: args.seedHex ?? "" }), shielded: s, dust: d, gpu: args.gpu ?? false });
  const result = await runWalletSync(steps, { http, progress });
  return result as unknown as Json;
}

// ── messages ────────────────────────────────────────────────────────────────────────────────────────────────────

const STEPS: Record<string, (args: never, progress: (text: string) => void) => Promise<Json> | Json> = {
  load,
  keys: deriveKeys,
  files: () => need(shielded, "load the kernel").getFiles(),
  scan: (args: { gpu?: boolean }, progress) => need(shielded, "load the kernel").scan(args, progress),
  read: (args: { positions?: number[] }) => need(shielded, "load the kernel").read(args),
  nullifiers: (args: { nullifiers?: string[] }) => need(shielded, "load the kernel").nullifiers(args),
  paths: (args: { positions?: number[] }, progress) => need(shielded, "load the kernel").paths(args, progress),
  tail: () => need(shielded, "load the kernel").tail(),
  summary: () => need(shielded, "load the kernel").summary(),
  sampleSpends: (args: { n?: number }) => need(shielded, "load the kernel").sampleSpends(args),
  walletSync,
  dustFile: () => need(dust, "load the ledger").getFile(),
  dustWalk: () => need(dust, "load the ledger").walk(),
  dustCheck: () => need(dust, "load the ledger").check(),
  dustSpend: () => need(dust, "load the ledger").spend(),
  exchange,
  exchangeBytes,
};

self.onmessage = async (event: MessageEvent<{ id: number; step: string; args: Json }>) => {
  if (callWorkerFailed(event.data)) return;
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
