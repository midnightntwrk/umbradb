import { execFileSync } from "node:child_process";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres from "postgres";
import { POSTGRES_IMAGE } from "../test/postgres-image.js";

/**
 * The benchmarks' PostgreSQL: a pinned container with fixed server settings. The 0.9.5 workloads that ran here
 * (TemporalKV, Watermarks, CheckpointStore and its GC curve, the lease, TransactionHistory) were retired, with their
 * baseline, harness and smoke guard. The bench smoke now measures the core (`runner.commitEmptyBlock` per backend) with
 * a fresh baseline. What is left is the container and `./stats.ts`, which those runs reuse. [design §13]
 */

/**
 * Pinned Postgres image, pinned by DIGEST: the repository's one PostgreSQL image, `test/postgres-image.ts`
 * (PostgreSQL 18). The Testcontainers container STARTS from this digest, so the pin is enforced at run time rather
 * than merely recorded after the fact. The resolved local image id is captured too (`BenchEnv.imageId`), for a
 * baseline to record. [Q82, A148; perf-baseline design §4]
 */
export { POSTGRES_IMAGE };

/** Server settings pinned for run-to-run comparability. [perf-baseline design §4] */
export const PG_SETTINGS = {
  shared_buffers: "256MB",
  work_mem: "16MB",
  max_wal_size: "2GB",
} as const;

export interface BenchEnv {
  sql: postgres.Sql;
  connectionUri: string;
  container: StartedPostgreSqlContainer;
  serverVersion: string;
  imageId: string | null;
  stop: () => Promise<void>;
}

/**
 * Start a Testcontainers PostgreSQL 18 with the pinned image and settings, and connect to it. Nothing is migrated: a
 * benchmark opens its database through the database API (`src/db/`) as the core does.
 */
export async function startBenchEnv(maxConnections = 24): Promise<BenchEnv> {
  const container = await new PostgreSqlContainer(POSTGRES_IMAGE)
    .withCommand([
      "postgres",
      "-c", `shared_buffers=${PG_SETTINGS.shared_buffers}`,
      "-c", `work_mem=${PG_SETTINGS.work_mem}`,
      "-c", `max_wal_size=${PG_SETTINGS.max_wal_size}`,
      // Deterministic single-worker planning so a pass duration is not perturbed by the runner's
      // core count (comparability, not a production recommendation).
      "-c", "max_parallel_workers_per_gather=0",
    ])
    .start();

  const connectionUri = container.getConnectionUri();
  const sql = postgres(connectionUri, { max: maxConnections, onnotice: () => {} });

  const versionRows = await sql<{ version: string }[]>`SELECT version()`;
  const serverVersion = versionRows[0]?.version ?? "unknown";

  let imageId: string | null = null;
  try {
    imageId =
      execFileSync("docker", ["inspect", "--format", "{{.Image}}", container.getId()], {
        encoding: "utf8",
      }).trim() || null;
  } catch {
    imageId = null;
  }

  return {
    sql,
    connectionUri,
    container,
    serverVersion,
    imageId,
    stop: async () => {
      await sql.end({ timeout: 5 });
      await container.stop();
    },
  };
}
