# Tasks — V9-UPGRADE-METADATA

No implementation code before the stage-1 gate (the cold adversarial review of this change and the owner's approval).
Then one task per change set, test first: write the tests for the task's criteria, watch them fail for the intended
reason, implement until they pass; a `[NEG]` criterion's negative control is committed and seen failing for its own
reason with the fault put back. A task's criteria are `acceptance.md`'s, verbatim. After each task: `npm run typecheck`
and the tests it touched green, and the task checked here.

## 0. Baseline

- [ ] 0.1 Record the base commit and the state of the tree: `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set.
      **Acceptance:** the base's failures (if any) listed here, by test name.

## 1. Fixtures (before the gate: they are the evidence)

- [x] 1.1 Add `docs/issues/00089` (as on the `token-metadata` branch) and `preview-v9-0-2000`'s entry to
      `test/tape/real/manifest.json` (the same entry as that branch's).
      **Acceptance:** `npx vitest run --maxWorkers=8 test/tape/real` passes with the tape present.
- [x] 1.2 Record tapes over the delayed upgrade on mainnet and preprod with `tools/tape/main.ts range` (from a few blocks
      before the first block of runtime 2,001,100 to a few after), and add them to the manifest.
      **Acceptance:** the manifest entries check; `test/tape/real` passes.

## 2. The selection (D1, D2)

- [ ] 2.1 `RuntimeMetadata.forBlock`: own state first, then the parent's, else `metadata-mismatch` naming both
      versions; the call order of D2.
      **Acceptance:** V4, V5.
- [ ] 2.2 The replays across both forms.
      **Acceptance:** V1, V2, V3.

## 3. Documents

- [ ] 3.1 `core-arch` design §5 ("Metadata"), `src/ledger/metadata.ts`'s comment, `node-source.ts`'s; issue 00089
      closed.
      **Acceptance:** V6.

## 4. Verification

- [ ] 4.1 `npm run typecheck` exit 0; the full `npx vitest run --maxWorkers=8` with `UMBRADB_TAPES` set, no failure
      beyond §0's; `npm run graph:refresh` with `graphify-out/` committed.
      **Acceptance:** the commands' output recorded in the pull request.
- [ ] 4.2 CI green on the pull request's head.
      **Acceptance:** every required job green, linked from the pull request.

## 5. Review and close-out

- [ ] 5.1 The three review lanes, one bounded round, the targeted fix check (AGENTS.md).
      **Acceptance:** each lane's verdict recorded in the pull request.
- [ ] 5.2 Set `proposal.md`'s status line to Implemented and check every task here; `ROADMAP.md` if it names the
      upgrade; run `npm run graph:refresh` and commit `graphify-out/` in the close-out commit.
      **Acceptance:** `npm run graph:check` exits 0.
