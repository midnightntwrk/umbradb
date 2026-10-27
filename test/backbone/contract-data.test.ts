import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_CONTRACT_LOGS_FAST } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { CORE_CONTRACT_LOGS_FULL } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { cellValue } from "../ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import {
  a109Scenario,
  a110HaltScenario,
  a110Range,
  bigCell,
  contractScenario,
  contractsFor,
  dataOf,
  decodedLog,
  FAST_CORE,
  FULL_CORE,
  haltProblems,
  linesBetween,
  LOG_STATE,
  logLines,
  logProblems,
  runRange,
  setState,
  stateProblems,
  stateRows,
  wrapper,
} from "./contract-data-checks.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import { cappedAt, LEDGER_CORE } from "./ledger-restart.js";

/**
 * Task 13.1's modules through the real process (`openspec/changes/core-arch/acceptance.md` A108, A109, A110;
 * `specs/contract-data/spec.md` CC-1 to CC-3), on PostgreSQL 18 and PGlite 0.5.10: `startProcess` with UmbraDB's
 * backbone over the node source against a tape node serving the synthetic scenarios of `./contract-data-checks.ts`
 * (real ledger transactions deploying fixture contracts and calling them with the transcripts the scenario writes), the
 * ledger in its worker thread for `core-ledger-state`, and each scenario's expectations written from its own
 * specification.
 *
 * - A108 (CC-1): two calls of one contract in one block give one `core_contract_states` row, with the state after both;
 *   at the v8 → v9 upgrade's F every contract gets a row with its converted keys; every key loads from the stored nodes.
 * - A109 (CC-2): `core-contract-logs-full` stores the logs of applied segments — a successful fallible segment's too —
 *   and none of a fallible segment that failed; none on ledger v8 (Q54).
 * - A110 (CC-3): a range of literal logs — well-formed wrappers, malformed ones (version-0 `Misc` logs), oversized ones
 *   (none), a successful fallible segment's, a chain-failed transaction's (none) — gives identical `contract_logs.logs`
 *   with `-full` and `-fast`, on both backends; a log of a value read from the contract's state, and any log of a
 *   partially successful transaction, make `-fast` halt with `fast-log-unsupported` at that height, naming the
 *   transaction, while `-full` stores them.
 *
 * On task 0.3's recorded devnet (`UMBRADB_TAPES`; skipped by name without it): every contract deployed, called or
 * maintained has its row at that height, every contract deployed on v8 its row at F (103), and `-fast` stores what
 * `-full` stores over the whole range.
 */

const describeBackends = describe.each(PROCESS_BACKENDS);

