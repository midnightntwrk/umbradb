import { describe, expect } from "vitest";
import { type ConnectSocket, connectWebSocket } from "../../../src/node/index.js";
import { completenessProblems, replayTape, tapeId } from "../../../tools/tape/index.js";
import { MANIFEST, tapeTest } from "./real-tapes.js";

/**
 * Task 0.3's acceptance over every recorded tape of the manifest (owner decisions Q123, Q130), each test skipped with
 * the tape's name when `UMBRADB_TAPES` does not hold the tape (`./real-tapes.ts`):
 *
 * - **its SHA-256 matches** the manifest's (the lookup refuses it otherwise), and it holds the manifest's count of
 *   records, every line one of TT-1's;
 * - **it replays against the tape node:** the node client sends every recorded call as recorded and receives each
 *   recorded answer, then both head subscriptions receive every recorded notification, and the tape node answered every
 *   request from its record (`tools/tape/replay-tape.ts`);
 * - **every IN-8 call of every height of its range is on it** (`tools/tape/completeness.ts`).
 */

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

/**
 * A whole tape's replay: up to 60,000 calls through one connection took 0.5–5.3 s on this machine (2026-10-26); the
 * budget allows a heavily loaded one.
 */
const REPLAY_TIMEOUT_MS = 600_000;

describe.runIf(MANIFEST.tapes.length > 0)("the recorded tapes (UMBRADB_TAPES)", () => {
  for (const tape of MANIFEST.tapes) {
    tapeTest(
      tape.name,
      `${tape.name}: its SHA-256 matches, and it replays against the tape node`,
      async (found) => {
        expect(tapeId(found.bytes)).toBe(tape.sha256);
        const { records } = found.read();
        expect(records).toHaveLength(tape.records);
        const replay = await replayTape({ records, connect: quietConnect });
        expect(replay.differences).toEqual([]);
        expect(replay.subscriptions).toBe(2);
        expect(replay.notifications).toBe(records.filter((record) => "notify" in record).length);
      },
      { timeoutMs: REPLAY_TIMEOUT_MS },
    );
    tapeTest(
      tape.name,
      `${tape.name}: every IN-8 call of every height ${tape.from}–${tape.to} is on it`,
      (found) => {
        expect(completenessProblems(found.read().records, tape)).toEqual([]);
      },
      { timeoutMs: 300_000 },
    );
  }
});
