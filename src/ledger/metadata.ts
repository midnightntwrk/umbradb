/**
 * Which runtime metadata decodes a block.
 *
 * A block's extrinsics and events were produced by the runtime that built it, its `MNSV` version, so a block's content is
 * decoded with the metadata of the runtime whose `spec_version` (`state_getRuntimeVersion` at a hash) is that version:
 * - **the runtime in its parent's state** ({@link contentStateOf}: the parent hash; for block 0, block 0 itself) when
 *   its version is the `MNSV` version: every block away from an upgrade, and every block of an upgrade whose `set_code`
 *   runs inside the enactment block U (the earlier form: U's own state already holds the new runtime, so U is decoded
 *   with the old metadata, read at U − 1, and F = U + 1 with the new, read at U);
 * - else **the runtime in the block's own state** when its version is: the first block of a delayed upgrade (runtime
 *   2.1's `system_version` 3: `apply_authorized_upgrade` in U only stages the code, so U's state still holds the old
 *   runtime; F is built by the new one and its own state holds it, while its parent's does not);
 * - else processing halts with `metadata-mismatch`, a typed `UmbraError` that the finalized loop turns into a halt,
 *   naming both versions.
 * The official indexer compares the same versions (`chain-indexer/src/infra/subxt_node.rs`). The parent's runtime is
 * asked first: a recorded tape holds each runtime's metadata at the first height whose state reports it, U for the
 * earlier form and F for the delayed one, and this order reads it there.
 *
 * {@link RuntimeMetadata} caches the metadata by that `spec_version`: the version of the runtime read at the same hash
 * the metadata is read at, after the check, so a runtime's metadata is never stored under another version. It reads
 * each version's metadata once, also when several blocks ask for it at the same time (the finalized prefetch). A read
 * that fails leaves nothing behind, so the next block reads it again. Every block costs one `state_getRuntimeVersion`
 * (the parent's), the first block of a delayed upgrade a second (its own), and a version's first block one
 * `state_getMetadata`.
 *
 * {@link RuntimeMetadata.forState} gives the metadata of the runtime in a block's own state, which reads of that state
 * (storage, runtime calls) use. It differs from the metadata of the block's content only at the earlier form's U.
 *
 * The node is the node client (`src/node/`, `NodeClient`) or anything with its two calls. The cached bytes are shared
 * by every caller and must not be changed. Pure: no Node.js import.
 */

import { UmbraError } from "../db/errors.js";

/** The two node calls the cache makes: `state_getRuntimeVersion` and `state_getMetadata`, each at a hash. */
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

/** The hash whose state holds the runtime that built `block`: its parent's, or its own for block 0. */
export function contentStateOf(block: Pick<MetadataBlock, "height" | "hash" | "parentHash">): Uint8Array {
  return block.height === 0n ? block.hash : block.parentHash;
}

/** The runtime metadata cache: see the module comment. */
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
   * The metadata `block`'s content is decoded with: the runtime in its parent's state (block 0: its own) when its
   * `spec_version` is the block's `MNSV` version, else the runtime in the block's own state when its is (see the module
   * comment). Throws `metadata-mismatch` when neither is, having read no metadata.
   */
  async forBlock(block: MetadataBlock): Promise<RuntimeMetadataEntry> {
    const at = contentStateOf(block);
    const { specVersion } = await this.#node.runtimeVersion(at);
    if (specVersion === block.specVersion) return this.#entry(at, specVersion);
    const own = at === block.hash ? specVersion : (await this.#node.runtimeVersion(block.hash)).specVersion;
    if (own === block.specVersion) return this.#entry(block.hash, own);
    throw new UmbraError(
      "metadata-mismatch",
      `block ${block.height} (${hexOf(block.hash)}) carries spec_version ${block.specVersion} in its MNSV digest, but the ` +
        `runtime in its parent's state (${hexOf(at)}) has spec_version ${specVersion} and the runtime in its own state ` +
        `has spec_version ${own}: its content cannot be decoded with either runtime's metadata`,
      {
        height: block.height,
        hash: hexOf(block.hash),
        at: hexOf(at),
        specVersion: block.specVersion,
        runtimeSpecVersion: specVersion,
        stateSpecVersion: own,
      },
    );
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
