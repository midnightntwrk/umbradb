/**
 * The configuration history (`openspec/changes/core-arch/specs/configuration/spec.md` CF-5 to CF-9; `design.md` §7,
 * §10; CORE-ARCH §4.12; decision records Q7, Q32, Q33, Q43): `core_chain.config` holds, per revision, its id, start,
 * stop, version and data fields, so that configuration changes only the future. This module is its pure part — what a
 * revision records, how the configuration is compared with the recorded rows, the version check, and what startup
 * passes on; the table, its reading and its writing are `core-chain`'s (`src/backbone/core-chain/history.ts`).
 *
 * **A revision's row (CF-7, {@link rowOf}):** keyed by `(id, start)`; `stop` as written, null when absent and always
 * for `core`, whose stop is operational (CF-4); `version`, a module's semver or the core version's canonical JSON
 * ({@link canonicalJson}: RFC 8785 on plain data — keys sorted by UTF-16 code units, no whitespace); `data`, the
 * revision's data fields — for a revision of the build's version its parsed settings of kind `data`, defaults applied,
 * for an earlier `versionEntry` its `config` as written, which must equal the recorded data (CF-3) — and `data_hash`,
 * SHA-256 of their canonical encoding (DT-1, {@link dataHash}), independent of property order. A scheduled revision (a
 * `versionEntry` above the cursor) records id, start, stop and version only: `data` and `data_hash` null.
 *
 * **Effective stops (CF-5):** a later revision of one id supersedes the earlier one from its start, so each revision's
 * last height is the next one's start − 1, or its own stop when that is lower (a gap: the module stops, and starts
 * again at the next revision, which MD-4 then checks). An own stop at or above the next start is superseded, as CF-5
 * reads; the core's own stop is operational and bounds no revision.
 *
 * **The checks ({@link HISTORY_RULES}),** run by {@link checkHistory} on the validated configuration, the cursor (null
 * on a new database), the build's declarations and the recorded rows, each finding every violation of its kind; the
 * first code with findings refuses startup with all of them:
 * 1. `missing-entry` (CF-5): every recorded row that starts at or below the cursor is listed by the configuration, by
 *    `(id, start)`; one that starts above it (any, on a new database) has affected no stored data and may be omitted —
 *    or moved, which omits its `(id, start)` and lists another — and is then deleted ({@link omissionAllowed},
 *    {@link HistoryCheck.deletes}; owner decision Q103, option B);
 * 2. `changes-past` (CF-6): an entry starting at or below the cursor c is recorded, with its version and every data
 *    field as recorded, and — for a module — its stop, unless both the recorded and the new stop are above c (no stop
 *    counts as above every c: {@link stopChangeAllowed}); operational and secret fields are never recorded, so they may
 *    change at any restart, the core's stop among them;
 * 3. `upgrade-required` (CF-8, Q43): for every entry, the revision covering c + 1 (S on a new database) names the
 *    build's version (`buildCoreVersion()` for `core`, the declaration's `version` for a module);
 * 4. `development-opt-in-required` (CF-9's configuration half): a `core` revision with `sweep: "off"` that runs above
 *    the cursor needs the development opt-in, which the process takes from its `core` revision (Q102, resolved A,
 *    `./process.ts`). PGlite's half is `openPglite`'s (`./database.ts`), a development-only module's the graph's
 *    (MD-5).
 *
 * Every check runs before any migration: the runner calls {@link checkHistory} after opening the database and reading
 * the cursor and the history, and before `resolveGraph` and `startDatabase` (CF-8: "before any `on-start-db`", A33: no
 * `core_chain.migrations` row added). `core-chain`'s `on-start-db` then runs it again on the rows its own transaction
 * reads, and in that transaction deletes its {@link HistoryCheck.deletes} and records its {@link HistoryCheck.writes}
 * (CF-5: "in the transaction that records the configuration"; CF-6: "in the same transaction as the comparison"): the
 * omitted rows above the cursor; every entry above the cursor that differs from its row or has none, and a module's
 * stop changed above the cursor. Messages name paths, entries, fields, versions and heights — never a setting's value.
 */

