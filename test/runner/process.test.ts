import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { coreEntry } from "../../src/config/entries.js";
import { canonicalJson, checkHistory } from "../../src/config/history.js";
import { plainData } from "../../src/config/plain-data.js";
import { type CheckedConfig, type CheckedEntry, validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { type BlockRef, type BlockSource } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import {
  processRevisions,
  type ProcessHandle,
  type ProcessStatus,
  statusOf,
  terminationSignal,
  upgradeBoundary,
} from "../../src/runner/process.js";
import { declaration } from "../modules/declarations.js";
import { cursorIn, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, coreSettings, entryOf, loggingModule, settle, startProcess, testBuild } from "./process-build.js";

/**
 * The process (task 5.3): `startProcess` assembles the runner's startup — the declarations validated, the configuration
 * loaded and validated, the `core` entry's operational fields from its latest revision of the build's version (Q102),
 * the database opened and its writer started, the cursor and the history read and checked, the graph, the schema plan,
 * the process contexts, the migrations and `on-start-db`, the seal, `on-start-api` and the module API — then runs the
 * finalized loop, and publishes its state. A149 (CF-3, CF-4, Q102) through it on both backends, the state and its
 * readiness, the refusals' clean-up, the logs' redaction and SIGTERM's signal.
 */

const N1 = "ws://127.0.0.1:9/n1";
const N2 = "ws://127.0.0.1:9/n2";

// ── A149 ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** What one A149 startup showed. */
interface A149Startup {
  readonly refused?: unknown;
  /** The `core` revision the block source was made from: its node. */
  readonly sourceNode?: unknown;
  /** `core-chain`'s settings at each height it processed. */
  readonly settings: ReadonlyMap<bigint, Readonly<Record<string, unknown>>>;
  /** The heights the development-only module ran `on-db-write` at. */
  readonly devtool: readonly string[];
  readonly processCoreStart?: number;
}

/** What A149's two startups showed, and the two databases afterwards. */
interface A149Observation {
  readonly runs: readonly A149Startup[];
  readonly later: { readonly setting: string; readonly cursor: number | null };
  readonly earlierTouched: boolean;
}

/** Whether the process wrote anything to `db`: a PGlite directory exists, or a PostgreSQL database has a cursor table. */
async function touched(db: ProcessDatabase): Promise<boolean> {
  if (db.directory !== undefined) return existsSync(db.directory);
  return (await cursorIn(db)) !== null || (await db.query("SELECT 1 FROM pg_namespace WHERE nspname = 'core_chain'")).length > 0;
}

/** A149's configuration: `core` from 1 on `earlier` (N1, no opt-in, `retainStates` 0), from 50 on `later` (N2, opt-in, 4). */
function a149Entries(earlier: string, later: string, devtool: ModuleDeclaration, extra: Record<string, unknown> = {}) {
  return [
    core(earlier, 1, { extra: { node: N1, developmentOptIn: false, retainStates: 0, ...extra } }),
    core(later, 50, { extra: { node: N2, developmentOptIn: true, retainStates: 4 } }),
    entryOf(devtool, 1),
  ];
}

/** A149's two startups — to head 5 on a new database, then to head 8 at cursor 5 — with `processCore` (a control's). */
async function a149Run(
  earlier: ProcessDatabase,
  later: ProcessDatabase,
  processCore?: (config: CheckedConfig) => CheckedEntry,
): Promise<A149Observation> {
  const runs: A149Startup[] = [];
  for (const head of [5n, 8n]) {
    const devtoolLog: string[] = [];
    const devtool = loggingModule("devtool", devtoolLog, ["on-db-write"], { developmentOnly: true });
    const build = testBuild([devtool]);
    let sourceNode: unknown;
    const source = new InMemoryBlockSource({ head });
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: a149Entries(earlier.setting, later.setting, devtool) } },
      source: (entry) => {
        sourceNode = entry.settings?.node;
        return source;
      },
      log: () => undefined,
      ...(processCore === undefined ? {} : { processCore }),
    });
    try {
      await settle(handle, source, head);
      const started = await handle.started;
      runs.push({ sourceNode, settings: build.core.settings, devtool: devtoolLog, processCoreStart: started.core.start });
    } catch (refused) {
      runs.push({ refused, sourceNode, settings: build.core.settings, devtool: devtoolLog });
    } finally {
      await handle.stop();
    }
  }
  return {
    runs,
    later: { setting: later.setting, cursor: (await touched(later)) ? await cursorIn(later) : null },
    earlierTouched: await touched(earlier),
  };
}

