/**
 * The private backbone part `core-private-source`. A private process takes its heights from the public database, never
 * from the node, and keeps its own cursor, bound to that one public database.
 * [PP-1, PP-2, PP-3, PP-5; CORE-ARCH §4.11, §4.14; design §8, §10]
 *
 * **The tables** and every statement are in `./sql.ts`.
 *
 * **The binding** is checked in the part's `on-start-db`, which runs before any private module migrates (the fixed
 * startup order). The public database's identity is read ({@link readPublicIdentity}). On the first start it is
 * recorded in the row. On every start, the row's genesis hash and S must be the public database's, and the private S
 * (the earliest start of the private configuration's `core` entries) must not be below the public S. Otherwise startup
 * refuses with `private-binding-mismatch` ({@link bindingRefusal}) and leaves the database unchanged. A public database
 * whose core has never started has no identity to bind to, so that is refused too ({@link publicNotStarted}), first at
 * the source's startup check, before any migration. [PP-2, RN-3, Q95, Q125]
 *
 * **`core-chain` on a private process** is unchanged. A private process never talks to the node, so its startup check
 * of the chain is done by its source ({@link PrivateBlockSource.checkChain}) before any migration, instead of
 * `core-chain`'s checks against a node:
 * - The public database's identity is read; a public database whose core never started is refused
 *   ({@link publicNotStarted}).
 * - Its genesis hash is compared with the configured network's: `configuredGenesisOf` of the process's `core` revision,
 *   which is the built-in table's hash for a known network, or `genesisHash` for `custom`. A difference is refused with
 *   `private-binding-mismatch`, `details.reason` `network` ({@link networkRefusal}). [PP-1, IN-3, Q136 B]
 * - The public genesis hash is handed to `core-chain`. On a new private database, `core-chain` records it with the
 *   private S in the private database's `core_chain.identity`, along with the anchor at block S. It publishes `config`,
 *   `db` and `ledger-table`, but no node client, since the private `core` entry has no `node`.
 * - The comparisons with the recorded binding follow, before the graph is resolved (the startup read of the private
 *   cursor reads the binding from the same row), and again in the part's `on-start-db`, which records it. So a private
 *   database of the configured network that is bound to another public database is refused by them (`genesis`,
 *   `start`), never by the graph reading the wrong public database's items. [PP-2]
 * - Last, the check gives the graph the public core's `table` items with their heights (`readPublicItems`, in
 *   `./sql.ts`, read with the identity), which a private module may require. [PP-13, Q126 B]
 * The bootstrap's wait then waits, with the condition `waiting-for-node`, for the public cursor to reach the private S.
 * [IN-2]
 *
 * **Block intake** is the finalized loop (`src/runner/loop.ts`) running over this part's block source
 * ({@link PrivateBlockSource}):
 * - its cursor is the private cursor;
 * - its finalized head is the public cursor, read in a consistent read of the public database;
 * - its block at h is the public block at h;
 * - it waits for the public cursor to pass a height by reading the cursor each time it is woken: by the core's
 *   `committed` messages and every connection or reconnection of its transport, or, without a transport, by a poll
 *   (`./public-database.ts`). So it never depends on receiving every message.
 * At a start and after every wake-up, the loop processes every height from the private cursor + 1 up to the public
 * cursor, in order: `on-finalized` once per new public head, and each height's `on-fetch` with a read of public data
 * ({@link PrivateBlockSource.fetchRead}). Each block's transaction moves the private cursor in this part's
 * `on-db-write`, the first of the parts that write in the fixed backbone order, so the loop's check before the `COMMIT`
 * finds it at the block. An independent instance lags as much as it needs: nothing here makes the core wait.
 * [PP-3, PP-5, RN-3]
 *
 * **How it is made**: one {@link privateIntake} per private process start gives the part and the block source the
 * process runs with (`ProcessInput.source`), which share its public database. The part's binding reads that database at
 * startup, after the runner has made the source from the process's `core` revision and before the loop runs. [Q102]
 *
 * **Its position on the transport**: every `hello` of the transport carries the private cursor (first the one startup
 * read, the source's first {@link PrivateBlockSource.cursor}, then each block the part's `on-after-db-write` sees
 * committed), or, before the first commit, S − 1 with no hash. The transport connects during startup's chain check,
 * after startup has read the cursor; that is where the instance learns whether it is lockstep. [PP-4]
 *
 * **Lockstep.** With `coreTransport`, startup's chain check waits for the transport's `hello-ack`, after the public
 * database's own checks. It refuses a core of another network than the configured one (`private-binding-mismatch`,
 * `network`): with a PostgreSQL `publicDatabase` read directly, nothing else checks the core at `coreTransport`.
 * The ack says whether the core lists the instance in `lockstepInstances`. [PP-6, Q136 B, Q142]
 *
 * After the graph is resolved, a module declaring `needsLockstep` refuses to run on an instance that is not lockstep or
 * has no `coreTransport` at all ({@link needsLockstepRefusal}, `needs-lockstep-not-listed`, before any migration).
 * [PP-6]
 *
 * An instance that is lockstep at startup, or listed by a later `hello-ack`, takes height h only while the public
 * cursor is h. Its block at h is read where the public cursor is h. Each `on-fetch` read of public data begins at h
 * and, after the callback's data, reads the public cursor again, because through the core each statement is its own
 * read. A cursor past h halts the instance with `lockstep-behind` ({@link lockstepBehind}). [PP-6, PP-7, Q142]
 *
 * Each block the part's `on-after-db-write` sees committed is reported to the core (`report`, sent only to a core that
 * lists the instance), which waits for it before its next `BEGIN`. If the core refuses a report
 * (`report-hash-mismatch`), the transport's waits and reads fail, which halts the instance. [PP-6]
 *
 * **A changed public configuration.** Startup's chain check reads the public configuration history with the identity
 * ({@link readPublicConfiguration}): the items, and the configuration hash the core computes from the same rows with
 * the same function. [PP-14, Q147]
 * - With `coreTransport`, the transport does the check. It records the first `hello-ack`'s `configHash`, and a later
 *   message carrying another one refuses it for good with `public-config-changed`. The source then fails its next read
 *   of public data with that refusal, even a read of a PostgreSQL public database read directly, so no other height is
 *   processed.
 * - Without `coreTransport`, the source's first read after the public database lost a connection
 *   ({@link PublicDatabase.reconnections}) reads the history again, inside that read and before its body. It fails with
 *   `public-config-changed` ({@link publicConfigChanged}) when the hash differs from the one read at startup.
 *
 * **The public configuration hash it accepted.** The part keeps the public configuration hash the private process last
 * accepted in its own table `core_private_source.accepted_config` (one row, `id = 1`: `config_hash`, 32 bytes;
 * migration `002`). The table is declared `deterministic: false` (item `accepted-config-hash`), so neither change
 * capture nor the digests nor the contents hash read its row. It records an operator's acceptance at a start, which
 * does not follow from the chain, and two private processes bound to one public database hold the same private data
 * whatever hashes each accepted along the way. [PP-14, Q159, Q75]
 *
 * Startup's read of the private cursor reads this hash too ({@link readAcceptedConfigHash}). The chain check, after the
 * binding checks and before the graph, compares it with the hashes this start found (the public history's, and with
 * `coreTransport` the first `hello-ack`'s) and with the operator's `updateHash` (`umbradb run --update-hash`;
 * {@link startHashDecision}):
 * - a first start records the hash it finds;
 * - the hash already accepted runs on;
 * - another hash stops the start with `public-config-changed`, naming it and `--update-hash=<hash>`, unless it is the
 *   hash given. A given hash is recorded by the part's `on-start-db`, in its transaction after the binding, once the
 *   full checks have passed (the binding checks in the chain check, the public item checks in the graph);
 * - two found hashes that differ stop the start whatever was given: either the core's configuration changed during the
 *   start, or `coreTransport` and `publicDatabase` do not belong to the same core.
 * [PP-2, PP-13, PP-14, Q149, Q159]
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { HelloAck } from "../../private/messages.js";
import type { ChainCheck, ChainCheckInput, ConfiguredGenesis } from "../core-chain/core-chain.js";
import type { CheckedEntry } from "../../config/validate.js";
import type { ReadHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import type { ModuleDeclaration, Revision } from "../../modules/declaration.js";
import type { PublicItem } from "../../modules/graph.js";
import type { BlockRef, BlockSource } from "../../runner/block-source.js";
import { publicConfigChanged } from "../../private/private-transport.js";
import {
  openPublicSide,
  type PublicDatabase,
  type PublicIdentity,
  type PublicWakes,
  readPublicConfigHash,
  readPublicConfiguration,
  readPublicCursor,
  readPublicIdentity,
} from "./public-database.js";
import {
  CORE_PRIVATE_SOURCE_MIGRATIONS,
  insertBinding,
  movePrivateCursor,
  privateCursorHeight,
  readAcceptedConfigHash,
  readPrivateRow,
  readPublicBlock,
  recordedBinding,
  writeAcceptedConfigHash,
} from "./sql.js";

export { publicConfigChanged };

/** A byte string as `0x`-prefixed lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** Whether two byte strings are equal. */
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => Buffer.from(a).equals(Buffer.from(b));

