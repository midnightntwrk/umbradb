import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { startUmbraDB, type UmbraDBHandle } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { cursorReaches, libraryData, rowsModule } from "./library-fixtures.js";

/**
 * One host, one PGlite directory, two handles. The directory's writer lock is the process's own operating-system
 * lock (`src/db/pglite-lock.ts`): a second `startUmbraDB` on the directory while a first handle has it open is refused
 * `writer-lock-held` — `started` rejects with that code and the second process stays `refused` until its `stop()`, as
 * every refusal after the configuration step does —, the first handle keeps committing heights, and once the first
 * handle's `closed` resolved a new handle in the same host opens the directory and continues from its cursor.
 */

/** A handle's process and what it saw: the in-memory chain it follows, the heights its user module wrote. */
interface Opened {
  readonly handle: UmbraDBHandle;
  readonly source: InMemoryBlockSource;
  readonly seen: string[];
}

/** A handle on the PGlite directory `dir`, over an in-memory chain whose head is `head`. */
function open(dir: string, head: bigint): Opened {
  const seen: string[] = [];
  const module = rowsModule("lock-rows", seen);
  const source = new InMemoryBlockSource({ head });
  const database = { kind: "pglite", path: dir } as DatabaseParts;
  const handle = startUmbraDB({ config: { data: libraryData(database, [module]) }, modules: [module], source });
  return { handle, source, seen };
}

describe("one host, one PGlite directory", () => {
  let tmp: string;
  const handles: UmbraDBHandle[] = [];

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "umbradb-l60-"));
  });

  afterEach(async () => {
    for (const handle of handles.splice(0)) {
      await handle.stop();
      await handle.closed;
    }
    rmSync(tmp, { recursive: true, force: true });
  });

  it("a second handle refuses writer-lock-held while the first is open, and a new one opens after the first's closed", async () => {
    const dir = join(tmp, "db");
    const first = open(dir, 5n);
    handles.push(first.handle);
    await first.handle.started;
    await cursorReaches(first.handle, 5n);

    const second = open(dir, 5n);
    handles.push(second.handle);
    await expect(second.handle.started).rejects.toMatchObject({ code: "writer-lock-held" });
    expect(second.handle.status()).toMatchObject({ state: "refused", reason: { code: "writer-lock-held" } });

    // The refused handle took nothing from the first: its lock and its database stay, and it goes on committing.
    first.source.finalize(7n);
    await cursorReaches(first.handle, 7n);
    expect(first.handle.status().state).toMatch(/^(syncing|following)$/);

    await second.handle.stop();
    await second.handle.closed;
    // While the first is open, a third attempt is refused too: the second's stop released nothing of the first's.
    const third = open(dir, 7n);
    handles.push(third.handle);
    await expect(third.handle.started).rejects.toMatchObject({ code: "writer-lock-held" });
    await third.handle.stop();
    await third.handle.closed;

    await first.handle.stop();
    await first.handle.closed;
    handles.splice(0);

    // After the first handle's closed, a new handle in this host opens the directory and continues from cursor 7.
    const next = open(dir, 9n);
    handles.push(next.handle);
    await expect(next.handle.started).resolves.toMatchObject({ side: "public", start: 1n });
    await cursorReaches(next.handle, 9n);
    expect(first.seen).toEqual(["1", "2", "3", "4", "5", "6", "7"].map((h) => `lock-rows ${h}`));
    expect(second.seen).toEqual([]);
    expect(next.seen).toEqual(["lock-rows 8", "lock-rows 9"]);
  }, 120_000);
});
