import { sep } from "node:path";
import ts from "typescript";
import { REPOSITORY } from "./resolver-boundary.js";

/**
 * The `process`-access check, as the TypeScript checker sees the sources under `src/`: a library process reads the
 * global `process` only where the lets it, so that a host program's own process is left as it is. It
 * reports, outside `src/cli/` (the command's, which owns the program) and `src/library/start-umbradb.ts` (the Node
 * entry, which reads `process.cwd()` for the `cwd` default):
 * - an identifier `process` that resolves to the global `process` — a local binding of that name (a parameter, a
 *   variable) is not it — unless it is the object of an allowed property read ({@link ALLOWED});
 * - `globalThis.process`, `global.process`, `globalThis["process"]`, and the same through parentheses, `as`, `!` or a
 *   type assertion (`(globalThis as T).process`);
 * - a call of Node.js's `path.resolve` with one argument, or with a spread, however it is imported (`resolve(x)`,
 *   `path.resolve(x)`, a renamed import): with one relative path it reads the working directory.
 *
 * Comments and strings are never one; a type position (`typeof process`) is not a read.
 */

/** A property of the global `process` a file may read: the heartbeat's and admin's clock, the backup's. */
export interface AllowedRead {
  /** The file, relative to the repository. */
  readonly file: string;
  /** The property of `process` it reads. */
  readonly property: string;
}

/** The reads, besides the Node entry's `cwd()` (whose file is not checked). */
export const ALLOWED: readonly AllowedRead[] = Object.freeze([
  // The heartbeat's monotonic clock, on the main thread and in the admin worker.
  { file: "src/runner/heartbeat.ts", property: "hrtime" },
  { file: "src/admin/process-admin.ts", property: "hrtime" },
  { file: "src/admin/serve.ts", property: "hrtime" },
  // A backup's temporary file name and `pg_dump`'s environment, inside `backup()`.
  { file: "src/backup/backup.ts", property: "pid" },
  { file: "src/backup/backup.ts", property: "env" },
  // The `node:sqlite` import's wrapper, which drops its ExperimentalWarning.
  { file: "src/db/pglite-lock.ts", property: "emitWarning" },
]);

/** Whether `file` (relative to the repository) is one the check reads: under `src/`, not the command's or the entry. */
export function checked(file: string): boolean {
  return file.startsWith("src/") && !file.startsWith("src/cli/") && file !== "src/library/start-umbradb.ts";
}

/** The repository-relative path of `file`, with `/` separators. */
const inRepository = (file: string): string => file.slice(REPOSITORY.length).split(sep).join("/");

/**
 * Whether `symbol` is a global: declared only in declaration files (Node.js's types, the standard library's), or not
 * declared at all (`globalThis` itself). A binding of the sources is declared in them.
 */
function isGlobal(symbol: ts.Symbol | undefined): boolean {
  return (symbol?.declarations ?? []).every((declaration) => declaration.getSourceFile().isDeclarationFile);
}

/** `node` without the parentheses, `as`, `satisfies`, `!` and type assertions around it. */
function bare(node: ts.Expression): ts.Expression {
  let at = node;
  for (;;) {
    if (ts.isParenthesizedExpression(at) || ts.isAsExpression(at) || ts.isNonNullExpression(at)) at = at.expression;
    else if (ts.isTypeAssertionExpression(at) || ts.isSatisfiesExpression(at)) at = at.expression;
    else return at;
  }
}

/** Whether `node` is inside a type: not a read. */
function inType(node: ts.Node): boolean {
  for (let at: ts.Node | undefined = node.parent; at !== undefined; at = at.parent) {
    if (ts.isTypeNode(at)) return true;
    if (ts.isStatement(at) || ts.isSourceFile(at)) return false;
  }
  return false;
}

