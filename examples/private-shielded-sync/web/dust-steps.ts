/**
 * The page's Dust steps (spec 00062), without the DOM: `./worker.ts` runs them for the page, and
 * `test/server-web-dust.test.ts` runs them under Node. They are the command line's `dust` (`../client/dust.ts`,
 * `../client/dust-check.ts`) cut into the page's three steps:
 *
 * 1. **Get the file**: the Dust manifest, each chunk at the entry count the manifest lists (from the page's cache when
 *    it holds the chunk's SHA-256, so a second run downloads only what is new), the parameters, and the wallet's first
 *    coins and generation updates (the one request that names the wallet: its Dust public key).
 * 2. **Walk**: each chain through the downloaded file, locally; nothing is sent.
 * 3. **Check**: the check table's manifest and public artifact (cached the same way), then the walk again with every
 *    chain's end checked by PIR in calls padded to `queriesPerCall` requests; a refused match is dropped and the search
 *    resumes after it. A wallet with nothing to check still sends one call.
 *
 * The Dust seed (from the mnemonic the keys step takes) stays here; each step makes the secret key from it and clears
 * the key before it returns. Every number that may pass 2^53 is given in decimal, as the page shows it.
 */

import { DustChecker, isDustCheckReplaced } from "../client/dust-check.ts";
import {
  type DustBatchCheck,
  type DustCache,
  type DustChain,
  type DustChainStart,
  dustChainSummary,
  type DustFileView,
  decodeDustCoins,
  downloadDustFile,
  dustTransfer,
  type DustUpdate,
  fieldBytes,
  ledgerDustFunctions,
  walkDustChains,
} from "../client/dust.ts";
import { HttpError, type PssHttp } from "../client/http.ts";
import type { Ledger } from "../client/ledger.ts";
import type { WalletSchemeOptions } from "../pir/scheme.ts";
import type { DustCheckManifest, DustCoinsAnswer, DustManifest, DustParametersAnswer } from "../shared/index.ts";

type Json = Record<string, unknown>;
const round = (x: number): number => Math.round(x * 100) / 100;

export interface DustStepsOptions {
  readonly ledger: Ledger;
  readonly http: PssHttp;
  /** Chunks and public artifacts by SHA-256, kept for the page's life. */
  readonly cache: DustCache;
  /** The check's scheme options: SimplePIR's multiplication, IPIR+SP's WebAssembly and workers. */
  readonly scheme: WalletSchemeOptions;
  /** Decodes the coins answer (the ledger's events); a test that has no such events gives its own. */
  readonly decodeCoins?: (answer: DustCoinsAnswer, owner: bigint) => { starts: DustChainStart[]; updates: DustUpdate[] };
  readonly now?: () => Date;
}

interface Got {
  readonly manifest: DustManifest;
  readonly file: DustFileView;
  readonly parameters: DustParametersAnswer;
  readonly starts: DustChainStart[];
  readonly updates: DustUpdate[];
  /** The requests of step 1 in the client's record: `[firstRecord, endRecord)`. */
  readonly firstRecord: number;
  readonly endRecord: number;
}

export class DustSteps {
  readonly #o: DustStepsOptions;
  #seed: Uint8Array | null = null;
  #got: Got | null = null;
  #checker: DustChecker | null = null;
  /** Every check manifest this page used, by identifier, so a call to one decodes with its own table. */
  readonly checkManifests = new Map<string, DustCheckManifest>();

  constructor(options: DustStepsOptions) {
    this.#o = options;
  }

  /** The Dust seed of the keys just derived, or null (a wallet given by its Zswap seed has none). */
  setSeed(seed: Uint8Array | null): void {
    this.#seed?.fill(0);
    this.#seed = seed === null ? null : Uint8Array.from(seed);
    this.#got = null;
  }

  /** Runs `body` with the wallet's Dust secret key, cleared after. */
  async #withKey<T>(body: (key: ReturnType<Ledger["DustSecretKey"]["fromSeed"]>) => Promise<T> | T): Promise<T> {
    if (this.#seed === null) throw new Error("derive the keys from a mnemonic first (step 1): the Dust key comes from its Dust seed");
    const key = this.#o.ledger.DustSecretKey.fromSeed(this.#seed);
    try {
      return await body(key);
    } finally {
      key.clear();
    }
  }

