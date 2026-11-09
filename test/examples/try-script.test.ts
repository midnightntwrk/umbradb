import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { WebSocketServer } from "ws";
import { spawnChild } from "../child-processes.js";
import { EXAMPLE } from "./example-checks.js";

/**
 * `examples/stats-module/try.sh subscribe` prints the subscription's messages until three rows arrived, and no more
 *: run as a user runs it (`bash`, its own `node` client with the repository's `ws`), with `STATS_API` at
 * a local `ws` server that answers the subscription and sends 12 rows at once, as a syncing process does.
 */

/** Rows the server sends, all at once after the acknowledgement. */
const SENT = 12;

let server: WebSocketServer | undefined;

afterEach(async () => {
  for (const client of server?.clients ?? []) client.terminate();
  await new Promise<void>((resolve) => (server === undefined ? resolve() : server.close(() => resolve())));
  server = undefined;
});

/** A server on a free port that answers a subscribe with `subscribed` and {@link SENT} rows; resolves with its port. */
async function rowsServer(): Promise<number> {
  const started = new WebSocketServer({ host: "127.0.0.1", port: 0 });
  server = started;
  await new Promise<void>((resolve) => started.once("listening", () => resolve()));
  started.on("connection", (socket) => {
    socket.on("message", (data) => {
      const { id } = JSON.parse(String(data)) as { readonly id: string };
      socket.send(JSON.stringify({ type: "subscribed", id }));
      for (let height = 1; height <= SENT; height++) socket.send(JSON.stringify({ type: "next", id, value: { height: `${height}` } }));
    });
  });
  return (started.address() as { readonly port: number }).port;
}

/** Runs `try.sh subscribe` against `port` and resolves with its exit code and standard output. */
function subscribe(port: number): Promise<{ readonly code: number | null; readonly stdout: string; readonly stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawnChild("bash", [join(EXAMPLE, "try.sh"), "subscribe"], {
      cwd: EXAMPLE,
      env: { ...process.env, STATS_API: `127.0.0.1:${port}` },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
      stderr += chunk;
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`try.sh subscribe ran longer than 60 s:\n${stdout}\n${stderr}`));
    }, 60_000);
    child.on("error", reject);
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

describe("examples/stats-module/try.sh subscribe", () => {
  it(`prints the acknowledgement and the first three of ${SENT} rows sent at once, then nothing`, async () => {
    const port = await rowsServer();
    const { code, stdout, stderr } = await subscribe(port);
    expect(stderr).toBe("");
    expect(code).toBe(0);
    const messages = stdout.split("\n").filter((line) => line.startsWith("{"));
    expect(messages).toEqual([
      '{"type":"subscribed","id":"s1"}',
      ...[1, 2, 3].map((height) => `{"type":"next","id":"s1","value":{"height":"${height}"}}`),
    ]);
  }, 90_000);
});
