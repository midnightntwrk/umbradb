/**
 * The built-in ledger version tables (`openspec/changes/core-arch/specs/ledger/spec.md` LG-3; A95; CORE-ARCH §4.8;
 * task 12.2): `./networks.json`, a versioned data file of this build (part of the UmbraDB version, §4.13), one entry
 * per known network, keyed by its genesis hash.
 *
 * **The format** (`umbradb-ledger-networks`, version 1), checked by {@link networksFileProblems} — every problem at
 * once, each with its path — when this module loads, so a build with a broken file cannot start:
 *
 * - `networks[]`, each `{ network, genesis, rows, boundaries }`, a network at most once, one of {@link KNOWN_NETWORKS}
 *   (`custom` has no built-in table: its configuration sets its own);
 * - `genesis`: `{ hash, specVersion, source }` — the hash of block 0 and the `spec_version` of the runtime at genesis
 *   (null until read), as read from the network's node — or null while nothing was read; two networks never share a
 *   genesis hash; a network with boundaries has its genesis;
 * - `rows`: LG-1's rows, at least one, each `spec_version` a `u32`, the bounds the smaller first, the ledger one this
 *   build carries, in ascending order without overlap;
 * - `boundaries`: each runtime upgrade read from the node — `u` the block that enacts it, `f` = U + 1 the first block
 *   of the new runtime, each `{ height, hash, specVersion }` with its `MNSV` version, and the `source` — in ascending
 *   order (a boundary's U at or above the one before's F; at its height, its hash), U and F of distinct hashes and
 *   versions, each version covered by a row, the runtimes chaining from the runtime at genesis (when read) through
 *   every boundary;
 * - a `source` is `{ node, read, record }`: the node it was read from, the day (`YYYY-MM-DD`) and the file in this
 *   repository holding the node's answers (`test/ledger/networks.test.ts` checks that it holds the hashes).
 *
 * A network's table is its rows and one pin per boundary, at F: a pin names a first block, and a boundary not read
 * from a node is not listed, so it is no pin (LG-3, A95). {@link ledgerTableOf} gives the table in effect for a `core`
 * entry: its configured `ledgerTable` over its network's built-in table (`./version-table.ts`).
 *
 * Pure: the file is imported as JSON, so the browser build (task 16.1) bundles it.
 */

import { z } from "zod";
import file from "./networks.json" with { type: "json" };
import {
  CARRIED_LEDGERS,
  type ConfiguredLedgerTable,
  effectiveLedgerTable,
  type LedgerRow,
  type LedgerTable,
  type LedgerTableIssue,
  ledgerTableIssues,
  U32_MAX,
} from "./version-table.js";

/** The networks a `core` entry may name besides `custom` (CF-4), each with a built-in table. */
export const KNOWN_NETWORKS = Object.freeze(["mainnet", "preprod", "preview", "stagenet"] as const);

/** A known network (CF-4). */
export type KnownNetwork = (typeof KNOWN_NETWORKS)[number];

/** The file's format name. */
export const NETWORKS_FORMAT = "umbradb-ledger-networks";

/** Where a value was read: the node, the day, and the file in this repository holding the node's answers. */
export interface NetworkSource {
  readonly node: string;
  readonly read: string;
  readonly record: string;
}

/** A block of a boundary: its height, its hash and its `MNSV` `spec_version`. */
export interface BoundaryBlock {
  readonly height: number;
  readonly hash: string;
  readonly specVersion: number;
}

/** A runtime upgrade: U enacts it, F = U + 1 is the first block of the new runtime (LG-1's terms). */
export interface Boundary {
  readonly u: BoundaryBlock;
  readonly f: BoundaryBlock;
  readonly source: NetworkSource;
}

/** A network's block 0: its hash and the `spec_version` of its runtime (null until read). */
export interface NetworkGenesis {
  readonly hash: string;
  readonly specVersion: number | null;
  readonly source: NetworkSource;
}

/** A known network's built-in entry, with its table (its rows, and a pin at each boundary's F). */
export interface BuiltInNetwork {
  readonly network: KnownNetwork;
  readonly genesis: NetworkGenesis | null;
  readonly rows: readonly LedgerRow[];
  readonly boundaries: readonly Boundary[];
  readonly table: LedgerTable;
}

/** A problem of a networks file: where (`networks[0].rows[1]`, `""` for the file itself), and what. */
export interface NetworksFileProblem {
  readonly path: string;
  readonly message: string;
}

const HASH = z.string().regex(/^0x[0-9a-f]{64}$/, { error: "expected a 32-byte hash as 0x-prefixed lowercase hex" });
const U32 = z.number().int().min(0).max(U32_MAX);
const HEIGHT = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);

