import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type AdminServer, type AdminStarter, startAdminServer } from "../../src/admin/server.js";
import { EXIT, runProcessCommand } from "../../src/cli/command.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { DEFAULT_ADMIN_ADDRESS } from "../../src/config/core-settings.js";
import { versionEntry } from "../../src/config/entries.js";
import { redactor } from "../../src/config/redact.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type ProcessConfig, type ProcessHandle, type ProcessInput, startProcess } from "../../src/runner/process.js";
import { type CliProject, cliProject, inProcess } from "../cli/cli-fixtures.js";
import { exitWithin, runCoreSettings, runInChild } from "../cli/run-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { entryOf, loggingModule, testBuild } from "../runner/process-build.js";
import { freePort } from "../runner/process-harness.js";
import {
  ADMIN_BACKBONE,
  adminCore,
  adminCoreSettings,
  adminSnapshot,
  adminSource,
  ask,
  observe,
  stateProblems,
  statusSnapshot,
  statusWhen,
  within,
} from "./admin-harness.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * A configuration that cannot be loaded, one that is not plain data and one that fails its schemas each end the
 * process: `startProcess` ends `refused` and its `closed` resolves by itself, and `umbradb run` exits with a non-zero
 * code by itself. The process logs every finding with its path (each once, no secret) and opens no admin listener at
 * any time. [A157 CI, AE-1, CF-1–CF-3, Q137 B]
 *
 * To check this, every process here is given a port of the test's own as its admin address (the configuration's
 * `listen.admin`, and the address any admin starter it is given listens on). That port is probed from the process's
 * start until it ended, and the admin starter records every listener asked for.
 *
 * A refusal after the configuration is validated, such as a changed migration checksum, still answers the four
 * endpoints and stays up until stopped. [A157 CI, AE-3]
 *
 * Run on PostgreSQL 18.6 and PGlite 0.5.10 for `startProcess` (the database never opened either: no session on
 * PostgreSQL, no data directory on PGlite), and through the command in this process and in a child process.
 *
 * Committed negative controls, each through its criterion's own oracle:
 * - a process that opens its admin listener at a refusal of its configuration, on its `listen.admin` as loaded (the
 *   earlier rule), fails "no admin listener opened"; [Q127 A]
 * - one that ends on every refusal (the changed migration checksum too) fails the stay-up half;
 * - one that logs only the refusal's code (the earlier log line) fails "every finding with its path", in the process
 *   and through the command.
 */

/** How long a refused configuration may take to end the process on a loaded machine (a wait on purpose). */
const ENDS_WITHIN_MS = 30_000;

/** A secret the refused configurations hold, which no log line may show. */
const SECRET = "pw-8-1b-REFUSED";

/** How a test starts a process: the runner's `startProcess`, or a negative control's. */
type Start = (input: ProcessInput) => ProcessHandle;

/** A directory of this file's own, for configuration files. */
let directory: string;

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-8-1b-"));
  writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
});

afterAll(() => rmSync(directory, { recursive: true, force: true }));

/** One refused configuration of the test. [A157 CI] */
interface Refusal {
  readonly what: string;
  readonly code: "invalid-configuration" | "not-plain-data";
  /** The configuration on `database`, its `listen.admin` at `address` where it has one. */
  config(database: DatabaseParts, address: string): ProcessConfig;
  /** The paths of findings it must log (besides every other finding its refusal carries). */
  paths(): readonly string[];
}

/** A file that does not exist. */
const missingFile = () => join(directory, "no-such.config.ts");

/** A file whose evaluation throws, quoting a URL's credentials. */
function throwingFile(): string {
  const file = join(directory, "throws.config.ts");
  writeFileSync(file, `throw new Error("cannot reach postgres://indexer:${SECRET}@db.example/umbra");\nexport default {};\n`);
  return file;
}

/** A node URL holding the secret: a `secret` setting. [CF-4] */
const SECRET_NODE = `ws://indexer:${SECRET}@127.0.0.1:9/node`;

