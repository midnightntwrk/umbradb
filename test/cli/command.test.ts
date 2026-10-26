import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COMMANDS, configCommand, EXIT, type MainProcess, runMain, USAGE } from "../../src/cli/command.js";
import { UMBRADB_VERSION } from "../../src/config/build.js";
import { type CommandResult, inProcess, REPOSITORY } from "./cli-fixtures.js";

/**
 * A6 `[CI]` (LS-6), in this process through `runCommand` (`./umbradb.test.ts` runs the command itself, in a child
 * process): `umbradb sync` and `umbradb` with no argument print the usage and exit 2; `run`, `config check`, `backup`
 * and `restore` are recognized — `config check` runs (task 4.4); `run` (tasks 5.x), `backup` and `restore` (tasks
 * 15.1, 15.2) are not built yet and say so, with an exit status of their own, never the usage's and never success.
 * Also the command's argument errors: each prints the usage and exits 2, and a `--database` value is never echoed.
 */

const CWD = tmpdir();

/** A6's "prints the usage and exits 2": the usage on stderr, nothing on stdout. */
function printsUsage(result: CommandResult): boolean {
  return result.code === EXIT.usage && result.stderr.includes(USAGE) && result.stdout === "";
}

/** A6's "recognized": neither the usage's exit nor its text. */
function recognized(result: CommandResult): boolean {
  return result.code !== EXIT.usage && !result.stderr.includes(USAGE) && !result.stdout.includes(USAGE);
}

describe("A6: an unknown subcommand or none prints the usage and exits 2 (LS-6)", () => {
  it("umbradb with no argument", async () => {
    const result = await inProcess([], CWD);
    expect(printsUsage(result)).toBe(true);
    expect(result.stderr).toContain("no command given");
  });

  it("umbradb sync (0.9.5's chain-archive sync is no command of the umbradb command)", async () => {
    const result = await inProcess(["sync"], CWD);
    expect(printsUsage(result)).toBe(true);
    expect(result.stderr).toContain("unknown command sync");
  });

  it.each([
    [["Run"]],
    [["runs"]],
    [["help"]],
    [["--config", "umbradb.config.ts", "run"]],
    [["config"]],
    [["config", "sync"]],
    [["config", "checks", "umbradb.config.ts"]],
    [["check", "umbradb.config.ts"]],
    [[""]],
    [["--help", "run"]],
    [["-h", "config", "check", "a.config.ts"]],
    [["constructor"]],
    [["toString"]],
    [["__proto__"]],
    [["hasOwnProperty"]],
  ])("%j", async (argv) => {
    expect(printsUsage(await inProcess(argv, CWD))).toBe(true);
  });

  it("umbradb config without its command says which commands config takes", async () => {
    const result = await inProcess(["config"], CWD);
    expect(printsUsage(result)).toBe(true);
    expect(result.stderr.startsWith("umbradb: config takes a command: config check\n\n")).toBe(true);
    const other = await inProcess(["config", "sync"], CWD);
    expect(other.stderr.startsWith("umbradb: unknown command config sync\n\n")).toBe(true);
  });

  it("a URL typed where a command goes is repeated with its credentials hidden", async () => {
    const result = await inProcess(["postgres://reader:pw-4-4-ARG@db.example/indexer"], CWD);
    expect(printsUsage(result)).toBe(true);
    expect(result.stderr.startsWith("umbradb: unknown command postgres://[redacted]@db.example/indexer\n\n")).toBe(true);
    expect(result.stderr).not.toContain("pw-4-4-ARG");
  });

  it("the usage names each command in design §12's form, and the exit statuses", () => {
    expect(USAGE).toContain("Usage: umbradb <command>");
    expect(USAGE).toContain("umbradb run [--config <file>]");
    expect(USAGE).toContain("umbradb config check <file> [--database <url>]");
    expect(USAGE).toContain("umbradb backup --out <file>");
    expect(USAGE).toContain("umbradb restore <file>");
    for (const status of ["0 ", "1 ", "2 ", "3 "]) expect(USAGE).toContain(`  ${status}`);
    expect(Object.keys(COMMANDS).sort()).toEqual(["backup", "config", "restore", "run"]);
  });

  it("--help and -h print the usage on stdout and exit 0", async () => {
    for (const flag of ["--help", "-h"]) {
      const result = await inProcess([flag], CWD);
      expect(result).toEqual({ code: EXIT.ok, stdout: USAGE, stderr: "" });
    }
  });
});