/** A149's oracle: every problem with what was observed, none when A149 holds. */
function a149Problems(observed: A149Observation): string[] {
  const problems: string[] = [];
  observed.runs.forEach((run, index) => {
    const name = `startup ${index + 1}`;
    if (run.refused !== undefined) {
      const code = run.refused instanceof UmbraError ? run.refused.code : String(run.refused);
      problems.push(`${name} refused (${code})`);
      return;
    }
    if (run.processCoreStart !== 50) problems.push(`${name} ran with the core revision from ${run.processCoreStart}`);
    if (run.sourceNode !== N2) problems.push(`${name} made its block source with node ${String(run.sourceNode)}`);
    const first = index === 0 ? 1n : 6n;
    const last = index === 0 ? 5n : 8n;
    const wrong: bigint[] = [];
    for (let height = first; height <= last; height++) {
      const settings = run.settings.get(height);
      const expected = { node: N2, developmentOptIn: true, database: observed.later.setting, retainStates: 0 };
      if (settings === undefined || Object.entries(expected).some(([field, value]) => settings[field] !== value)) {
        wrong.push(height);
      }
    }
    if (wrong.length > 0) {
      problems.push(`${name}: core-chain's settings at ${wrong.join(", ")} were not the later revision's operational fields`);
    }
    const devtool = Array.from({ length: Number(last - first) + 1 }, (_, offset) => `devtool on-db-write@${first + BigInt(offset)}`);
    if (run.devtool.join(",") !== devtool.join(",")) problems.push(`${name}: the development-only module ran ${run.devtool.join(",") || "nowhere"}`);
  });
  if (observed.later.cursor !== 8) problems.push(`the later revision's database holds cursor ${observed.later.cursor}, not 8`);
  if (observed.earlierTouched) problems.push("the earlier revision's database was opened and written");
  return problems;
}

/** A negative control's choice: the first `core` revision's operational fields. */
const firstCoreRevision = (config: CheckedConfig): CheckedEntry =>
  config.entries.filter((entry) => entry.id === "core").reduce((a, b) => (b.start < a.start ? b : a));

