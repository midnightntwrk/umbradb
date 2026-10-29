/**
 * A block header's hash. The Midnight node's head notifications (`chain_newHead`, `chain_finalizedHead`) carry the
 * header without its hash. The hash is still needed: for `on-best-block`'s header, for the parent links of the
 * best-block queue, and for checking that each finalized block follows the one before it. [IN-4, IN-6]
 *
 * A Substrate block's hash is the BLAKE2b-256 of its header's SCALE encoding: `parentHash ‖ Compact(number) ‖
 * stateRoot ‖ extrinsicsRoot ‖ Compact(digest length) ‖ digest items`. Each digest item is the SCALE bytes the node
 * sent (`NodeHeader.digest`), so the encoding is the node's own. It is checked against a real mainnet header and the
 * hash `chain_getBlockHash` gives for it (`test/node/fixtures/mainnet-answers.json`, block 3,174,332). Pure: no
 * Node.js import.
 */

import type { NodeHeader } from "../../node/decode.js";
import { blake2b256 } from "./blake2b.js";
import { concatBytes, encodeCompact } from "./scale.js";

/** `header`'s SCALE encoding, as the runtime hashes it. */
export function encodeHeader(header: NodeHeader): Uint8Array {
  return concatBytes([
    header.parentHash,
    encodeCompact(header.number),
    header.stateRoot,
    header.extrinsicsRoot,
    encodeCompact(BigInt(header.digest.length)),
    ...header.digest,
  ]);
}

/** `header`'s block hash: BLAKE2b-256 of {@link encodeHeader}. */
export function headerHash(header: NodeHeader): Uint8Array {
  return blake2b256(encodeHeader(header));
}
