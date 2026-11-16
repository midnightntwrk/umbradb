//! The native add-on for Node (N-API): builds IPIR+SP server tables and answers requests, both on libuv's thread
//! pool, never on the main thread. The typed wrapper is `../native.ts`; `../build.sh native` builds this crate and
//! copies the library to `../pss-ipir.node`.
//!
//! Tables live in a registry keyed by an integer handle; `release` removes one (an answer in flight keeps its table
//! alive until it finishes). Every heavy call catches a panic and rejects its promise instead of aborting Node.

use napi::bindgen_prelude::*;
use napi_derive::napi;
use pss_ipir_core::{BuildOptions, ServerTable, TableSetup, check_shape, profile, read_cells};
use std::collections::BTreeMap;
use std::panic::{AssertUnwindSafe, catch_unwind};
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

static TABLES: Mutex<BTreeMap<u32, Arc<ServerTable>>> = Mutex::new(BTreeMap::new());
static NEXT_HANDLE: AtomicU32 = AtomicU32::new(1);

fn tables() -> std::sync::MutexGuard<'static, BTreeMap<u32, Arc<ServerTable>>> {
    TABLES.lock().unwrap_or_else(|poisoned| poisoned.into_inner())
}

fn reason(message: impl std::fmt::Display) -> Error {
    Error::from_reason(message.to_string())
}

/// Runs `body`, turning a panic into an error so that it rejects a promise instead of aborting the process.
fn guarded<T>(what: &str, body: impl FnOnce() -> std::result::Result<T, pss_ipir_core::Error>) -> Result<T> {
    match catch_unwind(AssertUnwindSafe(body)) {
        Ok(result) => result.map_err(reason),
        Err(_) => Err(reason(format!("IPIR+SP {what} panicked"))),
    }
}

fn ms(duration: Duration) -> f64 {
    duration.as_secs_f64() * 1e3
}

fn bytes32(value: &[u8], what: &str) -> Result<[u8; 32]> {
    value
        .try_into()
        .map_err(|_| reason(format!("{what} must be 32 bytes, got {}", value.len())))
}

/// The profile the add-on was built with; `native.ts` compares it with its own constants on load.
#[napi(object)]
pub struct Profile {
    pub ring: u32,
    pub q_bits: u32,
    pub p_bits: u32,
    pub digit_bits: u32,
    pub digits: u32,
    pub mask_bits: u32,
    pub query_bits: u32,
    pub response_bits: u32,
    pub key_bytes: u32,
    pub max_cells: f64,
    pub max_rows: u32,
    pub phase_limit_log2: u32,
}

#[napi]
pub fn profile() -> Profile {
    Profile {
        ring: profile::RING as u32,
        q_bits: profile::Q_BITS as u32,
        p_bits: profile::P_BITS as u32,
        digit_bits: profile::DIGIT_BITS as u32,
        digits: profile::DIGITS as u32,
        mask_bits: profile::MASK_BITS as u32,
        query_bits: profile::QUERY_BITS as u32,
        response_bits: profile::RESPONSE_BITS as u32,
        key_bytes: profile::KEY_BYTES as u32,
        max_cells: profile::MAX_CELLS as f64,
        max_rows: profile::MAX_ROWS as u32,
        phase_limit_log2: profile::PHASE_LIMIT_LOG2,
    }
}

#[napi(object)]
pub struct Sizes {
    pub request_bytes: u32,
    pub response_bytes: u32,
    pub masks_bytes: u32,
}

/// Byte lengths for a table shape, as the Rust side computes them. Throws on a shape the profile refuses.
#[napi]
pub fn sizes(rows: u32, cols: u32) -> Result<Sizes> {
    check_shape(rows as usize, cols as usize).map_err(reason)?;
    Ok(Sizes {
        request_bytes: profile::request_bytes(rows as usize) as u32,
        response_bytes: profile::response_bytes(cols as usize) as u32,
        masks_bytes: profile::masks_bytes(cols as usize) as u32,
    })
}

