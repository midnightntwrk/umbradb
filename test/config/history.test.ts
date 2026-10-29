import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { buildCoreVersion, type CoreVersion, UMBRADB_VERSION } from "../../src/config/build.js";
import { versionEntry } from "../../src/config/entries.js";
import {
  canonicalJson,
  checkHistory,
  committedVersions,
  type ConfigHashRow,
  configHashOf,
  dataHash,
  graphEntries,
  graphInputOf,
  HISTORY_RULES,
  type HistoryFinding,
  type HistoryOptions,
  type HistoryRow,
  historyFindings,
  omissionAllowed,
  publicItemRanges,
  recordedData,
  revisionAt,
  rowOf,
  stopChangeAllowed,
  versionText,
} from "../../src/config/history.js";
import { processCoreEntry } from "../../src/config/process.js";
import { UmbraError } from "../../src/db/errors.js";
import { encodeCanonical } from "../../src/determinism/cbor.js";
import { defineModule } from "../../src/modules/declaration.js";
import { resolveGraph } from "../../src/modules/graph.js";
import { declaration } from "../modules/declarations.js";
import {
  build,
  CORE,
  CORE_DATA,
  checked,
  core,
  FILE,
  HISTORIC,
  M_0_9,
  M_1_0,
  M_1_1,
  M_BAR,
  M_FOO,
  moduleN,
  N,
  oldCore,
  rowAt,
  Simulation,
  type Start,
} from "./history-fixtures.js";
import { LEDGER_RELEASES } from "../../src/ledger/releases.js";

/** The build's core version as canonical JSON, written out: keys sorted, no whitespace (RFC 8785). */
const BUILD_CORE_VERSION_TEXT =
  '{"ledgers":[' +
  (["v8", "v9-rc3", "v9"] as const)
    .map((ledger) => {
      const { versionName, packages } = LEDGER_RELEASES[ledger];
      const [{ name, sha256, version }] = packages;
      return `{"ledger":"${ledger}","packages":[{"name":"${name}","sha256":"${sha256}","version":"${version}"}],"versionName":"${versionName}"}`;
    })
    .join(",") +
  '],"umbradb":"0.10.0"}';

/**
 * The configuration history. `core-chain` compares the configuration with `core_chain.config` at every startup and
 * records what starts above the cursor, so a configuration change only affects the future. Here the history is
 * checked without a database: each startup's writes are applied to the rows the next one reads (`Simulation`,
 * `./history-fixtures.ts`). `./history-database.test.ts` runs the same through `core_chain.config` on both backends,
 * and `./history.property.test.ts` holds the hash properties. [CF-5, CF-6, CF-7, CF-8, CF-9; design §7, §10]
 *
 * - A revision's row: its stop (null for `core`, whose stop is operational), its version (a module's semver, or the
 *   core version's canonical JSON), its data fields (canonical JSON) and `data_hash`, the SHA-256 of their canonical
 *   encoding. [CF-7, DT-1]
 * - Revisions are identified by `(id, start)`. A later one supersedes an earlier one from its start (the earlier one's
 *   effective stop is the next start − 1, or its own lower stop). A recorded entry starting at or below the cursor
 *   that the configuration omits refuses with `missing-entry`; one starting above it may be omitted or moved, and its
 *   row is deleted. [CF-5, A30, Q103 B]
 * - An entry starting at or below the cursor c refuses `changes-past` when it differs in a data field or its version
 *   (or is not recorded), except for a module's stop that is above c in both values. Operational fields are not
 *   recorded and may change. Entries above c are recorded, or re-recorded. [CF-6, A31]
 * - The revision covering c + 1 (S on a new database) must name the build's version, or startup refuses
 *   `upgrade-required`, naming each entry, the version needed and the build's. [CF-8, A33]
 * - `sweep: "off"` needs the development opt-in, taken from the latest `core` revision of the build's version
 *   (`processCoreEntry`). [CF-9, Q102 A]
 * - What startup passes on: the graph's input (`resolveGraph`) and the committed versions. [DB-10]
 *
 * The committed negative controls each refuse exactly their cases:
 * - each rule of `HISTORY_RULES` left out loses exactly its cases;
 * - the two allowances for past entries replaced: a stop compared strictly, and operational fields recorded; [CF-6]
 * - an omission above the cursor refused, as the rule was before omissions were allowed. [CF-5, Q103 B]
 */

/** `m` 1.0.0's revision from `start` with `config` (defaults for the rest), stopping at `stop` when given. */
function m(start: number, config: Record<string, unknown> = {}, stop?: number) {
  return M_1_0.entry({ start, ...(stop === undefined ? {} : { stop }), config });
}

/** `n`'s revision from `start`. */
function n(start: number, config: Record<string, unknown> = {}, stop?: number) {
  return N.entry({ start, ...(stop === undefined ? {} : { stop }), config });
}

/** `m`'s data fields when written with no setting: its schema's defaults. */
const M_DEFAULTS = { limit: 10, mode: "full" } as const;

/** The `UmbraError` `run` throws; fails the test otherwise. */
function refusal(run: () => unknown): UmbraError {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    return error as UmbraError;
  }
  return expect.unreachable("expected a refusal");
}

/** The findings of a refusal, as `[rule, path, field]`. */
function found(error: UmbraError): [string, string, string | null][] {
  return (error.details.findings as HistoryFinding[]).map((f) => [f.rule, f.path, f.field]);
}

/** SHA-256 of `bytes`, written out here so the test does not read the encoder's own hashing. */
function sha256(bytes: readonly number[]): Uint8Array {
  return new Uint8Array(createHash("sha256").update(Uint8Array.from(bytes)).digest());
}

describe("CF-7: the history row of a revision, its canonical JSON and its data_hash", () => {
  it("writes canonical JSON: keys sorted by UTF-16 code units at every depth, no whitespace (RFC 8785 on plain data)", () => {
    expect(canonicalJson({ b: 1, a: [true, null, 'x"y\\'], c: { z: 0, y: "é" } })).toBe(
      '{"a":[true,null,"x\\"y\\\\"],"b":1,"c":{"y":"é","z":0}}',
    );
    // UTF-16 order: "Z" < "a" < "z" < "é", and a surrogate pair (U+1F600: D83D DE00) before U+FFFF, which UTF-8's
    // byte order would put after it.
    expect(canonicalJson({ "￿": 1, "😀": 2, é: 3, z: 4, a: 5, Z: 6 })).toBe(
      '{"Z":6,"a":5,"z":4,"é":3,"😀":2,"￿":1}',
    );
    expect(canonicalJson([])).toBe("[]");
    expect(canonicalJson({})).toBe("{}");
    expect(canonicalJson("a\u0001\n")).toBe('"a\\u0001\\n"');
    expect(canonicalJson(9007199254740991)).toBe("9007199254740991");
    expect(canonicalJson(null)).toBe("null");
    expect(canonicalJson(false)).toBe("false");
  });

  it("gives a module's version as written and the core version as its canonical JSON", () => {
    expect(versionText("1.2.0")).toBe("1.2.0");
    expect(versionText(buildCoreVersion())).toBe(BUILD_CORE_VERSION_TEXT);
    const ledgers = [{ versionName: "v9.0.0", ledger: "v9" as const, packages: [{ sha256: "0x00", version: "9.0.0", name: "p" }] }];
    expect(versionText({ ledgers, umbradb: "1.0.0" })).toBe(
      '{"ledgers":[{"ledger":"v9","packages":[{"name":"p","sha256":"0x00","version":"9.0.0"}],"versionName":"v9.0.0"}],' +
        '"umbradb":"1.0.0"}',
    );
  });

  it("hashes the canonical encoding of the data fields: SHA-256 of the CBOR written out by hand", () => {
    // { b: 1, a: "x" }: a map of 2 (a2), keys in the bytewise order of their encodings: "a" (61 61) → "x" (61 78),
    // "b" (61 62) → 1 (01).
    expect(dataHash({ b: 1, a: "x" })).toEqual(sha256([0xa2, 0x61, 0x61, 0x61, 0x78, 0x61, 0x62, 0x01]));
    expect(dataHash({})).toEqual(sha256([0xa0]));
    // { n: [null, true], s: 500 }: a2, "n" → [f6 f5], "s" → 19 01f4.
    expect(dataHash({ s: 500, n: [null, true] })).toEqual(
      sha256([0xa2, 0x61, 0x6e, 0x82, 0xf6, 0xf5, 0x61, 0x73, 0x19, 0x01, 0xf4]),
    );
    expect(dataHash({ b: 1, a: "x" })).toHaveLength(32);
  });

  it("records a module revision of the build's version: its stop as written, its version, its data fields only", () => {
    const config = checked([CORE, m(5, { limit: 3, pollMs: 7, token: "s3cret" }, 40), m(41)], build());
    const [, first, second] = config.entries.map((entry) => rowOf(entry));
    expect(first).toEqual({
      id: "m",
      start: 5n,
      stop: 40n,
      version: "1.0.0",
      data: { limit: 3, mode: "full" },
      dataHash: dataHash({ limit: 3, mode: "full" }),
    });
    expect(second).toEqual({ id: "m", start: 41n, stop: null, version: "1.0.0", data: M_DEFAULTS, dataHash: dataHash(M_DEFAULTS) });
    // Operational and secret settings are never recorded. [CF-4]
    expect(JSON.stringify(first, (_key, value: unknown) => (typeof value === "bigint" ? String(value) : value))).not.toContain(
      "s3cret",
    );
  });

  it("records a core revision with a null stop, whatever stop it is written with (its stop is operational, CF-4)", () => {
    const config = checked([core(0, { retainStates: 4, tipCap: 9 }, 10)], build([]));
    expect(rowOf(config.entries[0]!)).toEqual({
      id: "core",
      start: 0n,
      stop: null,
      version: BUILD_CORE_VERSION_TEXT,
      data: { ...CORE_DATA, retainStates: 4 },
      dataHash: dataHash({ ...CORE_DATA, retainStates: 4 }),
    });
  });

  it("records a versionEntry with its config as written, and a scheduled one with id, start, stop and version only", () => {
    const config = checked(
      [
        CORE,
        versionEntry({ id: "m", start: 0, version: "0.9.0", config: { limit: 1 } }),
        versionEntry({ id: "m", start: 50, stop: 70, version: "1.1.0" }),
      ],
      build(),
    );
    const [, earlier, scheduled] = config.entries;
    expect(recordedData(earlier!)).toEqual({ limit: 1 });
    expect(rowOf(earlier!)).toMatchObject({ version: "0.9.0", data: { limit: 1 }, dataHash: dataHash({ limit: 1 }) });
    expect(rowOf(scheduled!)).toEqual({ id: "m", start: 50n, stop: 70n, version: "1.1.0", data: null, dataHash: null });
  });
});

