/**
 * The server half of the private shielded sync (spec §5): one instance per process, made in `on-start-db`.
 *
 * - **Index.** At start it reads every stored Zswap output and nullifier (`./sql.ts`) into the in-memory index
 *   (`./zswap-index.ts`); after each committed height it adds that height's events, taken from the `ledger-events` and
 *   `ledger-state` items in `on-db-write` and applied in `on-after-db-write` once the height is committed (a height
 *   already in the index, as after a restart, is skipped; one whose items it did not see is read from the database).
 * - **Snapshots.** On the admin route, or every `snapshotEvery` heights while following the node, it builds one at a
 *   committed height S in a worker thread (`./build-host.ts`), checks it against the core's `zswap_first_free` and
 *   `zswap_root` at S, and serves it once complete. It keeps that snapshot and the one before, and loads both at start.
 *   Each snapshot's PIR tables are its scheme's (`../pir/scheme.ts`): the settings' `scheme`, or the admin request's for
 *   one build; the server answers a call through the table's scheme and knows nothing of its bytes.
 * - **Tail.** From the current snapshot to the committed height (`./tail.ts`), kept after each height, its root
 *   checked against the core's `zswap_root` whenever outputs were added.
 * - **Routes** under `/pss/v1` (spec §5.7), each logged with its body and answer lengths and time (FR-080), never its
 *   body.
 * - **Dust** (spec 00062): the Dust events of the current ledger era in their own index (`./dust-index.ts`), read and
 *   extended along the same two paths as the Zswap index, decoded with the repository's vendored ledger build; routes
 *   under `/pss/v1/dust/` serve the Dust file (manifest and chunks), one owner's first coins and generation updates,
 *   and the Dust parameters. A Dust failure breaks only the Dust routes.
 * - **Dust check** (00062 FR-012): the Dust commitments by position as a PIR table of the module's scheme, with its own
 *   manifest (`./dust-check.ts`), built in a worker thread at start and whenever a snapshot build starts (in that
 *   build's scheme), and served under `/pss/v1/dust/check/`. The commitments must fill positions 0 to n − 1 exactly
 *   once, with n the core's `dust_commitment_first_free` at the height, or the build fails with the reason.
 *
 * Nothing here throws out of a block point: a failure is logged, and a broken index or tail refuses builds and tail
 * answers with its reason, so the core's processing is never halted by this module.
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { arch, availableParallelism, freemem, platform, totalmem } from "node:os";
import { join, resolve } from "node:path";
import type {
  ApiRegistry,
  BlockContext,
  HttpAnswer,
  HttpFileAnswer,
  HttpRequest,
  LedgerEvent,
  ProcessContext,
  ReadHandle,
  SchemaWriteHandle,
} from "umbradb";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import type { TableName } from "../pir/matrix.ts";
import { isSchemeName, RequestRefused, SCHEME_NAMES, type SchemeName, SchemeUnavailable, type ServerScheme, type ServerTable, TableTooLarge, type TableTransfer } from "../pir/scheme.ts";
import { maxRequestBytes, openServerScheme } from "../pir/server-schemes.ts";
import { OCTET_STREAM, ROUTES } from "../shared/constants.ts";
import { fromHex, type Manifest, type PirTableRef, toHex } from "../shared/manifest.ts";
import { CALL_HEADER_BYTES, decodeQueryBody, encodeAnswerBody, WireError } from "../shared/wire.ts";
import { type DustCheckManifest, encodeDustGenerationRecords } from "../shared/dust-check.ts";
import type { DustCoinsAnswer, DustParametersAnswer } from "../shared/dust-file.ts";
import { type BuildJob, type BuildResult, paddedBuildBytes } from "./build.ts";
import { BuildFailure, runBuildWorker, type WorkerOutcome } from "./build-host.ts";
import { clearDustCheckBuilds, DustCheckFailure, type DustCheckResult, pruneDustChecks, runDustCheckWorker } from "./dust-check.ts";
import { coinEventJson, DustCoverageError, type DustEvent, DustIndex, isDustEventKind, ledgerDustDecoder } from "./dust-index.ts";
import { type Settings, settingsOf } from "./settings.ts";
import { blockHashAt, cursorOf, dustEvents, dustStateAt, genesisHashOf, stateAt, zswapEvents } from "./sql.ts";
import {
  artifactPath,
  listSnapshots,
  prepareDataDir,
  pruneSnapshots,
  readArtifact,
  type ServedFile,
  servedFiles,
  STATS_FILE,
  type StoredSnapshot,
  verifyArtifacts,
} from "./store.ts";
import { encodeTail, TailTree, type TailTip } from "./tail.ts";
import { type Hash2, rootFromStored } from "./tree.ts";
import { type NullifierEvent, type OutputEvent, ZswapIndex } from "./zswap-index.ts";

/** Options of the declaration (`pssDeclaration`). */
export interface PssOptions {
  /** Where log lines go (one JSON object each); stdout unless given. */
  readonly log?: (line: string) => void;
  /** Told each process's server once it started (for tests). */
  readonly observe?: (server: PssServer) => void;
}

/** The `ledger-state` item's fields the module reads. */
interface LedgerStateItem {
  readonly zswapFirstFree: bigint;
  readonly zswapRoot: Uint8Array;
  /** The ledger parameters after the block, in the ledger's tagged serialization (00062 phase 9: the wallet's fee). */
  readonly parameters?: Uint8Array;
}

/** One committed height's events and tip, waiting for `on-after-db-write`. */
interface Pending {
  readonly outputs: OutputEvent[];
  readonly nullifiers: NullifierEvent[];
  readonly dust: DustEvent[];
  readonly tip: TailTip;
  readonly parameters: Uint8Array | null;
}

/** The PIR tables of a snapshot, as its scheme answers from them. */
interface Tables {
  readonly read: ServerTable;
  /** Lower paths, read only to spend (Q58); null when the snapshot's k is 0. */
  readonly path: ServerTable | null;
  readonly nullifier: ServerTable;
}

/** The snapshot served: its manifest, files and PIR tables. */
interface Snapshot {
  readonly id: string;
  readonly idBytes: Uint8Array;
  readonly dir: string;
  readonly manifest: Manifest;
  readonly manifestBytes: Uint8Array;
  readonly files: Map<string, ServedFile>;
  readonly tables: Tables;
  /** Nullifiers spent at or below its height. */
  readonly nullifiers: number;
}

const releaseTables = (t: Tables): void => {
  t.read.release();
  t.path?.release();
  t.nullifier.release();
};

/** A build's tables, adopted by their scheme; on a failure, those adopted are released and the others discarded. */
async function adoptTables(scheme: ServerScheme, result: BuildResult): Promise<Tables> {
  const a = result.manifest.artifacts;
  const steps: [PirTableRef, TableTransfer][] = [[a.readTable, result.tables.read], [a.nullifierTable, result.tables.nullifier]];
  if (a.pathTable !== undefined && result.tables.path !== null) steps.splice(1, 0, [a.pathTable, result.tables.path]);
  const adopted: ServerTable[] = [];
  try {
    for (const [ref, transfer] of steps) adopted.push(await scheme.adoptTable(ref, transfer));
  } catch (cause) {
    for (const t of adopted) t.release();
    for (const [, transfer] of steps.slice(adopted.length)) scheme.discardTransfer(transfer);
    throw cause;
  }
  return adopted.length === 3 ? { read: adopted[0]!, path: adopted[1]!, nullifier: adopted[2]! } : { read: adopted[0]!, path: null, nullifier: adopted[1]! };
}

/** The Dust check table served (00062). */
interface DustCheck {
  /** The path table (k > 0), read by PIR to spend. */
  readonly pathTable: ServerTable | null;
  /** The files served by digest: the tables' public artifacts, the block roots, the generation records. */
  readonly files: ReadonlySet<string>;
  readonly id: string;
  readonly idBytes: Uint8Array;
  readonly dir: string;
  readonly manifest: DustCheckManifest;
  readonly manifestBytes: Uint8Array;
  readonly table: ServerTable;
}

interface DustCheckBuilding {
  readonly height: number;
  readonly scheme: SchemeName;
  /** `start`, or the snapshot build's trigger. */
  readonly trigger: string;
  readonly startedAt: string;
}