const REFUSALS: readonly Refusal[] = [
  {
    what: "a file that does not exist (cannot be loaded)",
    code: "invalid-configuration",
    config: () => ({ file: missingFile() }),
    paths: () => [missingFile()],
  },
  {
    what: "a file whose evaluation throws (cannot be loaded), quoting a URL's credentials",
    code: "invalid-configuration",
    config: () => ({ file: throwingFile() }),
    paths: () => [join(directory, "throws.config.ts")],
  },
  {
    what: "a function in a setting (not plain data)",
    code: "not-plain-data",
    config: (database, address) => ({
      data: {
        entries: [
          {
            ...adminCore(database, 1),
            config: { ...adminCoreSettings(database, { listen: { admin: address }, node: SECRET_NODE }), onError: () => 0 },
          },
        ],
      },
    }),
    paths: () => ["entries[0].config.onError"],
  },
  {
    what: "settings failing their schemas (AE-3's livenessTimeoutMs: \"30s\", and apiReadTimeoutMs: 0)",
    code: "invalid-configuration",
    config: (database, address) => ({
      data: {
        entries: [
          adminCore(database, 1, {
            extra: { listen: { admin: address }, node: SECRET_NODE, livenessTimeoutMs: "30s", apiReadTimeoutMs: 0 },
          }),
        ],
      },
    }),
    paths: () => ["entries[0].config.livenessTimeoutMs", "entries[0].config.apiReadTimeoutMs"],
  },
];

/**
 * The boundary case: a configuration that validates but has no `core` revision of the build's version, so there is no
 * `listen.admin` the process could take. Refused before the `core` revision is known, it ends the process too. [Q102]
 */
const NO_CORE_REVISION: Refusal = {
  what: "no core revision of the build's version (its one core entry a versionEntry of another version)",
  code: "invalid-configuration",
  config: () => ({
    file: join(directory, "versions.config.ts"),
    data: { entries: [versionEntry({ id: "core", start: 1, version: { ...buildCoreVersion(), umbradb: "0.0.1" } as never })] },
  }),
  paths: () => [join(directory, "versions.config.ts")],
};

/** The schema failure: the configuration whose `listen.admin` the earlier rule listened on. [Q127 A] */
const SCHEMA_FAILURE = REFUSALS[3] as Refusal;

/** Probes `127.0.0.1:port` every 25 ms until stopped: every answer it got (an HTTP status), and when the first came. */
function probe(port: number): { readonly seen: Promise<void>; stop(): Promise<string[]> } {
  const answered: string[] = [];
  let first!: () => void;
  const seen = new Promise<void>((resolve) => {
    first = resolve;
  });
  let running = true;
  const loop = (async () => {
    while (running) {
      const answer = await ask(`http://127.0.0.1:${port}`, "/health/live", "GET", 1_000);
      if (answer.status !== null) {
        answered.push(`GET /health/live ${answer.status}`);
        first();
      }
      await sleep(25);
    }
  })();
  return {
    seen,
    async stop() {
      running = false;
      await loop;
      return answered;
    },
  };
}

/** An admin starter that records each listener asked for and listens on `address` (the test's port) instead. */
function recordingStarter(address: string): { readonly start: AdminStarter; readonly asked: string[]; readonly first: Promise<void> } {
  const asked: string[] = [];
  let once!: () => void;
  const first = new Promise<void>((resolve) => {
    once = resolve;
  });
  const start: AdminStarter = async (options) => {
    asked.push(options.address);
    once();
    return startAdminServer({ ...options, address });
  };
  return { start, asked, first };
}

/** The findings `error` carries, each with its path and message: what must be logged. [A157 CI] */
function findingsOf(error: unknown): { readonly path: string; readonly message: string }[] {
  if (!(error instanceof UmbraError)) return [];
  const details = error.details as {
    readonly findings?: readonly { readonly path: string; readonly message: string }[];
    readonly path?: unknown;
    readonly file?: unknown;
  };
  if (details.findings !== undefined) return details.findings.map(({ path, message }) => ({ path, message }));
  if (error.code === "not-plain-data") return [{ path: String(details.path), message: error.message }];
  return [{ path: String(details.file), message: error.message }];
}

/**
 * Checks "log every finding with its path" over `lines`. None when so: [A157 CI]
 * - each finding of `error` is in exactly one line, with its path and its message, the message with any URL's
 *   credentials hidden; [CF-4, AE-6]
 * - each of `paths` is among them;
 * - `SECRET` is in no line.
 */
