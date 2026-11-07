# 00069 — `umbradb config check`'s text report redacts a finding's code when a secret's text equals it

- **Status:** OPEN
- **Area:** cli (`umbradb config check`)
- **Severity:** low — a secret whose text is one of UmbraDB's own words (a rule such as `settings-schema`, a reason
  such as `load-failed`); the report then shows `[invalid-configuration [redacted]]` for that finding's code, so a
  reader (or a script reading the text) cannot tell which rule refused. No secret is shown; the JSON report keeps the
  code.
- **Effort:** small — redact the report's parts that may hold a value (a finding's message, a path at the file, the
  notes) and write the codes as they are, as the process's refusal lines do since `start-umbradb` P10.4c
  (`src/runner/configuration-refusal.ts`, `redactedFindingText`).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, while fixing the stage-4 fix check's N3 (`start-umbradb` P10.4c: redaction replaced a library
  refusal's machine-readable `reason`), on a Mac with Node.js 24.9.0. The command's report is outside N3's scope (the
  library's refusal, `started`, the log and `/status`), so filed and skipped.

## Problem

`umbradb config check` builds its text report and passes the whole of it through the redaction
(`src/cli/config-check.ts:426`: `text: redact.text(reportText(file, reports))`). The redaction replaces every form of
every secret wherever it appears, so a finding's code is replaced too when a secret's text equals it. The JSON form keeps
the code (`src/cli/config-check.ts:416`: `code: found.code`, only `path` and `message` redacted).

## Evidence

A configuration whose `core` entry has `database.password: "settings-schema"` and `livenessTimeoutMs: "30s"` (a
schema finding), checked with `umbradb config check umbradb.config.ts` (the source through `tsx`, Node.js 24.9.0, on the
tree at `2ae0985`):

```text
configuration (evaluation, validation): 1 finding
  entries[0].config.livenessTimeoutMs (core from 1): Invalid input: expected number, received string [invalid-configuration [redacted]]
```

## Suggested fix

Build each finding's line from its parts: the code as it is, the message (and a path that is the file) through
`redact.text`, the path inside the configuration as it is; redact the notes and the summary's free text. A test with a
secret equal to a rule and one equal to a loader reason: the text report's codes equal the JSON report's.