describe("CF-5, A30: revisions by (id, start); a later one supersedes the earlier from its start", () => {
  it("gives each module revision its effective stop: the next revision's start − 1, or its own stop when lower", () => {
    const config = checked(
      [CORE, m(0), m(50, {}, 60), m(100, {}, 200), m(150), n(3, {}, 30), n(40), n(45, {}, 44 + 100)],
      build([M_1_0, N]),
    );
    expect(graphEntries(config.entries)).toEqual([
      { id: "m", start: 0n, stop: 49n },
      // Its own stop below the next start − 1 is kept: a gap, then a new start (the requirement graph checks it). [MD-4]
      { id: "m", start: 50n, stop: 60n },
      // Its own stop at or above the next start is superseded: the later revision covers it from its start. [CF-5]
      { id: "m", start: 100n, stop: 149n },
      { id: "m", start: 150n, stop: null },
      { id: "n", start: 3n, stop: 30n },
      { id: "n", start: 40n, stop: 44n },
      { id: "n", start: 45n, stop: 144n },
    ]);
  });

  it("gives the graph no core revision, and counts revisions in any file order", () => {
    const config = checked([m(50), core(0, {}, 10), m(0), core(20)], build());
    expect(graphEntries(config.entries)).toEqual([
      { id: "m", start: 50n, stop: null },
      { id: "m", start: 0n, stop: 49n },
    ]);
  });

  it("finds the revision covering a height: the earlier one up to the later one's start − 1, the later one from its start", () => {
    const config = checked([CORE, m(0, { limit: 1 }), m(50, { limit: 2 }, 80), m(90, { limit: 3 })], build());
    const settingsAt = (h: bigint) => revisionAt(config.entries, "m", h)?.settings?.limit;
    expect([settingsAt(0n), settingsAt(49n), settingsAt(50n), settingsAt(80n), settingsAt(81n), settingsAt(89n), settingsAt(90n), settingsAt(10n ** 9n)]).toEqual([
      1, 1, 2, 2, undefined, undefined, 3, 3,
    ]);
    // The core's revisions: its stop is operational, so a revision covers every height up to the next one's start.
    const cores = checked([core(0, {}, 5), core(30, { retainStates: 1 })], build([]));
    expect(revisionAt(cores.entries, "core", 6n)?.start).toBe(0);
    expect(revisionAt(cores.entries, "core", 30n)?.start).toBe(30);
    expect(revisionAt(cores.entries, "nobody", 30n)).toBeUndefined();
  });

  it("lets a module that cannot start mid-chain continue at a later revision's start (no mid-chain start, CF-5)", () => {
    const declarations = build([HISTORIC]);
    const accepted = (entries: readonly unknown[]) => {
      const check = checkHistory({ config: checked(entries, declarations), cursor: null, declarations, history: [] });
      return resolveGraph(graphInputOf(check, declarations));
    };
    const revisions = (stop?: number) => [
      CORE,
      HISTORIC.entry({ start: 0, ...(stop === undefined ? {} : { stop }), config: {} }),
      HISTORIC.entry({ start: 50, config: { limit: 2 } }),
    ];
    expect(accepted(revisions()).segments.get("historic")).toEqual([{ from: 0n, to: null }]);
    // Its own stop at or above the later start is superseded: the revisions still continue each other.
    expect(accepted(revisions(120)).segments.get("historic")).toEqual([{ from: 0n, to: null }]);
    // Control: an own stop below the later start − 1 leaves a gap, and the later revision is a new, mid-chain start.
    const gap = refusal(() => accepted(revisions(30)));
    expect(gap.code).toBe("cannot-start-mid-chain");
    expect(gap.details).toMatchObject({ module: "historic", start: 50n });
  });
});

describe("A30: a configuration omitting a recorded entry that starts at or below the cursor refuses with missing-entry", () => {
  it("refuses CF-5's scenario: the history holds (m, 1) and (m, 50), the cursor is at or above 50, the file lists only (m, 1)", () => {
    for (const cursor of [50n, 60n]) {
      const db = new Simulation();
      db.start({ entries: [CORE, m(1), m(50)], cursor: null });
      const error = db.refusal({ entries: [CORE, m(1)], cursor });
      expect(error.code).toBe("missing-entry");
      expect(error.retryable).toBe(false);
      expect(error.details.missing).toEqual([{ id: "m", start: 50 }]);
      expect(error.details).toMatchObject({ file: FILE, cursor });
      expect(found(error)).toEqual([["listed", "entries", null]]);
      for (const words of ["m from 50", "does not list", `at or below the cursor ${cursor}`, FILE]) {
        expect(error.message).toContain(words);
      }
      expect(error.message).not.toMatch(/\b(?:[A-Z]{2,5}-\d+|Q\d+)\b/);
    }
  });

  it("names every omitted entry at or below the cursor at once: started, scheduled, a core revision, a module the build no longer has", () => {
    const db = new Simulation();
    db.start({
      entries: [CORE, core(10, { retainStates: 1 }), m(1), n(5), versionEntry({ id: "m", start: 60, version: "1.1.0" }), n(70)],
      user: [M_1_0, N],
      cursor: null,
    });
    const error = db.refusal({ entries: [CORE, m(1)], user: [M_1_0], cursor: 60n });
    expect(error.code).toBe("missing-entry");
    // (n, 70) starts above the cursor: it may be omitted, so it is not named. [Q103 B]
    expect(error.details.missing).toEqual([
      { id: "core", start: 10 },
      { id: "m", start: 60 },
      { id: "n", start: 5 },
    ]);
    const messages = (error.details.findings as HistoryFinding[]).map((f) => f.message);
    expect(messages[2]).toContain("this build has no module n");
    expect(messages[1]).toContain("versionEntry");
  });

  it("tells how to list each omitted row back: a scheduled one with its stop, another version's with its data", () => {
    const declarations = build();
    const history: HistoryRow[] = [
      rowOf(checked([CORE], declarations).entries[0]!),
      { id: "m", start: 0n, stop: null, version: "0.9.0", data: { limit: 1 }, dataHash: dataHash({ limit: 1 }) },
      { id: "m", start: 50n, stop: 80n, version: "1.1.0", data: null, dataHash: null },
    ];
    const error = refusal(() => checkHistory({ config: checked([CORE, m(10)], declarations), cursor: 60n, declarations, history }));
    expect(error.code).toBe("missing-entry");
    const [other, scheduled] = (error.details.findings as HistoryFinding[]).map((f) => f.message);
    expect(other).toContain("versionEntry({ id, start, version, config }) with its recorded version and data");
    expect(scheduled).toContain('versionEntry({ id: "m", start: 50, version, stop: 80 })');
  });

  it("names the configuration without a file when it has none (the browser's bundled data)", () => {
    const declarations = build();
    const config = { ...checked([CORE, m(1)], declarations), file: null };
    const history = [rowOf(config.entries[0]!), { ...rowOf(config.entries[1]!), start: 50n }];
    const error = refusal(() => checkHistory({ config, cursor: 50n, declarations, history }));
    expect(
      error.message.startsWith("the configuration omits entries the history records at or below the cursor: entries: "),
    ).toBe(true);
    expect(error.details.file).toBeNull();
    const none = refusal(() => processCoreEntry({ ...checked([oldCore(0, "0.9.4")], build([])), file: null }));
    expect(none.message.startsWith("the configuration has no core revision")).toBe(true);
  });

  it("identifies an entry by its id and its start, never by their text run together (m1 from 0 is not m from 10)", () => {
    const M1 = defineModule({ ...declaration("m1") });
    const declarations = build([M_1_0, M1]);
    const history: HistoryRow[] = [
      rowOf(checked([CORE], declarations).entries[0]!),
      { ...rowOf(checked([CORE, m(10)], declarations).entries[1]!) },
      { id: "m1", start: 0n, stop: null, version: "1.0.0", data: { limit: 10 }, dataHash: dataHash({ limit: 10 }) },
    ];
    const error = refusal(() => checkHistory({ config: checked([CORE, m(10)], declarations), cursor: C, declarations, history }));
    expect(error.details.missing).toEqual([{ id: "m1", start: 0 }]);
  });

  it("gives every finding, top-level ones (an omitted entry) first, without refusing (historyFindings)", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(1), m(50)], cursor: null });
    const declarations = build();
    const input = { config: checked([CORE, m(1, { limit: 2 })], declarations), cursor: 60n, declarations, history: db.history };
    expect(historyFindings(input).map((f) => [f.code, f.path])).toEqual([
      ["missing-entry", "entries"],
      ["changes-past", "entries[1].config.limit"],
    ]);
  });

  it("refuses before any other check, and accepts the same configuration with every entry listed", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(1), m(50)], cursor: null });
    // Also a changed past (limit) and an omitted entry: the omission is named first. [CF-5, CF-6]
    expect(db.refusal({ entries: [CORE, m(1, { limit: 2 })], cursor: 60n }).code).toBe("missing-entry");
    expect(db.start({ entries: [CORE, m(1), m(50)], cursor: 60n }).writes).toEqual([]);
  });
});

