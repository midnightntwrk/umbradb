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
`skip_opengrep_scan`, which drops the SAST scan entirely.

## Evidence

- Rule definition: `semgrep-rules/javascript/lang/security/detect-insecure-websocket.yaml`
  (`pattern-regex: \bws:\/\/`, `languages: regex`, confidence LOW).
- Action inputs: `midnightntwrk/upload-sarif-github-action` `action.yml` (no exclude input).

Two constraints on the repo-side levers, found by reproducing the scan locally (semgrep 1.184,
the fork base, with the registry rules at their registry ids):

- A repository `.semgrepignore` REPLACES the scanner's built-in default ignore list
  (`node_modules/`, `build/`, `dist/`, `vendor/`, `test/`, `tests/`, `*.min.js`, ...), so the
  defaults must be restated or never-scanned paths such as `test/` suddenly alert; one run on
  the core-arch branch produced 116 alerts this way. Its parser also reads the file as ASCII
  and exits 2 on any other byte, failing the whole scan stage.
- A `nosemgrep: <rule-id>` marker removes the finding from the scanner's own report, but the
  SARIF still lists it with `suppressions: [{kind: inSource}]`, and GitHub code scanning opens
  an alert for suppressed results all the same (observed: alert 118). A marker never keeps an
  alert from opening.

## Current workaround

- Prose and error messages name the schemes as `ws or wss://` (or `<node-url>` in usage lines),
  which says the same thing and does not match the rule.
- `*.md` and `graphify-out/` are in `.semgrepignore`.
- The genuine plain-WebSocket connections, `tools/devnet/devnet.sh` (`RPC`, the node inside the
  devnet's container network) and `examples/stats-module/try.sh` (the example's subscription),
  keep a `nosemgrep` marker and a one-time GitHub dismissal, which persists while the line is
  unchanged.

The cost: any new `ws://` written in a code comment or string, or any new genuine plain-WebSocket
use, opens a new `error` alert and fails the check until it is reworded or dismissed.

## Suggested fix

Add an `opengrep_exclude_rules` input (comma-separated rule ids) to
`midnightntwrk/upload-sarif-github-action`, passed to opengrep as repeated `--exclude-rule`
flags, and set it here to `javascript.lang.security.detect-insecure-websocket`. Then drop the
two `nosemgrep` markers for that rule; the `ws or wss://` wording can stay.
