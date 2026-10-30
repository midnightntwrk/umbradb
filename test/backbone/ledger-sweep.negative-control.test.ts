import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { GreyPicker } from "../../src/backbone/core-ledger-state/sweep.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { committed, ingest, PATIENCE_MS } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";
import { nodesOfTagged, rebuildTagged } from "../ledger/stored-values.js";
import { a104Scenario, contractNodeKeys, heldReach } from "./ledger-storage-checks.js";
import {
  modelOfFixture,
  modelProblems,
  SWEEP_LOADER,
  sweepCore,
  sweepTables,
  sweepTape,
  sweepWatcher,
  type TableSnapshot,
  tablesByHeight,
} from "./sweep-tapes.js";

/**
 * The sweep's committed negative controls. Each runs through the process on the same scenario as the test it controls
 * and is held to the same oracle, which must fail:
 *
 * - A sweep that takes grey keys in insertion order (first in, first out) instead of byte order differs from the
 *   reference model on the sweep fixture: the fixture tells the two orders apart. [A105]
 * - The same run without persisting the contract's keys (no `core-contract-states`). The nodes of its state of height
 *   10 that only those keys held, stored while the states held them, are deleted by the sweep, and its keys do not
 *   load. [A104]
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/**
 * Grey keys in the order they joined the grey set (keys that joined together in byte order): the wrong order.
 * [A105]
 */
function insertionOrder(): GreyPicker {
  const joined = new Map<string, number>();
  let next = 0;
  return async (grey, count) => {
    const all = await grey.all();
    for (const key of all) if (!joined.has(hex(key))) joined.set(hex(key), next++);
    return [...all].sort((a, b) => (joined.get(hex(a)) as number) - (joined.get(hex(b)) as number)).slice(0, count);
  };
}

describe.each(PROCESS_BACKENDS)("task 12.5's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A105's control: grey keys taken in insertion order instead of byte order differ from the reference model", async () => {
    const db = await backend.database();
    const seen = new Map<bigint, TableSnapshot>();
    const process = await ingest(db, sweepTape().records, {
      start: 0n,
      core: sweepCore({ greyPicker: insertionOrder() }),
      user: [sweepWatcher(seen)],
      ledgerWorker: () => startLedgerWorker({ loader: SWEEP_LOADER }),
    });
    try {
      await committed(process, BigInt(LAST), PATIENCE_MS * 2);
    } finally {
      await process.close();
    }
    const problems = modelProblems(await tablesByHeight(seen, db, BigInt(LAST)), modelOfFixture());
    expect(problems.length).toBeGreaterThan(0);
    // Already after block 1: block 0 left more grey keys than the budget, and the two orders visit other ones.
    expect(problems[0]).toMatch(/^after 1: .*(grey|marks)/);
  }, PATIENCE_MS * 3);

  it("A104's control: without the contract's keys persisted, the sweep deletes the nodes of its state of 10 that only they held", async () => {
    const { scenario, contract } = await a104Scenario();
    const db = await backend.database();
    const sweeps = new Map<bigint, TableSnapshot>();
    const process = await ingest(db, scenario.records, { start: 0n, core: LEDGER_CORE, user: [sweepWatcher(sweeps)] });
    try {
      await committed(process, scenario.head, PATIENCE_MS * 2);
    } finally {
      await process.close();
    }
    const end = new Set((await sweepTables(db)).nodes);
    const held = await heldReach(db);
    const only = [...contractNodeKeys(scenario, contract.address, 10n)].filter((key) => !held.has(key));
    // Those nodes were stored while the ledger states held the contract's state of 10 …
    const stored15 = new Set((sweeps.get(15n) as TableSnapshot).nodes);
    expect(only.filter((key) => stored15.has(key)).length).toBeGreaterThan(0);
    // … and none of them is stored now: the oracle fails. [A104]
    expect(only.filter((key) => end.has(key))).toEqual([]);
    // The contract's state of 10 no longer loads from its key: its value cannot be rebuilt from the stored nodes.
    const value = scenario.heights[10]?.contracts.get(`0x${hex(contract.address)}`)?.state as Uint8Array;
    const nodes = new Map((await db.query("SELECT encode(node_key, 'hex') AS k, data, children FROM core_ledger_state.nodes")).map((r) => [r.k as string, { data: r.data as Uint8Array, children: r.children as Uint8Array }]));
    expect(() => rebuildTagged("contract-state[v8]", nodesOfTagged(value).root, (k) => nodes.get(k))).toThrow(/is not stored/);
  }, PATIENCE_MS * 3);
});
