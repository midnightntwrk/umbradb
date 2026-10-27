import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { buildCoreVersion, type CoreVersion } from "../../src/config/build.js";
import type { ProcessSide } from "../../src/config/core-settings.js";
import { coreEntry, versionEntry } from "../../src/config/entries.js";
import { loadConfig } from "../../src/config/load.js";
import {
  CONFIG_RULES,
  type ConfigRule,
  CURSOR_RULES,
  type CursorRule,
  configFindings,
  cursorFindings,
  type EntryRef,
  entriesAtCursor,
  type Finding,
  fieldKinds,
  testKeysRule,
  validateConfig,
} from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { declaration } from "../modules/declarations.js";
import type { PlainData } from "../../src/config/plain-data.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { CORE_SETTINGS, REPOSITORY, stats } from "./config-fixtures.js";
import {
  bigints,
  CORE,
  FILE,
  input,
  leaky,
  pair,
  PRIVATE_SETTINGS,
  renamed,
  STATS,
  thrower,
  throwsText,
} from "./validate-fixtures.js";

/**
 * A28 (CF-3, CF-6; task 4.2): every entry of the configuration is validated at startup — its shape (`{ id, start, stop?,
 * version, config }`, no unknown property, `stop ≥ start`, byte values as `0x`-prefixed lowercase hex), and the settings
 * of every revision whose version is this build's against the schema in this build (the `core` entry's of CF-4, a
 * module's own `configSchema`), with no unknown field, the declared defaults applied to absent fields and each field
 * classified by its kind; a revision whose version is not the build's (written with `versionEntry`) is not validated
 * against this build's schema. Each violation refuses with `invalid-configuration`, naming the entry (its position, id
 * and start) and the field. The validation is a pure function of the loaded data, the validated declarations and the
 * process's side; what needs the cursor — a scheduled `versionEntry` carrying a `config`, an earlier one without its
 * recorded `config` — is `entriesAtCursor`, called once the database is open; what needs the recorded history (equal to
 * its recorded row, recorded, re-recorded) is task 4.3's. "Startup refuses" is the runner's (task 5.x), which maps the
 * refusal to its refused state.
 *
 * The committed negative controls: the validation built without one rule of `CONFIG_RULES` (or `CURSOR_RULES`) loses
 * exactly that rule's findings, row by row; and zod's own parse, which strips unknown fields, accepts a misspelled
 * setting the validation refuses.
 */

