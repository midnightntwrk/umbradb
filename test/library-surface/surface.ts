import ts from "typescript";

/**
 * The package's entry point (`src/index.ts`): its exports as the compiler resolves them ({@link surfaceOf}), and the
 * core modules' declarations it exports, each of which declares its module's id and has the `entry` builder a
 * configuration file writes its entry with. [A1 STATIC, LS-1; design §12]
 *
 * The declarations' check takes plain data and returns one sentence per problem, naming the export, empty when there is
 * none, so `./surface.test.ts` runs it on the real barrel and on its negative controls.
 */

/** An entry point's exports, sorted: the names with a value at run time, and the names that are types only. */
export interface Surface {
  readonly values: readonly string[];
  readonly types: readonly string[];
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
 * The core modules' declarations the surface exports (their names are the declarations' own constants), with the id
 * each declares: a configuration file writes their entries with `<name>.entry({ start, config: {} })`. [design §12]
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
