import { describe, expect, it } from "vitest";
import { ERROR_CODES, type ErrorCode, UmbraError } from "../../src/db/errors.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { HALT_CODES, type ProcessReason, reasonOf, REFUSAL_CODES, retryOf, startupRejection } from "../../src/runner/failures.js";
import { HeightFailure, UnexpectedCursor } from "../../src/runner/loop.js";
import { statusOf, type StatusFacts } from "../../src/runner/process.js";

/**
 * Why a process is refused or halted, and which failures it retries. `reasonOf` gives each failure a code from the
 * design's "Refusals and halts" section, with the height, module and point it happened at, never a message.
 * `retryOf` says which failures are retried instead of halting. [RN-8, IN-10, IN-12, AE-3, AE-5, AE-6; design §11]
 */

const reason = (code: ProcessReason["code"], rest: Partial<ProcessReason> = {}): ProcessReason => ({
  code,
  height: null,
  module: null,
  point: null,
  ...rest,
});

/** An error like the one Node.js gives a server that cannot listen. */
function listenError(code: string): Error {
  return Object.assign(new Error(`listen ${code}: address already in use 127.0.0.1:10999`), { code, syscall: "listen" });
}

describe("the codes reasons keep", () => {
  it("REFUSAL_CODES and HALT_CODES are frozen; callback-error refuses and halts, listen-failed only refuses", () => {
    // A callback's failure and a listener that cannot bind are UmbraError codes, so a startup's rejection carries them.
    expect(ERROR_CODES).toEqual(expect.arrayContaining(["callback-error", "listen-failed"]));
    expect(REFUSAL_CODES).toEqual(expect.arrayContaining(["callback-error", "listen-failed"]));
    expect(HALT_CODES).toContain("callback-error");
    expect(HALT_CODES).not.toContain("listen-failed");
    expect(Object.isFrozen(REFUSAL_CODES)).toBe(true);
    expect(Object.isFrozen(HALT_CODES)).toBe(true);
  });
});

