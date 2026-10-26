import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import { readinessOf } from "../../../src/backbone/core-health/index.js";
import { UmbraError } from "../../../src/db/errors.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import type { BlockItemSource } from "../../../src/backbone/core-block-fetch/index.js";
import type { BlockRef, BlockSource } from "../../../src/runner/block-source.js";
import { type ProcessState, statusOf } from "../../../src/runner/process.js";
import {
  adminSnapshot,
  adminSource,
  type AdminRun,
  ask,
  type Gate,
  gate,
  mainThreadAdmin,
  startWithAdmin,
  statusSnapshot,
  statusWhen,
} from "../../admin/admin-harness.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { loggingModule } from "../../runner/process-build.js";
import { ae4, caseText, READINESS_CASES, readinessProblems, WRONG_DECISIONS } from "./readiness-cases.js";

/**
 * `/health/ready` (task 8.2; AE-4; A65, A140): `core-health` decides it in AE-4's order — 503 while `starting`,
 * `refused`, `halted` or `stopping`; 200 while `stopped`, whatever the lag; otherwise 200 when no readiness lag is set or
 * the lag is at or below it — from the published state and lag and the process revision's `readinessLag`, by
 * `readinessOf`, which the runner's `status()` uses too, so `/status`'s `ready` and `/health/ready` never disagree.
 *
 * The decision is tested against AE-4's cases (`./readiness-cases.ts`), each built so that applying another rule first
 * gets it wrong; the committed negative controls are those wrong orders, each failing the cases of the rule it moves,
 * and, through a process, the order task 5.3 first had (`following` ready before the lag is looked at), which fails
 * A65's third case. A65 then passes through the process: a readiness lag of 10 with lag 500 (503, then 200 once the
 * lag is 10 — every answer of the catch-up checked against AE-4; on PGlite, see the test), a stopped process with lag
 * 100 (200), a following one with threshold 20 and lag 15 (503), on PostgreSQL 18 and PGlite; and rule 1 before rule 3
 * there too (a halted or stopping process within its readiness lag answers 503), and conditions that change nothing.
 */

/** A module whose `on-compute` awaits the gate of each height that has one. */
function holding(gates: ReadonlyMap<bigint, Gate>): ModuleDeclaration {
  const base = loggingModule("m", [], ["on-db-write"]);
  return {
    ...base,
    points: {
      ...base.points,
      async "on-compute"(_p, b) {
        await gates.get(b.height)?.wait();
      },
    },
  };
}

/** `/health/ready`'s answer: its status and body. */
async function ready(origin: string) {
  const answer = await ask(origin, "/health/ready");
  return { status: answer.status, body: answer.json as { ready: boolean; state: string; lag: string | null; readinessLag: number | null } };
}

/**
 * AE-4's oracle over observed answers: each `/health/ready` answer is 200 exactly when AE-4 says so for the state, lag
 * and readiness lag it shows, and its body's `ready` agrees with its status.
 */
function observedProblems(answers: readonly Awaited<ReturnType<typeof ready>>[], readinessLag: number | null): string[] {
  return answers.flatMap(({ status, body }) => {
    const expected = ae4(body.state, body.lag, readinessLag) ? 200 : 503;
    const where = `${body.state}, lag ${body.lag ?? "null"}, readiness lag ${readinessLag ?? "none"}`;
    if (status !== expected) return [`${where} answered ${status}, not ${expected}`];
    if (body.ready !== (status === 200)) return [`${where}: the body says ready ${body.ready} with ${status}`];
    if (body.readinessLag !== readinessLag) return [`${where}: the body says readiness lag ${body.readinessLag}`];
    return [];
  });
}

/** `/health/ready` once `/status` shows what `wanted` holds of. */
async function readyWhen(origin: string, wanted: Parameters<typeof statusWhen>[1]) {
  const status = await statusWhen(origin, wanted, 60_000);
  const answer = await ready(origin);
  // `/status`'s ready is the runner's, by the same decision.
  expect(answer.body.ready, `/status says ready ${status.ready}`).toBe(status.ready);
  return answer;
}

