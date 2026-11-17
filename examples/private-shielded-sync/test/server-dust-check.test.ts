/**
 * The private check of a wallet's Dust chains (spec 00062 story 3, FR-012, FR-023, SC-004), in both PIR schemes: a
 * Dust check table built with the module's own builder (`../server/dust-check.ts`) and answered by the scheme's server
 * table, called through the wallet's own code (`../client/dust-check.ts`, `../client/dust.ts`) over a stand-in for
 * HTTP that runs the module's wire format. The chains are derived with the vendored ledger's own functions; the file
 * holds another wallet's spend whose prefix is the first coin's, placed before the real spend.
 *
 * IPIR+SP needs its native add-on (`ipir/build.sh native`).
 */

import { randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { DustChecker } from "../client/dust-check.ts";
import { type DustChainStart, type DustCoin, DustFileView, fieldBytes, ledgerDustFunctions, walkDustChains } from "../client/dust.ts";
import { PssHttp } from "../client/http.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { inlineMultiplier, type SchemeName } from "../pir/index.ts";
import { openServerScheme } from "../pir/server-schemes.ts";
import { buildDustCheck } from "../server/dust-check.ts";
import {
  decodeDustChunk,
  decodeQueryBody,
  dustChunkOf,
  dustChunkRanges,
  type DustEntry,
  dustPrefixOfField,
  encodeAnswerBody,
  encodeDustChunk,
  fromHex,
  ROUTES,
} from "../shared/index.ts";

const dirs: string[] = [];
afterAll(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});

// ── a small world: three chains of one wallet, among other wallets' coins ─────────────────────────────────────────

const secretKey = ledger.DustSecretKey.fromSeed(new Uint8Array(32).fill(9));
const owner = secretKey.publicKey;
const params = new ledger.DustParameters(5_000_000_000n, 8_267n, 10_800n);
const functions = ledgerDustFunctions(ledger as never, secretKey, params);
const T0 = 1_794_000_000;

function firstCoin(name: string, position: number): DustChainStart {
  const backingNight = name.repeat(32);
  return {
    height: 1,
    generationIndex: BigInt(position),
    coin: { initialValue: 0n, owner, nonce: ledger.dustFirstNonce(backingNight, owner), seq: 0, ctime: new Date(T0 * 1000), backingNight, mtIndex: BigInt(position) },
    generation: { value: 1_000_000_000n, owner, nonce: backingNight, dtime: undefined },
  };
}

/** Chain A: two spends, another wallet's spend with its first coin's prefix before the first. B: its last spend after the table. C: none. */
const A = firstCoin("a1", 3);
const B = firstCoin("b2", 5);
const C = firstCoin("c3", 7);
/** The check table's positions: 0 to 63. The file's entries: positions 10 to 49, then 64 and 65. */
const TABLE = 64;
const FILE_POSITIONS = [...Array.from({ length: 40 }, (_, i) => 10 + i), 64, 65];
const FALSE_AT = 15;

const entryAt = (position: number, prefix: Uint8Array): DustEntry => ({ prefix, time: T0 + 60 * position, fee: 100n + BigInt(position), position });
const prefixOf = (coin: DustCoin): Uint8Array => dustPrefixOfField(ledger.dustNullifier(coin, secretKey));
const next = (coin: DustCoin, e: DustEntry, start: DustChainStart): DustCoin => functions.successor(coin, new Date(e.time * 1000), e.fee, BigInt(e.position), start.generation);

const placed = new Map<number, DustEntry>();
placed.set(FALSE_AT, entryAt(FALSE_AT, prefixOf(A.coin)));
placed.set(20, entryAt(20, prefixOf(A.coin)));
const A1 = next(A.coin, placed.get(20)!, A);
placed.set(30, entryAt(30, prefixOf(A1)));
const A2 = next(A1, placed.get(30)!, A);
placed.set(25, entryAt(25, prefixOf(B.coin)));
const B1 = next(B.coin, placed.get(25)!, B);
placed.set(64, entryAt(64, prefixOf(B1)));
const B2 = next(B1, placed.get(64)!, B);

const entries = FILE_POSITIONS.map((p) => placed.get(p) ?? entryAt(p, Uint8Array.from(randomBytes(4))));
/** The file as a wallet holds it: chunks of 16 entries, encoded and decoded again. */
const file = new DustFileView(
  dustChunkRanges(entries.length, 16).map(({ first, count }) => decodeDustChunk(encodeDustChunk(dustChunkOf(first, 100 + first, entries.slice(first, first + count))))),
  4,
);

/** The tree's leaves: this wallet's coins where they are; every other position (the false match's too) another coin's. */
const commitments = new Uint8Array(TABLE * 32);
for (let p = 0; p < TABLE; p++) commitments.set(randomBytes(32), p * 32);
for (const coin of [A.coin, B.coin, C.coin, A1, A2, B1]) commitments.set(fieldBytes(ledger.dustCommitment(coin)), Number(coin.mtIndex) * 32);

