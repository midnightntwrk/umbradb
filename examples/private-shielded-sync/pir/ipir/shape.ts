/**
 * IPIR+SP table shapes (spec 00058 FR-011). No Node.js import: the server, the wallet and the page use the same rule.
 *
 * - A table is `rows × cols` 16-bit cells, both multiples of 2,048, at most 2^30 cells (`../../ipir/sizes.ts`). One
 *   request reads one whole row: a row is a group. A record of B bytes takes E = ⌈B / 2⌉ cells, and a row holds
 *   `perGroup = ⌊cols / E⌋` records side by side.
 * - **The rule.** Among the shapes that hold every record, the one whose request and answer together are the fewest
 *   bytes: `ipirRequestBytes(rows) + ipirResponseBytes(cols)` = `27,684 + ⌈49 · rows / 8⌉ + 68 + ⌈22 · cols / 8⌉`.
 *   For each row count the fewest columns that hold the records are taken (more columns only cost more); ties go to
 *   the shape of fewer cells, then to fewer rows. A table of no record is 2,048 × 2,048.
 * - **Rows are capped** at {@link IPIR_MAX_ROWS} (32,768, `../../ipir/sizes.ts`): with the query rounded to 49 bits,
 *   upstream's correctness certificate stays below 2^-128 only up to there (review finding F4); a table that needs
 *   more grows in columns instead. The longest request is then 228,388 bytes, the IPIR+SP part of the query routes'
 *   body limit. The rule seldom wants more rows anyway: a row costs 49/8 bytes of every request, a column 22/8 bytes
 *   of every answer, so even a table of 2^30 cells is cheapest at about 22,000 rows.
 * - **Nullifier buckets**: bucket j is row j, so rows = 2^bits with bits from {@link IPIR_MIN_BUCKET_BITS} (11) to
 *   {@link IPIR_MAX_BUCKET_BITS} (15, the row cap); a row holds the fullest bucket's load. Bits and columns are chosen
 *   by the same rule from the entries' `maxLoad(bits)`; ties go to fewer cells, then fewer bits.
 *
 * A table no shape holds is refused with {@link TableTooLarge}.
 */

import { IPIR_MAX_CELLS, IPIR_MAX_ROWS, IPIR_RING, ipirRequestBytes, ipirResponseBytes } from "../../ipir/sizes.ts";
import type { TableName } from "../matrix.ts";
import { type BucketSource, TableTooLarge } from "../scheme.ts";

/** The most rows an IPIR+SP table may have (32,768; see the module comment). */
export { IPIR_MAX_ROWS };
/** The longest request of any IPIR+SP table (228,388 bytes). */
export const IPIR_MAX_REQUEST_BYTES = ipirRequestBytes(IPIR_MAX_ROWS);
/** Nullifier bucket bits: at least 2,048 rows, at most {@link IPIR_MAX_ROWS}. */
export const IPIR_MIN_BUCKET_BITS = 11;
export const IPIR_MAX_BUCKET_BITS = 15;
/** Bytes of one cell. */
export const IPIR_CELL_BYTES = 2;

/** A table's shape: `rows × cols` cells; a group is a row of `perGroup` records of `cellsPerRecord` cells. */
export interface IpirShape {
  /** Rows, which are the groups a request selects among. */
  readonly rows: number;
  readonly cols: number;
  /** E = ⌈recordBytes / 2⌉. */
  readonly cellsPerRecord: number;
  /** ⌊cols / E⌋. */
  readonly perGroup: number;
}

/** The nullifier table's shape: `rows = 2^bucketBits` buckets. */
export interface IpirBucketShape extends IpirShape {
  readonly bucketBits: number;
}

/** E: the cells one record of `recordBytes` bytes takes. */
export function ipirCellsPerRecord(recordBytes: number): number {
  if (!Number.isSafeInteger(recordBytes) || recordBytes < 1) throw new Error(`record size must be ≥ 1 byte: ${recordBytes}`);
  return Math.ceil(recordBytes / IPIR_CELL_BYTES);
}

