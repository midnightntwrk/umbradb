/**
 * The `umbradb` command (`openspec/changes/core-arch/specs/library-surface/spec.md` LS-6, `design.md` §12): its
 * commands, their arguments, the usage and the exit statuses. `./main.ts` is the package's `bin` entry, which runs
 * {@link runMain} on the process.
 *
 * - `umbradb config check <file> [--database <url>]` checks a configuration file (CF-10, `./config-check.ts`).
 * - `umbradb run [--config <file>]` starts the process of the configuration file, with the user modules it exports,
 *   until SIGTERM or SIGINT stops it (`./run.ts`, task 4.4a; Q106 B); it exits 1 when startup refused or processing
 *   halted, else 0.
 * - `umbradb backup --out <file> [--config <file>]` writes a backup of the configuration file's database (`./backup.ts`,
 *   task 15.1; BK-1): exit 0 once written, 1 when refused (nothing written).
 * - `umbradb restore <file> [--config <file>]` restores a backup into the configuration file's database, which must be
 *   empty (`./restore.ts`, task 15.2; BK-3): exit 0 once committed, 1 when refused (nothing committed).
 * - {@link EXIT}`.unavailable` (3) is the status of a command a build does not provide; every command of design §12
 *   is built now (tasks 4.4, 4.4a, 15.1, 15.2), so none exits with it.
 * - Anything else — no argument, an unknown command (0.9.5's chain-archive sync is no command of this one), a wrong
 *   argument of `config check` or `run` — prints the usage on stderr, after one line saying what was wrong, and exits 2;
 *   `--help` or `-h` as the only argument prints it on stdout and exits 0.
 *
 * Arguments are parsed with Node.js's `util.parseArgs` (no dependency). No output repeats a `--database` value, and any
 * argument a message repeats passes through the redaction's patterns (a URL's credentials hidden): an operator may
 * paste a URL in the wrong place. The exit statuses: 0 every check passed (or the usage was asked for); 1 a check
 * failed or could not be completed; 2 the usage; 3 a command this build does not provide yet.
 */

import { parseArgs } from "node:util";
import { redactor } from "../config/redact.js";
import { configCheck, databaseArgumentProblem, errorText } from "./config-check.js";
import type { BackupSeams } from "../backup/backup.js";
import { backupArguments, runBackup } from "./backup.js";
import { type RestoreCommandSeams, restoreArguments, runRestore } from "./restore.js";
import { type RunSeams, runFailed, runProcess } from "./run.js";

/** The exit statuses. */
export const EXIT = Object.freeze({ ok: 0, failed: 1, usage: 2, unavailable: 3 } as const);

/** The usage (LS-6; the commands in `design.md` §12's form). */
export const USAGE = `Usage: umbradb <command> [options]

Commands:
  umbradb run [--config <file>]
      Start a core or private process from its configuration (default umbradb.config.ts).
  umbradb config check <file> [--database <url>]
      Type-check and validate a configuration file without starting a process; with --database, also check it
      against that database's configuration history, read-only.
  umbradb backup --out <file> [--config <file>]
      Back up the configuration's database (default umbradb.config.ts): a pg_dump file with its manifest.
  umbradb restore <file> [--config <file>]
      Restore a backup into the configuration's database, which must be empty (default umbradb.config.ts).
  umbradb --help
      Print this usage.

Exit status:
  0 every check passed, or the usage was asked for
  1 a check failed, or could not be completed
  2 no command, an unknown one, or a wrong argument (this usage)
  3 a command this build of UmbraDB does not provide yet
`;

/** Where a command writes, and the working directory it reads relative paths from. */
export interface CommandIo {
  readonly cwd: string;
  /** The environment a command reads (`PATH`, `UMBRADB_PG_DUMP`); this process's unless given. */
  readonly env?: Readonly<Record<string, string | undefined>>;
  stdout(text: string): void;
  stderr(text: string): void;
}

/** A command: its arguments (after its name) and the streams; resolves with the exit status. */
export type CommandHandler = (args: readonly string[], io: CommandIo) => Promise<number>;

/** A message that may repeat an argument, with any URL's credentials hidden. */
const shown = redactor([]).text;

/** Prints the usage on stderr after `problem` and resolves with the usage's exit status. */
function usage(io: CommandIo, problem: string): number {
  io.stderr(`umbradb: ${shown(problem)}\n\n${USAGE}`);
  return EXIT.usage;
}

/** `config check`'s arguments, or what is wrong with them. */
function checkArguments(args: readonly string[]): { readonly file: string; readonly database?: string } | string {
  const { tokens } = parseArgs({
    args: [...args],
    options: { database: { type: "string" } },
    allowPositionals: true,
    strict: false,
    tokens: true,
  });
  const files: string[] = [];
  const databases: (string | undefined)[] = [];
  for (const token of tokens) {
    if (token.kind === "positional") files.push(token.value);
    else if (token.kind === "option") {
      if (token.name !== "database") return `unknown option ${token.rawName} of config check`;
      databases.push(token.value);
    }
  }
  if (files.length !== 1) return "config check takes one file: umbradb config check <file> [--database <url>]";
  if (databases.length > 1) return "config check takes --database once";
  const [database] = databases;
  if (databases.length === 0) return { file: files[0] as string };
  const problem = databaseArgumentProblem(database ?? "");
  return problem ?? { file: files[0] as string, database: database as string };
}

/**
 * `umbradb config …`: `config check` (CF-10), running `check` (`configCheck` unless given: a test's failing check). A
 * check that cannot be completed — an error it does not report as a finding — is printed on stderr, its message
 * redacted, with exit status 1.
 */
