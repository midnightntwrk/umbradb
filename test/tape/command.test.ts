import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  type RecordAndReplayResult,
  readTapeFile,
  runTapeCommand,
  type TapeCommandIo,
  tapeId,
} from "../../tools/tape/index.js";
import { REPOSITORY } from "../node/in8.js";
import { until } from "../node/manual-timers.js";
import { RawClient } from "./raw-client.js";
import { type Script, ScriptedNode } from "./scripted-node.js";
import { spawnChild } from "../child-processes.js";

/**
 * The tape tools' command (`tools/tape/main.ts`, its logic in `tools/tape/command.ts`; task 9.2): `record` starts the
 * recording builder in front of a node until it is told to stop (Ctrl-C), then writes the tape and prints its SHA-256
 * — how the owner records the real tapes of task 0.3 —; `check` is A71's `[MANUAL]` half, the IN-8 tour of the node
 * client recorded through the builder and replayed through the tape node, every frame compared. Run here against the
 * scripted node, in this process and once as a process of its own (Ctrl-C as SIGINT).
 */

const TEST_TIMEOUT_MS = 60_000;

let directory = "";
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-tape-"));
});
afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
});

/** An io for the command: its lines kept, and a stop the test triggers. */
function io(extra: Partial<TapeCommandIo> = {}): TapeCommandIo & {
  readonly lines: string[];
  readonly errors: string[];
  stop(): void;
} {
  const lines: string[] = [];
  const errors: string[] = [];
  let resolve: () => void = () => {};
  const stopped = new Promise<void>((done) => {
    resolve = done;
  });
  return {
    lines,
    errors,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
    untilStopped: () => stopped,
    stop: () => resolve(),
    ...extra,
  };
}

const echo: Script = (request) => [{ result: request.method }];

async function withScripted<T>(script: Script, body: (node: ScriptedNode) => Promise<T>): Promise<T> {
  const node = await ScriptedNode.start(script);
  try {
    return await body(node);
  } finally {
    await node.stop();
  }
}

