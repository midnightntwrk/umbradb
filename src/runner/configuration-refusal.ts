/**
 * How a process logs a refusal of its own configuration.
 *
 * Some refusals come before the process's `core` revision is known: a fault in the build's declarations, in loading
 * the configuration or checking that it is plain data, in its validation, or in choosing its `core` revision. Such a
 * refusal ends the process (`./process.ts`). No admin listener opens, since no validated `listen.admin` exists yet,
 * and nothing else is opened either. [AE-1, AE-3, MD-2, CF-1, CF-2, CF-3, Q102, Q137 B]
 *
 * The log is then the only place that says why, so it says it in full, for `umbradb run` and for any program that
 * calls `startProcess`:
 * - first `startup refused: <code> (<n> finding(s)); the process ends`, where `<code>` is the refusal's code
 *   (`./failures.ts`) [design §11];
 * - then one `startup refused: <finding>` per finding. A finding reads `<path>: <message> [<code>]`, as
 *   `umbradb config check` prints it (`../config/findings.ts`). A validation finding or a value that is not plain data
 *   is reported at its path; the loader's refusal or a missing `core` revision is reported at the file. A fault of the
 *   declarations, or anything else thrown, is reported as its message (a declaration's message names the module and
 *   its place) and its code.
 *
 * Every line goes through the redaction its caller gives: before the validation nothing tells a configuration's
 * secrets apart but the validation's own reading of them (`configSecrets`, `earlyRedactor`), and the URL patterns.
 */

import { findingText, refusalFindings } from "../config/findings.js";
import { UmbraError } from "../db/errors.js";
import { reasonOf } from "./failures.js";

/** Whether `error` is a refusal of the loader, the plain-data check, the validation or the `core` revision. */
function isConfigurationRefusal(error: unknown): error is UmbraError {
  return error instanceof UmbraError && (error.code === "invalid-configuration" || error.code === "not-plain-data");
}

/** An error's message, or the thrown value as text. */
const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/**
 * The findings' texts of `error`, a refusal of the configuration's own steps (see the module comment): one at the file
 * is at the file its refusal names (`details.file`: the loader's always, the `core` revision's when the configuration
 * came from one), else at `the configuration` (data given without a file).
 */
export function configurationFindings(error: unknown): string[] {
  if (isConfigurationRefusal(error)) {
    const { file } = error.details as { readonly file?: unknown };
    return refusalFindings(error, typeof file === "string" ? file : "the configuration").map(findingText);
  }
  return [`${messageOf(error)} [${reasonOf(error).code}]`];
}

/** The log lines of `error` (see the module comment), each through `redact`. */
export function configurationRefusalLines(error: unknown, redact: (text: string) => string): string[] {
  const findings = configurationFindings(error);
  const count = `${findings.length} finding${findings.length === 1 ? "" : "s"}`;
  const header = `startup refused: ${reasonOf(error).code} (${count}); the process ends`;
  return [header, ...findings.map((text) => `startup refused: ${text}`)].map(redact);
}
