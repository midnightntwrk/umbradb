/**
 * The tape tools' command (task 9.2), run as `npx tsx tools/tape/main.ts <command> --node <ws-url> --out <file>`
 * (`./main.ts`, outside the package like the rest of `tools/tape/`):
 *
 * - **`record`** starts the recording builder (`./builder.ts`) in front of the node, prints the URL to point the client
 *   at, and records until it is told to stop (Ctrl-C, or SIGTERM); then writes the tape to `--out` and prints its
 *   SHA-256 — how the real tapes of task 0.3 are recorded. A frame it cannot record ends it at once (exit 1), writing
 *   nothing.
 * - **`check`** is A71's `[MANUAL]` half: the IN-8 tour of the node client recorded through the builder against the
 *   node and replayed through the tape node (`./replay-check.ts`); it writes the tape to `--out`, prints its SHA-256
 *   (for the pull request) and exits 0 when every frame of every connection was byte-identical, 1 otherwise.
 *
 * Exit codes: 0 done, 1 failed, 2 a usage error (a missing or unknown argument, a `--out` file that exists — the tools
 * never write over a tape —, a node URL that is not `ws://` or `wss://`). The node's URL is never printed.
 */

import { existsSync } from "node:fs";
import { isWebSocketUrl, NODE_URL_REFUSED, TapeBuilder } from "./builder.js";
import { errorText, recordAndReplay } from "./replay-check.js";
import { writeTapeFile } from "./tape.js";

export interface TapeCommandIo {
  /** Writes a line to standard output. */
  readonly out: (line: string) => void;
  /** Writes a line to standard error. */
  readonly err: (line: string) => void;
  /** Called once `record` is recording: settles when it should stop (on SIGINT or SIGTERM in `./main.ts`). */
  readonly untilStopped: () => Promise<unknown>;
  /** The record-and-replay `check` runs; {@link recordAndReplay} by default (a test may give another). */
  readonly recordAndReplay?: typeof recordAndReplay;
}

export const USAGE = [
  "usage: tsx tools/tape/main.ts record --node <ws-url> --out <file>",
  "         records a client's session with the node through the recording builder until Ctrl-C, then writes the",
  "         tape and prints its SHA-256; point the client at the URL it prints",
  "       tsx tools/tape/main.ts check --node <ws-url> --out <file>",
  "         A71's record-and-replay check: the node client's IN-8 tour recorded through the builder and replayed",
  "         through the tape node, every frame compared byte for byte; writes the tape and prints its SHA-256",
].join("\n");

/** The arguments of a command, or why they are not. */
function parse(argv: readonly string[]): { command: "record" | "check"; node: string; out: string } | string {
  const [command, ...rest] = argv;
  if (command !== "record" && command !== "check") return "a command, record or check, is needed";
  const options = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    const name = rest[index] as string;
    const value = rest[index + 1];
    if ((name !== "--node" && name !== "--out") || value === undefined) return `unknown or incomplete option ${name}`;
    options.set(name, value);
  }
  const node = options.get("--node");
  const out = options.get("--out");
  if (node === undefined || out === undefined) return "--node and --out are needed";
  return { command, node, out };
}

/** Runs the tape command `argv` (without `node` and the script); resolves with its exit code. */
export async function runTapeCommand(argv: readonly string[], io: TapeCommandIo): Promise<number> {
  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "help")) {
    io.out(USAGE);
    return 0;
  }
  const args = parse(argv);
  if (typeof args === "string") {
    io.err(`${args}\n${USAGE}`);
    return 2;
  }
  if (!isWebSocketUrl(args.node)) {
    io.err(NODE_URL_REFUSED);
    return 2;
  }
  if (existsSync(args.out)) {
    io.err(`the file ${args.out} exists: the tape tools do not write over a file`);
    return 2;
  }
  try {
    return args.command === "record" ? await record(args.node, args.out, io) : await check(args.node, args.out, io);
  } catch (error) {
    io.err(errorText(error));
    return 1;
  }
}

async function record(node: string, out: string, io: TapeCommandIo): Promise<number> {
  const builder = await TapeBuilder.start({
    node,
    onSessionEnd: (session, end, records) => io.out(`session ${session} ended by the ${end}: ${records} records`),
  });
  io.out(`recording: point the client at ${builder.url}; stop with Ctrl-C`);
  await Promise.race([io.untilStopped(), builder.failed]);
  const records = await builder.stop();
  const id = writeTapeFile(out, records);
  io.out(`${id}  ${out}`);
  io.out(`${records.length} records in ${builder.sessions} sessions`);
  return 0;
}

async function check(node: string, out: string, io: TapeCommandIo): Promise<number> {
  const result = await (io.recordAndReplay ?? recordAndReplay)({ node });
  const id = writeTapeFile(out, result.records);
  io.out(`${id}  ${out}`);
  if (result.difference !== undefined) {
    io.err(`not identical: ${result.difference}`);
    return 1;
  }
  const sent = result.recorded.reduce((total, frames) => total + frames.sent.length, 0);
  const received = result.recorded.reduce((total, frames) => total + frames.received.length, 0);
  io.out(
    `identical: ${result.recorded.length} connections, ${sent} frames sent and ${received} received, ` +
      "byte for byte (A71)",
  );
  return 0;
}
