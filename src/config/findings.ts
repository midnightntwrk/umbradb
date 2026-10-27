/**
 * A configuration refusal's findings, as `umbradb config check` reports them and as a process logs a refusal of its
 * configuration (`openspec/changes/core-arch/specs/configuration/spec.md` CF-1, CF-3, CF-10;
 * `specs/admin-endpoints/spec.md` AE-3; owner decision Q137 B, task 8.1b): one per thing found, each with its code,
 * where it is and what is wrong, so that the command's report and the process's log name a finding alike.
 *
 * - **The validation's** (`./validate.ts`, CF-3): every finding of its refusal (`details.findings`), at its path inside
 *   the configuration (`entries[0].config.pollMs`), its code the refusal's and the rule's
 *   (`invalid-configuration settings-schema`).
 * - **Not plain data** (`./plain-data.ts`, CF-1): one, at the path of the value refused (`entries[1].config.onError`).
 * - **The loader's and the process revision's** (`./load.ts`, `./process.ts`): one, at the file, its code the refusal's
 *   and its reason (`invalid-configuration file-not-found`).
 *
 * Pure: the texts are the errors' own, never a setting's value (the validation's messages name no value, CF-4); a
 * caller redacts them (`./redact.ts`).
 */

import { UmbraError } from "../db/errors.js";
import type { Finding } from "./validate.js";

/** One finding: its code (`invalid-configuration settings-schema`, `not-plain-data`, `TS2322`), where, and what. */
export interface ConfigFinding {
  readonly code: string;
  /** A configuration's path (`entries[0].config.pollMs`), a file, or what else the finding is at. */
  readonly path: string;
  readonly message: string;
}

/**
 * The findings of a refusal of the loader, the plain-data check, the validation or the process's `core` revision (see
 * the module comment), a refusal at the file given as `file`; throws `error` when it is no `UmbraError`.
 */
export function refusalFindings(error: unknown, file: string): ConfigFinding[] {
  if (!(error instanceof UmbraError)) throw error;
  const details = error.details as {
    readonly findings?: readonly Finding[];
    readonly reason?: string;
    readonly path?: string;
  };
  if (details.findings !== undefined) {
    return details.findings.map((found) => ({ code: `${error.code} ${found.rule}`, path: found.path, message: found.message }));
  }
  if (error.code === "not-plain-data") {
    return [{ code: error.code, path: String(details.path), message: error.message }];
  }
  return [{ code: `${error.code} ${String(details.reason)}`, path: file, message: error.message }];
}

/**
 * One finding's text: its message, which starts with its path (or is given it; `(the default export)` for the empty
 * path), and its code in brackets.
 */
export function findingText(found: ConfigFinding): string {
  const where = found.path === "" ? "(the default export)" : found.path;
  const text = found.path !== "" && found.message.startsWith(found.path) ? found.message : `${where}: ${found.message}`;
  return `${text} [${found.code}]`;
}
