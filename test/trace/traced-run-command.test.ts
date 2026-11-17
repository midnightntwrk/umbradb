import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { type CommandIo, EXIT, runCommand, runProcessCommand } from "../../src/cli/command.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { TRACE_STEPS_VARIABLE, TRACE_VARIABLE } from "../../src/trace/file-sink.js";
import { stopTrace, traceSteps, tracing } from "../../src/trace/trace.js";

/**
 * `umbradb run` and `UMBRADB_TRACE` (`src/cli/run.ts`): the command starts the block trace only when its environment
 * names a file, from before its process starts until the command ends, and writes it relative to its working
 * directory. The process here refuses at startup (PGlite without the development opt-in), so it commits no height.
 */

const directories: string[] = [];
afterEach(() => {
  stopTrace();
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

/** Runs `umbradb run` on a file that refuses, with `env`; resolves with the exit code and whether it was traced. */
async function run(
  env: CommandIo["env"],
): Promise<{ readonly code: number; readonly traced: boolean; readonly steps: boolean; readonly directory: string }> {
  const directory = mkdtempSync(join(tmpdir(), "umbradb-run-trace-"));
  directories.push(directory);
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
  let traced = false;
  let steps = false;
  const command = runProcessCommand({
    signals,
    started: (handle) => {
      traced = tracing();
      steps = traceSteps();
      void handle.started.catch(() => signals.emit("SIGTERM"));
    },
  });
  const io: CommandIo = { cwd: directory, stdout: () => undefined, stderr: () => undefined, ...(env === undefined ? {} : { env }) };
  const code = await runCommand(["run"], io, { run: command });
  return { code, traced, steps, directory };
}

describe("umbradb run and UMBRADB_TRACE", () => {
  it("unset or empty: the process is not traced and no file is written", async () => {
    for (const env of [{}, { [TRACE_VARIABLE]: "" }, { [TRACE_VARIABLE]: undefined }]) {
      const result = await run(env);
      expect(result.code).toBe(EXIT.failed);
      expect(result.traced).toBe(false);
      expect(tracing()).toBe(false);
      expect(existsSync(join(result.directory, "trace.jsonl.stmts.json"))).toBe(false);
    }
  });

  it("set: the process is traced from its start to the command's end, into the file relative to the working directory", async () => {
    const result = await run({ [TRACE_VARIABLE]: "trace.jsonl" });
    expect(result.code).toBe(EXIT.failed);
    expect(result.traced).toBe(true);
    expect(result.steps).toBe(false);
    // The command stopped the trace, which wrote the statements' totals; no height committed, so no line.
    expect(tracing()).toBe(false);
    expect(readFileSync(join(result.directory, "trace.jsonl.stmts.json"), "utf8")).toBe("[]");
    expect(existsSync(join(result.directory, "trace.jsonl"))).toBe(false);
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
