import { EventEmitter } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { type CommandIo, EXIT, runCommand, runProcessCommand } from "../../src/cli/command.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { TRACE_STEPS_VARIABLE, TRACE_VARIABLE } from "../../src/trace/file-sink.js";
import { stopTrace, traceSteps, tracing } from "../../src/trace/trace.js";

/**
 * `umbradb run` and `UMBRADB_TRACE` (`src/cli/run.ts`, `src/cli/command.ts`): the command starts the block trace only
 * when its environment names a file, from before its process starts until the command ends, and writes it relative to
 * its working directory. It opens the files first and starts nothing when it cannot; a write that fails at its end fails
 * the command. The process here refuses at startup (PGlite without the development opt-in), so it commits no height
 * (a write that fails during a sync is `./traced-failures.test.ts`'s).
 */

const directories: string[] = [];
afterEach(() => {
  stopTrace();
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

/** What {@link run} saw. */
interface RunResult {
  readonly code: number;
  /** Whether the process was started. */
  readonly started: boolean;
  /** Whether the trace, and its steps' detail, were on when the process was started. */
  readonly traced: boolean;
  readonly steps: boolean;
  readonly directory: string;
  /** What the command wrote on stderr. */
  readonly stderr: string;
}

/**
 * Runs `umbradb run` on a file that refuses, with `env`, in a new working directory: `before` is called with it before
 * the command, `started` once the process is started.
 */
async function run(
  env: CommandIo["env"],
  setup: { readonly before?: (directory: string) => void; readonly started?: (directory: string) => void } = {},
): Promise<RunResult> {
  const directory = mkdtempSync(join(tmpdir(), "umbradb-run-trace-"));
  directories.push(directory);
  setup.before?.(directory);
  const config = {
    entries: [
      {
        id: "core",
        start: 0,
        version: buildCoreVersion(),
        config: {
          network: "preprod",
          node: "ws://127.0.0.1:9/node",
          database: { kind: "pglite", path: join(directory, "db") },
          listen: { admin: "127.0.0.1:0" },
        },
      },
    ],
  };
  writeFileSync(join(directory, "umbradb.config.ts"), `export default ${JSON.stringify(config)};\n`);
  const signals = new EventEmitter();
  let started = false;
  let traced = false;
  let steps = false;
  const command = runProcessCommand({
    signals,
    started: (handle) => {
      started = true;
      traced = tracing();
      steps = traceSteps();
      setup.started?.(directory);
      void handle.started.catch(() => signals.emit("SIGTERM"));
    },
  });
  let stderr = "";
  const io: CommandIo = {
    cwd: directory,
    stdout: () => undefined,
    stderr: (text) => void (stderr += text),
    ...(env === undefined ? {} : { env }),
  };
  const code = await runCommand(["run"], io, { run: command });
  return { code, started, traced, steps, directory, stderr };
}

/**
 * What the working directory holds after a run that wrote no trace: the configuration file alone (the refused PGlite
 * start creates no folder).
 */
const UNTRACED_FILES = ["umbradb.config.ts"];

describe("umbradb run and UMBRADB_TRACE", () => {
  it("unset or empty: the process is not traced and no file is written", async () => {
    for (const env of [{}, { [TRACE_VARIABLE]: "" }, { [TRACE_VARIABLE]: undefined }]) {
      const result = await run(env);
      expect(result.code).toBe(EXIT.failed);
      expect(result.traced).toBe(false);
      expect(tracing()).toBe(false);
      // Negative control: the traced run below leaves its three files in the same directory.
      expect(readdirSync(result.directory).sort()).toEqual(UNTRACED_FILES);
    }
  });

  it("set: the process is traced from its start to the command's end, into the file relative to the working directory", async () => {
    const result = await run({ [TRACE_VARIABLE]: "trace.jsonl" });
    expect(result.code).toBe(EXIT.failed);
    expect(result.traced).toBe(true);
    expect(result.steps).toBe(false);
    // The command opened the three files before the process started, and stopped the trace at its end, which wrote
    // the statements' totals; no height committed, so no line.
    expect(tracing()).toBe(false);
    expect(readdirSync(result.directory).sort()).toEqual(
      [...UNTRACED_FILES, "trace.jsonl", "trace.jsonl.stmts.json", "trace.jsonl.worker.jsonl"].sort(),
    );
    expect(readFileSync(join(result.directory, "trace.jsonl.stmts.json"), "utf8")).toBe("[]");
    expect(readFileSync(join(result.directory, "trace.jsonl"), "utf8")).toBe("");
    expect(readFileSync(join(result.directory, "trace.jsonl.worker.jsonl"), "utf8")).toBe("");
  });

  it("a file it cannot open, its folder missing: the command says so on stderr and exits 1, nothing started", async () => {
    const refused = await run({ [TRACE_VARIABLE]: "missing/trace.jsonl" });
    expect(refused.code).toBe(EXIT.failed);
    expect(refused.started).toBe(false);
    expect(tracing()).toBe(false);
    expect(refused.stderr).toMatch(
      /^umbradb run: UMBRADB_TRACE names a file that cannot be written, so nothing was started: ENOENT[^\n]*missing\/trace\.jsonl[^\n]*\n$/,
    );
    expect(existsSync(join(refused.directory, "missing"))).toBe(false);
    // Negative control: with the folder there, the same variable starts the process, traced, and nothing is said of it.
    const started = await run({ [TRACE_VARIABLE]: "missing/trace.jsonl" }, { before: (directory) => mkdirSync(join(directory, "missing")) });
    expect(started.started).toBe(true);
    expect(started.traced).toBe(true);
    expect(started.stderr).not.toContain(TRACE_VARIABLE);
    expect(readFileSync(join(started.directory, "missing", "trace.jsonl.stmts.json"), "utf8")).toBe("[]");
  });

  it("a write that fails once the process is started, at the command's end: the command fails with the write's error, the trace off", async () => {
    // The folder goes once the process is started, so the trace's write at the command's end cannot be made.
    const setup = (remove: boolean) => ({
      before: (directory: string) => mkdirSync(join(directory, "out")),
      started: (directory: string) => {
        if (remove) rmSync(join(directory, "out"), { recursive: true, force: true });
      },
    });
    await expect(run({ [TRACE_VARIABLE]: "out/trace.jsonl" }, setup(true))).rejects.toThrow(/^writing the block trace failed: ENOENT/);
    expect(tracing()).toBe(false);
    // Negative control: with the folder kept, the command ends with its run's status (this file's process refuses at
    // startup), and the statements' totals are written.
    const kept = await run({ [TRACE_VARIABLE]: "out/trace.jsonl" }, setup(false));
    expect(kept.code).toBe(EXIT.failed);
    expect(readFileSync(join(kept.directory, "out", "trace.jsonl.stmts.json"), "utf8")).toBe("[]");
  });

  it("UMBRADB_TRACE_STEPS=1 beside it adds the steps' detail; alone, or with another value, it does nothing", async () => {
    expect(TRACE_STEPS_VARIABLE).toBe("UMBRADB_TRACE_STEPS");
    expect((await run({ [TRACE_VARIABLE]: "trace.jsonl", [TRACE_STEPS_VARIABLE]: "1" })).steps).toBe(true);
    expect((await run({ [TRACE_VARIABLE]: "trace.jsonl", [TRACE_STEPS_VARIABLE]: "true" })).steps).toBe(false);
    const alone = await run({ [TRACE_STEPS_VARIABLE]: "1" });
    expect(alone.traced).toBe(false);
    expect(alone.steps).toBe(false);
  });

  it("without an environment of its own the command reads the process's", async () => {
    const before = process.env[TRACE_VARIABLE];
    process.env[TRACE_VARIABLE] = "own.jsonl";
    try {
      const result = await run(undefined);
      expect(result.traced).toBe(true);
      expect(existsSync(join(result.directory, "own.jsonl.stmts.json"))).toBe(true);
    } finally {
      if (before === undefined) delete process.env[TRACE_VARIABLE];
      else process.env[TRACE_VARIABLE] = before;
    }
  });
});
