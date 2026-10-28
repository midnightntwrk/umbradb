import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { BASELINE_PATH, compareToBaseline, loadBaseline } from "../../bench/compare.js";
import { workloadName } from "../../bench/core.js";
import type { LatencyStats } from "../../bench/types.js";

/**
 * The bench smoke's comparison (`bench/compare.ts`; task 17.3, design §13's non-gating benchmark job): the committed
 * baseline holds both backends' `runner.commitEmptyBlock`; a p99 more than ten times the baseline's is flagged, and a
 * missing or unreadable baseline is reported as no result — never as a pass.
 */

const stats = (p99: number): LatencyStats => ({ unit: "ms", samples: 1, min: p99, max: p99, mean: p99, sd: 0, cv: 0, p50: p99, p95: p99, p99 });
const dir = mkdtempSync(join(tmpdir(), "umbradb-bench-compare-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("the bench smoke's baseline and comparison", () => {
  it("the committed baseline holds runner.commitEmptyBlock on both backends", () => {
    const load = loadBaseline(BASELINE_PATH);
    expect(load.status).toBe("ok");
    if (load.status !== "ok") return;
    expect(Object.keys(load.baseline.workloads).sort()).toEqual([workloadName("pglite"), workloadName("postgres")]);
    for (const workload of Object.values(load.baseline.workloads)) {
      expect(workload.samples).toBe(load.baseline.method.iterations);
      expect(workload.p99).toBeGreaterThan(0);
    }
  });

  it("a p99 within ten times the baseline's passes; above it is flagged, never thrown", () => {
    const load = { status: "ok", baseline: { workloads: { a: stats(2), b: stats(2) } } } as never;
    const result = compareToBaseline({ a: stats(20), b: stats(20.2) }, load);
    expect(result.map((r) => r.flagged)).toEqual([false, true]);
    expect(result[1]?.line).toContain("WARN: >10x");
  });

  it("a missing or corrupt baseline, or a workload it lacks, compares nothing and says so", () => {
    expect(loadBaseline(join(dir, "none.json")).status).toBe("missing");
    writeFileSync(join(dir, "bad.json"), "{");
    const corrupt = loadBaseline(join(dir, "bad.json"));
    expect(corrupt.status).toBe("corrupt");
    writeFileSync(join(dir, "empty.json"), "{}");
    expect(loadBaseline(join(dir, "empty.json")).status).toBe("corrupt");
    const [line] = compareToBaseline({ a: stats(1_000) }, corrupt);
    expect(line).toEqual({ line: expect.stringContaining("not a result"), flagged: false });
    const ok = { status: "ok", baseline: { workloads: {} } } as never;
    expect(compareToBaseline({ a: stats(1) }, ok)[0]?.line).toContain("no baseline entry");
  });
});
