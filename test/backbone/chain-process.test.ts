import type { ChildProcess } from "node:child_process";
import { spawnChild } from "../child-processes.js";
import { once } from "node:events";
import { createServer } from "node:net";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  checkParent,
  CORE_BLOCK_COMMIT,
  startOf,
  writeBlockRow,
  writeHashRow,
} from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_CHAIN, checkChain, type ChainCheckInput } from "../../src/backbone/core-chain/index.js";
import { coreEntry } from "../../src/config/entries.js";
import { UmbraError } from "../../src/db/errors.js";
import { builtInNetwork } from "../../src/ledger/networks.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { NodeClient } from "../../src/node/index.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { HeightFailure } from "../../src/runner/loop.js";
import type { ProcessHandle, ProcessInput } from "../../src/runner/process.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf, settle, startProcess } from "../runner/process-build.js";
import { workModule } from "../runner/sigterm-module.js";
import { STAND_IN_SPEC_VERSION } from "./block-fetch-stand-in.js";
import { tapeTest } from "../tape/real/real-tapes.js";
import { type ChainBuildOptions, chainDeclarations } from "./chain-build.js";
import type { Job, WorkerEvent } from "./chain-bootstrap.worker.js";
import { genesisOf, ingest } from "./ingest-harness.js";

/**
 * The known networks whose built-in genesis hash a test hides. Every network's genesis hash is recorded, so a build
 * without one is planted here, through the built-in network table as `core-chain` reads it (`builtInNetwork`).
 * [A78, Q117]
 */
const unrecorded = vi.hoisted(() => new Set<string>());
vi.mock("../../src/ledger/networks.js", async (importOriginal) => {
  const real = await importOriginal<typeof import("../../src/ledger/networks.js")>();
  return {
    ...real,
    builtInNetwork: (network: string) => {
      const entry = real.builtInNetwork(network);
      return entry !== null && unrecorded.has(network) ? Object.freeze({ ...entry, genesis: null }) : entry;
    },
  };
});

/**
 * The chain's identity, bootstrap and startup checks, and the blocks table, through the real process. The tests run
 * `startProcess` with UmbraDB's backbone parts (`./chain-build.ts`) over an in-memory block source, on PostgreSQL 18 and
 * PGlite 0.5.10. The parts are `core-chain`, `core-block-fetch` (with the in-memory source's block items),
 * `core-block-commit` and `core-digest`. Each process opens its database from the configuration's `database` setting.
 *
 * - With S above the source's finalized head, the process stays `starting` with `waiting-for-node`, its bootstrap
 *   done. It commits S once the head reaches it, and records the anchor in S's transaction. A bootstrap killed before
 *   S commits is repeated by the next start without error: a real process killed with SIGKILL while it waits, or
 *   inside block S's transaction. [IN-2, A77]
 * - Startup refuses, before any migration:
 *   - with `genesis-mismatch`, for a node whose genesis hash is not the configured network's (on an empty database
 *     too) or not the stored one;
 *   - for a known network whose built-in table records no genesis hash (planted, since every network has one);
 *   - with `cursor-hash-mismatch`, for a node whose finalized hash at the cursor differs.
 *
 *   A node whose head is below the cursor makes the process wait with `waiting-for-node`. With the recorded preprod
 *   tape, the real node's genesis is checked against a mainnet and a preprod configuration (skipped without
 *   `UMBRADB_TAPES`). [IN-3, Q117, Q120, A78]
 * - After block S commits on an empty database, `core_chain.identity` holds the genesis hash, S and the anchor hash.
 *   [CD-1, A88]
 * - There is one `blocks` and one `hashes` row per height, and the cursor is the last `blocks` row. Take a block in
 *   another height partition whose parent links to the cursor but whose hash repeats an earlier block's: it fails with
 *   `duplicate-block-hash`, not `parent-mismatch`, and processing halts. The same block with a fresh hash commits.
 *   [CD-3, A90]
 * - The node's milliseconds are stored in `block_time` exactly (the block-time part of the criterion). [A145]
 * - A module that requires `db` gets the read-only item `core-chain` publishes. [A144]
 *
 * The node is the block source here (the in-memory one). Its block 0 is the genesis block. The startup checks
 * (`checkChain`) ask for its finalized head and for the finalized block at a height; the node source answers them from
 * the node. "Refuses" means `started` rejects with the code and `ended` is `refused`, with the database closed and
 * unchanged; the status is then the `refused` state, and the process stays up until stopped.
 */

const PATIENCE_MS = 120_000;
const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** A module that records the rows and times it reads, and writes one row per height. */
/** What {@link recorder} saw: each block's row as its read gave it, and the `db` and `node-client` items. */
interface Seen {
  readonly blocks: Map<bigint, Record<string, unknown>>;
  db?: unknown;
  nodeClient?: unknown;
}

function recorder(seen: Seen): ModuleDeclaration {
  return {
    id: "reader",
    version: "1.0.0",
    side: "public",
    requires: ["blocks", "db", "node-client"],
    provides: [{ name: "reader-rows", lifetimes: ["table"], table: { schema: "reader", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE reader.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-start-api"(p) {
        seen.db = p.items.get("db");
        seen.nodeClient = p.items.get("node-client");
      },
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO reader.rows (height) VALUES ($1)", [b.height]);
      },
      async "on-after-db-write"(_p, b, read) {
        const [row] = await read.query(
          "SELECT height, hash, parent_hash, spec_version, ledger_version, block_time, " +
            "(extract(epoch FROM block_time) * 1000000)::bigint AS microseconds FROM core_block_commit.blocks WHERE height = $1",
          [b.height],
        );
        if (row !== undefined) seen.blocks.set(b.height, row);
      },
    },
  };
}

