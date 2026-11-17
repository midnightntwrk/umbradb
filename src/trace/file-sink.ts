/**
 * The block trace's files (`./trace.ts`): what `umbradb run` writes when its environment sets `UMBRADB_TRACE`. Core.
 *
 * For `UMBRADB_TRACE=<file>`:
 * - `<file>`: one JSON line per committed height;
 * - `<file>.stmts.json`: each statement text's count `n`, client time `ms` and slowest call `max`, written again at
 *   every flush;
 * - `<file>.worker.jsonl`: one JSON line per block the ledger worker applied, with what its thread's time went to
 *   since the line before (`./worker-trace.ts`).
 *
 * The three are opened when the sink is built, so a path that cannot be written is known before anything is traced:
 * the command then refuses to start (`src/cli/command.ts`). A write that fails later stops the trace (`./trace.ts`).
 *
 * Only the command imports this module, so the file API stays out of the browser build.
 */

import { appendFileSync, writeFileSync } from "node:fs";
import type { TraceSink } from "./trace.js";

/** The environment variable of `umbradb run` that names the trace's file; unset or empty, no trace. */
export const TRACE_VARIABLE = "UMBRADB_TRACE";

/**
 * The environment variable of `umbradb run` that, set to `1` beside {@link TRACE_VARIABLE}, adds each step's detail to
 * the trace (`TraceOptions.steps`).
 */
export const TRACE_STEPS_VARIABLE = "UMBRADB_TRACE_STEPS";

/**
 * The sink that writes a trace to `file` and the two files beside it (see the module comment). It opens the three
 * first, creating each that does not exist and adding nothing to any, and throws if one cannot be opened for writing
 * (its folder does not exist, no permission).
 */
export function fileTraceSink(file: string): TraceSink {
  const statements = `${file}.stmts.json`;
  const worker = `${file}.worker.jsonl`;
  for (const path of [file, statements, worker]) appendFileSync(path, "");
  return Object.freeze({
    blocks: (text: string) => appendFileSync(file, text),
    statements: (json: string) => writeFileSync(statements, json),
    worker: (text: string) => appendFileSync(worker, text),
  });
}
