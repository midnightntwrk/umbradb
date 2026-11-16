//! The public values a GPU responder needs (`../../gpu/ipir.ts`), computed by upstream's own code from a table's cells
//! and public setup, and upstream's intermediate results for given requests, to check a GPU against.
//!
//! Everything here is public: the cells, the public setup (seed, snapshot digest), what the server derives from them
//! (hint columns, compiled packing matrices, published masks), and what a request carries (key and selection words).
//! No secret enters.
//!
//! [`gpu_reference`] repeats upstream's preparation (`NativeServer::build_internal`, two-mask mode) with upstream's
//! public functions: per output block of [`RING`] columns, the hint columns (`LiftContext::public_dot` of the public
//! query masks with the block's columns), then `NativePreprocessed::build_two_mask`. The compiled matrix is read from
//! upstream's own serialization (`prepared_native::write`), which stores it as signed 32-bit words when every centred
//! entry fits. For each request it also runs upstream's first pass (`PreparedU16Query::new` and `dot`, as
//! `NativeServer::respond` does on hosts without AVX-512) and the packing product (`NativePreprocessed::matrix_product`),
//! both before any rounding.

use crate::{Error, TableSetup, profile::*};
use ipir_native_client::{
    NativePublished,
    wire::{decode, up},
};
use rayon::prelude::*;
use reinspiring::{
    lift_ntt::LiftContext,
    native::{NativeKeys, NativePreprocessed},
    native_kernel::PreparedU16Query,
    prepared_native,
};

/// One output block of [`RING`] columns.
pub struct GpuBlock {
    /// The compiled packing matrix: [`RING`] rows × [`DIGITS`]·[`RING`] columns, row-major, each entry centred modulo
    /// q (in [−q/2, q/2)) as a signed 32-bit word. Row i gives answer coefficient i of the block; column j multiplies
    /// key word j of the request (limb 0's [`RING`] words, then limb 1's).
    pub matrix: Vec<i32>,
    /// The hint columns, if asked for: for each of the block's [`RING`] columns, its [`RING`] coefficients modulo q
    /// (column c of the block at `c * RING`).
    pub hints: Option<Vec<u64>>,
}

/// What [`gpu_reference`] gives.
pub struct GpuReference {
    pub setup_id: [u8; 32],
    /// The published masks, as `ServerTable::build` gives them for the same setup and cells.
    pub masks: Vec<u8>,
    /// The public query masks: `rows / RING` polynomials of [`RING`] coefficients, polynomial b at `b * RING`.
    pub query_masks: Vec<u64>,
    pub blocks: Vec<GpuBlock>,
    /// Upstream's first pass for each request: `count × cols` values modulo q, request-major.
    pub first_pass: Vec<u64>,
    /// Upstream's packing product (compiled matrix × key words, modulo q, before the first pass is added): `count ×
    /// cols` values, request-major.
    pub packing: Vec<u64>,
}

/// The header of upstream's serialization of one two-mask block: magic, count, then per block the setup id and the two
/// masks, then the matrix's word width and its words.
const MAP_MAGIC: &[u8; 8] = b"RNMAP002";

/// The compiled matrix of one prepared block, as signed 32-bit words, read from upstream's own serialization.
fn matrix_words(block: &NativePreprocessed) -> Result<Vec<i32>, Error> {
    let mut bytes = Vec::new();
    prepared_native::write(&mut bytes, std::slice::from_ref(block))
        .map_err(|e| Error::new(format!("serializing a packing block: {e}")))?;
    let header = MAP_MAGIC.len() + 8 + 32 + 2 * RING * 8;
    let count = DIGITS * RING * RING;
    if bytes.len() < header + 8 || &bytes[..8] != MAP_MAGIC {
        return Err(Error::new("upstream's packing serialization has an unexpected layout"));
    }
    let width = u64::from_le_bytes(bytes[header..header + 8].try_into().unwrap());
    if width != 4 {
        return Err(Error::new(format!(
            "a compiled packing matrix has entries wider than 32 bits ({width}-byte words): the GPU path takes 32-bit entries only"
        )));
    }
    let data = &bytes[header + 8..];
    if data.len() != count * 4 {
        return Err(Error::new("upstream's packing serialization has an unexpected length"));
    }
    Ok(data
        .chunks_exact(4)
        .map(|w| i32::from_le_bytes(w.try_into().unwrap()))
        .collect())
}

/// One request's words as upstream's server reads them: the key words, then the selection words lifted to the ring.
type RequestWords = (Vec<u64>, Vec<u64>);

