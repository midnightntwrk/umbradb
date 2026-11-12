/**
 * The tables `token-metadata` writes and `token-metadata-api` reads: the contract between the two modules. The
 * indexer owns them (its migrations, below); the API module requires the two items below and reads the tables through
 * them, and every index its reads use is the indexer's (a module creates nothing in another's schema).
 *
 * **The tables** (schema `token_metadata`), related by keys and holding only what is read:
 *
 * - `tokens`, mutable: one row per described token, keyed by `(id, kind)`, where `id` is the token's hash
 *   `sha256(pad(32, "midnight:derive_token") ‖ domain_sep ‖ contract_address)` (`./color.ts`): its color for kinds 1
 *   and 2, the same hash for kind 3. `symbol` is the token's current usable `symbol`, whole, or null: what symbol
 *   groups read. A row exists exactly while the token has a field; its last field's deletion deletes it (a withdrawal).
 * - `fields`, mutable: one row per defined field of a token (MIP "Keys": keys MIP-0018 does not define are not
 *   stored), holding only its current value, whole (names and symbols are cut when served, never when stored), and
 *   where it was set. `uint_value` is a `UInt` value as a number; `usable` is the common-field rule's answer for a
 *   common key, else null. Its rows belong to their token (`ON DELETE CASCADE`).
 * - `events`, append-only: what a token's mark reads of its contract — each rejected MIP-0018 event and each
 *   unresolved log site, at its chain position (`event_index`: its position among its transaction's log sites), with
 *   its reason. Accepted events leave no row: their effect is the fields.
 *
 * There is no `network` column (a database holds one chain) and no raw payload (nothing is recomputed: UmbraDB follows
 * finalized blocks only). Text columns hold only UmbraDB's own vocabulary (CHECKs keep them ASCII); chain bytes are
 * `bytea`.
 */

/** The indexer's schema: its id with `-` replaced by `_`. */
export const SCHEMA = "token_metadata";

/** The `table` item of `events` (append-only): rejected events and unresolved log sites, per contract. */
export const EVENTS_ITEM = "token-metadata-events";

/** The `table` item of `tokens` and `fields` (mutable): the described tokens and their current fields. */
export const STATE_ITEM = "token-metadata-state";

/** Migration `001`: the three tables and their indexes. Never edited once released; a change is a new migration. */
export const MIGRATION_001 = `CREATE TABLE ${SCHEMA}.tokens (
  id bytea NOT NULL CHECK (octet_length(id) = 32),
  kind smallint NOT NULL CHECK (kind IN (1, 2, 3)),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  domain_sep bytea NOT NULL CHECK (octet_length(domain_sep) = 32),
  symbol bytea CHECK (symbol IS NULL OR octet_length(symbol) <= 255),
  PRIMARY KEY (id, kind)
);
CREATE UNIQUE INDEX tokens_contract_idx ON ${SCHEMA}.tokens (contract_address, domain_sep, kind);
CREATE INDEX tokens_symbol_idx ON ${SCHEMA}.tokens (contract_address, symbol, domain_sep, kind) WHERE symbol IS NOT NULL;
CREATE TABLE ${SCHEMA}.fields (
  token_id bytea NOT NULL,
  kind smallint NOT NULL,
  key bytea NOT NULL CHECK (octet_length(key) BETWEEN 1 AND 255),
  val_type smallint NOT NULL CHECK (val_type BETWEEN 0 AND 4),
  value bytea NOT NULL CHECK (octet_length(value) <= 255),
  uint_value numeric(80, 0) CHECK (uint_value IS NULL OR uint_value >= 0),
  usable boolean,
  set_height bigint NOT NULL CHECK (set_height >= 0),
  set_tx integer NOT NULL CHECK (set_tx >= 0),
  set_event integer NOT NULL CHECK (set_event >= 0),
  set_record integer NOT NULL CHECK (set_record >= 0),
  CHECK ((val_type = 2) = (uint_value IS NOT NULL)),
  PRIMARY KEY (token_id, kind, key),
  FOREIGN KEY (token_id, kind) REFERENCES ${SCHEMA}.tokens (id, kind) ON DELETE CASCADE
);
CREATE TABLE ${SCHEMA}.events (
  height bigint NOT NULL CHECK (height >= 0),
  tx_index integer NOT NULL CHECK (tx_index >= 0),
  event_index integer NOT NULL CHECK (event_index >= 0),
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  classification text NOT NULL CHECK (classification IN ('reject', 'unresolved')),
  reason text NOT NULL CHECK (reason ~ '^[a-z0-9-]{1,64}$'),
  PRIMARY KEY (height, tx_index, event_index)
);
CREATE INDEX events_reject_idx ON ${SCHEMA}.events (contract_address, height, tx_index, event_index) INCLUDE (reason)
  WHERE classification = 'reject';
CREATE INDEX events_unresolved_idx ON ${SCHEMA}.events (contract_address, height, tx_index, event_index)
  WHERE classification = 'unresolved';`;

/** The module's migrations, in order. */
export const MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  Object.freeze({ id: "001", sql: MIGRATION_001 }),
]);
