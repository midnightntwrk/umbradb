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

The full runs of `start-umbradb` P9 (2026-11-01, 20.6 min; the load 3.4 at the start, then the suite's own: Docker
Desktop's VM at about 650 % CPU, the load average 30–48 by the end) had, besides the known ones, each passing when its
file runs alone right after (3 files, 26 tests):

12. `test/admin/states.test.ts` A64 ("stopped at the core's stop …" and "refused …") and
    `test/backbone/core-health/liveness.test.ts` A63 (both cases), as above.
13. `test/backbone/contract-logs-handoff.test.ts`, A111 on PostgreSQL — the process started on the restored database was
    refused `writer-lock-held` ("another session (backend pid …) holds this database's writer lock"): the restore's own
    writer session had not ended on the server yet, as in A165's control (item 9). What the run shows: the restore had
    returned, and a session still held the lock when the next writer checked it (the log line names its backend pid);
    alone, with the machine quiet, the check never meets it. Not investigated further (which session, and how long it
    stays after its client closed, is unconfirmed).
14. `test/library/guarantees.test.ts`, L9's negative control ("a closer that stops at the first failure fails it — the
    later steps never run") — its 60 s test budget ran out in `start-umbradb` P10.4a's full run (2026-11-01, 20 min,
    376 files; A62 and A63 on PostgreSQL and A103, as this issue's earlier items, and A177, as issue 00062, failed
    beside it, each passing alone). Its two
    faulted closes leave their database open by design (the closer stops before the database's step); alone the file
    passes 37 of 37. Not investigated further.
15. `start-umbradb` P10.4c's full run (2026-11-01, 44 min instead of about 10, 382 files; the machine's load average
    about 21, Docker's VM at 230 % CPU): besides this issue's items 1/4/6 (`test/library/network.test.ts`, the seven
    controls on PostgreSQL), 3 (F2) and 5 (`zero-timeouts`'s 5 s case, `CONNECTION_CLOSED`), and A12, two new ones —
    `test/library/network.negative-control.test.ts`, L18's schema case (P10.4b's control, the same
    `CONTROL_SETTLES_MS` race, `test/library/network-refusals.ts:26`), and `test/admin/lifecycle.test.ts`, "the admin
    listener closes only once the database has closed" on PostgreSQL (`/status never matched within 20000 ms`, the
    harness's wait, `test/admin/admin-harness.ts:224`). Each of the six files passed alone right after
    (`p104c/rerun-*.log`).
16. `start-umbradb` P10.4d's full run (2026-11-01/02, 68 min, 382 files; the load average about 6 at its start, 25 to
    37 through it — Docker's VM at about 190 % CPU and another application at 100 % beside it): besides the known
    A115 ×18 and `unexpected-cursor` ×2 (issues 00059, 00060), this issue's items 1/4/6 (`network.test.ts`'s seven
    controls on PostgreSQL), 15 (L18's schema control), 5 and 7 (A62 ×2), 12 (A64 ×2), 2 (A63, on PGlite this time),
    10 (A103, its 1,440 s budget) and 8 (A141's "within 2 s", 2,141 ms), and A177 (issue 00062's), ten new ones:
    the 60 s hooks of `test/backbone/chain-process.test.ts` (PGlite, its `afterAll`'s `backend.stop()`) and
    `test/db/postgres-tls.test.ts` (its `beforeAll`'s `startTlsPostgres()`); the 60 s test budgets of
    `test/backbone/core-digest/capture.test.ts` ("lets a migration drop a column the old capture function names …",
    PostgreSQL), `test/db/migrate.test.ts` (A16, PostgreSQL), `test/ledger/state-trees.test.ts` and
    `state-trees.negative-control.test.ts` (one case each) and `test/runner/process-context.test.ts` (A74, PostgreSQL);
    `test/backbone/contract-data.negative-control.test.ts`, A111's "-fast from h itself" control on PostgreSQL, refused
    `writer-lock-held` instead of `changes-past` (item 13's race); `test/runner/slow-block-windows.test.ts`, "after a
    commit, one window …" on PostgreSQL, the raised warning's time before `on-stop-height`'s start (`:208`, 63,520 ms
    against 63,632 ms); and `test/db/read-timeouts.test.ts`, A141's "does not count a statement in flight as idle time …"
    — its `pg_sleep(0.9)` cancelled by the 1 s `statement_timeout` (once more when its file ran alone right after, the
    15-minute load still 15; then 3 of 3). Each of the 17 files passed alone right after, `read-timeouts.test.ts` from
    its second run (`p104d/reruns.summary`, `rerun-*.log`).

## Evidence

- `test/library/network.test.ts:30-31` — `CONTROL_SETTLES_MS = 5_000`; `:79-86` the race that reports
  `startup did not settle within … ms`.
- `test/backbone/core-health/liveness.test.ts:77` — `probedThrough`'s wait for `/status`, 20 s.
- `test/db/prepared-statements.test.ts:119` — the test's 60 s budget.
- The run's log and the reruns: the `start-umbradb` plan's P7 notes (`p7/logs/full-1.log`, `rerun-flaky.log`) and P8
  notes (`p8/logs/full-1.log`, `rerun-1.log`, `rerun-network.log`, `rerun-a103.log`); P9 notes (`p9/logs/full-1.log`, `rerun-1.log`); P10.4a notes (`p104a/full.log`, `reruns.log`); P10.4c notes (`p104c/full.log`, `rerun-*.log`); P10.4d notes (`p104d/full.log`, `full.json`, `reruns.summary`, `rerun-*.log`).

## Suggested fix

For items 9 and 13, a test that starts a second writer right after the first one closed waits until the first's
sessions are gone (`pg_stat_activity`, as `test/private/backends.ts`'s `connected` does) before it starts the second.
For the controls of item 1, wait for startup to settle with the suite's patience (the control's outcome is a
completed startup or a later refusal, both of which come), keeping the 5 s budget only for the class-A refusal the
main oracle expects to be prompt. For items 2 and 3, start their clocks once the process is serving (A63) and give the
256-statement test the suite's database patience. Then loop each file under load (for example beside a full
`test/library` run) to show it holds.