/** A row's `(id, start)`, the start as a number. */
const keyOf = (row: HistoryRow): [string, number] => [row.id, Number(row.start)];

describe("A30, Q103 B: a recorded entry that starts above the cursor may be omitted or moved (CF-5)", () => {
  it("accepts omitting one: its row is deleted, nothing else written, and the earlier revision runs on", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(1), m(50)], cursor: null });
    const recorded = rowAt(db.history, "m", 50);
    const check = db.start({ entries: [CORE, m(1)], cursor: C });
    expect(check.deletes).toEqual([recorded]);
    expect(check.writes).toEqual([]);
    expect(db.history.map(keyOf)).toEqual([
      ["core", 0],
      ["m", 1],
    ]);
    expect(check.graphEntries).toEqual([{ id: "m", start: 1n, stop: null }]);
    // An omission above the cursor is no finding (`umbradb config check` reports none).
    const declarations = build();
    const before = new Simulation();
    before.start({ entries: [CORE, m(1), m(50)], cursor: null });
    expect(historyFindings({ config: checked([CORE, m(1)], declarations), cursor: C, declarations, history: before.history })).toEqual([]);
    // Restarted unchanged: nothing to delete.
    expect(db.start({ entries: [CORE, m(1)], cursor: C }).deletes).toEqual([]);
  });

  it("accepts CF-5's scenario 'A scheduled entry is moved': (m, 50) deleted and (m, 100) recorded, superseding from 100", () => {
    const moves = [
      ["a revision of the build's version", m(50, { limit: 2 }), m(100, { limit: 2 })],
      [
        "a scheduled versionEntry",
        versionEntry({ id: "m", start: 50, version: "1.1.0" }),
        versionEntry({ id: "m", start: 100, version: "1.1.0" }),
      ],
    ] as const;
    for (const [label, from, to] of moves) {
      const db = new Simulation();
      db.start({ entries: [CORE, m(0), from], cursor: null });
      const check = db.start({ entries: [CORE, m(0), to], cursor: C });
      expect(check.deletes.map(keyOf), label).toEqual([["m", 50]]);
      expect(check.writes.map(keyOf), label).toEqual([["m", 100]]);
      expect(db.history.filter((row) => row.id === "m").map(keyOf), label).toEqual([
        ["m", 0],
        ["m", 100],
      ]);
      // The revision from 0 now ends at 99, the moved one's start − 1. [CF-5]
      expect(revisionAt(check.entries, "m", 99n)?.start, label).toBe(0);
      expect(revisionAt(check.entries, "m", 100n)?.start, label).toBe(100);
    }
  });

  it("lets the old build run on when a scheduled upgrade slips (Q103's use case): moved to 100, or dropped", () => {
    const scheduled = (start: number) => versionEntry({ id: "m", start, version: "1.1.0" });
    for (const later of [[scheduled(100)], []]) {
      const db = new Simulation();
      db.start({ entries: [CORE, m(0), scheduled(50)], cursor: null });
      // At cursor 49 the 1.0.0 build is refused: the revision covering 50 names 1.1.0. [RN-12, CF-8]
      expect(db.refusal({ entries: [CORE, m(0), scheduled(50)], cursor: 49n }).code).toBe("upgrade-required");
      const check = db.start({ entries: [CORE, m(0), ...later], cursor: 49n });
      expect(check.deletes.map(keyOf)).toEqual([["m", 50]]);
      expect(check.writes.map(keyOf)).toEqual(later.length === 0 ? [] : [["m", 100]]);
    }
  });

  it("draws the line exactly: an entry starting at the cursor must be listed, one starting at cursor + 1 may be omitted", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0), m(20), m(21)], cursor: null });
    const atCursor = db.refusal({ entries: [CORE, m(0), m(21)], cursor: C });
    expect([atCursor.code, atCursor.details.missing]).toEqual(["missing-entry", [{ id: "m", start: 20 }]]);
    // Both omitted: only the one at the cursor is named.
    expect(db.refusal({ entries: [CORE, m(0)], cursor: C }).details.missing).toEqual([{ id: "m", start: 20 }]);
    const above = db.start({ entries: [CORE, m(0), m(20)], cursor: C });
    expect([above.deletes.map(keyOf), above.writes]).toEqual([[["m", 21]], []]);
  });

  it("refuses moving one from above the cursor to at or below it: the new start is a past without it (changes-past)", () => {
    for (const start of [20, 15]) {
      const db = new Simulation();
      db.start({ entries: [CORE, m(0), m(50)], cursor: null });
      const error = db.refusal({ entries: [CORE, m(0), m(start)], cursor: C });
      expect([error.code, found(error)], `to ${start}`).toEqual(["changes-past", [["recorded", "entries[2]", null]]]);
      expect(rowAt(db.history, "m", 50), `to ${start}`).toBeDefined();
    }
    // To cursor + 1 it is a move above the cursor.
    const db = new Simulation();
    db.start({ entries: [CORE, m(0), m(50)], cursor: null });
    const check = db.start({ entries: [CORE, m(0), m(21)], cursor: C });
    expect([check.deletes.map(keyOf), check.writes.map(keyOf)]).toEqual([[["m", 50]], [["m", 21]]]);
  });

  it("deletes every omitted row above the cursor at once — a core revision, a scheduled one, a module the build no longer has", () => {
    const db = new Simulation();
    db.start({
      entries: [CORE, core(30, { retainStates: 1 }), m(0), versionEntry({ id: "m", start: 40, version: "1.1.0" }), n(25)],
      user: [M_1_0, N],
      cursor: null,
    });
    const check = db.start({ entries: [CORE, m(0)], user: [M_1_0], cursor: C });
    expect(check.deletes.map(keyOf)).toEqual([
      ["core", 30],
      ["m", 40],
      ["n", 25],
    ]);
    expect(check.writes).toEqual([]);
    expect(db.history.map(keyOf)).toEqual([
      ["core", 0],
      ["m", 0],
    ]);
  });

  it("lets a database that has committed nothing (cursor null) omit or move any recorded entry", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0), m(10)], cursor: null });
    const check = db.start({ entries: [CORE, m(5)], cursor: null });
    expect([check.deletes.map(keyOf), check.writes.map(keyOf)]).toEqual([
      [
        ["m", 0],
        ["m", 10],
      ],
      [["m", 5]],
    ]);
  });
});

/** A case of a past entry: the startup that records the history, then the one checked at the cursor. [CF-6] */
interface Case {
  readonly name: string;
  readonly first: Start;
  readonly then: Start;
}

const C = 20n;

/**
 * The refusals of a changed past entry (`changes-past`), each by one rule; `path` and `field` are the finding's.
 * [CF-6]
 */
