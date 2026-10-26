import { PGlite } from "@electric-sql/pglite";
import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { PGLITE_START_PARAMS } from "../../src/db/pglite.js";
import { ZERO_TIMEOUTS } from "../../src/deterministic-postgresql/index.js";
import {
  ALL_ONE_SECOND,
  ALL_ZERO,
  ONE_SECOND_TIMEOUTS,
} from "../deterministic-postgresql/zero-timeouts-checks.js";
import type { Job, WorkerEvent } from "./pglite-timeouts.worker.js";
import { spawnChild } from "../child-processes.js";

/**
 * DB-15 on PGlite 0.5.10, where a timeout that fires hangs the engine — the whole process, synchronously (design §14,
 * `electric-sql/pglite#1058`; probe 2026-10-25) — so each case runs in a process of its own (`pglite-timeouts.worker.ts`)
 * that this file kills if the statement after 2 s idle in a transaction has not answered {@link HANG_MS} after it was
 * sent; a statement that answers does so in milliseconds.
 *
 * - The zero timeouts, A141's PGlite half under a configuration file setting every timeout to 1 s: an engine started
 *   with the backend's start parameters (`PGLITE_START_PARAMS`) reports 0 and answers; the same engine started without
 *   their zero timeouts — the negative control of "a writer without the zeros" — reports 1 s and hangs.
 * - The read option: an API read with `timeoutMs` reports both timeouts at 0 and answers after idling past it (A141:
 *   "on PGlite an API read sets neither timeout"); a read that sets them, as a PGlite backend applying the option would,
 *   fails that check — it reports 1 s and hangs — the committed negative control of the check.
 */

const WORKER = fileURLToPath(new URL("./pglite-timeouts.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** How long after `sent` a statement that has not answered counts as hung. */
const HANG_MS = 10_000;

/** What one worker process reported, and whether it had to be killed. */
interface Run {
  readonly events: readonly WorkerEvent[];
  readonly hung: boolean;
  readonly stderr: string;
}

const children = new Set<ChildProcess>();
const directories: string[] = [];

afterAll(() => {
  for (const child of children) child.kill("SIGKILL");
  for (const directory of directories) rmSync(directory, { recursive: true, force: true });
});

/** Runs `job` in a worker process until it exits, or kills it {@link HANG_MS} after `sent` without `answered`. */
async function run(job: Job): Promise<Run> {
  const child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.add(child);
  const events: WorkerEvent[] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  let hung = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  createInterface({ input: child.stdout! }).on("line", (line) => {
    if (!line.startsWith("{")) return;
    const event = JSON.parse(line) as WorkerEvent;
    events.push(event);
    if (event.event === "sent") {
      timer = setTimeout(() => {
        hung = true;
        child.kill("SIGKILL");
      }, HANG_MS);
    }
    if (event.event === "answered") clearTimeout(timer);
  });
  // "close", not "exit": it comes after the last line of stdout was delivered.
  await once(child, "close");
  clearTimeout(timer);
  children.delete(child);
  return { events, hung, stderr };
}

/** The settings a run reported (`SHOW`, before its idle gap). */
function settings(run: Run): unknown {
  return run.events.find((event) => event.event === "settings")?.settings;
}

/** A141's PGlite check: every timeout 0 where the work runs, and the statement after 2 s idle answered. */
function expectNeverCutOffNorHung(run: Run): void {
  expect(run.events.filter((event) => event.event === "failed"), run.stderr.slice(-2_000)).toEqual([]);
  expect(settings(run)).toEqual(ALL_ZERO);
  expect(run.hung).toBe(false);
  expect(run.events.map((event) => event.event)).toEqual(["settings", "sent", "answered"]);
}

/** A data directory whose configuration file (`postgresql.auto.conf`) sets every timeout to 1 s (A141). */
async function hostileDirectory(): Promise<string> {
  const root = mkdtempSync(join(tmpdir(), "umbradb-pglite-timeouts-"));
  directories.push(root);
  const dataDir = join(root, "pgdata");
  // ALTER SYSTEM writes the file; this engine never applies it (it is read at the next start).
  const writer = await PGlite.create(dataDir);
  for (const [name, value] of ONE_SECOND_TIMEOUTS) await writer.exec(`ALTER SYSTEM SET ${name} = '${value}'`);
  await writer.close();
  return dataDir;
}

/** The backend's start parameters without the `-c name=0` pair of each zero timeout. */
function withoutZeros(params: readonly string[]): string[] {
  const zeros = new Set(ZERO_TIMEOUTS.map(([name, value]) => `${name}=${value}`));
  const out: string[] = [];
  for (let i = 0; i < params.length; i++) {
    if (params[i] === "-c" && zeros.has(params[i + 1] as string)) i++;
    else out.push(params[i] as string);
  }
  return out;
}

describe("A141 on PGlite 0.5.10, each case in a process of its own (DB-15)", () => {
  it("never cuts off nor hangs the writer under 1 s configuration-file timeouts; without the zeros it hangs", async () => {
    const dataDir = await hostileDirectory();
    const without = withoutZeros(PGLITE_START_PARAMS);
    expect(without.length).toBe(PGLITE_START_PARAMS.length - 2 * ZERO_TIMEOUTS.length);
    const pinned = await run({ mode: "engine", dataDir, startParams: PGLITE_START_PARAMS });
    expectNeverCutOffNorHung(pinned);
    // Negative control: the same engine without the zero timeouts reads the file's 1 s and hangs after the idle gap.
    const unpinned = await run({ mode: "engine", dataDir, startParams: without });
    expect(settings(unpinned)).toEqual(ALL_ONE_SECOND);
    expect(unpinned.hung).toBe(true);
    expect(() => expectNeverCutOffNorHung(unpinned)).toThrow();
  }, 120_000);

  it("sets neither timeout for an API read with the option, which runs past it; a read that sets them hangs", async () => {
    const [plain, setting] = await Promise.all([
      run({ mode: "api-read", setsTimeouts: false }),
      run({ mode: "api-read", setsTimeouts: true }),
    ]);
    expectNeverCutOffNorHung(plain);
    // Negative control: a read that sets the two timeouts, as PostgreSQL's bounded read does, fails the check.
    expect(settings(setting)).toEqual({
      ...ALL_ZERO,
      statement_timeout: "1s",
      idle_in_transaction_session_timeout: "1s",
    });
    expect(setting.hung).toBe(true);
    expect(() => expectNeverCutOffNorHung(setting)).toThrow();
  }, 120_000);
});