/** What the rule minimises: one request and its answer, in bytes. */
export function ipirCallBytes(rows: number, cols: number): number {
  return ipirRequestBytes(rows) + ipirResponseBytes(cols);
}

/** The fewest columns (a multiple of 2,048, at least 2,048) whose rows hold `load` records of `e` cells each. */
function colsFor(load: number, e: number): number {
  return Math.max(IPIR_RING, Math.ceil((Math.max(1, load) * e) / IPIR_RING) * IPIR_RING);
}

/** The cheapest of `candidates` by the rule: fewest call bytes, then fewest cells; the first of equals. */
function cheapest<T extends IpirShape>(candidates: Iterable<T>): T | null {
  let best: T | null = null;
  let bestCost = Number.POSITIVE_INFINITY;
  for (const c of candidates) {
    const cost = ipirCallBytes(c.rows, c.cols);
    if (best === null || cost < bestCost || (cost === bestCost && c.rows * c.cols < best.rows * best.cols)) {
      best = c;
      bestCost = cost;
    }
  }
  return best;
}

function* positionalCandidates(records: number, e: number): Generator<IpirShape> {
  for (let rows = IPIR_RING; rows <= IPIR_MAX_ROWS; rows += IPIR_RING) {
    const cols = colsFor(Math.ceil(records / rows), e);
    if (rows * cols > IPIR_MAX_CELLS) continue;
    yield { rows, cols, cellsPerRecord: e, perGroup: Math.floor(cols / e) };
  }
}

/**
 * The shape of a positional table (the read or the path table) of `records` records of `recordBytes` bytes, by the
 * rule of the module comment. Throws {@link TableTooLarge} when no shape holds them.
 */
export function positionalIpirShape(records: number, recordBytes: number, table: TableName = "read"): IpirShape {
  if (!Number.isSafeInteger(records) || records < 0) throw new Error(`record count must be ≥ 0: ${records}`);
  const e = ipirCellsPerRecord(recordBytes);
  const best = cheapest(positionalCandidates(records, e));
  if (best === null) throw new TableTooLarge("ipir-sp", table, records, recordBytes, records * e, IPIR_MAX_CELLS);
  return best;
}

function* bucketCandidates(source: Pick<BucketSource, "maxLoad" | "recordBytes">, e: number): Generator<IpirBucketShape> {
  for (let bits = IPIR_MIN_BUCKET_BITS; bits <= IPIR_MAX_BUCKET_BITS; bits++) {
    const rows = 2 ** bits;
    const cols = colsFor(source.maxLoad(bits), e);
    if (rows * cols > IPIR_MAX_CELLS) continue;
    yield { rows, cols, cellsPerRecord: e, perGroup: Math.floor(cols / e), bucketBits: bits };
  }
}

/**
 * The nullifier table's shape: its bucket bits and columns by the rule, from the entries' fullest bucket at each cut.
 * Throws {@link TableTooLarge} when no shape holds them.
 */
export function bucketIpirShape(source: Pick<BucketSource, "maxLoad" | "recordBytes" | "records">): IpirBucketShape {
  const e = ipirCellsPerRecord(source.recordBytes);
  const best = cheapest(bucketCandidates(source, e));
  if (best === null) throw new TableTooLarge("ipir-sp", "nullifier", source.records, source.recordBytes, source.records * e, IPIR_MAX_CELLS);
  return best;
}

/**
 * The nullifier table's shape before its entries are known (for the padded-build estimate): the fullest bucket taken
 * as half again the mean load, as SimplePIR's estimate does.
 */
export function estimatedBucketIpirShape(records: number, recordBytes: number): IpirBucketShape {
  return bucketIpirShape({ records, recordBytes, maxLoad: (bits) => Math.ceil((1.5 * records) / 2 ** bits) });
}