const CHANGES: readonly (Case & { readonly rule: string; readonly path: string; readonly field: string | null })[] = [
  {
    name: "a data field of a module revision starting below the cursor",
    first: { entries: [CORE, m(10)], cursor: null },
    then: { entries: [CORE, m(10, { limit: 11 })], cursor: C },
    rule: "data",
    path: "entries[1].config.limit",
    field: "limit",
  },
  {
    name: "a data field of a revision starting at the cursor (CF-6: at or below c)",
    first: { entries: [CORE, m(20)], cursor: null },
    then: { entries: [CORE, m(20, { mode: "fast" })], cursor: C },
    rule: "data",
    path: "entries[1].config.mode",
    field: "mode",
  },
  {
    name: "a data field of the core (retainStates)",
    first: { entries: [CORE], cursor: null },
    then: { entries: [core(0, { retainStates: 5 })], cursor: C },
    rule: "data",
    path: "entries[0].config.retainStates",
    field: "retainStates",
  },
  {
    name: "a nested data field of the core (one ledger version's source)",
    first: { entries: [CORE], cursor: null },
    then: { entries: [core(0, { ledgerSources: { v9: "released" } })], cursor: C },
    rule: "data",
    path: "entries[0].config.ledgerSources",
    field: "ledgerSources",
  },
  {
    name: "a versionEntry whose config differs from its recorded data (A28)",
    first: { entries: [CORE, m(10)], cursor: null },
    then: {
      entries: [CORE, versionEntry({ id: "m", start: 10, version: "1.0.0", config: { limit: 10, mode: "fast" } }), M_1_1.entry({ start: 21, config: {} })],
      user: [M_1_1],
      cursor: C,
    },
    rule: "data",
    path: "entries[1].config.mode",
    field: "mode",
  },
  {
    name: "a versionEntry with a data field the history does not record",
    first: { entries: [CORE, m(10)], cursor: null },
    then: {
      entries: [CORE, versionEntry({ id: "m", start: 10, version: "1.0.0", config: { ...M_DEFAULTS, extra: 1 } }), M_1_1.entry({ start: 21, config: {} })],
      user: [M_1_1],
      cursor: C,
    },
    rule: "data",
    path: "entries[1].config.extra",
    field: "extra",
  },
  {
    name: "a versionEntry that leaves out a recorded data field",
    first: { entries: [CORE, m(10)], cursor: null },
    then: {
      entries: [CORE, versionEntry({ id: "m", start: 10, version: "1.0.0", config: { limit: 10 } }), M_1_1.entry({ start: 21, config: {} })],
      user: [M_1_1],
      cursor: C,
    },
    rule: "data",
    path: "entries[1].config.mode",
    field: "mode",
  },
  {
    name: "the version of a module revision, written with the build's builder (1.1.0 for 1.0.0)",
    first: { entries: [CORE, m(10)], cursor: null },
    then: { entries: [CORE, M_1_1.entry({ start: 10, config: {} })], user: [M_1_1], cursor: C },
    rule: "version",
    path: "entries[1].version",
    field: "version",
  },
  {
    name: "the version of a module revision, written with versionEntry",
    first: { entries: [CORE, m(10)], cursor: null },
    then: {
      entries: [CORE, versionEntry({ id: "m", start: 10, version: "0.9.0", config: M_DEFAULTS }), M_1_1.entry({ start: 21, config: {} })],
      user: [M_1_1],
      cursor: C,
    },
    rule: "version",
    path: "entries[1].version",
    field: "version",
  },
  {
    name: "the version of the core (written as UmbraDB 0.9.4)",
    first: { entries: [CORE], cursor: null },
    then: { entries: [oldCore(0, "0.9.4"), core(21)], cursor: C },
    rule: "version",
    path: "entries[0].version",
    field: "version",
  },
  {
    name: "a module's stop added at the cursor",
    first: { entries: [CORE, m(10)], cursor: null },
    then: { entries: [CORE, m(10, {}, 20)], cursor: C },
    rule: "stop",
    path: "entries[1].stop",
    field: "stop",
  },
  {
    name: "a module's recorded stop below the cursor raised",
    first: { entries: [CORE, m(10, {}, 15)], cursor: null },
    then: { entries: [CORE, m(10, {}, 30)], cursor: C },
    rule: "stop",
    path: "entries[1].stop",
    field: "stop",
  },
  {
    name: "a module's recorded stop at the cursor removed",
    first: { entries: [CORE, m(10, {}, 20)], cursor: null },
    then: { entries: [CORE, m(10)], cursor: C },
    rule: "stop",
    path: "entries[1].stop",
    field: "stop",
  },
  {
    name: "a module's stop above the cursor lowered to below it",
    first: { entries: [CORE, m(10, {}, 40)], cursor: null },
    then: { entries: [CORE, m(10, {}, 19)], cursor: C },
    rule: "stop",
    path: "entries[1].stop",
    field: "stop",
  },
  {
    name: "an entry starting at or below the cursor that the history does not record",
    first: { entries: [CORE, m(10)], cursor: null },
    then: { entries: [CORE, m(10), n(15)], user: [M_1_0, N], cursor: C },
    rule: "recorded",
    path: "entries[2]",
    field: null,
  },
];

/**
 * The accepted changes, including omissions above the cursor: what may change at the cursor, what is (re-)recorded
 * then and what is deleted. [CF-6, CF-5, Q103 B]
 */
const ACCEPTED: readonly (Case & {
  readonly writes: readonly [string, number][];
  readonly deletes?: readonly [string, number][];
  readonly allowance?: "stop" | "operational" | "omission";
})[] = [
  {
    name: "a module's stop above the cursor raised",
    first: { entries: [CORE, m(10, {}, 30)], cursor: null },
    then: { entries: [CORE, m(10, {}, 40)], cursor: C },
    writes: [["m", 10]],
    allowance: "stop",
  },
  {
    name: "a module's stop above the cursor removed",
    first: { entries: [CORE, m(10, {}, 30)], cursor: null },
    then: { entries: [CORE, m(10)], cursor: C },
    writes: [["m", 10]],
    allowance: "stop",
  },
  {
    name: "a module's stop added above the cursor",
    first: { entries: [CORE, m(10)], cursor: null },
    then: { entries: [CORE, m(10, {}, 21)], cursor: C },
    writes: [["m", 10]],
    allowance: "stop",
  },
  {
    name: "an operational and a secret setting of a module",
    first: { entries: [CORE, m(10, { pollMs: 5 })], cursor: null },
    then: { entries: [CORE, m(10, { pollMs: 6, token: "t-4-3" })], cursor: C },
    writes: [],
    allowance: "operational",
  },
  {
    name: "operational and secret settings of the core (tipCap, database, node)",
    first: { entries: [CORE], cursor: null },
    then: { entries: [core(0, { tipCap: 7, database: { kind: "postgres", host: "db", user: "u", password: "p", name: "x" }, node: "wss://node" })], cursor: C },
    writes: [],
    allowance: "operational",
  },
  {
    name: "the core's stop raised after the core stopped at it (cursor 10)",
    first: { entries: [core(0, {}, 10)], cursor: null },
    then: { entries: [core(0, {}, 20)], cursor: 10n },
    writes: [],
  },
  {
    name: "the core's stop removed after the core stopped at it",
    first: { entries: [core(0, {}, 10)], cursor: null },
    then: { entries: [CORE], cursor: 10n },
    writes: [],
  },
  {
    name: "a revision above the cursor changed between restarts (re-recorded, A28)",
    first: { entries: [CORE, m(0), m(50, { limit: 1 })], cursor: null },
    then: { entries: [CORE, m(0), m(50, { limit: 2 }, 70)], cursor: C },
    writes: [["m", 50]],
  },
  {
    name: "only the stop of a revision above the cursor changed (re-recorded)",
    first: { entries: [CORE, m(0), m(50, {}, 70)], cursor: null },
    then: { entries: [CORE, m(0), m(50, {}, 80)], cursor: C },
    writes: [["m", 50]],
  },
  {
    name: "only the version of a scheduled revision changed (re-recorded)",
    first: { entries: [CORE, m(0), versionEntry({ id: "m", start: 50, version: "1.1.0" })], cursor: null },
    then: { entries: [CORE, m(0), versionEntry({ id: "m", start: 50, version: "1.2.0" })], cursor: C },
    writes: [["m", 50]],
  },
  {
    name: "a new revision above the cursor, of a module and of the core",
    first: { entries: [CORE, m(0)], cursor: null },
    then: { entries: [CORE, core(21, { retainStates: 3 }), m(0), m(30, { limit: 3 })], cursor: C },
    writes: [
      ["core", 21],
      ["m", 30],
    ],
  },
  {
    name: "a scheduled versionEntry above the cursor (recorded with id, start, stop and version only)",
    first: { entries: [CORE, m(0)], cursor: null },
    then: { entries: [CORE, m(0), versionEntry({ id: "m", start: 50, stop: 90, version: "1.1.0" })], cursor: C },
    writes: [["m", 50]],
  },
  {
    name: "the same configuration again, its fields written in another order",
    first: { entries: [CORE, m(0, { mode: "fast", limit: 2 })], cursor: null },
    then: { entries: [core(0, {}), m(0, { limit: 2, mode: "fast" })], cursor: C },
    writes: [],
  },
  {
    name: "a recorded revision above the cursor omitted (its row deleted, Q103)",
    first: { entries: [CORE, m(0), m(50)], cursor: null },
    then: { entries: [CORE, m(0)], cursor: C },
    writes: [],
    deletes: [["m", 50]],
    allowance: "omission",
  },
  {
    name: "a recorded revision above the cursor moved (CF-5's scenario 'A scheduled entry is moved')",
    first: { entries: [CORE, m(0), versionEntry({ id: "m", start: 50, version: "1.1.0" })], cursor: null },
    then: { entries: [CORE, m(0), versionEntry({ id: "m", start: 100, version: "1.1.0" })], cursor: C },
    writes: [["m", 100]],
    deletes: [["m", 50]],
    allowance: "omission",
  },
  {
    name: "a recorded revision moved to cursor + 1",
    first: { entries: [CORE, m(0), m(50)], cursor: null },
    then: { entries: [CORE, m(0), m(21)], cursor: C },
    writes: [["m", 21]],
    deletes: [["m", 50]],
    allowance: "omission",
  },
  {
    name: "a core revision above the cursor omitted",
    first: { entries: [CORE, core(30, { retainStates: 1 })], cursor: null },
    then: { entries: [CORE], cursor: C },
    writes: [],
    deletes: [["core", 30]],
    allowance: "omission",
  },
];