/** The refusal `run` throws, or undefined when it returns. */
function thrown(run: () => unknown): UmbraError | undefined {
  try {
    run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return undefined;
}

/** The refusal `run` throws; fails the test if it returns. */
function refusal(run: () => unknown): UmbraError {
  return thrown(run) ?? expect.unreachable("expected a refusal");
}

/** The findings of a refusal (`details.findings`). */
const findingsOf = (error: UmbraError): readonly Finding[] => error.details.findings as readonly Finding[];

/** An entry as a finding names it. */
const at = (index: number, id: string | null, start: number | null): EntryRef => ({ index, id, start });

/** A finding the table expects: where, and words its message holds. */
interface Expected {
  readonly path: string;
  readonly entry: EntryRef | null;
  readonly field: string | null;
  readonly says: readonly string[];
}

/** One violation, triggered alone: the configuration, the rule that refuses it and the findings. */
interface Row {
  readonly name: string;
  readonly rule: string;
  readonly config: () => unknown;
  readonly side?: ProcessSide;
  readonly user?: readonly ModuleDeclaration[];
  readonly findings: readonly Expected[];
}

/** A configuration of the public `core` entry with `settings` and `stats`'s revision. */
const withCore = (settings: Record<string, unknown>) => ({
  entries: [coreEntry({ start: 0, config: settings as never }), STATS],
});

/** A configuration of the private `core` entry with `settings`. */
const withPrivateCore = (settings: Record<string, unknown>) => ({
  entries: [coreEntry({ start: 0, config: settings as never })],
});

/** A configuration of the public `core` entry and one more entry. */
const withEntry = (entry: unknown) => ({ entries: [CORE, entry] });

const HASH = `0x${"ab".repeat(32)}`;
const UPPER_HASH = `0x${"AB".repeat(32)}`;

/** A custom network's own ledger table (LG-3): every spec_version to v8. */
const CUSTOM_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v8" }] };

/** An earlier core version, with one ledger package, whose hash is `sha256`. */
const earlierCore = (sha256: string): CoreVersion => ({
  umbradb: "0.9.4",
  ledgers: [
    {
      ledger: "v8",
      versionName: "ledger-8.0.2",
      packages: [{ name: "@midnight-ntwrk/ledger-v8", version: "8.0.2", sha256 }],
    },
  ],
});

const core0 = at(0, "core", 0);
const stats1 = at(1, "stats", 0);

/**
 * A private module declaring the key kind `viewing` (PP-8, CF-11), whose `validateKey` takes 4 bytes or more and throws,
 * its message holding the bytes, on a first byte 0xff.
 */
const WALLET = defineModule({
  ...declaration("wallet", {
    side: "private",
    keyKinds: ["viewing"],
    validateKey: (_kind: string, bytes: Uint8Array) => {
      if (bytes[0] === 0xff) throw new Error(`cannot use ${Buffer.from(bytes).toString("hex")}`);
      return bytes.length >= 4;
    },
  }),
});

/** A private process's configuration with `testKeys` and `wallet`'s revision from 0. */
const withWallet = (testKeys: readonly Record<string, unknown>[]) => ({
  entries: [...withPrivateCore({ ...PRIVATE_SETTINGS, testKeys }).entries, WALLET.entry({ start: 0, config: { pollMs: 1000 } })],
});

const A28: readonly Row[] = [
  // ── the top level ──────────────────────────────────────────────────────────────────────────────────────────────
  {
    name: "a property beside entries",
    rule: "top-level",
    config: () => ({ entries: [CORE, STATS], modules: [] }),
    findings: [{ path: "modules", entry: null, field: null, says: ["has the property modules", "{ entries"] }],
  },
  {
    name: "no entries",
    rule: "top-level",
    config: () => ({}),
    findings: [{ path: "entries", entry: null, field: null, says: ["no list of entries", "defineConfig"] }],
  },
  {
    name: "a default export that is not an object",
    rule: "top-level",
    config: () => [CORE],
    findings: [{ path: "", entry: null, field: null, says: ["the default export is a list", "defineConfig"] }],
  },
  // ── each entry's shape ─────────────────────────────────────────────────────────────────────────────────────────
  {
    name: "an entry that is not an object",
    rule: "entry-object",
    config: () => withEntry(5),
    findings: [{ path: "entries[1]", entry: at(1, null, null), field: null, says: ["is a number", "an entry"] }],
  },
  {
    name: "an unknown property of an entry (A28)",
    rule: "entry-property",
    config: () => withEntry({ ...STATS, enabled: true }),
    findings: [
      {
        path: "entries[1].enabled",
        entry: stats1,
        field: "enabled",
        says: ["has the property enabled", "id, start, stop, version and config"],
      },
    ],
  },
  {
    name: "an unknown property a builder passed through, given without types",
    rule: "entry-property",
    config: () => withEntry(stats.entry({ start: 0, config: { pollMs: 1000 }, extra: 1 } as never)),
    findings: [{ path: "entries[1].extra", entry: stats1, field: "extra", says: ["has the property extra"] }],
  },
  {
    name: "an id the build has no module for",
    rule: "entry-id",
    config: () => withEntry({ ...STATS, id: "stat" }),
    findings: [
      { path: "entries[1].id", entry: at(1, "stat", 0), field: "id", says: ["has no module stat", "stats, prices"] },
    ],
  },
  {
    name: "a backbone part's id",
    rule: "entry-id",
    config: () => withEntry({ ...STATS, id: "core-chain" }),
    findings: [
      {
        path: "entries[1].id",
        entry: at(1, "core-chain", 0),
        field: "id",
        says: ["core-chain is a backbone part", "runs with the core entry"],
      },
    ],
  },
  {
    name: "a public module's entry in a private process's configuration (task 14.1)",
    rule: "entry-side",
    side: "private",
    config: () => ({ entries: [...withPrivateCore(PRIVATE_SETTINGS).entries, STATS] }),
    findings: [
      {
        path: "entries[1].id",
        entry: stats1,
        field: "id",
        says: ["stats is a public module", "a private process's, which runs private modules only"],
      },
    ],
  },
  {
    name: "no id",
    rule: "entry-id",
    config: () => withEntry({ start: 0, version: "1.2.0", config: { pollMs: 1000 } }),
    findings: [{ path: "entries[1].id", entry: at(1, null, 0), field: "id", says: ["has no id"] }],
  },
  {
    name: "an id that is not a string",
    rule: "entry-id",
    config: () => withEntry({ ...STATS, id: 5 }),
    findings: [{ path: "entries[1].id", entry: at(1, null, 0), field: "id", says: ["id is a number"] }],
  },
  {
    name: "no start",
    rule: "entry-start",
    config: () => withEntry(stats.entry({ config: { pollMs: 1000 } } as never)),
    findings: [
      { path: "entries[1].start", entry: at(1, "stats", null), field: "start", says: ["(stats): the entry has no start"] },
    ],
  },
  {
    name: "a start that is not a number",
    rule: "entry-start",
    config: () => withEntry({ ...STATS, start: "0" }),
    findings: [
      { path: "entries[1].start", entry: at(1, "stats", null), field: "start", says: ["start is a string", "height"] },
    ],
  },
  {
    name: "a stop below its start (A28)",
    rule: "entry-stop",
    config: () => withEntry(stats.entry({ start: 10, stop: 9, config: { pollMs: 1000 } })),
    findings: [
      { path: "entries[1].stop", entry: at(1, "stats", 10), field: "stop", says: ["stops at 9, before its start 10"] },
    ],
  },
  {
    name: "the core entry's stop below its start",
    rule: "entry-stop",
    config: () => ({ entries: [coreEntry({ start: 5, stop: 4, config: { ...CORE_SETTINGS } })] }),
    findings: [{ path: "entries[0].stop", entry: at(0, "core", 5), field: "stop", says: ["stops at 4, before its start 5"] }],
  },
  {
    name: "a stop that is not a number",
    rule: "entry-stop",
    config: () => withEntry({ ...STATS, stop: "9" }),
    findings: [{ path: "entries[1].stop", entry: stats1, field: "stop", says: ["stop is a string", "height"] }],
  },
  {
    name: "bad hex in the core version's package hash (A28)",
    rule: "entry-version",
    config: () => ({
      entries: [
        versionEntry({ id: "core", start: 0, version: earlierCore(UPPER_HASH), config: { network: "preprod" } }),
        coreEntry({ start: 100, config: { ...CORE_SETTINGS } }),
      ],
    }),
    findings: [
      {
        path: "entries[0].version.ledgers[0].packages[0].sha256",
        entry: core0,
        field: "version",
        says: ["0x-prefixed lowercase hex", "64 digits"],
      },
    ],
  },
  {
    name: "the core's version written as a semver string",
    rule: "entry-version",
    config: () => ({ entries: [{ ...CORE, version: "0.9.5" }] }),
    findings: [{ path: "entries[0].version", entry: core0, field: "version", says: ["a core version", "umbradb", "ledgers"] }],
  },
  {
    name: "a module version that is not semver",
    rule: "entry-version",
    config: () => withEntry(versionEntry({ id: "stats", start: 0, version: "1.0", config: { foo: 1 } })),
    findings: [{ path: "entries[1].version", entry: stats1, field: "version", says: ['"1.0"', "semver"] }],
  },
  {
    name: "no version",
    rule: "entry-version",
    config: () => withEntry({ id: "stats", start: 0, config: { pollMs: 1000 } }),
    findings: [{ path: "entries[1].version", entry: stats1, field: "version", says: ["has no version"] }],
  },
  {
    name: "a revision of the build's version without its config",
    rule: "entry-config",
    config: () => withEntry(stats.entry({ start: 0 } as never)),
    findings: [{ path: "entries[1].config", entry: stats1, field: "config", says: ["has no config", "1.2.0"] }],
  },
  {
    name: "a config that is not an object",
    rule: "entry-config",
    config: () => withEntry({ ...STATS, config: ["pollMs"] }),
    findings: [{ path: "entries[1].config", entry: stats1, field: "config", says: ["config is a list", "an object"] }],
  },
  {
    name: "two entries with one id and one start",
    rule: "duplicate-entry",
    config: () => ({ entries: [CORE, STATS, stats.entry({ start: 0, config: { pollMs: 2000 } })] }),
    findings: [
      { path: "entries[2]", entry: at(2, "stats", 0), field: null, says: ["stats from 0 is also entries[1]", "id and start"] },
    ],
  },
  {
    name: "no core entry",
    rule: "core-entry",
    config: () => ({ entries: [STATS] }),
    findings: [{ path: "entries", entry: null, field: null, says: ["no core entry", "coreEntry"] }],
  },
  {
    name: "a lone surrogate in a string",
    rule: "lone-surrogate",
    config: () => withEntry(stats.entry({ start: 0, config: { pollMs: 1000, token: "tok\uD800en" } })),
    findings: [
      { path: "entries[1].config.token", entry: stats1, field: "token", says: ["lone UTF-16 surrogate", "UTF-8"] },
    ],
  },
  {
    name: "a lone surrogate in a key",
    rule: "lone-surrogate",
    config: () => withEntry(versionEntry({ id: "stats", start: 0, version: "1.0.0", config: { "a\uDC00": 1 } })),
    findings: [
      {
        path: 'entries[1].config["a\\udc00"]',
        entry: stats1,
        field: "a\uDC00",
        says: ["key", "lone UTF-16 surrogate"],
      },
    ],
  },
  // ── the settings of a revision of the build's version ──────────────────────────────────────────────────────────
  {
    name: "a misspelled core setting",
    rule: "settings-unknown",
    config: () => withCore({ ...CORE_SETTINGS, databse: "postgres://indexer:pw@db/umbradb" }),
    findings: [
      {
        path: "entries[0].config.databse",
        entry: core0,
        field: "databse",
        says: ["has no setting databse", "did you mean database?"],
      },
    ],
  },
  {
    name: "a misspelled module setting",
    rule: "settings-unknown",
    config: () => withEntry(stats.entry({ start: 0, config: { pollMs: 1000, polMs: 5 } as never })),
    findings: [
      {
        path: "entries[1].config.polMs",
        entry: stats1,
        field: "polMs",
        says: ["stats 1.2.0 has no setting polMs", "did you mean pollMs?", "limit, pollMs, token"],
      },
    ],
  },
  {
    name: "a setting named like a property every object inherits",
    rule: "settings-unknown",
    config: () => withEntry(stats.entry({ start: 0, config: { pollMs: 1000, constructor: 1 } as never })),
    findings: [
      {
        path: "entries[1].config.constructor",
        entry: stats1,
        field: "constructor",
        says: ["module stats 1.2.0 has no setting constructor: its settings are limit, pollMs, token"],
      },
    ],
  },
  {
    name: "a private process's field in a public core entry",
    rule: "settings-unknown",
    config: () => withCore({ ...CORE_SETTINGS, instanceId: "wallet-1" }),
    findings: [
      {
        path: "entries[0].config.instanceId",
        entry: core0,
        field: "instanceId",
        says: ["instanceId is a private process's setting", "this process is public"],
      },
    ],
  },
  {
    name: "a public process's field in a private core entry",
    rule: "settings-unknown",
    side: "private",
    config: () => withPrivateCore({ ...PRIVATE_SETTINGS, node: "ws://127.0.0.1:9944" }),
    findings: [
      {
        path: "entries[0].config.node",
        entry: core0,
        field: "node",
        says: ["node is a public process's setting", "this process is private"],
      },
    ],
  },
  {
    name: "a wrong type (CF-3's scenario)",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, livenessTimeoutMs: "30000" }),
    findings: [
      {
        path: "entries[0].config.livenessTimeoutMs",
        entry: core0,
        field: "livenessTimeoutMs",
        says: ["(core from 0)", "expected number, received string"],
      },
    ],
  },
  {
    name: "a module setting of the wrong type",
    rule: "settings-schema",
    config: () => withEntry(stats.entry({ start: 0, config: { pollMs: "1000" } as never })),
    findings: [{ path: "entries[1].config.pollMs", entry: stats1, field: "pollMs", says: ["(stats from 0)", "expected number"] }],
  },
  {
    name: "a required module setting left out",
    rule: "settings-schema",
    config: () => withEntry(stats.entry({ start: 0, config: {} as never })),
    findings: [{ path: "entries[1].config.pollMs", entry: stats1, field: "pollMs", says: ["expected number, received undefined"] }],
  },
  {
    name: "a network that is none of the five",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, network: "mainnet-beta" }),
    findings: [{ path: "entries[0].config.network", entry: core0, field: "network", says: ['"mainnet"', '"custom"'] }],
  },
  {
    name: "bad hex in the genesis hash (A28)",
    rule: "settings-schema",
    // With its own ledger table, which a custom network sets (LG-3), so that the hash alone is refused.
    config: () => withCore({ ...CORE_SETTINGS, network: "custom", genesisHash: UPPER_HASH, ledgerTable: CUSTOM_TABLE }),
    findings: [
      { path: "entries[0].config.genesisHash", entry: core0, field: "genesisHash", says: ["0x-prefixed lowercase hex"] },
    ],
  },
  {
    name: "bad hex in a ledger pin's hash",
    rule: "settings-schema",
    config: () =>
      withCore({ ...CORE_SETTINGS, ledgerTable: { pins: [{ height: 1, hash: "0xab", specVersion: 1_000_000 }] } }),
    findings: [
      {
        path: "entries[0].config.ledgerTable.pins[0].hash",
        entry: core0,
        field: "ledgerTable",
        says: ["0x-prefixed lowercase hex", "64 digits"],
      },
    ],
  },
  {
    name: "bad hex in a test key's bytes",
    rule: "settings-schema",
    side: "private",
    config: () => withPrivateCore({ ...PRIVATE_SETTINGS, testKeys: [{ kind: "viewing-key", bytes: "0x1", start: 1 }] }),
    findings: [
      {
        path: "entries[0].config.testKeys[0].bytes",
        entry: core0,
        field: "testKeys",
        says: ["0x-prefixed lowercase hex", "two digits a byte"],
      },
    ],
  },
  {
    name: "a custom network without its genesis hash",
    rule: "settings-schema",
    // With its own ledger table, which a custom network sets (LG-3), so that the genesis rule alone refuses it.
    config: () => withCore({ ...CORE_SETTINGS, network: "custom", ledgerTable: CUSTOM_TABLE }),
    findings: [
      { path: "entries[0].config.genesisHash", entry: core0, field: "genesisHash", says: ["a custom network needs genesisHash"] },
    ],
  },
  {
    name: "a genesis hash given with a known network",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, genesisHash: HASH }),
    findings: [
      { path: "entries[0].config.genesisHash", entry: core0, field: "genesisHash", says: ["only with network custom"] },
    ],
  },
  {
    name: "apiReadTimeoutMs 0",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, apiReadTimeoutMs: 0 }),
    findings: [{ path: "entries[0].config.apiReadTimeoutMs", entry: core0, field: "apiReadTimeoutMs", says: [">=1"] }],
  },
  {
    name: "apiReadTimeoutMs above 2,147,483,647",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, apiReadTimeoutMs: 2_147_483_648 }),
    findings: [
      { path: "entries[0].config.apiReadTimeoutMs", entry: core0, field: "apiReadTimeoutMs", says: ["<=2147483647"] },
    ],
  },
  {
    name: "a database that is neither a PostgreSQL URL nor PGlite",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, database: "mysql://db/umbradb" }),
    findings: [
      {
        path: "entries[0].config.database",
        entry: core0,
        field: "database",
        says: ["postgres://", "pglite:<directory>", "pglite:memory"],
      },
    ],
  },
  {
    name: "a node that is not a WebSocket URL",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, node: "http://127.0.0.1:9944" }),
    findings: [{ path: "entries[0].config.node", entry: core0, field: "node", says: ["ws://", "wss://"] }],
  },
  {
    name: "an unknown field inside a core setting",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, listen: { admn: "0.0.0.0:8081" } }),
    findings: [{ path: "entries[0].config.listen.admn", entry: core0, field: "listen", says: ['Unrecognized key: "admn"'] }],
  },
  {
    name: "an address that is not host:port",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, listen: { api: "8080" } }),
    findings: [{ path: "entries[0].config.listen.api", entry: core0, field: "listen", says: ["host:port"] }],
  },
  {
    name: "a port above 65535",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, listen: { api: "0.0.0.0:65536" } }),
    findings: [{ path: "entries[0].config.listen.api", entry: core0, field: "listen", says: ["from 0 to 65535"] }],
  },
  {
    name: "a boolean given as a string",
    rule: "settings-schema",
    config: () => withCore({ ...CORE_SETTINGS, developmentOptIn: "true" }),
    findings: [{ path: "entries[0].config.developmentOptIn", entry: core0, field: "developmentOptIn", says: ["expected boolean"] }],
  },
  {
    name: "no node in a public core entry",
    rule: "settings-schema",
    config: () => withCore({ network: "preprod", database: "pglite:memory" }),
    findings: [{ path: "entries[0].config.node", entry: core0, field: "node", says: ["received undefined"] }],
  },
  {
    name: "no instanceId in a private core entry",
    rule: "settings-schema",
    side: "private",
    config: () => withPrivateCore({ network: "preprod", database: "pglite:memory" }),
    findings: [{ path: "entries[0].config.instanceId", entry: core0, field: "instanceId", says: ["received undefined"] }],
  },
  {
    name: "a module schema that throws",
    rule: "settings-schema",
    config: () => withEntry(thrower.entry({ start: 0, config: { apiKey: "key-123" } })),
    findings: [
      {
        path: "entries[1].config",
        entry: at(1, "thrower", 0),
        field: null,
        says: ["the settings schema of thrower 1.0.0 threw", "cannot check [redacted]"],
      },
    ],
  },
  {
    name: "a module schema whose output is not plain data",
    rule: "settings-plain",
    config: () => withEntry(bigints.entry({ start: 0, config: { big: 5 } })),
    findings: [
      {
        path: "entries[1].config.big",
        entry: at(1, "bigints", 0),
        field: "big",
        says: ["the settings schema of bigints 1.0.0 gives", "not plain data"],
      },
    ],
  },
  // ── the remaining forms of each rule's violations ──────────────────────────────────────────────────────────────
  {
    name: "entries that are not a list",
    rule: "top-level",
    config: () => ({ entries: 5 }),
    findings: [{ path: "entries", entry: null, field: null, says: ["entries is a number", "a list of entries"] }],
  },
  {
    name: "an entry that is null",
    rule: "entry-object",
    config: () => withEntry(null),
    findings: [{ path: "entries[1]", entry: at(1, null, null), field: null, says: ["the entry is null"] }],
  },
  {
    name: "an id when the build has no module at all",
    rule: "entry-id",
    user: [],
    config: () => withEntry(STATS),
    findings: [{ path: "entries[1].id", entry: stats1, field: "id", says: ["has no module stats", "(it has none)"] }],
  },
  {
    name: "a start that is an object",
    rule: "entry-start",
    config: () => withEntry({ ...STATS, start: {} }),
    findings: [{ path: "entries[1].start", entry: at(1, "stats", null), field: "start", says: ["start is an object"] }],
  },
  {
    name: "a stop that is a boolean",
    rule: "entry-stop",
    config: () => withEntry({ ...STATS, stop: true }),
    findings: [{ path: "entries[1].stop", entry: stats1, field: "stop", says: ["stop is a boolean"] }],
  },
  {
    name: "a module version that is not a string",
    rule: "entry-version",
    config: () => withEntry({ ...STATS, version: 5 }),
    findings: [{ path: "entries[1].version", entry: stats1, field: "version", says: ["version is a number", "semver"] }],
  },
  {
    name: "the core entry without a version",
    rule: "entry-version",
    config: () => ({ entries: [{ id: "core", start: 0, config: { ...CORE_SETTINGS } }] }),
    findings: [{ path: "entries[0].version", entry: core0, field: "version", says: ["has no version"] }],
  },
  {
    name: "a core revision of the build's version without its config",
    rule: "entry-config",
    config: () => ({ entries: [{ id: "core", start: 0, version: buildCoreVersion() }] }),
    findings: [
      {
        path: "entries[0].config",
        entry: core0,
        field: "config",
        says: ["has no config", "the core version this build carries"],
      },
    ],
  },
  {
    name: "a module's check of its settings together, which names no one setting",
    rule: "settings-schema",
    config: () => withEntry(pair.entry({ start: 0, config: { min: 5, max: 1 } })),
    findings: [{ path: "entries[1].config", entry: at(1, "pair", 0), field: null, says: ["min is above max"] }],
  },
  {
    name: "a module schema that throws something that is not an Error",
    rule: "settings-schema",
    config: () => withEntry(throwsText.entry({ start: 0, config: { mode: "fast" } })),
    findings: [
      {
        path: "entries[1].config",
        entry: at(1, "throws-text", 0),
        field: null,
        says: ["the settings schema of throws-text 1.0.0 threw: no mode is valid"],
      },
    ],
  },
  {
    name: "a test key of a kind no configured module declares (CF-11, A119)",
    rule: "test-keys",
    side: "private",
    user: [WALLET],
    config: () => withWallet([{ kind: "spending", bytes: "0x0a0b0c0d", start: 5 }]),
    findings: [
      {
        path: "entries[0].config.testKeys[0].kind",
        entry: core0,
        field: "testKeys",
        says: ["the test key's kind is declared by no module this configuration enables", "wallet: viewing", "CF-11"],
      },
    ],
  },
  {
    name: "a test key whose bytes its module's validateKey rejects (CF-11, A119)",
    rule: "test-keys",
    side: "private",
    user: [WALLET],
    config: () => withWallet([{ kind: "viewing", bytes: "0x0a0b", start: 5 }]),
    findings: [
      {
        path: "entries[0].config.testKeys[0].bytes",
        entry: core0,
        field: "testKeys",
        says: ["the test key's bytes are refused by the validateKey of wallet", "CF-11"],
      },
    ],
  },
  {
    name: "a test key whose module's validateKey throws, its message not repeated (CF-11, A119)",
    rule: "test-keys",
    side: "private",
    user: [WALLET],
    config: () => withWallet([{ kind: "viewing", bytes: "0xff0b0c0d", start: 5 }]),
    findings: [
      {
        path: "entries[0].config.testKeys[0].bytes",
        entry: core0,
        field: "testKeys",
        says: ["the test key's bytes are refused by the validateKey of wallet, which threw", "CF-11"],
      },
    ],
  },
  {
    name: "the same test key twice (CF-11, PP-8)",
    rule: "test-keys",
    side: "private",
    user: [WALLET],
    config: () =>
      withWallet([
        { kind: "viewing", bytes: "0x0a0b0c0d", start: 5 },
        { kind: "viewing", bytes: "0x0a0b0c0d", start: 7 },
      ]),
    findings: [
      {
        path: "entries[0].config.testKeys[1]",
        entry: core0,
        field: "testKeys",
        says: ["the same kind and bytes as testKeys[0]", "admitted once"],
      },
    ],
  },
];

