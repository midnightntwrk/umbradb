/**
 * The snapshot builder (spec §5.2–5.5): from the index's first `first_free` outputs and the nullifiers spent at or
 * below the snapshot height S, it writes the six artifacts and the manifest under the data directory and returns
 * what the server holds in memory. It runs in a worker thread (`./build-worker.ts`) so the block loop is never held;
 * tests call it directly.
 *
 * Every artifact is a function of the outputs, the nullifiers and the parameters, so building one height twice gives
 * the same digests and the same snapshot identifier (FR-022, FR-145). The build fails, writing nothing, when the
 * outputs are not exactly positions `0 … first_free − 1` with `first_free` the core's (FR-013) or when the tree's
 * root is not the core's `zswap_root` at S (FR-041).
 */

import { createHash, randomBytes } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, renameSync, rmSync, writeSync } from "node:fs";
import { join } from "node:path";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import {
  buildNullifierTable,
  buildSetup,
  createGrid,
  deriveSeed,
  encodeGridHeader,
  type Grid,
  gridCellBytes,
  gridDigest,
  type GridShape,
  type Multiplier,
  type NullifierEntry,
  PIR_PARAMS,
  positionalShape,
  positionOf,
  setRecord,
  setupBytes,
  WorkerMultiplier,
} from "../pir/index.ts";
import { FORMAT_VERSION } from "../shared/constants.ts";
import { encodeManifest, type Manifest, snapshotId, toHex } from "../shared/manifest.ts";
import { CIPHERTEXT_BYTES, FLAG_CIPHERTEXT, FLAG_LOWER_PATH, readRecordBytes, SCAN_ENTRY_BYTES } from "../shared/records.ts";
import { buildTree, countingHash, type Hash2, type IncrementalTreeState, NODE_BYTES } from "./tree.ts";
import { COMMITMENT_BYTES, EVIDENCE_CODE, type IndexSlice, NULLIFIER_BYTES } from "./zswap-index.ts";

/** Where snapshots live under the data directory, and where builds write before they are complete. */
export const SNAPSHOTS_DIR = "snapshots";
export const BUILDS_DIR = "builds";
/** The manifest's file in a snapshot's directory; every artifact is the file named by its digest. */
export const MANIFEST_FILE = "manifest.json";

/** Everything a build needs, as plain data a worker can be given. */
export interface BuildJob {
  readonly height: number;
  readonly blockHash: Uint8Array;
  readonly genesisHash: Uint8Array;
  readonly network: string;
  /** The core's `zswap_first_free` at S. */
  readonly expectedFirstFree: number;
  /** The core's `zswap_root` at S, as 32 little-endian bytes. */
  readonly expectedRoot: Uint8Array;
  readonly pathSplit: number;
  readonly queriesPerCall: number;
  /** Worker threads for the setup data's multiplication. */
  readonly threads: number;
  /** Absolute. */
  readonly dataDir: string;
  readonly slice: IndexSlice;
}

/** The steps of a build, in order (spec §8's server rows). */
export const BUILD_STEPS = ["scan", "tree", "readTable", "readSetup", "nullifierTable", "nullifierSetup", "manifest"] as const;
export type BuildStep = (typeof BUILD_STEPS)[number];

/** What a step reports at its end. */
export interface StepReport {
  readonly ms: number;
  /** The artifact's size. */
  readonly bytes?: number;
  /** The tree's hashes, and hashes per second. */
  readonly hashes?: number;
  readonly hashesPerSecond?: number;
}

export interface BuildHooks {
  /** Told when each step starts and ends. */
  step?(name: BuildStep, phase: "start" | "end", report?: StepReport): void;
  /** The multiplication for the setup data; a worker pool of `job.threads` threads unless given. */
  readonly multiplier?: Multiplier;
  /** The kernel for leaves and hashes; compiled from the committed file unless given. */
  readonly kernel?: Kernel;
}

/** A grid as it crosses threads: its shape and its cells' shared buffer. */
export interface GridTransfer extends GridShape {
  readonly cells: SharedArrayBuffer;
}

