/**
 * How a process logs a refusal of its own configuration.
 *
 * Some refusals come before the process's `core` revision is known: a fault in the build's declarations, in loading
 * the configuration or checking that it is plain data, in its validation, or in choosing its `core` revision. Such a
 * refusal ends the process (`./process.ts`). No admin listener opens, since no validated `listen.admin` exists yet,
 * and nothing else is opened either.
 *
 * The log is then the only place that says why, so it says it in full, for `umbradb run` and for any program that
 * calls `startProcess`:
 * - first `startup refused: <code> (<n> finding(s)); the process ends`, where `<code>` is the refusal's code
 *   (`./failures.ts`);
 * - then one `startup refused: <finding>` per finding. A finding reads `<path>: <message> [<code>]`, as
 *   `umbradb config check` prints it (`../config/findings.ts`). A validation finding or a value that is not plain data
 *   is reported at its path; the loader's refusal or a missing `core` revision is reported at the file. A fault of the
 *   declarations, or anything else thrown, is reported as its message (a declaration's message names the module and
 *   its place) and its code.
 *
 * What may hold a value of the host's goes through the redaction its caller gives — each finding's message, and the
 * file a finding is at: before the validation nothing tells a configuration's secrets apart but the validation's own
 * reading of them (`configSecrets`, `earlyRedactor`), and the URL patterns. What UmbraDB writes in its own words is
 * never redacted, whatever a secret's text: the header's code and count, each finding's code, and a finding's path
 * inside the configuration or the options.
 *
 * **The refusal a host is given** ({@link shownRefusal}): a refusal whose text holds a secret the redaction knows — a
 * module file's own error quoted in its message, a user module's value in its declaration's refusal, a path — is given
 * as a copy with that text redacted, its code, details and cause kept; any other refusal is given as it is. Its details'
 * own words ({@link OWN_WORDS}: its reason, its findings' rules and paths, …) are kept as they are, so a caller can
 * still tell one refusal from another.
 */

import { type ConfigFinding, refusalFindings } from "../config/findings.js";
import { UmbraError } from "../db/errors.js";
import { reasonOf } from "./failures.js";

/** Whether `error` is a refusal of the loader, the plain-data check, the validation or the `core` revision. */
function isConfigurationRefusal(error: unknown): error is UmbraError {
  return error instanceof UmbraError && (error.code === "invalid-configuration" || error.code === "not-plain-data");
}

/** An error's message, or the thrown value as text. */
const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/**
 * The findings' texts of `error`, a refusal of the configuration's own steps (see the module comment), as
 * `umbradb config check` writes them (`findingText`), unredacted: one at the file is at the file its refusal names
 * (`details.file`: the loader's always, the `core` revision's when the configuration came from one), else at
 * `the configuration` (data given without a file).
 */
export function configurationFindings(error: unknown): string[] {
  return redactedFindings(error, (text) => text);
}

/**
 * One finding's text as `findingText` (`../config/findings.ts`) writes it, through `redact` where it may hold the
 * host's text (see the module comment): its message, and its path when it is the file the refusal names (`atFile`); its
 * code, and a path UmbraDB wrote, as they are.
 */
function redactedFindingText(found: ConfigFinding, atFile: boolean, redact: (text: string) => string): string {
  const path = atFile ? redact(found.path) : found.path;
  if (found.path !== "" && found.message.startsWith(found.path)) {
    return `${path}${redact(found.message.slice(found.path.length))} [${found.code}]`;
  }
  return `${found.path === "" ? "(the default export)" : path}: ${redact(found.message)} [${found.code}]`;
}

/** The findings' texts of `error` (see {@link configurationFindings}), each through `redact` as the module comment says. */
function redactedFindings(error: unknown, redact: (text: string) => string): string[] {
  if (isConfigurationRefusal(error)) {
    const { file } = error.details as { readonly file?: unknown };
    const at = typeof file === "string" ? file : "the configuration";
    return refusalFindings(error, at).map((found) => redactedFindingText(found, typeof file === "string" && found.path === file, redact));
  }
  return [`${redact(messageOf(error))} [${reasonOf(error).code}]`];
}

/**
 * The log lines of `error` (see the module comment): the header, then one line per finding, what may hold the host's
 * text through `redact`.
 */
export function configurationRefusalLines(error: unknown, redact: (text: string) => string): string[] {
  const findings = redactedFindings(error, redact);
  const count = `${findings.length} finding${findings.length === 1 ? "" : "s"}`;
  const header = `startup refused: ${reasonOf(error).code} (${count}); the process ends`;
  return [header, ...findings.map((text) => `startup refused: ${text}`)];
}

/**
 * The members of a refusal's details that are UmbraDB's own words, never a value of the host's: the reason and the
 * findings' rules and codes, the kinds and forms it names (`found`, `kind`, `origin`, `expected`, `point`), and the
 * paths and names it writes — inside the configuration or the options (`path`, `option`, `field`, `setting`,
 * `settings`, `request`), a surface, the options given twice, a source's hook members. A string under one of them, in a
 * list under it included, is kept as it is; every other string of the details is redacted (a file, a module's id, an
 * error's code, a message).
 */
export const OWN_WORDS: ReadonlySet<string> = new Set([
  "reason",
  "rule",
  "code",
  "found",
  "kind",
  "origin",
  "expected",
  "point",
  "path",
  "option",
  "field",
  "setting",
  "settings",
  "request",
  "surface",
  "given",
  "members",
]);

/**
 * `value` with every string through `redact` but those under one of {@link OWN_WORDS} (`key`, the member holding it, or
 * holding the list it is in): arrays and plain objects copied when one inside changed, else `value`.
 */
function redactedValue(value: unknown, redact: (text: string) => string, key: string | null = null): unknown {
  if (typeof value === "string") return key !== null && OWN_WORDS.has(key) ? value : redact(value);
  if (Array.isArray(value)) {
    const copy = value.map((inner) => redactedValue(inner, redact, key));
    return copy.some((inner, index) => inner !== value[index]) ? Object.freeze(copy) : value;
  }
  if (typeof value === "object" && value !== null) {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return value;
    const entries = Object.entries(value);
    const copy = entries.map(([member, inner]) => [member, redactedValue(inner, redact, member)] as const);
    return copy.some(([, inner], index) => inner !== (entries[index] as [string, unknown])[1]) ? Object.freeze(Object.fromEntries(copy)) : value;
  }
  return value;
}

/**
 * The refusal `error` as a host is shown it (see the module comment): an `UmbraError` whose message or details
 * `redact` changes is copied — its code, its message and details redacted but their own words, its cause —, else
 * `error` itself.
 */
export function shownRefusal(error: unknown, redact: (text: string) => string): unknown {
  if (!(error instanceof UmbraError)) return error;
  const message = redact(error.message);
  const details = redactedValue(error.details, redact) as Record<string, unknown>;
  if (message === error.message && details === error.details) return error;
  return new UmbraError(error.code, message, details, error.cause === undefined ? undefined : { cause: error.cause });
}