/** The validation's input for a row. */
const rowInput = (row: Row) => input(row.config(), row.side ?? "public", row.user);

/** A finding as the table checks it. */
function matches(finding: Finding, expected: Expected, rule: string): void {
  expect(finding.rule).toBe(rule);
  expect(finding.path).toBe(expected.path);
  expect(finding.entry).toEqual(expected.entry);
  expect(finding.field).toBe(expected.field);
  for (const words of expected.says) expect(finding.message).toContain(words);
}

describe("A28: entry-shape and schema violations each refuse, naming the entry and the field (CF-3)", () => {
  for (const row of A28) {
    it(`${row.name}: ${row.rule}`, () => {
      const error = refusal(() => validateConfig(rowInput(row)));
      expect(error.code).toBe("invalid-configuration");
      expect(error.retryable).toBe(false);
      expect(error.details.file).toBe(FILE);
      expect(error.details.reason).toBe("invalid-entries");
      const findings = findingsOf(error);
      expect(findings).toHaveLength(row.findings.length);
      row.findings.forEach((expected, index) => matches(findings[index] as Finding, expected, row.rule));
      for (const finding of findings) expect(error.message).toContain(finding.message);
      expect(error.message).toContain(FILE);
      expect(error.message).toContain("(CF-3)");
    });
  }

  it("names each finding with its path, its entry and its words", () => {
    const error = refusal(() => validateConfig(input(withCore({ ...CORE_SETTINGS, livenessTimeoutMs: "30000" }))));
    expect(findingsOf(error)).toEqual([
      {
        rule: "settings-schema",
        path: "entries[0].config.livenessTimeoutMs",
        entry: core0,
        field: "livenessTimeoutMs",
        message:
          "entries[0].config.livenessTimeoutMs (core from 0): Invalid input: expected number, received string (CF-3)",
      },
    ]);
    expect(error.message).toBe(
      `the configuration ${FILE} is refused (CF-3): entries[0].config.livenessTimeoutMs (core from 0): Invalid input: ` +
        "expected number, received string (CF-3)",
    );
  });

  it("reports every finding of a configuration at once, top level first, then by entry, each entry's in rule order", () => {
    // CF-2's scenario: `databse` for `database`, which is then missing; and a second entry's own fault.
    const config = {
      entries: [
        coreEntry({ start: 0, config: { network: "preprod", node: "ws://n:9944", databse: "pglite:memory" } as never }),
        stats.entry({ start: 10, stop: 9, config: { pollMs: 1000 } }),
      ],
      extra: true,
    };
    const error = refusal(() => validateConfig(input(config)));
    const findings = findingsOf(error);
    expect(findings.map(({ rule, path }) => [rule, path])).toEqual([
      ["top-level", "extra"],
      ["settings-unknown", "entries[0].config.databse"],
      ["settings-schema", "entries[0].config.database"],
      ["entry-stop", "entries[1].stop"],
    ]);
    expect(error.message).toBe(
      `the configuration ${FILE} is refused (CF-3): ${findings.map((found) => found.message).join("; ")}`,
    );
  });

  it("names the file when the configuration was loaded from one, and nothing when it was not", () => {
    const { config } = input(withEntry(5));
    const error = refusal(() =>
      validateConfig({ ...input(withEntry(5)), config: { data: config.data } }),
    );
    expect(error.details.file).toBeNull();
    expect(error.message.startsWith("the configuration is refused (CF-3): entries[1]")).toBe(true);
  });
});

