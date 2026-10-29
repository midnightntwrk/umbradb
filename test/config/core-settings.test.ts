import { describe, expect, expectTypeOf, it } from "vitest";
import type { z } from "zod";
import {
  CORE_VERSION_SCHEMA,
  coreSettingsSchema,
  DEFAULT_ADMIN_ADDRESS,
  HASH_HEX,
  HEX_BYTES,
  hashHex,
  hexBytes,
  PRIVATE_CORE_SCHEMA,
  PUBLIC_CORE_SCHEMA,
} from "../../src/config/core-settings.js";
import { buildCoreVersion } from "../../src/config/build.js";
import type { PrivateCoreSettings, PublicCoreSettings } from "../../src/config/entries.js";
import { fieldKinds } from "../../src/config/validate.js";
import { MAX_READ_TIMEOUT_MS } from "../../src/db/read-options.js";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { declaration } from "../modules/declarations.js";

/**
 * The table of `core` settings. The `core` entry's settings are zod schemas: one for a public (core) process, one for
 * a private process. Each field has its kind on its outermost schema (`schema.shape[field].meta().kind`, as in a
 * module's settings) and its default. The table below is the specified table written out; the schemas must say the
 * same. [CF-4; design §7]
 *
 * The types the builders take (`CoreSettings`, `src/config/entries.ts`) are held equal to the schemas' input types,
 * so the two cannot drift apart. [CF-2]
 */

/** What a field is when the configuration leaves it out: its default, required, or absent. */
type Absent = { readonly default: unknown } | "required" | "absent";

/** The specified table: each field's kind and what it is when left out. [CF-4] */
const BASE: Readonly<Record<string, readonly [string, Absent]>> = {
  network: ["data", "required"],
  genesisHash: ["data", "absent"],
  // The network's built-in ledger table; the required settings below name preprod.
  ledgerTable: ["data", { default: builtInLedgerTable("preprod") }],
  ledgerSources: ["data", { default: { v8: "vendored", "v9-rc3": "vendored", v9: "vendored", v10: "vendored" } }],
  sweep: ["data", { default: "on" }],
  retainStates: ["data", { default: 0 }],
  // Operational, with its `password` part secret (`src/config/redact.ts`). [Q167 A]
  database: ["operational", "required"],
  listen: ["operational", { default: { admin: "0.0.0.0:8081" } }],
  tipCap: ["operational", { default: 600 }],
  prefetchWindow: ["operational", { default: 64 }],
  backoffCeilingMs: ["operational", { default: 30_000 }],
  backupAtStop: ["operational", "absent"],
  // SIGUSR2 writes a backup there. [BK-1, Q152 B]
  backupOnSignal: ["operational", "absent"],
  tls: ["secret", "absent"],
  livenessTimeoutMs: ["operational", { default: 30_000 }],
  apiReadTimeoutMs: ["operational", { default: 30_000 }],
  slowBlockMs: ["operational", { default: 60_000 }],
  followingThreshold: ["operational", { default: 3 }],
  readinessLag: ["operational", "absent"],
  fullPageWritesOffAllowed: ["operational", { default: false }],
  developmentOptIn: ["operational", { default: false }],
};

const PUBLIC: Readonly<Record<string, readonly [string, Absent]>> = {
  ...BASE,
  node: ["secret", "required"],
  lockstepInstances: ["operational", { default: [] }],
  // Its `password` part is secret; required with a PostgreSQL database and listen.transport. [Q175 A]
  transportReader: ["operational", "absent"],
};

/** A private process's own fields. */
const PRIVATE: Readonly<Record<string, readonly [string, Absent]>> = {
  ...BASE,
  instanceId: ["operational", "required"],
  publicDatabase: ["operational", "absent"],
  coreTransport: ["operational", "absent"],
};

const REQUIRED_PUBLIC = { network: "preprod", database: { kind: "pglite", memory: true }, node: "ws://127.0.0.1:9944" };
const REQUIRED_PRIVATE = { network: "preprod", database: { kind: "pglite", memory: true }, instanceId: "wallet-1" };

