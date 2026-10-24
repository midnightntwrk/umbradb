# 00009 — The recovery evidence says its PostgreSQL image was digest-pinned; the test setup used a tag

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-24, during task 0.4 of `openspec/changes/core-arch` (PostgreSQL 18 pins, owner decision Q82),
  while deciding which documents that name `postgres:17-alpine` are records of past runs.

## Problem

`docs/recovery/EVIDENCE.md` records the release-candidate run of 2026-07-25 (`npm run test:live`, commit `8a684fc`).
Its environment table says the database was "Testcontainers `postgres:17-alpine` (digest-pinned in the test setup)".
It was not digest-pinned: the test setup of that commit started the container from the tag alone, so the run's
image was whatever `postgres:17-alpine` named on that day, and the record cannot say which image it was.

## Evidence

- `docs/recovery/EVIDENCE.md:28` — "Testcontainers `postgres:17-alpine` (digest-pinned in the test setup)".
- `test/integration/preprod-db-sync.integration.test.ts:41` at `8a684fc` starts its database with
  `startTestDatabase()`, and `test/postgres/setup.ts:26` at `8a684fc` (and until task 0.4) is
  `container = await new PostgreSqlContainer("postgres:17-alpine").start();`, a tag with no `@sha256:` digest. The
  only digest-pinned PostgreSQL image of the repository then was the benchmark's (`bench/environment.ts`,
  `postgres@sha256:742f40…`), which the live suites do not use.
- Since task 0.4 every PostgreSQL container, the test setup's included, starts from one digest-pinned image
  (`test/postgres-image.ts`), so the claim would be true of a run made now, not of the recorded one.

## Suggested fix

Leave the record of the run as it is, and add a note under its environment table: the test setup pinned the tag, not a
digest, at that commit, so the image cannot be identified after the fact; the digest pin dates from task 0.4 of
`openspec/changes/core-arch` (2026-10-24).
