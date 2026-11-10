import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UnresolvedLogSite } from "../../../src/backbone/contract-logs/contract-logs.js";
import { candidatesOf, TokenMetadataLogError } from "../../../src/features/token-metadata/apply.js";
import { miscAtom, UnknownLogSerialization } from "../../../src/features/token-metadata/log-reader.js";
import { tokenMetadataWith } from "../../../src/features/token-metadata/token-metadata.js";
import {
  commonRecords,
  encodePayload,
  EVENT_NAME,
  fromHex,
} from "../../../src/features/token-metadata/codec/index.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import * as v9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, causes, contract, domain, eventData, get, log, miscData, runTo, runToHalt, serve } from "./harness.js";

/**
 * The module's event rows through the real process on PostgreSQL 18 and PGlite:
 * - A `Misc` log of another name (`[v2]` included), a `Misc` value of two atoms or of 289 bytes, and a log of each
 *   other MIP-0002 type store no row.
 * - A `Misc` log with an unknown tag halts the block with `callback-error` naming height, transaction, log
 *   and tag; the negative control, a reader that skips unknown tags, lets the block commit.
 * - S7: two candidates in one transaction, one malformed, stores one `reject` with its reason and applies the other;
 *   and an unresolved log site (as `core-contract-logs-fast` gives one) is stored `unresolved` with the provider's
 *   reason at its own position in its transaction, never applied, and marks its contract's tokens `unresolved`.
 *   **Negative control:** numbering a transaction's events from its first log alone, as before unresolved sites, moves
 *   the valid event onto the site's position.
 */

const S = 10;
const A = contract(0xaa);
const D = domain(0x11);
const valid = eventData(D, 1, commonRecords({ name: "Acme", symbol: "ACME" }));

/** The v1 payload of a valid event under another name: `pad(32, "mip-0018:token-metadata[v2]")`. */
const v2Name = new Uint8Array(32);
v2Name.set(new TextEncoder().encode("mip-0018:token-metadata[v2]"));

/** A cell holding two atoms (`Bytes<32>`, `Bytes<256>`): not one byte string. */
const twoAtoms = v9.serializeStateValue(
  v9.StateValue.newCell({
    value: [EVENT_NAME.slice(0, EVENT_NAME.findLastIndex((b) => b !== 0) + 1), Uint8Array.of(1)],
    alignment: [
      { tag: "atom", value: { tag: "bytes", length: 32 } },
      { tag: "atom", value: { tag: "bytes", length: 256 } },
    ],
  }),
);

/** 289 bytes: the v1 name, then a valid payload and one more byte. */
const tooLong = (() => {
  const bytes = new Uint8Array(289).fill(1);
  bytes.set(EVENT_NAME, 0);
  bytes.set(encodePayload({ domainSep: D, kind: 1 }, commonRecords({ name: "Acme" })), 32);
  return v9.serializeStateValue(
    v9.StateValue.newCell({ value: [bytes], alignment: [{ tag: "atom", value: { tag: "bytes", length: 289 } }] }),
  );
})();

const D2 = domain(0x22);
const otherValid = eventData(D2, 1, commonRecords({ name: "Beta", symbol: "BETA" }));
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** An unresolved log site of contract `A`, as `core-contract-logs-fast` gives one. */
const site = (transaction: number, index: number, reason: UnresolvedLogSite["reason"]): UnresolvedLogSite => ({
  transaction,
  index,
  address: A,
  entryPoint: new TextEncoder().encode("setMetadata"),
  reason,
  segment: 1,
  fallible: reason === "partial-transaction",
  call: 0,
  op: 4,
});

const OTHER_TYPES = [
  "ShieldedSpend",
  "ShieldedReceive",
  "ShieldedMint",
  "ShieldedBurn",
  "UnshieldedSpend",
  "UnshieldedReceive",
  "UnshieldedMint",
  "UnshieldedBurn",
  "Paused",
  "Unpaused",
] as const;

