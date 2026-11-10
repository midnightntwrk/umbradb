/**
 * The tables `token-metadata` writes and `token-metadata-api` reads: the contract between the two modules. The
 * indexer owns them (its migrations, `./sql.ts`); the API module requires the two items below and reads the tables
 * through them, and every index its bounded reads use is the indexer's (a module creates nothing in another's schema).
 */

/** The indexer's schema: its id with `-` replaced by `_`. */
export const SCHEMA = "token_metadata";

/** The `table` item of `events` (append-only). */
export const EVENTS_ITEM = "token-metadata-events";

/** The `table` item of `fields` and `withdrawals` (mutable). */
export const STATE_ITEM = "token-metadata-state";

/**
 * A row's color (MIP "Lookup") in SQL: `sha256(pad(32, "midnight:derive_token") ‖ domain_sep ‖ contract_address)`. The
 * API finds an identity by its color through the expression index `fields_color_idx`, so no color is stored and the
 * write path computes none.
 */
export const COLOR_SQL =
  "sha256('\\x6d69646e696768743a6465726976655f746f6b656e0000000000000000000000'::bytea || domain_sep || contract_address)";