/** A process on `db` from S with `user` modules, over `source`, with the chain's build and `input`'s seams. */
function chainProcess(
  db: ProcessDatabase,
  start: bigint,
  source: InMemoryBlockSource,
  options: {
    readonly user?: readonly ModuleDeclaration[];
    readonly build?: ChainBuildOptions;
    /** More `core` settings (`listen.api`, …). */
    readonly settings?: Readonly<Record<string, unknown>>;
  } & Partial<ProcessInput> = {},
): ProcessHandle {
  const { user = [], build, settings, ...rest } = options;
  const entries = [
    core(db.setting, Number(start), settings === undefined ? {} : { extra: settings }),
    ...user.map((module) => entryOf(module, Number(start))),
  ];
  return startProcess({
    declarations: chainDeclarations(user, build),
    config: { data: { entries } },
    source,
    log: () => undefined,
    ...rest,
  });
}

/** Waits until `handle`'s status has the condition `waiting-for-node`, or fails after a while. */
async function waitingFor(handle: ProcessHandle): Promise<unknown> {
  const deadline = Date.now() + PATIENCE_MS;
  for (;;) {
    const condition = handle.status().conditions.find((c) => c.code === "waiting-for-node");
    if (condition !== undefined) return condition;
    if (Date.now() > deadline) throw new Error(`no waiting-for-node; status ${JSON.stringify(handle.status(), (_k, v) => (typeof v === "bigint" ? `${v}n` : v))}`);
    await sleep(10);
  }
}

/** What `started` rejected with (the test fails if it resolves). */
async function refusalOf(handle: ProcessHandle): Promise<unknown> {
  try {
    await handle.started;
  } catch (error) {
    return error;
  }
  throw new Error("expected the startup to refuse");
}

/** The root cause of a loop failure: the `UmbraError` under the `HeightFailure` and the dispatch's `CallbackFailure`. */
function rootOf(error: unknown): unknown {
  let current = error;
  while (current instanceof Error && !(current instanceof UmbraError) && current.cause !== undefined) current = current.cause;
  return current;
}

/** Rows of `sql` from outside the process, which must not hold the database (PGlite). */
const outside = (db: ProcessDatabase, sql: string) => db.query(sql);

/** The identity row, the anchor's transaction compared with block S's, from outside the process. */
async function identityOf(db: ProcessDatabase, start: bigint) {
  const [row] = await outside(
    db,
    "SELECT encode(genesis_hash, 'hex') AS genesis, start_height::text AS start, encode(anchor_hash, 'hex') AS anchor, " +
      `(SELECT b.xmin::text = i.xmin::text FROM core_block_commit.blocks b WHERE b.height = ${start}) AS same_transaction ` +
      "FROM core_chain.identity i",
  );
  return row;
}

