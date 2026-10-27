import { launchPrivate } from "./builds.js";
import { type KeyCall, keyEntry, keyModule, type TestKeyConfig } from "./key-checks.js";

/**
 * A private process for A119's crash (task 14.4; PP-8), started by `keys.test.ts` with `node --import tsx` and one JSON
 * argument ({@link KeyCrashJob}): a private process with the key module `pk` and one test key, on its private database,
 * reading public data from `publicDatabase` (PostgreSQL, read directly) or through the core at `coreTransport` (PGlite,
 * whose database the core alone opens). `pk`'s `on-db-write` at `crashAt` — the key's start — reports `in-transaction`
 * (one JSON line on stdout) and never ends, so the block transaction stays open, its keys taken but not committed; the
 * test then kills the process with SIGKILL. Each `on-key` is reported as it fires. It exits by itself once its parent
 * is no longer the test's (Vitest's bail, a test's timeout).
 */

export interface KeyCrashJob {
  /** The private database's `database` setting. */
  readonly database: string;
  readonly publicDatabase?: string;
  readonly coreTransport?: string;
  readonly key: TestKeyConfig;
  /** The height whose block transaction is left open: decimal text. */
  readonly crashAt: string;
}

export type KeyCrashEvent =
  | { readonly event: "on-key"; readonly read: string | null }
  | { readonly event: "in-transaction"; readonly height: string }
  | { readonly event: "ended"; readonly kind: string };

function report(event: KeyCrashEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as KeyCrashJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

const calls: KeyCall[] = [];
const recorded: KeyCall[] = new Proxy(calls, {
  get(target, property, receiver) {
    if (property === "push") {
      return (...items: KeyCall[]) => {
        for (const item of items) if (item.point === "on-key") report({ event: "on-key", read: item.read === null ? null : String(item.read) });
        return target.push(...items);
      };
    }
    return Reflect.get(target, property, receiver);
  },
});

const running = launchPrivate({
  database: job.database,
  ...(job.publicDatabase === undefined ? {} : { publicDatabase: job.publicDatabase }),
  ...(job.coreTransport === undefined ? {} : { coreTransport: job.coreTransport }),
  modules: [keyModule(recorded, { height: BigInt(job.crashAt), blocked: () => report({ event: "in-transaction", height: job.crashAt }) })],
  entries: [keyEntry()],
  testKeys: [job.key],
});
void running.handle.ended.then((end) => report({ event: "ended", kind: end.kind }));
await running.handle.closed;
clearInterval(orphanGuard);
