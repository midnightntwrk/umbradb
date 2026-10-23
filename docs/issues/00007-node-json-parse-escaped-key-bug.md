# 00007 — Remove UmbraDB's own JSON reader once Node.js fixes `JSON.parse`'s escaped-key bug

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-23, during task 2.2 of `openspec/changes/core-arch` (the PGlite backend), by the A7 differential's
  seeded round trip; the owner decided to keep the workaround (the decision record's Q78) and to track its removal here.

## Problem

`src/db/mapping.ts` reads `json` and `jsonb` with its own reader of RFC 8259's grammar (`parseJsonLossless`) instead of
`JSON.parse`, because of a V8 bug in every Node.js 24 and 26 release: once a `JSON.parse` in the process has read an
object whose key is a single backslash (`{"\\": …}`), a later `JSON.parse` can read an object key that is one escape
sequence (`"\t"`, `"\n"`, `"\r"`, `"\b"`, `"\f"`, `"\""`, `"\/"`, `"\u00e9"`, …) as a backslash, silently. Two different
documents then read back equal, and two databases holding the same rows can hash differently. The reader is a
workaround; it is also faster than `JSON.parse` with the source-text reviver it replaced (1.7–2.6× on 0.2 kB–930 kB
documents, Node.js v24.9.0, 2026-10-23), so removing it is a choice, not a need.

## Evidence

- Reproduction (Node.js v24.9.0, V8 13.6.233.10-node.27, 3 runs of 3; not on v24.2.0 or v22.13.1 on the same machine):
  `JSON.parse('{"\\\\":1}')`, then `Object.keys(JSON.parse('{"\\t":1}'))[0]` is `"\\"`, not a tab.
- Upstream: https://github.com/nodejs/node/issues/63785 (open; reported on Node.js 24.13.1–24.21.0 and 26.3.0–26.10.0,
  not on 22); V8 fix https://github.com/v8/v8/commit/93cd21e8254b65c15ff131b2dcadf19beadb559d (2026-09-17, "skip fast
  transition path for escaped keys"); Node.js backport https://github.com/nodejs/node/pull/66542 (open, 2026-10-05).
- The workaround: `src/db/mapping.ts` (`parseJsonLossless` and its comment), `design.md` §4 "Lossless `jsonb`" and §14
  of `openspec/changes/core-arch/`; its tests: `test/db/mapping.test.ts` ("reads an object key that is one escape
  sequence as its character, also after the key \"\\\\\" was read").

## Suggested fix

When a Node.js 24 (and 26) release carries V8 `93cd21e`: raise the repository's `engines.node` to it, check the
reproduction above no longer misreads on it, then either keep the reader (it is faster) or replace it with `JSON.parse`
and a reviver using source text access (`context.source`), keeping `test/db/mapping.test.ts`'s escape and round-trip
tests, which must pass either way. Update `design.md` §4 and §14 (or their archived copies) in the same change.
