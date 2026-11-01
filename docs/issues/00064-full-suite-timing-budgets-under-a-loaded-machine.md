# 00064 — Under a loaded machine, tests' timing budgets run out in the full suite (L15–L18's controls, A63, F2, …)

- **Status:** OPEN
- **Area:** test
- **Severity:** low — each test passes when its file runs alone; a red full run on a busy machine may not be the
  change's. No product behaviour is in question: each failure is a test's own wait running out.
- **Effort:** small — give each wait a budget measured from the condition it waits for (or the suite's patience), not
  a fixed few seconds of wall clock.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, in the full run at the end of `start-umbradb` P7 (Mac, Node.js 24.9.0, Docker 29.8.2, 12 CPUs,
  `npx vitest run`, 24 min instead of the usual 9.7: the machine's load average was about 21, another program of the
  owner's using a CPU beside Docker's VM). The P6 full runs had none of them. Each file rerun alone, right after: 4
  files, 38 tests, all pass.

## Problem

Besides the known failures (issues 00059, 00060, and the A12 poll count of `test/db/postgres-pool.test.ts`), the run
had these, each a wait that ran out:

1. `test/library/network.test.ts` — three negative controls on PostgreSQL 18 (L16 `no-address`, L17 `unused`, L18
   `wrong-side`): `startup did not settle within 5000 ms`. A control starts the engine without the plan's rule and
   expects startup to complete (or be refused later) within `CONTROL_SETTLES_MS`; on a loaded machine the PostgreSQL
   process takes longer than 5 s to start, so the control reports "pending" instead of failing the oracle the way it
   should. The main oracles of the same tests passed.
2. `test/backbone/core-health/liveness.test.ts`, A63 on PostgreSQL — `/status never matched within 20000 ms`: the
   process was still `starting` (its node client `connecting`) 20 s after it began, before the 15 s `on-compute` hold
   the test is about.
3. `test/db/prepared-statements.test.ts` (issue 00033's F2), "prepares at most 256 texts on a session, and answers
   every query above that, unprepared" — `Test timed out in 60000ms`.

Two more full runs on the same tree, the machine still loaded (43 and 28 min), had more of the same kind, each passing
when its file runs alone (6 files, 62 tests, right after the third run):

4. `test/library/network.test.ts` again — five controls in the second run (L15, L16, L17 ×2, L18), one in the third
   (L15).
5. `test/admin/admin-server.test.ts`, "negative control: an admin server on the main thread fails A62's
   synchronous-loop case"; `test/runner/slow-block.test.ts`, "with slowBlockMs 5000 and the same callback: never shown,
   never logged; committed once"; `test/db/zero-timeouts.negative-control.test.ts`, its two 5 s cases;
   `test/admin/states.test.ts`, A64 "stopped at the core's stop …" and "halted …";
   `test/private/transport-intake.test.ts`, A114 "dropped while the public cursor advances 50 heights …".

The full run at the end of `start-umbradb` P8 (48 min; the load about 20, Docker Desktop's `com.docker.sailor` at about
200 % CPU throughout, another program of the owner's beside it) had more, each passing when its file runs again (13
files with four workers, then `test/library/network.test.ts` and `test/backbone/ledger-window.test.ts` alone):

6. `test/library/network.test.ts` — all seven controls on PostgreSQL; two of them (L16, L17) again in the rerun with
   four workers, none alone.
7. `test/admin/admin-server.test.ts`, A62's main case "while a callback runs a 10 s synchronous loop on the main thread,
   each endpoint answers within 1 s" (`/status never matched within 20000 ms`: still `starting`); A64 and A63 as above.
8. `test/db/read-timeouts.test.ts`, A141 "fails pg_sleep(60) with query-timeout … within 2 s" (2,034 ms); F2 as above.
9. `test/library/modules.test.ts`, L43 on PostgreSQL — its 120 s budget; `test/private/accepted-hash.negative-control
   .test.ts`, A165's control on PostgreSQL — the restarted core refused `writer-lock-held`, the first writer's session
   not yet gone when the second started.
10. `test/backbone/ledger-window.test.ts`, A103 on PostgreSQL — its 1,440 s budget ran out; alone the file takes 90 s,
    so this one may have been stuck rather than slow (not investigated; issue 00062 records the same test's PGlite
    files missing in another run).
11. Docker itself: five suites' PostgreSQL containers "not healthy after 120000ms" (`test/db/durability-probe`,
    `test/helpers/cursor-table`, `test/private/lockstep-reads`, `test/private/privacy.negative-control`,
    `test/containers` — whose failure left a container behind: issue 00066).

## Evidence

- `test/library/network.test.ts:30-31` — `CONTROL_SETTLES_MS = 5_000`; `:79-86` the race that reports
  `startup did not settle within … ms`.
- `test/backbone/core-health/liveness.test.ts:77` — `probedThrough`'s wait for `/status`, 20 s.
- `test/db/prepared-statements.test.ts:119` — the test's 60 s budget.
- The run's log and the reruns: the `start-umbradb` plan's P7 notes (`p7/logs/full-1.log`, `rerun-flaky.log`) and P8
  notes (`p8/logs/full-1.log`, `rerun-1.log`, `rerun-network.log`, `rerun-a103.log`).

## Suggested fix

For the controls of item 1, wait for startup to settle with the suite's patience (the control's outcome is a
completed startup or a later refusal, both of which come), keeping the 5 s budget only for the class-A refusal the
main oracle expects to be prompt. For items 2 and 3, start their clocks once the process is serving (A63) and give the
256-statement test the suite's database patience. Then loop each file under load (for example beside a full
`test/library` run) to show it holds.
