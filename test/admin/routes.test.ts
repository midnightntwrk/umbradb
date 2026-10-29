import { describe, expect, it } from "vitest";
import { UNVALIDATED_CONFIG } from "../../src/admin/configuration.js";
import { ADMIN_PARTS, ADMIN_ROUTES, adminRoutes, answerAdmin, NOT_FOUND } from "../../src/admin/routes.js";
import type { AdminSnapshot, AdminView } from "../../src/admin/types.js";
import { CORE_CONFIG_ENDPOINTS } from "../../src/backbone/core-config/index.js";
import { CORE_HEALTH_ENDPOINTS } from "../../src/backbone/core-health/index.js";
import { CORE_STATUS_ENDPOINTS } from "../../src/backbone/core-status/index.js";
import { BACKBONE_ORDER } from "../../src/modules/graph.js";
import { OTHER_REQUESTS, statusSnapshot } from "./admin-harness.js";

/**
 * The admin route table:
 * - It mounts by path the endpoints of the backbone parts `core-health` (`/health/live`, `/health/ready`),
 *   `core-status` (`/status`) and `core-config` (`/config`). Only backbone parts may provide one. [AE-1, Q70]
 * - `GET` of one of their paths runs that endpoint's function on the snapshot (the query aside); anything else is 404
 *   `not-found`. [AE-1, AE-2]
 * - An endpoint that throws answers 500 with a fixed message. [AE-6]
 *
 * The endpoints' minimal functions here: `/health/live` from the heartbeat's age against the liveness timeout,
 * `/health/ready` from the published readiness, `/status` the published state, `/config` the published (redacted)
 * `core` revision. Their full bodies are tested with their parts (`test/backbone/core-*`).
 */

/** A snapshot of a process `following` at 3, ready, with the liveness timeout `liveness`. */
function snapshot(liveness = 30_000, ready = true): AdminSnapshot {
  return {
    livenessTimeoutMs: liveness,
    readinessLag: null,
    startedNs: "0",
    status: statusSnapshot({ state: ready ? "following" : "halted", ready }),
    config: { ...UNVALIDATED_CONFIG, core: { start: 1, settings: { network: "preprod", database: "[redacted]" } } },
  };
}

const view = (beatAgeMs: number, given: AdminSnapshot = snapshot()): AdminView => ({ snapshot: given, beatAgeMs, nowNs: 0n });