/** Whether the identifier `node` names a declaration or an import/export rather than reading a value. */
function declares(node: ts.Identifier): boolean {
  const parent = node.parent;
  if (parent === undefined) return true;
  if (ts.isImportSpecifier(parent) || ts.isExportSpecifier(parent) || ts.isImportClause(parent)) return true;
  if (ts.isPropertyAccessExpression(parent) && parent.name === node) return true;
  if ((ts.isPropertyAssignment(parent) || ts.isPropertyDeclaration(parent) || ts.isMethodDeclaration(parent)) && parent.name === node) {
    return true;
  }
  if (ts.isPropertySignature(parent) || ts.isParameter(parent) || ts.isVariableDeclaration(parent)) return parent.name === node;
  if (ts.isBindingElement(parent)) return parent.name === node || parent.propertyName === node;
  return false;
}

/** Whether the call `node` calls Node.js's `path.resolve`. */
function callsPathResolve(checker: ts.TypeChecker, node: ts.CallExpression): boolean {
  const callee = bare(node.expression);
  const name = ts.isIdentifier(callee) ? callee : ts.isPropertyAccessExpression(callee) ? callee.name : undefined;
  if (name === undefined) return false;
  let symbol = checker.getSymbolAtLocation(name);
  for (let depth = 0; symbol !== undefined && symbol.flags & ts.SymbolFlags.Alias && depth < 16; depth++) {
    symbol = checker.getAliasedSymbol(symbol);
  }
  if (symbol?.name !== "resolve") return false;
  return (symbol.declarations ?? []).some((declaration) => {
    const file = declaration.getSourceFile().fileName.split(sep).join("/");
    return file.includes("/@types/node/") && /\/path(\.d\.ts|\/)/.test(file.slice(file.indexOf("/@types/node/")));
  });
}

/** One access the check reports: `file:line: what`. */
export type Access = string;

/**
 * Every access of `files` the check reports (see the module comment), in file and line order. `host` reads the sources
 * (a fixture's copy of one file for the negative control); the files on disk unless given.
 */
export function processAccesses(
  files: readonly string[],
  options: ts.CompilerOptions,
  host: ts.CompilerHost = ts.createCompilerHost(options, true),
): Access[] {
  const program = ts.createProgram({ rootNames: [...files], options, host });
  const checker = program.getTypeChecker();
  const sources = new Set(files);
  const found: Access[] = [];
  for (const source of program.getSourceFiles()) {
    if (!sources.has(source.fileName)) continue;
    const file = inRepository(source.fileName);
    if (!checked(file)) continue;
    const at = (node: ts.Node, what: string): void => {
      found.push(`${file}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: ${what}`);
    };
    const allowed = (property: string): boolean => ALLOWED.some((read) => read.file === file && read.property === property);
    const visit = (node: ts.Node): void => {
      if (ts.isIdentifier(node) && node.text === "process" && !declares(node) && !inType(node)) {
        const shorthand = node.parent !== undefined && ts.isShorthandPropertyAssignment(node.parent);
        const symbol = shorthand
          ? checker.getShorthandAssignmentValueSymbol(node.parent)
          : checker.getSymbolAtLocation(node);
        if (isGlobal(symbol)) {
          const parent = node.parent;
          const property = ts.isPropertyAccessExpression(parent) && parent.expression === node ? parent.name.text : null;
          if (property === null || !allowed(property)) at(node, property === null ? "process" : `process.${property}`);
        }
      }
      if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
        const name = ts.isPropertyAccessExpression(node)
          ? node.name.text
          : ts.isStringLiteralLike(node.argumentExpression)
            ? node.argumentExpression.text
            : null;
        const object = bare(node.expression);
        if (name === "process" && ts.isIdentifier(object) && (object.text === "globalThis" || object.text === "global")) {
          if (isGlobal(checker.getSymbolAtLocation(object))) at(node, `${object.text}.process`);
        }
      }
      if (ts.isCallExpression(node) && callsPathResolve(checker, node)) {
        const spread = node.arguments.some((argument) => ts.isSpreadElement(argument));
        if (node.arguments.length === 1 || spread) at(node, spread ? "path.resolve(...spread)" : "path.resolve(1 argument)");
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  return found;
}
