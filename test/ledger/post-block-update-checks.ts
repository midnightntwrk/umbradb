import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, vi } from "vitest";
import type { SyntheticCost } from "../../src/ledger/adapter.js";
import type { ApplyInput, LedgerPackage } from "../../src/ledger/types.js";
import {
  block,
  callTransaction,
  cellValue,
  contractFixture,
  fromHex,
  GLOBAL_TTL_MS,
  type ContractFixture,
  hex,
  type Ledger,
  logProgram,
  markersOf,
  NETWORK_ID,
  RAW,
  type RawPackage,
  referenceReplay,
  systemTransaction,
  T0,
} from "./adapter-fixtures.js";

// Checks of the node's end-of-block update. The expected values are the node's arithmetic, computed in Rust at the
// pinned ledger revisions by `fixtures/post-block-update/oracle/` (its `main.rs` and `run.sh`) and recorded in
// `fixtures/post-block-update/expected.json`, never by the packages or the adapters under test.
// [A151, LG-8, LG-15, Q113 A]
//
// The committed negative controls (`post-block-update.negative-control.test.ts`) run these checks against a wrong path
// or a wrong adapter, and `post-block-update.test.ts` runs them against the real ones; each fails with an assertion
// error. [A151]

type Decimal = string;

export interface OracleCost {
  readTime: Decimal;
  computeTime: Decimal;
  blockUsage: Decimal;
  bytesWritten: Decimal;
  bytesChurned: Decimal;
}

/** A block's fullness, each value a `FixedPoint` as the integer `value × 2^64` it holds. */
export interface OracleFullness extends OracleCost {
  overall: Decimal;
}

/** The state after a post-block update of a blank state at `T0`. */
export interface OracleAfter {
  fullness: OracleFullness;
  feePrices: Record<"overallPrice" | "readFactor" | "computeFactor" | "blockUsageFactor" | "writeFactor", Decimal>;
  /** The fee prices as they serialize inside the parameters: five `FixedPoint`s, each an `i128` little-endian. */
  feePricesBytes: string;
  /** The SHA-256 of the parameters' tagged serialization after the update. */
  parametersSha256: string;
  stateRoot: string;
}

export interface OracleCase {
  name: string;
  /** The block's summed cost. */
  cost: OracleCost;
  /** The node's update. */
  exact: OracleAfter;
  /** The published API's update through JavaScript numbers; null where it refuses (a cost above the limits). */
  roundTrip: OracleAfter | null;
}

export interface OracleSystemTransaction {
  name: string;
  bytes: string;
  cost: OracleCost;
  /** A block of this one system transaction on a blank state, at `T0`. */
  block: OracleAfter;
}

export interface OracleVersion {
  release: string;
  commit: string;
  blankStateRoot: string;
  blankParametersSha256: string;
  limits: OracleCost;
  cases: OracleCase[];
  systemTransactions: OracleSystemTransaction[];
}

export const ORACLE: Readonly<Record<Ledger, OracleVersion>> = (
  JSON.parse(readFileSync(new URL("./fixtures/post-block-update/expected.json", import.meta.url), "utf8")) as {
    versions: Record<Ledger, OracleVersion>;
  }
).versions;

export const costOf = (cost: OracleCost): SyntheticCost => ({
  readTime: BigInt(cost.readTime),
  computeTime: BigInt(cost.computeTime),
  blockUsage: BigInt(cost.blockUsage),
  bytesWritten: BigInt(cost.bytesWritten),
  bytesChurned: BigInt(cost.bytesChurned),
});

export type Fullness = Record<keyof OracleFullness, bigint>;

export const fullnessOf = (fullness: OracleFullness): Fullness => ({
  readTime: BigInt(fullness.readTime),
  computeTime: BigInt(fullness.computeTime),
  blockUsage: BigInt(fullness.blockUsage),
  bytesWritten: BigInt(fullness.bytesWritten),
  bytesChurned: BigInt(fullness.bytesChurned),
  overall: BigInt(fullness.overall),
});

