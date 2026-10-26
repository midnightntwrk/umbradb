import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockItemSource } from "../../src/backbone/core-block-fetch/index.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BlockRef, BlockSource } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type ProcessHandle, type ProcessStatus, startProcess } from "../../src/runner/process.js";
import { cursorIn, pairs, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, settle, testBuild } from "./process-build.js";

/**
 * What the process retries instead of halting (task 5.4; IN-10, RN-8's "an error other than a lost connection",
 * DB-11, DB-13; CORE-ARCH §4.6): a lost database connection (`connection-lost`) and an unreachable node
 * (`node-unreachable`), the two retryable codes, wherever they come from — a callback's statement, the block
 * transaction, the loop's cursor read, startup's steps after the database opened. The process raises the condition
 * `database-retrying` or `node-retrying` (with the attempts and the height), waits IN-10's back-off (1 s doubling up to
 * the process revision's `backoffCeilingMs`) and runs again from the cursor — the loop re-reads it and re-delivers it
 * (RN-11), so a height whose transaction was lost is processed again from `on-fetch` (task 10.4 keeps its items from
 * before `on-compute`, IN-10) —; the condition clears once a height commits or the loop finds nothing to process.
 * A stop ends the wait at once. A writer that finds its lock taken when it reconnects halts for good
 * (`writer-lock-lost`, DB-11). The terminated connections are PostgreSQL's; PGlite has none to lose.
 */

const HEAD = 5n;
/** The back-off ceiling the retries run with here: 20 ms, so no test waits IN-10's seconds. */
const CEILING = 20;

/** A block source over `source` whose methods may fail first (`fail` decides per call, by method and height). */
function flakySource(
  source: InMemoryBlockSource,
  fail: (method: "cursor" | "block", height: bigint | null) => Error | undefined,
): BlockSource & BlockItemSource {
  return {
    cursor: async (read) => {
      const error = fail("cursor", null);
      if (error !== undefined) throw error;
      return source.cursor(read);
    },
    finalizedHead: () => source.finalizedHead(),
    waitForHead: (above, signal) => source.waitForHead(above, signal),
    // core-block-fetch's items, as the source gives them (task 10.3).
    blockItems: (block: BlockRef) => source.blockItems(block),
    block: async (height) => {
      const error = fail("block", height);
      if (error !== undefined) throw error;
      return source.block(height);
    },
  };
}

/** Starts a build of `user` on `db`, `extra` in the `core` entry; the handle and its log lines. */
function start(
  db: ProcessDatabase,
  user: readonly ModuleDeclaration[],
  source: BlockSource,
  extra: Readonly<Record<string, unknown>> = { backoffCeilingMs: CEILING },
): { readonly handle: ProcessHandle; readonly lines: string[] } {
  const build = testBuild(user);
  const lines: string[] = [];
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries: [core(db.setting, 1, { extra }), ...user.map((part) => entryOf(part, 1))] } },
    source,
    log: (line) => lines.push(line),
  });
  return { handle, lines };
}

/** Module `w`: two rows per height in `on-db-write`; `hold(height)`, awaited after the first row, may hold it there. */
function twoRows(log: string[], hold: (height: bigint) => Promise<void> = async () => undefined): ModuleDeclaration {
  return loggingModule("w", log, ["on-after-db-write"], {
    migrations: [{ id: "001", sql: "CREATE TABLE w.rows (height bigint, part integer, PRIMARY KEY (height, part))" }],
    points: {
      ...loggingModule("w", log, ["on-after-db-write"]).points,
      async "on-db-write"(_p, b, w) {
        log.push(`w on-db-write@${b.height}`);
        await w.execute("INSERT INTO w.rows (height, part) VALUES ($1, 1)", [b.height]);
        await hold(b.height);
        await w.execute("INSERT INTO w.rows (height, part) VALUES ($1, 2)", [b.height]);
      },
    },
  });
}