/** A calendar day written `YYYY-MM-DD`: the text a valid date's ISO form starts with. */
function isDay(text: string): boolean {
  const day = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(day.getTime()) && day.toISOString().slice(0, 10) === text;
}

const SOURCE = z.strictObject({
  node: z.string().min(1),
  read: z.string().refine(isDay, { error: "expected the day it was read as YYYY-MM-DD, a calendar date" }),
  record: z.string().min(1),
});

const ROW = z.strictObject({ specVersionMin: U32, specVersionMax: U32, ledger: z.enum(["v8", "v9", "v10"]) });
const BLOCK = z.strictObject({ height: HEIGHT, hash: HASH, specVersion: U32 });
const BOUNDARY = z.strictObject({ u: BLOCK, f: BLOCK, source: SOURCE });
const GENESIS = z.strictObject({ hash: HASH, specVersion: U32.nullable(), source: SOURCE }).nullable();

type Issue = { path: (string | number)[]; message: string };

/** One network's rules beyond its shape. */
function networkIssues(entry: z.output<typeof NETWORK_SHAPE>): Issue[] {
  const issues: Issue[] = [];
  entry.rows.forEach((row, index) => {
    if (row.specVersionMin > row.specVersionMax) {
      issues.push({
        path: ["rows", index],
        message: `specVersionMin ${row.specVersionMin} is above specVersionMax ${row.specVersionMax}: a row's bounds are inclusive, the smaller first (LG-1)`,
      });
    }
    if (!CARRIED_LEDGERS.includes(row.ledger)) {
      issues.push({
        path: ["rows", index, "ledger"],
        message: `this build carries no ledger ${row.ledger} adapter (it carries ${CARRIED_LEDGERS.join(", ")}): a row is added with its ledger's adapter`,
      });
    }
    const before = entry.rows[index - 1];
    if (before !== undefined && row.specVersionMin <= before.specVersionMax) {
      issues.push({
        path: ["rows", index],
        message:
          `the rows are in ascending order without overlap, and rows[${index}] starts at ${row.specVersionMin}, not above ` +
          `rows[${index - 1}]'s end ${before.specVersionMax}`,
      });
    }
  });
  const covered = (specVersion: number) =>
    entry.rows.some((row) => row.specVersionMin <= specVersion && specVersion <= row.specVersionMax);
  if (entry.boundaries.length > 0 && entry.genesis === null) {
    issues.push({
      path: ["genesis"],
      message: "a network with boundaries records its genesis: its hash keys the network's table, read from the same node",
    });
  }
  entry.boundaries.forEach((boundary, index) => {
    const { u, f } = boundary;
    if (f.height !== u.height + 1) {
      issues.push({ path: ["boundaries", index, "f", "height"], message: `F is at height ${f.height}, where U + 1 is ${u.height + 1}` });
    }
    if (f.hash === u.hash) issues.push({ path: ["boundaries", index, "f", "hash"], message: "F's hash is U's hash" });
    if (f.specVersion === u.specVersion) {
      issues.push({
        path: ["boundaries", index, "f", "specVersion"],
        message: `F's spec_version ${f.specVersion} is U's: a boundary is where the runtime changes`,
      });
    }
    for (const [side, block] of [["u", u], ["f", f]] as const) {
      if (!covered(block.specVersion)) {
        issues.push({
          path: ["boundaries", index, side, "specVersion"],
          message: `spec_version ${block.specVersion}: no row covers it, so its block would halt with unknown-runtime`,
        });
      }
    }
    const previous = entry.boundaries[index - 1];
    if (previous === undefined) {
      const atGenesis = entry.genesis?.specVersion ?? null;
      if (atGenesis !== null && u.specVersion !== atGenesis) {
        issues.push({
          path: ["boundaries", index, "u", "specVersion"],
          message: `the first boundary's U has spec_version ${u.specVersion}, where the runtime at genesis is ${atGenesis}`,
        });
      }
      return;
    }
    if (u.height < previous.f.height) {
      issues.push({
        path: ["boundaries", index, "u", "height"],
        message:
          `the boundaries are in ascending order: boundaries[${index}]'s U at ${u.height} is below ` +
          `boundaries[${index - 1}]'s F at ${previous.f.height}`,
      });
    } else if (u.height === previous.f.height && u.hash !== previous.f.hash) {
      issues.push({
        path: ["boundaries", index, "u", "hash"],
        message: `U at height ${u.height} is boundaries[${index - 1}]'s F there, whose hash is ${previous.f.hash}`,
      });
    }
    if (u.specVersion !== previous.f.specVersion) {
      issues.push({
        path: ["boundaries", index, "u", "specVersion"],
        message:
          `U has spec_version ${u.specVersion}, where the runtime boundaries[${index - 1}]'s F started is ` +
          `${previous.f.specVersion}`,
      });
    }
  });
  return issues;
}