describe.each(PROCESS_BACKENDS)("the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  describe("A149: the core entry's operational fields from its latest revision of the build's version (CF-4, Q102)", () => {
    it("A149: opens the later revision's database and uses its node and opt-in for its whole run, the cursor below its start", async () => {
      const observed = await a149Run(await backend.database(), await backend.database());
      expect(a149Problems(observed)).toEqual([]);
    }, 180_000);

    it("A149: validates the earlier revision's operational fields, and an invalid one refuses startup, opening nothing", async () => {
      const [earlier, later] = [await backend.database(), await backend.database()];
      const devtool = loggingModule("devtool", [], ["on-db-write"], { developmentOnly: true });
      const build = testBuild([devtool]);
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: a149Entries(earlier.setting, later.setting, devtool, { apiReadTimeoutMs: 0 }) } },
        source: new InMemoryBlockSource({ head: 5n }),
        log: () => undefined,
      });
      const refusal = await handle.started.then(() => undefined, (error: unknown) => error);
      expect(refusal).toBeInstanceOf(UmbraError);
      expect(refusal).toMatchObject({ code: "invalid-configuration", details: { reason: "invalid-entries" } });
      const [found] = (refusal as UmbraError).details.findings as { path: string }[];
      expect(found?.path).toBe("entries[0].config.apiReadTimeoutMs");
      expect(await handle.ended).toEqual({ kind: "refused", error: refusal });
      await handle.stop();
      expect(await touched(earlier)).toBe(false);
      expect(await touched(later)).toBe(false);
    }, 180_000);

    it("negative control: a process taking the first core revision's operational fields fails A149", async () => {
      const problems = a149Problems(await a149Run(await backend.database(), await backend.database(), firstCoreRevision));
      if (backend.kind === "pglite") {
        // The first revision has no opt-in, so PGlite refuses to open its database (CF-9).
        expect(problems).toEqual([
          "startup 1 refused (development-opt-in-required)",
          "startup 2 refused (development-opt-in-required)",
          "the later revision's database holds cursor null, not 8",
        ]);
      } else {
        expect(problems).toContain("startup 1 ran with the core revision from 1");
        expect(problems).toContain("startup 1 made its block source with node ws://127.0.0.1:9/n1");
        expect(problems).toContain(
          "startup 1: core-chain's settings at 1, 2, 3, 4, 5 were not the later revision's operational fields",
        );
        expect(problems).toContain("the later revision's database holds cursor null, not 8");
        expect(problems).toContain("the earlier revision's database was opened and written");
      }
    }, 180_000);
  });

  describe("startup and its refusals", () => {
    it("loads the configuration file (CF-1), runs, and reports its module API's address", async () => {
      const db = await backend.database();
      const directory = mkdtempSync(join(tmpdir(), "umbradb-process-config-"));
      try {
        const file = join(directory, "umbradb.config.ts");
        const entries = [core(db.setting, 1, { extra: { listen: { api: "127.0.0.1:0" } } })];
        writeFileSync(file, `export default ${JSON.stringify({ entries })};\n`);
        const build = testBuild([]);
        const source = new InMemoryBlockSource({ head: 2n });
        const handle = startProcess({ declarations: build.declarations, config: { file }, source, log: () => undefined });
        expect(await settle(handle, source, 2n)).toBe("waiting");
        const started = await handle.started;
        expect(started.api?.host).toBe("127.0.0.1");
        expect(started.api?.port).toBeGreaterThanOrEqual(10_000);
        expect(started.core.index).toBe(0);
        const url = `http://${started.api?.host}:${started.api?.port}/`;
        expect((await fetch(url)).status).toBe(404);
        await handle.stop();
        // The module API closed with the process.
        await expect(fetch(url)).rejects.toThrow();
        expect(await cursorIn(db)).toBe(2);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    }, 180_000);

    // PostgreSQL only: PGlite has no durability probe (DB-12), and enforces no read timeout (DB-15).
    if (backend.kind === "postgres") {
      it("bounds a module API request's read by the process revision's apiReadTimeoutMs (DB-15, Q102)", async () => {
        const db = await backend.database();
        const sleepy = loggingModule("sleepy", [], [], {
          points: {
            async "on-start-api"(_p, api) {
              api.http("GET", "/sleep", async (_request, read) => {
                await read.query("SELECT pg_sleep(5)");
                return { status: 200, body: null };
              });
            },
          },
        });
        const build = testBuild([sleepy]);
        const source = new InMemoryBlockSource({ head: 1n });
        const listen = { listen: { api: "127.0.0.1:0" } };
        const handle = startProcess({
          declarations: build.declarations,
          config: {
            data: {
              entries: [
                core(db.setting, 1, { extra: { ...listen, apiReadTimeoutMs: 60_000 } }),
                core(db.setting, 2, { extra: { ...listen, apiReadTimeoutMs: 300 } }),
                entryOf(sleepy, 1),
              ],
            },
          },
          source,
          log: () => undefined,
        });
        try {
          await settle(handle, source, 1n);
          const { api } = await handle.started;
          const began = performance.now();
          const response = await fetch(`http://${api!.host}:${api!.port}/sleep`);
          expect(response.status).toBe(504);
          expect(performance.now() - began).toBeLessThan(4_000);
        } finally {
          await handle.stop();
        }
      }, 180_000);

      it("logs the durability probe's warnings, and runs (synchronous_commit=off, DB-12)", async () => {
        const db = await backend.database();
        const [row] = await db.query("SELECT current_database() AS name");
        await db.query(`ALTER DATABASE ${String(row?.name)} SET synchronous_commit = off`);
        const lines: string[] = [];
        const build = testBuild([]);
        const source = new InMemoryBlockSource({ head: 1n });
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting)] } },
          source,
          log: (line) => lines.push(line),
        });
        try {
          expect(await settle(handle, source, 1n)).toBe("waiting");
        } finally {
          await handle.stop();
        }
        expect(lines.filter((line) => line.startsWith("durability: "))).toHaveLength(1);
        expect(lines.find((line) => line.startsWith("durability: "))).toContain("synchronous_commit=off");
      }, 180_000);
    }

    it("gives each on-start-db the cursor's height on its schema write handle: null on a new database", async () => {
      const db = await backend.database();
      const heights: (bigint | null)[] = [];
      const setup = loggingModule("setup", [], [], {
        points: {
          async "on-start-db"(_p, w) {
            heights.push(w.height);
          },
        },
      });
      for (const head of [2n, 4n]) {
        const build = testBuild([setup]);
        const source = new InMemoryBlockSource({ head });
        const handle = startProcess({
          declarations: build.declarations,
          config: { data: { entries: [core(db.setting), entryOf(setup, 1)] } },
          source,
          log: () => undefined,
        });
        try {
          expect(await settle(handle, source, head)).toBe("waiting");
        } finally {
          await handle.stop();
        }
      }
      expect(heights).toEqual([null, 2n]);
    }, 180_000);

    it("a refusal after the database opened closes it: the next process opens it and runs", async () => {
      const db = await backend.database();
      const failing = loggingModule("failing", [], [], {
        points: {
          async "on-start-api"() {
            throw new Error("on-start-api fails");
          },
        },
      });
      const build = testBuild([failing]);
      const refused = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting), entryOf(failing, 1)] } },
        source: new InMemoryBlockSource({ head: 2n }),
        log: () => undefined,
      });
      await expect(refused.started).rejects.toMatchObject({ name: "CallbackFailure", point: "on-start-api", module: "failing" });
      expect(await refused.ended).toMatchObject({ kind: "refused" });
      // Not stopped: the refusal itself released the database (its writer lock on both backends).
      // The history recorded the entry of failing (its on-start-db ran): the next build lists it, with no callbacks.
      const quiet = loggingModule("failing", [], []);
      const next = testBuild([quiet]);
      const source = new InMemoryBlockSource({ head: 2n });
      const handle = startProcess({
        declarations: next.declarations,
        config: { data: { entries: [core(db.setting), entryOf(quiet, 1)] } },
        source,
        log: () => undefined,
      });
      expect(await settle(handle, source, 2n)).toBe("waiting");
      await handle.stop();
      await refused.stop();
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);

    it("logs through the configuration's redaction: a module API error naming the database shows it as [redacted]", async () => {
      const db = await backend.database();
      const lines: string[] = [];
      const leaky = loggingModule("leaky", [], [], {
        points: {
          async "on-start-api"(_p, api) {
            api.http("GET", "/leak", async () => {
              throw new Error(`cannot reach ${db.setting}`);
            });
          },
        },
      });
      const build = testBuild([leaky]);
      const source = new InMemoryBlockSource({ head: 1n });
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting, 1, { extra: { listen: { api: "127.0.0.1:0" } } }), entryOf(leaky, 1)] } },
        source,
        log: (line) => lines.push(line),
      });
      try {
        await settle(handle, source, 1n);
        const { api } = await handle.started;
        expect((await fetch(`http://${api!.host}:${api!.port}/leak`)).status).toBe(500);
      } finally {
        await handle.stop();
      }
      const leak = lines.find((line) => line.includes("/leak"));
      expect(leak).toBeDefined();
      expect(leak).toContain("[redacted]");
      expect(lines.join("\n")).not.toContain(db.setting);
    }, 180_000);
  });

  describe("the state (CORE-ARCH §4.18, task 5.3's part)", () => {
    it("is starting, then syncing while far behind (ready only within readinessLag), following at the head, stopping after stop()", async () => {
      const db = await backend.database();
      let release!: () => void;
      const held = new Promise<void>((resolve) => {
        release = resolve;
      });
      let reached!: () => void;
      const atTwo = new Promise<void>((resolve) => {
        reached = resolve;
      });
      let releaseLater!: () => void;
      const heldLater = new Promise<void>((resolve) => {
        releaseLater = resolve;
      });
      let reachedLater!: () => void;
      const atEight = new Promise<void>((resolve) => {
        reachedLater = resolve;
      });
      const slow = loggingModule("slow", [], [], {
        points: {
          async "on-compute"(_p, b) {
            if (b.height === 2n) {
              reached();
              await held;
            }
            if (b.height === 8n) {
              reachedLater();
              await heldLater;
            }
          },
        },
      });
      const build = testBuild([slow]);
      const source = new InMemoryBlockSource({ head: 10n });
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting, 1, { extra: { followingThreshold: 3, readinessLag: 5 } }), entryOf(slow, 1)] } },
        source,
        log: () => undefined,
      });
      expect(handle.status()).toMatchObject({ state: "starting", ready: false, cursor: null, head: null, lag: null });
      await atTwo;
      // Head 10, cursor 1: lag 9 — syncing, and beyond the readiness lag of 5.
      expect(handle.status()).toMatchObject({ state: "syncing", ready: false, cursor: 1n, head: 10n, lag: 9n });
      release();
      await atEight;
      // Cursor 7: lag 3, within the following threshold of 3.
      expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 7n, lag: 3n });
      releaseLater();
      expect(await settle(handle, source, 10n)).toBe("waiting");
      expect(handle.status()).toMatchObject({ state: "following", ready: true, cursor: 10n, head: 10n, lag: 0n, ended: null });
      const stopping = handle.stop();
      expect(handle.status()).toMatchObject({ state: "stopping", ready: false });
      expect(handle.stop()).toBe(stopping);
      await stopping;
      await handle.closed;
      expect(await handle.ended).toEqual({ kind: "signal" });
    }, 180_000);

    it("stops when its signal aborts, also before startup ends, opening nothing then", async () => {
      const db = await backend.database();
      const controller = new AbortController();
      controller.abort();
      const build = testBuild([]);
      const early = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting)] } },
        source: new InMemoryBlockSource({ head: 2n }),
        signal: controller.signal,
        log: () => undefined,
      });
      await expect(early.started).rejects.toMatchObject({ name: "AbortError" });
      expect(await early.ended).toEqual({ kind: "signal" });
      await early.closed;
      expect(await touched(db)).toBe(false);

      const later = new AbortController();
      const source = new InMemoryBlockSource({ head: 2n });
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting)] } },
        source,
        signal: later.signal,
        log: () => undefined,
      });
      expect(await settle(handle, source, 2n)).toBe("waiting");
      later.abort();
      await handle.closed;
      expect(handle.status().state).toBe("stopping");
      expect(await handle.ended).toEqual({ kind: "signal" });
      // Closed means closed: the next process takes the database's writer lock at once.
      const next = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting)] } },
        source,
        log: () => undefined,
      });
      expect(await settle(next, source, 2n)).toBe("waiting");
      await next.stop();
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);
  });
});

