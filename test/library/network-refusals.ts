import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { runProcess } from "../../src/cli/run.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import type { UmbraDBHandle } from "../../src/library/start-umbradb.js";
import type { NetworkRuleName } from "../../src/runner/resolve.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { startWithoutAdmin } from "../runner/process-build.js";
import { libraryData } from "./library-fixtures.js";

/**
 * The oracle of the network plan's refusals, shared by `./network.test.ts` (the criteria and the plan rules'
 * controls) and `./network.negative-control.test.ts` (the schema case with the schema's `transportReader` rule
 * removed): a start refused at its configuration step, ended by itself, nothing opened. And the command half:
 * `umbradb run` on the same configuration refused through the schema. Imports nothing of Vitest.
 */

/** How long a refused process may take to end by itself on a loaded machine. */
export const ENDS_WITHIN_MS = 30_000;

/** How long a negative control's startup is given to settle: a class-A refusal takes well under it. */
export const CONTROL_SETTLES_MS = 5_000;

/** The listening sockets of this process (each is a `TCPServerWrap`). */
export const listeningSockets = (): number =>
  process.getActiveResourcesInfo().filter((resource) => resource === "TCPServerWrap").length;

/** Whether `port` on 127.0.0.1 is free: nothing listens there. */
export function portFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
  });
}

/**
 * What a case expects: the refusal's code and reason (or, for the schema's refusal, the path of its finding), and the
 * ports it names, which must stay free.
 */
export interface Expected {
  readonly code: "network-address-conflict" | "private-link-misconfigured" | "invalid-configuration";
  readonly reason: NetworkRuleName | null;
  readonly finding?: string;
  readonly ports: readonly number[];
}

/**
 * The oracle (see the module comment): every problem of `handle`, started on `db`, against `expected`; none when it was
 * refused so and opened nothing. `sockets` is this process's count of listening sockets before the start.
 */
export async function refusedProblems(
  handle: UmbraDBHandle,
  db: ProcessDatabase,
  expected: Expected,
  sockets: number,
  settlesMs = ENDS_WITHIN_MS,
): Promise<string[]> {
  const problems: string[] = [];
  const settled = await Promise.race([
    handle.started.then(
      () => ({ error: null }),
      (error: unknown) => ({ error }),
    ),
    sleep(settlesMs, "pending" as const),
  ]);
  if (settled === "pending") problems.push(`startup did not settle within ${settlesMs} ms`);
  else if (settled.error === null) problems.push("startup completed");
  else {
    const error = settled.error as { code?: unknown; details?: { reason?: unknown; findings?: readonly { path?: unknown }[] } };
    if (error.code !== expected.code) problems.push(`refused with ${String(error.code)}, not ${expected.code}`);
    else if (expected.reason !== null && error.details?.reason !== expected.reason) {
      problems.push(`refused for ${String(error.details?.reason)}, not ${expected.reason}`);
    }
    if (expected.finding !== undefined && !(error.details?.findings ?? []).some((one) => one.path === expected.finding)) {
      problems.push(`no finding at ${expected.finding}`);
    }
  }
  const during = listeningSockets();
  if (during !== sockets) problems.push(`${during - sockets} listening socket(s) while it ran`);
  for (const port of expected.ports) if (!(await portFree(port))) problems.push(`port ${port} is bound`);
  // Only a refusal of the configuration step ends the process by itself: one that started, or was refused later, is
  // given a moment only, its problem already found.
  const patience = problems.length === 0 ? ENDS_WITHIN_MS : 500;
  if (settled === "pending" || !(await Promise.race([handle.closed.then(() => true), sleep(patience, false)]))) {
    problems.push("the process did not end by itself");
  }
  const status = handle.status();
  if (status.state !== "refused") problems.push(`the process is ${status.state}, not refused`);
  if (status.reason?.code !== expected.code) problems.push(`its reason is ${status.reason?.code ?? "none"}`);
  const { listening } = status;
  if (listening.api !== null || listening.admin !== null || listening.privateLink !== null) {
    problems.push(`listening ${JSON.stringify(listening)}`);
  }
  if (db.directory !== undefined && existsSync(db.directory)) problems.push("its database directory exists");
  if (db.directory === undefined) {
    const [row] = await db.query("SELECT to_regnamespace('core_chain') IS NULL AS fresh");
    if (row?.fresh !== true) problems.push("its PostgreSQL database was migrated");
  }
  return problems;
}


/** How long `umbradb run` is given to end by itself before the run sends it SIGTERM. */
const COMMAND_ENDS_MS = 15_000;

/**
 * The command half: `umbradb run` (`runProcess`, its admin listener left out) in a directory whose
 * `umbradb.config.ts` is a public process on `database` writing `listen.privateLink` at `written`, without
 * `transportReader`. The problems, none when it ended `refused` by itself with a finding at `finding` logged and the
 * written port never bound; a run that did not end is sent SIGTERM.
 */
export async function commandRefusalProblems(database: DatabaseParts, written: number, finding: string): Promise<string[]> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-l18-command-"));
  const lines: string[] = [];
  const signals = new EventEmitter();
  try {
    writeFileSync(
      join(dir, "umbradb.config.ts"),
      `export default ${JSON.stringify(libraryData(database, [], { listen: { privateLink: `127.0.0.1:${written}` } }))};\n`,
    );
    const run = runProcess({ cwd: dir, log: (line) => lines.push(line) }, { signals, backupSignals: new EventEmitter(), start: startWithoutAdmin });
    const ended = await Promise.race([run, sleep(COMMAND_ENDS_MS, "running" as const)]);
    const problems: string[] = [];
    if (ended === "running") {
      problems.push(`umbradb run did not end by itself within ${COMMAND_ENDS_MS} ms`);
      signals.emit("SIGTERM");
      await run;
    } else if (ended?.kind !== "refused") problems.push(`umbradb run ended ${JSON.stringify(ended?.kind ?? null)}, not refused`);
    if (!lines.some((line) => line.startsWith("startup refused: ") && line.includes(finding))) {
      problems.push(`umbradb run logged no finding at ${finding}`);
    }
    if (!(await portFree(written))) problems.push(`port ${written} is bound`);
    return problems;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
