import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { CORE_LEDGER_STATE_MIGRATIONS } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { spawnChild } from "../child-processes.js";
import { NETWORK_ID, RAW, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf } from "../runner/process-build.js";
import { committed, genesisOf, halted, ingest, PATIENCE_MS, watched, watcher } from "./ingest-harness.js";
import { a107Problems } from "./ledger-checks.js";
import { cappedAt, LEDGER_CORE, recordingLoads, restartAt, type SeenLoad } from "./ledger-restart.js";
import type { RestartEvent, RestartJob } from "./ledger-restart.worker.js";
import {
  a100Problems,
  a102Problems,
  a104KeyProblems,
  a104Scenario,
  contractNodeKeys,
  heldNodeProblems,
  loaded,
  retentionSeen,
  retentionWatcher,
  wholeStateProblems,
} from "./ledger-storage-checks.js";
import { type LedgerScenario, ledgerScenario, type LedgerTx, RUNTIME_2_1 } from "./ledger-tapes.js";
import { sweepTables, sweepWatcher, type TableSnapshot } from "./sweep-tapes.js";

/**
 * `core-ledger-state`'s stored state through the real process (task 12.4; `openspec/changes/core-arch/acceptance.md`
 * A100, A102, A103, A104; LG-9, LG-11, LG-12, LG-13), on PostgreSQL 18 and PGlite 0.5.10: `startProcess` with the
 * backbone over the node source, the ledger's core modules from genesis and the ledger in its worker thread, against a
 * tape node serving the synthetic tapes of `./ledger-tapes.ts` (real ledger transactions; the node's roots the reference
 * replay's, which converts at an upgrade as the node does).
 *
 * - A100 (LG-9): a v8 range whose runtime upgrade's F has no transaction, and one whose F has one: the state converted
 *   before F's apply, every root the node's.
 * - A102 (LG-11): a process killed with SIGKILL at the upgrade's U and restarted loads the state at U from the database
 *   (the node's root), converts it at F and goes on with every root the node's; a stored node changed under its key
 *   fails the restart's read; `[STATIC]` the tables are design §10's node layout, and no stored value is a whole state.
 * - A103 (LG-12): a revision raising `retainStates` fills the window from its start, one lowering it releases the
 *   states leaving the window in its first block; `retainStates` 1,000 at cursor 5,000 — the state at 4,000 loads,
 *   3,999 fails with `state-not-retained` — is `ledger-window.test.ts` (5,000 blocks once, on PGlite, and PostgreSQL
 *   from its backup: task 12.5a, owner decision Q122).
 * - A104 (LG-13; tasks 12.4, 12.5): with `retainStates` 0 a contract's state and zswap-state keys persisted at 10 stay
 *   held after the contract changed at 20, every state holding them was released and two sweep cycles completed, and
 *   load from their keys alone (the run without persisting them is `ledger-sweep.negative-control.test.ts`'s).
 */

