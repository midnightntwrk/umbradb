/**
 * The benchmarks' statistic block (`./stats.ts`). Core-arch task 17.2 retired the 0.9.5 baseline's schema that lived
 * here — its harness version, workload set, GC curve, HOT ratio, bloat and environment blocks — with the workloads and
 * the baseline (`openspec/changes/core-arch/design.md` §13); task 17.3 writes the core's baseline.
 */

/** Per-workload latency distribution. `cv` (coefficient of variation = sd/mean) is what a future
 *  CV-aware regression gate keys off (`design.md` §5: a benchmark at CV≈2.66% gives ~45% false
 *  positives against a naive 2% gate — the calibrated gate is deferred post-1.0.0). */
export interface LatencyStats {
  unit: "ms";
  samples: number;
  min: number;
  max: number;
  mean: number;
  sd: number;
  /** Coefficient of variation, sd/mean (unitless). */
  cv: number;
  p50: number;
  p95: number;
  p99: number;
}
