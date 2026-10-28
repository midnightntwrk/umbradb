# 00027 — A Vitest worker hung for 24 minutes in V8's fatal-error path while freeing WebAssembly code

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 10.2a of `openspec/changes/core-arch`, in a run of `npx vitest run test/runner
  test/backbone test/admin test/private test/config test/cli` (76 files) on Node.js v24.9.0 at a load average of 10–28.
  Nothing of task 10.2a's change is involved: the crash is inside V8.

## Problem

One Vitest fork worker (a test file of the run's first batch) stopped making progress and used 100 % of a CPU for 24
minutes; Vitest's per-test timeout never fired, because the worker's main thread no longer ran JavaScript. The other 75
files had passed (`Tests 1552 passed | 6 skipped`). Killing the worker ended the run with `Worker exited unexpectedly`
(exit 1); every candidate file of that batch (22 files: `test/admin`, `test/backbone/core-health`,
`test/backbone/core-digest`, `test/runner/halts`, `loop`, `upgrade-boundary`, `stop-heights`, `test/private/intake`,
`binding`, `determinism`, `test/backbone/ingest*`) then passed when run again (370 tests). A run of the conformance gate
that meets it would hang the same way, with no timeout to end it.

## Evidence

A `sample` of the hung worker (macOS, 2 s, kept as `v8-fatal-sample.txt` in the task's scratch directory):

- the main thread: a microtask after `FileHandle.close` → JavaScript → WebAssembly (`JSToWasmWrapper`, twice) →
  `Runtime_TierUpWasmToJSWrapper` → `WasmCodeRefScope::~WasmCodeRefScope` → `WasmEngine::FreeDeadCode` →
  `WasmImportWrapperCache::Free` → `WasmCodeAllocator::FreeCode` → `ThreadIsolation::UnregisterWasmAllocation` →
  `ThreadIsolation::TryLookupJitPageLocked` → `V8_Fatal`, and inside it the signal trampoline and libuv's signal
  handler — the fatal error never completed;
- a worker thread (`node::worker::Worker::Run`, the admin endpoints' thread, `src/admin/server.ts`, is the only
  `Worker` the sources start): a timer → JavaScript → `StackGuard::HandleInterrupts` →
  `WasmEngine::ReportLiveCodeFromStackForGC` → `WasmImportWrapperCache::Lookup` → `absl::Mutex::Lock`, waiting.

So V8 failed a check of its JIT page bookkeeping while freeing WebAssembly import wrappers (PGlite's engine on the main
thread), with another isolate of the process walking its stack for WebAssembly code, and the fatal path then hung.

## Suggested fix

Look for the V8 issue (Node.js 24's `ThreadIsolation` with WebAssembly import-wrapper tier-up and worker isolates) and
move to the Node.js release that fixes it; meanwhile give the conformance gate a wall-clock limit per run (so such a hang
fails the gate instead of stopping it), or run the files that start the admin worker thread and PGlite in one process
in their own pool. Record the Node.js version with each conformance run.

## Further occurrences

### Occurrence of 2026-10-27, task 15.1a's conformance gate ("seen again")

During task 15.1a's conformance gate (2026-10-27, Node.js 24.9.0, load averages 30–55), one Vitest worker process
stopped making progress for over an hour at 99 % CPU; every other test file had reported, and the gate never ended.
The only file not reported was `test/admin/default.test.ts`, whose processes run PGlite (WebAssembly) on the main
thread with the admin endpoints in a worker thread. No test timeout fired, since the process was no longer running
JavaScript: V8 itself had failed.

A native sample of the worker (macOS `sample`) shows:

- **the main thread** in `V8_Fatal`, then `v8::base::OS::Abort()`, looping through `_sigtramp` and libuv's signal
  handler, reached from PGlite's wasm code: `Runtime_TierUpWasmToJSWrapper` → `WasmCodeRefScope::~WasmCodeRefScope`
  → `WasmEngine::FreeDeadCode` → `WasmImportWrapperCache::Free` → `WasmCodeAllocator::FreeCode` →
  `ThreadIsolation::UnregisterWasmAllocation` → `ThreadIsolation::TryLookupJitPageLocked` → `V8_Fatal`;
- **a worker thread** (`WorkerThread`, in a timer callback) blocked in `absl::Mutex::LockSlowLoop` under
  `WasmEngine::ReportLiveCodeFromStackForGC` → `WasmCodeManager::LookupCode` → `WasmImportWrapperCache::Lookup`: it
  waits on the wasm import-wrapper cache's lock, which the dying main thread holds.

So the crash cannot complete (the abort path spins in the signal handler) and the worker never exits; Vitest waits
for it without limit, and the gate with it. Killing the worker ended the run: Vitest reported `Error: Worker exited
unexpectedly` and the gate exited 1.

#### Evidence

- The sample: `scratchpad/lane3-15.1a/sample.txt` (task 15.1a's scratch, not in the repository); the frames above.
- The gate's log: `Test Files 1 failed | 297 passed (299)`, `Caused by: Error: Worker exited unexpectedly`, 4,370.5 s.
- `test/admin/default.test.ts:178` (`describe.each(PROCESS_BACKENDS)`): processes started without `admin: false`, so
  each serves its admin endpoints from a worker thread (`src/admin/server.ts`) beside PGlite on the main thread.
- No code of UmbraDB runs in the failing frames: the fatal is inside V8's wasm code management
  (`ThreadIsolation::TryLookupJitPageLocked`), which JavaScript cannot reach.

#### Suggested fix

1. Reproduce: run `test/admin/default.test.ts` (and the other suites that start PGlite processes with worker threads)
   in a loop on Node.js 24.9.0 under load, and check whether a newer Node.js 24 release still fails. A V8 fix for the
   wasm import-wrapper cache and the JIT page registry would be the real fix; pin the Node.js release CI uses to one
   without it.
2. Bound the gate's wait for a worker: Vitest's `teardownTimeout` does not cover a worker that stopped running
   JavaScript, so a watchdog in `scripts/conformance-gate.mjs` that ends the run after a fixed time with no test
   reported, naming the files still running, would turn this hang into a failure the gate reports.