export interface BuildResult {
  /** The snapshot identifier, hex. */
  readonly id: string;
  /** The snapshot's directory. */
  readonly dir: string;
  readonly manifest: Manifest;
  readonly manifestBytes: Uint8Array;
  readonly readGrid: GridTransfer;
  readonly nullifierGrid: GridTransfer;
  readonly blockRoots: Uint8Array;
  /** Where the tail's tree starts: the upper tree over the full blocks, and the partial block. */
  readonly upper: IncrementalTreeState;
  readonly partial: IncrementalTreeState;
  readonly steps: Readonly<Partial<Record<BuildStep, StepReport>>>;
}

/** Why a build failed: `code` is stable, the message says what differed. */
export class BuildError extends Error {
  readonly code: "first-free-mismatch" | "root-mismatch" | "invalid-job";
  constructor(code: BuildError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

const sha256 = (...parts: Uint8Array[]): string => {
  const hash = createHash("sha256");
  for (const part of parts) hash.update(part);
  return hash.digest("hex");
};

/** Writes `parts` to `path` (without copying shared memory) and returns the SHA-256 of what was written. */
function writeArtifact(path: string, parts: readonly Uint8Array[]): { digest: string; size: number } {
  const hash = createHash("sha256");
  const fd = openSync(path, "w");
  let size = 0;
  try {
    for (const part of parts) {
      const slice = 1 << 24;
      for (let off = 0; off < part.length; off += slice) {
        const chunk = part.subarray(off, Math.min(part.length, off + slice));
        hash.update(chunk);
        let written = 0;
        while (written < chunk.length) written += writeSync(fd, chunk, written, chunk.length - written);
      }
      size += part.length;
    }
  } finally {
    closeSync(fd);
  }
  return { digest: hash.digest("hex"), size };
}

/** Writes an artifact into `dir` under its own digest. */
function artifact(dir: string, parts: readonly Uint8Array[]): { digest: string; size: number } {
  const tmp = join(dir, `.writing-${randomBytes(6).toString("hex")}`);
  const written = writeArtifact(tmp, parts);
  renameSync(tmp, join(dir, written.digest));
  return written;
}

const transfer = (grid: Grid): GridTransfer => ({
  rows: grid.rows,
  cols: grid.cols,
  perColumn: grid.perColumn,
  cellsPerRecord: grid.cellsPerRecord,
  recordBytes: grid.recordBytes,
  records: grid.records,
  cells: grid.cells.buffer as SharedArrayBuffer,
});

/** Builds the snapshot of `job` (see the module comment). */
export async function buildSnapshot(job: BuildJob, hooks: BuildHooks = {}): Promise<BuildResult> {
  const n = job.slice.outputs;
  const k = job.pathSplit;
  if (job.blockHash.length !== 32 || job.genesisHash.length !== 32 || job.expectedRoot.length !== 32) {
    throw new BuildError("invalid-job", "block hash, genesis hash and root must be 32 bytes");
  }
  if (n !== job.expectedFirstFree) {
    throw new BuildError(
      "first-free-mismatch",
      `the index holds ${n} outputs at height ${job.height}, the core's zswap_first_free there is ${job.expectedFirstFree}`,
    );
  }
  const commitments = new Uint8Array(job.slice.commitments, 0, n * COMMITMENT_BYTES);
  const ciphertexts = new Uint8Array(job.slice.ciphertexts, 0, n * CIPHERTEXT_BYTES);
  const evidence = new Uint8Array(job.slice.evidence, 0, n);
  const steps: Partial<Record<BuildStep, StepReport>> = {};
  let started = 0;
  const begin = (name: BuildStep): void => {
    started = performance.now();
    hooks.step?.(name, "start");
  };
  const end = (name: BuildStep, extra: Omit<StepReport, "ms"> = {}): void => {
    const report = { ms: performance.now() - started, ...extra };
    steps[name] = report;
    hooks.step?.(name, "end", report);
  };

  const buildsDir = join(job.dataDir, BUILDS_DIR);
  const snapshotsDir = join(job.dataDir, SNAPSHOTS_DIR);
  mkdirSync(buildsDir, { recursive: true });
  mkdirSync(snapshotsDir, { recursive: true });
  const dir = join(buildsDir, `${job.height}-${randomBytes(6).toString("hex")}`);
  mkdirSync(dir);
  const ownMultiplier = hooks.multiplier === undefined;
  const multiplier = hooks.multiplier ?? new WorkerMultiplier(Math.max(1, job.threads));
  try {
    // Scan file (FR-030, FR-031): the point and the first 4 bytes of element 0, or 36 zero bytes.
    begin("scan");
    const scan = new Uint8Array(n * SCAN_ENTRY_BYTES);
    for (let i = 0; i < n; i++) {
      if (evidence[i] === EVIDENCE_CODE.ciphertext) {
        scan.set(ciphertexts.subarray(i * CIPHERTEXT_BYTES, i * CIPHERTEXT_BYTES + SCAN_ENTRY_BYTES), i * SCAN_ENTRY_BYTES);
      }
    }
    const scanRef = artifact(dir, [scan]);
    end("scan", { bytes: scanRef.size });

    // Tree (FR-040–043): block roots, lower paths, and the root, which must be the core's.
    begin("tree");
    const kernel = hooks.kernel ?? new Kernel(compileKernel());
    const counted = countingHash(((a, b) => {
      const h = kernel.hash2(a, b);
      if (h === null) throw new Error("a tree node is not a canonical field element");
      return h;
    }) satisfies Hash2);
    const tree = buildTree(n, k, (i) => kernel.leaf(commitments.subarray(i * COMMITMENT_BYTES, (i + 1) * COMMITMENT_BYTES)), counted.hash);
    if (toHex(tree.root) !== toHex(job.expectedRoot)) {
      throw new BuildError(
        "root-mismatch",
        `the tree root of ${n} outputs at height ${job.height} is ${toHex(tree.root)}, the core's zswap_root is ${toHex(job.expectedRoot)}`,
      );
    }
    const rootsRef = artifact(dir, [tree.blockRoots]);
    const treeMs = performance.now() - started;
    end("tree", { bytes: rootsRef.size, hashes: counted.count(), hashesPerSecond: treeMs > 0 ? (counted.count() * 1000) / treeMs : 0 });

    // Read table (FR-060, FR-061): one record per position.
    begin("readTable");
    const recordBytes = readRecordBytes(k);
    const readGrid = createGrid(positionalShape(n, recordBytes));
    const record = new Uint8Array(recordBytes);
    const pathBytes = k * NODE_BYTES;
    for (let i = 0; i < n; i++) {
      record.fill(0);
      let flags = 0;
      record.set(commitments.subarray(i * COMMITMENT_BYTES, (i + 1) * COMMITMENT_BYTES), 1);
      if (evidence[i] === EVIDENCE_CODE.ciphertext) {
        // Elements 1–5: ciphertext bytes 64 … 223 (after the point and element 0).
        record.set(ciphertexts.subarray(i * CIPHERTEXT_BYTES + 64, (i + 1) * CIPHERTEXT_BYTES), 33);
        flags |= FLAG_CIPHERTEXT;
      }
      if (i < tree.fullLeaves) {
        record.set(tree.paths.subarray(i * pathBytes, (i + 1) * pathBytes), 193);
        flags |= FLAG_LOWER_PATH;
      }
      record[0] = flags;
      const { column, slot } = positionOf(i, readGrid.perColumn);
      setRecord(readGrid, column, slot, record);
    }
    const readDigest = gridDigest(readGrid);
    const readRef = artifact(dir, [encodeGridHeader(readGrid), gridCellBytes(readGrid)]);
    if (readRef.digest !== toHex(readDigest)) throw new Error("the read table's file is not its grid digest");
    end("readTable", { bytes: readRef.size });

    begin("readSetup");
    const readSeed = deriveSeed("read", readDigest);
    const readSetup = await buildSetup(readGrid, readSeed, multiplier);
    const readSetupRef = artifact(dir, [setupBytes(readSetup)]);
    end("readSetup", { bytes: readSetupRef.size });

    // Nullifier table (FR-062–064).
    begin("nullifierTable");
    const values = new Uint8Array(job.slice.nullifierValues, 0, job.slice.nullifiers * NULLIFIER_BYTES);
    const heights = new DataView(job.slice.nullifierHeights, 0, job.slice.nullifiers * 4);
    const txs = new DataView(job.slice.nullifierTxs, 0, job.slice.nullifiers * 4);
    const entries: NullifierEntry[] = [];
    for (let i = 0; i < job.slice.nullifiers; i++) {
      entries.push({
        nullifier: values.subarray(i * NULLIFIER_BYTES, (i + 1) * NULLIFIER_BYTES),
        height: heights.getUint32(i * 4, true),
        txIndex: txs.getUint32(i * 4, true),
      });
    }
    const nullifierTable = buildNullifierTable(entries);
    const nullifierGrid = nullifierTable.grid;
    const nullifierDigest = gridDigest(nullifierGrid);
    const nullifierRef = artifact(dir, [encodeGridHeader(nullifierGrid), gridCellBytes(nullifierGrid)]);
    if (nullifierRef.digest !== toHex(nullifierDigest)) throw new Error("the nullifier table's file is not its grid digest");
    end("nullifierTable", { bytes: nullifierRef.size });

    begin("nullifierSetup");
    const nullifierSeed = deriveSeed("nullifier", nullifierDigest);
    const nullifierSetup = await buildSetup(nullifierGrid, nullifierSeed, multiplier);
    const nullifierSetupRef = artifact(dir, [setupBytes(nullifierSetup)]);
    end("nullifierSetup", { bytes: nullifierSetupRef.size });

    // Manifest (FR-021, FR-022): canonical JSON; its SHA-256 is the snapshot identifier.
    begin("manifest");
    const table = (grid: Grid, ref: { digest: string; size: number }, seed: Uint8Array) => ({
      digest: ref.digest,
      size: ref.size,
      rows: grid.rows,
      cols: grid.cols,
      perColumn: grid.perColumn,
      cellsPerRecord: grid.cellsPerRecord,
      recordBytes: grid.recordBytes,
      records: grid.records,
      seed: toHex(seed),
    });
    const manifest: Manifest = {
      formatVersion: FORMAT_VERSION,
      network: job.network,
      genesisHash: toHex(job.genesisHash),
      height: job.height,
      blockHash: toHex(job.blockHash),
      firstFree: n,
      root: toHex(tree.root),
      pathSplit: k,
      queriesPerCall: job.queriesPerCall,
      pir: { ...PIR_PARAMS },
      artifacts: {
        scan: scanRef,
        blockRoots: { ...rootsRef, blocks: tree.blocks },
        readTable: table(readGrid, readRef, readSeed),
        readSetup: readSetupRef,
        nullifierTable: { ...table(nullifierGrid, nullifierRef, nullifierSeed), bucketBits: nullifierTable.bucketBits, capacity: nullifierTable.capacity },
        nullifierSetup: nullifierSetupRef,
      },
    };
    const manifestBytes = encodeManifest(manifest);
    const id = toHex(snapshotId(manifestBytes));
    writeArtifact(join(dir, MANIFEST_FILE), [manifestBytes]);
    const final = join(snapshotsDir, id);
    if (existsSync(final)) rmSync(dir, { recursive: true, force: true });
    else renameSync(dir, final);
    end("manifest", { bytes: manifestBytes.length });
    return {
      id,
      dir: final,
      manifest,
      manifestBytes,
      readGrid: transfer(readGrid),
      nullifierGrid: transfer(nullifierGrid),
      blockRoots: tree.blockRoots,
      upper: tree.upper,
      partial: tree.partial,
      steps,
    };
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  } finally {
    if (ownMultiplier) await multiplier.close();
  }
}

/** The digest of bytes, for checks. */
export const digestOf = (bytes: Uint8Array): string => sha256(bytes);
