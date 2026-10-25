import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";
import { z } from "zod";
import { buildCoreVersion, type CoreVersion, UMBRADB_VERSION } from "../../src/config/build.js";
import {
  CORE_ENTRY_ID,
  type CoreSettings,
  coreEntry,
  defineConfig,
  type Entry,
  type TestKey,
  type UmbraConfig,
  versionEntry,
} from "../../src/config/entries.js";
import { plainData } from "../../src/config/plain-data.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration, userModules } from "../modules/declarations.js";
import { CORE_SETTINGS, prices, REPOSITORY, stats } from "./config-fixtures.js";

/**
 * CF-2 and A27 (task 4.1): the builders fill each entry's identity and version from the build — `coreEntry` the id
 * `core` and the core version (the UmbraDB version and the ledger packages the build carries), a module's `entry` its
 * id and version from the imported declaration (`defineModule` gives every declaration one), and `versionEntry` takes
 * a version the build does not carry — and return plain data. A27 `[STATIC]`: a misspelled `core` field, a wrong field
 * type and a module `entry` given another module's settings are type errors, shown by `// @ts-expect-error` lines that
 * `tsc --noEmit` (`npm run typecheck`) fails as unused if the error is gone, as A20's are; the committed negative
 * control is a builder typed loosely, which accepts each of them. `./typed-config.test.ts` compiles a configuration
 * file with the TypeScript compiler and checks each error's position and words.
 */

/** The `config` an entry builder takes. */
type ConfigOf<B> = B extends (entry: infer E) => unknown ? (E extends { config: infer C } ? C : never) : never;

/**
 * True when a builder `B` accepts the settings type `C` (structurally: an unknown property of a fresh literal is caught
 * by the compiler's excess-property check, which a type cannot express — those cases are `@ts-expect-error` lines).
 */
type Accepts<B, C> = [C] extends [ConfigOf<B>] ? true : false;

/** A builder typed loosely: what the builders would be if `config` were not typed by the schema (the negative control). */
const loose = (entry: { start: number; stop?: number; config: Readonly<Record<string, unknown>> }) => entry;

type CoreSettingsGiven = typeof CORE_SETTINGS;
type StatsSettings = z.input<typeof stats.configSchema>;
type PricesSettings = z.input<typeof prices.configSchema>;

describe("A27: a misspelled core field is a type error (CF-2)", () => {
  it("rejects an unknown field written for a known one, required or optional", () => {
    const required = () =>
      coreEntry({
        start: 0,
        config: {
          network: "preprod",
          node: "ws://127.0.0.1:9944",
          // @ts-expect-error A27: `databse` is not a field of the core entry (the field is `database`; CF-2's scenario).
          databse: "postgres://indexer@db/umbradb",
        },
      });
    const optional = () =>
      coreEntry({
        start: 0,
        config: {
          ...CORE_SETTINGS,
          // @ts-expect-error A27: `retainState` is not a field of the core entry (the field is `retainStates`).
          retainState: 1000,
        },
      });
    expectTypeOf(required).toBeFunction();
    expectTypeOf(optional).toBeFunction();
  });

  it("control: the same entries with the fields spelled right compile", () => {
    const right = coreEntry({ start: 0, config: { ...CORE_SETTINGS, database: "postgres://db", retainStates: 1000 } });
    expectTypeOf(right.config).toEqualTypeOf<CoreSettings>();
    expectTypeOf<Accepts<typeof coreEntry, CoreSettingsGiven>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof coreEntry, Omit<CoreSettingsGiven, "database"> & { databse: string }>>().toEqualTypeOf<
      false
    >();
  });
});