describeBackends("contract data through the process on $name (CC-1, CC-2, CC-3)", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A108: two calls of one contract in one block give one core_contract_states row, with the state after both; each key loads from the stored nodes", async () => {
    const [one, two] = await contractsFor("v9", 2);
    const expected = await contractScenario({
      ledger: "v9",
      blocks: [
        [{ kind: "deploy", contract: one! }, { kind: "deploy", contract: two! }],
        [
          { kind: "call", contract: one!, tail: setState(1) },
          { kind: "call", contract: one!, tail: setState(2) },
        ],
        [{ kind: "call", contract: two!, logs: [cellValue(Uint8Array.of(5))] }],
      ],
    });
    // The state after both calls is the second's, not the first's (the reference replay's).
    const reference = (height: number) => expected.scenario.heights[height]?.contracts.get(`0x${Buffer.from(one!.address).toString("hex")}`)?.state;
    expect(Buffer.from(reference(2)!).toString("hex")).not.toBe(Buffer.from(reference(1)!).toString("hex"));
    const db = await backend.database();
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: FULL_CORE });
    expect(await stateProblems(db, ran.status, expected)).toEqual([]);
    expect((await stateRows(db)).get(2n)).toHaveLength(1);
    expect(await heldNodeProblems(db)).toEqual([]);
  }, PATIENCE_MS * 2);

  it("A108: at the v8 → v9 upgrade's F every contract gets a row with its converted keys; v8 logs are not stored (Q54), v9 ones are, by -full and -fast alike", async () => {
    const [one, two] = await contractsFor("v8", 2);
    const logged = [cellValue(Uint8Array.of(7)), wrapper(1, 5, cellValue(Uint8Array.of(4)))];
    // A v9 call of a contract deployed on v8 (two, at 5): the scenario holds the process to the reference replay only.
    const expected = await contractScenario({
      ledger: "v8",
      upgradeAt: 4,
      rootsOnly: true,
      blocks: [
        [{ kind: "deploy", contract: one! }],
        [{ kind: "call", contract: one!, logs: logged, tail: LOG_STATE }],
        [{ kind: "deploy", contract: two! }],
        [],
        [{ kind: "call", contract: two!, logs: logged }],
      ],
    });
    // Deployed at 1 and at U (3); at F (4) both get a row.
    expect([...expected.states.keys()]).toEqual([1n, 2n, 3n, 4n, 5n]);
    expect(expected.states.get(4n)).toHaveLength(2);
    expect(linesBetween(expected.logs, 0n, 3n)).toEqual([]);
    expect(linesBetween(expected.logs, 5n, 5n)).toHaveLength(2);
    const db = await backend.database();
    const full = await runRange(db, expected.scenario.records, expected.scenario.head, { core: FULL_CORE });
    expect(await stateProblems(db, full.status, expected)).toEqual([]);
    expect(await logProblems(db, full.status, expected)).toEqual([]);
    const fast = await backend.database();
    const ran = await runRange(fast, expected.scenario.records, expected.scenario.head, { core: FAST_CORE });
    expect(await logProblems(fast, ran.status, expected)).toEqual([]);
  }, PATIENCE_MS * 3);

  it("A109: core-contract-logs-full stores the logs of applied segments, a successful fallible segment's among them, and none of a failed fallible segment", async () => {
    const expected = await a109Scenario();
    const db = await backend.database();
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: FULL_CORE });
    expect(await logProblems(db, ran.status, expected)).toEqual([]);
    // The failed segment's log is in no row; the successful one's is.
    const data = (await logLines(db)).map((line) => line.split(" ")[8]);
    expect(data).not.toContain(dataOf(cellValue(Uint8Array.of(8))));
    expect(data).toContain(dataOf(wrapper(2, 0, cellValue(Uint8Array.of(1)))));
    expect(await logLines(db)).toHaveLength(3);
  }, PATIENCE_MS * 2);

  it("A110: a log of a value read from the contract's state makes -fast halt with fast-log-unsupported at its height, naming the transaction; -full stores it", async () => {
    const expected = await a110HaltScenario();
    const db = await backend.database();
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: FAST_CORE });
    expect(ran.status.reason?.code).toBe("fast-log-unsupported");
    expect(ran.halt).toMatch(/value read from the contract's state|not a literal/);
    expect(await haltProblems(db, ran.status, expected, 3n, 1, ran.halt)).toEqual([]);
    // -full stores the state's log at 3 (a version-0 Misc log of the state, an empty array) and the rows after it.
    const full = await backend.database();
    const stored = await runRange(full, expected.scenario.records, expected.scenario.head, { core: FULL_CORE });
    expect(await logProblems(full, stored.status, expected)).toEqual([]);
    expect(linesBetween(await logLines(full), 3n, 3n).map((line) => line.split(" ").slice(6, 9).join(" "))).toContain(
      `0 Misc ${dataOf({ tag: "array", content: [] })}`,
    );
  }, PATIENCE_MS * 3);

  it("A110: any log of a partially successful transaction makes -fast halt with fast-log-unsupported (CC-3)", async () => {
    const expected = await a109Scenario();
    const db = await backend.database();
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: FAST_CORE });
    expect(ran.status.reason?.code).toBe("fast-log-unsupported");
    expect(ran.halt).toMatch(/partially successful/);
    expect(await haltProblems(db, ran.status, expected, 2n, 0, ran.halt)).toEqual([]);
  }, PATIENCE_MS * 2);
});

describe("A110: -full and -fast store identical contract_logs.logs, on both backends (CC-3)", () => {
  it("A110: a range of literal logs gives identical contract_logs.logs with core-contract-logs-full and core-contract-logs-fast, on PostgreSQL 18 and PGlite, each the range's expected rows [[contract-logs.fast-equals-full]]", async () => {
    const expected = await a110Range();
    // The range holds what the criterion names: malformed wrappers stored as version-0 Misc logs, oversized logs none.
    expect(expected.logs.filter((line) => line.split(" ").slice(6, 8).join(" ") === "0 Misc").length).toBeGreaterThanOrEqual(4);
    expect(decodedLog(bigCell(1, 1_100))).toBeNull();
    expect(decodedLog(wrapper(1, 4, bigCell(2, 2_000)))).toBeNull();
    const tables: string[][] = [];
    for (const backend of PROCESS_BACKENDS) {
      await backend.start();
      try {
        for (const core of [FULL_CORE, FAST_CORE]) {
          const db = await backend.database();
          const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core });
          expect(await logProblems(db, ran.status, expected), `${backend.name}, ${core.at(-1)?.id}`).toEqual([]);
          tables.push(await logLines(db));
        }
      } finally {
        await backend.stop();
      }
    }
    expect(tables).toHaveLength(4);
    for (const table of tables) expect(table).toEqual(tables[0]);
    expect(tables[0]).toEqual(expected.logs);
  }, PATIENCE_MS * 6);
});

