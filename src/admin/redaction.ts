/**
 * The redaction the admin endpoints share (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-6;
 * `specs/configuration/spec.md` CF-4; CORE-ARCH §4.18): every `secret` field, and every credential inside a URL, shows
 * as `[redacted]`. Built on task 4.2's redaction (`../config/redact.ts`, `configRedactor`), applied on the main thread
 * before a snapshot crosses to the admin worker, so the worker never holds a secret.
 *
 * - {@link shownSettings}: a revision's settings as `/config` may show them (4.2's note (d)) — a revision of the
 *   build's version by its schema's kinds; a `versionEntry`'s (whose kinds only its recorded row knows) every field
 *   redacted until the history has found it equal to its recorded row, then as data.
 * - {@link earlyRedactor}: before the configuration is validated (a startup refused by the validation, or before it),
 *   the redaction of its secrets as the validation reads them (`configSecrets`, task 4.4), or, with no configuration
 *   loaded, of URL credentials only.
 */

import type { PlainObject } from "../config/plain-data.js";
import { type Redactor, redactor } from "../config/redact.js";
import { type ConfigInput, configSecrets, type FieldKinds } from "../config/validate.js";

/** A revision's settings and kinds, as the validation gives them (`CheckedEntry`). */
export interface RevisionSettings {
  readonly settings: PlainObject | null;
  readonly kinds: FieldKinds | null;
}

/**
 * `revision`'s settings as they may be shown (see the module comment); `recorded` says, for a `versionEntry`, that the
 * history found it equal to its recorded row (task 4.3).
 */
export function shownSettings(redaction: Redactor, revision: RevisionSettings, recorded = false): PlainObject {
  if (revision.settings === null) return Object.freeze({});
  if (revision.kinds !== null) return redaction.settings(revision.settings, revision.kinds);
  const kinds = recorded ? Object.fromEntries(Object.keys(revision.settings).map((field) => [field, "data" as const])) : {};
  return redaction.settings(revision.settings, kinds);
}

/** The redaction of a configuration not yet validated: its secrets as the validation reads them (see the module comment). */
export function earlyRedactor(input: ConfigInput | undefined): Redactor {
  return redactor(input === undefined ? [] : configSecrets(input));
}