import { createHash } from "node:crypto";
import { UmbraError } from "../db/errors.js";
import { encodeCanonical } from "../determinism/cbor.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { EntryRange, GraphInput } from "../modules/graph.js";
import type { DeclarationSet } from "../modules/validation.js";
import { buildCoreVersion, type CoreVersion } from "./build.js";
import { CORE_ENTRY_ID } from "./entries.js";
import { pathOf, type PlainData, type PlainObject, samePlainData } from "./plain-data.js";
import { processCoreEntry } from "./process.js";
import {
  type CheckedConfig,
  type CheckedEntry,
  type EntryRef,
  entriesAtCursor,
  type Finding,
  type PlacedEntry,
} from "./validate.js";

/** A row of `core_chain.config` (CF-7, `design.md` §10). */
export interface HistoryRow {
  readonly id: string;
  readonly start: bigint;
  /** The stop as written; null when absent, and always for `core`. */
  readonly stop: bigint | null;
  /** A module's semver, or the core version's canonical JSON. */
  readonly version: string;
  /** The data fields; null for a scheduled revision (CF-3). */
  readonly data: PlainObject | null;
  /** SHA-256 of the data fields' canonical encoding; null with `data`. */
  readonly dataHash: Uint8Array | null;
}

/** The codes the history refuses with, in the order its checks run. */
export type HistoryCode = "missing-entry" | "changes-past" | "upgrade-required" | "development-opt-in-required";

const CODES: readonly HistoryCode[] = [
  "missing-entry",
  "changes-past",
  "upgrade-required",
  "development-opt-in-required",
];

/** One violation, as a configuration finding names it (`./validate.ts`), with its code and its facts. */
export interface HistoryFinding extends Finding {
  readonly code: HistoryCode;
  /** What the finding is about, as data: versions, stops, the entry a recorded row is — never a setting's value. */
  readonly about: Readonly<Record<string, unknown>>;
}

/** What the history's checks take. */
export interface HistoryInput {
  /** The validated configuration (`validateConfig`). */
  readonly config: CheckedConfig;
  /** The database's last committed height, or null on a new database, which has committed nothing. */
  readonly cursor: bigint | null;
  /** The build's validated declarations (`validateDeclarations`): the versions the build carries. */
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** The rows of `core_chain.config` (`readHistory`); none on a new database. */
  readonly history: readonly HistoryRow[];
}

/** What the rules check (see {@link HistoryRule}). */
export interface HistoryContext {
  readonly file: string | null;
  readonly cursor: bigint | null;
  /** The configuration's revisions, placed against the cursor (`entriesAtCursor`). */
  readonly entries: readonly PlacedEntry[];
  readonly history: readonly HistoryRow[];
  /** The first height this process would run: cursor + 1, or S on a new database (CF-8). */
  readonly next: bigint;
  /** The development opt-in of the process's `core` revision (Q102, resolved A). */
  readonly developmentOptIn: boolean;
  /** The recorded row of `entry`'s `(id, start)`. */
  recorded(entry: CheckedEntry): HistoryRow | undefined;
  /** Whether the configuration lists `row`'s `(id, start)`. */
  listed(row: HistoryRow): boolean;
  /** The version this build carries for `id`: the core version for `core`, the declaration's for a module. */
  build(id: string): string | CoreVersion | undefined;
  /** `entry`'s effective last height (CF-5), null for none. */
  last(entry: CheckedEntry): bigint | null;
  /** What `entry` records as its data fields ({@link recordedData}). */
  recordedData(entry: CheckedEntry): PlainObject | null;
  /** CF-6's allowance for a module's stop ({@link stopChangeAllowed}). */
  stopChangeAllowed(recorded: bigint | null, configured: bigint | null, cursor: bigint): boolean;
  /** CF-5's allowance for an omitted row ({@link omissionAllowed}). */
  omissionAllowed(row: HistoryRow, cursor: bigint | null): boolean;
}

