/**
 * A recorded history file: the `core_chain.config` rows of a database at one committed height, written by `umbradb
 * restore` (from a backup's manifest) and `umbradb history export` (from a database). A configuration that names it
 * (`history`) lists only what it runs now: the file supplies every revision up to its height, and the configuration's
 * entries take over from the height after it ({@link withRecordedHistory}).
 */

import { UmbraError } from "../db/errors.js";
import { buildCoreVersion } from "./build.js";
import { CORE_ENTRY_ID } from "./entries.js";
import { versionText } from "./history.js";
import { type PlainData, type PlainObject, samePlainData } from "./plain-data.js";
import type { CheckedConfig, CheckedEntry } from "./validate.js";

/** The one format this build writes and reads. */
export const HISTORY_FILE_FORMAT = 1;

/** A `core_chain.config` row as the file holds it: heights as decimal text, the version as recorded. */
export interface RecordedRevision {
  readonly id: string;
  readonly start: string;
  readonly stop: string | null;
  readonly version: string;
  readonly data: PlainObject | null;
}

/** A database's revisions at its committed height. */
export interface RecordedHistory {
  readonly height: string;
  readonly revisions: readonly RecordedRevision[];
}

const HEIGHT = /^(0|[1-9][0-9]*)$/;

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** The file's text. */
export function historyFileText(history: RecordedHistory): string {
  const revisions = history.revisions.map(({ id, start, stop, version, data }) => ({ id, start, stop, version, data }));
  return `${JSON.stringify({ format: HISTORY_FILE_FORMAT, height: history.height, revisions }, null, 1)}\n`;
}

/** Whether two histories hold the same height and revisions. */
export function sameHistory(a: RecordedHistory, b: RecordedHistory): boolean {
  return historyFileText(a) === historyFileText(b);
}

/** `invalid-configuration` (`history-file-invalid`) for the file at `file`. */
function invalid(file: string, why: string): UmbraError {
  return new UmbraError(
    "invalid-configuration",
    `the history file ${file} cannot be read: ${why}. It is written by umbradb restore or umbradb history export`,
    { file, reason: "history-file-invalid" },
  );
}

/** The history the text of the file at `file` holds; `invalid-configuration` when it is malformed. */
export function parseHistoryFile(text: string, file: string): RecordedHistory {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw invalid(file, "it is not JSON");
  }
  if (!isObject(value)) throw invalid(file, "it is not a JSON object");
  if (value.format !== HISTORY_FILE_FORMAT) throw invalid(file, `its format is not ${HISTORY_FILE_FORMAT}`);
  if (typeof value.height !== "string" || !HEIGHT.test(value.height)) throw invalid(file, "its height is malformed");
  const revisions = value.revisions;
  const valid =
    Array.isArray(revisions) &&
    revisions.every(
      (row) =>
        isObject(row) &&
        typeof row.id === "string" &&
        typeof row.start === "string" &&
        HEIGHT.test(row.start) &&
        (row.stop === null || (typeof row.stop === "string" && HEIGHT.test(row.stop))) &&
        typeof row.version === "string" &&
        (row.data === null || isObject(row.data)),
    );
  if (!valid) throw invalid(file, "its revisions are malformed");
  return Object.freeze({ height: value.height, revisions: Object.freeze(revisions as RecordedRevision[]) });
}

/** An entry's heights as the configuration writes them: `stop` left out when null. */
function heights(start: bigint, stop: bigint | null): PlainObject {
  return stop === null ? { start: Number(start) } : { start: Number(start), stop: Number(stop) };
}

/** `entry` without its `stop`. */
function withoutStop(entry: PlainObject): PlainObject {
  const { stop: _stop, ...rest } = entry;
  return rest;
}

/** The settings of `template` that the history does not record (operational, secret), as the file wrote them. */
function unrecorded(raw: PlainObject, template: CheckedEntry): PlainObject {
  const config = isObject(raw.config) ? (raw.config as PlainObject) : {};
  return Object.fromEntries(Object.entries(config).filter(([field]) => template.kinds?.[field] !== "data"));
}

