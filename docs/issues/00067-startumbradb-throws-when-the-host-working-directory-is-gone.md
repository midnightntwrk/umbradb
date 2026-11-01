# 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists

- **Status:** CLOSED — fixed 2026-11-01 in `a469e20` (`start-umbradb` P10.4b): an absolute `cwd` is used as it is,
  without reading the working directory; `process.cwd()` is read only for a `cwd` absent or relative, guarded, and when
  it throws the options are refused at the configuration step (`invalid-configuration`, `invalid-option`) with a finding
  at `cwd` naming the remedy (an absolute `cwd`), through `started` — `startUmbraDB` returns its handle. Test:
  `test/library/start-umbradb.test.ts` › «LM-1: a host whose working directory was removed (issue 00067)», a child host
  (`test/library/gone-cwd.child.ts`) that removes its own working directory; it failed on the tree before the fix (all
  three starts threw `ENOENT … uv_cwd` out of the call) and passes after.
- **Area:** library
- **Severity:** low — a host whose working directory was removed under it; no bad option is involved, so LM-1's
  "never throws for bad options" is not broken, but the handle is not returned either.
- **Effort:** small — read the working directory only when `cwd` is absent or relative, guarded, and refuse through
  `started` when it cannot be read.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, while fixing the stage-4 finding C-F3 (`start-umbradb` P10.4a: option reads that throw
  synchronously), on a Mac with Node.js 24.9.0.

## Problem

`engineInputOf` (`src/library/start-umbradb.ts:206`) always calls `process.cwd()`, also when the host gives an absolute
`cwd`: `resolve(process.cwd(), values.cwd)`. Node.js's `process.cwd()` throws when the process's working directory has
been removed (`ENOENT: no such file or directory, uv_cwd`; a probe that `chdir`s into a temporary directory, removes it
and calls `process.cwd()` shows the throw). `startUmbraDB` then throws out of the call instead of returning its handle,
even when the host passed an absolute `cwd` that exists.

## Evidence

- `src/library/start-umbradb.ts:206`: `const cwd = typeof values.cwd === "string" ? resolve(process.cwd(), values.cwd) : process.cwd();`
- Design §3.3 and D-14: the Node entry reads `process.cwd()` for the `cwd` default only.

## Suggested fix

Use an absolute `cwd` as it is, without reading the working directory; read `process.cwd()` only for an absent or
relative `cwd`, guarded, and on a throw refuse at the configuration step (class A, through `started`) with a finding at
`cwd` that names the reason (give an absolute `cwd`). A test: a child process that removes its own working directory,
then starts UmbraDB with an absolute `cwd` (starts) and without one (refused, not thrown).
