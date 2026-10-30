import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { startContainer } from "./containers.js";
import { POSTGRES_IMAGE } from "./postgres-image.js";

/**
 * The parent process of `containers.test.ts`'s orphaned container, started with `node --import tsx` and one JSON
 * argument: it starts one PostgreSQL container carrying the label `org.umbradb.test.fixture=<fixture>` — with
 * `startContainer` when `guarded`, else with Testcontainers' own `start` (the negative control) — reports
 * `{"id": <the container's id>}` as one JSON line on stdout, and then lives until it is killed. The test runs it with
 * Testcontainers' reaper off, so that only the watcher can remove the container.
 */

const { guarded, fixture } = JSON.parse(process.argv[2] as string) as { guarded: boolean; fixture: string };
const container = new PostgreSqlContainer(POSTGRES_IMAGE).withLabels({ "org.umbradb.test.fixture": fixture });
const started = guarded ? await startContainer(container) : await container.start();
process.stdout.write(`${JSON.stringify({ id: started.getId() })}\n`);
setInterval(() => undefined, 1 << 30);
