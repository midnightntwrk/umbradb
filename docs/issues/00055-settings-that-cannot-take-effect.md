# 00055 — Settings that cannot take effect are accepted silently, or wait for ever

- **Status:** OPEN
- **Area:** config
- **Severity:** low — nothing wrong is stored; an operator's mistake goes unnoticed (or, for lockstep, the core waits
  for an instance that can never connect).
- **Effort:** medium — five configuration rules, a breaking change to the command for each, and the knock-on for
  `umbradb backup`/`restore` described below.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-30, in the `startUmbraDB` design reviews (workspace spec
  `/Users/edwardalvarado/todo/Umbra/spec/00028-umbradb-core-arch-startumbradb.md`, rounds 2–6: owner decisions D-11
  and D-20). Moved out of that spec on 2026-11-01 so it stays focused on the library refactor.

## Problem

A configuration is accepted although part of it can never take effect:

1. `tls` written while the process has no private link (no `listen.privateLink`, no `privateLink`; before the rename of
   change `start-umbradb`, `listen.transport` and `coreTransport`) — ignored.
2. `transportReader` written while the public process has no link — ignored.
3. A private-link listen address (`listen.privateLink`, formerly `listen.transport`) written on a private process —
   ignored.
4. `--update-hash` (the private side's `updateHash`) given to a public process — ignored.
5. `lockstepInstances` on a core with no link — the core waits for ever for instances that cannot connect (owner
   decision Q24: "keeps waiting for it").

During the `startUmbraDB` design the owner decided these should be refused everywhere (D-11 "bad configurations are
refused everywhere; no setting is silently ignored"; D-20 for items 1–3), as breaking changes to the command. That
work is not needed by the library refactor, so it is recorded here.

## Evidence

- `src/config/core-settings.ts:192` — `tls` has no rule tying it to `listen.privateLink` or `privateLink` (then
  `listen.transport` and `coreTransport`).
- `src/config/core-settings.ts:178-185` — `listen` (with `privateLink`, then `transport`) is in both sides' schema;
  `src/runner/process.ts:1336` opens the core transport only on the public side, so on a private process the address
  is ignored.
- `src/config/core-settings.ts:236` (`transportReaderRule`) — `transportReader` is required on PostgreSQL with
  `listen.privateLink` (then `listen.transport`) and refused on PGlite; nothing refuses it without a link.
- `src/config/core-settings.ts:284` — `lockstepInstances` defaults to `[]` with no rule on the link;
  `openspec/changes/core-arch/specs/private-processes/spec.md:105-117` (Q24) and `test/private/lockstep-wait.test.ts`,
  `test/private/privacy.test.ts` keep the wait.
- `src/cli/run.ts:20`, `:243`; `src/runner/process.ts:346` — `updateHash` is passed whatever the side.

## Suggested fix

Refuse each case at startup, before anything opens (exit 1 in the command): `private-link-misconfigured` with
reasons `tls-unused`, `reader-unused`, `listen-on-private`, `lockstep-without-link`, and `accept-hash-on-public` for
item 4; reverse Q24 for item 5; one CHANGELOG note per breaking change; `umbradb config check` reports them.

**Knock-on found in the design reviews:** `umbradb backup` and `umbradb restore` validate the same file. A library
host that gives its private link in code (channels, `connect`, `{ host, port }`) writes no link address but may write
`transportReader` and `lockstepInstances`, so a backup or restore of its database would then be refused
(`reader-unused`, `lockstep-without-link`). The reviewed answer (owner decision D-24): `backup` and `restore` check
only the rules that do not depend on how the link is given; `config check` keeps checking what `umbradb run` would
start. Audits: `/Users/edwardalvarado/todo/Umbra/audits/00028-umbradb-core-arch-startumbradb-design-r4-*.md`.