/** `data` with its tag changed to `impact-state-value[v3]`. */
function retagged(data: Uint8Array): Uint8Array {
  return Uint8Array.from(Buffer.from(Buffer.from(data).toString("latin1").replace("impact-state-value[v2]", "impact-state-value[v3]"), "latin1"));
}

describe.each(PROCESS_BACKENDS)("token-metadata's event rows on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("another name, two atoms, 289 bytes and every other log type store no row; a valid event beside them does", async () => {
    const db = await backend.database();
    const logs = new Map([
      [
        BigInt(S + 1),
        blockLogs(
          [0, A, miscData(v2Name, encodePayload({ domainSep: D, kind: 1 }, commonRecords({ name: "Acme" })))],
          [0, A, twoAtoms],
          [0, A, tooLong],
          ...OTHER_TYPES.map((type) => [0, A, valid, type] as const),
          [1, A, valid],
        ),
      ],
    ]);
    await runTo(db, { start: S, head: S + 2, logs });
    expect(await db.query("SELECT height::int AS h, tx_index, event_index, classification FROM token_metadata.events")).toEqual([
      { h: S + 1, tx_index: 1, event_index: 0, classification: "accept" },
    ]);
  }, 240_000);

  it("two candidates in one transaction, one malformed: one reject with its reason, the other applied", async () => {
    for (const id of ["S7a", "S7b"]) {
      const vector = JSON.parse(readFileSync(`test/fixtures/mip0018/vectors/state/${id}.json`, "utf8")) as {
        steps: { contractAddress: string; name_hex: string; payload_hex: string }[];
      };
      const db = await backend.database();
      const data = vector.steps.map((step) => miscData(fromHex(step.name_hex), fromHex(step.payload_hex)));
      const address = fromHex(vector.steps[0]!.contractAddress);
      await runTo(db, { start: S, head: S + 2, logs: new Map([[BigInt(S + 1), blockLogs([0, address, data[0]!], [0, address, data[1]!])]]) });
      const bad = id === "S7a" ? 0 : 1;
      expect(await db.query("SELECT event_index, classification, reason, kind FROM token_metadata.events ORDER BY event_index"), id).toEqual(
        [0, 1].map((event_index) =>
          event_index === bad
            ? { event_index, classification: "reject", reason: "reserved-valtype", kind: null }
            : { event_index, classification: "accept", reason: null, kind: 3 },
        ),
      );
      expect(await db.query("SELECT convert_from(key, 'UTF8') AS key, convert_from(value, 'UTF8') AS value FROM token_metadata.fields"), id).toEqual([
        { key: "name", value: "Good" },
      ]);
    }
  }, 240_000);

  it("an unresolved site is stored unresolved at its position, never applied, and marks the contract's tokens", async () => {
    const db = await backend.database();
    const unresolved = new Map([[BigInt(S + 1), [site(0, 0, "not-a-literal"), site(1, 2, "partial-transaction")]]]);
    const logs = new Map([[BigInt(S + 1), [log(0, 1, A, valid), log(1, 3, A, otherValid)]]]);
    const identity = await serve(db, { start: S, head: S + 2, logs, unresolved }, (origin) =>
      get(origin, `/v1/identities/${hex(A)}/${hex(D)}/1`),
    );
    expect(await db.query("SELECT tx_index, event_index, classification, reason FROM token_metadata.events ORDER BY tx_index, event_index")).toEqual([
      { tx_index: 0, event_index: 0, classification: "unresolved", reason: "not-a-literal" },
      { tx_index: 0, event_index: 1, classification: "accept", reason: null },
      { tx_index: 1, event_index: 0, classification: "unresolved", reason: "partial-transaction" },
      { tx_index: 1, event_index: 1, classification: "accept", reason: null },
    ]);
    expect(await db.query("SELECT DISTINCT encode(domain_sep, 'hex') AS d FROM token_metadata.fields ORDER BY d")).toEqual([{ d: hex(D) }, { d: hex(D2) }]);
    expect(identity.json.mark).toMatchObject({
      mark: "unresolved",
      reasons: ["unresolved-log"],
      unresolved: { count: 2, positions: [{ height: S + 1, txIndex: 0, eventIndex: 0 }, { height: S + 1, txIndex: 1, eventIndex: 0 }] },
    });
  }, 240_000);

  it("a Misc log with an unknown tag halts its block with callback-error naming height, transaction, log and tag", async () => {
    const db = await backend.database();
    const logs = new Map([[BigInt(S + 2), blockLogs([0, A, valid], [1, A, valid], [1, A, retagged(valid)])]]);
    const halt = await runToHalt(db, { start: S, head: S + 3, logs });
    expect(halt.status).toMatchObject({ state: "halted", cursor: BigInt(S + 1), reason: { code: "callback-error", height: BigInt(S + 2), module: "token-metadata", point: "on-db-write" } });
    const error = causes(halt.error).find((e) => e instanceof TokenMetadataLogError) as TokenMetadataLogError;
    expect(error).toMatchObject({ height: BigInt(S + 2), transaction: 1, log: 2, tag: "impact-state-value[v3]" });
    expect(error.message).toBe(
      `token-metadata cannot read the Misc log 2 of transaction 1 at height ${S + 2}: its data has the unknown tag impact-state-value[v3]`,
    );
    expect(error.cause).toBeInstanceOf(UnknownLogSerialization);
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.events")).toEqual([{ n: 0 }]);
  }, 240_000);

  it("negative control: a reader that skips unknown tags lets the block commit", async () => {
    const db = await backend.database();
    const skipping = (data: Uint8Array): Uint8Array | null => {
      try {
        return miscAtom(data);
      } catch (error) {
        if (error instanceof UnknownLogSerialization) return null;
        throw error;
      }
    };
    const logs = new Map([[BigInt(S + 2), blockLogs([0, A, valid], [1, A, valid], [1, A, retagged(valid)])]]);
    await runTo(db, { start: S, head: S + 3, logs, modules: [tokenMetadataWith(skipping) as ModuleDeclaration] });
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.events")).toEqual([{ n: 2 }]);
  }, 240_000);

  it("a value that is not a tagged serialization at all halts too, naming no tag", async () => {
    const db = await backend.database();
    const logs = new Map([[BigInt(S + 1), blockLogs([0, A, Uint8Array.of(1, 2, 3)])]]);
    const halt = await runToHalt(db, { start: S, head: S + 2, logs });
    const error = causes(halt.error).find((e) => e instanceof TokenMetadataLogError) as TokenMetadataLogError;
    expect(error).toMatchObject({ height: BigInt(S + 1), transaction: 0, log: 0, tag: null });
  }, 240_000);
});

describe("an event's position among its transaction's log sites", () => {
  const logs = [log(0, 1, A, valid), log(1, 3, A, otherValid)];
  const sites = [site(0, 0, "not-a-literal"), site(1, 2, "partial-transaction")];
  const positions = (candidates: ReturnType<typeof candidatesOf>) => candidates.map((c) => [c.row.tx, c.row.event, c.row.classification]);

  it("counts from the transaction's first site, unresolved ones included", () => {
    expect(positions(candidatesOf(BigInt(S + 1), logs, miscAtom, sites))).toEqual([
      [0, 0, "unresolved"],
      [0, 1, "accept"],
      [1, 0, "unresolved"],
      [1, 1, "accept"],
    ]);
  });

  it("negative control: counted from the first log alone, each valid event takes its site's position", () => {
    expect(positions(candidatesOf(BigInt(S + 1), logs, miscAtom))).toEqual([
      [0, 0, "accept"],
      [1, 0, "accept"],
    ]);
  });
});
