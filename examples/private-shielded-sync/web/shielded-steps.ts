/**
 * The page's shielded steps (steps 2 to 8), without the DOM: `./worker.ts` runs them for both tabs (the Details
 * tab's step cards and the Wallet tab's sync, `./wallet-sync.ts`), and `test/server-web-wallet.test.ts` runs them under
 * Node. They hold the wallet's shielded state for the page's life: the snapshot's manifest and files, the scheme's
 * opened tables, the scan's matches, the coins found and the positions read.
 *
 * - **Get the files**: the manifest (its SHA-256 must be the identifier the server names), then the scan file, the
 *   block roots and the read and nullifier tables' public artifacts, each checked against the manifest's SHA-256. A
 *   file already held (same SHA-256) is not downloaded again, and the tables of the snapshot already opened are kept,
 *   so a second sync on the same snapshot downloads only the manifest.
 * - **Scan** each entry locally; **read** the records of the matches (or of positions given) by PIR, padded calls;
 *   **look up** the coins' nullifiers by PIR; **read paths** (only to spend; its public artifact downloaded then);
 *   **get the tail** and scan its outputs; the **summary**: coins and the balance per token type.
 *
 * The page server's debug routes (`/debug/…`, the database's view) are asked only when `debugJson` is given and the
 * step is not told otherwise: the Wallet tab's sync makes no debug request.
 */

import { createHash } from "node:crypto";
import type { PssHttp } from "../client/http.ts";
import type { WalletKeys } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { emptyCallStats, lookupNullifiers, paddedCalls, readCell, readPaths, readPositions } from "../client/pir-calls.ts";
import { coinPath } from "../client/send.ts";
import { checkCiphertext, checkLowerPath, checkSnapshotMatch, rootOverBlocks } from "../client/sync.ts";
import { type Hash2, TREE_DEPTH } from "../client/tree.ts";
import type { IpirWorkers } from "../ipir/engine.ts";
import type { Kernel } from "../kernel/index.ts";
import {
  bucketOf,
  decodeNullifierRecord,
  type Multiplier,
  NULLIFIER_RECORD_BYTES,
  openWalletScheme,
  PUBLIC_ARTIFACT,
  type WalletScheme,
  type WalletTable,
} from "../pir/index.ts";
import {
  type ArtifactRef,
  decodeManifest,
  decodePathRecord,
  decodeReadRecord,
  decodeTailOutput,
  type Manifest,
  positionAtSlot,
  slotCount,
  slotOf,
  splitTail,
  TAIL_OUTPUT_BYTES,
} from "../shared/index.ts";
import { callPlan, cellOf, hex, tableSummary } from "./scheme-view.ts";

type Json = Record<string, unknown>;
const round = (x: number): number => Math.round(x * 100) / 100;
const now = (): number => performance.now();
const equal = (a: Uint8Array, b: Uint8Array): boolean => a.length === b.length && a.every((x, i) => x === b[i]);
const sha256Hex = (b: Uint8Array): string => createHash("sha256").update(b).digest("hex");
const fromHexStrict = (s: string, len: number): Uint8Array => {
  const t = s.trim().replace(/^0x/, "").toLowerCase();
  if (!new RegExp(`^[0-9a-f]{${len * 2}}$`).test(t)) throw new Error(`not ${len} bytes of hex: ${s.slice(0, 20)}…`);
  return Uint8Array.from(t.match(/../g)!, (h) => parseInt(h, 16));
};

/** The GPU scanner (`../gpu/scan.ts`), when the browser has WebGPU. */
export type GpuScan = { scan(entries: Uint8Array, secret: Uint8Array): Promise<number[]> };

/** The wallet's IPIR+SP WebAssembly, digest-checked, and what loading it took (shown by the files step). */
export type IpirWasmLoad = { module: WebAssembly.Module; bytes: number; sha256: string; ms: number };

