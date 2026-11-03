import type { DatabaseParts } from "../../src/config/database-parts.js";
import { inspectDatabase, type SegmentEvent, type SegmentJob, startSegment } from "./refcount-restart.js";

/**
 * One segment of a restart or crash run, as a process of its own (`./refcount-restart.ts`): started by the test with
 * `node --import tsx` and one JSON argument ({@link SegmentJob}). It runs the process over a tape node of its own from
 * the database's cursor, reports each event as one JSON line on its standard output, and ends once its process
 * stopped or ended; a segment holding at its point waits for the test's SIGKILL. Given `{ inspect }` instead, it reads
 * the database from outside any process of it (`inspectDatabase`), reports it, and ends. [R13, R14]
 *
 * Like `../runner/crash.worker.ts`, it exits by itself once its parent is no longer the test's (Vitest's bail, a test's
 * timeout), since a held point would otherwise keep it up for ever.
 */

function report(event: SegmentEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

const job = JSON.parse(process.argv[2] as string) as SegmentJob | { readonly inspect: DatabaseParts };
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 1_000);

if ("inspect" in job) report(await inspectDatabase(job.inspect));
else {
  const segment = await startSegment(job, report);
  report(await segment.finished());
}
clearInterval(orphanGuard);
