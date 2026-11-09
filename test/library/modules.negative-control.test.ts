import { describe, expect, it, vi } from "vitest";
import { L63_CASES, moduleListProblems, type ModuleListRule } from "./module-list-cases.js";

/**
 * The committed negative controls, through the criterion's own cases and oracle (`./module-list-cases.ts`), with
 * each of `loadModuleList`'s rules (`../../src/config/load.ts`) removed in turn, the others kept — the module replaced
 * here:
 * - **`load-failed` removed**: a module file whose import throws, or that does not exist, reads as one listing no
 *   modules;
 * - **the required export removed**: a module file without a `modules` export reads as no modules, as a configuration
 *   file's does;
 * - **"not an array" removed**: a `modules` export that is no array reads as no modules.
 *
 * The process then starts with no user modules, and the oracle fails on exactly the cases of the removed rule; with
 * every rule kept it passes on all of them.
 */

const control = vi.hoisted(() => ({ removed: null as string | null }));

vi.mock("../../src/config/load.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/config/load.js")>();
  return {
    ...actual,
    // `loadModuleList` with the rule `control.removed` taken out: what that rule refuses reads as a module file of no
    // modules, the other rules' refusals kept. The module file is imported once, by the real function.
    loadModuleList: async (url: URL): Promise<readonly unknown[]> => {
      try {
        return await actual.loadModuleList(url);
      } catch (error) {
        const details = (error as { readonly details?: { readonly reason?: unknown; readonly found?: unknown } }).details;
        const rule =
          details?.reason === "load-failed"
            ? "load-failed"
            : details?.reason === "modules-not-a-list"
              ? details.found === "none"
                ? "required-export"
                : "not-a-list"
              : null;
        if (rule !== null && rule === control.removed) return [];
        throw error;
      }
    },
  };
});

describe("negative controls: each of loadModuleList's rules removed fails the oracle on its own cases", () => {
  it.each(["load-failed", "required-export", "not-a-list"] as const)("without %s", async (removed: ModuleListRule) => {
    control.removed = removed;
    const found: Record<string, string[]> = {};
    try {
      for (const [name, reason] of L63_CASES) found[name] = await moduleListProblems(name, reason);
    } finally {
      control.removed = null;
    }
    for (const [name, , rule] of L63_CASES) {
      if (rule === removed) expect(found[name], name).toEqual(["started resolved"]);
      else expect(found[name], name).toEqual([]);
    }
  }, 120_000);

  it("with every rule kept, every case passes the oracle", async () => {
    for (const [name, reason] of L63_CASES) expect(await moduleListProblems(name, reason), name).toEqual([]);
  }, 120_000);
});