export interface ShieldedStepsOptions {
  readonly ledger: Ledger;
  readonly kernel: Kernel;
  readonly http: PssHttp;
  /** SimplePIR's multiplication. */
  readonly multiplier: Multiplier;
  /** IPIR+SP's WebAssembly, asked for only when a snapshot uses IPIR+SP. */
  readonly ipirWasm: () => Promise<IpirWasmLoad>;
  /** IPIR+SP's worker threads, when there is more than one thread. */
  readonly ipirWorkers?: IpirWorkers & { readonly threads?: number };
  /** The page server's debug routes, or none (under Node, or a server without a database). */
  readonly debugJson?: (path: string) => Promise<Json | null>;
  /** The GPU scanner, when the browser has one. */
  readonly gpu?: () => Promise<GpuScan>;
}

/** A coin of the wallet's, as the page shows it. */
export interface PageCoin {
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

export class ShieldedSteps {
  readonly #o: ShieldedStepsOptions;
  readonly #hash: Hash2;
  #keys: WalletKeys | null = null;
  #manifest: Manifest | null = null;
  #manifestId: Uint8Array | null = null;
  /** The snapshot's files by SHA-256, kept for the page's life. */
  readonly #files = new Map<string, Uint8Array>();
  #scheme: WalletScheme | null = null;
  #readTable: WalletTable | null = null;
  #nullifierTable: WalletTable | null = null;
  /** The path table: its public artifact is downloaded only when the page reads paths, as a spend would (Q58). */
  #pathTable: WalletTable | null = null;
  #matches: number[] = [];
  readonly #coins = new Map<number, PageCoin>();
  /** Positions read: the full commitment when known (a coin of the wallet's), and the lower path once read. */
  readonly #fetched = new Map<number, { commitment: Uint8Array | null; lowerPath: readonly Uint8Array[] | null }>();
  /** Every manifest this page got, by snapshot identifier: a call is decoded with the shapes of its own snapshot. */
  readonly manifests = new Map<string, Manifest>();

  constructor(options: ShieldedStepsOptions) {
    this.#o = options;
    this.#hash = (a, b) => options.kernel.hash2(a, b)!;
  }

  /** The snapshot the files step opened, or null. */
  get manifest(): Manifest | null {
    return this.#manifest;
  }

  /** The wallet's keys (from step 1), or null: the coins found belong to the keys, so they are cleared. */
  setKeys(keys: WalletKeys | null): void {
    this.#keys = keys;
    this.#coins.clear();
    this.#fetched.clear();
    this.#matches = [];
  }

  #need<T>(value: T | null, what: string): T {
    if (value === null) throw new Error(`${what} first`);
    return value;
  }

