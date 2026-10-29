/**
 * `umbradb config check <file> [--database]`: checks a configuration file without starting a process, and reports
 * every finding of every check it ran, each with its path. [CF-10; design §7, §12; CORE-ARCH §4.12]
 *
 * The checks, in order ({@link CHECK_STEPS}):
 * 1. **type check**: the TypeScript compiler on the file, `noEmit` (`./type-check.ts`), each diagnostic at
 *    `file:line:column`.
 * 2. **configuration**: the file is evaluated by the loader, which runs the operator's code (`not-plain-data` at its
 *    path). It is then validated: the shape, and the schema checks of every revision of the build's version, every
 *    violation at once (`src/config/validate.ts`). Last, the process's `core` revision is taken
 *    (`src/config/process.ts`); a file whose every `core` entry is a `versionEntry` has none. [CF-1, CF-3, Q44, Q102]
 * 3. **history**, with `--database` only: the database the file's `core` revision configures (the flag takes no value)
 *    is read read-only (`./database.ts`). The history's checks then run on the validated configuration at its cursor:
 *    first the checks of the `versionEntry` revisions (`entriesAtCursor`), then the checks of revisions by
 *    `(id, start)`, of changes only to the future, of one version per build, and of `sweep: off` (`historyFindings`,
 *    `src/config/history.ts`), every finding of every code. Without `--database` no database is opened, and the report
 *    says the history checks were not run ({@link HISTORY_NOT_RUN}). [CF-3, CF-5, CF-6, CF-8, CF-9, Q167 A]
 *
 * The type check and the configuration run whatever the other finds: a type error does not stop the evaluation, which
 * Node.js's type stripping does without types. The history needs the configuration validated. The check passes (the
 * command exits 0) only if every check that ran found nothing. [CF-10]
 *
 * Startup's own checks are not run here: the requirement graph's checks, and, without `--database`, the half of the
 * development opt-in check that opens a PGlite database. [MD-3, MD-4, MD-5, MD-6, CF-9]
 *
 * **The process's side** (`public` or `private`, which decides the `core` schema that applies) is taken from the file
 * ({@link inferSide}) unless given. [CF-4]
 *
 * **The build's modules** are the command's (`./build-modules.ts`): UmbraDB's own backbone parts and core modules, and
 * as its user modules the ones the file exports in `modules`. So the entries of a user module the file ships are
 * checked against its schema as UmbraDB's own are. A fault of those declarations (a list element that is no
 * declaration, a module listed twice, a user module with an id of UmbraDB's own) is the configuration check's finding
 * at `modules[<index>]`, and the entries are then not validated. A host program that ships its modules itself gives its
 * declarations instead, and the file's `modules` are not used. [CF-1, CF-10, MD-2, Q106 B]
 *
 * **No secret is printed.** Every text of the report (findings, notes, the summary) passes through the redaction of
 * `src/config/redact.ts`, built from the file's secrets as the validation reads them (`configSecrets`: `secret`
 * settings and settings of no known kind, the `password` parts of the database settings, URL passwords elsewhere). The
 * redaction's patterns also hide any URL's credentials. When the file cannot be evaluated, nothing tells its secrets
 * apart, so an error it throws is shown through the patterns only. [CF-4, AE-6]
 */

import { resolve } from "node:path";
import type { ProcessSide } from "../config/core-settings.js";
import { type DatabaseParts, isMemoryDatabase } from "../config/database-parts.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { historyFindings, type HistoryRow } from "../config/history.js";
import { type ConfigFinding, findingText, refusalFindings } from "../config/findings.js";
import { type LoadedConfig, loadConfig, MODULES_EXPORT } from "../config/load.js";
import type { PlainData } from "../config/plain-data.js";
import { processCoreEntry } from "../config/process.js";
import { type Redactor, redactor } from "../config/redact.js";
import {
  type CheckedConfig,
  type CheckedEntry,
  configSecrets,
  type Finding,
  validateConfig,
} from "../config/validate.js";
import { UmbraError } from "../db/errors.js";
import type { ModuleDeclaration } from "../modules/declaration.js";
import type { DeclarationSet } from "../modules/validation.js";
import { buildDeclarations } from "./build-modules.js";
import { type DatabaseState, readDatabaseState } from "./database.js";
import { isRegularFile, typeCheckFile } from "./type-check.js";

/** What to check. */
export interface ConfigCheckOptions {
  /** The configuration file, absolute or relative to `cwd`. */
  readonly file: string;
  /** The working directory. */
  readonly cwd: string;
  /**
   * `--database`: check against the history of the database the file's `core` revision configures, read-only. [Q167 A]
   * Without it no database is opened.
   */
  readonly database?: boolean | undefined;
  /**
   * The build's declarations, validated; unless given, the command's own with the file's `modules` as its user modules
   * (`buildDeclarations`). [Q106 B]
   */
  readonly declarations?: DeclarationSet<ModuleDeclaration>;
  /** The process's side; taken from the file ({@link inferSide}) unless given. */
  readonly side?: ProcessSide;
}

