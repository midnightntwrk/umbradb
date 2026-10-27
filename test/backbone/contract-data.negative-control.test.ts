import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ContractLog } from "../../src/backbone/contract-logs/contract-logs.js";
import { blockParsedItemOf } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { coreContractLogsFast } from "../../src/backbone/core-contract-logs-fast/core-contract-logs-fast.js";
import { mainThreadLogReader as inThreadLogReader } from "./main-thread-log-reader.js";
import { coreContractLogsFull } from "../../src/backbone/core-contract-logs-full/core-contract-logs-full.js";
import { type ContractStateRow, contractStatesOf, coreContractStates } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { txResultsItemOf } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { BlockContext } from "../../src/modules/declaration.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import {
  a109Scenario,
  a110HaltScenario,
  type ContractScenario,
  contractScenario,
  contractsFor,
  dataOf,
  FAST_CORE,
  FULL_CORE,
  haltProblems,
  logLines,
  logProblems,
  runRange,
  setState,
  stateProblems,
} from "./contract-data-checks.js";
import { handoff, handoffProblems, handoffScenario } from "./contract-logs-handoff.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { LEDGER_CORE } from "./ledger-restart.js";
import { cellValue } from "../ledger/adapter-fixtures.js";

/**
 * The committed negative controls of task 13.1's criteria (`openspec/changes/core-arch/acceptance.md` A108–A111): each
 * runs the real modules with one rule replaced, through the criterion's own scenario and oracle
 * (`./contract-data-checks.ts`, `./contract-logs-handoff.ts`), and shows the oracle failing.
 *
 * - A108: a `core-contract-states` writing one row per call, not per contract and block, fails "one row with the state
 *   after both": the second call's row is refused by the table's key, and processing halts.
 * - A109: a `core-contract-logs-full` taking every literal the transcripts log — a failed fallible segment's too —
 *   stores a log the ledger did not emit.
 * - A110: a `core-contract-logs-fast` that guesses (no log) instead of halting on a value read from state does not halt,
 *   and stores other rows than `-full`.
 * - A111: a handoff that skips h + 1 leaves a gap; one that repeats it is refused (`providers-overlap`), and one that
 *   starts `-fast` at h, the backup's cursor, too (`changes-past`).
 */

/** A108's control: one row per call or deploy of the block (`block-parsed`), with the keys the ledger state gave its contract. */
function perCall(b: BlockContext): ContractStateRow[] {
  const keys = new Map(contractStatesOf(b).map((row) => [Buffer.from(row.address).toString("hex"), row]));
  return blockParsedItemOf(b, "core-contract-states").transactions.flatMap((transaction) =>
    transaction.segments.flatMap((segment) =>
      [...segment.calls, ...segment.deploys].flatMap(({ address }) => {
        const row = keys.get(Buffer.from(address).toString("hex"));
        return row === undefined ? [] : [row];
      }),
    ),
  );
}

/** A109's control: every literal each transaction not failed on chain logs, whatever its segments' results. */
async function everyLiteral(b: BlockContext): Promise<ContractLog[]> {
  const { ledger, transactions } = blockParsedItemOf(b, "core-contract-logs-full");
  const outcomes = txResultsItemOf(b);
  const sites = await inThreadLogReader().read(ledger, transactions.map((transaction) => transaction.bytes));
  const logs: ContractLog[] = [];
  sites.forEach((list, transaction) => {
    if (outcomes[transaction] === "failure") return;
    for (const site of list) {
      if (!("literal" in site.read) || site.read.literal === null) continue;
      logs.push({ transaction, index: logs.length, address: site.address, entryPoint: site.entryPoint, logicalSegment: 0, ...site.read.literal });
    }
  });
  return logs;
}

