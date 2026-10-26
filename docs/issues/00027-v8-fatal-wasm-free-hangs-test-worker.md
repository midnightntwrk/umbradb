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