/** The rule a private database's binding is held to, for the refusals' messages. [PP-2] */
const RULE =
  "a private database belongs to the one public database it was first started against: point publicDatabase " +
  "at that public database, or give the private process a new database";

/**
 * The refusal (`private-binding-mismatch`, `details.reason` `public-not-started`) of a private start against a public
 * database whose core has never started: it has no chain identity to bind to.
 */
export function publicNotStarted(): UmbraError {
  return new UmbraError(
    "private-binding-mismatch",
    "the public database has no chain identity (core_chain.identity): its core has never started, so a private " +
      "database cannot be bound to it; start the core on it first",
    { reason: "public-not-started" },
  );
}

/**
 * The check of the configured network: the refusal (`private-binding-mismatch`, `details.reason` `network`, not
 * retried) of a public database whose identity `current` has a different genesis hash than the configured network's.
 * `configured` is `configuredGenesisOf` of the process's `core` revision, and the hashes are compared whole. A known
 * network whose built-in table records no genesis hash is refused too, since nothing can be checked against it; the
 * core refuses it the same way. Null when the hashes are equal. [PP-2, Q117, Q136 B]
 */
export function networkRefusal(
  configured: ConfiguredGenesis,
  current: PublicIdentity,
  of: "public-database" | "transport" = "public-database",
): UmbraError | null {
  const publicHash = hex(current.genesisHash);
  if (configured.hash === null) {
    return new UmbraError(
      "private-binding-mismatch",
      `this build records no genesis hash for the network ${configured.network}, so the public database's genesis ` +
        `hash ${publicHash} cannot be checked against it: a private process of a known network starts only with a ` +
        "build whose built-in table records its genesis hash",
      { reason: "network", network: configured.network, configured: null, public: publicHash },
    );
  }
  if (sameBytes(configured.hash, current.genesisHash)) return null;
  const found =
    of === "transport"
      ? `the core at coreTransport has genesis hash ${publicHash}: it indexes another network than its public database's`
      : `the public database's genesis hash is ${publicHash}: its core indexes another network`;
  return new UmbraError(
    "private-binding-mismatch",
    `the private process is configured for the network ${configured.network}, whose genesis hash is ` +
      `${hex(configured.hash)}, and ${found}; point publicDatabase or coreTransport at a ` +
      `public database of ${configured.network} and its core, or configure the network its public database is of`,
    { reason: "network", network: configured.network, configured: hex(configured.hash), public: publicHash },
  );
}

