import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ADMIN_PARTS, ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import type { AdminSnapshot, AdminView } from "../../../src/admin/types.js";
import { CORE_BLOCK_COMMIT } from "../../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_CHAIN } from "../../../src/backbone/core-chain/index.js";
import { CORE_DIGEST } from "../../../src/backbone/core-digest/index.js";
import { CORE_HEALTH, CORE_HEALTH_ENDPOINTS } from "../../../src/backbone/core-health/index.js";
import { buildDeclarations } from "../../../src/cli/build-modules.js";
import { UMBRADB_VERSION } from "../../../src/config/build.js";
import { BACKBONE_ORDER, resolveGraph } from "../../../src/modules/graph.js";
import { validateDeclarations } from "../../../src/modules/validation.js";
import type { ProcessState } from "../../../src/runner/process.js";
import { ask, startWithAdmin, statusWhen } from "../../admin/admin-harness.js";
import { LOOP_BACKBONE } from "../../runner/loop-harness.js";

/**
 * The backbone part `core-health` (task 8.2; AE-1, AE-2, AE-4; CORE-ARCH §4.11, §4.18; Q70): its declaration — a
 * backbone part with no points that requires and provides no item, in RN-3's fixed order after `core-digest` and in
 * the command's build —, its two endpoints' answers as functions of the published snapshot, and A140 for them: they
 * are `core-health`'s, from its own folder under `src/backbone/`, with its tests beside it here, and the admin route
 * table mounts them as the part gives them.
 */

/** A snapshot of a process in `state` at lag `lag`, its readiness lag `readinessLag`, liveness timeout `liveness`. */
function snapshot(
  state: ProcessState,
  lag: string | null,
  readinessLag: number | null = null,
  liveness = 30_000,
): AdminSnapshot {
  return {
    livenessTimeoutMs: liveness,
    readinessLag,
    status: { state, ready: false, conditions: [], cursor: "3", head: "3", lag, reason: null },
    config: { core: null },
  };
}

const view = (given: AdminSnapshot, beatAgeMs = 0): AdminView => ({ snapshot: given, beatAgeMs });
const get = (path: string, given: AdminView) => answerAdmin(ADMIN_ROUTES, "GET", path, given);

describe("core-health's declaration (CORE-ARCH §4.11: no points, requires nothing, provides the endpoints)", () => {
  it("is a backbone part with no points, no items and no migrations, starting where the core starts", () => {
    expect(CORE_HEALTH).toMatchObject({
      id: "core-health",
      version: UMBRADB_VERSION,
      side: "public",
      requires: [],
      provides: [],
      startsMidChain: true,
      migrations: [],
      points: {},
    });
    expect(Object.isFrozen(CORE_HEALTH)).toBe(true);
    expect(BACKBONE_ORDER).toContain(CORE_HEALTH.id);
    const set = validateDeclarations({ backbone: [CORE_CHAIN, CORE_BLOCK_COMMIT, CORE_DIGEST, CORE_HEALTH], core: [], user: [] });
    expect(set.backbone.at(-1)).toBe(CORE_HEALTH);
  });

  it("runs in RN-3's fixed order after core-digest, and is in the command's build after it", () => {
    // The test backbone (`core-block-fetch`'s stand-in among them), given in another order.
    const declarations = validateDeclarations({ backbone: [CORE_HEALTH, ...[...LOOP_BACKBONE].reverse()], core: [], user: [] });
    const graph = resolveGraph({ declarations, start: 1n, entries: [], developmentOptIn: false, cursor: null });
    const ids = graph.modules.map((part) => part.id);
    expect(ids.indexOf("core-health")).toBe(ids.indexOf("core-digest") + 1);
    const build = buildDeclarations().backbone.map((part) => part.id);
    expect(build).toContain("core-health");
    expect(build.indexOf("core-health")).toBeGreaterThan(build.indexOf("core-digest"));
    expect(buildDeclarations().backbone.find((part) => part.id === "core-health")).toBe(CORE_HEALTH);
  });
});

