/**
 * The ledger version table and each block's ledger version (`openspec/changes/core-arch/specs/ledger/spec.md` LG-1,
 * LG-2, LG-3; `design.md` §5, §11; CORE-ARCH §4.8; task 12.2).
 *
 * **Selection (LG-1, LG-2).** A block's ledger version is the row covering the `spec_version` of its `MNSV` digest:
 * the one `DigestItem::Consensus(*b"MNSV", spec_version.encode())` the node's version pallet deposits in every block,
 * block 0 included (`midnight-node` `pallets/version/src/lib.rs`), read as the node reads it — a Consensus item only, a
 * PreRuntime or Seal item with that engine is not it. {@link selectLedgerVersion} checks, in this order: exactly one
 * well-formed `MNSV` item (`bad-version-digest`: `missing`, `several` or `malformed`); every pin at the block's height
 * (`pin-mismatch`, naming what differs, the hash or the `spec_version`); exactly one row covering the version
 * (`unknown-runtime`, `details.rows` the number of rows that cover it: 0, or 2 and more in a table the configuration's
 * rules did not check). Each is a typed `UmbraError` the finalized loop turns into the halt of `design.md` §11 (task
 * 5.4), never retryable. Rows alone choose the ledger; pins only check. The node's `midnight_ledgerVersion` is not
 * read.
 *
 * **The table in effect (LG-3).** The `core` entry's `ledgerTable` adds to or replaces parts of the network's built-in
 * table (`./networks.json`): a configured row maps the `spec_version`s it covers, and the built-in rows map the rest —
 * cut around the configured rows where they overlap them — so a configured row never leaves a version the built-in
 * rows covered unmapped; a configured pin replaces the built-in pin at its height, and adds one at any other. A network
 * with no built-in table (`custom`) has only its configured rows and pins. The rows are ordered by `specVersionMin`,
 * the pins by height. The `core` schema gives this table in effect as the revision's `ledgerTable`
 * (`../config/core-settings.ts`), so the history records it (CF-7: every default applied), and checks
 * {@link ledgerTableIssues}' rules on a configured table first.
 *
 * Pure: no Node.js import, so the browser build (task 16.1) uses it as it is.
 */

import { UmbraError } from "../db/errors.js";
import type { LedgerName } from "./types.js";
import { LEDGER_RELEASES } from "./releases.js";

/** The largest `spec_version`: a runtime's version is a `u32` (LG-1's inclusive bounds). */
export const U32_MAX = 4_294_967_295;

/** A row of the ledger version table: the `spec_version`s from `specVersionMin` to `specVersionMax`, both included. */
export interface LedgerRow {
  readonly specVersionMin: number;
  readonly specVersionMax: number;
  readonly ledger: LedgerName;
}

/** A pin: the block at `height` has the hash `hash` (`0x` hex) and carries `specVersion` in its `MNSV` digest (LG-2). */
export interface LedgerPin {
  readonly height: number;
  readonly hash: string;
  readonly specVersion: number;
}

/** A ledger version table: its rows and its pins (LG-1, LG-2); the `ledger-table` process item is one. */
export interface LedgerTable {
  readonly rows: readonly LedgerRow[];
  readonly pins: readonly LedgerPin[];
}

/** The `core` entry's `ledgerTable` as configured (CF-4): rows and pins added to, or replacing, the built-in ones. */
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
 * The `spec_version` of `block`'s `MNSV` digest (LG-1). Throws `bad-version-digest` when the block has no `MNSV`
 * item (`reason: "missing"`), more than one (`"several"`, well formed or not), or one that is not a 4-byte `u32`
 * payload (`"malformed"`, with the item).
 */
export function mnsvSpecVersion(block: VersionedBlock): number {
  const items = block.digest.filter(isMnsvItem);
  const where = { height: block.height, hash: hexOf(block.hash) };
  if (items.length !== 1) {
    const reason = items.length === 0 ? "missing" : "several";
    throw new UmbraError(
      "bad-version-digest",
      `${blockNamed(block)} has ${items.length === 0 ? "no" : items.length} MNSV version digest${items.length === 0 ? "" : "s"}, ` +
        "where every block carries exactly one, naming the runtime that built it (LG-1)",
      { ...where, reason, items: items.length },
    );
  }
  const item = items[0] as Uint8Array;
  if (item.length !== MNSV_LENGTH || item[5] !== 0x10) {
    throw new UmbraError(
      "bad-version-digest",
      `${blockNamed(block)} has an MNSV version digest that is not a 4-byte spec_version: ${hexOf(item)} (LG-1)`,
      { ...where, reason: "malformed", items: 1, item: hexOf(item) },
    );
  }
  return new DataView(item.buffer, item.byteOffset, item.byteLength).getUint32(6, true);
}

