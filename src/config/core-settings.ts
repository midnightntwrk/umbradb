/**
 * The `core` entry's settings schemas (`openspec/changes/core-arch/specs/configuration/spec.md` CF-3, CF-4; `design.md`
 * §7; CORE-ARCH §4.12): CF-4's table as two zod 4 object schemas — {@link PUBLIC_CORE_SCHEMA} for the public (core)
 * process, whose entry has the node's URL and the lockstep list, and {@link PRIVATE_CORE_SCHEMA} for a private process,
 * whose entry has instead its instance id, the public database and the core's transport. Each
 * field carries its kind (`data`, `operational` or `secret`) on its outermost schema, read as
 * `schema.shape[field].meta().kind` like a module's settings (design §7), and its default, applied to an absent field.
 * The validation (`./validate.ts`) parses a `core` revision of this build with the schema of the process's side.
 *
 * The builders' types (`CoreSettings`, `./entries.ts`) are written by hand, so that a public entry declares a private
 * one's fields `never` (and the reverse) and the compiler's messages name the fields as written;
 * `test/config/core-settings.test.ts` holds them equal to these schemas' input types, so the two cannot drift apart.
 *
 * Choices CF-4 leaves open (task 4.2): `genesisHash` is a data field, required with `network: "custom"` and refused
 * with the four known networks, whose genesis hashes are built in; hashes are 32 bytes; `ledgerSources` names each of
 * the ledger versions (four since task 12.2a's `v9-rc3`), `vendored` unless given; `listen.admin` defaults to
 * `0.0.0.0:8081` also when `listen` is given without it; addresses are `host:port` (a host name, an IPv4 address or a
 * bracketed IPv6 address; the port from 0 to 65535); the integers are the plain data's (0 to 2^53 − 1), and
 * `apiReadTimeoutMs` is from 1 to {@link MAX_READ_TIMEOUT_MS}, the read option's bounds (DB-15). Every nested object is
 * strict: a field it does not have is refused, not dropped.
 *
 * **`ledgerTable`** (LG-1 to LG-3, task 12.2): its default is the network's built-in table (`../ledger/networks.json`),
 * and a configured table adds to or replaces parts of it (`../ledger/version-table.ts`). Both schemas check LG-1 and
 * LG-2's rules on a configured table — `spec_version`s are `u32`s, a row's bounds the smaller first, its ledger one this
 * build carries, no `spec_version` in two configured rows, one pin a height, each pin's version covered by a row — and
 * that a `custom` network sets its own rows, each finding with its path inside `ledgerTable`; then they give the table
 * in effect as the parsed `ledgerTable` (`.overwrite`, which keeps the object schema, so `shape` and the kinds still
 * read as above), so that the history records the table a revision ran with (CF-7: every default applied).
 */

import { z } from "zod";
import { MAX_READ_TIMEOUT_MS } from "../db/read-options.js";
import { ledgerTableIssuesOf, ledgerTableOf } from "../ledger/networks.js";
import type { ConfiguredLedgerTable } from "../ledger/version-table.js";
import { SEMVER } from "../modules/validation.js";

/** Which process a configuration is for: the public (core) process, or a private one (CF-4, PP). */
export type ProcessSide = "public" | "private";

/** Byte values (CF-3): `0x`, then two lowercase hex digits a byte. */
export const HEX_BYTES = /^0x(?:[0-9a-f]{2})*$/;

/** A 32-byte hash, as a byte value: `0x` and 64 lowercase hex digits. */
export const HASH_HEX = /^0x[0-9a-f]{64}$/;

/** The admin listener's default address (AE-1). */
export const DEFAULT_ADMIN_ADDRESS = "0.0.0.0:8081";

/** A byte value (CF-3), for the `core` entry and for any module that takes bytes. */
export const hexBytes = () =>
  z.string().regex(HEX_BYTES, { error: "expected bytes as 0x-prefixed lowercase hex, two digits a byte (CF-3)" });

/** A 32-byte hash as a byte value (CF-3). */
export const hashHex = () =>
  z.string().regex(HASH_HEX, { error: "expected a 32-byte hash as 0x-prefixed lowercase hex, 64 digits (CF-3)" });

