// The admin endpoints' prober (task 8.1, A62): a worker thread of its own that requests each path in turn, every
// `intervalMs`, until it is told to stop, and reports every request — its path, its status (null when no answer came),
// when it was sent (`process.hrtime.bigint()`, the clock every thread of the process shares) and how long its answer
// took, from just before the request was written to the end of the answer — and, when asked (`bodies`, task 5.5), the
// answer's body as text. It runs off the main thread, so a callback that blocks the main thread (A62's synchronous
// loop) delays none of its requests or measurements: each time is the answer's time, measured from the request.
//
// Plain JavaScript, so that a worker thread loads it as it is.

import { request } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { parentPort, workerData } from "node:worker_threads";

const { origin, paths, intervalMs, timeoutMs, bodies = false } = workerData;
let stopped = false;
parentPort.on("message", (message) => {
  if (message === "stop") stopped = true;
});

/** One request of `path`: its record. */
function probe(path) {
  return new Promise((resolve) => {
    const sent = process.hrtime.bigint();
    const chunks = [];
    const done = (status, error) =>
      resolve({
        path,
        status,
        error,
        sent: String(sent),
        ms: Number(process.hrtime.bigint() - sent) / 1e6,
        ...(bodies ? { body: Buffer.concat(chunks).toString("utf8") } : {}),
      });
    const outgoing = request(`${origin}${path}`, { agent: false, timeout: timeoutMs }, (answer) => {
      answer.on("data", (chunk) => chunks.push(chunk));
      answer.on("end", () => done(answer.statusCode ?? null, null));
      answer.on("error", (error) => done(null, error.code ?? error.message));
    });
    outgoing.on("timeout", () => outgoing.destroy(Object.assign(new Error("timeout"), { code: "TIMEOUT" })));
    outgoing.on("error", (error) => done(null, error.code ?? error.message));
    outgoing.end();
  });
}

const records = [];
parentPort.postMessage({ type: "ready" });
while (!stopped) {
  for (const path of paths) records.push(await probe(path));
  await sleep(intervalMs);
}
parentPort.postMessage({ type: "records", records });