describe.each(PROCESS_BACKENDS)("task 13.1's negative controls on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A108's control: a states module writing one row per call fails its oracle — the second call's row is refused and processing halts", async () => {
    const [contract] = await contractsFor("v9", 1);
    const expected: ContractScenario = await contractScenario({
      ledger: "v9",
      blocks: [[{ kind: "deploy", contract: contract! }], [{ kind: "call", contract: contract!, tail: setState(1) }, { kind: "call", contract: contract!, tail: setState(2) }]],
    });
    const db = await backend.database();
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: [...LEDGER_CORE, coreContractStates({ rowsOf: perCall })] });
    const problems = await stateProblems(db, ran.status, expected);
    expect(problems).toEqual(expect.arrayContaining([expect.stringMatching(/^the process halted with .*core-contract-states/), "the cursor is 1, not 2"]));
    expect(problems.some((problem) => /at 2 the rows are of no contract/.test(problem))).toBe(true);
  }, PATIENCE_MS * 2);

  it("A109's control: a -full storing every literal of the transcripts stores the failed fallible segment's log, which its oracle names", async () => {
    const expected = await a109Scenario();
    const db = await backend.database();
    const core = [...LEDGER_CORE, coreContractLogsFull({ logsOf: everyLiteral })];
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core });
    const problems = await logProblems(db, ran.status, expected);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((problem) => problem.startsWith("extra log row 2 0 1"))).toBe(true);
    expect((await logLines(db)).map((line) => line.split(" ")[8])).toContain(dataOf(cellValue(Uint8Array.of(8))));
  }, PATIENCE_MS * 2);

  it("A110's control: a -fast that guesses no log instead of halting on a value read from state does not halt, and stores other rows than -full", async () => {
    const expected = await a110HaltScenario();
    const db = await backend.database();
    const guessing = coreContractLogsFast({ onUnsure: () => undefined });
    const ran = await runRange(db, expected.scenario.records, expected.scenario.head, { core: [...FAST_CORE.slice(0, -1), guessing] });
    expect(await haltProblems(db, ran.status, expected, 3n, 1, ran.halt)).toEqual(
      expect.arrayContaining([`the process is ${ran.status.state}, not halted`, "the cursor is 4, not 2"]),
    );
    expect((await logProblems(db, ran.status, expected)).some((problem) => problem.startsWith("missing log row 3 1"))).toBe(true);
    // The rule as shipped halts on the same chain (the criterion's test); FULL_CORE stores the state's log there.
    expect(FULL_CORE.at(-1)?.id).toBe("core-contract-logs-full");
  }, PATIENCE_MS * 2);
});

describe.each(BACKUP_BACKENDS)("A111's negative controls on $name", (backend: BackupBackend) => {
  beforeAll(async () => {
    await backend.start();
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
  }, 300_000);
  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    await backend.stop();
  }, 120_000);

  it("A111's control: a switch that skips h + 1 (-fast from h + 2) leaves h + 1's logs out, which its oracle names", async () => {
    const expected = await handoffScenario();
    const result = await handoff(backend, expected, { h: 3n, fastFrom: 5n });
    const problems = await handoffProblems(result, expected);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((problem) => problem.startsWith("missing log row 4 "))).toBe(true);
  }, PATIENCE_MS * 4);

  it("A111's control: a switch that repeats h + 1 (-full to h + 1, -fast from h + 1) is refused at startup with providers-overlap, which its oracle names", async () => {
    const expected = await handoffScenario();
    const result = await handoff(backend, expected, { h: 3n, fullTo: 4n, fastFrom: 4n });
    const problems = await handoffProblems(result, expected);
    expect(problems.join(" | ")).toMatch(/the process refused with \{"code":"providers-overlap"/);
    expect(problems.some((problem) => problem.startsWith("missing log row 4 "))).toBe(true);
  }, PATIENCE_MS * 4);

  it("A111's control: -fast from h itself, at the backup's cursor, is refused (changes-past: the past cannot change)", async () => {
    const expected = await handoffScenario();
    const result = await handoff(backend, expected, { h: 3n, fastFrom: 3n });
    expect((await handoffProblems(result, expected)).join(" | ")).toMatch(/the process refused with \{"code":"changes-past"/);
  }, PATIENCE_MS * 4);
});
