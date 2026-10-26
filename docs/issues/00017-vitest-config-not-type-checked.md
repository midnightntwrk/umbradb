# 00017 — `vitest.config.ts` is in no TypeScript program and does not type-check (`coverage.all`, gone in Vitest 4)

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 17.1 of `openspec/changes/core-arch` (TransactionHistory to `legacy/`), when A3's
  static test first imported the run's configuration with a plain `import`.

## Problem

`npm run typecheck` checks `tsconfig.json`'s program, whose `include` lists `src/`, `test/`, `chain-archive-sync/`,
`bench/` and `tools/` (`tsconfig.json:13`–`19`). The root configuration files (`vitest.config.ts`,
`vitest.mutation.config.ts`) are in no program, so nothing type-checks them, and `vitest.config.ts` does not
type-check as it is. Imported into the program by a test, `tsc --noEmit` reported:

```text
vitest.config.ts(110,7): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'all' does not exist in type 'CoverageOptions'.
```

That is `coverage.all: true` (`vitest.config.ts:113` after task 17.1's edits; Vitest 4.1.11 installed). Vitest 4 no
longer reads the option: nothing in its coverage code uses `options.all`, and it measures the files no test loaded
whenever `coverage.include` is set (`getUntestedFiles`, `node_modules/vitest/dist/chunks/coverage.DM_a_rWm.js:696`–
`699`, called by the v8 provider at `node_modules/@vitest/coverage-v8/dist/provider.js:101`). So the option is dead
and harmless today, but the file can carry any other option a Vitest upgrade drops without anything failing.

Found with it, also in that code: Vitest matches the coverage globs anywhere in a loaded file's path (picomatch's
`contains: true`, `coverage.DM_a_rWm.js:674`–`678`, asked by the provider for every loaded script at
`provider.js:247`), so `include: ["src/**/*.ts"]` also takes in a loaded file under any other folder's `src/`. Task
17.1 handled the case it creates (`legacy/**` in `coverage.exclude`); whether a test loads any other such file was not
checked.

A3's test imports both configuration files by a computed specifier (`test/library-surface/legacy-excluded.test.ts`,
`vitestConfig`), so they stay outside the program, as before.

## Suggested fix

1. Remove `all: true` from `vitest.config.ts` (behaviour unchanged, per the code above; confirm with one coverage run
   that the never-loaded files are still listed).
2. Put the root configuration files in a checked program, for example `"vitest.config.ts"` and
   `"vitest.mutation.config.ts"` in `tsconfig.json`'s `include`, so that an option an upgrade removes fails
   `npm run typecheck`.