describe("CF-2: an unknown setting's message suggests the setting it is likely a misspelling of", () => {
  /** The message of the one finding for `config` in stats's revision. */
  const message = (config: Record<string, unknown>) =>
    findingsOf(refusal(() => validateConfig(input(withEntry(stats.entry({ start: 0, config: config as never }))))))[0]
      ?.message;

  it("within two edits, ignoring case; the closest when several are", () => {
    expect(message({ pollMs: 1, plMs: 1 })).toContain("has no setting plMs (did you mean pollMs?)");
    expect(message({ pollMs: 1, POLLMS: 1 })).toContain("has no setting POLLMS (did you mean pollMs?)");
    expect(message({ pollMs: 1, limits: 1 })).toContain("has no setting limits (did you mean limit?)");
  });

  it("counts a changed letter as one edit", () => {
    expect(message({ pollMs: 1, pallMz: 1 })).toContain("has no setting pallMz (did you mean pollMs?)");
  });

  it("the closest, not the first within two edits", () => {
    // `sise` is two edits from `sizes`, declared first, and one from `size`.
    const sizes = defineModule({
      ...declaration("sizes"),
      configSchema: z.object({ sizes: z.number().int().meta({ kind: "data" }), size: z.number().int().meta({ kind: "data" }) }),
    });
    const config = withEntry(sizes.entry({ start: 0, config: { sizes: 1, size: 1, sise: 1 } as never }));
    expect(findingsOf(refusal(() => validateConfig(input(config, "public", [sizes]))))[0]?.message).toContain(
      "has no setting sise (did you mean size?)",
    );
  });

  it("none beyond two edits", () => {
    expect(message({ pollMs: 1, pMs: 1 })).toContain("has no setting pMs: its settings are limit, pollMs, token");
  });
});

