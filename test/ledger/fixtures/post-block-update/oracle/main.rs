// The node's end-of-block arithmetic at the pinned ledger revisions: the expected values of
// `test/ledger/post-block-update.test.ts` (UmbraDB task 12.1a, owner decision Q113 A, A151).
//
// Built natively against an unpatched checkout of `midnight-ledger` at the commit
// `vendor/ledger/<version>/upstream.json` pins (`run.sh`), with the storage layout the node uses
// (`layout-v2`, `gc-v1`). Nothing here comes from UmbraDB or from the vendored packages.
//
// - `clamp_and_normalize` and `compute_overall_fullness` are `midnight-node` 2.1.0-rc.4's
//   (`ledger/helpers/src/ledger_8/mod.rs` and `ledger_9/mod.rs`, identical in both), copied here
//   without their log line.
// - The post-block update is the node's `apply_post_block_update` (`ledger/src/ledger_8/
//   post_block_update.rs`, `ledger_9/post_block_update.rs`), which `pallet-midnight`'s
//   `on_finalize` runs: ledger v8's `post_block_update`, ledger v9's `apply_post_block_update`.
// - A system transaction's cost is the ledger's `SystemTransaction::cost` with the parameters of
//   the state before it applies, as the node's `Ledger::apply_system_tx` takes it.
// - The "round trip" is the published JavaScript API's path: `LedgerParameters.normalizeFullness`
//   gives each `FixedPoint` as a JavaScript number (`f64::from`), and `LedgerState.postBlockUpdate`
//   turns each number back with `FixedPoint::from(f64)`; it refuses a cost above the limits.
//
// Prints one JSON object for the version it was built for (feature `v9` or not).

use base_crypto::cost_model::{CostDuration, FixedPoint, NormalizedCost, SyntheticCost};
use base_crypto::time::Timestamp;
use mn_ledger::structure::{LedgerState, SystemTransaction};
use serialize::{Serializable, tagged_deserialize, tagged_serialize};
use storage::arena::Sp;
use storage::db::InMemoryDB;

type State = LedgerState<InMemoryDB>;

const NETWORK_ID: &str = "undeployed";
/// The fixture blocks' time, `T0` of `test/ledger/adapter-fixtures.ts`, in seconds.
const T0_SECS: u64 = 1_750_000_000;

#[cfg(not(feature = "v9"))]
const SYSTEM_TAG: &str = "midnight:system-transaction[v6]:";
#[cfg(feature = "v9")]
const SYSTEM_TAG: &str = "midnight:system-transaction[v9]:";

/// The stateless cost (`Transaction::cost(params, true)`) of the fixtures' deploy (`contractFixture`) and of their call
/// of `emit` logging one cell (`callTransaction`), as the vendored package's `Transaction.cost` gives them against a
/// blank state's parameters: the inputs of the cases of blocks the adapter test applies.
#[cfg(not(feature = "v9"))]
const DEPLOY: [u64; 5] = [1_785_000_000, 1_975_817_471, 2_635, 2_893, 6_144];
#[cfg(feature = "v9")]
const DEPLOY: [u64; 5] = [1_785_000_000, 1_975_817_471, 2_637, 2_895, 6_144];
const CALL: [u64; 5] = [2_805_000_000, 14_734_818_644, 5_126, 96, 72_256];

/// `midnight-node` `ledger/helpers/src/ledger_8/mod.rs` `compute_overall_fullness`.
fn compute_overall_fullness(normalized: &NormalizedCost) -> FixedPoint {
    FixedPoint::max(
        FixedPoint::max(
            FixedPoint::max(normalized.read_time, normalized.compute_time),
            normalized.block_usage,
        ),
        FixedPoint::max(normalized.bytes_written, normalized.bytes_churned),
    )
}

/// `midnight-node` `ledger/helpers/src/ledger_8/mod.rs` `clamp_and_normalize` (its log line left out).
fn clamp_and_normalize(cost: &SyntheticCost, limits: &SyntheticCost) -> NormalizedCost {
    let clamped = SyntheticCost {
        read_time: cost.read_time.min(limits.read_time),
        compute_time: cost.compute_time.min(limits.compute_time),
        block_usage: cost.block_usage.min(limits.block_usage),
        bytes_written: cost.bytes_written.min(limits.bytes_written),
        bytes_churned: cost.bytes_churned.min(limits.bytes_churned),
    };
    clamped
        .normalize(*limits)
        .expect("clamped cost should always normalize successfully")
}