const NETWORK_SHAPE = z.strictObject({
  network: z.enum(KNOWN_NETWORKS),
  genesis: GENESIS,
  rows: z.array(ROW).min(1),
  boundaries: z.array(BOUNDARY),
});

const NETWORK = NETWORK_SHAPE.superRefine((entry, context) => {
  for (const issue of networkIssues(entry)) context.addIssue({ code: "custom", ...issue });
});

const FILE = z
  .strictObject({ format: z.literal(NETWORKS_FORMAT), version: z.literal(1), about: z.string(), networks: z.array(NETWORK) })
  .superRefine((data, context) => {
    data.networks.forEach((entry, index) => {
      const named = data.networks.findIndex((other) => other.network === entry.network);
      if (named < index) {
        context.addIssue({
          code: "custom",
          path: ["networks", index, "network"],
          message: `${entry.network} is listed already, as networks[${named}]: one table a network`,
        });
      }
      if (entry.genesis === null) return;
      const hash = entry.genesis.hash;
      const keyed = data.networks.findIndex((other) => other.genesis?.hash === hash);
      if (keyed < index) {
        context.addIssue({
          code: "custom",
          path: ["networks", index, "genesis", "hash"],
          message: `networks[${keyed}] has this genesis hash too: a genesis hash keys one network's table`,
        });
      }
    });
  });

/** `path` as the findings of the configuration write it: `networks[0].rows[1].specVersionMax`. */
function pathText(path: readonly PropertyKey[]): string {
  return path.map((key, index) => (typeof key === "number" ? `[${key}]` : `${index === 0 ? "" : "."}${String(key)}`)).join("");
}

/** Every problem of `data` as a networks file, in order; none for a valid one. */
export function networksFileProblems(data: unknown): NetworksFileProblem[] {
  const result = FILE.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({ path: pathText(issue.path), message: issue.message }));
}

/** The networks of a valid networks file, frozen, each with its table; throws an `Error` listing every problem. */
export function parseNetworksFile(data: unknown): readonly BuiltInNetwork[] {
  const result = FILE.safeParse(data);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${pathText(issue.path) || "(the file)"}: ${issue.message}`);
    throw new Error(`the ledger networks file is not valid (LG-3): ${problems.join("; ")}`);
  }
  return Object.freeze(
    result.data.networks.map((entry) => {
      const source = (given: NetworkSource): NetworkSource => Object.freeze({ ...given });
      const block = (given: BoundaryBlock): BoundaryBlock => Object.freeze({ ...given });
      const boundaries = Object.freeze(
        entry.boundaries.map((boundary) => Object.freeze({ u: block(boundary.u), f: block(boundary.f), source: source(boundary.source) })),
      );
      const table = effectiveLedgerTable(null, {
        rows: entry.rows,
        pins: boundaries.map((boundary) => ({ height: boundary.f.height, hash: boundary.f.hash, specVersion: boundary.f.specVersion })),
      });
      return Object.freeze({
        network: entry.network,
        genesis:
          entry.genesis === null
            ? null
            : Object.freeze({ hash: entry.genesis.hash, specVersion: entry.genesis.specVersion, source: source(entry.genesis.source) }),
        rows: table.rows,
        boundaries,
        table,
      });
    }),
  );
}

/** This build's built-in networks (`./networks.json`), in the file's order. */
export const BUILT_IN_NETWORKS: readonly BuiltInNetwork[] = parseNetworksFile(file);

/** The built-in entry of `network`, or null (`custom`, or any other name). */
export function builtInNetwork(network: string): BuiltInNetwork | null {
  return BUILT_IN_NETWORKS.find((entry) => entry.network === network) ?? null;
}

/** The built-in table of `network`, or null when the file has none (`custom`). */
export function builtInLedgerTable(network: string): LedgerTable | null {
  return builtInNetwork(network)?.table ?? null;
}

/** The table in effect for a `core` entry of `network` with the configured `ledgerTable` (LG-3). */
export function ledgerTableOf(network: string, configured: ConfiguredLedgerTable | undefined): LedgerTable {
  return effectiveLedgerTable(builtInLedgerTable(network), configured);
}

/** LG-1 to LG-3's rules on a `core` entry's configured `ledgerTable`, for its `network` (`./version-table.ts`). */
export function ledgerTableIssuesOf(network: string, configured: ConfiguredLedgerTable | undefined): LedgerTableIssue[] {
  return ledgerTableIssues(builtInLedgerTable(network), configured);
}
