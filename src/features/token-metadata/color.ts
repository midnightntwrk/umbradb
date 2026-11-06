/**
 * A token's color (MIP-0018 "Terminology", "Lookup"): `tokenType(domainSep, contractAddress)`, the Compact standard
 * library's `persistentCommit([domainSep, contractAddress], pad(32, "midnight:derive_token"))`, which is the SHA-256 of
 * `pad(32, "midnight:derive_token") ‖ domainSep ‖ contractAddress`. One color serves a token's shielded (kind 1) and
 * unshielded (kind 2) forms; a contract token (kind 3) has none. Computed here without the ledger, so it runs on the
 * main thread and in the browser build; the tests hold it to `rawTokenType` of the vendored v8, v9-rc3 and v9
 * packages. [TM-6, TM-13; M12]
 *
 * After the proof of concept's `color.ts` (`tokenColorSha256`), itself a port of the reference implementation's
 * `packages/midnight/src/color.ts` (Apache-2.0).
 */

import { createHash } from "node:crypto";

const DERIVE_TOKEN = (() => {
  const bytes = new Uint8Array(32);
  bytes.set(new TextEncoder().encode("midnight:derive_token"));
  return bytes;
})();

/** The color of the token (`domainSep`, `contract`), 32 bytes; throws a `RangeError` unless both are 32 bytes. */
export function tokenColor(domainSep: Uint8Array, contract: Uint8Array): Uint8Array {
  if (domainSep.length !== 32 || contract.length !== 32) throw new RangeError("a color takes a 32-byte domain separator and contract address");
  return new Uint8Array(createHash("sha256").update(DERIVE_TOKEN).update(domainSep).update(contract).digest());
}

/** Whether a token of `kind` has a color: kinds 1 (shielded) and 2 (unshielded), not 3 (a contract token). */
export const hasColor = (kind: number): boolean => kind === 1 || kind === 2;
