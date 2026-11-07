# 00002 — Most OpenSpec proposals carry a stale or non-standard status line

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-21, while adding the status-line rule to `openspec/config.yaml`

## Problem

`openspec/config.yaml` now requires every proposal to open with `> **Status:** <state>`, using one of
Proposed, Approved, In progress, Blocked, Implemented, or Archived. The existing proposals predate the
rule: several merged changes still read "Draft" or "Proposed", and others use free-form values.

## Evidence

- `openspec/changes/v1.0.0-api-surface/proposal.md` and `v1.0.0-infosec-signoff/proposal.md`: "Draft",
  though merged (`726f567`, `7ee8a4b`).
- `openspec/changes/v1.0.0-durable-checkpoint-cursor/proposal.md`, `v1.0.0-perf-baseline/proposal.md`,
  `v1.0.0-recovery-testing/proposal.md`: "Proposed", though merged (`2cb5d00`, `855fb22`, `4e04926`).
- `openspec/changes/sprint-7-transaction-history-storage/proposal.md`: "Draft", though `ROADMAP.md`
  lists Sprint 7 as completed and merged.
- `sprint-5-formal-watermarks` and `sprint-6-formal-checkpoint-c1` ("Complete"), and the sprint 2–4 and
  8 proposals ("Implemented and …"), use non-standard values.

## Suggested fix

Set each proposal's status line to the standard value — Implemented for the merged changes, Proposed
for the two `v1.1.0-*` changes — keeping any existing note after the state.
