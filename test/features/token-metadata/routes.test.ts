import { describe, expect, it } from "vitest";
import { tokenColor } from "../../../src/features/token-metadata/color.ts";
import { commonRecords, record, toHex, withdrawRecords } from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, get, serve } from "./harness.js";

/**
 * M10: TM-8's and TM-9's scenarios read through the routes, on PostgreSQL 18 and PGlite. [TM-8, TM-9; task 4.1]
 *
 * - **S3**: kinds 1 and 3 described; kind 1 withdrawn (read here: 404 everywhere, kind 3 unchanged); kind 1 revived
 *   with `name` only (read here: only `name`).
 * - **S5, S12**: unusable values after usable ones: each served unusable, `common` null, no earlier value.
 * - **S11**: a 70-character `name` and a 15-character `symbol` served as 64 and 12, stored whole; two symbols that
 *   share their first 12 characters group together, as in the proof of concept.
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
const path = (c: Uint8Array, kind: number) => `/v1/identities/${hex(c)}/${hex(D)}/${kind}`;
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

describe.each(PROCESS_BACKENDS)("M10: TM-8's and TM-9's scenarios through the routes on $name", (backend: ProcessBackend) => {
  it("S3, S5/S12, S11 and an identity of undefined keys only", async () => {
    await backend.start();
    try {
      const db = await backend.database();
      const kind3 = await serve(db, { start: S, head: S + 3, logs: LOGS }, async (origin) => {
        const at = (p: string) => get(origin, p);
        // S3, after the tombstones: kind 1 is referenced nowhere.
        expect(await at(path(X, 1))).toMatchObject({ status: 404, json: { error: { code: "NOT_FOUND" } } });
        const listed = (await at("/v1/tokens?limit=500")).json.items.map((t: { id: string }) => t.id);
        expect(listed).not.toContain(`identity/${hex(X)}/${hex(D)}/1`);
        expect(listed).toContain(`identity/${hex(X)}/${hex(D)}/3`);
        const ofX = (await at(`/v1/contracts/${hex(X)}/tokens`)).json;
        expect(ofX.items.map((t: { kind: number }) => t.kind)).toEqual([3]);
        expect(ofX.groups).toEqual([]);
        const color = hex(tokenColor(D, X));
        expect((await at(`/v1/lookup/${color}?held=shielded`)).json).toMatchObject({ result: "not-minted-in-indexed-range" });
        expect((await at(`/v1/tokens/${color}`)).status).toBe(404);

        // S5, S12: unusable values served unusable, no common value, no earlier value.
        const y = (await at(path(Y, 1))).json;
        expect(y.common).toEqual({ name: null, symbol: "G", decimals: null, standards: null });
        const byKey = Object.fromEntries(y.fields.map((f: { key: { utf8: string } }) => [f.key.utf8, f]));
        for (const key of ["name", "decimals", "standards", "image_sha256"]) expect([key, byKey[key].usable]).toEqual([key, false]);
        expect(byKey.name.value).toEqual({ hex: "", text: "" });
        expect(byKey.decimals.value).toEqual({ hex: hex(text("6")), text: "6" });
        expect(y.mark).toMatchObject({ mark: "partial", missing: ["name", "decimals"] });

        // S11: served cut, stored whole.
        const z = (await at(path(Z, 1))).json;
        expect(z.common).toMatchObject({ name: "N".repeat(64), symbol: "ABCDEFGHIJKL" });
        expect(z.fields.find((f: { key: { utf8: string } }) => f.key.utf8 === "name").value.text).toHaveLength(64);
        // Grouped by the served (cut) symbol, as the proof of concept, which stored it cut, groups.
        expect(z.group).toEqual({
          symbol: { hex: hex(text("ABCDEFGHIJKL")), utf8: "ABCDEFGHIJKL" },
          memberCount: 2,
          members: [
            { domainSep: hex(D), kind: 1 },
            { domainSep: hex(domain(2)), kind: 1 },
          ],
        });

        // Only undefined keys: referenced nowhere, its event accepted.
        expect((await at(path(U, 1))).status).toBe(404);
        expect((await at(`/v1/contracts/${hex(U)}/tokens`)).json).toMatchObject({ items: [], groups: [] });
        expect((await at(`/v1/events?contract=${hex(U)}`)).json.items).toMatchObject([{ classification: "accept", reason: null }]);
        return (await at(path(X, 3))).json;
      });
      expect(await db.query(`SELECT octet_length(value) AS n FROM token_metadata.fields WHERE contract_address = '\\x${hex(Z)}'::bytea ORDER BY key`)).toEqual([
        { n: 70 },
        { n: 15 },
        { n: 15 },
      ]);

      await serve(db, { start: S, head: S + 5, logs: LOGS }, async (origin) => {
        // S3, after the revival: only `name`; kind 3 unchanged throughout.
        const x1 = (await get(origin, path(X, 1))).json;
        expect(x1.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["name"]);
        expect(x1.common).toEqual({ name: "New", symbol: null, decimals: null, standards: null });
        expect(x1.mark).toMatchObject({ mark: "partial", missing: ["symbol", "decimals"] });
        expect((await get(origin, path(X, 3))).json).toEqual(kind3);
      });
    } finally {
      await backend.stop();
    }
  }, 300_000);
});