/** What the negative controls replace (each a default otherwise). */
export interface ConfigCheckSeams {
  /** The checks, in order; {@link CHECK_STEPS} unless given. */
  readonly steps?: readonly CheckStep[];
  /** The redaction of the report's texts; `redactor` of `src/config/redact.ts` unless given. */
  readonly redactor?: (secrets: Iterable<string>) => Redactor;
  /** The build's user modules from the loaded file; its `modules` export unless given. [Q106 B] */
  readonly userModules?: (loaded: LoadedConfig) => readonly unknown[];
}

/** The checks' names. */
export type StepName = "type check" | "configuration" | "history";

/** How a check ended. */
export type StepStatus = "passed" | "failed" | "not run";

/**
 * One finding: its code (`TS2322`, `invalid-configuration settings-schema`, `changes-past data`), where — `file:line:
 * column` for the compiler's, a configuration's path (`entries[0].config.pollMs`), or `--database` — and what
 * (`src/config/findings.ts`, which a process's log of a refusal of its configuration shares).
 */
export type CheckFinding = ConfigFinding;

export { refusalFindings };

/** What one check reported. */
export interface StepReport {
  readonly name: StepName;
  /** Its heading: the name and what it checks (`configuration (evaluation, validation)`). */
  readonly title: string;
  readonly status: StepStatus;
  readonly findings: readonly CheckFinding[];
  /** Why it was not run, or what it read; null for nothing to add. */
  readonly note: string | null;
}

/** What the checks share while they run. */
export interface CheckState {
  /** The file, absolute. */
  readonly file: string;
  readonly cwd: string;
  readonly database: boolean;
  /** The build's declarations: the host program's, or the command's with the file's `modules` once it is loaded. */
  declarations: DeclarationSet<ModuleDeclaration> | null;
  readonly side: ProcessSide | undefined;
  /** The build's user modules from the loaded file (the seam's, or its `modules` export). */
  readonly userModules: (loaded: LoadedConfig) => readonly unknown[];
  /** The reports of the checks that ran before. */
  readonly reports: readonly StepReport[];
  /** The evaluated file, once loaded. */
  loaded: LoadedConfig | null;
  /** The validated configuration, once it passed. */
  checked: CheckedConfig | null;
  /** The process's `core` revision, once taken. [Q102] */
  process: CheckedEntry | null;
  /** The secrets to redact from the report. */
  readonly secrets: string[];
}

/** One check. */
export interface CheckStep {
  readonly name: StepName;
  run(state: CheckState): Promise<StepReport>;
}

/** The report of a check. */
export interface ConfigCheckReport {
  /** The file, absolute. */
  readonly file: string;
  /** Every check that ran found nothing: the command exits 0. */
  readonly passed: boolean;
  readonly steps: readonly StepReport[];
  /** The report as the command prints it. */
  readonly text: string;
}

const CONFIGURATION_TITLE = "configuration (evaluation, validation)";

/** The configuration check's note when the build's declarations with the file's modules were refused. */
const UNVALIDATED = "the build's modules with the file's modules list were refused, so the entries were not validated";

const HISTORY_TITLE =
  "history (versionEntry revisions, revisions by (id, start), changes only to the future, one version per build)";

/** Where the history step's findings about the database itself are. */
const DATABASE_PATH = "--database";

const NO_DATABASE = "no --database given, so no database was opened and the history checks were not run";

/** The history check's line without `--database`, which reports that the history checks were not run. [CF-10] */
export const HISTORY_NOT_RUN = `${HISTORY_TITLE}: not run — ${NO_DATABASE}`;

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The process's side, from the evaluated file: private when a `core` entry's `config` has `instanceId` and none has
 * `node` (a public process's `core` entry requires `node`, a private one's `instanceId`), and public otherwise. Then
 * the validation names a private process's field in a public one's entry as such. [CF-4]
 */
export function inferSide(data: PlainData | unknown): ProcessSide {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const configs = entries.flatMap((entry) =>
    isObject(entry) && entry.id === CORE_ENTRY_ID && isObject(entry.config) ? [entry.config] : [],
  );
  const has = (field: string) => configs.some((config) => Object.hasOwn(config, field));
  return has("instanceId") && !has("node") ? "private" : "public";
}


/** An error's code: an `UmbraError`'s own, `error` for any other. */
export const errorCode = (error: unknown): string => (error instanceof UmbraError ? error.code : "error");