#[napi(object, js_name = "BuildOptions")]
pub struct JsBuildOptions {
    /// Output blocks of 2,048 columns prepared at once (default 1).
    pub concurrent_blocks: Option<u32>,
    /// Rows read back before the table is accepted (default 3, at least 1).
    pub check_rows: Option<u32>,
}

#[napi(object)]
pub struct BuildReport {
    pub rows: u32,
    pub cols: u32,
    /// Expanding the public setup.
    pub setup_ms: f64,
    /// Reading the cells (copying them from JavaScript, or reading the cell file).
    pub read_ms: f64,
    /// Hints, summed over output blocks.
    pub hints_ms: f64,
    /// Packing preparation, summed over output blocks.
    pub packing_ms: f64,
    pub layout_ms: f64,
    /// Upstream's whole preparation, wall time.
    pub prepare_ms: f64,
    pub publish_ms: f64,
    /// The decoding check of the sampled rows.
    pub check_ms: f64,
    /// From the call to the table being ready, wall time.
    pub total_ms: f64,
    pub table_bytes: f64,
    pub packing_bytes: f64,
    pub masks_bytes: u32,
    pub checked_rows: Vec<u32>,
    /// The largest phase error over the checked rows' cells.
    pub max_phase_error: f64,
    pub max_phase_error_log2: f64,
    /// Decoding is correct while the phase error is below 2 to this power.
    pub phase_limit_log2: u32,
}

#[napi(object)]
pub struct BuiltTable {
    pub handle: u32,
    pub masks: Buffer,
    pub report: BuildReport,
}

enum Cells {
    Memory(Vec<u16>),
    File(String),
}

pub struct BuildTask {
    start: Instant,
    copy: Duration,
    cells: Option<Cells>,
    rows: usize,
    cols: usize,
    seed: [u8; 32],
    snapshot: [u8; 32],
    options: BuildOptions,
}

impl BuildTask {
    fn new(
        start: Instant,
        cells: Cells,
        rows: u32,
        cols: u32,
        seed: &[u8],
        snapshot: &[u8],
        options: Option<JsBuildOptions>,
    ) -> Result<AsyncTask<Self>> {
        let defaults = BuildOptions::default();
        let options = options.map_or(defaults.clone(), |o| BuildOptions {
            concurrent_blocks: o.concurrent_blocks.map_or(defaults.concurrent_blocks, |n| n as usize),
            check_rows: o.check_rows.map_or(defaults.check_rows, |n| n as usize),
        });
        Ok(AsyncTask::new(Self {
            start,
            copy: start.elapsed(),
            cells: Some(cells),
            rows: rows as usize,
            cols: cols as usize,
            seed: bytes32(seed, "the seed")?,
            snapshot: bytes32(snapshot, "the snapshot digest")?,
            options,
        }))
    }
}

impl Task for BuildTask {
    type Output = (ServerTable, Vec<u8>, BuildReport);
    type JsValue = BuiltTable;

    fn compute(&mut self) -> Result<Self::Output> {
        let cells = self
            .cells
            .take()
            .ok_or_else(|| reason("an IPIR+SP build task ran twice"))?;
        guarded("build", || {
            let t = Instant::now();
            let setup = TableSetup::new(self.rows, self.cols, self.seed, self.snapshot)?;
            let setup_time = t.elapsed();
            let t = Instant::now();
            let cells = match cells {
                Cells::Memory(cells) => cells,
                Cells::File(path) => read_cells(path.as_ref(), self.rows, self.cols)?,
            };
            let read = self.copy + t.elapsed();
            let (table, masks, r) = ServerTable::build(setup, cells, &self.options)?;
            let report = BuildReport {
                rows: r.rows as u32,
                cols: r.cols as u32,
                setup_ms: ms(setup_time),
                read_ms: ms(read),
                hints_ms: ms(r.hints),
                packing_ms: ms(r.packing),
                layout_ms: ms(r.layout),
                prepare_ms: ms(r.prepare),
                publish_ms: ms(r.publish),
                check_ms: ms(r.check),
                total_ms: ms(self.start.elapsed()),
                table_bytes: r.table_bytes as f64,
                packing_bytes: r.packing_bytes as f64,
                masks_bytes: r.masks_bytes as u32,
                checked_rows: r.checked_rows.iter().map(|&row| row as u32).collect(),
                max_phase_error: r.max_phase_error as f64,
                max_phase_error_log2: r.max_phase_error_log2(),
                phase_limit_log2: profile::PHASE_LIMIT_LOG2,
            };
            Ok((table, masks, report))
        })
    }

