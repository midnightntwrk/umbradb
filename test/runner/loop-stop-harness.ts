import { EventEmitter } from "node:events";
import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { NodeBlockSource, nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import type { CheckedEntry } from "../../src/config/validate.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { NodeClientOptions } from "../../src/node/client.js";
import type { ConnectSocket } from "../../src/node/socket.js";
import { connectWebSocket } from "../../src/node/ws-socket.js";
import { type ProcessHandle, type SourceShared, terminationSignal } from "../../src/runner/process.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { type ChainBlock, chainOf, finalized, opening, RUNTIME } from "../backbone/fetch-fixtures.js";
import { bigintText, genesisOf, watched, watcher } from "../backbone/ingest-harness.js";
import { hashAt, LEDGER_CORE, restartAt } from "../backbone/ledger-restart.js";
import { ledgerScenario, type LedgerTx } from "../backbone/ledger-tapes.js";
import { NETWORK_ID, RAW, zswapOutputTransaction } from "../ledger/adapter-fixtures.js";
import type { ProcessBackend, ProcessDatabase } from "./process-backends.js";
import { core, entryOf, startProcess } from "./process-build.js";
import {
  CEILING_MS,
  closedWithin,
  databaseLeftOpen,
  NodeWatch,
  retryingOf,
  STOP_LIMIT_MS,
  type StopBy,
  WATCH_MS,
} from "./startup-stop-harness.js";

/**
 * What the tests of SIGTERM while the loop waits on an unreachable node share (`loop-stop.test.ts` and its negative
 * control `loop-stop.negative-control.test.ts`):
 * - a process whose loop runs against a tape node that answers up to height h and is then gone. The node stops
 *   listening, so every connection is refused and the node client retries with its back-off;
 * - the stop, by `ProcessHandle.stop()` or by SIGTERM (`terminationSignal` on an emitter of the test's), while the
 *   loop, with no transaction open, waits for a node call of h + 1;
 * - what the process did then ({@link A169Observation}), the oracle {@link a169Problems}, and a restart against a node
 *   that answers again ({@link restartedProblems}).
 *
 * [A169, RN-13, IN-10]
 *
 * **The scenarios** ({@link LoopStopScenario}): the next height's block (`blockScenario`: a synthetic chain to 6,
 * h = 3, the node gone at `chain_getBlockHash [4]`, the node source's finalized prefetch), and `core-ledger-state`'s
 * state root (`rootScenario`: a v9 ledger chain from genesis to 5, h = 3, the node gone at `midnight_ledgerStateRoot`
 * at 4's hash, which its `on-compute` at 4 awaits). The node is cut when the process's client sends that request: the
 * frame is not sent, and the tape node closes (its connections end, its port stops listening). `prefetchWindow` is 1,
 * so the source asks for h + 1 only once h committed and the loop asks for h + 1, and `backoffCeilingMs` 1 s,
 * so a client that kept retrying would connect again every second. [IN-5]
 *
 * The process's node clients — the one it makes, through the `nodeClient` seam, and any a negative control's source
 * makes — connect through a {@link NodeWatch} that counts each attempt and those made once the test stopped the
 * process, and notes whether they were closed. After the bound the test closes whatever the process left open, so that
 * a process that did not stop (the defect, the negative control) still ends and closes its database.
 */

/** How long a process may take to reach its retrying wait at h + 1 on a loaded machine. */
export const PATIENCE_MS = 240_000;

/** A scenario: the tape, S, h, the request of h + 1 the node is gone at, the build's core modules. [A169] */
export interface LoopStopScenario {
  readonly name: string;
  /** The tape node's records: heights 0 to the head, h + 1 included (the restart's node answers it). */
  readonly records: readonly TapeRecord[];
  readonly start: bigint;
  /** h: the last height committed before the node is gone. */
  readonly height: bigint;
  /** The request of h + 1 at which the node is gone: its method and its params as JSON text. */
  readonly cut: { readonly method: string; readonly params: string };
  /** The build's core modules (each enabled from S). */
  readonly core: readonly ModuleDeclaration[];
  /** The tables holding a row per committed height (`height` their column): none may hold h + 1 after the stop. */
  readonly tables: readonly string[];
}

/** The synthetic chain's head and h (the block scenario). */
const CHAIN_HEAD = 6n;
const CHAIN_H = 3n;

/**
 * The next height's block (see the module comment): a synthetic chain from S = 1 to the head 6 (`../backbone/
 * fetch-fixtures.ts`), the node gone at `chain_getBlockHash [4]` — the node source's finalized prefetch of 4.
 */
export function blockScenario(): LoopStopScenario {
  const chain = chainOf(CHAIN_HEAD);
  const at = (height: bigint): ChainBlock => chain[Number(height)] as ChainBlock;
  const records: TapeRecord[] = [...opening(at(0n), at(CHAIN_HEAD)), ...finalized(at(1n), RUNTIME, true)];
  for (let height = 2n; height <= CHAIN_HEAD; height++) records.push(...finalized(at(height)));
  return Object.freeze({
    name: "the next height's block",
    records,
    start: 1n,
    height: CHAIN_H,
    cut: { method: "chain_getBlockHash", params: JSON.stringify([Number(CHAIN_H + 1n)]) },
    core: [],
    tables: ["core_block_commit.blocks", "watch.rows"],
  });
}

/** A v9 transaction of the ledger scenario: a zswap output (`../ledger/adapter-fixtures.ts`). */
const v9 = (): LedgerTx => ({ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" });

/**
 * `core-ledger-state`'s state root (see the module comment): a v9 ledger chain from genesis to 5 with the ledger's
 * core modules (`LEDGER_CORE`), the node gone at `midnight_ledgerStateRoot` at 4's hash, which `on-compute` at 4
 * awaits after the block was fetched and parsed.
 */
export async function rootScenario(): Promise<LoopStopScenario> {
  const scenario = await ledgerScenario({
    ledger: "v9",
    genesis: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks: [[], [v9()], [], [v9()], [v9()], []],
  });
  const height = 3n;
  return Object.freeze({
    name: "core-ledger-state's state root",
    records: scenario.records,
    start: 0n,
    height,
    cut: { method: "midnight_ledgerStateRoot", params: JSON.stringify([hashAt(scenario.records, height + 1n)]) },
    core: LEDGER_CORE,
    tables: ["core_block_commit.blocks", "watch.rows", "core_ledger_state.states"],
  });
}

/**
 * The tape node gone at a request (see the module comment): a connector whose sockets, once the process's client sends
 * `cut`, send nothing more and close the tape node {@link node}; every later connection is refused.
 */
class Outage {
  node: TapeNode | undefined;
  /** When the cut came (`performance.now()`), or null before it. */
  cutAt: number | null = null;
  /** Connection attempts made once the node was cut. */
  refused = 0;
  readonly #cut: LoopStopScenario["cut"];

  constructor(cut: LoopStopScenario["cut"]) {
    this.#cut = cut;
  }

  readonly connect: ConnectSocket = (url, events, timers) => {
    if (this.cutAt !== null) this.refused += 1;
    const socket = connectWebSocket(url, events, timers);
    return {
      send: (text) => {
        if (this.cutAt === null && this.#isCut(text)) {
          this.cutAt = performance.now();
          void this.node?.close();
        }
        if (this.cutAt === null) socket.send(text);
      },
      close: () => socket.close(),
    };
  };

  #isCut(text: string): boolean {
    const request = JSON.parse(text) as { readonly method?: unknown; readonly params?: unknown };
    return request.method === this.#cut.method && JSON.stringify(request.params) === this.#cut.params;
  }
}

/**
 * The block source a run's process reads the chain through, given the run's {@link NodeWatch} and the options the
 * process made its client with: the node source over the process's client (`nodeSourceOf`, as `umbradb run` makes it)
 * unless a negative control gives its own.
 */
export type SourceOf = (
  watch: NodeWatch,
  options: () => NodeClientOptions,
) => (core: CheckedEntry, shared: SourceShared) => BlockSource;

/**
 * The negative control's source: the node source over a client of its own that the stop does not reach. The client
 * is made from the process's options, so the process shows its `node-retrying`. Every node call of the loop ignores
 * the stop, as the loop's did before the loop honoured stops. [A169]
 */
export const ignoringSource: SourceOf = (watch, options) => (entry) => {
  const settings = entry.settings as { readonly prefetchWindow: number; readonly tipCap: number };
  return new NodeBlockSource({ client: watch.client(options()), prefetchWindow: settings.prefetchWindow, tipCap: settings.tipCap });
};

/** What one run of a stop while the loop waits showed. [A169] */
export interface A169Observation {
  /** Before the stop: the state, the cursor, the attempts of `node-retrying` (null without it). */
  readonly before: { readonly state: string; readonly cursor: bigint | null; readonly retrying: number | null };
  /** Connection attempts refused before the stop (the node gone). */
  readonly refused: number;
  /** The state just after the stop. */
  readonly atStop: string;
  /** From the stop to `closed`, in milliseconds; null when it had not closed within {@link STOP_LIMIT_MS}. */
  readonly closedMs: number | null;
  /** How processing had ended then (`ended`'s kind), or null when it had not. */
  readonly ended: string | null;
  /** The state then. */
  readonly after: string;
  /** The node clients the process made, and how many of them were not closed by the end of the watch. */
  readonly clients: number;
  readonly openClients: number;
  /** Connection attempts to the node after the stop until the end of the watch. */
  readonly attemptsAfter: number;
  /** Null when the database the process opened was closed; otherwise how it was not. */
  readonly unclean: string | null;
  /** The rows above h after the process closed, as `<table> <height>`. */
  readonly above: readonly string[];
}

/** The oracle for `scenario`: every problem with what was observed, none when the stop behaved as required. [A169] */
export function a169Problems(scenario: LoopStopScenario, observed: A169Observation): string[] {
  const problems: string[] = [];
  const { before } = observed;
  const h = scenario.height;
  const running = before.state === "syncing" || before.state === "following";
  if (!running || before.cursor !== h || before.retrying === null || observed.refused < 2) {
    problems.push(
      `before the stop the process was ${before.state} at cursor ${before.cursor} with node-retrying at ` +
        `${before.retrying} after ${observed.refused} refused connections, not running at ${h} and retrying the node`,
    );
  }
  if (observed.atStop !== "stopping") problems.push(`the stop left the process ${observed.atStop}, not stopping`);
  if (observed.closedMs === null) problems.push(`the process did not close within ${STOP_LIMIT_MS} ms of its stop`);
  if (observed.ended !== "signal") {
    problems.push(`processing ended ${observed.ended ?? "not at all"} within ${STOP_LIMIT_MS} ms of the stop, not by the signal`);
  }
  if (observed.after !== "stopping") problems.push(`after the stop the process was ${observed.after}, not stopping`);
  if (observed.openClients > 0) problems.push(`node clients not closed: ${observed.openClients} of ${observed.clients}`);
  if (observed.attemptsAfter > 0) problems.push(`connection attempts to the node after the stop: ${observed.attemptsAfter}`);
  if (observed.unclean !== null) problems.push(`the database was not closed: ${observed.unclean}`);
  if (observed.above.length > 0) problems.push(`stored above ${h}: ${observed.above.join(", ")}`);
  return problems;
}

/** The `core` entry and the build's entries for `scenario` against the node at `url` on `db`. */
function entriesOf(db: ProcessDatabase, scenario: LoopStopScenario, url: string): Record<string, unknown>[] {
  const genesisHash = genesisOf(scenario.records) as string;
  const extra = { node: url, genesisHash, backoffCeilingMs: CEILING_MS, prefetchWindow: 1 };
  return [
    core(db.setting, Number(scenario.start), { extra }),
    ...scenario.core.map((module) => entryOf(module, Number(scenario.start))),
    entryOf(watcher(watched()), Number(scenario.start)),
  ];
}

/** The process for `scenario` on `db` against the node at `url` (see the module comment). */
function processFor(
  db: ProcessDatabase,
  scenario: LoopStopScenario,
  url: string,
  lines: string[],
  more: Partial<Parameters<typeof startProcess>[0]> = {},
): ProcessHandle {
  return startProcess({
    declarations: chainDeclarations([watcher(watched())], { core: scenario.core }),
    config: { data: { entries: entriesOf(db, scenario, url) } },
    source: nodeSourceOf,
    log: (line) => lines.push(line),
    ...more,
  });
}

/** Waits until the loop waits at h + 1 on the node gone: running, the cursor h, `node-retrying`, two refused. */
async function waitingAt(handle: ProcessHandle, scenario: LoopStopScenario, outage: Outage, lines: string[]): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  for (;;) {
    const status = handle.status();
    const retrying = retryingOf(handle);
    if (status.cursor === scenario.height && outage.cutAt !== null && retrying !== null && retrying >= 2 && outage.refused >= 2) {
      return;
    }
    if (status.ended !== null || status.state === "halted" || Date.now() > deadline) {
      throw new Error(
        `the loop never waited at ${scenario.height + 1n} on the node gone: ${JSON.stringify(status, bigintText)}; ` +
          `log ${lines.slice(-20).join(" | ")}`,
      );
    }
    await sleep(20);
  }
}

/** The rows of `scenario`'s tables above h on `db` (after the process closed), as `<table> <height>`. */
async function rowsAbove(db: ProcessDatabase, scenario: LoopStopScenario): Promise<string[]> {
  const found: string[] = [];
  for (const table of scenario.tables) {
    const rows = await db.query(`SELECT height::text AS h FROM ${table} WHERE height > ${scenario.height} ORDER BY height`);
    for (const row of rows) found.push(`${table} ${String(row.h)}`);
  }
  return found;
}

/**
 * One run of `scenario` on `db` (see the module comment): the loop waits at h + 1 on the node gone, `by` stops the
 * process, and the run observes the state, `closed` against the bound, how processing ended, the node clients and
 * their connection attempts over {@link WATCH_MS} more, then — after closing what the process left — whether the
 * database was closed and what is stored above h. `source` replaces the process's block source (a negative control's).
 * [A169]
 */
export async function a169Run(
  backend: ProcessBackend,
  db: ProcessDatabase,
  scenario: LoopStopScenario,
  by: StopBy,
  source?: SourceOf,
): Promise<{ readonly observed: A169Observation; readonly lines: readonly string[] }> {
  const outage = new Outage(scenario.cut);
  const node = await TapeNode.start({ records: scenario.records });
  outage.node = node;
  const watch = new NodeWatch(outage.connect);
  let options: NodeClientOptions | undefined;
  const signals = new EventEmitter();
  const termination = by === "sigterm" ? terminationSignal(signals) : undefined;
  const lines: string[] = [];
  const handle = processFor(db, scenario, node.url, lines, {
    ...(source === undefined ? {} : { source: source(watch, () => options as NodeClientOptions) }),
    nodeClient: (given) => {
      options = given;
      return watch.client(given);
    },
    ...(termination === undefined ? {} : { signal: termination.signal }),
  });
  let observed: Omit<A169Observation, "unclean" | "above">;
  try {
    await waitingAt(handle, scenario, outage, lines);
    const status = handle.status();
    const before = { state: status.state, cursor: status.cursor, retrying: retryingOf(handle) };
    const refused = outage.refused;
    watch.stopped = true;
    const from = performance.now();
    if (by === "stop") void handle.stop();
    else signals.emit("SIGTERM");
    const atStop = handle.status().state;
    const closedMs = await closedWithin(handle, from);
    const ended = handle.status().ended?.kind ?? null;
    const after = handle.status().state;
    await sleep(WATCH_MS);
    observed = {
      before,
      refused,
      atStop,
      closedMs,
      ended,
      after,
      clients: watch.clients,
      openClients: watch.open(),
      attemptsAfter: watch.late,
    };
  } finally {
    // A process that did not stop: its clients closed, so that the loop's node calls end and it closes.
    await watch.closeAll();
    await handle.stop();
    termination?.dispose();
    await node.close();
  }
  const unclean = await databaseLeftOpen(backend.kind, db);
  return { observed: { ...observed, unclean, above: await rowsAbove(db, scenario) }, lines };
}

/**
 * The restart after the stop: a restart against a node that answers again processes h + 1. A process on `db`, stopped
 * at h + 1's wait, is started again against a tape node serving the same chain (`restartAt`: the header and metadata a
 * restart at h asks). Returns every problem; none once h + 1 committed and each of the scenario's tables holds its
 * row. [RN-13, A169]
 */
export async function restartedProblems(db: ProcessDatabase, scenario: LoopStopScenario): Promise<string[]> {
  const next = scenario.height + 1n;
  const node = await TapeNode.start({ records: restartAt(scenario.records, scenario.height) });
  const lines: string[] = [];
  const handle = processFor(db, scenario, node.url, lines);
  const problems: string[] = [];
  try {
    const deadline = Date.now() + PATIENCE_MS;
    for (;;) {
      const status = handle.status();
      if (status.cursor !== null && status.cursor >= next) break;
      if (status.ended !== null || status.state === "halted" || status.state === "refused" || Date.now() > deadline) {
        problems.push(`the restart did not commit ${next}: ${JSON.stringify(status, bigintText)}; log ${lines.slice(-10).join(" | ")}`);
        break;
      }
      await sleep(20);
    }
  } finally {
    await handle.stop();
    await node.close();
  }
  for (const table of scenario.tables) {
    const rows = await db.query(`SELECT count(*)::int AS n FROM ${table} WHERE height = ${next}`);
    if (Number(rows[0]?.n) !== 1) problems.push(`after the restart ${table} holds ${String(rows[0]?.n)} rows of ${next}, not 1`);
  }
  return problems;
}