describe("the tape command", { timeout: TEST_TIMEOUT_MS }, () => {
  it("prints its usage and exits 2 for no command, an unknown one, or a missing or unknown option", async () => {
    const cases: string[][] = [
      [],
      ["play"],
      ["record"],
      ["record", "--node", "ws://127.0.0.1:1"],
      ["check", "--out", "x"],
      ["record", "--node", "ws://127.0.0.1:1", "--out", "x", "--fast"],
      ["record", "--node"],
    ];
    for (const argv of cases) {
      const run = io();
      expect(await runTapeCommand(argv, run)).toBe(2);
      expect(run.errors.join("\n")).toContain("usage: tsx tools/tape/main.ts record --node <ws-url> --out <file>");
      expect(run.lines).toEqual([]);
    }
    // An unknown option with a value is refused too, before anything runs.
    const unknown = io({ recordAndReplay: async () => fakeResult(undefined) });
    const argv = ["check", "--node", "ws://127.0.0.1:1", "--out", join(directory, "t"), "--fast", "yes"];
    expect(await runTapeCommand(argv, unknown)).toBe(2);
    expect(unknown.errors.join("\n")).toContain("unknown or incomplete option --fast");
    expect(existsSync(join(directory, "t"))).toBe(false);
    const help = io();
    expect(await runTapeCommand(["--help"], help)).toBe(0);
    expect(help.lines.join("\n")).toContain("check --node <ws-url> --out <file>");
  });

  it("refuses to write over a file, and refuses a node URL that is not ws:// or wss://", async () => {
    const out = join(directory, "taken.tape.jsonl");
    writeFileSync(out, "kept");
    const run = io();
    expect(await runTapeCommand(["record", "--node", "ws://127.0.0.1:1", "--out", out], run)).toBe(2);
    expect(run.errors).toEqual([`the file ${out} exists: the tape tools do not write over a file`]);
    expect(readFileSync(out, "utf8")).toBe("kept");
    const url = io();
    expect(await runTapeCommand(["record", "--node", "https://example.test", "--out", join(directory, "t")], url)).toBe(
      2,
    );
    expect(url.errors).toEqual(["the tape builder's node must be a ws:// or wss:// URL"]);
  });

  it("record: points the client at the builder, records until stopped, writes the tape, prints its id", async () => {
    await withScripted(echo, async (node) => {
      const out = join(directory, "recorded.tape.jsonl");
      const run = io();
      const exit = runTapeCommand(["record", "--node", node.url, "--out", out], run);
      await until(() => run.lines.length === 1, "the builder's URL");
      const url = /ws:\/\/127\.0\.0\.1:\d+/.exec(run.lines[0] as string)?.[0] as string;
      expect(run.lines[0]).toBe(`recording: point the client at ${url}; stop with Ctrl-C`);
      const client = await RawClient.open(url);
      await client.call("chain_getFinalizedHead", []);
      await client.close();
      await until(() => run.lines.length === 2, "the session's end");
      run.stop();
      expect(await exit).toBe(0);
      const tape = readTapeFile(out);
      const method = "chain_getFinalizedHead";
      expect(tape.records).toEqual([{ method, params: [], result: method }]);
      expect(run.lines.slice(1)).toEqual([
        "session 1 ended by the client: 1 records",
        `${tape.id}  ${out}`,
        "1 records in 1 sessions",
      ]);
      expect(run.errors).toEqual([]);
    });
  });

  it("record: a frame it cannot record ends it at once with the error and exit 1, writing nothing", async () => {
    await withScripted(() => [{ raw: "{oops" }], async (node) => {
      const out = join(directory, "never.tape.jsonl");
      const run = io();
      const exit = runTapeCommand(["record", "--node", node.url, "--out", out], run);
      await until(() => run.lines.length === 1, "the builder's URL");
      const url = /ws:\/\/127\.0\.0\.1:\d+/.exec(run.lines[0] as string)?.[0] as string;
      const client = await RawClient.open(url);
      client.request("m", [], 1);
      expect(await exit).toBe(1);
      expect(run.errors).toHaveLength(1);
      expect(run.errors[0]).toMatch(/^cannot-record in session 1, a frame from the node \(not-json-rpc\)/);
      expect(existsSync(out)).toBe(false);
      await client.closed;
    });
  });

  it("check: writes the tape, prints its SHA-256 and exits 0 when every frame is identical", async () => {
    const out = join(directory, "a71.tape.jsonl");
    const result = fakeResult(undefined);
    const run = io({ recordAndReplay: async () => result });
    expect(await runTapeCommand(["check", "--node", "wss://node.example.test", "--out", out], run)).toBe(0);
    expect(readFileSync(out)).toEqual(Buffer.from(result.bytes));
    expect(run.lines).toEqual([
      `${result.id}  ${out}`,
      "identical: 2 connections, 3 frames sent and 4 received, byte for byte (A71)",
    ]);
  });

  it("check: exits 1 naming the first difference, the tape still written", async () => {
    const out = join(directory, "a71.tape.jsonl");
    const result = fakeResult("connection 1, frame 1 sent: recorded a, replayed b");
    const run = io({ recordAndReplay: async () => result });
    expect(await runTapeCommand(["check", "--node", "ws://127.0.0.1:1", "--out", out], run)).toBe(1);
    expect(run.lines).toEqual([`${result.id}  ${out}`]);
    expect(run.errors).toEqual(["not identical: connection 1, frame 1 sent: recorded a, replayed b"]);
  });

  it("check: exits 1 with the error when the recording fails", async () => {
    const out = join(directory, "a71.tape.jsonl");
    const run = io();
    expect(await runTapeCommand(["check", "--node", "ws://127.0.0.1:1", "--out", out], run)).toBe(1);
    expect(run.errors[0]).toMatch(/^node-unreachable/);
    expect(existsSync(out)).toBe(false);
  });

  it("check: the real tour against the scripted node", async () => {
    const { MAINNET, MAINNET_BLOCK, recorded } = await import("../node/fake-node.js");
    const header = recorded("chain_getHeader").result;
    const script: Script = (request) => {
      if (request.method === "chain_subscribeNewHeads") {
        return [{ result: "n" }, { notify: "chain_newHead", subscription: "n", result: header }];
      }
      if (request.method === "chain_subscribeFinalizedHeads") {
        const notify = { notify: "chain_finalizedHead", subscription: "f", result: header };
        return [{ result: "f" }, notify, notify];
      }
      if (request.method === "chain_getFinalizedHead") return [{ result: MAINNET_BLOCK }];
      if (request.method === "state_getMetadata") return [{ result: "0x00" }];
      const call = MAINNET.calls.find(
        (one) => one.method === request.method && JSON.stringify(one.params) === JSON.stringify(request.params),
      );
      return [{ result: call?.result ?? null }];
    };
    await withScripted(script, async (node) => {
      const out = join(directory, "tour.tape.jsonl");
      const run = io();
      expect(await runTapeCommand(["check", "--node", node.url, "--out", out], run)).toBe(0);
      const tape = readTapeFile(out);
      expect(run.lines).toEqual([
        `${tape.id}  ${out}`,
        "identical: 1 connections, 12 frames sent and 15 received, byte for byte (A71)",
      ]);
    });
  });

  it("runs as a process of its own: record until SIGINT, then the tape and its SHA-256", async () => {
    await withScripted(echo, async (node) => {
      const out = join(directory, "process.tape.jsonl");
      const child = spawnChild(
        process.execPath,
        ["--import", "tsx", join(REPOSITORY, "tools/tape/main.ts"), "record", "--node", node.url, "--out", out],
        { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] },
      );
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (data) => {
        stdout += String(data);
      });
      child.stderr.on("data", (data) => {
        stderr += String(data);
      });
      const exited = new Promise<number | null>((resolve) => child.on("exit", (code) => resolve(code)));
      await until(() => stdout.includes("recording:"), "the builder's URL", 45_000);
      const url = /ws:\/\/127\.0\.0\.1:\d+/.exec(stdout)?.[0] as string;
      const client = await RawClient.open(url);
      await client.call("system_properties", []);
      await client.close();
      await until(() => stdout.includes("session 1 ended"), "the session's end", 45_000);
      child.kill("SIGINT");
      expect(await exited).toBe(0);
      expect(stderr).toBe("");
      const bytes = readFileSync(out);
      expect(stdout).toContain(`${tapeId(bytes)}  ${out}\n1 records in 1 sessions\n`);
      expect(stdout).toContain("session 1 ended by the client: 1 records\n");
      const usage = spawnChild(process.execPath, ["--import", "tsx", join(REPOSITORY, "tools/tape/main.ts")], {
        cwd: REPOSITORY,
        stdio: "ignore",
      });
      expect(await new Promise((resolve) => usage.on("exit", (code) => resolve(code)))).toBe(2);
    });
  });
});

/** A `recordAndReplay` result for the command's reporting: two connections, three frames sent, four received. */
function fakeResult(difference: string | undefined): RecordAndReplayResult {
  const bytes = new TextEncoder().encode('{"disconnect":true}\n');
  const frames = [
    { sent: ["a", "b"], received: ["c", "d", "e"] },
    { sent: ["f"], received: ["g"] },
  ];
  return {
    records: [{ disconnect: true }],
    bytes,
    id: tapeId(bytes),
    recorded: frames,
    replayed: frames,
    difference,
    identical: difference === undefined,
  };
}
