/**
 * The tables `token-metadata` writes and `token-metadata-api` reads: the contract between the two modules. The
 * indexer owns them (its migrations, `./sql.ts`); the API module requires the two items below and reads the tables
 * through them, and every index its bounded reads use is the indexer's (a module creates nothing in another's schema).
 */

/** The indexer's schema: its id with `-` replaced by `_`. */
export const SCHEMA = "token_metadata";

/** The `table` item of `token_events` (append-only): rejected events and unresolved log sites, per contract. */
export const EVENTS_ITEM = "token-metadata-events";

/** The `table` item of `tokens` and `token_fields` (mutable): the described tokens and their current fields. */
export const STATE_ITEM = "token-metadata-state";
