import { describe, expect, it } from "vitest";
import {
  PENDING,
  readRepositoryFile,
  REGISTRY,
  type RegistryInput,
  registryProblems,
  section11Codes,
  tasksDone,
  testsIn,
} from "./code-registry.js";

/**
 * A87's negative controls (task 10.4): the registry's check fails on a code planted in §11 with no test, on a test that
 * does not check its code, on a test that is not there, on a pending code that was not pending at task 10.4, and on a
 * pending code whose task is done.
 */

const DESIGN = readRepositoryFile("openspec/changes/core-arch/design.md") as string;
const TASKS = readRepositoryFile("openspec/changes/core-arch/tasks.md") as string;

/** The real registry's input, with `change` applied. */
function input(change: Partial<RegistryInput> = {}): RegistryInput {
  return {
    codes: section11Codes(DESIGN),
    registry: REGISTRY,
    pending: PENDING,
    baseline: Object.keys(PENDING),
    tasks: tasksDone(TASKS),
    read: readRepositoryFile,
    ...change,
  };
}

describe("A87 negative controls: the registry's check", () => {
  it("passes the real registry (the baseline being today's pending list)", () => {
    expect(registryProblems(input())).toEqual([]);
  });

  it("fails on a code planted in design §11's halts with no test", () => {
    const planted = DESIGN.replace("`unexpected-cursor`, ", "`unexpected-cursor`, `planted-halt`, ");
    expect(planted).not.toBe(DESIGN);
    expect(registryProblems(input({ codes: section11Codes(planted) }))).toEqual([
      "halt:planted-halt: no test triggers it and checks its code, and it is not pending",
    ]);
  });

  it("fails on a code planted in the startup refusals, and on a registered code §11 no longer lists", () => {
    const planted = DESIGN.replace("`genesis-mismatch`, `cursor-hash-mismatch`,", "`planted-refusal`, `cursor-hash-mismatch`,");
    expect(planted).not.toBe(DESIGN);
    expect(registryProblems(input({ codes: section11Codes(planted) }))).toEqual([
      "refusal:planted-refusal: no test triggers it and checks its code, and it is not pending",
      "refusal:genesis-mismatch: design §11 does not list it",
    ]);
  });

  it("fails on a registered test that does not check its code, and on one that is not there", () => {
    const halts = "test/runner/halts.test.ts";
    const registry = {
      ...REGISTRY,
      "halt:writer-lock-lost": [{ file: halts, test: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point (DB-14)" }],
      "halt:truncate-not-allowed": [{ file: halts, test: "a TRUNCATE in on-db-write halts" }],
      "halt:pin-mismatch": [{ file: "test/runner/no-such.test.ts", test: "anything" }],
    };
    // In the registry's order.
    expect(registryProblems(input({ registry }))).toEqual([
      "halt:pin-mismatch: test/runner/no-such.test.ts does not exist",
      `halt:writer-lock-lost: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point (DB-14)" (${halts}) does not check the code writer-lock-lost`,
      `halt:truncate-not-allowed: ${halts} has no test titled "a TRUNCATE in on-db-write halts"`,
    ]);
  });

  it("fails on a pending code that was not pending at task 10.4, and on one whose task is checked done", () => {
    // Registered codes made pending, so the control does not change as pending codes get their tests.
    const { "halt:unexpected-cursor": _unexpected, "halt:finality-conflict": _conflict, ...registry } = REGISTRY;
    const pending = { ...PENDING, "halt:unexpected-cursor": "14.3", "halt:finality-conflict": "10.3" };
    // The tasks as a fixed table, so the control does not change as tasks are checked: the pending ones and the
    // control's own 14.3 open, 10.3 done.
    const tasks = new Map([...Object.values(PENDING).map((task) => [task, false] as const), ["14.3", false] as const, ["10.3", true] as const]);
    const baseline = [...Object.keys(PENDING), "halt:finality-conflict"];
    expect(registryProblems(input({ registry, pending, baseline, tasks }))).toEqual([
      "halt:unexpected-cursor: pending, but not among the codes pending at task 10.4: a new code of §11 comes with its test",
      "halt:finality-conflict: pending for task 10.3, which tasks.md checks done: register its test",
    ]);
  });

  it("fails on a code registered and pending both, and on a pending code whose task tasks.md does not have", () => {
    const { "halt:finality-conflict": _conflict, ...registry } = REGISTRY;
    const pending = { ...PENDING, "halt:unexpected-cursor": "14.3", "halt:finality-conflict": "99.9" };
    const tasks = new Map([...Object.values(PENDING).map((task) => [task, false] as const), ["14.3", false] as const]);
    expect(registryProblems(input({ registry, pending, baseline: Object.keys(pending), tasks }))).toEqual([
      "halt:unexpected-cursor: registered with its test and pending both",
      "halt:finality-conflict: pending for task 99.9, which tasks.md does not have",
    ]);
  });

  it("reads a test's code from its body, or a function of its file the body calls; not from elsewhere", () => {
    const text = [
      'const oracle = () => expect(code).toBe("from-callee");',
      'function other() { return "unrelated"; }',
      'it("direct", () => { expect(code).toBe("in-body"); });',
      'it("through " + "a callee", () => { oracle(); });',
      'tapeTest("tape", "on a tape", async () => { expect(1).toBe(1); });',
    ].join("\n");
    const tests = testsIn("x.test.ts", text);
    expect(tests.map((test) => test.title)).toEqual(["direct", "through a callee", "on a tape"]);
    expect(tests[0]?.literals.has("in-body")).toBe(true);
    expect(tests[1]?.literals.has("from-callee")).toBe(true);
    expect(tests[1]?.literals.has("unrelated")).toBe(false);
    expect(tests[2]?.literals.has("unrelated")).toBe(false);
  });
});
