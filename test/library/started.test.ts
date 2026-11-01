import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { openHold } from "./fixtures/import-holds.js";
import { libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * `started`'s rejection (`src/runner/process.ts`, `src/runner/failures.ts`): one code for one failure. [LM-9, LM-10]
 *
 * - LM-9's scenario: a module's `on-start-db` that throws `new Error("x")` makes `started` reject with an `UmbraError`
 *   of code `callback-error` naming the module and the point, whose `cause` is that error; `status().reason.code` is
 *   `callback-error`, and `ended`'s error is the same rejection. A refusal that is itself an `UmbraError` of its reason's
 *   code (a migration whose checksum changed) is the rejection as thrown. On PostgreSQL and PGlite.
 * - L32: a stop during startup — `stop()` during a slow `{ file }` import — ends the start: `started` rejects with an
 *   `AbortError`, the state is `stopping` with no reason, `closed` resolves; aborting the host's `signal` with a reason R
 *   during startup makes `started` reject with R itself; with no handler on `started`, no rejection is unhandled. The
 *   slow import waits at a hold the test opens and releases (`./fixtures/import-holds.ts`), so the stop lands while it
 *   is held, never on a timer.
 */

const unhandled: unknown[] = [];
const record = (reason: unknown): void => {
  unhandled.push(reason);
};
beforeAll(() => {
  process.on("unhandledRejection", record);
});
afterAll(() => {
  process.off("unhandledRejection", record);
});

/** A turn for a rejection nobody handled to be reported. */
const aTurn = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

/** What `handle.started` rejected with; fails the test if it resolved. */
async function rejectionOf(handle: UmbraDBHandle): Promise<unknown> {
  return handle.started.then(
    () => {
      throw new Error("started resolved; the test expected it to reject");
    },
    (error: unknown) => error,
  );
}

describe.each(PROCESS_BACKENDS)("LM-9: a refusal's rejection is the reason's code, on $name", (backend: ProcessBackend) => {
  beforeAll(async () => {
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
  }, 60_000);

  it("on-start-db throws new Error(\"x\"): an UmbraError callback-error naming the module and point, cause that error", async () => {
    const x = new Error("x");
    const setup = rowsModule("setup", undefined, {
      points: {
        async "on-start-db"() {
          throw x;
        },
      },
    });
    const db = await backend.database();
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [setup]) },
      modules: [setup],
      source: new InMemoryBlockSource({ head: 2n }),
    });
    try {
      const rejection = await rejectionOf(handle);
      expect(rejection).toBeInstanceOf(UmbraError);
      expect(rejection).toMatchObject({ code: "callback-error", details: { module: "setup", point: "on-start-db" } });
      expect((rejection as UmbraError).cause).toBe(x);
      expect(handle.status()).toMatchObject({
        state: "refused",
        reason: { code: "callback-error", height: null, module: "setup", point: "on-start-db" },
      });
      expect(await handle.ended).toEqual({ kind: "refused", error: rejection });
    } finally {
      await handle.stop();
    }
    await aTurn();
    expect(unhandled).toEqual([]);
  }, 60_000);

  it("a refusal that is an UmbraError of its reason's code rejects as thrown: a migration whose checksum changed", async () => {
    const db = await backend.database();
    const first = rowsModule("m");
    const run = startUmbraDB({ config: { data: libraryData(db.setting, [first]) }, modules: [first], source: new InMemoryBlockSource({ head: 1n }) });
    await run.started;
    await run.stop();
    const changed = rowsModule("m", undefined, { migrations: [{ id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)" }] });
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [changed]) },
      modules: [changed],
      source: new InMemoryBlockSource({ head: 1n }),
    });
    try {
      const rejection = await rejectionOf(handle);
      // The migration runner's own refusal, its details its own (a wrapper's would name only a module and a point).
      expect(rejection).toBeInstanceOf(UmbraError);
      expect(rejection).toMatchObject({ code: "migration-checksum-changed", details: { module: "m", migration: "001" } });
      expect(handle.status().reason?.code).toBe("migration-checksum-changed");
    } finally {
      await handle.stop();
    }
  }, 60_000);
});

describe("L32: a stop during startup ends it, and started rejects with the abort reason (LM-1, LM-9)", () => {
  it("stop() during a slow { file } import: an AbortError, stopping with no reason, closed resolved", async () => {
    const hold = openHold("held-stop");
    const file = fileURLToPath(new URL("./fixtures/held-stop.config.ts", import.meta.url));
    const handle = startUmbraDB({ config: { file }, source: new InMemoryBlockSource({ head: 1n }) });
    // No handler on `started` until the end: the stop's rejection must not be unhandled meanwhile.
    await hold.entered;
    const stopping = handle.stop();
    expect(handle.status()).toMatchObject({ state: "stopping", reason: null });
    hold.release();
    await stopping;
    await handle.closed;
    await aTurn();
    expect(unhandled).toEqual([]);
    const rejection = await rejectionOf(handle);
    expect(rejection).toBeInstanceOf(DOMException);
    expect(rejection).toMatchObject({ name: "AbortError" });
    expect(handle.status()).toMatchObject({ state: "stopping", reason: null, ended: { kind: "signal" } });
  }, 60_000);

  it("aborting the host's signal with a reason R during a slow import: started rejects with R itself", async () => {
    const hold = openHold("held-signal");
    const file = fileURLToPath(new URL("./fixtures/held-signal.config.ts", import.meta.url));
    const controller = new AbortController();
    const handle = startUmbraDB({ config: { file }, signal: controller.signal, source: new InMemoryBlockSource({ head: 1n }) });
    await hold.entered;
    const reason = new Error("the host is shutting down");
    controller.abort(reason);
    hold.release();
    await handle.closed;
    await aTurn();
    expect(unhandled).toEqual([]);
    expect(await rejectionOf(handle)).toBe(reason);
    expect(handle.status()).toMatchObject({ state: "stopping", reason: null });
  }, 60_000);

  it("a signal aborted with R before the call, and an abort reason that is no Error: started rejects with it", async () => {
    const before = new Error("aborted before startUmbraDB was called");
    const early = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: AbortSignal.abort(before) });
    await early.closed;
    expect(await rejectionOf(early)).toBe(before);
    const controller = new AbortController();
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: controller.signal, source: new InMemoryBlockSource({ head: 1n }) });
    controller.abort("a reason that is a string");
    await handle.closed;
    expect(await rejectionOf(handle)).toBe("a reason that is a string");
    // A stop after the signal is the same stop: the first reason stays.
    await handle.stop();
    expect(await rejectionOf(handle)).toBe("a reason that is a string");
    await aTurn();
    expect(unhandled).toEqual([]);
  }, 60_000);

  it("stop() before startup's first step: an AbortError; a signal aborted after it changes nothing", async () => {
    const controller = new AbortController();
    const handle = startUmbraDB({ config: { data: libraryData(PGLITE_MEMORY) }, signal: controller.signal });
    const stopping = handle.stop();
    controller.abort(new Error("too late: stop() came first"));
    await stopping;
    const rejection = await rejectionOf(handle);
    expect(rejection).toMatchObject({ name: "AbortError" });
    expect(rejection).toBeInstanceOf(DOMException);
    expect(await handle.ended).toEqual({ kind: "signal" });
  }, 60_000);
});
