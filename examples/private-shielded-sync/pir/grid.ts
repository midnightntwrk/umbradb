/**
 * The PIR grid (spec FR-052, FR-061): R rows × C columns of centred 9-bit cells, held as one `Int16Array` (2 bytes per
 * cell) in row-major order, backed by a `SharedArrayBuffer` so worker threads read it without copying.
 *
 * A column holds `perColumn` whole records stacked: record slot s of column j occupies rows s·E … s·E + E − 1, where E
 * is the cells per record. Unused cells hold the value 0 (stored as −p/2), the same as an all-zero record.
 *
 * The table file (the artifact) is a 32-byte header followed by the cells as 16-bit little-endian integers, row by row.
 * The grid digest, which seeds the public matrix (FR-053), is the SHA-256 of that file.
 */

import { createHash } from "node:crypto";
import { cellsPerRecord, decodeRecord, encodeRecord, ZERO_CELL } from "./encode.ts";
import { checkNoise, HALF_PLAIN, MAX_COLUMNS, PLAIN_MODULUS } from "./params.ts";

export interface GridShape {
  /** R = perColumn × E. */
  readonly rows: number;
  /** C. */
  readonly cols: number;
  /** Records per column. */
  readonly perColumn: number;
  /** E = ceil(8 × recordBytes / 9). */
  readonly cellsPerRecord: number;
  readonly recordBytes: number;
  /** How many real records the grid holds (the rest of its slots are unused). */
  readonly records: number;
}

export interface Grid extends GridShape {
  /** Row-major R × C cells, each v − p/2 for a plaintext value v in [0, p). */
  readonly cells: Int16Array;
}

/** Bytes of the table file's header. */
export const GRID_HEADER_BYTES = 32;
const GRID_MAGIC = 0x47535350; // "PSSG" read as a little-endian u32
const GRID_FORMAT_VERSION = 1;

/**
 * The read table's shape for `records` records of `recordBytes` bytes (FR-061): about square. Above the noise check's
 * column limit (FR-058, about 16.7M read records) the columns are capped there and grow taller instead (Q57).
 */
export function positionalShape(records: number, recordBytes: number): GridShape {
  if (!Number.isInteger(records) || records < 0) throw new Error(`record count must be ≥ 0: ${records}`);
  const e = cellsPerRecord(recordBytes);
  let perColumn = Math.max(1, Math.round(Math.sqrt(records * e) / e));
  if (Math.ceil(records / perColumn) > MAX_COLUMNS) perColumn = Math.ceil(records / MAX_COLUMNS);
  const cols = Math.max(1, Math.ceil(records / perColumn));
  return { rows: perColumn * e, cols, perColumn, cellsPerRecord: e, recordBytes, records };
}

/**
 * The path table's shape (Q58): as wide as the noise check allows, so the fewest rows. A wallet reads it only to spend,
 * and its setup data, which it downloads for that, grows with the rows; the call's upload grows with the columns.
 */
export function widestShape(records: number, recordBytes: number): GridShape {
  if (!Number.isInteger(records) || records < 0) throw new Error(`record count must be ≥ 0: ${records}`);
  const e = cellsPerRecord(recordBytes);
  const perColumn = Math.max(1, Math.ceil(records / MAX_COLUMNS));
  const cols = Math.max(1, Math.ceil(records / perColumn));
  return { rows: perColumn * e, cols, perColumn, cellsPerRecord: e, recordBytes, records };
}

/** Column and slot of record `index` in a table with `perColumn` records per column (FR-061). */
export function positionOf(index: number, perColumn: number): { column: number; slot: number } {
  return { column: Math.floor(index / perColumn), slot: index % perColumn };
}

/** Allocates a grid of the given shape with every cell 0 (stored −p/2). Fails the noise check of FR-058. */
export function createGrid(shape: GridShape): Grid {
  checkNoise(shape.cols);
  if (shape.rows !== shape.perColumn * shape.cellsPerRecord) throw new Error("rows must equal perColumn × E");
  if (shape.cellsPerRecord !== cellsPerRecord(shape.recordBytes)) throw new Error("E does not match the record size");
  if (shape.records > shape.perColumn * shape.cols) throw new Error("more records than the grid holds");
  const cells = new Int16Array(new SharedArrayBuffer(shape.rows * shape.cols * 2));
  cells.fill(ZERO_CELL);
  return { ...shape, cells };
}

/** Writes a record into slot `slot` of column `column`. */
export function setRecord(grid: Grid, column: number, slot: number, bytes: Uint8Array): void {
  if (bytes.length !== grid.recordBytes) throw new Error(`record must be ${grid.recordBytes} bytes, got ${bytes.length}`);
  if (column < 0 || column >= grid.cols || slot < 0 || slot >= grid.perColumn) throw new Error("slot out of range");
  encodeRecord(bytes, grid.cellsPerRecord, grid.cells, slot * grid.cellsPerRecord * grid.cols + column, grid.cols);
}

