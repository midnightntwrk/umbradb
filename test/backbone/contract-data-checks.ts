import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_LOGS_FAST } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { CORE_CONTRACT_LOGS_FULL } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import type { ChainOutcome } from "../../src/ledger/types.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessStatus } from "../../src/runner/process.js";
import type * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { callTransaction, cellValue, type ContractFixture, contractFixture, NETWORK_ID, RAW, utf8 } from "../ledger/adapter-fixtures.js";
import { nodesOfTagged, rebuildTagged } from "../ledger/stored-values.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { CHAIN_START_MS, hex } from "./fetch-fixtures.js";
import { bigintText, type Ingest, ingest, type IngestOptions, PATIENCE_MS, until } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";
import { type LedgerScenario, ledgerScenario, type LedgerTx, RUNTIME_2_1 } from "./ledger-tapes.js";

/**
 * Task 13.1's scenarios and oracles (`openspec/changes/core-arch/acceptance.md` A108–A111; `specs/contract-data/spec.md`
 * CC-1 to CC-4), shared by `contract-data.test.ts`, `contract-logs-handoff.test.ts` and their negative controls. Imports
 * nothing of Vitest.
 *
 * **A scenario** ({@link contractScenario}) is task 12.3's synthetic ledger tape (`./ledger-tapes.ts`: real ledger
 * transactions built with the vendored packages' own API, the chain events that place them and give their outcomes, the
 * reference replay's root at every height) whose transactions deploy fixture contracts and call them with transcripts
 * this file writes: literal logs (`push`, `log`) in the guaranteed transcript, a fallible transcript's logs — one that
 * succeeds, or one that fails after logging (`pop` of the contract's state: the stack ends short, so the segment
 * fails) —, and any further ops (a value read from the contract's state, a `branch`, a state change).
 *
 * **What a scenario expects** is written from its own specification, not from the code under test: the logs are each
 * call's literal values in the ledger's emission order (the guaranteed transcripts of every intent, then the fallible
 * ones; `midnight-ledger` `ledger/src/semantics.rs` `apply_section`, `apply_fallible`), dropped for a transaction the chain
 * failed and, for a partial success, the fallible ones; each value decoded with the package's own `decodeLogItem` (a
 * malformed wrapper a version-0 `Misc` log, an oversized one none), numbered in the block, its logical segment the
 * ledger's (0 for every contract log: the guaranteed section's source is segment 0, and the fallible section's
 * `logical_segment: GUARANTEED_SEGMENT`). The reference replay's `ContractLog` events of each transaction are counted
 * against it ({@link contractScenario} refuses a scenario that disagrees). The contract-state rows expected are those of
 * every contract a block's transactions deploy, call or maintain (a deploy that did not apply leaves none), and at the
 * v8 → v9 upgrade's F of every contract deployed before it (CC-1); their keys must rebuild, from the stored nodes alone,
 * into the reference replay's contract state and zswap state after the block.
 */

/** A transcript program, as the package takes it. */
export type Program = v9.Op<v9.AlignedValue>[];

/** A deploy of a fixture contract. */
export interface DeployTx {
  readonly kind: "deploy";
  readonly contract: ContractFixture;
}

/** A call of a fixture contract (see the module comment). */
export interface CallTx {
  readonly kind: "call";
  readonly contract: ContractFixture;
  /** Values the guaranteed transcript logs as literals, in order. */
  readonly logs?: readonly v9.EncodedStateValue[];
  /** Ops of the guaranteed transcript after its literal logs (a value read from state, a `branch`, a state change). */
  readonly tail?: Program;
  /** The values {@link tail} logs, in order, for what the scenario expects (`-full` stores them; `-fast` halts). */
  readonly tailLogs?: readonly v9.EncodedStateValue[];
  /** Values a fallible transcript logs as literals (`ckpt`, then the logs); none for no fallible transcript. */
  readonly fallibleLogs?: readonly v9.EncodedStateValue[];
  /** The fallible transcript fails after its logs: the segment fails, the transaction is a partial success. */
  readonly fallibleFails?: boolean;
  /** The chain's outcome (`success` unless given); `partial` with {@link fallibleFails}. */
  readonly outcome?: ChainOutcome;
  /** The entry point; `emit` unless given. */
  readonly entryPoint?: string;
}