/** One check of the history: its findings, in entry order. */
export interface HistoryRule {
  readonly name: string;
  readonly code: HistoryCode;
  check(context: HistoryContext): readonly HistoryFinding[];
}

/**
 * What {@link checkHistory} may be given besides its input — the rules, CF-6's two allowances and CF-5's, each
 * replaceable so that the negative controls can show what each one decides.
 */
export interface HistoryOptions {
  /** The rules to run; {@link HISTORY_RULES} unless given. */
  readonly rules?: readonly HistoryRule[];
  /** What a revision records as its data fields; {@link recordedData} unless given. */
  readonly recordedData?: (entry: CheckedEntry) => PlainObject | null;
  /** When a module's changed stop is accepted; {@link stopChangeAllowed} unless given. */
  readonly stopChangeAllowed?: (recorded: bigint | null, configured: bigint | null, cursor: bigint) => boolean;
  /** When a recorded row the configuration omits is deleted instead of refused; {@link omissionAllowed} unless given. */
  readonly omissionAllowed?: (row: HistoryRow, cursor: bigint | null) => boolean;
}

/** What startup goes on with once the history accepted the configuration. */
export interface HistoryCheck {
  /** S. */
  readonly start: bigint;
  readonly cursor: bigint | null;
  /** The configuration's revisions, placed against the cursor. */
  readonly entries: readonly PlacedEntry[];
  /** The `core` revision whose operational settings the process uses (Q102, resolved A). */
  readonly process: CheckedEntry;
  /** Its `developmentOptIn`. */
  readonly developmentOptIn: boolean;
  /** Every module revision with its effective stop (CF-5): `resolveGraph`'s `entries` ({@link graphInputOf}). */
  readonly graphEntries: readonly EntryRange[];
  /** For DB-10 (`startDatabase`): per module, the versions of its recorded revisions that cover S..cursor. */
  readonly committedVersions: ReadonlyMap<string, readonly string[]>;
  /** The rows `core-chain` records, each inserted or replacing the row of its `(id, start)`. */
  readonly writes: readonly HistoryRow[];
  /**
   * The recorded rows `core-chain` deletes, in the transaction that records the writes: those the configuration omits
   * that start above the cursor (CF-5, Q103 B), as read. None of them has a `(id, start)` among the writes.
   */
  readonly deletes: readonly HistoryRow[];
}

/** The canonical JSON of plain data (RFC 8785 for this subset): keys sorted by UTF-16 code units, no whitespace. */
export function canonicalJson(value: PlainData): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((element) => canonicalJson(element)).join(",")}]`;
  const object = value as PlainObject;
  const members = Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(object[key] as PlainData)}`);
  return `{${members.join(",")}}`;
}

/** `data_hash` (CF-7): SHA-256 of the canonical encoding (DT-1) of a revision's data fields. */
export function dataHash(data: PlainObject): Uint8Array {
  return new Uint8Array(createHash("sha256").update(encodeCanonical(data)).digest());
}

/** A revision's version as `core_chain.config.version` holds it: a module's semver, or the core version's JSON. */
export function versionText(version: string | CoreVersion): string {
  return typeof version === "string" ? version : canonicalJson(version);
}

/**
 * What a revision records as its data fields (CF-3, CF-4): for the build's version its settings of kind `data`, every
 * default applied; otherwise its `config` as written (an earlier revision's recorded data), or null for a scheduled
 * one.
 */
export function recordedData(entry: CheckedEntry): PlainObject | null {
  return entry.buildVersion ? entry.data : entry.settings;
}

/** The stop a revision has of its own: a module's as written, none for `core` (its stop is operational, CF-4). */
const ownStop = (entry: CheckedEntry): bigint | null =>
  entry.id === CORE_ENTRY_ID || entry.stop === null ? null : BigInt(entry.stop);

/** The row of `core_chain.config` that `entry` records (CF-7). */
export function rowOf(
  entry: CheckedEntry,
  dataOf: (entry: CheckedEntry) => PlainObject | null = recordedData,
): HistoryRow {
  const data = dataOf(entry);
  return Object.freeze({
    id: entry.id,
    start: BigInt(entry.start),
    stop: ownStop(entry),
    version: versionText(entry.version),
    data,
    dataHash: data === null ? null : dataHash(data),
  });
}

