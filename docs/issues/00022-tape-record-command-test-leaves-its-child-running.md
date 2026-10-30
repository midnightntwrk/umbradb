# 00022 — The tape `record` command's process test leaves its child running when the test process is gone

- **Status:** CLOSED — fixed 2026-10-26 by task 0.5 of `openspec/changes/core-arch` (owner decision Q122), in the task's
  local commit: `test/tape/command.test.ts` starts `tools/tape/main.ts` with `spawnChild` (`test/child-processes.ts`),
  whose watcher kills the child when the test process ends. See "Resolution" below.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** test
- **Severity:** low
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, by the orchestrator, after task 12.2's runner reported two processes it had not started in lane
  3's worktree.

## Problem

`test/tape/command.test.ts` ("runs as a process of its own: record until SIGINT, then the tape and its SHA-256", task
9.2) starts `tools/tape/main.ts record` as a child process and stops it with SIGINT from the test itself. When the test
process ends without reaching that point — `--bail` stopping a mutation run at its first failure, a test's timeout,
Vitest killed — the child keeps running: `record` waits for SIGINT, and nothing else ends it. This is the class of
`docs/issues/00015` (the PGlite writer worker), which task 5.3 fixed for its own SIGTERM worker with an orphan guard.

## Evidence

- Two such processes were found on 2026-10-26, each with parent PID 1, started at 02:14:56 and 02:50:22 (task 9.2's
  mutation runs), each a `node --import tsx …/00028-core-arch-lane3/tools/tape/main.ts record --node
  ws://127.0.0.1:<port> --out /var/folders/…` listening on a localhost port; the orchestrator stopped them.
- `test/tape/command.test.ts:217` spawns the child; it is stopped only by the test's own SIGINT later in the same test.
- `tools/tape/main.ts`'s `record` mode has no check that its parent is still alive.

## Suggested fix

Give `tools/tape/main.ts` (in `record` mode, and any other mode that waits) the same orphan guard as task 5.3's
`test/runner/sigterm.worker.ts`: exit when the parent dies (poll `process.ppid` or watch a pipe from the parent), and
in the test, kill the child in a `finally` as well. Tasks 18.x, which start many child processes, should use one shared
helper for it.

## Resolution

Task 0.5 put the guard on the test's side, not in `tools/tape/main.ts`: a `record` that exits once its parent has gone
would end a recording an operator started in a terminal and then left (`nohup`, a closed terminal) — the command's
own behaviour is right for its users. The test starts both of its children (`record` and the usage run) with
`spawnChild` (`test/child-processes.ts`): the child is listed with the test process's watcher
(`test/orphan-watcher.mjs`), which kills it with SIGKILL as soon as the test process ends, however it ends — `--bail`,
a timeout, Vitest killed. This is the one shared helper the issue asks of tasks 18.x: every file under `test/` that
starts a child process uses it, and `test/child-processes.test.ts` fails on any that does not.