describe("reasonOf: a failure's code, height, module and point (RN-8, AE-5, AE-6)", () => {
  const thrown = new Error("the callback's own error, which may hold a password");

  it("a callback's failure in the loop: callback-error with the height, point and module, never the message", () => {
    const failure = new HeightFailure(5n, new CallbackFailure("on-compute", "m", thrown), {
      point: "on-compute",
      module: "m",
      committed: false,
    });
    const found = reasonOf(failure);
    expect(found).toEqual(reason("callback-error", { height: 5n, module: "m", point: "on-compute" }));
    expect(Object.isFrozen(found)).toBe(true);
    expect(JSON.stringify(found, (_key, value: unknown) => (typeof value === "bigint" ? `${value}` : value))).not.toContain(
      "password",
    );
  });

  it("keeps the cause's own code where §11 names it, with the point and module it happened at", () => {
    for (const code of ["truncate-not-allowed", "node-requirement", "database-error"] as const) {
      const cause = new UmbraError(code, `${code} at 7`);
      const failure = new HeightFailure(7n, new CallbackFailure("on-db-write", "m", cause), {
        point: "on-db-write",
        module: "m",
        committed: false,
      });
      expect(reasonOf(failure)).toEqual(reason(code, { height: 7n, module: "m", point: "on-db-write" }));
    }
  });

  it("a reclamation check's ledger-refcount-invalid halts with that code, in on-compute and on-db-write, never callback-error (LG-14)", () => {
    // The step's checks in on-compute, before eviction; the written row counts in on-db-write. The reason keeps the
    // code, the height, the module and the point, and nothing of the details (a key, a statement's counts). [R19]
    const checks = [
      ["on-compute", new UmbraError("ledger-refcount-invalid", "negative count", { reason: "negative-count", height: 9n, key: `0x${"ab".repeat(32)}` })],
      ["on-db-write", new UmbraError("ledger-refcount-invalid", "row counts", { reason: "row-count-mismatch", height: 9n, statement: "nodes", expected: 3, actual: 2 })],
    ] as const;
    for (const [point, cause] of checks) {
      const failure = new HeightFailure(9n, new CallbackFailure(point, "core-ledger-state", cause), {
        point,
        module: "core-ledger-state",
        committed: false,
      });
      expect(reasonOf(failure)).toEqual(reason("ledger-refcount-invalid", { height: 9n, module: "core-ledger-state", point }));
    }
    expect(HALT_CODES).toContain("ledger-refcount-invalid");
    expect(REFUSAL_CODES).not.toContain("ledger-refcount-invalid");
    expect(new UmbraError("ledger-refcount-invalid", "x").retryable).toBe(false);
  });

  it("a misuse the loop kept (handle-closed) is a callback error of the module that kept the handle", () => {
    const misuse = new UmbraError("handle-closed", "the block write handle was used after its callback", {
      module: "keeper",
      point: "on-db-write",
    });
    const failure = new HeightFailure(4n, misuse, { point: "on-db-write", module: "keeper", committed: false });
    expect(reasonOf(failure)).toEqual(reason("callback-error", { height: 4n, module: "keeper", point: "on-db-write" }));
  });

  it("a failure no callback made: the cause's §11 code, unexpected-cursor for the loop's cursor check, else database-error", () => {
    const at = (cause: unknown) => reasonOf(new HeightFailure(3n, cause, { committed: false }));
    expect(at(new UmbraError("writer-lock-lost", "taken"))).toEqual(reason("writer-lock-lost", { height: 3n }));
    expect(at(new UmbraError("database-error", "BEGIN failed"))).toEqual(reason("database-error", { height: 3n }));
    expect(at(new UnexpectedCursor("left at 2"))).toEqual(reason("unexpected-cursor", { height: 3n }));
    expect(new UnexpectedCursor("left at 2")).toMatchObject({ name: "UnexpectedCursor", message: "left at 2" });
    // Neither a database error nor a code the design names: the general halt. A code registry may give them codes of
    // their own. [design §11]
    expect(at(new UmbraError("node-error", "the node answered an error"))).toEqual(reason("database-error", { height: 3n }));
    expect(at(new Error("the source has no block at 3"))).toEqual(reason("database-error", { height: 3n }));
    expect(at("a string")).toEqual(reason("database-error", { height: 3n }));
  });

  it("names the module an UmbraError's details name, unless the failure names one", () => {
    const refusal = new UmbraError("migration-checksum-changed", "001 changed", { module: "m", migration: "001" });
    expect(reasonOf(refusal)).toEqual(reason("migration-checksum-changed", { module: "m" }));
    const named = new HeightFailure(2n, new UmbraError("truncate-not-allowed", "no", { module: "other" }), {
      point: "on-db-write",
      module: "m",
      committed: false,
    });
    expect(reasonOf(named).module).toBe("m");
    expect(reasonOf(new UmbraError("bad-id", "Bad", { module: 7 }))).toEqual(reason("bad-id"));
  });

  it("startup's refusals: their own code; a failing on-start-db or on-start-api callback-error; a listener listen-failed", () => {
    expect(reasonOf(new UmbraError("invalid-declaration", "no"))).toEqual(reason("invalid-declaration"));
    expect(reasonOf(new UmbraError("process-item-missing", "x", { item: "x", modules: ["m"] }))).toEqual(
      reason("process-item-missing"),
    );
    expect(reasonOf(new CallbackFailure("on-start-api", "api", thrown))).toEqual(
      reason("callback-error", { module: "api", point: "on-start-api" }),
    );
    expect(reasonOf(new CallbackFailure("on-start-db", "setup", "a string"))).toEqual(
      reason("callback-error", { module: "setup", point: "on-start-db" }),
    );
    const failing = new CallbackFailure("on-start-db", "setup", new UmbraError("database-error", "duplicate key"));
    expect(reasonOf(failing)).toEqual(reason("database-error", { module: "setup", point: "on-start-db" }));
    expect(reasonOf(listenError("EADDRINUSE"))).toEqual(reason("listen-failed"));
    expect(reasonOf(Object.assign(new Error("connect"), { syscall: "connect" }))).toEqual(reason("database-error"));
    expect(reasonOf(new Error("the source cannot read the cursor"))).toEqual(reason("database-error"));
  });
});

