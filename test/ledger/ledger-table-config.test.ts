import { describe, expect, it } from "vitest";
import { PRIVATE_CORE_SCHEMA, PUBLIC_CORE_SCHEMA } from "../../src/config/core-settings.js";
import { coreEntry } from "../../src/config/entries.js";
import { type Finding, validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { builtInLedgerTable, ledgerTableOf } from "../../src/ledger/networks.js";
import { effectiveLedgerTable, type LedgerTable, selectLedgerVersion, U32_MAX } from "../../src/ledger/version-table.js";
import { toHex } from "../../src/node/decode.js";
import { CORE_SETTINGS } from "../config/config-fixtures.js";
import { input } from "../config/validate-fixtures.js";
import { NETWORK_ID, RAW, systemTransaction, unprovenDeploy, zswapOutputTransaction } from "./adapter-fixtures.js";
import { blockWith, hashOf, mnsvItem, OTHER_ITEMS } from "./version-checks.js";

/**
 * The `core` entry's `ledgerTable` (CF-4, LG-1 to LG-3; task 12.2): its default is the built-in table of the network
 * (`src/ledger/networks.json`), and a configured table adds to or replaces parts of it — a configured row maps the
 * spec_versions it covers, the built-in rows the rest; a configured pin replaces the built-in pin at its height and adds
 * one elsewhere. A network not in the file (`custom`) sets its own rows. The validation (task 4.2's, through the `core`
 * schema) refuses what LG-1 and LG-2 forbid, each with its path, and gives the table in effect as the revision's
 * setting, so the history records it as a data field (CF-7: every default applied).
 *
 * A95 `[CI]`'s synthetic half: a configuration table "every `spec_version` → v8" selects v8 for every block of a
 * synthetic devnet, whose transactions the v8 adapter it selects parses. The real half — every block of task 0.3's
 * devnet tape — waits for that tape.
 */

const BUILT_IN_MAINNET = builtInLedgerTable("mainnet") as LedgerTable;
const BUILT_IN_PREPROD = builtInLedgerTable("preprod") as LedgerTable;
const H = (n: number) => toHex(hashOf(n));

/** A configuration of the public `core` entry with `settings` added to the required ones. */
const withCore = (settings: Record<string, unknown>) => ({
  entries: [coreEntry({ start: 0, config: { ...CORE_SETTINGS, ...settings } as never })],
});

/** The findings of the validation's refusal of `config`. */
function findingsOf(config: unknown): readonly Finding[] {
  try {
    validateConfig(input(config));
  } catch (error) {
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("invalid-configuration");
    return (error as UmbraError).details.findings as readonly Finding[];
  }
  return expect.unreachable("expected the configuration to be refused");
}

/** The settings the validation gives the `core` revision of `config`. */
const coreSettingsOf = (config: unknown) => validateConfig(input(config)).entries[0]!;

describe("the default: the network's built-in table (CF-4, LG-3)", () => {
  it("gives a known network's revision the built-in table, as a data field the history records", () => {
    for (const network of ["mainnet", "preprod", "preview", "stagenet"]) {
      const entry = coreSettingsOf(withCore({ network }));
      expect(entry.settings?.ledgerTable, network).toEqual(builtInLedgerTable(network));
      expect(entry.data?.ledgerTable, network).toEqual(builtInLedgerTable(network));
      expect(entry.kinds?.ledgerTable).toBe("data");
    }
    expect(Object.isFrozen(coreSettingsOf(withCore({})).settings?.ledgerTable)).toBe(true);
  });

  it("checks a private process's table by the same rules", () => {
    const required = { database: "pglite:memory", instanceId: "wallet-1" };
    const paths = (settings: Record<string, unknown>) =>
      (PRIVATE_CORE_SCHEMA.safeParse({ ...required, ...settings }).error?.issues ?? []).map((issue) => issue.path);
    expect(paths({ network: "custom", genesisHash: H(1) })).toEqual([["ledgerTable"]]);
    expect(paths({ network: "preprod", ledgerTable: { rows: [{ specVersionMin: 9, specVersionMax: 8, ledger: "v8" }] } })).toEqual([
      ["ledgerTable", "rows", 0],
    ]);
  });

  it("gives a private process's revision the same table", () => {
    const parsed = PRIVATE_CORE_SCHEMA.parse({ network: "preprod", database: "pglite:memory", instanceId: "wallet-1" });
    expect(parsed.ledgerTable).toEqual(BUILT_IN_PREPROD);
    expect(PUBLIC_CORE_SCHEMA.parse({ ...CORE_SETTINGS }).ledgerTable).toEqual(BUILT_IN_PREPROD);
  });

  it("refuses a custom network without its own rows: no file has its table (LG-3)", () => {
    const genesis = { network: "custom", genesisHash: H(1) };
    for (const [settings, path] of [
      [genesis, "entries[0].config.ledgerTable"],
      [{ ...genesis, ledgerTable: {} }, "entries[0].config.ledgerTable.rows"],
      [{ ...genesis, ledgerTable: { rows: [] } }, "entries[0].config.ledgerTable.rows"],
      [{ ...genesis, ledgerTable: { pins: [] } }, "entries[0].config.ledgerTable.rows"],
    ] as const) {
      const findings = findingsOf(withCore(settings));
      expect(findings.map((found) => [found.rule, found.path, found.field])).toEqual([["settings-schema", path, "ledgerTable"]]);
      expect(findings[0]?.message).toContain("a custom network sets its own ledger table");
    }
  });

  it("A95's table: a custom network's 'every spec_version → v8' is its table in effect", () => {
    const rows = [{ specVersionMin: 0, specVersionMax: U32_MAX, ledger: "v8" }];
    const entry = coreSettingsOf(withCore({ network: "custom", genesisHash: H(1), ledgerTable: { rows } }));
    expect(entry.settings?.ledgerTable).toEqual({ rows, pins: [] });
  });
});

describe("adding and replacing rows and pins (LG-3)", () => {
  it("maps the spec_versions a configured row covers by it, and the rest by the built-in rows", () => {
    const table = ledgerTableOf("mainnet", { rows: [{ specVersionMin: 1_500_000, specVersionMax: 2_499_999, ledger: "v9" }] });
    expect(table.rows).toEqual([
      { specVersionMin: 22_000, specVersionMax: 22_999, ledger: "v8" },
      { specVersionMin: 1_000_000, specVersionMax: 1_499_999, ledger: "v8" },
      { specVersionMin: 1_500_000, specVersionMax: 2_499_999, ledger: "v9" },
      { specVersionMin: 2_500_000, specVersionMax: 2_999_999, ledger: "v9" },
    ]);
    const select = (specVersion: number) => selectLedgerVersion(table, blockWith(5, [mnsvItem(specVersion)])).ledger;
    expect([22_500, 1_499_999, 1_500_000, 2_499_999, 2_500_000].map(select)).toEqual(["v8", "v8", "v9", "v9", "v9"]);
  });

  it("adds a row that covers what no built-in row does, and replaces a built-in row it covers whole", () => {
    expect(
      ledgerTableOf("mainnet", {
        rows: [
          { specVersionMin: 3_000_000, specVersionMax: 3_999_999, ledger: "v9" },
          { specVersionMin: 0, specVersionMax: 999_999, ledger: "v9" },
        ],
      }).rows,
    ).toEqual([
      { specVersionMin: 0, specVersionMax: 999_999, ledger: "v9" },
      { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
      { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
      { specVersionMin: 3_000_000, specVersionMax: 3_999_999, ledger: "v9" },
    ]);
  });

  it("cuts a built-in row around several configured rows, at its edges too", () => {
    const builtIn: LedgerTable = { rows: [{ specVersionMin: 10, specVersionMax: 100, ledger: "v8" }], pins: [] };
    const cut = (rows: { specVersionMin: number; specVersionMax: number }[]) =>
      effectiveLedgerTable(builtIn, { rows: rows.map((row) => ({ ...row, ledger: "v9" as const })) }).rows.map((row) => [
        row.specVersionMin,
        row.specVersionMax,
        row.ledger,
      ]);
    expect(cut([{ specVersionMin: 10, specVersionMax: 10 }])).toEqual([[10, 10, "v9"], [11, 100, "v8"]]);
    expect(cut([{ specVersionMin: 100, specVersionMax: 120 }])).toEqual([[10, 99, "v8"], [100, 120, "v9"]]);
    expect(cut([{ specVersionMin: 0, specVersionMax: 200 }])).toEqual([[0, 200, "v9"]]);
    expect(cut([{ specVersionMin: 40, specVersionMax: 50 }, { specVersionMin: 20, specVersionMax: 30 }])).toEqual([
      [10, 19, "v8"],
      [20, 30, "v9"],
      [31, 39, "v8"],
      [40, 50, "v9"],
      [51, 100, "v8"],
    ]);
    expect(cut([{ specVersionMin: 51, specVersionMax: 52 }, { specVersionMin: 0, specVersionMax: 5 }])).toEqual([
      [0, 5, "v9"],
      [10, 50, "v8"],
      [51, 52, "v9"],
      [53, 100, "v8"],
    ]);
    expect(cut([{ specVersionMin: 200, specVersionMax: 300 }])).toEqual([[10, 100, "v8"], [200, 300, "v9"]]);
    expect(cut([{ specVersionMin: 0, specVersionMax: 99 }])).toEqual([[0, 99, "v9"], [100, 100, "v8"]]);
    expect(cut([{ specVersionMin: 11, specVersionMax: 100 }])).toEqual([[10, 10, "v8"], [11, 100, "v9"]]);
    expect(cut([])).toEqual([[10, 100, "v8"]]);
  });

  it("replaces a built-in pin at a configured pin's height, keeps the others, and orders them by height", () => {
    const builtIn: LedgerTable = {
      rows: BUILT_IN_MAINNET.rows,
      pins: [
        { height: 10, hash: H(10), specVersion: 1_000_000 },
        { height: 30, hash: H(30), specVersion: 2_000_000 },
      ],
    };
    const table = effectiveLedgerTable(builtIn, {
      pins: [
        { height: 30, hash: H(31), specVersion: 2_000_000 },
        { height: 20, hash: H(20), specVersion: 1_000_300 },
      ],
    });
    expect(table).toEqual({
      rows: BUILT_IN_MAINNET.rows,
      pins: [
        { height: 10, hash: H(10), specVersion: 1_000_000 },
        { height: 20, hash: H(20), specVersion: 1_000_300 },
        { height: 30, hash: H(31), specVersion: 2_000_000 },
      ],
    });
    expect(Object.isFrozen(table)).toBe(true);
    expect(Object.isFrozen(table.rows)).toBe(true);
    expect(Object.isFrozen(table.pins)).toBe(true);
    expect(Object.isFrozen(table.pins[0])).toBe(true);
  });

  it("leaves out a configured row that is no range of spec_versions, which the rules refuse", () => {
    const builtIn: LedgerTable = { rows: [{ specVersionMin: 10, specVersionMax: 100, ledger: "v8" }], pins: [] };
    for (const row of [
      { specVersionMin: 60, specVersionMax: 50, ledger: "v9" as const },
      { specVersionMin: 60, specVersionMax: U32_MAX + 1, ledger: "v9" as const },
    ]) {
      expect(effectiveLedgerTable(builtIn, { rows: [row] }), JSON.stringify(row)).toEqual(builtIn);
    }
  });

  it("is the built-in table itself without a configured one, and only the configured one without a built-in table", () => {
    expect(effectiveLedgerTable(BUILT_IN_MAINNET, undefined)).toEqual(BUILT_IN_MAINNET);
    expect(effectiveLedgerTable(BUILT_IN_MAINNET, {})).toEqual(BUILT_IN_MAINNET);
    const own = { rows: [{ specVersionMin: 5, specVersionMax: 9, ledger: "v8" as const }], pins: [{ height: 1, hash: H(1), specVersion: 5 }] };
    expect(effectiveLedgerTable(null, own)).toEqual(own);
    expect(effectiveLedgerTable(null, undefined)).toEqual({ rows: [], pins: [] });
    expect(ledgerTableOf("custom", own)).toEqual(own);
  });

  it("gives the configuration's table in effect as the revision's setting", () => {
    const pin = { height: 5, hash: H(5), specVersion: 1_000_000 };
    const entry = coreSettingsOf(withCore({ network: "mainnet", ledgerTable: { pins: [pin] } }));
    expect(entry.data?.ledgerTable).toEqual({ rows: BUILT_IN_MAINNET.rows, pins: [...BUILT_IN_MAINNET.pins, pin] });
  });
});

describe("LG-1 and LG-2's rules on a configured table, each finding with its path", () => {
  const rows = (...given: unknown[]) => withCore({ ledgerTable: { rows: given } });
  const pins = (...given: unknown[]) => withCore({ ledgerTable: { pins: given } });
  const CASES: readonly { name: string; config: unknown; paths: string[]; says: string[] }[] = [
    {
      name: "a row's specVersionMax above the largest spec_version",
      config: rows({ specVersionMin: 3_000_000, specVersionMax: U32_MAX + 1, ledger: "v9" }),
      paths: ["entries[0].config.ledgerTable.rows[0].specVersionMax"],
      says: ["4294967296", "4294967295", "u32"],
    },
    {
      name: "a row's specVersionMin above the largest spec_version",
      config: rows({ specVersionMin: U32_MAX + 1, specVersionMax: U32_MAX + 2, ledger: "v9" }),
      paths: ["entries[0].config.ledgerTable.rows[0].specVersionMin", "entries[0].config.ledgerTable.rows[0].specVersionMax"],
      says: ["4294967295"],
    },
    {
      name: "a row whose bounds are the wrong way round",
      config: rows({ specVersionMin: 9, specVersionMax: 8, ledger: "v8" }),
      paths: ["entries[0].config.ledgerTable.rows[0]"],
      says: ["specVersionMin 9", "specVersionMax 8", "inclusive"],
    },
    {
      name: "a row naming a ledger this build does not carry",
      config: rows({ specVersionMin: 3_000_000, specVersionMax: 3_999_999, ledger: "v10" }),
      paths: ["entries[0].config.ledgerTable.rows[0].ledger"],
      says: ["v10", "v8, v9"],
    },
    {
      name: "two configured rows covering one spec_version",
      config: rows(
        { specVersionMin: 3_000_000, specVersionMax: 3_500_000, ledger: "v9" },
        { specVersionMin: 4_000_000, specVersionMax: 4_000_000, ledger: "v9" },
        { specVersionMin: 3_500_000, specVersionMax: 3_999_999, ledger: "v9" },
      ),
      paths: ["entries[0].config.ledgerTable.rows[2]"],
      says: ["3500000", "rows[0]", "one row"],
    },
    {
      name: "a configured row ending where an earlier one starts",
      config: rows(
        { specVersionMin: 3_500_000, specVersionMax: 3_999_999, ledger: "v9" },
        { specVersionMin: 3_000_000, specVersionMax: 3_500_000, ledger: "v9" },
      ),
      paths: ["entries[0].config.ledgerTable.rows[1]"],
      says: ["3500000", "rows[0]", "one row"],
    },
    {
      name: "a row the wrong way round beside one it would overlap: its own finding only",
      config: rows(
        { specVersionMin: 3_000_009, specVersionMax: 3_000_008, ledger: "v9" },
        { specVersionMin: 3_000_005, specVersionMax: 3_000_010, ledger: "v9" },
      ),
      paths: ["entries[0].config.ledgerTable.rows[0]"],
      says: ["specVersionMin 3000009", "specVersionMax 3000008"],
    },
    {
      name: "a row above the largest spec_version beside one it would overlap: its own finding only",
      config: rows(
        { specVersionMin: 4_000_000_000, specVersionMax: U32_MAX + 5, ledger: "v9" },
        { specVersionMin: 4_000_000_001, specVersionMax: 4_000_000_001, ledger: "v9" },
      ),
      paths: ["entries[0].config.ledgerTable.rows[0].specVersionMax"],
      says: ["4294967300"],
    },
    {
      name: "a pin's spec_version above the largest",
      config: pins({ height: 3, hash: H(3), specVersion: U32_MAX + 1 }),
      paths: ["entries[0].config.ledgerTable.pins[0].specVersion"],
      says: ["4294967295"],
    },
    {
      name: "two pins at one height",
      config: pins({ height: 3, hash: H(3), specVersion: 1_000_000 }, { height: 4, hash: H(4), specVersion: 1_000_000 }, { height: 3, hash: H(30), specVersion: 1_000_000 }),
      paths: ["entries[0].config.ledgerTable.pins[2].height"],
      says: ["height 3", "pins[0]", "one pin"],
    },
    {
      name: "a pin whose spec_version no row covers",
      config: pins({ height: 3, hash: H(3), specVersion: 3_000_000 }),
      paths: ["entries[0].config.ledgerTable.pins[0].specVersion"],
      says: ["3000000", "no row", "unknown-runtime"],
    },
  ];

  for (const row of CASES) {
    it(`refuses ${row.name}`, () => {
      const findings = findingsOf(row.config);
      expect(findings.map((found) => found.path)).toEqual(row.paths);
      for (const found of findings) {
        expect(found.rule).toBe("settings-schema");
        expect(found.field).toBe("ledgerTable");
      }
      for (const words of row.says) expect(findings[0]?.message).toContain(words);
    });
  }

  it("accepts a pin whose spec_version only a configured row covers, and rows at the u32 edges", () => {
    const config = withCore({
      ledgerTable: {
        rows: [
          { specVersionMin: 3_000_000, specVersionMax: U32_MAX - 1, ledger: "v9" },
          { specVersionMin: U32_MAX, specVersionMax: U32_MAX, ledger: "v9" },
          { specVersionMin: 0, specVersionMax: 0, ledger: "v8" },
        ],
        pins: [{ height: 3, hash: H(3), specVersion: U32_MAX }],
      },
    });
    expect(coreSettingsOf(config).data?.ledgerTable).toMatchObject({ pins: [{ height: 3, specVersion: U32_MAX }] });
  });

  it("checks no rule on a revision of another version (CF-3: compared with its recorded row instead)", () => {
    const earlier = { umbradb: "0.9.4", ledgers: [] };
    const config = {
      entries: [
        { id: "core", start: 0, version: earlier, config: { network: "custom", ledgerTable: { rows: [{ specVersionMin: 9, specVersionMax: 8, ledger: "v10" }] } } },
        coreEntry({ start: 10, config: { ...CORE_SETTINGS } }),
      ],
    };
    expect(validateConfig(input(config)).entries[0]?.settings).toMatchObject({ network: "custom" });
  });
});

describe("A95 [CI], synthetic: a custom devnet's 'every spec_version → v8' parses every block with v8", () => {
  it("selects v8 for blocks of runtimes 0.22, 1.0, 2.0 and an unknown one, and v8's adapter parses them", { timeout: 120_000 }, async () => {
    const config = withCore({
      network: "custom",
      genesisHash: H(0),
      ledgerTable: { rows: [{ specVersionMin: 0, specVersionMax: U32_MAX, ledger: "v8" }] },
    });
    const table = coreSettingsOf(config).settings?.ledgerTable as unknown as LedgerTable;
    const transactions = [systemTransaction("v8"), zswapOutputTransaction(RAW.v8), unprovenDeploy(RAW.v8)];
    const runtimes = [22_000, 1_000_000, 1_000_300, 2_000_000, 2_100_000, 3_000_000, 0, U32_MAX];
    const adapters = new Map<string, Awaited<ReturnType<typeof loadLedgerPackage>>>();
    for (const [height, specVersion] of runtimes.entries()) {
      const selection = selectLedgerVersion(table, blockWith(height, [...OTHER_ITEMS, mnsvItem(specVersion)]));
      expect(selection, `block ${height}`).toEqual({ specVersion, ledger: "v8" });
      if (!adapters.has(selection.ledger)) adapters.set(selection.ledger, await loadLedgerPackage(selection.ledger, { networkId: NETWORK_ID }));
      const adapter = adapters.get(selection.ledger)!;
      expect(adapter.ledger).toBe("v8");
      const bytes = transactions[height % transactions.length]!;
      const parsed = adapter.parseTransaction(bytes, 0);
      expect(parsed.bytes).toBe(bytes);
      expect(parsed.kind).toBe(height % transactions.length === 0 ? "system" : "regular");
    }
    expect([...adapters.keys()]).toEqual(["v8"]);
  });
});