// ── without a database ─────────────────────────────────────────────────────────────────────────────────────────────

describe("statusOf: the state and its readiness (CORE-ARCH §4.18)", () => {
  const base: Readonly<Record<string, unknown>> = {
    phase: "running",
    start: 1n,
    cursor: 10n,
    head: 12n,
    followingThreshold: 3,
    readinessLag: null,
    conditions: [],
    ended: null,
    reason: null,
  };

  it("is following within the threshold and syncing beyond it, ready unless a readiness lag is exceeded", () => {
    const status = (facts: Readonly<Record<string, unknown>>): ProcessStatus => statusOf({ ...base, ...facts } as never);
    expect(status({})).toMatchObject({ state: "following", ready: true, lag: 2n });
    expect(status({ head: 13n })).toMatchObject({ state: "following", ready: true, lag: 3n });
    expect(status({ head: 14n })).toMatchObject({ state: "syncing", ready: true, lag: 4n });
    expect(status({ head: 14n, readinessLag: 4 })).toMatchObject({ state: "syncing", ready: true });
    expect(status({ head: 15n, readinessLag: 4 })).toMatchObject({ state: "syncing", ready: false, lag: 5n });
    expect(status({ head: null })).toMatchObject({ state: "syncing", ready: true, lag: null });
    expect(status({ head: null, readinessLag: 4 })).toMatchObject({ state: "syncing", ready: false });
    // Nothing committed yet: the lag counts from S − 1; a head below S is no lag.
    expect(status({ cursor: null, head: 5n })).toMatchObject({ state: "syncing", lag: 5n });
    expect(status({ cursor: null, start: 10n, head: 5n })).toMatchObject({ state: "following", lag: 0n });
    for (const phase of ["starting", "stopping"] as const) {
      expect(status({ phase })).toMatchObject({ state: phase, ready: false });
    }
    expect(status({ phase: "stopped", head: 100n })).toMatchObject({ state: "stopped", ready: true, lag: 90n });
    const frozen = status({});
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.conditions)).toBe(true);
  });
});

