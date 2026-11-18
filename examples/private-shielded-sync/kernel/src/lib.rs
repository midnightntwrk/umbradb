//! Scan kernel of the private shielded sync example.
//!
//! The ownership test, the decryption pads, the coin decryption and the Poseidon hash, computed with the Midnight
//! ledger's own published crates (`midnight-transient-crypto`, `midnight-coin-structure`, `midnight-circuits`,
//! `midnight-curves`). Built for `wasm32-unknown-unknown`, the exports below take and fill plain linear memory: the
//! caller copies its input in at an address from `alloc`, calls, and reads the output back. No export needs an import.
//!
//! Byte conventions: a curve point is its 32-byte compressed encoding (the ledger's `Serializable` bytes); a field
//! element is its 32-byte little-endian integer; the secret is the encryption secret key's scalar, 32 bytes
//! little-endian (`SecretKey::repr`). Every export returns a status: 1 success, 0 a rejected input (not a valid point,
//! not a canonical field element, decryption failed), -1 an invalid secret.

use base_crypto::hash::HashOutput;
use coin_structure::coin::{Info, Nonce, PublicKey as CoinPublicKey, ShieldedTokenType};
use coin_structure::transfer::Recipient;
use group::GroupEncoding;
use midnight_circuits::hash::poseidon::permutation_cpu;
use midnight_circuits::hash::poseidon::round_skips::PreComputedRoundCPU;
use midnight_curves::{Fq, JubjubAffine, JubjubExtended};
use serialize::Deserializable;
use std::sync::OnceLock;
use transient_crypto::curve::{EmbeddedFr, EmbeddedGroupAffine, Fr};
use transient_crypto::encryption::{Ciphertext, SecretKey};
use transient_crypto::hash::{degrade_to_transient, transient_hash};

/// Bytes of one scan entry: the compressed point, then the first 4 bytes of element 0.
pub const ENTRY_BYTES: usize = 36;
/// Bytes of a full ciphertext: the compressed point, then elements 0–5.
pub const CIPHERTEXT_BYTES: usize = 224;
/// Bytes of a decrypted coin: value (16, little-endian), token type (32), nonce (32).
pub const COIN_BYTES: usize = 80;

const OK: i32 = 1;
const REJECTED: i32 = 0;
const BAD_SECRET: i32 = -1;

/// The precomputed partial rounds of `midnight-circuits`' CPU Poseidon. `transient_hash` builds them again on every
/// call (`PoseidonChip::init`); the kernel builds them once and runs the same permutation.
fn precomputed() -> &'static PreComputedRoundCPU<Fq> {
    static PRE: OnceLock<PreComputedRoundCPU<Fq>> = OnceLock::new();
    PRE.get_or_init(PreComputedRoundCPU::init)
}

/// Poseidon of two field elements, as `transient_hash(&[a, b])` computes it: the fixed-length sponge with rate 2
/// starts from `[0, 0, 2]`, absorbs `a` and `b` into the first two cells, permutes once and returns the first cell.
pub fn hash2(a: Fr, b: Fr) -> Fr {
    let mut state = [a.0, b.0, Fq::from(2u64)];
    permutation_cpu(precomputed(), &mut state);
    Fr(state[0])
}

fn secret_scalar(secret: &[u8]) -> Option<EmbeddedFr> {
    EmbeddedFr::from_le_bytes(secret)
}

/// The ledger's key derivation from the shared point `k* = point × secret`: `Poseidon(k*.u, k*.v)`.
fn key_from_shared(shared: &JubjubExtended) -> Fr {
    let affine = JubjubAffine::from(*shared);
    hash2(Fr(affine.get_u()), Fr(affine.get_v()))
}

/// Decodes a point as the ledger does: on the curve, canonical, in the prime-order subgroup, not the identity.
fn ledger_point(bytes: &[u8]) -> Option<EmbeddedGroupAffine> {
    let point = <EmbeddedGroupAffine as Deserializable>::deserialize(&mut &bytes[..32], 0).ok()?;
    if point.is_identity() { None } else { Some(point) }
}

/// The ownership test of one entry. Decompression skips the subgroup check, which is the larger part of decoding;
/// only an entry whose 4 bytes match is decoded again the ledger's way before it counts (FR-103). An entry of 36 zero
/// bytes is an output without a ciphertext and never matches.
fn entry_value(entry: &[u8], secret: &EmbeddedFr) -> Option<Fr> {
    if entry.iter().all(|b| *b == 0) {
        return None;
    }
    let mut repr = [0u8; 32];
    repr.copy_from_slice(&entry[..32]);
    let point: Option<JubjubExtended> = JubjubExtended::from_bytes(&repr).into();
    let shared = point? * secret.0;
    Some(hash2(key_from_shared(&shared), Fr::from(0u64)))
}

