import ts from "typescript";

/**
 * The package's entry point (`src/index.ts`): its exports as the compiler resolves them ({@link surfaceOf}), pinned to
 * {@link EXPORTED_SURFACE}, and the core modules' declarations it exports, each of which declares its module's id and
 * has the `entry` builder a configuration file writes its entry with.
 *
 * The checks take plain data and return one sentence per problem, naming the export, empty when there is none, so
 * `./surface.test.ts` runs them on the real barrel and on its negative controls.
 */

/** An entry point's exports, sorted: the names with a value at run time, and the names that are types only. */
export interface Surface {
  readonly values: readonly string[];
  readonly types: readonly string[];
}

/**
 * The public API of `"."` (`src/index.ts`): every value and every type it exports, sorted. Adding, removing or changing
 * the kind of an export is a change to the package's public API: update this list in the same change, on purpose.
 * `test/smoke/pack-install.mjs` imports every name of it from the installed tarball.
 */
export const EXPORTED_SURFACE: Surface = Object.freeze({
  values: Object.freeze([
    "CORE_BLOCK_PARSED", "CORE_CHAIN_EVENTS", "CORE_CONTRACT_LOGS_FAST", "CORE_CONTRACT_LOGS_FULL",
    "CORE_CONTRACT_STATES", "CORE_LEDGER_STATE", "CORE_TX_RESULTS", "InMemoryBlockSource", "POINTS", "TOKEN_METADATA",
    "TOKEN_METADATA_API", "TokenMetadataRevisionGap", "TokenMetadataStartAfterDatabase", "UmbraError",
    "answerChainData", "chainDataHeaders", "contentsHash", "contractLogsItemOf", "coreEntry", "cursorTable", "defineConfig", "defineModule",
    "encodeCanonical", "encodeRow", "finalizedHeight", "heightVersionedTable", "hexBytes", "messagePortChannel",
    "readChainDataView", "retainedStatesOf", "startUmbraDB", "unresolvedLogSitesOf", "versionEntry",
    "withViewExtensions",
  ]),
  types: Object.freeze([
    "Address", "ApiRegistry", "BlockContext", "BlockRef", "BlockWriteHandle", "ContractLog", "CoreVersion", "Entry",
    "ErrorCode",
    "FieldKind", "FieldSchema", "ItemDeclaration", "ItemSink", "LedgerPackage", "LedgerTask", "Lifetime",
    "MessagePortLike", "Migration", "ModuleDeclaration", "NodeHttpHandler", "NodeUpgradeHandler", "ParsedTransaction",
    "PointCallbacks", "PointName", "PrivateLinkChannel", "ProcessContext", "ReadHandle", "Revision", "SchemaWriteHandle",
    "UmbraConfig", "UmbraDBBackup", "UmbraDBCondition", "UmbraDBEnd", "UmbraDBHandle", "UmbraDBNetwork",
    "UmbraDBOptions", "UmbraDBReason", "UmbraDBStarted", "UmbraDBStatus", "UnresolvedLogSite",
  ]),
});

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
 * Every difference between the exports `found` of `where` and the `expected` surface, one sentence each naming the
 * export: a name not in the surface, a name of the surface that is missing, and a name exported as the other kind.
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
          ? `${where} exports ${name} as a ${kind}; the pinned surface lists it as a ${other}`
          : `${where} exports the ${kind} ${name}, which the pinned surface does not list`,
      );
    }
    for (const name of expectedNames) {
      if (!foundAll.has(name)) problems.push(`${where} does not export the ${kind} ${name}, which the pinned surface lists`);
    }
  }
  for (const name of expectedAll) {
    if (expected.values.includes(name) && expected.types.includes(name)) {
      problems.push(`the pinned surface lists ${name} both as a value and as a type`);
    }
  }
  return problems;
}

/** The names a module's namespace object holds at run time, sorted. */
export function runtimeValues(namespace: object): string[] {
  return Object.keys(namespace).sort();
}

/**
 * The core modules' declarations the surface exports (their names are the declarations' own constants), with the id
 * each declares: a configuration file writes their entries with `<name>.entry({ start, config: {} })`.
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
