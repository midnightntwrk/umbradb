/**
 * The Dust check table (spec 00062 FR-012): the Dust commitment tree's leaves of the current ledger era by position,
 * one 32-byte record each, as a PIR table of the module's scheme, through the same seam as the snapshot's tables
 * (`../pir/scheme.ts`), and its own small manifest (`../shared/dust-check.ts`). A wallet reads the record at its last
 * derived coin's position to confirm the coin exists.
 *
 * The table goes through the seam as a positional source named `read`: the seam's positional sources are `read` and
 * `path`, and the name only picks the layout family (`read`'s) and the domain of the public seed, whose other input,
 * the table file's digest, already makes it this table's own. So the seam is used unchanged.
 *
 * It is built in a worker thread (`./dust-check-worker.ts`), as a snapshot is, under `<dataDir>/dust-check/<id>/`: the
 * table file and the public artifact, each named by its SHA-256, and `manifest.json`. Building the same commitments in
 * the same scheme twice gives the same identifier.
 */

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import type { Multiplier } from "../pir/multiply.ts";
import { type PreparedTable, type SchemeName, SchemeUnavailable, type ServerScheme, type TableTransfer } from "../pir/scheme.ts";
import { openServerScheme } from "../pir/server-schemes.ts";
import { DUST_CHECK_RECORD_BYTES, type DustCheckManifest, dustCheckId, encodeDustCheckManifest } from "../shared/dust-check.ts";
import { fromHex, type PirTableRef, toHex } from "../shared/manifest.ts";
import { artifact, MANIFEST_FILE } from "./build.ts";

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
}

export interface DustCheckResult {
  readonly id: string;
  readonly dir: string;
  readonly manifest: DustCheckManifest;
  readonly manifestBytes: Uint8Array;
  /** What the server answers from (`ServerScheme.adoptTable`). */
  readonly transfer: TableTransfer;
  /** Milliseconds: the table's layout and file, then its setup. */
  readonly tableMs: number;
  readonly setupMs: number;
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
    const manifest: DustCheckManifest = {
      version: 1,
      eraHeight: job.eraHeight,
      height: job.height,
      commitments: count,
      scheme: scheme.name,
      pir: { ...scheme.params },
      queriesPerCall: job.queriesPerCall,
      table,
      public: publicRef,
    };
    const manifestBytes = encodeDustCheckManifest(manifest);
    const id = toHex(dustCheckId(manifestBytes));
    writeFileSync(join(dir, MANIFEST_FILE), manifestBytes);
    const final = join(root, id);
    if (existsSync(final)) rmSync(dir, { recursive: true, force: true });
    else renameSync(dir, final);
    return { id, dir: final, manifest, manifestBytes, transfer: prepared.transfer, tableMs, setupMs };
  } catch (error) {
    if (prepared !== null) scheme.discardTransfer(prepared.transfer);
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
