/**
 * The configuration's builders and types. A process's configuration is one flat list of entries, one per revision of
 * the core or of a module. Each entry is `{ id, start, stop?, version, config }`, with heights as numbers, since the
 * file is plain data. [CF-1, CF-2, CF-4; CORE-ARCH §4.12; design §7, §12]
 *
 * The configuration file default-exports `defineConfig({ entries: [ … ] })`. It writes each entry with a builder that
 * fills the entry's identity and version from the build, so neither can be mistyped [Q43, Q44]:
 *
 * - {@link coreEntry}: fills the id `core` and the build's core version (`./build.ts`); its `config` is typed as the
 *   core settings table [CF-4];
 * - a module's `entry`, which `defineModule` gives every declaration (`../modules/declaration.ts`, built here by
 *   {@link moduleEntryBuilder}): fills the id and version from the declaration; its `config` is typed by the module's
 *   settings schema (`z.input` of its `configSchema`, so fields with defaults may be left out) [CF-2];
 * - {@link versionEntry}: for a revision whose version this build does not carry. That is either an earlier revision,
 *   already in the history, with the `config` recorded for it, or a later one being scheduled, without a `config`
 *   [CF-3].
 *
 * The builders return plain data. They copy the given fields into a new entry, leave out each of the entry's own
 * fields that is absent or `undefined` (which is not plain data), and pass the `config` object itself through. They
 * check nothing else: types are gone at run time, so the loader checks the plain data (`./load.ts`) and startup
 * validates every entry (`./validate.ts`). That is why a property a builder does not know, given without types, is
 * passed through to be rejected there, while the identity and version always come from the build. [CF-1]
 */

import type { DatabasePartsInput, TransportReader } from "./database-parts.js";
import type { z } from "zod";
import type { ModuleDeclaration } from "../modules/declaration.js";
import { buildCoreVersion, type CoreVersion, type LedgerName } from "./build.js";
import type { PlainObject } from "./plain-data.js";

/** The id of the core's own entries. No module may have it (`../modules/validation.ts`). [CF-2, MD-2] */
export const CORE_ENTRY_ID = "core";

/** A network the core knows, or `custom` (then `genesisHash` is required, `./core-settings.ts`). */
export type Network = "mainnet" | "preprod" | "preview" | "stagenet" | "custom";

/** A row of the ledger version table: `spec_version` from `specVersionMin` to `specVersionMax` → `ledger`. [LG-1] */
export type LedgerTableRow = {
  readonly specVersionMin: number;
  readonly specVersionMax: number;
  readonly ledger: LedgerName;
};

/** A pin of the ledger version table: the first block of a runtime, its hash and its `MNSV` version. [LG-2] */
export type LedgerPin = { readonly height: number; readonly hash: string; readonly specVersion: number };

/** The `core` entry's `ledgerTable`: rows and pins added to, or replacing, the built-in table. [LG-1, LG-2, LG-3] */
export type LedgerTable = { readonly rows?: readonly LedgerTableRow[]; readonly pins?: readonly LedgerPin[] };

/** Where each ledger version's packages come from; `vendored` when absent. [LG-5] */
export type LedgerSources = { readonly [ledger in LedgerName]?: "vendored" | "released" };

/** The process's listeners, each a `host:port` address. [RN-15, AE-1, PP-3] */
export type Listen = { readonly api?: string; readonly admin?: string; readonly transport?: string };

/** Opt-in mutual TLS: this process's certificate and key, and the roots it trusts, as PEM text. [PP-11] */
export type TlsSettings = {
  readonly certificate: string;
  readonly key: string;
  readonly trustedRoots: readonly string[];
};

/**
 * The `core` entry's fields that every process has. Each field's kind, default and validation come from the schemas
 * (`./core-settings.ts`); `test/config/core-settings.test.ts` checks that their input types equal these. [CF-4]
 */
export type CoreSettingsBase = {
  readonly network: Network;
  readonly genesisHash?: string;
  readonly ledgerTable?: LedgerTable;
  readonly ledgerSources?: LedgerSources;
  readonly sweep?: "on" | "off";
  readonly retainStates?: number;
  /** The database's parts, never a connection string. [CF-4, Q167] */
  readonly database: DatabasePartsInput;
  readonly listen?: Listen;
  readonly tipCap?: number;
  readonly prefetchWindow?: number;
  readonly backoffCeilingMs?: number;
  /** A file path. [BK-1] */
  readonly backupAtStop?: string;
  /** A file path: SIGUSR2 writes a backup there at the loop's next pause. [BK-1, Q152 B] */
  readonly backupOnSignal?: string;
  readonly tls?: TlsSettings;
  readonly livenessTimeoutMs?: number;
  /** A whole number from 1 to 2,147,483,647 (`./core-settings.ts`). [DB-15] */
  readonly apiReadTimeoutMs?: number;
  readonly slowBlockMs?: number;
  readonly followingThreshold?: number;
  readonly readinessLag?: number;
  /** The durability probe's override, passed to `openPostgres`. [DB-12] */
  readonly fullPageWritesOffAllowed?: boolean;
  readonly developmentOptIn?: boolean;
};

/** The public (core) process's `core` entry: `node` and `lockstepInstances`, none of a private one's fields. [CF-4] */
export type PublicCoreSettings = CoreSettingsBase & {
  /** The node's WebSocket URL. */
  readonly node: string;
  /** Instance ids. */
  readonly lockstepInstances?: readonly string[];
  /** The login the transport reads with; required with a PostgreSQL database and `listen.transport`. [Q175 A] */
  readonly transportReader?: TransportReader;
  readonly instanceId?: never;
  readonly publicDatabase?: never;
  readonly coreTransport?: never;
};