export function configCommand(check: typeof configCheck = configCheck): CommandHandler {
  return async (args, io) => {
    const [sub, ...rest] = args;
    if (sub !== "check") {
      return usage(io, sub === undefined ? "config takes a command: config check" : `unknown command config ${sub}`);
    }
    const parsed = checkArguments(rest);
    if (typeof parsed === "string") return usage(io, parsed);
    try {
      const report = await check({ file: parsed.file, cwd: io.cwd, database: parsed.database });
      io.stdout(report.text);
      return report.passed ? EXIT.ok : EXIT.failed;
    } catch (error) {
      const shownError = redactor(parsed.database === undefined ? [] : [parsed.database]).text(errorText(error));
      io.stderr(`umbradb config check: the check could not be completed: ${shownError}\n`);
      return EXIT.failed;
    }
  };
}

/** `run`'s arguments — at most one `--config <file>`, nothing else —, or what is wrong with them. */
function runArguments(args: readonly string[]): { readonly file?: string } | string {
  const { tokens } = parseArgs({
    args: [...args],
    options: { config: { type: "string" } },
    allowPositionals: true,
    strict: false,
    tokens: true,
  });
  const files: (string | undefined)[] = [];
  for (const token of tokens) {
    if (token.kind === "positional") return "run takes no file of its own: umbradb run [--config <file>]";
    if (token.kind === "option") {
      if (token.name !== "config") return `unknown option ${token.rawName} of run`;
      files.push(token.value);
    }
  }
  if (files.length > 1) return "run takes --config once";
  const [file] = files;
  if (files.length === 0) return {};
  if (file === undefined || file === "") return "--config takes a value: the configuration file";
  return { file };
}

/**
 * `umbradb run` (`./run.ts`): starts the process and resolves, once SIGTERM or SIGINT stopped it, with
 * {@link EXIT}`.failed` when startup refused or processing halted, else {@link EXIT}`.ok`; the process's log goes to
 * stderr. `seams` are a test's (its signals, a view of the handle, a negative control's modules).
 */
export function runProcessCommand(seams: RunSeams = {}): CommandHandler {
  return async (args, io) => {
    const parsed = runArguments(args);
    if (typeof parsed === "string") return usage(io, parsed);
    const end = await runProcess({ file: parsed.file, cwd: io.cwd, log: (line) => io.stderr(`${line}\n`) }, seams);
    return runFailed(end) ? EXIT.failed : EXIT.ok;
  };
}

/**
 * `umbradb backup` (`./backup.ts`): exit {@link EXIT}`.ok` with the line it wrote on stdout, {@link EXIT}`.failed` with
 * why on stderr; `seams` are a test's (a missing `pglite-tools`).
 */
export function backupCommand(seams: BackupSeams = {}): CommandHandler {
  return async (args, io) => {
    const parsed = backupArguments(args);
    if (typeof parsed === "string") return usage(io, parsed);
    const outcome = await runBackup(
      { out: parsed.out, config: parsed.config, cwd: io.cwd, ...(io.env === undefined ? {} : { env: io.env }) },
      seams,
    );
    if (outcome.written) {
      io.stdout(`${outcome.line}\n`);
      return EXIT.ok;
    }
    io.stderr(`${outcome.line}\n`);
    return EXIT.failed;
  };
}

/**
 * `umbradb restore` (`./restore.ts`): exit {@link EXIT}`.ok` with the line it wrote on stdout, {@link EXIT}`.failed` with
 * why on stderr (the node client's retries go there too); `seams` are a test's (its chain, the restore's seams).
 */
export function restoreCommand(seams: RestoreCommandSeams = {}): CommandHandler {
  return async (args, io) => {
    const parsed = restoreArguments(args);
    if (typeof parsed === "string") return usage(io, parsed);
    const outcome = await runRestore(
      { file: parsed.file, config: parsed.config, cwd: io.cwd, log: (line) => io.stderr(`${line}\n`) },
      seams,
    );
    if (outcome.restored) {
      io.stdout(`${outcome.line}\n`);
      return EXIT.ok;
    }
    io.stderr(`${outcome.line}\n`);
    return EXIT.failed;
  };
}

/** The commands, by name (LS-6). */
export const COMMANDS: Readonly<Record<string, CommandHandler>> = Object.freeze({
  run: runProcessCommand(),
  config: configCommand(),
  backup: backupCommand(),
  restore: restoreCommand(),
});

/** Runs the command `argv` (the arguments after `umbradb`) with `commands` and resolves with its exit status. */
export async function runCommand(
  argv: readonly string[],
  io: CommandIo,
  commands: Readonly<Record<string, CommandHandler>> = COMMANDS,
): Promise<number> {
  const [name, ...args] = argv;
  if (name === undefined) return usage(io, "no command given");
  if (argv.length === 1 && (name === "--help" || name === "-h")) {
    io.stdout(USAGE);
    return EXIT.ok;
  }
  const command = Object.hasOwn(commands, name) ? commands[name] : undefined;
  if (command === undefined) return usage(io, `unknown command ${name}`);
  return command(args, io);
}

/** The process {@link runMain} runs on: Node.js's `process`, or a test's stand-in. */
export interface MainProcess {
  readonly argv: readonly string[];
  cwd(): string;
  readonly stdout: { write(text: string): unknown };
  readonly stderr: { write(text: string): unknown };
  exitCode?: number | string | null | undefined;
}

/** The `bin` entry's work: runs the command of `proc.argv`, sets the exit status; the process then ends by itself. */
export async function runMain(proc: MainProcess): Promise<void> {
  proc.exitCode = await runCommand(proc.argv.slice(2), {
    cwd: proc.cwd(),
    stdout: (text) => proc.stdout.write(text),
    stderr: (text) => proc.stderr.write(text),
  });
}
