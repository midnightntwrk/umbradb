# 00056 — A private process with no way to read the public data is refused only after its admin listener opens

- **Status:** OPEN
- **Area:** config
- **Severity:** low — it is refused with a clear code; only the moment is late (the process stays up `refused`
  instead of exiting before it serves anything), and `umbradb config check` does not report it.
- **Effort:** small — move the check into startup's configuration step.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-31, in the round-4 review of the `startUmbraDB` design (Opus F6). Moved out of that spec on
  2026-11-01 so it stays focused on the library refactor.

## Problem

A private process whose `core` entry has neither a link to the public process (`coreTransport`) nor a PostgreSQL
`publicDatabase` (absent, or PGlite) cannot read the public data. This is a fact of the configuration alone, but it is
refused only when the private source is made, after the admin listener has opened: the process stays up `refused`
(`invalid-configuration`, reason `public-database-transport`) instead of ending at startup's configuration step, and
`config check` accepts the file.

## Evidence

- `src/backbone/core-private-source/public-database.ts:217-231` — the refusal, thrown when the private source is made.
- `src/runner/process.ts:1139-1163` — the admin listener is served before that point.

## Suggested fix

Refuse it with the configuration's own refusals (before the admin listener; exit 1 in the command; reported by
`config check`), keeping its code and reason. A breaking change to the command's timing only, with a CHANGELOG note.
