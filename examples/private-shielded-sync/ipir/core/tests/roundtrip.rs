//! Round trips through the server table and the wallet's client, at the shapes the example uses.

use pss_ipir_core::{BuildOptions, BuildReport, Client, ServerTable, TableSetup, check_shape, profile::*, read_cells};
use rand_chacha::{
    ChaCha20Rng,
    rand_core::{RngCore, SeedableRng},
};

const SEED: [u8; 32] = [11; 32];
const SNAPSHOT: [u8; 32] = [12; 32];

fn random_cells(rows: usize, cols: usize, seed: u64) -> Vec<u16> {
    let mut rng = ChaCha20Rng::seed_from_u64(seed);
    (0..rows * cols).map(|_| rng.next_u32() as u16).collect()
}

fn row_of(cells: &[u16], rows: usize, cols: usize, row: usize) -> Vec<u16> {
    (0..cols).map(|col| cells[col * rows + row]).collect()
}

fn build(rows: usize, cols: usize, cells: Vec<u16>) -> (ServerTable, Vec<u8>, BuildReport) {
    let setup = TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap();
    ServerTable::build(setup, cells, &BuildOptions::default()).unwrap()
}

/// Builds a table, sends three requests in one batch and checks each decodes to its row, and that every length is
/// the profile's.
fn round_trip(rows: usize, cols: usize) {
    let cells = random_cells(rows, cols, 0x2417);
    let (table, masks, report) = build(rows, cols, cells.clone());

    assert_eq!(masks.len(), masks_bytes(cols));
    assert_eq!(masks.len(), 36 + 58 * cols / 8);
    assert_eq!(report.masks_bytes, masks.len());
    assert_eq!(report.table_bytes, 2 * rows * cols);
    assert_eq!((report.rows, report.cols), (rows, cols));
    assert_eq!(report.checked_rows.len(), 3);
    assert_eq!(report.checked_rows[0], 0);
    assert_eq!(report.checked_rows[2], rows - 1);
    assert!(report.max_phase_error > 0 && report.max_phase_error < 1 << PHASE_LIMIT_LOG2);
    eprintln!(
        "{rows} × {cols}: build {:?} (hints {:?}, packing {:?}, check {:?}), packing {} bytes, phase error 2^{:.2}",
        report.total,
        report.hints,
        report.packing,
        report.check,
        report.packing_bytes,
        report.max_phase_error_log2()
    );

    let client = Client::new(TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap(), &masks).unwrap();
    assert_eq!(client.setup().id(), table.id());
    let wanted = [5, rows / 2 + 1, rows - 1];
    let states: Vec<_> = wanted.iter().map(|&row| client.request(row).unwrap()).collect();
    let mut batch = Vec::new();
    for state in &states {
        assert_eq!(state.bytes().len(), request_bytes(rows));
        assert_eq!(state.bytes().len(), 36 + 27_648 + 49 * rows / 8);
        batch.extend_from_slice(state.bytes());
    }
    let answers = table.respond_batch(&batch, wanted.len()).unwrap();
    assert_eq!(answers.len(), wanted.len() * response_bytes(cols));
    assert_eq!(response_bytes(cols), 68 + 22 * cols / 8);
    for (i, (&row, state)) in wanted.iter().zip(&states).enumerate() {
        let answer = &answers[i * response_bytes(cols)..(i + 1) * response_bytes(cols)];
        assert_eq!(
            client.decode(state, answer).unwrap(),
            row_of(&cells, rows, cols, row),
            "row {row}"
        );
    }
}

#[test]
fn round_trip_2048_x_2048() {
    round_trip(2048, 2048);
}

#[test]
fn round_trip_4096_x_6144() {
    round_trip(4096, 6144);
}

#[test]
fn the_extreme_cell_values_decode() {
    let (rows, cols) = (2048, 2048);
    for value in [0u16, u16::MAX] {
        let (table, masks, report) = build(rows, cols, vec![value; rows * cols]);
        assert!(report.max_phase_error < 1 << PHASE_LIMIT_LOG2);
        let client = Client::new(TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap(), &masks).unwrap();
        let state = client.request(777).unwrap();
        let answer = table.respond(state.bytes()).unwrap();
        assert_eq!(client.decode(&state, &answer).unwrap(), vec![value; cols]);
    }
}

