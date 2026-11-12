import { describe, expect, it } from "vitest";
import { tokenColor } from "../../../src/features/token-metadata/color.js";
import { commonRecords, record, toHex, withdrawRecords } from "../../../src/features/token-metadata/codec/index.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, post, serve, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * The withdrawal, usability and truncation scenarios read through the tokens route, on PostgreSQL 18 and PGlite.
 *
 * - **S3**: kinds 1 and 3 described; kind 1 withdrawn (read here: by no selector, kind 3 unchanged); kind 1 revived
 *   with `name` only (read here: only `name`).
 * - **S5, S12**: unusable values after usable ones: each served unusable, `common` null, no earlier value.
 * - **S11**: a 70-character `name` and a 15-character `symbol` served as 64 and 12, stored whole; two symbols that
 *   share their first 12 characters group together.
 * - **Only undefined keys**: an identity whose only field is `foo` is referenced nowhere; its event is accepted.
 */

const S = 2_000;
const X = contract(0x31);
const Y = contract(0x32);
const Z = contract(0x33);
const U = contract(0x34);
const D = domain(1);
const hex = (b: Uint8Array) => toHex(b);
const text = (s: string) => new TextEncoder().encode(s);
const one = (c: Uint8Array, kind: number) => ({ contract: hex(c), domainSep: hex(D), kind });
const COMMON = commonRecords({ name: "Old", symbol: "OLD", decimals: 6, standards: "a b" });
const NAME_70 = "N".repeat(70);
const SYMBOL_15 = "ABCDEFGHIJKLMNO";

const LOGS = new Map([
  [
    BigInt(S + 1),
    blockLogs(
      [0, X, eventData(D, 1, COMMON)],
      [0, X, eventData(D, 3, COMMON)],
      [1, Y, eventData(D, 1, [...commonRecords({ name: "Good", symbol: "G", decimals: 6, standards: "a b" }), record.bytes("image_sha256", new Uint8Array(32).fill(1))])],
      [2, Z, eventData(D, 1, commonRecords({ name: NAME_70, symbol: SYMBOL_15 }))],
      [2, Z, eventData(domain(2), 1, commonRecords({ symbol: "ABCDEFGHIJKLXYZ" }))],
      [3, U, eventData(D, 1, [record.utf8("foo", "x")])],
    ),
  ],
  [
    BigInt(S + 2),
    blockLogs(
      [0, X, eventData(D, 1, withdrawRecords())],
      [
        1,
        Y,
        eventData(D, 1, [
          record.utf8("name", ""),
          record.utf8("decimals", "6"),
          record.utf8("standards", "a  b"),
          record.bytes("image_sha256", new Uint8Array(31).fill(1)),
        ]),
      ],
    ),
  ],
  [BigInt(S + 4), blockLogs([0, X, eventData(D, 1, commonRecords({ name: "New" }))])],
]);

describe.each(PROCESS_BACKENDS)("the withdrawal, usability and truncation scenarios through the tokens route on $name", (backend: ProcessBackend) => {
  it("S3, S5/S12, S11 and an identity of undefined keys only", async () => {
    await backend.start();
    try {
      const db = await backend.database();
      const kind3 = await serve(db, { start: S, head: S + 3, logs: LOGS }, async (origin) => {
        const at = async (body: unknown) => (await post(origin, TOKENS_PATH, body)).json;
        // S3, after the tombstones: kind 1 is referenced nowhere, by any selector.
        expect((await at(one(X, 1))).items).toEqual([]);
        expect((await at({ contract: hex(X) })).items.map((t: { kind: number; group: unknown }) => [t.kind, t.group])).toEqual([[3, null]]);
        expect((await at({ contract: hex(X), domainSep: hex(D) })).items.map((t: { kind: number }) => t.kind)).toEqual([3]);
        expect((await at({ colors: [hex(tokenColor(D, X))] })).items).toEqual([]);

        // S5, S12: unusable values served unusable, no common value, no earlier value.
        const [y] = (await at(one(Y, 1))).items;
        expect(y.common).toEqual({ name: null, symbol: "G", decimals: null, standards: null });
        const byKey = Object.fromEntries(y.fields.map((f: { key: { utf8: string } }) => [f.key.utf8, f]));
        for (const key of ["name", "decimals", "standards", "image_sha256"]) expect([key, byKey[key].usable]).toEqual([key, false]);
        expect(byKey.name.value).toEqual({ hex: "", text: "" });
        expect(byKey.decimals.value).toEqual({ hex: hex(text("6")), text: "6" });
        expect(y.mark).toMatchObject({ mark: "partial", missing: ["name", "decimals"] });

        // S11: served cut, stored whole.
        const [z] = (await at(one(Z, 1))).items;
        expect(z.common).toMatchObject({ name: "N".repeat(64), symbol: "ABCDEFGHIJKL" });
        expect(z.fields.find((f: { key: { utf8: string } }) => f.key.utf8 === "name").value.text).toHaveLength(64);
        // Grouped by the served (cut) symbol.
        expect(z.group).toEqual({
          symbol: { hex: hex(text("ABCDEFGHIJKL")), utf8: "ABCDEFGHIJKL" },
          memberCount: 2,
          members: [
            { domainSep: hex(D), kind: 1 },
            { domainSep: hex(domain(2)), kind: 1 },
          ],
        });

        // Only undefined keys: referenced nowhere, its event accepted.
        expect((await at(one(U, 1))).items).toEqual([]);
        expect((await at({ contract: hex(U) })).items).toEqual([]);
        // Its event is accepted (no rejection row) and stores nothing: an undefined key is not kept.
        expect(await db.query(`SELECT count(*)::int AS n FROM token_metadata.token_events WHERE contract_address = '\\x${hex(U)}'::bytea`)).toEqual([{ n: 0 }]);
        expect(await db.query(`SELECT count(*)::int AS n FROM token_metadata.tokens WHERE contract_address = '\\x${hex(U)}'::bytea`)).toEqual([{ n: 0 }]);
        return (await at(one(X, 3))).items;
      });
      expect(
        await db.query(
          `SELECT octet_length(f.value) AS n FROM token_metadata.tokens t JOIN token_metadata.token_fields f ON f.token_id = t.id AND f.kind = t.kind
           WHERE t.contract_address = '\\x${hex(Z)}'::bytea ORDER BY t.domain_sep, f.key`,
        ),
      ).toEqual([
        { n: 70 },
        { n: 15 },
        { n: 15 },
      ]);

      await serve(db, { start: S, head: S + 5, logs: LOGS }, async (origin) => {
        const at = async (body: unknown) => (await post(origin, TOKENS_PATH, body)).json;
        // S3, after the revival: only `name`; kind 3 unchanged throughout.
        const [x1] = (await at(one(X, 1))).items;
        expect(x1.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["name"]);
        expect(x1.common).toEqual({ name: "New", symbol: null, decimals: null, standards: null });
        expect(x1.mark).toMatchObject({ mark: "partial", missing: ["symbol", "decimals"] });
        expect((await at(one(X, 3))).items).toEqual(kind3);
      });
    } finally {
      await backend.stop();
    }
  }, 300_000);
});