describe.each(PROCESS_BACKENDS)("the chain through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  // ── the bootstrap and the chain's identity [A77, A88] ────────────────────────────────────────────────────────────

  /** What the bootstrap test observed: the state while waiting, then the identity after S committed. [A77] */
  interface A77Observation {
    readonly waiting: { readonly state: string; readonly ready: boolean; readonly condition: unknown; readonly cursor: unknown };
    readonly bootstrapped: { readonly migrations: number; readonly identity: unknown };
    readonly after: Record<string, unknown> | undefined;
    /** The conditions once S committed. */
    readonly conditionsAfter: readonly string[];
    readonly cursor: unknown;
  }

  async function a77Run(chain?: ModuleDeclaration): Promise<A77Observation> {
    const db = await backend.database();
    const start = 5n;
    const source = new InMemoryBlockSource({ head: 3n });
    const handle = chainProcess(db, start, source, chain === undefined ? {} : { build: { chain } });
    let waiting: A77Observation["waiting"];
    let bootstrapped: A77Observation["bootstrapped"] = { migrations: 0, identity: null };
    let conditionsAfter: readonly string[] = [];
    try {
      const condition = await waitingFor(handle);
      const status = handle.status();
      waiting = { state: status.state, ready: status.ready, condition, cursor: status.cursor };
      if (backend.kind === "postgres") {
        const [migrations] = await outside(db, "SELECT count(*)::int AS n FROM core_chain.migrations");
        const [identity] = await outside(
          db,
          "SELECT encode(genesis_hash, 'hex') AS genesis, start_height::text AS start, anchor_hash IS NULL AS no_anchor FROM core_chain.identity",
        );
        bootstrapped = { migrations: migrations?.n as number, identity };
      }
      source.finalize(start + 2n);
      expect(await settle(handle, source, start + 2n)).toBe("waiting");
      conditionsAfter = handle.status().conditions.map((condition) => condition.code);
    } finally {
      await handle.stop();
    }
    const [{ h: cursor } = { h: undefined }] = await outside(db, "SELECT max(height)::text AS h FROM core_block_commit.blocks");
    return { waiting, bootstrapped, after: await identityOf(db, start), cursor, conditionsAfter };
  }

  /** The bootstrap's oracle: the problems found, none when the bootstrap behaved as required. [IN-2, CD-1, A77, A88] */
  function a77Problems(observed: A77Observation): string[] {
    const problems: string[] = [];
    const { waiting } = observed;
    if (waiting.state !== "starting" || waiting.ready) problems.push(`while waiting it was ${waiting.state}, ready ${waiting.ready}`);
    if (JSON.stringify(waiting.condition, (_k, v) => (typeof v === "bigint" ? `${v}` : v)) !== '{"code":"waiting-for-node","height":"5","head":"3"}') {
      problems.push(`the condition was ${JSON.stringify(waiting.condition, (_k, v) => (typeof v === "bigint" ? `${v}` : v))}`);
    }
    if (waiting.cursor !== null) problems.push(`the cursor was ${String(waiting.cursor)} while waiting`);
    if (backend.kind === "postgres") {
      const { migrations, identity } = observed.bootstrapped;
      // Every bootstrap step ran before the wait: the migrations, the identity with no anchor yet.
      if (migrations === 0) problems.push("no migration ran before the wait");
      const expected = { genesis: hex(inMemoryBlock(0n).hash).slice(2), start: "5", no_anchor: true };
      if (JSON.stringify(identity) !== JSON.stringify(expected)) problems.push(`the identity while waiting was ${JSON.stringify(identity)}`);
    }
    if (observed.cursor !== "7") problems.push(`the cursor after the head reached 7 is ${String(observed.cursor)}`);
    const after = observed.after;
    if (after?.genesis !== hex(inMemoryBlock(0n).hash).slice(2)) problems.push(`the genesis hash is ${String(after?.genesis)}`);
    if (after?.start !== "5") problems.push(`S is ${String(after?.start)}`);
    if (after?.anchor !== hex(inMemoryBlock(5n).hash).slice(2)) problems.push(`the anchor hash is ${String(after?.anchor)}`);
    if (after?.same_transaction !== true) problems.push("the anchor was not recorded in block S's transaction");
    if (observed.conditionsAfter.length > 0) problems.push(`once S committed the conditions are ${observed.conditionsAfter}`);
    return problems;
  }

  it("A77: waits starting with waiting-for-node while S is above the head, then commits S with the anchor in its transaction", async () => {
    expect(a77Problems(await a77Run())).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A77 negative control: a core-chain that records the anchor in the next block's transaction fails A77", async () => {
    const late: ModuleDeclaration = {
      ...CORE_CHAIN,
      points: {
        ...CORE_CHAIN.points,
        async "on-db-write"(_p, b, w) {
          if (b.height !== 6n) return;
          await w.execute("UPDATE core_chain.identity SET anchor_hash = (SELECT hash FROM core_block_commit.blocks WHERE height = 5)");
        },
      },
    };
    expect(a77Problems(await a77Run(late))).toEqual(["the anchor was not recorded in block S's transaction"]);
  }, PATIENCE_MS * 2);

  it("A88: after block S commits on an empty database, core_chain.identity holds the genesis hash, S and the anchor hash", async () => {
    for (const start of [0n, 12n]) {
      const db = await backend.database();
      const genesis: BlockRef = { height: 0n, hash: new Uint8Array(32).fill(0x5a), parentHash: new Uint8Array(32) };
      const source = new InMemoryBlockSource({ head: start, blocks: [genesis] });
      // The tests' custom network with this chain's genesis, since the node's genesis must be the configured network's.
      const handle = chainProcess(db, start, source, { settings: { genesisHash: hex(genesis.hash) } });
      try {
        expect(await settle(handle, source, start)).toBe("waiting");
      } finally {
        await handle.stop();
      }
      const anchor = start === 0n ? genesis.hash : inMemoryBlock(start).hash;
      expect(await identityOf(db, start)).toEqual({
        genesis: hex(genesis.hash).slice(2),
        start: String(start),
        anchor: hex(anchor).slice(2),
        same_transaction: true,
      });
    }
  }, PATIENCE_MS * 2);

  it("A77: a bootstrap stopped while it waits is repeated by the next start without error", async () => {
    const db = await backend.database();
    const first = chainProcess(db, 5n, new InMemoryBlockSource({ head: 2n }));
    await waitingFor(first);
    await first.stop();
    expect((await first.ended).kind).toBe("signal");
    const source = new InMemoryBlockSource({ head: 6n });
    const second = chainProcess(db, 5n, source);
    try {
      expect(await settle(second, source, 6n)).toBe("waiting");
    } finally {
      await second.stop();
    }
    expect(await identityOf(db, 5n)).toMatchObject({ start: "5", anchor: hex(inMemoryBlock(5n).hash).slice(2), same_transaction: true });
    // One history row: the core entry, recorded once.
    expect(await outside(db, "SELECT entry_id, start::text AS start FROM core_chain.config")).toEqual([{ entry_id: "core", start: "5" }]);
  }, PATIENCE_MS * 2);

  it("a bootstrap wait that fails refuses startup, closes the node client and the database, and never listened", async () => {
    const db = await backend.database();
    const port = await freePort();
    const gone = new Error("the node is gone");
    class Failing extends InMemoryBlockSource {
      override waitForHead(): Promise<void> {
        return Promise.reject(gone);
      }
    }
    // core-chain's node client, made when startup binds it, before the wait: no module sees it before on-start-api, which
    // comes after the wait, so its closing is watched on the class.
    const closes = vi.spyOn(NodeClient.prototype, "close");
    const handle = chainProcess(db, 5n, new Failing({ head: 2n }), {
      user: [recorder({ blocks: new Map() })],
      settings: { listen: { api: `127.0.0.1:${port}` } },
    });
    expect(await refusalOf(handle)).toBe(gone);
    expect(await handle.ended).toEqual({ kind: "refused", error: gone });
    // The refused state: refused with the general refusal code (a source's failure has no code of its own among the
    // refusal codes), not ready. [design §11]
    expect(handle.status()).toMatchObject({
      state: "refused",
      ready: false,
      reason: { code: "database-error", height: null, module: null, point: null },
      conditions: [],
    });
    expect(closes).toHaveBeenCalledTimes(1);
    closes.mockRestore();
    // Nothing listens on listen.api (the wait comes before the module API), and the next process opens the database
    // (its writer lock released).
    await listenOnce(port);
    const source = new InMemoryBlockSource({ head: 6n });
    const next = chainProcess(db, 5n, source, { user: [recorder({ blocks: new Map() })] });
    try {
      expect(await settle(next, source, 6n)).toBe("waiting");
    } finally {
      await next.stop();
    }
  }, PATIENCE_MS * 2);

  it("retries a node unreachable during the bootstrap's wait: node-retrying beside waiting-for-node, both gone once S commits", async () => {
    const db = await backend.database();
    class Flaky extends InMemoryBlockSource {
      failures = 1;
      override waitForHead(above: bigint, signal: AbortSignal): Promise<void> {
        if (this.failures === 0) return super.waitForHead(above, signal);
        this.failures -= 1;
        return Promise.reject(new UmbraError("node-unreachable", "the node did not answer"));
      }
    }
    const source = new Flaky({ head: 3n });
    const handle = chainProcess(db, 5n, source);
    try {
      // The first wait fails: startup is retried after the node back-off and waits again, still starting. The retry's
      // condition stays raised until startup completes. [IN-10]
      await source.waiting(4n);
      const { state, conditions } = handle.status();
      expect(state).toBe("starting");
      expect(conditions.map((condition) => condition.code).sort()).toEqual(["node-retrying", "waiting-for-node"]);
      expect(conditions.find((condition) => condition.code === "node-retrying")).toMatchObject({ attempts: 1, height: null });
      source.finalize(6n);
      expect(await settle(handle, source, 6n)).toBe("waiting");
      expect(handle.status().conditions).toEqual([]);
    } finally {
      await handle.stop();
    }
    expect(await identityOf(db, 5n)).toMatchObject({ start: "5", anchor: hex(inMemoryBlock(5n).hash).slice(2), same_transaction: true });
  }, PATIENCE_MS * 2);

  for (const mode of ["wait", "hold"] as const) {
    it(`A77: a bootstrap killed with SIGKILL ${mode === "wait" ? "while it waits for the node" : "inside block S's transaction"} is repeated by the next start without error`, async () => {
      const db = await backend.database();
      const directory = mkdtempSync(join(tmpdir(), "umbradb-chain-"));
      try {
        const configFile = join(directory, "umbradb.config.ts");
        const entries = [core(db.setting, 5), entryOf({ id: "w", version: "1.0.0" }, 5)];
        writeFileSync(configFile, `export default ${JSON.stringify({ entries })};\n`);
        const worker = startWorker(
          mode === "wait" ? { configFile, head: 3, mode } : { configFile, head: 5, mode, at: 5 },
        );
        try {
          await worker.next(mode === "wait" ? "waiting" : "in-db-write");
          worker.child.kill("SIGKILL");
          const exit = await worker.exited;
          expect(exit.signal).toBe("SIGKILL");
        } finally {
          if (worker.child.exitCode === null && worker.child.signalCode === null) worker.child.kill("SIGKILL");
          await worker.exited;
        }
        // Killed before S committed: no block, no anchor; the bootstrap's own steps had committed.
        expect(await outside(db, "SELECT count(*)::int AS n FROM core_block_commit.blocks")).toEqual([{ n: 0 }]);
        expect(await outside(db, "SELECT anchor_hash IS NULL AS none FROM core_chain.identity")).toEqual([{ none: true }]);
        const before = await outside(db, "SELECT module, migration_id FROM core_chain.migrations ORDER BY module, position");
        const source = new InMemoryBlockSource({ head: 6n });
        const handle = startProcess({
          declarations: chainDeclarations([workModule({ rows: 2, report: () => undefined })]),
          config: { file: configFile },
          source,
          log: () => undefined,
        });
        try {
          expect(await settle(handle, source, 6n)).toBe("waiting");
        } finally {
          await handle.stop();
        }
        expect(await identityOf(db, 5n)).toEqual({
          genesis: hex(inMemoryBlock(0n).hash).slice(2),
          start: "5",
          anchor: hex(inMemoryBlock(5n).hash).slice(2),
          same_transaction: true,
        });
        expect(await outside(db, "SELECT height::int AS h, count(*)::int AS n FROM w.rows GROUP BY height ORDER BY height")).toEqual([
          { h: 5, n: 2 },
          { h: 6, n: 2 },
        ]);
        // Nothing was migrated twice, and nothing new was needed.
        expect(await outside(db, "SELECT module, migration_id FROM core_chain.migrations ORDER BY module, position")).toEqual(before);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    }, PATIENCE_MS * 3);
  }

  // ── the startup checks [A78] ─────────────────────────────────────────────────────────────────────────────────────

  /** A module whose second build adds a migration: a refusal before any migration leaves it unapplied. */
  const growing = (migrations: number): ModuleDeclaration => ({
    id: "grows",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "grows-rows", lifetimes: ["table"], table: { schema: "grows", tables: ["t1"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: Array.from({ length: migrations }, (_, i) => ({ id: `00${i + 1}`, sql: `CREATE TABLE grows.t${i + 1} (k bigint PRIMARY KEY)` })),
    points: {},
  });

  /** A database committed to height 3 from S = 1 by a first process. */
  async function committedTo3(): Promise<ProcessDatabase> {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: 3n });
    const handle = chainProcess(db, 1n, source, { user: [growing(1)] });
    try {
      expect(await settle(handle, source, 3n)).toBe("waiting");
    } finally {
      await handle.stop();
    }
    return db;
  }

  /**
   * How a start expected to refuse went: what `started` rejected with, the state, and whether it changed anything.
   * [A78]
   */
  interface A78Refusal {
    /** `{ code, details }` of the refusal, or "accepted". */
    readonly refused: unknown;
    readonly status: unknown;
    readonly unchanged: boolean;
    /** How many times startup asked the node for a block. */
    readonly asked: number;
  }

  /** What the startup checks observed for each case: the refusal's code and details, or how the start waited. [A78] */
  interface A78Observation {
    /** On an empty database, the tests' custom network, a node of another genesis. [Q120] */
    readonly emptyCustom: A78Refusal;
    /** On an empty database, a mainnet configuration, a preprod node (the required scenario, built-in hashes). [IN-3] */
    readonly emptyKnown: A78Refusal;
    /** On an empty database, a known network whose built-in table records no genesis hash (planted). [Q117] */
    readonly notRecorded: A78Refusal;
    /** On a database with a cursor, a node of another genesis than the configured network's. */
    readonly configured: A78Refusal;
    /** On a database with a cursor whose stored genesis is not the node's, the configured network's the node's. */
    readonly stored: A78Refusal;
    /** On a database with a cursor, another finalized hash at the cursor. */
    readonly cursorHash: A78Refusal;
    readonly below: {
      readonly state: string;
      readonly condition: unknown;
      readonly cursorAfter: unknown;
      /** The identity's row, its transaction too, the same after the start as before it. */
      readonly identityUnchanged: boolean;
    };
  }

  /** The database's state a refused start must leave as it was: its tables, migrations, identity, history, blocks. */
  const snapshot = async (db: ProcessDatabase) => {
    const [tables] = await outside(
      db,
      "SELECT string_agg(schemaname || '.' || tablename, ',' ORDER BY schemaname, tablename) AS t FROM pg_tables " +
        "WHERE schemaname NOT IN ('pg_catalog', 'information_schema')",
    );
    if (tables?.t === null || tables?.t === undefined) return "no tables";
    return JSON.stringify(
      await outside(
        db,
        "SELECT (SELECT string_agg(module || '/' || migration_id, ',' ORDER BY module, position) FROM core_chain.migrations) AS m, " +
          "(SELECT encode(genesis_hash, 'hex') || encode(anchor_hash, 'hex') FROM core_chain.identity) AS i, " +
          "(SELECT count(*) FROM core_chain.config)::int AS c, (SELECT max(height)::text FROM core_block_commit.blocks) AS b",
      ),
    );
  };

  const refusal = (error: unknown) =>
    error instanceof UmbraError ? { code: error.code, details: error.details } : { error: String(error) };

  /** A block 0 of another chain than the tests' network's. */
  const OTHER: BlockRef = { height: 0n, hash: new Uint8Array(32).fill(0xee), parentHash: new Uint8Array(32) };
  /** The genesis hash a known network's built-in table records, as bytes (read from the table, never a constant). */
  const builtInGenesis = (network: string): Uint8Array =>
    new Uint8Array(Buffer.from((builtInNetwork(network)?.genesis?.hash as string).slice(2), "hex"));

  async function a78Run(seam?: ProcessInput["checkChain"]): Promise<A78Observation> {
    const options = seam === undefined ? {} : { checkChain: seam };
    /** A start of `db` over a source with `blocks`, expected to refuse; `settings` replace the tests' network. */
    const observe = async (
      db: ProcessDatabase,
      blocks: BlockRef[],
      settings?: Readonly<Record<string, unknown>>,
    ): Promise<A78Refusal> => {
      const before = await snapshot(db);
      const source = new InMemoryBlockSource({ head: 5n, blocks });
      let asked = 0;
      const block = source.block.bind(source);
      source.block = (height: bigint) => {
        asked += 1;
        return block(height);
      };
      const handle = chainProcess(db, 1n, source, { user: [growing(2)], ...options, ...(settings === undefined ? {} : { settings }) });
      let refused: unknown = "accepted";
      let status: unknown = null;
      try {
        refused = refusal(await refusalOf(handle));
        expect((await handle.ended).kind).toBe("refused");
        // The refused state: refused, not ready, the refusal's reason; the process stays up until stopped.
        const { state, ready, reason } = handle.status();
        status = { state, ready, reason };
      } catch {
        // Accepted (a negative control's): let it run to the head before comparing.
        await settle(handle, source, 5n).catch(() => undefined);
      } finally {
        await handle.stop();
      }
      return { refused, status, unchanged: (await snapshot(db)) === before, asked };
    };
    const emptyCustom = await observe(await backend.database(), [OTHER]);
    const emptyKnown = await observe(await backend.database(), [{ ...OTHER, hash: builtInGenesis("preprod") }], { network: "mainnet" });
    unrecorded.add("stagenet");
    let notRecorded: A78Refusal;
    try {
      notRecorded = await observe(await backend.database(), [], { network: "stagenet" });
    } finally {
      unrecorded.delete("stagenet");
    }
    const configured = await observe(await committedTo3(), [OTHER]);
    const tampered = await committedTo3();
    // A database written for another chain (an older build's, or one restored from elsewhere): its stored genesis is not
    // the node's, though the configured network's is.
    await outside(tampered, `UPDATE core_chain.identity SET genesis_hash = '\\x${"dd".repeat(32)}'`);
    const stored = await observe(tampered, []);
    const cursorHash = await observe(await committedTo3(), [{ ...inMemoryBlock(3n), hash: new Uint8Array(32).fill(3) }]);
    const db = await committedTo3();
    const identitySql = "SELECT encode(genesis_hash, 'hex') || start_height || encode(anchor_hash, 'hex') || xmin AS row FROM core_chain.identity";
    const [identityBefore] = await outside(db, identitySql);
    const source = new InMemoryBlockSource({ head: 1n });
    const handle = chainProcess(db, 1n, source, { user: [growing(1)], ...options });
    let seenBelow: Omit<A78Observation["below"], "identityUnchanged">;
    try {
      const condition = await Promise.race([waitingFor(handle), handle.started.then(() => "started")]);
      const state = handle.status().state;
      source.finalize(5n);
      await settle(handle, source, 5n);
      seenBelow = { state, condition, cursorAfter: handle.status().cursor };
    } finally {
      await handle.stop();
    }
    const [identityAfter] = await outside(db, identitySql);
    const below = { ...seenBelow, identityUnchanged: identityBefore?.row === identityAfter?.row };
    return { emptyCustom, emptyKnown, notRecorded, configured, stored, cursorHash, below };
  }

  /** The startup checks' oracle: the problems found, none when startup behaved as required. [IN-3, Q117, Q120, A78] */
  function a78Problems(observed: A78Observation): string[] {
    const problems: string[] = [];
    const text = (value: unknown) => JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? `${v}` : v));
    const refusedWith = (code: string) => text({ state: "refused", ready: false, reason: { code, height: null, module: null, point: null } });
    const ours = hex(inMemoryBlock(0n).hash);
    const cases: [string, A78Refusal, { code: string; details: Record<string, unknown> }][] = [
      [
        "a node of another network on an empty database",
        observed.emptyCustom,
        { code: "genesis-mismatch", details: { network: "custom", configured: ours, node: hex(OTHER.hash) } },
      ],
      [
        "a mainnet configuration against a preprod node on an empty database",
        observed.emptyKnown,
        {
          code: "genesis-mismatch",
          details: { network: "mainnet", configured: hex(builtInGenesis("mainnet")), node: hex(builtInGenesis("preprod")) },
        },
      ],
      [
        "a known network whose built-in table records no genesis hash",
        observed.notRecorded,
        { code: "genesis-mismatch", details: { network: "stagenet", configured: null } },
      ],
      [
        "a node of another network at a start with a cursor",
        observed.configured,
        { code: "genesis-mismatch", details: { network: "custom", configured: ours, node: hex(OTHER.hash) } },
      ],
      [
        "a node whose genesis hash is not the stored one",
        observed.stored,
        { code: "genesis-mismatch", details: { stored: `0x${"dd".repeat(32)}`, node: ours } },
      ],
      [
        "a node with another hash at the cursor",
        observed.cursorHash,
        {
          code: "cursor-hash-mismatch",
          details: { height: "3", stored: hex(inMemoryBlock(3n).hash), node: hex(new Uint8Array(32).fill(3)) },
        },
      ],
    ];
    for (const [what, seen, expected] of cases) {
      if (text(seen.refused) !== text(expected)) {
        problems.push(`${what}: ${text(seen.refused)}`);
        continue;
      }
      if (!seen.unchanged) problems.push(`${what}: the refusal changed the database`);
      if (text(seen.status) !== refusedWith(expected.code)) problems.push(`${what}: left ${text(seen.status)}`);
    }
    // The refusal of a known network with no recorded genesis hash needs no node: the build has nothing to compare
    // the node's genesis with. [Q117]
    if (observed.notRecorded.refused !== "accepted" && observed.notRecorded.asked !== 0) {
      problems.push(`a known network whose built-in table records no genesis hash: the node was asked ${observed.notRecorded.asked} times`);
    }
    const condition = text(observed.below.condition);
    if (observed.below.state !== "starting" || condition !== '{"code":"waiting-for-node","height":"3","head":"1"}') {
      problems.push(`a node below the cursor: ${observed.below.state}, ${condition}`);
    }
    if (observed.below.cursorAfter !== 5n) problems.push(`after the head rose to 5 the cursor is ${String(observed.below.cursorAfter)}`);
    if (!observed.below.identityUnchanged) problems.push("a start on a database with a cursor rewrote the identity");
    return problems;
  }

  it("A78: a node of another network than the configured one, also on an empty database, or than the stored one refuses with genesis-mismatch, a known network without a recorded genesis refuses, another hash at the cursor refuses with cursor-hash-mismatch, a head below the cursor waits", async () => {
    expect(a78Problems(await a78Run())).toEqual([]);
  }, PATIENCE_MS * 4);

  it("A78 negative controls: a startup check that skips the configured network's genesis on an empty database, the stored genesis or the cursor's hash fails A78 in exactly its own cases", async () => {
    const skipConfiguredOnEmpty = async (input: ChainCheckInput) => {
      if (input.cursor !== null) return checkChain(input);
      const node = (await input.source.block(0n)).hash;
      return checkChain({ ...input, configured: { network: input.configured.network, hash: node } });
    };
    const skipStored = async (input: ChainCheckInput) => {
      if (input.identity === null) return checkChain(input);
      const node = (await input.source.block(0n)).hash;
      return checkChain({ ...input, identity: { ...input.identity, genesisHash: node } });
    };
    const skipCursorHash = (input: ChainCheckInput) => {
      const { cursor, source } = input;
      if (cursor === null) return checkChain(input);
      const block = (height: bigint) => (height === cursor.height ? Promise.resolve(cursor) : source.block(height));
      return checkChain({ ...input, source: { finalizedHead: () => source.finalizedHead(), waitForHead: (a, s) => source.waitForHead(a, s), block } });
    };
    const prefixes = (problems: string[]) => problems.map((problem) => problem.slice(0, problem.indexOf(":")));
    expect(prefixes(a78Problems(await a78Run(skipConfiguredOnEmpty)))).toEqual([
      "a node of another network on an empty database",
      "a mainnet configuration against a preprod node on an empty database",
      "a known network whose built-in table records no genesis hash",
    ]);
    expect(a78Problems(await a78Run(skipStored))).toEqual(['a node whose genesis hash is not the stored one: "accepted"']);
    expect(a78Problems(await a78Run(skipCursorHash))).toEqual(['a node with another hash at the cursor: "accepted"']);
  }, PATIENCE_MS * 12);

  it("a custom network without its genesisHash refuses at validation, before the database opens or the node is asked (CF-4)", async () => {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: 5n });
    let asked = 0;
    const block = source.block.bind(source);
    source.block = (height: bigint) => {
      asked += 1;
      return block(height);
    };
    const handle = startProcess({
      declarations: chainDeclarations([]),
      config: {
        data: {
          entries: [
            coreEntry({
              start: 1,
              config: {
                network: "custom",
                ledgerTable: { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] },
                database: db.setting,
                node: "ws://127.0.0.1:9/node",
                developmentOptIn: true,
              } as never,
            }),
          ],
        },
      },
      source,
      log: () => undefined,
    });
    try {
      const refused = await refusalOf(handle);
      expect(refused).toBeInstanceOf(UmbraError);
      expect((refused as UmbraError).code).toBe("invalid-configuration");
      const { findings } = (refused as UmbraError).details as { readonly findings: readonly { readonly path: string }[] };
      expect(findings.map((finding) => finding.path)).toEqual(["entries[0].config.genesisHash"]);
      expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "invalid-configuration" } });
    } finally {
      await handle.stop();
    }
    expect(asked).toBe(0);
    expect(await snapshot(db)).toBe("no tables");
  }, PATIENCE_MS);

  tapeTest(
    "preprod-0-10000",
    "A78 against a real preprod node's genesis (task 0.3's tape): a mainnet configuration refuses with genesis-mismatch naming both, a preprod one starts",
    async (found) => {
      const { records } = found.read();
      const answered = genesisOf(records) as string;
      // The real node's genesis is the one recorded as preprod's in the built-in table.
      expect(answered).toBe(builtInNetwork("preprod")?.genesis?.hash);
      const mainnet = await ingest(await backend.database(), records, { start: 1n, settings: { network: "mainnet" } });
      try {
        const refused = await refusalOf(mainnet.handle);
        expect(refusal(refused)).toEqual({
          code: "genesis-mismatch",
          details: { network: "mainnet", configured: builtInNetwork("mainnet")?.genesis?.hash, node: answered },
        });
        expect(mainnet.handle.status()).toMatchObject({ state: "refused", reason: { code: "genesis-mismatch" } });
      } finally {
        await mainnet.close();
      }
      const preprod = await ingest(await backend.database(), records, { start: 1n, settings: { network: "preprod" } });
      try {
        await preprod.handle.started;
        expect(preprod.handle.status().reason).toBeNull();
        expect(["syncing", "following"]).toContain(preprod.handle.status().state);
      } finally {
        await preprod.close();
      }
    },
    { timeoutMs: PATIENCE_MS * 2 },
  );

  // ── the blocks table [A90] ───────────────────────────────────────────────────────────────────────────────────────

  /** S just below the first partition boundary, so heights S…1,000,002 span the partitions p0 and p1. */
  const S90 = 999_998n;

  /**
   * What the blocks table test observed: the halt, the rows before it, and the rows after the restart with a fresh hash.
   * [A90]
   */
  interface A90Observation {
    /** The halt as `status()` gives it once processing failed: the state and the reason (`reasonOf`). */
    readonly halt: {
      readonly state: unknown;
      readonly height: unknown;
      readonly point: unknown;
      readonly module: unknown;
      readonly code: unknown;
    } | null;
    readonly rows: { readonly halted: string; readonly restarted: string };
    readonly cursor: { readonly halted: unknown; readonly restarted: unknown };
  }

  /** The `blocks` and `hashes` rows, per height: the hash, and in which partition (`blocks`). */
  const rowsOf = async (db: ProcessDatabase) =>
    JSON.stringify(
      await outside(
        db,
        "SELECT b.height::text AS h, encode(b.hash, 'hex') AS hash, b.tableoid::regclass::text AS partition, " +
          "(SELECT count(*) FROM core_block_commit.hashes x WHERE x.height = b.height AND x.hash = b.hash)::int AS hashes, " +
          "(SELECT count(*) FROM core_block_commit.hashes)::int AS total FROM core_block_commit.blocks b ORDER BY b.height",
      ),
    );

  async function a90Run(repeated: BlockRef, commit?: ModuleDeclaration): Promise<A90Observation> {
    const db = await backend.database();
    const build = commit === undefined ? {} : { build: { commit } };
    const source = new InMemoryBlockSource({ head: S90 + 4n, blocks: [repeated] });
    const first = chainProcess(db, S90, source, build);
    let halt: A90Observation["halt"] = null;
    try {
      const end = await Promise.race([handleEnd(first), settle(first, source, S90 + 4n)]);
      if (typeof end === "object" && end.kind === "failed") {
        const { state, reason } = first.status();
        // The reason's code is the root UmbraError's, under the HeightFailure and the dispatch's CallbackFailure.
        const root = rootOf(end.error as HeightFailure);
        expect(reason?.code).toBe(root instanceof UmbraError ? root.code : "a root UmbraError");
        halt = { state, height: reason?.height, point: reason?.point, module: reason?.module, code: reason?.code };
      }
    } finally {
      await first.stop();
    }
    const halted = await rowsOf(db);
    const haltedCursor = (await outside(db, "SELECT max(height)::text AS h FROM core_block_commit.blocks"))[0]?.h;
    // The same block, with a fresh hash: the default chain's.
    const fresh = new InMemoryBlockSource({ head: S90 + 4n });
    const second = chainProcess(db, S90, fresh, build);
    try {
      await settle(second, fresh, S90 + 4n);
    } catch {
      // Refused (a negative control's database: a repeated hash at the cursor, which the cursor's check finds); the
      // rows after it tell.
    } finally {
      await second.stop();
    }
    return {
      halt,
      rows: { halted, restarted: await rowsOf(db) },
      cursor: { halted: haltedCursor, restarted: (await outside(db, "SELECT max(height)::text AS h FROM core_block_commit.blocks"))[0]?.h },
    };
  }

  const handleEnd = async (handle: ProcessHandle) => handle.ended;

  /** The rows a correct run holds for heights `from`…`to` of the default chain. */
  const expectedRows = (from: bigint, to: bigint) => {
    const rows = [];
    for (let h = from; h <= to; h++) {
      rows.push({
        h: String(h),
        hash: hex(inMemoryBlock(h).hash).slice(2),
        partition: h < 1_000_000n ? "core_block_commit.blocks_p0" : "core_block_commit.blocks_p1",
        hashes: 1,
        total: Number(to - from + 1n),
      });
    }
    return JSON.stringify(rows);
  };

  function a90Problems(observed: A90Observation, at: bigint): string[] {
    const problems: string[] = [];
    const want = { state: "halted", height: at, point: "on-db-write", module: "core-block-commit", code: "duplicate-block-hash" };
    if (JSON.stringify(observed.halt, (_k, v) => (typeof v === "bigint" ? `${v}` : v)) !== JSON.stringify(want, (_k, v) => (typeof v === "bigint" ? `${v}` : v))) {
      problems.push(`the repeated hash halted with ${JSON.stringify(observed.halt, (_k, v) => (typeof v === "bigint" ? `${v}` : v))}`);
    }
    if (observed.rows.halted !== expectedRows(S90, at - 1n)) problems.push(`rows at the halt: ${observed.rows.halted}`);
    if (observed.cursor.halted !== String(at - 1n)) problems.push(`the cursor at the halt is ${String(observed.cursor.halted)}`);
    if (observed.rows.restarted !== expectedRows(S90, S90 + 4n)) problems.push(`rows after the restart: ${observed.rows.restarted}`);
    if (observed.cursor.restarted !== String(S90 + 4n)) problems.push(`the cursor after the restart is ${String(observed.cursor.restarted)}`);
    return problems;
  }

  /** At 1,000,001 (partition p1): a block whose parent is 1,000,000's — it links — and whose hash is 999,999's (p0). */
  const linking = (): BlockRef => ({ ...inMemoryBlock(1_000_001n), hash: inMemoryBlock(999_999n).hash });
  /** At 1,000,001: block 999,999 delivered again — its hash and its parent are 999,999's. */
  const again = (): BlockRef => ({ ...inMemoryBlock(999_999n), height: 1_000_001n });

  it("A90: one blocks and one hashes row per height; a linking block repeating a hash in another partition halts with duplicate-block-hash; a fresh hash commits", async () => {
    expect(a90Problems(await a90Run(linking()), 1_000_001n)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A90: an earlier block delivered again — repeated hash, wrong parent — halts with duplicate-block-hash, not parent-mismatch", async () => {
    expect(a90Problems(await a90Run(again()), 1_000_001n)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A90 negative controls: no hashes row lets the repeat commit and the next block halt with parent-mismatch; the parent check first names parent-mismatch", async () => {
    const variant = (write: (w: never, b: never, start: bigint) => Promise<void>): ModuleDeclaration => ({
      ...CORE_BLOCK_COMMIT,
      points: { "on-db-write": async (p, b, w) => write(w as never, b as never, startOf(p)) },
    });
    const noHashRow = variant(async (w, b, start) => {
      await writeBlockRow(w, b);
      await checkParent(w, b, start);
    });
    const parentFirst = variant(async (w, b, start) => {
      await writeBlockRow(w, b);
      await checkParent(w, b, start);
      await writeHashRow(w, b);
    });
    const unhashed = a90Problems(await a90Run(linking(), noHashRow), 1_000_001n);
    expect(unhashed[0]).toBe(
      'the repeated hash halted with {"state":"halted","height":"1000002","point":"on-db-write","module":"core-block-commit",' +
        '"code":"parent-mismatch"}',
    );
    const reordered = a90Problems(await a90Run(again(), parentFirst), 1_000_001n);
    expect(reordered).toEqual([
      'the repeated hash halted with {"state":"halted","height":"1000001","point":"on-db-write","module":"core-block-commit",' +
        '"code":"parent-mismatch"}',
    ]);
  }, PATIENCE_MS * 4);

  // ── block time, and the db item through the real part [A145, A144] ──────────────────────────────────────────────

  it("A145: the node's block time in milliseconds is stored in core_block_commit.blocks.block_time exactly; A144: a module requiring db gets read only", async () => {
    const db = await backend.database();
    const times = [0n, 1n, 1_747_837_800_123n, 99_999_999_999_999n, 253_402_300_799_999n];
    const texts = [
      "1970-01-01T00:00:00Z",
      "1970-01-01T00:00:00.001Z",
      "2025-05-21T14:30:00.123Z",
      "5138-11-16T09:46:39.999Z",
      "9999-12-31T23:59:59.999Z",
    ];
    const seen: Seen = { blocks: new Map() };
    // Each block's own items, which the real core-block-fetch puts from the source.
    const source = new InMemoryBlockSource({
      head: 5n,
      items: (b) => ({
        specVersion: STAND_IN_SPEC_VERSION + Number(b.height),
        timestampMs: times[Number(b.height) - 1] as bigint,
        ledger: b.height < 3n ? "v8" : "v9",
      }),
    });
    const handle = chainProcess(db, 1n, source, { user: [recorder(seen)] });
    try {
      expect(await settle(handle, source, 5n)).toBe("waiting");
    } finally {
      await handle.stop();
    }
    expect([...seen.blocks.values()]).toEqual(
      times.map((ms, index) => {
        const height = BigInt(index + 1);
        return {
          height,
          hash: inMemoryBlock(height).hash,
          parent_hash: inMemoryBlock(height).parentHash,
          spec_version: STAND_IN_SPEC_VERSION + index + 1,
          ledger_version: height < 3n ? "v8" : "v9",
          block_time: texts[index],
          microseconds: ms * 1000n,
        };
      }),
    );
    const item = seen.db as object;
    expect(Reflect.ownKeys(item)).toEqual(["read"]);
    expect(Object.isFrozen(item)).toBe(true);
    expect(Object.getPrototypeOf(item)).toBe(Object.prototype);
    for (const name of ["transaction", "close", "execute", "query"]) expect(name in item, name).toBe(false);
    // core-chain's node client, closed with the process: a call ends with handle-closed, never tries the node.
    expect(seen.nodeClient).toBeInstanceOf(NodeClient);
    expect(await closedClient(seen.nodeClient)).toBe(true);
  }, PATIENCE_MS * 2);
});