/** A transaction of a scenario's block. */
export type ScenarioTx = DeployTx | CallTx | { readonly kind: "other"; readonly tx: LedgerTx };

/** What {@link contractScenario} takes. */
export interface ContractScenarioOptions {
  readonly ledger: "v8" | "v9";
  /** Each block's transactions from block 1 (block 0 holds none). */
  readonly blocks: readonly (readonly ScenarioTx[])[];
  /** The v8 → v9 upgrade's F (task 12.4): `ledger` must be v8. */
  readonly upgradeAt?: number;
  /**
   * Leave out the scenario builder's own adapter outputs (`./ledger-tapes.ts`' `rootsOnly`): after the upgrade, a call of
   * a contract deployed on v8 gives that in-thread adapter another root than the reference replay's, while the process's
   * ledger worker gives the reference's (task 13.1's probe), so such a scenario holds the process to the reference only.
   */
  readonly rootsOnly?: boolean;
}

/** A row of `contract_logs.logs`, as text: `height tx log address entry segment version type data` (hex without `0x`). */
export type LogLine = string;

/** A scenario and what its tables must hold. */
export interface ContractScenario {
  readonly scenario: LedgerScenario;
  readonly contracts: readonly ContractFixture[];
  /** The rows of `contract_logs.logs` from block 0 to the head, in key order. */
  readonly logs: readonly LogLine[];
  /** By height, the contracts (`0x` hex, byte order) whose row of `core_contract_states.states` the block writes. */
  readonly states: ReadonlyMap<bigint, readonly string[]>;
}

const plain = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** A call's intent TTL: a minute after the block time of height `at` (`CHAIN_START_MS` + 6 s a height). */
const ttlAt = (at: number): number => Number(CHAIN_START_MS) + at * 6_000 + 60_000;

/** The guaranteed and fallible programs of `call`. */
function programsOf(call: CallTx): { guaranteed: Program | undefined; fallible: Program | undefined } {
  const literal = (values: readonly v9.EncodedStateValue[]): Program => values.flatMap((value) => [{ push: { storage: false, value } }, "log" as const]);
  const guaranteed: Program = [...literal(call.logs ?? []), ...(call.tail ?? [])];
  const fallible = call.fallibleLogs === undefined && call.fallibleFails !== true
    ? undefined
    : (["ckpt", ...literal(call.fallibleLogs ?? []), ...(call.fallibleFails === true ? ["pop" as const] : [])] as Program);
  return { guaranteed: guaranteed.length === 0 && fallible !== undefined ? undefined : guaranteed, fallible };
}

/** The log a literal `value` gives, the VM's own decoding (`decodeLogItem`), or null for none (an oversized one). */
export function decodedLog(value: v9.EncodedStateValue): { version: number; eventType: string; data: Uint8Array } | null {
  const v = RAW.v9;
  const state = v.StateValue.decode(value);
  const item = v.decodeLogItem(v.serializeStateValue(state));
  (state as unknown as { free(): void }).free();
  return item;
}

/** `value`'s little-endian bytes without trailing zero bytes (an atom's normal form; none for 0). */
const littleEndian = (value: number): Uint8Array => {
  const bytes: number[] = [];
  for (let rest = value; rest > 0; rest = Math.floor(rest / 256)) bytes.push(rest % 256);
  return Uint8Array.from(bytes);
};

/**
 * A MIP-0002 wrapper `[version, event type, data]`: a 4-byte version and a 1-byte event type (the ledger's
 * `LogEventType` number: 0 `ShieldedSpend` … 10 `Misc`; another is no event type, so the wrapper is malformed).
 */
export function wrapper(version: number, eventType: number, data: v9.EncodedStateValue): v9.EncodedStateValue {
  return { tag: "array", content: [cellValue(littleEndian(version), 4), cellValue(littleEndian(eventType), 1), data] };
}

/** A cell of `size` bytes of `fill`. */
export const bigCell = (fill: number, size: number): v9.EncodedStateValue => cellValue(new Uint8Array(size).fill(fill));

/** A value read from the contract's state: its state, the top of the VM's stack, duplicated and logged. */
export const LOG_STATE: Program = [{ dup: { n: 0 } }, "log"];

/** A guaranteed transcript replacing the contract's state with a cell of `size` bytes of `fill`. */
export const setState = (fill: number, size = 8): Program => [{ push: { storage: true, value: bigCell(fill, size) } }, { swap: { n: 0 } }, "pop"];