describe("CF-3, CF-7: a lone surrogate outside the settings is found beside the rule its place breaks", () => {
  const found = (config: unknown) => configFindings(input(config)).map(({ rule, path, entry, field }) => ({ rule, path, entry, field }));

  it("in a property beside entries", () => {
    expect(found({ entries: [CORE], "x\uD800": 1 })).toEqual([
      { rule: "top-level", path: '["x\\ud800"]', entry: null, field: null },
      { rule: "lone-surrogate", path: '["x\\ud800"]', entry: null, field: null },
    ]);
  });

  it("in entries that are an object, not a list", () => {
    expect(found({ entries: { "x\uD800": 1 } })).toEqual([
      { rule: "top-level", path: "entries", entry: null, field: null },
      { rule: "lone-surrogate", path: 'entries["x\\ud800"]', entry: null, field: null },
    ]);
  });

  it("in an entry that is a string", () => {
    expect(found(withEntry("x\uD800"))).toEqual([
      { rule: "entry-object", path: "entries[1]", entry: at(1, null, null), field: null },
      { rule: "lone-surrogate", path: "entries[1]", entry: at(1, null, null), field: null },
    ]);
  });

  it("in an entry's id", () => {
    expect(found(withEntry({ ...STATS, id: "stats\uDC00" }))).toEqual([
      { rule: "entry-id", path: "entries[1].id", entry: at(1, "stats\uDC00", 0), field: "id" },
      { rule: "lone-surrogate", path: "entries[1].id", entry: at(1, "stats\uDC00", 0), field: "id" },
    ]);
  });
});

describe("CF-3: findings are reported top level first, then by entry", () => {
  it("a top-level finding of a later rule comes before an entry's finding of an earlier rule", () => {
    const findings = configFindings(input({ entries: [stats.entry({ start: 10, stop: 9, config: { pollMs: 1 } })] }));
    expect(findings.map(({ rule, path }) => [rule, path])).toEqual([
      ["core-entry", "entries"],
      ["entry-stop", "entries[0].stop"],
    ]);
  });
});

describe("A28 negative control: the validation without one rule loses exactly that rule's findings", () => {
  it("has rows for every rule, each row refused by its own rule only", () => {
    expect(new Set(A28.map((row) => row.rule))).toEqual(new Set(CONFIG_RULES.map((rule) => rule.name)));
    for (const row of A28) {
      expect(new Set(configFindings(rowInput(row)).map((finding) => finding.rule)), row.name).toEqual(new Set([row.rule]));
    }
  });

  for (const removed of CONFIG_RULES) {
    it(`without ${removed.name}`, () => {
      const rules: readonly ConfigRule[] = CONFIG_RULES.filter((rule) => rule !== removed);
      for (const row of A28) {
        const all = configFindings(rowInput(row));
        expect(configFindings(rowInput(row), rules), row.name).toEqual(
          all.filter((finding) => finding.rule !== removed.name),
        );
        if (row.rule === removed.name) expect(configFindings(rowInput(row), rules), row.name).toEqual([]);
      }
    });
  }

  it("a non-strict parse lets a misspelled setting through: zod strips it, the validation refuses it", () => {
    const misspelled = { pollMs: 1000, polMs: 5 };
    expect(stats.configSchema.safeParse(misspelled)).toEqual({ success: true, data: { limit: 10, pollMs: 1000 } });
    const config = withEntry(stats.entry({ start: 0, config: misspelled as never }));
    const lenient = CONFIG_RULES.filter((rule) => rule.name !== "settings-unknown");
    expect(configFindings(input(config), lenient)).toEqual([]);
    expect(configFindings(input(config)).map((finding) => finding.path)).toEqual(["entries[1].config.polMs"]);
  });
});

describe("A28: absent fields take their declared defaults (CF-3, CF-4)", () => {
  it("a public core entry with the required fields only", () => {
    const checked = validateConfig(input({ entries: [CORE] }));
    expect(checked.entries[0]?.settings).toEqual({
      network: "preprod",
      ledgerTable: builtInLedgerTable("preprod"),
      ledgerSources: { v8: "vendored", v9: "vendored", v10: "vendored" },
      sweep: "on",
      retainStates: 0,
      database: "pglite:memory",
      node: "ws://127.0.0.1:9944",
      listen: { admin: "0.0.0.0:8081" },
      tipCap: 600,
      prefetchWindow: 64,
      backoffCeilingMs: 30_000,
      lockstepInstances: [],
      livenessTimeoutMs: 30_000,
      apiReadTimeoutMs: 30_000,
      slowBlockMs: 60_000,
      followingThreshold: 3,
      fullPageWritesOffAllowed: false,
      developmentOptIn: false,
    });
  });

  it("a private core entry with the required fields only", () => {
    const checked = validateConfig(input(withPrivateCore({ ...PRIVATE_SETTINGS }), "private"));
    expect(checked.entries[0]?.settings).toEqual({
      network: "preprod",
      ledgerTable: builtInLedgerTable("preprod"),
      ledgerSources: { v8: "vendored", v9: "vendored", v10: "vendored" },
      sweep: "on",
      retainStates: 0,
      database: "pglite:memory",
      listen: { admin: "0.0.0.0:8081" },
      tipCap: 600,
      prefetchWindow: 64,
      backoffCeilingMs: 30_000,
      livenessTimeoutMs: 30_000,
      apiReadTimeoutMs: 30_000,
      slowBlockMs: 60_000,
      followingThreshold: 3,
      fullPageWritesOffAllowed: false,
      developmentOptIn: false,
      instanceId: "wallet-1",
      testKeys: [],
    });
  });

  it("keeps what is given, and fills the defaults inside a setting given in part", () => {
    const checked = validateConfig(
      input({
        entries: [
          coreEntry({
            start: 0,
            config: {
              ...CORE_SETTINGS,
              retainStates: 5,
              listen: { api: "0.0.0.0:8080" },
              ledgerSources: { v9: "released" },
              apiReadTimeoutMs: 2_147_483_647,
              developmentOptIn: true,
            },
          }),
        ],
      }),
    );
    expect(checked.entries[0]?.settings).toMatchObject({
      retainStates: 5,
      listen: { api: "0.0.0.0:8080", admin: "0.0.0.0:8081" },
      ledgerSources: { v8: "vendored", v9: "released", v10: "vendored" },
      apiReadTimeoutMs: 2_147_483_647,
      developmentOptIn: true,
    });
  });

  it("a module's settings: its declared default, and an optional field left out", () => {
    const checked = validateConfig(input(withEntry(STATS)));
    expect(checked.entries[1]?.settings).toEqual({ limit: 10, pollMs: 1000 });
  });
});

