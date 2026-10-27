import { readFileSync } from "node:fs";
import type { StateSummary } from "../../src/ledger/types.js";
import { hex, type Ledger } from "./adapter-fixtures.js";

// Task 12.1b of `openspec/changes/core-arch` (A158; LG-16; owner decision Q138 A): the clause the state-trees test
// (`state-trees.test.ts`) runs against the real packages and adapters and its committed negative control
// (`state-trees.negative-control.test.ts`) against a wrong one. The oracle is `fixtures/state-trees/expected.json`:
// LG-16's six tree values of fixed states, read from the ledger's Rust state as the official indexer reads them, by
// `fixtures/state-trees/oracle/main.rs` built against an unpatched `midnight-ledger` checkout at each vendored version's
// pinned commit — nothing of the vendored packages or of UmbraDB.

/** A fixed state and its six values as the oracle wrote them (first free indexes decimal, roots hex). */
export interface OracleState {
  readonly name: string;
  /** The state's tagged serialization, relative to `test/ledger/fixtures/`. */
  readonly file: string;
  readonly sha256: string;
  readonly zswapFirstFree: string;
  readonly zswapRoot: string;
  readonly dustCommitmentFirstFree: string;
  readonly dustCommitmentRoot: string;
  readonly dustGenerationFirstFree: string;
  readonly dustGenerationRoot: string;
  /** For a state taken from a chain past its genesis: the block it is after, and the node's root after it. */
  readonly node?: { readonly network: string; readonly height: number; readonly hash: string; readonly stateRoot: string };
}

export interface OracleVersion {
  readonly release: string;
  readonly commit: string;
  readonly states: readonly OracleState[];
}

const FIXTURES = new URL("./fixtures/", import.meta.url);

/** The oracle's values, per vendored version. */
export const TREES_ORACLE: Readonly<Record<Ledger, OracleVersion>> = (
  JSON.parse(readFileSync(new URL("state-trees/expected.json", FIXTURES), "utf8")) as {
    versions: Record<Ledger, OracleVersion>;
  }
).versions;

/** A fixed state's tagged serialization. */
export const stateBytes = (state: OracleState): Uint8Array => Uint8Array.from(readFileSync(new URL(state.file, FIXTURES)));

const FIELDS = [
  "zswapFirstFree",
  "zswapRoot",
  "dustCommitmentFirstFree",
  "dustCommitmentRoot",
  "dustGenerationFirstFree",
  "dustGenerationRoot",
] as const;

/** A summary's field as the oracle writes it: an index as decimal text, a root as hex; null and other types as such. */
function written(value: unknown): string {
  if (typeof value === "bigint") return `${value}`;
  if (value instanceof Uint8Array) return hex(value);
  return `not an index or a root: ${String(value)}`;
}

/**
 * A158: for each of `ledger`'s fixed states, the six values `summaryOf` gives — from the state's tagged serialization
 * — are the oracle's exactly: each first free index a `bigint` and each root a `Uint8Array`, none null. A line per value
 * that differs.
 */
export function stateTreesProblems(ledger: Ledger, summaryOf: (bytes: Uint8Array) => StateSummary): string[] {
  const problems: string[] = [];
  for (const state of TREES_ORACLE[ledger].states) {
    const summary = summaryOf(stateBytes(state)) as unknown as Record<string, unknown>;
    for (const field of FIELDS) {
      const found = written(summary[field]);
      if (found !== state[field]) problems.push(`${ledger}, ${state.name}: ${field} is ${found}, the ledger's ${state[field]}`);
    }
  }
  return problems;
}