describe("readinessOf: AE-4's order", () => {
  it("decides every case of AE-4 by its rule", () => {
    expect(readinessProblems(readinessOf)).toEqual([]);
  });

  it("is the runner's status().ready: statusOf decides by it, from its state and lag", () => {
    const phases = ["starting", "refused", "running", "stopped", "halted", "stopping"] as const;
    for (const phase of phases) {
      for (const head of [null, 1n, 5n, 15n, 100n, 600n]) {
        for (const readinessLag of [null, 0, 10, 20]) {
          const status = statusOf({
            phase,
            start: 1n,
            cursor: 1n,
            head,
            followingThreshold: 20,
            readinessLag,
            conditions: [],
            ended: null,
            reason: null,
          });
          expect(status.ready, `${phase} ${head} ${readinessLag}`).toBe(
            readinessOf({ state: status.state, lag: status.lag, readinessLag }),
          );
          expect(status.ready, `${phase} ${head} ${readinessLag}`).toBe(
            ae4(status.state, status.lag === null ? null : String(status.lag), readinessLag),
          );
        }
      }
    }
  });

  it("is what /health/ready answers for every case, from the snapshot (the conditions published with it)", () => {
    for (const c of READINESS_CASES) {
      const conditions = c.conditions.map((code) => ({ code }));
      const answer = answerAdmin(ADMIN_ROUTES, "GET", "/health/ready", {
        beatAgeMs: 0,
        nowNs: 0n,
        snapshot: adminSnapshot({
          readinessLag: c.readinessLag,
          status: statusSnapshot({
            state: c.state,
            ready: !c.ready,
            conditions,
            cursor: "1",
            head: null,
            lag: c.lag === null ? null : String(c.lag),
          }),
        }),
      });
      expect(answer.status, caseText(c)).toBe(c.ready ? 200 : 503);
    }
  });

  it("negative controls: each rule applied out of AE-4's order, or a rule AE-4 lacks, fails the cases of the rule it moves", () => {
    const failed = Object.fromEntries(
      Object.entries(WRONG_DECISIONS).map(([name, decide]) => [name, readinessProblems(decide)]),
    );
    expect(failed["rule 3 before rules 1 and 2"]).toEqual(
      expect.arrayContaining([
        "rule 1: halted, lag 0, readiness lag 10 decided 200, not 503",
        "rule 1: stopping, lag 5, readiness lag 10 decided 200, not 503",
        "rule 2: stopped, lag 100, readiness lag 10 decided 503, not 200",
      ]),
    );
    expect(failed["rule 3 before rule 2"]).toEqual([
      "rule 2: stopped, lag 100, readiness lag 10 decided 503, not 200",
      "rule 2: stopped, lag 100, readiness lag 10, conditions upgrade-required decided 503, not 200",
      "rule 2: stopped, lag null, readiness lag 10 decided 503, not 200",
    ]);
    expect(failed["following before rule 3"]).toEqual(["rule 3: following, lag 15, readiness lag 10 decided 200, not 503"]);
    expect(failed["conditions as a rule"]).toEqual([
      "rule 2: stopped, lag 100, readiness lag 10, conditions upgrade-required decided 503, not 200",
      "rule 3: following, lag 2, readiness lag 10, conditions node-retrying decided 503, not 200",
      "rule 3: syncing, lag 8, readiness lag 10, conditions database-retrying finality-stall decided 503, not 200",
    ]);
  });
});

/** A source whose block at `height` fails with `node-unreachable` (retryable) until `healed`. */
function unreachableAt(height: bigint, healed: () => boolean): BlockSource & BlockItemSource {
  const source = adminSource(3n);
  return {
    cursor: (read) => source.cursor(read),
    finalizedHead: () => source.finalizedHead(),
    waitForHead: (above, signal) => source.waitForHead(above, signal),
    // core-block-fetch's items, as the source gives them (task 10.3).
    blockItems: (block: BlockRef) => source.blockItems(block),
    block: async (at) => {
      if (at === height && !healed()) throw new UmbraError("node-unreachable", "the test's node-unreachable");
      return source.block(at);
    },
  };
}