describe("startupRejection: what started rejects with, one code for one failure (LM-9)", () => {
  const secret = "s3cr3t-in-a-message";

  it("the failure itself when it is an UmbraError of the reason's code, unwrapped from the runner's wrappers", () => {
    const refusal = new UmbraError("migration-checksum-changed", "001 changed", { module: "m", migration: "001" });
    expect(startupRejection(refusal)).toBe(refusal);
    const inCallback = new UmbraError("migration-failed", "001 failed", { module: "setup" });
    expect(startupRejection(new CallbackFailure("on-start-db", "setup", inCallback))).toBe(inCallback);
    const listed = new UmbraError("database-error", "duplicate key");
    expect(startupRejection(new CallbackFailure("on-start-db", "setup", listed))).toBe(listed);
  });

  it("else a new UmbraError of the reason's code, naming the module and point, its cause the thrown value", () => {
    const thrown = new Error(`x ${secret}`);
    const rejection = startupRejection(new CallbackFailure("on-start-db", "setup", thrown));
    expect(rejection).toBeInstanceOf(UmbraError);
    expect(rejection).toMatchObject({ code: "callback-error", details: { module: "setup", point: "on-start-db" } });
    expect(rejection.cause).toBe(thrown);
    expect(rejection.message).not.toContain(secret);
    expect(reasonOf(rejection)).toEqual(reason("callback-error", { module: "setup" }));

    const listen = listenError("EADDRINUSE");
    expect(startupRejection(listen)).toMatchObject({ code: "listen-failed", details: {}, cause: listen });
    const plain = new Error(`the source cannot read the cursor ${secret}`);
    const general = startupRejection(plain);
    expect(general).toMatchObject({ code: "database-error", cause: plain });
    expect(general.message).not.toContain(secret);
    expect(startupRejection("a string")).toMatchObject({ code: "database-error", cause: "a string" });
    // An UmbraError whose code §11 does not list is the general refusal's cause.
    const other = new UmbraError("node-error", "the node answered an error");
    expect(startupRejection(other)).toMatchObject({ code: "database-error", cause: other });
    // A misuse in a callback: callback-error, the misuse its cause.
    const misuse = new UmbraError("handle-closed", "kept");
    expect(startupRejection(new CallbackFailure("on-start-api", "api", misuse))).toMatchObject({
      code: "callback-error",
      details: { module: "api", point: "on-start-api" },
      cause: misuse,
    });
  });

  it("the loop's cursor check, which no startup step meets, would carry the general code", () => {
    const check = new UnexpectedCursor("left at 2");
    expect(startupRejection(check)).toMatchObject({ code: "database-error", cause: check });
  });

  it("its code is always the reason's that status() shows", () => {
    const failures: unknown[] = [
      new UmbraError("genesis-mismatch", "other chain"),
      new CallbackFailure("on-start-db", "s", new Error("x")),
      new CallbackFailure("on-start-api", "a", "y"),
      listenError("EACCES"),
      new Error("plain"),
      new UmbraError("handle-closed", "closed"),
      Symbol("thrown"),
    ];
    for (const failure of failures) expect(startupRejection(failure).code).toBe(reasonOf(failure).code);
  });
});

describe("retryOf: what IN-10 retries instead of halting", () => {
  const lost = new UmbraError("connection-lost", "the writer connection to PostgreSQL was lost");
  const unreachable = new UmbraError("node-unreachable", "the node did not answer");

  it("a lost database connection is database-retrying and an unreachable node node-retrying, however wrapped", () => {
    expect(retryOf(lost)).toBe("database-retrying");
    expect(retryOf(unreachable)).toBe("node-retrying");
    expect(retryOf(new HeightFailure(3n, lost, { committed: false }))).toBe("database-retrying");
    const inCallback = new HeightFailure(3n, new CallbackFailure("on-db-write", "m", lost), {
      point: "on-db-write",
      module: "m",
      committed: false,
    });
    expect(retryOf(inCallback)).toBe("database-retrying");
    expect(retryOf(new CallbackFailure("on-fetch", "m", unreachable))).toBe("node-retrying");
  });

  it("everything else halts: other codes, plain errors, and a retryable error inside anything but the runner's wrappers", () => {
    for (const code of ERROR_CODES.filter((code) => code !== "connection-lost" && code !== "node-unreachable")) {
      expect(retryOf(new UmbraError(code as ErrorCode, code)), code).toBeNull();
    }
    expect(retryOf(new Error("plain"))).toBeNull();
    expect(retryOf(undefined)).toBeNull();
    expect(retryOf(new Error("a module's own error", { cause: lost }))).toBeNull();
    expect(retryOf(new UmbraError("migration-failed", "001 failed", {}, { cause: lost }))).toBeNull();
    // A misuse the loop kept wins over the lost connection: the failure's cause is the misuse.
    const misuse = new UmbraError("handle-closed", "kept", { module: "k", point: "on-db-write" });
    expect(retryOf(new HeightFailure(3n, misuse, { point: "on-db-write", module: "k", committed: false }))).toBeNull();
  });
});

describe("statusOf: refused and halted (AE-3, AE-4)", () => {
  const base: StatusFacts = {
    phase: "running",
    start: 1n,
    cursor: 4n,
    head: 8n,
    followingThreshold: 3,
    readinessLag: null,
    conditions: [],
    ended: null,
    reason: null,
  };

  it("is refused or halted, never ready, with its reason; a running process has none", () => {
    const halt = reason("callback-error", { height: 5n, module: "m", point: "on-compute" });
    expect(statusOf({ ...base, phase: "halted", reason: halt })).toMatchObject({ state: "halted", ready: false, reason: halt, lag: 4n });
    const refusal = reason("migration-checksum-changed", { module: "m" });
    expect(statusOf({ ...base, phase: "refused", reason: refusal, cursor: null, head: null })).toMatchObject({
      state: "refused",
      ready: false,
      reason: refusal,
    });
    // Ready even far behind without a readiness lag, unlike a halted one at the same lag. [AE-4]
    expect(statusOf(base)).toMatchObject({ state: "syncing", ready: true, reason: null });
    expect(statusOf({ ...base, phase: "halted", reason: halt, head: 4n })).toMatchObject({ state: "halted", ready: false, lag: 0n });
  });
});
