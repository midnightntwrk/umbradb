import { describe, expect, it } from "vitest";
import { type EmitWarning, isSqliteWarning, quietImport, type WarningHook } from "../../src/db/pglite-lock.js";
import { runQuietChild } from "../library/quiet-child.js";

/**
 * L3 `[CI][NEG]`: the `node:sqlite` `ExperimentalWarning` is dropped through one shared import (`quietImport` in
 * `src/db/pglite-lock.ts`), and nothing else is touched [LM-2, G2]:
 * - another `ExperimentalWarning` emitted while the wrapper is installed reaches the host's listeners;
 * - a host that replaced `process.emitWarning` meanwhile keeps its replacement;
 * - two overlapping PGlite directory acquisitions, finishing in either order, share one import and leave the original
 *   `process.emitWarning` installed — in a process of their own, whose stderr stays empty;
 * - the negative control imports `node:sqlite` through the same wrapper with nothing dropped: its warning reaches the
 *   listener and stderr.
 *
 * The wrapper's rules are checked with a load the test settles itself and a hook of its own (no `process`); the real
 * import in child processes, since `node:sqlite` warns once per process.
 */

/** A load the test settles. */
function deferred<T>() {
  let settle!: { resolve: (value: T) => void; reject: (error: unknown) => void };
  const promise = new Promise<T>((resolve, reject) => {
    settle = { resolve, reject };
  });
  return { promise, ...settle };
}

/** A hook over an emitter of the test's own, which records what reaches it. */
function testHook() {
  const reached: unknown[][] = [];
  const original = (...args: unknown[]): void => {
    reached.push(args);
  };
  let current: (...args: unknown[]) => void = original;
  const hook: WarningHook = {
    get: () => current as EmitWarning,
    set: (emit) => {
      current = emit as (...args: unknown[]) => void;
    },
  };
  return { hook, reached, original, emit: (...args: unknown[]) => current(...args), current: () => current };
}

const SQLITE = ["SQLite is an experimental feature and might change at any time", "ExperimentalWarning", undefined, undefined];

describe("L3: the node:sqlite warning is dropped through one shared import (G2)", () => {
  it("knows node:sqlite's warning, in each form Node.js may emit it, and no other", () => {
    expect(isSqliteWarning(SQLITE)).toBe(true);
    expect(isSqliteWarning([SQLITE[0], { type: "ExperimentalWarning" }])).toBe(true);
    expect(isSqliteWarning([Object.assign(new Error(SQLITE[0] as string), { name: "ExperimentalWarning" })])).toBe(true);
    expect(isSqliteWarning(["Type Stripping is an experimental feature and might change at any time", "ExperimentalWarning"])).toBe(false);
    expect(isSqliteWarning([SQLITE[0], "DeprecationWarning"])).toBe(false);
    expect(isSqliteWarning([])).toBe(false);
  });

  it("drops it while the import runs; another ExperimentalWarning then still reaches the host's emitter; restored after", async () => {
    const test = testHook();
    const load = deferred<string>();
    let loads = 0;
    const shared = quietImport(() => {
      loads += 1;
      return load.promise;
    }, test.hook, isSqliteWarning);
    const imported = shared();
    expect(test.current()).not.toBe(test.original);
    test.emit(...SQLITE);
    test.emit("Another feature is an experimental feature and might change at any time", "ExperimentalWarning");
    load.resolve("module");
    expect(await imported).toBe("module");
    expect(test.current()).toBe(test.original);
    expect(test.reached).toEqual([["Another feature is an experimental feature and might change at any time", "ExperimentalWarning"]]);
    expect(loads).toBe(1);
  });

  it("two overlapping callers share one load; a later caller gets the same module without a second load", async () => {
    const test = testHook();
    const load = deferred<string>();
    let loads = 0;
    const shared = quietImport(() => {
      loads += 1;
      return load.promise;
    }, test.hook, isSqliteWarning);
    const first = shared();
    const second = shared();
    load.resolve("module");
    expect(await Promise.all([second, first])).toEqual(["module", "module"]);
    expect(await shared()).toBe("module");
    expect(loads).toBe(1);
    expect(test.current()).toBe(test.original);
  });

  it("a host that replaced the emitter meanwhile keeps its replacement", async () => {
    const test = testHook();
    const load = deferred<string>();
    const shared = quietImport(() => load.promise, test.hook, isSqliteWarning);
    const imported = shared();
    const replacement = (): void => undefined;
    test.hook.set(replacement);
    load.resolve("module");
    await imported;
    expect(test.current()).toBe(replacement);
  });

  it("a load that rejects restores the emitter and rejects every caller, the next caller loading again", async () => {
    const test = testHook();
    const loads: ReturnType<typeof deferred<string>>[] = [];
    const shared = quietImport(() => {
      const load = deferred<string>();
      loads.push(load);
      return load.promise;
    }, test.hook, isSqliteWarning);
    const imported = shared();
    loads[0]?.reject(new Error("no node:sqlite here"));
    await expect(imported).rejects.toThrow("no node:sqlite here");
    expect(test.current()).toBe(test.original);
    const again = shared();
    loads[1]?.resolve("module");
    expect(await again).toBe("module");
    expect(loads).toHaveLength(2);
  });

  it.each(["locks-ab", "locks-ba"])(
    "two overlapping directory locks (%s) share one import: no warning reaches a listener or stderr; emitWarning is restored",
    async (mode) => {
      const run = await runQuietChild<{ warnings: string[]; restored: boolean }>("../db/sqlite-warning.child.ts", { mode });
      expect({ code: run.code, stdout: run.stdout, stderr: run.stderr }).toEqual({ code: 0, stdout: "", stderr: "" });
      expect(run.result).toEqual({ warnings: [], restored: true });
    },
    240_000,
  );

  it("negative control: the same wrapper dropping nothing lets node:sqlite's warning reach the listener and stderr", async () => {
    const run = await runQuietChild<{ warnings: string[]; restored: boolean }>("../db/sqlite-warning.child.ts", { mode: "control" });
    expect(run.code).toBe(0);
    expect(run.result).toEqual({
      warnings: ["ExperimentalWarning: SQLite is an experimental feature and might change at any time"],
      restored: true,
    });
    expect(run.stderr).toContain("ExperimentalWarning: SQLite is an experimental feature and might change at any time");
  }, 240_000);
});
