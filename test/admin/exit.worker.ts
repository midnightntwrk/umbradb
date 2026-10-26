import { startAdminServer } from "../../src/admin/server.js";
import { startProcess, terminationSignal } from "../../src/runner/process.js";
import { testBuild } from "../runner/process-build.js";
import { adminCore, adminSource } from "./admin-harness.js";

/**
 * A process for `lifecycle.test.ts` (task 8.1; AE-1, AE-3, RN-13), started with `node --import tsx` and its arguments —
 * the `database` setting and the mode: `run` (it processes to the head and waits), `refuse` (its configuration is
 * invalid) or `taken` (its `listen.admin`, the third argument, is a port another listener holds) —, as `umbradb run`
 * starts one: `startProcess` with its admin endpoints (on `127.0.0.1:0` but in `taken`) and its signal from
 * `terminationSignal`. It reports, as JSON lines on stdout, the admin listener's port, how processing ended, and its
 * state once closed; then it lets Node.js end by itself, so a worker thread, a timer or a listener the admin endpoints
 * left would keep it alive. Its own guard ends it when its parent is no longer the test's (an orphan, after a test that
 * died).
 */

const [database, mode, address] = process.argv.slice(2) as [string, "run" | "refuse" | "taken", string | undefined];
const parent = process.ppid;
setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 500).unref();

const termination = terminationSignal();
const build = testBuild([]);
const extra = {
  listen: { admin: mode === "taken" ? address : "127.0.0.1:0" },
  ...(mode === "refuse" ? { livenessTimeoutMs: "thirty seconds" } : {}),
};
const handle = startProcess({
  declarations: build.declarations,
  config: { data: { entries: [adminCore(database, 1, { extra })] } },
  source: adminSource(2n),
  signal: termination.signal,
  log: () => undefined,
  admin: async (options) => {
    const server = await startAdminServer(options);
    process.stdout.write(`${JSON.stringify({ port: server.port })}\n`);
    return server;
  },
});
void handle.ended.then((end) => process.stdout.write(`${JSON.stringify({ ended: end.kind })}\n`));
await handle.closed;
termination.dispose();
process.stdout.write(`${JSON.stringify({ closed: handle.status().state })}\n`);