describe("contract data on task 0.3's recorded devnet (CC-1 to CC-3; skipped by name without its tape)", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;
  const REPLAY_MS = 3_600_000;
  const settingsOf = (found: FoundTape): Readonly<Record<string, unknown>> => ({
    network: "custom",
    genesisHash: (found.tape.notes as { genesis: { hash: string } }).genesis.hash,
    ledgerTable: { rows: [{ specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" }, { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" }] },
  });

  /** The contracts the chain's events name deployed, called or maintained, by height (`0x` hex of the 32-byte address). */
  async function touchedByEvents(db: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<Map<bigint, Set<string>>> {
    const rows = await db.query(
      `SELECT height::text AS h, name, fields->>'contract_address' AS a FROM core_chain_events.events
       WHERE pallet = 'Midnight' AND name IN ('ContractDeploy', 'ContractCall', 'ContractMaintain') ORDER BY height, event_index`,
    );
    const touched = new Map<bigint, Set<string>>();
    for (const row of rows) {
      // The node's event carries the address's tagged serialization (`midnight:contract-address[v…]:` and 32 bytes).
      const address = `0x${(row.a as string).slice(-64)}`;
      const height = BigInt(row.h as string);
      touched.set(height, new Set([...(touched.get(height) ?? []), address]));
    }
    return touched;
  }

  tapeTest(
    "devnet-v8-v9-0-235",
    "A108 on the devnet: every contract deployed, called or maintained has its row at that height, every contract deployed on v8 its row with converted keys at F (103), each key held and loading; -fast stores what -full stores",
    async (found) => {
      const records: TapeRecord[] = cappedAt(found.read().records, 235n);
      await backend.start();
      try {
        const db = await backend.database();
        const full = await runRange(db, records, 235n, { core: FULL_CORE, settings: settingsOf(found), stop: 235n }, REPLAY_MS);
        expect(full.status).toMatchObject({ cursor: 235n, reason: null });
        const touched = await touchedByEvents(db);
        expect([...touched.keys()]).toEqual([11n, 16n, 23n, 121n, 125n, 131n]);
        const rows = await stateRows(db);
        const v8 = [...(touched.get(11n) as Set<string>)];
        const expected = new Map<bigint, string[]>([...touched].map(([height, set]) => [height, [...set].sort()]));
        expected.set(103n, v8.sort());
        expect(new Map([...rows].map(([height, list]) => [height, list.map((row) => row.address)]))).toEqual(expected);
        // Each key is held (LG-13) and every node a held key reaches is stored.
        const counts = new Map((await db.query("SELECT encode(node_key, 'hex') AS k, count FROM core_ledger_state.root_counts")).map((r) => [r.k as string, Number(r.count)]));
        for (const list of rows.values()) {
          for (const row of list) {
            expect(counts.get(row.stateKey) ?? 0).toBeGreaterThan(0);
            expect(counts.get(row.zswapKey) ?? 0).toBeGreaterThan(0);
          }
        }
        expect(await heldNodeProblems(db)).toEqual([]);
        // The converted keys at F are not the v8 keys of the state at U.
        const at = (height: bigint) => rows.get(height)?.find((row) => row.address === v8[0])?.stateKey;
        expect(at(103n)).not.toBe(at(23n));
        const fullLines = await logLines(db);
        const fast = await backend.database();
        const ran = await runRange(fast, records, 235n, { core: FAST_CORE, settings: settingsOf(found), stop: 235n }, REPLAY_MS);
        expect(ran.status).toMatchObject({ cursor: 235n, reason: null });
        expect(await logLines(fast)).toEqual(fullLines);
      } finally {
        await backend.stop();
      }
    },
    { timeoutMs: REPLAY_MS * 2 },
  );
});

// The three modules are core modules of the build, in the decision record's order (task 13.1).
describe("core-contract-states, core-contract-logs-full and core-contract-logs-fast as declared (CC-1 to CC-4)", () => {
  it("declare CORE-ARCH §4.11's requirements, items, mid-chain starts and the development-only -fast; both log providers share contract-logs with the same table and migrations", () => {
    expect([CORE_CONTRACT_STATES, CORE_CONTRACT_LOGS_FULL, CORE_CONTRACT_LOGS_FAST].map((m) => [m.id, m.requires, m.startsMidChain, m.developmentOnly === true])).toEqual([
      ["core-contract-states", ["ledger-state"], false, false],
      ["core-contract-logs-full", ["vm-logs"], false, false],
      ["core-contract-logs-fast", ["chain-events", "block-parsed"], true, true],
    ]);
    expect(CORE_CONTRACT_STATES.provides).toEqual([
      { name: "contract-states", lifetimes: ["block", "table"], table: { schema: "core_contract_states", tables: ["states"], kind: "append-only" } },
    ]);
    const item = { name: "contract-logs", lifetimes: ["block", "table"], table: { schema: "contract_logs", tables: ["logs"], kind: "append-only" } };
    expect(CORE_CONTRACT_LOGS_FULL.provides).toEqual([item]);
    expect(CORE_CONTRACT_LOGS_FAST.provides).toEqual([item]);
    expect(CORE_CONTRACT_LOGS_FAST.migrations).toEqual(CORE_CONTRACT_LOGS_FULL.migrations);
    expect(Object.keys(CORE_CONTRACT_LOGS_FULL.points).sort()).toEqual(["on-compute", "on-db-write"]);
    expect(Object.keys(CORE_CONTRACT_LOGS_FAST.points).sort()).toEqual(["on-db-write", "on-parse"]);
    expect(Object.keys(CORE_CONTRACT_STATES.points).sort()).toEqual(["on-compute", "on-db-write"]);
    expect(LEDGER_CORE.map((m) => m.id)).not.toContain("core-contract-states");
  });
});
