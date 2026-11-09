import { describe, expect, it, vi } from "vitest";
import { startUmbraDB, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { MALFORMED, optionProblems, UNREADABLE } from "./option-cases.js";

/**
 * The committed negative controls, each through the criterion's own cases and oracle (`./option-cases.ts`), with the
 * fault put back in the facade's own path — `startUmbraDB` with `../../src/library/options.ts` replaced here:
 * - **the option check removed** (`optionFindings` finds nothing): every malformed option of the table reaches the
 *   engine, and the oracle sees no `invalid-option` refusal naming its path in every case — or the call throw, for a
 *   signal that is no `AbortSignal`, which the engine reads;
 * - **the options passed as given** (`readOptions` reads nothing once, the options themselves the values) with the
 *   check removed: the options that cannot be read reach the facade's own reads and the engine's, and the oracle fails
 *   in every case — and its other half, "startUmbraDB throws in none", sees the call throw for the options that are a
 *   hostile or revoked proxy, or no object.
 *
 * With the real module, the same cases and oracle pass (`./start-umbradb.test.ts`).
 */

const control = vi.hoisted(() => ({ unchecked: false, asGiven: false }));

vi.mock("../../src/library/options.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/library/options.js")>();
  return {
    ...actual,
    readOptions: (options: unknown) =>
      control.asGiven ? { values: options, findings: [], readable: true, unread: [] } : actual.readOptions(options),
    optionFindings: (read: Parameters<typeof actual.optionFindings>[0]) => (control.unchecked ? [] : actual.optionFindings(read)),
  };
});

/** Each case's problems under the fault set in {@link control}. */
async function problemsOf(cases: readonly (readonly [string, () => unknown, string])[]): Promise<Record<string, string[]>> {
  const found: Record<string, string[]> = {};
  for (const [name, options, path] of cases) found[name] = await optionProblems(() => startUmbraDB(options() as UmbraDBOptions), path);
  return found;
}

describe("negative controls: the facade's option check removed fails the oracle", () => {
  it("without the option check, every malformed option fails the oracle: no invalid-option refusal names its path, or the call throws", async () => {
    control.unchecked = true;
    control.asGiven = false;
    try {
      const found = await problemsOf(MALFORMED.map(([name, options, path]) => [name, () => options, path] as const));
      for (const [name] of MALFORMED) {
        const problems = found[name] ?? [];
        const failed = problems.some((problem) => problem.includes("not invalid-option at") || problem.startsWith("startUmbraDB threw: "));
        expect(failed, `${name}: ${problems.join("; ")}`).toBe(true);
      }
      // The engine reads the signal it is given: one that is no AbortSignal throws out of the call.
      expect(found["signal not an AbortSignal"]?.[0]).toMatch(/^startUmbraDB threw: TypeError/);
    } finally {
      control.unchecked = false;
    }
  }, 120_000);

  it("reading the options as given, without the check, fails the oracle in every case; the hostile options throw out of the call", async () => {
    control.unchecked = true;
    control.asGiven = true;
    try {
      const found = await problemsOf(UNREADABLE);
      for (const [name] of UNREADABLE) expect(found[name] ?? [], name).not.toEqual([]);
      // The oracle's "startUmbraDB throws in none" half sees the throw.
      for (const name of ["the options a revoked proxy", "the options a hostile proxy"]) {
        expect(found[name]?.[0], name).toMatch(/^startUmbraDB threw: /);
      }
      const none = await problemsOf([["options that are no object", () => null, "options"]]);
      expect(none["options that are no object"]?.[0]).toMatch(/^startUmbraDB threw: TypeError/);
    } finally {
      control.unchecked = false;
      control.asGiven = false;
    }
  }, 120_000);

  it("with the real option check, the same cases pass the oracle", async () => {
    const found = await problemsOf([...MALFORMED.map(([name, options, path]) => [name, () => options, path] as const), ...UNREADABLE]);
    expect(Object.values(found).flat()).toEqual([]);
  }, 120_000);
});