#[test]
fn the_masks_and_the_report_are_the_same_for_the_same_input() {
    let (rows, cols) = (2048, 2048);
    let cells = random_cells(rows, cols, 99);
    let (first, masks_a, report_a) = build(rows, cols, cells.clone());
    let (_, masks_b, report_b) = build(rows, cols, cells.clone());
    assert_eq!(masks_a, masks_b);
    assert_eq!(report_a.checked_rows, report_b.checked_rows);
    assert_eq!(report_a.max_phase_error, report_b.max_phase_error);

    // Another snapshot digest: another setup, other masks, and the first table's masks are refused.
    let other = TableSetup::new(rows, cols, SEED, [13; 32]).unwrap();
    assert_ne!(other.id(), first.id());
    let (_, masks_c, _) = ServerTable::build(other, cells, &BuildOptions::default()).unwrap();
    assert_ne!(masks_a, masks_c);
    let refused = Client::new(TableSetup::new(rows, cols, SEED, [13; 32]).unwrap(), &masks_a);
    assert!(refused.is_err());
}

#[test]
fn wrong_lengths_are_refused() {
    let (rows, cols) = (2048, 2048);
    let cells = random_cells(rows, cols, 3);
    let (table, masks, _) = build(rows, cols, cells);
    let client = Client::new(TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap(), &masks).unwrap();
    let state = client.request(1).unwrap();
    let request = state.bytes();

    let short = table.respond(&request[..request.len() - 1]).unwrap_err();
    assert!(
        short
            .to_string()
            .contains(&format!("is {} bytes, got {}", request.len(), request.len() - 1))
    );
    let mut long = request.to_vec();
    long.push(0);
    assert!(table.respond(&long).is_err());
    assert!(table.respond_batch(request, 2).is_err());
    assert!(table.respond_batch(&[], 0).is_err());
    let mut doubled = request.to_vec();
    doubled.extend_from_slice(request);
    assert!(table.respond_batch(&doubled[..doubled.len() - 1], 2).is_err());

    // A request whose header names another setup is refused by upstream's parser.
    let mut foreign = request.to_vec();
    foreign[10] ^= 1;
    assert!(table.respond(&foreign).is_err());

    let answer = table.respond(request).unwrap();
    assert!(client.decode(&state, &answer[..answer.len() - 1]).is_err());
    // An answer to another request does not decode under this one.
    let other = client.request(1).unwrap();
    assert!(client.decode(&other, &answer).is_err());
    assert!(Client::new(TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap(), &masks[1..]).is_err());
    assert!(client.request(rows).is_err());
}

#[test]
fn each_request_has_a_fresh_secret() {
    let (rows, cols) = (2048, 2048);
    let (_, masks, _) = build(rows, cols, random_cells(rows, cols, 4));
    let client = Client::new(TableSetup::new(rows, cols, SEED, SNAPSHOT).unwrap(), &masks).unwrap();
    let a = client.request(42).unwrap();
    let b = client.request(42).unwrap();
    assert_eq!(a.bytes()[..36], b.bytes()[..36]);
    assert_ne!(a.bytes()[36..], b.bytes()[36..]);
}

#[test]
fn shapes_and_cell_counts_are_checked() {
    for (rows, cols) in [(0, 2048), (2048, 0), (2048, 1000), (3000, 2048), (1 << 16, 1 << 15)] {
        assert!(check_shape(rows, cols).is_err(), "{rows} × {cols}");
        assert!(TableSetup::new(rows, cols, SEED, SNAPSHOT).is_err(), "{rows} × {cols}");
    }
    assert!(check_shape(1 << 15, 1 << 15).is_ok());
    assert!(check_shape(2048, 2048).is_ok());

    let setup = TableSetup::new(2048, 2048, SEED, SNAPSHOT).unwrap();
    assert!(ServerTable::build(setup, vec![0; 2048 * 2048 - 1], &BuildOptions::default()).is_err());
    let setup = TableSetup::new(2048, 2048, SEED, SNAPSHOT).unwrap();
    let none = BuildOptions {
        check_rows: 0,
        ..BuildOptions::default()
    };
    assert!(ServerTable::build(setup, vec![0; 2048 * 2048], &none).is_err());
}

#[test]
fn cells_are_read_from_a_little_endian_file() {
    let (rows, cols) = (2048, 2048);
    let cells = random_cells(rows, cols, 5);
    let dir = std::path::Path::new(env!("CARGO_TARGET_TMPDIR"));
    let path = dir.join("pss-ipir-cells.bin");
    let bytes: Vec<u8> = cells.iter().flat_map(|cell| cell.to_le_bytes()).collect();
    std::fs::write(&path, &bytes).unwrap();
    assert_eq!(read_cells(&path, rows, cols).unwrap(), cells);
    assert!(read_cells(&path, rows, 2 * cols).is_err());
    std::fs::write(&path, &bytes[1..]).unwrap();
    assert!(read_cells(&path, rows, cols).is_err());
    std::fs::remove_file(&path).unwrap();
    assert!(read_cells(&path, rows, cols).is_err());
}
