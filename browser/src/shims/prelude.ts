/**
 * What a process worker of the browser build sets before UmbraDB's code runs (`browser/build.ts`): the monotonic clock
 * that the heartbeat and the admin endpoints read as `process.hrtime.bigint()` in Node.js, in nanoseconds from
 * `performance.now()`. The build replaces that expression with this global. The heartbeat's tick and the admin
 * endpoints' reading of it are both in the process's worker, so they share its clock. [AE-2]
 */

const scope = globalThis as { __umbradbHrtimeBigint?: () => bigint };

scope.__umbradbHrtimeBigint = (): bigint => BigInt(Math.round(performance.now() * 1_000_000));

export {};
