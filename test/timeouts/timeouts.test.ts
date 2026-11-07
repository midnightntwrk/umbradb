import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { spawnChild } from "../child-processes.js";

/**
 * The repository's per-test timeout (`vitest.config.ts`): 60 s instead of Vitest's default 5 s, so that the database
 * suites' tests pass on a loaded machine — and a test that really hangs still fails. The second test is the negative
 * control of the raise: it runs `hang.fixture.ts` under the repository's own configuration in a Vitest of its own and
 * sees a 6 s test pass and a test that never ends fail at 60 s. [A153]
 */

const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const VITEST_CLI = join(REPOSITORY, "node_modules/vitest/vitest.mjs");
const FIXTURE_CONFIG = fileURLToPath(new URL("./vitest.fixture.config.mjs", import.meta.url));
/** Imported by a path the type check does not follow: it does not check `vitest.config.ts`. [docs/issues/00017] */
const CONFIG = join(REPOSITORY, "vitest.config.ts");

/** The repository's per-test timeout. */
const TEST_TIMEOUT_MS = 60_000;

/** A test of the Jest-style JSON report Vitest writes. */
interface ReportedTest {
  readonly title: string;
  readonly status: string;
  readonly duration: number;
}

describe("the per-test timeout (A153)", () => {
  it("is 60 s in the repository's configuration, as is the hook timeout", async () => {
    const repository = (await import(CONFIG)) as { default: { test?: { testTimeout?: number; hookTimeout?: number } } };
    expect(repository.default.test?.testTimeout).toBe(TEST_TIMEOUT_MS);
    expect(repository.default.test?.hookTimeout).toBe(60_000);
  });

  it(
    "lets a test run past Vitest's default 5 s, and still fails a test that never ends, at 60 s",
    async () => {
      const directory = mkdtempSync(join(tmpdir(), "umbradb-timeouts-"));
      try {
        const report = join(directory, "report.json");
        const run = spawnChild(
          process.execPath,
          [
            VITEST_CLI,
            "run",
            "--config",
            FIXTURE_CONFIG,
            "--root",
            REPOSITORY,
            "--reporter=default",
            "--reporter=json",
            `--outputFile.json=${report}`,
          ],
          { cwd: REPOSITORY, stdio: ["ignore", "pipe", "pipe"] },
        );
        let output = "";
        run.stdout!.on("data", (chunk: Buffer) => (output += chunk.toString()));
        run.stderr!.on("data", (chunk: Buffer) => (output += chunk.toString()));
        const code = await new Promise<number | null>((resolve) => run.once("close", (exit) => resolve(exit)));
        expect(code, output).toBe(1);
        // The default reporter names the timeout; the JSON report gives each test's status and duration.
        expect(output).toContain(`Test timed out in ${TEST_TIMEOUT_MS}ms`);
        const results = JSON.parse(readFileSync(report, "utf8")) as { testResults: { assertionResults: ReportedTest[] }[] };
        const tests = results.testResults.flatMap((file) => file.assertionResults);
        expect(tests.map(({ title, status }) => ({ title, status }))).toEqual([
          { title: "takes 6 s, longer than Vitest's default timeout", status: "passed" },
          { title: "never ends", status: "failed" },
        ]);
        // Past the default 5 s, and failed at the repository's 60 s, not before (a clock's millisecond aside).
        expect(tests[0]!.duration).toBeGreaterThan(5_900);
        expect(tests[1]!.duration).toBeGreaterThan(TEST_TIMEOUT_MS - 100);
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    },
    TEST_TIMEOUT_MS * 4,
  );
});
