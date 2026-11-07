import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/**
 * The resolver's boundary, as the TypeScript checker sees the repository's sources: every reference to a function that
 * only the resolver (`src/runner/resolve.ts`) may call, or that only the engine (`src/runner/process.ts`) may call,
 * made from any other module. A reference is an identifier — a call, a callee passed as a value, a property of a
 * namespace import, an element access by its name — that resolves, through every import alias and re-export, to the
 * guarded declaration; a renamed import is found by what it resolves to, not by its name, and a comment or a string is
 * never one. Import and export specifiers, type positions (`typeof f`) and the declaration's own name are not calls.
 * [L56 STATIC, LM-1]
 *
 * The sources are what `tsconfig.json` compiles, the tests (`test/`) and the Vitest configurations excepted: `src/`,
 * `browser/`, `bench/` and `tools/`. The tests are left out because they test these functions themselves.
 */

export const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** Who may call a guarded function: the module that is the only caller outside the tests. */
export interface Guard {
  /** The function's name, as its declaration names it. */
  readonly name: string;
  /** The one module that may reference it, relative to the repository. */
  readonly caller: string;
}

/** L56: the resolver's own steps, and the engine's network planner. [L56, LM-1] */
export const GUARDS: readonly Guard[] = Object.freeze([
  { name: "commandBuild", caller: "src/runner/resolve.ts" },
  { name: "buildDeclarations", caller: "src/runner/resolve.ts" },
  { name: "inferSide", caller: "src/runner/resolve.ts" },
  { name: "validateConfig", caller: "src/runner/resolve.ts" },
  { name: "processCoreEntry", caller: "src/runner/resolve.ts" },
  { name: "planNetwork", caller: "src/runner/process.ts" },
]);

/** One reference outside its caller: `file:line: name`. */
export type Crossing = string;

/** The repository-relative path of `file`, with `/` separators. */
const inRepository = (file: string): string => relative(REPOSITORY, file).split(sep).join("/");

/** The sources the check reads: `tsconfig.json`'s files, without the tests and the Vitest configurations. */
export function boundarySources(): { readonly files: readonly string[]; readonly options: ts.CompilerOptions } {
  const path = join(REPOSITORY, "tsconfig.json");
  const read = ts.readConfigFile(path, (file) => readFileSync(file, "utf8"));
  if (read.error !== undefined) throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, REPOSITORY);
  const files = parsed.fileNames.filter((file) => {
    const at = inRepository(file);
    return !at.startsWith("test/") && !at.startsWith("vitest.");
  });
  return { files, options: { ...parsed.options, noEmit: true } };
}

/** Whether `node` is inside a type (a type annotation, `typeof f` in a type): not a call. */
function inType(node: ts.Node): boolean {
  for (let at: ts.Node | undefined = node.parent; at !== undefined; at = at.parent) {
    if (ts.isTypeNode(at)) return true;
    if (ts.isStatement(at) || ts.isSourceFile(at)) return false;
  }
  return false;
}

/** Whether `node` names something in an import or export clause, or is the name a declaration declares. */
function notAReference(node: ts.Node): boolean {
  const parent = node.parent;
  if (parent === undefined) return true;
  if (ts.isImportSpecifier(parent) || ts.isExportSpecifier(parent) || ts.isImportClause(parent)) return true;
  if (ts.isNamespaceImport(parent) || ts.isImportEqualsDeclaration(parent)) return true;
  if ((ts.isFunctionDeclaration(parent) || ts.isVariableDeclaration(parent)) && parent.name === node) return true;
  return false;
}

/**
 * The declarations `GUARDS` name, as function declarations of the sources: the guarded symbol of each, with its
 * caller. A guard whose function no source declares (removed, or not written yet) guards nothing.
 */