describe("the admin route table (AE-1, Q70)", () => {
  it("mounts exactly the backbone parts core-health, core-status and core-config, with the four paths", () => {
    expect(ADMIN_PARTS).toEqual([CORE_HEALTH_ENDPOINTS, CORE_STATUS_ENDPOINTS, CORE_CONFIG_ENDPOINTS]);
    expect(ADMIN_PARTS.map((part) => part.id)).toEqual(["core-health", "core-status", "core-config"]);
    for (const part of ADMIN_PARTS) expect(BACKBONE_ORDER).toContain(part.id);
    expect([...ADMIN_ROUTES.keys()]).toEqual(["/health/live", "/health/ready", "/status", "/config"]);
    expect(CORE_HEALTH_ENDPOINTS.endpoints.map((endpoint) => endpoint.path)).toEqual(["/health/live", "/health/ready"]);
    expect(Object.isFrozen(ADMIN_ROUTES)).toBe(true);
    expect(Object.isFrozen(ADMIN_PARTS)).toBe(true);
    // The table cannot change: nothing mounts a path after it is built.
    const answer = () => ({ status: 200, body: null });
    expect(() => (ADMIN_ROUTES as Map<string, unknown>).set("/m", { path: "/m", answer })).toThrow("the admin route table cannot change");
    expect(() => (ADMIN_ROUTES as Map<string, unknown>).delete("/status")).toThrow("the admin route table cannot change");
    expect(() => (ADMIN_ROUTES as Map<string, unknown>).clear()).toThrow("the admin route table cannot change");
    expect(ADMIN_ROUTES.size).toBe(4);
  });

  it("refuses a part that is no backbone part, a path two parts give, and a path that is not absolute", () => {
    const answer = () => ({ status: 200, body: null });
    expect(() => adminRoutes([{ id: "m", endpoints: [{ path: "/m", answer }] }])).toThrow(
      new TypeError("admin endpoints come from backbone parts only: m is not a backbone part"),
    );
    expect(() => adminRoutes([CORE_HEALTH_ENDPOINTS, { id: "core-chain", endpoints: [{ path: "/health/live", answer }] }])).toThrow(
      new TypeError("the admin endpoint /health/live is given twice: by core-health and by core-chain"),
    );
    expect(() => adminRoutes([{ id: "core-chain", endpoints: [{ path: "health", answer }] }])).toThrow(
      new TypeError('core-chain\'s admin endpoint path "health" does not start with /'),
    );
    // Another backbone part may provide an admin endpoint (only backbone parts do).
    expect([...adminRoutes([{ id: "core-chain", endpoints: [{ path: "/chain", answer }] }]).keys()]).toEqual(["/chain"]);
  });

  it("answers GET of a mounted path from the snapshot, the query aside; anything else 404 not-found", () => {
    const status = { ...snapshot().status, uptimeMs: 0 };
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/status", view(0))).toEqual({ status: 200, body: status });
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/status?verbose=1", view(0))).toEqual({ status: 200, body: status });
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/config?", view(0))).toEqual({ status: 200, body: snapshot().config });
    for (const [method, path] of [...OTHER_REQUESTS, ["GET", ""], ["GET", "?/status"], ["get", "/status"]] as const) {
      expect(answerAdmin(ADMIN_ROUTES, method, path, view(0)), `${method} ${path}`).toBe(NOT_FOUND);
    }
    expect(NOT_FOUND).toEqual({
      status: 404,
      body: { error: { code: "not-found", message: "no admin endpoint has this method and path" } },
    });
    expect(Object.isFrozen(NOT_FOUND)).toBe(true);
  });

  it("answers an endpoint that throws with 500 internal-error and a fixed message, nothing of the error", () => {
    const routes = adminRoutes([
      { id: "core-status", endpoints: [{ path: "/status", answer: () => {
        throw new Error("postgres://user:hunter2@db/x");
      } }] },
    ]);
    const answer = answerAdmin(routes, "GET", "/status", view(0));
    expect(answer).toEqual({ status: 500, body: { error: { code: "internal-error", message: "the admin endpoint failed" } } });
    expect(JSON.stringify(answer)).not.toContain("hunter2");
  });
});

describe("the backbone parts' minimal endpoints (8.2–8.4 complete them)", () => {
  it("core-health /health/live: 200 while the last heartbeat tick is within the liveness timeout, 503 after (AE-2)", () => {
    const live = (age: number, timeout: number) => answerAdmin(ADMIN_ROUTES, "GET", "/health/live", view(age, snapshot(timeout)));
    expect(live(0, 30_000)).toEqual({ status: 200, body: { live: true, heartbeatAgeMs: 0, livenessTimeoutMs: 30_000 } });
    expect(live(30_000, 30_000)).toMatchObject({ status: 200, body: { live: true } });
    expect(live(30_000.5, 30_000)).toMatchObject({ status: 503, body: { live: false } });
    expect(live(5_001, 5_000)).toMatchObject({ status: 503, body: { live: false } });
    // Whatever the state: a halted process is live while its heartbeat ticks.
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/health/live", view(10, snapshot(30_000, false)))).toMatchObject({
      status: 200,
      body: { live: true },
    });
  });

  it("core-health /health/ready: 200 when AE-4 finds the published state and lag ready, 503 when not (task 8.2)", () => {
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/health/ready", view(0, snapshot(30_000, true)))).toMatchObject({
      status: 200,
      body: { ready: true },
    });
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/health/ready", view(0, snapshot(30_000, false)))).toMatchObject({
      status: 503,
      body: { ready: false },
    });
    // Readiness is not liveness: a stale heartbeat does not change it.
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/health/ready", view(60_000, snapshot(30_000, true))).status).toBe(200);
  });

  it("core-status /status and core-config /config: 200 with the published status and configuration", () => {
    const given = snapshot();
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/status", view(0, given)).body).toEqual({ ...given.status, uptimeMs: 0 });
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/config", view(0, given)).body).toBe(given.config);
    const halted = { ...given, status: { ...given.status, state: "halted" as const, ready: false } };
    expect(answerAdmin(ADMIN_ROUTES, "GET", "/status", view(99_999, halted)).status).toBe(200);
  });
});
