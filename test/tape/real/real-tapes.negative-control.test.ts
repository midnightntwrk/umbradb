import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  completenessProblems,
  recordRange,
  tapeId,
  type TapeRecord,
  writeTape,
} from "../../../tools/tape/index.js";
import { spawnChild } from "../../child-processes.js";
import { ScriptedNode } from "../scripted-node.js";
import { syntheticChain } from "../synthetic-chain.js";
import { findTape, MANIFEST, type RealTape, TAPES_ENV, TapeRefusedError, tapeTest } from "./real-tapes.js";

/**
 * The negative controls of the real-tape checks, each seen to fire: [Q123, Q130]
 *
 * - **An absent tape is skipped, never passed** — as Vitest reports it: a Vitest of its own runs
 *   `skip-probe.fixture.ts` (one `tapeTest` per tape of a probe manifest) and its JSON report and its verbose output
 *   show the absent tape's test as skipped with the tape's name, the matching tape's as passed, and the tape with one
 *   byte changed as failed (refused by its SHA-256, not skipped).
 * - **A tape with one height's call removed fails the completeness check:** a tape the recording driver recorded from a
 *   synthetic chain passes it, and the same tape without one call of one height is reported for that height and call.
 * - With the recorded tapes present (`UMBRADB_TAPES`), the same two controls on each of them.
 */

const REPOSITORY = fileURLToPath(new URL("../../..", import.meta.url));
const VITEST_CLI = join(REPOSITORY, "node_modules/vitest/vitest.mjs");
const FIXTURE_CONFIG = fileURLToPath(new URL("./vitest.fixture.config.mjs", import.meta.url));

/** A test of the Jest-style JSON report Vitest writes. */
interface ReportedTest {
  readonly title: string;
  readonly status: string;
  readonly failureMessages: readonly string[];
  readonly meta: Record<string, unknown>;
}

const RECORDS: readonly TapeRecord[] = [{ method: "chain_getBlockHash", params: [0], result: `0x${"ab".repeat(32)}` }];
const BYTES = writeTape(RECORDS);

function probeEntry(name: string): RealTape {
  return {
    name,
    file: `${name}.tape.jsonl`,
    network: "custom",
    from: 0,
    to: 0,
    sha256: tapeId(BYTES),
    bytes: BYTES.length,
    records: 1,
    source: { endpoint: "ws://127.0.0.1:10001", nodeVersion: "0.0.0-probe", recorded: "2026-10-26" },
    bounds: "a probe of the skip",
  };
}

