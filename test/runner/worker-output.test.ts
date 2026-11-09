import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startAdminServer } from "../../src/admin/server.js";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { typeScriptEntry } from "../../src/ledger/worker/host.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { drainWorkerOutput } from "../../src/runner/worker-output.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "./process-backends.js";
import { core, entryOf, settle, startProcess } from "./process-build.js";

/**
 * L4 `[CI][NEG]`: with the `log` port given, what the ledger worker and the admin worker write to their standard output
 * and standard error reaches the log, line by line and named by thread and stream, and nothing reaches the process's
 * own stdout and stderr. The negative control gives the engine the command's `workerOutput: "inherit"` port: the
 * threads' lines then reach the process's own streams and none reaches the log, which is also `umbradb run`'s
 * behaviour of today. Each thread is started from an entry that writes one line to each stream and then runs
 * UmbraDB's own (`./fixtures/noisy-*-entry.ts`). On PostgreSQL 18 (Docker), a PGlite directory and PGlite in memory
 * (definition of done item 3).
 */

/** PGlite in memory, the third database of the library's guarantees. */
const PGLITE_MEMORY: DatabaseParts = Object.freeze({ kind: "pglite", memory: true }) as DatabaseParts;

const LEDGER_ENTRY = typeScriptEntry(new URL("./fixtures/noisy-ledger-entry.ts", import.meta.url));
const ADMIN_ENTRY = typeScriptEntry(new URL("./fixtures/noisy-admin-entry.ts", import.meta.url));

/** The four lines the two threads write, as the log gets them. */
const LOGGED = [
  "ledger worker (stdout): noisy ledger entry: a line on stdout",
  "ledger worker (stderr): noisy ledger entry: a line on stderr",
  "admin worker (stdout): noisy admin entry: a line on stdout",
  "admin worker (stderr): noisy admin entry: a line on stderr",
];

/** The four lines, as the process's own streams get them. */
const WRITTEN = [
  "noisy ledger entry: a line on stdout\n",
  "noisy ledger entry: a line on stderr\n",
  "noisy admin entry: a line on stdout\n",
  "noisy admin entry: a line on stderr\n",
];

/** What one run saw: the log's lines, and what reached the process's stdout and stderr. */
interface Seen {
  readonly log: readonly string[];
  readonly stdout: readonly string[];
  readonly stderr: readonly string[];
}

/**
 * Runs a process on `database` that needs the ledger (`core-block-parsed`) and listens for admin, both threads from
 * the noisy entries, with `workerOutput` as given, until the four lines arrived where `arrived` looks (or 30 s passed);
 * then stops it. The process's stdout and stderr are recorded meanwhile, and nothing of them is written.
 */
async function run(database: DatabaseParts, workerOutput: "inherit" | undefined, arrived: (seen: Seen) => boolean): Promise<Seen> {
  const source = new InMemoryBlockSource({ head: 3n });
  const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED];
  const log: string[] = [];
  const stdout: string[] = [];
  const stderr: string[] = [];
  const out = process.stdout.write.bind(process.stdout);
  const err = process.stderr.write.bind(process.stderr);
  process.stdout.write = ((chunk: string | Uint8Array) => stdout.push(String(chunk)) > 0) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array) => stderr.push(String(chunk)) > 0) as typeof process.stderr.write;
  try {
    const handle = startProcess({
      declarations: chainDeclarations([], { core: modules }),
      config: {
        data: {
          entries: [
            core(database, 1, { extra: { listen: { admin: "127.0.0.1:0" } } }),
            ...modules.map((module) => entryOf(module, 1)),
          ],
        },
      },
      source,
      log: (line) => log.push(line),
      adminListener: (options) => startAdminServer(options, ADMIN_ENTRY),
      ledgerWorkerEntry: LEDGER_ENTRY,
      ...(workerOutput === undefined ? {} : { workerOutput }),
    });
    try {
      expect(await settle(handle, source, 3n)).toBe("waiting");
      const seen = (): Seen => ({ log, stdout, stderr });
      for (let waited = 0; !arrived(seen()) && waited < 30_000; waited += 25) await sleep(25);
    } finally {
      await handle.stop();
    }
  } finally {
    process.stdout.write = out;
    process.stderr.write = err;
  }
  return { log, stdout, stderr };
}