describe("CF-3, CF-4: the validated configuration", () => {
  it("gives every revision of the build's version its settings, each field's kind and its data fields", () => {
    const checked = validateConfig(
      input({ entries: [CORE, stats.entry({ start: 0, stop: 99, config: { pollMs: 1000, token: "t" } })] }),
    );
    expect(checked.entries[1]).toEqual({
      index: 1,
      id: "stats",
      start: 0,
      stop: 99,
      version: "1.2.0",
      buildVersion: true,
      settings: { limit: 10, pollMs: 1000, token: "t" },
      kinds: { limit: "data", pollMs: "operational", token: "secret" },
      data: { limit: 10 },
    });
    expect(checked.entries[0]).toMatchObject({
      index: 0,
      id: "core",
      start: 0,
      stop: null,
      version: buildCoreVersion(),
      buildVersion: true,
      data: {
        network: "preprod",
        ledgerSources: { v8: "vendored", v9: "vendored", v10: "vendored" },
        sweep: "on",
        retainStates: 0,
      },
    });
    expect(checked.entries[0]?.kinds).toMatchObject({ network: "data", database: "secret", listen: "operational" });
  });

  it("takes a string with a well-formed surrogate pair (a character beyond U+FFFF)", () => {
    const checked = validateConfig(input(withEntry(stats.entry({ start: 0, config: { pollMs: 1, token: "tok\u{1F600}en" } }))));
    expect(checked.entries[1]?.settings).toMatchObject({ token: "tok\u{1F600}en" });
  });

  it("refuses a start or stop that is no height in data given without the plain-data check", () => {
    // `validateConfig` takes plain data (the loader's, or `plainData`'s in the browser); a caller that skips the check
    // still gets heights refused here.
    const data = { entries: [CORE, { ...STATS, start: -1 }, { ...STATS, start: 5, stop: 7.5 }] } as unknown as PlainData;
    const { declarations, side } = input({ entries: [] });
    const findings = configFindings({ config: { data }, declarations, side });
    expect(findings.map(({ rule, path }) => [rule, path])).toEqual([
      ["entry-start", "entries[1].start"],
      ["entry-stop", "entries[2].stop"],
    ]);
  });

  it("takes a revision that stops at its start, covering one height", () => {
    const checked = validateConfig(input(withEntry(stats.entry({ start: 7, stop: 7, config: { pollMs: 1 } }))));
    expect(checked.entries[1]).toMatchObject({ start: 7, stop: 7 });
  });

  it("takes an entry of a core module (UmbraDB's own) as of a user module", () => {
    const own = { ...stats, id: "core-stats" };
    const { config, side } = input({ entries: [CORE, { ...STATS, id: "core-stats" }] });
    const declarations = validateDeclarations({ backbone: [], core: [own], user: [] });
    const checked = validateConfig({ config, declarations, side });
    expect(checked.entries[1]).toMatchObject({ id: "core-stats", buildVersion: true, settings: { limit: 10, pollMs: 1000 } });
  });

  it("names the file, the side and S, the first core entry's start, and keeps the entries in the file's order", () => {
    const checked = validateConfig(
      input({
        entries: [
          stats.entry({ start: 20, config: { pollMs: 1 } }),
          coreEntry({ start: 30, config: { ...CORE_SETTINGS } }),
          coreEntry({ start: 10, config: { ...CORE_SETTINGS } }),
        ],
      }),
    );
    expect(checked.file).toBe(FILE);
    expect(checked.side).toBe("public");
    expect(checked.start).toBe(10);
    expect(checked.entries.map((entry) => [entry.index, entry.id, entry.start])).toEqual([
      [0, "stats", 20],
      [1, "core", 30],
      [2, "core", 10],
    ]);
  });

  it("returns frozen data", () => {
    const checked = validateConfig(input({ entries: [CORE, STATS] }));
    expect(Object.isFrozen(checked)).toBe(true);
    expect(Object.isFrozen(checked.entries)).toBe(true);
    const entry = checked.entries[0];
    expect(Object.isFrozen(entry)).toBe(true);
    expect(Object.isFrozen(entry?.settings)).toBe(true);
    expect(Object.isFrozen((entry?.settings as { listen: object }).listen)).toBe(true);
    expect(Object.isFrozen(entry?.kinds)).toBe(true);
    expect(Object.isFrozen(entry?.data)).toBe(true);
  });

  it("takes the core entry of a private process with every private field", () => {
    const checked = validateConfig(
      input(
        {
          entries: [
            ...withPrivateCore({
              ...PRIVATE_SETTINGS,
              publicDatabase: "postgres://reader@db/umbradb",
              coreTransport: "core.internal:8082",
              testKeys: [{ kind: "viewing", bytes: "0x01ab02cd", start: 100 }],
            }).entries,
            WALLET.entry({ start: 0, config: { pollMs: 1000 } }),
          ],
        },
        "private",
        [WALLET],
      ),
    );
    expect(checked.side).toBe("private");
    expect(checked.entries[0]?.kinds).toMatchObject({
      instanceId: "operational",
      publicDatabase: "secret",
      coreTransport: "operational",
      testKeys: "secret",
    });
  });

  it("does not validate a revision whose version is not the build's against this build's schema (CF-3)", () => {
    // CF-3's scenario "An upgrade that renames a setting": m 1.0.0 recorded { foo: 1 } from 1; the build carries 1.1.0.
    const checked = validateConfig(
      input({
        entries: [
          CORE,
          versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 1 } }),
          renamed.entry({ start: 50, config: { bar: 1 } }),
        ],
      }),
    );
    expect(checked.entries[1]).toEqual({
      index: 1,
      id: "m",
      start: 1,
      stop: null,
      version: "1.0.0",
      buildVersion: false,
      settings: { foo: 1 },
      kinds: null,
      data: null,
    });
    expect(checked.entries[2]).toMatchObject({
      version: "1.1.0",
      buildVersion: true,
      settings: { bar: 1 },
      kinds: { bar: "data" },
      data: { bar: 1 },
    });
  });

  it("validates a versionEntry whose version is the build's like the build's own entry", () => {
    const written = versionEntry({ id: "stats", start: 0, version: "1.2.0", config: { pollMs: "x" } });
    expect(findingsOf(refusal(() => validateConfig(input(withEntry(written))))).map((f) => f.path)).toEqual([
      "entries[1].config.pollMs",
    ]);
    const core = versionEntry({ id: "core", start: 0, version: buildCoreVersion(), config: { ...CORE_SETTINGS } });
    expect(validateConfig(input({ entries: [core] })).entries[0]?.buildVersion).toBe(true);
  });

  it("takes an earlier core revision, written with versionEntry, as written", () => {
    const checked = validateConfig(
      input({
        entries: [
          versionEntry({ id: "core", start: 0, stop: 99, version: earlierCore(HASH), config: { network: "preprod" } }),
          coreEntry({ start: 100, config: { ...CORE_SETTINGS } }),
        ],
      }),
    );
    expect(checked.start).toBe(0);
    expect(checked.entries[0]).toMatchObject({ buildVersion: false, settings: { network: "preprod" }, kinds: null });
  });

  it("refuses a field without a kind with an Error: the declarations it takes are validated (field-no-kind)", () => {
    expect(() => fieldKinds(z.object({ a: z.number() }))).toThrow("fieldKinds: the setting a has no kind");
    expect(() => fieldKinds({ shape: { b: {} } })).toThrow("fieldKinds: the setting b has no kind");
    expect(fieldKinds(stats.configSchema)).toEqual({ limit: "data", pollMs: "operational", token: "secret" });
  });
});

