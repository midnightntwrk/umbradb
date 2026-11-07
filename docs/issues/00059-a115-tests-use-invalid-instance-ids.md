# 00059 — A115's fault tests send instance ids the 00051 rule refuses, so 18 transport tests fail

- **Status:** CLOSED — fixed 2026-11-02 in `f35dbbc` (`start-umbradb` P11.1): each fault case greets as
  `fault-${idOf(name)}` and `after-${idOf(name)}`, where `idOf` replaces every character an instance id does not allow
  with `-` (18 ids, all distinct, all matching `INSTANCE_ID`); the assertions are unchanged, and each case again reaches
  and checks the fault it names. Before, on PostgreSQL 18 and PGlite: 18 of the file's 39 tests failed; after: 39
  passed. A search of the tests (every `hello(…)`, `greeted(…)`, `instance:`, `instanceId:`, `lockstepInstances:` and
  the constants they name) found no other id the rule refuses besides the deliberate negative cases.
- **Area:** test
- **Severity:** high — 18 tests of `test/private/transport.test.ts` fail on PR #16's head (`c5cdb86`) on both backends,
  so the conformance run is red; the transport itself behaves as specified.
- **Effort:** small — give each fault case a valid instance id.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, in the baseline run of the `start-umbradb` plan (Node.js 24.9.0, Docker 29.8.2): 18 failures
  `no hello-ack within 30000 ms; received []`, reproduced with the file run alone. Introduced by commit `8f55772`
  (issue 00051, the instance id rule), which was pushed to PR #16.

## Problem

The `it.each` cases of A115 ("… closes the connection (1008), and the core keeps serving others") greet with
`hello(\`fault-${name}\`)`, where `name` is the case's label, for example `an unknown v`. Since issue 00051, an
instance id is 1 to 128 of `[A-Za-z0-9._:-]`: an id with a space fails `hello`'s schema, the core closes the
connection, and the test waits for a `hello-ack` that never comes.

## Evidence

- `test/private/transport.test.ts:363` — `client.send(hello(\`fault-${name}\`))`; the labels at `:344-358` hold spaces.
- `src/private/instance-id.ts` — `INSTANCE_ID = /^[A-Za-z0-9._:-]{1,128}$/`; `HELLO.instance` uses it.
- `test/private/raw-client.ts:84` — the `no hello-ack within 30000 ms` failure.

## Suggested fix

Derive a valid id from the label (for example `fault-${name.replace(/[^A-Za-z0-9._:-]/g, "-")}`) or number the cases;
the assertions stay as they are. Fix before the next push to PR #16.
