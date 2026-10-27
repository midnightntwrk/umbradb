/**
 * The process transport's timers (`./core-transport.ts`, `./private-transport.ts`; task 16.1): a timer the transport
 * sets must not keep Node.js alive on its own — a ping, a retry, a close's deadline — so it is `unref`'d; in a browser
 * worker (the browser build, `browser/`) a timer is a number, has no `unref`, and keeps nothing alive anyway.
 */

/** Lets `timer` not keep Node.js alive: its `unref()` when it has one, nothing otherwise (see the module comment). */
export function unrefTimer(timer: unknown): void {
  (timer as { unref?: () => unknown } | null | undefined)?.unref?.();
}
