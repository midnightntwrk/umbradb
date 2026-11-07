# 00032 — The runtime `npm audit` fails on zod 4.4.3 (GHSA-mrhx-c7xc-m3w5)

- **Status:** CLOSED — fixed 2026-10-27 by task 0.6 of `openspec/changes/core-arch` (the owner's answer: bump zod),
  in the task's local commit: `zod` `^4.6.7`, locked at 4.6.7; the runtime `npm audit --audit-level=high --omit=dev`
  finds 0 vulnerabilities. See "Resolution" below.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** deps
- **Severity:** high
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

The supply-chain workflow's blocking step `npm audit --audit-level=high --omit=dev`
(`.github/workflows/supply-chain.yml`, "npm audit -- blocking, runtime dependencies only (G18 D3)") fails on the clone
as it stands: the lockfile resolves `zod` `^4.0.0` to 4.4.3, and npm now reports a high-severity advisory for `zod`
below 4.6.6 — "Zod can exhaust memory while validating oversized constrained collections" (GHSA-mrhx-c7xc-m3w5).
UmbraDB validates the configuration file and the process transport's messages with zod (`src/config/`,
`src/private/`), so the advisory's input is reachable.

Found by task 15.1 (2026-10-27) while checking that its new dependency (`@electric-sql/pglite-tools`, development and
optional peer only) left the runtime audit as it was: it does — the finding is the same with and without the change.

## Evidence

- `npm audit --omit=dev` on the clone at `159232d` and with task 15.1's change: `zod <4.6.6`, severity high,
  `node_modules/zod`, "1 high severity vulnerability" both times.
- `package-lock.json`: `node_modules/zod` 4.4.3; `package.json`: `"zod": "^4.0.0"`.
- npm registry: zod 4.6.6 published 2026-10-11, 4.6.7 2026-10-12 (both older than `.npmrc`'s `min-release-age=7`).

## Suggested fix

Lock zod at 4.6.7 or later within `^4` (`npm install zod@^4.6.7`), re-run `test/dependencies/zod.test.ts` (task 0.1's
probe of the metadata and default behaviour 4.2 relies on) and the configuration and transport suites, and update
`docs/supply-chain/inventory.md`'s zod row.

## Resolution

Task 0.6 of `openspec/changes/core-arch` (2026-10-27): `npm install zod@^4.6.7` under the repository's `.npmrc`
(`min-release-age=7`, `ignore-scripts=true`) set `package.json`'s range to `^4.6.7` and locked 4.6.7 (`latest`,
published 2026-10-12; integrity `sha512-g8W2D2kU…+3CGwg==`; still no dependencies and no install script). The lock file
changed only zod's entry. `npm audit --audit-level=high --omit=dev`: 0 vulnerabilities (exit 0); the full audit went
from 9 (5 moderate, 4 high: the zod advisory and the dev graph's 8) to the dev graph's 8.
`test/dependencies/zod.test.ts` keeps task 0.1's probes (metadata, defaults, issue paths, `z.toJSONSchema`), which
pass on 4.6.7, and adds the fix: an array or set longer than its `max` is refused with one `too_big` issue, its elements
not parsed (on 4.4.3 the same 100,000-element array gave 100,001 issues). The fix caps collections that declare a
`max`; a collection without one still yields an issue per failing element, bounded by the input's size — the process
transport's messages by `ws`'s `maxPayload`. `docs/supply-chain/inventory.md`'s row and `design.md` §7 and §14 name
4.6.7.
