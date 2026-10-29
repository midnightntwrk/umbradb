/**
 * The tape reader and writer. [TT-1, A68]
 *
 * **The file.** JSON lines: one record per line in recorded order (`./records.ts`), each line ended by a newline (`\n`,
 * the last one too), in UTF-8; an empty file is a tape with no records. **A tape is identified by the SHA-256 of its
 * bytes** ({@link tapeId}: lowercase hex), which every test that uses a tape names.
 *
 * **One form.** The writer writes each record in one form: its fields in the tape format's order, JSON with no spaces,
 * strings and numbers as `JSON.stringify` writes them (`./json.ts`). The reader reads a line only if it is in that form
 * (`not-canonical` otherwise, naming the line the writer would write). So every tape the reader accepts round-trips
 * through the reader and writer byte for byte, and one tape has one id: the same records written with other spaces or
 * key orders are not a second spelling of the tape under another id. Tapes are made by the writer (the recording
 * builder, the variant transforms and the tests all write records through it), so the form costs a hand-edited tape no
 * more than the fix the error message gives. [TT-1]
 *
 * **Errors.** A line that is not one of the tape format's records fails with `bad-tape-record` and its line number
 * ({@link TapeError}), at the first such line; so do records given to the writer. [TT-1]
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { TapeError } from "./errors.js";
import { parseJsonText } from "./json.js";
import { recordLine, sessionCheck, type TapeRecord } from "./records.js";

/** A tape read from its bytes. */
export interface Tape {
  /** The SHA-256 of its bytes, in lowercase hex. */
  readonly id: string;
  readonly records: readonly TapeRecord[];
}

const NEWLINE = 0x0a;
const utf8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
const encoder = new TextEncoder();

/** The id of the tape whose bytes are `bytes`: their SHA-256, in lowercase hex. */
export function tapeId(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/** A value read from JSON (no cycles, nothing shared) and everything in it, frozen. */
function deepFreeze<T>(value: T): T {
  const stack: unknown[] = [value];
  while (stack.length > 0) {
    const item = stack.pop();
    if (typeof item !== "object" || item === null) continue;
    Object.freeze(item);
    for (const key of Object.keys(item)) stack.push((item as Record<string, unknown>)[key]);
  }
  return value;
}

/** Reads one line (without its newline) as a record. */
function readLine(text: string, line: number): TapeRecord {
  if (text === "") throw new TapeError(line, "empty-line", "an empty line is not a record");
  let value: unknown;
  try {
    value = parseJsonText(text);
  } catch {
    throw new TapeError(line, "not-json", "the line is not JSON");
  }
  const canonical = recordLine(value, line);
  if (canonical !== text) {
    const shown = canonical.length > 200 ? `${canonical.slice(0, 200)}…` : canonical;
    throw new TapeError(line, "not-canonical", `the line is not in the form the writer writes, which is ${shown}`);
  }
  return value as TapeRecord;
}

/** Reads a tape from its bytes; throws `bad-tape-record` with the line number of the first line that is no record. */
export function readTape(bytes: Uint8Array): Tape {
  const records: TapeRecord[] = [];
  const check = sessionCheck();
  let start = 0;
  let line = 0;
  while (start < bytes.length) {
    line += 1;
    const end = bytes.indexOf(NEWLINE, start);
    if (end === -1) throw new TapeError(line, "no-final-newline", "the last record has no newline after it");
    let text: string;
    try {
      text = utf8.decode(bytes.subarray(start, end));
    } catch {
      throw new TapeError(line, "not-utf8", "the line is not UTF-8");
    }
    const record = readLine(text, line);
    check(record, line);
    records.push(record);
    start = end + 1;
  }
  return deepFreeze({ id: tapeId(bytes), records });
}

/** Reads the tape at `path`. */
export function readTapeFile(path: string): Tape {
  return readTape(readFileSync(path));
}

/**
 * The text of the tape holding `records`; throws `bad-tape-record` at the first record that is not a tape record.
 * [TT-1]
 */
export function tapeText(records: readonly TapeRecord[]): string {
  const check = sessionCheck();
  const lines = records.map((record, index) => {
    const text = recordLine(record, index + 1);
    check(record, index + 1);
    return `${text}\n`;
  });
  return lines.join("");
}

/** The bytes of the tape holding `records`. */
export function writeTape(records: readonly TapeRecord[]): Uint8Array {
  return encoder.encode(tapeText(records));
}

/** Writes the tape holding `records` to `path`, and returns its id. */
export function writeTapeFile(path: string, records: readonly TapeRecord[]): string {
  const bytes = writeTape(records);
  writeFileSync(path, bytes);
  return tapeId(bytes);
}
