# 00031 — A module's error message can carry a secret setting's bytes into the log in a form the redaction misses

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

AE-6 and CF-4: a `secret` field "SHALL never be shown, logged or reported". The runner logs a halt with the failure's
message (`processing halted (<code>): <message>`), and a callback's failure carries the module's own error message. The
log goes through the configuration's redaction, which hides every string of a secret field as written and in URI, form
and JSON encodings. A secret setting that is a byte value is written `0x` and lowercase hex; a module that puts those
bytes into an error message in any other form — hex without `0x`, upper-case hex, base64 — gets them into the log
unredacted. `/status` is not affected (it shows a sanitized reason, never a message, AE-6).

Task 14.4 found this with the core's test keys (A120's negative control: a module whose `on-key` threw with a key's
bytes as bare hex). Task 14.4a removed key handling from the core (owner decision Q154 A2: keys, and private items in
general, are a module's), so no setting of the core holds key bytes any more; what is left is the same gap for a
module's own `secret` settings, which is where a private module now takes its keys or other private values (the module
guide's "Your private inputs are your module's"). Keeping module output private is each module developer's
responsibility (Q16), and the module guide says so; this issue asks whether the redaction should catch these forms as a
second line.

## Evidence

- `src/runner/process.ts:1071`: ``this.#log(`processing halted (${halt}): ${messageOf(error)}`)``.
- `src/config/redact.ts:82` (`SECRET_PARTS`) and the encodings after it: a byte value's other spellings are not among
  the forms.

## Suggested fix

In `src/config/redact.ts`, for a secret string that is a byte value (`0x` and lowercase hex pairs) of at least 8 bytes,
add its bare hex, upper-case hex, base64 and base64url to the forms redacted (a shorter one would redact ordinary
numbers in log lines). Extend `test/config/redact.test.ts` with a module's `secret` byte setting and a halt line that
holds it in each form.