describe("CF-4: the core entry's fields, kinds and defaults", () => {
  for (const [side, schema, table, required] of [
    ["public", PUBLIC_CORE_SCHEMA, PUBLIC, REQUIRED_PUBLIC],
    ["private", PRIVATE_CORE_SCHEMA, PRIVATE, REQUIRED_PRIVATE],
  ] as const) {
    it(`a ${side} process: every field of CF-4's table with its kind`, () => {
      expect(fieldKinds(schema)).toEqual(Object.fromEntries(Object.entries(table).map(([f, [kind]]) => [f, kind])));
      expect(coreSettingsSchema(side)).toBe(schema);
    });

    it(`a ${side} process: each field left out takes its default, is required, or stays absent`, () => {
      const parsed = schema.parse(required) as Record<string, unknown>;
      for (const [field, [, absent]] of Object.entries(table)) {
        if (absent === "required") {
          expect(parsed[field], field).toEqual((required as Record<string, unknown>)[field]);
          const { [field]: _left, ...without } = required as Record<string, unknown>;
          const issues = schema.safeParse(without).error?.issues ?? [];
          expect(issues.map((issue) => issue.path), field).toEqual([[field]]);
        } else if (absent === "absent") {
          expect(field in parsed, field).toBe(false);
        } else {
          expect(parsed[field], field).toEqual(absent.default);
        }
      }
    });

    it(`a ${side} process: a declaration with these settings passes the declaration validation (field-no-kind)`, () => {
      const set = { backbone: [], core: [], user: [declaration("settings-like", { configSchema: schema })] };
      expect(() => validateDeclarations(set)).not.toThrow();
    });
  }

  it("the admin listener's default address", () => {
    expect(DEFAULT_ADMIN_ADDRESS).toBe("0.0.0.0:8081");
  });

  it("apiReadTimeoutMs is a whole number from 1 to 2,147,483,647, the read option's bounds (DB-15)", () => {
    expect(MAX_READ_TIMEOUT_MS).toBe(2_147_483_647);
    const read = (value: unknown) => PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, apiReadTimeoutMs: value }).success;
    expect([1, 30_000, MAX_READ_TIMEOUT_MS].map(read)).toEqual([true, true, true]);
    expect([0, MAX_READ_TIMEOUT_MS + 1, 1.5, "1000"].map(read)).toEqual([false, false, false, false]);
  });

  it("accepts every field of CF-4's table, given, for a public and a private process", () => {
    expect(
      PUBLIC_CORE_SCHEMA.safeParse({
        network: "custom",
        genesisHash: `0x${"ab".repeat(32)}`,
        ledgerTable: {
          rows: [{ specVersionMin: 0, specVersionMax: 1_999_999, ledger: "v8" }],
          pins: [{ height: 1_774_492, hash: `0x${"38".repeat(32)}`, specVersion: 1_000_000 }],
        },
        ledgerSources: { v8: "vendored", v9: "released", v10: "vendored" },
        sweep: "off",
        retainStates: 4,
        database: { kind: "postgres", host: "db", port: 5432, user: "indexer", password: "p", name: "umbradb", ssl: "require" },
        node: "wss://node.example:443",
        listen: { api: "0.0.0.0:8080", admin: "[::1]:8081", transport: "localhost:8082" },
        transportReader: { user: "umbradb_transport", password: "r" },
        tipCap: 1,
        prefetchWindow: 0,
        backoffCeilingMs: 1,
        lockstepInstances: ["wallet-1"],
        backupAtStop: "/backups/at-stop.dump",
        backupOnSignal: "/backups/on-signal.dump",
        tls: { certificate: "-----BEGIN CERTIFICATE-----", key: "-----BEGIN PRIVATE KEY-----", trustedRoots: [] },
        livenessTimeoutMs: 1,
        apiReadTimeoutMs: 1,
        slowBlockMs: 1,
        followingThreshold: 0,
        readinessLag: 10,
        fullPageWritesOffAllowed: true,
        developmentOptIn: true,
      }).error,
    ).toBeUndefined();
    expect(
      PRIVATE_CORE_SCHEMA.safeParse({
        ...REQUIRED_PRIVATE,
        database: { kind: "pglite", path: "/var/lib/umbradb/wallet" },
        publicDatabase: { kind: "postgres", host: "db", user: "reader", name: "umbradb" },
        coreTransport: "core.internal:8082",
      }).error,
    ).toBeUndefined();
  });

  it("takes the database as parts, never a connection string (Q167 A), and the node as ws:// or wss://", () => {
    const database = (value: unknown) => PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, database: value }).success;
    const postgres = { kind: "postgres", host: "h", user: "u", name: "db" };
    expect(
      [
        postgres,
        { ...postgres, port: 6543, password: "p", ssl: "verify-full" },
        { kind: "pglite", memory: true },
        { kind: "pglite", path: "./data" },
      ].map(database),
    ).toEqual([true, true, true, true]);
    expect(
      [
        "postgres://h/db",
        "postgresql://u:p@h1,h2/db",
        "pglite:memory",
        "pglite:./data",
        { kind: "pglite", path: "" },
        { kind: "pglite" },
        { ...postgres, port: 0 },
        { ...postgres, ssl: "prefer" },
        { ...postgres, host: "" },
        "",
      ].map(database),
    ).toEqual([false, false, false, false, false, false, false, false, false, false]);
    const node = (value: string) => PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, node: value }).success;
    expect(["ws://n:9944", "wss://n", "ws://", "http://n:9944"].map(node)).toEqual([true, true, false, false]);
  });

  it("takes addresses as host:port, the port from 0 to 65535", () => {
    const address = (api: string) => PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, listen: { api } }).success;
    expect(["0.0.0.0:0", "localhost:65535", "[::]:8080", "db.internal:5432"].map(address)).toEqual([
      true,
      true,
      true,
      true,
    ]);
    expect(["8080", ":8080", "host:", "host:65536", "host:123456", "a b:1", "host:-1", "[::]"].map(address)).toEqual(
      Array(8).fill(false),
    );
  });

  it("takes integers from 0, and a whole number only", () => {
    const retain = (value: unknown) => PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, retainStates: value }).success;
    expect([0, 1, Number.MAX_SAFE_INTEGER].map(retain)).toEqual([true, true, true]);
    expect([-1, 0.5, "1"].map(retain)).toEqual([false, false, false]);
  });

  it("takes text that is not empty", () => {
    expect(PRIVATE_CORE_SCHEMA.safeParse({ ...REQUIRED_PRIVATE, instanceId: "" }).success).toBe(false);
    expect(PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, backupAtStop: "" }).success).toBe(false);
    expect(PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, backupOnSignal: "" }).success).toBe(false);
    expect(PRIVATE_CORE_SCHEMA.safeParse({ ...REQUIRED_PRIVATE, backupOnSignal: "" }).success).toBe(false);
  });

  it("takes instance ids as the transport's hello does: 1 to 128 letters, digits, '.', '_', ':' and '-'", () => {
    const privateId = (instanceId: string) => PRIVATE_CORE_SCHEMA.safeParse({ ...REQUIRED_PRIVATE, instanceId }).success;
    const listed = (instance: string) =>
      PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, lockstepInstances: ["wallet-1", instance] }).success;
    const good = ["a", "wallet-1", "Wallet_2.eu:west-1", "a".repeat(128)];
    const bad = ["", "a\nb", "a\rb", "wallet 1", "a\u0000b", "wallét", "a".repeat(129)];
    expect(good.map(privateId)).toEqual(Array(good.length).fill(true));
    expect(good.map(listed)).toEqual(Array(good.length).fill(true));
    expect(bad.map(privateId)).toEqual(Array(bad.length).fill(false));
    expect(bad.map(listed)).toEqual(Array(bad.length).fill(false));
  });

  it("requires genesisHash with a custom network and refuses it otherwise, for either side", () => {
    const hash = `0x${"ab".repeat(32)}`;
    for (const [schema, required] of [
      [PUBLIC_CORE_SCHEMA, REQUIRED_PUBLIC],
      [PRIVATE_CORE_SCHEMA, REQUIRED_PRIVATE],
    ] as const) {
      // A custom network also sets its own ledger table: given here, so only the genesis rule reports. [LG-3]
      const ledgerTable = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v8" }] };
      const paths = (settings: Record<string, unknown>) =>
        (schema.safeParse({ ...required, ...settings }).error?.issues ?? []).map((issue) => issue.path);
      expect(paths({ network: "custom", ledgerTable })).toEqual([["genesisHash"]]);
      expect(paths({ network: "preprod", genesisHash: hash })).toEqual([["genesisHash"]]);
      expect(paths({ network: "custom", genesisHash: hash, ledgerTable })).toEqual([]);
    }
  });

  it("refuses an unknown field at the top and inside a setting (strict objects)", () => {
    expect(PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, extra: 1 }).success).toBe(false);
    expect(PRIVATE_CORE_SCHEMA.safeParse({ ...REQUIRED_PRIVATE, extra: 1 }).success).toBe(false);
    expect(PUBLIC_CORE_SCHEMA.safeParse({ ...REQUIRED_PUBLIC, tls: { certificate: "c", key: "k", trustedRoots: [], x: 1 } }).success).toBe(false);
    expect(PRIVATE_CORE_SCHEMA.safeParse({ ...REQUIRED_PRIVATE, tls: { certificate: "c", key: "k", trustedRoots: [], x: 1 } }).success).toBe(false);
  });
});