/** Deploys of `count` new fixture contracts on `ledger`. */
export async function contractsFor(ledger: "v8" | "v9", count: number): Promise<ContractFixture[]> {
  return Promise.all(Array.from({ length: count }, () => contractFixture(RAW[ledger])));
}

/** A scenario from `options` (see the module comment); refuses one whose reference replay disagrees with it. */
export async function contractScenario(options: ContractScenarioOptions): Promise<ContractScenario> {
  const contracts = new Map<string, ContractFixture>();
  const blocks: LedgerTx[][] = [[]];
  options.blocks.forEach((txs, i) => {
    const at = i + 1;
    const ledger = options.upgradeAt !== undefined && at >= options.upgradeAt ? "v9" : options.ledger;
    blocks.push(
      txs.map((tx): LedgerTx => {
        if (tx.kind === "other") return tx.tx;
        contracts.set(hex(tx.contract.address), tx.contract);
        if (tx.kind === "deploy") return { bytes: tx.contract.deploy, kind: "regular" };
        const { guaranteed, fallible } = programsOf(tx);
        const bytes = callTransaction(RAW[ledger], tx.contract, guaranteed, fallible, ttlAt(at), tx.entryPoint ?? "emit");
        return { bytes, kind: "regular", outcome: tx.outcome ?? (tx.fallibleFails === true ? "partial" : "success") };
      }),
    );
  });
  const scenario = await ledgerScenario({
    ledger: options.ledger,
    genesis: RAW[options.ledger].LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks,
    contracts: [...contracts.values()].map((contract) => contract.address),
    ...(options.upgradeAt === undefined ? {} : { upgrade: { at: options.upgradeAt, runtime: RUNTIME_2_1 } }),
    ...(options.rootsOnly === true ? { rootsOnly: true } : {}),
  });
  const logs: LogLine[] = [];
  const states = new Map<bigint, string[]>();
  const deployed: string[] = [];
  options.blocks.forEach((txs, i) => {
    const height = BigInt(i + 1);
    const ledger = scenario.heights[i + 1]?.ledger;
    const reference = scenario.heights[i + 1] as LedgerScenario["heights"][number];
    const touched = new Set<string>();
    let index = 0;
    txs.forEach((tx, t) => {
      const type = reference.types[t];
      if (tx.kind === "other") return;
      const address = hex(tx.contract.address);
      if (tx.kind === "deploy") {
        if (type === "success") {
          touched.add(address);
          deployed.push(address);
        }
        return;
      }
      touched.add(address);
      const outcome = tx.outcome ?? (tx.fallibleFails === true ? "partial" : "success");
      const expectedType = outcome === "failure" ? "chain-failure" : outcome === "partial" ? "partialSuccess" : "success";
      if (type !== expectedType) throw new Error(`contractScenario: transaction ${t} at ${height} is a ${type}, not ${expectedType}: a fixture problem`);
      const guaranteed = [...(tx.logs ?? []), ...(tx.tailLogs ?? [])];
      const values = outcome === "failure" ? [] : [...guaranteed, ...(outcome === "partial" ? [] : (tx.fallibleLogs ?? []))];
      // Ledger v8 has no MIP-0002 events (Q54): its logs are not counted, and the reference's ContractLog events are raw.
      const decoded = ledger === "v9" ? values.map(decodedLog).filter((item) => item !== null) : [];
      const counted = (reference.events[t] ?? []).filter((name) => name === "ContractLog").length;
      const literalCount = ledger === "v9" ? decoded.length : counted;
      if ((tx.tail === undefined || tx.tailLogs !== undefined) && counted !== literalCount) {
        throw new Error(`contractScenario: transaction ${t} at ${height} emitted ${counted} contract logs, not ${literalCount}: a fixture problem`);
      }
      for (const item of decoded) {
        logs.push([height, t, index++, plain(tx.contract.address), plain(utf8(tx.entryPoint ?? "emit")), 0, item.version, item.eventType, plain(item.data)].join(" "));
      }
    });
    if (options.upgradeAt !== undefined && i + 1 === options.upgradeAt) for (const address of deployed) touched.add(address);
    if (touched.size > 0) states.set(height, [...touched].sort());
  });
  return { scenario, contracts: [...contracts.values()], logs, states };
}

