/**
 * The per-block changes and digests of DT-4 and DT-5 (`openspec/changes/core-arch/specs/determinism/spec.md`;
 * `design.md` §4 "Change capture for digests" and §10; owner decisions Q84, Q86), as functions of the rows change
 * capture reads (`src/db/change-capture.ts`); `core-digest` writes what they compute (`src/backbone/core-digest/`).
 *
 * **Changes (DT-4).** For every primary key a block wrote, its row at the end of h − 1 and at the end of h give one
 * change: `["insert", new row]` when there was none before, `["delete", old row]` when there is none after,
 * `["update", new row]` when both exist and differ — and nothing when both are the same, or when neither exists (a row
 * inserted and deleted in one block). Rows are compared by their canonical encoding (DT-1), so what is equal is exactly
 * what the contents hash cannot tell apart. A table's `changes at h` is the canonical CBOR array of its changes, in
 * primary-key order (DT-2), each change a two-element array of its kind as a text string and the row as DT-1 encodes it.
 *
 * **Digests (DT-5).** A table's digest at h is `SHA-256(previous ‖ CBOR(h) ‖ changes at h)`, where `previous` is its
 * digest before h, or 32 zero bytes before its first change, and `CBOR(h)` the height as a CBOR integer. A table
 * without changes at h keeps its digest and the height of its last change.
 *
 * **Checkpoints (DT-5).** At every height h with h mod the build's interval = 0 (14,400, about 24 hours at one block per
 * 6 s; `src/backbone/core-digest/build-flags.ts`), whatever the database's S, every table's digest is copied into the
 * checkpoints; {@link isCheckpointHeight} says which heights.
 */

import { createHash } from "node:crypto";
import type { ColumnType } from "../deterministic-postgresql/index.js";
import { encodeArrayHead, encodeCanonical, encodeRow } from "./cbor.js";

/** The length of a digest, SHA-256's. */
export const DIGEST_BYTES = 32;

/** The digest before a table's first change: 32 zero bytes ({@link nextDigest} uses its own copy, whatever a caller does to this one). */
export const ZERO_DIGEST: Uint8Array = new Uint8Array(DIGEST_BYTES);

/** The kinds of change of DT-4. */
export type ChangeKind = "insert" | "delete" | "update";

/**
 * One primary key a block wrote: its row (the table's column values, in column order) at the end of h − 1 and at the
 * end of h, null where the table held no row with that key.
 */
export interface TouchedRow {
  readonly before: readonly unknown[] | null;
  readonly after: readonly unknown[] | null;
}

/** A table's changes at a height: how many, and their canonical CBOR array. */
export interface TableChanges {
  readonly count: number;
  readonly bytes: Uint8Array;
}

/**
 * The changes of one table at one height (DT-4) from the keys the block wrote, given in primary-key order, each row
 * encoded as DT-1 encodes the table's `types`. A value DT-1 cannot encode fails, as it fails the contents hash.
 */
export function tableChanges(types: readonly ColumnType[], touched: Iterable<TouchedRow>): TableChanges {
  const parts: Uint8Array[] = [];
  for (const { before, after } of touched) {
    const change = changeOf(types, before, after);
    if (change === null) continue;
    parts.push(encodeArrayHead(2), encodeCanonical(change.kind), change.row);
  }
  const count = parts.length / 3;
  return { count, bytes: concat([encodeArrayHead(count), ...parts]) };
}

/** A table's digest at `height` (DT-5): SHA-256 of `previous` (32 zero bytes when null), `CBOR(height)` and `changes`. */
export function nextDigest(previous: Uint8Array | null, height: bigint, changes: Uint8Array): Uint8Array {
  if (previous !== null && previous.length !== DIGEST_BYTES) {
    throw new RangeError(`a previous digest is ${DIGEST_BYTES} bytes long, got ${previous.length}`);
  }
  if (height < 0n) throw new RangeError(`a height is not negative, got ${height}`);
  const hash = createHash("sha256");
  hash.update(previous ?? new Uint8Array(DIGEST_BYTES));
  hash.update(encodeCanonical(height));
  hash.update(changes);
  return new Uint8Array(hash.digest());
}

/** True at the heights DT-5 checkpoints: those with `height` mod `interval` = 0, genesis included. */
export function isCheckpointHeight(height: bigint, interval: bigint): boolean {
  if (interval <= 0n) throw new RangeError(`a checkpoint interval is a positive integer, got ${interval}`);
  if (height < 0n) throw new RangeError(`a height is not negative, got ${height}`);
  return height % interval === 0n;
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** One key's change, or null for none (DT-4). */
function changeOf(
  types: readonly ColumnType[],
  before: readonly unknown[] | null,
  after: readonly unknown[] | null,
): { readonly kind: ChangeKind; readonly row: Uint8Array } | null {
  if (after === null) return before === null ? null : { kind: "delete", row: encodeRow(before, types) };
  const row = encodeRow(after, types);
  if (before === null) return { kind: "insert", row };
  return sameBytes(encodeRow(before, types), row) ? null : { kind: "update", row };
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