describe("CF-3: byte values are 0x-prefixed lowercase hex strings", () => {
  it("bytes: an even number of lowercase digits after 0x", () => {
    const bytes = hexBytes();
    expect(["0x", "0x00", "0xab01"].map((v) => bytes.safeParse(v).success)).toEqual([true, true, true]);
    expect(["", "00", "0x0", "0xAB", "0Xab", "0xg0", " 0x00"].map((v) => bytes.safeParse(v).success)).toEqual(
      Array(7).fill(false),
    );
    expect(HEX_BYTES.test("0xab")).toBe(true);
  });

  it("a hash: 32 bytes, 64 lowercase digits after 0x", () => {
    const hash = hashHex();
    expect(hash.safeParse(`0x${"0f".repeat(32)}`).success).toBe(true);
    expect([`0x${"0f".repeat(31)}`, `0x${"0f".repeat(33)}`, `0x${"0F".repeat(32)}`].map((v) => hash.safeParse(v).success)).toEqual(
      [false, false, false],
    );
    expect(HASH_HEX.test(`0x${"ab".repeat(32)}`)).toBe(true);
  });

  it("the core version: { umbradb, ledgers }, each package's sha256 a hash", () => {
    expect(CORE_VERSION_SCHEMA.safeParse(buildCoreVersion()).success).toBe(true);
    const version = (sha256: string, rest: Record<string, unknown> = {}) => ({
      umbradb: "0.9.4",
      ledgers: [{ ledger: "v9", versionName: "ledger-9", packages: [{ name: "p", version: "9.0.0", sha256 }] }],
      ...rest,
    });
    expect(CORE_VERSION_SCHEMA.safeParse(version(`0x${"ab".repeat(32)}`)).success).toBe(true);
    expect(CORE_VERSION_SCHEMA.safeParse(version("0xab")).success).toBe(false);
    expect(CORE_VERSION_SCHEMA.safeParse(version(`0x${"ab".repeat(32)}`, { umbradb: "0.9" })).success).toBe(false);
    expect(CORE_VERSION_SCHEMA.safeParse(version(`0x${"ab".repeat(32)}`, { extra: 1 })).success).toBe(false);
  });
});

