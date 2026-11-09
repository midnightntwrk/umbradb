/**
 * Where a worker thread's standard output and standard error go: the ledger worker's (`../ledger/worker/host.ts`) and
 * the admin worker's (`../admin/server.ts`). A thread started with `stdout: true` and `stderr: true` writes nothing to
 * the process's own streams; its two streams are read here, line by line, and each line is handed to the process's log,
 * or dropped when the process has none. So a host program that gives no log sees nothing of the threads on its own
 * standard output and standard error.
 *
 * `umbradb run` keeps today's behaviour instead: its threads inherit the process's streams (`"inherit"`), so what they
 * write reaches the command's stdout and stderr as before.
 */

import type { Readable } from "node:stream";

/**
 * A thread's output: `"inherit"` (the process's own stdout and stderr, as Node.js does by default), or a function each
 * line is given to, named by the thread and the stream it came on.
 */
export type WorkerOutput = "inherit" | ((line: string) => void);

/** The `Worker` options for `output`: the two streams piped to the parent, unless they are inherited. */
export function workerStreams(output: WorkerOutput): { readonly stdout: boolean; readonly stderr: boolean } {
  const piped = output !== "inherit";
  return { stdout: piped, stderr: piped };
}

/** What a started thread offers to read: Node.js's `Worker` (its streams are null when inherited). */
export interface WorkerWithStreams {
  readonly stdout?: Readable | null;
  readonly stderr?: Readable | null;
}

/**
 * Reads `worker`'s two streams to their end when `output` is a function, handing it each line as
 * `<thread> (<stream>): <line>`; a last line without its newline is handed over at the stream's end. Does nothing for
 * `"inherit"`, or for a thread without streams (the browser's Web Worker). Never throws: a stream's error ends its
 * reading.
 */
export function drainWorkerOutput(worker: WorkerWithStreams, thread: string, output: WorkerOutput): void {
  if (output === "inherit") return;
  for (const [name, stream] of [
    ["stdout", worker.stdout],
    ["stderr", worker.stderr],
  ] as const) {
    if (stream === undefined || stream === null) continue;
    let rest = "";
    const emit = (line: string): void => {
      try {
        output(`${thread} (${name}): ${line}`);
      } catch {
        // A log that throws loses the line; the thread goes on.
      }
    };
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => {
      const lines = (rest + chunk).split("\n");
      rest = lines.pop() as string;
      for (const line of lines) emit(line);
    });
    stream.on("end", () => {
      if (rest !== "") emit(rest);
      rest = "";
    });
    stream.on("error", () => undefined);
  }
}
