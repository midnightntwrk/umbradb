import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight, readCursor } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { bindCoreBlockFetch, CORE_BLOCK_FETCH_ID } from "../../src/backbone/core-block-fetch/index.js";
import {
  bindCoreChain,
  checkChain,
  CONFIG_MIGRATION,
  type ConfiguredGenesis,
  configuredGenesisOf,
  CORE_CHAIN,
  CORE_CHAIN_ID,
  CORE_CHAIN_MIGRATIONS,
  type CoreChainFacts,
  IDENTITY_MIGRATION,
  IDENTITY_TABLE,
  nodeOptionsOf,
  readHistory,
  readIdentity,
  waitForNode,
  type NodeWait,
} from "../../src/backbone/core-chain/index.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import networksFile from "../../src/ledger/networks.json" with { type: "json" };
import { builtInNetwork, KNOWN_NETWORKS, ledgerTableOf, parseNetworksFile } from "../../src/ledger/networks.js";
import type { LedgerTable } from "../../src/ledger/version-table.js";
import { checkHistory, graphInputOf } from "../../src/config/history.js";
import { plainData } from "../../src/config/plain-data.js";
import { type CheckedConfig, validateConfig } from "../../src/config/validate.js";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import { schemaPlan } from "../../src/modules/adapters.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { BACKBONE_ORDER, type ResolvedGraph, resolveGraph } from "../../src/modules/graph.js";
import { type DeclarationSet, validateDeclarations } from "../../src/modules/validation.js";
import { NodeClient } from "../../src/node/index.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { ProcessContexts } from "../../src/runner/process-context.js";
import { BACKENDS, type TestBackend } from "../db/backends.js";
import { readOnlyProblems } from "../db/read-only-checks.js";
import { core } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";

/**
 * The backbone part `core-chain` (task 10.2; CD-1, IN-2, IN-3, MD-7; `design.md` §10; CORE-ARCH §4.4, §4.11): its
 * declaration; its migrations — `001` the configuration history's table (task 4.3, unchanged), `002`
 * `core_chain.identity`; the startup checks, which ask the block source — the node, through `core-block-fetch` (task
 * 10.3), or the in-memory source — for the genesis hash (block 0's), the finalized head and the finalized hash at the
 * cursor ({@link checkChain}, {@link waitForNode}); and the part's work once the runner binds it to its process
 * context ({@link bindCoreChain}): in `on-start-db` the history recorded, the identity's genesis hash and S recorded on
 * a database without a cursor, and the four `process` items published — `config`, `node-client`, `db` (read-only) and
 * `ledger-table` —; in `on-db-write` of block S the anchor hash, in S's own transaction.
 *
 * Through the real process — A77, A78, A88 — these are `chain-process.test.ts`'s.
 */

const S = 5n;
const NODE = "ws://127.0.0.1:9/node";
const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** A block 0 another chain has. */
const OTHER_GENESIS: BlockRef = { height: 0n, hash: new Uint8Array(32).fill(0xee), parentHash: new Uint8Array(32) };

/** The configured network whose genesis is `genesis`'s hash: a `custom` network (task 10.2a; Q120). */
const configuredAs = (genesis: BlockRef): ConfiguredGenesis => ({ network: "custom", hash: genesis.hash });

/** The tests' configured network: `custom`, its genesis the in-memory chain's block 0. */
const CONFIGURED = configuredAs(inMemoryBlock(0n));

/** An error a promise rejects with (the test fails if it resolves). */
async function rejectionOf(run: Promise<unknown>): Promise<unknown> {
  try {
    await run;
  } catch (error) {
    return error;
  }
  throw new Error("expected a rejection");
}

