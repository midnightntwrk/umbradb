import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import type { LoggedRequest } from "../ledger/fixtures/request-log-loader.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf, settle, startProcess } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { refusalHeight, tableDifferences } from "./eviction-restart.js";
import { commitProblems, type FollowRun, followRun, REQUEST_LOG_LOADER } from "./host-follows.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { runProblems } from "./refcount-process.js";

/**
 * The ledger worker's host follows each block's transaction, through the real process on PostgreSQL 18 and PGlite
 * 0.5.10, with the extended DAG fixture (`./host-follows.ts`). The engine tells the host what became of each block's
 * transaction and the host sends the thread the block's commit; `core-ledger-state` and `core-block-parsed` declare no
 * `on-after-db-write`. So:
 * - the thread gets one commit per committed block, in height order, each after its `COMMIT` answered and followed at
 *   once by the release of the parses kept up to it;
 * - a `COMMIT` lost before it landed: no commit for that transaction; the height made again is applied on the state
 *   after h − 1 the thread still holds as committed, gets its pending state back, and commits once;
 * - a `COMMIT` lost after it landed: one commit, after the next run's cursor read found the height committed;
 * - an eviction refused at h's `on-settle`: the read lent to the worker for it is taken back and the thread restarted
 *   inside the block's transaction, and once the `COMMIT` answered the new thread gets h's commit, then each later
 *   block's;
 * - a process restart: the re-delivery of the cursor's block sends the release up to it alone, the new thread loads
 *   the state at the cursor from the database for the next height, and gets one commit per later block;
 * - against the parent's build, rebuilt in the test (the modules' own `on-after-db-write` commit and release, no
 *   follower): the same requests of every kind, one commit and one release per committed height, uninterrupted and
 *   with a `COMMIT` lost before or after it landed, the release now after the commit where it came before; and the same
 *   rows in every table after every height;
 * - each run stores what an uninterrupted run stores, and passes the fixture's checks after every height;
 * - a graph with `core-block-parsed` and without `core-ledger-state` (the in-memory source, traced): nothing is
 *   applied, so no commit reaches the thread and no trace line has `rtN.commit`; each committed block's parses are
 *   released.
 * h is the first height whose reclamation deletes nodes, so its eviction is sent in the transaction that is lost. The
 * negative control (a follower told `committed` when the body ends) is in
 * `ledger-host-follows.negative-control.test.ts`.
 */

const H = refusalHeight();
const LAST = Number(H) + 3;

describe("core-ledger-state and core-block-parsed after the commit", () => {
  it("declare no on-after-db-write: the engine tells the ledger worker's host of each commit", () => {
    expect(Object.keys(CORE_LEDGER_STATE.points)).not.toContain("on-after-db-write");
    expect(Object.keys(CORE_BLOCK_PARSED.points)).not.toContain("on-after-db-write");
    // The release of a dropped best block's parse stays in core-block-parsed.
    expect(CORE_BLOCK_PARSED.points["on-rollback"]).toBeTypeOf("function");
  });
});