function findingProblems(lines: readonly string[], error: unknown, paths: readonly string[]): string[] {
  const problems: string[] = [];
  const found = findingsOf(error);
  if (found.length === 0) problems.push(`the refusal carries no finding: ${String(error)}`);
  const shown = redactor([]);
  for (const { path, message } of found) {
    const text = shown.text(message);
    const count = lines.filter((line) => line.includes(path) && line.includes(text)).length;
    if (count === 0) problems.push(`no line logs the finding at ${path}`);
    if (count > 1) problems.push(`the finding at ${path} is logged ${count} times`);
  }
  for (const path of paths) {
    if (!found.some((finding) => finding.path === path)) problems.push(`the refusal has no finding at ${path}`);
  }
  if (lines.some((line) => line.includes(SECRET))) problems.push("a line shows the secret");
  return problems;
}

/** On PostgreSQL, the sessions `db`'s database has had (`total`) and has (`now`), read from `observer`'s. */
async function sessionsOf(observer: ProcessDatabase, db: ProcessDatabase): Promise<{ total: number; now: number }> {
  const name = (db.setting as { name: string }).name;
  const [row] = await observer.query(
    `SELECT sessions::int AS total, numbackends::int AS now FROM pg_stat_database WHERE datname = '${name}'`,
  );
  return { total: Number(row?.total), now: Number(row?.now) };
}

/** The tests' build with the admin endpoints' parts among its backbone (as the command's), and `user`. */
function declarationsOf(user: readonly ModuleDeclaration[] = []): ProcessInput["declarations"] {
  const { declarations } = testBuild(user);
  return { ...declarations, backbone: [...declarations.backbone, ...ADMIN_BACKBONE] };
}

/**
 * The ending half of the test, for `startProcess` over `refusal` on `backend`. The process is started by `start`, with
 * the recording admin starter, or with `admin: true` (the real worker) when `real`. It must:
 * - refuse with the refusal's code, and end by itself (`closed` without a `stop()`) within {@link ENDS_WITHIN_MS},
 *   `refused` with that code;
 * - ask for no admin listener, its admin port never answering, with no `admin endpoints listening` line;
 * - log every finding with its path ({@link findingProblems});
 * - leave its database unopened.
 *
 * None when so. [A157 CI]
 */
async function endedProblems(start: Start, backend: ProcessBackend, refusal: Refusal, real = false): Promise<string[]> {
  const problems: string[] = [];
  const port = await freePort();
  const address = `127.0.0.1:${port}`;
  const db = await backend.database();
  const observer = backend.kind === "postgres" ? await backend.database() : null;
  const before = observer === null ? null : await sessionsOf(observer, db);
  const recording = recordingStarter(address);
  const lines: string[] = [];
  const watch = probe(port);
  const handle = start({
    declarations: declarationsOf(),
    config: refusal.config(db.setting, address),
    source: adminSource(3n),
    log: (line) => lines.push(line),
    admin: real ? true : recording.start,
  });
  try {
    const error = await handle.started.then(
      () => null,
      (caught: unknown) => caught,
    );
    if (error === null) problems.push("startup completed");
    else if ((error as { code?: unknown }).code !== refusal.code) {
      problems.push(`refused with ${String((error as { code?: unknown }).code)}, not ${refusal.code}`);
    }
    // A listener asked for or answering is enough to judge; else wait for the process to end by itself.
    await Promise.race([handle.closed, recording.first, watch.seen, sleep(ENDS_WITHIN_MS)]);
    if (!(await within(handle.closed, 500))) problems.push("the process did not end by itself");
    const answered = await watch.stop();
    const status = handle.status();
    if (status.state !== "refused") problems.push(`the process is ${status.state}, not refused`);
    if (status.ended?.kind !== "refused") problems.push(`processing ended ${status.ended?.kind ?? "not at all"}, not refused`);
    if (status.reason?.code !== refusal.code) problems.push(`its reason is ${status.reason?.code ?? "none"}, not ${refusal.code}`);
    if (recording.asked.length > 0) problems.push(`an admin listener was asked for on ${recording.asked.join(", ")}`);
    if (answered.length > 0) problems.push(`the admin port answered ${answered.length} request(s)`);
    if (lines.some((line) => line.startsWith("admin endpoints listening"))) problems.push("an admin listener listened");
    problems.push(...findingProblems(lines, error, refusal.paths()));
    if (db.directory !== undefined && existsSync(db.directory)) problems.push("its database directory exists");
    if (observer !== null && before !== null) {
      let after = await sessionsOf(observer, db);
      for (let waited = 0; after.now > before.now && waited < 30_000; waited += 50) {
        await sleep(50);
        after = await sessionsOf(observer, db);
      }
      if (after.total !== before.total) problems.push(`${after.total - before.total} session(s) on its database`);
    }
  } finally {
    await handle.stop();
    await watch.stop();
  }
  return problems;
}

