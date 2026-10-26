import { createServer, type Server } from "node:net";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { type ProcessHandle, startProcess } from "../../src/runner/process.js";
import { cursorIn, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, settle, testBuild } from "./process-build.js";

/**
 * The `refused` state (task 5.4; IN-12, AE-3, AE-4, AE-5; `design.md` §11; CORE-ARCH §4.17): a startup that refuses
 * leaves the process up — `closed` does not resolve until it is stopped — in `refused`, not ready, with its reason
 * (the refusal's code, and the module and point where there is one), its database closed and its writer lock released;
 * AE-3's scenario (a migration checksum that changed) on both backends, and the three startup failures §11 names no
 * code for (decision record Q115, shipped A): a failing `on-start-db` or `on-start-api` callback (`callback-error`,
 * with the point and the module) and a module API listener that cannot listen (`listen-failed`).
 */

/** Starts a build of `user` on `db` with `listen`, and waits for its startup to end; the handle and its log. */
async function startOn(
  db: ProcessDatabase,
  user: readonly ModuleDeclaration[],
  listen?: string,
): Promise<{ readonly handle: ProcessHandle; readonly lines: string[]; readonly source: InMemoryBlockSource }> {
  const build = testBuild(user);
  const lines: string[] = [];
  const source = new InMemoryBlockSource({ head: 3n });
  const handle = startProcess({
    declarations: build.declarations,
    config: {
      data: {
        entries: [
          core(db.setting, 1, listen === undefined ? {} : { extra: { listen: { api: listen } } }),
          ...user.map((part) => entryOf(part, 1)),
        ],
      },
    },
    source,
    onChecked: build.onChecked,
    log: (line) => lines.push(line),
  });
  await handle.started.catch(() => undefined);
  return { handle, lines, source };
}

/** Whether `handle` stays up: not closed after a while, its state unchanged. */
async function staysUp(handle: ProcessHandle): Promise<boolean> {
  const before = handle.status().state;
  const closed = await Promise.race([handle.closed.then(() => true), sleep(300, false)]);
  return !closed && handle.status().state === before;
}

/** A module `m` whose migration `001` is `sql`. */
const migrating = (sql: string): ModuleDeclaration =>
  loggingModule("m", [], ["on-db-write"], { migrations: [{ id: "001", sql }] });