describe.each(PROCESS_BACKENDS)("the ledger worker's host follows the transaction, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The uninterrupted run, made once for the tests that compare with it. */
  let uninterruptedRun: Promise<FollowRun> | undefined;
  const uninterrupted = async (): Promise<FollowRun> => (uninterruptedRun ??= followRun(await backend.database(), { last: LAST }));

  it("one commit per committed block, each after its COMMIT answered and followed by the release up to it; the fixture's checks pass", async () => {
    const follow = await uninterrupted();
    expect(follow.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(commitProblems(follow, LAST)).toEqual([]);
    expect(follow.counters).toMatchObject({ threads: 1 });
    expect(runProblems(follow.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 2);

  it("a COMMIT lost before it landed: no commit for that transaction, h made again commits once on the state the thread holds; the rows are an uninterrupted run's", async () => {
    const follow = await followRun(await backend.database(), { last: LAST, lose: { at: H, how: "lost" } });
    expect(follow.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(follow.run.lines.some((line) => line.startsWith("processing retries in"))).toBe(true);
    // h was applied twice, both on the state after h − 1 the thread held as committed: the second got the pending state
    // back (otherwise its flush would leave out the nodes the package counts stored, and the run would halt at h: the
    // negative control).
    expect(follow.requests.filter((request) => request.type === "apply" && request.height === H)).toHaveLength(2);
    expect(commitProblems(follow, LAST)).toEqual([]);
    expect(follow.counters).toMatchObject({ threads: 1 });
    expect(tableDifferences(follow.run.tables, (await uninterrupted()).run.tables)).toEqual([]);
    expect(runProblems(follow.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a COMMIT lost after it landed: one commit, after the next run's cursor read found h committed; the rows are an uninterrupted run's", async () => {
    const follow = await followRun(await backend.database(), { last: LAST, lose: { at: H, how: "landed" } });
    expect(follow.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(follow.run.lines.some((line) => line.startsWith("processing retries in"))).toBe(true);
    expect(follow.requests.filter((request) => request.type === "apply" && request.height === H)).toHaveLength(1);
    expect(commitProblems(follow, LAST)).toEqual([]);
    expect(follow.counters).toMatchObject({ threads: 1 });
    expect(tableDifferences(follow.run.tables, (await uninterrupted()).run.tables)).toEqual([]);
    expect(runProblems(follow.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 4);

  it("an eviction refused at h's on-settle: the read lent to the worker is taken back and the thread restarted before the COMMIT, and the new thread gets h's commit once it answered; the rows are an uninterrupted run's", async () => {
    const follow = await followRun(await backend.database(), { last: LAST, refuse: H });
    expect(follow.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(follow.run.restarts).toBe(1);
    // At h: the lent read is taken back after the restart, before the body ends, and committed comes after the COMMIT.
    const atH = follow.events.filter((event) => event.endsWith(` ${H}`) || event === "restart");
    expect(atH).toEqual([`lend ${H}`, `evict ${H}`, `refused ${H}`, "restart", `taken back ${H}`, `written ${H}`, `committed ${H}`]);
    // The new thread's requests: the commits of h to the last height, in order, each after its COMMIT answered and
    // followed at once by the release up to it (h's commit answered false: the new thread holds nothing pending).
    const commits = follow.requests.filter((request) => request.type === "commit");
    expect(commits.map((request) => request.height)).toEqual(Array.from({ length: LAST - Number(H) + 1 }, (_, i) => H + BigInt(i)));
    for (const commit of commits) {
      expect(commit.at).toBeGreaterThanOrEqual(follow.settled.get(commit.height as bigint) as number);
      const next = follow.requests[follow.requests.indexOf(commit) + 1];
      expect(next).toMatchObject({ type: "release", upTo: commit.height });
    }
    expect(follow.counters).toMatchObject({ threads: 2 });
    expect(tableDifferences(follow.run.tables, (await uninterrupted()).run.tables)).toEqual([]);
    expect(runProblems(follow.run, "extended")).toEqual([]);
  }, PATIENCE_MS * 4);

  it("a process restart: the re-delivery sends the release up to the cursor alone; the new thread loads the state at the cursor and gets one commit per later block", async () => {
    const db = await backend.database();
    const first = await followRun(db, { last: Number(H) });
    expect(first.run.status).toMatchObject({ cursor: H, reason: null });
    const again = await followRun(db, { last: LAST, resume: H });
    expect(again.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const { requests } = again;
    const commits = requests.filter((request) => request.type === "commit").map((request) => request.height);
    expect(commits).toEqual(Array.from({ length: LAST - Number(H) }, (_, i) => H + 1n + BigInt(i)));
    // The re-delivery: the release up to the cursor, before anything is applied, and no commit of it.
    const releases = requests.filter((request) => request.type === "release").map((request) => request.upTo);
    expect(releases[0]).toBe(H);
    expect(requests.findIndex((request) => request.type === "release")).toBeLessThan(requests.findIndex((request) => request.type === "apply"));
    // Each block asks the thread to hold the state before it; the new thread holds none, so the first, the state at the
    // cursor, is read from the database (the test package's count of states loaded from it), before any apply.
    expect(requests.filter((request) => request.type === "load").map((request) => request.height)).toEqual(
      Array.from({ length: LAST - Number(H) }, (_, i) => H + BigInt(i)),
    );
    expect(requests.findIndex((request) => request.type === "load")).toBeLessThan(requests.findIndex((request) => request.type === "apply"));
    expect(again.counters).toMatchObject({ threads: 1, storeLoads: 1 });
    const tables = new Map([...first.run.tables, ...again.run.tables]);
    expect(tableDifferences(tables, (await uninterrupted()).run.tables)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("against the parent's build: the same requests of every kind and one commit and one release per committed height, uninterrupted and with a COMMIT lost before or after it landed; the same rows", async () => {
    for (const lose of [undefined, { at: H, how: "lost" as const }, { at: H, how: "landed" as const }]) {
      const at = lose === undefined ? "uninterrupted" : `lost ${lose.how}`;
      const nowDb = await backend.database();
      const parentDb = await backend.database();
      const now = await followRun(nowDb, { last: LAST, ...(lose === undefined ? {} : { lose }) });
      const parent = await followRun(parentDb, { last: LAST, parentBuild: true, ...(lose === undefined ? {} : { lose }) });
      for (const follow of [now, parent]) expect(follow.run.status, at).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(kinds(now.requests), at).toEqual(kinds(parent.requests));
      for (const follow of [now, parent]) {
        expect(perHeight(follow.requests, "commit"), at).toEqual(heightsTo(LAST));
        expect(perHeight(follow.requests, "release"), at).toEqual(heightsTo(LAST));
      }
      // The order of the two: the parent released first (core-block-parsed's callback ran before core-ledger-state's).
      expect(pairOrder(parent.requests), at).toEqual(heightsTo(LAST).map((h) => `release ${h}, commit ${h}`));
      expect(pairOrder(now.requests), at).toEqual(heightsTo(LAST).map((h) => `commit ${h}, release ${h}`));
      expect(tableDifferences(now.run.tables, parent.run.tables), at).toEqual([]);
      expect(await everyRow(nowDb), at).toEqual(await everyRow(parentDb));
    }
  }, PATIENCE_MS * 12);
});

/** Each request kind's count. */
const kinds = (requests: readonly LoggedRequest[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const request of requests) counts[request.type] = (counts[request.type] ?? 0) + 1;
  return counts;
};

/** The heights the requests of `type` name, each once per request, in order (a release by its `upTo`). */
const perHeight = (requests: readonly LoggedRequest[], type: "commit" | "release"): bigint[] =>
  requests.filter((request) => request.type === type).map((request) => (type === "release" ? request.upTo : request.height) as bigint);

/** Heights 0 to `last`. */
const heightsTo = (last: number): bigint[] => Array.from({ length: last + 1 }, (_, h) => BigInt(h));

/** For each height, which of its commit and its release reached the thread first. */
const pairOrder = (requests: readonly LoggedRequest[]): string[] =>
  heightsTo(LAST).map((h) => {
    const commit = requests.findIndex((request) => request.type === "commit" && request.height === h);
    const release = requests.findIndex((request) => request.type === "release" && request.upTo === h);
    return commit < release ? `commit ${h}, release ${h}` : `release ${h}, commit ${h}`;
  });

/** Every row of the tables a run writes, by table: an MD5 of each table's rows. */
async function everyRow(db: ProcessDatabase): Promise<Record<string, string>> {
  const tables = await db.query(
    `SELECT n.nspname || '.' || c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname IN ('core_block_commit', 'core_ledger_state', 'core_digest', 'core_chain_events', 'core_block_parsed',
       'core_tx_results') AND c.relkind IN ('r', 'p') AND NOT c.relispartition ORDER BY 1`,
  );
  const rows: Record<string, string> = {};
  for (const { t } of tables) {
    const [row] = await db.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM ${t as string} r`);
    rows[t as string] = row?.d as string;
  }
  return rows;
}

/** The last height of the graph with `core-block-parsed` alone. */
const ALONE = 5n;

describe.each(PROCESS_BACKENDS)("a graph with core-block-parsed and without core-ledger-state, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("nothing is applied: no commit reaches the thread and no trace line has rtN.commit; each committed block's parses are released", async () => {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: ALONE });
    const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED];
    let blocks = "";
    startTrace({ blocks: (text) => void (blocks += text), statements: () => undefined, worker: () => undefined });
    let host: LedgerHost | undefined;
    const handle = startProcess({
      declarations: chainDeclarations([], { core: modules }),
      config: { data: { entries: [core(db.setting, 1), ...modules.map((module) => entryOf(module, 1))] } },
      source,
      log: () => undefined,
      ledgerWorker: () => (host = startLedgerWorker({ loader: REQUEST_LOG_LOADER })),
    });
    let requests: readonly LoggedRequest[] = [];
    try {
      expect(await settle(handle, source, ALONE)).toBe("waiting");
      expect(handle.status()).toMatchObject({ cursor: ALONE, reason: null });
      requests = ((await host?.probe()) as readonly LoggedRequest[] | undefined) ?? [];
    } finally {
      await handle.stop();
      stopTrace();
    }
    expect(requests.filter((request) => request.type === "commit")).toEqual([]);
    expect(requests.filter((request) => request.type === "release").map((request) => request.upTo)).toEqual([1n, 2n, 3n, 4n, 5n]);
    const lines = blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(lines.map((line) => line.h)).toEqual([1, 2, 3, 4, 5]);
    expect(lines.filter((line) => "rtN.commit" in line)).toEqual([]);
  }, PATIENCE_MS);
});