/** An error's message, or the thrown value as text. */
export const errorText = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/** A report of `step`. */
function stepReport(
  name: StepName,
  title: string,
  findings: readonly CheckFinding[],
  note: string | null = null,
): StepReport {
  return { name, title, status: findings.length > 0 ? "failed" : "passed", findings, note };
}

const notRun = (name: StepName, title: string, note: string): StepReport => ({
  name,
  title,
  status: "not run",
  findings: [],
  note,
});

/** A finding of the validation or the history (`src/config/validate.ts`'s `Finding`), with its error's code. */
const ruleFinding = (code: string, found: Finding): CheckFinding => ({
  code: `${code} ${found.rule}`,
  path: found.path,
  message: found.message,
});

/** Where a declaration refusal of `user` points: `modules[<index>]`, with its field when it names one. [MD-2] */
function declarationPath(error: UmbraError, user: readonly unknown[]): string {
  const details = error.details as {
    readonly origin?: unknown;
    readonly index?: unknown;
    readonly field?: unknown;
    readonly module?: unknown;
    readonly second?: { readonly origin?: unknown; readonly index?: unknown };
  };
  const at = (index: number, field?: unknown) =>
    `${MODULES_EXPORT}[${index}]${typeof field === "string" && field !== "" ? `.${field}` : ""}`;
  if (details.origin === "user" && typeof details.index === "number") return at(details.index, details.field);
  if (details.second?.origin === "user" && typeof details.second.index === "number") return at(details.second.index);
  const index = user.findIndex(
    (module) => typeof module === "object" && module !== null && (module as { id?: unknown }).id === details.module,
  );
  return index < 0 ? MODULES_EXPORT : at(index);
}

/** The finding of a refusal of the build's declarations with the file's `user` modules. [MD-2] */
export function declarationFinding(error: unknown, user: readonly unknown[]): CheckFinding {
  if (!(error instanceof UmbraError)) throw error;
  return { code: error.code, path: declarationPath(error, user), message: error.message };
}

/** The type check (see the module comment). */
const TYPE_CHECK: CheckStep = {
  name: "type check",
  async run(state) {
    if (!isRegularFile(state.file)) {
      return notRun("type check", "type check (TypeScript)", "no configuration file at the path");
    }
    const { version, findings } = await typeCheckFile(state.file);
    return stepReport("type check", `type check (TypeScript ${version}, noEmit)`, findings);
  },
};

/** The evaluation, the validation and the process's `core` revision (see the module comment). */
const CONFIGURATION: CheckStep = {
  name: "configuration",
  async run(state) {
    try {
      state.loaded = await loadConfig({ file: state.file, cwd: state.cwd });
    } catch (error) {
      return stepReport("configuration", CONFIGURATION_TITLE, refusalFindings(error, state.file));
    }
    const side = state.side ?? inferSide(state.loaded.data);
    if (state.declarations === null) {
      const user = state.userModules(state.loaded);
      try {
        state.declarations = buildDeclarations(user, { side });
      } catch (error) {
        return stepReport("configuration", CONFIGURATION_TITLE, [declarationFinding(error, user)], UNVALIDATED);
      }
    }
    const input = { config: state.loaded, declarations: state.declarations, side };
    state.secrets.push(...configSecrets(input));
    try {
      state.checked = validateConfig(input);
      state.process = processCoreEntry(state.checked);
    } catch (error) {
      return stepReport("configuration", CONFIGURATION_TITLE, refusalFindings(error, state.file));
    }
    return stepReport("configuration", CONFIGURATION_TITLE, []);
  },
};

/** What the history step read, for its note. */
function readNote(state: DatabaseState): string {
  if (state.kind === "absent") {
    return "no PGlite database at that directory yet: checked as a new database, which startup creates; nothing was " +
      "opened or created";
  }
  const from = "read-only, from the configuration's database";
  const count = state.history.length;
  if (state.cursor === null && count === 0) return `${from}, a new database (nothing committed, no history)`;
  const at = state.cursor === null ? "with nothing committed" : `at the cursor ${state.cursor}`;
  return `${from} ${at}, ${count} recorded revision${count === 1 ? "" : "s"}`;
}

/**
 * A failure to open or read the configuration's database, as a finding. The refusals of the backends
 * (`development-opt-in-required`, `writer-lock-held`) are reported as they are. Any other error (the backends'
 * `connection-lost` and `database-error`) is reported as the database not read. [CF-9]
 */
function databaseFinding(error: unknown): CheckFinding {
  const code = errorCode(error);
  const text = errorText(error);
  const own = code === "development-opt-in-required" || code === "writer-lock-held";
  const message = own ? text : `the configuration's database could not be read: ${text}`;
  return { code, path: DATABASE_PATH, message };
}

