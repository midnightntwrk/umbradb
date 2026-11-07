/**
 * The ledger version table, and the ledger version of each block. [LG-1, LG-2, LG-3; CORE-ARCH §4.8; design §5, §11]
 *
 * **Selection.** A block's ledger version is the row covering the `spec_version` of its `MNSV` digest. That is the
 * single `DigestItem::Consensus(*b"MNSV", spec_version.encode())` the node's version pallet deposits in every block,
 * block 0 included (`midnight-node` `pallets/version/src/lib.rs`). It is read as the node reads it: only a Consensus
 * item counts, not a PreRuntime or Seal item with that engine. [LG-1, LG-2]
 *
 * {@link selectLedgerVersion} checks, in this order:
 * - exactly one well-formed `MNSV` item, else `bad-version-digest` (`missing`, `several` or `malformed`);
 * - every pin at the block's height, else `pin-mismatch`, naming what differs (the hash or the `spec_version`);
 * - exactly one row covering the version, else `unknown-runtime`, with `details.rows` the number of covering rows (0,
 *   or 2 or more in a table the configuration's rules did not check).
 *
 * Each is a typed `UmbraError` that the finalized loop turns into a halt; none is retryable. Rows alone choose the
 * ledger; pins only check. The node's `midnight_ledgerVersion` is not read. [design §11]
 *
 * **The table in effect.** The `core` entry's `ledgerTable` adds to, or replaces parts of, the network's built-in
 * table (`./networks.json`):
 * - a configured row maps the `spec_version`s it covers, and the built-in rows map the rest, cut around the configured
 *   rows where they overlap; so a configured row never leaves unmapped a version the built-in rows covered;
 * - a configured pin replaces the built-in pin at its height, or adds one at any other height;
 * - a network with no built-in table (`custom`) has only its configured rows and pins.
 *
 * The rows are ordered by `specVersionMin`, the pins by height. The `core` schema (`../config/core-settings.ts`) first
 * checks {@link ledgerTableIssues}' rules on a configured table, then gives this table in effect as the revision's
 * `ledgerTable`, so the configuration history records it with every default applied. [LG-3, CF-7]
 *
 * Pure: no Node.js import, so the browser build uses it as it is.
 */

import { UmbraError } from "../db/errors.js";
import type { LedgerName } from "./types.js";
import { LEDGER_RELEASES } from "./releases.js";

/** The largest `spec_version`, since a runtime's version is a `u32`; row bounds are inclusive. [LG-1] */
export const U32_MAX = 4_294_967_295;

/** A row of the ledger version table: the `spec_version`s from `specVersionMin` to `specVersionMax`, both included. */
export interface LedgerRow {
  readonly specVersionMin: number;
  readonly specVersionMax: number;
  readonly ledger: LedgerName;
}

/**
 * A pin: the block at `height` has the hash `hash` (`0x` hex) and carries `specVersion` in its `MNSV` digest. [LG-2]
 */
export interface LedgerPin {
  readonly height: number;
  readonly hash: string;
  readonly specVersion: number;
}

/** A ledger version table: its rows and its pins; the `ledger-table` process item is one. [LG-1, LG-2] */
export interface LedgerTable {
  readonly rows: readonly LedgerRow[];
  readonly pins: readonly LedgerPin[];
}

/** The `core` entry's `ledgerTable` as configured: rows and pins added to, or replacing, the built-in ones. [CF-4] */
export interface ConfiguredLedgerTable {
  readonly rows?: readonly LedgerRow[] | undefined;
  readonly pins?: readonly LedgerPin[] | undefined;
}

/** What selection reads of a block: its height, its hash and its header's digest items, each as SCALE bytes. */
export interface VersionedBlock {
  readonly height: bigint;
  readonly hash: Uint8Array;
  readonly digest: readonly Uint8Array[];
}

