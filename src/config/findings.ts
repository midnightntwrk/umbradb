/**
 * A configuration refusal's findings. `umbradb config check` reports them, and a process logs them when it refuses its
 * configuration. There is one finding per thing found, each with its code, where it is and what is wrong, so the
 * command's report and the process's log name a finding the same way. [CF-10, AE-3, Q137 B]
 *
 * - **Validation** (`./validate.ts`): every finding of its refusal (`details.findings`), at its path inside the
 *   configuration (`entries[0].config.pollMs`). Its code is the refusal's code plus the rule
 *   (`invalid-configuration settings-schema`). [CF-3]
 * - **Not plain data** (`./plain-data.ts`): one finding, at the path of the refused value
 *   (`entries[1].config.onError`). [CF-1]
 * - **The loader and the process revision** (`./load.ts`, `./process.ts`): one finding, at the file. Its code is the
 *   refusal's code plus its reason (`invalid-configuration file-not-found`).
 *
 * Pure. The texts are the errors' own and never a setting's value, since the validation's messages name no value. A
 * caller redacts them (`./redact.ts`). [CF-4]
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
