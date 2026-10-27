import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_LOGS_FAST } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { cellValue, hex, RAW } from "../ledger/adapter-fixtures.js";
import type { TestLoaderData } from "../ledger/fixtures/ledger-test-loader.js";
import type { CallArgsItem, TaskSeen } from "../ledger/fixtures/task-modules.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { type ContractScenario, contractScenario, contractsFor } from "./contract-data-checks.js";
import { committed, halted, ingest, type IngestOptions, PATIENCE_MS } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";

/**
 * A137's runs (task 12.6; `openspec/changes/core-arch/acceptance.md` A137, LG-7, LG-17), shared by `ledger-tasks.test.ts`
 * and its negative controls: a contract scenario through the real process (`./contract-data-checks.ts`: a fixture
 * contract deployed, then called with literal logs — what its transcripts push), the test modules of
 * `test/ledger/fixtures/task-modules.ts` with their ledger tasks in the worker — UmbraDB's entry importing that file as a
 * configuration file's modules (`LedgerWorkerOptions.modules`) and the test loader counting the package's
 * deserializations there —, and this thread's v9 package counting its own while the process runs. Imports nothing of
 * Vitest.
 */

/** The test modules' file, which the worker imports for their tasks (its `modules` export). */
export const TASK_MODULES = new URL("../ledger/fixtures/task-modules.ts", import.meta.url);

/** The test loader, counting the package's deserializations in the worker. */
const LOADER = new URL("../ledger/fixtures/ledger-test-loader.ts", import.meta.url);

/** The ledger's core modules with `-fast` (which reads `block-parsed` and runs a ledger task of its own). */
export const TASKS_CORE: readonly ModuleDeclaration[] = Object.freeze([...LEDGER_CORE, CORE_CONTRACT_LOGS_FAST]);

/** The core modules without `core-ledger-state`: `block-parsed` and what it requires (a task without the state). */
export const PARSE_CORE: readonly ModuleDeclaration[] = Object.freeze([CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS]);

/** The scenario: a contract deployed at 1, called at 2 (pushing 1), at 3 twice (2; 3 and 4), at 4 once (5), at 5 not. */
export async function tasksScenario(): Promise<ContractScenario> {
  const [contract] = await contractsFor("v9", 1);
  const call = (...bytes: number[]) => ({ kind: "call" as const, contract: contract!, logs: bytes.map((byte) => cellValue(Uint8Array.of(byte))) });
  return contractScenario({
    ledger: "v9",
    blocks: [[{ kind: "deploy", contract: contract! }], [call(1)], [call(2), call(3, 4)], [call(5)], []],
  });
}

/** `call-args`' item at each height of `expected`, written from its specification (each call's pushed values). */
export function expectedCallArgs(expected: ContractScenario): Map<bigint, CallArgsItem> {
  const [contract] = expected.contracts;
  const address = hex((contract as { address: Uint8Array }).address);
  const serialized = (byte: number): string => {
    const value = RAW.v9.StateValue.decode(cellValue(Uint8Array.of(byte)));
    try {
      return hex(RAW.v9.serializeStateValue(value));
    } finally {
      (value as unknown as { free(): void }).free();
    }
  };
  const call = (transaction: number, ...bytes: number[]) => ({ transaction, segment: 1, address, entryPoint: "emit", pushes: bytes.map(serialized) });
  const none: CallArgsItem = { calls: [], stateGiven: false };
  return new Map<bigint, CallArgsItem>([
    [0n, none],
    [1n, none],
    [2n, { calls: [call(0, 1)], stateGiven: false }],
    [3n, { calls: [call(0, 2), call(1, 3, 4)], stateGiven: false }],
    [4n, { calls: [call(0, 5)], stateGiven: false }],
    [5n, none],
  ]);
}

/**
 * Where `value` (a block item a callback received) is not plain data a structured clone gives back the same — a class
 * instance's prototype is dropped, a function or symbol refused —, or null: this test's own account, independent of
 * `src/ledger/plain-data.ts`.
 */