interface DustCheckLast {
  readonly height: number;
  readonly ok: boolean;
  readonly id: string | null;
  readonly scheme: SchemeName;
  readonly code: string | null;
  readonly message: string | null;
  readonly commitments: number | null;
  readonly finishedAt: string;
  readonly ms: number;
}

interface Tail {
  readonly tree: TailTree;
  error: string | null;
  /** The root last checked, with the outputs it covered. */
  checked: number;
  cache: { readonly height: number; readonly bytes: Uint8Array } | null;
}

interface Building {
  readonly height: number;
  readonly trigger: "admin" | "every";
  readonly startedAt: string;
  /** The PIR scheme of the build's tables. */
  readonly scheme: SchemeName;
  /** Debug (Q57): the padded size, or null. */
  readonly padding: number | null;
  /** The step running now, and when it started; the steps done, with their milliseconds. */
  step: string | null;
  stepStartedAt: string | null;
  readonly done: Record<string, number>;
}

interface LastBuild {
  readonly height: number;
  readonly ok: boolean;
  readonly id: string | null;
  readonly code: string | null;
  readonly message: string | null;
  readonly finishedAt: string;
  readonly totalMs: number;
  readonly scheme: SchemeName;
  /** Debug (Q57): the padded size, or null; each step's milliseconds when the build succeeded. */
  readonly padding: number | null;
  readonly steps: Record<string, number> | null;
}

/** The index's load at start, for the benchmark (spec §8, "Read events for a snapshot"). */
interface IndexLoad {
  readonly height: number;
  readonly rows: number;
  readonly ms: number;
  readonly rowsPerSecond: number;
  readonly peakRssBytes: number;
}

type Handler<B> = (req: HttpRequest<B>, read: ReadHandle) => Promise<HttpAnswer | HttpFileAnswer>;

const error = (status: number, code: string, message: string, extra: Record<string, unknown> = {}): HttpAnswer => ({
  status,
  body: { error: { code, message }, ...extra },
});

/** `Authorization: Bearer <secret>`, compared in constant time. */
function authorized(header: string | undefined, secret: string): boolean {
  if (header === undefined || !header.startsWith("Bearer ")) return false;
  const given = createHash("sha256").update(header.slice("Bearer ".length)).digest();
  const expected = createHash("sha256").update(secret).digest();
  return timingSafeEqual(given, expected);
}

/** The `core` entry's network, from the `config` process item. */
function networkOf(config: unknown): string {
  const entries = (config as { entries?: readonly Record<string, unknown>[] } | undefined)?.entries ?? [];
  for (const entry of [...entries].reverse()) {
    if (entry.id !== "core") continue;
    const settings = (entry.settings ?? entry.config) as { network?: unknown } | null | undefined;
    if (typeof settings?.network === "string" && settings.network.length > 0) return settings.network;
  }
  return "unknown";
}

/** Peak resident memory while `body` runs, sampled every 10 ms. */
async function measured<T>(body: () => Promise<T>): Promise<{ value: T; ms: number; peakRssBytes: number }> {
  let peak = process.memoryUsage.rss();
  const timer = setInterval(() => {
    peak = Math.max(peak, process.memoryUsage.rss());
  }, 10);
  const started = performance.now();
  try {
    const value = await body();
    peak = Math.max(peak, process.memoryUsage.rss());
    return { value, ms: performance.now() - started, peakRssBytes: peak };
  } finally {
    clearInterval(timer);
  }
}

export class PssServer {
  readonly settings: Settings;
  readonly dataDir: string;
  readonly index = new ZswapIndex();
  /** The Dust events of the current ledger era (00062). */
  readonly dust: DustIndex;
  readonly #log: (record: Record<string, unknown>) => void;
  readonly #kernel: Kernel;
  readonly #hash: Hash2;
  readonly #threads: number;
  #network = "unknown";
  #genesis: Uint8Array | null = null;
  #tip: TailTip | null = null;
  #head: number | null = null;
  #current: Snapshot | null = null;
  #previous: { readonly id: string; readonly files: Map<string, ServedFile> } | null = null;
  #tail: Tail | null = null;
  readonly #pending = new Map<number, Pending>();
  #building: Building | null = null;
  #last: LastBuild | null = null;
  #indexLoad: IndexLoad | null = null;
  /** The schemes opened (their threads, their add-ons), each once, by name. */
  readonly #schemes = new Map<SchemeName, Promise<ServerScheme>>();
  /** Heights added from the block's items, and heights read from the database (items missed). */
  #fromItems = 0;
  #fromDatabase = 0;
  /** Whether the Dust index's start ran (it marks the index broken itself when it fails). */
  #dustStarted = false;
  #dustCheck: DustCheck | null = null;
  /** The check table before the current one: its public artifact is still served. */
  #dustCheckPrevious: { readonly id: string; readonly dir: string; readonly files: ReadonlySet<string> } | null = null;
  /** The ledger parameters after the latest committed block whose item carried them (00062 phase 9). */
  #ledgerParameters: { readonly height: number; readonly bytes: Uint8Array } | null = null;
  #dustCheckBuilding: DustCheckBuilding | null = null;
  #dustCheckLast: DustCheckLast | null = null;

