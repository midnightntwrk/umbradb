import { describe, expect, it } from "vitest";
import { canonicalJson, checkHistory, dataHash, type HistoryRow } from "../../src/config/history.js";
import { plainData, type PlainObject } from "../../src/config/plain-data.js";
import {
  historyFileText,
  parseHistoryFile,
  type RecordedHistory,
  withRecordedHistory,
} from "../../src/config/recorded-history.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import { UmbraError } from "../../src/db/errors.js";
import { build, checked, CORE, CORE_DATA, M_1_0, N, Simulation, withProcess } from "./history-fixtures.js";

const HEIGHT = 50n;
const M_DATA = { limit: 10, mode: "full" };

/** A recorded row, as `core_chain.config` holds it. */
function row(id: string, start: number, version: string, data: PlainObject, stop: number | null = null): HistoryRow {
  return { id, start: BigInt(start), stop: stop === null ? null : BigInt(stop), version, data, dataHash: dataHash(data) };
}

/** The history file of `rows` at {@link HEIGHT}. */
function fileOf(rows: readonly HistoryRow[]): RecordedHistory {
  return {
    height: String(HEIGHT),
    revisions: rows.map((r) => ({
      id: r.id,
      start: String(r.start),
      stop: r.stop === null ? null : String(r.stop),
      version: r.version,
      data: r.data,
    })),
  };
}

/** `entries` merged with the history of `rows`, then checked against `rows` at {@link HEIGHT}. */
function merged(entries: readonly unknown[], rows: readonly HistoryRow[], declarations: DeclarationSet<ModuleDeclaration>) {
  const data = plainData({ entries }) as PlainObject;
  const versions = new Map(
    [...declarations.backbone, ...declarations.core, ...declarations.user].map((d) => [d.id, d.version]),
  );
  const result = withRecordedHistory(data, checked(entries, declarations), fileOf(rows), versions);
  const config = checked(result.entries as unknown as readonly unknown[], declarations);
  const check = checkHistory(withProcess({ config, cursor: HEIGHT, declarations, history: rows }));
  const at = (id: string) => config.entries.filter((e) => e.id === id).map((e) => [e.start, e.stop, e.buildVersion]);
  return { check, at, writes: check.writes.map((w) => [w.id, Number(w.start)]) };
}

/** The rows a database records running `entries` under this build. */
function recordedBy(entries: readonly unknown[], user: readonly ModuleDeclaration[]): HistoryRow[] {
  const db = new Simulation();
  db.start({ entries, user, cursor: null });
  return db.history;
}

