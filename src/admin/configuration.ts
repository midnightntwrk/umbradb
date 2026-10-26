/**
 * What `/config` shows (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-5, AE-6; `specs/configuration/
 * spec.md` CF-3–CF-7; CORE-ARCH §4.18; decision records Q70, Q102): {@link configOf} builds the configuration part of
 * the snapshot the runner publishes (`./types.ts`, `ConfigSnapshot`), on the main thread, from what startup knows —
 * so the admin worker never holds a secret or reads the database:
 * - **the process's `core` revision** (Q102: its operational and secret fields are the process's) and **the entries in
 *   effect**, every revision of the configuration as validated, each one's settings through `shownSettings`
 *   (`./redaction.ts`): a `secret` field or one of unknown kind `[redacted]`, every other string's URL credentials
 *   redacted, a `versionEntry`'s fields all redacted until the history found it equal to its recorded row (4.2's note
 *   (d)); once startup read the cursor, each one placed against it (`started`, `scheduled`);
 * - **the configuration history** as startup read it from `core_chain.config` (CF-7): data fields only, their URL
 *   credentials redacted;
 * - **the parts of the database with their declarations** without callbacks ({@link declarationView});
 * - **the chain identity** (CD-1): the network, the genesis hash (configured, then the chain's), S and the anchor hash
 *   once block S committed;
 * - **the ledger version table in effect** — the process revision's `ledgerTable`, the built-in table with the
 *   configuration's rows and pins (LG-3) — **with the build's package identities** (`buildCoreVersion().ledgers`);
 * - **the database**: its backend, the server's version, and whether the process holds its writer lock (the caller's:
 *   the process knows it from its writer's start and its failures);
 * - **the build**: UmbraDB's version, and its commit — null, as no build records it yet.
 * Before the configuration is validated nothing of it is shown ({@link UNVALIDATED_CONFIG}): its secrets are not known.
 */

import { UMBRADB_VERSION, buildCoreVersion } from "../config/build.js";
import { databaseTarget } from "../config/database.js";
import type { HistoryRow } from "../config/history.js";
import { type PlainData, type PlainObject } from "../config/plain-data.js";
import type { Redactor } from "../config/redact.js";
import { type CheckedConfig, type CheckedEntry, fieldKinds, type PlacedEntry } from "../config/validate.js";
import type { ChainIdentity } from "../backbone/core-chain/core-chain.js";
import { migrationChecksum } from "../db/roles.js";
import { type ModuleDeclaration, POINTS } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { shownSettings } from "./redaction.js";
import { jsonReady } from "./snapshot.js";
import type { ConfigSnapshot, DeclarationView, EntryView, RecordedView } from "./types.js";

/** Bytes as `0x`-prefixed lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

/** The build, as `/config` shows it. */
const BUILD = Object.freeze({ umbradb: UMBRADB_VERSION, commit: null });

/** `/config` before the configuration is validated: the build only. */
export const UNVALIDATED_CONFIG: ConfigSnapshot = Object.freeze({
  core: null,
  entries: null,
  history: null,
  modules: null,
  chain: null,
  ledger: null,
  database: null,
  build: BUILD,
});

/** What startup knows once the database is open and its history checked (`ProcessAdmin.opened`). */
export interface OpenedConfig {
  /** The configuration's revisions placed against the cursor (the history check's). */
  readonly entries: readonly PlacedEntry[];
  /** `core_chain.config` as startup read it. */
  readonly history: readonly HistoryRow[];
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  /** Every part of the database, in startup order. */
  readonly modules: readonly ModuleDeclaration[];
  /** The chain's genesis hash, as startup's check found it. */
  readonly genesisHash: Uint8Array;
  /** `core_chain.identity` as last read; null before it has a row. */
  readonly identity: ChainIdentity | null;
  /** The server's version (`server_version`); null until read. */
  readonly databaseVersion: string | null;
}

/** What {@link configOf} builds `/config` from. */
export interface ConfigFacts {
  /** The configuration's redaction. */
  readonly redactor: Redactor;
  readonly checked: CheckedConfig;
  /** The process's `core` revision (Q102). */
  readonly core: CheckedEntry;
  /** Null until the database is open. */
  readonly opened: OpenedConfig | null;
}

