import { z } from "zod";
import { type RetainedState, retainedStatesOf } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { childRefKeys } from "../../src/ledger/node-refs.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessStatus } from "../../src/runner/process.js";
import { callTransaction, cellValue, contractFixture, NETWORK_ID, RAW } from "../ledger/adapter-fixtures.js";
import { nodesOfTagged, rebuildTagged } from "../ledger/stored-values.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { CHAIN_START_MS, hex } from "./fetch-fixtures.js";
import type { SeenLoad } from "./ledger-restart.js";
import { type LedgerScenario, ledgerScenario, type LedgerTx } from "./ledger-tapes.js";

/**
 * The oracles of task 12.4's criteria (A100, A102, A103, A104), shared by `ledger-storage.test.ts` and its negative
 * controls: each reads the database after a process ran a scenario (`./ledger-tapes.ts`) and lists what differs from
 * what the scenario's chain and its reference replay hold — empty when the criterion holds. Imports nothing of Vitest.
 * The test modules here are what a module of a later task does with `core-ledger-state`'s items: a stand-in for task
 * 13.1's `core-contract-states` (LG-13), and a module loading retained states (LG-12).
 */

const text = (value: unknown): string => JSON.stringify(value, (_key, v: unknown) => (typeof v === "bigint" ? `${v}n` : v));
const plain = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytesOf = (value: unknown): Uint8Array => Uint8Array.from(Buffer.from(value as Uint8Array));

/** The stored roots that are not the node's, and the process not at the head: A99's oracle, `status` read before the stop. */
async function rootProblems(db: ProcessDatabase, status: ProcessStatus, scenario: LedgerScenario): Promise<string[]> {
  const problems: string[] = [];
  if (status.reason !== null) problems.push(`the process ${status.state} with ${text(status.reason)}`);
  if (status.cursor !== scenario.head) problems.push(`the cursor is ${status.cursor}, not ${scenario.head}`);
  const roots = await db.query("SELECT height::text AS h, encode(state_root, 'hex') AS root FROM core_ledger_state.states ORDER BY height");
  const differing = scenario.heights.filter((h) => roots[Number(h.height)]?.root !== plain(h.root)).map((h) => `${h.height}`);
  if (roots.length !== scenario.heights.length) problems.push(`core_ledger_state.states holds ${roots.length} rows, not ${scenario.heights.length}`);
  if (differing.length > 0) problems.push(`the stored roots at ${differing.join(", ")} are not the node's`);
  return problems;
}

/**
 * A100 (LG-9): a range across the v8 → v9 upgrade, F at `f`, reached its head with every root the node's — the root at
 * F the node's, which the state converted before F's apply gives — and the blocks' ledgers v8 below F, v9 from it.
 */
export async function a100Problems(db: ProcessDatabase, status: ProcessStatus, scenario: LedgerScenario, f: bigint): Promise<string[]> {
  const problems = await rootProblems(db, status, scenario);
  const ledgers = await db.query("SELECT height::text AS h, ledger_version AS l FROM core_block_commit.blocks ORDER BY height");
  const wrong = ledgers.filter((row) => (BigInt(row.h as string) < f ? "v8" : "v9") !== row.l).map((row) => row.h);
  if (wrong.length > 0) problems.push(`the blocks at ${wrong.join(", ")} carry another ledger than the upgrade at ${f} gives`);
  return problems;
}

/** The tagged serialization of the ledger state, as a whole state would be stored (`ledger-state[v…]:`). */
const WHOLE_STATE = Buffer.from("midnight:ledger-state", "latin1").toString("hex");

/**
 * A102 (LG-11): a process restarted at `cursor` loaded the state there from the database — its first load the state
 * at `cursor`, read from the store (`loaded`), with the stored root, which is the node's — and then reached the head
 * with every root the node's; no stored value of `core_ledger_state` is a whole serialized state.
 */
export async function a102Problems(
  db: ProcessDatabase,
  status: ProcessStatus,
  scenario: LedgerScenario,
  cursor: bigint,
  loads: readonly SeenLoad[],
): Promise<string[]> {
  const problems = await rootProblems(db, status, scenario);
  const first = loads[0];
  const at = scenario.heights[Number(cursor)];
  if (first === undefined) problems.push("the restarted process loaded no state");
  else {
    if (first.height !== cursor) problems.push(`the first load is of ${first.height}, not of the cursor ${cursor}`);
    if (!first.loaded) problems.push("the first load read nothing from the database");
    if (at !== undefined && plain(first.stateRoot) !== plain(at.root)) problems.push(`the loaded state's root is not the node's at ${cursor}`);
    if (at !== undefined && plain(first.stateKey) !== plain(at.stateKey)) problems.push(`the loaded state's key is not the one stored at ${cursor}`);
  }
  const later = loads.slice(1).filter((load) => load.loaded);
  if (later.length > 0) problems.push(`the state was read from the database again at ${later.map((l) => l.height).join(", ")}`);
  problems.push(...(await wholeStateProblems(db)));
  return problems;
}

