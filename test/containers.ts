import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { type GenericContainer, getContainerRuntimeClient } from "testcontainers";
import { guardContainers } from "./child-processes.js";

/**
 * How every test starts a Testcontainers container (core-arch task 0.5, acceptance A153): {@link startContainer}.
 *
 * **The start-up timeout.** Once Docker has started a container, Testcontainers 12.0.4 waits for Docker to report the
 * container's ports bound to the host, polling every 250 ms for at most 10 s — a value fixed in its code
 * (`inspectContainerUntilPortsExposed`, `generic-container/inspect-container-util-ports-exposed.js`), which neither
 * `withStartupTimeout` (the wait strategy's, 120 s for PostgreSQL) nor any setting reaches. On a loaded machine Docker
 * Desktop can take longer than that to answer, and the start fails with "Timed out after 10000ms while waiting for
 * container ports to be bound to the host" although the container is starting normally. The container is then left
 * running, unknown to the test. {@link startContainer} removes that container and starts another, up to
 * {@link START_ATTEMPTS} times; any other error, and the last attempt's, is the test's, its container removed too.
 * {@link startContainers} starts several at once and stops those that started when another fails.
 *
 * **Labels.** Every container carries {@link LABEL_REPOSITORY} (this repository's directory) and {@link LABEL_PID} (the
 * test process that started it), so that a container left behind by a run can be told from another run's — A153's
 * check that no container outlives its run lists the containers of this repository whose process is gone — and so that
 * the test process's orphan watcher (`child-processes.ts`, `guardContainers`) removes them when that process ends, also
 * when it ends without its `afterAll` (Vitest's `--bail`, a run interrupted, the process killed).
 */

const REPOSITORY = fileURLToPath(new URL("..", import.meta.url));

/** The repository directory a test container was started from. */
export const LABEL_REPOSITORY = "org.umbradb.test.repository";
/** The pid of the test process that started it. */
export const LABEL_PID = "org.umbradb.test.pid";
/** One start attempt's own id, by which a failed attempt's container is found and removed. */
export const LABEL_ATTEMPT = "org.umbradb.test.attempt";

/** How many times a start that timed out waiting for its ports is tried in all. */
export const START_ATTEMPTS = 4;

/** Testcontainers' error when Docker has not reported the ports bound within its fixed 10 s. */
const PORTS_NOT_BOUND = /while waiting for container ports to be bound to the host/;

/** What starting `container` resolves with (a `StartedPostgreSqlContainer` for a `PostgreSqlContainer`). */
type Started<T extends GenericContainer> = Awaited<ReturnType<T["start"]>>;

/** Removes the container one attempt started, if Docker still lists it. */
async function removeAttempt(attempt: string): Promise<void> {
  const client = await getContainerRuntimeClient();
  const left = await client.container.fetchByLabel(LABEL_ATTEMPT, attempt, {
    status: ["created", "restarting", "running", "removing", "paused", "exited", "dead"],
  });
  await left?.remove({ force: true, v: true });
}

/**
 * Starts `container` with its labels, trying again when Testcontainers gave up waiting for its ports to be bound (see
 * the module comment). Whatever an attempt that failed left behind is removed first, so a start that fails leaves no
 * container.
 */
export async function startContainer<T extends GenericContainer>(container: T): Promise<Started<T>> {
  // Removed by this process's watcher when it ends, if its tests did not stop them (`guardContainers`).
  guardContainers([`label=${LABEL_REPOSITORY}=${REPOSITORY}`, `label=${LABEL_PID}=${process.pid}`]);
  for (let tried = 1; ; tried++) {
    const attempt = randomUUID();
    container.withLabels({ [LABEL_REPOSITORY]: REPOSITORY, [LABEL_PID]: String(process.pid), [LABEL_ATTEMPT]: attempt });
    try {
      return (await container.start()) as Started<T>;
    } catch (error) {
      await removeAttempt(attempt).catch(() => undefined);
      if (tried >= START_ATTEMPTS || !PORTS_NOT_BOUND.test(String(error))) throw error;
    }
  }
}

/**
 * Starts `containers` together with {@link startContainer}; if any fails, stops the ones that started before it rejects
 * with the first failure — so that a suite's setup that fails halfway leaves none running (`Promise.all` would drop the
 * started ones, which its `afterAll` then never sees).
 */
export async function startContainers<const T extends readonly GenericContainer[]>(
  containers: T,
): Promise<{ -readonly [K in keyof T]: Started<T[K]> }> {
  const settled = await Promise.allSettled(containers.map((container) => startContainer(container)));
  const failure = settled.find((result) => result.status === "rejected");
  if (failure === undefined) {
    return settled.map((result) => (result as PromiseFulfilledResult<unknown>).value) as {
      -readonly [K in keyof T]: Started<T[K]>;
    };
  }
  await Promise.allSettled(
    settled.flatMap((result) =>
      result.status === "fulfilled" ? [(result.value as { stop(): Promise<unknown> }).stop()] : [],
    ),
  );
  throw failure.reason;
}