/** The oracle's case of that name (throws when there is none, so a renamed case fails loudly). */
export function oracleCase(ledger: Ledger, name: string): OracleCase {
  const found = ORACLE[ledger].cases.find((entry) => entry.name === name);
  if (found === undefined) throw new Error(`the oracle has no case "${name}" for ${ledger}`);
  return found;
}

export const sha256Hex = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");

/** The fixture block time, as the packages take it. */
export const T0_DATE = new Date(T0);

/**
 * What `FixedPoint::from(f64)` gives back for a number (`(float * 2^64) as i128`, which truncates): the round trip of
 * the published API, whose `normalizeFullness` hands each `FixedPoint` to JavaScript as a number.
 */
export const roundTripBits = (value: number): bigint => BigInt(Math.trunc(value * 2 ** 64));

/** The published API's fullness for `cost` against a blank state's limits, as `FixedPoint`s after the round trip. */
export function publishedFullness(raw: RawPackage, cost: SyntheticCost): Fullness {
  const blank = raw.LedgerState.blank(NETWORK_ID);
  const normalized = blank.parameters.normalizeFullness(cost);
  const dimensions = [
    normalized.readTime,
    normalized.computeTime,
    normalized.blockUsage,
    normalized.bytesWritten,
    normalized.bytesChurned,
  ];
  return {
    readTime: roundTripBits(normalized.readTime),
    computeTime: roundTripBits(normalized.computeTime),
    blockUsage: roundTripBits(normalized.blockUsage),
    bytesWritten: roundTripBits(normalized.bytesWritten),
    bytesChurned: roundTripBits(normalized.bytesChurned),
    overall: roundTripBits(Math.max(...dimensions)),
  };
}

/** The published API's post-block update of a blank state for a block that cost `cost`: the round trip. */
export function publishedUpdate(raw: RawPackage, cost: SyntheticCost): ReturnType<RawPackage["LedgerState"]["blank"]> {
  const blank = raw.LedgerState.blank(NETWORK_ID);
  const normalized = blank.parameters.normalizeFullness(cost);
  const overall = Math.max(
    normalized.readTime,
    normalized.computeTime,
    normalized.blockUsage,
    normalized.bytesWritten,
    normalized.bytesChurned,
  );
  return blank.postBlockUpdate(T0_DATE, normalized, overall);
}

/** A block's fullness is the node's `FixedPoint` fullness. [A151] */
export function expectNodeFullness(found: Fullness, expected: OracleCase, ledger: Ledger): void {
  expect(found, `${ledger}, ${expected.name}: the FixedPoint fullness`).toEqual(fullnessOf(expected.exact.fullness));
}

/** Parameters after a block (serialized) have the node's fee prices, and are the node's parameters. [A151] */
export function expectNodeParameters(parameters: Uint8Array, expected: OracleAfter, what: string): void {
  expect(hex(parameters), `${what}: the fee prices after the block`).toContain(expected.feePricesBytes);
  expect(sha256Hex(parameters), `${what}: the parameters after the block`).toBe(expected.parametersSha256);
}

/** A state after a block's post-block update has the node's parameters (its fee prices) and state root. [A151] */
export function expectNodeState(
  raw: RawPackage,
  state: ReturnType<RawPackage["LedgerState"]["blank"]>,
  expected: OracleAfter,
  what: string,
): void {
  expectNodeParameters(state.parameters.serialize(), expected, what);
  expect(hex(raw.stateRoot(state)), `${what}: the state root after the block`).toBe(expected.stateRoot);
}

/** The cost of a transaction as the node counts it in a block (stateless, `Transaction::cost(params, true)`). */
function costOfTransaction(ledger: Ledger, bytes: Uint8Array): SyntheticCost {
  const raw = RAW[ledger];
  const blank = raw.LedgerState.blank(NETWORK_ID);
  return raw.Transaction.deserialize(...markersOf(bytes), bytes).cost(blank.parameters, true);
}

const sameCost = (a: SyntheticCost, b: SyntheticCost): boolean =>
  (Object.keys(a) as (keyof SyntheticCost)[]).every((key) => a[key] === b[key]);