    fn resolve(&mut self, _env: Env, (table, masks, report): Self::Output) -> Result<BuiltTable> {
        let handle = NEXT_HANDLE.fetch_add(1, Ordering::Relaxed);
        tables().insert(handle, Arc::new(table));
        Ok(BuiltTable {
            handle,
            masks: masks.into(),
            report,
        })
    }
}

/// Builds a table from column-major cells held in JavaScript (copied once, on the main thread).
#[napi(ts_return_type = "Promise<BuiltTable>")]
pub fn build_table_from_cells(
    cells: Uint16Array,
    rows: u32,
    cols: u32,
    seed: Uint8Array,
    snapshot: Uint8Array,
    options: Option<JsBuildOptions>,
) -> Result<AsyncTask<BuildTask>> {
    let start = Instant::now();
    if cells.len() != rows as usize * cols as usize {
        return Err(reason(format!(
            "a {rows} × {cols} table has {} cells, got {}",
            rows as u64 * cols as u64,
            cells.len()
        )));
    }
    BuildTask::new(
        start,
        Cells::Memory(cells.to_vec()),
        rows,
        cols,
        &seed,
        &snapshot,
        options,
    )
}

/// Builds a table from a raw file of little-endian 16-bit cells in column-major order, read on the worker thread.
#[napi(ts_return_type = "Promise<BuiltTable>")]
pub fn build_table_from_file(
    path: String,
    rows: u32,
    cols: u32,
    seed: Uint8Array,
    snapshot: Uint8Array,
    options: Option<JsBuildOptions>,
) -> Result<AsyncTask<BuildTask>> {
    BuildTask::new(Instant::now(), Cells::File(path), rows, cols, &seed, &snapshot, options)
}

pub struct RespondTask {
    table: Arc<ServerTable>,
    requests: Vec<u8>,
    count: usize,
}

impl Task for RespondTask {
    type Output = Vec<u8>;
    type JsValue = Buffer;

    fn compute(&mut self) -> Result<Vec<u8>> {
        guarded("answer", || self.table.respond_batch(&self.requests, self.count))
    }

    fn resolve(&mut self, _env: Env, answers: Vec<u8>) -> Result<Buffer> {
        Ok(answers.into())
    }
}

/// Answers `count` requests laid end to end; resolves to the answers laid end to end in the same order.
#[napi(ts_return_type = "Promise<Buffer>")]
pub fn respond(handle: u32, requests: Uint8Array, count: u32) -> Result<AsyncTask<RespondTask>> {
    let table = tables().get(&handle).cloned().ok_or_else(|| {
        reason(format!(
            "no IPIR+SP table has handle {handle} (released or never built)"
        ))
    })?;
    Ok(AsyncTask::new(RespondTask {
        table,
        requests: requests.to_vec(),
        count: count as usize,
    }))
}

/// Upstream's own timing of one answer's stages (`ipir_sp::native::NativeTiming`), in milliseconds.
#[napi(object)]
pub struct AnswerStages {
    /// Parsing the request and lifting its words.
    pub deserialize_ms: f64,
    /// The first pass over the table.
    pub matrix_vector_ms: f64,
    /// The packing of every output block.
    pub packing_ms: f64,
    /// Rounding and encoding the answer.
    pub serialization_ms: f64,
}

#[napi(object)]
pub struct TimedAnswers {
    /// The answers laid end to end, as `respond` gives them.
    pub answers: Buffer,
    /// Each request's stages, in order.
    pub stages: Vec<AnswerStages>,
}

