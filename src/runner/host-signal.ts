/**
 * A host's `AbortSignal` as the engine reads it: through `AbortSignal`'s and `EventTarget`'s own members, never the
 * object's, so that what a host's object defines of its own — a getter of `aborted` that throws, a replaced
 * `addEventListener` — neither throws out of `startUmbraDB` nor changes what the engine sees; and the check that a
 * value is a signal at all (`AbortSignal`'s own check of its receiver, which an object made from its prototype fails).
 * It imports nothing, so the browser build carries it as it is. [LM-1, LM-9, RN-13]
 */

/** `AbortSignal.prototype`'s accessor `name`, as a function of its receiver. */
function accessor(name: "aborted" | "reason"): (this: AbortSignal) => unknown {
  return (Object.getOwnPropertyDescriptor(AbortSignal.prototype, name) as PropertyDescriptor).get as (this: AbortSignal) => unknown;
}

const ABORTED = accessor("aborted");
const REASON = accessor("reason");
const ADD = EventTarget.prototype.addEventListener;
const REMOVE = EventTarget.prototype.removeEventListener;

/**
 * Whether `value` is an `AbortSignal` as `AbortSignal`'s own accessor checks its receiver; never throws. A proxy of a
 * signal may pass this check, so the library's option check also refuses proxies. [LM-1]
 */
export function isSignal(value: unknown): value is AbortSignal {
  if (typeof value !== "object" || value === null) return false;
  try {
    ABORTED.call(value as AbortSignal);
    return true;
  } catch {
    return false;
  }
}

/**
 * Follows `signal`: `stop` is called with its reason at once when it has aborted, else once when it aborts. Returns
 * the function that removes the listener (nothing to remove for one aborted already). [LM-9, RN-13]
 */
export function followSignal(signal: AbortSignal, stop: (reason: unknown) => void): () => void {
  if (ABORTED.call(signal) === true) {
    stop(REASON.call(signal));
    return () => undefined;
  }
  const listener = (): void => stop(REASON.call(signal));
  ADD.call(signal, "abort", listener, { once: true });
  return () => REMOVE.call(signal, "abort", listener);
}