  #params(p: DustParametersAnswer) {
    return new this.#o.ledger.DustParameters(BigInt(p.nightDustRatio), BigInt(p.generationDecayRate), BigInt(p.dustGracePeriodSeconds));
  }

  /** Step 1: the file, the parameters, the wallet's first coins and updates. */
  async getFile(): Promise<Json> {
    const { http, ledger } = this.#o;
    const t = performance.now();
    const firstRecord = http.records.length;
    const { manifest, file, chunks } = await downloadDustFile(http, this.#o.cache);
    const parameters = await http.dustParameters();
    const owner = await this.#withKey((key) => key.publicKey);
    const answer = await http.dustCoins(owner);
    const { starts, updates } = (this.#o.decodeCoins ?? ((a, o) => decodeDustCoins(ledger, a, o)))(answer, owner);
    this.#got = { manifest, file, parameters, starts, updates, firstRecord, endRecord: http.records.length };
    const downloaded = chunks.filter((c) => !c.cached);
    return {
      manifest: { height: manifest.height, eraHeight: manifest.eraHeight, entries: manifest.entries, chunks: manifest.chunks.length, chunkEntries: manifest.chunkEntries, prefixBytes: manifest.prefixBytes },
      chunks: chunks.map((c) => ({ ...c, ms: round(c.ms) })),
      chunksFromCache: chunks.length - downloaded.length,
      chunksDownloaded: downloaded.length,
      chunkBytesDownloaded: downloaded.reduce((n, c) => n + c.bytes, 0),
      parameters,
      keyEnds: owner.toString().slice(-8),
      firstCoins: starts.map((s) => ({ height: s.height, generationIndex: s.generationIndex.toString(), position: s.coin.mtIndex.toString(), nightValue: s.generation.value.toString() })),
      updates: updates.map((u) => ({ height: u.height, dtime: u.dtime?.toISOString() ?? null })),
      bytes: dustTransfer(http.records.slice(firstRecord)),
      checks: [
        "every chunk's length and SHA-256 equal the manifest's (a cached one's too), and each decodes to the entries the manifest lists",
        "every first coin and generation update the server gave is of this wallet's Dust public key",
      ],
      note: "the coins request names this wallet's Dust public key: the server sees it (hiding it is outside spec 00062)",
      ms: round(performance.now() - t),
    };
  }

  #summaries(chains: readonly DustChain[], got: Got): Json[] {
    const { ledger } = this.#o;
    const params = this.#params(got.parameters);
    const at = this.#o.now?.() ?? new Date();
    return chains.map((c) => dustChainSummary(c, ledger.updatedValue(c.coin.ctime, c.coin.initialValue, c.generation, at, params), ledger.dustCommitment(c.coin)) as unknown as Json);
  }

  /** Step 2: each chain through the downloaded file, unchecked. Nothing is sent. */
  async walk(): Promise<Json> {
    const got = this.#need();
    const t = performance.now();
    const chains = await this.#withKey((key) => walkDustChains(got.file, got.starts, got.updates, ledgerDustFunctions(this.#o.ledger, key, this.#params(got.parameters))));
    return {
      entries: got.file.entries,
      chains: this.#summaries(chains, got),
      note: "nothing was sent: the walk reads the file downloaded in step 9. A 4-byte prefix can match another wallet's spend; step 11 checks each chain's end",
      ms: round(performance.now() - t),
    };
  }

  /** Step 3: the check table, and the walk again with every chain's end checked by PIR. */
  async check(): Promise<Json> {
    const got = this.#need();
    const { http, ledger } = this.#o;
    const t = performance.now();
    const firstRecord = http.records.length;
    let unavailable: string | null = null;
    let chains: DustChain[] = [];
    const batches: Json[] = [];
    for (let attempt = 1; ; attempt++) {
      this.#checker?.dispose();
      this.#checker = null;
      batches.length = 0;
      try {
        this.#checker = await DustChecker.open(http, this.#o.scheme, this.#o.cache);
      } catch (error) {
        if (!(error instanceof HttpError) || error.status !== 503) throw error;
        unavailable = error.message;
      }
      const checker = this.#checker;
      if (checker !== null) {
        this.checkManifests.set(checker.id, checker.manifest);
        if (checker.manifest.eraHeight !== got.manifest.eraHeight) throw new Error(`the Dust check table's era starts at ${checker.manifest.eraHeight}, the file's at ${got.manifest.eraHeight}`);
      }
      const check: DustBatchCheck | undefined =
        checker === null
          ? undefined
          : async (ends) => {
              const positions = ends.map((e) => Number(e.coin.mtIndex));
              const outcomes = await checker.check(ends.map((e) => ({ position: Number(e.coin.mtIndex), commitment: fieldBytes(ledger.dustCommitment(e.coin)) })));
              batches.push({ positions, outcomes, readable: positions.filter((p) => p < checker.manifest.commitments).length });
              return outcomes;
            };
      try {
        chains = await this.#withKey((key) => walkDustChains(got.file, got.starts, got.updates, ledgerDustFunctions(ledger, key, this.#params(got.parameters)), check));
        if (checker !== null && checker.stats.calls === 0) {
          await checker.check([]);
          batches.push({ positions: [], outcomes: [], readable: 0 });
        }
        break;
      } catch (error) {
        if (!isDustCheckReplaced(error) || attempt >= 2) throw error;
      }
    }
    const checker = this.#checker;
    const m = checker?.manifest;
    return {
      check:
        checker === null || m === undefined
          ? null
          : {
              id: checker.id,
              scheme: m.scheme,
              height: m.height,
              commitments: m.commitments,
              queriesPerCall: m.queriesPerCall,
              groups: m.table.groups,
              perGroup: m.table.perGroup,
              layout: m.table.layout,
              publicArtifact: { bytes: m.public.size, cached: checker.stats.publicCached },
            },
      checkUnavailable: unavailable,
      chains: this.#summaries(chains, got),
      batches,
      calls: checker?.stats.calls ?? 0,
      // The whole Dust sync, split as the command line prints it: step 9's requests and this check's.
      bytes: dustTransfer([...http.records.slice(got.firstRecord, got.endRecord), ...http.records.slice(firstRecord)]),
      ms: round(performance.now() - t),
    };
  }

  #need(): Got {
    if (this.#got === null) throw new Error("get the Dust file first (step 9)");
    return this.#got;
  }

  dispose(): void {
    this.#checker?.dispose();
    this.#checker = null;
  }
}