pub struct RespondTimedTask {
    table: Arc<ServerTable>,
    requests: Vec<u8>,
    count: usize,
}

impl Task for RespondTimedTask {
    type Output = (Vec<u8>, Vec<AnswerStages>);
    type JsValue = TimedAnswers;

    fn compute(&mut self) -> Result<Self::Output> {
        let each = profile::request_bytes(self.table.rows());
        if self.count == 0 || self.count.checked_mul(each) != Some(self.requests.len()) {
            return Err(reason(format!(
                "{} requests to this table are {} bytes, got {}",
                self.count,
                self.count.saturating_mul(each),
                self.requests.len()
            )));
        }
        guarded("answer", || {
            let mut answers = Vec::new();
            let mut stages = Vec::with_capacity(self.count);
            for request in self.requests.chunks_exact(each) {
                let (answer, t) = self.table.respond_timed(request)?;
                answers.extend(answer);
                stages.push(AnswerStages {
                    deserialize_ms: ms(t.deserialize),
                    matrix_vector_ms: ms(t.matrix_vector),
                    packing_ms: ms(t.packing),
                    serialization_ms: ms(t.serialization),
                });
            }
            Ok((answers, stages))
        })
    }

    fn resolve(&mut self, _env: Env, (answers, stages): Self::Output) -> Result<TimedAnswers> {
        Ok(TimedAnswers {
            answers: answers.into(),
            stages,
        })
    }
}

/// As `respond`, with upstream's own timing of each answer's stages. Requests are answered one after another.
#[napi(ts_return_type = "Promise<TimedAnswers>")]
pub fn respond_timed(handle: u32, requests: Uint8Array, count: u32) -> Result<AsyncTask<RespondTimedTask>> {
    let table = tables().get(&handle).cloned().ok_or_else(|| {
        reason(format!(
            "no IPIR+SP table has handle {handle} (released or never built)"
        ))
    })?;
    Ok(AsyncTask::new(RespondTimedTask {
        table,
        requests: requests.to_vec(),
        count: count as usize,
    }))
}

/// Removes a table from the registry; its memory is freed once no answer is in flight. False if there was none.
#[napi]
pub fn release(handle: u32) -> bool {
    tables().remove(&handle).is_some()
}

/// What a held table is, so that a thread given only its handle (the server, from the build's worker) can check it.
#[napi(object)]
pub struct TableInfo {
    pub rows: u32,
    pub cols: u32,
    /// The setup identifier, which every request, answer and mask file of the table carries.
    pub setup_id: Buffer,
    /// Bytes of the cells and of the compiled packing matrices in memory.
    pub table_bytes: f64,
    pub packing_bytes: f64,
}

/// The table under `handle`, or null when there is none (released, or never built).
#[napi]
pub fn table_info(handle: u32) -> Option<TableInfo> {
    tables().get(&handle).map(|table| TableInfo {
        rows: table.rows() as u32,
        cols: table.cols() as u32,
        setup_id: table.id().to_vec().into(),
        table_bytes: table.table_bytes() as f64,
        packing_bytes: table.packing_bytes() as f64,
    })
}

/// Tables held in the registry.
#[napi]
pub fn table_count() -> u32 {
    tables().len() as u32
}

/// One output block of 2,048 columns, for a GPU responder (`../../gpu/ipir.ts`). Public values only.
#[napi(object)]
pub struct GpuBlock {
    /// The compiled packing matrix: 2,048 rows × 4,096 columns, row-major, signed 32-bit little-endian words.
    pub matrix: Buffer,
    /// The hint columns, if asked for: 2,048 columns × 2,048 coefficients (column-major), 64-bit little-endian.
    pub hints: Option<Buffer>,
}