describe("A27: a wrong field type is a type error (CF-2, CF-3's scenario)", () => {
  it("rejects a string where the core entry has an integer, and where it has a boolean", () => {
    const integer = () =>
      coreEntry({
        start: 0,
        config: {
          ...CORE_SETTINGS,
          // @ts-expect-error A27: `livenessTimeoutMs` is an integer, not the string "30000".
          livenessTimeoutMs: "30000",
        },
      });
    const boolean = () =>
      coreEntry({
        start: 0,
        config: {
          ...CORE_SETTINGS,
          // @ts-expect-error A27: `developmentOptIn` is a boolean.
          developmentOptIn: "true",
        },
      });
    const network = () =>
      coreEntry({
        start: 0,
        config: {
          ...CORE_SETTINGS,
          // @ts-expect-error A27: `network` is one of the five networks.
          network: "mainnet-beta",
        },
      });
    expectTypeOf(integer).toBeFunction();
    expectTypeOf(boolean).toBeFunction();
    expectTypeOf(network).toBeFunction();
    expectTypeOf<Accepts<typeof coreEntry, CoreSettingsGiven & { livenessTimeoutMs: string }>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof coreEntry, CoreSettingsGiven & { livenessTimeoutMs: number }>>().toEqualTypeOf<true>();
  });

  it("rejects a module setting of the wrong type, which the module's schema types", () => {
    const wrong = () =>
      stats.entry({
        start: 0,
        config: {
          // @ts-expect-error A27: `pollMs` is a number in stats's schema.
          pollMs: "1000",
        },
      });
    expectTypeOf(wrong).toBeFunction();
  });
});

describe("A27: a module entry given another module's settings is a type error (CF-2)", () => {
  it("rejects prices's settings in stats's entry, written there or built first", () => {
    const written = () =>
      stats.entry({
        start: 0,
        config: {
          pollMs: 1000,
          // @ts-expect-error A27: `feedUrl` is prices's setting, not stats's.
          feedUrl: "https://feed.example",
        },
      });
    const settings: PricesSettings = { feedUrl: "https://feed.example" };
    // @ts-expect-error A27: prices's settings lack stats's `pollMs`.
    const built = () => stats.entry({ start: 0, config: settings });
    expectTypeOf(written).toBeFunction();
    expectTypeOf(built).toBeFunction();
    expectTypeOf<Accepts<typeof stats.entry, PricesSettings>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof prices.entry, StatsSettings>>().toEqualTypeOf<false>();
  });

  it("control: each module's own settings are accepted, defaults and optional fields left out", () => {
    expectTypeOf<Accepts<typeof stats.entry, { pollMs: number }>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof prices.entry, PricesSettings>>().toEqualTypeOf<true>();
    expectTypeOf<StatsSettings>().toEqualTypeOf<{ limit?: number | undefined; pollMs: number; token?: string | undefined }>();
    const entry = stats.entry({ start: 0, config: { pollMs: 1000 } });
    // defineModule infers a declaration's id as a string (task 3.1: a `const` type parameter, which would keep the
    // literal, also makes its lists read-only); the value is the declaration's, below.
    expectTypeOf(entry.id).toEqualTypeOf<string>();
    expectTypeOf(entry.config).toEqualTypeOf<StatsSettings>();
  });
});

describe("A27 negative control: a builder typed loosely accepts every one of these", () => {
  it("accepts the misspelled field, the wrong type and the other module's settings", () => {
    const misspelled = loose({ start: 0, config: { network: "preprod", node: "ws://n", databse: "postgres://db" } });
    const wrongType = loose({ start: 0, config: { ...CORE_SETTINGS, livenessTimeoutMs: "30000" } });
    const otherModule = loose({ start: 0, config: { pollMs: 1000, feedUrl: "https://feed.example" } });
    expect([misspelled, wrongType, otherModule]).toHaveLength(3);
    expectTypeOf<Accepts<typeof loose, CoreSettingsGiven & { livenessTimeoutMs: string }>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof loose, Omit<CoreSettingsGiven, "database"> & { databse: string }>>().toEqualTypeOf<
      true
    >();
    expectTypeOf<Accepts<typeof loose, PricesSettings>>().toEqualTypeOf<true>();
  });
});

