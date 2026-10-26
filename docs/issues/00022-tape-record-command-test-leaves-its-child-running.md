# 00022 — The tape `record` command's process test leaves its child running when the test process is gone

- **Status:** OPEN
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
