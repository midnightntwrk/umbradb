# Tasks — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0

No implementation code before the stage-1 gate: the cold adversarial review of this change and of
`fast-logs-unresolved` (Codex, given only the repository, the change and its instructions) and the owner's approval.
`fast-logs-unresolved` is built and merged first. Then one task per change set, test first: write the tests for the
task's criteria, watch them fail for the intended reason, implement until they pass; a `[NEG]` criterion's negative
control is committed and seen failing for its own reason with the fault put back. Database tests run on PostgreSQL 18
in Docker and on PGlite, never on mocks. After each task: `npm run typecheck` and the tests it touched green
(`npx vitest run --maxWorkers=8 <files>`), and the task checked here with the criteria it demonstrated.

**A task's criteria are `acceptance.md`'s, verbatim** (AGENTS.md stage 2). A criterion split across tasks is checked
when its last part passes. A criterion that proves ambiguous or untestable is escalated, never read weaker.

## 0. Baseline

- [ ] 0.1 Record the base commit and the state of the tree before any change, `fast-logs-unresolved` merged.
      **Acceptance:** `npm run typecheck` exit 0 and a full `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set,
      its result recorded here; each unrelated failure filed in `docs/issues/`.

## 1. Fixtures (`design.md` D7, D8)

- [ ] 1.1 Copy the proof of concept's `vendor/mip0018/`, `vectors-umbradb/` and case expectations at `760d3e9` into
      `test/fixtures/mip0018/` with `SOURCE.md` and a hash test; record the proof of concept's answers to a fixed
      request list (every route of TM-12, every identity, color and contract of the cases) by running it at `760d3e9`
      on its own stagenet fixtures, and store them with the command and request list.
      **Acceptance:** the hash test passes and fails on a changed byte; the recording reruns to the same bytes.
- [ ] 1.2 Record the stagenet tapes over 714,485–715,183 and 715,402–715,433 with `tools/tape`; add them to the tapes
      release and `test/tape/real/manifest.json`.
      **Acceptance:** the manifest entries check; the existing real-tape tests pass.

## 2. Reading and classifying (D6, D7)

- [ ] 2.1 The log reader.
      **Acceptance:** M4, M5, M6.
- [ ] 2.2 The vendored codec and the ported `classify.ts` in `src/features/token-metadata/`.
      **Acceptance:** M7, M19.

## 3. The module and its state (D1 … D4)

- [ ] 3.1 Declaration, migration `001`, the start refusal, the module harness.
      **Acceptance:** M1.
- [ ] 3.2 Storing events and applying records with the ported `state.ts`.
      **Acceptance:** M8, M9, M11, M12, M2, M3.
- [ ] 3.3 Marks.
      **Acceptance:** M13.

## 4. The API (D5)

- [ ] 4.1 The ported handlers on the module API, with TM-13's differences.
      **Acceptance:** M10, M15, M17, M18.
- [ ] 4.2 Bounded cost.
      **Acceptance:** M16.
- [ ] 4.3 Export from `src/index.ts` and the entry helper.
      **Acceptance:** `npm run typecheck` exit 0; the library-surface tests updated for the export pass; a configuration
      using `TOKEN_METADATA.entry(...)` passes `npx umbradb config check`.

## 5. Real chain and browser

- [ ] 5.1 The stagenet tapes against the cases and the recorded API answers.
      **Acceptance:** M20, M14.
- [ ] 5.2 The module in the browser build.
      **Acceptance:** M21.

## 6. Verification

- [ ] 6.1 The full suite and the gates.
      **Acceptance:** `npm run typecheck` exit 0; full `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set, no
      failure beyond §0's; `npm run test:conformance` with coverage floors for every new file; `npm run test:mutation`
      ≥ 65 % on `src/features/token-metadata/` (vendored files excluded); every new property and differential test run
      five times.
- [ ] 6.2 CI green on the pull request's head.
      **Acceptance:** every required job green, linked in the pull request.

## 7. Review

