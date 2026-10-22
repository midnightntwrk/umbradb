# Tasks — CORE-ARCH project 1: runner and database

No implementation code before the stage-1 gate (the cold adversarial review of this spec and the owner's approval).
Then one task at a time, test first: write the tests for the task's criteria, watch them fail for the intended
reason, implement until they pass. One task is one atomic change set; no placeholders, stubs or `TODO`s. After each
task: `npm run typecheck` and `npm test` green, and the task checked here with the criteria it demonstrated.

## 0. Pins and verification

- [ ] 0.1 Pin exact versions of `@electric-sql/pglite` and `ws`, each at least 7 days old, through the supply-chain
      gate; move `typescript` to `dependencies`; keep `zod` 4 (installed 4.4.3). Write probe tests that verify, on the
      pinned PGlite, `CREATE ROLE`, `SET LOCAL ROLE`, a `SECURITY DEFINER` function, a PL/pgSQL row trigger and that one
      instance serves one connection; and, on the installed zod, per-field `kind` metadata read back from an object
      schema, defaults, and validation errors that name the field path. Update `design.md` §9 with `file:line` evidence in the installed
      packages.
      **Acceptance:** the probe tests pass; `design.md` §9 has no "Unconfirmed" row; `npm run test:conformance` is green
      on the unchanged code.

## 1. Determinism primitives

- [ ] 1.1 `src/determinism/cbor.ts`: the canonical encoder of DT-1, `encodeCanonical`, `encodeRow`.
      **Acceptance:** A52, A53 pass.
- [ ] 1.2 Primary-key order and `contentsHash` (DT-2, DT-3), over a database handle.
      **Acceptance:** A54 and A55 pass on both backends (after task 2.2 provides PGlite; until then on PostgreSQL, and
      re-run in 2.2).

## 2. Database API

- [ ] 2.1 `src/db/api.ts` and the PostgreSQL backend (refactored from `src/postgres/client.ts`): writer connection, read
      pool, read handles at one height, result mapping, errors with retryability (`connection-lost`).
      **Acceptance:** A9, A12, A19 pass; A8 passes on PostgreSQL.
- [ ] 2.2 The PGlite backend with its single queue, behind the same API.
      **Acceptance:** A7, A8 (PGlite), A11 including its negative control.
- [ ] 2.3 Roles, `SET LOCAL ROLE`, provider functions, schema naming, shared-item schemas.
      **Acceptance:** A13 including its negative control, A14, A15.
- [ ] 2.4 Migrations with checksums (refactored from `src/postgres/migrate.ts`) and `core_chain.migrations`.
      **Acceptance:** A16; the refactored `migrate` and `migration-lock-timeout` tests pass or are retired per
      `design.md` §8.
- [ ] 2.5 Writer lock (refactored from `src/postgres/transaction-lease.ts`) and the PGlite lock file; the durability
      probe moved to `src/db/`.
      **Acceptance:** A17, A18; `durability-probe.test.ts` passes at its new path.
- [ ] 2.6 Write handles and their closing.
      **Acceptance:** A10.

## 3. Modules

- [ ] 3.1 Declaration types, `defineModule`, declaration validation.
      **Acceptance:** A20, A21.
- [ ] 3.2 Graph resolution per height range, Kahn order, mid-chain rule, development-only rule, shared-item providers.
      **Acceptance:** A22, A23, A24, A25.

## 4. Configuration

- [ ] 4.1 `defineConfig`, `coreEntry`, `pastEntry`, the module `entry` builder; the loader; the plain-data check.
      **Acceptance:** A26, A27.
- [ ] 4.2 Schema validation with kinds, defaults and the `core` fields of CF-4; secret redaction helper.
      **Acceptance:** A28; A29 (completed in 8.1).
- [ ] 4.3 `core-chain`'s configuration history: revisions, future-only comparison, `data_hash`, the version check, the
      development opt-in.
      **Acceptance:** A30, A31, A32, A33, A34.
- [ ] 4.4 `umbradb config check` and the `umbradb` command.
      **Acceptance:** A35, A6.

## 5. Runner

- [ ] 5.1 Point dispatch and order within points; parallel waves.
      **Acceptance:** A38.
- [ ] 5.2 The finalized loop over the block-source interface; `InMemoryBlockSource` with its minimal
      `core-block-commit`; block context and item sink; per-point handles.
      **Acceptance:** A36, A37, A39, A40, A41, A49.
- [ ] 5.3 Revisions and settings; start and stop heights; the upgrade-boundary stop; SIGTERM.
      **Acceptance:** A42, A45, A47, A48.
- [ ] 5.4 Failure handling and the delivery guarantees after restart.
      **Acceptance:** A43, A44, A46.

## 6. Storage helpers

- [ ] 6.1 Cursor table (refactored from `src/postgres/watermarks.ts`); P9 retargeted.
      **Acceptance:** A59.
- [ ] 6.2 Height-versioned table (refactored from `src/postgres/temporal-kv.ts`).
      **Acceptance:** A60, A61.

## 7. Digests

- [ ] 7.1 Change capture (shadow tables and triggers) and `core-digest`; the non-deterministic-column check.
      **Acceptance:** A56 including its negative control, A57, A58.

## 8. Admin endpoints

- [ ] 8.1 The admin server, heartbeat, states and conditions, readiness, `/status` and `/config` with their JSON
      schemas, redaction and sanitized errors.
      **Acceptance:** A62, A63, A64, A65, A66, A67, A29.

## 9. Test tape

- [ ] 9.1 Tape reader and writer; the tape node.
      **Acceptance:** A68, A69, A70.
- [ ] 9.2 The recording builder and the variant transforms.
      **Acceptance:** A71 (`[CI]` part); the `[MANUAL]` record-and-replay against a real node is recorded for the PR.

## 10. Library surface and gates

- [ ] 10.1 Move TransactionHistory and its tests to `legacy/transaction-history/`, excluded from build, package and
      run.
      **Acceptance:** A3.
- [ ] 10.2 Remove the retired parts, tests, Lean modules, benchmarks, manifest ids, coverage floors and mutation targets
      exactly as listed in `design.md` §8; mark the retired laws in `Formal/STORAGE_ALGEBRA.md` and the roadmaps; set
      `openspec/changes/v1.1.0-quint-model-checking`'s status to Archived with the reason.
      **Acceptance:** A5; `lake build --wfail` and the trust audit pass; `npm run test:mutation:ci` passes at break 65 on
      the new targets.
- [ ] 10.3 `src/index.ts` with exactly the §7 surface; the surface pin; the pack smoke rewritten (§7 imports, the
      retired-name failure, a three-block process on PostgreSQL in Docker, `umbradb config check`); the bench smoke
      retargeted with a fresh baseline; `typedoc.json` entry points.
      **Acceptance:** A1, A2; `npm run test:smoke` passes.
- [ ] 10.4 Version `0.10.0` and the breaking-change notice in `CHANGELOG.md`.
      **Acceptance:** A4.

## 11. Whole-system faults and differentials

- [ ] 11.1 The crash worker retargeted to the runner (harness ids 1–4 kept); the crash sweep and its negative control.
      **Acceptance:** A50; required ids 1–4 pass.
- [ ] 11.2 The restart-20 and cross-backend differential.
      **Acceptance:** A51.
- [ ] 11.3 Add the 13 ids of `acceptance.md` §10 to the manifest and set the pinned count to 17.
      **Acceptance:** `npm run test:conformance` passes with every required id reported passed in its file.

## 12. Close-out

- [ ] 12.1 Check off every task above with the criteria it demonstrated; map every acceptance criterion to its test in
      the pull request.
- [ ] 12.2 Set the proposal's status line to Implemented.
- [ ] 12.3 Update `ROADMAP.md`: this change, the new architecture, and the "36 symbols" statements at `ROADMAP.md:455`
      and `docs/v1-implementation-guideline.md:194`.
- [ ] 12.4 Run `npm run graph:refresh` and commit `graphify-out/` with the close-out commit; `npm run graph:check`
      exits 0.
- [ ] 12.5 Record in the pull request, per `docs/PULL_REQUEST_CHECKLIST.md`: the reviewed commit, each lane's verdict
      and model id, the fix check, the owner's decisions (including the approval of `design.md` §8), and the CI runs.
