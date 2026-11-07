# 00058 — Backing up and restoring a library host's database with `umbradb backup`/`restore` is not documented

- **Status:** OPEN
- **Area:** docs
- **Severity:** low — `UmbraDBHandle.backup()` covers backups; only the command path for a library host is unclear.
- **Effort:** small — a module-guide section, and a criterion if the path is promised.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-31, in the round-5 and round-6 reviews of the `startUmbraDB` design (owner decision D-25, Opus
  F6, Opus r6 F3). Moved out of that spec on 2026-11-01 so it stays focused on the library refactor.

## Problem

`umbradb backup`, `umbradb restore` and `umbradb config check` read a configuration file whose default export is the
configuration data and whose `modules` export lists the user modules. A host that starts UmbraDB with `{ data }` has
no such file unless it writes one, and some library setups cannot use the commands at all:

- an in-memory PGlite database (nothing to back up from outside the host);
- a host that ran on an in-memory block source: a public restore checks against the configured `node`;
- a private process linked over channels or `connect`: a private restore reads the public side through a PostgreSQL
  `publicDatabase` or the link address the file writes (today's behaviour, kept by owner decision D-25), so such a host
  must give the restore a file that writes the public process's address;
- relative paths resolve against the command's working directory, not the host's `cwd`.

## Evidence

- `src/cli/configured.ts:75-96` — the commands build their declarations from the file's `modules` export.
- `src/cli/restore.ts:106-139` — the restore's chain: the node, or for a private process its public side.
- `test/backup/restore-private.test.ts` — the private restore through the core's transport.

## Suggested fix

Document the command path for library hosts in the module guide (the file to write, the cases above), or add a
public restore API (out of scope of the `startUmbraDB` spec, §13).