/** A block's version: the `spec_version` of its `MNSV` digest and the ledger its row maps it to. */
export interface LedgerSelection {
  readonly specVersion: number;
  readonly ledger: LedgerName;
}

/** The ledger versions this build carries an adapter for (`./releases.ts`). */
export const CARRIED_LEDGERS: readonly LedgerName[] = Object.freeze(Object.keys(LEDGER_RELEASES) as LedgerName[]);

const HEX = "0123456789abcdef";

function hexOf(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += (HEX[byte >> 4] as string) + (HEX[byte & 15] as string);
  return text;
}

/** `DigestItem::Consensus` (4), then the engine id `MNSV`. */
const MNSV_PREFIX = [0x04, 0x4d, 0x4e, 0x53, 0x56] as const;

/** A well-formed `MNSV` item: the prefix, the SCALE length 4 (`0x10`) and the `u32` spec_version, little-endian. */
const MNSV_LENGTH = 10;

function isMnsvItem(item: Uint8Array): boolean {
  return MNSV_PREFIX.every((byte, index) => item[index] === byte);
}

function blockNamed(block: VersionedBlock): string {
  return `block ${block.height} (${hexOf(block.hash)})`;
}

/**
 * The `spec_version` of `block`'s `MNSV` digest. Throws `bad-version-digest` when the block has no `MNSV` item
 * (`reason: "missing"`), more than one (`"several"`, well formed or not), or one that is not a 4-byte `u32` payload
 * (`"malformed"`, with the item). [LG-1]
 */
export function mnsvSpecVersion(block: VersionedBlock): number {
  const items = block.digest.filter(isMnsvItem);
  const where = { height: block.height, hash: hexOf(block.hash) };
  if (items.length !== 1) {
    const reason = items.length === 0 ? "missing" : "several";
    throw new UmbraError(
      "bad-version-digest",
      `${blockNamed(block)} has ${items.length === 0 ? "no" : items.length} MNSV version digest${items.length === 0 ? "" : "s"}, ` +
        "where every block carries exactly one, naming the runtime that built it",
      { ...where, reason, items: items.length },
    );
  }
  const item = items[0] as Uint8Array;
  if (item.length !== MNSV_LENGTH || item[5] !== 0x10) {
    throw new UmbraError(
      "bad-version-digest",
      `${blockNamed(block)} has an MNSV version digest that is not a 4-byte spec_version: ${hexOf(item)}`,
      { ...where, reason: "malformed", items: 1, item: hexOf(item) },
    );
  }
  return new DataView(item.buffer, item.byteOffset, item.byteLength).getUint32(6, true);
}

/**
 * Checks `block` against every pin at its height: each must name its hash and `specVersion`. Throws `pin-mismatch`
 * naming the pin and what differs (`differs`: `hash`, `specVersion` or both). [LG-2]
 */
export function checkPins(pins: readonly LedgerPin[], block: VersionedBlock, specVersion: number): void {
  const hash = hexOf(block.hash);
  for (const pin of pins) {
    if (BigInt(pin.height) !== block.height) continue;
    const differs = [...(pin.hash === hash ? [] : ["hash"]), ...(pin.specVersion === specVersion ? [] : ["specVersion"])];
    if (differs.length === 0) continue;
    throw new UmbraError(
      "pin-mismatch",
      `${blockNamed(block)} with spec_version ${specVersion} contradicts the ledger table's pin of height ${pin.height}, ` +
        `the hash ${pin.hash} with spec_version ${pin.specVersion}: this is not the chain the table was made for`,
      { height: block.height, hash, specVersion, pin: { height: pin.height, hash: pin.hash, specVersion: pin.specVersion }, differs },
    );
  }
}

/**
 * The ledger of the single row covering `specVersion`. Throws `unknown-runtime` when no row covers it, or more than one
 * does (`details.rows` says how many). [LG-1]
 */
