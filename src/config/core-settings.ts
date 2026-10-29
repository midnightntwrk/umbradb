/**
 * The `core` entry's settings schemas: the core settings table as two zod 4 object schemas.
 * {@link PUBLIC_CORE_SCHEMA} is for the public (core) process, whose entry has the node's URL and the lockstep list.
 * {@link PRIVATE_CORE_SCHEMA} is for a private process, whose entry has instead its instance id, the public database
 * and the core's transport. [CF-3, CF-4; CORE-ARCH §4.12; design §7]
 *
 * Each field carries its kind (`data`, `operational` or `secret`) on its outermost schema, read as
 * `schema.shape[field].meta().kind` like a module's settings, and its default, applied to an absent field. The
 * validation (`./validate.ts`) parses a `core` revision of this build with the schema of the process's side.
 * [CF-4; design §7]
 *
 * The builders' types (`CoreSettings`, `./entries.ts`) are written by hand, so that a public entry declares a private
 * one's fields `never` (and the reverse) and the compiler's messages name the fields as written.
 * `test/config/core-settings.test.ts` checks that they equal these schemas' input types, so the two cannot drift apart.
 *
 * **`database`**: the database's parts, never a connection string ({@link databaseSetting}, also used for a private
 * process's `publicDatabase`). It is operational, with its `password` part secret. A public process's
 * `transportReader` is required with a PostgreSQL database and `listen.transport`, and rejected with PGlite
 * (`transportReaderRule`). [CF-4, Q167 A, Q175 A, Q182 B]
 *
 * Choices the core settings table leaves open [CF-4]:
 * - `genesisHash` is a data field, required with `network: "custom"` and rejected with the four known networks, whose
 *   genesis hashes are built in;
 * - hashes are 32 bytes;
 * - `ledgerSources` names each of the four ledger versions, `vendored` unless given;
 * - `listen.admin` defaults to `0.0.0.0:8081`, also when `listen` is given without it;
 * - addresses are `host:port`: a host name, an IPv4 address or a bracketed IPv6 address, and a port from 0 to 65535;
 * - the integers are the plain data's (0 to 2^53 − 1), and `apiReadTimeoutMs` is from 1 to
 *   {@link MAX_READ_TIMEOUT_MS}, the read option's bounds [DB-15];
 * - every nested object is strict: a field it does not have is rejected, not dropped.
 *
 * **`ledgerTable`**: its default is the network's built-in table (`../ledger/networks.json`), and a configured table
 * adds to or replaces parts of it (`../ledger/version-table.ts`). Both schemas check the version table's rules on a
 * configured table, each finding with its path inside `ledgerTable` [LG-1, LG-2, LG-3]:
 * - `spec_version`s are `u32`s;
 * - a row's bounds come smaller first, and its ledger is one this build carries;
 * - no `spec_version` is in two configured rows;
 * - one pin per height, and each pin's version is covered by a row;
 * - a `custom` network sets its own rows.
 *
 * Then they give the table in effect as the parsed `ledgerTable` (`.overwrite`, which keeps the object schema, so
 * `shape` and the kinds still read as above). So the history records the table a revision ran with, with every
 * default applied. [LG-3, CF-7]
 */

import { z } from "zod";
import { MAX_READ_TIMEOUT_MS } from "../db/read-options.js";
import {
  type DatabaseParts,
  type DatabasePartsInput,
  DEFAULT_POSTGRES_PORT,
  defaultSsl,
  SSL_MODES,
  type SslMode,
} from "./database-parts.js";
import { ledgerTableIssuesOf, ledgerTableOf } from "../ledger/networks.js";
import type { ConfiguredLedgerTable } from "../ledger/version-table.js";
import { SEMVER } from "../modules/validation.js";

/** Which process a configuration is for: the public (core) process, or a private one. [CF-4] */
export type ProcessSide = "public" | "private";

/** Byte values: `0x`, then two lowercase hex digits a byte. [CF-3] */
export const HEX_BYTES = /^0x(?:[0-9a-f]{2})*$/;