function guardedSymbols(program: ts.Program, checker: ts.TypeChecker, sources: ReadonlySet<string>): Map<ts.Symbol, Guard> {
  const byName = new Map(GUARDS.map((guard) => [guard.name, guard]));
  const found = new Map<ts.Symbol, Guard>();
  for (const source of program.getSourceFiles()) {
    if (!sources.has(source.fileName)) continue;
    for (const statement of source.statements) {
      const names = ts.isFunctionDeclaration(statement)
        ? [statement.name]
        : ts.isVariableStatement(statement)
          ? statement.declarationList.declarations.map((declaration) => declaration.name)
          : [];
      for (const name of names) {
        if (name === undefined || !ts.isIdentifier(name)) continue;
        const guard = byName.get(name.text);
        const symbol = checker.getSymbolAtLocation(name);
        if (guard !== undefined && symbol !== undefined) found.set(checker.getExportSymbolOfSymbol(symbol), guard);
      }
    }
  }
  return found;
}

/** The symbol `node` refers to, followed through import aliases and re-exports (a shorthand property: its value). */
function targetOf(checker: ts.TypeChecker, node: ts.Node): ts.Symbol | undefined {
  const parent = node.parent;
  let symbol =
    parent !== undefined && ts.isShorthandPropertyAssignment(parent) && parent.name === node
      ? checker.getShorthandAssignmentValueSymbol(parent)
      : checker.getSymbolAtLocation(node);
  for (let depth = 0; symbol !== undefined && symbol.flags & ts.SymbolFlags.Alias && depth < 16; depth++) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  return symbol === undefined ? undefined : checker.getExportSymbolOfSymbol(symbol);
}

/** What the check found: the guarded functions the sources declare, and every reference outside its caller. */
export interface Boundary {
  /** The names of the guarded functions found declared, sorted (a guard none declares is not among them). */
  readonly guarded: readonly string[];
  /** Every reference outside its caller, as `file:line: name`, in file and line order. */
  readonly crossings: readonly Crossing[];
}

/**
 * The boundary of `files` (absolute paths; see the module comment). `host` reads the sources (a fixture's copy of one
 * file for the negative control); the files on disk unless given. [L56 STATIC]
 */
export function boundaryOf(
  files: readonly string[],
  options: ts.CompilerOptions,
  host: ts.CompilerHost = ts.createCompilerHost(options, true),
): Boundary {
  const program = ts.createProgram({ rootNames: [...files], options, host });
  const checker = program.getTypeChecker();
  const sources = new Set(files);
  const guarded = guardedSymbols(program, checker, sources);
  const crossings: Crossing[] = [];
  for (const source of program.getSourceFiles()) {
    if (!sources.has(source.fileName)) continue;
    const file = inRepository(source.fileName);
    const visit = (node: ts.Node): void => {
      const named =
        ts.isIdentifier(node) ||
        (ts.isStringLiteralLike(node) && node.parent !== undefined && ts.isElementAccessExpression(node.parent));
      if (named && !notAReference(node) && !inType(node)) {
        const symbol = targetOf(checker, node);
        const guard = symbol === undefined ? undefined : guarded.get(symbol);
        if (guard !== undefined && guard.caller !== file) {
          const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
          crossings.push(`${file}:${line}: ${guard.name}`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  const names = [...new Set([...guarded.values()].map((guard) => guard.name))].sort();
  return { guarded: names, crossings };
}

/**
 * A compiler host reading every file from disk, except `file` (absolute), whose text is `text`: the fixture copy the
 * negative control changes, the repository itself left as it is.
 */
export function hostWith(options: ts.CompilerOptions, file: string, text: string): ts.CompilerHost {
  const host = ts.createCompilerHost(options, true);
  const getSourceFile = host.getSourceFile.bind(host);
  return {
    ...host,
    getSourceFile: (name, language, onError, create) =>
      name === file ? ts.createSourceFile(name, text, language, true) : getSourceFile(name, language, onError, create),
    readFile: (name) => (name === file ? text : host.readFile(name)),
  };
}
