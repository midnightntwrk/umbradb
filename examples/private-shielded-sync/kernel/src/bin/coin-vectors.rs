//! Writes coin decryption vectors with the ledger's own `encrypt`, for the kernel's tests (native only).
//!
//! `coin-vectors <dir> <count>` writes, from a fixed seed:
//! - `coin-secret.bin`: the test encryption secret key's scalar, 32 bytes little-endian;
//! - `coin-public-key.bin`: a coin public key the commitments are made for, 32 bytes;
//! - `coins.bin`: `count` records of 337 bytes: the 224-byte ciphertext (point, elements 0–5, each 32 bytes
//!   little-endian), a flag (1: to the test key, 0: to another key), the coin (value 16 little-endian, token type 32,
//!   nonce 32), and the coin's commitment for the coin public key (32).

use coin_structure::coin::Info;
use pss_kernel::{CIPHERTEXT_BYTES, COIN_BYTES, commitment_of, write_coin};
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha20Rng;
use transient_crypto::encryption::SecretKey;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let dir = &args[1];
    let count: usize = args[2].parse().expect("count");
    let mut rng = ChaCha20Rng::seed_from_u64(53);
    let mut wide = [0u8; 64];
    rng.fill(&mut wide[..]);
    let sk = SecretKey::from_uniform_bytes(&wide);
    let other = SecretKey::new(&mut rng).public_key();
    let cpk: [u8; 32] = rng.r#gen();
    let mut records = Vec::new();
    for i in 0..count {
        let mut info: Info = rng.r#gen();
        // Small and edge values as well as random ones.
        info.value = match i % 4 {
            0 => rng.gen_range(0..1_000_000),
            1 => u128::MAX,
            2 => 0,
            _ => info.value,
        };
        let mine = i % 3 != 2;
        let ct = if mine { sk.public_key().encrypt(&mut rng, &info) } else { other.encrypt(&mut rng, &info) };
        let mut rec = vec![0u8; CIPHERTEXT_BYTES + 1 + COIN_BYTES + 32];
        let mut point = Vec::new();
        serialize::Serializable::serialize(&ct.c, &mut point).unwrap();
        rec[..32].copy_from_slice(&point);
        for (j, c) in ct.ciph.iter().enumerate() {
            rec[32 + 32 * j..64 + 32 * j].copy_from_slice(&c.as_le_bytes());
        }
        rec[CIPHERTEXT_BYTES] = mine as u8;
        let coin = &mut rec[CIPHERTEXT_BYTES + 1..CIPHERTEXT_BYTES + 1 + COIN_BYTES];
        write_coin(&info, coin);
        let com = commitment_of(coin, &cpk);
        rec[CIPHERTEXT_BYTES + 1 + COIN_BYTES..].copy_from_slice(&com);
        records.extend(rec);
    }
    std::fs::create_dir_all(dir).unwrap();
    std::fs::write(format!("{dir}/coin-secret.bin"), sk.repr()).unwrap();
    std::fs::write(format!("{dir}/coin-public-key.bin"), cpk).unwrap();
    std::fs::write(format!("{dir}/coins.bin"), records).unwrap();
    println!("wrote {count} coin vectors to {dir}");
}