/** A 32-byte hash, as a byte value: `0x` and 64 lowercase hex digits. */
export const HASH_HEX = /^0x[0-9a-f]{64}$/;

/** The admin listener's default address. [AE-1] */
export const DEFAULT_ADMIN_ADDRESS = "0.0.0.0:8081";

/** A byte value, for the `core` entry and for any module that takes bytes. [CF-3] */
export const hexBytes = () =>
  z.string().regex(HEX_BYTES, { error: "expected bytes as 0x-prefixed lowercase hex, two digits a byte" });

/** A 32-byte hash as a byte value. [CF-3] */
export const hashHex = () =>
  z.string().regex(HASH_HEX, { error: "expected a 32-byte hash as 0x-prefixed lowercase hex, 64 digits" });

const DATA = { kind: "data" } as const;
const OPERATIONAL = { kind: "operational" } as const;
const SECRET = { kind: "secret" } as const;

/** A height, count, duration or size: an integer from 0, as plain data's integers are. [CF-1] */
const count = () => z.number().int().min(0);

/** Text that is not empty. */
const text = () => z.string().min(1);

/** `host:port`: a host name or IPv4 address without spaces, or a bracketed IPv6 address; then the port. */
const ADDRESS = /^(?:\[[0-9A-Fa-f:.]+\]|[^\s:/[\]@]+):(\d{1,5})$/;

/** True for an address `host:port` whose port is from 0 to 65535. */
function isAddress(value: string): boolean {
  const match = ADDRESS.exec(value);
  return match !== null && Number(match[1]) <= 65_535;
}

const address = () =>
  z.string().refine(isAddress, { error: "expected an address host:port, its port from 0 to 65535" });

/** A port: 1 to 65535. */
const port = () => z.number().int().min(1).max(65_535);

/** PostgreSQL's parts: once parsed, `ssl` is filled with its default for the host. [CF-4, Q167 A, Q182 B] */
const POSTGRES_PARTS = z
  .strictObject({
    kind: z.literal("postgres"),
    host: text(),
    port: port().default(DEFAULT_POSTGRES_PORT),
    user: text(),
    password: z.string().optional(),
    name: text(),
    ssl: z.enum(SSL_MODES as [SslMode, ...SslMode[]]).optional(),
  })
  .overwrite((parts) => ({ ...parts, ssl: parts.ssl ?? defaultSsl(parts.host) }));

/** PGlite's parts: exactly one of `path` and `memory: true`. */
const PGLITE_PARTS = z
  .strictObject({ kind: z.literal("pglite"), path: text().optional(), memory: z.literal(true).optional() })
  .superRefine((parts, context) => {
    if ((parts.path === undefined) === (parts.memory === undefined)) {
      context.addIssue({
        code: "custom",
        message: 'a PGlite database is { kind: "pglite", path } or { kind: "pglite", memory: true }, one of the two',
      });
    }
  });

/** The rejection of a connection string: the message never repeats the value, which may hold a password. [Q167 A] */
const CONNECTION_STRING =
  'a connection string is refused: give the database\'s parts, { kind: "postgres", host, port, user, password, name, ' +
  'ssl }, { kind: "pglite", path } or { kind: "pglite", memory: true }';

/**
 * The `database` setting, and a private process's `publicDatabase`: the database's parts (`./database-parts.ts`),
 * never a connection string. It is typed by hand as the parts' union, so that the builders' types and these schemas'
 * input types stay equal (`test/config/core-settings.test.ts`). (zod infers PGlite's two forms as one object with both
 * parts optional; its refinement takes exactly one.) [CF-4, Q167 A]
 */
export const databaseSetting = (): z.ZodType<DatabaseParts, DatabasePartsInput> =>
  z.discriminatedUnion("kind", [POSTGRES_PARTS, PGLITE_PARTS], {
    error: (issue) => (typeof issue.input === "string" ? CONNECTION_STRING : undefined),
  }) as unknown as z.ZodType<DatabaseParts, DatabasePartsInput>;

/** `core.transportReader`: a login; its other parts are `database`'s. [CF-4, Q175 A] */
const transportReader = () => z.strictObject({ user: text(), password: z.string().optional() });

