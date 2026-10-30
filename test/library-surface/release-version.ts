/**
 * The release's version, its breaking-change line, and the build's version named in one place. [A4, LS-4, Q169]
 *
 * - **The version.** `package.json`'s `version` is `0.10.0`; the code names it once, as `UMBRADB_VERSION` in
 *   `src/config/build.ts` (a constant: the browser build reads no file; `test/config/builders.test.ts` holds it equal
 *   to `package.json`, `test/api-surface/package-json-strict.test.ts` the lock's own entry and the changelog's
 *   newest dated heading). No other file of `src/` writes that version as a string ({@link versionLiteralProblems}).
 * - **Every backbone part and core module declares the build's version**: the `version` of each declaration in `src/`
 *   is the binding `UMBRADB_VERSION` imported from `src/config/build.ts` — never a literal, another name, or a local
 *   constant of that name ({@link declarationProblems}). A declaration is an object literal with its own `side:
 *   "public"` or `side: "private"` (a declaration states its side as written; the admin snapshots copy `part.side`) and
 *   an `id` or a spread (a process's options also name a side literally: `src/cli/run.ts`); one that spreads another
 *   declaration and has no `version` of its own keeps that declaration's (`PRIVATE_CORE_DIGEST`).
 *   The scan must find a declaration for every id of the command's build, so a part written in a form it does not read
 *   fails here rather than going unchecked.
 * - **The notice**: `CHANGELOG.md`'s `0.10.0` section opens with
 *   `### Breaking changes` and one short line under it — a new architecture, nothing of 0.9.5's API or databases
 *   carried over; the section names no 0.9.5 export (no per-export list, no migration notes: pre-release, breaking
 *   changes need no notices) ({@link changelogProblems}) [A4, Q169].
 *
 * Pure functions over repository-relative paths and file texts; `./release-version.test.ts` gives them the tree.
 */

import path from "node:path";
import ts from "typescript";

/** The release this change makes. [LS-4] */
export const RELEASE_VERSION = "0.10.0";

/** The file that names the build's version, and the name it exports. */
export const BUILD_FILE = "src/config/build.ts";
export const VERSION_NAME = "UMBRADB_VERSION";

/** A source file: its path from the repository root (`/`-separated) and its text. */
export interface SourceText {
  readonly file: string;
  readonly text: string;
}

/** A module declaration the scan found: where, and its id when the scan can read it (null: spread from another). */
export interface FoundDeclaration {
  readonly file: string;
  readonly line: number;
  readonly id: string | null;
}

const parse = ({ file, text }: SourceText): ts.SourceFile =>
  ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const lineOf = (source: ts.SourceFile, node: ts.Node): number =>
  source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

function walk(node: ts.Node, visit: (node: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

/** A property's name as written, for an identifier or a string key; null for a computed one. */
function propertyName(property: ts.ObjectLiteralElementLike): string | null {
  const name = property.name;
  if (name === undefined) return null;
  const plain = ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name);
  return plain ? name.text : null;
}

const property = (object: ts.ObjectLiteralExpression, name: string): ts.ObjectLiteralElementLike | undefined =>
  object.properties.find((p) => propertyName(p) === name);

/** The file a relative import specifier names, from the repository root (`.js` written for a `.ts` file). */
function importedFile(file: string, specifier: string): string | null {
  if (!specifier.startsWith(".")) return null;
  return path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier)).replace(/\.js$/, ".ts");
}

/** The local names bound to `src/config/build.ts`'s `UMBRADB_VERSION` by the file's value imports (aliases too). */
function versionBindings(file: string, source: ts.SourceFile): Set<string> {
  const names = new Set<string>(file === BUILD_FILE ? [VERSION_NAME] : []);
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    if (importedFile(file, statement.moduleSpecifier.text) !== BUILD_FILE) continue;
    const clause = statement.importClause;
    if (clause === undefined || clause.isTypeOnly || clause.namedBindings === undefined) continue;
    if (!ts.isNamedImports(clause.namedBindings)) continue;
    for (const element of clause.namedBindings.elements) {
      const imported = (element.propertyName ?? element.name).text;
      if (!element.isTypeOnly && imported === VERSION_NAME) names.add(element.name.text);
    }
  }
  return names;
}

