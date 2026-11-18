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
 * - **Tail.** From the current snapshot to the committed height (`./tail.ts`), kept after each height, its root
 *   checked against the core's `zswap_root` whenever outputs were added.
 * - **Routes** under `/pss/v1` (spec §5.7), each logged with its body and answer lengths and time (FR-080), never its
 *   body.
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
import { answerQueries, type Grid, MAX_COLUMNS, type Multiplier, WorkerMultiplier } from "../pir/index.ts";
import { OCTET_STREAM, ROUTES } from "../shared/constants.ts";
import { fromHex, type Manifest, toHex } from "../shared/manifest.ts";
import { CALL_HEADER_BYTES, decodeQueryBody, encodeAnswerBody, WireError } from "../shared/wire.ts";
import { type BuildJob, type BuildResult, type GridTransfer, paddedBuildBytes } from "./build.ts";
import { BuildFailure, runBuildWorker, type WorkerOutcome } from "./build-host.ts";
import { type Settings, settingsOf } from "./settings.ts";
import { blockHashAt, cursorOf, genesisHashOf, stateAt, zswapEvents } from "./sql.ts";
import {
  listSnapshots,
  loadGrid,
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
}

/** One committed height's events and tip, waiting for `on-after-db-write`. */
interface Pending {
  readonly outputs: OutputEvent[];
  readonly nullifiers: NullifierEvent[];
  readonly tip: TailTip;
}

/** The snapshot served: its manifest, files and PIR tables. */
interface Snapshot {
  readonly id: string;
  readonly idBytes: Uint8Array;
  readonly dir: string;
  readonly manifest: Manifest;
  readonly manifestBytes: Uint8Array;
  readonly files: Map<string, ServedFile>;
  readonly readGrid: Grid;
  /** Lower paths, read only to spend (Q58); null when the snapshot's k is 0. */
  readonly pathGrid: Grid | null;
  readonly nullifierGrid: Grid;
  /** Nullifiers spent at or below its height. */
  readonly nullifiers: number;
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

const gridOf = (t: GridTransfer): Grid => ({
  rows: t.rows,
  cols: t.cols,
  perColumn: t.perColumn,
  cellsPerRecord: t.cellsPerRecord,
  recordBytes: t.recordBytes,
  records: t.records,
  cells: new Int16Array(t.cells),
});

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
  #multiplier: Multiplier | null = null;
  /** Heights added from the block's items, and heights read from the database (items missed). */
  #fromItems = 0;
  #fromDatabase = 0;

