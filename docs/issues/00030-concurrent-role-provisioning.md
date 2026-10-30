# 00030 — Two processes starting at once on one PostgreSQL server race to create the same module roles

- **Status:** OPEN
- **Area:** bug
- **Severity:** med
- **Effort:** small — take a database lock around role creation, in both places that create roles (startup and restore).
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

A module's PostgreSQL role (`umbradb_m_<schema>`, DB-8) is a role of the whole server, not of one database. When two
processes start at the same instant against two databases of one PostgreSQL server — a core and a private process, or
two private processes, as a small deployment or a test may run them — both find the same roles missing and both run
`CREATE ROLE`. The second fails with SQLSTATE `23505` on `pg_authid_rolname_index`, and its startup refuses with
`database-error` (not retried); started again, it finds the roles and starts. Nothing serializes the provisioning
across databases.

Found by task 14.4's A120 test, which first started its two private processes at once on one PostgreSQL 18.6
container: one of them was refused at random (three runs, a different one twice). The test now starts them one after
the other; production deployments that give each private database its own server (Q90) do not meet it.

## Evidence

- `src/db/roles.ts:418`: the roles missing are read (`ROLE_FACTS`, `pg_roles`) in the startup transaction.
- `src/db/roles.ts:453`: ``for (const role of missingRoles) await tx.execute(`CREATE ROLE … NOLOGIN`)`` — no lock
  taken before the read, so two transactions on two databases both see the role missing.
- The refusal seen: `{ code: "database-error", details: { sqlstate: "23505", constraint: "pg_authid_rolname_index",
  table: "pg_authid", schema: "pg_catalog" } }` (task 14.4, scratch run of `test/private/privacy-checks.ts`).

## Suggested fix

Serialize role provisioning across the server: take a transaction-level advisory lock with a fixed key
(`pg_advisory_xact_lock`, which every database of the server shares) before reading the missing roles in
`prepareSchemas`, or create each role in a `DO` block that ignores `duplicate_object` / `unique_violation` and then
checks it can use it. Add a test that starts two processes on two databases of one server at once and expects both to
start.