/** The rows of `contract_logs.logs`, as {@link LogLine}s in key order. */
export async function logLines(db: Pick<ProcessDatabase, "query">): Promise<LogLine[]> {
  const rows = await db.query(
    `SELECT height::text AS h, tx_index::text AS t, log_index::text AS i, encode(contract_address, 'hex') AS a,
       encode(entry_point, 'hex') AS e, logical_segment::text AS s, log_version::text AS v, event_type AS y, encode(data, 'hex') AS d
     FROM contract_logs.logs ORDER BY height, tx_index, log_index`,
  );
  return rows.map((row) => [row.h, row.t, row.i, row.a, row.e, row.s, row.v, row.y, row.d].join(" "));
}

/** The lines of `expected` at heights `from` to `to`. */
export const linesBetween = (expected: readonly LogLine[], from: bigint, to: bigint): LogLine[] =>
  expected.filter((line) => {
    const height = BigInt(line.split(" ")[0] as string);
    return height >= from && height <= to;
  });

/** What differs between the stored `lines` and `expected`: each missing and each extra row, named. */
export function lineProblems(lines: readonly LogLine[], expected: readonly LogLine[]): string[] {
  const stored = new Set(lines);
  const wanted = new Set(expected);
  return [
    ...expected.filter((line) => !stored.has(line)).map((line) => `missing log row ${line.slice(0, 60)}…`),
    ...lines.filter((line) => !wanted.has(line)).map((line) => `extra log row ${line.slice(0, 60)}…`),
    ...(lines.length !== stored.size ? [`${lines.length - stored.size} rows repeated`] : []),
  ];
}

/** The process reached `head` with no reason to stop. */
export function reachedProblems(status: ProcessStatus, head: bigint): string[] {
  const problems: string[] = [];
  if (status.reason !== null) problems.push(`the process ${status.state} with ${JSON.stringify(status.reason, bigintText)}`);
  if (status.cursor !== head) problems.push(`the cursor is ${status.cursor}, not ${head}`);
  return problems;
}

/**
 * CC-2/CC-3's logs (A109, A110): the process reached the head, and `contract_logs.logs` holds exactly the scenario's
 * expected rows — so none of a fallible segment that failed, none of a v8 block, and none twice.
 */
export async function logProblems(db: ProcessDatabase, status: ProcessStatus, expected: ContractScenario): Promise<string[]> {
  return [...reachedProblems(status, expected.scenario.head), ...lineProblems(await logLines(db), expected.logs)];
}

/**
 * A110's halt (CC-3): processing halted at `height` with `fast-log-unsupported`, naming `core-contract-logs-fast`,
 * `on-parse` and the transaction, and the rows below it are the expected ones and none at or above it.
 */
export async function haltProblems(
  db: ProcessDatabase,
  status: ProcessStatus,
  expected: ContractScenario,
  height: bigint,
  transaction: number,
  detail: string | undefined,
): Promise<string[]> {
  const problems: string[] = [];
  const reason = status.reason;
  if (status.state !== "halted" || reason === null) problems.push(`the process is ${status.state}, not halted`);
  else {
    if (reason.code !== "fast-log-unsupported") problems.push(`it halted with ${reason.code}, not fast-log-unsupported`);
    if (reason.height !== height) problems.push(`it halted at ${reason.height}, not ${height}`);
    if (reason.module !== "core-contract-logs-fast" || reason.point !== "on-parse") problems.push(`it halted in ${reason.module} at ${reason.point}`);
  }
  if (status.cursor !== height - 1n) problems.push(`the cursor is ${status.cursor}, not ${height - 1n}`);
  if (detail !== undefined && !detail.includes(`transaction ${transaction} `)) problems.push(`the halt does not name transaction ${transaction}: ${detail}`);
  problems.push(...lineProblems(await logLines(db), linesBetween(expected.logs, 0n, height - 1n)));
  return problems;
}

/** The rows of `core_contract_states.states`: by height, the contracts (`0x` hex, byte order) with their keys. */
export async function stateRows(db: Pick<ProcessDatabase, "query">): Promise<Map<bigint, { address: string; stateKey: string; zswapKey: string }[]>> {
  const rows = await db.query(
    `SELECT height::text AS h, encode(contract_address, 'hex') AS a, encode(state_key, 'hex') AS s, encode(zswap_state_key, 'hex') AS z
     FROM core_contract_states.states ORDER BY height, contract_address`,
  );
  const byHeight = new Map<bigint, { address: string; stateKey: string; zswapKey: string }[]>();
  for (const row of rows) {
    const height = BigInt(row.h as string);
    byHeight.set(height, [...(byHeight.get(height) ?? []), { address: `0x${row.a as string}`, stateKey: row.s as string, zswapKey: row.z as string }]);
  }
  return byHeight;
}

