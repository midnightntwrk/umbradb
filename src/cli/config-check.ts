/**
 * `umbradb config check <file> [--database <url>]` (`openspec/changes/core-arch/specs/configuration/spec.md` CF-10;
 * `design.md` §7, §12; CORE-ARCH §4.12): checks a configuration file without starting a process, and reports every
 * finding of every check it ran, each with its path. The checks, in order ({@link CHECK_STEPS}):
 *
 * 1. **type check** — the TypeScript compiler on the file, `noEmit` (`./type-check.ts`): each diagnostic at
 *    `file:line:column`;
 * 2. **configuration** — the file evaluated by the loader (CF-1: it runs the operator's code, decision record Q44;
 *    `not-plain-data` at its path), validated (CF-3's shape and the schema checks of every revision of the build's
 *    version, every violation at once, `src/config/validate.ts`), and the process's `core` revision taken (decision
 *    record Q102, `src/config/process.ts`: a file whose every `core` entry is a `versionEntry` has none);
 * 3. **history** — with `--database` only: the database read read-only (`./database.ts`) and the history's checks run
 *    on the validated configuration at its cursor — CF-3's checks of the `versionEntry` revisions
 *    (`entriesAtCursor`), then CF-5, CF-6, CF-8 and CF-9's `sweep: off` (`historyFindings`, `src/config/history.ts`),
 *    every finding of every code. Without `--database` no database is opened, and the report says the history checks
 *    were not run ({@link HISTORY_NOT_RUN}).
 *
 * The type check and the configuration run whatever the other finds (a type error does not stop the evaluation, which
 * Node.js's type stripping does without types); the history needs the configuration validated. The check passes —
 * the command exits 0 — only if every check that ran found nothing. Not run here, and startup's: the graph's checks
 * (MD-3 to MD-6) and, without `--database`, CF-9's PGlite half (opening the database).
 *
 * **The process's side** (`public` or `private`, which `core` schema applies, CF-4) is taken from the file
 * ({@link inferSide}) unless given; **the build's modules** are the command's own (`./build-modules.ts`) unless a host
 * program gives its declarations.
 *
 * **No secret is printed** (CF-4, AE-6): every text of the report — findings, notes, the summary — passes through the
 * redaction of `src/config/redact.ts` built from the file's secrets as the validation reads them (`configSecrets`:
 * `secret` settings and settings of no known kind, URL passwords elsewhere) and the `--database` value, which is never
 * printed itself; the redaction's patterns also hide any URL's credentials. When the file cannot be evaluated nothing
 * tells its secrets apart, so an error it throws is shown through the patterns and the `--database` value only.
 */

import { resolve } from "node:path";
import { PUBLIC_CORE_SCHEMA, type ProcessSide } from "../config/core-settings.js";
import { CORE_ENTRY_ID } from "../config/entries.js";
import { historyFindings, type HistoryRow } from "../config/history.js";
import { type LoadedConfig, loadConfig } from "../config/load.js";
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
  /** `--database`: the database whose history to check against, read-only. Without it no database is opened. */
  readonly database?: string | undefined;
  /** The build's declarations, validated; the command's own (`buildDeclarations`) unless given. */
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
}

/** The checks' names. */
export type StepName = "type check" | "configuration" | "history";

/** How a check ended. */
export type StepStatus = "passed" | "failed" | "not run";

/** One finding: its code (`TS2322`, `invalid-configuration settings-schema`, `changes-past data`), where, and what. */
export interface CheckFinding {
  readonly code: string;
  /** `file:line:column` for the compiler's, a configuration's path (`entries[0].config.pollMs`), or `--database`. */
  readonly path: string;
  readonly message: string;
}

