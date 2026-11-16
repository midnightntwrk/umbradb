/**
 * IPIR+SP cell encoding (spec 00058 FR-011). No Node.js import: the server writes records with it and the wallet (also
 * in the page) reads them back.
 *
 * - A record of B bytes is E = ⌈B / 2⌉ cells: cell j is bytes 2j (low) and 2j + 1 (high), little-endian; the last
 *   cell of an odd-length record has a zero high byte.
 * - Slot s of row g holds its record in columns s·E … s·E + E − 1 of row g. The table is held column-major, as the
 *   add-on takes it: cell (row, col) is at index `col × rows + row`. Cells no record is put in stay as they were (zero,
 *   or a padded build's noise).
 * - The table file is the cells as little-endian 16-bit words in that order, with no header: the manifest's layout
 *   gives its shape, and its size is `2 × rows × cols` bytes.
 */

/** Writes `record` into slot `slot` of row `row` of a column-major table of `rows` rows, `cellsPerRecord` cells. */
export function putIpirRecord(cells: Uint16Array, rows: number, row: number, slot: number, cellsPerRecord: number, record: Uint8Array): void {
  const e = cellsPerRecord;
  if (record.length > 2 * e) throw new Error(`a record of ${record.length} bytes does not fit ${e} cells`);
  if (row < 0 || row >= rows || slot < 0 || (slot + 1) * e * rows > cells.length) throw new Error(`slot ${slot} of row ${row} is outside the table`);
  let at = slot * e * rows + row;
  for (let j = 0; j < e; j++, at += rows) {
    const lo = record[2 * j] ?? 0;
    const hi = record[2 * j + 1] ?? 0;
    cells[at] = lo | (hi << 8);
  }
}

/** The records of one decoded row (its `cols` cells, in column order): slot s's `recordBytes` bytes, for every slot. */
export function ipirRowRecords(row: Uint16Array, perGroup: number, cellsPerRecord: number, recordBytes: number): Uint8Array[] {
  const e = cellsPerRecord;
  if (recordBytes > 2 * e) throw new Error(`a record of ${recordBytes} bytes does not fit ${e} cells`);
  if (perGroup * e > row.length) throw new Error(`a row of ${row.length} cells holds no ${perGroup} records of ${e} cells`);
  const out: Uint8Array[] = [];
  for (let s = 0; s < perGroup; s++) {
    const record = new Uint8Array(recordBytes);
    for (let b = 0; b < recordBytes; b++) {
      const cell = row[s * e + (b >> 1)]!;
      record[b] = (b & 1) === 0 ? cell & 0xff : cell >>> 8;
    }
    out.push(record);
  }
  return out;
}

/** Reads a record straight from a column-major table (no PIR): the reference a PIR read must equal. */
export function readIpirRecord(cells: Uint16Array, rows: number, row: number, slot: number, cellsPerRecord: number, recordBytes: number): Uint8Array {
  const e = cellsPerRecord;
  const values = new Uint16Array(e);
  for (let j = 0; j < e; j++) values[j] = cells[(slot * e + j) * rows + row]!;
  return ipirRowRecords(values, 1, e, recordBytes)[0]!;
}
