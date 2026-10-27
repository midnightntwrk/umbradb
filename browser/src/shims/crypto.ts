/**
 * `node:crypto` in the browser build (`openspec/changes/core-arch/design.md` §9.2; task 16.1): `createHash("sha256")`
 * only — the one hash UmbraDB's sources take from it — synchronous and incremental like Node.js's, over `./sha256.ts`.
 * `update` takes bytes or text (UTF-8 unless an encoding is named), `digest()` gives a `Buffer` and `digest("hex")`
 * text. Any other algorithm, or any other export, fails the build or the call, never silently.
 */

import { Buffer } from "./buffer.js";
import { Sha256 } from "./sha256.js";

/** A hash in progress, as Node.js's `Hash` is used here. */
export class Hash {
  readonly #sha = new Sha256();

  update(data: string | Uint8Array | ArrayBufferView, encoding?: string): this {
    if (typeof data === "string") this.#sha.update(Buffer.from(data, encoding));
    else this.#sha.update(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    return this;
  }

  digest(): Buffer;
  digest(encoding: string): string;
  digest(encoding?: string): Buffer | string {
    const bytes = Buffer.from(this.#sha.digest());
    return encoding === undefined ? bytes : bytes.toString(encoding);
  }
}

/** Node.js's `createHash`, for SHA-256 only. */
export function createHash(algorithm: string): Hash {
  if (algorithm.toLowerCase() !== "sha256") {
    throw new Error(`the browser build's node:crypto has SHA-256 only, not ${algorithm}`);
  }
  return new Hash();
}