  constructor(settings: Settings, options: PssOptions) {
    this.settings = settings;
    this.dataDir = resolve(settings.dataDir);
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
      this.#log({ event: "start-failed", message });
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
    const snapshot: Snapshot = {
      id: latest.id,
      idBytes: fromHex(latest.id, 32),
      dir: latest.dir,
      manifest: latest.manifest,
      manifestBytes: latest.manifestBytes,
      files: servedFiles(latest),
      readGrid: loadGrid(latest, "readTable"),
      pathGrid: latest.manifest.artifacts.pathTable === undefined ? null : loadGrid(latest, "pathTable"),
      nullifierGrid: loadGrid(latest, "nullifierTable"),
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
      for (const e of events) {
        if (e.kind === "zswap-output") {
          if (e.commitment === null || e.treeIndex === null || e.evidence === null) throw new Error(`an output at ${height} without its fields`);
          outputs.push({ height, txIndex: e.transaction, position: Number(e.treeIndex), commitment: e.commitment, evidence: e.evidence, ciphertext: e.ciphertext });
        } else if (e.kind === "zswap-input") {
          if (e.nullifier === null) throw new Error(`an input at ${height} without its nullifier`);
          nullifiers.push({ height, txIndex: e.transaction, nullifier: e.nullifier });
        }
      }
      const tip: TailTip = { height, blockHash: b.hash, firstFree: Number(state.zswapFirstFree), root: rootFromStored(state.zswapRoot) };
      this.#pending.set(height, { outputs, nullifiers, tip });
    } catch (cause) {
      this.#log({ event: "stash-failed", height: Number(b.height), message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  /** `on-after-db-write`: adds the committed height to the index and the tail; builds every `snapshotEvery` heights. */
  async committed(b: BlockContext, read: ReadHandle): Promise<void> {
    const height = Number(b.height);
    const pending = this.#pending.get(height);
    for (const key of [...this.#pending.keys()]) if (key <= height) this.#pending.delete(key);
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

  /** Starts a build at S (≤ the index's height); an answer when it cannot start, null when it started. */
  async #startBuild(height: number, read: ReadHandle, trigger: Building["trigger"], padding?: number): Promise<HttpAnswer | null> {
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
      const held = c === null ? 0 : c.readGrid.cells.byteLength + (c.pathGrid?.cells.byteLength ?? 0) + c.nullifierGrid.cells.byteLength;
      const needed = paddedBuildBytes(padding, this.settings.pathSplit);
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
    const building: Building = { height, trigger, startedAt: new Date().toISOString(), padding: padding ?? null, step: null, stepStartedAt: null, done: {} };
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
    this.#log({ event: "build-started", height, trigger, outputs, nullifiers, pathSplit: job.pathSplit, padding: padding ?? null });
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
    return null;
  }

  #failed(building: Building, cause: unknown, started: number): void {
    const code = cause instanceof BuildFailure ? cause.code : "build-failed";
    const message = cause instanceof Error ? cause.message : String(cause);
    this.#last = { height: building.height, ok: false, id: null, code, message, finishedAt: new Date().toISOString(), totalMs: performance.now() - started, padding: building.padding, steps: null };
    this.#building = null;
    this.#log({ event: "build-failed", height: building.height, code, message });
  }

  #promote(outcome: WorkerOutcome, building: Building, nullifiers: number, readEvents: Record<string, number>, started: number): void {
    const result: BuildResult = outcome.result;
    try {
      const current = this.#current;
      if (current !== null && current.manifest.height > result.manifest.height) {
        pruneSnapshots(this.dataDir, new Set([current.id, ...(this.#previous === null ? [] : [this.#previous.id])]));
        throw new BuildFailure("superseded", `a snapshot at ${current.manifest.height} is newer than this one at ${result.manifest.height}`);
      }
      const snapshot: Snapshot = {
        id: result.id,
        idBytes: fromHex(result.id, 32),
        dir: result.dir,
        manifest: result.manifest,
        manifestBytes: result.manifestBytes,
        files: servedFiles({ id: result.id, dir: result.dir, manifest: result.manifest, manifestBytes: result.manifestBytes }),
        readGrid: gridOf(result.readGrid),
        pathGrid: result.pathGrid === null ? null : gridOf(result.pathGrid),
        nullifierGrid: gridOf(result.nullifierGrid),
        nullifiers,
      };
      const tail: Tail = { tree: TailTree.fromStates(result.manifest.pathSplit, this.#hash, result.upper, result.partial), error: null, checked: -1, cache: null };
      if (current === null || current.id !== snapshot.id) this.#previous = current === null ? this.#previous : { id: current.id, files: current.files };
      this.#current = snapshot;
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
      this.#last = { height: building.height, ok: true, id: snapshot.id, code: null, message: null, finishedAt: stats.finishedAt, totalMs, padding: building.padding, steps: stepMs };
      this.#log({ event: "build-done", height: building.height, id: snapshot.id, totalMs, previous: this.#previous?.id ?? null, pruned });
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
    this.#multiplier = new WorkerMultiplier(this.#threads);
    const queriesPerCall = Math.max(this.settings.queriesPerCall, this.#current?.manifest.queriesPerCall ?? 0);
    // The body limit is fixed at registration: the largest table any snapshot can have (FR-058 caps its columns).
    const maxBodyBytes = CALL_HEADER_BYTES + queriesPerCall * MAX_COLUMNS * 4;
    this.#route(api, "GET", ROUTES.manifest, async () => this.#manifest());
    this.#route(api, "GET", `${ROUTES.blob}:digest`, async (req) => this.#blob(req.params.digest ?? ""));
    this.#route(api, "GET", ROUTES.tail, async () => this.#tailAnswer());
    this.#binaryRoute(api, ROUTES.queryRead, "read", maxBodyBytes);
    this.#binaryRoute(api, ROUTES.queryNullifier, "nullifier", maxBodyBytes);
    this.#binaryRoute(api, ROUTES.queryPath, "path", maxBodyBytes);
    this.#route(api, "POST", ROUTES.adminSnapshot, async (req, read) => this.#adminBuild(req, read));
    this.#route(api, "GET", ROUTES.adminSnapshot, async (req) => this.#adminStatus(req));
  }

  /** Registers a JSON route, logged (FR-080). */
  #route(api: ApiRegistry, method: "GET" | "POST", path: string, handler: Handler<unknown>): void {
    api.http(method, path, this.#logged(`${method} ${path}`, handler));
  }

  #binaryRoute(api: ApiRegistry, path: string, table: "read" | "path" | "nullifier", maxBodyBytes: number): void {
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

  async #query(req: HttpRequest<Uint8Array>, table: "read" | "path" | "nullifier"): Promise<HttpAnswer> {
    if (req.headers["content-type"] !== OCTET_STREAM) return error(415, "unsupported-media-type", `the body must be ${OCTET_STREAM}`);
    const snapshot = this.#current;
    const multiplier = this.#multiplier;
    if (snapshot === null || multiplier === null) return error(503, "no-snapshot", "no snapshot has been built yet");
    const grid = table === "read" ? snapshot.readGrid : table === "path" ? snapshot.pathGrid : snapshot.nullifierGrid;
    if (grid === null) return error(404, "no-path-table", "this snapshot has no path table (its path split is 0)");
    let call;
    try {
      call = decodeQueryBody(req.body, grid.cols, { queriesPerCall: snapshot.manifest.queriesPerCall, snapshotId: snapshot.idBytes });
    } catch (cause) {
      if (!(cause instanceof WireError)) throw cause;
      const code = cause.status === 409 ? "snapshot-replaced" : "invalid-query";
      return error(cause.status, code, cause.message, cause.status === 409 ? { snapshot: snapshot.id } : {});
    }
    const answers = await answerQueries(grid, call.values, call.count, multiplier);
    return {
      status: 200,
      headers: { "Content-Type": OCTET_STREAM, "Cache-Control": "no-store", "Pss-Snapshot-Id": snapshot.id },
      body: encodeAnswerBody({ snapshotId: snapshot.idBytes, count: call.count, values: answers }, grid.rows),
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
    const body = (req.body ?? {}) as { height?: unknown; padding?: unknown };
    if (typeof body !== "object" || body === null || Array.isArray(body)) return error(400, "invalid-request", "the body is a JSON object");
    const padding = body.padding;
    if (padding !== undefined && padding !== null && (typeof padding !== "number" || !Number.isSafeInteger(padding) || padding < 1)) {
      return error(400, "invalid-padding", "padding is a whole number of entries, or absent");
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
    const refusedBuild = await this.#startBuild(height, read, "admin", typeof padding === "number" ? padding : undefined);
    if (refusedBuild !== null) return refusedBuild;
    return { status: 202, body: { building: this.#building } };
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
          : { id: this.#current.id, height: this.#current.manifest.height, firstFree: this.#current.manifest.firstFree, padding: this.#current.manifest.padding?.size ?? null },
      previous: this.#previous === null ? null : { id: this.#previous.id },
      tail: this.#tail === null ? null : { next: this.#tail.tree.next, error: this.#tail.error },
      building: this.#building,
      last: this.#last,
      settings: {
        dataDir: this.dataDir,
        pathSplit: this.settings.pathSplit,
        queriesPerCall: this.settings.queriesPerCall,
        snapshotEvery: this.settings.snapshotEvery,
        threads: this.#threads,
        admin: this.settings.adminSecret !== undefined,
      },
    };
  }

  /** Stops the PIR threads (a test's process end; `umbradb run` exits without it, the threads being unreferenced). */
  async close(): Promise<void> {
    await this.#multiplier?.close();
    this.#multiplier = null;
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