/** Every `bytea` value of `core_ledger_state`'s tables that holds a whole serialized ledger state (LG-11's "SHALL NOT"). */
export async function wholeStateProblems(db: ProcessDatabase): Promise<string[]> {
  const columns = await db.query(
    `SELECT c.table_name AS t, c.column_name AS c FROM information_schema.columns c JOIN information_schema.tables t
       USING (table_schema, table_name)
     WHERE c.table_schema = 'core_ledger_state' AND c.data_type = 'bytea' AND t.table_type = 'BASE TABLE' ORDER BY 1, 2`,
  );
  const problems: string[] = [];
  for (const { t, c } of columns) {
    const [row] = await db.query(
      `SELECT count(*)::text AS n FROM core_ledger_state.${t as string} WHERE position(decode('${WHOLE_STATE}', 'hex') in ${c as string}) > 0`,
    );
    if (row?.n !== "0") problems.push(`core_ledger_state.${t as string}.${c as string} holds ${row?.n} whole serialized states`);
  }
  return problems;
}

/** The heights whose stored state key has a positive root count: the states held alive (LG-12). */
export async function heldHeights(read: { query(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]> }): Promise<bigint[]> {
  const rows = await read.query(
    `SELECT s.height::text AS h FROM core_ledger_state.states s JOIN core_ledger_state.root_counts r ON r.node_key = s.state_key
     ORDER BY s.height`,
  );
  return rows.map((row) => BigInt(row.h as string));
}

/** What the retention watcher saw: each planned load's outcome, and the states held at each cursor. */
export interface RetentionSeen {
  /** By the height of the `on-compute` that loaded (its read at h − 1, the cursor): `<height> <root hex>` or `<height> <code>`. */
  readonly loads: Map<bigint, string[]>;
  /** By cursor: the heights whose state is held. */
  readonly held: Map<bigint, readonly bigint[]>;
}

export function retentionSeen(): RetentionSeen {
  return { loads: new Map(), held: new Map() };
}

/**
 * A user module requiring `ledger-state` that, at the `on-compute` of each height `plan` names, loads the states at
 * the heights it lists through `core-ledger-state`'s function (LG-12) and records each outcome, and records the held
 * states at every cursor in `heldAt` (all of them when it is "all").
 */
