import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  FLUSH_LINES,
  OTHER_STATEMENTS,
  STATEMENT_TEXTS,
  startTrace,
  stopTrace,
  traceEndBlock,
  type TraceSink,
} from "../../src/trace/trace.js";
import { BACKUP_BACKENDS, type BackupBackend } from "../backup/backup-fixtures.js";

/**
 * The block trace when something fails or overflows (`src/trace/trace.ts`), on PostgreSQL 18, through the database API:
 * - reads that differ by a comment, more texts than the statements' totals keep by name: the first texts by name, every
 *   other statement in one last entry, none lost.
 */

const postgres = BACKUP_BACKENDS.find((backend) => backend.kind === "postgres") as BackupBackend;

/** What a sink was given, as lines and the statements' last totals. */
function memorySink() {
  const kept = { blocks: "", statements: "[]" };
  const sink: TraceSink = {
    blocks: (text) => void (kept.blocks += text),
    statements: (json) => void (kept.statements = json),
    worker: () => undefined,
  };
  return {
    sink,
    blocks: (): Record<string, unknown>[] =>
      kept.blocks === "" ? [] : kept.blocks.trimEnd().split("\n").map((line) => JSON.parse(line) as Record<string, unknown>),
    statements: () => JSON.parse(kept.statements) as { q: string; n: number; ms: number; max: number }[],
  };
}

describe("the block trace when something fails or overflows, on PostgreSQL", () => {
  beforeAll(() => postgres.start(), 180_000);
  afterAll(() => postgres.stop(), 60_000);
  afterEach(() => stopTrace());

  it(`reads that differ by a comment, over ${STATEMENT_TEXTS} texts: the first texts by name, the others in one last entry, across a flush, none lost`, async () => {
    const db = await postgres.database();
    const trace = memorySink();
    startTrace(trace.sink);
    const sent = STATEMENT_TEXTS + 100;
    const read = (from: number) =>
      db.read(async (handle) => {
        for (let i = from; i < from + sent; i++) await handle.query(`SELECT 1 /* ${i} */`);
      });
    await read(0);
    // A flush, then as many new texts again.
    for (let height = 1; height <= FLUSH_LINES; height++) traceEndBlock(BigInt(height));
    const atFlush = trace.statements();
    await read(sent);
    traceEndBlock(BigInt(FLUSH_LINES + 1));
    stopTrace();
    const statements = trace.statements();
    for (const totals of [atFlush, statements]) {
      expect(totals).toHaveLength(STATEMENT_TEXTS + 1);
      expect(totals.at(-1)?.q).toBe(OTHER_STATEMENTS);
    }
    // The first texts sent are kept by name, the read's own statements among them; the last are not.
    const names = new Set(statements.map((statement) => statement.q));
    expect(names.has("SELECT 1 /* 0 */")).toBe(true);
    expect(names.has(`SELECT 1 /* ${2 * sent - 1} */`)).toBe(false);
    expect(statements.at(-1)?.n).toBeGreaterThanOrEqual(sent + 100);
    // Every statement the session sent is in the totals: as many as the lines counted.
    const lines = trace.blocks();
    const counted = lines.reduce((sum, line) => sum + ((line.sqlN as number | undefined) ?? 0), 0);
    expect(statements.reduce((sum, statement) => sum + statement.n, 0)).toBe(counted);
    expect(counted).toBeGreaterThanOrEqual(2 * sent);
  }, 120_000);
});