describe("terminationSignal: SIGTERM stops the process (RN-13)", () => {
  it("aborts its signal at the target's SIGTERM, once, and no more after dispose", () => {
    const target = new EventEmitter();
    const termination = terminationSignal(target);
    expect(termination.signal.aborted).toBe(false);
    expect(target.listenerCount("SIGTERM")).toBe(1);
    target.emit("SIGTERM");
    expect(termination.signal.aborted).toBe(true);
    expect(target.listenerCount("SIGTERM")).toBe(0);
    const second = terminationSignal(target);
    second.dispose();
    expect(target.listenerCount("SIGTERM")).toBe(0);
    target.emit("SIGTERM");
    expect(second.signal.aborted).toBe(false);
  });

  it("listens to this process by default", () => {
    const before = process.listenerCount("SIGTERM");
    const termination = terminationSignal();
    expect(process.listenerCount("SIGTERM")).toBe(before + 1);
    termination.dispose();
    expect(process.listenerCount("SIGTERM")).toBe(before);
  });
});

/** The validated configuration and history check of `entries` at `cursor`, for a build of `user`. */
function checked(entries: readonly unknown[], user: readonly ModuleDeclaration[], cursor: bigint | null = null) {
  const declarations = validateDeclarations({ backbone: testBuild([]).declarations.backbone, core: [], user });
  const config = validateConfig({ config: { data: plainData({ entries }) }, declarations, side: "public" });
  return { declarations, config, check: checkHistory({ config, cursor, declarations, history: [] }) };
}