describe("core-chain's declaration (CD-1, design §10, task 3.2's note (e))", () => {
  it("is a valid backbone part, first of RN-3's fixed order, defined with defineModule, starting mid-chain", () => {
    const set = validateDeclarations({ backbone: [CORE_CHAIN], core: [], user: [] });
    expect(set.backbone).toEqual([CORE_CHAIN]);
    expect(CORE_CHAIN.id).toBe(CORE_CHAIN_ID);
    expect(CORE_CHAIN_ID).toBe("core-chain");
    expect(BACKBONE_ORDER[0]).toBe(CORE_CHAIN_ID);
    expect(CORE_CHAIN.version).toBe(UMBRADB_VERSION);
    expect(CORE_CHAIN.side).toBe("public");
    expect(CORE_CHAIN.requires).toEqual([]);
    expect(CORE_CHAIN.startsMidChain).toBe(true);
    expect(typeof (CORE_CHAIN as { entry?: unknown }).entry).toBe("function");
  });

  it("provides config, node-client, db and ledger-table (process) and chain-identity (table, core_chain.identity)", () => {
    expect(CORE_CHAIN.provides).toEqual([
      { name: "config", lifetimes: ["process"] },
      { name: "node-client", lifetimes: ["process"] },
      { name: "db", lifetimes: ["process"] },
      { name: "ledger-table", lifetimes: ["process"] },
      {
        name: "chain-identity",
        lifetimes: ["table"],
        table: { schema: "core_chain", tables: ["identity"], kind: "mutable" },
      },
    ]);
    expect(IDENTITY_TABLE).toBe("core_chain.identity");
    expect(Object.keys(CORE_CHAIN.points)).toEqual(["on-start-db", "on-db-write"]);
  });

  it("has migrations 001 (the history's table, task 4.3's text unchanged) and 002 (the identity)", () => {
    expect(CORE_CHAIN_MIGRATIONS).toEqual([CONFIG_MIGRATION, IDENTITY_MIGRATION]);
    expect(CORE_CHAIN.migrations).toEqual(CORE_CHAIN_MIGRATIONS.map(({ id, sql }) => ({ id, sql })));
    expect(CORE_CHAIN_MIGRATIONS.map(({ id }) => id)).toEqual(["001", "002"]);
    const sha = (sql: string) => createHash("sha256").update(sql, "utf8").digest("hex");
    // 001 is the text task 4.3 committed (`ed1b51f`): a database that applied it keeps its checksum.
    expect(sha(CONFIG_MIGRATION.sql)).toBe(CONFIG_MIGRATION_SHA256);
    expect(sha(IDENTITY_MIGRATION.sql)).toBe(IDENTITY_MIGRATION_SHA256);
    expect(Object.isFrozen(CORE_CHAIN_MIGRATIONS)).toBe(true);
  });

  it("makes the node client's options from the process's core settings: its node and back-off ceiling, none without a node", () => {
    expect(nodeOptionsOf({ node: NODE, backoffCeilingMs: 5_000 })).toEqual({ url: NODE, backoffCeilingMs: 5_000 });
    // A private process has no node (CF-4): it publishes no node client.
    expect(nodeOptionsOf({ instanceId: "p", backoffCeilingMs: 30_000 })).toBeNull();
  });
});

/** The pinned SHA-256 of task 4.3's migration 001 (`core_chain.config`). */
const CONFIG_MIGRATION_SHA256 = "c62e03495d6eeba88f027ca63c2089f7cbc1d8cb3e41d376fd2628b72379a5e7";
/** The pinned SHA-256 of migration 002 (`core_chain.identity`). */
const IDENTITY_MIGRATION_SHA256 = "c5474e25be7bdd0bf5a68965a20471039819cbb222750a5099252d130e074fc1";

