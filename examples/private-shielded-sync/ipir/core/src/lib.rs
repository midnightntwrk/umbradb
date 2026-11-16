//! IPIR+SP for the private shielded sync example: the profile, the server table and the wallet's client.
//!
//! A thin layer over the vendored upstream crates (`../vendor/ORIGIN.md`). It fixes one profile, upstream's native
//! two-mask profile as deployed: ring size d = 2,048, modulus q = 2^54, 16-bit cells (p = 2^16), key digits base
//! 2^19 × 2, Gaussian secrets, two published masks rounded to 29 bits, query rounded to 49 bits (nearest), answer at
//! 22 bits per cell.
//!
//! A table is `rows × cols` 16-bit cells, both non-zero multiples of 2,048, at most 2^30 cells, held column-major:
//! cell (row, col) is `cells[col * rows + row]`. One request reads one whole row (`cols` cells). A cell of 2^16 or
//! more cannot be given: cells are `u16`.
//!
//! - [`TableSetup`]: the public setup both sides expand from (rows, cols, 32-byte seed, 32-byte snapshot digest).
//! - [`ServerTable`] (feature `server`): builds a table, publishes its masks, answers requests, and checks at build
//!   time that sampled rows decode ([`BuildReport`]).
//! - [`Client`]: the wallet; loads the masks, makes a request for a row with a fresh secret, decodes the answer.
//!
//! Byte lengths are functions of the shape only: [`profile::request_bytes`], [`profile::response_bytes`],
//! [`profile::masks_bytes`].

#![forbid(unsafe_code)]

use ipir_native_client::{
    NativeParams, NativePreparedPublished, NativeProfile, NativePublicSetup, NativePublished, NativeRequest,
    ReinspiringError, SecretDistribution,
};
use rand_chacha::ChaCha20Rng;
use std::fmt;

#[cfg(feature = "server")]
mod server;
#[cfg(feature = "server")]
pub use server::{BuildOptions, BuildReport, ServerTable, read_cells};

/// The profile's constants and the byte lengths they give.
pub mod profile {
    /// Ring size d; rows and columns are multiples of it.
    pub const RING: usize = 2048;
    /// log2 of the modulus q.
    pub const Q_BITS: usize = 54;
    /// log2 of the plaintext modulus p: one cell is 16 bits.
    pub const P_BITS: usize = 16;
    /// Bits per key digit (gadget base 2^19).
    pub const DIGIT_BITS: usize = 19;
    /// Key digits (gadget length).
    pub const DIGITS: usize = 2;
    /// Bits per published mask coefficient.
    pub const MASK_BITS: usize = 29;
    /// Bits per query coefficient (one per table row).
    pub const QUERY_BITS: usize = 49;
    /// Bits per answer coefficient (one per table column).
    pub const RESPONSE_BITS: usize = 22;
    /// Most cells one table may hold (16-bit storage).
    pub const MAX_CELLS: usize = 1 << 30;
    /// Most rows one table may have. With the query rounded to 49 bits (nearest), upstream's correctness certificate
    /// stays below 2^-128 only up to here: 2^-85 at 65,536 rows of 0xFFFF cells, 2^-83 at 131,072 rows of random
    /// cells, at most 2^-161 at 32,768 rows with every cell 0xFFFF (`docs/research/00058-ipir-sp-review.md`, F4).
    pub const MAX_ROWS: usize = 1 << 15;
    /// A cell decodes correctly while its phase error is below q / (2p) = 2^37.
    pub const PHASE_LIMIT_LOG2: u32 = (Q_BITS - P_BITS - 1) as u32;
    /// Bytes of the key in each request: `DIGITS × RING` coefficients of `Q_BITS` bits.
    pub const KEY_BYTES: usize = DIGITS * RING * Q_BITS / 8;
    /// Every request, answer and mask file starts with a 4-byte magic and the 32-byte setup identifier.
    pub const HEADER_BYTES: usize = 36;

    /// Bytes of one request to a table of `rows` rows: header, key, one query coefficient per row.
    pub const fn request_bytes(rows: usize) -> usize {
        HEADER_BYTES + KEY_BYTES + (QUERY_BITS * rows).div_ceil(8)
    }
    /// Bytes of one answer from a table of `cols` columns: header, SHA-256 of the request, one coefficient per column.
    pub const fn response_bytes(cols: usize) -> usize {
        HEADER_BYTES + 32 + (RESPONSE_BITS * cols).div_ceil(8)
    }
    /// Bytes of a table's published masks: header, two masks of one coefficient per column.
    pub const fn masks_bytes(cols: usize) -> usize {
        HEADER_BYTES + (2 * MASK_BITS * cols).div_ceil(8)
    }
}
use profile::*;

/// An error from this crate or from the upstream crates beneath it.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Error(String);