fn entry_matches(entry: &[u8], secret: &EmbeddedFr) -> bool {
    match entry_value(entry, secret) {
        Some(pad) => pad.as_le_bytes()[..4] == entry[32..36] && ledger_point(&entry[..32]).is_some(),
        None => false,
    }
}

/// Positions (relative to `entries`) whose entry passes the ownership test, in order.
pub fn scan_slice(entries: &[u8], secret: &EmbeddedFr) -> Vec<u32> {
    entries
        .chunks_exact(ENTRY_BYTES)
        .enumerate()
        .filter(|(_, e)| entry_matches(e, secret))
        .map(|(i, _)| i as u32)
        .collect()
}

/// The six pads `Poseidon(k, i)`, `i = 0 … 5`, of a ciphertext's point, computed the ledger's way.
pub fn pads_of(point: &[u8], secret: &EmbeddedFr) -> Option<[Fr; 6]> {
    let point = ledger_point(point)?;
    let shared = point * *secret;
    let key = transient_hash(&[shared.x()?, shared.y()?]);
    let mut out = [Fr::from(0u64); 6];
    for (i, pad) in out.iter_mut().enumerate() {
        *pad = hash2(key, Fr::from(i as u64));
    }
    Some(out)
}

/// The ledger's own decryption of a coin (`SecretKey::decrypt::<CoinInfo>`, what Zswap's `try_decrypt` calls).
pub fn decrypt_coin_of(ciphertext: &[u8], secret: &[u8]) -> Result<Option<Info>, ()> {
    let mut repr = [0u8; 32];
    repr.copy_from_slice(&secret[..32]);
    let sk: Option<SecretKey> = SecretKey::from_repr(&repr).into();
    let sk = sk.ok_or(())?;
    let Some(c) = ledger_point(&ciphertext[..32]) else { return Ok(None) };
    let mut ciph = Vec::with_capacity(6);
    for chunk in ciphertext[32..CIPHERTEXT_BYTES].chunks_exact(32) {
        match Fr::from_le_bytes(chunk) {
            Some(fr) => ciph.push(fr),
            None => return Ok(None),
        }
    }
    Ok(sk.decrypt::<Info>(&Ciphertext { c, ciph }))
}

fn hash_output(bytes: &[u8]) -> HashOutput {
    let mut out = [0u8; 32];
    out.copy_from_slice(&bytes[..32]);
    HashOutput(out)
}

/// `coinCommitment(coin, coinPublicKey)` of a coin in the kernel's 80-byte layout.
pub fn commitment_of(coin: &[u8], coin_public_key: &[u8]) -> [u8; 32] {
    let mut value = [0u8; 16];
    value.copy_from_slice(&coin[..16]);
    let info = Info {
        value: u128::from_le_bytes(value),
        type_: ShieldedTokenType(hash_output(&coin[16..48])),
        nonce: Nonce(hash_output(&coin[48..80])),
    };
    info.commitment(&Recipient::User(CoinPublicKey(hash_output(coin_public_key)))).0.0
}

/// Writes a coin in the kernel's 80-byte layout.
pub fn write_coin(info: &Info, out: &mut [u8]) {
    out[..16].copy_from_slice(&info.value.to_le_bytes());
    out[16..48].copy_from_slice(&info.type_.0.0);
    out[48..80].copy_from_slice(&info.nonce.0.0);
}

// ---- Exports over linear memory ----

/// Reserves `len` bytes and returns their address (8-byte aligned). Never freed except by `dealloc`.
#[unsafe(no_mangle)]
pub extern "C" fn alloc(len: u32) -> *mut u8 {
    let words = (len as usize).div_ceil(8).max(1);
    let mut v = Vec::<u64>::with_capacity(words);
    let p = v.as_mut_ptr() as *mut u8;
    std::mem::forget(v);
    p
}

/// Releases `len` bytes at `ptr`, as returned by `alloc(len)`.
///
/// # Safety
/// `ptr` and `len` must come from one `alloc` call, and the bytes must not be used afterwards.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, len: u32) {
    let words = (len as usize).div_ceil(8).max(1);
    unsafe { drop(Vec::<u64>::from_raw_parts(ptr as *mut u64, 0, words)) };
}

/// Tests `count` 36-byte entries; writes the matching positions (relative, `u32` little-endian) to `out`, which must
/// hold `count` of them, and returns how many matched, or -1 for an invalid secret.
///
/// # Safety
/// The pointers must address `count × 36`, 32 and `count × 4` valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn scan(entries: *const u8, count: u32, secret: *const u8, out: *mut u32) -> i32 {
    let entries = unsafe { std::slice::from_raw_parts(entries, count as usize * ENTRY_BYTES) };
    let Some(sk) = secret_scalar(unsafe { std::slice::from_raw_parts(secret, 32) }) else { return BAD_SECRET };
    let hits = scan_slice(entries, &sk);
    let out = unsafe { std::slice::from_raw_parts_mut(out, count as usize) };
    out[..hits.len()].copy_from_slice(&hits);
    hits.len() as i32
}

