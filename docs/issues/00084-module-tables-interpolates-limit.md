# 00084 — The contents hash's key-ordered read splices its page size into `LIMIT`

- **Status:** OPEN
- **Area:** determinism (contents hash, primary-key order)
- **Severity:** low — the value is checked to be a positive safe integer before it reaches the text, so it cannot
  carry SQL; but the repository rule (`AGENTS.md`, "SQL discipline" and "Per-change security checks") lets a value
  reach SQL only as a bound parameter, and calls a spliced value blocking.
- **Effort:** small.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-03, while fixing finding C4 of the cold review of `ledger-refcount`
  (`audits/00034-ledger-node-refcount-review-cold-codex.md` in the 00034 organizer's folder), on branch
  `00034/p8-fixes` from `320d172`. C4 was the same pattern in `src/backbone/core-ledger-state/node-set.ts`, which
  that change added and that fix binds. This one predates the change: it came with `core-arch`, in `76d640f`
  (`feat(determinism): primary-key order and the contents hash for DT-2, DT-3`), so it is left to a change of its
  own.

## Problem

`rowsInKeyOrder` reads a module table a page at a time for the contents hash and for primary-key order. It builds
both of its statements with the page size written into the text, `ORDER BY … LIMIT ${pageSize}`, while the last key
read is bound (`$1::type`, …). The page size is the caller's `pageSize` option (the contents hash's own, or 1,000).

## Evidence

- `src/determinism/module-tables.ts:214` — `const tail = \`ORDER BY ${order} LIMIT ${pageSize}\`;`, used by both
  `firstPage` and `nextPage` (lines 215–216).
- `src/determinism/module-tables.ts:205-208` — the only check before it: `Number.isSafeInteger(pageSize)` and
  `pageSize >= 1`.
- `src/determinism/module-tables.ts:41-42` — the module comment describes the pagination as `… LIMIT n`.
- `src/determinism/contents-hash.ts:91` — the contents hash passes its `options.pageSize` through.

## Suggested fix

Bind the page size as the statement's last parameter: `LIMIT $1` on the first page, and `LIMIT $<k + 1>` on the
next pages, after the `k` key columns' `$1 … $k`; pass `[pageSize]` and `[...after, pageSize]`. PostgreSQL 18 and
PGlite 0.5.10 both take a bound `LIMIT` (the node set's read in `node-set.ts` does since C4's fix, and its tests run
on both). `test/determinism/cross-backend.test.ts` hashes at page sizes 7, 250 and the default on both backends;
run it with the change.