/** A revision's id and heights. */
interface Span {
  readonly id: string;
  readonly start: bigint;
  readonly stop: bigint | null;
}

const lower = (a: bigint | null, b: bigint | null): bigint | null => (a === null ? b : b === null || a < b ? a : b);

/** Each item's last height (CF-5): its own stop, or the next start − 1 of its id when that is lower. */
function lastHeights<T>(items: readonly T[], span: (item: T) => Span): Map<T, bigint | null> {
  const byId = new Map<string, { readonly item: T; readonly span: Span }[]>();
  for (const item of items) {
    const of = span(item);
    byId.set(of.id, [...(byId.get(of.id) ?? []), { item, span: of }]);
  }
  const last = new Map<T, bigint | null>();
  for (const list of byId.values()) {
    list.sort((a, b) => (a.span.start < b.span.start ? -1 : 1));
    list.forEach(({ item, span: of }, index) => {
      const next = list[index + 1];
      last.set(item, lower(of.stop, next === undefined ? null : next.span.start - 1n));
    });
  }
  return last;
}

const spanOf = (entry: CheckedEntry): Span => ({ id: entry.id, start: BigInt(entry.start), stop: ownStop(entry) });

/**
 * `resolveGraph`'s `entries` (3.2's note (a)): every module revision — never the core's — with its effective stop, in
 * the configuration's order. A scheduled revision is among them, judged by this build's declaration, the only one it
 * has: the build stops before it starts (RN-12), and the build carrying its version checks it again.
 */
export function graphEntries(entries: readonly CheckedEntry[]): EntryRange[] {
  const last = lastHeights(entries, spanOf);
  return entries
    .filter((entry) => entry.id !== CORE_ENTRY_ID)
    .map((entry) => Object.freeze({ id: entry.id, start: BigInt(entry.start), stop: last.get(entry) ?? null }));
}

const covers = (start: bigint, last: bigint | null, height: bigint): boolean =>
  start <= height && (last === null || height <= last);

/** The revision of `id` covering `height` (CF-5: a later revision supersedes from its start), or undefined. */
export function revisionAt<E extends CheckedEntry>(entries: readonly E[], id: string, height: bigint): E | undefined {
  const own = entries.filter((entry) => entry.id === id);
  const last = lastHeights(own, spanOf);
  return own.find((entry) => covers(BigInt(entry.start), last.get(entry) ?? null, height));
}

/**
 * DB-10's input (`startDatabase`'s `committedVersions`, task 2.4's note (f)): per module id, the versions of its
 * recorded revisions whose range — start to its last height (CF-5) — meets the committed heights S..cursor, in start
 * order; none on a new database. The `core` entry's versions are not module versions.
 */
export function committedVersions(
  history: readonly HistoryRow[],
  start: bigint,
  cursor: bigint | null,
): ReadonlyMap<string, readonly string[]> {
  const versions = new Map<string, string[]>();
  if (cursor === null) return versions;
  const rows = history
    .filter((row) => row.id !== CORE_ENTRY_ID)
    .sort((a, b) => (a.id === b.id ? (a.start < b.start ? -1 : 1) : a.id < b.id ? -1 : 1));
  const last = lastHeights(rows, (row) => row);
  for (const row of rows) {
    const end = last.get(row) ?? null;
    if (row.start > cursor || (end !== null && end < start)) continue;
    const list = versions.get(row.id) ?? [];
    if (!list.includes(row.version)) list.push(row.version);
    versions.set(row.id, list);
  }
  return versions;
}

/**
 * CF-6's allowance for a module's stop: a changed stop is accepted when both the recorded and the new one are above the
 * cursor — no stop counts as above every cursor — since then the change affects only heights not yet processed.
 */
export function stopChangeAllowed(recorded: bigint | null, configured: bigint | null, cursor: bigint): boolean {
  const above = (stop: bigint | null) => stop === null || stop > cursor;
  return above(recorded) && above(configured);
}

