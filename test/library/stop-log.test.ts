import { describe, expect, it } from "vitest";
import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { cursorReaches, libraryData, PGLITE_MEMORY, rowsModule } from "./library-fixtures.js";

/**
 * A library process's stop is in its host's `log` as in the command's (issue 00072): the engine logs both lines, so a
 * host gets them for its `stop()` and for its `signal`, which they name with the abort reason's text. PGlite in memory,
 * a host's in-memory chain at head 3; the command's own cases, on both backends, are `test/cli/run-stop-log.test.ts`.
 * [RN-13, LM-2, LM-9]
 */

/** The stop's lines of a log, in order. */
const stopLines = (lines: readonly string[]): string[] =>
  lines.filter((line) => /^(stopping|processing stopped|startup stopped) \(/.test(line));

describe("issue 00072: a host's log gets the stop's lines (RN-13, LM-2)", () => {
  it("stop() at the head: named stop(), nothing in progress, then the last height the process saw committed", async () => {
    const lines: string[] = [];
    const m = rowsModule("logged");
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 3n }),
      log: (line) => lines.push(line),
    });
    try {
      await handle.started;
      await cursorReaches(handle, 3n);
    } finally {
      await handle.stop();
    }
    expect(stopLines(lines)).toEqual([
      "stopping (stop()): no height in progress, and no new height starts",
      "processing stopped (stop()): the last height this process saw committed is 3; a restart resumes after the stored cursor",
    ]);
  }, 60_000);

  it("stop() before startup read the cursor: the stop during startup, then that the process had not read it", async () => {
    const lines: string[] = [];
    const m = rowsModule("early");
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 3n }),
      log: (line) => lines.push(line),
    });
    // Called at once, before startup opened the database: nothing of the cursor is known.
    await handle.stop();
    await expect(handle.started).rejects.toMatchObject({ name: "AbortError" });
    expect(stopLines(lines)).toEqual([
      "stopping (stop()): during startup, which ends before its next step",
      "startup stopped (stop()): this process had not read the cursor; a restart resumes after the stored cursor, if any",
    ]);
  }, 60_000);

  it("the host's signal aborted with its own reason: the lines name the reason's text", async () => {
    const lines: string[] = [];
    const m = rowsModule("signalled");
    const controller = new AbortController();
    const handle = startUmbraDB({
      config: { data: libraryData(PGLITE_MEMORY, [m]) },
      modules: [m],
      source: new InMemoryBlockSource({ head: 3n }),
      signal: controller.signal,
      log: (line) => lines.push(line),
    });
    await handle.started;
    await cursorReaches(handle, 3n);
    controller.abort(new Error("the host is deploying"));
    await handle.closed;
    expect(stopLines(lines)).toEqual([
      "stopping (signal: the host is deploying): no height in progress, and no new height starts",
      "processing stopped (signal: the host is deploying): the last height this process saw committed is 3; a restart resumes after the stored cursor",
    ]);
  }, 60_000);
});