/** A module `m` whose migration `001` is `sql`. */
const migrating = (sql: string): ModuleDeclaration =>
  loggingModule("m", [], ["on-db-write"], { migrations: [{ id: "001", sql }] });

/** A process of the tests' build on `database` with `user`'s entries from 1 and its admin listener at `address`. */
function started(start: Start, database: DatabaseParts, address: string, user: readonly ModuleDeclaration[], admin: ProcessInput["admin"]) {
  return start({
    declarations: declarationsOf(user),
    config: { data: { entries: [adminCore(database, 1, { extra: { listen: { admin: address } } }), ...user.map((part) => entryOf(part, 1))] } },
    source: adminSource(3n),
    log: () => undefined,
    admin,
  });
}

/**
 * The stay-up half of the test on `backend`. A database whose module `m` applied its migration `001` is started again
 * by `start`, with a changed `001` and the real admin worker on a free port. It must refuse with
 * `migration-checksum-changed` after its configuration was validated, and answer the four endpoints: live 200, ready
 * 503, `/status` `refused` with the reason, `/config` 200 (the endpoint-state oracle). It must still be up, answering
 * them, 1.5 s later. None when so. [A157 CI, A64]
 */
async function stayUpProblems(start: Start, backend: ProcessBackend): Promise<string[]> {
  const problems: string[] = [];
  const db = await backend.database();
  const first = started(startProcess, db.setting, "127.0.0.1:0", [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY)")], false);
  await first.started;
  for (let waited = 0; first.status().cursor !== 3n && waited < 60_000; waited += 25) await sleep(25);
  await first.stop();
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const second = started(start, db.setting, `127.0.0.1:${port}`, [migrating("CREATE TABLE m.rows (height bigint PRIMARY KEY, x int)")], true);
  try {
    const error = await second.started.then(
      () => null,
      (caught: unknown) => caught,
    );
    if ((error as { code?: unknown } | null)?.code !== "migration-checksum-changed") {
      problems.push(`startup ended with ${String((error as { code?: unknown } | null)?.code ?? "no refusal")}`);
    }
    const reason = { code: "migration-checksum-changed", module: "m" };
    await statusWhen(origin, (body) => body.state === "refused", 20_000).catch(() => undefined);
    problems.push(...stateProblems(await observe(origin), { state: "refused", ready: false, reason }));
    if (await within(second.closed, 1_500)) problems.push("the process ended by itself");
    problems.push(...stateProblems(await observe(origin), { state: "refused", ready: false, reason }).map((p) => `1.5 s later: ${p}`));
  } finally {
    await second.stop();
  }
  return problems;
}

/** A handle over `handle` whose `stop()` also runs `also`, and whose `closed` resolves only then. */
function stoppedWith(handle: ProcessHandle, also: () => Promise<void>): ProcessHandle {
  let stopped!: () => void;
  const closed = new Promise<void>((resolve) => {
    stopped = resolve;
  });
  let stopping: Promise<void> | undefined;
  return {
    started: handle.started,
    ended: handle.ended,
    closed,
    status: () => handle.status(),
    backup: (out, seams) => handle.backup(out, seams),
    pause: () => handle.pause(),
    resume: () => handle.resume(),
    stop: () => {
      stopping ??= (async () => {
        await handle.stop();
        await also();
        stopped();
      })();
      return stopping;
    },
  };
}

/**
 * A negative control: a process that opens its admin listener at a refusal of its configuration, as the earlier rule
 * did, through the admin starter it was given, and stays up until stopped. It listens on the `listen.admin` of the
 * configuration as loaded when it has one, else on the default. [Q127 A, CF-4]
 */
const earlyListener =
  (start: Start): Start =>
  (input) => {
    const handle = start(input);
    let server: Promise<AdminServer | null> = Promise.resolve(null);
    void handle.ended.then((end) => {
      if (end.kind !== "refused" || typeof input.admin !== "function") return;
      const data = (input.config as { readonly data?: { readonly entries?: readonly { readonly config?: { readonly listen?: { readonly admin?: string } } }[] } })
        .data;
      const address = data?.entries?.[0]?.config?.listen?.admin ?? DEFAULT_ADMIN_ADDRESS;
      const snapshot = adminSnapshot({ status: statusSnapshot({ state: "refused", ready: false }) });
      server = input.admin({ address, beat: new SharedArrayBuffer(8), snapshot }).catch(() => null);
    });
    return stoppedWith(handle, async () => {
      await (await server)?.close();
    });
  };

/** A negative control: a process that ends on every refusal (its own `stop()` once startup refused). */
const endsOnEveryRefusal =
  (start: Start): Start =>
  (input) => {
    const handle = start(input);
    void handle.ended.then((end) => {
      if (end.kind === "refused") void handle.stop();
    });
    return handle;
  };

/** The log of a negative control that logs only a startup refusal's code (the earlier line), and every other line. */
function codeOnly(log: (line: string) => void): (line: string) => void {
  return (line) => {
    const refused = /^startup refused: ([a-z-]+)( \(|$)/.exec(line);
    if (refused !== null) log(`startup refused: ${refused[1]}`);
    else if (!line.startsWith("startup refused: ")) log(line);
  };
}

/** A negative control: a process that logs only the refusal's code. */
const loggingOnlyTheCode =
  (start: Start): Start =>
  (input) =>
    start({ ...input, log: codeOnly(input.log ?? (() => undefined)) });

describe.each(PROCESS_BACKENDS)("A157: a refused configuration ends startProcess on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A157: a file that cannot be loaded, data not plain and settings failing their schemas each end the process refused, every finding logged with its path, no admin listener opened", async () => {
    for (const refusal of REFUSALS) expect(await endedProblems(startProcess, backend, refusal), refusal.what).toEqual([]);
  }, 300_000);

  it("on the line: a configuration with no core revision of the build's version ends the process too, every finding logged, no admin listener", async () => {
    expect(await endedProblems(startProcess, backend, NO_CORE_REVISION)).toEqual([]);
  }, 120_000);

  it("A157 with the real admin worker: a schema failure opens no admin listener on the listen.admin it names", async () => {
    expect(await endedProblems(startProcess, backend, SCHEMA_FAILURE, true)).toEqual([]);
  }, 120_000);

  it("A157: a refusal after the configuration is validated (a changed migration checksum) answers the four endpoints, up until stopped", async () => {
    expect(await stayUpProblems(startProcess, backend)).toEqual([]);
  }, 180_000);

  it("negative control: a process opening its admin listener at a refusal of its configuration fails 'no admin listener opened'", async () => {
    const problems = await endedProblems(earlyListener(startProcess), backend, SCHEMA_FAILURE);
    // Its listener is asked for on the configuration's listen.admin, the test's port (whether the probe saw it answer
    // before the oracle stopped probing depends on how fast its thread started).
    expect(problems.filter((problem) => /^an admin listener was asked for on 127\.0\.0\.1:\d+$/.test(problem))).toHaveLength(1);
    expect(problems).toContain("the process did not end by itself");
  }, 120_000);

  it("negative control: a process ending on every refusal fails A157's stay-up half", async () => {
    expect(await stayUpProblems(endsOnEveryRefusal(startProcess), backend)).toContain("the process ended by itself");
  }, 180_000);

  it("negative control: a process logging only the refusal's code fails 'every finding with its path'", async () => {
    expect(await endedProblems(loggingOnlyTheCode(startProcess), backend, SCHEMA_FAILURE)).toEqual([
      "no line logs the finding at entries[0].config.livenessTimeoutMs",
      "no line logs the finding at entries[0].config.apiReadTimeoutMs",
    ]);
  }, 120_000);
});

