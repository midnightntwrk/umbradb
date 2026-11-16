/**
 * The snapshot builder (spec §5.2–5.5): from the index's first `first_free` outputs and the nullifiers spent at or
 * below the snapshot height S, it writes the artifacts (eight; six when k is 0) and the manifest under the data
 * directory and returns what the server holds in memory. It runs in a worker thread (`./build-worker.ts`) so the block
 * loop is never held; tests call it directly.
 *
 * The three PIR tables go through the job's scheme (`../pir/scheme.ts`, spec 00058): the builder decides which record
 * goes where (by slot, or by bucket) and the scheme lays the table out, writes its file, sets it up and gives its
 * public artifact (SimplePIR: the grid file and its setup data).
 *
 * Every artifact is a function of the outputs, the nullifiers and the parameters, so building one height twice gives
 * the same digests and the same snapshot identifier (FR-022, FR-145). The build fails, writing nothing, when the
 * outputs are not exactly positions `0 … first_free − 1` with `first_free` the core's (FR-013) or when the tree's
 * root is not the core's `zswap_root` at S (FR-041).
 */

import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, renameSync, rmSync, writeSync } from "node:fs";
import { join } from "node:path";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { nullifierSource } from "../pir/buckets.ts";
import type { Multiplier } from "../pir/multiply.ts";
import { type EncodedTable, type PreparedTable, type SchemeName, SchemeUnavailable, type ServerScheme, type TableSource, type TableSpec, type TableTransfer } from "../pir/scheme.ts";
import { openServerScheme, serverSchemeEntry } from "../pir/server-schemes.ts";
import { FORMAT_VERSION } from "../shared/constants.ts";
import { encodeManifest, fromHex, type Manifest, type PirTableRef, snapshotId, toHex } from "../shared/manifest.ts";
import { slotOf } from "../shared/padding.ts";
import { CIPHERTEXT_BYTES, encodeReadRecord, NULLIFIER_RECORD_BYTES, pathRecordBytes, READ_RECORD_BYTES, SCAN_ENTRY_BYTES } from "../shared/records.ts";
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
  /** The PIR scheme of every table (00058 FR-001, FR-002). */
  readonly scheme: SchemeName;
  /** Worker threads for the scheme's setup (SimplePIR: the setup data's multiplication). */
  readonly threads: number;
  /** Absolute. */
  readonly dataDir: string;
  readonly slice: IndexSlice;
  /**
   * Debug (Q57): the scan file, the read table and the nullifier table hold this many entries, the real ones spread
   * among deterministic noise (`../shared/padding.ts`). At least the outputs and the nullifiers; absent: no padding.
   */
  readonly padding?: number;
}

/** The PIR tables of a snapshot of `size` slots and entries, as a scheme sizes them. */
function tableSpecs(size: number, pathSplit: number): TableSpec[] {
  return [
    { name: "read", records: size, recordBytes: READ_RECORD_BYTES },
    ...(pathSplit > 0 ? [{ name: "path" as const, records: size, recordBytes: pathRecordBytes(pathSplit) }] : []),
    { name: "nullifier", records: size, recordBytes: NULLIFIER_RECORD_BYTES },
  ];
}

/**
 * About the most memory a padded build of `size` entries holds at once: the scheme's tables as it builds them (under
 * SimplePIR, both positional tables with their setup data and A, and the nullifier grid), the scan file, and the
 * nullifier arrays. For the refusal of builds that would not fit (Q57).
 */
export function paddedBuildBytes(size: number, pathSplit: number, scheme: SchemeName): number {
  return serverSchemeEntry(scheme).buildBytes(tableSpecs(size, pathSplit)) + size * SCAN_ENTRY_BYTES + size * (NULLIFIER_BYTES + 12);
}

