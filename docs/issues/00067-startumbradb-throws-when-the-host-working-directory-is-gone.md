# 00067 — `startUmbraDB` throws synchronously when the host's working directory no longer exists

- **Status:** OPEN
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
