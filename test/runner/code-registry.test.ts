import { describe, expect, it } from "vitest";
import { ERROR_CODES } from "../../src/db/errors.js";
import { HALT_CODES, REFUSAL_CODES } from "../../src/runner/failures.js";
import {
  PENDING,
  readRepositoryFile,
  REGISTRY,
  registryProblems,
  section11Codes,
  tasksDone,
} from "./code-registry.js";

/**
 * A87 `[STATIC]` (IN-12; task 10.4): every refusal and halt code of `design.md` §11 has a test that triggers it and
 * checks its code (`./code-registry.ts`'s registry, checked against the test files' text), or is pending with the task
 * that adds it — a list that only shrinks: no code may be pending that was not pending when task 10.4 made the list,
 * and a pending code's task may not be checked done in `tasks.md`. The pending codes are reported (the test's
 * annotation and its output).
 */

/** The codes pending when task 10.4 made the registry: a later code of §11 comes with its test, never pending. */
const PENDING_AT_10_4 = Object.freeze([
  "refusal:needs-lockstep-not-listed",
  "backup:backup-tools-missing",
  "backup:private-backup-refused",
  "backup:backup-format-unknown",
  "backup:restore-target-not-empty",
  "backup:backup-history-mismatch",
  "backup:backup-build-mismatch",
  "backup:backup-genesis-mismatch",
  "backup:backup-block-not-finalized",
  "backup:contents-hash-mismatch",
  "backup:backup-root-mismatch",
  "halt:root-mismatch",
  "halt:fast-log-unsupported",
  "halt:lockstep-behind",
  "halt:report-hash-mismatch",
]);

const DESIGN = readRepositoryFile("openspec/changes/core-arch/design.md") as string;
const TASKS = readRepositoryFile("openspec/changes/core-arch/tasks.md") as string;

describe("A87: the refusal and halt registry (IN-12)", () => {
  it("every refusal and halt code of design §11 has a test that triggers it and checks its code, or is pending with its task", async ({ annotate }) => {
    const codes = section11Codes(DESIGN);
    const problems = registryProblems({
      codes,
      registry: REGISTRY,
      pending: PENDING,
      baseline: PENDING_AT_10_4,
      tasks: tasksDone(TASKS),
      read: readRepositoryFile,
    });
    expect(problems).toEqual([]);
    const pending = Object.entries(PENDING).map(([key, task]) => `${key} (task ${task})`);
    const report = `${pending.length} pending: ${pending.join(", ")}`;
    console.info(`A87 registry: ${Object.keys(REGISTRY).length} codes with their tests; ${report}`);
    await annotate(report);
  });

  it("reads §11's three lists whole: its states and points are no codes, and every UmbraError code it names is the runner's", () => {
    const codes = section11Codes(DESIGN);
    expect(codes.refusal.length).toBeGreaterThan(40);
    expect(codes.backup).toHaveLength(10);
    expect(codes.halt.length).toBeGreaterThan(14);
    for (const word of ["refused", "halted", "on-start-db", "on-start-api"]) {
      expect([...codes.refusal, ...codes.backup, ...codes.halt]).not.toContain(word);
    }
    // The codes reasons keep (task 5.4) are the registry's lists' codes that are UmbraError codes.
    const known = (list: readonly string[]) => list.filter((code) => (ERROR_CODES as readonly string[]).includes(code)).sort();
    expect([...REFUSAL_CODES].sort()).toEqual(known(codes.refusal));
    expect([...HALT_CODES].sort()).toEqual(known(codes.halt));
  });
});