describe("upgradeBoundary: RN-12's first height of a version the build does not carry", () => {
  const m = declaration("m");
  const n = declaration("n");
  const settings = { pollMs: 1 };

  it("is none without a scheduled revision, and the lowest start of one otherwise, with every entry starting there", () => {
    const base = [coreEntry({ start: 1, config: coreSettings("pglite:memory") as never }), entryOf(m, 1, settings), entryOf(n, 1, settings)];
    const none = checked(base, [m, n]);
    expect(upgradeBoundary(none.check, none.declarations)).toBeNull();
    const later = { id: "m", start: 90, version: "3.0.0" };
    const scheduled = [...base, { id: "n", start: 40, version: "2.0.0" }, { id: "m", start: 40, version: "2.0.0" }, later];
    const some = checked(scheduled, [m, n]);
    const boundary = upgradeBoundary(some.check, some.declarations);
    expect(boundary).toEqual({
      height: 40n,
      entries: [
        { id: "n", start: 40, needed: "2.0.0", build: "1.0.0" },
        { id: "m", start: 40, needed: "2.0.0", build: "1.0.0" },
      ],
    });
    expect(Object.isFrozen(boundary)).toBe(true);
    expect(Object.isFrozen(boundary?.entries)).toBe(true);
    expect(Object.isFrozen(boundary?.entries[0])).toBe(true);
  });

  it("names the core version for a scheduled core revision (an UmbraDB upgrade)", () => {
    const newer = { umbradb: "0.10.0", ledgers: [] };
    const entries = [coreEntry({ start: 1, config: coreSettings("pglite:memory") as never }), { id: "core", start: 30, version: newer }];
    const { check, declarations } = checked(entries, []);
    expect(upgradeBoundary(check, declarations)).toEqual({
      height: 30n,
      entries: [{ id: "core", start: 30, needed: newer, build: buildCoreVersion() }],
    });
  });
});

