import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT, runProcessCommand, USAGE } from "../../src/cli/command.js";
import { refusalLines } from "../../src/cli/run.js";
import { loadConfig } from "../../src/config/load.js";
import { startProcess as startWithoutAdmin } from "../runner/process-build.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { ask, statusWhen } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { type CliProject, cliProject, inProcess } from "./cli-fixtures.js";
import {
  adminPortIn,
  chainNode,
  exitWithin,
  HEAD,
  runCoreSettings,
  runInChild,
  statsConfig,
  statsModule,
} from "./run-fixtures.js";

/**
 * A152 `[CI]`, its `umbradb run` half (task 4.4a; CF-1, LS-6, MD-1, owner decision Q106 B): `umbradb run` on a file that
 * imports the user module `stats`, exports `modules = [stats]` and lists `stats.entry({ … })` runs `stats` — every
 * height from S to the node's head commits a row of `stats` with its setting —, on PostgreSQL 18.6 and PGlite 0.5.10,
 * in this process (`runProcessCommand` with a signal source of the test's) and through the command itself in a child
 * process (the bundled `src/cli/main.ts`: Node.js's own type stripping, a real SIGTERM, the exit code). The process is
 * what the command builds: UmbraDB's backbone, the node source (`nodeSourceOf`) on the `core` entry's `node` — a tape
 * node serving a synthetic chain (`./run-fixtures.ts`) —, and the admin endpoints, served by default (Q128 B), here on
 * `127.0.0.1:0`. Also: a file listing a module that neither it exports nor UmbraDB ships is refused naming the module,
 * stays up refused until signalled and exits 1; SIGINT stops it as SIGTERM does; `run`'s arguments; and the committed
 * negative control, a run that ignores the file's modules.
 */

/** How long a process may take to reach the head, and to exit after its signal, on a loaded machine. */
const PATIENCE_MS = Number(process.env.UMBRADB_TEST_PATIENCE_MS ?? 240_000);

let project: CliProject;

beforeAll(async () => {
  project = await cliProject({ cli: true });
  project.write("stats.ts", statsModule(project.builders));
}, 120_000);

afterAll(() => project?.remove());

let files = 0;
/** A configuration file under its own name (Node.js caches a file's first evaluation), relative to the project. */
function write(options: Parameters<typeof statsConfig>[1]): string {
  files += 1;
  const name = `run-${files}.config.ts`;
  project.write(name, statsConfig(project.builders, options));
  return name;
}

/** The rows `stats` wrote, as `height label` lines. */
async function statsRows(db: ProcessDatabase): Promise<string[]> {
  const rows = await db.query("SELECT height::int AS h, label FROM stats.rows ORDER BY height");
  return rows.map((row) => `${row.h} ${row.label}`);
}

/** Every height from S = 1 to the head, as `stats` writes them with its label `label`. */
const everyHeight = (label: string) => Array.from({ length: Number(HEAD) }, (_, i) => `${i + 1} ${label}`);

/** Waits until `check` holds or `patienceMs` passed (then fails with `what`). */
async function until(check: () => boolean, what: () => string, patienceMs = PATIENCE_MS): Promise<void> {
  const deadline = Date.now() + patienceMs;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what()}`);
    await sleep(20);
  }
}

/**
 * `umbradb run --config <file>` in this process: the command of `COMMANDS.run` with the test's signals and a view of
 * its handle; resolves once the handle exists.
 */
function runHere(args: readonly string[], seams: Parameters<typeof runProcessCommand>[0] = {}) {
  const signals = new EventEmitter();
  let handle: ProcessHandle | undefined;
  const run = runProcessCommand({
    ...seams,
    signals,
    started: (started) => {
      handle = started;
    },
  });
  const result = inProcess(["run", ...args], project.dir, { run });
  return {
    signals,
    result,
    handle: () => handle,
    async status() {
      await until(() => handle !== undefined, () => "the process was never started");
      return (handle as ProcessHandle).status();
    },
  };
}

describe.each(PROCESS_BACKENDS)("A152: umbradb run runs the user module the file exports, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("in this process: stats runs at every height to the head, and SIGTERM ends the command with exit 0", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      const file = write({ core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "here" }' });
      const run = runHere(["--config", file]);
      await reachHead(run);
      expect((await run.status()).state).toBe("following");
      run.signals.emit("SIGTERM");
      const result = await run.result;
      expect(result.code).toBe(EXIT.ok);
      expect(result.stdout).toBe("");
      // The admin endpoints were served by default, on the file's listen.admin.
      expect(adminPortIn(result.stderr)).not.toBeNull();
      expect(result.stderr).not.toMatch(/startup refused|processing halted/);
      expect(await statsRows(db)).toEqual(everyHeight("here"));
      // The command stopped listening for the signals once the process closed.
      expect(run.signals.listenerCount("SIGTERM") + run.signals.listenerCount("SIGINT")).toBe(0);
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("through the command in a child process: stats runs, /status shows the head, SIGTERM exits 0", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      const file = write({ core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "child" }' });
      const run = runInChild(project, ["--config", file]);
      try {
        const port = await run.adminPort(PATIENCE_MS);
        const status = await headAt(port);
        expect(status.state).toBe("following");
        run.child.kill("SIGTERM");
        expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.ok);
        expect(run.stdout()).toBe("");
        expect(run.stderr()).not.toMatch(/startup refused|processing halted/);
        // Nothing listens once it exited: the admin listener closed with the process.
        expect((await ask(`http://127.0.0.1:${port}`, "/health/live")).status).toBeNull();
      } finally {
        run.child.kill("SIGKILL");
      }
      expect(await statsRows(db)).toEqual(everyHeight("child"));
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);
});