export function ledgerOfSpecVersion(rows: readonly LedgerRow[], block: VersionedBlock, specVersion: number): LedgerName {
  const covering = rows.filter((row) => row.specVersionMin <= specVersion && specVersion <= row.specVersionMax);
  if (covering.length !== 1) {
    throw new UmbraError(
      "unknown-runtime",
      covering.length === 0
        ? `${blockNamed(block)} was built by a runtime with spec_version ${specVersion}, which no row of the ledger ` +
            "table maps to a ledger version: this build does not know that runtime"
        : `${blockNamed(block)} has spec_version ${specVersion}, which ${covering.length === 2 ? "two rows" : `${covering.length} rows`} ` +
            "of the ledger table cover: a spec_version matches one row",
      { height: block.height, hash: hexOf(block.hash), specVersion, rows: covering.length },
    );
  }
  return (covering[0] as LedgerRow).ledger;
}

/** `block`'s ledger version in `table`: see the module comment. [LG-1, LG-2] */
export function selectLedgerVersion(table: LedgerTable, block: VersionedBlock): LedgerSelection {
  const specVersion = mnsvSpecVersion(block);
  checkPins(table.pins, block, specVersion);
  return Object.freeze({ specVersion, ledger: ledgerOfSpecVersion(table.rows, block, specVersion) });
}

// ---- the table in effect -------------------------------------------------------------------------------------------

/** True for a row whose bounds are spec_versions, the smaller first: the rows the table in effect is made of. */
function wellFormed(row: LedgerRow): boolean {
  return row.specVersionMin <= row.specVersionMax && row.specVersionMax <= U32_MAX;
}

/** The parts of `row` that no row of `own` (sorted by `specVersionMin`) covers. */
function uncovered(row: LedgerRow, own: readonly LedgerRow[]): LedgerRow[] {
  const parts: LedgerRow[] = [];
  let from = row.specVersionMin;
  for (const other of own) {
    if (other.specVersionMax < from) continue;
    if (other.specVersionMin > row.specVersionMax) break;
    if (other.specVersionMin > from) parts.push({ ...row, specVersionMin: from, specVersionMax: other.specVersionMin - 1 });
    from = other.specVersionMax + 1;
  }
  if (from <= row.specVersionMax) parts.push({ ...row, specVersionMin: from });
  return parts;
}

const freezeRow = (row: LedgerRow): LedgerRow =>
  Object.freeze({ specVersionMin: row.specVersionMin, specVersionMax: row.specVersionMax, ledger: row.ledger });
const freezePin = (pin: LedgerPin): LedgerPin =>
  Object.freeze({ height: pin.height, hash: pin.hash, specVersion: pin.specVersion });

/**
 * The table in effect, frozen: `configured` laid over `builtIn` (see the module comment). It never throws: a configured
 * row that is not well formed (bounds the wrong way round, or above {@link U32_MAX}) is left out, since the
 * configuration's rules reject it anyway. [LG-3]
 */
export function effectiveLedgerTable(builtIn: LedgerTable | null, configured: ConfiguredLedgerTable | undefined): LedgerTable {
  const own = (configured?.rows ?? []).filter(wellFormed).sort((a, b) => a.specVersionMin - b.specVersionMin);
  const rows = [...own, ...(builtIn?.rows ?? []).flatMap((row) => uncovered(row, own))].sort(
    (a, b) => a.specVersionMin - b.specVersionMin,
  );
  const ownPins = configured?.pins ?? [];
  const pins = [...ownPins, ...(builtIn?.pins ?? []).filter((pin) => !ownPins.some((mine) => mine.height === pin.height))].sort(
    (a, b) => a.height - b.height,
  );
  return Object.freeze({ rows: Object.freeze(rows.map(freezeRow)), pins: Object.freeze(pins.map(freezePin)) });
}

/** An issue of a configured table: its path inside `ledgerTable`, and what is wrong. */
export interface LedgerTableIssue {
  readonly path: readonly (string | number)[];
  readonly message: string;
}

