import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { adminRoutes, ADMIN_PARTS, answerAdmin } from "../../src/admin/routes.js";
import type { AdminPart } from "../../src/admin/types.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { loggingModule } from "../runner/process-build.js";
import {
  type AdminRun,
  ask,
  databaseReadingAdmin,
  ENDPOINTS,
  type Hold,
  mainThreadAdmin,
  newHold,
  OTHER_REQUESTS,
  routeProblems,
  startProber,
  startWithAdmin,
  statusWhen,
  timingProblems,
} from "./admin-harness.js";

/**
 * The admin endpoints through the process, on both backends:
 * - The four endpoints answer on the admin listener: a worker thread of its own, answering from the snapshot the runner
 *   publishes, never reading the database.
 * - Every other method and path answers 404, a module's own route among them (it answers on the module API listener
 *   only). [Q70]
 * - While a callback runs a 10 s synchronous loop on the main thread, and while a block transaction holds the database
 *   for 5 s (on PGlite, its one queue), each endpoint answers within 1 s.
 * [A62, AE-1]
 *
 * **How the time is measured, so that load cannot fake a pass or a failure:** the prober (`prober.mjs`) is a worker
 * thread of the test's own, so neither hold delays it; it requests the four endpoints in turn every 150 ms and times
 * each answer from just before its request to the end of its answer, on `process.hrtime.bigint()` — the clock every
 * thread of the process shares, which the callbacks also read when their hold begins and ends. Only requests sent from
 * the hold's start to 1 s before its end count (a request sent later would be answered after the hold anyway), and at
 * least 4 of each endpoint must be among them, so "each answers within 1 s" is never vacuous. The holds are made on
 * purpose and checked: the loop really runs 10 s on the main thread (the control on the main thread misses it), the
 * PGlite queue really is held (a read started inside the hold returns only after it), PostgreSQL's block transaction
 * really is open (`idle in transaction`). The real server's answers take milliseconds, a thousandfold margin; the
 * controls' take seconds.
 *
 * Committed negative controls: an admin server on the main thread fails the loop's case; one that reads the database
 * fails the held queue's case (PGlite: on PostgreSQL a read does not wait for the writer); a route table that serves a
 * module's path fails the 404 case.
 */

/** The statuses each endpoint may answer during the holds: live and ready, the process up and processing. [A62] */
const DURING: Readonly<Record<string, readonly number[]>> = {
  "/health/live": [200],
  "/health/ready": [200, 503],
  "/status": [200],
  "/config": [200],
};

/** Module `m`: a module API route `GET /m/rows` on `listen.api`, and the points `log` records. */
function withRoute(log: string[]): ModuleDeclaration {
  return loggingModule("m", log, ["on-db-write"], {
    points: {
      ...loggingModule("m", log, ["on-db-write"]).points,
      async "on-start-api"(_p, api) {
        api.http("GET", "/m/rows", async (_request, read) => ({ status: 200, body: { height: read.height } }));
      },
    },
  });
}

/** Module `busy`: at height 2 its `on-compute` runs a synchronous loop of `ms` on the main thread, timed in `hold`. */
function busy(hold: Hold, ms: number): ModuleDeclaration {
  return loggingModule("busy", [], ["on-db-write"], {
    points: {
      ...loggingModule("busy", [], ["on-db-write"]).points,
      async "on-compute"(_p, b) {
        if (b.height !== 2n) return;
        hold.start = process.hrtime.bigint();
        const until = hold.start + BigInt(ms) * 1_000_000n;
        while (process.hrtime.bigint() < until) {
          // A callback that blocks the main thread: nothing else of this thread runs meanwhile. [AE-2]
        }
        hold.end = process.hrtime.bigint();
      },
    },
  });
}

/**
 * Module `holder`: at height 2 its `on-db-write` keeps the block transaction open for `ms`, timed in `hold`; `reached`
 * is told when the hold begins.
 */