describe("umbradb run: a refusal, SIGINT, its arguments (PGlite 0.5.10)", () => {
  const backend = PROCESS_BACKENDS.find((one) => one.kind === "pglite") as ProcessBackend;
  beforeAll(() => backend.start());
  afterAll(() => backend.stop());

  it("a file listing stats that it does not export is refused naming stats, stays up refused until SIGTERM, exits 1", async () => {
    const db = await backend.database();
    const file = write({ core: runCoreSettings(db.setting, "ws://127.0.0.1:9/node"), modules: null });
    const run = runInChild(project, ["--config", file]);
    try {
      const port = await run.adminPort(PATIENCE_MS);
      const status = await statusWhen(
        `http://127.0.0.1:${port}`,
        (body) => {
          if (body.state === "syncing" || body.state === "following") throw new Error(`the process runs: ${body.state}`);
          return body.state === "refused";
        },
        PATIENCE_MS,
      );
      expect(status.reason).toMatchObject({ code: "invalid-configuration" });
      // The process logs the refusal by its code (before the validation nothing tells the file's secrets apart); the
      // command adds the finding, naming the module.
      expect(run.stderr()).toMatch(/^startup refused: invalid-configuration$/m);
      expect(run.stderr()).toMatch(
        /^umbradb run: entries\[1\]\.id \(stats from 1\): this build has no module stats: .* \[invalid-configuration entry-id\]$/m,
      );
      expect((await ask(`http://127.0.0.1:${port}`, "/health/live")).status).toBe(200);
      run.child.kill("SIGTERM");
      expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.failed);
    } finally {
      run.child.kill("SIGKILL");
    }
    // Nothing of stats was created: startup refused before the database opened.
    expect(existsSync(db.directory as string)).toBe(false);
  }, PATIENCE_MS * 2);

  it("a process whose processing halted stays up halted until SIGTERM, then the command exits 1", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      // stats's on-db-write fails: its table refuses the label it writes (a CHECK).
      project.write("refusing.ts", statsModule(project.builders).replace("label text NOT NULL", "label text NOT NULL CHECK (label <> 'boom')"));
      const file = write({ core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "boom" }', statsFile: "./refusing.ts" });
      const run = runHere(["--config", file]);
      await until(() => run.handle()?.status().state === "halted", () => `halted: ${run.handle()?.status().state}`);
      expect(run.handle()?.status().reason).toMatchObject({ code: "database-error", module: "stats", point: "on-db-write" });
      run.signals.emit("SIGTERM");
      const result = await run.result;
      expect(result.code).toBe(EXIT.failed);
      expect(result.stderr).toMatch(/^processing halted \(database-error\)/m);
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("a file that cannot be loaded is refused by startup as itself, and the command names why (exit 1)", async () => {
    // Refused before it is loaded, the process's admin listener would take CF-4's default 0.0.0.0:8081: this one
    // serves none (the tests' startProcess).
    const run = runHere(["--config", "no-such.config.ts"], { start: startWithoutAdmin });
    await untilRefused(run);
    expect((await run.status()).reason?.code).toBe("invalid-configuration");
    run.signals.emit("SIGTERM");
    const result = await run.result;
    expect(result.code).toBe(EXIT.failed);
    expect(result.stderr).toMatch(/^startup refused: invalid-configuration$/m);
    expect(result.stderr).toMatch(
      /^umbradb run: .*no-such\.config\.ts: no configuration file at .*no-such\.config\.ts.* \[invalid-configuration file-not-found\]$/m,
    );
  }, PATIENCE_MS * 2);

  it("without --config it runs umbradb.config.ts of the working directory (here: none, refused as such)", async () => {
    const signals = new EventEmitter();
    let handle: ProcessHandle | undefined;
    const run = runProcessCommand({
      signals,
      start: startWithoutAdmin,
      started: (started) => {
        handle = started;
      },
    });
    const result = inProcess(["run"], `${project.dir}/types`, { run });
    await until(() => handle?.status().state === "refused", () => `refused: ${handle?.status().state}`);
    signals.emit("SIGTERM");
    const ended = await result;
    expect(ended.code).toBe(EXIT.failed);
    expect(ended.stderr).toMatch(/umbradb\.config\.ts: no configuration file at .*types\/umbradb\.config\.ts/);
  }, PATIENCE_MS * 2);

  it("SIGINT stops the process as SIGTERM does: the command exits 0", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      const file = write({ core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "int" }' });
      const run = runInChild(project, ["--config", file]);
      try {
        const port = await run.adminPort(PATIENCE_MS);
        await headAt(port);
        run.child.kill("SIGINT");
        expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.ok);
      } finally {
        run.child.kill("SIGKILL");
      }
      expect(await statsRows(db)).toEqual(everyHeight("int"));
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("the default file is umbradb.config.ts in the working directory", async () => {
    const tape = await chainNode();
    const db = await backend.database();
    const dir = `default-${files}`;
    project.write(`${dir}/stats.ts`, statsModule(project.builders));
    project.write(`${dir}/umbradb.config.ts`, statsConfig(project.builders, { core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "dflt" }' }));
    try {
      const run = runInChild(project, [], `${project.dir}/${dir}`);
      try {
        const port = await run.adminPort(PATIENCE_MS);
        await headAt(port);
        run.child.kill("SIGTERM");
        expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.ok);
      } finally {
        run.child.kill("SIGKILL");
      }
      expect(await statsRows(db)).toEqual(everyHeight("dflt"));
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("a private file (instanceId, no node) starts a private process: its own backbone and block source", async () => {
    const db = await backend.database();
    files += 1;
    const name = `run-${files}-private.config.ts`;
    const settings = JSON.parse(runCoreSettings(db.setting, "ws://unused")) as Record<string, unknown>;
    delete settings.node;
    project.write(
      name,
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        `export default defineConfig({ entries: [coreEntry({ start: 1, config: ${JSON.stringify({ ...settings, instanceId: "instance-1" })} })] });`,
        "",
      ].join("\n"),
    );
    const run = runHere(["--config", name]);
    await untilRefused(run);
    run.signals.emit("SIGTERM");
    const result = await run.result;
    expect(result.code).toBe(EXIT.failed);
    // The private source's own refusal (no public database to read: task 14.1's intake), after the validation passed
    // with the private core schema — a public process would have refused the file for its missing node.
    expect(result.stderr).toMatch(/^startup refused: invalid-configuration: the private process's core entry has no publicDatabase/m);
    expect(result.stderr).not.toContain("umbradb run:");
  }, PATIENCE_MS * 2);

  it.each([
    [["extra.config.ts"], "run takes no file of its own: umbradb run [--config <file>]"],
    [["--config"], "--config takes a value: the configuration file"],
    [["--config", "a.config.ts", "--config", "b.config.ts"], "run takes --config once"],
    [["--confg", "a.config.ts"], "unknown option --confg of run"],
    [["--database", "postgres://u:pw-4-4a-RUN@h/db"], "unknown option --database of run"],
  ])("umbradb run %j prints the usage and exits 2, starting nothing", async (args, problem) => {
    let started = false;
    const result = await inProcess(["run", ...args], project.dir, {
      run: runProcessCommand({ started: () => (started = true) }),
    });
    expect(result).toEqual({ code: EXIT.usage, stdout: "", stderr: `umbradb: ${problem}\n\n${USAGE}` });
    expect(started).toBe(false);
    expect(result.stderr).not.toContain("pw-4-4a-RUN");
  });

  it("negative control (committed): a run that ignores the file's modules is refused and never runs stats", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      const file = write({ core: runCoreSettings(db.setting, tape.url) });
      const ignoring = runHere(["--config", file], { userModules: () => [] });
      await untilRefused(ignoring);
      expect((await ignoring.status()).reason?.code).toBe("invalid-configuration");
      ignoring.signals.emit("SIGTERM");
      const result = await ignoring.result;
      expect(result.code).toBe(EXIT.failed);
      expect(result.stderr).toMatch(/^startup refused: invalid-configuration$/m);
      expect(result.stderr).toMatch(/^umbradb run: entries\[1\]\.id \(stats from 1\): this build has no module stats: /m);
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);
});

describe("why startup refused, before the validation: the command's own lines (refusalLines)", () => {
  const PASSWORD = "pw-4-4a-REFUSED";
  const database = `postgres://indexer:${PASSWORD}@127.0.0.1:9/indexer`;

  it("a fault of the build's declarations with the file's modules names the module's place (MD-2)", async () => {
    const loaded = await loadConfig({ cwd: project.dir, file: write({ core: runCoreSettings(database, "ws://127.0.0.1:9/n"), modules: "[stats, stats]" }) });
    const lines = refusalLines({ loaded, loadError: undefined, user: loaded.modules, side: "public" });
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/^umbradb run: modules\[1\]: the user module stats \(position 2\) has the id of .* \[duplicate-id\]$/);
  });

  it("every finding of the validation, the file's secrets hidden (CF-4, AE-6)", async () => {
    const loaded = await loadConfig({
      cwd: project.dir,
      file: write({
        core: runCoreSettings(database, "ws://127.0.0.1:9/n", { apiReadTimeoutMs: 0 }),
        statsConfig: '{ label: "s", pollMs: 0 }',
      }),
    });
    const lines = refusalLines({ loaded, loadError: undefined, user: loaded.modules, side: "public" });
    expect(lines).toEqual([
      expect.stringMatching(/^umbradb run: entries\[0\]\.config\.apiReadTimeoutMs \(core from 1\): .* \[invalid-configuration settings-schema\]$/),
      expect.stringMatching(/^umbradb run: entries\[1\]\.config\.pollMs \(stats from 1\): .* \[invalid-configuration settings-schema\]$/),
    ]);
    expect(lines.join("\n")).not.toContain(PASSWORD);
  });

  it("a loader's refusal quoting the file's own error shows no URL's credentials (AE-6)", async () => {
    files += 1;
    const name = `run-${files}-throws.config.ts`;
    project.write(name, `throw new Error("cannot reach postgres://indexer:${PASSWORD}@db/x");\nexport default {};\n`);
    const error = await loadConfig({ cwd: project.dir, file: name }).catch((caught: unknown) => caught);
    const lines = refusalLines({ loaded: null, loadError: error, user: [], side: "public" });
    expect(lines).toEqual([expect.stringMatching(/^umbradb run: .* \[invalid-configuration load-failed\]$/)]);
    expect(lines.join("\n")).toContain("cannot reach postgres://");
    expect(lines.join("\n")).not.toContain(PASSWORD);
  });

  it("the loader's refusal, at the file", async () => {
    const error = await loadConfig({ cwd: project.dir, file: "no-such.config.ts" }).catch((caught: unknown) => caught);
    const lines = refusalLines({ loaded: null, loadError: error, user: [], side: "public" });
    expect(lines).toEqual([expect.stringMatching(/^umbradb run: .*no-such\.config\.ts: no configuration file at .* \[invalid-configuration file-not-found\]$/)]);
  });

  it("none for a refusal of a later step, which the process logs itself with its message", async () => {
    const loaded = await loadConfig({ cwd: project.dir, file: write({ core: runCoreSettings(database, "ws://127.0.0.1:9/n") }) });
    expect(refusalLines({ loaded, loadError: undefined, user: loaded.modules, side: "public" })).toEqual([]);
    // A thrown value that is no refusal of the loader gives no line either.
    expect(refusalLines({ loaded: null, loadError: new Error("not a refusal"), user: [], side: "public" })).toEqual([]);
  });
});

const run = (running: ReturnType<typeof runHere>) => running.handle();

/** Waits until the process of `running` committed the head; fails at once if it refused, halted or ended. */
async function reachHead(running: ReturnType<typeof runHere>): Promise<void> {
  const shown = () => JSON.stringify(running.handle()?.status(), (_k, v) => (typeof v === "bigint" ? `${v}` : v));
  await until(() => {
    const status = running.handle()?.status();
    if (status !== undefined && (status.state === "refused" || status.state === "halted" || status.ended !== null)) {
      throw new Error(`the process did not reach the head: ${shown()}`);
    }
    return status?.cursor === HEAD;
  }, () => `the cursor at ${HEAD}: ${shown()}`);
}

/** Waits until the process of `running` is refused; fails at once if it runs (processes heights) instead. */
async function untilRefused(running: ReturnType<typeof runHere>): Promise<void> {
  await until(() => {
    const status = running.handle()?.status();
    if (status?.state === "syncing" || status?.state === "following") throw new Error(`the process runs: ${status.state}`);
    return status?.state === "refused";
  }, () => `refused: ${running.handle()?.status().state}`);
}

/** Waits until `/status` on `port` shows the head; fails at once if it shows a refusal or a halt. */
function headAt(port: number) {
  return statusWhen(
    `http://127.0.0.1:${port}`,
    (body) => {
      if (body.state === "refused" || body.state === "halted") throw new Error(`the process ${body.state}: ${JSON.stringify(body.reason)}`);
      return body.cursor === `${HEAD}`;
    },
    PATIENCE_MS,
  );
}
