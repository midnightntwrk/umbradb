# 00033 — `umbradb restore` fails on a configuration with a module whose entry starts above the backup's height

- **Status:** CLOSED — fixed 2026-10-29: `restoreGrants` runs `prepareSchemas` before the `REVOKE`, so the schema of a
  module starting above the backup's height exists; `test/backup/restore.test.ts` restores with such a module on both
  backends.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

A restore (BK-3, `src/backup/restore.ts`) whose configuration enables a module only from a height above the backup's
— the handoff of CC-4, a backup taken with `core-contract-logs-full` restored with the configuration that continues it
with `core-contract-logs-fast` from h + 1 — loads the dump and then fails inside its transaction with `database-error:
schema "core_contract_logs_fast" does not exist`, on PostgreSQL 18.6 and on PGlite 0.5.10. The transaction rolls back
and the target stays empty, so nothing is lost, but such a configuration cannot be restored: the operator has to
restore with the configuration the backup was taken with, and add the later entry when the restored database first
starts (which works: task 13.1's A111 does exactly that).

The configuration is valid: its history check passes (the new entry starts above the cursor), and the same
configuration starts a process on the restored database without complaint.

Found by task 13.1 (2026-10-27) while writing A111's test (`test/backbone/contract-logs-handoff.ts`).

## Evidence

- `src/db/migrate.ts:366-371` (`restoreGrants`): for every schema of the configuration's schema plan, `SET LOCAL ROLE`
  to its role and `REVOKE EXECUTE ON ALL ROUTINES IN SCHEMA <schema> FROM PUBLIC` — before `prepareSchemas` (line 372)
  creates any schema. The plan (`src/backup/restore.ts:205`, `schemaPlan(graph.modules)`) holds every module of the
  configuration, so also one whose first entry starts above the backup's height and whose schema no backup can hold.
- Reproduced with a scratch probe (task 13.1's record): the A111 backup restored with `-fast` from 4 in its
  configuration fails as above on both backends; restored with the backup's own configuration it succeeds, and the
  continuation with `-fast` from 4 passes.

## Suggested fix

In `restoreGrants`, create the schemas first (`prepareSchemas` before the `REVOKE` loop: an empty schema has no
routine to revoke), or leave out of the `REVOKE` loop the schemas the dump did not create. Either way, add a restore
test whose configuration starts a module above the backup's height, on both backends.
