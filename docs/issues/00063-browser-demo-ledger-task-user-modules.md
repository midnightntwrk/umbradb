# 00063 — The browser demo refuses user modules that declare ledger tasks: its ledger worker imports no user module

- **Status:** OPEN
- **Area:** browser demo
- **Severity:** low — the in-repository demo only; a page whose configuration adds a module with ledger tasks is
  refused at startup (`ledger-tasks-need-modules-from`), with the reason in the page's log. No released entry point is
  affected: `umbradb run` and `startUmbraDB` with `modulesFrom` run such modules.
- **Effort:** medium — the browser's ledger worker needs a user-module source of its own (a second bundled entry, or
  the configuration module bundled into `ledger-worker.js` too), and a test that a page's ledger task runs in it.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, filed as the `start-umbradb` change's design §6 asks ("a ledger-task user module is refused
  there, filed as an issue in `docs/issues/` when the demo change lands"), when the demo moved onto the engine (P7 of
  the plan).

## Problem

The demo's process worker starts the engine with the configuration's user modules as objects (`userModules:
{ modules }`), as `startUmbraDB({ config: { data }, modules })` does. Objects cannot cross into the ledger worker, which
imports its user modules from a module URL (`modulesFrom`, or a `{ file }` configuration). So the engine refuses a
build whose user modules declare ledger tasks, at startup's configuration step (class A): the page's core never opens
its database. The demo's ledger worker (`ledger-worker.js`) runs UmbraDB's own entry with no module named, so it carries
only the core modules' tasks.

## Evidence

- `src/runner/process.ts:1695` — the rule `ledger-tasks-need-modules-from` for user modules given as objects.
- `browser/src/process-worker.ts:250` — the demo starts the engine with `userModules: { modules }`.
- `browser/src/ledger-worker.ts:13` — the browser's ledger worker runs `src/ledger/worker/entry.ts`, which imports
  user modules only from `workerData.modules`, a URL (`src/ledger/worker/entry.ts:27-28`), which the browser never
  gives.
- `openspec/changes/start-umbradb/design.md` §6, last bullet; §7.2's table ("a ledger-task module in the demo").

## Suggested fix

Bundle the configuration module's user modules into the ledger worker as well (the build already resolves
`umbradb:configuration` for the process workers), and let the browser's ledger worker run with them, so the engine can
be given a user-module source both threads load (the browser's equivalent of `modulesFrom`). Then lift the refusal for
the demo, with a page test whose user module's ledger task runs in the ledger worker on both of a core's heights.
