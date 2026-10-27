/**
 * The private backbone part `core-private-source` (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-1,
 * PP-2, PP-3, PP-5; `design.md` §8, §10; CORE-ARCH §4.11, §4.14): a private process takes its heights from the public
 * database — never from the node — and keeps its own cursor, bound to that one public database.
 *
 * **Its table** (`design.md` §10), created by its migration under its own role: `core_private_source.cursor`, one row
 * (`id = 1`) — the private cursor, the public block the private process last committed (`height`, `hash` and
 * `parent_hash`, null before its first block; the parent hash, which design §10 did not list, is what the runner's
 * cursor and RN-11's re-delivery at it need of a block, decision record Q124), and the binding, the public database's
 * genesis hash and S (`public_genesis_hash`, `public_start_height`). It is a module table of the private plan like any
 * other: DT-6 checks it, its `CHECK`s and change capture are added, `core-digest` digests it and the contents hash
 * reads it (Q75).
 *
 * **The binding** (PP-2), in its `on-start-db` — which runs before any private module migrates (RN-3's startup order,
 * Q95): the public database's identity is read ({@link readPublicIdentity}); on the first start it is recorded in the
 * row, and on every start the row's genesis hash and S must be the public database's, and the private S — the earliest
 * start of the private configuration's `core` entries — must not be below the public S; otherwise startup refuses
 * with `private-binding-mismatch` ({@link bindingRefusal}), the database unchanged. A public database whose core has
 * never started has no identity to bind to: that refuses too ({@link publicNotStarted}, decision record Q125) — first
 * at the source's startup check, before any migration.
 *
 * **`core-chain` on a private process** (task 10.2's part, unchanged): a private process never talks to the node
 * (PP-1), so its startup check of the chain is its source's ({@link PrivateBlockSource.checkChain}, in place of
 * `core-chain`'s IN-3 checks against a node), before any migration: the public database's identity is read — a public
 * database whose core never started refused ({@link publicNotStarted}) —, its genesis hash compared with the
 * configured network's (`configuredGenesisOf` of the process's `core` revision: the built-in table's for a known
 * network, `genesisHash` for `custom`), a difference refused with `private-binding-mismatch`, `details.reason`
 * `network` (owner decision Q136 B, task 10.2b; {@link networkRefusal}), and the public genesis hash handed to
 * `core-chain`, which records it with the private S in the private database's `core_chain.identity` on a new private
 * database and the anchor at block S, and publishes `config`, `db` and `ledger-table` (no node client: the private
 * `core` entry has no `node`). PP-2's comparisons with the recorded binding follow it there, before the graph (task
 * 14.1a) — the startup read of the private cursor reads the binding from the same row — and again in the part's
 * `on-start-db`, which records it: so a private database of the configured network bound to another public database
 * is refused by them (`genesis`, `start`), never by the graph reading the wrong public database's items. Last, the
 * check gives the graph the public core's `table` items with their heights ({@link readPublicItems}, read with the
 * identity; PP-13, owner decision Q126 B), which a private module may require. The bootstrap's wait (IN-2) waits, with
 * the condition `waiting-for-node`, for the public cursor to reach the private S.
 *
 * **Block intake** (PP-3, PP-5) is the finalized loop's (`src/runner/loop.ts`) over this part's block source
 * ({@link PrivateBlockSource}): its cursor is the private cursor; its finalized head is the public cursor, read in a
 * consistent read of the public database; its block at h is the public block at h; it waits for the public cursor to
 * pass a height by reading it each time it is woken — by the core's `committed` messages and every (re)connection of
 * its transport (task 14.2), or, without a transport, a poll (`./public-database.ts`) —, so it never depends on receiving
 * every message. So, at a start and after every wake-up, the loop processes every height from the private cursor + 1 up to
 * the public cursor, in order, `on-finalized` once per new public head, and each height's `on-fetch` with a read of
 * public data ({@link PrivateBlockSource.fetchRead}). Each block's transaction moves the private cursor in this part's
 * `on-db-write`, the first among the parts that write (RN-3's fixed order), so the loop's check before the `COMMIT`
 * finds it at the block. An independent instance (PP-5) lags as it needs: nothing here makes the core wait.
 *
 * **Its making**: one {@link privateIntake} per private process start gives the part and the block source the process
 * runs with (`ProcessInput.source`), which share its public database — the part's binding reads it at startup, after
 * the runner made the source from the process's `core` revision (Q102) and before the loop runs.
 *
 * **Its position on the transport** (task 14.2): every `hello` of the transport gives the private cursor — the one
 * startup read (the source's first {@link PrivateBlockSource.cursor}), then each block the part's `on-after-db-write`
 * sees committed — or, before the first commit, S − 1 with no hash (PP-4). The transport connects at startup's chain
 * check, after startup read the cursor (task 14.3: the instance learns there whether it is lockstep).
 *
 * **Lockstep** (PP-6, PP-7, owner decision Q142; task 14.3). With `coreTransport`, startup's chain check waits for the
 * transport's `hello-ack` — after the public database's own checks — and refuses a core of another network than the
 * configured one (`private-binding-mismatch`, `network`: with a PostgreSQL `publicDatabase` read directly, the core at
 * `coreTransport` is checked nowhere else; owner decision Q136, task 10.2b's note); the ack says whether the core lists
 * the instance in `lockstepInstances`. After the graph is resolved, a module declaring `needsLockstep` refuses to run on
 * an instance that is not lockstep, or has no `coreTransport` at all ({@link needsLockstepRefusal},
 * `needs-lockstep-not-listed`, before any migration). An instance lockstep at startup, or listed by a later `hello-ack`,
 * takes height h only while the public cursor is h: its block at h is read where the public cursor is h, and each
 * `on-fetch` read of public data begins at h and — through the core each statement being its own read (Q142) — reads
 * the public cursor again after the callback's data; a cursor past h halts the instance with `lockstep-behind`
 * ({@link lockstepBehind}). Each block the part's `on-after-db-write` sees committed is reported to the core (`report`,
 * sent only to a core that lists the instance), which waits for it before its next `BEGIN`; the core's refusal of a
 * report (`report-hash-mismatch`) fails the transport's waits and reads, which halts the instance.
 *
 * **A changed public configuration** (PP-14, owner decision Q147; task 14.1b). Startup's chain check reads the public
 * configuration history with the identity ({@link readPublicConfiguration}: the items and the configuration hash, the
 * core's own by the same rows and function). With `coreTransport` the transport is the check: it records the first
 * `hello-ack`'s `configHash` and is refused for good, with `public-config-changed`, by a later message carrying
 * another; the source then fails its next read of public data with that refusal, even one of a PostgreSQL public
 * database read directly, so no other height is processed. Without `coreTransport`, the source's first read after the
 * public database lost a connection ({@link PublicDatabase.reconnections}) reads the history again, in that read and
 * before its body, and fails with `public-config-changed` ({@link publicConfigChanged}) when its hash is not startup's.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { HelloAck } from "../../private/messages.js";
import type { ChainCheck, ChainCheckInput, ConfiguredGenesis } from "../core-chain/core-chain.js";
import type { CheckedEntry } from "../../config/validate.js";
import type { ReadHandle, SchemaWriteHandle } from "../../db/api.js";
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
  readPublicBlock,
  readPublicConfigHash,
  readPublicConfiguration,
  readPublicCursor,
  readPublicIdentity,
} from "./public-database.js";

export { publicConfigChanged };

/** `core-private-source`'s migrations (DB-9): applied once, in order; never changed. */
export const CORE_PRIVATE_SOURCE_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE core_private_source.cursor (
  id smallint PRIMARY KEY CHECK (id = 1),
  height bigint,
  hash bytea,
  parent_hash bytea,
  public_genesis_hash bytea NOT NULL CHECK (octet_length(public_genesis_hash) = 32),
  public_start_height bigint NOT NULL,
  CHECK ((height IS NULL) = (hash IS NULL) AND (height IS NULL) = (parent_hash IS NULL))
)`,
  },
]);

const PRESENT_SQL = "SELECT to_regclass('core_private_source.cursor') IS NOT NULL AS present";
const CURSOR_SQL =
  "SELECT height, hash, parent_hash, public_genesis_hash, public_start_height FROM core_private_source.cursor WHERE id = 1";
const BINDING_SQL = "SELECT public_genesis_hash, public_start_height FROM core_private_source.cursor WHERE id = 1";
const BIND_SQL =
  "INSERT INTO core_private_source.cursor (id, public_genesis_hash, public_start_height) VALUES (1, $1, $2)";
const MOVE_SQL = "UPDATE core_private_source.cursor SET height = $1, hash = $2, parent_hash = $3 WHERE id = 1";

/**
 * The private cursor, read through `read` (a read handle, or the block's transaction): the public block the private
 * process last committed; null before its first block, and before the table exists (a database before its first
 * startup).
 */
export async function readPrivateCursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
  return (await readPrivateRow(read)).cursor;
}

/**
 * The private cursor ({@link readPrivateCursor}) and the binding the same row records — the public database's genesis
 * hash and S, null before the first start recorded them —, in one statement.
 */
async function readPrivateRow(
  read: Pick<ReadHandle, "query">,
): Promise<{ readonly cursor: BlockRef | null; readonly binding: PublicIdentity | null }> {
  const [table] = await read.query(PRESENT_SQL);
  if (table?.present !== true) return { cursor: null, binding: null };
  const [row] = await read.query(CURSOR_SQL);
  if (row === undefined) return { cursor: null, binding: null };
  const binding = Object.freeze({
    genesisHash: row.public_genesis_hash as Uint8Array,
    start: row.public_start_height as bigint,
  });
  if (row.height === null) return { cursor: null, binding };
  const cursor = Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
  return { cursor, binding };
}

/** A private database's committed height (DB-2): the private cursor's height. */
export const privateCursorHeight = async (read: Pick<ReadHandle, "query">): Promise<bigint | null> =>
  (await readPrivateCursor(read))?.height ?? null;

/** A byte string as `0x`-prefixed lowercase hex. */
const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** Whether two byte strings are equal. */
const sameBytes = (a: Uint8Array, b: Uint8Array): boolean => Buffer.from(a).equals(Buffer.from(b));

/** The rule a private database's binding is held to (PP-2), for the refusals' messages. */
const RULE =
  "a private database belongs to the one public database it was first started against (PP-2): point publicDatabase " +
  "at that public database, or give the private process a new database";

/**
 * The refusal (`private-binding-mismatch`, `details.reason` `public-not-started`) of a private start against a public
 * database whose core has never started: it has no chain identity to bind to.
 */
export function publicNotStarted(): UmbraError {
  return new UmbraError(
    "private-binding-mismatch",
    "the public database has no chain identity (core_chain.identity): its core has never started, so a private " +
      "database cannot be bound to it (PP-2); start the core on it first",
    { reason: "public-not-started" },
  );
}

/**
 * Q136 B's check (PP-2; task 10.2b): the refusal (`private-binding-mismatch`, `details.reason` `network`, not retried)
 * of a public database whose identity `current` has another genesis hash than the configured network's — `configured`,
 * `configuredGenesisOf` of the process's `core` revision —, compared whole; and of a known network whose built-in
 * table records no genesis hash, against which nothing can be checked (as the core refuses it, decision record Q117).
 * Null when the hashes are equal.
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
        "build whose built-in table records its genesis hash (PP-2, decision records Q117, Q136)",
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
      `${hex(configured.hash)}, and ${found} (PP-2, decision record Q136); point publicDatabase or coreTransport at a ` +
      `public database of ${configured.network} and its core, or configure the network its public database is of`,
    { reason: "network", network: configured.network, configured: hex(configured.hash), public: publicHash },
  );
}

/**
 * PP-2's binding check: the refusal (`private-binding-mismatch`, not retried) of a private database that recorded
 * `recorded` — null on its first start — against the public database whose identity is `current`, for a private
 * process whose S is `privateStart`; null when it may start.
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
        "where it has no public block to take (PP-2): start the private process's core entry at or above it",
      { reason: "private-start-below", private: privateStart.toString(), public: current.start.toString() },
    );
  }
  return null;
}

/** The binding a private database recorded, read in its `on-start-db`'s transaction; null on its first start. */
async function recordedBinding(w: SchemaWriteHandle): Promise<PublicIdentity | null> {
  const [row] = await w.query(BINDING_SQL);
  if (row === undefined) return null;
  return { genesisHash: row.public_genesis_hash as Uint8Array, start: row.public_start_height as bigint };
}

/**
 * A {@link PrivateBlockSource}'s transport to the core (`src/private/private-transport.ts`'s `PrivateTransport`): its
 * `hello-ack`, its reports and its lockstep flag; closed with the public database.
 */
export interface SourceTransport {
  /** The `hello-ack` that connects it (startup's chain check waits for it). */
  connection(): Promise<HelloAck>;
  /** Tells the core that `block` committed, when it is lockstep (PP-6). */
  report(block: BlockRef): void;
  /** Whether the last `hello-ack` said the core lists the instance. */
  readonly lockstep: boolean;
  /**
   * Why the core's transport is refused for good (`public-config-changed`, `report-hash-mismatch`), or null; the source
   * reads public data no more once it is (PP-14: no other height processed). None for a transport that has none.
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
 * PP-6's refusal (`needs-lockstep-not-listed`, not retried) of the `modules` that declare `needsLockstep`, on an instance
 * that is not lockstep: the core's `hello-ack` said `lockstep: false` (`transport`), or it has no `coreTransport`, so no
 * core can hold it in lockstep. Null when none declares it, or the instance is lockstep.
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
      `processes (PP-6); ${why}`,
    { modules: needing, transport },
  );
}

/**
 * PP-6's halt (`lockstep-behind`, not retried) of a lockstep instance processing `height` while the public cursor is
 * `cursor`, past it: the mutable public state at `height` is gone (the core listed the instance late, or does not wait
 * for it).
 */
export function lockstepBehind(height: bigint, cursor: bigint | null): UmbraError {
  return new UmbraError(
    "lockstep-behind",
    `the public cursor is ${cursor}, past height ${height}: a lockstep instance processes a height only while the public ` +
      "cursor is that height (PP-6), and the mutable public state of the heights it missed is gone (PP-7); give it a new " +
      "private database whose start is above the public cursor, or remove it from the core's lockstepInstances",
    { height: height.toString(), cursor: cursor === null ? null : cursor.toString() },
  );
}

/** The checks a {@link PrivateBlockSource} runs at startup, each replaceable by a negative control. */
export interface PrivateChecks {
  /** The configured network's check; {@link networkRefusal} unless given. */
  readonly network?: typeof networkRefusal;
  /** PP-2's comparisons with the recorded binding; {@link bindingRefusal} unless given. */
  readonly binding?: typeof bindingRefusal;
  /**
   * The private S, for PP-2's `private-start-below`; unless given (a source a test makes by hand) the public S, so that
   * only the recorded binding is compared — the part's `on-start-db` compares the private S again.
   */
  readonly start?: bigint;
  /** The negative controls' view of the public items the graph is given (PP-13); all of them, as read, unless given. */
  readonly publicItems?: (items: readonly PublicItem[]) => readonly PublicItem[];
  /**
   * Whether a lockstep instance reads the public cursor again after each `on-fetch` callback's data (Q142); true
   * unless given — false is the negative control's, which processes a cursor that moved meanwhile.
   */
  readonly reread?: boolean;
  /**
   * Whether the public configuration hash is checked (PP-14; task 14.1b); `check` unless given — `ignore` is the
   * negative control's, which goes on after the public configuration changed.
   */
  readonly configHash?: "check" | "ignore";
}

/** The block source of a private process (see the module comment). */
export class PrivateBlockSource implements BlockSource {
  readonly #public: PublicDatabase;
  readonly #wakes: PublicWakes;
  readonly #transport: SourceTransport | null;
  readonly #checks: PrivateChecks;
  /** Whether the `hello-ack` of startup's chain check said the core lists the instance (PP-6). */
  #lockstepAtStart = false;
  /** Whether a startup chain check completed: from then on the source knows whether it is lockstep (task 14.4). */
  #checked = false;
  /** The private cursor last known committed: startup's read, then each block committed; undefined before startup's. */
  #position: BlockRef | null | undefined;
  /** The binding the private database recorded, as the last read of the cursor found it; null before any or without. */
  #recorded: PublicIdentity | null = null;
  /** The public configuration hash startup's chain check read (PP-14); null before it, or before the table exists. */
  #publicConfigHash: string | null = null;
  /** How many reconnections of the public database the configuration was last checked after (PP-14). */
  #reconnections = 0;

  constructor(publicDatabase: PublicDatabase, wakes: PublicWakes, transport: SourceTransport | null = null, checks: PrivateChecks = {}) {
    this.#public = publicDatabase;
    this.#wakes = wakes;
    this.#transport = transport;
    this.#checks = checks;
  }

  /**
   * The private process's position for its transport's `hello` (PP-4): the private cursor last known committed, or
   * `start` − 1 with no hash before its first commit.
   */
  position(start: bigint): { readonly height: bigint; readonly hash: Uint8Array | null } {
    const known = this.#position ?? null;
    return known === null ? { height: start - 1n, hash: null } : { height: known.height, hash: known.hash };
  }

  /** A block committed (the part's `on-after-db-write`): the position from now on, reported to the core (PP-6). */
  committed(block: BlockRef): void {
    this.#position = block;
    this.#transport?.report(block);
  }

  /**
   * Whether the instance is lockstep (PP-6): its startup's `hello-ack` said so — kept for the whole run, so a module
   * needing it never runs unchecked —, or the last one did.
   */
  get lockstep(): boolean {
    return this.#lockstepAtStart || this.#transport?.lockstep === true;
  }

  /**
   * Whether the instance is lockstep as `/status` shows it (`public.lockstep`, AE-5; task 14.4): {@link lockstep} once a
   * startup chain check completed — without a transport, false —, null before.
   */
  get lockstepShown(): boolean | null {
    return this.#checked ? this.lockstep : null;
  }

  /** The public database the source reads. */
  get publicDatabase(): PublicDatabase {
    return this.#public;
  }

  /** The public configuration hash startup's chain check read from the public database (PP-14); null before. */
  get publicConfigHash(): string | null {
    return this.#publicConfigHash;
  }

  /**
   * One read of public data for the loop (PP-14; task 14.1b): none once the core's transport is refused for good — its
   * refusal is the read's failure, so no other height is processed —; and, without a transport, the first read after
   * the public database lost a connection reads the public configuration history again, in that read and before
   * `body`, and fails with `public-config-changed` when its hash is not the one startup read.
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
   * The private cursor, read through `read` ({@link readPrivateCursor}); the first read — startup's, of the committed
   * cursor — is also the position until a block commits (the loop's later reads are inside a block's transaction). The
   * binding the same row records is kept for {@link checkChain}, which startup runs after this read.
   */
  async cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    const { cursor, binding } = await readPrivateRow(read);
    this.#recorded = binding;
    if (this.#position === undefined) this.#position = cursor;
    return cursor;
  }

  /**
   * The public cursor, in one read of the public database; before the core's first commit the height before the public
   * S, with 32 zero bytes for its hashes, which the loop never processes (a private S is at least the public S, PP-2).
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
   * where the public cursor is `height` (the read's height), else the instance halts with `lockstep-behind` (PP-6).
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
   * The chain's check at the private process's startup, before any migration and before the graph, in place of
   * `core-chain`'s checks against a node (IN-3; PP-1: a private process never talks to the node), in this order (PP-2):
   * the public database's chain identity read — a public database whose core has never started refused
   * ({@link publicNotStarted}, Q125) —; its genesis hash compared with the configured network's, `input.configured`
   * (Q136 B; {@link networkRefusal}); the binding the startup read of the private cursor found compared with it
   * ({@link bindingRefusal}: `genesis`, `start`, `private-start-below`; task 14.1a — the part's `on-start-db` compares
   * again in its transaction). Resolves with the genesis hash, which `core-chain` records with the private S on a new
   * private database, and the public core's `table` items with their heights, read with the identity
   * ({@link readPublicItems}; PP-13), which the runner gives the graph.
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
    if (this.#transport !== null) {
      // The core the instance reports to (PP-6, task 14.3): of the configured network, and whether it lists it.
      const ack = await this.#transport.connection();
      const core = { genesisHash: bytesOfHex(ack.genesis), start: BigInt(ack.start) };
      const other = (this.#checks.network ?? networkRefusal)(input.configured, core, "transport");
      if (other !== null) throw other;
      this.#lockstepAtStart = ack.lockstep;
    }
    // PP-14: the public configuration as startup checked it; without a transport, read again at each reconnection.
    this.#publicConfigHash = configHash;
    this.#reconnections = reconnections;
    this.#checked = true;
    const publicItems = Object.freeze([...(this.#checks.publicItems?.(items) ?? items)]);
    return Object.freeze({ genesisHash: identity.genesisHash, publicItems });
  }

  /**
   * The graph's modules at startup, after the chain check and before any migration (`BlockSource.checkModules`): a
   * module declaring `needsLockstep` refuses to run on an instance that is not lockstep (PP-6,
   * {@link needsLockstepRefusal}).
   */
  checkModules(modules: readonly ModuleDeclaration[]): void {
    const refusal = needsLockstepRefusal(modules, this.#lockstepAtStart, this.#transport !== null);
    if (refusal !== null) throw refusal;
  }

  /** A read of the private database's committed height (DB-2): the private cursor's ({@link privateCursorHeight}). */
  readonly committedHeight = privateCursorHeight;

  /**
   * One `on-fetch` callback's read of public data for `height` (PP-3, Q100): a read of the public database at its
   * cursor. On a lockstep instance the read begins at `height`, and after the callback the public cursor is read again
   * (Q142: through the core each statement is its own read) — a cursor past `height` either time halts the instance
   * with `lockstep-behind` (PP-6).
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
 * A process's `public.lockstep` for `/status` (AE-5; task 14.4): its source's {@link PrivateBlockSource.lockstepShown}
 * on a private process; null for any other source (the core's), or none yet.
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
  /** The negative controls' check of the configured network (Q136 B); {@link networkRefusal} unless given. */
  readonly network?: typeof networkRefusal;
  /** The negative controls' view of the public items the graph is given (PP-13); all of them, as read, unless given. */
  readonly publicItems?: (items: readonly PublicItem[]) => readonly PublicItem[];
  /** The negative control's lockstep instance that does not read the public cursor again (Q142); it does unless false. */
  readonly reread?: boolean;
  /** The negative control's private process that ignores the public configuration hash (PP-14); checked unless `ignore`. */
  readonly configHash?: "check" | "ignore";
}

/** One private process start's `core-private-source`: the part and the block source it is bound to. */
export interface PrivateIntake {
  /** The backbone part `core-private-source` (see the module comment). */
  readonly part: ModuleDeclaration;
  /**
   * The process's block source, made from its `core` revision and what the process shares with it — S and its log
   * (`ProcessInput.source`; without them S is the revision's start and nothing is logged): once, before the part's
   * `on-start-db`, which reads its public database.
   */
  source(core: CheckedEntry, shared?: { readonly start: bigint; readonly log: (line: string) => void }): PrivateBlockSource;
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
    ],
    // Every backbone part starts at S, which is a mid-chain start when S is above genesis (Q96).
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
        if (recorded === null) await w.execute(BIND_SQL, [current.genesisHash, current.start]);
      },
      async "on-db-write"(_p, b, w) {
        await w.execute(MOVE_SQL, [b.height, b.hash, b.parentHash]);
      },
      async "on-after-db-write"(_p, b) {
        made?.committed({ height: b.height, hash: b.hash, parentHash: b.parentHash });
      },
    },
  };
  return Object.freeze({
    part,
    source(core: CheckedEntry, shared?: { readonly start: bigint; readonly log: (line: string) => void }): PrivateBlockSource {
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
        binding,
        start,
      });
      return made;
    },
  });
}
