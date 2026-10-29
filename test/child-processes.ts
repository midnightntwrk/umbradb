import { type ChildProcess, spawn } from "node:child_process";
import type { Writable } from "node:stream";
import { fileURLToPath } from "node:url";

/**
 * The orphan guard of every child process a test starts: {@link spawnChild} is `node:child_process`'s `spawn`, and the
 * child it starts is killed with SIGKILL as soon as the test process that started it ends — normally, by a signal or by
 * SIGKILL — whether or not the test reached its own cleanup (Vitest's `--bail`, a test's timeout, Vitest killed) and
 * whether or not the child can act: a child that is stopped (`SIGSTOP`, as the writer-lock test pauses one), whose
 * event loop is blocked (PGlite's hung engine, `db/pglite-timeouts.test.ts`) or that waits for a signal
 * (`tools/tape/main.ts record`) is ended the same way. A test still stops its children itself; the guard is for when it
 * cannot. [A153, A17; docs/issues/00015, docs/issues/00022]
 *
 * **How.** The first child a test process starts also starts that process's watcher (`orphan-watcher.mjs`, plain
 * Node.js), whose standard input is a pipe from the test process. The test process writes each child's pid to it when
 * the child starts and again when it exits. When the test process ends the operating system closes the pipe, however
 * the process ended; the watcher reads the end of its input, kills every child still listed and exits. The watcher runs
 * in a process group of its own, so that a Ctrl-C or a signal to the test process's group, which ends the test process,
 * does not end the watcher before its work; it outlives the test process by that kill only. Neither the watcher nor its
 * pipe keeps the test process alive.
 *
 * A child's own children are not listed: a child that starts processes of its own stops them itself. A pid the test
 * process had not yet seen exit when it ended is killed too; the operating system does not hand it to another process
 * within that instant. The watcher also removes the test process's Docker containers ({@link guardContainers}).
 *
 * `test/child-processes.test.ts` orphans children on purpose (running, stopped, blocked, and after a signal to the
 * whole group), with the negative control of a child started by plain `spawn`, and checks that no test starts a child
 * process any other way.
 */

const WATCHER = fileURLToPath(new URL("./orphan-watcher.mjs", import.meta.url));

let watcher: ChildProcess | undefined;

/** The watcher's input, starting the watcher on first use. */
function watcherInput(): Writable {
  if (watcher === undefined) {
    watcher = spawn(process.execPath, [WATCHER], { stdio: ["pipe", "ignore", "ignore"], detached: true });
    // Its pipe, written to only, keeps nothing alive; the watcher itself is unreferenced.
    watcher.unref();
    // A watcher that could not start or died leaves the children unguarded; the test's own cleanup still runs.
    watcher.stdin!.on("error", () => undefined);
    watcher.on("error", () => undefined);
  }
  return watcher.stdin!;
}

/** Lists `pid` with the watcher, so that it is killed when this process ends; the returned function unlists it. */
export function guardPid(pid: number): () => void {
  if (!Number.isSafeInteger(pid) || pid <= 1) throw new Error(`guardPid: not a child's pid: ${pid}`);
  watcherInput().write(`+${pid}\n`);
  return () => {
    watcherInput().write(`-${pid}\n`);
  };
}

const containerFilters = new Set<string>();

/**
 * Lists Docker label filters naming this process's containers (`label=org.umbradb.test.<name>=<value>`, all required)
 * with the watcher, which removes every container they match when this process ends (`test/containers.ts` gives each
 * container the labels): a container a test started is removed even when the test never reached its `afterAll`.
 */
export function guardContainers(filters: readonly string[]): void {
  for (const filter of filters) {
    if (!/^label=org\.umbradb\.test\.[a-z]+=[^\n]+$/.test(filter)) {
      throw new Error(`guardContainers: not a label filter: ${filter}`);
    }
    if (containerFilters.has(filter)) continue;
    containerFilters.add(filter);
    watcherInput().write(`#${filter}\n`);
  }
}

/**
 * `spawn` of `node:child_process`, with the child killed when this test process ends (see the module comment). Every
 * test that starts a child process starts it with this function.
 */
export const spawnChild: typeof spawn = ((...args: Parameters<typeof spawn>) => {
  const child = (spawn as (...a: Parameters<typeof spawn>) => ChildProcess)(...args);
  if (child.pid !== undefined) {
    const unlist = guardPid(child.pid);
    child.once("exit", unlist);
  }
  return child;
}) as typeof spawn;