describe("CF-2, CF-4: the core entry's settings are typed as CF-4 lists them", () => {
  it("rejects a private process's field in a public process's core entry, and the reverse", () => {
    const mixedPublic = () =>
      coreEntry({
        start: 0,
        // @ts-expect-error CF-4: `instanceId` is a private process's field, and this entry has the public one's `node`.
        config: { ...CORE_SETTINGS, instanceId: "wallet-1" },
      });
    const mixedPrivate = () =>
      coreEntry({
        start: 0,
        // @ts-expect-error CF-4: `lockstepInstances` is the public core's, and this entry has a private `instanceId`.
        config: { network: "preprod", database: "pglite:memory", instanceId: "wallet-1", lockstepInstances: [] },
      });
    expectTypeOf(mixedPublic).toBeFunction();
    expectTypeOf(mixedPrivate).toBeFunction();
  });

  it("requires a public process's node or a private one's instanceId, and refuses the other's fields built first", () => {
    // Types, not literals: an object built first gets no excess-property check, so only the types refuse these.
    type Minimal = { network: "preprod"; database: string };
    expectTypeOf<Accepts<typeof coreEntry, Minimal & { node: string }>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof coreEntry, Minimal & { instanceId: string }>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof coreEntry, Minimal>>().toEqualTypeOf<false>();
    type Public = Minimal & { node: string };
    expectTypeOf<Accepts<typeof coreEntry, Public & { instanceId: string }>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof coreEntry, Public & { publicDatabase: string }>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof coreEntry, Public & { coreTransport: string }>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof coreEntry, Public & { testKeys: TestKey[] }>>().toEqualTypeOf<false>();
    type Private = Minimal & { instanceId: string };
    expectTypeOf<Accepts<typeof coreEntry, Private & { node: string }>>().toEqualTypeOf<false>();
    expectTypeOf<Accepts<typeof coreEntry, Private & { lockstepInstances: string[] }>>().toEqualTypeOf<false>();
    // The negative control: the loose builder accepts each of them.
    expectTypeOf<Accepts<typeof loose, Minimal>>().toEqualTypeOf<true>();
    expectTypeOf<Accepts<typeof loose, Public & { instanceId: string }>>().toEqualTypeOf<true>();
  });

  it("accepts every field of CF-4's table, for a public and a private process", () => {
    const publicCore = coreEntry({
      start: 0,
      stop: 99,
      config: {
        network: "custom",
        genesisHash: `0x${"ab".repeat(32)}`,
        ledgerTable: {
          rows: [{ specVersionMin: 0, specVersionMax: 1_999_999, ledger: "v8" }],
          pins: [{ height: 1_774_492, hash: `0x${"38".repeat(32)}`, specVersion: 1_000_000 }],
        },
        ledgerSources: { v8: "vendored", v9: "released" },
        sweep: "on",
        retainStates: 0,
        database: "postgres://indexer@db/umbradb",
        node: "ws://127.0.0.1:9944",
        listen: { api: "0.0.0.0:8080", admin: "0.0.0.0:8081", transport: "0.0.0.0:8082" },
        tipCap: 600,
        prefetchWindow: 64,
        backoffCeilingMs: 30_000,
        lockstepInstances: ["wallet-1"],
        backupAtStop: "/backups/at-stop.dump",
        tls: { certificate: "-----BEGIN CERTIFICATE-----", key: "-----BEGIN PRIVATE KEY-----", trustedRoots: [] },
        livenessTimeoutMs: 30_000,
        apiReadTimeoutMs: 30_000,
        slowBlockMs: 60_000,
        followingThreshold: 3,
        readinessLag: 10,
        fullPageWritesOffAllowed: false,
        developmentOptIn: false,
      },
    });
    const privateCore = coreEntry({
      start: 0,
      config: {
        network: "preprod",
        database: "pglite:/var/lib/umbradb/wallet",
        instanceId: "wallet-1",
        publicDatabase: "postgres://reader@db/umbradb",
        coreTransport: "core.internal:8082",
        testKeys: [{ kind: "viewing-key", bytes: "0x01", start: 100 }],
        developmentOptIn: true,
      },
    });
    expect(plainData(publicCore)).toEqual(publicCore);
    expect(plainData(privateCore)).toEqual(privateCore);
  });
});