/**
 * The binding check: the refusal (`private-binding-mismatch`, not retried) of a private database that recorded
 * `recorded` (null on its first start), against the public database whose identity is `current`, for a private process
 * whose S is `privateStart`. Null when it may start. [PP-2]
 */
export function bindingRefusal(
  recorded: PublicIdentity | null,
  current: PublicIdentity,
  privateStart: bigint,
): UmbraError | null {
  const genesis = hex(current.genesisHash);
  if (recorded !== null && !sameBytes(recorded.genesisHash, current.genesisHash)) {
    return new UmbraError(
      "private-binding-mismatch",
      `the private database is bound to the public database of genesis hash ${hex(recorded.genesisHash)}, and this ` +
        `public database's genesis hash is ${genesis}: ${RULE}`,
      { reason: "genesis", recorded: hex(recorded.genesisHash), public: genesis },
    );
  }
  if (recorded !== null && recorded.start !== current.start) {
    return new UmbraError(
      "private-binding-mismatch",
      `the private database is bound to a public database whose start height S is ${recorded.start}, and this public ` +
        `database's S is ${current.start}: ${RULE}`,
      { reason: "start", recorded: recorded.start.toString(), public: current.start.toString() },
    );
  }
  if (privateStart < current.start) {
    return new UmbraError(
      "private-binding-mismatch",
      `the private process starts at ${privateStart}, below the public database's start height S ${current.start}, ` +
        "where it has no public block to take: start the private process's core entry at or above it",
      { reason: "private-start-below", private: privateStart.toString(), public: current.start.toString() },
    );
  }
  return null;
}

/**
 * A {@link PrivateBlockSource}'s transport to the core (`src/private/private-transport.ts`'s `PrivateTransport`): its
 * `hello-ack`, its reports and its lockstep flag; closed with the public database.
 */
export interface SourceTransport {
  /** The `hello-ack` that connects it (startup's chain check waits for it). */
  connection(): Promise<HelloAck>;
  /** Tells the core that `block` committed, when the instance is lockstep. [PP-6] */
  report(block: BlockRef): void;
  /** Whether the last `hello-ack` said the core lists the instance. */
  readonly lockstep: boolean;
  /**
   * Why the core's transport is refused for good (`public-config-changed`, `report-hash-mismatch`), or null. Once it
   * is, the source reads no more public data, so no other height is processed. Absent for a transport that has none.
   * [PP-14]
   */
  readonly refusal?: UmbraError | null;
  close(): Promise<void>;
}

/** A byte string from `0x` hex. */
const bytesOfHex = (text: string): Uint8Array => new Uint8Array(Buffer.from(text.slice(2), "hex"));