/// What `gpuReference` gives (`pss_ipir_core::GpuReference`). Every value is public.
#[napi(object)]
pub struct GpuReference {
    pub setup_id: Buffer,
    /// The published masks; equal to `buildTableFrom…`'s for the same setup and cells.
    pub masks: Buffer,
    /// The public query masks: rows coefficients, 64-bit little-endian.
    pub query_masks: Buffer,
    pub blocks: Vec<GpuBlock>,
    /// Upstream's first pass of each request: count × cols values modulo 2^54, 64-bit little-endian.
    pub first_pass: Buffer,
    /// Upstream's packing product of each request (before the first pass is added): count × cols values, 64-bit
    /// little-endian.
    pub packing: Buffer,
}

fn le_bytes<T: Copy>(values: &[T], to: impl Fn(T) -> Vec<u8>) -> Vec<u8> {
    values.iter().flat_map(|&x| to(x)).collect()
}

pub struct GpuReferenceTask {
    path: String,
    rows: usize,
    cols: usize,
    seed: [u8; 32],
    snapshot: [u8; 32],
    requests: Vec<u8>,
    count: usize,
    with_hints: bool,
}

type GpuReferenceBytes = (
    Vec<u8>,
    Vec<u8>,
    Vec<u8>,
    Vec<(Vec<u8>, Option<Vec<u8>>)>,
    Vec<u8>,
    Vec<u8>,
);

impl Task for GpuReferenceTask {
    type Output = GpuReferenceBytes;
    type JsValue = GpuReference;

    fn compute(&mut self) -> Result<Self::Output> {
        guarded("GPU reference", || {
            let setup = TableSetup::new(self.rows, self.cols, self.seed, self.snapshot)?;
            let cells = read_cells(self.path.as_ref(), self.rows, self.cols)?;
            let r = pss_ipir_core::gpu_reference(&setup, &cells, &self.requests, self.count, self.with_hints)?;
            let u64s = |v: &[u64]| le_bytes(v, |x: u64| x.to_le_bytes().to_vec());
            Ok((
                r.setup_id.to_vec(),
                r.masks,
                u64s(&r.query_masks),
                r.blocks
                    .iter()
                    .map(|b| {
                        (
                            le_bytes(&b.matrix, |x: i32| x.to_le_bytes().to_vec()),
                            b.hints.as_deref().map(u64s),
                        )
                    })
                    .collect(),
                u64s(&r.first_pass),
                u64s(&r.packing),
            ))
        })
    }

    fn resolve(&mut self, _env: Env, out: Self::Output) -> Result<GpuReference> {
        let (setup_id, masks, query_masks, blocks, first_pass, packing) = out;
        Ok(GpuReference {
            setup_id: setup_id.into(),
            masks: masks.into(),
            query_masks: query_masks.into(),
            blocks: blocks
                .into_iter()
                .map(|(matrix, hints)| GpuBlock {
                    matrix: matrix.into(),
                    hints: hints.map(Buffer::from),
                })
                .collect(),
            first_pass: first_pass.into(),
            packing: packing.into(),
        })
    }
}

/// For checking a GPU responder: repeats upstream's preparation of the table in the cell file (column-major 16-bit
/// little-endian cells, as `buildTableFromFile` reads) and returns its public values (compiled packing matrices, hint
/// columns with `withHints`, query masks, published masks) and, for `count` requests laid end to end, upstream's
/// unrounded first pass and packing product. Runs on libuv's pool. Public values only; no table is registered.
#[napi(ts_return_type = "Promise<GpuReference>")]
#[allow(clippy::too_many_arguments)]
pub fn gpu_reference(
    path: String,
    rows: u32,
    cols: u32,
    seed: Uint8Array,
    snapshot: Uint8Array,
    requests: Uint8Array,
    count: u32,
    with_hints: bool,
) -> Result<AsyncTask<GpuReferenceTask>> {
    Ok(AsyncTask::new(GpuReferenceTask {
        path,
        rows: rows as usize,
        cols: cols as usize,
        seed: bytes32(&seed, "the seed")?,
        snapshot: bytes32(&snapshot, "the snapshot digest")?,
        requests: requests.to_vec(),
        count: count as usize,
        with_hints,
    }))
}
