# 00031 — A module's error message can carry a test key's bytes into the log in a form the redaction misses

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

PP-10: "THE system SHALL never log or report key bytes". The runner logs a halt with the failure's message
(`processing halted (<code>): <message>`), and a callback's failure carries the module's own error message. The log
goes through the configuration's redaction, which hides every string of a secret field — `testKeys` among them — as
written and in URI, form and JSON encodings. A test key's `bytes` are written `0x` and lowercase hex; a module that
puts a key's bytes into an error message in any other form — hex without `0x`, upper-case hex, base64 — gets them into
the log unredacted. `/status` is not affected (it shows a sanitized reason, never a message, AE-6).

PP-10 also says keeping module output private is each module developer's responsibility (Q16), and the module guide
now says so; this issue asks whether the redaction should catch these forms as a second line.

Found by task 14.4's negative control for A120 (`test/private/privacy.negative-control.test.ts`: a module whose
`on-key` throws with the key's bytes as bare hex; the scan finds them in the private process's log).

## Evidence

- `src/runner/process.ts:1017`: ``this.#log(`processing halted (${halt}): ${messageOf(error)}`)``.
- `src/config/redact.ts:82` (`SECRET_PARTS`) and the encodings after it: a byte value's other spellings are not among
  the forms.

## Suggested fix

In `src/config/redact.ts`, for a secret string that is a byte value (`0x` and lowercase hex pairs) of at least 8 bytes,
add its bare hex, upper-case hex, base64 and base64url to the forms redacted (a shorter one would redact ordinary
numbers in log lines). Extend `test/config/redact.test.ts`, and turn task 14.4's log negative control into a check that
the halt line is redacted.
