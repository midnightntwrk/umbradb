/**
 * Secret redaction (`openspec/changes/core-arch/specs/configuration/spec.md` CF-4, `specs/admin-endpoints/spec.md` AE-6;
 * CORE-ARCH §4.18): a settings field of kind `secret` is never shown, logged or reported — it reads `[redacted]` — and
 * neither are credentials inside URLs, in any field. The admin endpoints (`/config`, `/status`, tasks 8.1–8.4) and the
 * runner's logs (task 5.x) call this module; it is built here, with the validation that classifies the fields
 * (`./validate.ts`), and imports nothing of Node.js, so the browser build (task 16.x) uses it as it is.
 *
 * - **Settings** ({@link Redactor.settings}, for `/config`): every field whose kind is `secret` — or whose kind is not
 *   known, so a field nobody classified is never shown (fail closed) — reads {@link REDACTED}, whatever its value (an
 *   object, a list); every string of the other fields goes through {@link Redactor.text}.
 * - **Text** ({@link Redactor.text}, for logs and error texts): every form of every secret string of the configuration
 *   is replaced by {@link REDACTED}, the longest first, in one pass; then two patterns redact credentials in any URL,
 *   also one the configuration does not hold: a URL's userinfo (`scheme://user:password@` → `scheme://[redacted]@`)
 *   and a query parameter whose name says it is a credential (`?password=…`, `&token=…`, `?apiKey=…`).
 *
 * **Which strings are secret** ({@link secretStrings}): each string inside a secret field (or one of unknown kind), at
 * any depth; each string of a `password` part ({@link SECRET_PART}) of an object inside an operational field, at any
 * depth — the `database` setting's parts and `transportReader` (CF-4, owner decisions Q167 A, Q175 A: only the password
 * of a database's parts is secret) —; and the password of every URL with credentials in the strings of the other
 * fields. {@link Redactor.settings} shows such a `password` part as {@link REDACTED} and the other parts as they are. **The forms of a
 * secret** are its parts ({@link SECRET_PARTS}: the value itself; for a URL with credentials, its password as written
 * and decoded) in each encoding ({@link SECRET_ENCODINGS}: as written; URI-component encoded, with upper- and
 * lower-case hex; form-encoded, a space as `+`; as WHATWG URL serialization writes a userinfo, which leaves `%` alone;
 * JSON-escaped). What it cannot catch: a secret written some other way (base64, split across lines), a username alone
 * (a URL's username is an identifier, not a credential: it is redacted only inside a URL), a password holding a raw
 * `/`, `?` or `#` (not a valid URL; the whole value is still redacted), and a value that is not a string inside a secret
 * field (redacted in the settings, not searched for in text). A secret is redacted wherever it appears, however short.
 */

import type { FieldKinds } from "./validate.js";
import type { PlainData, PlainObject } from "./plain-data.js";

/** What a secret reads as (CF-4). */
export const REDACTED = "[redacted]";

/** A way a secret string yields strings to hide: a part of it, or an encoding of a part. */
export interface SecretForm {
  readonly name: string;
  /** The strings `secret` yields; empty when it yields none. */
  forms(secret: string): readonly string[];
}

/** A pattern of credentials in any text, redacted whatever the configuration holds. */
export interface TextPattern {
  readonly name: string;
  redact(text: string): string;
}