/** A deterministic byte stream for one use of a padded build: AES-128-CTR keyed by SHA-256(label, block hash, size). */
function noiseStream(label: string, blockHash: Uint8Array, size: number): (out: Uint8Array) => void {
  const seed = createHash("sha256").update(`pss-padding/${label}/`).update(blockHash).update(String(size)).digest();
  const cipher = createCipheriv("aes-128-ctr", seed.subarray(0, 16), seed.subarray(16, 32));
  const chunk = 1 << 24;
  const zero = new Uint8Array(chunk);
  return (out) => {
    for (let off = 0; off < out.length; off += chunk) {
      const n = Math.min(chunk, out.length - off);
      out.set(cipher.update(zero.subarray(0, n)), off);
    }
  };
}

/** The steps of a build, in order (spec §8's server rows). */
export const BUILD_STEPS = ["scan", "tree", "readTable", "readSetup", "pathTable", "pathSetup", "nullifierTable", "nullifierSetup", "manifest"] as const;
export type BuildStep = (typeof BUILD_STEPS)[number];

/** What a step reports at its end. */
export interface StepReport {
  readonly ms: number;
  /** The artifact's size. */
  readonly bytes?: number;
  /** The tree's hashes, and hashes per second. */
  readonly hashes?: number;
  readonly hashesPerSecond?: number;
  /** A table's setup: the scheme's own measurements (for IPIR+SP the noise sample, 00058 FR-015). */
  readonly scheme?: Readonly<Record<string, number>>;
}

export interface BuildHooks {
  /** Told when each step starts and ends. */
  step?(name: BuildStep, phase: "start" | "end", report?: StepReport): void;
  /** SimplePIR: the multiplication for the setup data; the scheme's pool of `job.threads` threads unless given. */
  readonly multiplier?: Multiplier;
  /** The kernel for leaves and hashes; compiled from the committed file unless given. */
  readonly kernel?: Kernel;
}

export interface BuildResult {
  /** The snapshot identifier, hex. */
  readonly id: string;
  /** The snapshot's directory. */
  readonly dir: string;
  readonly manifest: Manifest;
  readonly manifestBytes: Uint8Array;
  /** What the server answers from, per table, from the scheme (`ServerScheme.adoptTable`); no path table when k is 0. */
  readonly tables: { readonly read: TableTransfer; readonly path: TableTransfer | null; readonly nullifier: TableTransfer };
  readonly blockRoots: Uint8Array;
  /** Where the tail's tree starts: the upper tree over the full blocks, and the partial block. */
  readonly upper: IncrementalTreeState;
  readonly partial: IncrementalTreeState;
  readonly steps: Readonly<Partial<Record<BuildStep, StepReport>>>;
}