function holder(hold: Hold, ms: number, reached: () => void = () => undefined): ModuleDeclaration {
  return loggingModule("holder", [], [], {
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO holder.rows (height) VALUES ($1)", [b.height]);
        if (b.height !== 2n) return;
        hold.start = process.hrtime.bigint();
        reached();
        // At least `ms` by the clock the prober reads: a timer may fire a fraction of a millisecond early by it.
        const until = hold.start + BigInt(ms) * 1_000_000n;
        while (process.hrtime.bigint() < until) await sleep(Number((until - process.hrtime.bigint()) / 1_000_000n) + 1);
        hold.end = process.hrtime.bigint();
      },
    },
  });
}

/** Runs `run` past its hold at height 2 with the prober on the four endpoints; the prober's records. */
async function probedThroughHold(run: AdminRun) {
  const origin = await run.origin();
  await statusWhen(origin, (body) => body.cursor === "1");
  const prober = await startProber(origin, ENDPOINTS);
  await sleep(300);
  run.memory?.finalize(3n);
  await statusWhen(origin, (body) => body.cursor === "3", 60_000);
  return prober.stop();
}

describe.each(PROCESS_BACKENDS)("A62: the admin endpoints on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A62: the four endpoints answer on the admin listener; every other method and path, a module's route among them, answers 404", async () => {
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [withRoute([])],
      extra: { listen: { api: "127.0.0.1:0" } },
    });
    const { api } = await run.handle.started;
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.state === "following" && body.cursor === "3");
    const endpoints = [
      ...(await Promise.all(ENDPOINTS.map((path) => ask(origin, path)))),
      await ask(origin, "/status?verbose=1"),
      await ask(origin, "/config?x"),
    ];
    // The module's route answers on the module API listener, and only there.
    const moduleApi = await ask(`http://${api?.host}:${api?.port}`, "/m/rows");
    expect(moduleApi).toMatchObject({ status: 200, json: { height: "3" } });
    const others = await Promise.all(
      [...OTHER_REQUESTS, ["GET", "/m/rows"] as const].map(([method, path]) => ask(origin, path, method)),
    );
    expect(routeProblems(endpoints, others)).toEqual([]);
    for (const answer of [...endpoints, ...others.filter((other) => other.method !== "HEAD")]) {
      expect(answer.contentType, `${answer.method} ${answer.path}`).toBe("application/json; charset=utf-8");
    }
    expect(endpoints.map((answer) => answer.status)).toEqual([200, 200, 200, 200, 200, 200]);
    expect(others.find((other) => other.method === "HEAD")).toMatchObject({ status: 404, text: "" });
    await run.handle.stop();
  }, 120_000);

  it("A62: while a callback runs a 10 s synchronous loop on the main thread, each endpoint answers within 1 s", async () => {
    const hold = newHold();
    const run = startWithAdmin({ database: (await backend.database()).setting, user: [busy(hold, 10_000)], head: 1n });
    const records = await probedThroughHold(run);
    expect(Number(hold.end - hold.start) / 1e6).toBeGreaterThanOrEqual(10_000);
    expect(timingProblems(records, hold, DURING)).toEqual([]);
    await run.handle.stop();
  }, 120_000);

  it("A62: while a block transaction holds the database for 5 s (on PGlite its one queue), each endpoint answers within 1 s", async () => {
    const hold = newHold();
    const db = await backend.database();
    let reached!: () => void;
    const began = new Promise<void>((resolve) => {
      reached = resolve;
    });
    const run = startWithAdmin({ database: db.setting, user: [holder(hold, 5_000, reached)], head: 1n, keepDb: true });
    // The hold is real: on PGlite a read of the process's database (its `db` item) started inside it waits for it; on
    // PostgreSQL the writer's session is open in its transaction. Both are asked from the test's own context, not the
    // callback's (whose own read PGlite refuses).
    const evidence = (async () => {
      await began;
      await sleep(500);
      if (backend.kind === "pglite") {
        const opened = await run.db();
        const asked = process.hrtime.bigint();
        await opened.read((read) => read.query("SELECT 1"));
        return `read waited ${Math.round(Number(process.hrtime.bigint() - asked) / 1e6)} ms`;
      }
      const rows = await db.query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE state = 'idle in transaction'");
      return `idle in transaction: ${rows[0]?.n}`;
    })();
    const records = await probedThroughHold(run);
    expect(Number(hold.end - hold.start) / 1e6).toBeGreaterThanOrEqual(5_000);
    const seen = await evidence;
    if (backend.kind === "pglite") {
      expect(Number(/read waited (\d+) ms/.exec(seen)?.[1]), seen).toBeGreaterThanOrEqual(4_000);
    } else {
      expect(Number(/idle in transaction: (\d+)/.exec(seen)?.[1]), seen).toBeGreaterThanOrEqual(1);
    }
    expect(timingProblems(records, hold, DURING)).toEqual([]);
    await run.handle.stop();
  }, 120_000);

  it("negative control: an admin server on the main thread fails A62's synchronous-loop case", async () => {
    const hold = newHold();
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [busy(hold, 10_000)],
      head: 1n,
      starter: mainThreadAdmin(),
    });
    const records = await probedThroughHold(run);
    const problems = timingProblems(records, hold, DURING);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.join("\n")).toMatch(/answered 200 after \d+ ms|only \d+ requests were sent during the hold/);
    await run.handle.stop();
  }, 120_000);

  it.runIf(backend.kind === "pglite")(
    "negative control: an admin server that reads the database fails A62's held-queue case",
    async () => {
      const hold = newHold();
      const db = await backend.database();
      const run: AdminRun = startWithAdmin({
        database: db.setting,
        user: [holder(hold, 5_000)],
        head: 1n,
        keepDb: true,
        starter: databaseReadingAdmin(() => run.db()),
      });
      const records = await probedThroughHold(run);
      const problems = timingProblems(records, hold, DURING);
      expect(problems.join("\n")).toMatch(/\/status: answered 200 after \d+ ms/);
      // Only /status, which reads the database, answered late; the prober's requests being sequential, its wait also
      // left the other endpoints fewer requests during the hold.
      const late = problems.filter((problem) => / after \d+ ms$/.test(problem));
      expect(late.every((problem) => problem.startsWith("/status"))).toBe(true);
      await run.handle.stop();
    },
    120_000,
  );

  it("negative control: a route table that serves a module's path fails A62's 404 case", async () => {
    const leaking: AdminPart = {
      id: "m",
      endpoints: [{ path: "/m/rows", answer: () => ({ status: 200, body: { height: null } }) }],
    };
    // The guard refuses it: only backbone parts provide admin endpoints. [Q70]
    expect(() => adminRoutes([...ADMIN_PARTS, leaking])).toThrow(/m is not a backbone part/);
    // A route table built past the guard serves it, and the oracle sees it.
    const routes = new Map([...adminRoutes(ADMIN_PARTS), ["/m/rows", leaking.endpoints[0] as AdminPart["endpoints"][number]]]);
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [withRoute([])],
      extra: { listen: { api: "127.0.0.1:0" } },
      starter: mainThreadAdmin((method, url, view) => answerAdmin(routes, method, url, view)),
    });
    await run.handle.started;
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.cursor === "3");
    const endpoints = await Promise.all(ENDPOINTS.map((path) => ask(origin, path)));
    const others = await Promise.all(
      [...OTHER_REQUESTS, ["GET", "/m/rows"] as const].map(([method, path]) => ask(origin, path, method)),
    );
    expect(routeProblems(endpoints, others)).toEqual(["GET /m/rows answered 200, not 404"]);
    await run.handle.stop();
  }, 120_000);
});