describe("CF-2: coreEntry fills the id core and the build's core version", () => {
  const config: CoreSettings = { ...CORE_SETTINGS };

  it("returns { id, start, version, config }, with the version from the build", () => {
    const entry = coreEntry({ start: 0, config });
    expect(entry).toEqual({ id: "core", start: 0, version: buildCoreVersion(), config });
    expect(Object.keys(entry)).toEqual(["id", "start", "version", "config"]);
    expect(entry.config).toBe(config);
    expect(CORE_ENTRY_ID).toBe("core");
    expectTypeOf(entry.id).toEqualTypeOf<"core">();
    expectTypeOf(entry.version).toEqualTypeOf<CoreVersion>();
  });

  it("keeps a stop, and leaves out a stop that is absent or undefined", () => {
    expect(coreEntry({ start: 10, stop: 20, config })).toEqual({
      id: "core",
      start: 10,
      stop: 20,
      version: buildCoreVersion(),
      config,
    });
    expect("stop" in coreEntry({ start: 10, config })).toBe(false);
    expect("stop" in coreEntry({ start: 10, stop: undefined, config })).toBe(false);
  });

  it("returns plain data", () => {
    const entry = coreEntry({ start: 0, stop: 5, config });
    expect(plainData(entry)).toEqual(entry);
  });

  it("built without types, passes an unknown property through for validation, and fills id and version anyway", () => {
    const untyped = coreEntry({ start: 0, config, id: "x", version: "9.9.9", extra: 1 } as never);
    expect(untyped).toEqual({ id: "core", start: 0, version: buildCoreVersion(), config, extra: 1 });
    expect("config" in coreEntry({ start: 0 } as never)).toBe(false);
  });
});

describe("CF-2: the build's core version", () => {
  const manifest = JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as { version: string };

  it("is { umbradb: the package's version, ledgers: one item per ledger version the build carries }", () => {
    expect(UMBRADB_VERSION).toBe(manifest.version);
    expect(buildCoreVersion()).toEqual({ umbradb: manifest.version, ledgers: [] });
  });

  it("is a new plain object at every call", () => {
    const first = buildCoreVersion();
    expect(buildCoreVersion()).not.toBe(first);
    expect(buildCoreVersion().ledgers).not.toBe(first.ledgers);
    expect(plainData(first)).toEqual(first);
  });
});

describe("CF-2: versionEntry takes a version this build does not carry", () => {
  it("an earlier revision, with its recorded config", () => {
    const entry = versionEntry({ id: "stats", start: 1, version: "1.0.0", config: { foo: 1 } });
    expect(entry).toEqual({ id: "stats", start: 1, version: "1.0.0", config: { foo: 1 } });
    expect(Object.keys(entry)).toEqual(["id", "start", "version", "config"]);
    expectTypeOf(entry.id).toEqualTypeOf<"stats">();
  });

  it("a later, scheduled revision, without a config", () => {
    const entry = versionEntry({ id: "stats", start: 50, version: "1.1.0" });
    expect(entry).toEqual({ id: "stats", start: 50, version: "1.1.0" });
    expect("config" in entry).toBe(false);
    expect(versionEntry({ id: "stats", start: 50, stop: 90, version: "1.1.0", config: undefined })).toEqual({
      id: "stats",
      start: 50,
      stop: 90,
      version: "1.1.0",
    });
  });

  it("an earlier revision of the core, whose version is a core version", () => {
    const version: CoreVersion = { umbradb: "0.9.4", ledgers: [] };
    const entry = versionEntry({ id: "core", start: 0, version, config: { network: "preprod" } });
    expect(entry).toEqual({ id: "core", start: 0, version, config: { network: "preprod" } });
    expectTypeOf(entry.version).toEqualTypeOf<CoreVersion>();
    // @ts-expect-error CF-2: the core's version is a core version, { umbradb, ledgers }, not a semver string.
    const semver = () => versionEntry({ id: "core", start: 0, version: "0.9.4" });
    expectTypeOf(semver).toBeFunction();
  });

  it("types its config as plain data, loosely: any field, but no function", () => {
    // @ts-expect-error CF-1: a function is not plain data.
    const fn = () => versionEntry({ id: "stats", start: 1, version: "1.0.0", config: { onError: () => 0 } });
    expectTypeOf(fn).toBeFunction();
  });
});