/** `declaration` without its callbacks (see {@link DeclarationView}); `origin` the list it came from. */
export function declarationView(declaration: ModuleDeclaration, origin: DeclarationView["origin"]): DeclarationView {
  return Object.freeze({
    id: declaration.id,
    version: declaration.version,
    side: declaration.side,
    origin,
    requires: Object.freeze([...declaration.requires]),
    provides: Object.freeze(
      declaration.provides.map((item) =>
        Object.freeze({
          name: item.name,
          lifetimes: Object.freeze([...item.lifetimes]),
          table:
            item.table === undefined
              ? null
              : Object.freeze({
                  schema: item.table.schema,
                  tables: Object.freeze([...item.table.tables]),
                  kind: item.table.kind,
                  deterministic: item.table.deterministic !== false,
                }),
        }),
      ),
    ),
    startsMidChain: declaration.startsMidChain,
    developmentOnly: declaration.developmentOnly === true,
    requiresResync: declaration.requiresResync === true,
    needsLockstep: declaration.needsLockstep === true,
    keyKinds: declaration.keyKinds === undefined ? null : Object.freeze([...declaration.keyKinds]),
    settings: fieldKinds(declaration.configSchema),
    migrations: Object.freeze(declaration.migrations.map(({ id, sql }) => Object.freeze({ id, checksum: migrationChecksum(sql) }))),
    points: Object.freeze(POINTS.filter((point) => typeof declaration.points[point] === "function")),
  });
}

/** One revision as `/config` shows it; `placed` once startup placed it against the cursor. */
function entryView(redactor: Redactor, entry: CheckedEntry, placed: PlacedEntry | undefined): EntryView {
  // A started revision passed the history check: it equals its recorded row (CF-6), so a `versionEntry` shows as data.
  const recorded = placed?.started === true;
  return Object.freeze({
    id: entry.id,
    start: entry.start,
    stop: entry.stop,
    version: jsonReady(entry.version),
    buildVersion: entry.buildVersion,
    started: placed === undefined ? null : placed.started,
    scheduled: placed === undefined ? null : placed.scheduled,
    settings: shownSettings(redactor, entry, recorded),
  });
}

/** One recorded row as `/config` shows it: its data as data, URL credentials redacted. */
function recordedView(redactor: Redactor, row: HistoryRow): RecordedView {
  return Object.freeze({
    id: row.id,
    start: row.start.toString(),
    stop: row.stop === null ? null : row.stop.toString(),
    version: row.version,
    data: row.data === null ? null : shownSettings(redactor, { settings: row.data, kinds: null }, true),
    dataHash: row.dataHash === null ? null : hex(row.dataHash),
  });
}

/** The list `id` comes from in `declarations`. */
function originOf(declarations: DeclarationSet<ModuleDeclaration>, id: string): DeclarationView["origin"] {
  if (declarations.backbone.some((part) => part.id === id)) return "backbone";
  return declarations.core.some((part) => part.id === id) ? "core" : "user";
}

/** `/config` from `facts` (see the module comment), `writerLock` the process's own knowledge of its lock. */
export function configOf(facts: ConfigFacts, writerLock: boolean): ConfigSnapshot {
  const { redactor, checked, core, opened } = facts;
  const settings = core.settings as PlainObject;
  const placed = opened === null ? undefined : opened.entries;
  const configured = typeof settings.genesisHash === "string" ? settings.genesisHash : null;
  const genesisHash = opened === null ? configured : hex(opened.genesisHash);
  const anchorHash = opened?.identity?.anchorHash ?? null;
  return Object.freeze({
    core: Object.freeze({ start: core.start, settings: shownSettings(redactor, core) }),
    entries: Object.freeze(checked.entries.map((entry) => entryView(redactor, entry, placed?.find((each) => each.index === entry.index)))),
    history: opened === null ? null : Object.freeze(opened.history.map((row) => recordedView(redactor, row))),
    modules:
      opened === null
        ? null
        : Object.freeze(opened.modules.map((part) => declarationView(part, originOf(opened.declarations, part.id)))),
    chain: Object.freeze({
      network: String(settings.network),
      genesisHash,
      start: String(checked.start),
      anchorHash: anchorHash === null ? null : hex(anchorHash),
    }),
    ledger: Object.freeze({ table: jsonReady(settings.ledgerTable), packages: jsonReady(buildCoreVersion().ledgers) as PlainData }),
    database: Object.freeze({
      backend: databaseTarget(String(settings.database)).backend,
      version: opened?.databaseVersion ?? null,
      writerLock,
    }),
    build: BUILD,
  });
}