describe.each(PROCESS_BACKENDS)("refused startups (IN-12, AE-3) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("AE-3: a migration checksum that changed refuses startup: refused, not ready, its reason, up until stopped; the database released", async () => {
    const db = await backend.database();
    const first = await startOn(db, [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY)")]);
    expect(await settle(first.handle, first.source, 3n)).toBe("waiting");
    await first.handle.stop();

    const { handle, lines } = await startOn(db, [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)")]);
    expect(await handle.ended).toMatchObject({ kind: "refused", error: { code: "migration-checksum-changed" } });
    const status = handle.status();
    expect(status).toMatchObject({
      state: "refused",
      ready: false,
      reason: { code: "migration-checksum-changed", height: null, module: "m", point: null },
      cursor: 3n,
    });
    expect(Object.isFrozen(status.reason)).toBe(true);
    expect(await staysUp(handle)).toBe(true);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/^startup refused: migration-checksum-changed: /);
    // Its database is closed and its writer lock released while it stays up: the right build runs at once.
    const next = await startOn(db, [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY)")]);
    next.source.finalize(5n);
    expect(await settle(next.handle, next.source, 5n)).toBe("waiting");
    await next.handle.stop();
    expect(await cursorIn(db)).toBe(5);
    const stopping = handle.stop();
    expect(handle.status()).toMatchObject({ state: "stopping", ready: false, reason: status.reason });
    await stopping;
    await handle.closed;
  }, 180_000);

  it("a failing on-start-db refuses with callback-error, its point and module; the module's own SQL error with database-error", async () => {
    for (const [what, code, failing] of [
      ["throws", "callback-error", async () => Promise.reject(new Error("on-start-db fails"))],
      ["runs a statement the database refuses", "database-error", async (_p: unknown, w: { execute(sql: string): Promise<number> }) => {
        await w.execute("INSERT INTO setup.rows (height) VALUES (1), (1)");
      }],
    ] as const) {
      const setup = loggingModule("setup", [], [], { points: { "on-start-db": failing as never } });
      const { handle } = await startOn(await backend.database(), [setup]);
      await expect(handle.started, what).rejects.toMatchObject({ name: "CallbackFailure", point: "on-start-db", module: "setup" });
      expect(handle.status(), what).toMatchObject({
        state: "refused",
        ready: false,
        reason: { code, height: null, module: "setup", point: "on-start-db" },
      });
      await handle.stop();
    }
  }, 180_000);

  it("a failing on-start-api refuses with callback-error, its point and module", async () => {
    const api = loggingModule("api", [], [], {
      points: {
        async "on-start-api"() {
          throw new Error("on-start-api fails");
        },
      },
    });
    const { handle } = await startOn(await backend.database(), [api]);
    expect(handle.status()).toMatchObject({
      state: "refused",
      reason: { code: "callback-error", height: null, module: "api", point: "on-start-api" },
    });
    expect(await staysUp(handle)).toBe(true);
    await handle.stop();
  }, 180_000);

  it("a module API listener that cannot listen (the port in use) refuses with listen-failed, the database released", async () => {
    const taken: Server = createServer();
    taken.listen(0, "127.0.0.1");
    await once(taken, "listening");
    const { port } = taken.address() as { port: number };
    try {
      const db = await backend.database();
      const { handle, lines } = await startOn(db, [], `127.0.0.1:${port}`);
      await expect(handle.started).rejects.toMatchObject({ code: "EADDRINUSE" });
      expect(handle.status()).toMatchObject({
        state: "refused",
        ready: false,
        reason: { code: "listen-failed", height: null, module: null, point: null },
      });
      expect(lines[0]).toMatch(/^startup refused: listen-failed: /);
      const next = await startOn(db, []);
      expect(await settle(next.handle, next.source, 3n)).toBe("waiting");
      await next.handle.stop();
      await handle.stop();
    } finally {
      taken.close();
    }
  }, 180_000);
});

describe("refused startups without a database", () => {
  it("an invalid declaration: refused with its code, up until stopped, logged by its code only", async () => {
    const lines: string[] = [];
    const handle = startProcess({
      declarations: { backbone: [], core: [], user: [{ id: "Bad" }] },
      config: { data: { entries: [] } },
      source: new InMemoryBlockSource({ head: 1n }),
      log: (line) => lines.push(line),
    });
    expect(await handle.ended).toMatchObject({ kind: "refused" });
    expect(handle.status()).toEqual({
      state: "refused",
      ready: false,
      conditions: [],
      cursor: null,
      head: null,
      lag: null,
      ended: await handle.ended,
      // The refusal's details name the module (its id as declared): an allowlisted field (AE-6).
      reason: { code: "invalid-declaration", height: null, module: "Bad", point: null },
    });
    expect(await staysUp(handle)).toBe(true);
    expect(lines).toEqual(["startup refused: invalid-declaration"]);
    await handle.stop();
    expect(handle.status().state).toBe("stopping");
  });

  it("a value thrown that is no Error refuses with database-error, logged as text", async () => {
    const lines: string[] = [];
    const handle = startProcess({
      declarations: testBuild([]).declarations,
      config: { data: { entries: [core("pglite:memory")] } },
      source: () => {
        throw "the source cannot be made";
      },
      log: (line) => lines.push(line),
    });
    await expect(handle.started).rejects.toBe("the source cannot be made");
    expect(handle.status()).toMatchObject({
      state: "refused",
      reason: { code: "database-error", height: null, module: null, point: null },
    });
    expect(lines).toEqual(["startup refused: database-error: the source cannot be made"]);
    await handle.stop();
  });

  it("a stop during startup is no refusal: stopping, with no reason", async () => {
    const controller = new AbortController();
    controller.abort();
    const handle = startProcess({
      declarations: testBuild([]).declarations,
      config: { data: { entries: [core("pglite:memory")] } },
      source: new InMemoryBlockSource({ head: 1n }),
      signal: controller.signal,
      log: () => undefined,
    });
    expect(await handle.ended).toEqual({ kind: "signal" });
    expect(handle.status()).toMatchObject({ state: "stopping", reason: null });
    await handle.closed;
  });
});