/// Writes, for each of `count` entries, the 32-byte value the ownership test compares (`Poseidon(k, 0)`), computed
/// as `scan` computes it (no subgroup check); 32 zero bytes for an all-zero entry or a point not on the curve.
/// Returns `count`, or -1 for an invalid secret.
///
/// # Safety
/// The pointers must address `count × 36`, 32 and `count × 32` valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn scan_values(entries: *const u8, count: u32, secret: *const u8, out: *mut u8) -> i32 {
    let entries = unsafe { std::slice::from_raw_parts(entries, count as usize * ENTRY_BYTES) };
    let Some(sk) = secret_scalar(unsafe { std::slice::from_raw_parts(secret, 32) }) else { return BAD_SECRET };
    let out = unsafe { std::slice::from_raw_parts_mut(out, count as usize * 32) };
    for (entry, slot) in entries.chunks_exact(ENTRY_BYTES).zip(out.chunks_exact_mut(32)) {
        match entry_value(entry, &sk) {
            Some(v) => slot.copy_from_slice(&v.as_le_bytes()),
            None => slot.fill(0),
        }
    }
    count as i32
}

/// Writes the six pads of a point (6 × 32 bytes). Returns 0 if the point is not one the ledger accepts.
///
/// # Safety
/// The pointers must address 32, 32 and 192 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn pads(point: *const u8, secret: *const u8, out: *mut u8) -> i32 {
    let Some(sk) = secret_scalar(unsafe { std::slice::from_raw_parts(secret, 32) }) else { return BAD_SECRET };
    let Some(pads) = pads_of(unsafe { std::slice::from_raw_parts(point, 32) }, &sk) else { return REJECTED };
    let out = unsafe { std::slice::from_raw_parts_mut(out, 192) };
    for (pad, slot) in pads.iter().zip(out.chunks_exact_mut(32)) {
        slot.copy_from_slice(&pad.as_le_bytes());
    }
    OK
}

/// Writes `Poseidon(a, b)`. Returns 0 if either input is not a canonical field element.
///
/// # Safety
/// The pointers must address 32, 32 and 32 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn hash2_raw(a: *const u8, b: *const u8, out: *mut u8) -> i32 {
    let a = Fr::from_le_bytes(unsafe { std::slice::from_raw_parts(a, 32) });
    let b = Fr::from_le_bytes(unsafe { std::slice::from_raw_parts(b, 32) });
    let (Some(a), Some(b)) = (a, b) else { return REJECTED };
    unsafe { std::slice::from_raw_parts_mut(out, 32) }.copy_from_slice(&hash2(a, b).as_le_bytes());
    OK
}

/// Decrypts a 224-byte ciphertext with the ledger's own decryption into a coin. `out` gets 81 bytes: an ok flag
/// (1 or 0), then the coin (value 16 little-endian, token type 32, nonce 32; zero when the flag is 0). Returns the
/// flag, or -1 for an invalid secret.
///
/// # Safety
/// The pointers must address 224, 32 and 81 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn decrypt_coin(ciphertext: *const u8, secret: *const u8, out: *mut u8) -> i32 {
    let ciphertext = unsafe { std::slice::from_raw_parts(ciphertext, CIPHERTEXT_BYTES) };
    let secret = unsafe { std::slice::from_raw_parts(secret, 32) };
    let out = unsafe { std::slice::from_raw_parts_mut(out, 1 + COIN_BYTES) };
    out.fill(0);
    match decrypt_coin_of(ciphertext, secret) {
        Err(()) => BAD_SECRET,
        Ok(None) => REJECTED,
        Ok(Some(info)) => {
            out[0] = 1;
            write_coin(&info, &mut out[1..]);
            OK
        }
    }
}

/// Writes a commitment's tree leaf, `degrade_to_transient(commitment)`, as a 32-byte field element.
///
/// # Safety
/// The pointers must address 32 and 32 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn leaf(commitment: *const u8, out: *mut u8) -> i32 {
    let c = hash_output(unsafe { std::slice::from_raw_parts(commitment, 32) });
    unsafe { std::slice::from_raw_parts_mut(out, 32) }.copy_from_slice(&degrade_to_transient(c).as_le_bytes());
    OK
}

