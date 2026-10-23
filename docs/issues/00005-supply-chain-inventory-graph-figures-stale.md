# 00005 — The supply-chain inventory's npm graph figures and dev table are stale

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-22, during task 0.1 of `openspec/changes/core-arch` (dependency pins). Numbered 00005 because
  an unrelated 00004 is already drafted in another working copy.

## Problem

`docs/supply-chain/` describes the npm graph as it was when the infosec sign-off landed. Its whole-graph figures, its
direct development-dependency table and its "planned / pending merge" notes no longer match the repository. Task 0.1
updated only the statements about which packages are runtime dependencies and the rows of the packages it added or
moved (`@electric-sql/pglite`, `ws`, `typescript`, `esbuild`, `@types/ws`); the rest predates it.

## Evidence

- `docs/supply-chain/inventory.md:10-11`, `:55`, `docs/supply-chain/README.md:50`, `:103` and
  `docs/supply-chain/slsa.md:71` say the lockfile has 307 packages; `package-lock.json` had 459 `node_modules/`
  entries at `a75ed95` (462 after task 0.1).
- The license spread under "Full npm graph (307 pkgs)" in `docs/supply-chain/inventory.md` counts that same old graph.
- `docs/supply-chain/inventory.md:46` gives `vitest` locked at 4.1.10; the lockfile has 4.1.11 (also at `a75ed95`).
- The direct development-dependency table (`docs/supply-chain/inventory.md` §2) lacks `@stryker-mutator/core`,
  `@stryker-mutator/vitest-runner`, `@vitest/coverage-v8` and `tinybench`, all in `package.json` `devDependencies`.
- `docs/supply-chain/README.md:36` and `:95`, `docs/supply-chain/inventory.md:60` and `docs/supply-chain/slsa.md:101`
  call `supply-chain.yml` and `.npmrc` "planned" or "pending merge to `main`"; both are on `main`.

## Suggested fix

Regenerate the npm figures from `package-lock.json` (package count, integrity count, install scripts, license
spread), add the missing direct development dependencies to §2 with their locked versions, and replace the
"planned / pending merge" notes with the current state. A small script that prints these figures from the lockfile
would keep them from drifting again.
