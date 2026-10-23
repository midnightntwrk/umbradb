import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/**
 * Reading the repository's TypeScript sources for A138's tests over the sources (`boundary.test.ts`,
 * `component-table.test.ts`): parsed with the TypeScript compiler, so imports, declarations, string literals and code
 * are found as the compiler sees them, never by a regular expression over text that may be a comment or a string.
 */

export const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
export const SRC = join(REPOSITORY, "src");
/** The `deterministic_postgresql` component (`design.md` §1, §4; owner decision Q69). */
export const COMPONENT = join(SRC, "deterministic-postgresql");

/** The `.ts` files under `dir`, as absolute paths in sorted order; none when `dir` does not exist. */
export function typeScriptFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return (readdirSync(dir, { recursive: true, encoding: "utf8" }) as string[])
    .filter((path) => path.endsWith(".ts"))
    .map((path) => join(dir, path))
    .sort();
}

/** True when `path` is `dir` or inside it. */
export function isInside(path: string, dir: string): boolean {
  const rel = relative(dir, path);
  return rel === "" || (!rel.startsWith("..") && !rel.startsWith(sep) && !/^[a-zA-Z]:/.test(rel));
}

/** A source file as the compiler parses it. */
export function parseSource(path: string, text: string = readFileSync(path, "utf8")): ts.SourceFile {
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/** Every node of a source file, depth first. */
function eachNode(source: ts.SourceFile, visit: (node: ts.Node) => void): void {
  const walk = (node: ts.Node): void => {
    visit(node);
    ts.forEachChild(node, walk);
  };
  walk(source);
}

function lineOf(source: ts.SourceFile, node: ts.Node): number {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

/** A module a source file names, with how and where; `specifier` is null when it is not a string literal. */
export interface ModuleReference {
  readonly specifier: string | null;
  readonly kind: "import" | "export-from" | "import-equals" | "dynamic-import" | "require" | "import-type";
  readonly line: number;
}

/**
 * Every module a source file names: `import … from`, `export … from`, `import x = require(…)`, `import(…)`,
 * `require(…)`, and `import("…")` in a type. Type-only imports count too: the boundary is the component's whole text.
 */
export function moduleReferences(source: ts.SourceFile): ModuleReference[] {
  const found: ModuleReference[] = [];
  const literal = (node: ts.Node | undefined): string | null =>
    node !== undefined && ts.isStringLiteralLike(node) ? node.text : null;
  eachNode(source, (node) => {
    if (ts.isImportDeclaration(node)) {
      found.push({ specifier: literal(node.moduleSpecifier), kind: "import", line: lineOf(source, node) });
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier !== undefined) {
      found.push({ specifier: literal(node.moduleSpecifier), kind: "export-from", line: lineOf(source, node) });
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const specifier = literal(node.moduleReference.expression);
      found.push({ specifier, kind: "import-equals", line: lineOf(source, node) });
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        found.push({ specifier: literal(node.arguments[0]), kind: "dynamic-import", line: lineOf(source, node) });
      } else if (ts.isIdentifier(node.expression) && node.expression.text === "require") {
        found.push({ specifier: literal(node.arguments[0]), kind: "require", line: lineOf(source, node) });
      }
    } else if (ts.isImportTypeNode(node)) {
      const argument = ts.isLiteralTypeNode(node.argument) ? node.argument.literal : undefined;
      found.push({ specifier: literal(argument), kind: "import-type", line: lineOf(source, node) });
    }
  });
  return found;
}

/** The package's own name: importing it from inside the package reaches `src/` through its exports. */
const PACKAGE_NAME = (JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as { name: string }).name;

/**
 * Where a specifier leads: a file for a relative or absolute specifier (the `.js` an import names is the `.ts` it is
 * compiled from), the package itself for its own name, another package (or a Node.js built-in) otherwise.
 */
export function resolveSpecifier(
  fromFile: string,
  specifier: string,
): { readonly kind: "file"; readonly path: string } | { readonly kind: "self" } | { readonly kind: "package" } {
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("file:")) {
    const path = specifier.startsWith("file:") ? fileURLToPath(specifier) : resolve(dirname(fromFile), specifier);
    return { kind: "file", path: path.replace(/\.(m|c)?js$/, ".$1ts") };
  }
  if (specifier === PACKAGE_NAME || specifier.startsWith(`${PACKAGE_NAME}/`)) return { kind: "self" };
  return { kind: "package" };
}

/**
 * A138's boundary for one file of the component: every module it names that leads into `src/` outside the component
 * (or into the package itself, whose exports are `src/`), and every module named by something other than a string, which
 * cannot be checked. Empty when the file keeps the boundary.
 */
export function boundaryViolations(file: string, source: ts.SourceFile = parseSource(file)): string[] {
  const where = relative(REPOSITORY, file);
  const out: string[] = [];
  for (const reference of moduleReferences(source)) {
    if (reference.specifier === null) {
      out.push(`${where}:${reference.line}: ${reference.kind} of a module that is not named by a string`);
      continue;
    }
    const target = resolveSpecifier(file, reference.specifier);
    if (target.kind === "self") {
      out.push(`${where}:${reference.line}: ${reference.kind} "${reference.specifier}" (the package itself, src/)`);
    } else if (target.kind === "file" && isInside(target.path, SRC) && !isInside(target.path, COMPONENT)) {
      out.push(`${where}:${reference.line}: ${reference.kind} "${reference.specifier}" (${relative(REPOSITORY, target.path)})`);
    } else if (target.kind === "file" && isInside(target.path, COMPONENT) && !existsSync(target.path)) {
      out.push(`${where}:${reference.line}: ${reference.kind} "${reference.specifier}" names no file of the component`);
    }
  }
  return out;
}