/** Whether `lines` hold every line of `wanted`. */
const holds = (lines: readonly string[], wanted: readonly string[]): boolean =>
  wanted.every((line) => lines.includes(line));

/** The noisy lines among `lines`. */
const noisy = (lines: readonly string[]): string[] => lines.filter((line) => line.includes("noisy"));

/**
 * The oracle: every problem with what a run saw, none when each thread's lines reached the log and nothing of them the
 * process's own streams.
 */
function outputProblems(seen: Seen): string[] {
  return [
    ...LOGGED.filter((line) => !seen.log.includes(line)).map((line) => `not in the log: ${line}`),
    ...noisy(seen.stdout).map((text) => `on the process's stdout: ${text.trimEnd()}`),
    ...noisy(seen.stderr).map((text) => `on the process's stderr: ${text.trimEnd()}`),
  ];
}

describe.each([
  ...PROCESS_BACKENDS.map((backend) => [backend.name, backend] as const),
  ["PGlite in memory", null] as const,
])("the worker threads' output reaches the log and nothing else, on %s", (_name, backend: ProcessBackend | null) => {
  beforeAll(() => backend?.start(), 180_000);
  afterAll(() => backend?.stop(), 60_000);
  /** A database of its own for one run. */
  const database = async (): Promise<DatabaseParts> => (backend === null ? PGLITE_MEMORY : (await backend.database()).setting);

  it("with the log port, the ledger worker's and the admin worker's lines reach the log only", async () => {
    expect(outputProblems(await run(await database(), undefined, (now) => holds(now.log, LOGGED)))).toEqual([]);
  }, 120_000);

  it("negative control: the command's workerOutput: \"inherit\" fails it, its lines on the process's own streams", async () => {
    const seen = await run(await database(), "inherit", (now) => holds([...now.stdout, ...now.stderr], WRITTEN));
    expect(outputProblems(seen).sort()).toEqual(
      [
        ...LOGGED.map((line) => `not in the log: ${line}`),
        "on the process's stdout: noisy ledger entry: a line on stdout",
        "on the process's stderr: noisy ledger entry: a line on stderr",
        "on the process's stdout: noisy admin entry: a line on stdout",
        "on the process's stderr: noisy admin entry: a line on stderr",
      ].sort(),
    );
  }, 120_000);
});

describe("drainWorkerOutput: the lines of a thread's streams", () => {
  it("hands over each line, a last one without its newline at the stream's end, and survives a log that throws", async () => {
    const { PassThrough } = await import("node:stream");
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    const lines: string[] = [];
    let calls = 0;
    drainWorkerOutput({ stdout, stderr }, "a thread", (line) => {
      calls += 1;
      if (calls === 1) throw new Error("this log loses its first line");
      lines.push(line);
    });
    stdout.write("lost\nfirst\nsec");
    stdout.end("ond");
    stderr.end("only line");
    await Promise.all([new Promise((resolve) => stdout.once("end", resolve)), new Promise((resolve) => stderr.once("end", resolve))]);
    expect(lines.sort()).toEqual(["a thread (stderr): only line", "a thread (stdout): first", "a thread (stdout): second"]);
  });

  it("reads nothing for an inherited output or a thread without streams", () => {
    const lines: string[] = [];
    drainWorkerOutput({}, "a thread", (line) => lines.push(line));
    drainWorkerOutput({ stdout: null, stderr: null }, "a thread", (line) => lines.push(line));
    expect(() => drainWorkerOutput({ stdout: null }, "a thread", "inherit")).not.toThrow();
    expect(lines).toEqual([]);
  });
});
