import ts from "typescript";

/**
 * A1 `[STATIC]` (LS-1, task 17.3): the package's one entry point, `"."` (`src/index.ts`, built to `dist/index.js` and
 * `dist/index.d.ts`), exports exactly the surface of `openspec/changes/core-arch/design.md` §12 — its **Values** and its
 * **Types**, read from §12's own text, so the pin cannot drift from the document unseen.
 *
 * Every check takes plain data and returns one sentence per problem, naming the export, empty when there is none, so
 * `./surface.test.ts` runs the same checks on the real barrel and on its negative controls.
 */

/** An entry point's exports, sorted: the names with a value at run time, and the names that are types only. */
export interface Surface {
  readonly values: readonly string[];
  readonly types: readonly string[];
}

/** The text of `design.md` §12. */
export function section12(design: string): string {
  const start = design.indexOf("## 12. Exported surface and command");
  const end = design.indexOf("\n## 13.", start);
  return start < 0 ? "" : design.slice(start, end < 0 ? undefined : end);
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** The code spans of `text` that are identifiers (a path such as `src/runner/envelope.ts` or a call is left out). */
function identifiersIn(text: string): string[] {
  return [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1] as string).filter((span) => IDENTIFIER.test(span));
}

/** The paragraph of §12 that starts with `**<label>:**`, up to the next bold label or the section's end. */
function paragraph(section: string, label: string): string {
  const start = section.indexOf(`**${label}:**`);
  if (start < 0) return "";
  const next = section.indexOf("\n\n**", start);
  return section.slice(start, next < 0 ? undefined : next);
}

/** §12's surface: the identifiers of its **Values** and **Types** paragraphs, sorted, each once. */
export function section12Surface(design: string): Surface {
  const section = section12(design);
  const sorted = (names: string[]) => [...new Set(names)].sort();
  return { values: sorted(identifiersIn(paragraph(section, "Values"))), types: sorted(identifiersIn(paragraph(section, "Types"))) };
}

/** Whether an export is a value at run time: its target has a value meaning and it is not exported as a type only. */
function isValueExport(checker: ts.TypeChecker, exported: ts.Symbol): boolean {
  const typeOnly = (exported.declarations ?? []).some(
    (declaration) =>
      (ts.isExportSpecifier(declaration) && (declaration.isTypeOnly || declaration.parent.parent.isTypeOnly)) ||
      (ts.isExportDeclaration(declaration) && declaration.isTypeOnly),
  );
  if (typeOnly) return false;
  const target = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  return (target.flags & ts.SymbolFlags.Value) !== 0;
}

/** The exports of the TypeScript module `file`, as the compiler resolves them (re-exports followed), sorted. */
export function surfaceOf(file: string): Surface {
  const options: ts.CompilerOptions = {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2023,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
  };
  const program = ts.createProgram({ rootNames: [file], options });
  const source = program.getSourceFile(file);
  if (source === undefined) throw new Error(`${file}: not in its own program`);
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(source);
  const values: string[] = [];
  const types: string[] = [];
  for (const exported of symbol === undefined ? [] : checker.getExportsOfModule(symbol)) {
    (isValueExport(checker, exported) ? values : types).push(exported.getName());
  }
  return { values: values.sort(), types: types.sort() };
}

/**
 * Every difference between the exports `found` of `where` and §12's `expected`, one sentence each naming the export:
 * a name §12 does not list, a name §12 lists that is missing, and a name exported as the other kind.
 */
export function surfaceProblems(where: string, found: Surface, expected: Surface): string[] {
  const problems: string[] = [];
  const all = (s: Surface) => new Set([...s.values, ...s.types]);
  const foundAll = all(found);
  const expectedAll = all(expected);
  for (const [kind, other, names, expectedNames, otherExpected] of [
    ["value", "type", found.values, expected.values, expected.types],
    ["type", "value", found.types, expected.types, expected.values],
  ] as const) {
    for (const name of names) {
      if (expectedNames.includes(name)) continue;
      problems.push(
        otherExpected.includes(name)
          ? `${where} exports ${name} as a ${kind}; design.md §12 lists it as a ${other} (LS-1)`
          : `${where} exports the ${kind} ${name}, which design.md §12 does not list (LS-1)`,
      );
    }
    for (const name of expectedNames) {
      if (!foundAll.has(name)) problems.push(`${where} does not export the ${kind} ${name}, which design.md §12 lists (LS-1)`);
    }
  }
  for (const name of expectedAll) {
    if (expected.values.includes(name) && expected.types.includes(name)) {
      problems.push(`design.md §12 lists ${name} both as a value and as a type`);
    }
  }
  return problems;
}

/** The names a module's namespace object holds at run time, sorted. */
export function runtimeValues(namespace: object): string[] {
  return Object.keys(namespace).sort();
}

/**
 * The core modules' declarations §12 exports (task 17.3 settles their names: the declarations' own constants), with the
 * id each declares: a configuration file writes their entries with `<name>.entry({ start, config: {} })`.
 */
export const CORE_MODULE_EXPORTS: Readonly<Record<string, string>> = Object.freeze({
  CORE_CHAIN_EVENTS: "core-chain-events",
  CORE_BLOCK_PARSED: "core-block-parsed",
  CORE_TX_RESULTS: "core-tx-results",
  CORE_LEDGER_STATE: "core-ledger-state",
  CORE_CONTRACT_STATES: "core-contract-states",
  CORE_CONTRACT_LOGS_FULL: "core-contract-logs-full",
  CORE_CONTRACT_LOGS_FAST: "core-contract-logs-fast",
});

/**
 * Every exported core module declaration of `namespace` that is not what a configuration writes an entry of: one
 * whose id is not its module's, or that has no `entry` builder filling that id.
 */
export function coreModuleProblems(namespace: Readonly<Record<string, unknown>>): string[] {
  const problems: string[] = [];
  for (const [name, id] of Object.entries(CORE_MODULE_EXPORTS)) {
    const declaration = namespace[name] as { id?: unknown; entry?: unknown } | undefined;
    if (declaration === undefined) {
      problems.push(`${name} is not exported`);
      continue;
    }
    if (declaration.id !== id) problems.push(`${name} declares the id ${String(declaration.id)}, not ${id}`);
    if (typeof declaration.entry !== "function") {
      problems.push(`${name} has no entry builder: a configuration cannot write ${name}.entry({ … })`);
      continue;
    }
    const entry = (declaration.entry as (input: object) => { id?: unknown })({ start: 0, config: {} });
    if (entry.id !== id) problems.push(`${name}.entry gives the id ${String(entry.id)}, not ${id}`);
  }
  return problems;
}