/** The names a file declares itself (variables, parameters, functions, classes), each with its line. */
function ownNames(source: ts.SourceFile): { readonly name: string; readonly line: number }[] {
  const found: { name: string; line: number }[] = [];
  walk(source, (node) => {
    if (
      (ts.isVariableDeclaration(node) || ts.isParameter(node) || ts.isBindingElement(node) ||
        ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.name !== undefined && ts.isIdentifier(node.name)
    ) {
      found.push({ name: node.name.text, line: lineOf(source, node) });
    }
  });
  return found;
}

/**
 * The string constants the files declare (`const NAME = "…"`, at any depth), by name: the ids the parts write as a
 * constant (`id: CORE_CHAIN_ID`). A name declared with two values maps to null.
 */
export function stringConstants(sources: readonly SourceText[]): Map<string, string | null> {
  const constants = new Map<string, string | null>();
  for (const given of sources) {
    walk(parse(given), (node) => {
      if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name) || node.initializer === undefined) return;
      if (!ts.isStringLiteral(node.initializer) && !ts.isNoSubstitutionTemplateLiteral(node.initializer)) return;
      const name = node.name.text;
      const value = node.initializer.text;
      constants.set(name, constants.has(name) && constants.get(name) !== value ? null : value);
    });
  }
  return constants;
}

/**
 * Whether an object literal is a module declaration: its own `side` written as `"public"` or `"private"`, and an `id`
 * of its own or a spread of another declaration.
 */
function isDeclaration(object: ts.ObjectLiteralExpression): boolean {
  if (property(object, "id") === undefined && !object.properties.some(ts.isSpreadAssignment)) return false;
  const side = property(object, "side");
  if (side === undefined || !ts.isPropertyAssignment(side)) return false;
  const value = side.initializer;
  const literal = ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value);
  return literal && ["public", "private"].includes(value.text);
}

/** The declaration's id as the scan reads it: a string, or a string constant by name; null otherwise. */
function idOf(object: ts.ObjectLiteralExpression, constants: ReadonlyMap<string, string | null>): string | null {
  const id = property(object, "id");
  if (id === undefined || !ts.isPropertyAssignment(id)) return null;
  const value = id.initializer;
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return value.text;
  return ts.isIdentifier(value) ? (constants.get(value.text) ?? null) : null;
}

/** One file's module declarations, and its problems: each declaration's version that is not the build's binding. */
export function scanDeclarations(
  given: SourceText,
  constants: ReadonlyMap<string, string | null>,
): { readonly declarations: FoundDeclaration[]; readonly problems: string[] } {
  const source = parse(given);
  const bindings = versionBindings(given.file, source);
  const declarations: FoundDeclaration[] = [];
  const problems: string[] = [];
  const rule = `not the build's ${VERSION_NAME} imported from ${BUILD_FILE} (task 17.4)`;
  walk(source, (node) => {
    if (!ts.isObjectLiteralExpression(node) || !isDeclaration(node)) return;
    const id = idOf(node, constants);
    const line = lineOf(source, node);
    declarations.push({ file: given.file, line, id });
    const where = `${given.file}:${line}: ${id ?? "a module declaration"}`;
    const version = property(node, "version");
    if (version === undefined) {
      if (!node.properties.some(ts.isSpreadAssignment)) problems.push(`${where} declares no version, ${rule}`);
      return;
    }
    const named = ts.isPropertyAssignment(version) && ts.isIdentifier(version.initializer);
    if (named && bindings.has((version.initializer as ts.Identifier).text)) return;
    const shown = ts.isPropertyAssignment(version) ? version.initializer : version;
    problems.push(`${where} declares version ${shown.getText(source)}, ${rule}`);
  });
  if (given.file !== BUILD_FILE && bindings.size > 0) {
    for (const own of ownNames(source)) {
      if (bindings.has(own.name)) {
        problems.push(`${given.file}:${own.line}: declares its own ${own.name}, hiding the build's version`);
      }
    }
  }
  return { declarations, problems };
}

/**
 * The problems of `src/`'s module declarations: each file's ({@link scanDeclarations}), and every id of the command's
 * build (`buildIds`) the scan found no declaration of.
 */
export function declarationProblems(sources: readonly SourceText[], buildIds: readonly string[]): string[] {
  const constants = stringConstants(sources);
  const found = new Set<string>();
  const problems: string[] = [];
  for (const given of sources) {
    const scanned = scanDeclarations(given, constants);
    for (const declaration of scanned.declarations) if (declaration.id !== null) found.add(declaration.id);
    problems.push(...scanned.problems);
  }
  for (const id of buildIds) {
    if (!found.has(id)) {
      problems.push(`no declaration of ${id} found in src/: the scan cannot check its version (task 17.4)`);
    }
  }
  return problems;
}