/** The node's WebSocket URL. [CF-4] */
const NODE = /^wss?:\/\/\S+$/;

/** A ledger version: `../config/build.ts`'s `LedgerName`, including `v9-rc3`. [LG-1] */
const LEDGER = z.enum(["v8", "v9-rc3", "v9", "v10"]);

/** Where a ledger version's packages come from. [LG-5] */
const SOURCE = z.enum(["vendored", "released"]).default("vendored");

/** The fields every process's `core` entry has, in the core settings table's order. [CF-4] */
const BASE = {
  network: z.enum(["mainnet", "preprod", "preview", "stagenet", "custom"]).meta(DATA),
  genesisHash: hashHex().optional().meta(DATA),
  ledgerTable: z
    .strictObject({
      rows: z
        .array(z.strictObject({ specVersionMin: count(), specVersionMax: count(), ledger: LEDGER }))
        .optional(),
      pins: z.array(z.strictObject({ height: count(), hash: hashHex(), specVersion: count() })).optional(),
    })
    .optional()
    .meta(DATA),
  ledgerSources: z.strictObject({ v8: SOURCE, "v9-rc3": SOURCE, v9: SOURCE, v10: SOURCE }).prefault({}).meta(DATA),
  sweep: z.enum(["on", "off"]).default("on").meta(DATA),
  retainStates: count().default(0).meta(DATA),
  // Operational, its `password` part secret: `./redact.ts` hides a `password` part of an operational field.
  // [CF-4, Q167 A]
  database: databaseSetting().meta(OPERATIONAL),
  listen: z
    .strictObject({
      api: address().optional(),
      admin: address().default(DEFAULT_ADMIN_ADDRESS),
      transport: address().optional(),
    })
    .prefault({})
    .meta(OPERATIONAL),
  tipCap: count().default(600).meta(OPERATIONAL),
  prefetchWindow: count().default(64).meta(OPERATIONAL),
  backoffCeilingMs: count().default(30_000).meta(OPERATIONAL),
  backupAtStop: text().optional().meta(OPERATIONAL),
  // SIGUSR2 writes a backup there at the loop's next pause. [BK-1, Q152 B]
  backupOnSignal: text().optional().meta(OPERATIONAL),
  tls: z
    .strictObject({ certificate: text(), key: text(), trustedRoots: z.array(text()) })
    .optional()
    .meta(SECRET),
  livenessTimeoutMs: count().default(30_000).meta(OPERATIONAL),
  apiReadTimeoutMs: z.number().int().min(1).max(MAX_READ_TIMEOUT_MS).default(30_000).meta(OPERATIONAL),
  slowBlockMs: count().default(60_000).meta(OPERATIONAL),
  followingThreshold: count().default(3).meta(OPERATIONAL),
  readinessLag: count().optional().meta(OPERATIONAL),
  fullPageWritesOffAllowed: z.boolean().default(false).meta(OPERATIONAL),
  developmentOptIn: z.boolean().default(false).meta(OPERATIONAL),
};

/** `genesisHash` is required with the network `custom`, and only then. [CF-4] */
function genesisHashRule(settings: { network: string; genesisHash?: string | undefined }, context: z.RefinementCtx) {
  if (settings.network === "custom" && settings.genesisHash === undefined) {
    context.addIssue({
      code: "custom",
      path: ["genesisHash"],
      message: "a custom network needs genesisHash, its genesis block's hash as 0x-prefixed lowercase hex",
    });
  }
  if (settings.network !== "custom" && settings.genesisHash !== undefined) {
    context.addIssue({
      code: "custom",
      path: ["genesisHash"],
      message:
        "genesisHash is given only with network custom: the genesis hashes of mainnet, preprod, preview and stagenet " +
        "are built in",
    });
  }
}

/** The `core` settings `transportReader`'s rule reads. */
type TransportReaderSettings = {
  database: DatabaseParts;
  listen: { transport?: string | undefined };
  transportReader?: unknown;
};

/**
 * `transportReader` is required where the database is PostgreSQL and `listen.transport` is set, since the transport's
 * reads run as that login. It is rejected on PGlite, whose database has one session, the writer's. [CF-4, Q175 A]
 */
