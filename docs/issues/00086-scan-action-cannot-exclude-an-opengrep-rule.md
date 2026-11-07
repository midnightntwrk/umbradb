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

## Suggested fix

Add an `opengrep_exclude_rules` input (comma-separated rule ids) to
`midnightntwrk/upload-sarif-github-action`, passed to opengrep as repeated `--exclude-rule`
flags, and set it here to `javascript.lang.security.detect-insecure-websocket`. Then remove this
repository's workaround: the `nosemgrep` line markers for that rule, and the prose-file entries
in `.semgrepignore` added for it. Until then, new mentions of `ws://` in prose (outside `*.md`)
surface as new alerts and need a one-off dismissal as false positive.
