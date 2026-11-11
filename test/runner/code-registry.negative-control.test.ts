import { describe, expect, it } from "vitest";
import {
  readRepositoryFile, REFUSALS_AND_HALTS, REGISTRY, type RegistryInput, registryProblems, testsIn,
} from "./code-registry.js";

/**
 * The code registry's negative controls. The registry's check fails on:
 * - a code added to the lists with no test;
 * - a registered code the lists no longer hold;
 * - a test that does not check its code;
 * - a test that is not there.
 */

/** The real registry's input, with `change` applied. */
function input(change: Partial<RegistryInput> = {}): RegistryInput {
  return { codes: REFUSALS_AND_HALTS, registry: REGISTRY, read: readRepositoryFile, ...change };
}

describe("negative controls: the registry's check", () => {
  it("passes the real registry", () => {
    expect(registryProblems(input())).toEqual([]);
  });

  it("fails on a code added to the halts with no test", () => {
    const codes = { ...REFUSALS_AND_HALTS, halt: [...REFUSALS_AND_HALTS.halt, "planted-halt"] };
    expect(registryProblems(input({ codes }))).toEqual(["halt:planted-halt: no test triggers it and checks its code"]);
  });

  it("fails on a code added to the startup refusals, and on a registered code the lists no longer hold", () => {
    const refusal = REFUSALS_AND_HALTS.refusal.map((code) => (code === "genesis-mismatch" ? "planted-refusal" : code));
    expect(registryProblems(input({ codes: { ...REFUSALS_AND_HALTS, refusal } }))).toEqual([
      "refusal:planted-refusal: no test triggers it and checks its code",
      "refusal:genesis-mismatch: no list of refusals and halts has it",
    ]);
  });

  it("fails on a registered test that does not check its code, and on one that is not there", () => {
    const halts = "test/runner/halts.test.ts";
    const registry = {
      ...REGISTRY,
      "halt:writer-lock-lost": [{ file: halts, test: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point" }],
      "halt:truncate-not-allowed": [{ file: halts, test: "a TRUNCATE in on-db-write halts" }],
      "halt:pin-mismatch": [{ file: "test/runner/no-such.test.ts", test: "anything" }],
    };
    // In the registry's order.
    expect(registryProblems(input({ registry }))).toEqual([
      "halt:pin-mismatch: test/runner/no-such.test.ts does not exist",
      `halt:writer-lock-lost: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point" (${halts}) does not check the code writer-lock-lost`,
      `halt:truncate-not-allowed: ${halts} has no test titled "a TRUNCATE in on-db-write halts"`,
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