describe("CF-2: a module's entry builder fills its id and version from the declaration", () => {
  it("returns { id, start, version, config }, with stop when given", () => {
    expect(stats.entry({ start: 0, config: { pollMs: 1000 } })).toEqual({
      id: "stats",
      start: 0,
      version: "1.2.0",
      config: { pollMs: 1000 },
    });
    const entry = prices.entry({ start: 10, stop: 19, config: { feedUrl: "https://feed.example" } });
    expect(entry).toEqual({ id: "prices", start: 10, stop: 19, version: "0.3.1", config: { feedUrl: "https://feed.example" } });
    expect(Object.keys(entry)).toEqual(["id", "start", "stop", "version", "config"]);
    expect("stop" in stats.entry({ start: 0, stop: undefined, config: { pollMs: 1 } })).toBe(false);
    expect(plainData(entry)).toEqual(entry);
  });

  it("reads them from the declaration it was made for", () => {
    const d = defineModule(declaration("fees", { version: "2.0.1" }));
    expect(d.entry({ start: 3, config: {} })).toEqual({ id: "fees", start: 3, version: "2.0.1", config: {} });
  });

  it("is a property defineModule adds that enumeration, copies and validation do not see", () => {
    const given: ModuleDeclaration = declaration("fees");
    const keys = Object.keys(given);
    const defined = defineModule(given);
    expect(defined).toBe(given);
    expect(Object.keys(defined)).toEqual(keys);
    expect({ ...defined }).not.toHaveProperty("entry");
    expect(Object.getOwnPropertyDescriptor(defined, "entry")).toMatchObject({ enumerable: false, writable: false });
    expect(typeof defined.entry).toBe("function");
    expect(validateDeclarations(userModules([stats, prices, defined])).user).toEqual([stats, prices, defined]);
  });

  it("can be defined twice on one declaration", () => {
    const d = declaration("fees");
    expect(defineModule(defineModule(d)).entry({ start: 0, config: {} })).toMatchObject({ id: "fees" });
  });

  it("refuses a declaration it cannot add the builder to, saying to freeze it afterwards", () => {
    const frozen = Object.freeze(declaration("fees"));
    expect(() => defineModule(frozen)).toThrow(TypeError);
    expect(() => defineModule(frozen)).toThrow(
      "defineModule adds the entry builder to the declaration of fees, which is frozen, sealed or not extensible",
    );
  });
});

describe("CF-1, CF-2: defineConfig", () => {
  it("returns the configuration it is given", () => {
    const config: UmbraConfig = { entries: [coreEntry({ start: 0, config: { ...CORE_SETTINGS } })] };
    expect(defineConfig(config)).toBe(config);
  });

  it("takes every builder's entry", () => {
    const config = defineConfig({
      entries: [
        coreEntry({ start: 0, config: { ...CORE_SETTINGS } }),
        versionEntry({ id: "stats", start: 1, version: "1.0.0", config: { foo: 1 } }),
        stats.entry({ start: 50, config: { pollMs: 1000 } }),
        versionEntry({ id: "prices", start: 60, version: "0.4.0" }),
      ],
    });
    expectTypeOf(config.entries).toEqualTypeOf<readonly Entry[]>();
    expect(plainData(config)).toEqual(config);
  });

  it("rejects an unknown property beside entries", () => {
    // @ts-expect-error CF-1: a configuration is { entries }.
    const extra = () => defineConfig({ entries: [], modules: [] });
    expectTypeOf(extra).toBeFunction();
  });
});
