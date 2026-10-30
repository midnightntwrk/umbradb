# 00010 — The bench smoke guard cannot run on a fast machine: its first workload writes one key twice in a millisecond

- **Status:** CLOSED — core-arch task 17.2 (2026-10-27) retired the TemporalKV workload, the smoke guard and the
  baseline with the 0.9.5 parts (`openspec/changes/core-arch/design.md` §13); task 17.3 retargets the bench smoke to the
  core with a fresh baseline.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** test
- **Severity:** low
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-24, during task 0.4 of `openspec/changes/core-arch` (PostgreSQL 18 pins), when `npm run
  bench:smoke` was run locally to check that the benchmark starts from the new pin.

## Problem

`npm run bench:smoke` exits 1 before measuring anything, with "[smoke] harness could not run (infrastructure failure,
not a perf regression): ClockRegressionError: new row for relation "kv_history" violates check constraint
"kv_history_range"". Its first workload, `temporalKV.put.existing`, calls `kv.put("smoke", "scope", "k", …)` on one
key in a tight loop. `PgTemporalKV` truncates each write's instant to the millisecond, and a second write to the same
key in the same millisecond gives an empty validity range, which the `kv_history_range` CHECK refuses: documented
cause (b) of `ClockRegressionError`, retryable after the millisecond passes. On a machine where a `put` takes less
than a millisecond, the loop hits it at once.

Not caused by PostgreSQL 18: at `390a528`, before task 0.4, the guard fails the same way on its old 17 image
(`postgres@sha256:742f40…`), twice out of two runs (Apple silicon, Docker 29.8.2). The CI job (`bench-smoke.yml`) is
non-gating and `continue-on-error`, so a failure there would not block anything either; whether it passes on the
`ubuntu-latest` runners was not checked.

## Evidence

- `bench/smoke.ts:33-39` — the loop: `n += 1; await kv.put("smoke", "scope", "k", { v: n });`, sampled by tinybench
  for 150 ms after its warm-up.
- `src/postgres/temporal-kv.ts:113-117` — "always succeeds UNLESS this write's truncated clock_timestamp() collides
  with a prior write to the same key within the same millisecond, which raises ClockRegressionError".
- `src/postgres/errors.ts:19-33` — `ClockRegressionError`, cause (b): two writes to the same key in the same
  millisecond; `retryable = "conditional"`.
- `src/postgres/migrations/001_temporal_kv.ts:96` — `CONSTRAINT kv_history_range CHECK (valid_from < valid_to)`.
- The failing row reported by PostgreSQL: `valid_from` and `valid_to` both `2026-10-24 20:28:41.571+00`, the range
  `empty`.

## Suggested fix

Make the workload measure what it names without colliding: write a different key per iteration (or a small rotating
set of keys, each written at most once per millisecond), or retry a `ClockRegressionError` of cause (b) inside the
measured function and count the retries. The TemporalKV workloads and their baseline are retired by task 17 of
`openspec/changes/core-arch` (`design.md` §13), which closes this issue if it lands first.
