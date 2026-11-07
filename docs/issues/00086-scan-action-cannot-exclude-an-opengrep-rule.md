# The scan action cannot exclude a single opengrep rule

Status: OPEN
GitHub: NOT IN GITHUB ISSUE

## Problem

The registry rule `javascript.lang.security.detect-insecure-websocket` is a bare regex —
`\bws://` with only `ws://localhost` and `ws://127.0.0.1` exempted, `languages: regex` — so it
fires on any mention of `ws://` in any file: doc comments, error-message strings, markdown prose.
In this repository `ws://` is an accepted node-URL scheme by design (`src/config/core-settings.ts`,
`NODE`), so every such finding is a false positive, and one scan of the core-arch branch produced
27 of them as `error`-severity alerts, failing the Opengrep OSS code-scanning check.

`midnightntwrk/upload-sarif-github-action` offers no way to exclude one rule: its Earthfile runs
`opengrep scan --config auto` with fixed flags, and the only opengrep-related input is
`skip_opengrep_scan`, which drops the SAST scan entirely. Repo-side the only levers are
`.semgrepignore` (whole paths, costing all rules' coverage on them) and per-line
`nosemgrep: <rule-id>` markers, which cannot be placed in rendered prose without polluting it.

## Evidence

- Rule definition: `semgrep-rules/javascript/lang/security/detect-insecure-websocket.yaml`
  (`pattern-regex: \bws:\/\/`, `languages: regex`, confidence LOW).
- Action inputs: `midnightntwrk/upload-sarif-github-action` `action.yml` (no exclude input).
- The flagged prose, e.g. `src/node/client.ts:101`, `src/private/private-socket.ts:3` (doc
  comments), `README.md:28`, `docs/THREAT_MODEL.md:288` (markdown), before the suppressions
  this issue was recorded alongside.

Two further constraints, found by reproducing the scan locally (semgrep 1.184, the fork base,
with the registry rules at their registry ids):

- A repository `.semgrepignore` REPLACES the scanner's built-in default ignore list
  (`node_modules/`, `build/`, `dist/`, `vendor/`, `test/`, `tests/`, `*.min.js`, ...), so the
  defaults must be restated or never-scanned paths such as `test/` suddenly alert; one run on
  the core-arch branch produced 116 alerts this way.
- A `nosemgrep: <rule-id>` marker removes the finding from the scanner's own report, but the
  SARIF still lists it with `suppressions: [{kind: inSource}]`, and GitHub code scanning opens
  an alert for suppressed results all the same (observed: alert 118). So every false positive
  outside an ignored path needs a one-time GitHub dismissal, marker or not, and the marker's
  only lasting value is documenting the line and keeping the scanner's console report clean.

## Suggested fix

Add an `opengrep_exclude_rules` input (comma-separated rule ids) to
`midnightntwrk/upload-sarif-github-action`, passed to opengrep as repeated `--exclude-rule`
flags, and set it here to `javascript.lang.security.detect-insecure-websocket`. Then remove this
repository's workaround: the `nosemgrep` line markers for that rule, and the prose-file entries
in `.semgrepignore` added for it. Until then, new mentions of `ws://` in prose (outside `*.md`)
surface as new alerts and need a one-off dismissal as false positive.