  async #debug(path: string, debug: boolean): Promise<Json | null> {
    return debug && this.#o.debugJson !== undefined ? this.#o.debugJson(path) : null;
  }

  /** A file of the snapshot, from what the page holds or downloaded and checked. */
  async #blob(ref: ArtifactRef, name: string): Promise<Json> {
    const held = this.#files.get(ref.digest);
    if (held !== undefined) return { name, bytes: held.length, ms: 0, cached: true, sha256: `${ref.digest.slice(0, 16)}… (held from an earlier download)` };
    const t = now();
    const bytes = await this.#o.http.blob(ref.digest, ref.size);
    this.#files.set(ref.digest, bytes);
    return { name, bytes: bytes.length, ms: round(now() - t), cached: false, sha256: `${ref.digest.slice(0, 16)}… (equals the manifest's)` };
  }

  /** Step 2: the manifest and the files every wallet downloads alike. */
  async getFiles(args: { debug?: boolean } = {}): Promise<Json> {
    const t = now();
    const served = await this.#o.http.manifest();
    const id = fromHexStrict(sha256Hex(served.bytes), 32);
    if (served.servedId !== null && served.servedId !== hex(id)) throw new Error("the manifest's SHA-256 is not the identifier the server names");
    const m = decodeManifest(served.bytes);
    this.manifests.set(hex(id), m);
    const a = m.artifacts;
    // The same snapshot as the tables already opened: they are kept (no new setup).
    const keep = this.#scheme !== null && this.#readTable !== null && this.#nullifierTable !== null && this.#manifestId !== null && equal(this.#manifestId, id);
    let wasm: IpirWasmLoad | null = null;
    if (!keep) {
      // A manifest naming a scheme this page's build does not have stops here, with its name. The IPIR+SP WebAssembly
      // is fetched and checked only when the scheme asks for it.
      this.#scheme?.dispose();
      this.#scheme = null;
      this.#readTable = this.#nullifierTable = this.#pathTable = null;
      this.#manifest = null;
      this.#manifestId = null;
      this.#scheme = await openWalletScheme(m, {
        multiplier: this.#o.multiplier,
        ipirWasm: async () => {
          wasm = await this.#o.ipirWasm();
          return wasm.module;
        },
        ...(this.#o.ipirWorkers === undefined ? {} : { ipirWorkers: this.#o.ipirWorkers }),
      });
    }
    const label = PUBLIC_ARTIFACT[m.scheme];
    const downloads: Json[] = [];
    for (const [name, ref] of [["scan file", a.scan], ["block roots", a.blockRoots], [`read table ${label}`, a.readPublic], [`nullifier table ${label}`, a.nullifierPublic]] as const) {
      downloads.push(await this.#blob(ref, name));
    }
    const blockRoots = this.#files.get(a.blockRoots.digest)!;
    if (!equal(rootOverBlocks(blockRoots, m.pathSplit, this.#hash), fromHexStrict(m.root, 32))) throw new Error("the block roots do not give the manifest's root");
    const t2 = now();
    if (!keep) {
      this.#readTable = await this.#scheme!.openTable(a.readTable, this.#files.get(a.readPublic.digest)!);
      this.#nullifierTable = await this.#scheme!.openTable(a.nullifierTable, this.#files.get(a.nullifierPublic.digest)!);
      this.#pathTable = null;
    }
    const setupMs = now() - t2;
    this.#manifest = m;
    this.#manifestId = id;
    this.#coins.clear();
    this.#fetched.clear();
    this.#matches = [];
    const debug = await this.#debug(`/debug/state?height=${m.height}`, args.debug ?? true);
    const loaded = wasm as IpirWasmLoad | null;
    return {
      snapshotId: hex(id),
      manifest: {
        network: m.network,
        height: m.height,
        blockHash: m.blockHash,
        firstFree: m.firstFree,
        padding: m.padding?.size ?? null,
        root: m.root,
        pathSplit: m.pathSplit,
        queriesPerCall: m.queriesPerCall,
        scheme: m.scheme,
        pir: m.pir,
        readTable: tableSummary(m.scheme, a.readTable),
        pathTable: a.pathTable === undefined || a.pathPublic === undefined ? null : tableSummary(m.scheme, a.pathTable, a.pathPublic.size),
        nullifierTable: tableSummary(m.scheme, a.nullifierTable),
        blocks: a.blockRoots.blocks,
      },
      manifestBytes: served.bytes.length,
      downloads,
      tablesKept: keep,
      ...(loaded === null ? {} : { ipirWasm: { bytes: loaded.bytes, sha256: loaded.sha256, ms: round(loaded.ms), threads: this.#o.ipirWorkers?.threads ?? 1 } }),
      checks: [
        "the manifest's SHA-256 is the identifier the server names",
        "every artifact's size and SHA-256 equal the manifest's",
        "the block roots give the manifest's root",
        ...(m.scheme === "ipir-sp"
          ? [
              "the IPIR+SP WebAssembly's SHA-256 equals the committed one built into the page",
              "the WebAssembly set up the read and nullifier tables from their seeds and digests and accepted their masks (it refuses masks of another setup)",
            ]
          : []),
        ...(debug === null
          ? []
          : [`database (debug): first_free ${String(debug.firstFree)}, root ${String(debug.root)} at ${m.height}: ${debug.firstFree === m.firstFree && debug.root === m.root ? "equal to the manifest" : "DIFFERENT from the manifest"}`]),
      ],
      ...(m.scheme === "simplepir" ? { setupMatricesMs: round(setupMs) } : { openTablesMs: round(setupMs) }),
      ms: round(now() - t),
    };
  }

  /** Step 3: every scan entry tested locally; nothing is sent. */
  async scan(args: { gpu?: boolean; chunk?: number } = {}, progress: (text: string) => void = () => {}): Promise<Json> {
    const k = this.#o.kernel;
    const w = this.#need(this.#keys, "derive the keys");
    const m = this.#need(this.#manifest, "get the files");
    const file = this.#files.get(m.artifacts.scan.digest)!;
    const n = slotCount(m);
    const t = now();
    let found: number[] = [];
    let engine: string;
    if (args.gpu) {
      if (this.#o.gpu === undefined) throw new Error("no WebGPU here");
      found = await (await this.#o.gpu()).scan(file, w.scanSecret);
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
    this.#matches = found.map((s) => positionAtSlot(m, s)).filter((p): p is number => p !== null);
    return {
      engine,
      entries: n,
      entryBytes: 36,
      matches: this.#matches.map((p) => {
        const s = slotOf(m, p);
        return { position: p, slot: s, entry: hex(file.subarray(36 * s, 36 * s + 36)) };
      }),
      ...(noise.length > 0 ? { noiseMatches: noise } : {}),
      ms: round(ms),
      usPerEntry: n === 0 ? 0 : round((1000 * ms) / n),
      note: "a match means the first 4 bytes of element 0 equal the wallet's pad: about 1 in 4 billion for an output that is not the wallet's",
    };
  }

  /** Step 4: the read-table records of the positions (the scan's matches by default), privately. */
  async read(args: { positions?: number[] } = {}): Promise<Json> {
    const k = this.#o.kernel;
    const m = this.#need(this.#manifest, "get the files");
    const id = this.#need(this.#manifestId, "get the files");
    const positions = [...new Set(args.positions && args.positions.length > 0 ? args.positions : this.#matches)].sort((x, y) => x - y);
    for (const p of positions) if (!Number.isInteger(p) || p < 0 || p >= m.firstFree) throw new Error(`position ${p} is not in the snapshot (0 to ${m.firstFree - 1})`);
    const ref = m.artifacts.readTable;
    const plan = paddedCalls(positions.map((p) => readCell(m, p).group), ref.groups, m.queriesPerCall);
    const stats = emptyCallStats();
    const t = now();
    const records = await readPositions(this.#o.http, m, id, this.#need(this.#readTable, "get the files"), positions, stats);
    const callMs = now() - t;
    const file = this.#files.get(m.artifacts.scan.digest)!;
    const out = [];
    for (const p of positions) {
      const r = decodeReadRecord(records.get(p)!);
      const { index, group, slot } = readCell(m, p);
      const item: Json = {
        position: p,
        ...(m.padding === undefined ? {} : { tableIndex: index }),
        ...cellOf(m.scheme, group, slot),
        commitmentPrefix: hex(r.commitmentPrefix),
        elementsShrunk: r.elements === null ? null : hex(r.elements),
      };
      let commitment: Uint8Array | null = null;
      if (this.#keys !== null) {
        const checked = checkSnapshotMatch(k, this.#keys, file.subarray(36 * index, 36 * index + 36), r);
        if ("reason" in checked) item.ownership = `not the wallet's: ${checked.reason}`;
        else {
          commitment = checked.commitment;
          const coin = this.#coinOf(p, checked.coin, checked.commitment, m.pathSplit === 0 ? [] : null, "snapshot");
          this.#coins.set(p, coin);
          item.ownership = "the wallet's: elements rebuilt from its pads, decrypted, and the decrypted coin's commitment starts with the record's 16 bytes";
          item.coin = { tokenType: coin.tokenType, value: coin.value, nonce: coin.nonce, nullifier: coin.nullifier, commitment: coin.commitment };
        }
      }
      this.#fetched.set(p, { commitment, lowerPath: this.#fetched.get(p)?.lowerPath ?? null });
      // The comparison with the stored output is the page's, one row at a time (its "Compare" button): a lookup by
      // position reads the whole events table, about 140 ms on the full Preprod database.
      out.push(item);
    }
    return {
      positions,
      calls: callPlan(m.scheme, plan, false, `the server sees only the number of calls and their sizes, never which ${m.scheme === "simplepir" ? "columns" : "rows"} are real`),
      stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
      records: out,
      ms: round(callMs),
    };
  }

  /**
   * Step 6: lower Merkle paths from the path table by PIR, as a spend does (Q58): only then is the path table's public
   * artifact (SimplePIR's setup data, IPIR+SP's masks) downloaded. Positions default to the wallet's snapshot coins.
   * Each path is checked against its block's root from the coin's commitment (with the debug database, from the stored
   * commitment for a position that is not the wallet's).
   */
  async paths(args: { positions?: number[] } = {}, progress: (text: string) => void = () => {}): Promise<Json> {
    const k = this.#o.kernel;
    const m = this.#need(this.#manifest, "get the files");
    const id = this.#need(this.#manifestId, "get the files");
    const ref = m.artifacts.pathTable;
    const publicRef = m.artifacts.pathPublic;
    if (ref === undefined || publicRef === undefined) throw new Error("this snapshot has no path table (its path split is 0): the block roots give every path");
    const blockSize = 2 ** m.pathSplit;
    const fullBlocks = Math.floor(m.firstFree / blockSize);
    const own = [...this.#coins.values()].filter((c) => c.source === "snapshot").map((c) => c.position);
    const asked = [...new Set(args.positions && args.positions.length > 0 ? args.positions : own)].sort((x, y) => x - y);
    if (asked.length === 0) throw new Error("no position: read the wallet's coins first, or enter positions");
    for (const p of asked) if (!Number.isInteger(p) || p < 0 || p >= m.firstFree) throw new Error(`position ${p} is not in the snapshot (0 to ${m.firstFree - 1})`);
    const positions = asked.filter((p) => Math.floor(p / blockSize) < fullBlocks);
    const fromTail = asked.filter((p) => Math.floor(p / blockSize) >= fullBlocks);
    const t = now();
    let download: Json | null = null;
    if (this.#pathTable === null) {
      const label = PUBLIC_ARTIFACT[m.scheme];
      progress(`downloading the path table's ${label} (${(publicRef.size / 1048576).toFixed(1)} MB), once per snapshot`);
      download = await this.#blob(publicRef, `path table ${label}`);
      this.#pathTable = await this.#need(this.#scheme, "get the files").openTable(ref, this.#files.get(publicRef.digest)!);
    }
    const plan = paddedCalls(positions.map((p) => readCell(m, p, ref).group), ref.groups, m.queriesPerCall);
    const stats = emptyCallStats();
    const records = positions.length === 0 ? new Map<number, Uint8Array>() : await readPaths(this.#o.http, m, id, this.#pathTable, positions, stats);
    const blockRoots = this.#files.get(m.artifacts.blockRoots.digest)!;
    const out = [];
    for (const p of positions) {
      const lower = decodePathRecord(records.get(p)!, m.pathSplit);
      const { group, slot } = readCell(m, p, ref);
      const item: Json = { position: p, ...cellOf(m.scheme, group, slot) };
      if (lower === null) {
        item.result = "FAILED: the path table holds no path for a position in a full block";
        out.push(item);
        continue;
      }
      item.lowerPath = lower.map(hex);
      let commitment = this.#fetched.get(p)?.commitment ?? (this.#coins.has(p) ? fromHexStrict(this.#coins.get(p)!.commitment, 32) : null);
      let from = "the wallet's coin";
      if (commitment === null) {
        const db = await this.#debug(`/debug/output?position=${p}`, true);
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
      this.#fetched.set(p, { commitment, lowerPath: lower });
      const coin = this.#coins.get(p);
      if (coin !== undefined) coin.lowerPath = lower.map(hex);
      out.push(item);
    }
    for (const p of fromTail) out.push({ position: p, result: `not read: block ${Math.floor(p / blockSize)} was not full at the snapshot, so the tail gives its path` });
    return {
      positions: asked,
      scheme: m.scheme,
      download,
      calls: callPlan(m.scheme, plan, false),
      table: tableSummary(m.scheme, ref),
      stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
      records: out,
      ms: round(now() - t),
    };
  }

  #coinOf(position: number, coin: { tokenType: Uint8Array; nonce: Uint8Array; value: bigint }, commitment: Uint8Array, lowerPath: readonly Uint8Array[] | null, source: PageCoin["source"]): PageCoin {
    const w = this.#need(this.#keys, "derive the keys");
    const info = { type: hex(coin.tokenType), nonce: hex(coin.nonce), value: coin.value };
    return {
      position,
      tokenType: info.type,
      value: coin.value.toString(),
      nonce: info.nonce,
      commitment: hex(commitment),
      nullifier: this.#o.ledger.coinNullifier(info, w.zswap.coinSecretKey),
      lowerPath: lowerPath === null ? null : lowerPath.map(hex),
      source,
      spent: null,
    };
  }

  /** Step 5: the found coins' nullifiers (and any entered by hand) in the snapshot's nullifier table, privately. */
  async nullifiers(args: { nullifiers?: string[] } = {}): Promise<Json> {
    const m = this.#need(this.#manifest, "get the files");
    const id = this.#need(this.#manifestId, "get the files");
    const manual = (args.nullifiers ?? []).map((s) => hex(fromHexStrict(s, 32)));
    const own = [...this.#coins.values()].filter((c) => c.source === "snapshot").map((c) => c.nullifier);
    const list = [...new Set([...own, ...manual])];
    const ref = m.artifacts.nullifierTable;
    const plan = paddedCalls(list.map((nf) => bucketOf(fromHexStrict(nf, 32), ref.bucketBits)), ref.groups, m.queriesPerCall);
    const stats = emptyCallStats();
    const t = now();
    const found = await lookupNullifiers(this.#o.http, m, id, this.#need(this.#nullifierTable, "get the files"), list, stats);
    const ms = now() - t;
    const results = list.map((nf) => {
      const e = found.get(nf) ?? null;
      const coin = [...this.#coins.values()].find((c) => c.nullifier === nf);
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
      calls: callPlan(m.scheme, plan, true),
      stats: { ...stats, buildMs: round(stats.buildMs), roundTripMs: round(stats.roundTripMs), decodeMs: round(stats.decodeMs) },
      results,
      note: list.length === 0 ? "no nullifier to look up: one call is still sent, so the server cannot tell a wallet with no coin" : undefined,
      ms: round(ms),
    };
  }

  /** Step 7: everything after the snapshot, its outputs scanned, its spends applied, the fetched positions' full paths checked. */
  async tail(args: { debug?: boolean } = {}): Promise<Json> {
    const k = this.#o.kernel;
    const m = this.#need(this.#manifest, "get the files");
    const id = this.#need(this.#manifestId, "get the files");
    const t = now();
    const bytes = await this.#o.http.tail();
    const fetchMs = now() - t;
    const t2 = now();
    const tl = splitTail(bytes);
    if (!equal(tl.header.snapshotId, id)) throw new Error("the tail belongs to another snapshot: get the files again");
    const blockSize = 2 ** m.pathSplit;
    const t0 = Math.floor(m.firstFree / blockSize) * blockSize;
    const blockRoots = this.#files.get(m.artifacts.blockRoots.digest)!;
    const all = new Uint8Array(32 * (t0 / blockSize) + tl.blockRoots.length);
    all.set(blockRoots.subarray(0, 32 * (t0 / blockSize)), 0);
    all.set(tl.blockRoots, 32 * (t0 / blockSize));
    const rootOk = equal(rootOverBlocks(all, m.pathSplit, this.#hash), tl.header.root);
    const outputs = tl.outputs.length / TAIL_OUTPUT_BYTES;
    const decoded = Array.from({ length: outputs }, (_, i) => decodeTailOutput(tl.outputs.subarray(i * TAIL_OUTPUT_BYTES, (i + 1) * TAIL_OUTPUT_BYTES)));
    const tailCoins = [];
    const keys = this.#keys;
    if (keys !== null) {
      const entries = new Uint8Array(36 * outputs);
      decoded.forEach((o, i) => o.ciphertext !== null && entries.set(o.ciphertext.subarray(0, 36), 36 * i));
      for (const i of outputs === 0 ? [] : k.scan(entries, keys.scanSecret)) {
        const o = decoded[i]!;
        const checked = checkCiphertext(k, keys, o.ciphertext!, o.commitment, null);
        if ("reason" in checked) continue;
        const coin = this.#coinOf(m.firstFree + i, checked.coin, checked.commitment, null, "tail");
        this.#coins.set(coin.position, coin);
        tailCoins.push({ position: coin.position, tokenType: coin.tokenType, value: coin.value });
      }
    }
    const tailNullifiers = new Map<string, { height: number; txIndex: number }>();
    for (let off = 0; off < tl.nullifiers.length; off += NULLIFIER_RECORD_BYTES) {
      const e = decodeNullifierRecord(tl.nullifiers.subarray(off, off + NULLIFIER_RECORD_BYTES));
      tailNullifiers.set(hex(e.nullifier), { height: e.height, txIndex: e.txIndex });
    }
    for (const c of this.#coins.values()) {
      const s = c.spent === null ? tailNullifiers.get(c.nullifier) : undefined;
      if (s) c.spent = { ...s, source: "tail" };
    }
    // Each fetched position's full path, as a spend builds it, against the tail's root.
    const view = { pathSplit: m.pathSplit, snapshotFirstFree: m.firstFree, snapshotBlockRoots: blockRoots, tail: tl };
    const paths = [];
    for (const [p, f0] of [...this.#fetched].slice(0, 16)) {
      // A position in the snapshot's partial block: the tail carries its commitment.
      const f = f0.commitment === null && p >= t0 && p < m.firstFree ? { ...f0, commitment: tl.commitments.slice(32 * (p - t0), 32 * (p - t0) + 32) } : f0;
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
    const clientMs = now() - t2;
    const debug = await this.#debug(`/debug/state?height=${tl.header.height}`, args.debug ?? true);
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
      clientMs: round(clientMs),
    };
  }

  /** Step 8: the coins found so far and the balance of the unspent ones, per token type. */
  summary(): Json {
    const list = [...this.#coins.values()].sort((a, b) => a.position - b.position);
    const balance: Record<string, string> = {};
    for (const c of list) if (c.spent === null) balance[c.tokenType] = (BigInt(balance[c.tokenType] ?? "0") + BigInt(c.value)).toString();
    return { coins: list, unspentBalanceByTokenType: balance };
  }

  /** Debug: stored spends below the snapshot's height, for the nullifier step's "Fill" button. */
  async sampleSpends(args: { n?: number } = {}): Promise<Json> {
    const m = this.#need(this.#manifest, "get the files");
    const r = await this.#debug(`/debug/spends?n=${args.n ?? 5}&maxHeight=${m.height}`, true);
    if (r === null) throw new Error("the page's server has no database (start serve.ts with --db-url)");
    return r;
  }

  dispose(): void {
    this.#scheme?.dispose();
    this.#scheme = null;
    this.#readTable = this.#nullifierTable = this.#pathTable = null;
  }
}
