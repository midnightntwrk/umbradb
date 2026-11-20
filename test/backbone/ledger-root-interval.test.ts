import { afterAll, beforeAll, describe, expect } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { processBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { committed, halted, type Ingest, ingest } from "./ingest-harness.js";
import { cappedAt, devnetSettings, hashAt, LEDGER_CORE, restartAt } from "./ledger-restart.js";

/**
 * The ledger root interval (the node call budget's Story 2, FR-004–FR-010) through the real process, on PGlite, over
 * the recorded devnet tape (`devnet-v8-v9-0-235`: runtime 1_000_000 on ledger v8 until U = 102 enacts 2_001_000; F =
 * 103 is the first v9 block, converted), skipped by name without the tape. `core-ledger-state` asks the node's root
 * (`midnight_ledgerStateRoot`) only at the heights `src/backbone/core-ledger-state/root-checks.ts` selects:
 * - interval 10 over 0–35: exactly 0, 10, 20 and 30 (block 0 is also the run's first height), and no root prefetched
 *   for another height (every root asked is in the tape node's log);
 * - interval 1: every height, as before the setting (SC-002);
 * - interval 50 over 0–120: 0, 50, 100 and F = 103 (the ledger and runtime change), not U;
 * - a restart at 25 with interval 10: the restart's first height, 26, then 30.
 * And the negative controls (SC-003), by changing the tape's roots: a wrong root at a checked height halts there with
 * `root-mismatch` naming the last matched height; one only at an unchecked height is not seen; a replay that differs
 * from the node from height d on is reported at the next checked height, with d to that height − 1 committed.
 */

const TAPE = "devnet-v8-v9-0-235";
const REPLAY_MS = 300_000;
const backend = processBackend("pglite");

beforeAll(() => backend.start(), 180_000);
afterAll(() => backend.stop(), 60_000);

type Call = Extract<TapeRecord, { readonly method: string; readonly result: unknown }>;
const isRoot = (record: TapeRecord): record is Call =>
  "method" in record && record.method === "midnight_ledgerStateRoot" && "result" in record;

/** The heights whose roots `run` asked for, ascending, each once (by the tape's hashes up to `last`). */
function rootHeights(run: Ingest, records: readonly TapeRecord[], last: bigint): bigint[] {
  const heightOf = new Map<string, bigint>();
  for (let h = 0n; h <= last; h++) heightOf.set(hashAt(records, h), h);
  const asked = run.node.calls
    .filter((call) => call.method === "midnight_ledgerStateRoot")
    .map((call) => heightOf.get((call.params as string[])[0] as string) ?? -1n);
  return [...new Set(asked)].sort((a, b) => (a < b ? -1 : 1));
}

/** The tape's records with the node's root replaced (a byte flipped) at each height `wrong` selects. */
function wrongRoots(records: readonly TapeRecord[], last: bigint, wrong: (height: bigint) => boolean): TapeRecord[] {
  const flip = new Set<string>();
  for (let h = 0n; h <= last; h++) if (wrong(h)) flip.add(hashAt(records, h));
  return records.map((record) => {
    if (!isRoot(record) || !flip.has((record.params as string[])[0] as string)) return record;
    const result = record.result as string | number[];
    const changed = typeof result === "string" ? `${result.slice(0, -2)}${result.endsWith("00") ? "01" : "00"}` : [...result.slice(0, -1), (result.at(-1)! + 1) % 256];
    return { ...record, result: changed } as TapeRecord;
  });
}

/** The `root-mismatch` `run` halted with: its loop failure's cause chain, down to the `UmbraError`; undefined without. */
function rootMismatchOf(run: Ingest): UmbraError | undefined {
  const ended = run.handle.status().ended;
  let error: unknown = ended?.kind === "failed" ? ended.error : undefined;
  while (error instanceof Error) {
    if (error instanceof UmbraError && error.code === "root-mismatch") return error;
    error = error.cause;
  }
  return undefined;
}

/** Syncs the tape from genesis to `stop` with `ledgerRootInterval: interval`; resolves with the run, closed. */
async function sync(found: FoundTape, records: readonly TapeRecord[], stop: bigint, interval: number, waitFor: "commit" | "halt" = "commit") {
  const db = await backend.database();
  const run = await ingest(db, cappedAt(records, stop), {
    start: 0n,
    stop,
    core: LEDGER_CORE,
    settings: { ...devnetSettings(found), ledgerRootInterval: interval },
  });
  try {
    if (waitFor === "commit") await committed(run, stop, REPLAY_MS);
    else await halted(run);
  } finally {
    await run.close();
  }
  return { run, db };
}

describe("the ledger root interval on the recorded devnet", () => {
  tapeTest(
    TAPE,
    "interval 10 over 0–35 asks the node's root at 0, 10, 20 and 30 only; interval 1 asks every height",
    async (found) => {
      const records = found.read().records;
      const { run } = await sync(found, records, 35n, 10);
      expect(rootHeights(run, records, 35n)).toEqual([0n, 10n, 20n, 30n]);
      expect(run.node.calls.filter((call) => call.method === "midnight_ledgerStateRoot")).toHaveLength(4);
      // The replay's own root is still stored at every height.
      const { run: every, db } = await sync(found, records, 35n, 1);
      expect(rootHeights(every, records, 35n)).toEqual(Array.from({ length: 36 }, (_, h) => BigInt(h)));
      const [states] = await db.query("SELECT count(*)::int AS n FROM core_ledger_state.states");
      expect(states?.n).toBe(36);
    },
    { timeoutMs: 2 * REPLAY_MS },
  );

  tapeTest(
    TAPE,
    "interval 50 over 0–120 also checks F (103), the first block of the new ledger and runtime, not U (102)",
    async (found) => {
      const records = found.read().records;
      const { run } = await sync(found, records, 120n, 50);
      expect(rootHeights(run, records, 120n)).toEqual([0n, 50n, 100n, 103n]);
    },
    { timeoutMs: REPLAY_MS },
  );

  tapeTest(
    TAPE,
    "a process restarted at 25 checks its first height, 26, then the multiples of the interval",
    async (found) => {
      const records = found.read().records;
      const db = await backend.database();
      const settings = { ...devnetSettings(found), ledgerRootInterval: 10 };
      const first = await ingest(db, cappedAt(records, 25n), { start: 0n, core: LEDGER_CORE, settings });
      try {
        await committed(first, 25n, REPLAY_MS);
      } finally {
        await first.close();
      }
      expect(rootHeights(first, records, 25n)).toEqual([0n, 10n, 20n]);
      const second = await ingest(db, cappedAt(restartAt(records, 25n), 35n), { start: 0n, stop: 35n, core: LEDGER_CORE, settings });
      try {
        await committed(second, 35n, REPLAY_MS);
      } finally {
        await second.close();
      }
      expect(rootHeights(second, records, 35n)).toEqual([26n, 30n]);
    },
    { timeoutMs: 2 * REPLAY_MS },
  );

  tapeTest(
    TAPE,
    "[NEG] a wrong root at a checked height halts there before it commits, naming the last matched height",
    async (found) => {
      const records = wrongRoots(found.read().records, 35n, (h) => h === 20n);
      const { run, db } = await sync(found, records, 35n, 10, "halt");
      expect(run.handle.status().reason).toMatchObject({ code: "root-mismatch", height: 20n });
      const mismatch = rootMismatchOf(run);
      expect(mismatch?.details).toMatchObject({ height: 20n, lastMatchedHeight: 10n });
      expect(mismatch?.message).toMatch(/the last height whose root matched the node's is 10, so restore a backup at or below it/);
      const [cursor] = await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks");
      expect(cursor?.h).toBe(19);
    },
    { timeoutMs: REPLAY_MS },
  );

  tapeTest(
    TAPE,
    "[NEG] a wrong root only at an unchecked height is not seen; a replay that differs from 15 on halts at 20",
    async (found) => {
      // Only 15's root wrong: never asked with interval 10, so the run reaches 35.
      const once = wrongRoots(found.read().records, 35n, (h) => h === 15n);
      const { run } = await sync(found, once, 35n, 10);
      expect(rootHeights(run, once, 35n)).toEqual([0n, 10n, 20n, 30n]);
      // Every root from 15 on differs, as when the replay diverged at 15: found at 20, with 15–19 committed.
      const diverged = wrongRoots(found.read().records, 35n, (h) => h >= 15n);
      const { run: late, db } = await sync(found, diverged, 35n, 10, "halt");
      expect(late.handle.status().reason).toMatchObject({ code: "root-mismatch", height: 20n });
      expect(rootMismatchOf(late)?.details).toMatchObject({ height: 20n, lastMatchedHeight: 10n });
      const [cursor] = await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks");
      expect(cursor?.h).toBe(19);
      // With interval 1 the same divergence halts at 15, as before the setting.
      const { run: every } = await sync(found, diverged, 35n, 1, "halt");
      expect(every.handle.status().reason).toMatchObject({ code: "root-mismatch", height: 15n });
      expect(rootMismatchOf(every)?.details).toMatchObject({ height: 15n, lastMatchedHeight: 14n });
    },
    { timeoutMs: 3 * REPLAY_MS },
  );
});