impl Error {
    pub(crate) fn new(message: impl Into<String>) -> Self {
        Self(message.into())
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl std::error::Error for Error {}

impl From<ReinspiringError> for Error {
    fn from(error: ReinspiringError) -> Self {
        Self(format!("IPIR+SP: {error}"))
    }
}

/// Checks a table shape: rows and columns non-zero multiples of [`profile::RING`], at most
/// [`profile::MAX_CELLS`] cells and at most [`profile::MAX_ROWS`] rows.
pub fn check_shape(rows: usize, cols: usize) -> Result<(), Error> {
    if rows == 0 || cols == 0 || !rows.is_multiple_of(RING) || !cols.is_multiple_of(RING) {
        return Err(Error::new(format!(
            "an IPIR+SP table's rows and columns must be non-zero multiples of {RING}, got {rows} × {cols}"
        )));
    }
    if rows.checked_mul(cols).is_none_or(|cells| cells > MAX_CELLS) {
        return Err(Error::new(format!(
            "an IPIR+SP table holds at most 2^30 cells, {rows} × {cols} is more"
        )));
    }
    if rows > MAX_ROWS {
        return Err(Error::new(format!(
            "an IPIR+SP table has at most {MAX_ROWS} rows (the decoding bound of 49-bit queries), got {rows}"
        )));
    }
    Ok(())
}

fn native_profile(rows: usize, cols: usize) -> Result<NativeProfile, Error> {
    check_shape(rows, cols)?;
    let packing = NativeParams::new(
        RING,
        Q_BITS as u32,
        P_BITS as u32,
        DIGIT_BITS as u32,
        DIGITS,
        SecretDistribution::Gaussian,
    )?;
    // Two-mask output first: it decides which transport widths the later setters accept.
    let profile = NativeProfile::new(packing, rows, cols)?
        .with_two_mask_output()?
        .with_published_mask_bits(MASK_BITS)?;
    if profile.query_bits() != QUERY_BITS || profile.response_bits() != RESPONSE_BITS || profile.is_dithered_query() {
        return Err(Error::new(
            "the upstream profile's transport widths differ from this crate's",
        ));
    }
    Ok(profile)
}

/// The public setup of one table: its shape, a 32-byte seed and a 32-byte snapshot digest. The server and every wallet
/// expand the same setup; its identifier is in every request, answer and mask file.
pub struct TableSetup {
    native: NativePublicSetup,
}

impl TableSetup {
    /// Expands the setup. Fails on a shape [`check_shape`] refuses.
    pub fn new(rows: usize, cols: usize, seed: [u8; 32], snapshot: [u8; 32]) -> Result<Self, Error> {
        Ok(Self {
            native: NativePublicSetup::new(native_profile(rows, cols)?, seed, snapshot),
        })
    }
    pub fn rows(&self) -> usize {
        self.native.profile().rows()
    }
    pub fn cols(&self) -> usize {
        self.native.profile().cols()
    }
    /// The setup identifier: SHA-256 over the profile, the shape, the seed and the snapshot digest.
    pub fn id(&self) -> [u8; 32] {
        self.native.id()
    }
    pub fn request_bytes(&self) -> usize {
        request_bytes(self.rows())
    }
    pub fn response_bytes(&self) -> usize {
        response_bytes(self.cols())
    }
    pub fn masks_bytes(&self) -> usize {
        masks_bytes(self.cols())
    }
}

/// The wallet's side of one table: the expanded setup and the table's masks, with their transforms cached.
pub struct Client {
    setup: TableSetup,
    prepared: NativePreparedPublished,
}

/// One request's private state: its secret and the bytes sent. Decodes the answer to exactly this request.
pub struct RequestState {
    request: NativeRequest,
}

impl RequestState {
    /// The request bytes to send ([`profile::request_bytes`] of the table's rows).
    pub fn bytes(&self) -> &[u8] {
        self.request.bytes()
    }
}

impl Client {
    /// Loads a table's published masks. Fails if they are not this setup's.
    pub fn new(setup: TableSetup, masks: &[u8]) -> Result<Self, Error> {
        if masks.len() != setup.masks_bytes() {
            return Err(Error::new(format!(
                "this table's masks are {} bytes, got {}",
                setup.masks_bytes(),
                masks.len()
            )));
        }
        let published = NativePublished::from_bytes(&setup.native, masks)?;
        let prepared = published.prepare(&setup.native)?;
        Ok(Self { setup, prepared })
    }

    pub fn setup(&self) -> &TableSetup {
        &self.setup
    }

    /// A request for `row` with a fresh secret and key from the platform's cryptographic source (`getrandom`; in the
    /// WebAssembly build, the host's `crypto.getRandomValues`).
    pub fn request(&self, row: usize) -> Result<RequestState, Error> {
        self.check_row(row)?;
        self.prepare(NativeRequest::generate(&self.setup.native, row)?)
    }

    /// A request whose secret comes from `rng`. For tests and the server's build check only: a wallet's secret must
    /// never be derived from anything another party can know.
    pub fn request_with_rng(&self, row: usize, rng: &mut ChaCha20Rng) -> Result<RequestState, Error> {
        self.check_row(row)?;
        self.prepare(NativeRequest::generate_with_rng(&self.setup.native, row, rng)?)
    }

    /// Decodes the answer to `state`'s request into the row's `cols` cells.
    pub fn decode(&self, state: &RequestState, response: &[u8]) -> Result<Vec<u16>, Error> {
        if response.len() != self.setup.response_bytes() {
            return Err(Error::new(format!(
                "an answer from this table is {} bytes, got {}",
                self.setup.response_bytes(),
                response.len()
            )));
        }
        state
            .request
            .decode_prepared(&self.prepared, response)?
            .into_iter()
            .map(|cell| u16::try_from(cell).map_err(|_| Error::new("a decoded cell is not 16 bits")))
            .collect()
    }

    fn check_row(&self, row: usize) -> Result<(), Error> {
        if row >= self.setup.rows() {
            return Err(Error::new(format!(
                "row {row} is outside a table of {} rows",
                self.setup.rows()
            )));
        }
        Ok(())
    }

    /// Caches the request's share of the decoding before it is sent, so that decoding the answer is quick.
    fn prepare(&self, mut request: NativeRequest) -> Result<RequestState, Error> {
        request.prepare_decode(&self.prepared)?;
        Ok(RequestState { request })
    }
}