/** A promise and its resolver. */
function signal(): { readonly promise: Promise<void>; readonly resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const retryLine = (where: "processing" | "startup", code: string, attempt: number) =>
  new RegExp(`^${where} retries in ${CEILING} ms \\(${code}, attempt ${attempt}\\): `);

describe.each(PROCESS_BACKENDS)("retries (IN-10) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("an unreachable node is retried with node-retrying and the back-off, then every height runs once", async () => {
    const db = await backend.database();
    const log: string[] = [];
    const seen: ProcessStatus[] = [];
    let failures = 0;
    let handle!: ProcessHandle;
    const source = new InMemoryBlockSource({ head: HEAD });
    // Block 3 fails twice, then block 5 — the head — twice: the commit of 3 started the count again.
    const flaky = flakySource(source, (method, height) => {
      if (method !== "block" || (height !== 3n && height !== 5n)) return undefined;
      seen.push(handle.status());
      if (height === 3n) return failures++ < 2 ? new UmbraError("node-unreachable", "the node did not answer for block 3") : undefined;
      return failures++ < 5 ? new UmbraError("node-unreachable", "the node did not answer for block 5") : undefined;
    });
    const started = start(db, [loggingModule("w", log, ["on-db-write", "on-after-db-write"])], flaky);
    handle = started.handle;
    try {
      expect(await settle(handle, source, HEAD)).toBe("waiting");
      expect(seen.map((status) => status.conditions)).toEqual([
        [],
        [{ code: "node-retrying", attempts: 1, height: 3n }],
        [{ code: "node-retrying", attempts: 2, height: 3n }],
        [],
        [{ code: "node-retrying", attempts: 1, height: 5n }],
        [{ code: "node-retrying", attempts: 2, height: 5n }],
      ]);
      expect(Object.isFrozen(seen[1]?.conditions[0])).toBe(true);
      expect(handle.status()).toMatchObject({ state: "following", conditions: [], cursor: HEAD, reason: null, ended: null });
    } finally {
      await handle.stop();
    }
    expect(started.lines).toHaveLength(4);
    expect(started.lines[0]).toMatch(retryLine("processing", "node-retrying", 1));
    expect(started.lines[1]).toMatch(retryLine("processing", "node-retrying", 2));
    expect(started.lines[2]).toMatch(retryLine("processing", "node-retrying", 1));
    expect(started.lines[3]).toMatch(retryLine("processing", "node-retrying", 2));
    expect(started.lines[0]).toContain("the node did not answer for block 3");
    expect(started.lines[2]).toContain("the node did not answer for block 5");
    // Each height written once; the cursor's on-after-db-write re-delivered at each retry (RN-11).
    expect(log).toEqual([
      "w on-db-write@1",
      "w on-after-db-write@1",
      "w on-db-write@2",
      "w on-after-db-write@2",
      "w on-after-db-write@2",
      "w on-after-db-write@2",
      "w on-db-write@3",
      "w on-after-db-write@3",
      "w on-db-write@4",
      "w on-after-db-write@4",
      "w on-after-db-write@4",
      "w on-after-db-write@4",
      "w on-db-write@5",
      "w on-after-db-write@5",
    ]);
    expect(await cursorIn(db)).toBe(5);
  }, 180_000);

  it("a retried failure clears once the loop finds nothing to process", async () => {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: HEAD });
    const first = start(db, [], source);
    expect(await settle(first.handle, source, HEAD)).toBe("waiting");
    await first.handle.stop();
    // At the cursor 5 with the head 5: the loop's cursor read fails once, then it has nothing to process.
    let reads = 0;
    const flaky = flakySource(source, (method) =>
      method === "cursor" && ++reads === 2 ? new UmbraError("connection-lost", "the reader connection was lost") : undefined,
    );
    const again = start(db, [], flaky);
    try {
      expect(await settle(again.handle, source, HEAD)).toBe("waiting");
      expect(again.handle.status()).toMatchObject({ state: "following", conditions: [], cursor: HEAD });
    } finally {
      await again.handle.stop();
    }
    expect(again.lines).toHaveLength(1);
    expect(again.lines[0]).toMatch(retryLine("processing", "database-retrying", 1));
  }, 180_000);

  it("a retryable failure of the height in progress when stop() was called is not retried: processing ends by the stop", async () => {
    const db = await backend.database();
    let reached!: () => void;
    const atTwo = new Promise<void>((resolve) => {
      reached = resolve;
    });
    let fail!: () => void;
    const failing = new Promise<void>((resolve) => {
      fail = resolve;
    });
    const fetching = loggingModule("fetching", [], [], {
      points: {
        async "on-fetch"(_p, b) {
          if (b.height !== 2n) return;
          reached();
          await failing;
          throw new UmbraError("node-unreachable", "the node did not answer while the process stops");
        },
      },
    });
    const started = start(db, [fetching], new InMemoryBlockSource({ head: HEAD }));
    await atTwo;
    const stopping = started.handle.stop();
    fail();
    await stopping;
    expect(await started.handle.ended).toEqual({ kind: "signal" });
    expect(started.handle.status()).toMatchObject({ state: "stopping", conditions: [], reason: null });
    expect(started.lines).toEqual([]);
    expect(await cursorIn(db)).toBe(1);
  }, 180_000);

  it("a lost connection at the loop's cursor read is retried with database-retrying and no height", async () => {
    const db = await backend.database();
    const seen: ProcessStatus[] = [];
    let reads = 0;
    let handle!: ProcessHandle;
    const source = new InMemoryBlockSource({ head: HEAD });
    // The first cursor read is startup's, the second the loop's.
    const flaky = flakySource(source, (method) => {
      if (method !== "cursor") return undefined;
      reads++;
      if (reads === 3) seen.push(handle.status());
      return reads === 2 ? new UmbraError("connection-lost", "the reader connection was lost") : undefined;
    });
    const started = start(db, [], flaky);
    handle = started.handle;
    try {
      expect(await settle(handle, source, HEAD)).toBe("waiting");
    } finally {
      await handle.stop();
    }
    expect(seen.map((status) => status.conditions)).toEqual([[{ code: "database-retrying", attempts: 1, height: null }]]);
    expect(started.lines).toHaveLength(1);
    expect(started.lines[0]).toMatch(retryLine("processing", "database-retrying", 1));
    expect(await cursorIn(db)).toBe(5);
  }, 180_000);

  it("a stop during the back-off ends processing at once", async () => {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: HEAD });
    const failing = flakySource(source, (method, height) =>
      method === "block" && height === 2n ? new UmbraError("node-unreachable", "never answers") : undefined,
    );
    // The default ceiling: 1 s, 2 s, then 4 s before the third retry.
    const log: string[] = [];
    const started = start(db, [loggingModule("w", log, ["on-after-db-write"])], failing, {});
    const third = signal();
    const watching = setInterval(() => {
      if (started.lines.some((line) => line.includes("attempt 3"))) third.resolve();
    }, 5);
    try {
      await third.promise;
    } finally {
      clearInterval(watching);
    }
    expect(started.handle.status().conditions).toEqual([{ code: "node-retrying", attempts: 3, height: 2n }]);
    await sleep(50);
    const before = [...log];
    const began = performance.now();
    await started.handle.stop();
    expect(performance.now() - began).toBeLessThan(2_000);
    expect(await started.handle.ended).toEqual({ kind: "signal" });
    // The cursor's on-after-db-write was re-delivered at each retry, and no callback ran after the stop.
    expect(before).toEqual(["w on-after-db-write@1", "w on-after-db-write@1", "w on-after-db-write@1"]);
    expect(log).toEqual(before);
    expect(started.lines.filter((line) => line.includes("retries in"))).toHaveLength(3);
    expect(started.lines[2]).toMatch(/^processing retries in 4000 ms \(node-retrying, attempt 3\): /);
  }, 180_000);

  if (backend.kind === "postgres") {
    it("the writer's connection terminated during on-db-write of h: retried with database-retrying, h committed once, complete", async () => {
      const db = await backend.database();
      const log: string[] = [];
      const reached = signal();
      const release = signal();
      const seen: ProcessStatus[] = [];
      let handle!: ProcessHandle;
      let held = false;
      const w = twoRows(log, async (height) => {
        if (height !== 3n) return;
        if (held) {
          seen.push(handle.status());
          return;
        }
        held = true;
        reached.resolve();
        await release.promise;
      });
      const source = new InMemoryBlockSource({ head: HEAD });
      const started = start(db, [w], source);
      handle = started.handle;
      try {
        await reached.promise;
        await db.terminateWriter!();
        release.resolve();
        expect(await settle(handle, source, HEAD)).toBe("waiting");
        expect(handle.status()).toMatchObject({ state: "following", conditions: [], cursor: HEAD, reason: null });
      } finally {
        await handle.stop();
      }
      expect(seen.map((status) => status.conditions)).toEqual([[{ code: "database-retrying", attempts: 1, height: 3n }]]);
      expect(started.lines).toHaveLength(1);
      expect(started.lines[0]).toMatch(retryLine("processing", "database-retrying", 1));
      expect(started.lines[0]).toContain("connection");
      expect(log).toEqual([
        "w on-db-write@1",
        "w on-after-db-write@1",
        "w on-db-write@2",
        "w on-after-db-write@2",
        "w on-db-write@3",
        "w on-after-db-write@2",
        "w on-db-write@3",
        "w on-after-db-write@3",
        "w on-db-write@4",
        "w on-after-db-write@4",
        "w on-db-write@5",
        "w on-after-db-write@5",
      ]);
      expect(await pairs(db, "SELECT height::int AS h, count(*)::int AS v FROM w.rows GROUP BY height ORDER BY height")).toEqual([
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
      ]);
    }, 180_000);

    it("the writer's connection terminated during on-start-db: startup retried with database-retrying while starting", async () => {
      const db = await backend.database();
      const reached = signal();
      const release = signal();
      const seen: ProcessStatus[] = [];
      let handle!: ProcessHandle;
      let calls = 0;
      const setup = loggingModule("setup", [], [], {
        points: {
          async "on-start-db"(_p, w) {
            calls++;
            if (calls > 1) {
              seen.push(handle.status());
              return;
            }
            reached.resolve();
            await release.promise;
            await w.execute("INSERT INTO setup.rows (height) VALUES (0)");
          },
        },
      });
      const source = new InMemoryBlockSource({ head: HEAD });
      const started = start(db, [setup], source);
      handle = started.handle;
      try {
        await reached.promise;
        await db.terminateWriter!();
        release.resolve();
        await handle.started;
        // Startup completed: the condition is gone before any height commits.
        expect(handle.status()).toMatchObject({ conditions: [], cursor: null });
        expect(await settle(handle, source, HEAD)).toBe("waiting");
        expect(handle.status()).toMatchObject({ state: "following", conditions: [] });
      } finally {
        await handle.stop();
      }
      expect(seen).toHaveLength(1);
      expect(seen[0]).toMatchObject({ state: "starting", conditions: [{ code: "database-retrying", attempts: 1, height: null }] });
      expect(started.lines).toHaveLength(1);
      expect(started.lines[0]).toMatch(retryLine("startup", "database-retrying", 1));
      expect(await cursorIn(db)).toBe(5);
      // The rolled-back first on-start-db wrote nothing.
      expect(await db.query("SELECT height FROM setup.rows")).toEqual([]);
    }, 180_000);

    it("a writer that finds its lock taken when it reconnects halts with writer-lock-lost, for good (DB-11)", async () => {
      const db = await backend.database();
      const reached = signal();
      const release = signal();
      let held = false;
      const w = twoRows([], async (height) => {
        if (height !== 3n || held) return;
        held = true;
        reached.resolve();
        await release.promise;
      });
      const source = new InMemoryBlockSource({ head: HEAD });
      const started = start(db, [w], source);
      try {
        await reached.promise;
        await db.terminateWriter!();
        expect(await db.takeWriterLock!()).toBe(true);
        release.resolve();
        expect(await started.handle.ended).toMatchObject({ kind: "failed" });
        expect(started.handle.status()).toMatchObject({
          state: "halted",
          ready: false,
          reason: { code: "writer-lock-lost", height: 3n, module: null, point: null },
          conditions: [],
          cursor: 2n,
        });
      } finally {
        await started.handle.stop();
      }
      expect(started.lines).toHaveLength(2);
      expect(started.lines[0]).toMatch(retryLine("processing", "database-retrying", 1));
      expect(started.lines[1]).toMatch(/^processing halted \(writer-lock-lost\): /);
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);
  }
});