/**
 * CF-5's allowance for an omitted row (owner decision Q103, option B): a recorded row the configuration no longer lists
 * is deleted, not refused, when it starts above the cursor — or nothing has committed (a null cursor) —, since no
 * stored data was processed with it.
 */
export function omissionAllowed(row: HistoryRow, cursor: bigint | null): boolean {
  return cursor === null || row.start > cursor;
}

/** How a finding names `entry`: its position, id and start. */
const refOf = (entry: CheckedEntry): EntryRef =>
  Object.freeze({ index: entry.index, id: entry.id, start: entry.start });

/** A finding at `path` in `entry` (null: the top level), its message prefixed with the path and the entry. */
function finding(
  rule: string,
  code: HistoryCode,
  path: string,
  entry: CheckedEntry | null,
  field: string | null,
  detail: string,
  about: Readonly<Record<string, unknown>> = {},
): HistoryFinding {
  const where = entry === null ? "" : ` (${entry.id} from ${entry.start})`;
  const ref = entry === null ? null : refOf(entry);
  const message = `${path}${where}: ${detail}`;
  return Object.freeze({ rule, code, path, entry: ref, field, message, about: Object.freeze(about) });
}

/** How a message names the cursor of an entry starting at or below it. */
const atOrBelow = (context: HistoryContext): string => `the revision starts at or below the cursor ${context.cursor}`;

/** A stop for a message. */
const stopText = (stop: bigint | null): string => (stop === null ? "no stop" : String(stop));

const asNumber = (height: bigint | null): number | null => (height === null ? null : Number(height));

/** `object`'s own value of `field`; absent (undefined) never equals a value, so a missing field differs. */
const own = (object: PlainObject, field: string): PlainData =>
  (Object.hasOwn(object, field) ? object[field] : undefined) as PlainData;

/** The started entries with their recorded rows. */
const startedRows = (context: HistoryContext) =>
  context.entries.flatMap((entry) => {
    const row = entry.started ? context.recorded(entry) : undefined;
    return row === undefined ? [] : [{ entry, row }];
  });