describe("the startup checks (IN-3) and the wait for the node (IN-2, IN-3)", () => {
  const signal = () => new AbortController().signal;
  const identityOf = (genesis: BlockRef, start = S): { genesisHash: Uint8Array; start: bigint; anchorHash: Uint8Array | null } => ({
    genesisHash: genesis.hash,
    start,
    anchorHash: inMemoryBlock(start).hash,
  });

  it("on a new database: gives the source's genesis hash, block 0's, compares nothing and waits for nothing", async () => {
    const waits: (NodeWait | null)[] = [];
    // S above the head: the bootstrap's wait comes later (waitForNode), after the bootstrap's own steps.
    const source = new InMemoryBlockSource({ head: 2n });
    const check = await checkChain({ source, identity: null, cursor: null, configured: CONFIGURED, signal: signal(), onWaiting: (w) => waits.push(w) });
    expect(check.genesisHash).toEqual(inMemoryBlock(0n).hash);
    expect(waits).toEqual([]);
    const other = await checkChain({
      source: new InMemoryBlockSource({ head: 2n, blocks: [OTHER_GENESIS] }),
      identity: null,
      cursor: null,
      configured: configuredAs(OTHER_GENESIS),
      signal: signal(),
    });
    expect(other.genesisHash).toEqual(OTHER_GENESIS.hash);
  });

  it("on a database with a cursor: accepts the node whose genesis and finalized hash at the cursor are the stored ones", async () => {
    const source = new InMemoryBlockSource({ head: 9n });
    const check = await checkChain({ source, identity: identityOf(inMemoryBlock(0n)), cursor: inMemoryBlock(7n), configured: CONFIGURED, signal: signal() });
    expect(check.genesisHash).toEqual(inMemoryBlock(0n).hash);
  });

  it("refuses a node whose genesis hash is not the stored one with genesis-mismatch and both hashes, before any wait", async () => {
    const waits: (NodeWait | null)[] = [];
    // The head below the cursor and another hash at the cursor too: the genesis is checked first, at once. The
    // configured network's genesis is the node's here, so the stored one is what differs (a database written for
    // another chain).
    const source = new InMemoryBlockSource({ head: 3n, blocks: [OTHER_GENESIS] });
    const error = await rejectionOf(
      checkChain({
        source,
        identity: identityOf(inMemoryBlock(0n)),
        cursor: inMemoryBlock(7n),
        configured: configuredAs(OTHER_GENESIS),
        signal: signal(),
        onWaiting: (w) => waits.push(w),
      }),
    );
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("genesis-mismatch");
    expect((error as UmbraError).retryable).toBe(false);
    expect((error as UmbraError).details).toEqual({ stored: hex(inMemoryBlock(0n).hash), node: hex(OTHER_GENESIS.hash) });
    expect((error as UmbraError).message).toContain(hex(inMemoryBlock(0n).hash));
    expect((error as UmbraError).message).toContain(hex(OTHER_GENESIS.hash));
    expect(waits).toEqual([]);
  });

  it("refuses a node whose finalized hash at the cursor differs with cursor-hash-mismatch, the height and both hashes", async () => {
    const forked: BlockRef = { ...inMemoryBlock(7n), hash: new Uint8Array(32).fill(7) };
    const source = new InMemoryBlockSource({ head: 9n, blocks: [forked] });
    const error = await rejectionOf(
      checkChain({ source, identity: identityOf(inMemoryBlock(0n)), cursor: inMemoryBlock(7n), configured: CONFIGURED, signal: signal() }),
    );
    expect((error as UmbraError).code).toBe("cursor-hash-mismatch");
    expect((error as UmbraError).details).toEqual({
      height: 7n,
      stored: hex(inMemoryBlock(7n).hash),
      node: hex(forked.hash),
    });
    expect((error as UmbraError).message).toContain("7");
  });

  it("waits with waiting-for-node while the node's finalized head is below the cursor, then checks the hash there", async () => {
    const waits: (NodeWait | null)[] = [];
    const source = new InMemoryBlockSource({ head: 4n });
    const checking = checkChain({
      source,
      identity: identityOf(inMemoryBlock(0n)),
      cursor: inMemoryBlock(7n),
      configured: CONFIGURED,
      signal: signal(),
      onWaiting: (w) => waits.push(w),
    });
    await source.waiting(6n);
    expect(waits).toEqual([{ height: 7n, head: 4n }]);
    source.finalize(6n);
    await source.waiting(6n);
    expect(waits).toEqual([{ height: 7n, head: 4n }]);
    source.finalize(7n);
    expect((await checking).genesisHash).toEqual(inMemoryBlock(0n).hash);
    expect(waits).toEqual([{ height: 7n, head: 4n }, null]);
  });

  it("checks the hash at the cursor after the wait: a node that reached the cursor on another chain is refused", async () => {
    const forked: BlockRef = { ...inMemoryBlock(7n), hash: new Uint8Array(32).fill(1) };
    const source = new InMemoryBlockSource({ head: 4n, blocks: [forked] });
    const checking = checkChain({ source, identity: identityOf(inMemoryBlock(0n)), cursor: inMemoryBlock(7n), configured: CONFIGURED, signal: signal() });
    await source.waiting(6n);
    source.finalize(8n);
    expect(((await rejectionOf(checking)) as UmbraError).code).toBe("cursor-hash-mismatch");
  });

  it("stops waiting when its signal aborts, with the signal's reason, and says it no longer waits", async () => {
    const waits: (NodeWait | null)[] = [];
    const controller = new AbortController();
    const source = new InMemoryBlockSource({ head: 1n });
    const checking = checkChain({
      source,
      identity: identityOf(inMemoryBlock(0n)),
      cursor: inMemoryBlock(7n),
      configured: CONFIGURED,
      signal: controller.signal,
      onWaiting: (w) => waits.push(w),
    });
    await source.waiting(6n);
    const reason = new Error("stopping");
    controller.abort(reason);
    expect(await rejectionOf(checking)).toBe(reason);
    expect(waits).toEqual([{ height: 7n, head: 1n }, null]);
  });

  it("compares whole hashes: a genesis hash or a hash at the cursor that only begins like the stored one differs", async () => {
    const stored = identityOf(inMemoryBlock(0n));
    const shortGenesis: BlockRef = { ...inMemoryBlock(0n), hash: inMemoryBlock(0n).hash.slice(0, 31) };
    const source = () => new InMemoryBlockSource({ head: 9n, blocks: [shortGenesis] });
    // The configured network's genesis, then the stored one, each compared whole.
    for (const [configured, against] of [[CONFIGURED, "configured"], [configuredAs(shortGenesis), "stored"]] as const) {
      const genesis = await rejectionOf(
        checkChain({ source: source(), identity: stored, cursor: inMemoryBlock(7n), configured, signal: signal() }),
      );
      expect((genesis as UmbraError).code, against).toBe("genesis-mismatch");
      expect(Object.keys((genesis as UmbraError).details), against).toContain(against);
    }
    const shortAtCursor: BlockRef = { ...inMemoryBlock(7n), hash: inMemoryBlock(7n).hash.slice(0, 31) };
    const atCursor = await rejectionOf(
      checkChain({
        source: new InMemoryBlockSource({ head: 9n, blocks: [shortAtCursor] }),
        identity: stored,
        cursor: inMemoryBlock(7n),
        configured: CONFIGURED,
        signal: signal(),
      }),
    );
    expect((atCursor as UmbraError).code).toBe("cursor-hash-mismatch");
  });

  it("throws for a cursor without an identity row: a database whose core-chain recorded no identity", async () => {
    const error = await rejectionOf(
      checkChain({ source: new InMemoryBlockSource({ head: 9n }), identity: null, cursor: inMemoryBlock(7n), configured: CONFIGURED, signal: signal() }),
    );
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(UmbraError);
    expect((error as Error).message).toMatch(/core_chain\.identity/);
  });

  it("compares the node's genesis hash with the configured network's at every start, on a new database too (Q120)", async () => {
    for (const cursor of [null, inMemoryBlock(7n)]) {
      const waits: (NodeWait | null)[] = [];
      // The head below the cursor: the configured network's genesis is compared first, before any wait.
      const source = new InMemoryBlockSource({ head: 3n, blocks: [OTHER_GENESIS] });
      const identity = cursor === null ? null : identityOf(inMemoryBlock(0n));
      const error = (await rejectionOf(
        checkChain({ source, identity, cursor, configured: CONFIGURED, signal: signal(), onWaiting: (w) => waits.push(w) }),
      )) as UmbraError;
      expect(error).toBeInstanceOf(UmbraError);
      expect(error.code).toBe("genesis-mismatch");
      expect(error.retryable).toBe(false);
      expect(error.details).toEqual({ network: "custom", configured: hex(inMemoryBlock(0n).hash), node: hex(OTHER_GENESIS.hash) });
      expect(error.message).toContain(hex(inMemoryBlock(0n).hash));
      expect(error.message).toContain(hex(OTHER_GENESIS.hash));
      expect(error.message).toContain("custom");
      expect(waits).toEqual([]);
    }
    // A known network's genesis, as its built-in table holds it: a mainnet configuration against a preprod node.
    const preprod = builtInNetwork("preprod")?.genesis?.hash as string;
    const preprodNode = new InMemoryBlockSource({ head: 3n, blocks: [{ ...OTHER_GENESIS, hash: Buffer.from(preprod.slice(2), "hex") }] });
    const mainnet = configuredGenesisOf({ network: "mainnet" });
    const known = (await rejectionOf(
      checkChain({ source: preprodNode, identity: null, cursor: null, configured: mainnet, signal: signal() }),
    )) as UmbraError;
    expect(known.code).toBe("genesis-mismatch");
    expect(known.details).toEqual({ network: "mainnet", configured: builtInNetwork("mainnet")?.genesis?.hash, node: preprod });
    expect(known.message).toContain("mainnet");
  });

  it("checks the configured network's genesis first, then the stored one, then waits, then the hash at the cursor", async () => {
    // Another genesis than both: the configured network's is named.
    const both = (await rejectionOf(
      checkChain({
        source: new InMemoryBlockSource({ head: 3n, blocks: [OTHER_GENESIS] }),
        identity: identityOf(inMemoryBlock(0n)),
        cursor: inMemoryBlock(7n),
        configured: CONFIGURED,
        signal: signal(),
      }),
    )) as UmbraError;
    expect(both.details).toEqual({ network: "custom", configured: hex(inMemoryBlock(0n).hash), node: hex(OTHER_GENESIS.hash) });
    // The configured network's genesis, not the stored one: the stored one is named, before any wait.
    const waits: (NodeWait | null)[] = [];
    const stored = (await rejectionOf(
      checkChain({
        source: new InMemoryBlockSource({ head: 3n }),
        identity: identityOf(OTHER_GENESIS),
        cursor: inMemoryBlock(7n),
        configured: CONFIGURED,
        signal: signal(),
        onWaiting: (w) => waits.push(w),
      }),
    )) as UmbraError;
    expect(stored.details).toEqual({ stored: hex(OTHER_GENESIS.hash), node: hex(inMemoryBlock(0n).hash) });
    expect(waits).toEqual([]);
  });

  it("refuses a known network whose built-in table records no genesis hash, before asking the node (Q117)", async () => {
    let asked = 0;
    const source = new InMemoryBlockSource({ head: 9n });
    const counting = {
      finalizedHead: () => source.finalizedHead(),
      waitForHead: (above: bigint, s: AbortSignal) => source.waitForHead(above, s),
      block: (height: bigint) => {
        asked += 1;
        return source.block(height);
      },
    };
    for (const cursor of [null, inMemoryBlock(7n)]) {
      const error = (await rejectionOf(
        checkChain({
          source: counting,
          identity: cursor === null ? null : identityOf(inMemoryBlock(0n)),
          cursor,
          configured: { network: "stagenet", hash: null },
          signal: signal(),
        }),
      )) as UmbraError;
      expect(error).toBeInstanceOf(UmbraError);
      expect(error.code).toBe("genesis-mismatch");
      expect(error.details).toEqual({ network: "stagenet", configured: null });
      expect(error.message).toMatch(/records no genesis hash for the network stagenet/);
    }
    expect(asked).toBe(0);
  });

  it("waitForNode waits for S on a new database: not at all when the head is at or above it", async () => {
    const waits: (NodeWait | null)[] = [];
    const source = new InMemoryBlockSource({ head: 5n });
    await waitForNode(source, 5n, signal(), (w) => waits.push(w));
    await waitForNode(source, 0n, signal(), (w) => waits.push(w));
    expect(waits).toEqual([]);
    const waiting = waitForNode(source, 9n, signal(), (w) => waits.push(w));
    await source.waiting(8n);
    expect(waits).toEqual([{ height: 9n, head: 5n }]);
    source.finalize(9n);
    await waiting;
    expect(waits).toEqual([{ height: 9n, head: 5n }, null]);
  });
});