describe("A6: run, config check, backup and restore are recognized (LS-6)", () => {
  it.each([
    ["run", ["run"]],
    ["run", ["run", "--config", "umbradb.config.ts"]],
    ["run", ["run", "--anything"]],
    ["backup", ["backup", "--out", "backup.sql"]],
    ["backup", ["backup"]],
    ["restore", ["restore", "backup.sql"]],
  ])("umbradb %s is recognized and not available in this build yet: exit 3, no usage, never success", async (name, argv) => {
    const result = await inProcess(argv, CWD);
    expect(recognized(result)).toBe(true);
    expect(result.code).toBe(EXIT.unavailable);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      `umbradb ${name}: not available in this build (UmbraDB ${UMBRADB_VERSION}); a later build provides it (LS-6)\n`,
    );
  });

  it("umbradb config check is recognized: it checks the file (here: there is none) instead of printing the usage", async () => {
    const result = await inProcess(["config", "check", "no-such.config.ts"], CWD);
    expect(recognized(result)).toBe(true);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain("file-not-found");
  });

  it("the exit statuses are 0, 1, 2 and 3, each distinct", () => {
    expect(EXIT).toEqual({ ok: 0, failed: 1, usage: 2, unavailable: 3 });
  });
});

describe("config check's arguments: a wrong one prints the usage and exits 2", () => {
  it.each([
    [["config", "check"], "config check takes one file"],
    [["config", "check", "a.config.ts", "b.config.ts"], "config check takes one file"],
    [["config", "check", "--databse", "postgres://x/y", "a.config.ts"], "unknown option --databse"],
    [["config", "check", "a.config.ts", "-d", "postgres://x/y"], "unknown option -d"],
    [["config", "check", "a.config.ts", "--database"], "--database takes a value"],
    [["config", "check", "a.config.ts", "--database", ""], "--database takes a value"],
    [["config", "check", "a.config.ts", "--database=postgres://x/a", "--database=postgres://x/b"], "--database once"],
    [["config", "check", "a.config.ts", "--database", "mysql://x/y"], "--database takes a PostgreSQL URL"],
    [["config", "check", "a.config.ts", "--database", "pglite:memory"], "an in-memory PGlite database"],
  ])("%j", async (argv, words) => {
    const result = await inProcess(argv, CWD);
    expect(printsUsage(result)).toBe(true);
    expect(result.stderr).toContain(words);
  });

  it("a --database value is never echoed, also when it is refused", async () => {
    const secret = "pw-4-4-NEVER-SHOWN";
    for (const value of [`mysql://u:${secret}@h/db`, `postgres:/u:${secret}@h/db`, `pglite:memory${secret}`]) {
      const result = await inProcess(["config", "check", "a.config.ts", "--database", value], CWD);
      expect(`${result.stdout}${result.stderr}`).not.toContain(secret);
    }
    const memory = await inProcess(["config", "check", "a.config.ts", "--database", "pglite:memory"], CWD);
    expect(memory.stderr).not.toContain("pglite:memory");
  });

  it("a file named after --, or starting with -, is a file", async () => {
    const result = await inProcess(["config", "check", "--", "-odd.config.ts"], CWD);
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toContain("-odd.config.ts");
  });
});

