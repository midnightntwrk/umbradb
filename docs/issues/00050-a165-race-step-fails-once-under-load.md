# 00050 — A165's race step on PostgreSQL with a transport failed once under load

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

In task 15.1a's third conformance gate (2026-10-28, load averages 42–50 from three lanes' test runs), A165's case "on
PostgreSQL 18, with a transport" failed in its last step, the race: a private start whose `hello` the relay holds
while the core is restarted with a third configuration (H3). The case's oracle reported:

- `the core's H3 is null` — the test never read the restarted core's `X-Umbra-Config-Hash`;
- `a start whose core changed its configuration during it: refused with null, not public-config-changed` — the held
  start did not stop with `public-config-changed`.

Every earlier step of the case passed (first start, changed, other, checked, accepted, again, twin). The same file
passed in the two gates before it (106.9 s and 24.5 s) and alone right after (`Tests 3 passed (3)`, 39.4 s).

`h3` stays null only when the race's callback — stop the core, restart it with H3 (`transportWithin(300_000)`), let
the held message through, read `/level`'s header — did not reach its last line before the start it races ended, so
under load the held start can end (or the attempt can return) before the restarted core is up and read; the oracle
then sees both problems at once. Nothing so far shows which side ended first.

## Evidence

- `test/private/accepted-hash-checks.ts:239–254` (the race step, `h3 = await headerHash(handle.api)` last) and `:316`
  (``if (h3 === null || h3 === h2) problems.push(`the core's H3 is ${h3}`)``).
- The gate's log (task 15.1a's scratch, `codex-runs/lane3-15.1a-conformance-3.log`): `test/private/accepted-hash.test.ts
  (3 tests | 1 failed) 114828ms`, `Test Files 1 failed | 298 passed (299)`, 786.3 s.

## Suggested fix

Report why the race ended as it did — the attempt's code, its log, and whether the callback finished — so that the
next failure says which side was early; then make the attempt wait for the callback to finish (or fail with the
callback's own error) before it judges the start, so a slow restart is a slow test rather than a wrong result.