  constructor(settings: Settings, options: PssOptions) {
    this.settings = settings;
    this.dataDir = resolve(settings.dataDir);
    this.dust = new DustIndex({ eraHeight: settings.dustEraHeight });
    const sink = options.log ?? ((line: string) => void process.stdout.write(`${line}\n`));
    this.#log = (record) => sink(JSON.stringify({ pss: true, at: new Date().toISOString(), ...record }));
    this.#kernel = new Kernel(compileKernel());
    this.#hash = (a, b) => {
      const h = this.#kernel.hash2(a, b);
      if (h === null) throw new Error("a tree node is not a canonical field element");
      return h;
    };
    this.#threads = settings.threads > 0 ? settings.threads : Math.max(1, Math.min(8, availableParallelism() - 1));
  }

  // ── start ──────────────────────────────────────────────────────────────────────────────────────────────────────

  /**
   * `on-start-db`: the index from the stored rows, the snapshots on disk, the tail. A failure here is logged and marks
   * the index broken (every build and tail answer then gives the reason); it does not refuse the process's startup.
   */
  async start(w: SchemaWriteHandle): Promise<void> {
    try {
      await this.#start(w);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      this.index.markBroken(`the module could not start: ${message}`);
      if (!this.#dustStarted) this.dust.markBroken(`the module could not start: ${message}`);
      this.#log({ event: "start-failed", message });
    }
  }

  /**
   * The Dust index from the stored rows of the era up to `cursor`, decoded with the vendored ledger build (loaded once
   * here). A failure marks only the Dust index broken.
   */
  async #startDust(w: SchemaWriteHandle, cursor: number): Promise<void> {
    this.#dustStarted = true;
    try {
      const load = await measured(async () => {
        const ledger = await import("../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js");
        this.dust.useDecoder(ledgerDustDecoder(ledger));
        let rows = 0;
        if (cursor >= this.dust.eraHeight) {
          for (const group of await dustEvents(w, -1, cursor, this.dust.eraHeight)) {
            this.dust.appendHeight(group.height, group.events);
            rows += group.events.length;
          }
        }
        if (cursor >= 0) this.dust.advanceTo(cursor);
        return rows;
      });
      this.#log({ event: "dust-loaded", rows: load.value, ms: load.ms, peakRssBytes: load.peakRssBytes, ...this.dust.status() });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      this.dust.markBroken(`the Dust index could not be loaded: ${message}`);
      this.#log({ event: "dust-start-failed", message });
    }
  }

  async #start(w: SchemaWriteHandle): Promise<void> {
    this.#genesis = await genesisHashOf(w);
    const load = await measured(async () => {
      const cursor = await cursorOf(w);
      const groups = cursor < 0 ? [] : await zswapEvents(w, -1, cursor);
      let rows = 0;
      for (const group of groups) {
        this.index.appendHeight(group.height, group.outputs, group.nullifiers);
        rows += group.outputs.length + group.nullifiers.length;
      }
      if (cursor >= 0) this.index.advanceTo(cursor);
      return { cursor, rows };
    });
    const { cursor, rows } = load.value;
    this.#indexLoad = {
      height: cursor,
      rows,
      ms: load.ms,
      rowsPerSecond: load.ms > 0 ? (rows * 1000) / load.ms : 0,
      peakRssBytes: load.peakRssBytes,
    };
    this.#log({ event: "index-loaded", ...this.#indexLoad, outputs: this.index.outputs, nullifiers: this.index.nullifiers, error: this.index.error });
    await this.#startDust(w, cursor);
    if (cursor >= 0) {
      const state = await stateAt(w, cursor);
      if (state !== null) {
        this.#tip = { height: cursor, blockHash: state.hash, firstFree: state.firstFree, root: rootFromStored(state.root) };
        if (state.firstFree !== this.index.outputs) {
          this.#log({ event: "index-mismatch", height: cursor, outputs: this.index.outputs, firstFree: state.firstFree });
        }
      }
    }
    prepareDataDir(this.dataDir);
    await this.#loadSnapshots(w, cursor);
    // No stored check table is served: it is built again from the index at start.
    clearDustCheckBuilds(this.dataDir);
    pruneDustChecks(this.dataDir, new Set());
    if (cursor >= 0) await this.#tryDustCheck(cursor, w, this.settings.scheme, "start");
  }

  async #loadSnapshots(w: SchemaWriteHandle, cursor: number): Promise<void> {
    const ignored = (dir: string, why: string): void => this.#log({ event: "snapshot-ignored", dir, why });
    const valid: StoredSnapshot[] = [];
    for (const snapshot of listSnapshots(this.dataDir, ignored)) {
      const m = snapshot.manifest;
      try {
        if (this.#genesis === null || m.genesisHash !== toHex(this.#genesis)) throw new Error("another chain's snapshot");
        if (m.height > cursor) throw new Error(`its height ${m.height} is above the committed height ${cursor}`);
        const hash = await blockHashAt(w, m.height);
        if (hash === null || toHex(hash) !== m.blockHash) throw new Error(`block ${m.height}'s hash is not the manifest's`);
        if (m.firstFree !== this.index.outputsAt(m.height)) throw new Error(`the index has another first_free at ${m.height}`);
        // A scheme this build lacks, or cannot open here (IPIR+SP without its add-on): the snapshot is ignored (Q15).
        await this.#scheme(m.scheme);
        verifyArtifacts(snapshot);
        valid.push(snapshot);
      } catch (cause) {
        ignored(snapshot.dir, cause instanceof Error ? cause.message : String(cause));
      }
      if (valid.length === 2) break;
    }
    const [latest, before] = valid;
    if (before !== undefined) this.#previous = { id: before.id, files: servedFiles(before) };
    if (latest === undefined) return;
    const a = latest.manifest.artifacts;
    const scheme = await this.#scheme(latest.manifest.scheme);
    const snapshot: Snapshot = {
      id: latest.id,
      idBytes: fromHex(latest.id, 32),
      dir: latest.dir,
      manifest: latest.manifest,
      manifestBytes: latest.manifestBytes,
      files: servedFiles(latest),
      tables: {
        read: await scheme.loadTable(a.readTable, artifactPath(latest, "readTable"), artifactPath(latest, "readPublic")),
        path: a.pathTable === undefined ? null : await scheme.loadTable(a.pathTable, artifactPath(latest, "pathTable"), artifactPath(latest, "pathPublic")),
        nullifier: await scheme.loadTable(a.nullifierTable, artifactPath(latest, "nullifierTable"), artifactPath(latest, "nullifierPublic")),
      },
      nullifiers: this.index.nullifiersAt(latest.manifest.height),
    };
    const tree = TailTree.fromSnapshot(
      latest.manifest.pathSplit,
      this.#hash,
      readArtifact(latest, "blockRoots"),
      latest.manifest.firstFree,
      (i) => this.#leaf(i),
    );
    this.#current = snapshot;
    this.#tail = { tree, error: null, checked: -1, cache: null };
    this.#advanceTail();
    this.#log({ event: "snapshot-loaded", id: snapshot.id, height: snapshot.manifest.height, previous: this.#previous?.id ?? null });
  }

  /** The scheme of this name, opened once (its threads, its add-on); throws {@link SchemeUnavailable} if this build lacks it. */
  #scheme(name: SchemeName): Promise<ServerScheme> {
    let opened = this.#schemes.get(name);
    if (opened === undefined) {
      opened = openServerScheme(name, { threads: this.#threads });
      this.#schemes.set(name, opened);
      // A scheme that failed to open is tried again next time (its add-on may have been built since).
      opened.catch(() => this.#schemes.delete(name));
    }
    return opened;
  }

  #leaf(position: number): Uint8Array {
    return this.#kernel.leaf(this.index.commitment(position));
  }

  // ── block points ───────────────────────────────────────────────────────────────────────────────────────────────

  /** `on-finalized`: the node's finalized head, which decides whether the process is following it. */
  finalized(height: bigint): void {
    this.#head = Number(height);
  }

  /** `on-db-write`: keeps the height's Zswap events and tree values until the height is committed. */
  stash(b: BlockContext): void {
    try {
      const events = b.items.get("ledger-events") as readonly LedgerEvent[] | undefined;
      const state = b.items.get("ledger-state") as LedgerStateItem | undefined;
      if (events === undefined || state === undefined) return;
      const height = Number(b.height);
      const outputs: OutputEvent[] = [];
      const nullifiers: NullifierEvent[] = [];
      const dust: DustEvent[] = [];
      for (const e of events) {
        if (e.kind === "zswap-output") {
          if (e.commitment === null || e.treeIndex === null || e.evidence === null) throw new Error(`an output at ${height} without its fields`);
          outputs.push({ height, txIndex: e.transaction, position: Number(e.treeIndex), commitment: e.commitment, evidence: e.evidence, ciphertext: e.ciphertext });
        } else if (e.kind === "zswap-input") {
          if (e.nullifier === null) throw new Error(`an input at ${height} without its nullifier`);
          nullifiers.push({ height, txIndex: e.transaction, nullifier: e.nullifier });
        } else if (isDustEventKind(e.kind)) {
          dust.push({ height, txIndex: e.transaction, kind: e.kind, bytes: e.bytes, nullifier: e.nullifier, commitment: e.commitment, treeIndex: e.treeIndex === null ? null : Number(e.treeIndex) });
        }
      }
      const tip: TailTip = { height, blockHash: b.hash, firstFree: Number(state.zswapFirstFree), root: rootFromStored(state.zswapRoot) };
      this.#pending.set(height, { outputs, nullifiers, dust, tip, parameters: state.parameters ?? null });
    } catch (cause) {
      this.#log({ event: "stash-failed", height: Number(b.height), message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  /** `on-after-db-write`: adds the committed height to the index and the tail; builds every `snapshotEvery` heights. */
  async committed(b: BlockContext, read: ReadHandle): Promise<void> {
    const height = Number(b.height);
    const pending = this.#pending.get(height);
    for (const key of [...this.#pending.keys()]) if (key <= height) this.#pending.delete(key);
    if (pending?.parameters) this.#ledgerParameters = { height, bytes: pending.parameters };
    await this.#commitDust(height, pending, read);
    try {
      if (height <= this.index.height) return;
      if (pending !== undefined && height === this.index.height + 1) {
        this.index.appendHeight(height, pending.outputs, pending.nullifiers);
        this.#tip = pending.tip;
        this.#fromItems++;
      } else {
        this.#fromDatabase++;
        for (const group of await zswapEvents(read, this.index.height, height)) {
          this.index.appendHeight(group.height, group.outputs, group.nullifiers);
        }
        this.index.advanceTo(height);
        const state = await stateAt(read, height);
        if (state !== null) this.#tip = { height, blockHash: state.hash, firstFree: state.firstFree, root: rootFromStored(state.root) };
      }
      this.#advanceTail();
      const every = this.settings.snapshotEvery;
      const following = this.#head === null || this.#head - height < every;
      if (every > 0 && height % every === 0 && following && this.#building === null) {
        const refused = await this.#startBuild(height, read, "every");
        if (refused !== null) this.#log({ event: "build-refused", height, trigger: "every", ...(refused.body as object) });
      }
    } catch (cause) {
      this.#log({ event: "height-failed", height, message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  /**
   * Adds the committed height to the Dust index: from the block's item when it follows the index, else every height
   * since the index's from the database. A failed read is logged and read again with the next height.
   */
  async #commitDust(height: number, pending: Pending | undefined, read: ReadHandle): Promise<void> {
    const dust = this.dust;
    try {
      if (height <= dust.height) return;
      if (dust.error !== null) {
        dust.advanceTo(height);
      } else if (pending !== undefined && height === dust.height + 1) {
        dust.appendHeight(height, pending.dust);
      } else {
        for (const group of await dustEvents(read, dust.height, height, dust.eraHeight)) dust.appendHeight(group.height, group.events);
        dust.advanceTo(height);
      }
    } catch (cause) {
      this.#log({ event: "dust-height-failed", height, message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  /** Appends the index's new outputs to the tail's tree and checks its root against the core's. */
  #advanceTail(): void {
    const tail = this.#tail;
    if (tail === null || tail.error !== null) return;
    if (this.index.error !== null) {
      tail.error = this.index.error;
      return;
    }
    while (tail.tree.next < this.index.outputs) tail.tree.append(this.#leaf(tail.tree.next));
    tail.cache = null;
    const tip = this.#tip;
    if (tip === null || tail.checked === tail.tree.next) return;
    if (tip.firstFree !== tail.tree.next) {
      tail.error = `the tail holds ${tail.tree.next} outputs, the core's zswap_first_free at ${tip.height} is ${tip.firstFree}`;
    } else if (toHex(tail.tree.root()) !== toHex(tip.root)) {
      tail.error = `the tail's root at ${tip.height} is ${toHex(tail.tree.root())}, the core's zswap_root is ${toHex(tip.root)}`;
    }
    tail.checked = tail.tree.next;
    if (tail.error !== null) this.#log({ event: "tail-broken", height: tip.height, message: tail.error });
  }

  // ── builds ─────────────────────────────────────────────────────────────────────────────────────────────────────

  /**
   * Starts a build at S (≤ the index's height) with `scheme` (the settings' unless given); an answer when it cannot
   * start, null when it started.
   */
  async #startBuild(height: number, read: ReadHandle, trigger: Building["trigger"], padding?: number, scheme: SchemeName = this.settings.scheme): Promise<HttpAnswer | null> {
    // The scheme is opened first, so a scheme this build lacks (or whose add-on is missing) refuses the build before
    // anything is read (00058). The checks after it run without a pause up to `#building`, so two requests arriving
    // together still start one build.
    try {
      await this.#scheme(scheme);
    } catch (cause) {
      if (!(cause instanceof SchemeUnavailable)) throw cause;
      return error(501, "scheme-unavailable", cause.message, { scheme });
    }
    if (this.#building !== null) {
      return error(409, "build-running", `a snapshot is being built at ${this.#building.height}`, { building: this.#building });
    }
    if (this.index.error !== null) return error(500, "index-broken", this.index.error);
    if (this.#genesis === null) return error(500, "no-genesis", "the database records no genesis hash");
    if (padding !== undefined) {
      const outputs = this.index.outputsAt(height);
      const nullifiers = this.index.nullifiersAt(height);
      if (outputs < 1 || padding < outputs || padding < nullifiers) {
        return error(400, "invalid-padding", `padding must be at least the ${outputs} outputs and ${nullifiers} nullifiers at ${height} (and there must be an output)`);
      }
      // Refused when the build would hold more than half the machine's memory with the snapshot served now, or more
      // than half the memory available now: a 10M build on a machine whose other programs held most of its memory
      // swapped for 25 minutes without finishing (Q57).
      const c = this.#current;
      const held = c === null ? 0 : c.tables.read.heldBytes + (c.tables.path?.heldBytes ?? 0) + c.tables.nullifier.heldBytes;
      let needed: number;
      try {
        needed = paddedBuildBytes(padding, this.settings.pathSplit, scheme);
      } catch (cause) {
        // A table the scheme cannot lay out (IPIR+SP: over 2^30 cells), refused with the estimate (00058 edge cases).
        if (!(cause instanceof TableTooLarge)) throw cause;
        return error(507, "table-too-large", cause.message, { scheme, table: cause.table, neededCells: cause.neededCells, maxCells: cause.maxCells });
      }
      const half = totalmem() / 2;
      const available = availableMemory();
      if (needed + held > half || needed > available / 2) {
        const gib = (b: number): string => `${(b / 2 ** 30).toFixed(1)} GiB`;
        return error(
          507,
          "padding-too-large",
          `a snapshot padded to ${padding.toLocaleString("en-US")} entries needs about ${gib(needed)}; ` +
            (needed > available / 2
              ? `${gib(available)} of memory is available now, and a padded build may use half of it`
              : `with the ${gib(held)} the served snapshot holds, that is over half this machine's memory, ${gib(half)}`),
          { neededBytes: Math.round(needed), heldBytes: held, halfBytes: half, availableBytes: available },
        );
      }
    }
    // Taken before the read below, so a second request arriving meanwhile is refused (one build at a time).
    const building: Building = { height, trigger, startedAt: new Date().toISOString(), scheme, padding: padding ?? null, step: null, stepStartedAt: null, done: {} };
    this.#building = building;
    let prepared;
    try {
      prepared = await measured(async () => {
        const state = await stateAt(read, height);
        const outputs = this.index.outputsAt(height);
        const nullifiers = this.index.nullifiersAt(height);
        return { state, outputs, nullifiers, slice: this.index.slice(outputs, nullifiers) };
      });
    } catch (cause) {
      this.#building = null;
      throw cause;
    }
    const { state, outputs, nullifiers, slice } = prepared.value;
    if (state === null) {
      this.#building = null;
      return error(409, "no-state", `the core stores no ledger state at ${height}`);
    }
    const job: BuildJob = {
      height,
      blockHash: state.hash,
      genesisHash: this.#genesis,
      network: this.#network,
      expectedFirstFree: state.firstFree,
      expectedRoot: rootFromStored(state.root),
      pathSplit: this.settings.pathSplit,
      queriesPerCall: this.settings.queriesPerCall,
      scheme,
      threads: this.#threads,
      dataDir: this.dataDir,
      slice,
      ...(padding === undefined ? {} : { padding }),
    };
    const started = performance.now();
    const readEvents = {
      ms: prepared.ms,
      rows: outputs + nullifiers,
      rowsPerSecond: prepared.ms > 0 ? ((outputs + nullifiers) * 1000) / prepared.ms : 0,
      peakRssBytes: prepared.peakRssBytes,
    };
    this.#log({ event: "build-started", height, trigger, scheme, outputs, nullifiers, pathSplit: job.pathSplit, padding: padding ?? null });
    const onStep = (name: string, phase: "start" | "end", ms?: number): void => {
      if (phase === "start") {
        building.step = name;
        building.stepStartedAt = new Date().toISOString();
      } else {
        building.done[name] = Math.round(ms ?? 0);
        building.step = null;
        building.stepStartedAt = null;
      }
    };
    runBuildWorker(job, onStep).then(
      (outcome) => this.#promote(outcome, building, nullifiers, readEvents, started),
      (cause: unknown) => this.#failed(building, cause, started),
    );
    // The Dust check table follows every snapshot build, in its scheme (00062: the same triggers).
    await this.#tryDustCheck(height, read, scheme, trigger);
    return null;
  }

  // ── the Dust check table (00062) ───────────────────────────────────────────────────────────────────────────────

  /** {@link #startDustCheck}, its unexpected failures (a database read) logged, never thrown to the caller. */
  async #tryDustCheck(height: number, read: Pick<ReadHandle, "query">, scheme: SchemeName, trigger: string): Promise<void> {
    try {
      await this.#startDustCheck(height, read, scheme, trigger);
    } catch (cause) {
      this.#dustCheckBuilding = null;
      this.#log({ event: "dust-check-failed", height, scheme, trigger, code: "start-failed", message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  /**
   * Starts a build of the Dust check table at `height` in `scheme`, in a worker thread. The commitments are taken from
   * the index and compared with the core's `dust_commitment_first_free` before this returns; the build goes on after.
   * Returns why it did not start, or null. One builds at a time: a trigger while one builds is logged and skipped.
   */
  async #startDustCheck(height: number, read: Pick<ReadHandle, "query">, scheme: SchemeName, trigger: string): Promise<string | null> {
    const running = this.#dustCheckBuilding;
    if (running !== null) {
      const message = `a Dust check table is being built at ${running.height}`;
      this.#log({ event: "dust-check-busy", height, scheme, trigger, message });
      return message;
    }
    const refuse = (code: string, message: string, commitments: number | null = null): string => {
      this.#dustCheckLast = { height, ok: false, id: null, scheme, code, message, commitments, finishedAt: new Date().toISOString(), ms: 0 };
      this.#log({ event: "dust-check-refused", height, scheme, trigger, code, message });
      return message;
    };
    if (this.dust.error !== null) return refuse("dust-broken", this.dust.error);
    let table;
    try {
      table = this.dust.commitments(Math.min(height, this.dust.height));
    } catch (cause) {
      if (!(cause instanceof DustCoverageError)) throw cause;
      return refuse("coverage", cause.message);
    }
    if (table.count === 0) return refuse("no-commitments", `the Dust index has no commitment at or below height ${height} (the era starts at ${this.dust.eraHeight})`);
    let records;
    try {
      records = this.dust.generationRecords(table.height);
    } catch (cause) {
      if (!(cause instanceof DustCoverageError)) throw cause;
      return refuse("coverage", cause.message, table.count);
    }
    const state = await dustStateAt(read, table.height);
    if (state === null) return refuse("no-state", `the core stores no ledger state at ${table.height}`, table.count);
    if (state.commitmentFirstFree !== table.count) {
      return refuse(
        "first-free-mismatch",
        `the Dust events up to height ${table.height} fill positions 0 to ${table.count - 1}; the core's dust_commitment_first_free there is ${state.commitmentFirstFree}`,
        table.count,
      );
    }
    if (state.generationFirstFree !== records.length) {
      return refuse("generation-first-free-mismatch", `the Dust events up to height ${table.height} give ${records.length} generation records; the core's dust_generation_first_free there is ${state.generationFirstFree}`, table.count);
    }
    // The generation tree's root must be the core's (phase 9 acceptance 3): the build worker checks it, since the ledger
    // takes about 7 ms a record and would hold up the event loop.
    const building: DustCheckBuilding = { height: table.height, scheme, trigger, startedAt: new Date().toISOString() };
    this.#dustCheckBuilding = building;
    const started = performance.now();
    this.#log({ event: "dust-check-started", height: table.height, scheme, trigger, commitments: table.count });
    runDustCheckWorker({
      eraHeight: this.dust.eraHeight,
      height: table.height,
      commitments: table.bytes,
      count: table.count,
      scheme,
      threads: this.#threads,
      queriesPerCall: this.settings.queriesPerCall,
      dataDir: this.dataDir,
      blockTime: state.blockTime,
      pathSplit: this.settings.pathSplit,
      expectedRoot: rootFromStored(state.commitmentRoot),
      generation: encodeDustGenerationRecords(records),
      generationRecords: records.length,
      expectedGenerationRoot: rootFromStored(state.generationRoot),
    }).then(
      (result) => this.#adoptDustCheck(result, building, started),
      (cause: unknown) => this.#dustCheckFailed(building, cause, started),
    );
    return null;
  }

  async #adoptDustCheck(result: DustCheckResult, building: DustCheckBuilding, started: number): Promise<void> {
    let table: ServerTable;
    let pathTable: ServerTable | null = null;
    try {
      const scheme = await this.#scheme(result.manifest.scheme);
      try {
        table = await scheme.adoptTable(result.manifest.table, result.transfer);
      } catch (cause) {
        scheme.discardTransfer(result.transfer);
        if (result.pathTransfer !== null) scheme.discardTransfer(result.pathTransfer);
        throw cause;
      }
      const t = result.manifest.tree;
      if (result.pathTransfer !== null && t.pathTable !== undefined) {
        try {
          pathTable = await scheme.adoptTable(t.pathTable, result.pathTransfer);
        } catch (cause) {
          table.release();
          scheme.discardTransfer(result.pathTransfer);
          throw cause;
        }
      }
    } catch (cause) {
      this.#dustCheckFailed(building, cause, started);
      return;
    }
    const m0 = result.manifest;
    const files = new Set([m0.public.digest, m0.tree.blockRoots.digest, m0.generation.file.digest, ...(m0.tree.pathPublic === undefined ? [] : [m0.tree.pathPublic.digest])]);
    const previous = this.#dustCheck;
    this.#dustCheck = { id: result.id, idBytes: fromHex(result.id, 32), dir: result.dir, manifest: result.manifest, manifestBytes: result.manifestBytes, table, pathTable, files };
    if (previous !== null) {
      // Its calls are refused from now on (409 naming the new one); its public files are still served.
      previous.table.release();
      previous.pathTable?.release();
      if (previous.id !== result.id) this.#dustCheckPrevious = { id: previous.id, dir: previous.dir, files: previous.files };
    }
    const keep = new Set([result.id, ...(this.#dustCheckPrevious === null ? [] : [this.#dustCheckPrevious.id])]);
    pruneDustChecks(this.dataDir, keep);
    const ms = performance.now() - started;
    const m = result.manifest;
    this.#dustCheckLast = { height: building.height, ok: true, id: result.id, scheme: m.scheme, code: null, message: null, commitments: m.commitments, finishedAt: new Date().toISOString(), ms };
    this.#dustCheckBuilding = null;
    this.#log({
      event: "dust-check-built",
      height: m.height,
      id: result.id,
      scheme: m.scheme,
      commitments: m.commitments,
      groups: m.table.groups,
      perGroup: m.table.perGroup,
      tableBytes: m.table.size,
      publicBytes: m.public.size,
      tableMs: result.tableMs,
      setupMs: result.setupMs,
      treeMs: result.treeMs,
      pathMs: result.pathMs,
      generationMs: result.generationMs,
      root: m.tree.root,
      blocks: m.tree.blockRoots.blocks,
      pathTableBytes: m.tree.pathTable?.size ?? null,
      pathPublicBytes: m.tree.pathPublic?.size ?? null,
      generationRecords: m.generation.records,
      generationRoot: m.generation.root,
      ms,
    });
  }

  #dustCheckFailed(building: DustCheckBuilding, cause: unknown, started: number): void {
    const code = cause instanceof DustCheckFailure ? cause.code : "build-failed";
    const message = cause instanceof Error ? cause.message : String(cause);
    this.#dustCheckLast = { height: building.height, ok: false, id: null, scheme: building.scheme, code, message, commitments: null, finishedAt: new Date().toISOString(), ms: performance.now() - started };
    this.#dustCheckBuilding = null;
    this.#log({ event: "dust-check-failed", height: building.height, scheme: building.scheme, code, message });
  }

  #failed(building: Building, cause: unknown, started: number): void {
    const code = cause instanceof BuildFailure ? cause.code : "build-failed";
    const message = cause instanceof Error ? cause.message : String(cause);
    this.#last = { height: building.height, ok: false, id: null, code, message, finishedAt: new Date().toISOString(), totalMs: performance.now() - started, scheme: building.scheme, padding: building.padding, steps: null };
    this.#building = null;
    this.#log({ event: "build-failed", height: building.height, code, message });
  }

  async #promote(outcome: WorkerOutcome, building: Building, nullifiers: number, readEvents: Record<string, number>, started: number): Promise<void> {
    const result: BuildResult = outcome.result;
    try {
      // The build's tables, made answerable here by their scheme (opened when the build started); freed if superseded.
      const scheme = await this.#scheme(result.manifest.scheme);
      if (this.#current !== null && this.#current.manifest.height > result.manifest.height) {
        const current = this.#current;
        for (const t of [result.tables.read, result.tables.path, result.tables.nullifier]) if (t !== null) scheme.discardTransfer(t);
        pruneSnapshots(this.dataDir, new Set([current.id, ...(this.#previous === null ? [] : [this.#previous.id])]));
        throw new BuildFailure("superseded", `a snapshot at ${current.manifest.height} is newer than this one at ${result.manifest.height}`);
      }
      const { read, path, nullifier } = await adoptTables(scheme, result);
      const snapshot: Snapshot = {
        id: result.id,
        idBytes: fromHex(result.id, 32),
        dir: result.dir,
        manifest: result.manifest,
        manifestBytes: result.manifestBytes,
        files: servedFiles({ id: result.id, dir: result.dir, manifest: result.manifest, manifestBytes: result.manifestBytes }),
        tables: { read, path, nullifier },
        nullifiers,
      };
      const tail: Tail = { tree: TailTree.fromStates(result.manifest.pathSplit, this.#hash, result.upper, result.partial), error: null, checked: -1, cache: null };
      const current = this.#current;
      if (current === null || current.id !== snapshot.id) this.#previous = current === null ? this.#previous : { id: current.id, files: current.files };
      this.#current = snapshot;
      // The replaced snapshot's files are still served by digest; its tables answer no more calls (409 from now on).
      if (current !== null) releaseTables(current.tables);
      this.#tail = tail;
      this.#advanceTail();
      const keep = new Set([snapshot.id, ...(this.#previous === null ? [] : [this.#previous.id])]);
      const pruned = pruneSnapshots(this.dataDir, keep);
      const totalMs = performance.now() - started;
      const stats = {
        snapshot: snapshot.id,
        height: building.height,
        trigger: building.trigger,
        network: this.#network,
        outputs: result.manifest.firstFree,
        nullifiers,
        pathSplit: result.manifest.pathSplit,
        queriesPerCall: result.manifest.queriesPerCall,
        scheme: result.manifest.scheme,
        padding: building.padding,
        threads: this.#threads,
        startedAt: building.startedAt,
        finishedAt: new Date().toISOString(),
        totalMs,
        indexLoad: this.#indexLoad,
        readEvents,
        steps: outcome.steps,
        peakRssBytes: outcome.peakRssBytes,
        maxRssBytes: process.resourceUsage().maxRSS * 1024,
        artifacts: Object.fromEntries(Object.entries(result.manifest.artifacts).map(([name, ref]) => [name, ref.size])),
        machine: { node: process.version, platform: platform(), arch: arch(), cpus: availableParallelism() },
      };
      writeFileSync(join(snapshot.dir, STATS_FILE), `${JSON.stringify(stats, null, 2)}\n`);
      const stepMs = Object.fromEntries(Object.entries(outcome.steps).map(([name, step]) => [name, Math.round(step.ms)]));
      this.#last = { height: building.height, ok: true, id: snapshot.id, code: null, message: null, finishedAt: stats.finishedAt, totalMs, scheme: building.scheme, padding: building.padding, steps: stepMs };
      this.#log({ event: "build-done", height: building.height, id: snapshot.id, scheme: building.scheme, totalMs, previous: this.#previous?.id ?? null, pruned });
    } catch (cause) {
      this.#failed(building, cause, started);
      return;
    }
    this.#building = null;
  }

  // ── routes ─────────────────────────────────────────────────────────────────────────────────────────────────────

  /**
   * `on-start-api`: reads the network's name (the `config` item, which a context holds from `on-start-api` on) and
   * registers the routes of spec §5.7.
   */
  routes(p: ProcessContext, api: ApiRegistry): void {
    this.#network = networkOf(p.items.get("config"));
    // The settings' scheme is opened now (its threads started), as the snapshot's was at start; a scheme this build
    // lacks is reported when a build asks for it.
    this.#scheme(this.settings.scheme).catch((cause: unknown) => this.#log({ event: "scheme-unavailable", scheme: this.settings.scheme, message: cause instanceof Error ? cause.message : String(cause) }));
    const queriesPerCall = Math.max(this.settings.queriesPerCall, this.#current?.manifest.queriesPerCall ?? 0);
    // The body limit is fixed at registration: the largest request of any table any registered scheme can build
    // (SimplePIR: the noise check caps its columns, FR-058), times the calls' request count (00058 FR-022).
    const maxBodyBytes = CALL_HEADER_BYTES + queriesPerCall * maxRequestBytes();
    this.#route(api, "GET", ROUTES.manifest, async () => this.#manifest());
    this.#route(api, "GET", `${ROUTES.blob}:digest`, async (req) => this.#blob(req.params.digest ?? ""));
    this.#route(api, "GET", ROUTES.tail, async () => this.#tailAnswer());
    this.#binaryRoute(api, ROUTES.queryRead, "read", maxBodyBytes);
    this.#binaryRoute(api, ROUTES.queryNullifier, "nullifier", maxBodyBytes);
    this.#binaryRoute(api, ROUTES.queryPath, "path", maxBodyBytes);
    this.#route(api, "POST", ROUTES.adminSnapshot, async (req, read) => this.#adminBuild(req, read));
    this.#route(api, "GET", ROUTES.adminSnapshot, async (req) => this.#adminStatus(req));
    this.#route(api, "GET", ROUTES.dustManifest, async () => this.#dustManifest());
    this.#route(api, "GET", `${ROUTES.dustChunk}:n`, async (req) => this.#dustChunk(req.params.n ?? "", req.params.count));
    this.#route(api, "GET", ROUTES.dustCoins, async (req) => this.#dustCoins(req.params.owner));
    this.#route(api, "GET", ROUTES.dustParameters, async () => this.#dustParameters());
    this.#route(api, "GET", ROUTES.dustCheckManifest, async () => this.#dustCheckManifest());
    this.#route(api, "GET", `${ROUTES.dustCheckBlob}:digest`, async (req) => this.#dustCheckBlob(req.params.digest ?? ""));
    const checkQuery: Handler<Uint8Array> = async (req) => this.#dustCheckQuery(req, "check");
    api.http("POST", ROUTES.dustCheckQuery, this.#logged(`POST ${ROUTES.dustCheckQuery}`, checkQuery), { body: "binary", maxBodyBytes });
    const pathQuery: Handler<Uint8Array> = async (req) => this.#dustCheckQuery(req, "path");
    api.http("POST", ROUTES.dustPathQuery, this.#logged(`POST ${ROUTES.dustPathQuery}`, pathQuery), { body: "binary", maxBodyBytes });
  }

  /** Registers a JSON route, logged (FR-080). */
  #route(api: ApiRegistry, method: "GET" | "POST", path: string, handler: Handler<unknown>): void {
    api.http(method, path, this.#logged(`${method} ${path}`, handler));
  }

  #binaryRoute(api: ApiRegistry, path: string, table: TableName, maxBodyBytes: number): void {
    const handler: Handler<Uint8Array> = async (req) => this.#query(req, table);
    api.http("POST", path, this.#logged(`POST ${path}`, handler), { body: "binary", maxBodyBytes });
  }

  #logged<B>(route: string, handler: Handler<B>): Handler<B> {
    return async (req, read) => {
      const started = performance.now();
      let answer: HttpAnswer | HttpFileAnswer;
      try {
        answer = await handler(req, read);
      } catch (cause) {
        this.#log({ event: "route-failed", route, message: cause instanceof Error ? cause.message : String(cause) });
        answer = error(500, "internal-error", "the request failed");
      }
      this.#log({
        event: "request",
        route,
        status: answer.status,
        bodyBytes: req.body instanceof Uint8Array ? req.body.length : Number(req.headers["content-length"] ?? 0),
        answerBytes: answerBytes(answer),
        range: req.headers.range ?? null,
        ms: Math.round((performance.now() - started) * 1000) / 1000,
      });
      return answer;
    };
  }

  #manifest(): HttpAnswer {
    const snapshot = this.#current;
    if (snapshot === null) return error(503, "no-snapshot", "no snapshot has been built yet");
    return {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", ETag: `"${snapshot.id}"`, "Pss-Snapshot-Id": snapshot.id },
      body: snapshot.manifestBytes,
    };
  }

  #blob(digest: string): HttpAnswer | HttpFileAnswer {
    if (!/^[0-9a-f]{64}$/.test(digest)) return error(400, "invalid-digest", "a digest is 64 lower-case hex digits");
    const file = this.#current?.files.get(digest) ?? this.#previous?.files.get(digest);
    if (file === undefined) return error(404, "no-such-artifact", "no artifact of the current or the previous snapshot has this digest");
    return {
      status: 200,
      headers: { ETag: `"${digest}"`, "Cache-Control": "public, max-age=31536000, immutable" },
      file: { path: file.path, contentType: file.contentType },
    };
  }

  #tailAnswer(): HttpAnswer {
    const snapshot = this.#current;
    const tail = this.#tail;
    const tip = this.#tip;
    if (snapshot === null || tail === null || tip === null) return error(503, "no-snapshot", "no snapshot has been built yet");
    if (tail.error !== null) return error(500, "tail-broken", tail.error);
    if (tail.cache === null || tail.cache.height !== tip.height) {
      const bytes = encodeTail({
        snapshotId: snapshot.idBytes,
        snapshotFirstFree: snapshot.manifest.firstFree,
        snapshotNullifiers: snapshot.nullifiers,
        tip,
        index: this.index,
        tree: tail.tree,
      });
      tail.cache = { height: tip.height, bytes };
    }
    return {
      status: 200,
      headers: { "Content-Type": OCTET_STREAM, "Cache-Control": "no-store", "Pss-Snapshot-Id": snapshot.id },
      body: tail.cache.bytes,
    };
  }

  async #query(req: HttpRequest<Uint8Array>, name: TableName): Promise<HttpAnswer> {
    if (req.headers["content-type"] !== OCTET_STREAM) return error(415, "unsupported-media-type", `the body must be ${OCTET_STREAM}`);
    const snapshot = this.#current;
    if (snapshot === null) return error(503, "no-snapshot", "no snapshot has been built yet");
    const table = snapshot.tables[name];
    if (table === null) return error(404, "no-path-table", "this snapshot has no path table (its path split is 0)");
    let call;
    try {
      // The scheme's request length: a body of another length is refused before any work (00058 FR-022).
      call = decodeQueryBody(req.body, table.requestBytes, { queriesPerCall: snapshot.manifest.queriesPerCall, snapshotId: snapshot.idBytes });
    } catch (cause) {
      if (!(cause instanceof WireError)) throw cause;
      const code = cause.status === 409 ? "snapshot-replaced" : "invalid-query";
      return error(cause.status, code, cause.message, cause.status === 409 ? { snapshot: snapshot.id } : {});
    }
    let answers: Uint8Array;
    try {
      answers = await table.answer(call.payload, call.count);
    } catch (cause) {
      // Bytes of the right length that are not this table's requests (00058: an IPIR+SP request of another table).
      if (!(cause instanceof RequestRefused)) throw cause;
      return error(400, "invalid-query", cause.message);
    }
    return {
      status: 200,
      headers: { "Content-Type": OCTET_STREAM, "Cache-Control": "no-store", "Pss-Snapshot-Id": snapshot.id },
      body: encodeAnswerBody({ snapshotId: snapshot.idBytes, count: call.count, payload: answers }, table.responseBytes),
    };
  }

  // ── Dust (00062) ───────────────────────────────────────────────────────────────────────────────────────────────

  /** The answer when the Dust index cannot be served, else null. */
  #dustRefused(): HttpAnswer | null {
    const reason = this.dust.error;
    return reason === null ? null : error(500, "dust-broken", reason);
  }

  #dustManifest(): HttpAnswer {
    const refused = this.#dustRefused();
    if (refused !== null) return refused;
    return { status: 200, headers: { "Cache-Control": "no-cache" }, body: this.dust.manifest() };
  }

  /**
   * Chunk `n`'s bytes, with its first `count` entries when the query names them (the count the manifest lists, so a
   * wallet gets the manifest's bytes while the file grows). Chunk `n` at a count never changes, so it, and a full
   * chunk, may be cached for good; the last chunk asked for without a count may change.
   */
  #dustChunk(n: string, count: string | undefined): HttpAnswer {
    const refused = this.#dustRefused();
    if (refused !== null) return refused;
    const decimal = /^(0|[1-9][0-9]{0,8})$/;
    if (!decimal.test(n)) return error(400, "invalid-chunk", "a chunk number is a whole number in decimal");
    if (count !== undefined && !decimal.test(count)) return error(400, "invalid-count", "count is a whole number of entries in decimal");
    const chunk = this.dust.chunk(Number(n), count === undefined ? undefined : Number(count));
    if (chunk === null) return error(404, "no-such-chunk", `the Dust file has ${this.dust.chunks} chunks of ${this.dust.chunkEntries} entries and ${this.dust.entries} entries in all`);
    return {
      status: 200,
      headers: {
        "Content-Type": OCTET_STREAM,
        ETag: `"${chunk.sha256}"`,
        "Cache-Control": chunk.full || count !== undefined ? "public, max-age=31536000, immutable" : "no-cache",
      },
      body: chunk.bytes,
    };
  }

  /** One owner's first coins and generation updates (the owner is shown to the server: spec 00062, assumptions). */
  #dustCoins(owner: string | undefined): HttpAnswer {
    const refused = this.#dustRefused();
    if (refused !== null) return refused;
    if (owner === undefined || !/^(0|[1-9][0-9]{0,77})$/.test(owner) || BigInt(owner) >= 1n << 256n) {
      return error(400, "invalid-owner", "owner is a Dust public key in decimal");
    }
    const coins = this.dust.coinsOf(BigInt(owner));
    const body: DustCoinsAnswer = {
      owner,
      eraHeight: this.dust.eraHeight,
      height: this.dust.height,
      firstCoins: coins.firstCoins.map(coinEventJson),
      updates: coins.updates.map(coinEventJson),
    };
    return { status: 200, headers: { "Cache-Control": "no-store" }, body };
  }

  #dustParameters(): HttpAnswer {
    const refused = this.#dustRefused();
    if (refused !== null) return refused;
    const p = this.dust.parameters();
    if (p === null) return error(503, "dust-not-ready", "the Dust index has not started");
    const body: DustParametersAnswer = {
      nightDustRatio: p.values.nightDustRatio.toString(),
      generationDecayRate: p.values.generationDecayRate.toString(),
      dustGracePeriodSeconds: p.values.dustGracePeriodSeconds.toString(),
      source: p.source,
      changedAt: p.height,
      height: this.dust.height,
      ledgerParameters: this.#ledgerParameters === null ? null : toHex(this.#ledgerParameters.bytes),
      ledgerParametersHeight: this.#ledgerParameters?.height ?? null,
    };
    return { status: 200, headers: { "Cache-Control": "no-cache" }, body };
  }

  /** The check table's manifest; 503 (with the last build's reason) before one is built. */
  #dustCheckManifest(): HttpAnswer {
    const check = this.#dustCheck;
    if (check === null) {
      const last = this.#dustCheckLast;
      return error(503, "no-dust-check", "no Dust check table has been built yet", { building: this.#dustCheckBuilding, last });
    }
    return {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", ETag: `"${check.id}"`, "Pss-Dust-Check-Id": check.id },
      body: check.manifestBytes,
    };
  }

  /** A public file of the current Dust snapshot, or of the one before: the tables' public artifacts, the block roots, the generation records. */
  #dustCheckBlob(digest: string): HttpAnswer | HttpFileAnswer {
    if (!/^[0-9a-f]{64}$/.test(digest)) return error(400, "invalid-digest", "a digest is 64 lower-case hex digits");
    const current = this.#dustCheck;
    const dir = current?.files.has(digest) ? current.dir : this.#dustCheckPrevious?.files.has(digest) ? this.#dustCheckPrevious.dir : null;
    if (dir === null) return error(404, "no-such-artifact", "no Dust snapshot served has a public file of this digest");
    return {
      status: 200,
      headers: { ETag: `"${digest}"`, "Cache-Control": "public, max-age=31536000, immutable" },
      file: { path: join(dir, digest), contentType: OCTET_STREAM },
    };
  }

  /** A call to the check table or the path table: the query wire format with the check's identifier where the snapshot's goes. */
  async #dustCheckQuery(req: HttpRequest<Uint8Array>, which: "check" | "path"): Promise<HttpAnswer> {
    if (req.headers["content-type"] !== OCTET_STREAM) return error(415, "unsupported-media-type", `the body must be ${OCTET_STREAM}`);
    const check = this.#dustCheck;
    if (check === null) return error(503, "no-dust-check", "no Dust check table has been built yet");
    const table = which === "check" ? check.table : check.pathTable;
    if (table === null) return error(404, "no-path-table", "this Dust snapshot has no path table (its path split is 0)");
    let call;
    try {
      call = decodeQueryBody(req.body, table.requestBytes, { queriesPerCall: check.manifest.queriesPerCall, snapshotId: check.idBytes });
    } catch (cause) {
      if (!(cause instanceof WireError)) throw cause;
      const code = cause.status === 409 ? "dust-check-replaced" : "invalid-query";
      return error(cause.status, code, cause.message, cause.status === 409 ? { check: check.id } : {});
    }
    let answers: Uint8Array;
    try {
      answers = await table.answer(call.payload, call.count);
    } catch (cause) {
      if (!(cause instanceof RequestRefused)) throw cause;
      return error(400, "invalid-query", cause.message);
    }
    return {
      status: 200,
      headers: { "Content-Type": OCTET_STREAM, "Cache-Control": "no-store", "Pss-Dust-Check-Id": check.id },
      body: encodeAnswerBody({ snapshotId: check.idBytes, count: call.count, payload: answers }, table.responseBytes),
    };
  }

  #admin(req: HttpRequest<unknown>): HttpAnswer | null {
    const secret = this.settings.adminSecret;
    if (secret === undefined) return error(403, "admin-disabled", "no adminSecret is configured");
    if (!authorized(req.headers.authorization, secret)) {
      return { ...error(401, "unauthorized", "the admin routes need Authorization: Bearer <secret>"), headers: { "WWW-Authenticate": "Bearer" } };
    }
    return null;
  }

  async #adminBuild(req: HttpRequest<unknown>, read: ReadHandle): Promise<HttpAnswer> {
    const refused = this.#admin(req);
    if (refused !== null) return refused;
    const body = (req.body ?? {}) as { height?: unknown; padding?: unknown; scheme?: unknown };
    if (typeof body !== "object" || body === null || Array.isArray(body)) return error(400, "invalid-request", "the body is a JSON object");
    const padding = body.padding;
    if (padding !== undefined && padding !== null && (typeof padding !== "number" || !Number.isSafeInteger(padding) || padding < 1)) {
      return error(400, "invalid-padding", "padding is a whole number of entries, or absent");
    }
    // The scheme of this one build (00058 FR-002), so two schemes can be built at one height one after the other.
    const scheme = body.scheme ?? undefined;
    if (scheme !== undefined && scheme !== null && !isSchemeName(scheme)) {
      return error(400, "invalid-scheme", `scheme is one of ${SCHEME_NAMES.join(", ")}, or absent`);
    }
    const indexed = this.index.height;
    if (indexed < 0) return error(409, "no-committed-height", "no height is committed yet");
    const height = body.height === undefined ? indexed : body.height;
    if (typeof height !== "number" || !Number.isSafeInteger(height) || height < 0 || height > indexed) {
      return error(400, "invalid-height", `height must be an integer from 0 to the indexed height ${indexed}`);
    }
    const current = this.#current;
    if (current !== null && height < current.manifest.height) {
      return error(400, "invalid-height", `height must not be below the current snapshot's ${current.manifest.height}`);
    }
    const refusedBuild = await this.#startBuild(height, read, "admin", typeof padding === "number" ? padding : undefined, isSchemeName(scheme) ? scheme : undefined);
    if (refusedBuild !== null) return refusedBuild;
    return { status: 202, body: { building: this.#building, dustCheck: { building: this.#dustCheckBuilding, last: this.#dustCheckLast } } };
  }

  async #adminStatus(req: HttpRequest<unknown>): Promise<HttpAnswer> {
    const refused = this.#admin(req);
    if (refused !== null) return refused;
    return { status: 200, headers: { "Cache-Control": "no-store" }, body: this.status() };
  }

  // ── for operators and tests ────────────────────────────────────────────────────────────────────────────────────

  /** What the admin status route answers. */
  status(): Record<string, unknown> {
    const tip = this.#tip;
    return {
      network: this.#network,
      index: {
        height: this.index.height,
        outputs: this.index.outputs,
        nullifiers: this.index.nullifiers,
        error: this.index.error,
        fromItems: this.#fromItems,
        fromDatabase: this.#fromDatabase,
      },
      indexLoad: this.#indexLoad,
      tip: tip === null ? null : { height: tip.height, firstFree: tip.firstFree, root: toHex(tip.root) },
      head: this.#head,
      current:
        this.#current === null
          ? null
          : {
              id: this.#current.id,
              height: this.#current.manifest.height,
              firstFree: this.#current.manifest.firstFree,
              scheme: this.#current.manifest.scheme,
              padding: this.#current.manifest.padding?.size ?? null,
              // What each served table says it holds in memory (SimplePIR: the grid's cells; IPIR+SP: the add-on's
              // cells and compiled packing), for the benchmark (00058 FR-050).
              heldBytes: {
                read: this.#current.tables.read.heldBytes,
                path: this.#current.tables.path?.heldBytes ?? null,
                nullifier: this.#current.tables.nullifier.heldBytes,
              },
            },
      previous: this.#previous === null ? null : { id: this.#previous.id },
      tail: this.#tail === null ? null : { next: this.#tail.tree.next, error: this.#tail.error },
      dust: this.dust.status(),
      dustCheck: {
        current:
          this.#dustCheck === null
            ? null
            : {
                id: this.#dustCheck.id,
                height: this.#dustCheck.manifest.height,
                commitments: this.#dustCheck.manifest.commitments,
                scheme: this.#dustCheck.manifest.scheme,
                heldBytes: { check: this.#dustCheck.table.heldBytes, path: this.#dustCheck.pathTable?.heldBytes ?? null },
              },
        previous: this.#dustCheckPrevious === null ? null : { id: this.#dustCheckPrevious.id },
        building: this.#dustCheckBuilding,
        last: this.#dustCheckLast,
      },
      building: this.#building,
      last: this.#last,
      settings: {
        dataDir: this.dataDir,
        pathSplit: this.settings.pathSplit,
        scheme: this.settings.scheme,
        queriesPerCall: this.settings.queriesPerCall,
        snapshotEvery: this.settings.snapshotEvery,
        threads: this.#threads,
        dustEraHeight: this.settings.dustEraHeight,
        admin: this.settings.adminSecret !== undefined,
      },
    };
  }

  /**
   * Releases the served tables and stops every scheme's threads (a test's process end; `umbradb run` exits without it,
   * the threads being unreferenced).
   */
  async close(): Promise<void> {
    if (this.#current !== null) releaseTables(this.#current.tables);
    this.#dustCheck?.table.release();
    this.#dustCheck?.pathTable?.release();
    const schemes = [...this.#schemes.values()];
    this.#schemes.clear();
    for (const opened of schemes) {
      try {
        await (await opened).close();
      } catch {
        // A scheme that never opened has nothing to close.
      }
    }
  }
}

/**
 * The memory the system could give a build now (Q57). On macOS: free, inactive, speculative and purgeable pages from
 * `vm_stat`, since `os.freemem()` there counts only unused pages, which the file cache keeps near zero. Elsewhere
 * `os.freemem()` (on Linux, MemAvailable).
 */
function availableMemory(): number {
  if (platform() !== "darwin") return freemem();
  try {
    const out = execFileSync("vm_stat", { encoding: "utf8", timeout: 2000 });
    const page = Number(/page size of (\d+) bytes/.exec(out)?.[1] ?? 4096);
    const pages = (name: string): number => Number(new RegExp(`Pages ${name}:\\s+(\\d+)`).exec(out)?.[1] ?? 0);
    return page * (pages("free") + pages("inactive") + pages("speculative") + pages("purgeable"));
  } catch {
    return freemem();
  }
}

/** An answer's body length: bytes, text, JSON, or the file's size. */
function answerBytes(answer: HttpAnswer | HttpFileAnswer): number {
  if ("file" in answer) {
    try {
      return statSync(answer.file.path).size;
    } catch {
      return -1;
    }
  }
  const body = answer.body;
  if (body instanceof Uint8Array) return body.length;
  if (typeof body === "string") return Buffer.byteLength(body);
  return Buffer.byteLength(JSON.stringify(body) ?? "");
}

/** The settings of a process context's latest revision (re-exported for the declaration). */
export const settingsOfContext = (p: ProcessContext): Settings => settingsOf(p.revisions);
