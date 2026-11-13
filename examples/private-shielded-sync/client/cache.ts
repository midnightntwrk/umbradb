/**
 * Artifacts cached by digest (spec FR-110): a downloaded artifact is stored under its SHA-256 and never downloaded
 * again while a file of that name and size exists. Artifacts are the same for every wallet, so wallets may share a
 * cache. A file is written under a temporary name and renamed once its digest and size are checked.
 */

import { mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { ArtifactRef } from "../shared/index.ts";
import type { PssHttp } from "./http.ts";

/** One artifact's download: whether it came from the cache, its bytes moved and the time spent. */
export interface FetchStat {
  readonly digest: string;
  readonly size: number;
  readonly cached: boolean;
  readonly bytes: number;
  readonly ms: number;
}

export class BlobCache {
  readonly dir: string;

  constructor(dir: string) {
    this.dir = dir;
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  path(digest: string): string {
    if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error(`not a digest: ${digest}`);
    return join(this.dir, digest);
  }

  has(ref: ArtifactRef): boolean {
    try {
      return statSync(this.path(ref.digest)).size === ref.size;
    } catch {
      return false;
    }
  }

  /** Downloads the artifact unless it is cached; returns where it is and what it cost. */
  async fetch(http: PssHttp, ref: ArtifactRef): Promise<FetchStat> {
    const started = performance.now();
    if (this.has(ref)) return { digest: ref.digest, size: ref.size, cached: true, bytes: 0, ms: performance.now() - started };
    const bytes = await http.blobToFile(ref.digest, ref.size, this.path(ref.digest));
    return { digest: ref.digest, size: ref.size, cached: false, bytes, ms: performance.now() - started };
  }

  read(ref: ArtifactRef): Uint8Array {
    const bytes = new Uint8Array(readFileSync(this.path(ref.digest)));
    if (bytes.length !== ref.size) throw new Error(`cached artifact ${ref.digest} has ${bytes.length} bytes, expected ${ref.size}`);
    return bytes;
  }

  /** Bytes the cache holds for `refs`. */
  sizeOf(refs: readonly ArtifactRef[]): number {
    return refs.filter((r) => this.has(r)).reduce((n, r) => n + r.size, 0);
  }
}
