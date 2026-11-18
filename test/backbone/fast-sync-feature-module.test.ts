import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { BlockWriteHandle, ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { equalityWatcher, hashDifferences, hashed } from "./fast-sync-equality.js";
import { restartingBefore } from "./fast-sync-worker.js";
import { type Ingest, PATIENCE_MS } from "./ingest-harness.js";
import { runDag } from "./refcount-process.js";

/**
 * A module that is not a core part, in fast-sync mode, through the real process on the DAG fixture, on PostgreSQL 18
 * and PGlite 0.5.10: chunks of 7 against the mode off. Module `feat` has its own schema, reads and writes at every
 * point that has a handle, writes a row per block at `on-settle`, and at `on-after-db-write` reads its row of the
 * block by `block.height` and sends the value (as an emit would); its API route answers a block's value. Checked:
 * every table of every schema equal at every height (inside the transaction and committed), the same values sent in
 * the same order, the same route answers for every height, and the same log per point and height; also after a chunk
 * stored again (a lost connection in its writes, the worker restarted with the cursor before the chunk in the
 * reference).
 */

/** What `feat` saw: `<point>@<h> <value>` lines, and the values it sent after each commit, in order. */
interface FeatSeen {
  readonly log: string[];
  readonly sent: string[];
}

/** Module `feat` (see the module comment); its `on-db-write` of `failAt` fails once with a lost connection, after its writes. */
function feature(seen: FeatSeen, failAt?: bigint): ModuleDeclaration {
  let failed = false;
  const highest = async (read: Pick<ReadHandle, "query">): Promise<string> => {
    const [row] = await read.query("SELECT coalesce(max(height), -1)::text AS h, count(*)::text AS n FROM feat.rows");
    return `${row?.h as string}/${row?.n as string}`;
  };
  return {
    id: "feat",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "feat-rows", lifetimes: ["table"], table: { schema: "feat", tables: ["rows", "settled"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [
      {
        id: "001",
        sql: "CREATE TABLE feat.rows (height bigint PRIMARY KEY, value text NOT NULL); CREATE TABLE feat.settled (first bigint PRIMARY KEY, last bigint NOT NULL, seen text NOT NULL)",
      },
    ],
    points: {
      async "on-finalized"(_p, head, read) {
        seen.log.push(`on-finalized@${head.height} ${await highest(read)}`);
      },
      async "on-fetch"(_p, b: BlockContext) {
        seen.log.push(`on-fetch@${b.height}`);
      },
      async "on-parse"(_p, b: BlockContext) {
        seen.log.push(`on-parse@${b.height}`);
      },
      async "on-start-height"(_p, started, read) {
        seen.log.push(`on-start-height@${started.height} ${await highest(read)}`);
      },
      async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
        seen.log.push(`on-compute@${b.height} ${await highest(read)} ${String(b.continues)}`);
      },
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        const before = await highest(w);
        await w.execute("INSERT INTO feat.rows (height, value) VALUES ($1, $2)", [b.height, `v${b.height} after ${before}`]);
        seen.log.push(`on-db-write@${b.height} ${before} ${String(b.continues)}`);
        if (b.height === failAt && !failed) {
          failed = true;
          throw new UmbraError("connection-lost", `the connection was lost at ${b.height} (the test's module)`);
        }
      },
      async "on-settle"(_p, run, w: BlockWriteHandle) {
        const now = await highest(w);
        await w.execute("INSERT INTO feat.settled (first, last, seen) VALUES ($1, $2, $3)", [run.first, run.last, now]);
        seen.log.push(`on-settle@${run.first} ${now}`);
      },
      async "on-after-db-write"(_p, b: BlockContext, read: ReadHandle) {
        // Read by the block's height: the database may already hold later blocks.
        const [row] = await read.query("SELECT value FROM feat.rows WHERE height = $1", [b.height]);
        seen.sent.push(`${b.height} ${row?.value as string}`);
        seen.log.push(`on-after-db-write@${b.height}`);
      },
      async "on-start-api"(_p, api) {
        api.http("GET", "/value/:height", async (request, read) => {
          const [row] = await read.query("SELECT value FROM feat.rows WHERE height = $1", [BigInt(request.params.height as string)]);
          return { status: 200, body: { value: (row?.value as string | undefined) ?? null } };
        });
      },
    },
  };
}

describe("a module that is not a core part in fast-sync mode, through the process, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  /** One run of `feat` with the equality watcher; its route's answer for every height, asked once it reached the end. */
  async function featRun(backend: ProcessBackend, settings: Readonly<Record<string, unknown>>, failAt?: bigint, restartBefore?: bigint) {
    const seen: FeatSeen = { log: [], sent: [] };
    const hashes = hashed();
    const answers: (string | null)[] = [];
    const run = await runDag(await backend.database(), {
      settings: { ...settings, listen: { api: "127.0.0.1:0" }, backoffCeilingMs: 20 },
      user: [equalityWatcher(hashes), feature(seen, failAt)],
      ...(restartBefore === undefined ? {} : { worker: (host) => restartingBefore(host, restartBefore) }),
      atLast: async (process: Ingest) => {
        const { api } = await process.handle.started;
        for (let h = 0; h <= LAST; h++) {
          const response = await fetch(`http://${api?.host}:${api?.port}/value/${h}`);
          answers.push(((await response.json()) as { value: string | null }).value);
        }
      },
    });
    expect(run.cursor).toBe(BigInt(LAST));
    return { seen, hashes, answers };
  }

  /** `log` as a sorted list, by point and height. */
  const sortedLog = (log: readonly string[]): string[] => [...log].sort();

  for (const backend of PROCESS_BACKENDS as readonly ProcessBackend[]) {
    it(`on ${backend.name}: equal rows, values sent, route answers and log per point and height`, async () => {
      const off = await featRun(backend, {});
      const on = await featRun(backend, { fastSync: { blocks: 7, distance: 0 } });
      expect(hashDifferences(on.hashes.inside, off.hashes.inside)).toEqual([]);
      expect(hashDifferences(on.hashes.committed, off.hashes.committed)).toEqual([]);
      expect(on.seen.sent).toEqual(off.seen.sent);
      expect(on.answers).toEqual(off.answers);
      expect(on.answers.every((answer) => answer !== null)).toBe(true);
      expect(sortedLog(on.seen.log)).toEqual(sortedLog(off.seen.log));
    }, PATIENCE_MS * 3);

    it(`on ${backend.name}: after a chunk stored again, equal rows, the last value sent per height and route answers`, async () => {
      // 12 fails once in its writes: the chunk 7..13 rolls back after its worker was led past 7 to 11.
      const off = await featRun(backend, {}, 12n, 6n);
      const on = await featRun(backend, { fastSync: { blocks: 7, distance: 0 } }, 12n);
      expect(hashDifferences(on.hashes.inside, off.hashes.inside)).toEqual([]);
      expect(hashDifferences(on.hashes.committed, off.hashes.committed)).toEqual([]);
      const lastSent = (sent: readonly string[]) => [...new Map(sent.map((line) => [line.split(" ")[0], line])).values()];
      expect(lastSent(on.seen.sent)).toEqual(lastSent(off.seen.sent));
      expect(on.answers).toEqual(off.answers);
    }, PATIENCE_MS * 3);
  }
});
