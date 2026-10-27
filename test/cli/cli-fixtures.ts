import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { build } from "esbuild";
import ts from "typescript";
import { type CommandIo, runCommand } from "../../src/cli/command.js";
import { REPOSITORY } from "../config/config-fixtures.js";
import { spawnChild } from "../child-processes.js";

export { REPOSITORY };

/**
 * A project directory for the tests of the `umbradb` command (task 4.4; CF-10, LS-6), laid out as an operator's: a
 * `package.json` with `"type": "module"`, a `node_modules` (a link to the repository's, so `zod`, `typescript`, PGlite,
 * the PostgreSQL driver and `@types/node` resolve from it as from an installed package's dependencies), and the
 * configuration builders as an installed package would give them — `umbradb.mjs`, the builders bundled with esbuild
 * (their dependencies left as imports, `packages: "external"`), and `umbradb.d.mts`, declarations emitted from the
 * sources by the TypeScript compiler, so that the command's type check reads `.d.ts` files only, as it does for an
 * installed package (the sources themselves use parameter properties, which the type check's `erasableSyntaxOnly`
 * refuses in a configuration). Configuration files import the builders by absolute path (task 4.1's note: neither
 * Vitest's resolver nor the compiler reads a `file:` URL).
 *
 * With `cli`, also `umbradb-cli.mjs`: the command (`src/cli/main.ts`) bundled the same way, which a test runs with
 * Node.js itself in a child process — Node.js's own type stripping, real exit codes and streams —, and next to it
 * `worker.js`, the admin endpoints' worker thread (`src/admin/worker.ts`) bundled too: the admin server starts its
 * thread from `./worker.js` beside the module that starts it (`workerEntry`), which in the bundle is the command's file,
 * as `dist/admin/worker.js` is beside `dist/admin/server.js` in the package (task 4.4a: `umbradb run` serves them).
 */
export interface CliProject {
  readonly dir: string;
  /** The builders' module, by absolute path: what a configuration file imports. */
  readonly builders: string;
  /** The bundled command (with `cli`). */
  readonly cli: string;
  /** Writes `text` to `name` under the project and returns its absolute path. */
  write(name: string, text: string): string;
  remove(): void;
}

/** What the builders' module exports: the configuration's builders and `defineModule` for a test's own module. */
const BUILDERS_SOURCE = [
  `export * from ${JSON.stringify(join(REPOSITORY, "src", "config", "index.ts"))};`,
  `export { defineModule } from ${JSON.stringify(join(REPOSITORY, "src", "modules", "declaration.ts"))};`,
].join("\n");

/** Emits the declarations of the builders' sources into `out` (rooted at the repository's `src`). */
function emitDeclarations(out: string): void {
  const read = ts.readConfigFile(join(REPOSITORY, "tsconfig.json"), (path) => ts.sys.readFile(path));
  const { options } = ts.parseJsonConfigFileContent(read.config, ts.sys, REPOSITORY);
  const roots = [join(REPOSITORY, "src", "config", "index.ts"), join(REPOSITORY, "src", "modules", "declaration.ts")];
  const program = ts.createProgram(roots, {
    ...options,
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    declarationMap: false,
    sourceMap: false,
    rootDir: join(REPOSITORY, "src"),
    outDir: out,
  });
  const result = program.emit();
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  if (errors.length > 0) {
    throw new Error(`declaration emit failed: ${errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, " ")).join("; ")}`);
  }
}

