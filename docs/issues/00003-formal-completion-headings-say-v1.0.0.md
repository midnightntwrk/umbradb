# 00003 — The `v1.1.0-formal-completion` headings say "v1.0.0"

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-21, during the Codex review of the guideline amendment

## Problem

The change id is `v1.1.0-formal-completion`, but its `tasks.md` and `acceptance.md` headings read
"v1.0.0: Formal completion". Its proposal calls it optional hardening "for the 1.0.0 program", while the
v0.9.5 Release Record records the Option-A ruling that defers formal completion past 1.0.0.

## Evidence

- `openspec/changes/v1.1.0-formal-completion/tasks.md:1` and `acceptance.md:1`.
- `openspec/changes/v1.1.0-formal-completion/proposal.md:3`.
- `docs/releases/v0.9.5.md`, Ruling on the Lean cut-line (Option A).

## Suggested fix

Relabel both headings "v1.1.0", and align the proposal's status note with the Option-A deferral.
