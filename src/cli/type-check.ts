/**
 * The type check of `umbradb config check` (`openspec/changes/core-arch/specs/configuration/spec.md` CF-10, `design.md`
 * §7; decision record Q44): the configuration file and every local TypeScript file it imports are checked by the
 * TypeScript compiler with `noEmit` — the compiler the package depends on (`typescript`, a runtime dependency, loaded
 * only when a file is checked) — and each diagnostic is a finding at `file:line:column`.
 *
 * **The compiler options** ({@link configCompilerOptions}) are fixed, not the operator's `tsconfig.json`, and say how
 * the process loads the file (CF-1): Node.js ≥ 24 imports it as an ES module through its type stripping, so the
 * options are those of a Node.js module (`module` and `moduleResolution` `NodeNext`, `allowImportingTsExtensions`, as
 * Node.js runs `import "./x.ts"`), `erasableSyntaxOnly` (the compiler refuses an `enum`, a `namespace` or a parameter
 * property, which type stripping cannot erase), `verbatimModuleSyntax` (an import used only as a type must say
 * `import type`, since type stripping removes only those), `strict`, and `skipLibCheck` (a package's declaration files
 * are its own). The types in scope are what the file's directory sees, as for `tsc` run there: the program's current
 * directory is the file's, so `node_modules/@types` (for `process.env`, `@types/node`) is looked up from it.
 *
 * **ES module or CommonJS.** The compiler decides a `.ts` file's format from the nearest `package.json`: `"type":
 * "module"` an ES module, otherwise CommonJS. Node.js does the same for `"module"` and `"commonjs"`, but where the
 * nearest `package.json` has no `type` (or there is none) it detects the format from the syntax, and a configuration —
 * which has `export default` — loads as an ES module. So such a file, outside `node_modules`, is given to the compiler
 * as an ES module; without that the compiler would refuse its imports (TS1295, TS1479) though the process loads it.
 *
 * Diagnostics of files from packages (`node_modules`) are left out; every other file's are findings — a local
 * declaration file's syntax too, its types being unchecked (`skipLibCheck`) —, in the compiler's order (by file, then
 * position), with the global ones — of no file, such as a broken `@types` package in scope — first, at `(compiler)`.
 */

import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import type * as TypeScript from "typescript";

type Ts = typeof TypeScript;

/** One diagnostic: where (`file:line:column`, 1-based; `(compiler)` for one of no file), its code and its text. */
export interface TypeCheckFinding {
  readonly path: string;
  /** `TS` and the diagnostic's number: `TS2322`. */
  readonly code: string;
  /** The diagnostic's text, on one line (the report puts the path before it). */
  readonly message: string;
}

/** What the type check found, with the compiler's version. */
export interface TypeCheckResult {
  readonly version: string;
  readonly findings: readonly TypeCheckFinding[];
}

/** The compiler options a configuration file is checked with (see the module comment). */
export function configCompilerOptions(ts: Ts): TypeScript.CompilerOptions {
  return {
    noEmit: true,
    strict: true,
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    allowImportingTsExtensions: true,
    erasableSyntaxOnly: true,
    verbatimModuleSyntax: true,
    skipLibCheck: true,
  };
}

/** True when a regular file is at `file`. */
export function isRegularFile(file: string): boolean {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

/** The `type` of the nearest `package.json` above `directory` ("module", "commonjs", …), or null when none says one. */
function packageType(directory: string, cache: Map<string, string | null>): string | null {
  const cached = cache.get(directory);
  if (cached !== undefined) return cached;
  const file = join(directory, "package.json");
  let type: string | null;
  if (isRegularFile(file)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      parsed = null;
    }
    const declared = (parsed as { type?: unknown } | null)?.type;
    type = typeof declared === "string" ? declared : null;
  } else {
    const parent = dirname(directory);
    type = parent === directory ? null : packageType(parent, cache);
  }
  cache.set(directory, type);
  return type;
}

/**
 * Whether Node.js loads `fileName` as an ES module where the compiler reads it as CommonJS (see the module comment).
 * Files under `node_modules` are no exception: Node.js strips no types there, so whatever the compiler reads them as,
 * the loader refuses such a file (CF-1's `load-failed`).
 */
function detectedAsModule(fileName: string, cache: Map<string, string | null>): boolean {
  if (!fileName.endsWith(".ts") || fileName.endsWith(".d.ts")) return false;
  const type = packageType(dirname(fileName), cache);
  return type !== "module" && type !== "commonjs";
}

/** Type-checks `file` (an absolute path to a regular file) with {@link configCompilerOptions}. */
export async function typeCheckFile(file: string): Promise<TypeCheckResult> {
  const ts = (await import("typescript")).default as Ts;
  const options = configCompilerOptions(ts);
  const host = ts.createCompilerHost(options);
  const directory = dirname(file);
  host.getCurrentDirectory = () => directory;
  const cache = new Map<string, string | null>();
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersionOrOptions, ...rest) => {
    if (!detectedAsModule(fileName, cache)) return getSourceFile(fileName, languageVersionOrOptions, ...rest);
    // The program gives its options as an object (TypeScript ≥ 4.7): its language version, format and module indicator.
    const given = languageVersionOrOptions as TypeScript.CreateSourceFileOptions;
    return getSourceFile(fileName, { ...given, impliedNodeFormat: ts.ModuleKind.ESNext }, ...rest);
  };
  const program = ts.createProgram({ rootNames: [file], options, host });
  const findings = ts
    .getPreEmitDiagnostics(program)
    .filter(({ file: source }) => source === undefined || !program.isSourceFileFromExternalLibrary(source))
    .map((diagnostic): TypeCheckFinding => {
      const source = diagnostic.file;
      let path = "(compiler)";
      if (source !== undefined) {
        // A diagnostic of a file has a position in it.
        const { line, character } = source.getLineAndCharacterOfPosition(diagnostic.start as number);
        path = `${source.fileName}:${line + 1}:${character + 1}`;
      }
      const text = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
      return Object.freeze({ path, code: `TS${diagnostic.code}`, message: text });
    });
  return Object.freeze({ version: ts.version, findings: Object.freeze(findings) });
}
