/**
 * The process transport's timers (`./core-transport.ts`, `./private-transport.ts`). A timer the transport sets (a ping,
 * a retry, a close's deadline) must not keep Node.js alive on its own, so it is `unref`'d. In a browser worker (the
 * browser build, `browser/`) a timer is a number with no `unref`, and keeps nothing alive anyway.
 */

/** Lets `timer` not keep Node.js alive: its `unref()` when it has one, nothing otherwise (see the module comment). */
export function unrefTimer(timer: unknown): void {
  (timer as { unref?: () => unknown } | null | undefined)?.unref?.();
}