/**
 * `data` with the revisions of `history` up to its height in place of the configuration's own, and the configuration's
 * entries from the height after it (see the module comment). Per id:
 * - each recorded revision is kept as recorded; one of this build's version takes its unrecorded settings from the
 *   configuration's entry;
 * - the configuration's entry that runs at the height after continues the last recorded revision when its version and
 *   data are the same, and starts at that height otherwise;
 * - a recorded id the configuration no longer runs stops at the height;
 * - the configuration's entries starting above the height are kept as written.
 * `checked` is `data` validated; `buildVersions` maps each module id of the build to its version.
 */
export function withRecordedHistory(
  data: PlainObject,
  checked: CheckedConfig,
  history: RecordedHistory,
  buildVersions: ReadonlyMap<string, string>,
): PlainObject {
  const height = BigInt(history.height);
  const raw = data.entries as readonly PlainObject[];
  const past = history.revisions.filter((row) => BigInt(row.start) <= height);
  const buildVersion = (id: string): string | undefined =>
    id === CORE_ENTRY_ID ? versionText(buildCoreVersion()) : buildVersions.get(id);
  const ids = [...new Set([...checked.entries.map((entry) => entry.id), ...past.map((row) => row.id)])];
  const entries: PlainObject[] = [];
  for (const id of ids) {
    const recorded = past.filter((row) => row.id === id).sort((a, b) => (BigInt(a.start) < BigInt(b.start) ? -1 : 1));
    const configured = checked.entries
      .filter((entry) => entry.id === id)
      .sort((a, b) => a.start - b.start);
    const later = configured.filter((entry) => BigInt(entry.start) > height).map((entry) => raw[entry.index] as PlainObject);
    const covering = configured.filter((entry) => BigInt(entry.start) <= height).at(-1);
    const current =
      covering !== undefined && covering.buildVersion && (covering.stop === null || BigInt(covering.stop) > height)
        ? covering
        : undefined;
    const template = current ?? configured.find((entry) => entry.buildVersion);
    const last = recorded.at(-1);
    if (last === undefined) {
      // New since the history: its revision starts after it.
      if (current !== undefined) entries.push({ ...(raw[current.index] as PlainObject), start: Number(height + 1n) });
      entries.push(...later);
      continue;
    }
    const lastStop = last.stop === null ? null : BigInt(last.stop);
    const continues =
      current !== undefined &&
      (lastStop === null || lastStop > height) &&
      last.version === versionText(current.version) &&
      last.data !== null &&
      samePlainData(last.data, current.data as PlainData);
    for (const row of recorded) {
      const start = BigInt(row.start);
      const stop = row.stop === null ? null : BigInt(row.stop);
      if (row === last && continues && current !== undefined) {
        entries.push({ ...(raw[current.index] as PlainObject), start: Number(start) });
        continue;
      }
      const entry: Record<string, PlainData> = { id, ...heights(start, stop) };
      if (row.version === buildVersion(id) && row.data !== null) {
        entry.version = template === undefined ? row.version : (raw[template.index] as PlainObject).version as PlainData;
        entry.config = { ...(template === undefined ? {} : unrecorded(raw[template.index] as PlainObject, template)), ...row.data };
      } else {
        entry.version = id === CORE_ENTRY_ID ? (JSON.parse(row.version) as PlainData) : row.version;
        if (row.data !== null) entry.config = row.data;
      }
      // A revision the configuration no longer runs stops at the height.
      if (row === last && current === undefined && id !== CORE_ENTRY_ID && (stop === null || stop > height)) {
        entry.stop = Number(height);
      }
      entries.push(entry);
    }
    if (current !== undefined && !continues) {
      const stop = current.stop === null ? null : BigInt(current.stop);
      entries.push({ ...withoutStop(raw[current.index] as PlainObject), ...heights(height + 1n, stop) });
    }
    entries.push(...later);
  }
  return { ...data, entries };
}
