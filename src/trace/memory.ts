/**
 * What a thread's memory is, for the block trace (`./trace.ts`, `./worker-trace.ts`). Core.
 *
 * Node counts memory per thread, but for the resident set, which is the process's:
 * - `external`: what the thread holds outside its JavaScript heap. In the ledger worker that is the WebAssembly memory
 *   of the ledger packages it loaded, to within a few MiB: a package's memory only grows, and a 32-bit module cannot
 *   address more than 4,096 MiB, so this number says how far a long sync is from that end.
 * - `heap`: the thread's JavaScript heap in use.
 * - `rss`: the whole process's resident set, the same from any thread.
 *
 * Where the runtime gives no such report (a browser), there is none.
 */

/** A thread's memory in MiB, to one decimal (see the module comment). */
export interface ThreadMemory {
  readonly external: number;
  readonly heap: number;
  readonly rss: number;
}

interface MemoryReport {
  readonly external: number;
  readonly heapUsed: number;
  readonly rss: number;
}

const MIB = 1024 * 1024;
const mib = (bytes: number): number => Math.round((bytes / MIB) * 10) / 10;

/** This thread's memory now; null where the runtime does not report it. */
export function threadMemory(): ThreadMemory | null {
  let report: MemoryReport;
  try {
    // A read that changes nothing of the process; where there is no `process` (a browser), it throws.
    report = process.memoryUsage();
  } catch {
    return null;
  }
  return { external: mib(report.external), heap: mib(report.heapUsed), rss: mib(report.rss) };
}
