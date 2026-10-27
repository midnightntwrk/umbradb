/**
 * What a process worker of the browser build sets before UmbraDB's code runs (`browser/build.ts`; task 16.1): the
 * monotonic clock the heartbeat and the admin endpoints read as `process.hrtime.bigint()` in Node.js (AE-2; the build
 * replaces that expression with this global), in nanoseconds from `performance.now()`. The heartbeat's tick and the
 * admin endpoints' reading of it are both in the process's worker, so they share its clock.
 */

const scope = globalThis as { __umbradbHrtimeBigint?: () => bigint };

scope.__umbradbHrtimeBigint = (): bigint => BigInt(Math.round(performance.now() * 1_000_000));

export {};
