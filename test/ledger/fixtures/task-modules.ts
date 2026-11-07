// The test modules of the ledger task tests. Their ledger tasks run in the ledger worker, which imports this file as
// the host program's entry does (`modules`, the configuration file's export, or `./task-worker-entry.ts`), and their
// callbacks on the main thread record what they get in the `seen` a test gives. Each declaration is made by a function
// so both threads hold the very same tasks. [A137, LG-7, LG-17]
// Erasable TypeScript only: the worker runs it through Node.js's type stripping.

import { z } from "zod";
import type { LedgerTask, LedgerTaskBlock } from "../../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";

/** The vendored v9 package's name in `rawPackages()`. */
const V9 = "@umbradb/vendored-ledger-v9";

/** What of the v9 package the tasks use. */
interface V9Raw {
  readonly ContractCall: abstract new (...args: never[]) => object;
  readonly StateValue: { decode(value: unknown): { free(): void } };
  readonly LedgerState: { blank(networkId: string): object };
  serializeStateValue(value: unknown): Uint8Array;
  stateRoot(state: unknown): Uint8Array;
}

/** A contract call's arguments as `call-args` decodes them: its contract, entry point and pushed values. */
export interface CallArguments {
  readonly transaction: number;
  readonly segment: number;
  readonly address: string;
  readonly entryPoint: string;
  /** Each value the guaranteed transcript pushes, the package's serialization of the decoded state value, as hex. */
  readonly pushes: readonly string[];
}

/** What `call-args` gives for a block: each call's arguments, and whether the task was given a state. */
export interface CallArgsItem {
  readonly calls: readonly CallArguments[];
  readonly stateGiven: boolean;
}

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const free = (object: unknown): void => (object as { free?: () => void } | null)?.free?.();

/**
 * `call-args`' task: decodes each contract call of each transaction with the native parsed objects and the package —
 * the values the call's guaranteed transcript pushes, decoded as state values and serialized by the package —, the
 * package's objects freed as soon as read.
 */
export const CALL_ARGS_TASK: LedgerTask = Object.freeze({
  name: "call-arguments",
  needsState: false,
  run(block: LedgerTaskBlock): CallArgsItem {
    const raw = block.packages[V9] as V9Raw | undefined;
    const calls: CallArguments[] = [];
    if (raw !== undefined) {
      block.transactions.forEach((transaction, index) => {
        const intents = (transaction as { readonly intents?: ReadonlyMap<number, unknown> }).intents;
        for (const [segment, intent] of [...(intents ?? new Map<number, unknown>())].sort(([a], [b]) => a - b)) {
          const actions = (intent as { readonly actions: readonly unknown[] }).actions;
          for (const action of actions) {
            if (!(action instanceof raw.ContractCall)) continue;
            const call = action as unknown as { address: string; entryPoint: Uint8Array | string; guaranteedTranscript?: { program: readonly unknown[] } };
            const pushes = (call.guaranteedTranscript?.program ?? []).flatMap((op) => {
              const push = (op as { push?: { value: unknown } }).push;
              if (push === undefined) return [];
              const value = raw.StateValue.decode(push.value);
              try {
                return [hex(raw.serializeStateValue(value))];
              } finally {
                value.free();
              }
            });
            const entryPoint = typeof call.entryPoint === "string" ? call.entryPoint : Buffer.from(call.entryPoint).toString("utf8");
            calls.push({ transaction: index, segment, address: call.address, entryPoint, pushes });
          }
          for (const action of actions) free(action);
          free(intent);
        }
      });
    }
    return { calls, stateGiven: "stateBefore" in block };
  },
});

/** `state-before`'s task: the root of the state it is given, the state before the block (`needsState`). */
export const STATE_BEFORE_TASK: LedgerTask = Object.freeze({
  name: "root-before",
  needsState: true,
  run(block: LedgerTaskBlock): { readonly height: bigint; readonly root: Uint8Array | null } {
    const raw = block.packages[V9] as V9Raw;
    return { height: block.height, root: block.stateBefore === undefined ? null : Uint8Array.from(raw.stateRoot(block.stateBefore)) };
  },
});

/** The height at which `native-leak`'s task returns a WebAssembly-backed object, and `task-throws`' throws. */
export const FAULT_AT = 3n;

/** `native-leak`'s task: at {@link FAULT_AT}, a ledger state of the package — a WebAssembly-backed object. */
export const NATIVE_LEAK_TASK: LedgerTask = Object.freeze({
  name: "leaked-object",
  needsState: false,
  run(block: LedgerTaskBlock): unknown {
    if (block.height !== FAULT_AT) return { height: block.height };
    return { height: block.height, state: (block.packages[V9] as V9Raw).LedgerState.blank("undeployed") };
  },
});

