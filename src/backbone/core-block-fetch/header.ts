/**
 * A block header's hash (task 10.3; task 10.1's note (c)): the Midnight node's head notifications
 * (`chain_newHead`, `chain_finalizedHead`) carry the header without its hash, while `on-best-block`'s header, the
 * best-block queue's parent links (IN-6) and IN-4's finality check need one. A Substrate block's hash is BLAKE2b-256 of
 * its header's SCALE encoding — `parentHash ‖ Compact(number) ‖ stateRoot ‖ extrinsicsRoot ‖ Compact(digest length)
 * ‖ digest items` — where each digest item is the SCALE bytes the node sent (`NodeHeader.digest`), so the encoding is
 * the node's own. Checked against a real mainnet header and the hash `chain_getBlockHash` gives for it
 * (`test/node/fixtures/mainnet-answers.json`, block 3,174,332). Pure: no Node.js import.
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
