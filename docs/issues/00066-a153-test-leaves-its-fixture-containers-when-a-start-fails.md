# 00066 — A153's container test leaves its fixture containers running when one of its three starts fails

- **Status:** OPEN
- **Area:** test
- **Severity:** low — a PostgreSQL container left running on a shared machine after a red run; no product behaviour
  is in question.
- **Effort:** small — start the three containers so that a failure of one still reaches the cleanup.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, in the full run at the end of `start-umbradb` P8 (Mac, Node.js 24.9.0, Docker 29.8.2, 12 CPUs,
  `npx vitest run`, 48 min on a loaded machine: load average about 20, Docker Desktop's own `com.docker.sailor` at
  about 200 % CPU and another program of the owner's beside it).

## Problem

`test/containers.test.ts`, "is removed when the process that started it is killed; one started without the guard stays
(negative control)" (A153), starts three containers at once — a guarded parent's, an unguarded parent's (both labelled
`org.umbradb.test.fixture=<fixture>`) and a bystander through `startContainer` — with `Promise.all`, and only then
enters the `try` whose `finally` removes all three by id. In that run the bystander's start failed ("Health check not
healthy after 120000ms", as four suites' containers did beside it), so `Promise.all` rejected before the `try`: the
`finally` never ran, and the two parents' containers were left to the test process's watcher. Four minutes after the run
ended, one container with the test's fixture label (`org.umbradb.test.fixture=648f36e0-…`, created during the test) was
still running, its parent gone; it was removed by hand (`docker rm -f`). Why the watcher (`test/orphan-watcher.mjs`,
through `guardContainers` in `test/child-processes.ts`) had not removed it once the test process ended was not
investigated.

## Evidence

- `test/containers.test.ts:164-168`: `const [guarded, plain, bystander] = await Promise.all([...])` before `try {`
  (`:169`), whose `finally` (`:185-194`) is the only removal by id.
- `test/containers.test.ts:162`: `guardContainers` given the fixture's label filter, the watcher meant to remove both
  fixture containers "if this test dies before its cleanup".
- The run's log: the test's failure `Error: Health check not healthy after 120000ms`
  (`node_modules/testcontainers/build/wait-strategies/health-check-wait-strategy.js:16`); after the run, `docker ps`
  showed the fixture container `Up 7 minutes (healthy)` with no test process running.

## Suggested fix

Start the three with `Promise.allSettled`, keep every container that did start, and run the removal in a `finally`
that covers the starts too (then rethrow the first failure). Check, with a test that kills its own process while a
fixture container is up, that the watcher removes label-matched containers when the process ends.
