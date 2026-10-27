// The test packages of task 12.3 (`openspec/changes/core-arch` A92, A101, A106; `src/ledger/worker/`): a loader the
// ledger worker imports in place of `src/ledger/load.ts` (`startLedgerWorker({ loader, loaderData })`), so that the
// worker thread itself runs the instrumented adapter. It loads the real adapter and, by `loaderData`, counts the
// package's native parses, returns a wrong state root for one height (A106's "test package returning a wrong root"),
// spends a long synchronous step in one height's apply (A101's 60 s ledger step), fails, ends the thread, or traps as
// WebAssembly does; and (task 12.5) records each eviction the package is asked for and each parse whose native objects
// it is told to free. Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { loadLedgerPackage } from "../../../src/ledger/load.js";
import type { LedgerName, LedgerPackage, LedgerPackageOptions, StateHandle } from "../../../src/ledger/types.js";

/** A slow apply: a busy wait of `ms` at the start of the apply of `height` (decimal text). */
export interface SlowStep {
  readonly height: string;
  readonly ms: number;
}

/** What a test asks of the loader (plain data, through the worker's `workerData`). */
export interface TestLoaderData {
  /** Records the bytes of every native `Transaction.deserialize` and `SystemTransaction.deserialize`. */
  readonly count?: boolean;
  /** The height, as decimal text, whose state after it gets a root with its last byte flipped. */
  readonly wrongRootAt?: string;
  /**
   * A synchronous busy wait of `ms` at the start of the apply of `height` (decimal text), timed in `hold` (the last
   * one's); several heights in a list.
   */
  readonly slowAt?: SlowStep | readonly SlowStep[];
  /** The load of any adapter rejects. */
  readonly failLoad?: boolean;
  /** The thread ends (`process.exit` in the worker) at the start of the apply of this height. */
  readonly exitAt?: string;
  /** The apply of this height throws a `WebAssembly.RuntimeError`, as a trapped module does. */
  readonly trapAt?: string;
  /** Records every `evict` (its keys, and whether the package refused) and `forgetTransactions` (how many). */
  readonly recordEvictions?: boolean;
  /**
   * Memory the threads share (task 12.5a): the loader of each thread that loads an adapter takes the next slot after
   * the first (the first counts the threads) and adds 1 to it every 5 ms while the thread runs, so a test sees which
   * threads still run.
   */
  readonly heartbeat?: SharedArrayBuffer;
}

let beating = false;

/** Starts this thread's heartbeat in `memory` (see {@link TestLoaderData.heartbeat}), once. */
function beat(memory: SharedArrayBuffer): void {
  if (beating) return;
  beating = true;
  const view = new Int32Array(memory);
  const slot = Atomics.add(view, 0, 1) + 1;
  setInterval(() => Atomics.add(view, slot, 1), 5);
}

const deserialized: Uint8Array[] = [];
const evictions: { readonly keys: readonly string[]; readonly refused: boolean }[] = [];
const forgotten: number[] = [];
const hexOf = (bytes: Uint8Array): string => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
const hold = { start: "0", end: "0" };
const wrapped = new WeakSet<object>();

function countDeserializations(target: { deserialize(...args: unknown[]): unknown }): void {
  if (wrapped.has(target)) return;
  wrapped.add(target);
  const original = target.deserialize.bind(target);
  target.deserialize = (...args: unknown[]) => {
    deserialized.push(Uint8Array.from(args.at(-1) as Uint8Array));
    return original(...args);
  };
}

/** The ledger worker's loader (see the module comment). */
export async function loadLedger(
  ledger: LedgerName,
  options: LedgerPackageOptions,
  given?: TestLoaderData | null,
): Promise<LedgerPackage> {
  const data = given ?? {};
  if (data.heartbeat !== undefined) beat(data.heartbeat);
  if (data.failLoad === true) throw new Error(`the test loader refuses to load ${ledger}`);
  const adapter = await loadLedgerPackage(ledger, options);
  if (data.count === true) {
    for (const raw of Object.values(adapter.rawPackages()) as { Transaction: never; SystemTransaction: never }[]) {
      countDeserializations(raw.Transaction);
      countDeserializations(raw.SystemTransaction);
    }
  }
  const wrong = new WeakSet<StateHandle>();
  const apply: LedgerPackage["apply"] = (state, input) => {
    const height = `${input.height}`;
    if (data.exitAt === height) process.exit(3);
    if (data.trapAt === height) throw new WebAssembly.RuntimeError("unreachable");
    const slow = ([] as SlowStep[]).concat(data.slowAt ?? []).find((step) => step.height === height);
    if (slow !== undefined) {
      hold.start = `${process.hrtime.bigint()}`;
      const end = process.hrtime.bigint() + BigInt(slow.ms) * 1_000_000n;
      while (process.hrtime.bigint() < end) {
        // A step the main thread must not wait on (A101).
      }
      hold.end = `${process.hrtime.bigint()}`;
    }
    const applied = adapter.apply(state, input);
    if (data.wrongRootAt === height) wrong.add(applied.state);
    return applied;
  };
  const stateRoot: LedgerPackage["stateRoot"] = (state) => {
    const root = adapter.stateRoot(state);
    if (wrong.has(state)) root[root.length - 1] = (root[root.length - 1] as number) ^ 1;
    return root;
  };
  if (data.recordEvictions !== true) return Object.freeze({ ...adapter, apply, stateRoot });
  const evict: LedgerPackage["evict"] = (keys) => {
    try {
      adapter.evict(keys);
      evictions.push({ keys: keys.map(hexOf), refused: false });
    } catch (error) {
      evictions.push({ keys: keys.map(hexOf), refused: true });
      throw error;
    }
  };
  const forgetTransactions: LedgerPackage["forgetTransactions"] = (transactions) => {
    forgotten.push(transactions.length);
    adapter.forgetTransactions(transactions);
  };
  return Object.freeze({ ...adapter, apply, stateRoot, evict, forgetTransactions });
}

/** What the loader saw, for the test (`LedgerHost.probe()`). */
export function probe(): {
  readonly deserialized: readonly Uint8Array[];
  readonly hold: { readonly start: string; readonly end: string };
  readonly evictions: readonly { readonly keys: readonly string[]; readonly refused: boolean }[];
  readonly forgotten: readonly number[];
} {
  return { deserialized: [...deserialized], hold: { ...hold }, evictions: [...evictions], forgotten: [...forgotten] };
}