describe("the configured network's genesis hash (IN-3; decision records Q117, Q120; task 10.2a)", () => {
  const bytes = (text: string): Uint8Array => new Uint8Array(Buffer.from(text.slice(2), "hex"));

  it("is the core entry's genesisHash for a custom network", () => {
    const given = `0x${"ab".repeat(32)}`;
    const configured = configuredGenesisOf({ network: "custom", genesisHash: given });
    expect(configured).toEqual({ network: "custom", hash: bytes(given) });
    expect(Object.isFrozen(configured)).toBe(true);
  });

  it("is the built-in table's for each known network, read through task 12.2's table; every one has it in this build", () => {
    for (const network of KNOWN_NETWORKS) {
      const recorded = builtInNetwork(network)?.genesis?.hash;
      // Task 0.3 recorded every known network's genesis from its node (src/ledger/networks.json), so Q117's refusal
      // applies to none of them in this build.
      expect(recorded, network).toMatch(/^0x[0-9a-f]{64}$/);
      expect(configuredGenesisOf({ network }), network).toEqual({ network, hash: bytes(recorded as string) });
    }
  });

  it("is null for a known network whose built-in table records no genesis hash, or that has no built-in entry", () => {
    // A networks file of 12.2's format whose stagenet entry records no genesis hash yet (as before task 0.3).
    const file = structuredClone(networksFile) as { networks: { network: string; genesis: unknown }[] };
    for (const entry of file.networks) if (entry.network === "stagenet") entry.genesis = null;
    const networks = parseNetworksFile(file);
    const lookup = (network: string) => networks.find((entry) => entry.network === network) ?? null;
    expect(configuredGenesisOf({ network: "stagenet" }, lookup)).toEqual({ network: "stagenet", hash: null });
    expect(configuredGenesisOf({ network: "mainnet" }, lookup).hash).toEqual(bytes(builtInNetwork("mainnet")?.genesis?.hash as string));
    expect(configuredGenesisOf({ network: "preview" }, () => null)).toEqual({ network: "preview", hash: null });
    // A known network's genesis is the build's only: never a genesisHash (which the configuration refuses there, CF-4).
    expect(configuredGenesisOf({ network: "stagenet", genesisHash: `0x${"cd".repeat(32)}` }, lookup)).toEqual({ network: "stagenet", hash: null });
    expect(configuredGenesisOf({ network: "mainnet", genesisHash: `0x${"cd".repeat(32)}` }).hash).toEqual(
      bytes(builtInNetwork("mainnet")?.genesis?.hash as string),
    );
  });
});

