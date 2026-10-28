import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { REPOSITORY } from "../config/config-fixtures.js";
import { spawnChild } from "../child-processes.js";

/**
 * The checks of the module guide's example (task 17.3a; owner decisions Q160 A, Q161 A): `examples/stats-module/`
 * type-checked against `src/index.ts`, its configuration file checked by `umbradb config check` as an installed project
 * runs it, and the documents' code blocks held to the package's surface and to the example's files.
 */

export { REPOSITORY };

/** The example's directory. */
export const EXAMPLE = join(REPOSITORY, "examples", "stats-module");

/** What a child process gave: its exit code and its output. */
export interface ChildResult {
  readonly code: number;
  readonly output: string;
}

/** Runs `node …args` in `cwd` and resolves once it ends (killed after `timeoutMs`). */
export function runNode(args: readonly string[], cwd: string, timeoutMs = 120_000): Promise<ChildResult> {
  return new Promise((resolve, reject) => {
    const child = spawnChild(process.execPath, [...args], { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
      output += chunk;
    });
    child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
      output += chunk;
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`node ${args.join(" ")} ran longer than ${timeoutMs} ms:\n${output}`));
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code: code ?? (signal === null ? -1 : -2), output });
    });
  });
}

/** The TypeScript compiler's command line, run with Node.js. */
const TSC = join(REPOSITORY, "node_modules", "typescript", "bin", "tsc");

/** `tsc -p <project>`: the example's own `tsconfig.json`, or a copy's that extends it. */
export function typeCheck(project: string): Promise<ChildResult> {
  return runNode([TSC, "-p", project], REPOSITORY);
}

/**
 * A project laid out as an operator's that installed the package: `package.json` (`"type": "module"`), and a
 * `node_modules` whose `umbradb` is the package built from the sources — `package.json`'s own `name`, `type`,
 * `exports` and `bin`, and `dist/` written by the TypeScript compiler from `tsconfig.build.json`, as `npm run build`
 * writes it — beside links to the repository's installed packages (`zod`, `typescript`, PGlite, `@types/node`).
 */
export interface InstalledProject {
  readonly dir: string;
  /** The package's command, `node_modules/umbradb/dist/cli/main.js`. */
  readonly command: string;
  /** Copies `files` (names in {@link EXAMPLE}) into the project, then applies `edit` to each text. */
  copyExample(files: readonly string[], edit?: (file: string, text: string) => string): void;
  remove(): void;
}

/** Builds an {@link InstalledProject} (see there). */
export async function installedProject(): Promise<InstalledProject> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-example-"));
  writeFileSync(join(dir, "package.json"), '{ "type": "module" }\n');
  const modules = join(dir, "node_modules");
  mkdirSync(modules);
  for (const entry of readdirSync(join(REPOSITORY, "node_modules"))) {
    if (entry === ".bin" || entry.startsWith(".") || entry === "umbradb") continue;
    symlinkSync(join(REPOSITORY, "node_modules", entry), join(modules, entry), "dir");
  }
  const own = JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as Record<string, unknown>;
  const umbradb = join(modules, "umbradb");
  mkdirSync(umbradb);
  const fields = ["name", "version", "type", "main", "types", "exports", "bin"];
  writeFileSync(join(umbradb, "package.json"), `${JSON.stringify(Object.fromEntries(fields.map((f) => [f, own[f]])), null, 2)}\n`);
  const built = await runNode(
    [TSC, "-p", "tsconfig.build.json", "--outDir", join(umbradb, "dist"), "--declarationMap", "false", "--sourceMap", "false"],
    REPOSITORY,
    300_000,
  );
  if (built.code !== 0) throw new Error(`the package's build failed:\n${built.output}`);
  return {
    dir,
    command: join(umbradb, "dist", "cli", "main.js"),
    copyExample(files, edit = (_file, text) => text) {
      for (const file of files) writeFileSync(join(dir, file), edit(file, readFileSync(join(EXAMPLE, file), "utf8")));
    },
    remove() {
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

/** A copy of the example in a new directory, with a `tsconfig.json` that extends the example's; `edit` changes a text. */
export function exampleCopy(edit: (file: string, text: string) => string): { readonly dir: string; remove(): void } {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-example-copy-"));
  cpSync(EXAMPLE, dir, { recursive: true, filter: (source) => !source.includes(`${join(EXAMPLE, "data")}`) });
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".ts"))) {
    writeFileSync(join(dir, file), edit(file, readFileSync(join(dir, file), "utf8")));
  }
  writeFileSync(join(dir, "tsconfig.json"), JSON.stringify({ extends: join(EXAMPLE, "tsconfig.json"), include: ["*.ts"] }));
  return { dir, remove: () => rmSync(dir, { recursive: true, force: true }) };
}

