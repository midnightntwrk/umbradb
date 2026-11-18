/**
 * The kernel's secret: the encryption secret key's scalar, 32 bytes little-endian (`SecretKey::repr` in
 * `midnight-transient-crypto`), from the ledger TypeScript package's explicit serialization (spec FR-091).
 *
 * `EncryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize()` writes the key's `Serializable` form:
 * `SecretKey(EmbeddedFr)` derives `Serializable` field by field, and an `EmbeddedFr` serializes as a `ScaleBigInt` of
 * its little-endian representation (`transient-crypto/src/curve.rs`, `field_serialize!`; `serialize/src/util.rs`):
 *
 * - low 2 bits of the first byte `00`: one byte, value = byte >> 2;
 * - `01`: two bytes, 14-bit value; `10`: four bytes, 30-bit value (6 bits from the first byte, 8 from each next);
 * - `11`: `(first >> 2) + 4` value bytes follow, little-endian, the last non-zero (a uniform 252-bit scalar is
 *   almost always `0x73` followed by its 32 bytes).
 *
 * The tagged form (`…_taggedSerialize()`) is the same bytes after the prefix `midnight:encryption-secret-key[v1]:`.
 * The result must be below the Jubjub scalar field's order; the kernel's `public_key` export lets the caller check it
 * against the package's `encryptionPublicKey`.
 */

const TAG = new TextEncoder().encode("midnight:encryption-secret-key[v1]:");

/** Order of the Jubjub scalar field (the embedded curve's prime-order subgroup). */
export const JUBJUB_SCALAR_ORDER = 0x0e7db4ea6533afa906673b0101343b00a6682093ccc81082d0970e5ed6f72cb7n;

function startsWith(bytes: Uint8Array, prefix: Uint8Array): boolean {
  return bytes.length >= prefix.length && prefix.every((b, i) => bytes[i] === b);
}

/** Decodes one `ScaleBigInt`; returns its little-endian value bytes and the bytes consumed. Throws if non-canonical. */
export function decodeScaleBigInt(bytes: Uint8Array): { value: Uint8Array; consumed: number } {
  if (bytes.length < 1) throw new Error("empty SCALE integer");
  const first = bytes[0]!;
  const top6 = (b: number) => b >> 2;
  const bot2 = (b: number) => (b & 3) << 6;
  switch (first & 3) {
    case 0:
      return { value: Uint8Array.of(top6(first)), consumed: 1 };
    case 1: {
      if (bytes.length < 2) throw new Error("truncated SCALE integer");
      const second = bytes[1]!;
      if (second === 0) throw new Error("non-canonical SCALE integer");
      return { value: Uint8Array.of(top6(first) | bot2(second), top6(second)), consumed: 2 };
    }
    case 2: {
      if (bytes.length < 4) throw new Error("truncated SCALE integer");
      const [b1, b2, b3] = [bytes[1]!, bytes[2]!, bytes[3]!];
      if (b2 === 0 && b3 === 0) throw new Error("non-canonical SCALE integer");
      return {
        value: Uint8Array.of(top6(first) | bot2(b1), top6(b1) | bot2(b2), top6(b2) | bot2(b3), top6(b3)),
        consumed: 4,
      };
    }
    default: {
      const n = top6(first) + 4;
      if (bytes.length < 1 + n) throw new Error("truncated SCALE integer");
      const value = bytes.slice(1, 1 + n);
      if (value[n - 1] === 0 || (n === 4 && value[3]! < 64)) throw new Error("non-canonical SCALE integer");
      return { value, consumed: 1 + n };
    }
  }
}

/**
 * The 32-byte little-endian scalar of a serialized `EncryptionSecretKey` (untagged or tagged). Throws on anything
 * else: trailing bytes, non-canonical encodings, a value of 32 bytes or more that is not below the field's order.
 */
export function encryptionSecretKeyScalar(serialized: Uint8Array): Uint8Array {
  const body = startsWith(serialized, TAG) ? serialized.subarray(TAG.length) : serialized;
  const { value, consumed } = decodeScaleBigInt(body);
  if (consumed !== body.length) throw new Error("trailing bytes after the encryption secret key");
  if (value.length > 32) throw new Error("encryption secret key out of range");
  const scalar = new Uint8Array(32);
  scalar.set(value);
  let v = 0n;
  for (let i = 31; i >= 0; i--) v = (v << 8n) | BigInt(scalar[i]!);
  if (v >= JUBJUB_SCALAR_ORDER) throw new Error("encryption secret key out of range");
  return scalar;
}