/** The outcome of a case's second startup: its refusal's code and findings, or its writes and deletes. */
function outcome(test: Case, options?: HistoryOptions) {
  const db = new Simulation();
  db.start({ ...test.first, ...(options === undefined ? {} : { options }) });
  try {
    const check = db.start({ ...test.then, ...(options === undefined ? {} : { options }) });
    const keys = (rows: readonly HistoryRow[]) => rows.map((row) => [row.id, Number(row.start)]);
    return { writes: keys(check.writes), deletes: keys(check.deletes) };
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, findings: found(error) };
  }
}

describe("A31: configuration changes only the future (CF-6)", () => {
  it.each(CHANGES)("refuses changes-past for $name, naming the entry and the field", (test) => {
    expect(outcome(test)).toEqual({ code: "changes-past", findings: [[test.rule, test.path, test.field]] });
  });

  it.each(ACCEPTED)("accepts $name, recording exactly what changed", (test) => {
    expect(outcome(test)).toEqual({ writes: test.writes, deletes: test.deletes ?? [] });
  });

  it("names the entry, the field and the cursor in the refusal, never a setting's value", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(10, { limit: 4141 })], cursor: null });
    const error = db.refusal({ entries: [CORE, m(10, { limit: 4242 })], cursor: C });
    expect(error.details).toMatchObject({ file: FILE, cursor: C });
    const [finding] = error.details.findings as HistoryFinding[];
    expect(finding).toMatchObject({ code: "changes-past", entry: { index: 1, id: "m", start: 10 }, field: "limit" });
    for (const words of ["entries[1].config.limit (m from 10)", "the cursor 20", "resync"]) {
      expect(error.message).toContain(words);
    }
    expect(error.message).not.toMatch(/\b(?:[A-Z]{2,5}-\d+|Q\d+)\b/);
    expect(error.message).not.toContain("4141");
    expect(error.message).not.toContain("4242");
  });

  it("names a version change with both versions, and a stop change with both stops", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(10, {}, 15)], cursor: null });
    const version = db.refusal({ entries: [CORE, M_1_1.entry({ start: 10, stop: 15, config: {} })], user: [M_1_1], cursor: C });
    expect((version.details.findings as HistoryFinding[])[0]?.about).toEqual({ recorded: "1.0.0", configured: "1.1.0" });
    expect(version.message).toContain("versionEntry");
    const stop = db.refusal({ entries: [CORE, m(10, {}, 25)], cursor: C });
    expect((stop.details.findings as HistoryFinding[])[0]?.about).toEqual({ recorded: 15, configured: 25 });
    const removed = db.refusal({ entries: [CORE, m(10)], cursor: C });
    expect((removed.details.findings as HistoryFinding[])[0]?.about).toEqual({ recorded: 15, configured: null });
  });

  it("lists every change at once, in entry order, each entry's in the rules' order", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(1), n(2, {}, 5)], user: [M_1_0, N], cursor: null });
    const error = db.refusal({
      entries: [core(0, { retainStates: 1 }), m(1, { limit: 1, mode: "fast" }), n(2, { limit: 2 }, 9), n(3)],
      user: [M_1_0, N],
      cursor: C,
    });
    expect(found(error)).toEqual([
      ["data", "entries[0].config.retainStates", "retainStates"],
      ["data", "entries[1].config.limit", "limit"],
      ["data", "entries[1].config.mode", "mode"],
      ["data", "entries[2].config.limit", "limit"],
      ["stop", "entries[2].stop", "stop"],
      ["recorded", "entries[3]", null],
    ]);
  });

  it("refuses a started revision whose recorded row has no data (it was scheduled), failing closed", () => {
    const history: HistoryRow[] = [
      rowOf(checked([CORE], build([])).entries[0]!),
      { id: "m", start: 10n, stop: null, version: "1.0.0", data: null, dataHash: null },
    ];
    const declarations = build();
    const error = refusal(() =>
      checkHistory({ config: checked([CORE, m(10)], declarations), cursor: C, declarations, history }),
    );
    expect(error.code).toBe("changes-past");
    expect(found(error)).toEqual([["data", "entries[1].config", null]]);
  });

  it("treats no stop as above every cursor (CF-6's allowance)", () => {
    expect(stopChangeAllowed(30n, null, C)).toBe(true);
    expect(stopChangeAllowed(null, 21n, C)).toBe(true);
    expect(stopChangeAllowed(null, 20n, C)).toBe(false);
    expect(stopChangeAllowed(20n, null, C)).toBe(false);
    expect(stopChangeAllowed(21n, 22n, C)).toBe(true);
  });

  it("records every entry of a new database, and a later startup reads them back unchanged", () => {
    const db = new Simulation();
    const first = db.start({
      entries: [CORE, core(30, { retainStates: 2 }), m(0, { limit: 1 }), m(10, {}, 40), versionEntry({ id: "m", start: 50, version: "1.1.0" })],
      cursor: null,
    });
    expect(first.writes.map((row) => [row.id, row.start, row.stop, row.data])).toEqual([
      ["core", 0n, null, CORE_DATA],
      ["core", 30n, null, { ...CORE_DATA, retainStates: 2 }],
      ["m", 0n, null, { ...M_DEFAULTS, limit: 1 }],
      ["m", 10n, 40n, M_DEFAULTS],
      ["m", 50n, null, null],
    ]);
    expect(rowAt(db.history, "m", 50)).toMatchObject({ version: "1.1.0", data: null, dataHash: null });
    const again = db.start({
      entries: [CORE, core(30, { retainStates: 2 }), m(0, { limit: 1 }), m(10, {}, 40), versionEntry({ id: "m", start: 50, version: "1.1.0" })],
      cursor: 45n,
    });
    expect(again.writes).toEqual([]);
  });
});

describe("A28's history half: versionEntry revisions against their recorded rows (CF-3, CF-6)", () => {
  it("starts an upgrade that renames a setting with the old revision written as a versionEntry equal to its row", () => {
    const db = new Simulation();
    db.start({
      entries: [CORE, M_FOO.entry({ start: 1, config: { foo: 1 } }), versionEntry({ id: "m", start: 50, version: "1.1.0" })],
      user: [M_FOO],
      cursor: null,
    });
    // The 1.0.0 build stopped at 49; the 1.1.0 build's file writes 1.0.0's revision as recorded. [RN-12]
    const upgrade = db.start({
      entries: [CORE, versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 1 } }), M_BAR.entry({ start: 50, config: { bar: 1 } })],
      user: [M_BAR],
      cursor: 49n,
    });
    expect(upgrade.writes).toEqual([
      { id: "m", start: 50n, stop: null, version: "1.1.0", data: { bar: 1 }, dataHash: dataHash({ bar: 1 }) },
    ]);
    // Differing from its row refuses startup.
    const error = db.refusal({
      entries: [CORE, versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 2 } }), M_BAR.entry({ start: 50, config: { bar: 1 } })],
      user: [M_BAR],
      cursor: 49n,
    });
    expect([error.code, found(error)]).toEqual(["changes-past", [["data", "entries[1].config.foo", "foo"]]]);
  });

  it("refuses a scheduled versionEntry that carries a config before comparing anything (CF-3, task 4.2's rule)", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0)], cursor: null });
    const error = db.refusal({
      entries: [CORE, m(0, { limit: 99 }), versionEntry({ id: "m", start: 50, version: "1.1.0", config: { limit: 1 } })],
      cursor: C,
    });
    expect(error.code).toBe("invalid-configuration");
    expect(error.details.findings).toMatchObject([{ rule: "scheduled-config", path: "entries[2].config" }]);
  });
});