/**
 * The functions a source file calls: the callee's name for a plain call (`startPostgres(…)`), and the method's name
 * for a method call (`backend.start()` → `start`).
 */
export function calledNames(source: ts.SourceFile): Set<string> {
  const names = new Set<string>();
  eachNode(source, (node) => {
    if (!ts.isCallExpression(node)) return;
    if (ts.isIdentifier(node.expression)) names.add(node.expression.text);
    else if (ts.isPropertyAccessExpression(node.expression)) names.add(node.expression.name.text);
  });
  return names;
}

/** The names a source file declares, at any depth, with their lines: variables, functions, classes, types, enums. */
export function declaredNames(source: ts.SourceFile): Map<string, number> {
  const names = new Map<string, number>();
  const add = (name: ts.Node | undefined): void => {
    if (name === undefined) return;
    if (ts.isIdentifier(name)) {
      if (!names.has(name.text)) names.set(name.text, lineOf(source, name));
    } else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      for (const element of name.elements) if (ts.isBindingElement(element)) add(element.name);
    }
  };
  eachNode(source, (node) => {
    if (
      ts.isVariableDeclaration(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isModuleDeclaration(node)
    ) {
      add(node.name);
    }
  });
  return names;
}

/** The names a source file exports by declaring them (`export const X`, `export function X`, …); not re-exports. */
export function exportedDeclarations(source: ts.SourceFile): string[] {
  const names: string[] = [];
  for (const statement of source.statements) {
    const exported = ts.canHaveModifiers(statement)
      ? (ts.getModifiers(statement) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      : false;
    if (!exported) continue;
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name !== undefined
    ) {
      names.push(statement.name.text);
    }
  }
  return names;
}

/** The text of every string literal of a source file, the literal parts of template literals included, with its line. */
export function stringLiterals(source: ts.SourceFile): { readonly text: string; readonly line: number }[] {
  const found: { text: string; line: number }[] = [];
  eachNode(source, (node) => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      found.push({ text: node.text, line: lineOf(source, node) });
    }
  });
  return found;
}

const PRINTER = ts.createPrinter({ removeComments: true });

/** A node as the compiler prints it without comments, its white space collapsed. */
function printed(node: ts.Node, source: ts.SourceFile): string {
  return PRINTER.printNode(ts.EmitHint.Unspecified, node, source).replace(/\s+/g, " ").trim();
}

/**
 * The code a source file defines, as fingerprints: for every function, method and arrow function, its parameters,
 * return type and body; for every variable with an initial value that is no function, that value — each printed by the
 * compiler without comments, at any depth, whatever the name it is given. Two files holding the same function or the
 * same table of values under different names share a fingerprint; a line two different functions happen to share does
 * not. Fingerprints shorter than `minimum` characters (an identity function, a small constant) are left out.
 */
export function codeFingerprints(source: ts.SourceFile, minimum: number): Map<string, number> {
  const found = new Map<string, number>();
  const add = (fingerprint: string, node: ts.Node): void => {
    if (fingerprint.length >= minimum && !found.has(fingerprint)) found.set(fingerprint, lineOf(source, node));
  };
  eachNode(source, (node) => {
    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)) &&
      node.body !== undefined
    ) {
      const parameters = node.parameters.map((parameter) => printed(parameter, source)).join(", ");
      const type = node.type === undefined ? "" : `: ${printed(node.type, source)}`;
      add(`(${parameters})${type} ${printed(node.body, source)}`, node);
    } else if (
      ts.isVariableDeclaration(node) &&
      node.initializer !== undefined &&
      !ts.isArrowFunction(node.initializer) &&
      !ts.isFunctionExpression(node.initializer)
    ) {
      add(printed(node.initializer, source), node);
    }
  });
  return found;
}

/** A literal's text when `node` is a string, a template without substitutions or a number; else null. */
function literalText(node: ts.Node | undefined): string | null {
  if (node === undefined) return null;
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) return node.text;
  return null;
}

/** A property's name as text: an identifier, a string or a number; else null. */
function propertyNameText(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return null;
}

/**
 * Every place a source file writes one of `settings` with its value: a two-element array `["name", "value"]`, a
 * property `name: "value"`, or a string holding `name = value`, `name=value` or `name TO value` (as SQL `SET` or a
 * `-c` start parameter writes it), names compared without case. A name alone (a URL check listing names it refuses) is
 * not a setting written.
 */
export function settingsWritten(
  source: ts.SourceFile,
  settings: readonly (readonly [string, string])[],
): { readonly setting: string; readonly line: number }[] {
  const found: { setting: string; line: number }[] = [];
  const pinned = (name: string | null, value: string | null): string | undefined => {
    if (name === null || value === null) return undefined;
    const setting = settings.find(([n, v]) => n.toLowerCase() === name.toLowerCase() && v === value);
    return setting === undefined ? undefined : `${setting[0]} = ${setting[1]}`;
  };
  const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  eachNode(source, (node) => {
    let setting: string | undefined;
    if (ts.isArrayLiteralExpression(node) && node.elements.length === 2) {
      setting = pinned(literalText(node.elements[0]), literalText(node.elements[1]));
    } else if (ts.isPropertyAssignment(node)) {
      setting = pinned(propertyNameText(node.name), literalText(node.initializer));
    } else if (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const text = node.text;
      const match = settings.find(([name, value]) =>
        new RegExp(`(^|[^a-z_])${escape(name)}\\s*(=|\\sTO\\s)\\s*'?${escape(value)}'?`, "i").test(text),
      );
      if (match !== undefined) setting = `${match[0]} = ${match[1]}`;
    }
    if (setting !== undefined) found.push({ setting, line: lineOf(source, node) });
  });
  return found;
}