/**
 * A fixture that `make` gives, drawn until its transaction costs what the oracle's block cases take as their input: a
 * fixture's random parts make its size, and so its block usage, vary by a byte or two (a deploy is 2,702 bytes nine
 * times in ten, and 2,701 or 2,700 otherwise, in v8). Throws if 100 draws give none.
 */
export async function fixtureCosting<T>(
  ledger: Ledger,
  expected: SyntheticCost,
  make: () => Promise<T>,
  bytesOf: (fixture: T) => Uint8Array,
): Promise<T> {
  for (let attempt = 0; attempt < 100; attempt++) {
    const fixture = await make();
    if (sameCost(costOfTransaction(ledger, bytesOf(fixture)), expected)) return fixture;
  }
  throw new Error(`${ledger}: no fixture transaction in 100 costs ${JSON.stringify(expected, (_, v) => String(v))}`);
}

/** The fixtures' deploy of the oracle's deploy cost. */
export function deployOfOracleCost(ledger: Ledger): Promise<ContractFixture> {
  const expected = costOf(oracleCase(ledger, "a block of one deploy").cost);
  return fixtureCosting(ledger, expected, () => contractFixture(RAW[ledger]), (fixture) => fixture.deploy);
}

/** The fixtures' deploy and call, whose costs the oracle's block cases take as their input. */
async function fixtureTransactions(ledger: Ledger): Promise<{ deploy: Uint8Array; call: Uint8Array }> {
  const raw = RAW[ledger];
  const contract = await deployOfOracleCost(ledger);
  const single = costOf(oracleCase(ledger, "a block of one deploy").cost);
  const pair = costOf(oracleCase(ledger, "a block of a deploy and a call").cost);
  const callCost = Object.fromEntries(
    Object.entries(pair).map(([key, value]) => [key, value - single[key as keyof SyntheticCost]]),
  ) as unknown as SyntheticCost;
  const call = await fixtureCosting(
    ledger,
    callCost,
    async () => callTransaction(raw, contract, logProgram([cellValue(Uint8Array.of(1))])),
    (bytes) => bytes,
  );
  return { deploy: contract.deploy, call };
}

/** The parameters after a block of `input` on a blank state are the node's for the oracle's case `name`. */
function expectBlockParameters(adapter: LedgerPackage, ledger: Ledger, name: string, input: ApplyInput): void {
  const { output } = adapter.apply(adapter.emptyState(), input);
  expect(
    output.results.every((result) => result.outcome === "success"),
    `${ledger}, ${name}: every transaction applied`,
  ).toBe(true);
  expectNodeParameters(output.parameters, oracleCase(ledger, name).exact, `${ledger}, ${name}`);
}

/**
 * Through the adapter, the parameters after a block of the fixtures' transactions are the node's: the fee prices the
 * node's post-block update gives for its fullness. The blocks are a deploy (block usage 2,635 of 200,000 in v8); a
 * deploy and a call; and twenty deploys, whose bytes written exceed the block limit (clamped, not refused). [A151]
 */
export async function expectAdapterUpdates(adapter: LedgerPackage, ledger: Ledger): Promise<void> {
  const { deploy, call } = await fixtureTransactions(ledger);
  const deploys: Uint8Array[] = [];
  while (deploys.length < 20) deploys.push((await deployOfOracleCost(ledger)).deploy);
  expectBlockParameters(adapter, ledger, "a block of one deploy", block([deploy]));
  expectBlockParameters(adapter, ledger, "a block of a deploy and a call", block([deploy, call]));
  expectBlockParameters(adapter, ledger, "a block of twenty deploys, above the bytes-written limit", block(deploys));
}

/**
 * The adapter adds each system transaction's cost to the block's fullness. A block of one system transaction on a
 * blank state has the node's state root and parameters. The fixtures' system transaction, a deploy and a call give the
 * node's fee prices, which differ from those of the deploy and the call alone. (Below 1 % of a limit the fee price
 * update is flat, so the system transaction's small cost shows where the call's costs are above it.) [A151]
 */