/// The node's `apply_post_block_update` for this ledger version.
#[cfg(not(feature = "v9"))]
fn post_block_update(state: &State, tblock: Timestamp, detailed: NormalizedCost, overall: FixedPoint) -> State {
    state
        .post_block_update(tblock, detailed, overall)
        .expect("post_block_update failed despite clamped fullness")
}

#[cfg(feature = "v9")]
fn post_block_update(state: &State, tblock: Timestamp, detailed: NormalizedCost, overall: FixedPoint) -> State {
    state.apply_post_block_update(tblock, detailed, overall)
}

/// A `FixedPoint` as the integer `value × 2^64` it holds (its serialization: an `i128`, little-endian).
fn bits(value: FixedPoint) -> String {
    let mut bytes = Vec::new();
    Serializable::serialize(&value, &mut bytes).unwrap();
    i128::from_le_bytes(bytes.try_into().unwrap()).to_string()
}

fn hex_of(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn state_root(state: &State) -> String {
    let mut bytes = Vec::new();
    Serializable::serialize(&Sp::new(state.clone()).as_typed_key(), &mut bytes).unwrap();
    hex_of(&bytes)
}

fn parameters(state: &State) -> String {
    let mut bytes = Vec::new();
    tagged_serialize(&*state.parameters, &mut bytes).unwrap();
    hex_of(&bytes)
}

fn cost_json(cost: &SyntheticCost) -> String {
    format!(
        r#"{{ "readTime": "{}", "computeTime": "{}", "blockUsage": "{}", "bytesWritten": "{}", "bytesChurned": "{}" }}"#,
        cost.read_time.into_picoseconds(),
        cost.compute_time.into_picoseconds(),
        cost.block_usage,
        cost.bytes_written,
        cost.bytes_churned,
    )
}

fn fullness_json(normalized: &NormalizedCost, overall: FixedPoint) -> String {
    format!(
        r#"{{ "readTime": "{}", "computeTime": "{}", "blockUsage": "{}", "bytesWritten": "{}", "bytesChurned": "{}", "overall": "{}" }}"#,
        bits(normalized.read_time),
        bits(normalized.compute_time),
        bits(normalized.block_usage),
        bits(normalized.bytes_written),
        bits(normalized.bytes_churned),
        bits(overall),
    )
}

fn fee_prices_json(state: &State) -> String {
    let prices = &state.parameters.fee_prices;
    format!(
        r#"{{ "overallPrice": "{}", "readFactor": "{}", "computeFactor": "{}", "blockUsageFactor": "{}", "writeFactor": "{}" }}"#,
        bits(prices.overall_price),
        bits(prices.read_factor),
        bits(prices.compute_factor),
        bits(prices.block_usage_factor),
        bits(prices.write_factor),
    )
}

/// The state after `state`'s post-block update with `detailed` and `overall`, as JSON.
fn after_json(state: &State, normalized: &NormalizedCost, overall: FixedPoint) -> String {
    let after = post_block_update(state, Timestamp::from_secs(T0_SECS), *normalized, overall);
    format!(
        r#"{{ "fullness": {}, "feePrices": {}, "parameters": "{}", "stateRoot": "{}" }}"#,
        fullness_json(normalized, overall),
        fee_prices_json(&after),
        parameters(&after),
        state_root(&after),
    )
}

fn cost(read_ps: u64, compute_ps: u64, block_usage: u64, bytes_written: u64, bytes_churned: u64) -> SyntheticCost {
    SyntheticCost {
        read_time: CostDuration::from_picoseconds(read_ps),
        compute_time: CostDuration::from_picoseconds(compute_ps),
        block_usage,
        bytes_written,
        bytes_churned,
    }
}

fn of(values: [u64; 5]) -> SyntheticCost {
    cost(values[0], values[1], values[2], values[3], values[4])
}

/// The node's block of one system transaction: applied to `state` at `T0`, its cost added to the fullness, then the
/// post-block update; as JSON.
fn system_transaction_json(name: &str, bytes: &[u8], state: &State) -> String {
    let transaction: SystemTransaction = tagged_deserialize(bytes).expect("a system transaction");
    let system_cost = transaction.cost(&state.parameters);
    let (applied, _) = state
        .apply_system_tx(&transaction, Timestamp::from_secs(T0_SECS))
        .expect("the system transaction applies to a blank state");
    let limits = applied.parameters.limits.block_limits;
    let fullness = clamp_and_normalize(&(system_cost + SyntheticCost::ZERO), &limits);
    format!(
        r#"    {{ "name": "{name}", "bytes": "{}", "cost": {}, "block": {} }}"#,
        hex_of(bytes),
        cost_json(&system_cost),
        after_json(&applied, &fullness, compute_overall_fullness(&fullness)),
    )
}

fn main() {
    let blank = State::new(NETWORK_ID);
    let limits = blank.parameters.limits.block_limits;
    let max = u64::MAX;

    // `DistributeReserve(1000000000000000)`, `systemTransaction(ledger)` of the fixtures, and an
    // `OverwriteParameters` with a blank state's own parameters.
    let mut reserve = SYSTEM_TAG.as_bytes().to_vec();
    reserve.extend_from_slice(&[0x05, 0x0f, 0x00, 0x80, 0xc6, 0xa4, 0x7e, 0x8d, 0x03]);
    let mut overwrite = Vec::new();
    tagged_serialize(&SystemTransaction::OverwriteParameters((*blank.parameters).clone()), &mut overwrite).unwrap();
    let reserve_cost = tagged_deserialize::<SystemTransaction>(&reserve[..]).unwrap().cost(&blank.parameters);

    let deploys = (0..20).fold(SyntheticCost::ZERO, |sum, _| sum + of(DEPLOY));
    let cases: Vec<(&str, SyntheticCost)> = vec![
        ("an empty block", cost(0, 0, 0, 0, 0)),
        ("a deploy's block usage: 2,635 of 200,000", cost(0, 0, 2_635, 0, 0)),
        ("one picosecond of read time", cost(1, 0, 0, 0, 0)),
        ("every dimension, no value a round fraction", cost(123_456_789, 987_654_321, 2_635, 777, 33_333)),
        ("half of every limit", cost(500_000_000_000, 500_000_000_000, 100_000, 25_000, 500_000)),
        ("exactly the limits", cost(1_000_000_000_000, 1_000_000_000_000, 200_000, 50_000, 1_000_000)),
        ("above the limits in four dimensions", cost(2_000_000_000_000, 999_999_999_999, 250_000, 60_000, 1_000_001)),
        ("the largest sum, every dimension saturated", cost(max, max, max, max, max)),
        ("a block of one deploy", of(DEPLOY)),
        ("a block of a deploy and a call", of(DEPLOY) + of(CALL)),
        ("a block of twenty deploys, above the bytes-written limit", deploys),
        // Below 1 % of a limit the fee price update is flat (`price_adjustment_function`'s first two points are equal),
        // so a system transaction's small cost shows where the block's other costs are above it: the call's compute
        // time and bytes churned.
        ("a block of the system transaction, a deploy and a call", reserve_cost + of(DEPLOY) + of(CALL)),
    ];

    let mut entries = Vec::new();
    for (name, cost) in &cases {
        let normalized = clamp_and_normalize(cost, &limits);
        let overall = compute_overall_fullness(&normalized);
        let exact = after_json(&blank, &normalized, overall);
        let round_trip = match cost.normalize(limits) {
            None => "null".to_string(),
            Some(published) => {
                let back = |value: FixedPoint| FixedPoint::from(f64::from(value));
                let numbers = NormalizedCost {
                    read_time: back(published.read_time),
                    compute_time: back(published.compute_time),
                    block_usage: back(published.block_usage),
                    bytes_written: back(published.bytes_written),
                    bytes_churned: back(published.bytes_churned),
                };
                after_json(&blank, &numbers, back(compute_overall_fullness(&published)))
            }
        };
        entries.push(format!(
            r#"    {{ "name": "{name}", "cost": {}, "exact": {exact}, "roundTrip": {round_trip} }}"#,
            cost_json(cost),
        ));
    }

    let systems = [
        system_transaction_json("DistributeReserve(1000000000000000)", &reserve, &blank),
        system_transaction_json("OverwriteParameters(the blank state's parameters)", &overwrite, &blank),
    ];

    println!("{{");
    println!(r#"  "blankStateRoot": "{}","#, state_root(&blank));
    println!(r#"  "blankParameters": "{}","#, parameters(&blank));
    println!(r#"  "limits": {},"#, cost_json(&limits));
    println!(r#"  "cases": ["#);
    println!("{}", entries.join(",\n"));
    println!("  ],");
    println!(r#"  "systemTransactions": ["#);
    println!("{}", systems.join(",\n"));
    println!("  ]");
    println!("}}");
}
