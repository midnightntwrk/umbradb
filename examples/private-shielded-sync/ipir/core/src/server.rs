//! The server table: build, masks, answers, and the decoding check at build time.

use crate::{Error, TableSetup, check_shape, profile::*};
use ipir_native_client::{NativePublished, NativeRequest};
use ipir_sp::native::NativeServer;
use rand_chacha::{ChaCha20Rng, rand_core::SeedableRng};
use sha2::{Digest, Sha256};
use std::collections::BTreeSet;
use std::io::Read;
use std::path::Path;
use std::time::{Duration, Instant};

/// How a table is built.
#[derive(Clone, Debug)]
pub struct BuildOptions {
    /// Output blocks of 2,048 columns prepared at once. Each in-flight block needs about 250–300 MB of scratch; one
    /// at a time gives the lowest peak and costs little time (upstream's measurement and ours agree).
    pub concurrent_blocks: usize,
    /// Rows read back through a real request, answer and decode before the table is accepted (at least 1).
    pub check_rows: usize,
}

impl Default for BuildOptions {
    fn default() -> Self {
        Self {
            concurrent_blocks: 1,
            check_rows: 3,
        }
    }
}

/// What a build measured.
#[derive(Clone, Debug, PartialEq)]
pub struct BuildReport {
    pub rows: usize,
    pub cols: usize,
    /// Hints (table × public query masks), summed over output blocks (block-seconds).
    pub hints: Duration,
    /// Packing preparation (trace of the masks, matrix compilation), summed over output blocks.
    pub packing: Duration,
    /// Re-tiling the table for the host's scan (zero where the host keeps the column-major layout).
    pub layout: Duration,
    /// Upstream's whole preparation, wall time.
    pub prepare: Duration,
    /// Serializing the published masks.
    pub publish: Duration,
    /// The decoding check of the sampled rows.
    pub check: Duration,
    /// The whole build, wall time.
    pub total: Duration,
    /// Bytes the table's cells take in memory.
    pub table_bytes: usize,
    /// Bytes of the compiled packing matrices kept in memory.
    pub packing_bytes: usize,
    /// Bytes of the published masks.
    pub masks_bytes: usize,
    /// The rows read back, in increasing order: the first, the last, and rows drawn from the setup identifier.
    pub checked_rows: Vec<usize>,
    /// The largest phase error over every cell of the checked rows; decoding is correct below 2^37.
    pub max_phase_error: u64,
}

impl BuildReport {
    /// log2 of [`BuildReport::max_phase_error`] (0 for an error of 0 or 1).
    pub fn max_phase_error_log2(&self) -> f64 {
        (self.max_phase_error.max(1) as f64).log2()
    }
}

/// A built table: the cells, the compiled packing, and the public setup. Immutable; answers from any thread.
pub struct ServerTable {
    server: NativeServer,
}

impl ServerTable {
    /// Builds a table from column-major cells (`cells[col * rows + row]`) and returns it with its published masks and
    /// a report. Before returning, it reads back `options.check_rows` rows through a real request, answer and decode
    /// (with request secrets derived from the setup identifier, so the report is reproducible) and fails if any cell
    /// does not decode or its phase error reaches 2^37.
    pub fn build(
        setup: TableSetup,
        cells: Vec<u16>,
        options: &BuildOptions,
    ) -> Result<(Self, Vec<u8>, BuildReport), Error> {
        let start = Instant::now();
        let (rows, cols) = (setup.rows(), setup.cols());
        if cells.len() != rows * cols {
            return Err(Error::new(format!(
                "a {rows} × {cols} table has {} cells, got {}",
                rows * cols,
                cells.len()
            )));
        }
        if options.concurrent_blocks == 0 {
            return Err(Error::new("at least one output block must be prepared at a time"));
        }
        if options.check_rows == 0 {
            return Err(Error::new(
                "at least one row must be read back before a table is accepted",
            ));
        }
        let checked_rows = check_rows(&setup.id(), rows, options.check_rows);
        let expected: Vec<Vec<u64>> = checked_rows
            .iter()
            .map(|&row| (0..cols).map(|col| u64::from(cells[col * rows + row])).collect())
            .collect();

        let server = NativeServer::build_with_concurrency(setup.native, cells, options.concurrent_blocks)?;
        let offline = server.offline_timing();
        let t = Instant::now();
        let masks = server.published().to_bytes();
        let publish = t.elapsed();
        if masks.len() != masks_bytes(cols) {
            return Err(Error::new(format!(
                "the published masks are {} bytes, the profile says {}",
                masks.len(),
                masks_bytes(cols)
            )));
        }
        let table = Self { server };

        let t = Instant::now();
        let max_phase_error = table.check(&masks, &checked_rows, &expected)?;
        let check = t.elapsed();

        let report = BuildReport {
            rows,
            cols,
            hints: offline.hints,
            packing: offline.packing,
            layout: offline.layout,
            prepare: offline.total,
            publish,
            check,
            total: start.elapsed(),
            table_bytes: table.server.database_bytes(),
            packing_bytes: table.server.coefficient_bytes(),
            masks_bytes: masks.len(),
            checked_rows,
            max_phase_error,
        };
        Ok((table, masks, report))
    }