/**
 * The core version a build of UmbraDB `umbradb` would carry: this build's for its own version (with its ledger
 * packages), and one with no ledger version for any other.
 */
const coreVersion = (umbradb: string): CoreVersion =>
  umbradb === UMBRADB_VERSION ? buildCoreVersion() : { umbradb, ledgers: [] };

/** A recorded `core` row of UmbraDB `umbradb` from `start`, with the data of `CORE`. */
function coreRow(start: number, umbradb: string): HistoryRow {
  return { id: "core", start: BigInt(start), stop: null, version: canonicalJson(coreVersion(umbradb)), data: CORE_DATA, dataHash: dataHash(CORE_DATA) };
}

/** A recorded row of `m` at `version` from `start`, with its defaults as data. */
function mRow(start: number, version: string, stop: number | null = null): HistoryRow {
  return { id: "m", start: BigInt(start), stop: stop === null ? null : BigInt(stop), version, data: M_DEFAULTS, dataHash: dataHash(M_DEFAULTS) };
}

/** The outcome of checking `entries` of a build carrying `user` at `cursor`, on `history`. */
function versionOutcome(entries: readonly unknown[], user: Start["user"], cursor: bigint | null, history: readonly HistoryRow[]) {
  const declarations = build(user);
  try {
    checkHistory({ config: checked(entries, declarations), cursor, declarations, history });
    return "accepted";
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return { code: error.code, height: error.details.height, entries: error.details.entries };
  }
}

describe("A33: one version per build — the revision covering cursor + 1 names the build's version (CF-8)", () => {
  const recordedM = [coreRow(0, UMBRADB_VERSION), mRow(0, "1.0.0")];
  const asRecorded = versionEntry({ id: "m", start: 0, version: "1.0.0", config: M_DEFAULTS });

  it("refuses a newer build of a module with upgrade-required, the entry, the version needed and the build's", () => {
    expect(versionOutcome([CORE, asRecorded, M_1_1.entry({ start: 50, config: {} })], [M_1_1], C, recordedM)).toEqual({
      code: "upgrade-required",
      height: 21n,
      entries: [{ id: "m", start: 0, needed: "1.0.0", build: "1.1.0" }],
    });
  });

  it("refuses an older build of a module", () => {
    expect(versionOutcome([CORE, asRecorded], [M_0_9], C, recordedM)).toEqual({
      code: "upgrade-required",
      height: 21n,
      entries: [{ id: "m", start: 0, needed: "1.0.0", build: "0.9.0" }],
    });
  });

  it("refuses an older and a newer build of UmbraDB itself (the core entry)", () => {
    for (const umbradb of ["0.9.4", "0.10.1"]) {
      expect(versionOutcome([oldCore(0, umbradb), core(100)], [], C, [coreRow(0, umbradb)])).toEqual({
        code: "upgrade-required",
        height: 21n,
        entries: [{ id: "core", start: 0, needed: coreVersion(umbradb), build: buildCoreVersion() }],
      });
    }
  });

  it("checks S on a new database: a scheduled revision of another version covering S refuses", () => {
    const entries = [CORE, versionEntry({ id: "m", start: 0, version: "1.1.0" })];
    expect(versionOutcome(entries, [M_1_0], null, [])).toEqual({
      code: "upgrade-required",
      height: 0n,
      entries: [{ id: "m", start: 0, needed: "1.1.0", build: "1.0.0" }],
    });
    expect(versionOutcome([oldCore(5, "0.9.4", null), core(9)], [], null, [])).toMatchObject({ height: 5n, entries: [{ id: "core", start: 5 }] });
  });

  it("refuses the old build restarted at a boundary: a revision of another version starting at cursor + 1", () => {
    const history = [coreRow(0, UMBRADB_VERSION), mRow(0, "1.0.0"), { ...mRow(21, "1.1.0"), data: null, dataHash: null }];
    expect(versionOutcome([CORE, m(0), versionEntry({ id: "m", start: 21, version: "1.1.0" })], [M_1_0], C, history)).toMatchObject({
      code: "upgrade-required",
      entries: [{ id: "m", start: 21, needed: "1.1.0", build: "1.0.0" }],
    });
  });

  it("accepts revisions of other versions starting above cursor + 1, and a module with no revision at cursor + 1", () => {
    expect(versionOutcome([CORE, m(0), versionEntry({ id: "m", start: 22, version: "1.1.0" })], [M_1_0], C, recordedM)).toBe("accepted");
    // m stopped at 10: no revision of m covers 21, so this build's version of m is not compared.
    const stopped = [coreRow(0, UMBRADB_VERSION), mRow(0, "1.0.0", 10)];
    const entries = [CORE, versionEntry({ id: "m", start: 0, stop: 10, version: "1.0.0", config: M_DEFAULTS })];
    expect(versionOutcome(entries, [M_1_1], C, stopped)).toBe("accepted");
    // The core's stop is operational: after stopping at 10, the revision from 0 still covers 11.
    expect(versionOutcome([core(0, {}, 10)], [], 10n, [coreRow(0, UMBRADB_VERSION)])).toBe("accepted");
  });

  it("names every entry at once, in the configuration's order", () => {
    const history = [coreRow(0, "0.9.4"), mRow(0, "1.0.0"), { ...mRow(0, "1.0.0"), id: "n" }];
    const N_1_2 = moduleN("1.2.0");
    const entries = [
      versionEntry({ id: "n", start: 0, version: "1.0.0", config: M_DEFAULTS }),
      asRecorded,
      oldCore(0, "0.9.4"),
      core(100),
      N_1_2.entry({ start: 100, config: {} }),
    ];
    expect(versionOutcome(entries, [M_1_1, N_1_2], C, history)).toEqual({
      code: "upgrade-required",
      height: 21n,
      entries: [
        { id: "n", start: 0, needed: "1.0.0", build: "1.2.0" },
        { id: "m", start: 0, needed: "1.0.0", build: "1.1.0" },
        { id: "core", start: 0, needed: coreVersion("0.9.4"), build: buildCoreVersion() },
      ],
    });
  });

  it("compares the past first: a started revision written at another version is changes-past, not upgrade-required", () => {
    expect(versionOutcome([CORE, M_1_1.entry({ start: 0, config: {} })], [M_1_1], C, recordedM)).toMatchObject({ code: "changes-past" });
  });
});

describe("DB-10's input: the versions of each module's revisions that cover committed heights", () => {
  const rows = [coreRow(0, UMBRADB_VERSION), mRow(0, "1.0.0"), mRow(50, "1.1.0"), { ...mRow(90, "2.0.0"), data: null, dataHash: null }, { ...mRow(3, "0.1.0", 6), id: "n" }];

  it("is empty on a new database", () => {
    expect(committedVersions(rows, 0n, null)).toEqual(new Map());
  });

  it("holds each version whose revision meets S..cursor, in start order; not the core, nor a revision above the cursor", () => {
    expect(committedVersions(rows, 0n, 60n)).toEqual(
      new Map([
        ["m", ["1.0.0", "1.1.0"]],
        ["n", ["0.1.0"]],
      ]),
    );
    expect(committedVersions(rows, 0n, 49n)).toEqual(
      new Map([
        ["m", ["1.0.0"]],
        ["n", ["0.1.0"]],
      ]),
    );
    expect(committedVersions(rows, 0n, 50n).get("m")).toEqual(["1.0.0", "1.1.0"]);
    // A revision whose last height is below S covers no committed height.
    expect(committedVersions(rows, 7n, 60n).get("n")).toBeUndefined();
    expect(committedVersions(rows, 6n, 60n).get("n")).toEqual(["0.1.0"]);
    expect(committedVersions([mRow(0, "1.0.0"), mRow(5, "1.0.0")], 0n, 9n).get("m")).toEqual(["1.0.0"]);
  });

  it("leaves out a revision superseded before S: its range ends at the next start − 1 (CF-5)", () => {
    expect(committedVersions([mRow(0, "1.0.0"), mRow(5, "1.1.0")], 10n, 20n)).toEqual(new Map([["m", ["1.1.0"]]]));
  });

  it("reads the rows in any order", () => {
    expect(committedVersions([...rows].reverse(), 0n, 60n)).toEqual(committedVersions(rows, 0n, 60n));
  });

  it("reaches startup through the check, read from the history before this startup records anything", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0)], cursor: null });
    const check = db.start({ entries: [CORE, m(0), m(30, { limit: 2 })], cursor: C });
    expect(check.committedVersions).toEqual(new Map([["m", ["1.0.0"]]]));
  });
});

