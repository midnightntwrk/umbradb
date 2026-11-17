/**
 * The Dust snapshot (spec 00062 FR-012, phase 9), with its own small manifest (`../shared/dust-check.ts`), built at one
 * height:
 *
 * - the check table: the Dust commitment tree's leaves of the current ledger era by position, one 32-byte record each,
 *   as a PIR table of the module's scheme, through the same seam as the snapshot's tables (`../pir/scheme.ts`); a
 *   wallet reads the record at its last derived coin's position to confirm the coin exists;
 * - the commitment tree (`./dust-tree.ts`): its root, which must be the core's `dust_commitment_root` at the height
 *   (else the build fails), its block roots, and a path table of every position's k lower siblings (when k > 0), so a
 *   wallet reads its coin's path to spend it without the server learning which coin;
 * - the generation records (checked by the server against the core's `dust_generation_root` before the build starts),
 *   one public file.
 *
 * The two tables go through the seam as positional sources named `read` and `path`: the name only picks the layout
 * family and the domain of the public seed, whose other input, the table file's digest, already makes it the table's
 * own. So the seam is used unchanged.
 *
 * It is built in a worker thread (`./dust-check-worker.ts`), as a snapshot is, under `<dataDir>/dust-check/<id>/`:
 * every file named by its SHA-256, and `manifest.json`. Building the same height in the same scheme twice gives the same
 * identifier.
 */

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import type { Multiplier } from "../pir/multiply.ts";
import { type PreparedTable, type SchemeName, SchemeUnavailable, type ServerScheme, type TableTransfer } from "../pir/scheme.ts";
import { openServerScheme } from "../pir/server-schemes.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { DUST_CHECK_RECORD_BYTES, type DustCheckManifest, dustCheckId, encodeDustCheckManifest } from "../shared/dust-check.ts";
import { type ArtifactRef, fromHex, type PirTableRef, toHex } from "../shared/manifest.ts";
import { artifact, MANIFEST_FILE } from "./build.ts";
import { dustTree } from "./dust-tree.ts";

/** The folder under the module's data directory that holds the check tables, and its builds in progress. */
export const DUST_CHECK_DIR = "dust-check";
const BUILDING_DIR = ".building";

/** Everything a check table's build needs, as plain data a worker can be given. */
export interface DustCheckJob {
  readonly eraHeight: number;
  readonly height: number;
  /** `count × 32` bytes: the commitment at each position, in position order. */
  readonly commitments: Uint8Array;
  readonly count: number;
  readonly scheme: SchemeName;
  /** Threads for the scheme's setup. */
  readonly threads: number;
  readonly queriesPerCall: number;
  /** The module's data directory, absolute. */
  readonly dataDir: string;
  /** The block's time at `height`, in seconds. */
  readonly blockTime: number;
  /** k: the commitment tree is cut k levels above the leaves (the module's `pathSplit`). */
  readonly pathSplit: number;
  /** The core's `dust_commitment_root` at `height`, 32 bytes little-endian: the tree's root must be it. */
  readonly expectedRoot: Uint8Array;
  /** The generation file (`encodeDustGenerationRecords`) and its record count and root, already checked. */
  readonly generation: Uint8Array;
  readonly generationRecords: number;
  readonly generationRoot: string;
}

export interface DustCheckResult {
  readonly id: string;
  readonly dir: string;
  readonly manifest: DustCheckManifest;
  readonly manifestBytes: Uint8Array;
  /** What the server answers from (`ServerScheme.adoptTable`): the check table, and the path table when k > 0. */
  readonly transfer: TableTransfer;
  readonly pathTransfer: TableTransfer | null;
  /** Milliseconds: the check table's layout and file, then its setup; the commitment tree; the path table. */
  readonly tableMs: number;
  readonly setupMs: number;
  readonly treeMs: number;
  readonly pathMs: number;
}