- [ ] 7.1 The three review lanes, one bounded round, then one targeted fix check; every finding fixed, specified, or
      decided by the owner.
      **Acceptance:** each lane's report and the decisions recorded in the pull request.

## 8. Close-out

- [ ] 8.1 Documentation and notices.
      **Acceptance:** M22.
- [ ] 8.2 Update `ROADMAP.md`: F4's status for this change.
      **Acceptance:** M22's ROADMAP part.
- [ ] 8.3 Set `proposal.md`'s status line to Implemented and check every task here.
      **Acceptance:** no unchecked task above.
- [ ] 8.4 Run `npm run graph:refresh` and commit `graphify-out/` in the close-out commit (`git add` the change's new
      files first).
      **Acceptance:** `npm run graph:check` exits 0 on the close-out commit.

## Workflow follow-up

- Draft the next changes of the port (proposal P-1): the explorer page in the browser build; mints, seen colors and
  activity; images (server only).
- Archive the change after merge (`/opsx:archive`), once `core-arch` is archived.

## Spike notes (branch `spike/token-metadata`; not for merge before the stage-1 gate)

Built test first only in part: the spike's code came with its tests, and each `[NEG]` control was seen failing.

| Task | Criteria passing on PostgreSQL 18 and PGlite | Left |
|---|---|---|
| 1.1 | the provenance tests (copies byte for byte, ports by their replacements) | record the proof of concept's API answers |
| 1.2 | the two stagenet tapes recorded (`~/umbradb-tapes`), 49 real `Misc` logs as a fixture | the tapes release and `manifest.json` |
| 2.1 | M4 (the reader and the module), M5, M6 with its control | — |
| 2.2 | M7 (66/66 normative, 43/43 informative, A3c) | M19 |
| 3.1 | M1: S = 1,000,000 with the module (test provider) and with `core-contract-logs-fast`; the refusal at S = 0, cursor 5, from 6 | M1's v8 clause (needs a v8 chain with calls) |
| 3.2 | M8's first half (S7a, S7b); M9 (all 36 state vectors, also against `state.ts`); M11 (25 chains per backend; a reverse-order fault fails it); M12's colors (v8, v9-rc3, v9); M2 (10 chains, per-block digests and contents hashes); M3 | M8's unresolved half (needs `fast-logs-unresolved`); M12's S6 through the routes (4.1) |

**Findings for the spec (to settle before the gate):**

1. **TM-1's refusal code.** A module cannot give a process refusal its own code: the process refuses with
   `callback-error` at `on-start-db` of `token-metadata`, and the error it carries (`cause`) has the code
   `token-metadata-start-after-database`. Either TM-1 says so, or the core lets a module name a refusal code.
2. **Only the first revision counts.** A later revision (a new version) starts above S by nature; the refusal reads
   the first revision's start only.
3. **D4's split.** The spike computes and writes in `on-db-write` alone, reading its own rows in the block
   transaction; nothing needs `on-compute`. D4 should say so, or say why the split is needed.
4. **D3's columns.** `fields` also keeps the proof of concept's `uint_value`, `usable` and `defined` (the served-row
   and symbol indexes need them); `events` keys on `(height, tx_index, event_index)`, `event_index` counting the
   transaction's logs (the proof of concept's `eventIndex`), and keeps no raw name or payload (no recompute).
5. **Grouping by the cut symbol.** Values are stored whole, but the proof of concept groups by the cut symbol (its
   stored value): two symbols longer than 12 characters that share their first 12 group there. The API must group by
   the cut value, not by `fields_symbol_idx`'s whole value (task 4.1).
6. **Field order.** `state.ts` keeps an identity's fields in the order they were last set; the module reads them in
   key order. The vectors do not compare order; the recorded answers (M14) will show whether the API's does.
7. **M9's wording.** `vectors-umbradb/` holds no state vector (only A3c, a payload vector); "UmbraDB's per-key
   tombstone versions" names nothing. The vendored state vectors already follow per-key tombstones.
