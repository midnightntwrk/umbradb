# 00072 — `umbradb run` logs nothing when SIGTERM or SIGINT stops it

- **Status:** CLOSED — fixed 2026-11-02 in `9d12a87` (`start-umbradb` P12.B): the engine logs a stop in two lines, so
  a host's `log` gets them as the command's standard error does — when it begins, `stopping (<cause>): <what it lets
  finish>` (`cause` `stop()` or `signal: <the abort reason's text>`, the command's reason being `SIGTERM` or `SIGINT`;
  the height in progress, none, startup, or that processing had already ended), and once processing or startup has
  ended by it, `processing stopped (<cause>): the last committed height is <c>, where a restart resumes` (or none
  committed and the height a restart starts at). Tests: `test/cli/run-stop-log.test.ts` (the command through its
  signal seam, three cases on PostgreSQL 18 and PGlite) and `test/library/stop-log.test.ts` (a host's `stop()` and
  signal); 8 of 8 failed before (no line), pass after. Eleven tests that counted the log lines after a stop now assert
  the stop's lines too.
- **Area:** runner (the process's stop, `src/runner/process.ts`) and the command (`src/cli/run.ts`)
- **Severity:** low — the stop itself is clean (the height in progress commits or stores nothing, a restart resumes
  from the cursor), but an operator who presses Ctrl-C, or whose orchestrator sends SIGTERM, sees the log end with the
  last line processing wrote and cannot tell from it that the process stopped, why, which height it was on, or where a
  restart resumes. A host program's `log` gets nothing either for its `stop()` or its `signal`.
- **Effort:** small — two log lines from the engine's stop: one when the stop begins (what asked for it, the height in
  progress if any), one once processing has ended by it (the last committed height, where a restart resumes).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, by a user run of the README on `v0.10.0-rc.1` (finding 3), checked on the branch
  `00028-core-arch` at `00b7437`: the same code path.

## Problem

A stop ends processing without a line. The process logs how processing ended for every other end: a refusal
(`startup refused: …`), a halt (`processing halted (<code>): …`), the core's stop or an upgrade boundary (`processing
stopped at <height>: the core's stop`). A stop by `stop()` or the signal — SIGTERM or SIGINT for `umbradb run` — enters
`stopping`, waits for the loop and closes everything, and the log says nothing of it: `#run` returns the end `signal`
without a line, and `#close` logs only a close step that fails.

## Evidence

- `src/runner/process.ts:2259` — `if (end.kind === "signal") return this.#ended(end);`, before the only line of an end
  (`:2265`, `processing stopped at …`), which the core's stop and the upgrade boundary reach.
- `src/runner/process.ts:2248`, `:2256` — the two other ends by the stop (a node call ended by the stop's close of the
  node client; a retry's back-off ended by it): no line.
- `src/runner/process.ts:1563-1592` — `#close`: `stopping`, the loop's signal aborted, the loop awaited, the close steps;
  no line of its own.
- `src/cli/run.ts:78-89` — `stopSignal` aborts the command's signal with no reason, so nothing downstream could name
  the signal either.

## Suggested fix

Log from the engine, so that a host's `log` gets the lines as the command's stderr does (LM-2: nothing without `log`):

- when the stop begins (the first `stop()` or the signal's abort): what asked for it — `stop()`, or the signal and its
  abort reason's text, which the command makes the signal's name — and the height in progress, if any (the loop's open
  height window), during startup, or that processing had already ended;
- once processing has ended by the stop: the last committed height, where a restart resumes (or that none committed,
  and the height a restart starts at).

Test on PostgreSQL 18 and PGlite through the command's signal seam: SIGTERM at the head, SIGINT while a height is held
in its `on-db-write`; both lines asserted, seen failing before the fix.
