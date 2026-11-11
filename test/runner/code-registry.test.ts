import { describe, expect, it } from "vitest";
import { ERROR_CODES } from "../../src/db/errors.js";
import { POINTS } from "../../src/modules/declaration.js";
import { HALT_CODES, REFUSAL_CODES } from "../../src/runner/failures.js";
import { readRepositoryFile, REFUSALS_AND_HALTS, REGISTRY, registryProblems } from "./code-registry.js";

/**
 * `[STATIC]`: every refusal and halt code ({@link REFUSALS_AND_HALTS}) has a test that triggers it and checks its code
 * (`./code-registry.ts`'s registry, checked against the test files' text). A code added to the lists comes with its
 * test.
 */

describe("the refusal and halt registry", () => {
  it("every refusal and halt code has a test that triggers it and checks its code", () => {
    const problems = registryProblems({ codes: REFUSALS_AND_HALTS, registry: REGISTRY, read: readRepositoryFile });
    expect(problems).toEqual([]);
    console.info(`refusal and halt registry: ${Object.keys(REGISTRY).length} codes with their tests`);
  });

  it("the lists hold no states or points, and their UmbraError codes are exactly the runner's", () => {
    const { refusal, backup, halt } = REFUSALS_AND_HALTS;
    expect(refusal).toHaveLength(52);
    // Ten backup and restore codes, and `private-binding-mismatch` for a private process's backup.
    expect(backup).toHaveLength(11);
    expect(halt).toHaveLength(19);
    for (const list of [refusal, backup, halt]) expect(new Set(list).size).toBe(list.length);
    for (const word of ["refused", "halted", ...POINTS]) expect([...refusal, ...backup, ...halt]).not.toContain(word);
    // The codes reasons keep are the lists' codes that are UmbraError codes; the one halt code no UmbraError carries is
    // the loop's own cursor check.
    const known = (list: readonly string[]) => list.filter((code) => (ERROR_CODES as readonly string[]).includes(code)).sort();
    expect([...REFUSAL_CODES].sort()).toEqual(known(refusal));
    expect([...HALT_CODES].sort()).toEqual(known(halt));
    expect(halt.filter((code) => !(ERROR_CODES as readonly string[]).includes(code))).toEqual(["unexpected-cursor"]);
  });
});
