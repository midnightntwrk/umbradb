/**
 * The `deterministic_postgresql` component (`openspec/changes/core-arch/design.md` §1 and §4, owner decision Q69):
 * every rule UmbraDB imposes on PostgreSQL, so that two databases fed the same chain hold, hash and read back the same
 * values. It imports nothing else of `src/`, so it is tested alone (`test/deterministic-postgresql/`, on PostgreSQL 18
 * and on PGlite); `src/db/` and `src/determinism/` take every rule from this entry and repeat none (A138).
 *
 * Where each row of §4's component table is, and where the rows still to be built go:
 *
 * | Rule (`design.md` §4) | Here |
 * |---|---|
 * | Column types allowed as values and as keys, with each refusal's reason and alternative | `column-rules.ts` (`COLUMN_TYPE_RULES`, `columnVerdict`, `tableRefusals`, `refusalMessage`) |
 * | Text keys ordered by bytes (`COLLATE "C"`) | `column-rules.ts` (`keyOrder`, `keyOrderTerm`; `timestamptz` keys by time) |
 * | Identity, `serial` and non-immutable defaults refused | `column-rules.ts` (`TABLE_RULES`, `parseExpressionTree`, `defaultReferences`, `notImmutableParts`) |
 * | Sequences and unlogged tables in module schemas refused | `column-rules.ts` (`relationRefusals`, `databaseRefusals`) |
 * | The facts all of these read | `catalog.ts` (`catalogTables`, `catalogRelations` — of every module schema, or of the schemas given —, the handle `ConsistentRead`) |
 * | `jsonb` and `numeric` `CHECK`s | `checks.ts` (`INTEGER_RULES`, `CHECK_FUNCTIONS_SQL`: `core_chain.jsonb_numbers_ok`, `core_chain.numeric_ok` and their array forms; `integerCheckStatements`: the `CHECK` each column gets); `src/db/module-rules.ts` applies them |
 * | Rows-only block transactions; the `BEFORE TRUNCATE` trigger | `block-transactions.ts` (the trigger's function and its statements, the migration mark, the SQLSTATE); `src/db/truncate-guard.ts` applies them |
 * | The pinned session settings; the zero timeouts | `settings.ts` (`PINNED_SETTINGS`, `ZERO_TIMEOUTS`, and `SESSION_SETTINGS`, both, which the backends apply) |
 * | The result mapping and parameter texts, date and time as RFC 3339 text | `mapping.ts` |
 * | The opt-out (`deterministic: false`) | `opt-out.ts` (`optOut`: which tables and relations the declared tables cover), used by `column-rules.ts` (`databaseRefusals`' `optedOut`, with `catalog.ts`'s `belongsTo`), `block-transactions.ts` and `checks.ts`, and outside the component by change capture (`src/db/change-capture.ts`) and the contents hash (`src/determinism/module-tables.ts`); the declaration is `src/modules/` (task 3.1) |
 *
 * `errors.ts` holds `UmbraError` and its codes, which the mapping throws and `src/db/errors.ts` re-exports (decision
 * record Q79).
 */

export * from "./block-transactions.js";
export * from "./catalog.js";
export * from "./checks.js";
export * from "./column-rules.js";
export * from "./errors.js";
export * from "./mapping.js";
export * from "./opt-out.js";
export * from "./settings.js";