describe("Q102 (option A): the process's operational settings are the latest core revision's of the build's version", () => {
  it("takes the latest by start, whatever the file's order, and its development opt-in", () => {
    const config = checked([core(30, { tipCap: 3 }), core(0, { developmentOptIn: true }), core(10, { tipCap: 1 })], build([]));
    expect(processCoreEntry(config)).toMatchObject({ start: 30, settings: { tipCap: 3, developmentOptIn: false } });
    const declarations = build([]);
    const check = checkHistory({ config, cursor: null, declarations, history: [] });
    expect([check.process.start, check.developmentOptIn]).toEqual([30, false]);
    const later = checked([core(0), core(10, { developmentOptIn: true })], declarations);
    expect(checkHistory({ config: later, cursor: null, declarations, history: [] }).developmentOptIn).toBe(true);
  });

  it("skips core revisions of other versions, and refuses a configuration that has none of the build's", () => {
    const config = checked([core(0, { tipCap: 1 }), oldCore(50, "0.9.6", null)], build([]));
    expect(processCoreEntry(config).start).toBe(0);
    const error = refusal(() => processCoreEntry(checked([oldCore(0, "0.9.4")], build([]))));
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toEqual({ file: FILE, reason: "no-build-core-revision" });
    for (const words of ["no core revision", UMBRADB_VERSION, "coreEntry"]) expect(error.message).toContain(words);
    expect(error.message).not.toMatch(/\b(?:[A-Z]{2,5}-\d+|Q\d+)\b/);
  });
});

describe("CF-9: sweep: off needs the development opt-in", () => {
  it("refuses a core revision with sweep: off that runs above the cursor, naming the feature and the entry", () => {
    const db = new Simulation();
    const error = db.refusal({ entries: [core(0, { sweep: "off" })], cursor: null });
    expect(error.code).toBe("development-opt-in-required");
    expect(error.details).toMatchObject({ feature: "sweep-off", file: FILE, cursor: null });
    expect(found(error)).toEqual([["sweep-off", "entries[0].config.sweep", "sweep"]]);
    for (const words of ["sweep", "developmentOptIn"]) expect(error.message).toContain(words);
    expect(error.message).not.toMatch(/\b(?:[A-Z]{2,5}-\d+|Q\d+)\b/);
    expect(db.start({ entries: [core(0, { sweep: "off", developmentOptIn: true })], cursor: null }).writes).toHaveLength(1);
  });

  it("does not refuse one that ends at the cursor (no height of it is left to run), nor a module's own setting sweep", () => {
    const db = new Simulation();
    db.start({ entries: [core(0, { sweep: "off" }), core(10, { developmentOptIn: true })], cursor: null });
    expect(db.start({ entries: [core(0, { sweep: "off" }), core(10)], cursor: 9n }).writes).toEqual([]);
    const sweeper = defineModule({
      ...declaration("sweeper"),
      configSchema: z.object({ sweep: z.enum(["on", "off"]).meta({ kind: "data" }) }),
    });
    const fresh = new Simulation();
    expect(fresh.start({ entries: [CORE, sweeper.entry({ start: 0, config: { sweep: "off" } })], user: [sweeper], cursor: null }).writes).toHaveLength(2);
  });

  it("does not refuse one that ended at or below the cursor, whose past cannot change", () => {
    const db = new Simulation();
    db.start({ entries: [core(0, { sweep: "off" }), core(10, { developmentOptIn: true })], cursor: null });
    expect(db.start({ entries: [core(0, { sweep: "off" }), core(10)], cursor: C }).writes).toEqual([]);
    // The revision holding a height above the cursor is refused.
    expect(db.refusal({ entries: [core(0, { sweep: "off" }), core(10), core(30, { sweep: "off" })], cursor: C }).code).toBe(
      "development-opt-in-required",
    );
  });
});

describe("the graph's input and the caller's errors", () => {
  it("gives resolveGraph S, every module revision with its effective stop, the opt-in and the cursor", () => {
    const declarations = build([M_1_0, N]);
    const config = checked([core(5), core(9, { developmentOptIn: true }), m(5), m(8, {}, 30), n(6)], declarations);
    const check = checkHistory({ config, cursor: null, declarations, history: [] });
    expect(graphInputOf(check, declarations)).toEqual({
      declarations,
      start: 5n,
      entries: [
        { id: "m", start: 5n, stop: 7n },
        { id: "m", start: 8n, stop: 30n },
        { id: "n", start: 6n, stop: null },
      ],
      developmentOptIn: true,
      cursor: null,
    });
    expect(check.start).toBe(5n);
  });

  it("gives resolveGraph the cursor the history was checked at", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0)], cursor: null });
    const check = db.start({ entries: [CORE, m(0)], cursor: C });
    expect(graphInputOf(check, build()).cursor).toBe(C);
  });

  it("refuses with upgrade-required before development-opt-in-required, and takes a cursor at S", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0)], cursor: null });
    const both = [CORE, core(21, { sweep: "off" }), versionEntry({ id: "m", start: 0, version: "1.0.0", config: M_DEFAULTS })];
    expect(db.refusal({ entries: both, user: [M_1_1], cursor: C }).code).toBe("upgrade-required");
    const declarations = build();
    const config = checked([core(5), m(5)], declarations);
    expect(checkHistory({ config, cursor: 5n, declarations, history: [rowOf(config.entries[0]!), rowOf(config.entries[1]!)] }).writes).toEqual([]);
  });

  it("refuses a cursor that is no height, or below S, as the caller's error (thrown)", () => {
    const declarations = build();
    const config = checked([core(5), m(5)], declarations);
    expect(() => checkHistory({ config, cursor: 4n, declarations, history: [] })).toThrow(/below S \(5\)/);
    expect(() => checkHistory({ config, cursor: 7 as unknown as bigint, declarations, history: [] })).toThrow(/neither null/);
  });
});

/**
 * Each rule's cases: a refusal of `CHANGES` (by its rule), an omitted entry, a newer build and sweep off.
 * [A30, A33, CF-9]
 */
function ruleCases(): { readonly rule: string; readonly test: Case }[] {
  const base = { entries: [CORE, m(1), m(50)], cursor: null };
  return [
    ...CHANGES.map((test) => ({ rule: test.rule, test })),
    { rule: "listed", test: { name: "an omitted entry", first: base, then: { entries: [CORE, m(1)], cursor: 50n } } },
    {
      rule: "build-version",
      test: {
        name: "a newer build",
        first: { entries: [CORE, m(0)], cursor: null },
        then: { entries: [CORE, versionEntry({ id: "m", start: 0, version: "1.0.0", config: M_DEFAULTS })], user: [M_1_1], cursor: C },
      },
    },
    {
      rule: "sweep-off",
      test: { name: "sweep off", first: { entries: [CORE], cursor: null }, then: { entries: [CORE, core(21, { sweep: "off" })], cursor: C } },
    },
  ];
}