/** The history's checks, in the order their codes refuse (see the module comment). */
export const HISTORY_RULES: readonly HistoryRule[] = Object.freeze([
  {
    name: "listed",
    code: "missing-entry",
    check: (context) =>
      context.history
        .filter((row) => !context.listed(row) && !context.omissionAllowed(row, context.cursor))
        .map((row) => {
          const build = context.build(row.id);
          const hint =
            build === undefined
              ? `this build has no module ${row.id}, so no configuration of it can list the entry: run a build that ` +
                `carries ${row.id}`
              : row.data === null
                ? `list it as recorded, a scheduled revision: versionEntry({ id: "${row.id}", start: ${row.start}, ` +
                  `version${row.stop === null ? "" : `, stop: ${row.stop}`} }) with its recorded version`
                : row.version === versionText(build)
                  ? "list it as recorded, with its builder and the settings it was recorded with"
                  : "list it as recorded: versionEntry({ id, start, version, config }) with its recorded version and " +
                    "data";
          return finding(
            "listed",
            "missing-entry",
            "entries",
            null,
            null,
            `the history records ${row.id} from ${row.start} (version ${row.version}), which the configuration does ` +
              "not list: an entry is identified by its id and start, and the configuration lists every entry the " +
              `history records that starts at or below the cursor ${context.cursor}, since the heights up to the ` +
              "cursor were processed with it (CF-5; one that starts above the cursor may be omitted or moved, " +
              `decision record Q103); ${hint}`,
            { id: row.id, start: Number(row.start), version: row.version },
          );
        }),
  },
  {
    name: "recorded",
    code: "changes-past",
    check: (context) =>
      context.entries
        .filter((entry) => entry.started && context.recorded(entry) === undefined)
        .map((entry) =>
          finding(
            "recorded",
            "changes-past",
            `entries[${entry.index}]`,
            entry,
            null,
            `${atOrBelow(context)}, and the history records no such entry: the heights up to the cursor were ` +
              "processed without it, and the past cannot change (CF-6); start it above the cursor, or resync into a " +
              "new database",
          ),
        ),
  },
  {
    name: "version",
    code: "changes-past",
    check: (context) =>
      startedRows(context).flatMap(({ entry, row }) => {
        const configured = versionText(entry.version);
        if (configured === row.version) return [];
        return [
          finding(
            "version",
            "changes-past",
            `entries[${entry.index}].version`,
            entry,
            "version",
            `${atOrBelow(context)} and names version ${configured}, where the history records ${row.version}: the ` +
              "heights up to the cursor were processed by that version, and the past cannot change (CF-6); write the " +
              "revision as recorded — versionEntry({ id, start, version, config }) with its recorded version and " +
              "data — and add the new version as a revision from above the cursor, or resync into a new database",
            { recorded: row.version, configured },
          ),
        ];
      }),
  },
  {
    name: "data",
    code: "changes-past",
    check: (context) =>
      startedRows(context).flatMap(({ entry, row }) => {
        const base = `entries[${entry.index}].config`;
        const configured = context.recordedData(entry);
        if (row.data === null || configured === null) {
          return [
            finding(
              "data",
              "changes-past",
              base,
              entry,
              null,
              `${atOrBelow(context)}, and the history records no data for it (it was recorded as a scheduled ` +
                "revision, and no build recorded its settings before its start): its data cannot be compared, so the " +
                "past cannot be shown unchanged (CF-3, CF-6); resync into a new database",
            ),
          ];
        }
        const recorded = row.data;
        const only = Object.keys(recorded).filter((key) => !Object.hasOwn(configured, key));
        const fields = [...Object.keys(configured), ...only];
        return fields
          .filter((field) => !samePlainData(own(configured, field), own(recorded, field)))
          .map((field) => {
            const how = !Object.hasOwn(recorded, field)
              ? "the history records no such data field"
              : !Object.hasOwn(configured, field)
                ? "the history records this data field, which the configuration does not give"
                : "this data field differs from the history's";
            return finding(
              "data",
              "changes-past",
              pathOf(base, field),
              entry,
              field,
              `${atOrBelow(context)}, and ${how}: the heights up to the cursor were processed with the recorded ` +
                "data, and the past cannot change (CF-6); write it as recorded, and put the change in a new revision " +
                "from above the cursor, or resync into a new database",
            );
          });
      }),
  },
  {
    name: "stop",
    code: "changes-past",
    check: (context) =>
      startedRows(context).flatMap(({ entry, row }) => {
        // A core revision's own stop is null, as its row's is (its stop is operational): never compared.
        const configured = ownStop(entry);
        if (configured === row.stop) return [];
        if (context.stopChangeAllowed(row.stop, configured, context.cursor as bigint)) return [];
        return [
          finding(
            "stop",
            "changes-past",
            `entries[${entry.index}].stop`,
            entry,
            "stop",
            `${atOrBelow(context)}, and its stop changes from ${stopText(row.stop)} to ${stopText(configured)}: a ` +
              "module's stop may change only while both the recorded and the new stop are above the cursor, since " +
              "the heights up to the cursor were processed with the recorded one (CF-6); write the recorded stop",
            { recorded: asNumber(row.stop), configured: asNumber(configured) },
          ),
        ];
      }),
  },
  {
    name: "build-version",
    code: "upgrade-required",
    check: (context) =>
      context.entries.flatMap((entry) => {
        if (entry.buildVersion || !covers(BigInt(entry.start), context.last(entry), context.next)) return [];
        const build = context.build(entry.id) as string | CoreVersion;
        const height =
          context.cursor === null
            ? `S, the first height of a new database (${context.next})`
            : `cursor + 1 (${context.next}), the first height this process would run`;
        return [
          finding(
            "build-version",
            "upgrade-required",
            `entries[${entry.index}].version`,
            entry,
            "version",
            `the revision covering ${height} names version ${versionText(entry.version)}, and this build carries ` +
              `${versionText(build)}: a build runs only the versions it carries (CF-8, decision record Q43); run the ` +
              `build that carries ${versionText(entry.version)} until it stops where the revision ends, or schedule ` +
              "this build's version as a revision from a height above the cursor",
            { id: entry.id, start: entry.start, needed: entry.version, build, height: context.next },
          ),
        ];
      }),
  },
  {
    name: "sweep-off",
    code: "development-opt-in-required",
    check: (context) =>
      context.entries.flatMap((entry) => {
        const last = context.last(entry);
        const runs = context.cursor === null || last === null || last > context.cursor;
        const off = entry.id === CORE_ENTRY_ID && entry.settings?.sweep === "off";
        if (context.developmentOptIn || !off || !runs) return [];
        return [
          finding(
            "sweep-off",
            "development-opt-in-required",
            pathOf(`entries[${entry.index}].config`, "sweep"),
            entry,
            "sweep",
            'sweep: "off" is a development-only feature, and the process\'s core revision does not set ' +
              "developmentOptIn: true: development-only features run only under the development opt-in (CF-9); set " +
              "developmentOptIn: true in the latest core revision of this build (decision record Q102) for " +
              "development, or keep the sweep on",
          ),
        ];
      }),
  },
]);