/** `task-throws`' task: throws at {@link FAULT_AT}. */
export const THROWING_TASK: LedgerTask = Object.freeze({
  name: "thrown-result",
  needsState: false,
  run(block: LedgerTaskBlock): unknown {
    if (block.height === FAULT_AT) throw new Error(`the throwing task gives up at ${block.height}`);
    return { height: block.height };
  },
});

/** `task-traps`' task: traps at {@link FAULT_AT}, as a package whose WebAssembly aborted does. */
export const TRAPPING_TASK: LedgerTask = Object.freeze({
  name: "trapped-result",
  needsState: false,
  run(block: LedgerTaskBlock): unknown {
    if (block.height === FAULT_AT) throw new WebAssembly.RuntimeError("unreachable");
    return { height: block.height };
  },
});

/** What the modules saw on the main thread, by height. */
export interface TaskSeen {
  /** `call-args`' item at its `on-compute`. */
  readonly callArgs: Map<bigint, CallArgsItem>;
  /** `state-before`'s item at its `on-compute`, and the `ledger-state` item it saw there (the state after the block). */
  readonly stateBefore: Map<bigint, { readonly item: unknown; readonly after: Uint8Array }>;
  /** The readers of `block-parsed`: by module, the heights and transaction counts they read. */
  readonly readers: Map<string, [bigint, number][]>;
  /** Every block item a main-thread callback saw that does not come back the same from a structured clone. */
  readonly notPlain: string[];
}

export const taskSeen = (): TaskSeen => ({ callArgs: new Map(), stateBefore: new Map(), readers: new Map(), notPlain: [] });

const base = (id: string, requires: string[], provides: string[], startsMidChain: boolean) => ({
  id,
  version: "1.0.0",
  side: "public" as const,
  requires,
  provides: provides.map((name) => ({ name, lifetimes: ["block" as const] })),
  startsMidChain,
  configSchema: z.object({}),
  migrations: [],
});

/** `call-args`: a ledger task without the state, which may start mid-chain; its `on-compute` records its item. */
export function callArgsModule(seen?: TaskSeen): ModuleDeclaration {
  return {
    ...base("call-args", ["block-parsed"], ["call-arguments"], true),
    ledgerTasks: [CALL_ARGS_TASK],
    points: {
      async "on-compute"(_p, b) {
        seen?.callArgs.set(b.height, b.items.get("call-arguments") as CallArgsItem);
      },
    },
  };
}

/** `state-before`: a ledger task with the state; requires `ledger-state`, so it cannot run without `core-ledger-state`. */
export function stateBeforeModule(seen?: TaskSeen): ModuleDeclaration {
  return {
    ...base("state-before", ["block-parsed", "ledger-state"], ["root-before"], false),
    ledgerTasks: [STATE_BEFORE_TASK],
    points: {
      async "on-compute"(_p, b) {
        const after = (b.items.get("ledger-state") as { stateRoot: Uint8Array }).stateRoot;
        seen?.stateBefore.set(b.height, { item: b.items.get("root-before"), after });
      },
    },
  };
}

/** A module whose task returns a WebAssembly-backed object at {@link FAULT_AT}. */
export function nativeLeakModule(): ModuleDeclaration {
  return { ...base("native-leak", ["block-parsed"], ["leaked-object"], true), ledgerTasks: [NATIVE_LEAK_TASK], points: {} };
}

/** A module whose task throws at {@link FAULT_AT}. */
export function throwingModule(): ModuleDeclaration {
  return { ...base("task-throws", ["block-parsed"], ["thrown-result"], true), ledgerTasks: [THROWING_TASK], points: {} };
}

/** A module whose task traps at {@link FAULT_AT}. */
export function trappingModule(): ModuleDeclaration {
  return { ...base("task-traps", ["block-parsed"], ["trapped-result"], true), ledgerTasks: [TRAPPING_TASK], points: {} };
}

/** A user module reading `block-parsed` at `on-compute`: what three modules besides the task's read. [A137] */
export function readerModule(id: string, seen?: TaskSeen): ModuleDeclaration {
  return {
    ...base(id, ["block-parsed"], [], true),
    points: {
      async "on-compute"(_p, b) {
        const parsed = b.items.get("block-parsed") as { transactions: readonly unknown[] };
        const list = seen?.readers.get(id) ?? [];
        list.push([b.height, parsed.transactions.length]);
        seen?.readers.set(id, list);
      },
    },
  };
}

/** The modules whose tasks the worker needs: this file's `modules` export, as a configuration file gives its own. */
export const modules: readonly ModuleDeclaration[] = Object.freeze([
  callArgsModule(),
  stateBeforeModule(),
  nativeLeakModule(),
  throwingModule(),
  trappingModule(),
]);