describe("withRecordedHistory", () => {
  it("keeps an unchanged configuration as recorded: nothing to write", () => {
    const entries = [CORE, M_1_0.entry({ start: 10, config: {} })];
    const result = merged([CORE, M_1_0.entry({ start: 0, config: {} })], recordedBy(entries, [M_1_0]), build([M_1_0]));
    expect(result.at("m")).toEqual([[10, null, true]]);
    expect(result.writes).toEqual([]);
  });

  it("upgrades the core and a module from the height after: the earlier versions kept as recorded", () => {
    const oldCore = canonicalJson({ umbradb: "0.9.4", ledgers: [] });
    const rows = [row("core", 0, oldCore, CORE_DATA as unknown as PlainObject), row("m", 10, "0.9.0", M_DATA)];
    const result = merged([CORE, M_1_0.entry({ start: 0, config: {} })], rows, build([M_1_0]));
    expect(result.at("core")).toEqual([[0, null, false], [51, null, true]]);
    expect(result.at("m")).toEqual([[10, null, false], [51, null, true]]);
    expect(result.writes).toEqual([["core", 51], ["m", 51]]);
  });

  it("starts changed data from the height after, the recorded data kept below it", () => {
    const rows = recordedBy([CORE, M_1_0.entry({ start: 10, config: {} })], [M_1_0]);
    const result = merged([CORE, M_1_0.entry({ start: 0, config: { limit: 20, pollMs: 5 } })], rows, build([M_1_0]));
    expect(result.at("m")).toEqual([[10, null, true], [51, null, true]]);
    expect(result.writes).toEqual([["m", 51]]);
  });

  it("stops a recorded module the configuration no longer lists at the height", () => {
    const rows = recordedBy([CORE, M_1_0.entry({ start: 10, config: {} })], [M_1_0]);
    const result = merged([CORE], rows, build([M_1_0]));
    expect(result.at("m")).toEqual([[10, 50, true]]);
    expect(result.writes).toEqual([["m", 10]]);
  });

  it("stops a recorded module of a version the build lacks, and starts a module new since the history after it", () => {
    const rows = [...recordedBy([CORE], []), row("m", 10, "0.9.0", M_DATA)];
    const result = merged([CORE, N.entry({ start: 0, config: {} })], rows, build([M_1_0, N]));
    expect(result.at("m")).toEqual([[10, 50, false]]);
    expect(result.at("n")).toEqual([[51, null, true]]);
  });

  it("keeps an entry starting above the height as written", () => {
    const rows = recordedBy([CORE, M_1_0.entry({ start: 10, config: {} })], [M_1_0]);
    const later = M_1_0.entry({ start: 80, config: { limit: 30 } });
    const result = merged([CORE, M_1_0.entry({ start: 0, config: {} }), later], rows, build([M_1_0]));
    expect(result.at("m")).toEqual([[10, null, true], [80, null, true]]);
  });

  it("keeps a module stopped below the height as recorded, listed or not", () => {
    const rows = recordedBy([CORE, M_1_0.entry({ start: 10, stop: 30, config: {} })], [M_1_0]);
    const listed = merged([CORE, M_1_0.entry({ start: 0, stop: 30, config: {} })], rows, build([M_1_0]));
    expect(listed.at("m")).toEqual([[10, 30, true]]);
    expect(listed.writes).toEqual([]);
    const unlisted = merged([CORE], rows, build([M_1_0]));
    expect(unlisted.at("m")).toEqual([[10, 30, true]]);
    expect(unlisted.writes).toEqual([]);
  });

  it("keeps a stop above the height: on the recorded revision it continues, and on the one changed data starts", () => {
    const rows = recordedBy([CORE, M_1_0.entry({ start: 10, stop: 80, config: {} })], [M_1_0]);
    const same = merged([CORE, M_1_0.entry({ start: 0, stop: 80, config: {} })], rows, build([M_1_0]));
    expect(same.at("m")).toEqual([[10, 80, true]]);
    expect(same.writes).toEqual([]);
    const changed = merged([CORE, M_1_0.entry({ start: 0, stop: 80, config: { limit: 20 } })], rows, build([M_1_0]));
    expect(changed.at("m")).toEqual([[10, 80, true], [51, 80, true]]);
    expect(changed.writes).toEqual([["m", 51]]);
  });

  it("keeps a new module's entry starting above the height as written, with nothing at the height after", () => {
    const result = merged([CORE, N.entry({ start: 80, config: {} })], recordedBy([CORE], []), build([N]));
    expect(result.at("n")).toEqual([[80, null, true]]);
  });
});

describe("the history file", () => {
  const history: RecordedHistory = {
    height: "50",
    revisions: [{ id: "m", start: "10", stop: null, version: "1.0.0", data: M_DATA }],
  };

  it("reads back what it writes", () => {
    expect(parseHistoryFile(historyFileText(history), "h.json")).toEqual(history);
  });

  it.each([
    ["not JSON", "{"],
    ["another format", JSON.stringify({ format: 2, height: "1", revisions: [] })],
    ["a malformed height", JSON.stringify({ format: 1, height: "01", revisions: [] })],
    ["a malformed revision", JSON.stringify({ format: 1, height: "1", revisions: [{ id: "m" }] })],
    ["the old deploy script's format", JSON.stringify({ height: "1", core: [] })],
  ])("refuses %s (history-file-invalid)", (_name, text) => {
    let error: unknown;
    try {
      parseHistoryFile(text, "h.json");
    } catch (thrown) {
      error = thrown;
    }
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).details).toMatchObject({ file: "h.json", reason: "history-file-invalid" });
  });
});