/** `groups` flattened and sorted by entry (the top level first), each entry's in the rules' order. */
function ordered(groups: readonly (readonly HistoryFinding[])[]): HistoryFinding[] {
  const rank = (found: HistoryFinding): number => (found.entry === null ? -1 : found.entry.index);
  return groups.flat().sort((a, b) => rank(a) - rank(b));
}

/** A key of `(id, start)`. */
const keyOf = (id: string, start: bigint): string => `${id}\u0000${start}`;

/** What the rules check, from the input; throws the caller's errors and the cursor's refusals of the configuration. */
function contextOf(input: HistoryInput, options: HistoryOptions): HistoryContext {
  const { config, cursor } = input;
  if (cursor !== null && typeof cursor !== "bigint") {
    throw new Error(
      `checkHistory: the cursor ${String(cursor)} is neither null (a new database) nor a height (a bigint): the ` +
        "runner passes the blocks table's last committed height, read after opening the database",
    );
  }
  const start = BigInt(config.start);
  if (cursor !== null && cursor < start) {
    throw new Error(
      `checkHistory: the cursor ${cursor} is below S (${start}): the first commit is at S, so the last committed ` +
        "height is at least S, and a database that has committed nothing has the cursor null",
    );
  }
  const entries = entriesAtCursor(config, cursor);
  const process = processCoreEntry(config);
  const rows = new Map(input.history.map((row) => [keyOf(row.id, row.start), row]));
  const listed = new Set(entries.map((entry) => keyOf(entry.id, BigInt(entry.start))));
  const builds = new Map<string, string | CoreVersion>([[CORE_ENTRY_ID, buildCoreVersion()]]);
  for (const declaration of [...input.declarations.core, ...input.declarations.user]) {
    builds.set(declaration.id, declaration.version);
  }
  const last = lastHeights(entries, spanOf);
  return {
    file: config.file,
    cursor,
    entries,
    history: input.history,
    next: cursor === null ? start : cursor + 1n,
    developmentOptIn: process.settings?.developmentOptIn === true,
    recorded: (entry) => rows.get(keyOf(entry.id, BigInt(entry.start))),
    listed: (row) => listed.has(keyOf(row.id, row.start)),
    build: (id) => builds.get(id),
    last: (entry) => last.get(entry as PlacedEntry) ?? null,
    recordedData: options.recordedData ?? recordedData,
    stopChangeAllowed: options.stopChangeAllowed ?? stopChangeAllowed,
    omissionAllowed: options.omissionAllowed ?? omissionAllowed,
  };
}

/** The findings of `options.rules` (every rule unless given) for `input`, in entry order, without refusing. */
export function historyFindings(input: HistoryInput, options: HistoryOptions = {}): HistoryFinding[] {
  const context = contextOf(input, options);
  return ordered((options.rules ?? HISTORY_RULES).map((rule) => rule.check(context)));
}