const WORKER = fileURLToPath(new URL("./ledger-restart.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** `ingest` with the ledger's core modules from genesis. */
function run(db: ProcessDatabase, records: readonly TapeRecord[], options: Omit<Parameters<typeof ingest>[2], "start" | "core"> & { core?: readonly ModuleDeclaration[] } = {}) {
  return ingest(db, records, { start: 0n, core: options.core ?? LEDGER_CORE, ...options });
}

/** Runs `records` to `head` and stops; the status as it was at the head. */
async function runTo(db: ProcessDatabase, records: readonly TapeRecord[], head: bigint, options: Parameters<typeof run>[2] = {}) {
  const process = await run(db, records, options);
  let status;
  try {
    await committed(process, head, PATIENCE_MS * 4);
    status = process.handle.status();
  } finally {
    await process.close();
  }
  return { ...process, status };
}

/** The upgrade scenario: v8 from genesis to U = 3, F = 4 built by runtime 2.1 (v9), then v9 to 7. */
async function upgradeScenario(f: readonly LedgerTx[] = []): Promise<LedgerScenario> {
  const v8 = (): LedgerTx => ({ bytes: zswapOutputTransaction(RAW.v8), kind: "regular" });
  const v9 = (): LedgerTx => ({ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" });
  return ledgerScenario({
    ledger: "v8",
    genesis: RAW.v8.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks: [[], [v8()], [], [v8()], [...f], [v9()], [], [v9()]],
    upgrade: { at: 4, runtime: RUNTIME_2_1 },
  });
}

/**
 * Runs the worker process on `db` against a tape node serving `records` up to `cursor`, and kills it with SIGKILL once
 * its cursor is there (see `./ledger-restart.worker.ts`).
 */
async function killedAt(db: ProcessDatabase, records: readonly TapeRecord[], cursor: bigint): Promise<NodeJS.Signals | null> {
  const node = await TapeNode.start({ records: cappedAt(records, cursor) });
  const directory = mkdtempSync(join(tmpdir(), "umbradb-ledger-restart-"));
  let child: ChildProcess | undefined;
  try {
    const configFile = join(directory, "umbradb.config.ts");
    const genesisHash = genesisOf(records) as string;
    const entries = [
      core(db.setting, 0, { extra: { node: node.url, genesisHash } }),
      ...LEDGER_CORE.map((module) => entryOf(module, 0)),
      entryOf(watcher(watched()), 0),
    ];
    writeFileSync(configFile, `export default ${JSON.stringify({ entries })};\n`);
    const job: RestartJob = { configFile, cursor: `${cursor}` };
    child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] });
    const events: RestartEvent[] = [];
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    createInterface({ input: child.stdout as NodeJS.ReadableStream }).on("line", (line) => {
      if (line.startsWith("{")) events.push(JSON.parse(line) as RestartEvent);
    });
    const exited = once(child, "close");
    const deadline = Date.now() + PATIENCE_MS;
    while (!events.some((event) => event.event === "at")) {
      if (child.exitCode !== null || Date.now() > deadline || events.some((event) => event.event === "ended")) {
        throw new Error(`the worker never reached ${cursor}: events ${JSON.stringify(events)}; stderr ${stderr.slice(-2000)}`);
      }
      await sleep(20);
    }
    child.kill("SIGKILL");
    await Promise.race([exited, sleep(PATIENCE_MS)]);
    return child.signalCode;
  } finally {
    if (child !== undefined && child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    await node.close();
    rmSync(directory, { recursive: true, force: true });
  }
}

describe.each(PROCESS_BACKENDS)("core-ledger-state's stored state through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A100: the state is converted before F is applied, and F's root is the node's, when F has no transactions", async () => {
    const scenario = await upgradeScenario();
    const db = await backend.database();
    const process = await runTo(db, scenario.records, scenario.head);
    expect(await a100Problems(db, process.status, scenario, 4n)).toEqual([]);
    expect(await a107Problems(db, scenario)).toEqual([]);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("A100: … and when F has a transaction (v9, applied to the converted state)", async () => {
    const scenario = await upgradeScenario([{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }]);
    const db = await backend.database();
    const process = await runTo(db, scenario.records, scenario.head);
    expect(await a100Problems(db, process.status, scenario, 4n)).toEqual([]);
    expect(await a107Problems(db, scenario)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("A102 [FAULT]: killed with SIGKILL at U and restarted, the process loads the state at U from the database and every later root is the node's", async () => {
    const scenario = await upgradeScenario();
    const db = await backend.database();
    expect(await killedAt(db, scenario.records, 3n)).toBe("SIGKILL");
    expect((await db.query("SELECT max(height)::text AS h FROM core_ledger_state.states"))[0]?.h).toBe("3");
    const loads: SeenLoad[] = [];
    const restarted = await runTo(db, restartAt(scenario.records, 3n), scenario.head, {
      ledgerWorker: () => recordingLoads(startLedgerWorker(), loads),
    });
    expect(await a102Problems(db, restarted.status, scenario, 3n, loads)).toEqual([]);
    expect(await a100Problems(db, restarted.status, scenario, 4n)).toEqual([]);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("A102: a stored node whose bytes no longer match its key fails the restart's read: callback-error in core-ledger-state, nothing of the block stored", async () => {
    const scenario = await upgradeScenario();
    const db = await backend.database();
    await runTo(db, cappedAt(scenario.records, 5n), 5n);
    // The state at the cursor's root node: one byte of its payload changed, its key left as it is.
    const changed = await db.query(
      `UPDATE core_ledger_state.nodes SET data = set_byte(data, 0, get_byte(data, 0) # 1)
       WHERE node_key = (SELECT state_key FROM core_ledger_state.states WHERE height = 5) RETURNING 1`,
    );
    expect(changed).toHaveLength(1);
    const process = await run(db, restartAt(scenario.records, 5n));
    let status;
    try {
      await halted(process);
      status = process.handle.status();
    } finally {
      await process.close();
    }
    expect(status).toMatchObject({ state: "halted", cursor: 5n, reason: { code: "callback-error", height: 6n, module: "core-ledger-state", point: "on-compute" } });
    expect(process.lines.some((line) => /processing halted \(callback-error\).*ledger worker/.test(line))).toBe(true);
    expect((await db.query("SELECT count(*)::text AS n FROM core_ledger_state.states WHERE height > 5"))[0]?.n).toBe("0");
  }, PATIENCE_MS * 4);

  it("A103: a revision raising retainStates fills the window from its start; one lowering it releases the leaving states in its first block", async () => {
    const scenario = await ledgerScenario({
      ledger: "v9",
      genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: false,
      blocks: Array.from({ length: 31 }, () => []),
      rootsOnly: true,
    });
    const db = await backend.database();
    const seen = retentionSeen();
    // Revisions: 2 to 9, 5 from 10, 1 from 20. At cursor 10, 6 is outside (released under 2) though 10 − 5 ≤ 6.
    const plan = new Map([
      [11n, [7n, 6n]],
      [21n, [19n, 18n]],
    ]);
    const process = await runTo(db, scenario.records, scenario.head, {
      settings: { retainStates: 2 },
      revisions: [
        { start: 10n, settings: { retainStates: 5 } },
        { start: 20n, settings: { retainStates: 1 } },
      ],
      user: [retentionWatcher(seen, plan, "all")],
    });
    expect(process.status).toMatchObject({ cursor: 30n, reason: null });
    expect(seen.loads.get(11n)).toEqual([loaded(scenario, 7n), "6 state-not-retained"]);
    expect(seen.loads.get(21n)).toEqual([loaded(scenario, 19n), "18 state-not-retained"]);
    const range = (from: number, to: number): bigint[] => Array.from({ length: to - from + 1 }, (_, i) => BigInt(from + i));
    expect(seen.held.get(9n)).toEqual(range(7, 9));
    expect(seen.held.get(10n)).toEqual(range(7, 10));
    expect(seen.held.get(12n)).toEqual(range(7, 12));
    expect(seen.held.get(13n)).toEqual(range(8, 13));
    expect(seen.held.get(19n)).toEqual(range(14, 19));
    expect(seen.held.get(20n)).toEqual(range(19, 20));
    expect(seen.held.get(29n)).toEqual(range(28, 29));
    // The sweep ran meanwhile (on by default) and deleted nothing a retained state reaches.
    expect((await sweepTables(db)).cycle).toBeGreaterThan(2n);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("A104: with retainStates 0, a contract's state and zswap-state keys stored at 10 still load from their keys after it changed at 20, its states were released and two sweep cycles completed", async () => {
    const { scenario, contract } = await a104Scenario();
    const db = await backend.database();
    const sweeps = new Map<bigint, TableSnapshot>();
    const process = await runTo(db, scenario.records, scenario.head, { core: [...LEDGER_CORE, CORE_CONTRACT_STATES], user: [sweepWatcher(sweeps)] });
    expect(process.status).toMatchObject({ cursor: 40n, reason: null });
    // The rows of 10 and 20; the keys of 10 held, loading from their keys alone, no held state holding the state of 10.
    expect((await db.query("SELECT height::text AS h FROM core_contract_states.states ORDER BY height")).map((r) => r.h)).toEqual(["5", "10", "20"]);
    expect(await a104KeyProblems(db, scenario, contract.address, 10n)).toEqual([]);
    expect(await a104KeyProblems(db, scenario, contract.address, 5n)).toEqual([]);
    // Two sweep cycles at least completed after the states holding C's state of 10 were released (block 20 released 19).
    const at20 = sweeps.get(20n) as TableSnapshot;
    const end = await sweepTables(db);
    const completed = end.cycle - at20.cycle - (end.phase === "idle" ? 0n : 1n) + (at20.phase === "idle" ? 0n : 1n);
    expect(completed).toBeGreaterThanOrEqual(2n);
    // The sweep deleted nodes — every one stored at some cursor is no longer — and none a held key reaches.
    const ever = new Set([...sweeps.values()].flatMap((tables) => tables.nodes));
    expect(ever.size).toBeGreaterThan(end.nodes.length);
    expect(await heldNodeProblems(db)).toEqual([]);
    // The nodes of C's state of 10 that the ledger state stored as rows of their own are stored still (the run without
    // persisting the keys, where the sweep deletes them, is the negative control).
    const stored = new Set(end.nodes);
    const rows = [...contractNodeKeys(scenario, contract.address, 10n)].filter((key) => ever.has(key));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.filter((key) => !stored.has(key))).toEqual([]);
  }, PATIENCE_MS * 4);
});

describe("A102 [STATIC]: core-ledger-state's tables are the node layout of design §10, and no table stores a whole serialized state", () => {
  const DESIGN = fileURLToPath(new URL("../../openspec/changes/core-arch/design.md", import.meta.url));

  /** The columns design §10's table rows give each `core_ledger_state` table (the key's, then the others'). */
  function designColumns(): Map<string, string[]> {
    const tables = new Map<string, string[]>();
    for (const line of readFileSync(DESIGN, "utf8").split("\n")) {
      const cells = line.split("|").map((cell) => cell.trim());
      if (cells[1] !== "`core-ledger-state`") continue;
      const names = [...(cells[2] as string).matchAll(/`core_ledger_state\.([a-z_]+)`/g)].map((m) => m[1] as string);
      const key = (cells[3] as string).replace(/[()]/g, "").replace(/ = 1$/, "").split(",").map((c) => c.trim()).filter((c) => /^[a-z_]+$/.test(c));
      const others = (cells[4] as string) === "—" ? [] : (cells[4] as string).split(" — ")[0]!.split(/,(?![^(]*\))/).map((c) => /^\s*([a-z_]+)/.exec(c)?.[1]).filter((c): c is string => c !== undefined);
      for (const name of names) tables.set(name, [...key, ...others]);
    }
    return tables;
  }

  /** The columns `core-ledger-state`'s migrations create in each table. */
  function migrationColumns(): Map<string, string[]> {
    const tables = new Map<string, string[]>();
    for (const { sql } of CORE_LEDGER_STATE_MIGRATIONS) {
      for (const match of sql.matchAll(/CREATE TABLE core_ledger_state\.([a-z_]+) \(([\s\S]*?)\n\)/g)) {
        const columns = (match[2] as string).split("\n").map((l) => /^\s*([a-z_]+) [a-z]/.exec(l)?.[1]).filter((c): c is string => c !== undefined && c !== "check");
        tables.set(match[1] as string, columns.filter((c) => c !== "primary"));
      }
    }
    return tables;
  }

  it("creates every table of design §10 with exactly its columns; a node is its key, data and children, and a state its key and root", () => {
    const design = designColumns();
    const migrations = migrationColumns();
    expect([...migrations.keys()].sort()).toEqual([...design.keys()].sort());
    for (const [table, columns] of migrations) expect(new Set(columns), table).toEqual(new Set(design.get(table)));
    expect(migrations.get("nodes")).toEqual(["node_key", "data", "children"]);
    expect(migrations.get("states")?.filter((c) => c.startsWith("state"))).toEqual(["state_key", "state_root"]);
  });

  it("no source of the worker or of core-ledger-state serializes a ledger state whole", () => {
    const sources = ["src/ledger/worker/engine.ts", "src/ledger/worker/entry.ts", "src/ledger/worker/host.ts", "src/backbone/core-ledger-state/core-ledger-state.ts"];
    for (const file of sources) {
      const text = readFileSync(join(REPOSITORY, file), "utf8");
      expect(text, file).not.toMatch(/\.serialize\(\)/);
    }
    // The adapter serializes parameters and events, never a state (its genesis state is deserialized from the node's).
    const adapter = readFileSync(join(REPOSITORY, "src/ledger/adapter.ts"), "utf8");
    expect([...adapter.matchAll(/(\w+)\.serialize\(\)/g)].map((m) => m[1]).sort()).toEqual(["afterParameters", "event"]);
  });

  it("no stored value of a run is a whole serialized state (checked on the database A102's run leaves)", { timeout: PATIENCE_MS * 2 }, async () => {
    const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;
    await backend.start();
    try {
      const scenario = await upgradeScenario();
      const db = await backend.database();
      await runTo(db, scenario.records, scenario.head);
      expect(await wholeStateProblems(db)).toEqual([]);
      // The oracle finds one: a whole state written into a node's payload.
      const whole = RAW.v9.LedgerState.blank(NETWORK_ID).serialize();
      await db.query(
        `UPDATE core_ledger_state.nodes SET data = decode('${Buffer.from(whole).toString("hex")}', 'hex')
         WHERE node_key = (SELECT node_key FROM core_ledger_state.nodes ORDER BY node_key LIMIT 1)`,
      );
      expect(await wholeStateProblems(db)).toEqual(["core_ledger_state.nodes.data holds 1 whole serialized states"]);
    } finally {
      await backend.stop();
    }
  });
});
