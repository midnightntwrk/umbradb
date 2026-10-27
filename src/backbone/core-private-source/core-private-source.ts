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
 * `core-chain`'s IN-3 checks against a node): the public database's identity is read, its genesis hash handed to
 * `core-chain`, which records it with the private S in the private database's `core_chain.identity` on a new private
 * database and the anchor at block S, and publishes `config`, `db` and `ledger-table` (no node client: the private
 * `core` entry has no `node`). Nothing of that compares: the comparisons are PP-2's, here. The bootstrap's wait (IN-2)
 * waits, with the condition `waiting-for-node`, for the public cursor to reach the private S.
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
 * sees committed — or, before the first commit, S − 1 with no hash (PP-4). The transport connects at the source's first
 * wait or read through it, which come after startup read the cursor.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { ChainCheck } from "../core-chain/core-chain.js";
import type { CheckedEntry } from "../../config/validate.js";
import type { ReadHandle, SchemaWriteHandle } from "../../db/api.js";
import { UmbraError } from "../../db/errors.js";
import type { ModuleDeclaration, Revision } from "../../modules/declaration.js";
import type { BlockRef, BlockSource } from "../../runner/block-source.js";
import {
  openPublicSide,
  type PublicDatabase,
  type PublicIdentity,
  type PublicWakes,
  readPublicBlock,
  readPublicCursor,
  readPublicIdentity,
} from "./public-database.js";

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
const CURSOR_SQL = "SELECT height, hash, parent_hash FROM core_private_source.cursor WHERE id = 1";
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
  const [table] = await read.query(PRESENT_SQL);
  if (table?.present !== true) return null;
  const [row] = await read.query(CURSOR_SQL);
  if (row === undefined || row.height === null) return null;
  return Object.freeze({
    height: row.height as bigint,
    hash: row.hash as Uint8Array,
    parentHash: row.parent_hash as Uint8Array,
  });
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

/** What a {@link PrivateBlockSource} closes with its public database: its transport to the core. */
export interface Closable {
  close(): Promise<void>;
}

/** The block source of a private process (see the module comment). */
export class PrivateBlockSource implements BlockSource {
  readonly #public: PublicDatabase;
  readonly #wakes: PublicWakes;
  readonly #transport: Closable | null;
  /** The private cursor last known committed: startup's read, then each block committed; undefined before startup's. */
  #position: BlockRef | null | undefined;

  constructor(publicDatabase: PublicDatabase, wakes: PublicWakes, transport: Closable | null = null) {
    this.#public = publicDatabase;
    this.#wakes = wakes;
    this.#transport = transport;
  }

  /**
   * The private process's position for its transport's `hello` (PP-4): the private cursor last known committed, or
   * `start` − 1 with no hash before its first commit.
   */
  position(start: bigint): { readonly height: bigint; readonly hash: Uint8Array | null } {
    const known = this.#position ?? null;
    return known === null ? { height: start - 1n, hash: null } : { height: known.height, hash: known.hash };
  }

  /** A block committed (the part's `on-after-db-write`): the position from now on. */
  committed(block: BlockRef): void {
    this.#position = block;
  }

  /** The public database the source reads. */
  get publicDatabase(): PublicDatabase {
    return this.#public;
  }

  /**
   * The private cursor, read through `read` ({@link readPrivateCursor}); the first read — startup's, of the committed
   * cursor — is also the position until a block commits (the loop's later reads are inside a block's transaction).
   */
  async cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    const cursor = await readPrivateCursor(read);
    if (this.#position === undefined) this.#position = cursor;
    return cursor;
  }

  /**
   * The public cursor, in one read of the public database; before the core's first commit the height before the public
   * S, with 32 zero bytes for its hashes, which the loop never processes (a private S is at least the public S, PP-2).
   */
  finalizedHead(): Promise<BlockRef> {
    return this.#public.read(async (read) => {
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

  /** The public block at `height`; throws when the public database has none there. */
  async block(height: bigint): Promise<BlockRef> {
    const block = await this.#public.read((read) => readPublicBlock(read, height));
    if (block === null) throw new Error(`the public database has no block at height ${height}`);
    return block;
  }

  /**
   * The chain's check at the private process's startup, in place of `core-chain`'s checks against a node (IN-3; PP-1: a
   * private process never talks to the node): the public database's chain identity, its genesis hash given to
   * `core-chain`, which records it with the private S on a new private database — or the refusal of a public database
   * whose core has never started ({@link publicNotStarted}). PP-2's comparisons are the part's, in its `on-start-db`.
   */
  async checkChain(): Promise<ChainCheck> {
    const identity = await this.#public.read((read) => readPublicIdentity(read));
    if (identity === null) throw publicNotStarted();
    return Object.freeze({ genesisHash: identity.genesisHash });
  }

  /** A read of the private database's committed height (DB-2): the private cursor's ({@link privateCursorHeight}). */
  readonly committedHeight = privateCursorHeight;

  /** One `on-fetch` callback's read of public data (PP-3, Q100): a read of the public database at its cursor. */
  readonly fetchRead = <T>(body: (read: ReadHandle) => Promise<T>): Promise<T> => this.#public.read(body);

  /** Closes the public database, then the transport to the core. */
  async close(): Promise<void> {
    try {
      await this.#public.close();
    } finally {
      await this.#transport?.close();
    }
  }
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
        { position: () => (made as PrivateBlockSource).position(start), log: shared?.log ?? (() => undefined) },
        {
          ...(options.publicDatabase === undefined ? {} : { publicDatabase: options.publicDatabase(core) }),
          ...(options.wakes === undefined ? {} : { wakes: options.wakes(core) }),
        },
      );
      made = new PrivateBlockSource(side.publicDatabase, side.wakes, side.transport);
      return made;
    },
  });
}