/** The refusal of `findings`, all of one code. */
function refusal(code: HistoryCode, findings: readonly HistoryFinding[], context: HistoryContext): UmbraError {
  const where = context.file === null ? "the configuration" : `the configuration ${context.file}`;
  const what = {
    "missing-entry": "omits entries the history records at or below the cursor (CF-5)",
    "changes-past": "changes the past (CF-6)",
    "upgrade-required": "needs another build (CF-8)",
    "development-opt-in-required": "uses a development-only feature without the development opt-in (CF-9)",
  }[code];
  const base = { file: context.file, cursor: context.cursor, findings: Object.freeze([...findings]) };
  const extra =
    code === "missing-entry"
      ? { missing: findings.map(({ about: { id, start } }) => Object.freeze({ id, start })) }
      : code === "upgrade-required"
        ? {
            height: context.next,
            entries: findings.map(({ about: { id, start, needed, build } }) =>
              Object.freeze({ id, start, needed, build }),
            ),
          }
        : code === "development-opt-in-required"
          ? { feature: "sweep-off" }
          : {};
  const message = `${where} ${what}: ${findings.map((found) => found.message).join("; ")}`;
  return new UmbraError(code, message, { ...extra, ...base });
}

/**
 * Checks the configuration against the history at the cursor (see the module comment) and returns what startup goes on
 * with; throws the first code with findings (`missing-entry`, `changes-past`, `upgrade-required`,
 * `development-opt-in-required`; not retryable) with every finding of it in `details.findings` — and, before any rule,
 * `entriesAtCursor`'s and `processCoreEntry`'s `invalid-configuration`, and an `Error` for a cursor that is no height
 * or is below S (the caller's error).
 */
export function checkHistory(input: HistoryInput, options: HistoryOptions = {}): HistoryCheck {
  const context = contextOf(input, options);
  const rules = options.rules ?? HISTORY_RULES;
  for (const code of CODES) {
    const findings = ordered(rules.filter((rule) => rule.code === code).map((rule) => rule.check(context)));
    if (findings.length > 0) throw refusal(code, findings, context);
  }
  const writes = context.entries.flatMap((entry): HistoryRow[] => {
    const row = rowOf(entry, context.recordedData);
    const recorded = context.recorded(entry);
    if (entry.started) {
      // As recorded (the rules saw to it), but for a module's stop changed above the cursor: that is re-recorded.
      const restopped = recorded !== undefined && recorded.stop !== row.stop;
      return restopped ? [Object.freeze({ ...recorded, stop: row.stop })] : [];
    }
    return recorded !== undefined && sameRow(recorded, row) ? [] : [row];
  });
  // Every omitted row the listed rule did not refuse (CF-5, Q103 B).
  const deletes = context.history.filter((row) => !context.listed(row) && context.omissionAllowed(row, context.cursor));
  const process = processCoreEntry(input.config);
  return Object.freeze({
    start: BigInt(input.config.start),
    cursor: input.cursor,
    entries: context.entries,
    process,
    developmentOptIn: context.developmentOptIn,
    graphEntries: Object.freeze(graphEntries(context.entries)),
    committedVersions: committedVersions(input.history, BigInt(input.config.start), input.cursor),
    writes: Object.freeze(writes),
    deletes: Object.freeze(deletes),
  });
}

/** Two rows record the same: stop, version and data (the hash follows from the data). */
function sameRow(a: HistoryRow, b: HistoryRow): boolean {
  const data = a.data === null || b.data === null ? a.data === b.data : samePlainData(a.data, b.data);
  return a.stop === b.stop && a.version === b.version && data;
}

/** `resolveGraph`'s input from a history check and the build's declarations (3.2's note (a), 3.2a's (a)). */
export function graphInputOf(check: HistoryCheck, declarations: DeclarationSet<ModuleDeclaration>): GraphInput {
  return {
    declarations,
    start: check.start,
    entries: check.graphEntries,
    developmentOptIn: check.developmentOptIn,
    cursor: check.cursor,
  };
}