/** Why a build failed: `code` is stable, the message says what differed. */
export class BuildError extends Error {
  readonly code: "first-free-mismatch" | "root-mismatch" | "invalid-job" | "scheme-unavailable";
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

/** A PIR table built: its two artifacts, its manifest entry's parts, and what the server answers from. */
interface BuiltTable {
  readonly ref: PirTableRef;
  readonly publicRef: { digest: string; size: number };
  readonly encoded: EncodedTable;
  readonly prepared: PreparedTable;
}

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
  const padding = job.padding;
  if (padding !== undefined && (!Number.isSafeInteger(padding) || n < 1 || padding < n || padding < job.slice.nullifiers)) {
    throw new BuildError("invalid-job", `padding ${padding} must be a whole number of at least the ${n} outputs and ${job.slice.nullifiers} nullifiers`);
  }
  const slots = padding ?? n;
  /** Where output `i` sits in the scan file, the read table and the path table. */
  const slotOfOutput = (i: number): number => (padding === undefined ? i : slotOf({ firstFree: n, padding: { size: padding } }, i));
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
  let scheme: ServerScheme;
  try {
    scheme = await openServerScheme(job.scheme, { threads: Math.max(1, job.threads), ...(hooks.multiplier === undefined ? {} : { multiplier: hooks.multiplier }) });
  } catch (cause) {
    if (cause instanceof SchemeUnavailable) throw new BuildError("scheme-unavailable", cause.message);
    throw cause;
  }
  const dir = join(buildsDir, `${job.height}-${randomBytes(6).toString("hex")}`);
  mkdirSync(dir);
  /**
   * A table through the scheme: its records (`sourceOf`, timed with the table), its file (step `<name>Table`), then its
   * setup and public artifact (`<name>Setup`).
   */
  const table = async (sourceOf: () => TableSource, steps: readonly [BuildStep, BuildStep]): Promise<BuiltTable> => {
    begin(steps[0]);
    const source = sourceOf();
    const encoded = scheme.encodeTable(source);
    const file = artifact(dir, encoded.file);
    end(steps[0], { bytes: file.size });
    begin(steps[1]);
    const prepared = await encoded.setup(fromHex(file.digest, 32));
    const publicRef = artifact(dir, prepared.public);
    end(steps[1], { bytes: publicRef.size, ...(prepared.stats === undefined ? {} : { scheme: prepared.stats }) });
    const ref: PirTableRef = {
      digest: file.digest,
      size: file.size,
      records: source.records,
      recordBytes: source.recordBytes,
      groups: encoded.groups,
      perGroup: encoded.perGroup,
      layout: prepared.layout,
    };
    return { ref, publicRef, encoded, prepared };
  };
  try {
    // Scan file (FR-030, FR-031): the point and the first 4 bytes of element 0, or 36 zero bytes.
    begin("scan");
    const scan = new Uint8Array(slots * SCAN_ENTRY_BYTES);
    if (padding !== undefined) {
      // Noise entries copy a real output's entry (its point, or its zero bytes) with 4 random tag bytes, so each costs
      // a scanner what a real one does (Q57).
      const random = new Uint32Array(2 * slots);
      noiseStream("scan", job.blockHash, padding)(new Uint8Array(random.buffer));
      const view = new DataView(scan.buffer);
      for (let s = 0; s < slots; s++) {
        const from = random[2 * s]! % n;
        if (evidence[from] !== EVIDENCE_CODE.ciphertext) continue;
        scan.set(ciphertexts.subarray(from * CIPHERTEXT_BYTES, from * CIPHERTEXT_BYTES + 32), s * SCAN_ENTRY_BYTES);
        view.setUint32(s * SCAN_ENTRY_BYTES + 32, random[2 * s + 1]!, true);
      }
    }
    for (let i = 0; i < n; i++) {
      const at = slotOfOutput(i) * SCAN_ENTRY_BYTES;
      if (evidence[i] === EVIDENCE_CODE.ciphertext) scan.set(ciphertexts.subarray(i * CIPHERTEXT_BYTES, i * CIPHERTEXT_BYTES + SCAN_ENTRY_BYTES), at);
      else scan.fill(0, at, at + SCAN_ENTRY_BYTES);
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

    // Read table (FR-060, FR-061, Q58): one 98-byte record per slot: 16 bytes of the commitment and the shrunk
    // ciphertext elements 1–5.
    const read = await table(
      () => ({
        name: "read",
        records: slots,
        recordBytes: READ_RECORD_BYTES,
        ...(padding === undefined ? {} : { noise: noiseStream("read", job.blockHash, padding) }),
        fill(put) {
          for (let i = 0; i < n; i++) {
            const ciphertext = evidence[i] === EVIDENCE_CODE.ciphertext ? ciphertexts.subarray(i * CIPHERTEXT_BYTES, (i + 1) * CIPHERTEXT_BYTES) : null;
            put(slotOfOutput(i), encodeReadRecord(commitments.subarray(i * COMMITMENT_BYTES, (i + 1) * COMMITMENT_BYTES), ciphertext));
          }
        },
      }),
      ["readTable", "readSetup"],
    );

    // Path table (Q58): each position's k lower siblings, read only to spend; zero bytes outside the full blocks. None
    // when k is 0. (SimplePIR makes it as wide as the noise check allows, so its setup data, downloaded to spend, is
    // small.)
    let path: BuiltTable | null = null;
    if (k > 0) {
      const pathBytes = k * NODE_BYTES;
      const empty = new Uint8Array(pathBytes);
      path = await table(
        () => ({
          name: "path",
          records: slots,
          recordBytes: pathRecordBytes(k),
          ...(padding === undefined ? {} : { noise: noiseStream("path", job.blockHash, padding) }),
          fill(put) {
            for (let i = 0; i < n; i++) put(slotOfOutput(i), i < tree.fullLeaves ? tree.paths.subarray(i * pathBytes, (i + 1) * pathBytes) : empty);
          },
        }),
        ["pathTable", "pathSetup"],
      );
    }

    // Nullifier table (FR-062–064): the entries, then their buckets (`nullifierSource`).
    const nullifierEntries = (): TableSource => {
      const real = job.slice.nullifiers;
      const count = padding ?? real;
      let values: Uint8Array = new Uint8Array(job.slice.nullifierValues, 0, real * NULLIFIER_BYTES);
      let heights: Uint32Array = new Uint32Array(job.slice.nullifierHeights, 0, real);
      let txs: Uint32Array = new Uint32Array(job.slice.nullifierTxs, 0, real);
      if (padding !== undefined) {
        // Noise: random nullifiers, spent at random heights up to S in one of the first 8 transactions (Q57).
        const next = noiseStream("nullifier", job.blockHash, padding);
        const allValues = new Uint8Array(count * NULLIFIER_BYTES);
        allValues.set(values);
        next(allValues.subarray(real * NULLIFIER_BYTES));
        const allHeights = new Uint32Array(count);
        const allTxs = new Uint32Array(count);
        allHeights.set(heights);
        allTxs.set(txs);
        next(new Uint8Array(allHeights.buffer, real * 4));
        next(new Uint8Array(allTxs.buffer, real * 4));
        for (let i = real; i < count; i++) {
          allHeights[i] = allHeights[i]! % (job.height + 1);
          allTxs[i] = allTxs[i]! % 8;
        }
        values = allValues;
        heights = allHeights;
        txs = allTxs;
      }
      return nullifierSource({ count, values, heights, txs });
    };
    const nullifier = await table(nullifierEntries, ["nullifierTable", "nullifierSetup"]);
    const bucketBits = nullifier.encoded.bucketBits;
    if (bucketBits === undefined) throw new Error(`the ${scheme.name} scheme gave the nullifier table no bucket bits`);

    // Manifest (FR-021, FR-022): canonical JSON; its SHA-256 is the snapshot identifier.
    begin("manifest");
    const manifest: Manifest = {
      formatVersion: FORMAT_VERSION,
      scheme: scheme.name,
      network: job.network,
      genesisHash: toHex(job.genesisHash),
      height: job.height,
      blockHash: toHex(job.blockHash),
      firstFree: n,
      root: toHex(tree.root),
      pathSplit: k,
      queriesPerCall: job.queriesPerCall,
      ...(padding === undefined ? {} : { padding: { size: padding } }),
      pir: { ...scheme.params },
      artifacts: {
        scan: scanRef,
        blockRoots: { ...rootsRef, blocks: tree.blocks },
        readTable: read.ref,
        readPublic: read.publicRef,
        ...(path === null ? {} : { pathTable: path.ref, pathPublic: path.publicRef }),
        nullifierTable: { ...nullifier.ref, bucketBits, capacity: nullifier.encoded.perGroup },
        nullifierPublic: nullifier.publicRef,
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
      tables: { read: read.prepared.transfer, path: path === null ? null : path.prepared.transfer, nullifier: nullifier.prepared.transfer },
      blockRoots: tree.blockRoots,
      upper: tree.upper,
      partial: tree.partial,
      steps,
    };
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  } finally {
    await scheme.close();
  }
}

/** The digest of bytes, for checks. */
export const digestOf = (bytes: Uint8Array): string => sha256(bytes);