/** `T` with every property and array read-only, at every depth (the builders' types are read-only; zod's are not). */
type DeepReadonly<T> = T extends readonly (infer E)[]
  ? readonly DeepReadonly<E>[]
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

/** The fields one side's type declares `never`, to refuse the other side's. */
type PrivateOnly = "instanceId" | "publicDatabase" | "coreTransport";
type PublicOnly = "node" | "lockstepInstances" | "transportReader";

describe("CF-2, CF-4: the builders' types and the schemas say the same", () => {
  it("a public process's CoreSettings is the public schema's input", () => {
    expectTypeOf<DeepReadonly<z.input<typeof PUBLIC_CORE_SCHEMA>>>().toEqualTypeOf<
      DeepReadonly<Omit<PublicCoreSettings, PrivateOnly>>
    >();
  });

  it("a private process's CoreSettings is the private schema's input", () => {
    expectTypeOf<DeepReadonly<z.input<typeof PRIVATE_CORE_SCHEMA>>>().toEqualTypeOf<
      DeepReadonly<Omit<PrivateCoreSettings, PublicOnly>>
    >();
  });

  it("each side's never fields are exactly the other side's own fields", () => {
    type PublicKeys = keyof z.input<typeof PUBLIC_CORE_SCHEMA>;
    type PrivateKeys = keyof z.input<typeof PRIVATE_CORE_SCHEMA>;
    expectTypeOf<Exclude<PrivateKeys, PublicKeys>>().toEqualTypeOf<PrivateOnly>();
    expectTypeOf<Exclude<PublicKeys, PrivateKeys>>().toEqualTypeOf<PublicOnly>();
  });
});