describe("A28: what needs the cursor (CF-3)", () => {
  /** `stats` 1.0.0 from 0 to 49 (earlier), 1.2.0 from 50 (the build's), and a scheduled 1.3.0 from 100. */
  const history = (earlier: Record<string, unknown> | undefined, scheduled: Record<string, unknown> | undefined) => ({
    entries: [
      CORE,
      versionEntry({ id: "stats", start: 0, stop: 49, version: "1.0.0", config: earlier as never }),
      stats.entry({ start: 50, config: { pollMs: 1000 } }),
      versionEntry({ id: "stats", start: 100, version: "1.3.0", config: scheduled as never }),
    ],
  });

  it("classifies each revision: started at or below the cursor, scheduled above it with another version", () => {
    const placed = entriesAtCursor(validateConfig(input(history({ limit: 3 }, undefined))), 20n);
    expect(placed.map(({ id, start, version, started, scheduled }) => ({ id, start, version, started, scheduled }))).toEqual([
      { id: "core", start: 0, version: buildCoreVersion(), started: true, scheduled: false },
      { id: "stats", start: 0, version: "1.0.0", started: true, scheduled: false },
      { id: "stats", start: 50, version: "1.2.0", started: false, scheduled: false },
      { id: "stats", start: 100, version: "1.3.0", started: false, scheduled: true },
    ]);
    // A scheduled revision is recorded with id, start, stop and version only: it has no settings (task 4.3 records it).
    expect(placed[3]).toMatchObject({ stop: null, settings: null, kinds: null, data: null });
    // An earlier one is compared with its recorded row as written (task 4.3).
    expect(placed[1]).toMatchObject({ stop: 49, settings: { limit: 3 }, kinds: null });
    expect(Object.isFrozen(placed)).toBe(true);
    expect(Object.isFrozen(placed[0])).toBe(true);
  });

  it("on a new database (cursor null) every revision is above the cursor", () => {
    const placed = entriesAtCursor(validateConfig(input({ entries: [CORE, STATS] })), null);
    expect(placed.map((entry) => entry.started)).toEqual([false, false]);
  });

  it("a revision starting at the cursor has started; one starting just above it has not", () => {
    const placed = entriesAtCursor(validateConfig(input(history({ limit: 3 }, undefined))), 50n);
    expect(placed.map((entry) => entry.started)).toEqual([true, true, true, false]);
    expect(entriesAtCursor(validateConfig(input(history({ limit: 3 }, undefined))), 49n)[2]?.started).toBe(false);
  });

  /** One violation the cursor shows: the configuration, the cursor, the rule and the finding. */
  interface CursorRow {
    readonly name: string;
    readonly rule: string;
    readonly config: () => unknown;
    readonly cursor: bigint | null;
    readonly finding: Expected;
  }

  const ROWS: readonly CursorRow[] = [
    {
      name: "a scheduled versionEntry carrying a config (A28)",
      rule: "scheduled-config",
      config: () => history({ limit: 3 }, { limit: 1 }),
      cursor: 20n,
      finding: {
        path: "entries[3].config",
        entry: at(3, "stats", 100),
        field: "config",
        says: ["1.3.0", "starts above the cursor 20", "only its id, start, stop and version are recorded", "remove"],
      },
    },
    {
      name: "a versionEntry carrying a config on a new database",
      rule: "scheduled-config",
      config: () => ({ entries: [CORE, versionEntry({ id: "stats", start: 0, version: "1.0.0", config: { limit: 3 } })] }),
      cursor: null,
      finding: {
        path: "entries[1].config",
        entry: stats1,
        field: "config",
        says: ["1.0.0", "a new database", "only its id, start, stop and version are recorded"],
      },
    },
    {
      name: "an earlier core revision without its recorded config",
      rule: "earlier-config",
      config: () => ({
        entries: [
          versionEntry({ id: "core", start: 0, stop: 99, version: earlierCore(HASH) }),
          coreEntry({ start: 100, config: { ...CORE_SETTINGS } }),
        ],
      }),
      cursor: 20n,
      finding: {
        path: "entries[0].config",
        entry: core0,
        field: "config",
        says: ["core with UmbraDB 0.9.4 is a version this build does not carry", "at or below the cursor 20"],
      },
    },
    {
      name: "an earlier versionEntry without its recorded config",
      rule: "earlier-config",
      config: () => history(undefined, undefined),
      cursor: 20n,
      finding: {
        path: "entries[1].config",
        entry: stats1,
        field: "config",
        says: ["1.0.0", "at or below the cursor 20", "the data recorded for it"],
      },
    },
  ];

  for (const row of ROWS) {
    it(`${row.name}: ${row.rule}`, () => {
      const checked = validateConfig(input(row.config()));
      const error = refusal(() => entriesAtCursor(checked, row.cursor));
      expect(error.code).toBe("invalid-configuration");
      expect(error.details).toMatchObject({ file: FILE, reason: "invalid-entries" });
      const findings = findingsOf(error);
      expect(findings).toHaveLength(1);
      matches(findings[0] as Finding, row.finding, row.rule);
      expect(error.message).toContain(findings[0]?.message);
    });
  }

  it("negative control: without one cursor rule, exactly that rule's rows pass", () => {
    expect(new Set(ROWS.map((row) => row.rule))).toEqual(new Set(CURSOR_RULES.map((rule) => rule.name)));
    for (const removed of CURSOR_RULES) {
      const rules: readonly CursorRule[] = CURSOR_RULES.filter((rule) => rule !== removed);
      for (const row of ROWS) {
        const checked = validateConfig(input(row.config()));
        const all = cursorFindings(checked, row.cursor);
        expect(all.map((finding) => finding.rule)).toEqual([row.rule]);
        expect(cursorFindings(checked, row.cursor, rules), row.name).toEqual(
          all.filter((finding) => finding.rule !== removed.name),
        );
      }
    }
  });

  it("CF-3's scenario: scheduling a newer version from the current build", () => {
    const checked = validateConfig(
      input({ entries: [CORE, STATS, versionEntry({ id: "stats", start: 50, version: "1.3.0" })] }),
    );
    const scheduled = entriesAtCursor(checked, 20n)[2];
    expect(scheduled).toEqual({
      index: 2,
      id: "stats",
      start: 50,
      stop: null,
      version: "1.3.0",
      buildVersion: false,
      settings: null,
      kinds: null,
      data: null,
      started: false,
      scheduled: true,
    });
  });

  it("CF-3's scenario: an upgrade that renames a setting is accepted at the cursor", () => {
    const checked = validateConfig(
      input({
        entries: [
          CORE,
          versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 1 } }),
          renamed.entry({ start: 50, config: { bar: 1 } }),
        ],
      }),
    );
    const placed = entriesAtCursor(checked, 20n);
    expect(placed.map(({ version, started, buildVersion }) => ({ version, started, buildVersion }))).toEqual([
      { version: buildCoreVersion(), started: true, buildVersion: true },
      { version: "1.0.0", started: true, buildVersion: false },
      { version: "1.1.0", started: false, buildVersion: true },
    ]);
  });
});