export function retentionWatcher(seen: RetentionSeen, plan: ReadonlyMap<bigint, readonly bigint[]>, heldAt: ReadonlySet<bigint> | "all" = new Set()): ModuleDeclaration {
  return {
    id: "retain-watch",
    version: "1.0.0",
    side: "public",
    requires: ["ledger-state"],
    provides: [{ name: "retain-watch-rows", lifetimes: ["table"], table: { schema: "retain_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE retain_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(p, b, read) {
        const cursor = b.height - 1n;
        if (heldAt === "all" || heldAt.has(cursor)) seen.held.set(cursor, await heldHeights(read));
        const targets = plan.get(b.height);
        if (targets === undefined) return;
        const outcomes: string[] = [];
        for (const height of targets) {
          try {
            const state: RetainedState = await retainedStatesOf(p).load(height, read);
            outcomes.push(`${state.height} ${plain(state.stateRoot)}`);
          } catch (error) {
            outcomes.push(`${height} ${(error as { code?: string }).code ?? String(error)}`);
          }
        }
        seen.loads.set(b.height, outcomes);
      },
    },
  };
}

/** What a load of the state at `height` gives in `scenario`: its root. */
export const loaded = (scenario: LedgerScenario, height: bigint): string => `${height} ${plain(scenario.heights[Number(height)]?.root as Uint8Array)}`;

/** The id of task 13.1's module, which `core-ledger-state` persists contracts' keys for (LG-13). */
export const CONTRACT_STATES_ID = "core-contract-states";

/**
 * A stand-in for task 13.1's `core-contract-states` (CC-1, LG-13): a core module requiring `ledger-state` that stores,
 * at each block, the keys `core-ledger-state` persisted for the contracts the block touched (the `ledger-state` item's
 * `contracts`), one row per contract and height.
 */
export function contractStatesStandIn(): ModuleDeclaration {
  return {
    id: CONTRACT_STATES_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: ["ledger-state"],
    provides: [
      { name: "contract-states", lifetimes: ["table"], table: { schema: "core_contract_states", tables: ["states"], kind: "append-only" } },
    ],
    startsMidChain: false,
    configSchema: z.object({}),
    migrations: [
      {
        id: "001",
        sql: `CREATE TABLE core_contract_states.states (contract_address bytea NOT NULL, height bigint NOT NULL,
  state_key bytea NOT NULL, zswap_state_key bytea NOT NULL, PRIMARY KEY (contract_address, height))`,
      },
    ],
    points: {
      async "on-db-write"(_p, b, w) {
        const item = b.items.get("ledger-state") as { readonly contracts: readonly { address: Uint8Array; stateKey: Uint8Array | null; zswapStateKey: Uint8Array | null }[] };
        for (const contract of item.contracts) {
          if (contract.stateKey === null || contract.zswapStateKey === null) continue;
          await w.execute("INSERT INTO core_contract_states.states VALUES ($1, $2, $3, $4)", [contract.address, b.height, contract.stateKey, contract.zswapStateKey]);
        }
      },
    },
  };
}

/** The stored nodes, by `0x`-less hex key. */
async function storedNodes(db: ProcessDatabase): Promise<Map<string, { data: Uint8Array; children: Uint8Array }>> {
  const rows = await db.query("SELECT node_key, data, children FROM core_ledger_state.nodes");
  return new Map(rows.map((row) => [plain(bytesOf(row.node_key)), { data: bytesOf(row.data), children: bytesOf(row.children) }]));
}

/** The keys a key reaches through the stored nodes (itself included), and those of them not stored. */
function reach(nodes: ReadonlyMap<string, { children: Uint8Array }>, key: string): { reached: Set<string>; missing: string[] } {
  const reached = new Set<string>();
  const missing: string[] = [];
  const frontier = [key];
  while (frontier.length > 0) {
    const next = frontier.pop() as string;
    if (reached.has(next)) continue;
    reached.add(next);
    const node = nodes.get(next);
    if (node === undefined) missing.push(next);
    else for (const ref of childRefKeys(node.children)) frontier.push(plain(ref));
  }
  return { reached, missing };
}

/**
 * A104 (LG-13) as far as the keys go: contract `address`'s row of `core_contract_states.states` at `at`, its two keys
 * each held (a positive root count) though no retained ledger state holds the contract's state of `at` any more, and
 * each loads from its key alone — the value rebuilt from the stored nodes (`test/ledger/stored-values.ts`) is the
 * reference replay's contract state and zswap state at `at`, which the package deserializes.
 */
export async function a104KeyProblems(db: ProcessDatabase, scenario: LedgerScenario, address: Uint8Array, at: bigint): Promise<string[]> {
  const problems: string[] = [];
  const [row] = await db.query(
    `SELECT state_key, zswap_state_key FROM core_contract_states.states WHERE contract_address = decode('${plain(address)}', 'hex') AND height = ${at}`,
  );
  if (row === undefined) return [`core_contract_states.states holds no row of the contract at ${at}`];
  const expected = scenario.heights[Number(at)]?.contracts.get(hex(address));
  if (expected === undefined) return [`the scenario's state at ${at} holds no such contract`];
  const nodes = await storedNodes(db);
  const counts = new Map(
    (await db.query("SELECT encode(node_key, 'hex') AS k, count FROM core_ledger_state.root_counts")).map((r) => [r.k as string, Number(r.count)]),
  );
  const held = await heldHeights(db);
  for (const [name, key, value, tag] of [
    ["state", bytesOf(row.state_key), expected.state, "contract-state[v8]"],
    ["zswap state", bytesOf(row.zswap_state_key), expected.zswap, "zswap-ledger-state[v5]"],
  ] as const) {
    if ((counts.get(plain(key)) ?? 0) < 1) problems.push(`the contract's ${name} key at ${at} is not held`);
    const { missing } = reach(nodes, plain(key));
    if (missing.length > 0) problems.push(`the contract's ${name} at ${at} reaches ${missing.length} nodes not stored`);
    else {
      try {
        if (plain(rebuildTagged(tag, key, (k) => nodes.get(k))) !== plain(value)) problems.push(`the contract's ${name} at ${at} loads as another value`);
      } catch (error) {
        problems.push(`the contract's ${name} at ${at} does not load: ${String(error)}`);
      }
    }
  }
  // Released: the contract's state changed after `at`, and no state held alive holds its state of `at`.
  if (plain(scenario.heights[Number(scenario.head)]?.contracts.get(hex(address))?.state as Uint8Array) === plain(expected.state)) {
    problems.push(`the contract's state of ${at} is still its state at the head: nothing released it`);
  }
  const contractKey = plain(bytesOf(row.state_key));
  for (const height of held) {
    const stateKey = plain(scenario.heights[Number(height)]?.stateKey as Uint8Array);
    if (reach(nodes, stateKey).reached.has(contractKey)) problems.push(`the held state at ${height} still holds the contract's state of ${at}`);
  }
  return problems;
}

/**
 * Every node a held key reaches is stored (LG-11): what loads from the database, whatever the sweep deleted (task
 * 12.5). Empty when it holds.
 */
export async function heldNodeProblems(db: ProcessDatabase): Promise<string[]> {
  const nodes = await storedNodes(db);
  const roots = (await db.query("SELECT encode(node_key, 'hex') AS k FROM core_ledger_state.root_counts")).map((r) => r.k as string);
  const missing = new Set<string>();
  for (const root of roots) for (const key of reach(nodes, root).missing) missing.add(key);
  return [...missing].map((key) => `node ${key} is reached by a held key but not stored`);
}

/**
 * A call replacing a fixture contract's state with a cell of `size` bytes of `fill` (its guaranteed transcript), its
 * intent's TTL a minute after the block time of height `at` in the synthetic chains (`CHAIN_START_MS` + 6 s a height).
 */
function setState(contract: { address: Uint8Array; deploy: Uint8Array }, fill: number, size: number, at: number): Uint8Array {
  const program = [{ push: { storage: true, value: cellValue(new Uint8Array(size).fill(fill)) } }, { swap: { n: 0 } }, "pop"];
  return callTransaction(RAW.v9, contract, program as never, undefined, Number(CHAIN_START_MS) + at * 6_000 + 60_000);
}

/**
 * A104's scenario (LG-13; tasks 12.4, 12.5), `retainStates` 0: contract C deployed at 5, its state set at 10 to a cell
 * of 1,500 bytes — over the ledger's 1,024-byte embedding limit, so the ledger state holds it as a node of its own —,
 * set at 20 to another, then empty blocks to `last`.
 */
export async function a104Scenario(last = 40): Promise<{ readonly scenario: LedgerScenario; readonly contract: { address: Uint8Array } }> {
  const contract = await contractFixture(RAW.v9);
  const blocks: LedgerTx[][] = Array.from({ length: last + 1 }, () => []);
  blocks[5] = [{ bytes: contract.deploy, kind: "regular" }];
  blocks[10] = [{ bytes: setState(contract, 7, 1_500, 10), kind: "regular" }];
  blocks[20] = [{ bytes: setState(contract, 8, 1_500, 20), kind: "regular" }];
  const scenario = await ledgerScenario({
    ledger: "v9",
    genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks,
    contracts: [contract.address],
  });
  // The scenario is A104's: each call applied, so C's state changed at 10 and again at 20.
  for (const at of [5, 10, 20]) {
    const types = scenario.heights[at]?.types;
    if (types?.[0] !== "success") throw new Error(`a104Scenario: the transaction at ${at} is a ${types?.[0]}: a fixture problem`);
  }
  const of = (at: number): string => plain(scenario.heights[at]?.contracts.get(hex(contract.address))?.state as Uint8Array);
  if (of(10) === of(9) || of(20) === of(10) || of(40) !== of(20)) throw new Error("a104Scenario: C's state does not change at 10 and 20 only");
  return { scenario, contract };
}

/** The keys of every node of contract `address`'s state and zswap state after `at` in `scenario` (their serializations'). */
export function contractNodeKeys(scenario: LedgerScenario, address: Uint8Array, at: bigint): Set<string> {
  const values = scenario.heights[Number(at)]?.contracts.get(hex(address));
  if (values === undefined) throw new Error(`the scenario's state at ${at} holds no such contract`);
  return new Set([values.state, values.zswap].flatMap((value) => nodesOfTagged(value).nodes.map((node) => plain(node.key))));
}

/** The keys the held keys (`root_counts`) reach through the stored nodes. */
export async function heldReach(db: ProcessDatabase): Promise<Set<string>> {
  const nodes = await storedNodes(db);
  const roots = (await db.query("SELECT encode(node_key, 'hex') AS k FROM core_ledger_state.root_counts")).map((r) => r.k as string);
  const reached = new Set<string>();
  for (const root of roots) for (const key of reach(nodes, root).reached) reached.add(key);
  return reached;
}