describe("A6's negative control", () => {
  it("a command table that recognizes sync (and exits 0) fails A6's check, as an unknown subcommand exiting 0 would", async () => {
    const result = await inProcess(["sync"], CWD, { ...COMMANDS, sync: async () => EXIT.ok });
    expect(result.code).toBe(EXIT.ok);
    expect(printsUsage(result)).toBe(false);
  });

  it("a command that prints the usage for run fails A6's recognized", async () => {
    const usage = async (_args: readonly string[], io: Parameters<(typeof COMMANDS)["run"]>[1]) => {
      io.stderr(USAGE);
      return EXIT.usage;
    };
    expect(recognized(await inProcess(["run"], CWD, { ...COMMANDS, run: usage }))).toBe(false);
  });
});

describe("the bin entry's work (runMain)", () => {
  /** A stand-in for Node.js's process: its arguments (after node and the script), working directory and streams. */
  function stand(args: readonly string[]): MainProcess & { out: string; err: string } {
    const proc = {
      argv: ["/usr/bin/node", "/usr/lib/umbradb/main.js", ...args],
      cwd: () => CWD,
      out: "",
      err: "",
      exitCode: undefined as number | string | null | undefined,
      stdout: { write: (text: string) => (proc.out += text) },
      stderr: { write: (text: string) => (proc.err += text) },
    };
    return proc;
  }

  it("runs the command of the arguments after the script and sets the exit status", async () => {
    const usage = stand(["sync"]);
    await runMain(usage);
    expect([usage.exitCode, usage.out, usage.err]).toEqual([EXIT.usage, "", `umbradb: unknown command sync\n\n${USAGE}`]);
    const help = stand(["--help"]);
    await runMain(help);
    expect([help.exitCode, help.out, help.err]).toEqual([EXIT.ok, USAGE, ""]);
    const run = stand(["run"]);
    await runMain(run);
    expect(run.exitCode).toBe(EXIT.unavailable);
  });

  it("reads a relative file from the process's working directory", async () => {
    const check = stand(["config", "check", "no-such.config.ts"]);
    await runMain(check);
    expect(check.exitCode).toBe(EXIT.failed);
    expect(check.out).toContain(`no configuration file at ${CWD.replace(/\/$/, "")}/no-such.config.ts`);
  });

  it("a check that cannot be completed prints its error on stderr, redacted, and exits 1", async () => {
    const url = "postgres://checker:pw-4-4-FLAG@h/db";
    const failing = configCommand(async () => {
      throw new Error(`boom with ${url} and postgres://other:pw-4-4-OTHER@h/db`);
    });
    const result = await inProcess(["config", "check", "a.config.ts", "--database", url], CWD, {
      ...COMMANDS,
      config: failing,
    });
    expect(result.code).toBe(EXIT.failed);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe(
      "umbradb config check: the check could not be completed: boom with [redacted] and postgres://[redacted]@h/db\n",
    );
    const thrown = configCommand(async () => {
      throw "a string";
    });
    expect((await inProcess(["config", "check", "a.config.ts"], CWD, { ...COMMANDS, config: thrown })).stderr).toBe(
      "umbradb config check: the check could not be completed: a string\n",
    );
  });
});

describe("the package provides the umbradb command (LS-6, LS-1)", () => {
  const read = (file: string) => JSON.parse(readFileSync(join(REPOSITORY, file), "utf8"));

  it("package.json's bin is the umbradb command only, the build's output of src/cli/main.ts; the lockfile agrees", () => {
    expect(read("package.json").bin).toEqual({ umbradb: "dist/cli/main.js" });
    expect(read("package-lock.json").packages[""].bin).toEqual({ umbradb: "dist/cli/main.js" });
    const build = read("tsconfig.build.json").compilerOptions;
    expect([build.rootDir, build.outDir]).toEqual(["src", "dist"]);
  });

  it("the entry starts with a node shebang, which the build keeps, so the installed command runs with Node.js", () => {
    const main = readFileSync(join(REPOSITORY, "src", "cli", "main.ts"), "utf8");
    expect(main.startsWith("#!/usr/bin/env node\n")).toBe(true);
    expect(main).toContain("await runMain(process);");
  });
});