describe("/health/live (AE-2): the heartbeat's age against the liveness timeout, in every state", () => {
  it("answers 200 while the last tick is within the timeout and 503 once it is older, with the age and the timeout", () => {
    const following = snapshot("following", "0", null, 5_000);
    expect(get("/health/live", view(following, 0))).toEqual({
      status: 200,
      body: { live: true, heartbeatAgeMs: 0, livenessTimeoutMs: 5_000 },
    });
    expect(get("/health/live", view(following, 1_234.4))).toEqual({
      status: 200,
      body: { live: true, heartbeatAgeMs: 1_234, livenessTimeoutMs: 5_000 },
    });
    // At the timeout it is still live; past it, not.
    expect(get("/health/live", view(following, 5_000)).status).toBe(200);
    expect(get("/health/live", view(following, 5_000.5))).toEqual({
      status: 503,
      body: { live: false, heartbeatAgeMs: 5_001, livenessTimeoutMs: 5_000 },
    });
    // A tick the main thread wrote after the worker read its clock: never a negative age.
    expect(get("/health/live", view(following, -0.3)).body).toEqual({ live: true, heartbeatAgeMs: 0, livenessTimeoutMs: 5_000 });
  });

  it("never reads the state: a refused, halted, starting or stopping process is live while it ticks, and stuck when not", () => {
    for (const state of ["starting", "refused", "syncing", "following", "stopped", "halted", "stopping"] as const) {
      const given = snapshot(state, null, 10, 30_000);
      expect(get("/health/live", view(given, 10)).status, state).toBe(200);
      expect(get("/health/live", view(given, 30_001)).status, state).toBe(503);
    }
  });
});

describe("/health/ready (AE-4): the part's decision from the published state, lag and readiness lag", () => {
  it("answers 200 or 503 with the state, the lag and the readiness lag it decided from", () => {
    expect(get("/health/ready", view(snapshot("syncing", "500", 10)))).toEqual({
      status: 503,
      body: { ready: false, state: "syncing", lag: "500", readinessLag: 10 },
    });
    expect(get("/health/ready", view(snapshot("syncing", "10", 10)))).toEqual({
      status: 200,
      body: { ready: true, state: "syncing", lag: "10", readinessLag: 10 },
    });
    expect(get("/health/ready", view(snapshot("stopped", "100", 10)))).toEqual({
      status: 200,
      body: { ready: true, state: "stopped", lag: "100", readinessLag: 10 },
    });
    expect(get("/health/ready", view(snapshot("following", "15", 10)))).toEqual({
      status: 503,
      body: { ready: false, state: "following", lag: "15", readinessLag: 10 },
    });
    expect(get("/health/ready", view(snapshot("starting", null)))).toEqual({
      status: 503,
      body: { ready: false, state: "starting", lag: null, readinessLag: null },
    });
  });

  it("decides from the state and the lag, not from the published ready flag; liveness does not change it", () => {
    const given = snapshot("following", "0", 10);
    const flagged: AdminSnapshot = { ...given, status: { ...given.status, ready: false } };
    expect(get("/health/ready", view(flagged)).status).toBe(200);
    expect(get("/health/ready", view(flagged, 999_999)).status).toBe(200);
  });
});

describe("A140 for /health/live and /health/ready: core-health's, from its own folder, its tests beside it", () => {
  it("the admin route table mounts core-health's two endpoints, as the part gives them, and nothing else of it", () => {
    const part = ADMIN_PARTS.find((each) => each.id === "core-health");
    expect(part).toBe(CORE_HEALTH_ENDPOINTS);
    expect(CORE_HEALTH_ENDPOINTS.id).toBe(CORE_HEALTH.id);
    expect(CORE_HEALTH_ENDPOINTS.endpoints.map((endpoint) => endpoint.path)).toEqual(["/health/live", "/health/ready"]);
    for (const endpoint of CORE_HEALTH_ENDPOINTS.endpoints) expect(ADMIN_ROUTES.get(endpoint.path)).toBe(endpoint);
    expect(Object.isFrozen(CORE_HEALTH_ENDPOINTS) && Object.isFrozen(CORE_HEALTH_ENDPOINTS.endpoints)).toBe(true);
  });

  it("a refused process answers both: live 200 while it ticks, ready 503 with the state refused", async () => {
    // Refused by the validation (a liveness timeout that is no number): no database is opened.
    const run = startWithAdmin({ database: "postgres://indexer:unused@127.0.0.1:9/umbradb", extra: { livenessTimeoutMs: "5 s" } });
    await expect(run.handle.started).rejects.toMatchObject({ code: "invalid-configuration" });
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.state === "refused");
    expect(await ask(origin, "/health/live")).toMatchObject({ status: 200, json: { live: true } });
    expect(await ask(origin, "/health/ready")).toMatchObject({
      status: 503,
      json: { ready: false, state: "refused", lag: null, readinessLag: null },
    });
    await run.handle.stop();
  });

  it("lives in src/backbone/core-health/, with its tests in test/backbone/core-health/", () => {
    const source = fileURLToPath(new URL("../../../src/backbone/core-health/", import.meta.url));
    for (const file of ["core-health.ts", "endpoints.ts", "readiness.ts", "index.ts"]) {
      expect(existsSync(`${source}${file}`), file).toBe(true);
    }
    const tests = readdirSync(fileURLToPath(new URL(".", import.meta.url))).filter((file) => file.endsWith(".test.ts"));
    expect(tests.sort()).toEqual(["core-health.test.ts", "liveness.test.ts", "readiness.test.ts"]);
  });
});