export function roundTripProblem(value: unknown): string | null {
  let copy: unknown;
  try {
    copy = structuredClone(value);
  } catch (error) {
    return `structuredClone refuses it: ${String(error)}`;
  }
  const walk = (a: unknown, b: unknown, path: string): string | null => {
    if (a === null || typeof a !== "object") return isDeepStrictEqual(a, b) ? null : path;
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return `${path} (a ${(a as object).constructor?.name ?? "null-prototype"} object)`;
    for (const key of Reflect.ownKeys(a)) {
      const found = walk((a as Record<PropertyKey, unknown>)[key], (b as Record<PropertyKey, unknown>)[key], `${path}.${String(key)}`);
      if (found !== null) return found;
    }
    return null;
  };
  return walk(value, copy, "$");
}

/**
 * A user module running after every other at `on-compute` (it requires the items of the last ones), recording every
 * block item it sees that does not come back the same from a structured clone (A137's "no main-thread callback receives
 * a native ledger object").
 */
export function plainWatchModule(seen: TaskSeen, requires: readonly string[]): ModuleDeclaration {
  return {
    id: "plain-watch",
    version: "1.0.0",
    side: "public",
    requires: [...requires],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-compute"(_p, b) {
        for (const [item, value] of b.items) {
          const problem = roundTripProblem(value);
          if (problem !== null) seen.notPlain.push(`${b.height} ${item}: ${problem}`);
        }
      },
    },
  };
}

/** Counts this thread's v9 transaction deserializations until the returned function is called, which gives them. */
export function countMainThreadParses(): () => string[] {
  const parsed: string[] = [];
  const regular = RAW.v9.Transaction.deserialize;
  const system = RAW.v9.SystemTransaction.deserialize;
  RAW.v9.Transaction.deserialize = ((...args: Parameters<typeof regular>) => {
    parsed.push(hex(args.at(-1) as Uint8Array));
    return regular(...args);
  }) as typeof regular;
  RAW.v9.SystemTransaction.deserialize = ((...args: Parameters<typeof system>) => {
    parsed.push(hex(args.at(-1) as Uint8Array));
    return system(...args);
  }) as typeof system;
  return () => {
    RAW.v9.Transaction.deserialize = regular;
    RAW.v9.SystemTransaction.deserialize = system;
    return parsed;
  };
}

/** What a run gave. */
export interface TasksRun {
  readonly status: ReturnType<Awaited<ReturnType<typeof ingest>>["handle"]["status"]>;
  readonly lines: readonly string[];
  /** The worker's deserializations of transactions, as hex (the test loader's count). */
  readonly workerParses: readonly string[];
  /** This thread's, while the process ran. */
  readonly mainParses: readonly string[];
}

/** Runs `expected` on `db` with `options` to its head (or, `halts`, to a halt), the worker counting its parses. */
export async function runTasks(
  db: ProcessDatabase,
  expected: ContractScenario,
  options: Omit<IngestOptions, "start" | "ledgerWorker"> & {
    readonly start?: bigint;
    readonly halts?: boolean;
    readonly ledgerWorker?: () => LedgerHost;
    /** The tape: the scenario's unless given (a start above 0 needs `restartAt`'s records at S − 1). */
    readonly records?: ContractScenario["scenario"]["records"];
  },
): Promise<TasksRun> {
  let host: LedgerHost | undefined;
  const { halts, records, ...rest } = options;
  const stop = countMainThreadParses();
  let mainParses: string[] = [];
  const process = await ingest(db, records ?? expected.scenario.records, {
    start: 0n,
    ledgerWorker: () => (host = startLedgerWorker({ loader: LOADER, loaderData: { count: true } satisfies TestLoaderData, modules: TASK_MODULES })),
    ...rest,
  });
  let status;
  let workerParses: readonly string[] = [];
  try {
    if (halts === true) await halted(process);
    else await committed(process, expected.scenario.head, PATIENCE_MS * 2);
    status = process.handle.status();
    workerParses = host === undefined ? [] : ((await host.probe()) as { deserialized: Uint8Array[] }).deserialized.map(hex);
  } finally {
    await process.close();
    mainParses = stop();
  }
  return { status, lines: process.lines, workerParses, mainParses };
}

/** Every transaction of `expected` from height `from` on, as hex, once each, sorted. */
export function transactionsOf(expected: ContractScenario, from = 0n): string[] {
  return expected.scenario.transactions.filter((tx) => tx.height >= from).map((tx) => hex(tx.bytes)).sort();
}