describe("CF-4, AE-6: a refusal never carries a secret's value", () => {
  const PASSWORD = "pw-4-2-SECRET";
  const URL = `postgres://indexer:${PASSWORD}@db:5432/umbradb`;

  it("a fault beside a secret setting names the fault, never the secret", () => {
    const error = refusal(() => validateConfig(input(withCore({ ...CORE_SETTINGS, database: URL, tipCap: "600" }))));
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toContain(PASSWORD);
  });

  it("a secret refused by its own schema is named by its path, not its value", () => {
    const error = refusal(() => validateConfig(input(withCore({ ...CORE_SETTINGS, database: `mysql://u:${PASSWORD}@h/db` }))));
    expect(findingsOf(error).map((f) => f.path)).toEqual(["entries[0].config.database"]);
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toContain(PASSWORD);
  });

  it("a misspelled secret setting is named by its key, not its value", () => {
    const error = refusal(() => validateConfig(input(withCore({ ...CORE_SETTINGS, databse: URL }))));
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toContain(PASSWORD);
  });

  it("a module's message that repeats the secret it refuses is redacted", () => {
    const entry = leaky.entry({ start: 0, config: { apiKey: `bad-${PASSWORD}`, feedUrl: "https://feed.example" } });
    const error = refusal(() => validateConfig(input(withEntry(entry))));
    const [finding] = findingsOf(error);
    expect(finding?.message).toBe("entries[1].config.apiKey (leaky from 0): the key [redacted] is not a key (CF-3)");
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toContain(PASSWORD);
  });

  it("a module's error that holds the secret is redacted", () => {
    const error = refusal(() => validateConfig(input(withEntry(thrower.entry({ start: 0, config: { apiKey: PASSWORD } })))));
    expect(JSON.stringify({ message: error.message, details: error.details })).not.toContain(PASSWORD);
  });
});

describe("A28 through the loader: a configuration file refused by the validation names the file", () => {
  let directory: string;

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), "umbradb-4-2-"));
    writeFileSync(join(directory, "package.json"), JSON.stringify({ type: "module" }));
  });

  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  it("loads the file, then refuses its stop below its start, naming the file and the entry", async () => {
    const config = join(REPOSITORY, "src", "config", "index.js");
    const fixtures = join(REPOSITORY, "test", "config", "config-fixtures.js");
    const file = join(directory, "umbradb.config.ts");
    writeFileSync(
      file,
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(config)};`,
        `import { CORE_SETTINGS, stats } from ${JSON.stringify(fixtures)};`,
        "export default defineConfig({ entries: [",
        "  coreEntry({ start: 0, config: CORE_SETTINGS }),",
        "  stats.entry({ start: 10, stop: 9, config: { pollMs: 1000 } }),",
        "] });",
        "",
      ].join("\n"),
    );
    const loaded = await loadConfig({ cwd: directory });
    const { declarations } = input({ entries: [] });
    const error = refusal(() => validateConfig({ config: loaded, declarations, side: "public" }));
    expect(error.details.file).toBe(file);
    expect(findingsOf(error).map(({ path, entry }) => ({ path, entry }))).toEqual([
      { path: "entries[1].stop", entry: at(1, "stats", 10) },
    ]);
    expect(error.message).toContain(file);
  });
});

describe("A119 (CF-11): a test key's kind and bytes are checked against the configured modules' declarations", () => {
  /** A119's oracle on the validation's findings for {@link withWallet}'s keys: none when every bad key is found. */
  function a119Problems(findings: readonly Finding[]): string[] {
    const problems: string[] = [];
    const paths = new Set(findings.map((finding) => finding.path));
    if (!paths.has("entries[0].config.testKeys[0].kind")) problems.push("a test key of a kind no module declares was accepted");
    if (!paths.has("entries[0].config.testKeys[1].bytes")) problems.push("a test key whose bytes validateKey rejects was accepted");
    if (!paths.has("entries[0].config.testKeys[2].bytes")) problems.push("a test key whose validateKey throws was accepted");
    if (paths.has("entries[0].config.testKeys[3].kind") || paths.has("entries[0].config.testKeys[3].bytes")) {
      problems.push("a good test key was refused");
    }
    return problems;
  }

  const KEYS = [
    { kind: "spending", bytes: "0x0a0b0c0d", start: 5 },
    { kind: "viewing", bytes: "0x0a0b", start: 5 },
    { kind: "viewing", bytes: "0xff0b0c0d", start: 5 },
    { kind: "viewing", bytes: "0x0a0b0c0d", start: 5 },
  ];
  const keysInput = () => input(withWallet(KEYS), "private", [WALLET]);

  it("finds a kind no configured module declares and bytes validateKey rejects or throws on, never a good key", () => {
    const findings = configFindings(keysInput());
    expect(a119Problems(findings)).toEqual([]);
    expect(findings.every((finding) => finding.rule === "test-keys")).toBe(true);
    // No message repeats a key's bytes, nor the thrown message that held them.
    for (const finding of findings) {
      for (const key of KEYS) expect(finding.message).not.toContain(key.bytes.slice(2));
    }
  });

  it("checks every module that declares the kind, a module not enabled by the configuration counting for none", () => {
    const other = defineModule({ ...declaration("other", { side: "private", keyKinds: ["viewing"], validateKey: () => false }) });
    // `other` declares the kind and refuses every key, but no entry enables it: wallet alone decides.
    expect(configFindings(input(withWallet([{ kind: "viewing", bytes: "0x0a0b0c0d", start: 5 }]), "private", [WALLET, other]))).toEqual([]);
    const both = {
      entries: [...withWallet([{ kind: "viewing", bytes: "0x0a0b0c0d", start: 5 }]).entries, other.entry({ start: 0, config: { pollMs: 1 } })],
    };
    const [finding] = configFindings(input(both, "private", [WALLET, other]));
    expect(finding?.message).toContain("refused by the validateKey of other");
  });

  it("takes a key only when validateKey returns true; the same bytes under two kinds are two keys", () => {
    const loose = defineModule({
      ...declaration("loose", { side: "private", keyKinds: ["viewing", "spending"], validateKey: (() => 1) as never }),
    });
    const config = (testKeys: readonly Record<string, unknown>[]) => ({
      entries: [...withPrivateCore({ ...PRIVATE_SETTINGS, testKeys }).entries, loose.entry({ start: 0, config: { pollMs: 1 } })],
    });
    const [truthy] = configFindings(input(config([{ kind: "viewing", bytes: "0x0a0b", start: 5 }]), "private", [loose]));
    expect(truthy?.path).toBe("entries[0].config.testKeys[0].bytes");
    const twoKinds = [
      { kind: "viewing", bytes: "0x0a0b0c0d", start: 5 },
      { kind: "spending", bytes: "0x0a0b0c0d", start: 5 },
    ];
    const both = defineModule({ ...declaration("both", { side: "private", keyKinds: ["viewing", "spending"], validateKey: () => true }) });
    const entries = { entries: [...withPrivateCore({ ...PRIVATE_SETTINGS, testKeys: twoKinds }).entries, both.entry({ start: 0, config: { pollMs: 1 } })] };
    expect(configFindings(input(entries, "private", [both]))).toEqual([]);
  });

  it("gives validateKey the key's kind and a copy of its bytes", () => {
    const calls: { kind: string; bytes: Uint8Array }[] = [];
    const recording = defineModule({
      ...declaration("recording", {
        side: "private",
        keyKinds: ["viewing"],
        validateKey: (kind: string, bytes: Uint8Array) => {
          calls.push({ kind, bytes });
          bytes.fill(0);
          return true;
        },
      }),
    });
    const config = {
      entries: [
        ...withPrivateCore({ ...PRIVATE_SETTINGS, testKeys: [{ kind: "viewing", bytes: "0x0a0b", start: 5 }] }).entries,
        recording.entry({ start: 0, config: { pollMs: 1 } }),
      ],
    };
    expect(configFindings(input(config, "private", [recording]))).toEqual([]);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.kind).toBe("viewing");
    const checked = validateConfig(input(config, "private", [recording]));
    expect((checked.entries[0]?.settings as { testKeys: { bytes: string }[] }).testKeys[0]?.bytes).toBe("0x0a0b");
  });

  it("negative control: a test-keys rule that skips validateKey accepts the bytes it rejects, and fails the oracle", () => {
    const rules = CONFIG_RULES.map((rule) => (rule.name === "test-keys" ? testKeysRule({ validateKey: false }) : rule));
    const problems = a119Problems(configFindings(keysInput(), rules));
    expect(problems).toContain("a test key whose bytes validateKey rejects was accepted");
    expect(problems).toContain("a test key whose validateKey throws was accepted");
  });
});