/**
 * The files of `src/` other than `src/config/build.ts` that write `version` as a string, and `build.ts` when its
 * `UMBRADB_VERSION` is not that string: the build's version is written once.
 */
export function versionLiteralProblems(sources: readonly SourceText[], version: string): string[] {
  const problems: string[] = [];
  const constants: string[] = [];
  for (const given of sources) {
    const source = parse(given);
    walk(source, (node) => {
      if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) return;
      const parent = node.parent;
      const isConstant =
        given.file === BUILD_FILE && ts.isVariableDeclaration(parent) && parent.initializer === node &&
        ts.isIdentifier(parent.name) && parent.name.text === VERSION_NAME;
      if (isConstant) constants.push(node.text);
      else if (node.text === version) {
        problems.push(`${given.file}:${lineOf(source, node)}: writes the build's version "${version}" (task 17.4)`);
      }
    });
  }
  if (constants.length !== 1 || constants[0] !== version) {
    const named = JSON.stringify(constants);
    problems.push(`${BUILD_FILE}'s ${VERSION_NAME} is ${named}, not package.json's "${version}" once (task 17.4)`);
  }
  return problems;
}

/** The declarations of a build (each `{ id, version }`) whose version is not `version`. */
export function runtimeVersionProblems(
  declarations: readonly { readonly id: string; readonly version: string }[],
  version: string,
): string[] {
  return declarations
    .filter((declaration) => declaration.version !== version)
    .map(({ id, version: own }) => `${id} carries version ${JSON.stringify(own)}, not the build's "${version}"`);
}

/** `CHANGELOG.md`'s section for `version`: the lines after its `## [version]` heading up to the next `## ` heading. */
function section(changelog: string, version: string): string[] | null {
  const lines = changelog.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start < 0) return null;
  const next = lines.findIndex((line, i) => i > start && line.startsWith("## "));
  return lines.slice(start + 1, next < 0 ? undefined : next);
}

/** The heading the notice opens the section with. */
export const NOTICE_HEADING = "### Breaking changes";

/** What the notice's line must say, as words it holds (any letter case). [A4] */
export const NOTICE_TERMS: readonly string[] = ["new architecture", "nothing of 0.9.5", "api", "database"];

/** One short line: within the 120 columns the repository's Markdown keeps to. */
export const NOTICE_MAX_LENGTH = 120;

/**
 * The problems with `CHANGELOG.md`: its `version` section must open with {@link NOTICE_HEADING} and one line under it
 * (up to the next `### ` heading), not a list item, at most {@link NOTICE_MAX_LENGTH} characters, holding
 * {@link NOTICE_TERMS}; and nowhere in the section may a name of `retired` (0.9.5's exports) appear in backticks. [A4]
 */
export function changelogProblems(changelog: string, version: string, retired: readonly string[]): string[] {
  const lines = section(changelog, version);
  if (lines === null) return [`CHANGELOG.md has no ${version} section (## [${version}] …; A4)`];
  const first = lines.findIndex((line) => line.trim() !== "");
  if (first < 0 || lines[first] !== NOTICE_HEADING) {
    return [`CHANGELOG.md's ${version} section does not open with "${NOTICE_HEADING}" (A4, LS-4)`];
  }
  const end = lines.findIndex((line, i) => i > first && line.startsWith("### "));
  const notice = lines.slice(first + 1, end < 0 ? undefined : end).filter((line) => line.trim() !== "");
  const problems: string[] = [];
  if (notice.length !== 1) problems.push(`the ${version} notice is ${notice.length} lines, not one (A4)`);
  const text = notice.join(" ");
  if (notice.some((line) => /^\s*(?:[-*+]|\d+[.)])\s/.test(line))) {
    problems.push(`the ${version} notice is a list, not one line (A4)`);
  }
  if (notice.some((line) => line.length > NOTICE_MAX_LENGTH)) {
    problems.push(`the ${version} notice is longer than ${NOTICE_MAX_LENGTH} characters (A4)`);
  }
  for (const term of NOTICE_TERMS) {
    if (!text.toLowerCase().includes(term)) problems.push(`the ${version} notice does not say "${term}" (A4)`);
  }
  const whole = lines.join("\n");
  for (const name of retired) {
    if (whole.includes(`\`${name}\``)) {
      problems.push(`the ${version} section names 0.9.5's export \`${name}\`: no per-export list (A4)`);
    }
  }
  return problems;
}
