/**
 * Which runtime metadata decodes a block. [LG-4; CORE-ARCH §4.8]
 *
 * A block's extrinsics and events were produced by the runtime that built it, its `MNSV` version. But `set_code` runs
 * inside the enactment block U, so the state at U already holds the new runtime, and `state_getMetadata` at U returns
 * the new metadata. So a block's content is decoded with the metadata of the runtime in its parent's state
 * ({@link contentStateOf}: the parent hash; for block 0, block 0 itself). That runtime's `spec_version`
 * (`state_getRuntimeVersion` at the same hash) must be the block's `MNSV` version. Otherwise processing halts with
 * `metadata-mismatch`, a typed `UmbraError` that the finalized loop turns into a halt. U is then decoded with the old
 * metadata (read at U − 1) and F = U + 1 with the new one (read at U), as the official indexer does
 * (`chain-indexer/src/infra/subxt_node.rs`). [LG-4; design §11]
 *
 * {@link RuntimeMetadata} caches the metadata by that `spec_version`: the version of the runtime read at the same hash
 * the metadata is read at, after the check, so the new metadata is never stored under the old version. It reads each
 * version's metadata once, also when several blocks ask for it at the same time (the finalized prefetch). A read that
 * fails leaves nothing behind, so the next block reads it again. Every block costs one `state_getRuntimeVersion` (the
 * check), and a version's first block one `state_getMetadata`. [LG-4]
 *
 * {@link RuntimeMetadata.forState} gives the metadata of the runtime in a block's own state, which reads of that state
 * (storage, runtime calls) use. It differs from the metadata of the block's content only at U.
 *
 * The node is the node client (`src/node/`, `NodeClient`) or anything with its two calls. The cached bytes are shared
 * by every caller and must not be changed. Pure: no Node.js import.
 */

import { UmbraError } from "../db/errors.js";

/** The two node calls the cache makes: `state_getRuntimeVersion` and `state_getMetadata`, each at a hash. [IN-8] */
export interface MetadataNode {
  runtimeVersion(at: Uint8Array): Promise<{ readonly specVersion: number }>;
  metadata(at: Uint8Array): Promise<Uint8Array>;
}

/** A block, as the cache reads it: its height, hash and parent hash, and the `spec_version` of its `MNSV` digest. */
export interface MetadataBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly parentHash: Uint8Array;
  readonly specVersion: number;
}

/** A runtime's metadata and its `spec_version`. */
export interface RuntimeMetadataEntry {
  readonly specVersion: number;
  readonly metadata: Uint8Array;
}

const HEX = "0123456789abcdef";

function hexOf(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += (HEX[byte >> 4] as string) + (HEX[byte & 15] as string);
  return text;
}

/** The hash whose state holds the runtime that built `block`: its parent's, or its own for block 0. [LG-4] */
export function contentStateOf(block: Pick<MetadataBlock, "height" | "hash" | "parentHash">): Uint8Array {
  return block.height === 0n ? block.hash : block.parentHash;
}

/** The runtime metadata cache: see the module comment. [LG-4] */
export class RuntimeMetadata {
  readonly #node: MetadataNode;
  /** Each `spec_version`'s metadata, read once (a read in flight is here too; a failed one is removed). */
  readonly #reads = new Map<number, Promise<Uint8Array>>();
  /** The metadata read so far, by `spec_version`. */
  readonly #cached = new Map<number, Uint8Array>();

  constructor(node: MetadataNode) {
    this.#node = node;
  }

  /**
   * The metadata `block`'s content is decoded with: the runtime in its parent's state (block 0: its own), whose
   * `spec_version` must be the block's `MNSV` version. Throws `metadata-mismatch` otherwise, having read no metadata.
   */
  async forBlock(block: MetadataBlock): Promise<RuntimeMetadataEntry> {
    const at = contentStateOf(block);
    const { specVersion } = await this.#node.runtimeVersion(at);
    if (specVersion !== block.specVersion) {
      throw new UmbraError(
        "metadata-mismatch",
        `block ${block.height} (${hexOf(block.hash)}) carries spec_version ${block.specVersion} in its MNSV digest, but the ` +
          `runtime in its parent's state (${hexOf(at)}) has spec_version ${specVersion}: its content cannot be ` +
          "decoded with that runtime's metadata",
        { height: block.height, hash: hexOf(block.hash), at: hexOf(at), specVersion: block.specVersion, runtimeSpecVersion: specVersion },
      );
    }
    return this.#entry(at, specVersion);
  }

  /** The metadata of the runtime in the state of the block `hash`: what reads of that state are decoded with. */
  async forState(hash: Uint8Array): Promise<RuntimeMetadataEntry> {
    const { specVersion } = await this.#node.runtimeVersion(hash);
    return this.#entry(hash, specVersion);
  }

  /** The metadata cached for `specVersion`, or undefined. */
  cached(specVersion: number): Uint8Array | undefined {
    return this.#cached.get(specVersion);
  }

  /** The `spec_version`s whose metadata is cached, ascending. */
  specVersions(): number[] {
    return [...this.#cached.keys()].sort((a, b) => a - b);
  }

  /** `specVersion`'s metadata, read at `at` — whose runtime has that version — unless read already. */
  async #entry(at: Uint8Array, specVersion: number): Promise<RuntimeMetadataEntry> {
    let read = this.#reads.get(specVersion);
    if (read === undefined) {
      read = this.#node.metadata(at).then(
        (metadata) => {
          this.#cached.set(specVersion, metadata);
          return metadata;
        },
        (error: unknown) => {
          this.#reads.delete(specVersion);
          throw error;
        },
      );
      this.#reads.set(specVersion, read);
    }
    return Object.freeze({ specVersion, metadata: await read });
  }
}