describe("processRevisions: each part's revisions for its process context (RN-7, CF-5, Q102)", () => {
  it("gives a module its revisions in start order with their effective stops and settings, and none to a module without", () => {
    const m = declaration("m");
    const entries = [
      coreEntry({ start: 1, config: coreSettings("pglite:memory") as never }),
      entryOf(m, 20, { pollMs: 2, limit: 3 }),
      entryOf(m, 1, { pollMs: 1 }, 5),
      entryOf(m, 40, { pollMs: 3 }, 30_000),
    ];
    const { check } = checked(entries, [m]);
    const revisions = processRevisions(check, check.process);
    expect(revisions("m")).toEqual([
      { start: 1n, stop: 5n, version: "1.0.0", settings: { limit: 10, pollMs: 1 } },
      { start: 20n, stop: 39n, version: "1.0.0", settings: { limit: 3, pollMs: 2 } },
      { start: 40n, stop: 30_000n, version: "1.0.0", settings: { limit: 10, pollMs: 3 } },
    ]);
    expect(Object.isFrozen(revisions("m"))).toBe(true);
    expect(Object.isFrozen(revisions("m")[0])).toBe(true);
    expect(revisions("other")).toEqual([]);
  });

  it("gives every backbone part the core's revisions: each one's data fields, and every other field from the process's revision", () => {
    const entries = [
      coreEntry({ start: 1, config: coreSettings("pglite:/a", { node: N1, retainStates: 0, developmentOptIn: false }) as never }),
      coreEntry({ start: 50, config: coreSettings("pglite:/b", { node: N2, retainStates: 4 }) as never }),
      { id: "core", start: 90, version: { umbradb: "0.10.0", ledgers: [] } },
    ];
    const { check } = checked(entries, []);
    const revisions = processRevisions(check, check.process);
    // Listed in another order, the revisions come out in start order with the same stops.
    const reordered = checked([entries[2], entries[1], entries[0]], []).check;
    expect(processRevisions(reordered, reordered.process)("core-chain")).toEqual(revisions("core-chain"));
    const [first, second, scheduled] = revisions("core-chain");
    expect([first?.start, first?.stop, second?.start, second?.stop, scheduled?.start, scheduled?.stop]).toEqual([1n, 49n, 50n, 89n, 90n, null]);
    expect(first?.settings).toMatchObject({ database: "pglite:/b", node: N2, developmentOptIn: true, retainStates: 0, network: "custom" });
    expect(second?.settings).toMatchObject({ database: "pglite:/b", node: N2, developmentOptIn: true, retainStates: 4 });
    expect(scheduled?.settings).toMatchObject({ database: "pglite:/b", node: N2 });
    expect(scheduled?.settings).not.toHaveProperty("retainStates");
    expect(first?.version).toBe(canonicalJson(buildCoreVersion()));
    expect(revisions("core-block-commit")).toBe(revisions("core-chain"));
    // A control's process revision: the first one's operational fields.
    const firstRevision = processRevisions(check, check.entries[0] as CheckedEntry)("core-chain");
    expect(firstRevision[1]?.settings).toMatchObject({ database: "pglite:/a", node: N1, developmentOptIn: false, retainStates: 4 });
  });
});