    pub fn rows(&self) -> usize {
        self.server.setup().profile().rows()
    }
    pub fn cols(&self) -> usize {
        self.server.setup().profile().cols()
    }
    /// The setup identifier.
    pub fn id(&self) -> [u8; 32] {
        self.server.setup().id()
    }
    /// Bytes the table's cells take in memory.
    pub fn table_bytes(&self) -> usize {
        self.server.database_bytes()
    }
    /// Bytes of the compiled packing matrices kept in memory.
    pub fn packing_bytes(&self) -> usize {
        self.server.coefficient_bytes()
    }

    /// Answers one request. A request of the wrong length is refused before any work.
    pub fn respond(&self, request: &[u8]) -> Result<Vec<u8>, Error> {
        let want = request_bytes(self.rows());
        if request.len() != want {
            return Err(Error::new(format!(
                "a request to this table is {want} bytes, got {}",
                request.len()
            )));
        }
        Ok(self.server.respond(request)?.0)
    }

    /// Answers `count` requests laid end to end; the answers are laid end to end in the same order. Every length is
    /// checked before any work.
    pub fn respond_batch(&self, requests: &[u8], count: usize) -> Result<Vec<u8>, Error> {
        let each = request_bytes(self.rows());
        if count == 0 {
            return Err(Error::new("a batch holds at least one request"));
        }
        if count.checked_mul(each) != Some(requests.len()) {
            return Err(Error::new(format!(
                "{count} requests to this table are {} bytes, got {}",
                count.saturating_mul(each),
                requests.len()
            )));
        }
        let mut out = Vec::with_capacity(count * response_bytes(self.cols()));
        for request in requests.chunks_exact(each) {
            out.extend(self.respond(request)?);
        }
        Ok(out)
    }

    /// Reads `rows` back through the wallet's own path (masks parsed from their bytes, cached decode) and through
    /// upstream's uncached decode, which also measures the phase error against the known cells. Returns the largest
    /// phase error.
    fn check(&self, masks: &[u8], rows: &[usize], expected: &[Vec<u64>]) -> Result<u64, Error> {
        let setup = self.server.setup();
        let published = NativePublished::from_bytes(setup, masks)?;
        let prepared = published.prepare(setup)?;
        let mut largest = 0;
        for (&row, want) in rows.iter().zip(expected) {
            let mut rng = ChaCha20Rng::from_seed(check_secret_seed(&setup.id(), row));
            let mut request = NativeRequest::generate_with_rng(setup, row, &mut rng)?;
            request.prepare_decode(&prepared)?;
            let response = self.respond(request.bytes())?;
            let cached = request.decode_prepared(&prepared, &response)?;
            let (plain, error) = request.decode_with_error(&published, &response, want)?;
            if cached != *want || plain != *want || error >= 1 << PHASE_LIMIT_LOG2 {
                return Err(Error::new(format!(
                    "row {row} of the table does not decode: largest phase error 2^{:.2}, limit 2^{PHASE_LIMIT_LOG2}",
                    (error.max(1) as f64).log2()
                )));
            }
            largest = largest.max(error);
        }
        Ok(largest)
    }
}

