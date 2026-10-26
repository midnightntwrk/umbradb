/**
 * The private backbone part `core-key-registry` (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-8,
 * PP-10; `specs/configuration/spec.md` CF-11; `design.md` §8, §10; CORE-ARCH §4.11, §4.14; decision record Q70): the
 * keys a private process has admitted, and the `admitted-keys` item — the keys admitted at a block's height — that its
 * private modules require.
 *
 * **Its table** (`design.md` §10), created by its migration under its own role: `core_key_registry.keys`, one row per
 * admitted key — `key_id` (SHA-256 of the UTF-8 kind and the bytes, PP-8), `kind`, `key_bytes` and `arrived_height`.
 * It is a module table of the private plan like any other (DT-6, its digest, the contents hash; Q75), and stays in the
 * private database: its bytes never reach the public side (PP-10).
 *
 * **What it does in this task (14.1).** It is the private backbone's second part, with its table and its item: at
 * each block's `on-compute` it puts `admitted-keys`, the keys admitted at the block's height. In this change keys enter
 * only as configured test keys (CF-11, Q70), and making a test key pending at its start, firing `on-key`, the
 * admission cutoff at `on-compute`, writing the admitted keys in the block's `on-db-write` and CF-11's checks are task
 * 14.4's: until then no key is ever pending, so the set is empty at every height.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import { defineModule } from "../../modules/declaration.js";

/** `core-key-registry`'s migrations (DB-9): applied once, in order; never changed. */
export const CORE_KEY_REGISTRY_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE core_key_registry.keys (
  key_id bytea PRIMARY KEY CHECK (octet_length(key_id) = 32),
  kind text NOT NULL,
  key_bytes bytea NOT NULL,
  arrived_height bigint NOT NULL
)`,
  },
]);

/** An admitted key (PP-8): its id, kind, bytes and the height it arrived at. */
export interface AdmittedKey {
  readonly keyId: Uint8Array;
  readonly kind: string;
  readonly bytes: Uint8Array;
  readonly arrivedHeight: bigint;
}

/** No key: the `admitted-keys` of every height until task 14.4 admits test keys. */
const NONE: readonly AdmittedKey[] = Object.freeze([]);

/**
 * `core-key-registry` (see the module comment): a backbone part of a private process, after `core-private-source` in
 * RN-3's fixed order, providing `admitted-keys` — a `block` item, and the `table` item of `core_key_registry.keys`.
 */
export const CORE_KEY_REGISTRY = defineModule({
  id: "core-key-registry",
  version: UMBRADB_VERSION,
  side: "private",
  requires: [],
  provides: [
    {
      name: "admitted-keys",
      lifetimes: ["block", "table"],
      table: { schema: "core_key_registry", tables: ["keys"], kind: "append-only" },
    },
  ],
  // Every backbone part starts at S, which is a mid-chain start when S is above genesis (Q96).
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_KEY_REGISTRY_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-compute"(_p, _b, _read, out) {
      out.put("admitted-keys", NONE);
    },
  },
});
