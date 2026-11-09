import { getEventListeners } from "node:events";
import { describe, expect, it } from "vitest";
import { followSignal, isSignal } from "../../src/runner/host-signal.js";

/**
 * A host's `AbortSignal` as the engine reads it (`src/runner/host-signal.ts`): the check that a value is one, by
 * `AbortSignal`'s own accessor, and the engine's listener through `EventTarget`'s own members — a signal's replaced own
 * members neither throw nor are used, and the listener is removed by the function returned.
 */

describe("a host's AbortSignal", () => {
  it("isSignal: a signal is one; an object made from its prototype, a plain object, a primitive, null are none", () => {
    expect(isSignal(new AbortController().signal)).toBe(true);
    expect(isSignal(AbortSignal.abort())).toBe(true);
    for (const value of [Object.create(AbortSignal.prototype), {}, "signal", 5, null, undefined]) expect(isSignal(value)).toBe(false);
  });

  it("followSignal: an aborted signal stops at once with its reason; another when it aborts, once; its listener removed by the disposer", () => {
    const reasons: unknown[] = [];
    const early = new Error("aborted before");
    followSignal(AbortSignal.abort(early), (reason) => reasons.push(reason));
    expect(reasons).toEqual([early]);

    const controller = new AbortController();
    const { signal } = controller;
    for (const member of ["aborted", "reason", "addEventListener", "removeEventListener"]) {
      Object.defineProperty(signal, member, {
        get: () => {
          throw new Error("a replaced member");
        },
      });
    }
    const dispose = followSignal(signal, (reason) => reasons.push(reason));
    expect(getEventListeners(signal, "abort")).toHaveLength(1);
    const late = new Error("aborted later");
    controller.abort(late);
    controller.abort(new Error("again"));
    expect(reasons).toEqual([early, late]);

    const kept = new AbortController();
    const remove = followSignal(kept.signal, (reason) => reasons.push(reason));
    expect(getEventListeners(kept.signal, "abort")).toHaveLength(1);
    remove();
    expect(getEventListeners(kept.signal, "abort")).toHaveLength(0);
    kept.abort();
    expect(reasons).toEqual([early, late]);
    dispose();
  });
});