describe("A157: umbradb run on a refused configuration logs every finding and exits 1 by itself", () => {
  let project: CliProject;
  let count = 0;

  beforeAll(async () => {
    project = await cliProject({ cli: true });
  }, 180_000);

  afterAll(() => project?.remove());

  /** A configuration file of the project under a name of its own (Node.js caches a file's evaluation). */
  function write(body: string): string {
    count += 1;
    const name = `refused-${count}.config.ts`;
    project.write(name, body);
    return name;
  }

  /** The `core` settings (JSON) of a file on a PGlite database of its own, its `listen.admin` at `address`. */
  const settings = (address: string, extra: Readonly<Record<string, unknown>> = {}) =>
    runCoreSettings({ kind: "pglite", path: join(project.dir, `db-${count}`) }, SECRET_NODE, { listen: { admin: address }, ...extra });

  /** A file of the project with one `core` entry whose `config` is `config` (a TypeScript expression). */
  const coreFile = (config: string) =>
    write(
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        `export default defineConfig({ entries: [coreEntry({ start: 1, config: ${config} as never })] });`,
        "",
      ].join("\n"),
    );

  /** The command's refused files: `--config` and the paths of the findings it must log. */
  const files: readonly { readonly what: string; file(address: string): string; paths(): readonly string[] }[] = [
    { what: "a file that does not exist", file: () => "no-such.config.ts", paths: () => [join(project.dir, "no-such.config.ts")] },
    {
      what: "a file whose evaluation throws, quoting a URL's credentials",
      file: () => write(`throw new Error("cannot reach postgres://indexer:${SECRET}@db.example/umbra");\nexport default {};\n`),
      paths: () => [join(project.dir, `refused-${count}.config.ts`)],
    },
    {
      what: "a function in a setting",
      file: (address) => coreFile(`{ ...${settings(address)}, onError: () => 0 }`),
      paths: () => ["entries[0].config.onError"],
    },
    {
      what: "settings failing their schemas",
      file: (address) => coreFile(settings(address, { livenessTimeoutMs: "30s", apiReadTimeoutMs: 0 })),
      paths: () => ["entries[0].config.livenessTimeoutMs", "entries[0].config.apiReadTimeoutMs"],
    },
  ];

  /**
   * The `umbradb run` half of the test in this process over `file`. The command, its process started by `start` with
   * the recording admin starter, must end by itself (no signal sent) within {@link ENDS_WITHIN_MS} with exit 1. Its
   * stderr must log every finding with its path, each once (the command adds no line of its own: no `umbradb run:`).
   * No admin listener may be asked for, answer or listen. None when so. [A157 CI]
   */
  async function commandProblems(start: Start, file: (address: string) => string, paths: () => readonly string[]): Promise<string[]> {
    const problems: string[] = [];
    const port = await freePort();
    const address = `127.0.0.1:${port}`;
    const recording = recordingStarter(address);
    const watch = probe(port);
    const signals = new EventEmitter();
    let handle: ProcessHandle | undefined;
    const run = runProcessCommand({
      signals,
      start: (input) => start({ ...input, admin: recording.start }),
      started: (given) => {
        handle = given;
      },
    });
    const result = inProcess(["run", "--config", file(address)], project.dir, { run });
    const ended = await Promise.race([result.then(() => true), recording.first.then(() => false), watch.seen.then(() => false), sleep(ENDS_WITHIN_MS, false)]);
    if (!ended) {
      problems.push("the command did not end by itself");
      signals.emit("SIGTERM");
    }
    const { code, stdout, stderr } = await result;
    const answered = await watch.stop();
    if (code !== EXIT.failed) problems.push(`the command exited ${code}, not ${EXIT.failed}`);
    if (stdout !== "") problems.push(`the command wrote to stdout: ${stdout}`);
    const lines = stderr.split("\n").filter((line) => line !== "");
    if (lines.some((line) => line.startsWith("umbradb run:"))) problems.push("the command added lines of its own");
    if (recording.asked.length > 0) problems.push(`an admin listener was asked for on ${recording.asked.join(", ")}`);
    if (answered.length > 0) problems.push(`the admin port answered ${answered.length} request(s)`);
    if (lines.some((line) => line.startsWith("admin endpoints listening"))) problems.push("an admin listener listened");
    const status = handle?.status();
    if (status?.ended?.kind !== "refused") problems.push(`processing ended ${status?.ended?.kind ?? "not at all"}, not refused`);
    problems.push(...findingProblems(lines, status?.ended?.kind === "refused" ? status.ended.error : null, paths()));
    if (signals.listenerCount("SIGTERM") + signals.listenerCount("SIGINT") > 0) problems.push("the command still listens for signals");
    return problems;
  }

  /**
   * The stay-up half of the test through the command. The file is refused once its configuration is validated, before
   * the database opens: PGlite without the development opt-in (`development-opt-in-required`). [CF-9]
   *
   * `umbradb run`, its process started by `start` with the real admin worker on the file's `listen.admin`, must keep
   * running and answering the four endpoints (the endpoint-state oracle) 1.5 s on, until SIGTERM. It then exits 1. None
   * when so. [A157 CI, A64]
   */
  async function commandStayUpProblems(start: Start): Promise<string[]> {
    const problems: string[] = [];
    const port = await freePort();
    const origin = `http://127.0.0.1:${port}`;
    const file = coreFile(settings(`127.0.0.1:${port}`, { developmentOptIn: false }));
    const signals = new EventEmitter();
    const run = runProcessCommand({ signals, start });
    const result = inProcess(["run", "--config", file], project.dir, { run });
    try {
      const reason = { code: "development-opt-in-required" };
      await statusWhen(origin, (body) => body.state === "refused", 20_000).catch(() => undefined);
      problems.push(...stateProblems(await observe(origin), { state: "refused", ready: false, reason }));
      if (await within(result, 1_500)) problems.push("the command ended by itself");
    } finally {
      signals.emit("SIGTERM");
    }
    const { code } = await result;
    if (code !== EXIT.failed) problems.push(`the command exited ${code}, not ${EXIT.failed}`);
    return problems;
  }

  it("A157's stay-up half through the command: a refusal after the configuration is validated keeps umbradb run up, answering, until SIGTERM (exit 1)", async () => {
    expect(await commandStayUpProblems(startProcess)).toEqual([]);
  }, 120_000);

  it("negative control: a command whose process ends on every refusal fails the stay-up half", async () => {
    expect(await commandStayUpProblems(endsOnEveryRefusal(startProcess))).toContain("the command ended by itself");
  }, 120_000);

  it("A157 in this process: each refused file — not loadable, not plain data, failing its schemas — exits 1 by itself, every finding logged once, no admin listener", async () => {
    for (const refused of files) expect(await commandProblems(startProcess, refused.file, refused.paths), refused.what).toEqual([]);
  }, 300_000);

  it("A157 through the command in a child process: settings failing their schemas exit 1 by itself, every finding logged, nothing on the listen.admin they name", async () => {
    const port = await freePort();
    const watch = probe(port);
    const file = coreFile(settings(`127.0.0.1:${port}`, { livenessTimeoutMs: "30s", apiReadTimeoutMs: 0 }));
    const run = runInChild(project, ["--config", file]);
    try {
      const code = await exitWithin(run, ENDS_WITHIN_MS).catch((error: Error) => error.message.split("\n")[0]);
      const answered = await watch.stop();
      const stderr = run.stderr();
      expect({ code, answered, listening: stderr.includes("admin endpoints listening") }).toEqual({
        code: EXIT.failed,
        answered: [],
        listening: false,
      });
      for (const path of ["entries[0].config.livenessTimeoutMs", "entries[0].config.apiReadTimeoutMs"]) {
        expect(stderr.split("\n").filter((line) => line.startsWith("startup refused: ") && line.includes(path)), path).toHaveLength(1);
      }
      expect(stderr).not.toContain(SECRET);
      expect(stderr).not.toContain("umbradb run:");
      expect(run.stdout()).toBe("");
    } finally {
      run.child.kill("SIGKILL");
      await watch.stop();
    }
  }, 120_000);

  it("negative control: a command whose process logs only the refusal's code fails 'every finding with its path'", async () => {
    const schema = files[3] as (typeof files)[number];
    expect(await commandProblems(loggingOnlyTheCode(startProcess), schema.file, schema.paths)).toEqual([
      "no line logs the finding at entries[0].config.livenessTimeoutMs",
      "no line logs the finding at entries[0].config.apiReadTimeoutMs",
    ]);
  }, 120_000);
});
