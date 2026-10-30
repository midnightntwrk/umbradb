/**
 * The redaction the admin endpoints share: every `secret` field, and every credential inside a URL, shows as
 * `[redacted]`. It is built on the configuration's redaction (`../config/redact.ts`, `configRedactor`) and applied on
 * the main thread before a snapshot crosses to the admin worker, so the worker never holds a secret.
 * [AE-6, CF-4; CORE-ARCH §4.18]
 *
 * - {@link shownSettings}: a revision's settings as `/config` may show them. A revision of the build's version is
 *   redacted by its schema's kinds. A `versionEntry`'s kinds are known only from its recorded row, so every one of its
 *   fields is redacted until the history check finds it equal to that row; after that it shows as data. [AE-5, AE-6]
 * - {@link earlyRedactor}: the redaction used before the configuration is validated. It redacts the configuration's
 *   secrets as the validation reads them (`configSecrets`), or, with no configuration loaded, URL credentials only. A
 *   process logs a refusal of its configuration through it; such a process serves no admin endpoint. [AE-6, Q137 B]
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
 * history check found it equal to its recorded row.
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