function transportReaderRule(settings: TransportReaderSettings, context: z.RefinementCtx) {
  const given = settings.transportReader !== undefined;
  if (settings.database.kind === "postgres" && settings.listen.transport !== undefined && !given) {
    context.addIssue({
      code: "custom",
      path: ["transportReader"],
      message:
        "a PostgreSQL database with listen.transport needs transportReader { user, password }, a login that may only " +
        "read, which the transport's reads run as",
    });
  }
  if (settings.database.kind === "pglite" && given) {
    context.addIssue({
      code: "custom",
      path: ["transportReader"],
      message:
        "transportReader is refused on PGlite: its database has one session, the writer's, which the transport's reads " +
        "share",
    });
  }
}

/** The `core` settings `ledgerTable` reads: the network, and the table as configured. */
type LedgerTableSettings = { network: string; ledgerTable?: ConfiguredLedgerTable | undefined };

/**
 * The version table's rules on a configured `ledgerTable`, for its network (`../ledger/version-table.ts`).
 * [LG-1, LG-2, LG-3]
 */
function ledgerTableRule(settings: LedgerTableSettings, context: z.RefinementCtx) {
  for (const issue of ledgerTableIssuesOf(settings.network, settings.ledgerTable)) {
    context.addIssue({ code: "custom", path: ["ledgerTable", ...issue.path], message: issue.message });
  }
}

/**
 * The settings with the table in effect as `ledgerTable`: the configured one over the network's built-in one. [LG-3]
 */
function withLedgerTable<S extends LedgerTableSettings>(settings: S): S {
  return { ...settings, ledgerTable: ledgerTableOf(settings.network, settings.ledgerTable) };
}

/** The public (core) process's `core` entry: the node's URL and the lockstep list. [CF-4] */
export const PUBLIC_CORE_SCHEMA = z
  .strictObject({
    ...BASE,
    node: z.string().regex(NODE, { error: "expected the node's WebSocket URL, ws:// or wss://" }).meta(SECRET),
    lockstepInstances: z.array(text()).default([]).meta(OPERATIONAL),
    transportReader: transportReader().optional().meta(OPERATIONAL),
  })
  .superRefine(genesisHashRule)
  .superRefine(transportReaderRule)
  .superRefine(ledgerTableRule)
  .overwrite(withLedgerTable);

/** A private process's `core` entry: instead of the node and the lockstep list, its own three fields. [CF-4] */
export const PRIVATE_CORE_SCHEMA = z
  .strictObject({
    ...BASE,
    instanceId: text().meta(OPERATIONAL),
    publicDatabase: databaseSetting().optional().meta(OPERATIONAL),
    coreTransport: address().optional().meta(OPERATIONAL),
  })
  .superRefine(genesisHashRule)
  .superRefine(ledgerTableRule)
  .overwrite(withLedgerTable);

/** The `core` entry's schema for a process of `side`. */
export function coreSettingsSchema(side: ProcessSide): typeof PUBLIC_CORE_SCHEMA | typeof PRIVATE_CORE_SCHEMA {
  return side === "public" ? PUBLIC_CORE_SCHEMA : PRIVATE_CORE_SCHEMA;
}

/** A semver 2.0.0 version, by the grammar a module declaration's version is checked with (`../modules/validation.ts`). */
const SEMVER_TEXT = z.string().regex(SEMVER, { error: 'expected a semver version such as "1.0.0"' });

/**
 * The core version (`./build.ts`'s `CoreVersion`): the UmbraDB version and, per ledger version, its release name and
 * packages, each package's `sha256` a 32-byte hash as a byte value. A `core` entry's `version` must have this shape.
 * [CF-2]
 */
export const CORE_VERSION_SCHEMA = z.strictObject({
  umbradb: SEMVER_TEXT,
  ledgers: z.array(
    z.strictObject({
      ledger: LEDGER,
      versionName: text(),
      packages: z.array(z.strictObject({ name: text(), version: SEMVER_TEXT, sha256: hashHex() })),
    }),
  ),
});
