import { existsSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { REQUEUE, rootOf, stateNodes, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { ingest, PATIENCE_MS } from "./ingest-harness.js";
import { modelOfBatches, modelProblems, SWEEP_LOADER, sweepCore, sweepTape, type TableSnapshot } from "./ledger-graph-tapes.js";
import { fixtureReach, type Reach, referencesOf } from "./refcount-checks.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * `sweep: off` from {@link OFF} to {@link ON} − 1 and on again from {@link ON}, through the real process under the
 * development opt-in, on PostgreSQL 18 and PGlite 0.5.10, on the extended DAG fixture (`retainStates` 0; the off
 * stretch holds both rewrites and the queued key referenced again):
 * - it is switched off while the queue holds the state released at OFF − 1 (the state after OFF − 2);
 * - while it is off no row is deleted or evicted, that state's rows included, the (a) and (b) pass after every block,
 *   and the queue holds every row that no stored child list references and no root count persists;
 * - the first block with it on again deletes the whole queue and its cascade, and the (c) and (d) pass from there on;
 * - no reset is written at either switch: the tables after every block, the two switches included, are the model's
 *   (whose rules have none), and no other table of `core_ledger_state` changes at a switch;
 * - without the development opt-in the same configuration is refused at startup (`development-opt-in-required`) before
 *   anything is written.
 */

/** The first height with `sweep: off`. */
const OFF = 30;
/** The first height with `sweep: on` again. */
const ON = 66;
/** The run's last height. */
const LAST_RUN = 70;
/** Whether `sweep` is on at `h`. */
const on = (h: number): boolean => h < OFF || h >= ON;
/** The `core` revisions that turn it off and on again. */
const REVISIONS = [
  { start: BigInt(OFF), settings: { sweep: "off" } },
  { start: BigInt(ON), settings: { sweep: "on" } },
] as const;

/** The tables the block's rules write; any other table of `core_ledger_state` a reset would write. */
const RULE_TABLES = ["nodes", "ref_counts", "unreferenced", "root_counts", "states", "segment_results", "events"];

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The rows of the state after `h` of the extended DAG (its root and every node it holds as a row), hex. */
const rowsOfState = (h: number): string[] => stateNodes(h, "extended").map((node) => hex(node.key));

/** The root key of the state after `h` of the extended DAG, hex. */
const rootKey = (h: number): string => hex(rootOf(h, "extended").slice(1));

/** The rows of `t` that no stored child list references and no root count persists. */
function unreferencedRows(t: TableSnapshot): string[] {
  const referenced = new Set([...t.rows.values()].flatMap((children) => referencesOf(children)));
  return [...t.rows.keys()].filter((key) => !referenced.has(key) && !t.roots.has(key)).sort();
}

/** Whether startup wrote anything: on PGlite whether the directory exists, on PostgreSQL whether `core_chain` does. */
async function touched(db: ProcessDatabase): Promise<boolean> {
  if (db.directory !== undefined) return existsSync(db.directory);
  return (await db.query("SELECT 1 FROM pg_namespace WHERE nspname = 'core_chain'")).length > 0;
}

describe.each(PROCESS_BACKENDS)("sweep off and on again through the process on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("switched off while the queue holds the state released at OFF − 1, no row is deleted, the (a) and (b) pass and the queue holds every row with no reference and no root count; the first block with it on again deletes the queue and its cascade, after which the (c) passes; no reset at either switch", async () => {
    const run = await runDag(await backend.database(), { dag: "extended", revisions: REVISIONS, last: LAST_RUN });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST_RUN), reason: null });
    const after = (h: number): TableSnapshot => {
      const found = run.tables.get(BigInt(h));
      if (found === undefined) throw new Error(`no tables recorded after ${h}`);
      return found;
    };
    // The off stretch holds the rewrites both ways and the queued key referenced again.
    expect([TO_REF, TO_EMBEDDED, REQUEUE + 1].every((h) => h >= OFF && h < ON)).toBe(true);

    // Switched off while the queue holds the state released at OFF − 1: with it on, OFF would delete its rows.
    const released = rowsOfState(OFF - 2);
    expect(after(OFF - 1).queue.has(rootKey(OFF - 2))).toBe(true);
    expect(after(OFF - 1).roots.has(rootKey(OFF - 2))).toBe(false);

    // While it is off: nothing deleted or evicted, that state's rows included; the queue every row with no reference and
    // no root count.
    const problems: string[] = [];
    for (let h = OFF; h < ON; h++) {
      const [before, now] = [after(h - 1), after(h)];
      for (const key of before.rows.keys()) if (!now.rows.has(key)) problems.push(`${key} deleted at ${h}`);
      for (const key of released) if (!now.rows.has(key)) problems.push(`${key} of the state after ${OFF - 2} is not stored after ${h}`);
      if ((run.evicted.get(BigInt(h)) ?? []).length > 0) problems.push(`evicted at ${h}: ${run.evicted.get(BigInt(h))?.join(", ")}`);
      const queue = [...now.queue].sort();
      if (JSON.stringify(queue) !== JSON.stringify(unreferencedRows(now))) problems.push(`the queue after ${h} is not every row with no reference and no root count`);
    }
    expect(problems).toEqual([]);
    // It grew: every root released while it was off is queued after ON − 1.
    for (let h = OFF - 2; h <= ON - 2; h++) expect(after(ON - 1).queue.has(rootKey(h)), `the root of ${h}`).toBe(true);

    // The first block with it on again deletes the whole queue, and the rows only the queue reached (its cascade):
    // the released state's rows outside K_ON among them, each evicted.
    const queued = after(ON - 1).queue;
    const gone = [...after(ON - 1).rows.keys()].filter((key) => !after(ON).rows.has(key)).sort();
    expect([...queued].filter((key) => after(ON).rows.has(key))).toEqual([]);
    expect(gone.filter((key) => !queued.has(key)).length).toBeGreaterThan(0);
    expect(run.evicted.get(BigInt(ON)) ?? []).toEqual(gone);
    const kept = (fixtureReach("extended", run.batches, LAST_RUN, { on }).get(BigInt(ON)) as Reach).kept;
    const outside = released.filter((key) => !kept.has(key));
    expect(outside).toContain(rootKey(OFF - 2));
    for (const key of outside) expect(gone, key).toContain(key);

    // No reset at either switch: The model (off from OFF to ON − 1) holds the tables after every block, and no table
    // but those the rules write changes at a switch.
    const model = modelOfBatches(run.batches, LAST_RUN, (h) => !on(h));
    expect(modelProblems(run.tables, model)).toEqual([]);
    expect(model[ON]?.rounds).toBeGreaterThanOrEqual(2);
    for (const h of [OFF, ON]) {
      const others = [...after(h).digests.keys()].filter((table) => !RULE_TABLES.includes(table));
      for (const table of others) expect(after(h).digests.get(table), `${table} at ${h}`).toBe(after(h - 1).digests.get(table));
    }

    // (a), (b) and R_{h−1} ⊆ S_h after every block; S_h = K_h and (d) where it is on.
    expect(runProblems(run, "extended", on)).toEqual([]);
  }, PATIENCE_MS * 3);

  it("without the development opt-in the configuration turning sweep off is refused at startup (development-opt-in-required), before anything is written", async () => {
    const db = await backend.database();
    const process = await ingest(db, sweepTape(LAST_RUN, "extended").records, {
      start: 0n,
      core: sweepCore(),
      settings: { developmentOptIn: false },
      revisions: REVISIONS,
      ledgerWorker: () => startLedgerWorker({ loader: SWEEP_LOADER, loaderData: { dag: "extended" } }),
    });
    // A process that starts is stopped at once: its start is the failure.
    let refusal: unknown;
    let ended: unknown;
    try {
      refusal = await process.handle.started.then(
        () => null,
        (error: unknown) => error,
      );
      if (refusal !== null) ended = await process.handle.ended;
    } finally {
      await process.close();
    }
    expect(refusal).toBeInstanceOf(UmbraError);
    expect(ended).toEqual({ kind: "refused", error: refusal });
    // On PostgreSQL the history check names `sweep-off`; on PGlite the database itself needs the opt-in and refuses
    // first, so a PGlite process without it runs nothing, `sweep: off` included.
    expect(refusal).toMatchObject({ code: "development-opt-in-required", details: { feature: backend.kind === "postgres" ? "sweep-off" : "pglite" } });
    expect(await touched(db)).toBe(false);
  }, PATIENCE_MS);
});