/** A fenced code block of a Markdown text: its language, its first line's number (1-based) and its text. */
export interface CodeBlock {
  readonly language: string;
  readonly line: number;
  readonly text: string;
}

/** The fenced code blocks of `markdown`, in order. */
export function codeBlocks(markdown: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  let open: { language: string; line: number; fence: string; lines: string[] } | null = null;
  markdown.split("\n").forEach((raw, index) => {
    const fence = /^\s*(`{3,})(\S*)\s*$/.exec(raw);
    if (open === null) {
      if (fence !== null) open = { language: fence[2] ?? "", line: index + 2, fence: fence[1] as string, lines: [] };
      return;
    }
    if (fence !== null && fence[1] === open.fence && fence[2] === "") {
      blocks.push({ language: open.language, line: open.line, text: open.lines.join("\n") });
      open = null;
      return;
    }
    open.lines.push(raw);
  });
  return blocks;
}

/** The section of `markdown` under the `## ` heading that starts with `heading`, up to the next `## ` heading. */
export function section(markdown: string, heading: string): string {
  const start = markdown.indexOf(`\n## ${heading}`);
  if (start === -1) return "";
  const end = markdown.indexOf("\n## ", start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
}

/** One import of a code block: where from, and the names it takes (`type` removed). */
export interface BlockImport {
  readonly from: string;
  readonly names: readonly string[];
}

/** The `import … from "…"` statements of a TypeScript code block. */
export function importsOf(text: string): BlockImport[] {
  return [...text.matchAll(/import\s+(type\s+)?([^;]*?)\s+from\s+"([^"]+)"/g)].map((match) => {
    const clause = match[2] as string;
    const named = /\{([^}]*)\}/.exec(clause)?.[1] ?? "";
    const names = named
      .split(",")
      .map((name) => name.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0] as string)
      .filter((name) => name.length > 0);
    return { from: match[3] as string, names };
  });
}

/** The modules a document's code may import from: the package, zod, Node.js's own, and the example's local file. */
export function allowedSource(from: string): boolean {
  return from === "umbradb" || from === "zod" || from.startsWith("node:") || from === "./stats-module.ts";
}

/** The names `src/index.ts` exports (values and types), read with the TypeScript compiler. */
export function surfaceNames(): Set<string> {
  const index = join(REPOSITORY, "src", "index.ts");
  const program = ts.createProgram([index], { module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, noEmit: true });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(index);
  const symbol = source === undefined ? undefined : checker.getSymbolAtLocation(source);
  return new Set(symbol === undefined ? [] : checker.getExportsOfModule(symbol).map((s) => s.name));
}

/**
 * Problems of the documents' code blocks: an import from a module {@link allowedSource} does not allow, or a name the
 * package's surface (`names`) lacks. Each names the document and the block's line.
 */
export function importProblems(documents: readonly { readonly file: string; readonly text: string }[], names: Set<string>): string[] {
  const problems: string[] = [];
  for (const { file, text } of documents) {
    for (const block of codeBlocks(text).filter(({ language }) => language === "ts")) {
      for (const { from, names: taken } of importsOf(block.text)) {
        if (!allowedSource(from)) problems.push(`${file}:${block.line}: imports from ${from}`);
        if (from === "umbradb") {
          for (const name of taken.filter((n) => !names.has(n))) {
            problems.push(`${file}:${block.line}: imports ${name}, which src/index.ts does not export`);
          }
        }
      }
    }
  }
  return problems;
}

/**
 * The lines of `blocks` that `files` do not hold: each block line, trimmed, must be a trimmed line of one of the files,
 * except blank lines and placeholders (`/* §… *\/`), so the guide's excerpts stay the example's code.
 */
export function linesMissing(blocks: readonly CodeBlock[], files: readonly string[]): string[] {
  const lines = new Set(files.flatMap((text) => text.split("\n").map((line) => line.trim())));
  return blocks.flatMap((block) =>
    block.text
      .split("\n")
      .map((line, offset) => ({ line: line.trim(), at: block.line + offset }))
      .filter(({ line }) => line.length > 0 && !line.includes("/* §") && !lines.has(line))
      .map(({ line, at }) => `line ${at}: ${line}`),
  );
}