/**
 * Whether `client` (core-chain's `node-client` item) is closed: a call then ends with `handle-closed` at once. An open
 * one, asked without retries, fails with `node-unreachable` instead (the tests' node URL has nothing behind it).
 */
async function closedClient(client: unknown): Promise<boolean> {
  try {
    await (client as NodeClient).finalizedHead({ retry: false, timeoutMs: 2_000 });
  } catch (error) {
    return error instanceof UmbraError && error.code === "handle-closed";
  }
  return false;
}

/** A free local port at or above 10000. */
async function freePort(): Promise<number> {
  for (;;) {
    const port = 10_000 + Math.floor(Math.random() * 50_000);
    try {
      await listenOnce(port);
      return port;
    } catch {
      // Taken: another one.
    }
  }
}

/** Listens on `port` of 127.0.0.1 and closes again; rejects when something else listens there. */
function listenOnce(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => server.close(() => resolve()));
  });
}

// ── the worker ─────────────────────────────────────────────────────────────────────────────────────────────────────

const WORKER = fileURLToPath(new URL("./chain-bootstrap.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

interface Worker {
  readonly child: ChildProcess;
  readonly events: WorkerEvent[];
  next(event: WorkerEvent["event"]): Promise<void>;
  readonly exited: Promise<{ readonly code: number | null; readonly signal: NodeJS.Signals | null }>;
}

function startWorker(job: Job): Worker {
  const child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const events: WorkerEvent[] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  createInterface({ input: child.stdout! }).on("line", (line) => {
    if (line.startsWith("{")) events.push(JSON.parse(line) as WorkerEvent);
  });
  const exited = once(child, "close").then(() => ({ code: child.exitCode, signal: child.signalCode }));
  return {
    child,
    events,
    exited,
    async next(event) {
      const deadline = Date.now() + PATIENCE_MS;
      while (!events.some((e) => e.event === event)) {
        if (child.exitCode !== null || child.signalCode !== null || Date.now() > deadline) {
          throw new Error(`no ${event} event; events ${JSON.stringify(events.slice(-6))}; stderr ${stderr.slice(-2000)}`);
        }
        await sleep(20);
      }
    },
  };
}
