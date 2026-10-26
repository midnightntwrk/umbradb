import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ERROR_CODES, type ErrorCode, UmbraError } from "../../src/db/errors.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { HALT_CODES, type ProcessReason, reasonOf, REFUSAL_CODES, retryOf } from "../../src/runner/failures.js";
import { HeightFailure, UnexpectedCursor } from "../../src/runner/loop.js";
import { statusOf, type StatusFacts } from "../../src/runner/process.js";

/**
 * Why a process is refused or halted, and which failures it retries (task 5.4; RN-8, IN-10, IN-12, AE-3, AE-5, AE-6;
 * `design.md` §11): `reasonOf` gives each failure a code of §11 with the height, module and point it happened at —
 * never a message —, and `retryOf` says which failures IN-10 retries instead of halting. The codes the reasons keep are
 * bound to §11's own text here, so the two lists cannot drift apart.
 */

const DESIGN = fileURLToPath(new URL("../../openspec/changes/core-arch/design.md", import.meta.url));

/** The backticked codes of the paragraph of design §11 that starts with `opening`, up to the next paragraph's. */
function section11Codes(opening: string, closing: string): Set<string> {
  const text = readFileSync(DESIGN, "utf8");
  const section = text.slice(text.indexOf("## 11. Refusals and halts"), text.indexOf("## 12. "));
  const start = section.indexOf(opening);
  const end = section.indexOf(closing);
  // A heading of §11 reworded must fail here, not widen the paragraph to the end of the section.
  if (start < 0 || end < start) throw new Error(`design §11 no longer has "${opening}" before "${closing}"`);
  const paragraph = section.slice(start, end);
  return new Set([...paragraph.matchAll(/`([a-z][a-z0-9-]*)`/g)].map((match) => match[1] as string));
}

const known = (codes: Set<string>): string[] =>
  [...codes].filter((code) => (ERROR_CODES as readonly string[]).includes(code)).sort();

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

describe("the codes reasons keep: design §11's", () => {
  it("REFUSAL_CODES are exactly §11's startup refusals that are UmbraError codes, and HALT_CODES its halts", () => {
    const refusals = section11Codes("**Startup refuses**", "**Backup and restore refuse**");
    const halts = section11Codes("**Processing halts**", "**The test tape's errors");
    expect(refusals.size).toBeGreaterThan(40);
    expect(halts.has("callback-error")).toBe(true);
    expect([...REFUSAL_CODES].sort()).toEqual(known(refusals));
    expect([...HALT_CODES].sort()).toEqual(known(halts));
    // The two halt codes no UmbraError carries are the runner's own: a callback's failure, and the loop's cursor check.
    expect([...halts].filter((code) => !(ERROR_CODES as readonly string[]).includes(code))).toEqual(
      expect.arrayContaining(["callback-error", "unexpected-cursor"]),
    );
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
    // Neither a database's nor named by §11: §11's general halt (task 10.4's registry may give them codes of their own).
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
    // Ready even far behind without a readiness lag (AE-4), unlike a halted one at the same lag.
    expect(statusOf(base)).toMatchObject({ state: "syncing", ready: true, reason: null });
    expect(statusOf({ ...base, phase: "halted", reason: halt, head: 4n })).toMatchObject({ state: "halted", ready: false, lag: 0n });
  });
});