/** The module's check routes over a built table, as a `fetch` for the wallet's `PssHttp`. */
async function served(scheme: SchemeName): Promise<{ http: PssHttp; queries: () => number }> {
  const dataDir = mkdtempSync(join(tmpdir(), "pss-dust-check-"));
  dirs.push(dataDir);
  const built = await buildDustCheck(
    { eraHeight: 0, height: 9, commitments, count: TABLE, scheme, threads: 1, queriesPerCall: 4, dataDir },
    scheme === "simplepir" ? { multiplier: inlineMultiplier } : {},
  );
  expect(built.manifest).toMatchObject({ scheme, commitments: TABLE, table: { records: TABLE, recordBytes: 32 } });
  const server = await openServerScheme(scheme, { threads: 1, multiplier: inlineMultiplier });
  const table = await server.adoptTable(built.manifest.table, built.transfer);
  const idBytes = fromHex(built.id, 32);
  let queries = 0;
  const fetch = async (url: string, init: RequestInit): Promise<Response> => {
    const path = new URL(url).pathname;
    if (path === ROUTES.dustCheckManifest) return new Response(built.manifestBytes as Uint8Array<ArrayBuffer>, { headers: { "Pss-Dust-Check-Id": built.id } });
    if (path === `${ROUTES.dustCheckBlob}${built.manifest.public.digest}`) return new Response(readFileSync(join(built.dir, built.manifest.public.digest)));
    if (path === ROUTES.dustCheckQuery && init.method === "POST") {
      queries++;
      const call = decodeQueryBody(init.body as Uint8Array, table.requestBytes, { queriesPerCall: 4, snapshotId: idBytes });
      const answers = await table.answer(call.payload, call.count);
      return new Response(encodeAnswerBody({ snapshotId: idBytes, count: call.count, payload: answers }, table.responseBytes) as Uint8Array<ArrayBuffer>);
    }
    return new Response("{}", { status: 404 });
  };
  return { http: new PssHttp("http://dust.test", { fetch }), queries: () => queries };
}

for (const scheme of ["simplepir", "ipir-sp"] as const) {
  describe(`the wallet's check of its Dust chains (${scheme})`, () => {
    it("story 3 + story 2, scenario 2: the false match before the real spend is taken by the walk, refused by the check and dropped; the search resumes after it and the real chain's end is checked; a chain whose end the table does not reach is not checkable; a chain with no spend needs no check", { timeout: 300_000 }, async () => {
      const { http, queries } = await served(scheme);
      const checker = await DustChecker.open(http, scheme === "simplepir" ? { multiplier: inlineMultiplier } : { ipirWasm: () => compileIpirWasm() });
      try {
        // Without the check, the walk follows the false match and loses chain A.
        const unchecked = await walkDustChains(file, [A], [], functions);
        expect(unchecked[0]!.steps.map((s) => s.position)).toEqual([FALSE_AT]);
        expect(unchecked[0]!.status).toBe("unchecked");

        const ends: { position: number }[][] = [];
        const chains = await walkDustChains(file, [A, B, C], [], functions, async (batch) => {
          ends.push(batch.map((e) => ({ position: Number(e.coin.mtIndex) })));
          return checker.check(batch.map((e) => ({ position: Number(e.coin.mtIndex), commitment: fieldBytes(ledger.dustCommitment(e.coin)) })));
        });
        const [a, b, c] = chains;
        expect(a!.dropped).toEqual([FILE_POSITIONS.indexOf(FALSE_AT)]);
        expect(a!.steps.map((s) => s.position)).toEqual([20, 30]);
        expect(a!.coin).toEqual(A2);
        expect(a!.status).toBe("checked");
        expect(b!.steps.map((s) => s.position)).toEqual([25, 64]);
        expect(b!.coin).toEqual(B2);
        expect(b!.status).toBe("not-checkable");
        expect([c!.steps, c!.status, c!.coin]).toEqual([[], "no-spend", C.coin]);
        // Two batches: A's false end and B's end together; then A's new end. B's position is beyond the table, so only
        // A's is read: one padded call each, exactly queriesPerCall requests.
        expect(ends).toEqual([[{ position: FALSE_AT }, { position: 64 }], [{ position: 30 }]]);
        expect([checker.stats.calls, queries()]).toEqual([2, 2]);
        const calls = http.records.filter((r) => r.path === ROUTES.dustCheckQuery);
        expect(new Set(calls.map((r) => r.bodyBytes)).size).toBe(1);
        expect(checker.stats.bytesUp).toBe(calls.reduce((t, r) => t + r.bodyBytes, 0));
        expect(checker.stats.bytesDown).toBe(calls.reduce((t, r) => t + r.answerBytes, 0));
      } finally {
        checker.dispose();
      }
    });
  });
}
