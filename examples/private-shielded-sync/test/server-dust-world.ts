/**
 * A small Dust world for the check's tests (`./server-dust-check.test.ts`) and the page's (`./server-web-dust.test.ts`): one
 * wallet's three chains derived with the vendored ledger's own functions, among other wallets' coins, a Dust file that
 * holds them, a check table built with the module's own builder (`../server/dust-check.ts`) in either scheme, and the
 * module's Dust routes over them as a `fetch` for the wallet's `PssHttp`, in the module's wire formats.
 *
 * - Chain A: two spends, and another wallet's spend whose prefix is A's first coin's, placed before A's first spend.
 * - Chain B: two spends, the last at a position beyond the check table.
 * - Chain C: no spend.
 *
 * The file's entries are at positions 10 to 49, then 64 and 65; the check table holds positions 0 to 63. The wallet's
 * Dust seed is 32 bytes of 9.
 *
 * The Dust snapshot's tree (phase 9) is built over the same 64 commitments, cut at k = 2, its root computed here and
 * handed to the builder as the core's; the generation records are 8, the wallet's at indexes 3, 5 and 7 (chains A, B
 * and C), the others another owner's; the snapshot is dated after every coin. The parameters route gives the ledger's
 * initial parameters as those in force.
 */

import { createHash, randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { type DustChainStart, type DustCoin, DustFileView, fieldBytes, ledgerDustFunctions } from "../client/dust.ts";
import { generationInfoOf } from "../client/dust-spend.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { dustTree } from "../server/dust-tree.ts";
import { inlineMultiplier, type SchemeName } from "../pir/index.ts";
import { openServerScheme } from "../pir/server-schemes.ts";
import { buildDustCheck, type DustCheckJob, type DustCheckResult } from "../server/dust-check.ts";
import {
  decodeDustChunk,
  decodeQueryBody,
  type DustCoinsAnswer,
  dustChunkOf,
  dustChunkRanges,
  type DustGenerationRecord,
  encodeDustGenerationRecords,
  type DustEntry,
  type DustManifest,
  type DustParametersAnswer,
  dustPrefixOfField,
  encodeAnswerBody,
  encodeDustChunk,
  fromHex,
  ROUTES,
  toHex,
} from "../shared/index.ts";

export const DUST_SEED = new Uint8Array(32).fill(9);
const T0 = 1_794_000_000;
/** The Dust snapshot's block time: after every coin of the world. */
export const SNAPSHOT_TIME = T0 + 10_000;
const PATH_SPLIT = 2;
const CHUNK_ENTRIES = 16;

/** The world's Dust routes: a `fetch` and how many check calls it answered. */
export interface DustRoutes {
  readonly fetch: (url: string, init?: RequestInit) => Promise<Response>;
  queries(): number;
  /** Calls to the path table. */
  pathQueries(): number;
  readonly built: DustCheckResult;
}

export async function dustWorld() {
  const secretKey = ledger.DustSecretKey.fromSeed(DUST_SEED);
  const owner = secretKey.publicKey;
  const params = new ledger.DustParameters(5_000_000_000n, 8_267n, 10_800n);
  const functions = ledgerDustFunctions(ledger as never, secretKey, params);

  const firstCoin = (name: string, position: number): DustChainStart => {
    const backingNight = name.repeat(32);
    return {
      height: 1,
      generationIndex: BigInt(position),
      coin: { initialValue: 0n, owner, nonce: ledger.dustFirstNonce(backingNight, owner), seq: 0, ctime: new Date(T0 * 1000), backingNight, mtIndex: BigInt(position) },
      generation: { value: 1_000_000_000n, owner, nonce: backingNight, dtime: undefined },
    };
  };
  const A = firstCoin("a1", 3);
  const B = firstCoin("b2", 5);
  const C = firstCoin("c3", 7);
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
  /** The file's chunks of 16 entries, as the module encodes them; the file as a wallet holds it. */
  const chunkBytes = dustChunkRanges(entries.length, CHUNK_ENTRIES).map(({ first, count }) => encodeDustChunk(dustChunkOf(first, 100 + first, entries.slice(first, first + count))));
  const file = new DustFileView(chunkBytes.map((b) => decodeDustChunk(b)), 4);
  const manifest: DustManifest = {
    version: 1,
    eraHeight: 0,
    height: 200,
    entries: entries.length,
    chunkEntries: CHUNK_ENTRIES,
    prefixBytes: 4,
    chunks: chunkBytes.map((b, n) => ({
      first: n * CHUNK_ENTRIES,
      count: decodeDustChunk(b).count,
      firstHeight: 100 + n * CHUNK_ENTRIES,
      lastHeight: 100 + n * CHUNK_ENTRIES,
      bytes: b.length,
      sha256: createHash("sha256").update(b).digest("hex"),
    })),
  };
  const parameters: DustParametersAnswer = {
    nightDustRatio: "5000000000",
    generationDecayRate: "8267",
    dustGracePeriodSeconds: "10800",
    source: "initial",
    changedAt: null,
    height: 200,
    ledgerParameters: toHex(ledger.LedgerParameters.initialParameters().serialize()),
    ledgerParametersHeight: 200,
  };

  /** The tree's leaves: this wallet's coins where they are; every other position (the false match's too) another coin's. */
  const commitments = new Uint8Array(TABLE * 32);
  for (let p = 0; p < TABLE; p++) commitments.set(randomBytes(32), p * 32);
  for (const coin of [A.coin, B.coin, C.coin, A1, A2, B1]) commitments.set(fieldBytes(ledger.dustCommitment(coin)), Number(coin.mtIndex) * 32);

  // The tree over the commitments (the core's root, here), and the generation records with their root (the ledger's).
  const kernel = new Kernel(compileKernel());
  const tree = dustTree(TABLE, PATH_SPLIT, (i) => kernel.leaf(commitments.subarray(32 * i, 32 * i + 32)), (a, b) => kernel.hash2(a, b)!);
  const records: DustGenerationRecord[] = Array.from({ length: 8 }, (_, i) => ({ value: 1_000_000n + BigInt(i), owner: 77n, nonce: toHex(Uint8Array.from(randomBytes(32))), dtime: null }));
  for (const s of [A, B, C]) records[Number(s.generationIndex)] = { value: s.generation.value, owner, nonce: s.generation.nonce, dtime: null };
  let generationState = new ledger.DustLocalState(params);
  records.forEach((r, i) => (generationState = generationState.insertGenerationInfo(BigInt(i), generationInfoOf(r), undefined)));
  const generationRoot = toHex(fieldBytes(generationState.generatingTreeRoot()!));

  const dirs: string[] = [];

  /** The Dust snapshot's build job in `scheme`, its roots the core's (here, the ones computed above), in a new folder. */
  function job(scheme: SchemeName): DustCheckJob {
    const dataDir = mkdtempSync(join(tmpdir(), "pss-dust-world-"));
    dirs.push(dataDir);
    return {
      eraHeight: 0,
      height: 9,
      commitments,
      count: TABLE,
      scheme,
      threads: 1,
      queriesPerCall: 4,
      dataDir,
      blockTime: SNAPSHOT_TIME,
      pathSplit: PATH_SPLIT,
      expectedRoot: tree.tree.root,
      generation: encodeDustGenerationRecords(records),
      generationRecords: records.length,
      expectedGenerationRoot: fromHex(generationRoot, 32),
    };
  }

  /** The module's Dust routes over the file and a check table built in `scheme`. */
  async function serve(scheme: SchemeName): Promise<DustRoutes> {
    const built = await buildDustCheck(job(scheme), scheme === "simplepir" ? { multiplier: inlineMultiplier } : {});
    const server = await openServerScheme(scheme, { threads: 1, multiplier: inlineMultiplier });
    const table = await server.adoptTable(built.manifest.table, built.transfer);
    const pathTable = await server.adoptTable(built.manifest.tree.pathTable!, built.pathTransfer!);
    const m = built.manifest;
    const files = new Set([m.public.digest, m.tree.blockRoots.digest, m.tree.pathPublic!.digest, m.generation.file.digest]);
    const idBytes = fromHex(built.id, 32);
    let queries = 0;
    let pathQueries = 0;
    const json = (body: unknown): Response => new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });
    const fetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
      const u = new URL(url);
      const path = u.pathname;
      if (path === ROUTES.dustManifest) return json(manifest);
      if (path.startsWith(ROUTES.dustChunk)) {
        const n = Number(path.slice(ROUTES.dustChunk.length));
        const count = Number(u.searchParams.get("count"));
        const b = chunkBytes[n];
        if (b === undefined || count !== manifest.chunks[n]!.count) return new Response("{}", { status: 404 });
        return new Response(b as Uint8Array<ArrayBuffer>, { headers: { "Content-Type": "application/octet-stream" } });
      }
      if (path === ROUTES.dustParameters) return json(parameters);
      if (path === ROUTES.dustCoins) {
        const answer: DustCoinsAnswer = { owner: u.searchParams.get("owner") ?? "", eraHeight: 0, height: 200, firstCoins: [], updates: [] };
        return json(answer);
      }
      if (path === ROUTES.dustCheckManifest) return new Response(built.manifestBytes as Uint8Array<ArrayBuffer>, { headers: { "Content-Type": "application/json", "Pss-Dust-Check-Id": built.id } });
      if (path.startsWith(ROUTES.dustCheckBlob) && files.has(path.slice(ROUTES.dustCheckBlob.length))) return new Response(readFileSync(join(built.dir, path.slice(ROUTES.dustCheckBlob.length))));
      if ((path === ROUTES.dustCheckQuery || path === ROUTES.dustPathQuery) && init.method === "POST") {
        const t = path === ROUTES.dustCheckQuery ? table : pathTable;
        if (path === ROUTES.dustCheckQuery) queries++;
        else pathQueries++;
        const call = decodeQueryBody(init.body as Uint8Array, t.requestBytes, { queriesPerCall: 4, snapshotId: idBytes });
        const answers = await t.answer(call.payload, call.count);
        return new Response(encodeAnswerBody({ snapshotId: idBytes, count: call.count, payload: answers }, t.responseBytes) as Uint8Array<ArrayBuffer>, { headers: { "Content-Type": "application/octet-stream" } });
      }
      return new Response("{}", { status: 404 });
    };
    return { fetch, queries: () => queries, pathQueries: () => pathQueries, built };
  }

  return {
    owner,
    secretKey,
    params,
    functions,
    commitments,
    records,
    A,
    B,
    C,
    A1,
    A2,
    B1,
    B2,
    TABLE,
    FILE_POSITIONS,
    FALSE_AT,
    entries,
    file,
    manifest,
    job,
    serve,
    dispose() {
      for (const d of dirs) rmSync(d, { recursive: true, force: true });
    },
  };
}
