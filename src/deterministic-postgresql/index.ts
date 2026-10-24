/**
 * The `deterministic_postgresql` component (`openspec/changes/core-arch/design.md` §1 and §4, owner decision Q69):
 * every rule UmbraDB imposes on PostgreSQL, so that two databases fed the same chain hold, hash and read back the same
 * values. It imports nothing else of `src/`, so it is tested alone (`test/deterministic-postgresql/`, on PostgreSQL 17
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
 * | The facts all of these read | `catalog.ts` (`catalogTables`, `catalogRelations`, the handle `ConsistentRead`) |
 * | `jsonb` and `numeric` `CHECK`s | task 7.1, a new `checks.ts` (the functions' SQL and the `CHECK`s each column gets) |
 * | Rows-only block transactions; the `BEFORE TRUNCATE` trigger | task 2.3, a new `block-transactions.ts` (the trigger's SQL) |
 * | The pinned session settings; the zero timeouts | `settings.ts` (`PINNED_SETTINGS`); task 2.7 adds the zero timeouts there |
 * | The result mapping and parameter texts, date and time as RFC 3339 text | `mapping.ts` |
 * | The opt-out (`deterministic: false`) | tasks 3.1 and 7.1: the rules take the opted-out tables as input (`column-rules.ts`, `catalog.ts`) |
 *
 * `errors.ts` holds `UmbraError` and its codes, which the mapping throws and `src/db/errors.ts` re-exports (decision
 * record Q79).
 */

export * from "./catalog.js";
export * from "./column-rules.js";
export * from "./errors.js";
export * from "./mapping.js";
export * from "./settings.js";
