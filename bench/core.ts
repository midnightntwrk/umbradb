import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { commandBuild } from "../src/cli/build-modules.js";
import { coreEntry, InMemoryBlockSource, startProcess } from "../src/index.js";
import { inMemoryBlock } from "../src/runner/in-memory-source.js";
import { startBenchEnv } from "./environment.js";
import { measureManual, summarize } from "./stats.js";
import type { Backend, LatencyStats } from "./types.js";

/**
 * The core's benchmark (`openspec/changes/core-arch/design.md` §13, Benchmarks: "`runner.commitEmptyBlock` per
 * backend"; task 17.3): the time from a new finalized head to the runner having committed that block and waiting for
 * the next, for an empty block (an in-memory block: no extrinsic, no chain event), on PGlite and on PostgreSQL.
 *
 * The process is the `umbradb` command's build (`commandBuild`: the public backbone, its core modules off, no user
 * module) over an `InMemoryBlockSource`, started through §12's `startProcess` and `coreEntry` on a `custom` network
 * whose genesis is the in-memory chain's, the admin endpoints off. Each sample is one block: the source's head raised
 * by one, then the wait until the loop waits past it (`waiting`).
 */

/** The workload name of a backend, as the baseline records it. */
export const workloadName = (backend: Backend): string => `runner.commitEmptyBlock.${backend}`;

/** How many blocks are committed before measuring, and how many are measured. */
export interface CommitOptions {
  readonly warmup: number;
  readonly iterations: number;
}

/** The ledger table of the benchmark's `custom` network: every `spec_version` is ledger v9's. */
const LEDGER_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" as const }] };

const GENESIS = `0x${Buffer.from(inMemoryBlock(0n).hash).toString("hex")}`;

/** Commits `options.warmup` then `options.iterations` empty blocks on `database`; the measured blocks' times in ms. */
async function commitSamples(database: object, options: CommitOptions): Promise<number[]> {
  const source = new InMemoryBlockSource({ head: 0n });
  const lines: string[] = [];
  const handle = startProcess({
    declarations: commandBuild([]),
    config: {
      data: {
        entries: [
          coreEntry({
            start: 0,
            config: {
              network: "custom",
              genesisHash: GENESIS,
              ledgerTable: LEDGER_TABLE,
              database: database as never,
              node: "ws://127.0.0.1:9/unused",
              developmentOptIn: true,
            },
          }),
        ],
      },
    },
    source,
    admin: false,
    log: (line) => lines.push(line),
  });
  try {
    await handle.started;
    const ended = handle.ended.then((end) => {
      throw new Error(`the benchmark's process ended (${JSON.stringify(end)}): ${lines.join(" | ")}`);
    });
    const committed = (height: bigint) => Promise.race([source.waiting(height), ended]);
    await committed(0n);
    let height = 0n;
    return await measureManual(
      async () => {
        height += 1n;
        source.finalize(height);
        await committed(height);
      },
      { warmup: options.warmup, iterations: options.iterations },
    );
  } finally {
    await handle.stop();
  }
}

/** `runner.commitEmptyBlock` on a PGlite database in a new temporary directory, removed afterwards. */
export async function commitEmptyBlockPglite(options: CommitOptions): Promise<LatencyStats> {
  const directory = mkdtempSync(join(tmpdir(), "umbradb-bench-"));
  try {
    return summarize(await commitSamples({ kind: "pglite", path: join(directory, "db") }, options));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

/** What the PostgreSQL run reports besides its statistics: the server, for the baseline's environment. */
export interface PostgresRun {
  readonly stats: LatencyStats;
  readonly serverVersion: string;
  readonly imageId: string | null;
}

/** `runner.commitEmptyBlock` on a new database of the benchmarks' pinned PostgreSQL container (`./environment.ts`). */
export async function commitEmptyBlockPostgres(options: CommitOptions): Promise<PostgresRun> {
  const env = await startBenchEnv(2);
  try {
    const { container } = env;
    const database = {
      kind: "postgres",
      host: container.getHost() === "localhost" ? "127.0.0.1" : container.getHost(),
      port: container.getPort(),
      user: container.getUsername(),
      password: container.getPassword(),
      name: container.getDatabase(),
      ssl: "disable",
    };
    const stats = summarize(await commitSamples(database, options));
    return { stats, serverVersion: env.serverVersion, imageId: env.imageId };
  } finally {
    await env.stop();
  }
}