/** A URL's userinfo: the scheme, `//`, then everything up to the last `@` before the host's end. */
const URL_USERINFO = /([a-z][a-z0-9+.-]*:\/\/)([^\s/?#]*)@/gi;

/** A query parameter whose name says it holds a credential, and its value. */
const CREDENTIAL_PARAMETER = /([?&][^=&#\s]*(?:pass|pwd|secret|token|key|auth|credential)[^=&#\s]*=)[^&#\s]*/gi;

/** The passwords of the URLs with credentials in `text`, as written (percent-encoded). */
function urlPasswords(text: string): string[] {
  const passwords: string[] = [];
  for (const match of text.matchAll(URL_USERINFO)) {
    const userinfo = match[2] as string;
    const colon = userinfo.indexOf(":");
    if (colon >= 0) passwords.push(userinfo.slice(colon + 1));
  }
  return passwords;
}

/** `text` percent-decoded, or nothing when it is not valid percent-encoding. */
function decoded(text: string): string[] {
  try {
    return [decodeURIComponent(text)];
  } catch {
    return [];
  }
}

/** `text` URI-component encoded, or nothing when it cannot be (a lone surrogate). */
function uriComponent(text: string): string[] {
  try {
    return [encodeURIComponent(text)];
  } catch {
    return [];
  }
}

/** How a secret yields the strings to hide (each then in every encoding). */
export const SECRET_PARTS: readonly SecretForm[] = Object.freeze([
  { name: "value", forms: (secret: string) => [secret] },
  { name: "url-password", forms: urlPasswords },
  { name: "url-password-decoded", forms: (secret: string) => urlPasswords(secret).flatMap(decoded) },
]);

/** How a part of a secret may be written in a text. */
export const SECRET_ENCODINGS: readonly SecretForm[] = Object.freeze([
  { name: "as-written", forms: (part: string) => [part] },
  { name: "uri-component", forms: uriComponent },
  {
    name: "uri-component-lower",
    forms: (part: string) => uriComponent(part).map((encoded) => encoded.replace(/%[0-9A-F]{2}/g, (hex) => hex.toLowerCase())),
  },
  { name: "form", forms: (part: string) => [new URLSearchParams([["", part]]).toString().slice(1)] },
  {
    name: "userinfo",
    forms: (part: string) => {
      const url = new URL("http://host");
      url.password = part;
      return [url.password];
    },
  },
  { name: "json", forms: (part: string) => [JSON.stringify(part).slice(1, -1)] },
]);

/** Credentials in any text (AE-6: "credentials inside URLs"). */
export const TEXT_PATTERNS: readonly TextPattern[] = Object.freeze([
  { name: "url-userinfo", redact: (text: string) => text.replace(URL_USERINFO, `$1${REDACTED}@`) },
  { name: "credential-parameter", redact: (text: string) => text.replace(CREDENTIAL_PARAMETER, `$1${REDACTED}`) },
]);

/** The strings in `value`, at any depth, in order. */
function stringsIn(value: PlainData): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (typeof value === "object" && value !== null) return Object.values(value).flatMap(stringsIn);
  return [];
}

/**
 * The part of an object inside an operational field that is secret (CF-4, owner decision Q167 A): a database's
 * `password`, and `transportReader`'s. A data field's parts are never secret: they are recorded and shown.
 */
export const SECRET_PART = "password";

/** The strings of the {@link SECRET_PART} parts inside `value`, at any depth. */
function secretPartsIn(value: PlainData): string[] {
  if (Array.isArray(value)) return value.flatMap(secretPartsIn);
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, inner]) => (key === SECRET_PART ? stringsIn(inner) : secretPartsIn(inner)));
}

/** `value` with each {@link SECRET_PART} part inside it, at any depth, as {@link REDACTED}. */
function withoutSecretParts(value: PlainData): PlainData {
  if (Array.isArray(value)) return value.map(withoutSecretParts);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, inner]) => [key, key === SECRET_PART ? REDACTED : withoutSecretParts(inner)]),
  );
}

/** The kind of `field`, or undefined when `kinds` does not classify it (an own property only). */
function kindOf(kinds: FieldKinds, field: string): string | undefined {
  return Object.hasOwn(kinds, field) ? kinds[field] : undefined;
}

/** The passwords of the URLs in `text`, as written and decoded. */
export function credentialsIn(text: string): string[] {
  return urlPasswords(text).flatMap((password) => [password, ...decoded(password)]);
}

/**
 * The secret strings of `settings` (CF-4): every string inside a field whose kind is `secret` or not in `kinds`, the
 * strings of the `password` parts inside an operational field, and the passwords of the URLs in the strings of the other
 * fields; each once, in order, empty strings left out.
 */
