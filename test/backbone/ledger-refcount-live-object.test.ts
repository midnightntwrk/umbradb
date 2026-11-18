import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { rootOf } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { tableDifferences } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import type { TableSnapshot } from "./ledger-graph-tapes.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import { referencesOf } from "./refcount-checks.js";
import { HELD, LIVE_AT, PARENT, runLiveObject } from "./refcount-live-object.js";
import { nodeSet } from "./refcount-model.js";
import { runProblems } from "./refcount-process.js";

/**
 * `[FAULT]` A live object holding a row that the stored child lists no longer reach, on PostgreSQL 18 and PGlite
 * 0.5.10.
 *
 * On the extended DAG fixture (`./refcount-live-object.ts`), the test package's live state holds x
 * (`small to-embedded`) by reference while the stored child list of its parent (`rewrite to-embedded`) embeds x, and x
 * is queued with no root and no stored reference. At the next block h the reclamation deletes x; the package refuses
 * to forget x, refuses again once the worker freed its kept parses, and the worker thread is replaced, at h's
 * `on-settle`. The block commits as computed, with the node's root, R3 passes, the node set (and every table that is
 * not content-defined) after every block is that of a run whose package never held x by reference (`writes-again`),
 * and the state after h loads from the database in a new worker.
 *
 * The committed negative control (the worker restart disabled) is in
 * `ledger-refcount-live-object.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

describe.each(PROCESS_BACKENDS)("a live object holding a deleted row, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("x held by reference by a live state while its stored parent embeds it, queued with no root and no stored reference, is deleted at the next block; the package refuses to forget it on both tries and the worker is replaced; h commits as computed with the node's root, R3 passing and the node set of a run that never held x by reference, and the state after h loads from the database", async () => {
    const h = LIVE_AT;
    const x = hex(HELD.key);
    const reference = await runLiveObject(await backend.database(), { keeping: "writes-again" });
    expect(reference.run.status).toMatchObject({ cursor: h, reason: null, ended: null });
    expect(reference.counters).toMatchObject({ threads: 1, refusals: 0 });
    expect(reference.run.evicted.get(h)).toContain(x);

    const db = await backend.database();
    const live = await runLiveObject(db, { keeping: "holds-by-reference" });

    // After h − 1: x is a row, queued, with no root count and no stored reference, and its parent's stored child list
    // embeds it.
    const before = live.run.tables.get(h - 1n) as TableSnapshot;
    expect(before.rows.has(x)).toBe(true);
    expect(before.queue.has(x)).toBe(true);
    expect(before.roots.has(x)).toBe(false);
    expect(before.refs.has(x)).toBe(false);
    expect([...before.rows.values()].some((children) => referencesOf(children).includes(x))).toBe(false);
    const parent = before.rows.get(hex(PARENT.key)) as Uint8Array;
    expect(hex(parent)).toBe(hex(PARENT.children));
    expect(nodeSet([[hex(PARENT.key), parent]]).has(x)).toBe(true);

    // At h the reclamation deleted x. The first thread refused to forget it on both tries (the second after freeing its
    // kept parses), so the host ended it and started one more; h was not applied again, and no thread took the
    // eviction. x is gone from the rows all the same.
    expect(live.run.restarts).toBe(1);
    expect(live.counters).toMatchObject({ refusals: 2, storeLoads: 0 });
    expect(live.run.evicted.get(h)).toBeUndefined();
    expect((live.run.tables.get(h) as TableSnapshot).rows.has(x)).toBe(false);

    // h committed, its state root the node's (the tape's), with no halt.
    expect(live.run.status).toMatchObject({ cursor: h, reason: null, ended: null });
    expect(live.run.failure).toBeNull();
    expect(live.states).toHaveLength(Number(h) + 1);
    expect(live.states.at(-1)).toBe(`${h} ${hex(rootOf(Number(h), "extended").slice(1))} ${hex(rootOf(Number(h), "extended"))}`);
    expect(live.states).toEqual(reference.states);

    // The check after every block; the node set, and the rows of every table that is not content-defined, after
    // every block as in the run that never held x by reference.
    expect(runProblems(live.run, "extended")).toEqual([]);
    expect(tableDifferences(live.run.tables, reference.run.tables)).toEqual([]);
    expect(await heldNodeProblems(db)).toEqual([]);

    // The state after h loads from the database in a new worker, with the node's root.
    expect(live.loaded).toEqual({ stateRoot: hex(rootOf(Number(h), "extended")), loaded: true, storeLoads: 1 });
  }, PATIENCE_MS * 6);
});