describe("startProcess without a database", () => {
  it("refuses an invalid declaration first, its block source never made, logged with its finding; the process ends (Q137 B)", async () => {
    let made = false;
    const lines: string[] = [];
    const handle = startProcess({
      declarations: { backbone: [], core: [], user: [{ id: "Bad" }] },
      config: { data: { entries: [] } },
      source: () => {
        made = true;
        return new InMemoryBlockSource({ head: 1n });
      },
      log: (line) => lines.push(line),
    });
    await expect(handle.started).rejects.toMatchObject({ code: "invalid-declaration" });
    expect(await handle.ended).toMatchObject({ kind: "refused" });
    expect(made).toBe(false);
    expect(lines).toEqual([
      "startup refused: invalid-declaration (1 finding); the process ends",
      expect.stringMatching(/^startup refused: the user module Bad: .* \[invalid-declaration\]$/),
    ]);
    // It ended by itself: nothing to stop.
    await handle.closed;
    expect(handle.status().state).toBe("refused");
    await handle.stop();
    expect(handle.status().state).toBe("refused");
  });

  it("logs to standard error by default, and loads umbradb.config.ts from the working directory by default (CF-1)", async () => {
    const written: string[] = [];
    const write = process.stderr.write.bind(process.stderr);
    process.stderr.write = ((chunk: string | Uint8Array) => {
      written.push(String(chunk));
      return true;
    }) as typeof process.stderr.write;
    try {
      const handle = startProcess({ declarations: testBuild([]).declarations, source: new InMemoryBlockSource({ head: 1n }) });
      await expect(handle.started).rejects.toMatchObject({
        code: "invalid-configuration",
        details: { reason: "file-not-found", file: join(process.cwd(), "umbradb.config.ts") },
      });
      await handle.stop();
    } finally {
      process.stderr.write = write;
    }
    expect(written).toEqual([
      "startup refused: invalid-configuration (1 finding); the process ends\n",
      expect.stringMatching(/^startup refused: .*umbradb\.config\.ts: no configuration file at .* \[invalid-configuration file-not-found\]\n$/),
    ]);
  });

  it("logs a refusal after the configuration was validated with its code and message; a value thrown that is no Error as text", async () => {
    const lines: string[] = [];
    const throwing = loggingModule("throwing", [], [], {
      points: {
        async "on-start-db"() {
          throw "on-start-db throws a string";
        },
      },
    });
    const build = testBuild([throwing]);
    const handle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [core("pglite:memory"), entryOf(throwing, 1)] } },
      source: new InMemoryBlockSource({ head: 1n }),
      log: (line) => lines.push(line),
    });
    // A failing on-start-db names its point and module (task 5.4), its cause the value thrown.
    await expect(handle.started).rejects.toMatchObject({
      name: "CallbackFailure",
      point: "on-start-db",
      module: "throwing",
      cause: "on-start-db throws a string",
    });
    await handle.stop();
    expect(lines).toEqual([
      "startup refused: callback-error: the on-start-db callback of throwing failed: on-start-db throws a string",
    ]);
  });

  it("holds configuration data to CF-1's plain data: a function refuses with not-plain-data at its path", async () => {
    const settings = { ...coreSettings("pglite:memory"), onError: () => 0 };
    const handle = startProcess({
      declarations: testBuild([]).declarations,
      config: { data: { entries: [{ ...core("pglite:memory"), config: settings }] } },
      source: new InMemoryBlockSource({ head: 1n }),
      log: () => undefined,
    });
    await expect(handle.started).rejects.toMatchObject({
      code: "not-plain-data",
      details: { path: "entries[0].config.onError" },
    });
    await handle.stop();
  });

  it("leaves no rejection unhandled for a caller that awaits only ended", async () => {
    const handle = startProcess({
      declarations: { backbone: [], core: [], user: [{ id: "Bad" }] },
      config: { data: { entries: [] } },
      source: new InMemoryBlockSource({ head: 1n }),
      log: () => undefined,
    });
    expect(await handle.ended).toMatchObject({ kind: "refused", error: { code: "invalid-declaration" } });
    // Node.js reports an unhandled rejection once the microtasks have run: give it the chance before the test ends.
    await new Promise((resolve) => setImmediate(resolve));
    await handle.stop();
  });

  it("refuses a configuration file that does not exist with invalid-configuration (file-not-found)", async () => {
    const handle = startProcess({
      declarations: testBuild([]).declarations,
      config: { file: join(tmpdir(), "no-such-umbradb-config.ts") },
      source: new InMemoryBlockSource({ head: 1n }),
      log: () => undefined,
    });
    await expect(handle.started).rejects.toMatchObject({ code: "invalid-configuration", details: { reason: "file-not-found" } });
    await handle.stop();
  });

  it("uses the block source given: one that cannot read the cursor refuses startup with its error", async () => {
    const given: BlockSource = new InMemoryBlockSource({ head: 1n });
    const failing: BlockSource = {
      cursor: async () => {
        throw new Error("the source cannot read the cursor");
      },
      finalizedHead: async (): Promise<BlockRef> => given.finalizedHead(),
      waitForHead: (above, signal) => given.waitForHead(above, signal),
      block: (height) => given.block(height),
    };
    const build = testBuild([]);
    const handle: ProcessHandle = startProcess({
      declarations: build.declarations,
      config: { data: { entries: [core("pglite:memory")] } },
      source: failing,
      log: () => undefined,
    });
    await expect(handle.started).rejects.toThrow("the source cannot read the cursor");
    await handle.stop();
  });
});