describe("negative controls (committed)", () => {
  it("covers every rule of HISTORY_RULES with a case, each case refused by its own rule only", () => {
    const cases = ruleCases();
    expect(new Set(cases.map((c) => c.rule))).toEqual(new Set(HISTORY_RULES.map((rule) => rule.name)));
    for (const { rule, test } of cases) {
      const result = outcome(test);
      expect(result, test.name).toHaveProperty("findings");
      expect(new Set((result as { findings: [string, string, string | null][] }).findings.map(([name]) => name)), test.name).toEqual(new Set([rule]));
    }
  });

  it.each(HISTORY_RULES.map((rule) => rule.name))("the history without its %s rule accepts exactly that rule's cases", (name) => {
    const rules = HISTORY_RULES.filter((rule) => rule.name !== name);
    for (const { rule, test } of ruleCases()) {
      const without = outcome(test, { rules });
      if (rule === name) expect(without, test.name).toHaveProperty("writes");
      else expect(without, test.name).toEqual(outcome(test));
    }
    for (const test of ACCEPTED) expect(outcome(test, { rules }), test.name).toEqual(outcome(test));
  });

  it("with stops compared strictly (no allowance above the cursor), exactly the stop allowance's cases refuse", () => {
    const options: HistoryOptions = { stopChangeAllowed: () => false };
    for (const test of ACCEPTED) {
      const result = outcome(test, options);
      if (test.allowance === "stop") {
        expect(result, test.name).toEqual({ code: "changes-past", findings: [["stop", "entries[1].stop", "stop"]] });
      } else {
        expect(result, test.name).toEqual(outcome(test));
      }
    }
    for (const test of CHANGES) expect(outcome(test, options), test.name).toEqual(outcome(test));
  });

  it("with operational settings recorded and compared too, exactly the operational allowance's cases refuse", () => {
    const options: HistoryOptions = { recordedData: (entry) => (entry.buildVersion ? entry.settings : recordedData(entry)) };
    for (const test of ACCEPTED) {
      const result = outcome(test, options);
      if (test.allowance === "operational") {
        expect(result, test.name).toMatchObject({ code: "changes-past" });
        expect((result as { findings: [string, string, string | null][] }).findings.every(([rule]) => rule === "data"), test.name).toBe(true);
      } else {
        expect(result, test.name).toEqual(outcome(test));
      }
    }
  });

  it("with every omission refused (CF-5 before Q103, the old rule), exactly the omission allowance's cases refuse", () => {
    const options: HistoryOptions = { omissionAllowed: () => false };
    for (const test of ACCEPTED) {
      const result = outcome(test, options);
      if (test.allowance === "omission") {
        const missing = (test.deletes ?? []).map((): [string, string, null] => ["listed", "entries", null]);
        expect(result, test.name).toEqual({ code: "missing-entry", findings: missing });
      } else {
        expect(result, test.name).toEqual(outcome(test));
      }
    }
    for (const { test } of ruleCases()) expect(outcome(test, options), test.name).toEqual(outcome(test));
  });

  it("never deletes a row at or below the cursor, even with the listed rule left out (the past stays recorded)", () => {
    const rules = HISTORY_RULES.filter((rule) => rule.name !== "listed");
    const db = new Simulation();
    db.start({ entries: [CORE, m(0), m(20), m(21)], cursor: null });
    const check = db.start({ entries: [CORE, m(0)], cursor: C, options: { rules } });
    expect(check.deletes.map(keyOf)).toEqual([["m", 21]]);
    expect(rowAt(db.history, "m", 20)).toBeDefined();
  });

  it("treats an omitted row as allowed exactly when it starts above the cursor, or nothing has committed (omissionAllowed)", () => {
    const row = (start: bigint): HistoryRow => ({ id: "m", start, stop: null, version: "1.0.0", data: null, dataHash: null });
    expect([omissionAllowed(row(20n), C), omissionAllowed(row(21n), C), omissionAllowed(row(0n), null)]).toEqual([false, true, true]);
    expect(omissionAllowed(row(19n), C)).toBe(false);
  });

  it("finds nothing for an unchanged restart with every rule (historyFindings)", () => {
    const db = new Simulation();
    db.start({ entries: [CORE, m(0)], cursor: null });
    const declarations = build();
    const input = { config: checked([CORE, m(0)], declarations), cursor: C, declarations, history: db.history };
    expect(historyFindings(input)).toEqual([]);
  });
});

describe("PP-13: the public table items a private process reads from the history (publicItemRanges, task 14.1a)", () => {
  /** A row as a private process reads it from the public `core_chain.config`: its heights and its `provides`. */
  const row = (id: string, start: number, stop: number | null, provides: readonly string[]) => ({
    id,
    start: BigInt(start),
    stop: stop === null ? null : BigInt(stop),
    provides,
  });
  const range = (item: string, provider: string, start: number, stop: number | null) => ({
    item,
    provider,
    start: BigInt(start),
    stop: stop === null ? null : BigInt(stop),
  });

  it("gives each item of a row the row's heights, to its last height by CF-5: its own stop or the next revision's start − 1", () => {
    const rows = [
      row("m", 30, 90, ["m-rows"]),
      row("m", 0, 50, ["m-rows", "m-sums"]),
      row("core", 0, null, ["blocks", "chain-identity"]),
      row("core", 100, null, ["blocks"]),
      row("n", 5, 8, ["n-rows"]),
      row("n", 20, null, []),
    ];
    expect(publicItemRanges(rows)).toEqual([
      range("blocks", "core", 0, 99),
      range("chain-identity", "core", 0, 99),
      range("blocks", "core", 100, null),
      // m from 0 stops at 50 by its own stop… but m from 30 supersedes it from 30. [CF-5]
      range("m-rows", "m", 0, 29),
      range("m-sums", "m", 0, 29),
      range("m-rows", "m", 30, 90),
      // n stops at 8: the gap up to 19 provides nothing; its revision from 20 provides no table item.
      range("n-rows", "n", 5, 8),
    ]);
  });

  it("gives the same items whatever order the rows come in, and none for none", () => {
    const rows = [row("b", 0, null, ["x"]), row("a", 3, null, ["y", "z"]), row("a", 1, 2, ["y"])];
    expect(publicItemRanges(rows)).toEqual(publicItemRanges([...rows].reverse()));
    expect(publicItemRanges([])).toEqual([]);
  });

  it("refuses nothing itself: the graph judges the ranges (an own stop below the start is the history's CHECK's)", () => {
    expect(publicItemRanges([row("a", 4, 4, ["y"])])).toEqual([range("y", "a", 4, 4)]);
  });
});

describe("RN-16, PP-14: the configuration hash of the history's rows (configHashOf, task 14.1b, owner decision Q147)", () => {
  const H = (byte: number) => new Uint8Array(32).fill(byte);
  const ROWS: readonly ConfigHashRow[] = [
    { id: "core", start: 1n, stop: null, version: '{"umbradb":"0.9.5"}', dataHash: H(1), provides: ["blocks", "chain-identity"] },
    { id: "pub", start: 1n, stop: null, version: "1.0.0", dataHash: H(2), provides: ["pub-rows"] },
    { id: "pub", start: 30n, stop: 40n, version: "1.1.0", dataHash: null, provides: [] },
  ];

  it("is SHA-256 of the canonical encoding of the tagged rows by id and start, as 0x and 64 lowercase hex digits", () => {
    const hash = configHashOf(ROWS);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    const encoded = encodeCanonical([
      "umbradb-config-hash",
      1,
      ROWS.map((row) => [row.id, row.start, row.stop, row.version, row.dataHash, [...row.provides]]),
    ]);
    expect(hash).toBe(`0x${createHash("sha256").update(encoded).digest("hex")}`);
  });

  it("does not depend on the rows' order: ids by their UTF-8 bytes, then starts", () => {
    expect(configHashOf([...ROWS].reverse())).toBe(configHashOf(ROWS));
    expect(configHashOf([ROWS[2] as ConfigHashRow, ROWS[0] as ConfigHashRow, ROWS[1] as ConfigHashRow])).toBe(configHashOf(ROWS));
    // "\uFF5E" (EF BD 9E) before "\u{1F600}" (F0 9F 98 80) by UTF-8 bytes, after it by UTF-16 code units (D83D …).
    const a = { ...(ROWS[1] as ConfigHashRow), id: "\uFF5E" };
    const b = { ...(ROWS[1] as ConfigHashRow), id: "\u{1F600}" };
    const ordered = encodeCanonical(["umbradb-config-hash", 1, [a, b].map((row) => [row.id, row.start, row.stop, row.version, row.dataHash, [...row.provides]])]);
    expect(configHashOf([b, a])).toBe(`0x${createHash("sha256").update(ordered).digest("hex")}`);
  });

  it("changes with every field of every row: id, start, stop, version, data_hash and provides", () => {
    const base = configHashOf(ROWS);
    const changed = (patch: Partial<ConfigHashRow>, index = 1) =>
      configHashOf(ROWS.map((row, at) => (at === index ? { ...row, ...patch } : row)));
    for (const patch of [
      { id: "pub2" },
      { start: 2n },
      { stop: 9n },
      { version: "1.0.1" },
      { dataHash: H(3) },
      { dataHash: null },
      { provides: ["pub-rows", "pub-other"] },
      { provides: [] },
    ] as const) {
      expect(changed(patch), JSON.stringify(patch, (_k, v) => (typeof v === "bigint" ? `${v}` : v))).not.toBe(base);
    }
    expect(changed({ stop: null }, 2)).not.toBe(base);
    expect(configHashOf(ROWS.slice(0, 2))).not.toBe(base);
    expect(configHashOf([])).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("is equal for equal rows, the data's hash standing for the data (CF-7: a data field's change changes data_hash)", () => {
    const copy = ROWS.map((row) => ({ ...row, dataHash: row.dataHash === null ? null : new Uint8Array(row.dataHash), provides: [...row.provides] }));
    expect(configHashOf(copy)).toBe(configHashOf(ROWS));
    const data = (level: number) => dataHash({ level });
    expect(configHashOf([{ ...(ROWS[1] as ConfigHashRow), dataHash: data(0) }])).toBe(configHashOf([{ ...(ROWS[1] as ConfigHashRow), dataHash: data(0) }]));
    expect(configHashOf([{ ...(ROWS[1] as ConfigHashRow), dataHash: data(1) }])).not.toBe(configHashOf([{ ...(ROWS[1] as ConfigHashRow), dataHash: data(0) }]));
  });
});