describe("an absent tape is skipped with its name, never passed; a changed one fails (as Vitest reports them)", () => {
  it(
    "reports the absent tape's test skipped naming the tape, the matching one passed and the changed one failed",
    async () => {
      const directory = mkdtempSync(join(tmpdir(), "umbradb-skip-probe-"));
      try {
        const tapes = join(directory, "tapes");
        const manifestPath = join(directory, "manifest.json");
        const report = join(directory, "report.json");
        const absent = probeEntry("probe-absent");
        const present = { ...probeEntry("probe-present"), sha256: tapeId(BYTES) };
        const changed = probeEntry("probe-changed");
        writeFileSync(
          manifestPath,
          JSON.stringify({ format: "umbradb-real-tapes", version: 1, about: "probe", tapes: [absent, present, changed] }),
        );
        mkdirSync(tapes);
        writeFileSync(join(tapes, present.file), BYTES);
        const altered = Uint8Array.from(BYTES);
        altered[3] = (altered[3] as number) ^ 0x20;
        writeFileSync(join(tapes, changed.file), altered);
        const env: NodeJS.ProcessEnv = {};
        for (const [key, value] of Object.entries(process.env)) {
          if (!key.startsWith("VITEST") && key !== TAPES_ENV && key !== "NODE_V8_COVERAGE") env[key] = value;
        }
        const run = spawnChild(
          process.execPath,
          [
            VITEST_CLI,
            "run",
            "--config",
            FIXTURE_CONFIG,
            "--root",
            REPOSITORY,
            "--reporter=verbose",
            "--reporter=json",
            `--outputFile.json=${report}`,
          ],
          {
            cwd: REPOSITORY,
            env: { ...env, [TAPES_ENV]: tapes, UMBRADB_PROBE_MANIFEST: manifestPath, NO_COLOR: "1" },
            stdio: ["ignore", "pipe", "pipe"],
          },
        );
        let output = "";
        run.stdout!.on("data", (chunk: Buffer) => (output += chunk.toString()));
        run.stderr!.on("data", (chunk: Buffer) => (output += chunk.toString()));
        const code = await new Promise<number | null>((resolve) => run.once("close", (exit) => resolve(exit)));
        // The changed tape's test failed, so the run fails.
        expect(code, output).toBe(1);
        const results = JSON.parse(readFileSync(report, "utf8")) as { testResults: { assertionResults: ReportedTest[] }[] };
        const tests = results.testResults.flatMap((file) => file.assertionResults);
        expect(tests.map(({ title, status }) => ({ title, status }))).toEqual([
          { title: "reads probe-absent", status: "skipped" },
          { title: "reads probe-present", status: "passed" },
          { title: "reads probe-changed", status: "failed" },
        ]);
        const reason = `tape probe-absent (sha256 ${tapeId(BYTES).slice(0, 12)}…) is absent: ${join(tapes, absent.file)} does not exist`;
        // The reason is the test's skip note, which the verbose reporter prints after the skipped test (`↓`), and its
        // meta in the JSON report.
        const line = output.split("\n").find((text) => text.includes("↓") && text.includes("> reads probe-absent"));
        expect(line, output).toBeDefined();
        expect(line?.trimEnd().endsWith(`[${reason}]`), line).toBe(true);
        expect(output.split("\n").some((text) => text.includes("↓") && text.includes("probe-present"))).toBe(false);
        expect(tests[0]!.meta).toEqual({ realTape: { name: "probe-absent", skipped: reason } });
        expect(tests[2]!.failureMessages.join("\n")).toContain(
          `tape probe-changed at ${join(tapes, changed.file)} is refused: its SHA-256 is ${tapeId(altered)}`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
    180_000,
  );
});

describe("a tape with one height's call removed fails the completeness check", () => {
  let node: ScriptedNode;
  let records: readonly TapeRecord[] = [];
  beforeAll(async () => {
    const chain = syntheticChain({ length: 40, upgrades: [{ height: 17, specVersion: 1_000_300 }], registrations: 3 });
    node = await ScriptedNode.start(chain.script);
    ({ records } = await recordRange({ node: node.url, from: 0, to: 30, chunkHeights: 8, liveWindowMs: 50, concurrency: 4 }));
  });
  afterAll(async () => {
    await node.stop();
  });

  it("passes the recorded tape, and fails it without one height's chain_getBlock, naming the height and the call", () => {
    expect(completenessProblems(records, { from: 0, to: 30 })).toEqual([]);
    const index = records.findIndex((record) => "method" in record && record.method === "chain_getBlockHash" && (record.params as number[])[0] === 7);
    const hash = (records[index] as { result: string }).result;
    const without = records.filter(
      (record) => !("method" in record && record.method === "chain_getBlock" && (record.params as string[])[0] === hash),
    );
    expect(without).toHaveLength(records.length - 1);
    expect(completenessProblems(without, { from: 0, to: 30 })).toEqual([
      `height 7: no chain_getBlock ["${hash}"]`,
    ]);
  });
});

describe.runIf(MANIFEST.tapes.length > 0)("with the recorded tapes (UMBRADB_TAPES): the same controls on each", () => {
  for (const tape of MANIFEST.tapes) {
    tapeTest(
      tape.name,
      `${tape.name}: one byte changed is refused by its SHA-256; one height's call removed fails the completeness check`,
      (found) => {
        const directory = mkdtempSync(join(tmpdir(), "umbradb-real-control-"));
        try {
          const altered = Uint8Array.from(found.bytes);
          const middle = Math.floor(altered.length / 2);
          altered[middle] = (altered[middle] as number) ^ 0x01;
          writeFileSync(join(directory, tape.file), altered);
          expect(() => findTape(tape, { directory })).toThrow(TapeRefusedError);
        } finally {
          rmSync(directory, { recursive: true, force: true });
        }
        const records = found.read().records;
        const height = Math.floor((tape.from + tape.to) / 2);
        const index = records.findIndex(
          (record) => "method" in record && record.method === "chain_getBlockHash" && (record.params as number[])[0] === height,
        );
        expect(index).toBeGreaterThanOrEqual(0);
        const without = records.filter((_, at) => at !== index);
        expect(completenessProblems(without, tape)).toContain(`height ${height}: no chain_getBlockHash [${height}]`);
      },
      { timeoutMs: 600_000 },
    );
  }
});
