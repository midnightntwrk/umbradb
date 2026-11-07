import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Baseline, LatencyStats } from "./types.js";

/**
 * The bench smoke's comparison (`./smoke.ts`), a job that never gates a build: a measured p99 more than an order of
 * magnitude above the committed baseline's is flagged for a person to look at; nothing here fails a build on a number.
 * [design §13]
 */

/** A p99 this many times the baseline's is flagged. */
export const REGRESSION_FACTOR = 10;

/** The committed baseline's path. */
export const BASELINE_PATH = fileURLToPath(new URL("./baseline.json", import.meta.url));

/** The baseline as read: present and parsed, absent, or present and unreadable. */
export type BaselineLoad =
  | { readonly status: "ok"; readonly baseline: Baseline }
  | { readonly status: "missing"; readonly path: string }
  | { readonly status: "corrupt"; readonly path: string; readonly error: unknown };

/** Reads the baseline at `path`: a missing or corrupt file is an artifact problem, never a passing comparison. */
export function loadBaseline(path: string = BASELINE_PATH): BaselineLoad {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return { status: "missing", path };
  }
  try {
    const baseline = JSON.parse(raw) as Baseline;
    if (typeof baseline !== "object" || baseline === null || typeof baseline.workloads !== "object" || baseline.workloads === null) {
      throw new Error("no workloads");
    }
    return { status: "ok", baseline };
  } catch (error) {
    return { status: "corrupt", path, error };
  }
}

/** One workload's line of the comparison, and whether it is flagged. */
export interface Comparison {
  readonly line: string;
  readonly flagged: boolean;
}

/** Each measured workload against the baseline's (see the module comment), in the order measured. */
export function compareToBaseline(measured: Readonly<Record<string, LatencyStats>>, load: BaselineLoad): Comparison[] {
  return Object.entries(measured).map(([name, stats]) => {
    const p99 = `p99=${stats.p99.toFixed(3)}ms`;
    if (load.status !== "ok") return { line: `${name.padEnd(36)} ${p99}  (no baseline to compare: not a result)`, flagged: false };
    const base = load.baseline.workloads[name];
    if (base === undefined) return { line: `${name.padEnd(36)} ${p99}  (no baseline entry: not compared)`, flagged: false };
    const ratio = base.p99 > 0 ? stats.p99 / base.p99 : 1;
    const flagged = ratio > REGRESSION_FACTOR;
    return {
      line: `${name.padEnd(36)} ${p99}  baseline=${base.p99.toFixed(3)}ms  x${ratio.toFixed(2)}  ${flagged ? `WARN: >${REGRESSION_FACTOR}x, inspect` : "ok"}`,
      flagged,
    };
  });
}
