//! The noise report of one of the project's own IPIR+SP tables, for upstream's correctness certificate (review finding
//! F3, `docs/research/00058-ipir-sp-review.md` B.4).
//!
//!   cargo run --release -p pss-ipir-core --example noise_report -- <cell file> <rows> <cols> <seed hex> [<masks file>]
//!
//! Upstream's `native_noise` example builds a table of its own random cells; this one builds the table a snapshot
//! stores, as the server sets it up (`pir/ipir-sp-server.ts`): the cells from the table file (raw column-major
//! little-endian 16-bit cells), the seed from the manifest's layout, and the file's SHA-256 as the setup's snapshot
//! input; the profile is this crate's. Upstream's `NativeServer::build_analyzed` builds it and exports, per output
//! block of 2,048 columns, the exact weights of every sampler draw in the error. The report is written to stdout in
//! `native_noise`'s format (`native-noise-two-mask-rounded-v1`), so that `certify_native.py` reads it unchanged.
//!
//! Checks before anything is written: the setup identifier equals [`TableSetup`]'s for the same inputs, and, when the
//! stored masks file is given, the build's published masks equal it byte for byte: the report is then of the table the
//! server answers from.

use ipir_native_client::{NativeParams, NativeProfile, NativePublicSetup, SecretDistribution};
use ipir_sp::native::NativeServer;
use pss_ipir_core::{TableSetup, profile::*, read_cells};
use reinspiring::noise::{WeightNorms, gaussian_cdf_sha256, gaussian_counts};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};
use std::path::Path;
use std::process::ExitCode;

fn norms(n: WeightNorms) -> Value {
    json!({"l1": n.l1.to_string(), "l2_squared": n.l2_squared.to_string(), "max": n.max.to_string()})
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

fn parse_hex32(text: &str) -> Result<[u8; 32], String> {
    if text.len() != 64 || !text.bytes().all(|c| c.is_ascii_hexdigit()) {
        return Err(format!("not 32 bytes of hex: {text}"));
    }
    let mut out = [0u8; 32];
    for (i, byte) in out.iter_mut().enumerate() {
        *byte = u8::from_str_radix(&text[2 * i..2 * i + 2], 16).map_err(|e| e.to_string())?;
    }
    Ok(out)
}

fn run() -> Result<(), String> {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.len() != 4 && args.len() != 5 {
        return Err("usage: noise_report <cell file> <rows> <cols> <seed hex> [<masks file>]".into());
    }
    let path = Path::new(&args[0]);
    let rows: usize = args[1].parse().map_err(|_| format!("rows: {}", args[1]))?;
    let cols: usize = args[2].parse().map_err(|_| format!("cols: {}", args[2]))?;
    let seed = parse_hex32(&args[3])?;
    let cells = read_cells(path, rows, cols).map_err(|e| e.to_string())?;
    // The setup's snapshot input is the table file's SHA-256 (its little-endian cells, as stored).
    let mut hash = Sha256::new();
    for cell in &cells {
        hash.update(cell.to_le_bytes());
    }
    let digest: [u8; 32] = hash.finalize().into();

    // This crate's profile (`lib.rs`, `native_profile`), built here from upstream's types; the identifier check below
    // ties the two.
    let packing = NativeParams::new(
        RING,
        Q_BITS as u32,
        P_BITS as u32,
        DIGIT_BITS as u32,
        DIGITS,
        SecretDistribution::Gaussian,
    )
    .map_err(|e| e.to_string())?;
    let dropped_bits = packing.dropped_bits();
    let profile = NativeProfile::new(packing, rows, cols)
        .and_then(|p| p.with_two_mask_output())
        .and_then(|p| p.with_published_mask_bits(MASK_BITS))
        .map_err(|e| e.to_string())?;
    let (query_bits, response_bits, kh_bits) = (profile.query_bits(), profile.response_bits(), profile.kh_bits());
    if query_bits != QUERY_BITS || response_bits != RESPONSE_BITS || profile.is_dithered_query() {
        return Err("the upstream profile's transport widths differ from this crate's".into());
    }
    let setup = NativePublicSetup::new(profile, seed, digest);
    let ours = TableSetup::new(rows, cols, seed, digest).map_err(|e| e.to_string())?;
    if setup.id() != ours.id() {
        return Err("the analysed setup is not this crate's setup of the table".into());
    }
    eprintln!(
        "analysing {} ({rows} × {cols}, SHA-256 {}, setup {})",
        path.display(),
        hex(&digest),
        hex(&setup.id())
    );
    let (server, blocks) = NativeServer::build_analyzed(setup, cells).map_err(|e| e.to_string())?;
    let published = server.published().to_bytes();
    if published.len() != masks_bytes(cols) {
        return Err(format!(
            "the published masks are {} bytes, the profile says {}",
            published.len(),
            masks_bytes(cols)
        ));
    }
    if let Some(masks) = args.get(4) {
        let stored = std::fs::read(masks).map_err(|e| format!("{masks}: {e}"))?;
        if stored != published {
            return Err(format!(
                "the masks built here differ from the stored ones ({masks}): not the served table"
            ));
        }
        eprintln!("the build's masks equal the stored ones ({masks})");
    }
    let blocks: Vec<Value> = blocks
        .into_iter()
        .map(|b| {
            json!({
                "weights": norms(b.packing.weights.independent(b.query)),
                "query_l1": b.query.l1.to_string(),
                "query_l2_squared": b.query.l2_squared.to_string(),
                "kh_l1": b.packing.kh_l1.to_string(),
                "public_mask_screens": b.packing.public_mask_screens.iter().map(|(bits, w)| json!({"bits": bits, "weights": norms(w.independent(b.query))})).collect::<Vec<_>>(),
                "one_limb": b.packing.one_limb.into_iter().map(|v| json!({"bits": v.bits, "weights": norms(v.weights.independent(b.query))})).collect::<Vec<_>>(),
            })
        })
        .collect();
    println!(
        "{}",
        json!({
            "format": "native-noise-two-mask-rounded-v1",
            "d": RING, "q_bits": Q_BITS, "p_bits": P_BITS, "ell": DIGITS, "gadget_bits": DIGIT_BITS, "dropped_bits": dropped_bits,
            "published_mask_bits": MASK_BITS, "published_bytes": published.len(),
            "rows": rows, "cols": cols, "query_bits": query_bits, "query_rounding": "nearest", "response_bits": response_bits, "kh_bits": kh_bits,
            "setup_id": hex(&server.setup().id()),
            "database_sha256": hex(&digest),
            "sampler_sha256": hex(&gaussian_cdf_sha256()),
            "sampler_counts": gaussian_counts().into_iter().map(|(x, n)| json!([x, n.to_string()])).collect::<Vec<_>>(),
            "blocks": blocks,
            "source": {"cell_file": path.file_name().map(|n| n.to_string_lossy().into_owned()), "seed": hex(&seed), "masks_checked": args.len() == 5},
        })
    );
    Ok(())
}

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(message) => {
            eprintln!("noise_report: {message}");
            ExitCode::FAILURE
        }
    }
}
