import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { UmbraError } from "../../src/db/errors.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import { type FixtureNode, LAST, stateNodes } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { sweepTables, type TableSnapshot } from "./ledger-graph-tapes.js";
import { copyDatabase } from "./ledger-refcount-halts.js";
import { runDag } from "./refcount-process.js";
import { referenceAfter } from "./refcount-reference.js";

/**
 * Count tables that lost a row, on PostgreSQL 18 and PGlite 0.5.10, on the extended DAG fixture through the real
 * process. A database is built to 5 and copied, and the copy's `ref_counts` row of S, the second reference of the root
 * after 5 (still referenced by the roots after 6 to 10, not after 11), is deleted. The run then goes on from 5.
 *
 * The reclamation reads the counts of the keys whose count falls in a block, and assumes undamaged count tables
 * otherwise. So the build commits 6 to 10, where the per-block step (`./refcount-step.ts`, the reference), which reads
 * the counts of every key it reaches, halts at 6 with `missing-reference`; and the build halts at 11 with
 * `negative-count`, when the root after 11 no longer references S and S's count would fall below 0, where the reference
 * step over the same tables and 11's flush halts with `negative-count` too.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The root's references after `height` on the extended DAG. */
const rootRefs = (height: number): string[] => (stateNodes(height, "extended")[0] as FixtureNode).refs.map(hex);

/** The key whose count row is deleted, the height after which it is, and the height at which the build halts. */
const S = rootRefs(5)[1] as string;
const DAMAGED_AT = 5n;
const HALT_AT = 11n;

/** Where the reference step halts over `before` and `flushed` at `height`: its reason, or null when it stores the block. */
async function referenceHalt(height: bigint, before: TableSnapshot, flushed: NodeBatch): Promise<string | null> {
  try {
    await referenceAfter(height, before, flushed);
    return null;
  } catch (error) {
    if (error instanceof UmbraError && error.code === "ledger-refcount-invalid") return String(error.details.reason);
    throw error;
  }
}

/** `host` keeping the flush of every block it applies, by height. */
function keepingFlushes(flushes: Map<bigint, NodeBatch>): (host: LedgerHost) => LedgerHost {
  return (host) => ({
    useDatabase: (database) => host.useDatabase(database),
    parse: (ledger, block, transactions) => host.parse(ledger, block, transactions),
    genesisRoot: (ledger, bytes) => host.genesisRoot(ledger, bytes),
    genesis: (input, read) => host.genesis(input, read),
    async apply(input, read) {
      const applied = await host.apply(input, read);
      flushes.set(input.height, applied.batch);
      return applied;
    },
    commit: (block) => host.commit(block),
    release: (drop) => host.release(drop),
    load: (input, read) => host.load(input, read),
    retained: (input, read) => host.retained(input, read),
    evict: (keys) => host.evict(keys),
    tasks: (input, read) => host.tasks(input, read),
    probe: () => host.probe(),
    restart: () => host.restart(),
    get restarts() {
      return host.restarts;
    },
    activity: () => host.activity(),
    bridge: () => host.bridge(),
    get failure() {
      return host.failure;
    },
    close: () => host.close(),
  });
}

describe.each(PROCESS_BACKENDS)("count tables that lost a row, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("S's count row deleted after 5: the build commits 6 to 10, where the reference step halts at 6 with missing-reference, and halts at 11 with negative-count, where the reference step over the same tables halts with negative-count", async () => {
    // S is referenced by the roots after 4 to 10 and not after 11.
    expect([4, 5, 6, 10, 11].map((h) => rootRefs(h).includes(S))).toEqual([true, true, true, true, false]);
    const db = await backend.database();
    const built = await runDag(db, { dag: "extended", last: Number(DAMAGED_AT) });
    expect(built.status.cursor).toBe(DAMAGED_AT);
    expect(built.tables.get(DAMAGED_AT)?.refs.get(S)).toBe(2);
    const copied = await copyDatabase(db);
    try {
      await copied.copy.query(`DELETE FROM core_ledger_state.ref_counts WHERE node_key = decode('${S}', 'hex')`);
      const damaged = await sweepTables(copied.copy);
      expect(damaged.refs.has(S)).toBe(false);
      expect(damaged.rows.has(S)).toBe(true);

      const flushes = new Map<bigint, NodeBatch>();
      const run = await runDag(copied.copy, { dag: "extended", resume: DAMAGED_AT, last: LAST, halts: true, worker: keepingFlushes(flushes) });

      // The build committed 6, where the reference step over the damaged tables and 6's flush halts.
      const six = DAMAGED_AT + 1n;
      expect(await referenceHalt(six, damaged, flushes.get(six) as NodeBatch)).toBe("missing-reference");
      expect(run.cursor).toBeGreaterThanOrEqual(six);

      // The build halted at 11 with ledger-refcount-invalid (negative-count, S), nothing of 11 stored; the reference
      // step over the tables after 10 and 11's flush halts with negative-count too.
      expect(run.status).toMatchObject({
        state: "halted",
        cursor: HALT_AT - 1n,
        reason: { code: "ledger-refcount-invalid", height: HALT_AT, module: CORE_LEDGER_STATE_ID, point: "on-settle" },
      });
      const error = run.errors.at(-1);
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details).toMatchObject({ reason: "negative-count", height: HALT_AT, key: `0x${S}` });
      const before = run.tables.get(HALT_AT - 1n) as TableSnapshot;
      expect(before.rows.has(S)).toBe(true);
      expect(before.refs.has(S)).toBe(false);
      expect(await referenceHalt(HALT_AT, before, flushes.get(HALT_AT) as NodeBatch)).toBe("negative-count");
    } finally {
      await copied.close();
    }
  }, PATIENCE_MS * 6);
});