/** A check table's build that failed: its stable code and message. */
export class DustCheckFailure extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** Builds the check table of `job` in this thread (the worker's, or a test's). */
export async function buildDustCheck(job: DustCheckJob, hooks: { readonly multiplier?: Multiplier } = {}): Promise<DustCheckResult> {
  const { count } = job;
  if (!Number.isSafeInteger(count) || count < 1 || job.commitments.length !== count * DUST_CHECK_RECORD_BYTES) {
    throw new DustCheckFailure("invalid-job", `a check table of ${count} commitments needs ${count * DUST_CHECK_RECORD_BYTES} bytes, got ${job.commitments.length}`);
  }
  const root = join(job.dataDir, DUST_CHECK_DIR);
  const building = join(root, BUILDING_DIR);
  mkdirSync(building, { recursive: true });
  let scheme: ServerScheme;
  try {
    scheme = await openServerScheme(job.scheme, { threads: Math.max(1, job.threads), ...(hooks.multiplier === undefined ? {} : { multiplier: hooks.multiplier }) });
  } catch (cause) {
    if (cause instanceof SchemeUnavailable) throw new DustCheckFailure("scheme-unavailable", cause.message);
    throw cause;
  }
  const dir = join(building, `${job.height}-${randomBytes(6).toString("hex")}`);
  mkdirSync(dir);
  let prepared: PreparedTable | null = null;
  let preparedPath: PreparedTable | null = null;
  try {
    let started = performance.now();
    const commitments = job.commitments;
    const encoded = scheme.encodeTable({
      name: "read",
      records: count,
      recordBytes: DUST_CHECK_RECORD_BYTES,
      fill(put) {
        for (let p = 0; p < count; p++) put(p, commitments.subarray(p * DUST_CHECK_RECORD_BYTES, (p + 1) * DUST_CHECK_RECORD_BYTES));
      },
    });
    const file = artifact(dir, encoded.file);
    const tableMs = performance.now() - started;
    started = performance.now();
    prepared = await encoded.setup(fromHex(file.digest, 32), join(dir, file.digest));
    const publicRef = artifact(dir, prepared.public);
    const setupMs = performance.now() - started;
    const table: PirTableRef = {
      digest: file.digest,
      size: file.size,
      records: count,
      recordBytes: DUST_CHECK_RECORD_BYTES,
      groups: encoded.groups,
      perGroup: encoded.perGroup,
      layout: prepared.layout,
    };

    // The commitment tree: its root must be the core's.
    started = performance.now();
    const kernel = new Kernel(compileKernel());
    const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => {
      const h = kernel.hash2(a, b);
      if (h === null) throw new Error("a tree node is not a canonical field element");
      return h;
    };
    const k = job.pathSplit;
    const built = dustTree(count, k, (i) => kernel.leaf(commitments.subarray(i * 32, (i + 1) * 32)), hash);
    if (toHex(built.tree.root) !== toHex(job.expectedRoot)) {
      throw new DustCheckFailure("root-mismatch", `the Dust commitment tree of ${count} commitments at height ${job.height} has the root ${toHex(built.tree.root)}; the core's dust_commitment_root is ${toHex(job.expectedRoot)}`);
    }
    const blockRoots = artifact(dir, [built.tree.blockRoots]);
    const treeMs = performance.now() - started;

    // The path table: each position's k lower siblings.
    started = performance.now();
    let pathRefs: { pathTable: PirTableRef; pathPublic: ArtifactRef } | null = null;
    if (k > 0) {
      const recordBytes = 32 * k;
      const paths = built.paths;
      const encodedPath = scheme.encodeTable({
        name: "path",
        records: count,
        recordBytes,
        fill(put) {
          for (let p = 0; p < count; p++) put(p, paths.subarray(p * recordBytes, (p + 1) * recordBytes));
        },
      });
      const pathFile = artifact(dir, encodedPath.file);
      preparedPath = await encodedPath.setup(fromHex(pathFile.digest, 32), join(dir, pathFile.digest));
      const pathPublic = artifact(dir, preparedPath.public);
      pathRefs = {
        pathTable: { digest: pathFile.digest, size: pathFile.size, records: count, recordBytes, groups: encodedPath.groups, perGroup: encodedPath.perGroup, layout: preparedPath.layout },
        pathPublic,
      };
    }
    const pathMs = performance.now() - started;
    const generationFile = artifact(dir, [job.generation]);

    const manifest: DustCheckManifest = {
      version: 2,
      eraHeight: job.eraHeight,
      height: job.height,
      blockTime: job.blockTime,
      commitments: count,
      scheme: scheme.name,
      pir: { ...scheme.params },
      queriesPerCall: job.queriesPerCall,
      table,
      public: publicRef,
      tree: { pathSplit: k, root: toHex(built.tree.root), blockRoots: { ...blockRoots, blocks: built.tree.blocks }, ...(pathRefs ?? {}) },
      generation: { records: job.generationRecords, root: job.generationRoot, file: generationFile },
    };
    const manifestBytes = encodeDustCheckManifest(manifest);
    const id = toHex(dustCheckId(manifestBytes));
    writeFileSync(join(dir, MANIFEST_FILE), manifestBytes);
    const final = join(root, id);
    if (existsSync(final)) rmSync(dir, { recursive: true, force: true });
    else renameSync(dir, final);
    return { id, dir: final, manifest, manifestBytes, transfer: prepared.transfer, pathTransfer: preparedPath?.transfer ?? null, tableMs, setupMs, treeMs, pathMs };
  } catch (error) {
    if (prepared !== null) scheme.discardTransfer(prepared.transfer);
    if (preparedPath !== null) scheme.discardTransfer(preparedPath.transfer);
    rmSync(dir, { recursive: true, force: true });
    throw error;
  } finally {
    await scheme.close();
  }
}

/** Removes every check table under the data directory but those named in `keep`, and any build left unfinished. */
export function pruneDustChecks(dataDir: string, keep: ReadonlySet<string>): string[] {
  const root = join(dataDir, DUST_CHECK_DIR);
  if (!existsSync(root)) return [];
  const removed: string[] = [];
  for (const name of readdirSync(root)) {
    if (name === BUILDING_DIR || keep.has(name)) continue;
    rmSync(join(root, name), { recursive: true, force: true });
    removed.push(name);
  }
  return removed;
}

/** Removes the builds left unfinished (a process stopped during one). */
export function clearDustCheckBuilds(dataDir: string): void {
  rmSync(join(dataDir, DUST_CHECK_DIR, BUILDING_DIR), { recursive: true, force: true });
}

type FromWorker = { readonly kind: "done"; readonly result: DustCheckResult } | { readonly kind: "failed"; readonly code: string; readonly message: string };

/** Runs `job` in a new worker thread; rejects with a {@link DustCheckFailure}. */
export function runDustCheckWorker(job: DustCheckJob): Promise<DustCheckResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./dust-check-worker.ts", import.meta.url), { workerData: job });
    let settled = false;
    const finish = (body: () => void): void => {
      if (settled) return;
      settled = true;
      body();
      void worker.terminate();
    };
    worker.on("message", (message: FromWorker) => {
      if (message.kind === "done") finish(() => resolve(message.result));
      else finish(() => reject(new DustCheckFailure(message.code, message.message)));
    });
    worker.on("error", (error: unknown) => finish(() => reject(new DustCheckFailure("build-failed", error instanceof Error ? error.message : String(error)))));
    worker.on("exit", (code) => finish(() => reject(new DustCheckFailure("build-failed", `the Dust check worker exited (${code})`))));
  });
}