/** A new project directory (see {@link CliProject}). */
export async function cliProject(options: { readonly cli?: boolean } = {}): Promise<CliProject> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-cli-"));
  symlinkSync(join(REPOSITORY, "node_modules"), join(dir, "node_modules"), "dir");
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  await build({
    stdin: { contents: BUILDERS_SOURCE, resolveDir: REPOSITORY, loader: "ts", sourcefile: "builders.ts" },
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node24",
    packages: "external",
    outfile: join(dir, "umbradb.mjs"),
    logLevel: "silent",
  });
  emitDeclarations(join(dir, "types"));
  writeFileSync(
    join(dir, "umbradb.d.mts"),
    'export * from "./types/config/index.js";\nexport { defineModule } from "./types/modules/declaration.js";\n',
  );
  const cli = join(dir, "umbradb-cli.mjs");
  if (options.cli === true) {
    await build({
      entryPoints: [join(REPOSITORY, "src", "cli", "main.ts")],
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node24",
      packages: "external",
      outfile: cli,
      logLevel: "silent",
    });
    await build({
      entryPoints: [join(REPOSITORY, "src", "admin", "worker.ts")],
      bundle: true,
      platform: "node",
      format: "esm",
      target: "node24",
      packages: "external",
      outfile: join(dir, "worker.js"),
      logLevel: "silent",
    });
  }
  return {
    dir,
    builders: join(dir, "umbradb.mjs"),
    cli,
    write(name, text) {
      const file = join(dir, name);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
      return file;
    },
    remove() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

/** What a run of the command gave: its exit code and everything it wrote to each stream. */
export interface CommandResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs the command in this process (`runCommand`), its output captured, in the working directory `cwd`. */
export async function inProcess(
  argv: readonly string[],
  cwd: string,
  commands?: Parameters<typeof runCommand>[2],
): Promise<CommandResult> {
  let stdout = "";
  let stderr = "";
  const io: CommandIo = {
    cwd,
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
  };
  const code = await runCommand(argv, io, commands);
  return { code, stdout, stderr };
}

/**
 * Runs the bundled command with Node.js in a child process — `node <cli> …argv` in `cwd` — and resolves with its exit
 * code and output once it ends; rejects if it runs longer than `timeoutMs`.
 */
export function inChild(
  project: CliProject,
  argv: readonly string[],
  options: { readonly cwd?: string; readonly env?: Readonly<Record<string, string>>; readonly timeoutMs?: number } = {},
): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawnChild(process.execPath, [project.cli, ...argv], {
      cwd: options.cwd ?? project.dir,
      env: { ...process.env, ...options.env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
      stderr += chunk;
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`umbradb ${argv.join(" ")} ran longer than ${options.timeoutMs ?? 60_000} ms:\n${stdout}\n${stderr}`));
    }, options.timeoutMs ?? 60_000);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code: code ?? (signal === null ? -1 : -2), stdout, stderr });
    });
  });
}

/** The `core` settings of a public process that every check accepts, with `database` as given. */
export function coreSettings(database: string, extra: Readonly<Record<string, unknown>> = {}): string {
  const fields = { network: "preprod", node: "ws://127.0.0.1:9944", database, ...extra };
  return JSON.stringify(fields);
}

/** A configuration file's text: the builders imported from `builders`, then `body` (the default export and more). */
export function configText(builders: string, body: readonly string[]): string {
  return [
    `import { coreEntry, defineConfig, defineModule, versionEntry } from ${JSON.stringify(builders)};`,
    "void defineModule;",
    "void versionEntry;",
    ...body,
    "",
  ].join("\n");
}

/** The line (1-based) of the first line of `text` that contains `needle`. */
export function lineOf(text: string, needle: string): number {
  const index = text.split("\n").findIndex((line) => line.includes(needle));
  if (index < 0) throw new Error(`no line contains ${needle}`);
  return index + 1;
}

/** Every file and directory under `dir`, relative to it, with its size (for "nothing was created"). */
export function treeOf(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (at: string) => {
    for (const name of readdirSync(at).sort()) {
      const path = join(at, name);
      const stat = statSync(path);
      out.push(`${relative(dir, path)}${stat.isDirectory() ? "/" : ` ${stat.size}`}`);
      if (stat.isDirectory()) walk(path);
    }
  };
  walk(dir);
  return out;
}
