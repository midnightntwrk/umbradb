import { CORE_CONTRACT_LOGS_FAST, CORE_CONTRACT_LOGS_FAST_ID } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { CORE_CONTRACT_LOGS_FULL, CORE_CONTRACT_LOGS_FULL_ID } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import type { Manifest } from "../../src/backup/manifest.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { BackupBackend, BackupDatabase } from "../backup/backup-fixtures.js";
import { ledgerBackup, restoreLedger } from "../backup/restore-ledger.js";
import { cellValue } from "../ledger/adapter-fixtures.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { entryOf } from "../runner/process-build.js";
import {
  type ContractScenario,
  contractScenario,
  contractsFor,
  lineProblems,
  logLines,
  type Ran,
  reachedProblems,
  runRange,
  wrapper,
} from "./contract-data-checks.js";
import { cappedAt, LEDGER_CORE, restartAt } from "./ledger-restart.js";

/**
 * The logs-provider handoff run, shared by `contract-logs-handoff.test.ts` and its negative controls:
 * 1. The ledger's core modules and `core-contract-logs-full` run from 0, `-full`'s entry stopping at h. They sync to h
 *    over a tape capped there (`./ledger-restart.ts`), and the process backs up there (`ProcessHandle.backup`).
 * 2. The backup is restored (`../backup/restore-ledger.ts`, with the restore's own checks) into an empty database, with
 *    the configuration it was taken with.
 * 3. The restored database runs to the scenario's head with the configuration that continues it: `-full` from 0 to h,
 *    `core-contract-logs-fast` from `fastFrom`.
 *
 * [A111, CC-4, BK-1, BK-3, MD-6]
 */

/** The build of the run after the restore: the ledger's core modules and both providers of `contract-logs`. */
export const HANDOFF_CORE: readonly ModuleDeclaration[] = Object.freeze([...LEDGER_CORE, CORE_CONTRACT_LOGS_FULL, CORE_CONTRACT_LOGS_FAST]);

/**
 * The handoff scenario: a contract deployed at 1, then literal logs at every height from 2 to 5, a fallible one's at 4.
 * [A111]
 */
export async function handoffScenario(): Promise<ContractScenario> {
  const [contract] = await contractsFor("v9", 1);
  const call = (byte: number, rest: object = {}) => ({ kind: "call" as const, contract: contract!, logs: [cellValue(Uint8Array.of(byte))], ...rest });
  return contractScenario({
    ledger: "v9",
    blocks: [
      [{ kind: "deploy", contract: contract! }],
      [call(1, { logs: [cellValue(Uint8Array.of(1)), wrapper(1, 5, cellValue(Uint8Array.of(2)))] })],
      [call(3)],
      [call(4, { fallibleLogs: [cellValue(Uint8Array.of(5))] })],
      [call(6)],
    ],
  });
}

/** What the handoff gave: the backup's manifest, the target, and the continued run — or the refusal that stopped it. */
export interface Handoff {
  readonly manifest: Manifest;
  readonly target: BackupDatabase;
  readonly ran: Ran | null;
  readonly refused: unknown;
}

/**
 * Where the handoff switches: the backup is taken at `h`; `-full`'s entry stops at `fullTo` (h unless given) and
 * `-fast`'s starts at `fastFrom` (h + 1 for the handoff as specified). [A111]
 */
export interface HandoffAt {
  readonly h: bigint;
  readonly fastFrom: bigint;
  readonly fullTo?: bigint;
}

/** The start and stop of each module's entry after the restore (see {@link HandoffAt}). */
function startOf(at: HandoffAt): (id: string) => number {
  return (id) => (id === CORE_CONTRACT_LOGS_FAST_ID ? Number(at.fastFrom) : 0);
}
function stopOf(at: HandoffAt): (id: string) => number | undefined {
  return (id) => (id === CORE_CONTRACT_LOGS_FULL_ID ? Number(at.fullTo ?? at.h) : undefined);
}

/** The handoff run on `backend` (see the module comment). [A111] */
export async function handoff(backend: BackupBackend, expected: ContractScenario, at: HandoffAt): Promise<Handoff> {
  const { records, head } = expected.scenario;
  const source = await backend.database();
  const backup = await ledgerBackup(source, expected.scenario, {
    at: at.h,
    records: cappedAt(records, at.h),
    core: [...LEDGER_CORE, CORE_CONTRACT_LOGS_FULL],
    stopOf: stopOf(at),
  });
  const target = await backend.database();
  const starts = startOf(at);
  const stops = stopOf(at);
  try {
    // Restored with the configuration the backup was taken with (a restore with -fast's later entry already in it is
    // refused), against the tape with its finalized head at h.
    await restoreLedger(backend, target, backup, cappedAt(records, at.h), {}, undefined, {
      core: [...LEDGER_CORE, CORE_CONTRACT_LOGS_FULL],
      entry: (module) => entryOf(module, 0, {}, stops(module.id)),
    });
  } catch (refused) {
    return { manifest: backup.manifest, target, ran: null, refused };
  }
  // The tape with the cursor's header and metadata, which the restarted process reads (`./ledger-restart.ts`). [Q135 A]
  const ran = await runRange(target as unknown as ProcessDatabase, restartAt(records, at.h), head, { core: HANDOFF_CORE, startOf: starts, stopOf: stops });
  return { manifest: backup.manifest, target, ran, refused: null };
}

/**
 * The handoff's oracle: the restore and the startup after it accepted the handoff, the run reached the head, and
 * `contract_logs.logs` holds exactly the scenario's rows from 0 to the head, each height's once, none missing.
 * [A111, CC-4]
 */
export async function handoffProblems(result: Handoff, expected: ContractScenario): Promise<string[]> {
  if (result.refused !== null) {
    const { code, message, stack } = result.refused as { code?: string; message?: string; stack?: string };
    return [`the restore refused the handoff: ${code ?? "(no code)"}: ${message ?? String(result.refused)}`, `at ${stack?.split("\n").slice(1, 6).join(" | ")}`];
  }
  const ran = result.ran as Ran;
  return [
    ...reachedProblems(ran.status, expected.scenario.head),
    ...(ran.status.reason === null || ran.halt === undefined ? [] : [`its log: ${ran.halt}`]),
    ...lineProblems(await logLines(result.target as unknown as ProcessDatabase), expected.logs),
  ];
}