/** What one check reported. */
export interface StepReport {
  readonly name: StepName;
  /** Its heading: the name and what it checks (`configuration (CF-1, CF-3)`). */
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
  readonly database: string | undefined;
  readonly declarations: DeclarationSet<ModuleDeclaration>;
  readonly side: ProcessSide | undefined;
  /** The reports of the checks that ran before. */
  readonly reports: readonly StepReport[];
  /** The evaluated file, once loaded. */
  loaded: LoadedConfig | null;
  /** The validated configuration, once it passed. */
  checked: CheckedConfig | null;
  /** The process's `core` revision (Q102), once taken. */
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

const CONFIGURATION_TITLE = "configuration (CF-1, CF-3)";

const HISTORY_TITLE = "history (CF-3 for versionEntry revisions, CF-5, CF-6, CF-8)";

/** Where the history step's findings about the database itself are. */
const DATABASE_PATH = "--database";

const NO_DATABASE = "no --database given, so no database was opened and the history checks were not run";

/** The history check's line without `--database` (CF-10: "SHALL report that the history checks … were not run"). */
export const HISTORY_NOT_RUN = `${HISTORY_TITLE}: not run — ${NO_DATABASE}`;

const isObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The process's side, from the evaluated file: private when a `core` entry's `config` has `instanceId` and none has
 * `node` (CF-4: a public process's `core` entry requires `node`, a private one's `instanceId`), public otherwise — then
 * the validation names a private process's field in a public one's entry as such.
 */
export function inferSide(data: PlainData | unknown): ProcessSide {
  const entries = isObject(data) && Array.isArray(data.entries) ? (data.entries as readonly unknown[]) : [];
  const configs = entries.flatMap((entry) =>
    isObject(entry) && entry.id === CORE_ENTRY_ID && isObject(entry.config) ? [entry.config] : [],
  );
  const has = (field: string) => configs.some((config) => Object.hasOwn(config, field));
  return has("instanceId") && !has("node") ? "private" : "public";
}

/**
 * Why `value` cannot be `--database`, or null: it must be what the `database` setting accepts (CF-4), and not
 * `pglite:memory`, an in-memory database that only its own process can read. The reason never repeats the value.
 */
export function databaseArgumentProblem(value: string): string | null {
  if (value === "") return "--database takes a value: the database's URL";
  if (!PUBLIC_CORE_SCHEMA.shape.database.safeParse(value).success) {
    return "--database takes a PostgreSQL URL (postgres:// or postgresql://) or pglite:<directory>";
  }
  if (value === "pglite:memory") {
    return "--database names an in-memory PGlite database, which only the process holding it can read";
  }
  return null;
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

/** The findings of a refusal of the loader, the validation or the process's `core` revision. */
function refusalFindings(error: unknown, file: string): CheckFinding[] {
  if (!(error instanceof UmbraError)) throw error;
  const details = error.details as {
    readonly findings?: readonly Finding[];
    readonly reason?: string;
    readonly path?: string;
  };
  if (details.findings !== undefined) return details.findings.map((found) => ruleFinding(error.code, found));
  if (error.code === "not-plain-data") {
    return [{ code: error.code, path: String(details.path), message: error.message }];
  }
  return [{ code: `${error.code} ${String(details.reason)}`, path: file, message: error.message }];
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
    const input = {
      config: state.loaded,
      declarations: state.declarations,
      side: state.side ?? inferSide(state.loaded.data),
    };
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
  const from = "read-only, from the database given with --database";
  const count = state.history.length;
  if (state.cursor === null && count === 0) return `${from}, a new database (nothing committed, no history)`;
  const at = state.cursor === null ? "with nothing committed" : `at the cursor ${state.cursor}`;
  return `${from} ${at}, ${count} recorded revision${count === 1 ? "" : "s"}`;
}

/**
 * A failure to open or read the `--database` database, as a finding: the refusals of the backends (CF-9's
 * `development-opt-in-required`, `writer-lock-held`) as they are, any other error — the backends' `connection-lost` and
 * `database-error`, or a URL the driver cannot read — as the database not read.
 */
function databaseFinding(error: unknown): CheckFinding {
  const code = errorCode(error);
  const text = errorText(error);
  const own = code === "development-opt-in-required" || code === "writer-lock-held";
  const message = own ? text : `the database given with --database could not be read: ${text}`;
  return { code, path: DATABASE_PATH, message };
}

/** The history's checks against the `--database` database (see the module comment). */
const HISTORY: CheckStep = {
  name: "history",
  async run(state) {
    if (state.database === undefined) return notRun("history", HISTORY_TITLE, NO_DATABASE);
    if (state.checked === null || state.process === null) {
      const why = "the configuration did not pass its own checks, which the history checks need";
      return notRun("history", HISTORY_TITLE, why);
    }
    let read: DatabaseState;
    try {
      read = await readDatabaseState(state.database, {
        cwd: state.cwd,
        developmentOptIn: state.process.settings?.developmentOptIn === true,
      });
    } catch (error) {
      const why = "the database given with --database was not read";
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
          `${note}; CF-3's checks of the versionEntry revisions found what is below, so CF-5, CF-6 and CF-8 were ` +
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

/** One finding's line: its message, which starts with its path (or is given one), and its code. */
function findingLine(found: CheckFinding): string {
  const where = found.path === "" ? "(the default export)" : found.path;
  const text = found.path !== "" && found.message.startsWith(found.path) ? found.message : `${where}: ${found.message}`;
  return `  ${text} [${found.code}]`;
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
 * process, and opens a database only with `options.database`, read-only. Throws an `Error` for a `database` that is no
 * `--database` value ({@link databaseArgumentProblem}: the caller's error).
 */
export async function configCheck(
  options: ConfigCheckOptions,
  seams: ConfigCheckSeams = {},
): Promise<ConfigCheckReport> {
  if (options.database !== undefined) {
    const problem = databaseArgumentProblem(options.database);
    if (problem !== null) throw new Error(`configCheck: ${problem}`);
  }
  const file = resolve(options.cwd, options.file);
  const reports: StepReport[] = [];
  const state: CheckState = {
    file,
    cwd: options.cwd,
    database: options.database,
    declarations: options.declarations ?? buildDeclarations(),
    side: options.side,
    reports,
    loaded: null,
    checked: null,
    process: null,
    secrets: options.database === undefined ? [] : [options.database],
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