export async function expectSystemTransactionCosts(adapter: LedgerPackage, ledger: Ledger): Promise<void> {
  for (const system of ORACLE[ledger].systemTransactions) {
    const { state, output } = adapter.apply(adapter.emptyState(), block([fromHex(system.bytes)]));
    expect(output.results, system.name).toEqual([{ outcome: "success", segments: [] }]);
    expectNodeParameters(output.parameters, system.block, `${ledger}, ${system.name}`);
    expect(hex(adapter.stateRoot(state)), `${ledger}, ${system.name}: the state root after its block`).toBe(
      system.block.stateRoot,
    );
  }
  const name = "a block of the system transaction, a deploy and a call";
  expect(oracleCase(ledger, name).exact.feePricesBytes, "the system transaction's cost changes the fee prices").not.toBe(
    oracleCase(ledger, "a block of a deploy and a call").exact.feePricesBytes,
  );
  const { deploy, call } = await fixtureTransactions(ledger);
  expectBlockParameters(adapter, ledger, name, block([systemTransaction(ledger), deploy, call]));
}

/**
 * An extrinsic the chain reports failed is skipped, as the official indexer skips it: the ledger is not asked, its
 * result is a failure of every segment, its cost does not count, and it is not taken as the block's first regular
 * transaction (the one the parent-time rule looks for). The reference replay with the same outcomes agrees.
 * [A151, LG-8]
 */
export async function expectChainFailureSkipped(adapter: LedgerPackage, ledger: Ledger): Promise<void> {
  const raw = RAW[ledger];
  const [failed, applied] = [await contractFixture(raw), await deployOfOracleCost(ledger)];
  const input = block([failed.deploy, applied.deploy], { outcomes: ["failure", "success"] });
  const wellFormed = vi.spyOn(raw.Transaction.prototype, "wellFormed");
  let output: ReturnType<LedgerPackage["apply"]>["output"];
  let root: string;
  try {
    const result = adapter.apply(adapter.emptyState(), input);
    output = result.output;
    root = hex(adapter.stateRoot(result.state));
    expect(wellFormed, `${ledger}: the ledger is asked about the applied transaction only`).toHaveBeenCalledTimes(1);
  } finally {
    wellFormed.mockRestore();
  }
  expect(output.results, `${ledger}: the failed extrinsic is a failure of every segment`).toEqual([
    { outcome: "failure", segments: [0, 1].map((segment) => ({ segment, success: false })) },
    { outcome: "success", segments: [0, 1].map((segment) => ({ segment, success: true })) },
  ]);
  expect(output.events.map((event) => event.transaction), `${ledger}: only the applied one has events`).toEqual([1]);
  expectNodeParameters(output.parameters, oracleCase(ledger, "a block of one deploy").exact, `${ledger}: only the applied deploy's cost counts`);
  const alone = adapter.apply(adapter.emptyState(), block([applied.deploy])).state;
  expect(root, `${ledger}: the state is as if the failed extrinsic were not in the block`).toBe(
    hex(adapter.stateRoot(alone)),
  );
  const reference = referenceReplay(raw, raw.LedgerState.blank(NETWORK_ID), input);
  expect(reference.types).toEqual(["chain-failure", "success"]);
  expect(root, `${ledger}: the reference replay's root`).toBe(hex(raw.stateRoot(reference.state)));

  // Not the first regular transaction to apply: a skewed first one after it is still checked at the parent's time.
  const far = (await contractFixture(raw, T0 + GLOBAL_TTL_MS + 3_000)).deploy;
  const skewed = block([failed.deploy, far], { outcomes: ["failure", "success"], firstRegularAtParentTime: true });
  const times = vi.spyOn(raw.Transaction.prototype, "wellFormed");
  try {
    adapter.apply(adapter.emptyState(), skewed);
    const checked = times.mock.calls.map((call) => (call[2] as Date).getTime() - T0);
    expect(checked, `${ledger}: the far deploy, first after the failed one, is checked at both times`).toEqual([
      0, 6_000,
    ]);
  } finally {
    times.mockRestore();
  }
}