/** A database started as the runner starts one, with the real `core-chain` bound to its context. */
interface ChainStarted {
  readonly db: Database;
  readonly graph: ResolvedGraph;
  readonly contexts: ProcessContexts;
  readonly facts: CoreChainFacts;
  readonly binding: ReturnType<typeof bindCoreChain>;
  /** Closes what the test made for it: the node client (the process closes its own, task 10.3). */
  close(): Promise<void>;
}

/** The `core` revision's ledger table in effect the tests give `core-chain` (task 12.2's preprod table, LG-3). */
const LEDGER_TABLE: LedgerTable = ledgerTableOf("preprod", undefined);

/** The configuration of the chain's tests: a `core` entry from each of `starts` (S is the lowest). */
function configOf(declarations: DeclarationSet<ModuleDeclaration>, starts: readonly bigint[] = [S]): CheckedConfig {
  const entries = starts.map((start) => core("pglite:memory", Number(start)));
  return validateConfig({ config: { data: plainData({ entries }) }, declarations, side: "public" });
}

/**
 * The runner's startup up to the seal (task 5.3's order): the history checked, the graph, the contexts, `core-chain`
 * bound with `facts` (the source's genesis hash unless given), `startDatabase`, the seal.
 */
async function startChain(
  db: Database,
  options: {
    readonly starts?: readonly bigint[];
    readonly genesis?: Uint8Array;
    readonly node?: boolean;
    readonly backbone?: readonly ModuleDeclaration[];
  } = {},
): Promise<ChainStarted> {
  const set = chainDeclarations([]);
  const declarations = validateDeclarations(options.backbone === undefined ? set : { ...set, backbone: [...options.backbone] });
  const config = configOf(declarations, options.starts ?? [S]);
  const { cursor, history } = await db.read(async (read) => ({ cursor: await readCursor(read), history: await readHistory(read) }));
  const check = checkHistory({ config, cursor: cursor?.height ?? null, declarations, history });
  const graph = resolveGraph(graphInputOf(check, declarations));
  const contexts = new ProcessContexts({ graph });
  const facts: CoreChainFacts = {
    config,
    declarations,
    cursor: cursor?.height ?? null,
    db,
    start: BigInt(config.start),
    genesisHash: options.genesis ?? inMemoryBlock(0n).hash,
    nodeClient: options.node === false ? null : new NodeClient({ url: NODE, backoffCeilingMs: 30_000 }),
    ledgerTable: LEDGER_TABLE,
  };
  const binding = bindCoreChain(contexts.of(CORE_CHAIN_ID), facts);
  // core-block-fetch puts the in-memory source's block items (task 10.3): every in-memory source gives the same ones.
  if (graph.modules.some((part) => part.id === CORE_BLOCK_FETCH_ID)) {
    bindCoreBlockFetch(contexts.of(CORE_BLOCK_FETCH_ID), new InMemoryBlockSource({ head: 0n }));
  }
  await startDatabase(db, {
    plan: schemaPlan(graph.modules),
    parts: graph.modules.map((part) => contexts.startDbPart(part)),
    committedVersions: check.committedVersions,
    handles: { height: cursor?.height ?? null },
  });
  contexts.seal();
  return { db, graph, contexts, facts, binding, close: async () => facts.nodeClient?.close() };
}