/** The history's checks against the configuration's database, with `--database` (see the module comment). */
const HISTORY: CheckStep = {
  name: "history",
  async run(state) {
    if (!state.database) return notRun("history", HISTORY_TITLE, NO_DATABASE);
    if (state.checked === null || state.process === null || state.declarations === null) {
      const why = "the configuration did not pass its own checks, which the history checks need";
      return notRun("history", HISTORY_TITLE, why);
    }
    const database = state.process.settings?.database as unknown as DatabaseParts;
    if (isMemoryDatabase(database)) {
      const finding = {
        code: "invalid-configuration",
        path: DATABASE_PATH,
        message:
          "the configuration's database is PGlite in memory, which only the process holding it can read; " +
          "nothing was opened",
      };
      return stepReport("history", HISTORY_TITLE, [finding], "the configuration's database was not read");
    }
    let read: DatabaseState;
    try {
      read = await readDatabaseState(database, {
        cwd: state.cwd,
        developmentOptIn: state.process.settings?.developmentOptIn === true,
      });
    } catch (error) {
      const why = "the configuration's database was not read";
      return stepReport("history", HISTORY_TITLE, [databaseFinding(error)], why);
    }
    const cursor = read.kind === "read" ? read.cursor : null;
    const history: readonly HistoryRow[] = read.kind === "read" ? read.history : [];
    const note = readNote(read);
    try {
      const findings = historyFindings({ config: state.checked, cursor, declarations: state.declarations, history });
      return stepReport("history", HISTORY_TITLE, findings.map((found) => ruleFinding(found.code, found)), note);
    } catch (error) {
      const details = error instanceof UmbraError ? (error.details as { readonly findings?: readonly Finding[] }) : {};
      if (details.findings !== undefined) {
        const findings = details.findings.map((found) => ruleFinding((error as UmbraError).code, found));
        return stepReport(
          "history",
          HISTORY_TITLE,
          findings,
          `${note}; the checks of the versionEntry revisions found what is below, so the other history checks were ` +
            "not run",
        );
      }
      const finding = { code: errorCode(error), path: DATABASE_PATH, message: errorText(error) };
      return stepReport("history", HISTORY_TITLE, [finding], note);
    }
  },
};

/** The checks, in the order they run and are reported (see the module comment). */
export const CHECK_STEPS: readonly CheckStep[] = Object.freeze([TYPE_CHECK, CONFIGURATION, HISTORY]);

/** `n finding(s)`. */
const findingsText = (count: number) => `${count} finding${count === 1 ? "" : "s"}`;

/** One finding's line of the report: its text (`findingText`: its message, starting with its path, and its code). */
export function findingLine(found: CheckFinding): string {
  return `  ${findingText(found)}`;
}

/** The report as the command prints it. */
function reportText(file: string, steps: readonly StepReport[]): string {
  const lines = [`umbradb config check ${file}`];
  for (const step of steps) {
    const status = step.status === "failed" ? findingsText(step.findings.length) : step.status;
    lines.push(`${step.title}: ${status}${step.note === null ? "" : ` — ${step.note}`}`);
    lines.push(...step.findings.map(findingLine));
  }
  const count = steps.reduce((sum, step) => sum + step.findings.length, 0);
  const historyRan = steps.some((step) => step.name === "history" && step.status !== "not run");
  lines.push(
    count > 0
      ? `failed: ${findingsText(count)}`
      : `passed: every check that ran passed${historyRan ? "" : "; the history checks were not run"}`,
  );
  return `${lines.join("\n")}\n`;
}

/**
 * Runs `umbradb config check` on `options.file` (see the module comment) and returns its report; never starts a
 * process, and opens a database only with `options.database` — the file's own, read-only.
 */
export async function configCheck(
  options: ConfigCheckOptions,
  seams: ConfigCheckSeams = {},
): Promise<ConfigCheckReport> {
  const file = resolve(options.cwd, options.file);
  const reports: StepReport[] = [];
  const state: CheckState = {
    file,
    cwd: options.cwd,
    database: options.database === true,
    declarations: options.declarations ?? null,
    side: options.side,
    userModules: seams.userModules ?? ((loaded) => loaded.modules),
    reports,
    loaded: null,
    checked: null,
    process: null,
    secrets: [],
  };
  for (const step of seams.steps ?? CHECK_STEPS) reports.push(await step.run(state));
  const redact = (seams.redactor ?? redactor)(state.secrets);
  const steps = reports.map((report) =>
    Object.freeze({
      ...report,
      findings: Object.freeze(
        report.findings.map((found) =>
          Object.freeze({ code: found.code, path: redact.text(found.path), message: redact.text(found.message) }),
        ),
      ),
      note: report.note === null ? null : redact.text(report.note),
    }),
  );
  return Object.freeze({
    file,
    passed: reports.every((report) => report.status !== "failed"),
    steps: Object.freeze(steps),
    text: redact.text(reportText(file, reports)),
  });
}
