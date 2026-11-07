# 00038 — The A87 registry cannot name a test written with `it.runIf` or `it.skipIf`

- **Status:** OPEN
- **Area:** test
- **Severity:** low
- **Effort:** medium — teach the requirement-to-test list to see one-database tests, then register the 12 such tests.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

A87's registry (`test/runner/code-registry.ts`) names, for each refusal and halt code of `design.md` §11, the tests
that trigger it and check its code, by file and title; `registryProblems` finds each test in its file's text. It reads
only the calls `it(…)`, `test(…)`, their `.concurrent` forms and `tapeTest(…)` (`TEST_CALLS`). A test that runs on one
backend only is written `it.runIf(condition)(title, body)`: its call's callee is `it.runIf(…)`, which the registry
does not read, so such a test cannot be registered — the registry reports "has no test titled …".

Found by task 14.1b: A162's transport-less case (`test/private/config-hash.test.ts`, PostgreSQL only, an
`it.runIf(backend.kind === "postgres")(…)`) triggers and checks `public-config-changed` but could not be registered
beside the transport case, which is.

## Evidence

- `test/runner/code-registry.ts:85` (`TEST_CALLS`) and `:118` (`TEST_CALLS.get(node.expression.getText(file))`).
- Six tests of `test/` use `it.runIf` or `it.skipIf` today (`git grep -n "it.runIf\|it.skipIf" -- test`).

## Suggested fix

In `testsIn`, read a call whose callee is itself a call of `it.runIf`, `it.skipIf`, `test.runIf` or `test.skipIf` as a
test call, its title and body the outer call's first and second arguments. Add a row to
`test/runner/code-registry.test.ts`'s parser tests, and register A162's transport-less case for
`halt:public-config-changed`.
