/**
 * The tape tools' command (tasks 9.2 and 0.3), run as `npx tsx tools/tape/main.ts <command> --node <ws-url> …`
 * (`./main.ts`, outside the package like the rest of `tools/tape/`):
 *
 * - **`record`** starts the recording builder (`./builder.ts`) in front of the node, prints the URL to point the client
 *   at, and records until it is told to stop (Ctrl-C, or SIGTERM); then writes the tape to `--out` and prints its
 *   SHA-256. A frame it cannot record ends it at once (exit 1), writing nothing.
 * - **`check`** is A71's `[MANUAL]` half: the IN-8 tour of the node client recorded through the builder against the
 *   node and replayed through the tape node (`./replay-check.ts`); it writes the tape to `--out`, prints its SHA-256
 *   (for the pull request) and exits 0 when every frame of every connection was byte-identical, 1 otherwise.
 * - **`range`** records every IN-8 call of every height `--from`–`--to` and a live window of the head subscriptions
 *   (`./range.ts`, task 0.3, Q123), checks the tape complete (`./completeness.ts`) — writing nothing when it is not —,
 *   writes it to `--out` and prints its SHA-256, size, request rate and runtimes, and first the node version the node
 *   reports (`system_version`, asked on a connection of its own outside the builder, so it is not on the tape: it is
 *   not an IN-8 call). Options: `--concurrency` (requests in flight, 8), `--chunk` (heights a connection records, 500),
 *   `--live-seconds` (60).
 * - **`boundaries`** reads the network's genesis and runtime upgrades (`./boundaries.ts`) and writes the record the
 *   built-in ledger tables cite to `--out` (JSON: the node's answers, with the genesis, the head and each boundary);
 *   `--step` (blocks between samples of the runtime, 1,000), `--concurrency` (8).
 *
 * Exit codes: 0 done, 1 failed, 2 a usage error (a missing or unknown argument, a `--out` file that exists — the tools
 * never write over a file —, a node URL that is not `ws://` or `wss://`). The node's URL is never printed; `boundaries`
 * writes it into its record, as the source the tables name.
 */

import { existsSync, writeFileSync } from "node:fs";
import { WebSocket } from "ws";
import { readBoundaries } from "./boundaries.js";
import { isWebSocketUrl, NODE_URL_REFUSED, TapeBuilder } from "./builder.js";
import { completenessProblems } from "./completeness.js";
import { recordRange } from "./range.js";
import { errorText, recordAndReplay } from "./replay-check.js";
import { writeTape, writeTapeFile } from "./tape.js";

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
  "       tsx tools/tape/main.ts range --node <ws-url> --from <height> --to <height> --out <file>",
  "                                    [--concurrency <n>] [--chunk <heights>] [--live-seconds <s>]",
  "         records every IN-8 call of every height of the range and a live window of the head subscriptions",
  "         (task 0.3), checks the tape complete, writes it and prints its SHA-256",
  "       tsx tools/tape/main.ts boundaries --node <ws-url> --out <file> [--step <blocks>] [--concurrency <n>]",
  "         reads the genesis and every runtime upgrade of the node's chain; writes the node's answers as JSON",
].join("\n");

type Command = "record" | "check" | "range" | "boundaries";

/** Each command's options: the required ones, then the others. */
const OPTIONS: Readonly<Record<Command, { readonly required: readonly string[]; readonly optional: readonly string[] }>> = {
  record: { required: ["--node", "--out"], optional: [] },
  check: { required: ["--node", "--out"], optional: [] },
  range: { required: ["--node", "--from", "--to", "--out"], optional: ["--concurrency", "--chunk", "--live-seconds"] },
  boundaries: { required: ["--node", "--out"], optional: ["--step", "--concurrency"] },
};

/** The options whose value is a count (from 0 for `--from`, `--to` and `--live-seconds`, from 1 for the others). */
const COUNTS: Readonly<Record<string, number>> = {
  "--from": 0,
  "--to": 0,
  "--live-seconds": 0,
  "--concurrency": 1,
  "--chunk": 1,
  "--step": 1,
};

interface Arguments {
  readonly command: Command;
  readonly node: string;
  readonly out: string;
  readonly counts: ReadonlyMap<string, number>;
}

/** The arguments of a command, or why they are not. */
function parse(argv: readonly string[]): Arguments | string {
  const [command, ...rest] = argv;
  if (command === undefined || !Object.hasOwn(OPTIONS, command)) {
    return "a command, record, check, range or boundaries, is needed";
  }
  const allowed = OPTIONS[command as Command];
  const options = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    const name = rest[index] as string;
    const value = rest[index + 1];
    if ((!allowed.required.includes(name) && !allowed.optional.includes(name)) || value === undefined) {
      return `unknown or incomplete option ${name}`;
    }
    options.set(name, value);
  }
  const absent = allowed.required.filter((name) => !options.has(name));
  if (absent.length > 0) return `${allowed.required.join(" and ")} are needed`;
  const counts = new Map<string, number>();
  for (const [name, text] of options) {
    if (!Object.hasOwn(COUNTS, name)) continue;
    const value = /^\d+$/.test(text) ? Number(text) : Number.NaN;
    if (!Number.isSafeInteger(value) || value < (COUNTS[name] as number)) {
      return `${name} must be an integer from ${COUNTS[name]}, not ${text}`;
    }
    counts.set(name, value);
  }
  return { command: command as Command, node: options.get("--node") as string, out: options.get("--out") as string, counts };
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
    switch (args.command) {
      case "record":
        return await record(args.node, args.out, io);
      case "check":
        return await check(args.node, args.out, io);
      case "range":
        return await range(args, io);
      default:
        return await boundaries(args, io);
    }
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