/** `names` in a sentence: `a`, `a and b`, `a, b and c`. */
const listed = (names: readonly string[]): string =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1) as string}`;

/**
 * The refusal (`needs-lockstep-not-listed`, not retried) of the `modules` that declare `needsLockstep`, on an instance
 * that is not lockstep: the core's `hello-ack` said `lockstep: false` (`transport`), or the instance has no
 * `coreTransport`, so no core can hold it in lockstep. Null when no module declares it, or the instance is lockstep.
 * [PP-6]
 */
export function needsLockstepRefusal(modules: readonly ModuleDeclaration[], lockstep: boolean, transport: boolean): UmbraError | null {
  const needing = modules.filter((declaration) => declaration.needsLockstep === true).map((declaration) => declaration.id);
  if (needing.length === 0 || lockstep) return null;
  const which = needing.length === 1 ? `the module ${listed(needing)} declares` : `the modules ${listed(needing)} declare`;
  const why = transport
    ? "the core at coreTransport answered lockstep: false — list this instance's instanceId in the core's " +
      "lockstepInstances, or run the module on an instance it lists"
    : "this private process has no coreTransport, so no core can hold it in lockstep — give it the core's " +
      "listen.transport as coreTransport and list its instanceId in the core's lockstepInstances";
  return new UmbraError(
    "needs-lockstep-not-listed",
    `${which} needsLockstep: it reads mutable public tables, which only a lockstep instance reads at the height it ` +
      `processes; ${why}`,
    { modules: needing, transport },
  );
}

/**
 * The halt (`lockstep-behind`, not retried) of a lockstep instance processing `height` while the public cursor is
 * `cursor`, past it. The mutable public state at `height` is gone: the core listed the instance late, or does not wait
 * for it. [PP-6, PP-7]
 */
export function lockstepBehind(height: bigint, cursor: bigint | null): UmbraError {
  return new UmbraError(
    "lockstep-behind",
    `the public cursor is ${cursor}, past height ${height}: a lockstep instance processes a height only while the public ` +
      "cursor is that height, and the mutable public state of the heights it missed is gone; give it a new " +
      "private database whose start is above the public cursor, or remove it from the core's lockstepInstances",
    { height: height.toString(), cursor: cursor === null ? null : cursor.toString() },
  );
}

/** The public configuration hashes a private start compares, each as `0x` hex. [PP-14, Q159] */
export interface StartHashes {
  /** The hash the private database accepted when it last ran; null on its first start. */
  readonly recorded: string | null;
  /** The hash of the public configuration history this start read; null when the public database has none. */
  readonly history: string | null;
  /** The `configHash` of the core's `hello-ack` this start waited for; null without `coreTransport`. */
  readonly core: string | null;
  /**
   * The hash the operator accepts for this start (`umbradb run --update-hash`, `startProcess`'s `updateHash`), or
   * null.
   */
  readonly given: string | null;
}

/** What a private start does with the hashes it compared ({@link startHashDecision}). */
export interface StartHashDecision {
  /** Why the start stops (`public-config-changed`), or null. */
  readonly refusal: UmbraError | null;
  /** The hash the part's `on-start-db` records, after the full checks; null when the recorded one stays. */
  readonly record: string | null;
  /**
   * Why: `first-start` (nothing recorded yet: the hash found is recorded), `unchanged` (the hash found is the one
   * recorded), `accepted` (another, given: recorded), `refused`, or `none` (no hash found, nothing compared).
   */
  readonly reason: "first-start" | "unchanged" | "accepted" | "refused" | "none";
}

/** Stops the start when the hash found is not the one accepted, or two found hashes differ. [PP-14, Q159] */
function startStop(hashes: StartHashes, found: string, moved: boolean): UmbraError {
  const accept = `--update-hash=${found}`;
  const given =
    hashes.given === null || hashes.given === found
      ? ""
      : ` The --update-hash given, ${hashes.given}, is not that hash, so nothing was accepted.`;
  const instead = hashes.recorded === null ? "" : `, in place of ${hashes.recorded}, the one it accepted`;
  const message = moved
    ? `the core at coreTransport sends the configuration hash ${hashes.core}, and the public configuration ` +
      `history this start read hashes to ${hashes.history}: the core's configuration changed during this ` +
      "start, or coreTransport and publicDatabase are not one core's, so the public table " +
      "items checked are not the core's. Start the private process again once both give one hash — with " +
      `${accept}, to accept the core's${instead}.${given}`
    : `the public core's configuration hash is ${found}, and this private process last ran on ` +
      `${hashes.recorded}, the one it accepted: the public configuration changed since, so the public ` +
      `table items its modules read may no longer be what it checked.${given} To accept ${found}, start it with ` +
      `${accept} (startProcess's updateHash): the start then runs its full checks of the public side and records ` +
      "the new hash";
  return new UmbraError("public-config-changed", message, {
    via: "startup",
    recorded: hashes.recorded,
    found,
    history: hashes.history,
    core: hashes.core,
    given: hashes.given,
  });
}

/**
 * The comparison of public configuration hashes at a private start. The hash found is the core's first `hello-ack`'s,
 * otherwise the public history's.
 * - Two found hashes that differ stop the start, whatever was given or recorded.
 * - A first start records the hash found.
 * - The recorded hash runs on.
 * - Another hash is recorded when it is the one given; otherwise it stops the start, naming the hash and
 *   `--update-hash` (`public-config-changed`, not retried).
 * [PP-14, Q159]
 */
export function startHashDecision(hashes: StartHashes): StartHashDecision {
  if (hashes.core !== null && hashes.history !== null && hashes.core !== hashes.history) {
    return { refusal: startStop(hashes, hashes.core, true), record: null, reason: "refused" };
  }
  const found = hashes.core ?? hashes.history;
  if (found === null) return { refusal: null, record: null, reason: "none" };
  if (hashes.recorded === null) return { refusal: null, record: found, reason: "first-start" };
  if (hashes.recorded === found) return { refusal: null, record: null, reason: "unchanged" };
  if (hashes.given === found) return { refusal: null, record: found, reason: "accepted" };
  return { refusal: startStop(hashes, found, false), record: null, reason: "refused" };
}