/**
 * Checks `block` against every pin at its height (LG-2): each must name its hash and `specVersion`. Throws
 * `pin-mismatch` naming the pin and what differs (`differs`: `hash`, `specVersion` or both).
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
        `the hash ${pin.hash} with spec_version ${pin.specVersion} (LG-2): this is not the chain the table was made for`,
      { height: block.height, hash, specVersion, pin: { height: pin.height, hash: pin.hash, specVersion: pin.specVersion }, differs },
    );
  }
}

/**
 * The ledger of the one row covering `specVersion` (LG-1). Throws `unknown-runtime` when no row covers it, or more
 * than one does (`details.rows` how many).
 */
export function ledgerOfSpecVersion(rows: readonly LedgerRow[], block: VersionedBlock, specVersion: number): LedgerName {
  const covering = rows.filter((row) => row.specVersionMin <= specVersion && specVersion <= row.specVersionMax);
  if (covering.length !== 1) {
    throw new UmbraError(
      "unknown-runtime",
      covering.length === 0
        ? `${blockNamed(block)} was built by a runtime with spec_version ${specVersion}, which no row of the ledger ` +
            "table maps to a ledger version (LG-1): this build does not know that runtime"
        : `${blockNamed(block)} has spec_version ${specVersion}, which ${covering.length === 2 ? "two rows" : `${covering.length} rows`} ` +
            "of the ledger table cover (LG-1): a spec_version matches one row",
      { height: block.height, hash: hexOf(block.hash), specVersion, rows: covering.length },
    );
  }
  return (covering[0] as LedgerRow).ledger;
}

/** `block`'s ledger version in `table` (LG-1, LG-2): see the module comment. */
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
 * The table in effect (LG-3): `configured` over `builtIn` — see the module comment — frozen. Total: a configured row
 * that is not well formed (bounds the wrong way round or above {@link U32_MAX}) is left out, since the configuration's
 * rules refuse it anyway.
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
 * LG-1 to LG-3's rules on the `core` entry's configured `ledgerTable` (its shape is the schema's), for a network whose
 * built-in table is `builtIn` (null when the file has none): every `spec_version` at most {@link U32_MAX}; a row's
 * bounds the smaller first; a row's ledger one this build carries; no `spec_version` in two configured rows; one pin a
 * height; each pin's `spec_version` covered by a row of the table in effect (else its block would halt); and a network
 * without a built-in table sets its own rows. Each issue's path is inside `ledgerTable`.
 */
export function ledgerTableIssues(builtIn: LedgerTable | null, configured: ConfiguredLedgerTable | undefined): LedgerTableIssue[] {
  const issues: LedgerTableIssue[] = [];
  const rows = configured?.rows ?? [];
  const pins = configured?.pins ?? [];
  const above = (value: number) =>
    `${value} is above ${U32_MAX}, the largest spec_version: a runtime's version is a u32 (LG-1)`;
  rows.forEach((row, index) => {
    if (row.specVersionMin > U32_MAX) issues.push({ path: ["rows", index, "specVersionMin"], message: above(row.specVersionMin) });
    if (row.specVersionMax > U32_MAX) issues.push({ path: ["rows", index, "specVersionMax"], message: above(row.specVersionMax) });
    if (row.specVersionMin > row.specVersionMax) {
      issues.push({
        path: ["rows", index],
        message:
          `specVersionMin ${row.specVersionMin} is above specVersionMax ${row.specVersionMax}: a row's bounds are inclusive, ` +
          "the smaller first (LG-1)",
      });
    }
    if (!CARRIED_LEDGERS.includes(row.ledger)) {
      issues.push({
        path: ["rows", index, "ledger"],
        message: `this build carries no ledger ${row.ledger} adapter (it carries ${CARRIED_LEDGERS.join(", ")}; LG-5, LG-6)`,
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
        message: `this row covers spec_version ${first}, which rows[${earlier}] covers too: a spec_version matches one row (LG-1)`,
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
        message: `pins[${earlier}] and pins[${index}] both name height ${pin.height}: one pin a height (LG-2)`,
      });
    }
    if (!effective.rows.some((row) => covers(row, pin.specVersion))) {
      issues.push({
        path: ["pins", index, "specVersion"],
        message:
          `no row covers spec_version ${pin.specVersion}: the block at height ${pin.height} would halt with ` +
          "unknown-runtime (LG-1, LG-2); add a row for it",
      });
    }
  });
  if (builtIn === null && rows.length === 0) {
    issues.push({
      path: configured === undefined ? [] : ["rows"],
      message:
        "a custom network sets its own ledger table: the built-in tables cover mainnet, preprod, preview and stagenet " +
        "only (LG-3); give ledgerTable.rows, at least one row mapping its runtimes' spec_versions to ledger versions",
    });
  }
  return issues;
}