describe.each(PROCESS_BACKENDS)("A65: /health/ready through the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  // The catch-up commits 490 blocks: 7 s on PGlite, 152 s on PostgreSQL at a load average of 20–50 (each block's
  // statements through Docker's port proxy). What it checks is the decision on the published lag, which does not depend
  // on the backend, so it runs on PGlite; A65's other cases, and rule 1's, run on both.
  it.runIf(backend.kind === "pglite")("A65: readiness lag 10 and lag 500 answers 503, then 200 once the lag is 10 or less; every answer as AE-4 says", async () => {
    const gates = new Map([2n, 491n, 492n].map((height) => [height, gate()]));
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [holding(gates)],
      head: 501n,
      extra: { readinessLag: 10 },
    });
    const origin = await run.origin();
    await gates.get(2n)?.reached;
    expect(await readyWhen(origin, (body) => body.cursor === "1" && body.head === "501")).toEqual({
      status: 503,
      body: { ready: false, state: "syncing", lag: "500", readinessLag: 10 },
    });
    gates.get(2n)?.open();
    // The catch-up: every answer is AE-4's for what it shows.
    const answers: Awaited<ReturnType<typeof ready>>[] = [];
    let reached = false;
    void gates.get(491n)?.reached.then(() => {
      reached = true;
    });
    while (!reached) {
      answers.push(await ready(origin));
      // The test's requests share the process's main thread: leave it to the blocks.
      await sleep(20);
    }
    expect(answers.length).toBeGreaterThan(0);
    expect(observedProblems(answers, 10)).toEqual([]);
    expect(await readyWhen(origin, (body) => body.cursor === "490")).toEqual({
      status: 503,
      body: { ready: false, state: "syncing", lag: "11", readinessLag: 10 },
    });
    gates.get(491n)?.open();
    await gates.get(492n)?.reached;
    expect(await readyWhen(origin, (body) => body.cursor === "491")).toEqual({
      status: 200,
      body: { ready: true, state: "syncing", lag: "10", readinessLag: 10 },
    });
    gates.get(492n)?.open();
    expect(await readyWhen(origin, (body) => body.cursor === "501")).toMatchObject({
      status: 200,
      body: { ready: true, state: "following", lag: "0" },
    });
    await run.handle.stop();
  }, 180_000);

  it("A65: stopped answers 200 even with lag 100 and readiness lag 10 (rule 2 before rule 3)", async () => {
    const run = startWithAdmin({ database: (await backend.database()).setting, head: 103n, stop: 3, extra: { readinessLag: 10 } });
    expect(await readyWhen(await run.origin(), (body) => body.state === "stopped")).toEqual({
      status: 200,
      body: { ready: true, state: "stopped", lag: "100", readinessLag: 10 },
    });
    await run.handle.stop();
  }, 120_000);

  it("A65: following with following threshold 20, readiness lag 10 and lag 15 answers 503; at the head, 200", async () => {
    const gates = new Map([[2n, gate()]]);
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      user: [holding(gates)],
      head: 16n,
      extra: { followingThreshold: 20, readinessLag: 10 },
    });
    const origin = await run.origin();
    await gates.get(2n)?.reached;
    expect(await readyWhen(origin, (body) => body.cursor === "1" && body.head === "16")).toEqual({
      status: 503,
      body: { ready: false, state: "following", lag: "15", readinessLag: 10 },
    });
    gates.get(2n)?.open();
    expect(await readyWhen(origin, (body) => body.cursor === "16")).toEqual({
      status: 200,
      body: { ready: true, state: "following", lag: "0", readinessLag: 10 },
    });
    await run.handle.stop();
  }, 120_000);

  it("rule 1 before rule 3: halted and stopping within the readiness lag answer 503", async () => {
    const failing = loggingModule("f", [], ["on-db-write"], {
      points: {
        ...loggingModule("f", [], ["on-db-write"]).points,
        async "on-compute"(_p, b) {
          if (b.height === 2n) throw new Error("the test's failure");
        },
      },
    });
    const halted = startWithAdmin({ database: (await backend.database()).setting, user: [failing], extra: { readinessLag: 10 } });
    expect(await readyWhen(await halted.origin(), (body) => body.state === "halted")).toEqual({
      status: 503,
      body: { ready: false, state: "halted", lag: "2", readinessLag: 10 },
    });
    await halted.handle.stop();

    const gates = new Map([[2n, gate()]]);
    const stopping = startWithAdmin({ database: (await backend.database()).setting, user: [holding(gates)], extra: { readinessLag: 10 } });
    const origin = await stopping.origin();
    await gates.get(2n)?.reached;
    const stopped = stopping.handle.stop();
    expect(await readyWhen(origin, (body) => body.state === "stopping")).toEqual({
      status: 503,
      body: { ready: false, state: "stopping", lag: "2", readinessLag: 10 },
    });
    gates.get(2n)?.open();
    await stopped;
  }, 120_000);

  it("conditions change nothing: following while a node failure is retried answers 200 within the readiness lag", async () => {
    let healed = false;
    const run = startWithAdmin({
      database: (await backend.database()).setting,
      source: unreachableAt(2n, () => healed),
      extra: { readinessLag: 10, backoffCeilingMs: 200 },
    });
    const origin = await run.origin();
    const answer = await readyWhen(origin, (body) => body.conditions.some((condition) => condition.code === "node-retrying"));
    expect(answer).toEqual({ status: 200, body: { ready: true, state: "following", lag: "2", readinessLag: 10 } });
    healed = true;
    await statusWhen(origin, (body) => body.cursor === "3" && body.conditions.length === 0, 60_000);
    await run.handle.stop();
  }, 120_000);

  it("negative control: /health/ready with following ready before the lag (task 5.3's first rule) fails A65's third case", async () => {
    const wrong = WRONG_DECISIONS["following before rule 3"] as NonNullable<(typeof WRONG_DECISIONS)[string]>;
    const gates = new Map([[2n, gate()]]);
    const run: AdminRun = startWithAdmin({
      database: (await backend.database()).setting,
      user: [holding(gates)],
      head: 16n,
      extra: { followingThreshold: 20, readinessLag: 10 },
      starter: mainThreadAdmin((method, url, view) => {
        if (method !== "GET" || url !== "/health/ready") return answerAdmin(ADMIN_ROUTES, method, url, view);
        const { state, lag } = view.snapshot.status;
        const facts = { state: state as ProcessState, lag: lag === null ? null : BigInt(lag), readinessLag: view.snapshot.readinessLag, conditions: [] };
        const decided = wrong(facts);
        return { status: decided ? 200 : 503, body: { ready: decided, state, lag, readinessLag: view.snapshot.readinessLag } };
      }),
    });
    const origin = await run.origin();
    await gates.get(2n)?.reached;
    await statusWhen(origin, (body) => body.cursor === "1" && body.head === "16");
    expect(observedProblems([await ready(origin)], 10)).toEqual(["following, lag 15, readiness lag 10 answered 200, not 503"]);
    gates.get(2n)?.open();
    await run.handle.stop();
  }, 120_000);
});