/// Splits `count` requests laid end to end, checking each one's length and magic, and gives each one's key words and
/// selection words as upstream's server reads them.
fn parse_requests(setup: &TableSetup, requests: &[u8], count: usize) -> Result<Vec<RequestWords>, Error> {
    let each = setup.request_bytes();
    if count.checked_mul(each) != Some(requests.len()) {
        return Err(Error::new(format!(
            "{count} requests to this table are {} bytes, got {}",
            count.saturating_mul(each),
            requests.len()
        )));
    }
    let q = 1u64 << Q_BITS;
    let key_end = HEADER_BYTES + KEY_BYTES;
    requests
        .chunks_exact(each)
        .map(|request| {
            if &request[..4] != b"RNQ3" || request[4..36] != setup.id() {
                return Err(Error::new("a request is not for this table's setup"));
            }
            let keys = decode(&request[HEADER_BYTES..key_end], DIGITS * RING, Q_BITS)?;
            let query = up(&decode(&request[key_end..], setup.rows(), QUERY_BITS)?, q, QUERY_BITS);
            Ok((keys, query))
        })
        .collect()
}

/// Repeats upstream's preparation of `cells` (column-major, `cells[col * rows + row]`) for `setup`, and runs upstream's
/// first pass and packing product for each of `count` requests laid end to end. With `with_hints`, also returns every
/// block's hint columns. Holds one block's scratch at a time.
pub fn gpu_reference(
    setup: &TableSetup,
    cells: &[u16],
    requests: &[u8],
    count: usize,
    with_hints: bool,
) -> Result<GpuReference, Error> {
    let (rows, cols) = (setup.rows(), setup.cols());
    if cells.len() != rows * cols {
        return Err(Error::new(format!(
            "a {rows} × {cols} table has {} cells, got {}",
            rows * cols,
            cells.len()
        )));
    }
    let parsed = parse_requests(setup, requests, count)?;
    let native = &setup.native;
    let q = 1u64 << Q_BITS;
    let lift = LiftContext::new(RING, q)?;
    let public_polys = lift.prepare_public_dot(native.query_masks(), ((1u64 << P_BITS) - 1).min(q / 2))?;
    let keys = parsed
        .iter()
        .map(|(words, _)| NativeKeys::from_kg_words(native.packing_setup(), words))
        .collect::<Result<Vec<_>, _>>()?;

    let mut blocks = Vec::with_capacity(cols / RING);
    let mut masks = Vec::with_capacity(cols / RING);
    let mut other_masks = Vec::with_capacity(cols / RING);
    let mut packing = vec![0u64; count * cols];
    for block in 0..cols / RING {
        let hints = (block * RING..(block + 1) * RING)
            .into_par_iter()
            .map(|col| {
                let column: Vec<Vec<u64>> = cells[col * rows..(col + 1) * rows]
                    .chunks_exact(RING)
                    .map(|poly| poly.iter().map(|&x| u64::from(x)).collect())
                    .collect();
                lift.public_dot(&public_polys, &column)
            })
            .collect::<Result<Vec<_>, _>>()?;
        let prepared = NativePreprocessed::build_two_mask(native.packing_setup(), &hints)?;
        for (request, keys) in keys.iter().enumerate() {
            let product = prepared.matrix_product(keys)?;
            packing[request * cols + block * RING..request * cols + (block + 1) * RING].copy_from_slice(&product);
        }
        masks.push(prepared.mask().to_vec());
        other_masks.push(
            prepared
                .other_mask()
                .ok_or_else(|| Error::new("two-mask preparation gave no second mask"))?
                .to_vec(),
        );
        blocks.push(GpuBlock {
            matrix: matrix_words(&prepared)?,
            hints: with_hints.then(|| hints.into_iter().flatten().collect()),
        });
    }
    let published = NativePublished::from_masks(native, masks, Some(other_masks))?;

    let mut first_pass = vec![0u64; count * cols];
    for ((_, query), out) in parsed.iter().zip(first_pass.chunks_exact_mut(cols)) {
        let prepared = PreparedU16Query::new(query, q)?;
        out.par_iter_mut()
            .zip(cells.par_chunks_exact(rows))
            .for_each(|(out, column)| *out = prepared.dot(column));
    }

    Ok(GpuReference {
        setup_id: setup.id(),
        masks: published.to_bytes(),
        query_masks: native.query_masks().iter().flatten().copied().collect(),
        blocks,
        first_pass,
        packing,
    })
}
