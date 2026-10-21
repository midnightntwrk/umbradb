# 00001 — `graph.yml` cites a CLAUDE.md section that no longer exists

- **Status:** CLOSED — fixed 2026-10-21 in the graphify-rules update, which rewrote the workflow's
  header comment; never filed on GitHub
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-21, while moving the review workflow into `AGENTS.md`

## Problem

The header comment of `.github/workflows/graph.yml` says the committed graph is what "the review
pipeline scopes against, see CLAUDE.md 'Graph-scoped review policy'". That section was replaced by a
short "Review workflow" section, and graph-scoped review manifests are parked, so no review lane scopes
against the graph any more.

## Evidence

- `.github/workflows/graph.yml:3-4` (uncommitted, from the graph-refresh tooling work).
- `CLAUDE.md`, section "Review workflow": manifests parked.

## Suggested fix

Reword the comment to describe the graph as the committed knowledge graph kept current under
`CLAUDE.md`'s first section, without the review-pipeline claim. The graph-refresh tooling work owns
this file, so make the change there.
