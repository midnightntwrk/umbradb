# 00082 — Two processes making their first start at once on one PostgreSQL server race on the module roles

- **Status:** OPEN
- **Area:** db (PostgreSQL roles, startup)
- **Severity:** low — only the first start of two databases of one server at the same instant, and a retry starts;
  the second process is refused, nothing is written wrong.
- **Effort:** small.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-03, `ledger-refcount` task 4.4 (lane C, branch `00034/4.4-restarts` from `b0ceee6`): R13's
  preprod test started its two runs (two databases of one PostgreSQL 18 test server) at the same moment, and one was
  refused at startup. Codex runs `4.4-preprod-1`, `4.4-preprod-2` and `4.4-preprod-pg-diagnostic-2` of the 00034
  organizer's research folder (`codex-runs/`). Met again the same day by task 4.6 (R28's devnet case, two processes
  started side by side on two new databases of one PostgreSQL 18.6 test server; Codex run `4.6-dag-devnet-2`), with
  the same refusal (`database-error`, `sqlstate` 23505, not retryable).

## Problem

PostgreSQL roles belong to the server, not to a database. On a database without them, startup creates each module's
role (`umbradb_m_<schema>`, `umbradb_i_<schema>`) in its schema transaction after reading which roles exist. Two
processes doing that at the same time on two databases of one server both find a role missing and both run
`CREATE ROLE`; the second one's statement fails on the catalog's unique index, and its startup is refused:

```
database: postgres test@localhost:56177/api_0 (ssl disable)
startup refused: database-error: duplicate key value violates unique constraint "pg_authid_rolname_index"
```

The next start of the refused process succeeds (the role exists by then). Two indexers sharing one server (a public
and a private process, or two networks) that start together on new databases meet it once.

## Evidence

- `src/db/roles.ts:447` — `missingRoles` is computed from a read of `pg_roles` (`ROLE_FACTS`) in the transaction;
  `src/db/roles.ts:482` creates each with `CREATE ROLE … NOLOGIN`, with nothing between the read and the create that
  another database's transaction would wait on (advisory locks are taken per database, `src/db/writer-lock.ts:48-51`).
- `src/db/roles.ts:576` — `restoreOwnership` creates missing roles the same way (a restore beside another first start).
- The run's process log above (`4.4-preprod-pg-diagnostic-2.out`); the same test with the two first starts one after
  the other passes.

## Suggested fix

Make the role's creation tolerate the race: create each missing role in a sub-transaction that treats an existing role
as done (`DO $$ BEGIN CREATE ROLE … NOLOGIN; EXCEPTION WHEN duplicate_object OR unique_violation THEN NULL; END $$`,
then re-read the role's facts), or retry the schema transaction once when `CREATE ROLE` fails with `23505` on
`pg_authid_rolname_index`, or take a server-wide advisory lock (`pg_advisory_xact_lock` on a fixed key) before
reading the roles in `prepareSchemas` and `restoreOwnership`, so startups on one server set roles up one at a time. A test: two processes started at the same moment on two new databases of one server, both
reaching their first block.
