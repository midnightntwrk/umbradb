# 00065 — Node.js 24.9.0's V8 aborts in its JIT page bookkeeping freeing WebAssembly code, and a test fork hangs

- **Status:** OPEN
- **Area:** test environment (Node.js / V8)
- **Severity:** medium — when it strikes, a test fork neither finishes nor exits: the full run waits for it without
  end (it held one run 22 minutes until the fork was killed) and that file's results are lost; nothing in UmbraDB's
  code is in the failing stack.
- **Effort:** unknown — first, whether a later Node.js 24 release carries V8's fix; otherwise a way to keep a dying
  fork from hanging the run.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, twice during `start-umbradb` P7 (Mac, Apple Silicon, Node.js 24.9.0, `npx vitest run`, the
  `forks` pool): in a run of `test/library` with `test/admin`, and in the second phase-end full run. Never seen in the
  earlier phases' runs.

## Problem

A test fork's main thread hits `V8_Fatal` — `# Fatal error in , line 0 # Check failed: end > addr.` — inside V8's
`ThreadIsolation::LookupJitPage` / `TryLookupJitPageLocked`, called from
`ThreadIsolation::UnregisterWasmAllocation` ← `WasmCodeAllocator::FreeCode` ← `WasmImportWrapperCache::Free` ←
`WasmEngine::FreeDeadCode` ← `WasmCode::DecrementRefCount` ← `Runtime_TierUpWasmToJSWrapper`: V8 freeing a
WebAssembly-to-JavaScript wrapper it tiered up, from a WebAssembly module called from a promise continuation (PGlite's
or a ledger package's). The process does not then exit:

- In the first case the fork's error reached the run's output and the run stopped reporting; one fork was left
  orphaned (parent 1) at about 94 % CPU and was killed.
- In the second, a native sample of the stuck fork (`sample <pid>`) showed its main thread inside `V8_Fatal`, looping
  in the signal handler (`_sigtramp` → `uv__signal_handler`), and one of its worker threads blocked on the
  `ThreadIsolation` mutex (`RegisterJitAllocation` → `absl::Mutex::Lock`) while compiling a regular expression.
  Killing the fork let Vitest finish: "Worker exited unexpectedly", the file uncounted (372 of 373 files reported).

## Evidence

- The two runs' logs: the `start-umbradb` plan's P7 notes (`p7/logs/p71-set.log`, `p7/logs/full-2.log`, and the
  stuck fork's sample `p7/logs/sample.txt`, in that session's scratchpad).
- Both stacks end in V8 (`v8::internal::ThreadIsolation`, `v8::internal::wasm`), below a `Builtins_WasmToJsWrapperCSA`
  frame; no UmbraDB or test frame is between the WebAssembly call and the fault.

## Suggested fix

Check the V8 changes of later Node.js 24 releases for this check in `ThreadIsolation` (JIT page tracking of WebAssembly
wrappers) and pin a release that has the fix; meanwhile, find whether `--no-wasm-tier-up` (or `--liftoff-only`) in the
forks' `execArgv` avoids it, and give the full run a watchdog that kills a fork silent for longer than the slowest
file's budget, so a hang shows as that file's failure instead of a run that never ends.
