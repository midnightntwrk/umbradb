# 00011 — A server `FATAL` while a statement is pending reaches the database API as `CONNECTION_CLOSED`: the server's reason is lost

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-25, during task 2.7 of `openspec/changes/core-arch` (timeouts by connection role), in the
  negative control that runs the database API without its zero timeouts against 1 s database defaults.

## Problem

When PostgreSQL ends a session with a `FATAL` error — `transaction_timeout` (`25P04`), `idle_in_transaction_session_timeout`
(`25P03`), `pg_terminate_backend` (`57P01`), a shutdown — the database API's PostgreSQL backend reports `connection-lost`
with `details.cause` `"CONNECTION_CLOSED"` (or `"lost-earlier"`), never the server's SQLSTATE or message. The
classification is right (DB-13: a lost connection, retryable), but an operator reading the error cannot tell a timeout
set somewhere on the server from an administrator's `pg_terminate_backend` or a crash: the reason PostgreSQL gave is
dropped before the API sees it.

The cause is the driver, `postgres` 3.4.9. An `ErrorResponse` that arrives while a statement is pending is kept until
the `ReadyForQuery` that normally follows; after a `FATAL` the server closes the socket instead, and the close handler
rejects the pending statement with its own `CONNECTION_CLOSED` error, discarding the kept one. One that arrives while no
statement is pending is not passed to anyone at all. So `LOST_SQLSTATES` in `src/db/postgres.ts`, which lists the
server codes of a lost session, is seldom what decides: the driver's codes are.

Observed on PostgreSQL 18.6: four checks cut off by 1 s `transaction_timeout` and `idle_in_transaction_session_timeout`
defaults all failed with `connection-lost`, `details { connection, cause: "CONNECTION_CLOSED" }` or
`cause: "lost-earlier"`; a probe with a read idle past its `idle_in_transaction_session_timeout` saw no error at all
until its next statement (task 2.7's record in the plan, "Probes").

## Evidence

- `node_modules/postgres/src/connection.js:812-819` (`ErrorResponse`): with a query pending, the error is stored in
  `errorResponse`; with none, it goes to `errored`, which has no query to reject.
- `node_modules/postgres/src/connection.js:436-457` (`closed`): `error(Errors.connection('CONNECTION_CLOSED', …))`
  for the pending query, without looking at `errorResponse`.
- `src/db/postgres.ts:100-120` — `LOST_SQLSTATES` and its comment, which name `25P03`, `57P01` … as what the API
  classifies.
- `test/db/zero-timeouts.negative-control.test.ts` — the checks whose errors showed it.

## Suggested fix

Not urgent: the error code and retryability are right. Either (a) document in `src/db/postgres.ts` that a server's
`FATAL` usually arrives as the driver's `CONNECTION_CLOSED`, so `details.cause` names the driver's code, and keep
`LOST_SQLSTATES` for the cases where the server's code does arrive; or (b) propose upstream that `postgres` reject a
pending query with the stored `ErrorResponse` when the socket closes after it (and expose one that arrives while idle,
for example through `onclose`), then read the SQLSTATE from it here.
