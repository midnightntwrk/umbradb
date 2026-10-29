/**
 * A stand-in for Vitest's CLI entry, for `conformance-gate.test.ts`: the test copies the conformance gate into a scratch
 * repository root whose `node_modules/vitest/vitest.mjs` is this file, so the gate starts it exactly as it starts Vitest.
 * [docs/issues/00027, docs/issues/00054]
 *
 * `CONFORMANCE_GATE_STAND_IN=hang` acts like a run whose test worker hung where no test timeout reaches it: it starts a
 * grandchild that ignores SIGTERM (as Vitest starts its fork workers, in the same process group), waits until the
 * grandchild says it is ready, ignores SIGTERM itself, writes both pids as JSON to `CONFORMANCE_GATE_STAND_IN_PIDS` and
 * then blocks its event loop for good, so its own SIGTERM handler never runs. Only SIGKILL ends either process. The
 * grandchild is started with plain `spawn` on purpose: an orphan guard on it would kill it however the gate behaved, and
 * the test is that the gate's own kill reaches it. The test lists both pids with its orphan guard once it reads them.
 * [docs/issues/00027, docs/issues/00054]
 *
 * `CONFORMANCE_GATE_STAND_IN=exit:<code>` ends at once with that exit code and writes no report, as a Vitest run that
 * ends on its own. [docs/issues/00027]
 */
import { spawn } from "node:child_process";
import { renameSync, writeFileSync } from "node:fs";

const mode = process.env.CONFORMANCE_GATE_STAND_IN ?? "";
const exitMode = /^exit:(\d{1,3})$/.exec(mode);

if (exitMode !== null) {
  process.exit(Number(exitMode[1]));
} else if (mode === "hang") {
  const pidsPath = process.env.CONFORMANCE_GATE_STAND_IN_PIDS;
  if (pidsPath === undefined || pidsPath === "") {
    console.error("vitest stand-in: CONFORMANCE_GATE_STAND_IN_PIDS is not set");
    process.exit(70);
  }
  const grandchild = spawn(
    process.execPath,
    ["-e", 'process.on("SIGTERM", () => undefined); process.stdout.write("ready\\n"); setInterval(() => undefined, 1 << 30);'],
    { stdio: ["ignore", "pipe", "inherit"] },
  );
  let said = "";
  grandchild.stdout.setEncoding("utf8");
  grandchild.stdout.on("data", (chunk) => {
    said += chunk;
    if (!said.includes("ready\n")) return;
    process.on("SIGTERM", () => undefined);
    // Written whole, then renamed into place, so the test never reads half of it.
    writeFileSync(`${pidsPath}.partial`, JSON.stringify({ child: process.pid, grandchild: grandchild.pid }));
    renameSync(`${pidsPath}.partial`, pidsPath);
    for (;;) {
      // The hung worker: the event loop never runs again.
    }
  });
} else {
  console.error(`vitest stand-in: unknown CONFORMANCE_GATE_STAND_IN ${JSON.stringify(mode)}`);
  process.exit(70);
}