/// Writes `coinCommitment(coin, coinPublicKey)` for a coin in the 80-byte layout and a 32-byte coin public key.
///
/// # Safety
/// The pointers must address 80, 32 and 32 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn commitment(coin: *const u8, coin_public_key: *const u8, out: *mut u8) -> i32 {
    let coin = unsafe { std::slice::from_raw_parts(coin, COIN_BYTES) };
    let cpk = unsafe { std::slice::from_raw_parts(coin_public_key, 32) };
    unsafe { std::slice::from_raw_parts_mut(out, 32) }.copy_from_slice(&commitment_of(coin, cpk));
    OK
}

/// Writes the encryption public key of a secret, `G × secret`, as its 32-byte compressed encoding (the bytes of the
/// TypeScript package's `encryptionPublicKey`). Lets a client check its secret conversion.
///
/// # Safety
/// The pointers must address 32 and 32 valid bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn public_key(secret: *const u8, out: *mut u8) -> i32 {
    let mut repr = [0u8; 32];
    repr.copy_from_slice(unsafe { std::slice::from_raw_parts(secret, 32) });
    let sk: Option<SecretKey> = SecretKey::from_repr(&repr).into();
    let Some(sk) = sk else { return BAD_SECRET };
    let mut bytes = Vec::with_capacity(32);
    serialize::Serializable::serialize(&sk.public_key(), &mut bytes).expect("writing to a vector");
    unsafe { std::slice::from_raw_parts_mut(out, 32) }.copy_from_slice(&bytes);
    OK
}

// `getrandom` 0.2 needs a source to compile for wasm32-unknown-unknown. Nothing in the kernel draws randomness; the
// registered source always fails.
#[cfg(target_arch = "wasm32")]
mod no_randomness {
    fn unavailable(_: &mut [u8]) -> Result<(), getrandom02::Error> {
        Err(getrandom02::Error::UNSUPPORTED)
    }
    getrandom02::register_custom_getrandom!(unavailable);
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::{Rng, SeedableRng};
    use rand_chacha::ChaCha20Rng;
    use transient_crypto::encryption::PublicKey;

    #[test]
    fn hash2_equals_transient_hash() {
        let mut rng = ChaCha20Rng::seed_from_u64(1);
        for _ in 0..200 {
            let (a, b): (Fr, Fr) = (rng.r#gen(), rng.r#gen());
            assert_eq!(hash2(a, b), transient_hash(&[a, b]));
        }
    }

    /// Timing only (`./build.sh --test --ignored --nocapture hash_timing`): the ledger's `transient_hash`, which
    /// rebuilds Poseidon's precomputation per call, against `hash2` with the precomputation built once.
    #[test]
    #[ignore = "timing only"]
    fn hash_timing() {
        let mut rng = ChaCha20Rng::seed_from_u64(3);
        let (a, b): (Fr, Fr) = (rng.r#gen(), rng.r#gen());
        let n = 5000;
        let t = std::time::Instant::now();
        for _ in 0..n {
            std::hint::black_box(transient_hash(&[std::hint::black_box(a), b]));
        }
        let ledger = t.elapsed().as_secs_f64() * 1e6 / n as f64;
        let t = std::time::Instant::now();
        for _ in 0..n {
            std::hint::black_box(hash2(std::hint::black_box(a), b));
        }
        let cached = t.elapsed().as_secs_f64() * 1e6 / n as f64;
        println!("transient_hash {ledger:.2} us, hash2 {cached:.2} us per call (native)");
    }

    #[test]
    fn scan_value_equals_ledger_pad() {
        let mut rng = ChaCha20Rng::seed_from_u64(2);
        let sk = SecretKey::new(&mut rng);
        let scalar = EmbeddedFr::from_le_bytes(&sk.repr()).unwrap();
        let pk: PublicKey = sk.public_key();
        for _ in 0..50 {
            let info: Info = rng.r#gen();
            let ct = pk.encrypt(&mut rng, &info);
            let mut entry = [0u8; 36];
            let mut point = Vec::new();
            serialize::Serializable::serialize(&ct.c, &mut point).unwrap();
            entry[..32].copy_from_slice(&point);
            entry[32..].copy_from_slice(&ct.ciph[0].as_le_bytes()[..4]);
            assert!(entry_matches(&entry, &scalar));
            let pads = pads_of(&point, &scalar).unwrap();
            // Element 0 encrypts zero, so it equals pad 0.
            assert_eq!(pads[0], ct.ciph[0]);
            let mut full = [0u8; CIPHERTEXT_BYTES];
            full[..32].copy_from_slice(&point);
            for (i, c) in ct.ciph.iter().enumerate() {
                full[32 + 32 * i..64 + 32 * i].copy_from_slice(&c.as_le_bytes());
            }
            assert_eq!(decrypt_coin_of(&full, &sk.repr()).unwrap(), Some(info));
        }
    }
}