/** Reads a record back from the grid directly (no PIR): the reference a PIR read must equal. */
export function readRecord(grid: Grid, column: number, slot: number): Uint8Array {
  const e = grid.cellsPerRecord;
  const values = new Uint16Array(e);
  for (let g = 0; g < e; g++) {
    values[g] = (grid.cells[(slot * e + g) * grid.cols + column]! + HALF_PLAIN) & (PLAIN_MODULUS - 1);
  }
  return decodeRecord(values, 0, grid.recordBytes);
}

/**
 * The read table (FR-060–061): record `i` of `records` (a flat array of `count × recordBytes` bytes, or a function
 * returning record `i`) in column `i div perColumn`, slot `i mod perColumn`.
 */
export function buildPositionalGrid(
  count: number,
  recordBytes: number,
  records: Uint8Array | ((index: number) => Uint8Array),
): Grid {
  const grid = createGrid(positionalShape(count, recordBytes));
  for (let i = 0; i < count; i++) {
    const bytes =
      typeof records === "function" ? records(i) : records.subarray(i * recordBytes, (i + 1) * recordBytes);
    const { column, slot } = positionOf(i, grid.perColumn);
    setRecord(grid, column, slot, bytes);
  }
  return grid;
}

/** The table file's 32-byte header: magic, format version, reserved, then R, C, perColumn, E, record size, records. */
export function encodeGridHeader(shape: GridShape): Uint8Array {
  const out = new Uint8Array(GRID_HEADER_BYTES);
  const view = new DataView(out.buffer);
  view.setUint32(0, GRID_MAGIC, true);
  view.setUint16(4, GRID_FORMAT_VERSION, true);
  view.setUint16(6, 0, true);
  const fields = [shape.rows, shape.cols, shape.perColumn, shape.cellsPerRecord, shape.recordBytes, shape.records];
  fields.forEach((v, i) => view.setUint32(8 + 4 * i, v, true));
  return out;
}

/** Reads a table file's header; throws on a wrong magic, version or inconsistent shape. */
export function decodeGridHeader(bytes: Uint8Array): GridShape {
  if (bytes.length < GRID_HEADER_BYTES) throw new Error("table file shorter than its header");
  const view = new DataView(bytes.buffer, bytes.byteOffset, GRID_HEADER_BYTES);
  if (view.getUint32(0, true) !== GRID_MAGIC) throw new Error("not a PIR table file");
  if (view.getUint16(4, true) !== GRID_FORMAT_VERSION) throw new Error("unknown PIR table file version");
  const [rows, cols, perColumn, e, recordBytes, records] = [0, 1, 2, 3, 4, 5].map((i) => view.getUint32(8 + 4 * i, true));
  const shape = { rows: rows!, cols: cols!, perColumn: perColumn!, cellsPerRecord: e!, recordBytes: recordBytes!, records: records! };
  if (shape.rows !== shape.perColumn * shape.cellsPerRecord || shape.cellsPerRecord !== cellsPerRecord(shape.recordBytes)) {
    throw new Error("inconsistent PIR table header");
  }
  return shape;
}

/** The cells' bytes (16-bit little-endian, row by row), without copying. */
export function gridCellBytes(grid: Grid): Uint8Array {
  return new Uint8Array(grid.cells.buffer, grid.cells.byteOffset, grid.cells.byteLength);
}

/** The table file: header then cells. Copies the cells; use `encodeGridHeader` and `gridCellBytes` to stream. */
export function serializeGrid(grid: Grid): Uint8Array {
  const out = new Uint8Array(GRID_HEADER_BYTES + grid.cells.byteLength);
  out.set(encodeGridHeader(grid), 0);
  out.set(gridCellBytes(grid), GRID_HEADER_BYTES);
  return out;
}

/** Loads a table file into a new grid (cells copied into a `SharedArrayBuffer`). */
export function deserializeGrid(bytes: Uint8Array): Grid {
  const shape = decodeGridHeader(bytes);
  const expected = GRID_HEADER_BYTES + shape.rows * shape.cols * 2;
  if (bytes.length !== expected) throw new Error(`table file must be ${expected} bytes, got ${bytes.length}`);
  checkNoise(shape.cols);
  const cells = new Int16Array(new SharedArrayBuffer(shape.rows * shape.cols * 2));
  new Uint8Array(cells.buffer).set(bytes.subarray(GRID_HEADER_BYTES));
  return { ...shape, cells };
}

/** SHA-256 of the table file (header then cells), computed without copying the cells. */
export function gridDigest(grid: Grid): Uint8Array {
  const hash = createHash("sha256");
  hash.update(encodeGridHeader(grid));
  // `update` copies at most what it is given; feed the shared memory in slices so no large copy is made at once.
  const bytes = gridCellBytes(grid);
  const slice = 1 << 24;
  for (let off = 0; off < bytes.length; off += slice) hash.update(bytes.subarray(off, Math.min(bytes.length, off + slice)));
  return new Uint8Array(hash.digest());
}