/**
 * The version the node reports (`system_version`), asked on a connection of its own, outside any builder: it is no
 * IN-8 call and is not on the tape. Never throws: a node that does not say gives the reason.
 */
export async function reportedVersion(node: string, timeoutMs = 30_000): Promise<{ version: string } | { reason: string }> {
  return new Promise((resolve) => {
    const socket = new WebSocket(node, { perMessageDeflate: false });
    const done = (answer: { version: string } | { reason: string }): void => {
      clearTimeout(timer);
      socket.removeAllListeners("message");
      socket.on("error", () => undefined);
      socket.terminate();
      resolve(answer);
    };
    const timer = setTimeout(() => done({ reason: `no answer within ${timeoutMs} ms` }), timeoutMs);
    socket.on("error", (error) => done({ reason: errorText(error) }));
    socket.on("open", () => socket.send(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "system_version", params: [] })));
    socket.on("message", (data) => {
      const frame = JSON.parse(String(data)) as { result?: unknown; error?: { code?: unknown; message?: unknown } };
      if (typeof frame.result === "string") done({ version: frame.result });
      else done({ reason: `system_version: ${String(frame.error?.code)} ${String(frame.error?.message)}` });
    });
  });
}

function versionLine(reported: { version: string } | { reason: string }): string {
  return "version" in reported
    ? `node version: ${reported.version} (system_version, not on the tape)`
    : `node version: not reported (${reported.reason})`;
}

async function range(args: Arguments, io: TapeCommandIo): Promise<number> {
  const from = args.counts.get("--from") as number;
  const to = args.counts.get("--to") as number;
  io.out(versionLine(await reportedVersion(args.node)));
  const liveSeconds = args.counts.get("--live-seconds");
  const concurrency = args.counts.get("--concurrency");
  const chunk = args.counts.get("--chunk");
  const { records, stats } = await recordRange({
    node: args.node,
    from,
    to,
    log: io.out,
    ...(liveSeconds === undefined ? {} : { liveWindowMs: liveSeconds * 1000 }),
    ...(concurrency === undefined ? {} : { concurrency }),
    ...(chunk === undefined ? {} : { chunkHeights: chunk }),
  });
  const problems = completenessProblems(records, { from, to });
  if (problems.length > 0) {
    io.err(`the recorded tape is not complete, so it was not written: ${problems.slice(0, 20).join("; ")}`);
    return 1;
  }
  const bytes = writeTape(records);
  const id = writeTapeFile(args.out, records);
  io.out(`${id}  ${args.out}`);
  io.out(
    `${records.length} records, ${bytes.length} bytes; ${stats.requests} requests in ${(stats.elapsedMs / 1000).toFixed(1)} s ` +
      `(${stats.requestsPerSecond.toFixed(1)} requests/s, concurrency ${stats.concurrency}); ${stats.chunks} chunks, ` +
      `${stats.retries} recorded again`,
  );
  io.out(
    `runtimes (state spec_version from height): ${stats.runtimes.map((runtime) => `${runtime.height}: ${runtime.specVersion}`).join(", ")}; ` +
      `metadata at ${stats.metadataHeights.join(", ")}`,
  );
  io.out(`complete: every IN-8 call of every height ${from}–${to} is on the tape (Q123)`);
  return 0;
}

async function boundaries(args: Arguments, io: TapeCommandIo): Promise<number> {
  const reported = await reportedVersion(args.node);
  io.out(versionLine(reported));
  const step = args.counts.get("--step");
  const concurrency = args.counts.get("--concurrency");
  const reading = await readBoundaries({
    node: args.node,
    ...(step === undefined ? {} : { step }),
    ...(concurrency === undefined ? {} : { concurrency }),
  });
  const recorded = new Date().toISOString().slice(0, 10);
  const record = {
    description:
      `Answers of the node ${args.node} to the calls below, read by tools/tape/main.ts boundaries on ${recorded} ` +
      "(task 0.3): block 0's hash, header and runtime version; and for each runtime upgrade, the block hashes of " +
      "U - 1, U and F = U + 1, the headers of U and F (whose MNSV digests name the old and the new runtime) and the " +
      "runtime versions at U - 1 and U (the state's runtime before and after the upgrade). The upgrades were found by " +
      "reading state_getRuntimeVersion every step blocks up to the finalized head and bisecting each change.",
    recorded,
    node: args.node,
    nodeVersion: "version" in reported ? reported.version : null,
    genesis: reading.genesis,
    head: reading.head,
    boundaries: reading.boundaries,
    calls: reading.calls,
  };
  writeFileSync(args.out, `${JSON.stringify(record, null, 2)}\n`);
  io.out(`genesis ${reading.genesis.hash} spec_version ${reading.genesis.specVersion}; finalized head ${reading.head.height}`);
  for (const { u, f } of reading.boundaries) {
    io.out(`boundary U ${u.height} ${u.hash} (${u.specVersion}) → F ${f.height} ${f.hash} (${f.specVersion})`);
  }
  io.out(`${reading.calls.length} answers written to ${args.out}`);
  return 0;
}