/** Runs the finalized loop of `started` over `source` until it waits above `head`. */
async function runTo(started: ChainStarted, source: InMemoryBlockSource, head: bigint): Promise<void> {
  const controller = new AbortController();
  const loop = new FinalizedLoop({
    db: started.db,
    graph: started.graph,
    plan: schemaPlan(started.graph.modules),
    source,
    contextOf: (id) => started.contexts.of(id),
    misuses: started.contexts,
    signal: controller.signal,
  });
  const running = loop.run();
  try {
    await Promise.race([source.waiting(head), running]);
  } finally {
    controller.abort();
  }
  await running;
}

const identityRow = (db: Database) =>
  db.read((read) => read.query("SELECT id, genesis_hash, start_height, anchor_hash, xmin::text AS x FROM core_chain.identity"));

describe.each(BACKENDS)("core-chain bound to a process on $name", (backend: TestBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("creates core_chain.identity as the login (migration 002), one row at most, readable by every module role", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const started = await startChain(db);
    const shape = await db.read((read) =>
      read.query(
        "SELECT column_name AS c, data_type AS type, is_nullable AS nullable FROM information_schema.columns " +
          "WHERE table_schema = 'core_chain' AND table_name = 'identity' ORDER BY ordinal_position",
      ),
    );
    expect(shape).toEqual([
      { c: "id", type: "smallint", nullable: "NO" },
      { c: "genesis_hash", type: "bytea", nullable: "NO" },
      { c: "start_height", type: "bigint", nullable: "NO" },
      { c: "anchor_hash", type: "bytea", nullable: "YES" },
    ]);
    const checks = await db.read((read) =>
      read.query(
        "SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'core_chain.identity'::regclass " +
          "AND contype IN ('p', 'c') ORDER BY 1",
      ),
    );
    expect(checks.map((row) => row.def)).toEqual([
      "CHECK ((id = 1))",
      "CHECK ((octet_length(anchor_hash) = 32))",
      "CHECK ((octet_length(genesis_hash) = 32))",
      "CHECK ((start_height >= 0))",
      "PRIMARY KEY (id)",
    ]);
    const [{ login, owner }] = (await db.read((read) =>
      read.query(
        "SELECT current_user AS login, tableowner AS owner FROM pg_tables WHERE schemaname = 'core_chain' AND tablename = 'identity'",
      ),
    )) as [{ login: string; owner: string }];
    expect(owner).toBe(login);
    expect(
      await db.read((read) => read.query("SELECT module, migration_id FROM core_chain.migrations WHERE module = 'core-chain' ORDER BY position")),
    ).toEqual([
      { module: "core-chain", migration_id: "001" },
      { module: "core-chain", migration_id: "002" },
    ]);
    // A module role reads it (DB-6: the database API's default privileges on core_chain), never writes it.
    const role = schemaPlan(started.graph.modules).writeRole("core-block-commit");
    const asRole = await db.transaction(async (tx) => {
      await tx.execute(`SET LOCAL ROLE ${role}`);
      return tx.query("SELECT count(*)::int AS n FROM core_chain.identity");
    });
    expect(asRole).toEqual([{ n: 1 }]);
    await started.close();
  }, 120_000);

  it("records the genesis hash and S on a new database, the anchor still null, in its on-start-db (IN-2)", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const started = await startChain(db);
    const [row] = await identityRow(db);
    expect(row).toMatchObject({ id: 1, genesis_hash: inMemoryBlock(0n).hash, start_height: S, anchor_hash: null });
    expect(await db.read((read) => readIdentity(read))).toEqual({ genesisHash: inMemoryBlock(0n).hash, start: S, anchorHash: null });
    expect(Object.isFrozen(await db.read((read) => readIdentity(read)))).toBe(true);
    // The history was recorded in the same callback (CF-6): the core entry's row.
    expect((await db.read((read) => readHistory(read))).map((h) => [h.id, h.start])).toEqual([["core", S]]);
    await started.close();
  }, 120_000);

  it("reads no identity before the table exists, nor while it holds no row", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    expect(await db.read((read) => readIdentity(read))).toBeNull();
    const { db: empty } = await backend.database(`CREATE SCHEMA core_chain; ${IDENTITY_MIGRATION.sql}`, cursorHeight);
    expect(await empty.read((read) => readIdentity(read))).toBeNull();
  }, 60_000);

  it("repeats an interrupted bootstrap: before block S commits, a new start records the genesis hash and S again", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const first = await startChain(db);
    await first.close();
    // Another node's genesis, and S moved down by a core revision from 3: nothing was processed yet, so the bootstrap
    // is repeated (IN-2), not refused (IN-3 compares the genesis hash on a database with a cursor).
    const second = await startChain(db, { genesis: OTHER_GENESIS.hash, starts: [3n, S] });
    const [row] = await identityRow(db);
    expect(row).toMatchObject({ genesis_hash: OTHER_GENESIS.hash, start_height: 3n, anchor_hash: null });
    await second.close();
  }, 120_000);

  it("records the anchor hash in block S's own transaction, writing nothing at any other height (IN-2, CD-1)", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const started = await startChain(db);
    const source = new InMemoryBlockSource({ head: S });
    await runTo(started, source, S);
    const [row] = await identityRow(db);
    const [block] = await db.read((read) =>
      read.query("SELECT xmin::text AS x FROM core_block_commit.blocks WHERE height = $1", [S]),
    );
    expect(row).toMatchObject({ genesis_hash: inMemoryBlock(0n).hash, start_height: S, anchor_hash: inMemoryBlock(S).hash });
    expect(row?.x).toBe(block?.x);
    // Later heights leave the row as it is.
    source.finalize(S + 3n);
    await runTo(started, source, S + 3n);
    const [after] = await identityRow(db);
    expect(after).toEqual(row);
    await started.close();
  }, 120_000);

  it("leaves the identity unchanged at a start on a database with a cursor", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const first = await startChain(db);
    await runTo(first, new InMemoryBlockSource({ head: S + 1n }), S + 1n);
    await first.close();
    const [before] = await identityRow(db);
    const second = await startChain(db);
    expect(await identityRow(db)).toEqual([before]);
    await second.close();
  }, 120_000);

  it("fails block S when the identity holds an anchor already, or no row, rather than overwrite it", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const started = await startChain(db);
    await db.transaction((tx) => tx.execute("UPDATE core_chain.identity SET anchor_hash = $1", [new Uint8Array(32).fill(4)]));
    const error = await rejectionOf(runTo(started, new InMemoryBlockSource({ head: S }), S));
    expect((error as Error).message).toMatch(/anchor/);
    expect(await db.read((read) => readCursor(read))).toBeNull();
    await started.close();
  }, 120_000);

  it("publishes config, node-client, db read-only and ledger-table from its on-start-db, once (MD-7, CD-1, A144)", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    const started = await startChain(db);
    const items = started.contexts.of(CORE_CHAIN_ID).items;
    expect([...items.keys()]).toEqual(["config", "node-client", "db", "ledger-table"]);
    expect(items.get("config")).toBe(started.facts.config);
    expect(items.get("node-client")).toBeInstanceOf(NodeClient);
    expect(items.get("node-client")).toBe(started.binding.nodeClient);
    expect(items.get("node-client")).toBe(started.facts.nodeClient);
    // The core revision's table in effect, as the process gives it (task 10.3; 12.2's note (c)).
    expect(items.get("ledger-table")).toBe(LEDGER_TABLE);
    const item = items.get("db") as object;
    expect(readOnlyProblems(item, db)).toEqual([]);
    expect(Object.isFrozen(item)).toBe(true);
    expect(await (item as { read: Database["read"] }).read(async (read) => read.height)).toBeNull();
    // The published client is the very one given: closed by its owner, its calls end with handle-closed.
    await started.close();
    expect(await rejectionOf((items.get("node-client") as NodeClient).finalizedHead())).toMatchObject({ code: "handle-closed" });
  }, 120_000);

  it("publishes no node client for a process without a node (a private process, CF-4)", async () => {
    const { db } = await backend.database("SELECT 1", cursorHeight);
    // A backbone of core-chain alone: no core-block-fetch, which would require the node client (process-item-missing).
    const started = await startChain(db, { node: false, backbone: [CORE_CHAIN] });
    expect([...started.contexts.of(CORE_CHAIN_ID).items.keys()]).toEqual(["config", "db", "ledger-table"]);
    expect(started.binding.nodeClient).toBeNull();
    await started.close();
  }, 120_000);
});