export function secretStrings(settings: PlainObject, kinds: FieldKinds): string[] {
  const found: string[] = [];
  for (const [field, value] of Object.entries(settings)) {
    const kind = kindOf(kinds, field);
    const strings = stringsIn(value);
    if (kind === undefined || kind === "secret") found.push(...strings);
    else found.push(...(kind === "operational" ? secretPartsIn(value) : []), ...strings.flatMap(credentialsIn));
  }
  return [...new Set(found)].filter((secret) => secret !== "");
}

/** What redacts a configuration's secrets. */
export interface Redactor {
  /** `text` with every form of every secret, and the credentials of every URL, as {@link REDACTED}. */
  text(text: string): string;
  /**
   * `settings` as they may be shown: a field of kind `secret`, or of a kind `kinds` does not give, as
   * {@link REDACTED}; a `password` part inside an operational field as {@link REDACTED}; every string of the other
   * fields through {@link Redactor.text}. A frozen copy.
   */
  settings(settings: PlainObject, kinds: FieldKinds): PlainObject;
}

/** The forms a redaction knows (each list replaceable, for the negative controls). */
export interface RedactionForms {
  readonly parts: readonly SecretForm[];
  readonly encodings: readonly SecretForm[];
  readonly patterns: readonly TextPattern[];
}

/** `value` with every string through `text`, deeply frozen. */
function redactedCopy(value: PlainData, text: (text: string) => string): PlainData {
  if (typeof value === "string") return text(value);
  if (Array.isArray(value)) return Object.freeze(value.map((element) => redactedCopy(element, text)));
  if (typeof value === "object" && value !== null) {
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, redactedCopy(inner, text)])));
  }
  return value;
}

/** A redactor for `secrets` with `forms`: see the module comment. */
export function redactorWith(secrets: Iterable<string>, forms: RedactionForms): Redactor {
  const hidden = new Set<string>();
  for (const secret of secrets) {
    for (const part of forms.parts.flatMap((form) => form.forms(secret))) {
      for (const encoded of forms.encodings.flatMap((form) => form.forms(part))) hidden.add(encoded);
    }
  }
  hidden.delete("");
  const longestFirst = [...hidden].sort((a, b) => b.length - a.length);
  const search =
    longestFirst.length === 0
      ? undefined
      : new RegExp(longestFirst.map((form) => form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
  const text = (input: string): string => {
    const replaced = search === undefined ? input : input.replace(search, REDACTED);
    return forms.patterns.reduce((current, pattern) => pattern.redact(current), replaced);
  };
  const settings = (values: PlainObject, kinds: FieldKinds): PlainObject => {
    const shown = Object.entries(values).map(([field, value]) => {
      const kind = kindOf(kinds, field);
      if (kind === undefined || kind === "secret") return [field, REDACTED] as const;
      return [field, redactedCopy(kind === "operational" ? withoutSecretParts(value) : value, text)] as const;
    });
    return Object.freeze(Object.fromEntries(shown));
  };
  return Object.freeze({ text, settings });
}

/** A redactor for `secrets` with every part, encoding and pattern. */
export function redactor(secrets: Iterable<string>): Redactor {
  return redactorWith(secrets, { parts: SECRET_PARTS, encodings: SECRET_ENCODINGS, patterns: TEXT_PATTERNS });
}

/** The entries of a validated configuration, as {@link configRedactor} reads them. */
export interface RedactableConfig {
  readonly entries: readonly { readonly settings: PlainObject | null; readonly kinds: FieldKinds | null }[];
}

/**
 * The redactor of a validated configuration (`validateConfig`): the secrets of every revision this build validated,
 * by their kinds; and the URL passwords in the settings of the others. A `versionEntry`'s settings, whose kinds the
 * build does not know, are the data fields recorded for it (CF-3), so their strings are not searched for in text, but a
 * credential in them is; {@link Redactor.settings} shows them only with their kinds — every field `data`, once the
 * history (task 4.3) has found them equal to their recorded row — and redacts every field without.
 */
export function configRedactor(config: RedactableConfig): Redactor {
  // A revision this build validated has its settings and kinds; another has its config as written, or none (null).
  const secrets = config.entries.flatMap(({ settings, kinds }) =>
    kinds === null ? stringsIn(settings).flatMap(credentialsIn) : secretStrings(settings as PlainObject, kinds),
  );
  return redactor(secrets);
}