/** A private process's `core` entry: instead of `node` and `lockstepInstances`, its own three fields. [CF-4] */
export type PrivateCoreSettings = CoreSettingsBase & {
  readonly instanceId: string;
  /** The public database's parts: a login that may only read. [CF-4, Q167] */
  readonly publicDatabase?: DatabasePartsInput;
  /** The core's transport address. */
  readonly coreTransport?: string;
  readonly node?: never;
  readonly lockstepInstances?: never;
  readonly transportReader?: never;
};

/** The `core` entry's `config`. [CF-4] */
export type CoreSettings = PublicCoreSettings | PrivateCoreSettings;

/** Any entry's `config`, as the configuration holds it. */
export type EntryConfig = { readonly [field: string]: unknown };

/** An entry: one revision of the core or of a module. [CF-3; design §12] */
export type Entry = {
  /** `core`, or a module's id. */
  readonly id: string;
  readonly start: number;
  /** The last height this revision covers. */
  readonly stop?: number;
  /** A module's semver version, or for `core` the core version. */
  readonly version: string | CoreVersion;
  /** Required, except for a scheduled `versionEntry`. [CF-3] */
  readonly config?: EntryConfig;
};

/** A process's configuration: the configuration file's default export. [design §12] */
export type UmbraConfig = { readonly entries: readonly Entry[] };

/** The heights every builder takes. */
export type EntryHeights = { readonly start: number; readonly stop?: number };

/** What {@link coreEntry} takes. */
export type CoreEntryInput = EntryHeights & { readonly config: CoreSettings };

/** A `core` entry, as {@link coreEntry} returns it. */
export type CoreEntry = EntryHeights & {
  readonly id: typeof CORE_ENTRY_ID;
  readonly version: CoreVersion;
  readonly config: CoreSettings;
};

/** A module's settings as a configuration writes them: the input of its settings schema (defaults may be left out). */
export type ModuleSettings<D extends ModuleDeclaration> = z.input<D["configSchema"]>;

/** What a module's `entry` builder takes. */
export type ModuleEntryInput<D extends ModuleDeclaration> = EntryHeights & { readonly config: ModuleSettings<D> };

/** A module's entry, as its `entry` builder returns it. */
export type ModuleEntry<D extends ModuleDeclaration> = EntryHeights & {
  readonly id: D["id"];
  readonly version: string;
  readonly config: ModuleSettings<D>;
};

/** A module's `entry` builder: fills the id and the version from the declaration. [CF-2] */
export type EntryBuilder<D extends ModuleDeclaration> = (entry: ModuleEntryInput<D>) => ModuleEntry<D>;

/** The version a `versionEntry` names: the core version for `core`, a semver version for a module. */
export type VersionOf<I extends string> = I extends typeof CORE_ENTRY_ID ? CoreVersion : string;

/** What {@link versionEntry} takes. */
export type VersionEntryInput<I extends string> = EntryHeights & {
  readonly id: I;
  readonly version: VersionOf<I>;
  /** The data recorded for an earlier revision; absent for a scheduled one. Typed loosely, as plain data. [CF-3] */
  readonly config?: PlainObject;
};

/** A revision whose version this build does not carry, as {@link versionEntry} returns it. */
export type VersionEntry<I extends string> = EntryHeights & {
  readonly id: I;
  readonly version: VersionOf<I>;
  readonly config?: PlainObject;
};

/** The configuration a file default-exports: returns `config` itself. [CF-1] */
export function defineConfig(config: UmbraConfig): UmbraConfig {
  return config;
}

/**
 * Builds a new entry. It starts with whatever `given` holds besides the builder's own fields, so that startup rejects
 * what a builder does not know (`./validate.ts`). Then come `id`, `start`, `stop`, `version` and `config`, each left
 * out when it is `undefined`: an absent `stop`, a scheduled revision's `config`, or a field missing from a call made
 * without types (which startup then reports as missing). The id and the version are the builder's, whatever `given`
 * says.
 */
function entryOf(id: unknown, version: unknown, given: object): Record<string, unknown> {
  const { id: _id, start, stop, version: _version, config, ...rest } = given as Record<string, unknown>;
  const own = Object.entries({ id, start, stop, version, config }).filter(([, value]) => value !== undefined);
  return { ...rest, ...Object.fromEntries(own) };
}

/** The `core` entry of one revision of the core: fills the id `core` and the build's core version. [CF-2] */
export function coreEntry(entry: CoreEntryInput): CoreEntry {
  return entryOf(CORE_ENTRY_ID, buildCoreVersion(), entry) as CoreEntry;
}

/**
 * An entry for a revision whose version this build does not carry. It is either an earlier revision already in the
 * history, with its recorded `config` (compared with the record), or a later one being scheduled, without a `config`
 * (only its id, start, stop and version are recorded). For `core`, `version` is a core version. [CF-2, CF-3]
 */
export function versionEntry<const I extends string>(entry: VersionEntryInput<I>): VersionEntry<I> {
  return entryOf(entry.id, entry.version, entry) as VersionEntry<I>;
}

/**
 * The `entry` builder of `declaration`, which `defineModule` adds to it. Each entry's id and version are the
 * declaration's, read when the entry is built. [CF-2]
 */
export function moduleEntryBuilder<D extends ModuleDeclaration>(declaration: D): EntryBuilder<D> {
  return (entry) => entryOf(declaration.id, declaration.version, entry) as ModuleEntry<D>;
}