const DATA = { kind: "data" } as const;
const OPERATIONAL = { kind: "operational" } as const;
const SECRET = { kind: "secret" } as const;

/** A height, count, duration or size: an integer from 0 (plain data's integers, CF-1). */
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
  z.string().refine(isAddress, { error: "expected an address host:port, its port from 0 to 65535 (CF-4)" });

/** A PostgreSQL URL, `pglite:<directory>` or `pglite:memory` (CF-4; the backends are DB-1's). */
const DATABASE = /^(?:postgres(?:ql)?:\/\/\S+|pglite:\S.*)$/;

const database = () =>
  z.string().regex(DATABASE, {
    error: "expected a PostgreSQL URL (postgres:// or postgresql://), pglite:<directory> or pglite:memory (CF-4)",
  });

/** The node's WebSocket URL (CF-4, IN). */
const NODE = /^wss?:\/\/\S+$/;

/** A ledger version (LG-1; `../config/build.ts`'s `LedgerName`, with `v9-rc3`, task 12.2a). */
const LEDGER = z.enum(["v8", "v9-rc3", "v9", "v10"]);

/** Where a ledger version's packages come from (LG-5). */
const SOURCE = z.enum(["vendored", "released"]).default("vendored");

/** The fields every process's `core` entry has, in CF-4's order. */
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
  database: database().meta(SECRET),
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

/** CF-4: `genesisHash` is required with the network `custom`, and only then. */
function genesisHashRule(settings: { network: string; genesisHash?: string | undefined }, context: z.RefinementCtx) {
  if (settings.network === "custom" && settings.genesisHash === undefined) {
    context.addIssue({
      code: "custom",
      path: ["genesisHash"],
      message: "a custom network needs genesisHash, its genesis block's hash as 0x-prefixed lowercase hex (CF-4)",
    });
  }
  if (settings.network !== "custom" && settings.genesisHash !== undefined) {
    context.addIssue({
      code: "custom",
      path: ["genesisHash"],
      message:
        "genesisHash is given only with network custom: the genesis hashes of mainnet, preprod, preview and stagenet " +
        "are built in (CF-4)",
    });
  }
}

/** The `core` settings `ledgerTable` reads: the network, and the table as configured. */
type LedgerTableSettings = { network: string; ledgerTable?: ConfiguredLedgerTable | undefined };

/** LG-1 to LG-3's rules on a configured `ledgerTable`, for its network (`../ledger/version-table.ts`). */
function ledgerTableRule(settings: LedgerTableSettings, context: z.RefinementCtx) {
  for (const issue of ledgerTableIssuesOf(settings.network, settings.ledgerTable)) {
    context.addIssue({ code: "custom", path: ["ledgerTable", ...issue.path], message: issue.message });
  }
}

/** The settings with the table in effect as `ledgerTable`: the configured one over the network's built-in one (LG-3). */
function withLedgerTable<S extends LedgerTableSettings>(settings: S): S {
  return { ...settings, ledgerTable: ledgerTableOf(settings.network, settings.ledgerTable) };
}

/** The public (core) process's `core` entry (CF-4): the node's URL and the lockstep list. */
export const PUBLIC_CORE_SCHEMA = z
  .strictObject({
    ...BASE,
    node: z.string().regex(NODE, { error: "expected the node's WebSocket URL, ws:// or wss:// (CF-4)" }).meta(SECRET),
    lockstepInstances: z.array(text()).default([]).meta(OPERATIONAL),
  })
  .superRefine(genesisHashRule)
  .superRefine(ledgerTableRule)
  .overwrite(withLedgerTable);

/** A private process's `core` entry (CF-4): instead of the node and the lockstep list, its own three fields. */
export const PRIVATE_CORE_SCHEMA = z
  .strictObject({
    ...BASE,
    instanceId: text().meta(OPERATIONAL),
    publicDatabase: database().optional().meta(SECRET),
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
 * The core version (CF-2; `./build.ts`'s `CoreVersion`): the UmbraDB version and, per ledger version, its release name
 * and packages, each package's `sha256` a 32-byte hash as a byte value. A `core` entry's `version` must have this shape.
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
