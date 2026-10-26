/**
 * The `umbradb` command (`openspec/changes/core-arch/specs/library-surface/spec.md` LS-6, `design.md` §12): its
 * commands, their arguments, the usage and the exit statuses. `./main.ts` is the package's `bin` entry, which runs
 * {@link runMain} on the process.
 *
 * - `umbradb config check <file> [--database <url>]` checks a configuration file (CF-10, `./config-check.ts`).
 * - `umbradb run [--config <file>]`, `umbradb backup --out <file>` and `umbradb restore <file>` are recognized (A6):
 *   this build does not provide them yet (the runner is built by tasks 5.x, the backups by tasks 15.1 and 15.2), so
 *   each says so on stderr and exits {@link EXIT}`.unavailable` (3), whatever its arguments, never the usage's status
 *   and never success; the task that builds one replaces its entry in {@link COMMANDS}, parsing its own arguments.
 * - Anything else — no argument, an unknown command (0.9.5's chain-archive sync is no command of this one), a wrong
 *   argument of `config check` — prints the usage on stderr, after one line saying what was wrong, and exits 2;
 *   `--help` or `-h` as the only argument prints it on stdout and exits 0.
 *
 * Arguments are parsed with Node.js's `util.parseArgs` (no dependency). No output repeats a `--database` value, and any
 * argument a message repeats passes through the redaction's patterns (a URL's credentials hidden): an operator may
 * paste a URL in the wrong place. The exit statuses: 0 every check passed (or the usage was asked for); 1 a check
 * failed or could not be completed; 2 the usage; 3 a command this build does not provide yet.
 */

import { parseArgs } from "node:util";
import { UMBRADB_VERSION } from "../config/build.js";
import { redactor } from "../config/redact.js";
import { configCheck, databaseArgumentProblem, errorText } from "./config-check.js";

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
  umbradb backup --out <file>
      Back up the database: a pg_dump file with its manifest.
  umbradb restore <file>
      Restore a backup into an empty database.
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

/** A command this build does not provide yet (see the module comment). */
function unavailable(name: string): CommandHandler {
  return async (_args, io) => {
    const build = `this build (UmbraDB ${UMBRADB_VERSION})`;
    io.stderr(`umbradb ${name}: not available in ${build}; a later build provides it (LS-6)\n`);
    return EXIT.unavailable;
  };
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

/** The commands, by name (LS-6). */
export const COMMANDS: Readonly<Record<string, CommandHandler>> = Object.freeze({
  run: unavailable("run"),
  config: configCommand(),
  backup: unavailable("backup"),
  restore: unavailable("restore"),
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