describe("core-chain outside a process", () => {
  it("fails its on-start-db and on-db-write with a clear error when no runner bound it", async () => {
    const context = Object.freeze({ items: new Map(), revisions: [], publish: () => undefined });
    const handle = { height: null, query: async () => [], execute: async () => 0 };
    const startDb = CORE_CHAIN.points["on-start-db"] as NonNullable<typeof CORE_CHAIN.points["on-start-db"]>;
    const dbWrite = CORE_CHAIN.points["on-db-write"] as NonNullable<typeof CORE_CHAIN.points["on-db-write"]>;
    const block = Object.freeze({ ...inMemoryBlock(S), items: new Map(), settings: {}, active: () => true });
    for (const run of [() => startDb.call(CORE_CHAIN.points, context, handle), () => dbWrite.call(CORE_CHAIN.points, context, block, handle)]) {
      expect(((await rejectionOf(run())) as Error).message).toMatch(/bindCoreChain/);
    }
  });

  it("is bound once per process context", () => {
    const context = Object.freeze({ items: new Map(), revisions: [], publish: () => undefined });
    const facts = { nodeClient: null } as unknown as CoreChainFacts;
    const binding = bindCoreChain(context, { ...facts, db: { read: async () => undefined } as unknown as Database });
    expect(binding.nodeClient).toBeNull();
    expect(() => bindCoreChain(context, { ...facts, db: { read: async () => undefined } as unknown as Database })).toThrow(/once/);
  });
});