/// The rows a build reads back: the first, the last, then rows drawn from the setup identifier until `count`.
fn check_rows(id: &[u8; 32], rows: usize, count: usize) -> Vec<usize> {
    let count = count.min(rows);
    let mut chosen = BTreeSet::from([0]);
    if count > 1 {
        chosen.insert(rows - 1);
    }
    let mut i = 0u64;
    while chosen.len() < count {
        let h = Sha256::new()
            .chain_update(b"pss-ipir/check-row/v1")
            .chain_update(id)
            .chain_update(i.to_le_bytes())
            .finalize();
        chosen.insert((u64::from_le_bytes(h[..8].try_into().unwrap()) % rows as u64) as usize);
        i += 1;
    }
    chosen.into_iter().collect()
}

/// The secret seed of the build check's request for `row`. Public by construction: such a request is never sent.
fn check_secret_seed(id: &[u8; 32], row: usize) -> [u8; 32] {
    Sha256::new()
        .chain_update(b"pss-ipir/check-secret/v1")
        .chain_update(id)
        .chain_update((row as u64).to_le_bytes())
        .finalize()
        .into()
}

/// Reads a table's cells from a raw file of `rows × cols` little-endian 16-bit cells in column-major order, straight
/// into the vector the build takes (no second copy).
pub fn read_cells(path: &Path, rows: usize, cols: usize) -> Result<Vec<u16>, Error> {
    check_shape(rows, cols)?;
    let io = |e: std::io::Error| Error::new(format!("{}: {e}", path.display()));
    let mut file = std::fs::File::open(path).map_err(io)?;
    let want = (rows * cols * 2) as u64;
    let got = file.metadata().map_err(io)?.len();
    if got != want {
        return Err(Error::new(format!(
            "{}: a {rows} × {cols} table is {want} bytes of cells, the file is {got}",
            path.display()
        )));
    }
    let mut cells = vec![0u16; rows * cols];
    file.read_exact(bytemuck::cast_slice_mut(&mut cells)).map_err(io)?;
    if cfg!(target_endian = "big") {
        cells.iter_mut().for_each(|cell| *cell = u16::from_le(*cell));
    }
    Ok(cells)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn check_rows_are_first_last_then_drawn() {
        let id = [7u8; 32];
        assert_eq!(check_rows(&id, 2048, 1), vec![0]);
        assert_eq!(check_rows(&id, 2048, 2), vec![0, 2047]);
        let rows = check_rows(&id, 2048, 5);
        assert_eq!(rows.len(), 5);
        assert_eq!((rows[0], rows[4]), (0, 2047));
        assert_eq!(rows, check_rows(&id, 2048, 5));
        assert_ne!(rows, check_rows(&[8u8; 32], 2048, 5));
        assert_eq!(check_rows(&id, 2048, 9000).len(), 2048);
    }

    #[test]
    fn the_check_fails_a_row_that_does_not_decode_to_its_cells() {
        let (rows, cols) = (2048, 2048);
        let cells: Vec<u16> = (0..rows * cols).map(|i| (i * 31 % 65_521) as u16).collect();
        let setup = TableSetup::new(rows, cols, [1; 32], [2; 32]).unwrap();
        let (table, masks, _) = ServerTable::build(setup, cells.clone(), &BuildOptions::default()).unwrap();
        let row = 9;
        let mut want: Vec<u64> = (0..cols).map(|col| u64::from(cells[col * rows + row])).collect();
        assert!(table.check(&masks, &[row], std::slice::from_ref(&want)).unwrap() < 1 << PHASE_LIMIT_LOG2);
        want[100] ^= 1;
        let error = table.check(&masks, &[row], &[want]).unwrap_err();
        assert!(
            error.to_string().contains("row 9 of the table does not decode"),
            "{error}"
        );
    }
}
