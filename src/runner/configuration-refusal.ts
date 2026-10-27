/**
 * How a process logs a refusal of its configuration itself (`openspec/changes/core-arch/specs/admin-endpoints/spec.md`
 * AE-1, AE-3; `specs/configuration/spec.md` CF-1–CF-3; owner decision Q137 B, task 8.1b): a refusal before the
 * process's `core` revision is known — the build's declarations (MD-2), the configuration's loading and plain data
 * (CF-1), its validation (CF-2, CF-3) and the choice of its `core` revision (Q102) — ends the process
 * (`./process.ts`): no admin listener opens, since no validated `listen.admin` exists yet, and nothing else is opened.
 * The log is then the only place that says why, so it says it in full, for `umbradb run` and for any program that
 * calls `startProcess`:
 *
 * - `startup refused: <code> (<n> finding(s)); the process ends`, `<code>` the refusal's (`./failures.ts`, §11);
 * - then one `startup refused: <finding>` per finding — `<path>: <message> [<code>]`, as `umbradb config check` prints
 *   it (`../config/findings.ts`): each finding of the validation at its path, a value that is not plain data at its
 *   path, the loader's refusal or a missing `core` revision at the file —; a fault of the declarations, or anything
 *   else thrown, as its message (a declaration's names the module and its place) and its code.
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