/**
 * CC-1 (A108): the process reached the head; `core_contract_states.states` holds exactly one row per contract and
 * height the scenario expects — so one for two calls of one contract in one block, and one for every contract at F —,
 * each key held (a positive root count, LG-13) and rebuilding, from the stored nodes alone, into the reference replay's
 * contract state and zswap state after that block.
 */
export async function stateProblems(db: ProcessDatabase, status: ProcessStatus, expected: ContractScenario): Promise<string[]> {
  const problems = reachedProblems(status, expected.scenario.head);
  const rows = await stateRows(db);
  const nodeRows = await db.query("SELECT encode(node_key, 'hex') AS k, data, children FROM core_ledger_state.nodes");
  const nodes = new Map(nodeRows.map((row) => [row.k as string, { data: Uint8Array.from(row.data as Uint8Array), children: Uint8Array.from(row.children as Uint8Array) }]));
  const counts = new Map((await db.query("SELECT encode(node_key, 'hex') AS k, count FROM core_ledger_state.root_counts")).map((row) => [row.k as string, Number(row.count)]));
  const heights = new Set([...rows.keys(), ...expected.states.keys()]);
  for (const height of [...heights].sort((a, b) => (a < b ? -1 : 1))) {
    const stored = rows.get(height) ?? [];
    const want = expected.states.get(height) ?? [];
    const addresses = stored.map((row) => row.address);
    if (JSON.stringify(addresses) !== JSON.stringify(want)) {
      problems.push(`at ${height} the rows are of ${addresses.join(", ") || "no contract"}, not of ${want.join(", ") || "no contract"}`);
    }
    for (const row of stored) {
      const reference = expected.scenario.heights[Number(height)]?.contracts.get(row.address);
      if (reference === undefined) {
        problems.push(`the reference state after ${height} holds no contract ${row.address}`);
        continue;
      }
      for (const [name, key, value] of [
        ["state", row.stateKey, reference.state],
        ["zswap state", row.zswapKey, reference.zswap],
      ] as const) {
        if ((counts.get(key) ?? 0) < 1) problems.push(`${row.address}'s ${name} key at ${height} is not held`);
        try {
          const rebuilt = rebuildTagged(nodesOfTagged(value).tag, Uint8Array.from(Buffer.from(key, "hex")), (k) => nodes.get(k));
          if (plain(rebuilt) !== plain(value)) problems.push(`${row.address}'s ${name} at ${height} loads as another value than the reference's`);
        } catch (error) {
          problems.push(`${row.address}'s ${name} at ${height} does not load from its key: ${String(error)}`);
        }
      }
    }
  }
  return problems;
}

/** `core-ledger-state` and the modules it requires, with `core-contract-states` and `core-contract-logs-full`. */
export const FULL_CORE: readonly ModuleDeclaration[] = Object.freeze([...LEDGER_CORE, CORE_CONTRACT_STATES, CORE_CONTRACT_LOGS_FULL]);

/** The chain's core modules `core-contract-logs-fast` requires, and it (development only: the tests' opt-in is on). */
export const FAST_CORE: readonly ModuleDeclaration[] = Object.freeze([CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_CONTRACT_LOGS_FAST]);

/** What a run gave: the status when it settled, the log lines, and the halt's or refusal's line where it stopped. */
export interface Ran {
  readonly status: ProcessStatus;
  readonly lines: readonly string[];
  readonly halt: string | undefined;
}

/**
 * Runs the process on `db` from 0 over a tape node serving `records`, with `options` (`./ingest-harness.ts`), until its
 * cursor is `head` or it halted; then stops it.
 */
