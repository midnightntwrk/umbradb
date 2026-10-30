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
 * `[STATIC]`: every refusal and halt code of the design's "Refusals and halts" section has a test that triggers it and
 * checks its code (`./code-registry.ts`'s registry, checked against the test files' text), or is pending with the task
 * that adds it. The pending list only shrinks: no code may be pending that was not pending when the list was made, and
 * a pending code's task may not be checked done in `tasks.md`. The pending codes are reported (the test's annotation
 * and its output). [A87 STATIC, IN-12; design §11]
 */

/** The codes pending when the registry was made: a code added to the design later comes with its test, never pending.
 *  [design §11] */
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
    // Ten backup and restore codes, and `private-binding-mismatch` for a private process's backup. [Q153]
    expect(codes.backup).toHaveLength(11);
    expect(codes.halt.length).toBeGreaterThan(14);
    for (const word of ["refused", "halted", "on-start-db", "on-start-api"]) {
      expect([...codes.refusal, ...codes.backup, ...codes.halt]).not.toContain(word);
    }
    // The codes reasons keep are the registry's lists' codes that are UmbraError codes.
    const known = (list: readonly string[]) => list.filter((code) => (ERROR_CODES as readonly string[]).includes(code)).sort();
    expect([...REFUSAL_CODES].sort()).toEqual(known(codes.refusal));
    expect([...HALT_CODES].sort()).toEqual(known(codes.halt));
  });
});
