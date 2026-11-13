/**
 * The data directory (spec FR-021–024): `snapshots/<id>/` holds one snapshot — `manifest.json` and each artifact as
 * the file named by its SHA-256 digest, beside `build-stats.json` — and `builds/` the snapshots being written, renamed
 * into `snapshots/` once complete. Snapshots are loaded from here at start; only the latest and the one before it are
 * kept.
 */

import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, readSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { deserializeGrid, type Grid } from "../pir/index.ts";
import { decodeManifest, type Manifest, snapshotId, toHex } from "../shared/manifest.ts";
import { BUILDS_DIR, MANIFEST_FILE, SNAPSHOTS_DIR } from "./build.ts";

/** The build statistics' file beside a snapshot's artifacts. */
export const STATS_FILE = "build-stats.json";

/** A snapshot found on disk with a well-formed manifest whose digest is its directory's name. */
export interface StoredSnapshot {
  readonly id: string;
  readonly dir: string;
  readonly manifest: Manifest;
  readonly manifestBytes: Uint8Array;
  readonly mtimeMs: number;
}

/** A file the blob route serves. */
export interface ServedFile {
  readonly path: string;
  readonly size: number;
  readonly contentType: string;
}

/** The names of the manifest's artifacts. */
export const ARTIFACT_NAMES = ["scan", "blockRoots", "readTable", "readSetup", "nullifierTable", "nullifierSetup"] as const;

/** The snapshots under `dataDir`, newest first (height, then the manifest's modification time). */
export function listSnapshots(dataDir: string, onIgnored: (dir: string, why: string) => void = () => {}): StoredSnapshot[] {
  const root = join(dataDir, SNAPSHOTS_DIR);
  if (!existsSync(root)) return [];
  const found: StoredSnapshot[] = [];
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    try {
      if (!/^[0-9a-f]{64}$/.test(name)) throw new Error("not a snapshot identifier");
      const file = join(dir, MANIFEST_FILE);
      const manifestBytes = new Uint8Array(readFileSync(file));
      if (toHex(snapshotId(manifestBytes)) !== name) throw new Error("the manifest's digest is not the directory's name");
      const manifest = decodeManifest(manifestBytes);
      found.push({ id: name, dir, manifest, manifestBytes, mtimeMs: statSync(file).mtimeMs });
    } catch (error) {
      onIgnored(dir, error instanceof Error ? error.message : String(error));
    }
  }
  return found.sort((a, b) => b.manifest.height - a.manifest.height || b.mtimeMs - a.mtimeMs);
}

/** Every file a snapshot serves by digest: its artifacts and its manifest (under the snapshot identifier). */
export function servedFiles(snapshot: Pick<StoredSnapshot, "id" | "dir" | "manifest" | "manifestBytes">): Map<string, ServedFile> {
  const files = new Map<string, ServedFile>();
  files.set(snapshot.id, { path: join(snapshot.dir, MANIFEST_FILE), size: snapshot.manifestBytes.length, contentType: "application/json" });
  for (const name of ARTIFACT_NAMES) {
    const ref = snapshot.manifest.artifacts[name];
    files.set(ref.digest, { path: join(snapshot.dir, ref.digest), size: ref.size, contentType: "application/octet-stream" });
  }
  return files;
}

/** SHA-256 of a file, read in chunks. */
export function fileDigest(path: string): string {
  const hash = createHash("sha256");
  const fd = openSync(path, "r");
  try {
    const chunk = Buffer.allocUnsafe(1 << 22);
    for (;;) {
      const read = readSync(fd, chunk, 0, chunk.length, null);
      if (read === 0) break;
      hash.update(chunk.subarray(0, read));
    }
  } finally {
    closeSync(fd);
  }
  return hash.digest("hex");
}

/** Throws unless every artifact of the snapshot is on disk with its size and digest. */
export function verifyArtifacts(snapshot: StoredSnapshot): void {
  for (const name of ARTIFACT_NAMES) {
    const ref = snapshot.manifest.artifacts[name];
    const path = join(snapshot.dir, ref.digest);
    if (!existsSync(path)) throw new Error(`artifact ${name} (${ref.digest}) is missing`);
    if (statSync(path).size !== ref.size) throw new Error(`artifact ${name} is not ${ref.size} bytes`);
    if (fileDigest(path) !== ref.digest) throw new Error(`artifact ${name} is not its digest`);
  }
}

/** A PIR table artifact loaded into shared memory. */
export function loadGrid(snapshot: StoredSnapshot, name: "readTable" | "nullifierTable"): Grid {
  return deserializeGrid(new Uint8Array(readFileSync(join(snapshot.dir, snapshot.manifest.artifacts[name].digest))));
}

/** An artifact's bytes. */
export function readArtifact(snapshot: Pick<StoredSnapshot, "dir" | "manifest">, name: (typeof ARTIFACT_NAMES)[number]): Uint8Array {
  return new Uint8Array(readFileSync(join(snapshot.dir, snapshot.manifest.artifacts[name].digest)));
}

/** Deletes every snapshot directory under `dataDir` but those named in `keep`; returns the identifiers deleted. */
export function pruneSnapshots(dataDir: string, keep: ReadonlySet<string>): string[] {
  const root = join(dataDir, SNAPSHOTS_DIR);
  if (!existsSync(root)) return [];
  const removed: string[] = [];
  for (const name of readdirSync(root)) {
    if (keep.has(name)) continue;
    rmSync(join(root, name), { recursive: true, force: true });
    removed.push(name);
  }
  return removed;
}

/** Removes builds a stopped process left unfinished, and makes the directories. */
export function prepareDataDir(dataDir: string): void {
  rmSync(join(dataDir, BUILDS_DIR), { recursive: true, force: true });
  mkdirSync(join(dataDir, SNAPSHOTS_DIR), { recursive: true });
  mkdirSync(join(dataDir, BUILDS_DIR), { recursive: true });
}