/** The checks a {@link PrivateBlockSource} runs at startup, each replaceable by a negative control. */
export interface PrivateChecks {
  /** The configured network's check; {@link networkRefusal} unless given. */
  readonly network?: typeof networkRefusal;
  /** The comparisons with the recorded binding; {@link bindingRefusal} unless given. [PP-2] */
  readonly binding?: typeof bindingRefusal;
  /**
   * The private S, for the `private-start-below` check. When not given (a source a test makes by hand), it is the
   * public S, so only the recorded binding is compared; the part's `on-start-db` compares the private S again. [PP-2]
   */
  readonly start?: bigint;
  /** The negative controls' view of the public items the graph is given; all of them, as read, unless given. [PP-13] */
  readonly publicItems?: (items: readonly PublicItem[]) => readonly PublicItem[];
  /**
   * Whether a lockstep instance reads the public cursor again after each `on-fetch` callback's data; true unless given.
   * `false` is for a negative control, which processes a cursor that moved in the meantime. [Q142]
   */
  readonly reread?: boolean;
  /**
   * Whether the public configuration hash is checked; `check` unless given. `ignore` is for a negative control, which
   * goes on after the public configuration changed. [PP-14]
   */
  readonly configHash?: "check" | "ignore";
  /**
   * The comparison of hashes at a start; {@link startHashDecision} unless given. The negative controls' versions never
   * compare the recorded hash, or accept any hash given. [PP-14]
   */
  readonly acceptance?: typeof startHashDecision;
}

/** What a {@link PrivateBlockSource} takes from its process besides its public side and checks. */
export interface PrivateSourceOptions {
  /** The public configuration hash the operator accepts for this start (`startProcess`'s `updateHash`). [PP-14] */
  readonly updateHash?: string | null;
  /** Where it logs the hash it records; nowhere unless given. */
  readonly log?: (line: string) => void;
}

/** The block source of a private process (see the module comment). */
export class PrivateBlockSource implements BlockSource {
  readonly #public: PublicDatabase;
  readonly #wakes: PublicWakes;
  readonly #transport: SourceTransport | null;
  readonly #checks: PrivateChecks;
  /** Whether the `hello-ack` of startup's chain check said the core lists the instance. [PP-6] */
  #lockstepAtStart = false;
  /** Whether a startup chain check completed: from then on the source knows whether it is lockstep. */
  #checked = false;
  /** The private cursor last known committed: startup's read, then each block committed; undefined before startup's. */
  #position: BlockRef | null | undefined;
  /** The binding the private database recorded, as the last read of the cursor found it; null before any or without. */
  #recorded: PublicIdentity | null = null;
  /** The public configuration hash startup's chain check read; null before it, or before the table exists. [PP-14] */
  #publicConfigHash: string | null = null;
  /** The count of public database reconnections at the last configuration check. [PP-14] */
  #reconnections = 0;
  /** The public configuration hash the private database accepted, as last read or written. [PP-14, Q159] */
  #accepted: string | null = null;
  /**
   * Whether {@link cursor} reads it again: at first, and after the part's `on-start-db` wrote it (a retried startup
   * reads what the database holds).
   */
  #acceptedStale = true;
  /** The hash startup's chain check decided to record, for the part's `on-start-db`; null when none. */
  #pending: string | null = null;
  /** Why it is pending: a first start's, or accepted (`updateHash`). */
  #pendingReason: StartHashDecision["reason"] = "none";
  readonly #updateHash: string | null;
  readonly #log: (line: string) => void;

  constructor(
    publicDatabase: PublicDatabase,
    wakes: PublicWakes,
    transport: SourceTransport | null = null,
    checks: PrivateChecks = {},
    options: PrivateSourceOptions = {},
  ) {
    this.#public = publicDatabase;
    this.#wakes = wakes;
    this.#transport = transport;
    this.#checks = checks;
    this.#updateHash = options.updateHash ?? null;
    this.#log = options.log ?? (() => undefined);
  }

  /**
   * The private process's position for its transport's `hello`: the private cursor last known committed, or `start` − 1
   * with no hash before its first commit. [PP-4]
   */
  position(start: bigint): { readonly height: bigint; readonly hash: Uint8Array | null } {
    const known = this.#position ?? null;
    return known === null ? { height: start - 1n, hash: null } : { height: known.height, hash: known.hash };
  }

  /** A block committed (the part's `on-after-db-write`): the position from now on, reported to the core. [PP-6] */
  committed(block: BlockRef): void {
    this.#position = block;
    this.#transport?.report(block);
  }

  /**
   * Whether the instance is lockstep: its startup's `hello-ack` said so, or the last one did. The startup answer is
   * kept for the whole run, so a module that needs lockstep never runs unchecked. [PP-6]
   */
  get lockstep(): boolean {
    return this.#lockstepAtStart || this.#transport?.lockstep === true;
  }

  /**
   * Whether the instance is lockstep, as `/status` shows it (`public.lockstep`): {@link lockstep} once a startup chain
   * check completed (false without a transport), null before. [AE-5]
   */
  get lockstepShown(): boolean | null {
    return this.#checked ? this.lockstep : null;
  }

  /** The public database the source reads. */
  get publicDatabase(): PublicDatabase {
    return this.#public;
  }

  /** The public configuration hash startup's chain check read from the public database; null before. [PP-14] */
  get publicConfigHash(): string | null {
    return this.#publicConfigHash;
  }

  /**
   * The public configuration hash the part's `on-start-db` records: the one startup's chain check found, on a first
   * start or when the operator gave it. Null when the recorded one stays, and once it is recorded. [PP-14, Q159]
   */
  get pendingAcceptedHash(): string | null {
    return this.#pending;
  }

