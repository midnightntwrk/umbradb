import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { UmbraError } from "../../src/db/errors.js";
import { type LedgerHost, type NodeDatabase, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { core, entryOf, settle, startProcess } from "../runner/process-build.js";
import { chainDeclarations } from "./chain-build.js";
import { PATIENCE_MS } from "./ingest-harness.js";

/**
 * The process's ledger worker (task 12.3; LG-10, design.md §5.3): the runner starts one when its graph has
 * `core-block-parsed` or `core-ledger-state` — once, though a retryable failure runs startup again (IN-10) — and closes
 * it with the process, so no thread of it outlives `stop()`; a graph with neither starts none. On PGlite: the criterion
 * is about the runner's threads, not stored data.
 */

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

/** A ledger worker factory counting the workers it starts and the closes each got. */
function counted() {
  const made: { closes: number; host: LedgerHost; databases: (NodeDatabase | null)[] }[] = [];
  const factory = (): LedgerHost => {
    const host = startLedgerWorker();
    const record = { closes: 0, host, databases: [] as (NodeDatabase | null)[] };
    made.push(record);
    return {
      useDatabase: (database) => {
        record.databases.push(database);
        host.useDatabase(database);
      },
      parse: (...args) => host.parse(...args),
      genesisRoot: (...args) => host.genesisRoot(...args),
      genesis: (...args) => host.genesis(...args),
      apply: (...args) => host.apply(...args),
      commit: (...args) => host.commit(...args),
      release: (...args) => host.release(...args),
      load: (...args) => host.load(...args),
      retained: (...args) => host.retained(...args),
      evict: (...args) => host.evict(...args),
      probe: () => host.probe(),
      activity: () => host.activity(),
      bridge: () => host.bridge(),
      get failure() {
        return host.failure;
      },
      close() {
        record.closes += 1;
        return host.close();
      },
    };
  };
  return { made, factory };
}

describe("the process's ledger worker (LG-10)", () => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("is started once, though startup is retried, bound to core-block-parsed, and closed with the process", async () => {
    const db = await backend.database();
    class Flaky extends InMemoryBlockSource {
      failures = 1;
      override waitForHead(above: bigint, signal: AbortSignal): Promise<void> {
        if (this.failures === 0) return super.waitForHead(above, signal);
        this.failures -= 1;
        return Promise.reject(new UmbraError("node-unreachable", "the node did not answer"));
      }
    }
    const source = new Flaky({ head: 3n });
    const workers = counted();
    const coreModules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED];
    const handle = startProcess({
      declarations: chainDeclarations([], { core: coreModules }),
      config: { data: { entries: [core(db.setting, 5), ...coreModules.map((m) => entryOf(m, 5))] } },
      source,
      log: () => undefined,
      admin: false,
      ledgerWorker: workers.factory,
    });
    try {
      await source.waiting(4n);
      source.finalize(7n);
      expect(await settle(handle, source, 7n)).toBe("waiting");
      expect(handle.status()).toMatchObject({ cursor: 7n, reason: null });
      expect(workers.made).toHaveLength(1);
      expect(workers.made[0]?.closes).toBe(0);
      // A parse, given no read, reads stored nodes through the process's database: the runner gives it (each startup).
      const [database] = workers.made[0]?.databases ?? [];
      expect(workers.made[0]?.databases.length).toBeGreaterThanOrEqual(1);
      const rows = await database?.read((read) => read.query("SELECT max(height)::text AS h FROM core_block_commit.blocks"));
      expect(rows).toEqual([{ h: "7" }]);
    } finally {
      await handle.stop();
    }
    expect(workers.made.map((worker) => worker.closes)).toEqual([1]);
    await expect(workers.made[0]?.host.parse("v9", { height: 1n, hash: new Uint8Array(32) }, [])).rejects.toThrow(/closed/);
  }, PATIENCE_MS);

  it("is not started for a graph that neither parses nor applies", async () => {
    const db = await backend.database();
    const source = new InMemoryBlockSource({ head: 3n });
    const workers = counted();
    const handle = startProcess({
      declarations: chainDeclarations([]),
      config: { data: { entries: [core(db.setting, 1)] } },
      source,
      log: () => undefined,
      admin: false,
      ledgerWorker: workers.factory,
    });
    try {
      expect(await settle(handle, source, 3n)).toBe("waiting");
    } finally {
      await handle.stop();
    }
    expect(workers.made).toEqual([]);
  }, PATIENCE_MS);
});