const covers = (row: LedgerRow, specVersion: number): boolean =>
  row.specVersionMin <= specVersion && specVersion <= row.specVersionMax;

/**
 * The rules on the `core` entry's configured `ledgerTable` (the schema checks its shape), for a network whose built-in
 * table is `builtIn` (null when the file has none). Each issue's path is inside `ledgerTable`. The rules:
 * - every `spec_version` is at most {@link U32_MAX};
 * - a row's bounds come the smaller first;
 * - a row's ledger is one this build carries [LG-5, LG-6];
 * - no `spec_version` is in two configured rows;
 * - there is at most one pin per height;
 * - each pin's `spec_version` is covered by a row of the table in effect, or its block would halt;
 * - a network without a built-in table sets its own rows.
 *
 * [LG-1, LG-2, LG-3]
 */
export function ledgerTableIssues(builtIn: LedgerTable | null, configured: ConfiguredLedgerTable | undefined): LedgerTableIssue[] {
  const issues: LedgerTableIssue[] = [];
  const rows = configured?.rows ?? [];
  const pins = configured?.pins ?? [];
  const above = (value: number) =>
    `${value} is above ${U32_MAX}, the largest spec_version: a runtime's version is a u32`;
  rows.forEach((row, index) => {
    if (row.specVersionMin > U32_MAX) issues.push({ path: ["rows", index, "specVersionMin"], message: above(row.specVersionMin) });
    if (row.specVersionMax > U32_MAX) issues.push({ path: ["rows", index, "specVersionMax"], message: above(row.specVersionMax) });
    if (row.specVersionMin > row.specVersionMax) {
      issues.push({
        path: ["rows", index],
        message:
          `specVersionMin ${row.specVersionMin} is above specVersionMax ${row.specVersionMax}: a row's bounds are inclusive, ` +
          "the smaller first",
      });
    }
    if (!CARRIED_LEDGERS.includes(row.ledger)) {
      issues.push({
        path: ["rows", index, "ledger"],
        message: `this build carries no ledger ${row.ledger} adapter (it carries ${CARRIED_LEDGERS.join(", ")})`,
      });
    }
    const earlier = rows.findIndex(
      (other, before) =>
        before < index && wellFormed(other) && wellFormed(row) && other.specVersionMin <= row.specVersionMax && row.specVersionMin <= other.specVersionMax,
    );
    if (earlier !== -1) {
      const first = Math.max(row.specVersionMin, (rows[earlier] as LedgerRow).specVersionMin);
      issues.push({
        path: ["rows", index],
        message: `this row covers spec_version ${first}, which rows[${earlier}] covers too: a spec_version matches one row`,
      });
    }
  });
  const effective = effectiveLedgerTable(builtIn, configured);
  pins.forEach((pin, index) => {
    if (pin.specVersion > U32_MAX) {
      issues.push({ path: ["pins", index, "specVersion"], message: above(pin.specVersion) });
      return;
    }
    const earlier = pins.findIndex((other, before) => before < index && other.height === pin.height);
    if (earlier !== -1) {
      issues.push({
        path: ["pins", index, "height"],
        message: `pins[${earlier}] and pins[${index}] both name height ${pin.height}: one pin a height`,
      });
    }
    if (!effective.rows.some((row) => covers(row, pin.specVersion))) {
      issues.push({
        path: ["pins", index, "specVersion"],
        message:
          `no row covers spec_version ${pin.specVersion}: the block at height ${pin.height} would halt with ` +
          "unknown-runtime; add a row for it",
      });
    }
  });
  if (builtIn === null && rows.length === 0) {
    issues.push({
      path: configured === undefined ? [] : ["rows"],
      message:
        "a custom network sets its own ledger table: the built-in tables cover mainnet, preprod, preview and stagenet " +
        "only; give ledgerTable.rows, at least one row mapping its runtimes' spec_versions to ledger versions",
    });
  }
  return issues;
}