export async function runRange(
  db: ProcessDatabase,
  records: LedgerScenario["records"],
  head: bigint,
  options: Omit<IngestOptions, "start">,
  patience: number = PATIENCE_MS * 2,
): Promise<Ran> {
  const run: Ingest = await ingest(db, records, { start: 0n, ...options });
  let status: ProcessStatus;
  try {
    const settled = (): boolean => {
      const now = run.handle.status();
      return now.cursor === head || now.state === "halted" || now.state === "refused";
    };
    await until(run, settled, `the cursor at ${head}, a halt or a refusal`, patience);
    status = run.handle.status();
  } finally {
    await run.close();
  }
  return { status, lines: run.lines, halt: run.lines.find((line) => line.includes("processing halted") || line.includes("refused")) };
}

// ── task 13.1's scenarios (A108–A110) ─────────────────────────────────────────────────────────────────────────────

/** A log value's data as `contract_logs.logs` stores it (the VM's decoding), as hex. */
export function dataOf(value: Parameters<typeof decodedLog>[0]): string {
  return Buffer.from(decodedLog(value)!.data).toString("hex");
}

/**
 * A109's scenario: a contract deployed at 1; at 2 a call whose guaranteed transcript logs a wrapper and whose fallible
 * one logs a cell and then fails (a partial success); at 3 a call logging a cell and, in a fallible transcript that
 * succeeds, a wrapper.
 */
export async function a109Scenario(): Promise<ContractScenario> {
  const [contract] = await contractsFor("v9", 1);
  return contractScenario({
    ledger: "v9",
    blocks: [
      [{ kind: "deploy", contract: contract! }],
      [{ kind: "call", contract: contract!, logs: [wrapper(1, 5, cellValue(Uint8Array.of(4, 5)))], fallibleLogs: [cellValue(Uint8Array.of(8))], fallibleFails: true }],
      [{ kind: "call", contract: contract!, logs: [cellValue(Uint8Array.of(9))], fallibleLogs: [wrapper(2, 0, cellValue(Uint8Array.of(1)))] }],
    ],
  });
}

/** A110's halt scenario: literal logs at 2 and 4, and at 3 a literal log then a log of the contract's state. */
export async function a110HaltScenario(): Promise<ContractScenario> {
  const [contract] = await contractsFor("v9", 1);
  const call = (byte: number) => ({ kind: "call" as const, contract: contract!, logs: [cellValue(Uint8Array.of(byte))] });
  return contractScenario({
    ledger: "v9",
    blocks: [
      [{ kind: "deploy", contract: contract! }],
      [call(1)],
      [call(2), { ...call(3), tail: LOG_STATE, tailLogs: [{ tag: "array", content: [] }] }],
      [call(4)],
    ],
  });
}

/**
 * A110's range of literal logs: two contracts; well-formed wrappers of several versions and event types; malformed ones
 * — a cell, a wrapper whose event type is no event type, a two-element array —, each a version-0 `Misc` log of the
 * whole value; oversized ones (a cell of 1,100 bytes, a wrapper whose data is 2,000 bytes), which give no log; a
 * successful fallible segment's logs; a chain-failed transaction's logs (none); a partial success with no log; an empty
 * block.
 */
export async function a110Range(): Promise<ContractScenario> {
  const [one, two] = await contractsFor("v9", 2);
  const cell = (...bytes: number[]) => cellValue(Uint8Array.from(bytes));
  return contractScenario({
    ledger: "v9",
    blocks: [
      [{ kind: "deploy", contract: one! }, { kind: "deploy", contract: two! }],
      [
        { kind: "call", contract: one!, logs: [wrapper(1, 5, cell(4, 5)), cell(9)] },
        { kind: "call", contract: two!, logs: [wrapper(0, 10, cell(3))] },
      ],
      [
        {
          kind: "call",
          contract: one!,
          logs: [wrapper(3, 200, cell(6)), { tag: "array", content: [cell(1), cell(2)] }, wrapper(70_000, 8, cell(0x01))],
          fallibleLogs: [wrapper(7, 1, cell(2)), cell(0xee)],
        },
      ],
      [{ kind: "call", contract: two!, logs: [bigCell(1, 1_100), wrapper(1, 4, bigCell(2, 2_000)), cell(5)] }],
      [{ kind: "call", contract: one!, logs: [cell(1)], outcome: "failure" }],
      [{ kind: "call", contract: two!, fallibleFails: true }],
      [],
      [
        { kind: "call", contract: one!, logs: [wrapper(1, 9, cell(0xaa))] },
        { kind: "call", contract: two!, logs: [cell(0xbb)], fallibleLogs: [cell(0xcc)] },
      ],
    ],
  });
}