  /** The part's `on-start-db` recorded `hash` (see {@link pendingAcceptedHash}): logged, and read again at a retry. */
  acceptedRecorded(hash: string): void {
    const was = this.#accepted;
    this.#log(
      this.#pendingReason === "accepted"
        ? `public configuration hash ${hash} accepted (--update-hash) in place of ${was}: recorded after the full ` +
            "checks"
        : `public configuration hash ${hash} recorded: the private database's first start records the hash it ` +
            "finds",
    );
    this.#accepted = hash;
    this.#acceptedStale = true;
    this.#pending = null;
  }

  /**
   * One read of public data for the loop.
   * - Once the core's transport is refused for good, there is no read: the refusal is the read's failure, so no other
   *   height is processed.
   * - Without a transport, the first read after the public database lost a connection reads the public configuration
   *   history again, inside that read and before `body`. It fails with `public-config-changed` when the hash differs
   *   from the one startup read.
   * [PP-14]
   */
  #read<T>(body: (read: ReadHandle) => Promise<T>): Promise<T> {
    const refusal = this.#transport?.refusal ?? null;
    if (refusal !== null) return Promise.reject(refusal);
    return this.#public.read(async (read) => {
      if (this.#transport === null && this.#checks.configHash !== "ignore" && this.#checked) {
        const reconnections = this.#public.reconnections?.() ?? 0;
        if (reconnections !== this.#reconnections) {
          const found = await readPublicConfigHash(read);
          if (found !== this.#publicConfigHash) throw publicConfigChanged(this.#publicConfigHash, found, "public-database");
          this.#reconnections = reconnections;
        }
      }
      return body(read);
    });
  }

  /**
   * The private cursor, read through `read` (`readPrivateCursor`, in `./sql.ts`). The first read (startup's, of the
   * committed cursor) is also the position until a block commits; the loop's later reads are inside a block's
   * transaction. The binding the same row records is kept for {@link checkChain}, which startup runs after this read.
   */
  async cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    const { cursor, binding } = await readPrivateRow(read);
    this.#recorded = binding;
    if (this.#position === undefined) this.#position = cursor;
    // The hash it accepted, for the chain check: at startup, and once more after on-start-db wrote it. [PP-14, Q159]
    if (this.#acceptedStale) {
      this.#accepted = await readAcceptedConfigHash(read);
      this.#acceptedStale = false;
    }
    return cursor;
  }

  /**
   * The public cursor, in one read of the public database. Before the core's first commit, it is the height before the
   * public S, with 32 zero bytes for its hashes; the loop never processes it, because a private S is at least the
   * public S. [PP-2]
   */
  finalizedHead(): Promise<BlockRef> {
    return this.#read(async (read) => {
      const cursor = await readPublicCursor(read);
      if (cursor !== null) return cursor;
      const identity = await readPublicIdentity(read);
      if (identity === null) {
        throw new Error("the public database has no chain identity (core_chain.identity): its core has never started");
      }
      return Object.freeze({ height: identity.start - 1n, hash: new Uint8Array(32), parentHash: new Uint8Array(32) });
    });
  }

  /**
   * Resolves once the public cursor exceeds `above`: it reads the public cursor, and again at every wake-up after it
   * asked for the next one, so a wake-up between the read and the wait is not lost; rejects with `signal`'s reason once
   * it aborts.
   */
  async waitForHead(above: bigint, signal: AbortSignal): Promise<void> {
    for (;;) {
      signal.throwIfAborted();
      const wait = new AbortController();
      const abort = (): void => wait.abort(signal.reason);
      signal.addEventListener("abort", abort, { once: true });
      const woken = this.#wakes.next(wait.signal);
      woken.catch(() => undefined);
      try {
        if ((await this.finalizedHead()).height > above) return;
        await woken;
      } finally {
        signal.removeEventListener("abort", abort);
        wait.abort();
      }
    }
  }

  /**
   * The public block at `height`; throws when the public database has none there. On a lockstep instance it is read
   * where the public cursor is `height` (the read's height); otherwise the instance halts with `lockstep-behind`.
   * [PP-6]
   */
  async block(height: bigint): Promise<BlockRef> {
    const block = await this.#read(async (read) => {
      if (this.lockstep && read.height !== height) throw lockstepBehind(height, read.height);
      return readPublicBlock(read, height);
    });
    if (block === null) throw new Error(`the public database has no block at height ${height}`);
    return block;
  }

  /**
   * The chain check at the private process's startup, before any migration and before the graph. It replaces
   * `core-chain`'s checks against a node, since a private process never talks to the node. In order: [IN-3, PP-1, PP-2]
   * - The public database's chain identity is read; a public database whose core has never started is refused
   *   ({@link publicNotStarted}). [Q125]
   * - Its genesis hash is compared with the configured network's, `input.configured` ({@link networkRefusal}). [Q136 B]
   * - The binding found by the startup read of the private cursor is compared with it ({@link bindingRefusal}:
   *   `genesis`, `start`, `private-start-below`). The part's `on-start-db` compares again in its transaction.
   * - With `coreTransport`, the core's `hello-ack` is checked (its network) and its lockstep flag kept.
   * - The public configuration hash it accepted is compared with the hashes found ({@link startHashDecision}).
   *   [PP-14, Q159]
   *
   * Resolves with the genesis hash, which `core-chain` records with the private S on a new private database, and the
   * public core's `table` items with their heights, read with the identity (`readPublicItems`, in `./sql.ts`), which
   * the runner gives the graph. [PP-13]
   */
  async checkChain(input: Pick<ChainCheckInput, "configured">): Promise<ChainCheck> {
    const reconnections = this.#public.reconnections?.() ?? 0;
    const { identity, items, configHash } = await this.#public.read(async (read) => {
      const found = await readPublicIdentity(read);
      const configuration = found === null ? { items: [], configHash: null } : await readPublicConfiguration(read);
      return { identity: found, ...configuration };
    });
    if (identity === null) throw publicNotStarted();
    const network = (this.#checks.network ?? networkRefusal)(input.configured, identity);
    if (network !== null) throw network;
    const binding = (this.#checks.binding ?? bindingRefusal)(this.#recorded, identity, this.#checks.start ?? identity.start);
    if (binding !== null) throw binding;
    let coreHash: string | null = null;
    if (this.#transport !== null) {
      // The core the instance reports to: it must be of the configured network; the ack says whether it lists the
      // instance. [PP-6]
      const ack = await this.#transport.connection();
      const core = { genesisHash: bytesOfHex(ack.genesis), start: BigInt(ack.start) };
      const other = (this.#checks.network ?? networkRefusal)(input.configured, core, "transport");
      if (other !== null) throw other;
      this.#lockstepAtStart = ack.lockstep;
      coreHash = ack.configHash;
    }
    // The hash it accepted, compared with the hashes found, before the graph. [PP-14, Q159]
    const decision = (this.#checks.acceptance ?? startHashDecision)({
      recorded: this.#accepted,
      history: configHash,
      core: coreHash,
      given: this.#updateHash,
    });
    if (decision.refusal !== null) throw decision.refusal;
    this.#pending = decision.record;
    this.#pendingReason = decision.reason;
    if (this.#updateHash !== null && decision.reason !== "accepted") {
      this.#log(
        `--update-hash ${this.#updateHash} not used: ` +
          (decision.reason === "first-start"
            ? `the private database's first start records the hash it finds, ${decision.record}`
            : `the public configuration hash is ${coreHash ?? configHash}, the one this private process accepted`),
      );
    }
    // The public configuration as startup checked it; without a transport, it is read again at each reconnection.
    // [PP-14]
    this.#publicConfigHash = configHash;
    this.#reconnections = reconnections;
    this.#checked = true;
    const publicItems = Object.freeze([...(this.#checks.publicItems?.(items) ?? items)]);
    return Object.freeze({ genesisHash: identity.genesisHash, publicItems });
  }

  /**
   * The graph's modules at startup, after the chain check and before any migration (`BlockSource.checkModules`): a
   * module declaring `needsLockstep` refuses to run on an instance that is not lockstep ({@link needsLockstepRefusal}).
   * [PP-6]
   */
  checkModules(modules: readonly ModuleDeclaration[]): void {
    const refusal = needsLockstepRefusal(modules, this.#lockstepAtStart, this.#transport !== null);
    if (refusal !== null) throw refusal;
  }

  /** A read of the private database's committed height: the private cursor's ({@link privateCursorHeight}). [DB-2] */
  readonly committedHeight = privateCursorHeight;

  /**
   * One `on-fetch` callback's read of public data for `height`: a read of the public database at its cursor.
   * [PP-3, Q100]
   *
   * On a lockstep instance the read begins at `height`, and after the callback the public cursor is read again, because
   * through the core each statement is its own read. A cursor past `height` either time halts the instance with
   * `lockstep-behind`. [PP-6, Q142]
   */
  readonly fetchRead = <T>(body: (read: ReadHandle) => Promise<T>, height: bigint): Promise<T> =>
    this.#read(async (read) => {
      if (!this.lockstep) return body(read);
      if (read.height !== height) throw lockstepBehind(height, read.height);
      const result = await body(read);
      if (this.#checks.reread !== false) {
        const cursor = (await readPublicCursor(read))?.height ?? null;
        if (cursor !== height) throw lockstepBehind(height, cursor);
      }
      return result;
    });

  /** Closes the public database, then the transport to the core. */
  async close(): Promise<void> {
    try {
      await this.#public.close();
    } finally {
      await this.#transport?.close();
    }
  }
}

/**
 * A process's `public.lockstep` for `/status`: its source's {@link PrivateBlockSource.lockstepShown} on a private
 * process; null for any other source (the core's), or when there is none yet. [AE-5]
 */
export function publicLockstepOf(source: BlockSource | undefined): boolean | null {
  return source instanceof PrivateBlockSource ? source.lockstepShown : null;
}

/** Options of {@link privateIntake}. */
export interface PrivateIntakeOptions {
  /**
   * The public database, from the process's `core` revision: `openPublicSide`'s unless given — a PostgreSQL
   * `publicDatabase` read directly, else the core's transport (the tests' direct reads of a PGlite core's database).
   */
  readonly publicDatabase?: (core: CheckedEntry) => PublicDatabase;
  /** What wakes the wait for the public cursor: `openPublicSide`'s unless given — the transport's, else a poll. */
  readonly wakes?: (core: CheckedEntry) => PublicWakes;
  /** The negative controls' binding check; {@link bindingRefusal} unless given. */
  readonly binding?: typeof bindingRefusal;
  /** The negative controls' check of the configured network; {@link networkRefusal} unless given. [Q136 B] */
  readonly network?: typeof networkRefusal;
  /** The negative controls' view of the public items the graph is given; all of them, as read, unless given. [PP-13] */
  readonly publicItems?: (items: readonly PublicItem[]) => readonly PublicItem[];
  /** `false` makes a lockstep instance skip the second read of the public cursor (a negative control). [Q142] */
  readonly reread?: boolean;
  /** `ignore` makes the private process ignore the public configuration hash (a negative control). [PP-14] */
  readonly configHash?: "check" | "ignore";
  /** The negative controls' comparison at a start; {@link startHashDecision} unless given. [PP-14, Q159] */
  readonly acceptance?: typeof startHashDecision;
}

/** What the process shares with its private source: S, its log and the hash its operator accepts (`updateHash`). */
export interface PrivateShared {
  readonly start: bigint;
  readonly log: (line: string) => void;
  /** `startProcess`'s `updateHash` (`umbradb run --update-hash`); none unless given. [PP-14, Q159] */
  readonly updateHash?: string;
}

/** One private process start's `core-private-source`: the part and the block source it is bound to. */
export interface PrivateIntake {
  /** The backbone part `core-private-source` (see the module comment). */
  readonly part: ModuleDeclaration;
  /**
   * The process's block source, made from its `core` revision and what the process shares with it — S, its log and
   * the hash its operator accepts (`ProcessInput.source`; without them S is the revision's start, nothing is logged
   * and no hash is given): once, before the part's `on-start-db`, which reads its public database.
   */
  source(core: CheckedEntry, shared?: PrivateShared): PrivateBlockSource;
}

/** A private process start's `core-private-source` (see the module comment). */
export function privateIntake(options: PrivateIntakeOptions = {}): PrivateIntake {
  let made: PrivateBlockSource | undefined;
  const binding = options.binding ?? bindingRefusal;
  const part: ModuleDeclaration = {
    id: "core-private-source",
    version: UMBRADB_VERSION,
    side: "private",
    requires: [],
    provides: [
      {
        name: "private-cursor",
        lifetimes: ["table"],
        table: { schema: "core_private_source", tables: ["cursor"], kind: "mutable" },
      },
      {
        // The public configuration hash it accepted. It records an operator's acceptance at a start, which does not
        // follow from the chain, so it is left out of change capture, the digests and the contents hash.
        // [PP-14, Q159, Q76]
        name: "accepted-config-hash",
        lifetimes: ["table"],
        table: { schema: "core_private_source", tables: ["accepted_config"], kind: "mutable", deterministic: false },
      },
    ],
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis. [Q96]
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: CORE_PRIVATE_SOURCE_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-start-db"(p, w) {
        if (made === undefined) {
          throw new Error(
            "core-private-source's on-start-db ran before its block source was made: give the process the intake's " +
              "source (ProcessInput.source)",
          );
        }
        const current = await made.publicDatabase.read((read) => readPublicIdentity(read));
        if (current === null) throw publicNotStarted();
        const recorded = await recordedBinding(w);
        // A backbone part's revisions are the `core` entry's, in start order: the first one's start is S.
        const refusal = binding(recorded, current, (p.revisions[0] as Revision).start);
        if (refusal !== null) throw refusal;
        if (recorded === null) await insertBinding(w, current);
        // The hash startup's chain check accepted, recorded now that the full checks have passed. [PP-14, Q159]
        const accepted = made.pendingAcceptedHash;
        if (accepted !== null) {
          await writeAcceptedConfigHash(w, bytesOfHex(accepted));
          made.acceptedRecorded(accepted);
        }
      },
      async "on-db-write"(_p, b, w) {
        await movePrivateCursor(w, b);
      },
      async "on-after-db-write"(_p, b) {
        made?.committed({ height: b.height, hash: b.hash, parentHash: b.parentHash });
      },
    },
  };
  return Object.freeze({
    part,
    source(core: CheckedEntry, shared?: PrivateShared): PrivateBlockSource {
      const start = shared?.start ?? BigInt(core.start);
      const side = openPublicSide(
        core,
        {
          position: () => (made as PrivateBlockSource).position(start),
          log: shared?.log ?? (() => undefined),
          ...(options.configHash === undefined ? {} : { configHash: options.configHash }),
        },
        {
          ...(options.publicDatabase === undefined ? {} : { publicDatabase: options.publicDatabase(core) }),
          ...(options.wakes === undefined ? {} : { wakes: options.wakes(core) }),
        },
      );
      made = new PrivateBlockSource(side.publicDatabase, side.wakes, side.transport, {
        ...(options.network === undefined ? {} : { network: options.network }),
        ...(options.publicItems === undefined ? {} : { publicItems: options.publicItems }),
        ...(options.reread === undefined ? {} : { reread: options.reread }),
        ...(options.configHash === undefined ? {} : { configHash: options.configHash }),
        ...(options.acceptance === undefined ? {} : { acceptance: options.acceptance }),
        binding,
        start,
      }, { updateHash: shared?.updateHash ?? null, log: shared?.log ?? (() => undefined) });
      return made;
    },
  });
}
