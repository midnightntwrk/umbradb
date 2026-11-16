/**
 * What the benchmark (`bench.ts`, spec FR-150–154, story 6) writes to `results.json`, from which `REPORT.md` is
 * rendered (`bench-report.ts`). Sizes are bytes, times milliseconds, memory the peak resident size in bytes; a value
 * that could not be measured is null, and the report says why.
 *
 * It holds no secret and nothing that ties a wallet to its coins: a wallet is its label, with counts only (no
 * positions, values, nonces, commitments or nullifiers).
 *
 * Nothing here is one scheme's (spec 00058 FR-050): a table is described by its groups (what one request selects:
 * SimplePIR's column, IPIR+SP's row) and its `rows × cols` cells; a scheme's own build measurements are kept as it
 * reports them (`BuildStep.scheme`).
 */

import type { SyncStep } from "../client/sync.ts";

/** 2 since 00058: the scheme-neutral table fields, the path read, the build request and the server's held bytes. */
export const RESULTS_FORMAT = 2;

/** The steps of a snapshot build (`server/build.ts`), in order; `<table>Setup` is the scheme's setup of the table. */
export const BUILD_STEP_NAMES = ["scan", "tree", "readTable", "readSetup", "pathTable", "pathSetup", "nullifierTable", "nullifierSetup", "manifest"] as const;
export type BuildStepName = (typeof BUILD_STEP_NAMES)[number];

/** The PIR tables of a snapshot. */
export const TABLE_NAMES = ["read", "path", "nullifier"] as const;
export type BenchTableName = (typeof TABLE_NAMES)[number];

/** A step of the server's snapshot build, as `build-stats.json` (or the benchmark's own build) reports it. */
export interface BuildStep {
  readonly ms: number;
  readonly bytes?: number;
  readonly hashes?: number;
  readonly hashesPerSecond?: number;
  readonly peakRssBytes: number | null;
  /** A setup step's own measurements, as its scheme reports them (IPIR+SP: the add-on's timings, bytes and noise sample). */
  readonly scheme?: Readonly<Record<string, number>>;
}

/** One PIR table of the snapshot, from its manifest entry (and the scheme's sizes). */
export interface TableShape {
  readonly records: number;
  readonly recordBytes: number;
  /** What one request selects among (SimplePIR: columns; IPIR+SP: rows), and the records each holds. */
  readonly groups: number;
  readonly perGroup: number;
  /** The table's cells: `rows × cols` (SimplePIR: 16-bit cells holding 9 bits; IPIR+SP: 16-bit cells). */
  readonly rows: number;
  readonly cols: number;
  /** The table file and the public artifact a wallet downloads, in bytes (the manifest's sizes). */
  readonly tableBytes: number;
  readonly publicBytes: number;
  /**
   * One request in a call body and one response in its answer (bytes after the 40-byte header, per query), from the
   * first call the benchmark made to the table: `(body − 40) / queriesPerCall`; null when no call was made.
   */
  readonly requestBytes: number | null;
  readonly responseBytes: number | null;
}

/** A read of events: how many rows, how long, and the peak memory meanwhile. */
export interface EventRead {
  readonly rows: number;
  readonly ms: number;
  readonly rowsPerSecond: number;
  readonly peakRssBytes: number | null;
  /** The height read up to. */
  readonly height: number;
}

export interface Machine {
  readonly cpu: string;
  readonly cores: number;
  readonly memoryBytes: number;
  readonly platform: string;
  readonly arch: string;
  readonly node: string;
}

/** One PIR call as one wallet's sync made it (spec §8: "Read coins (one call)", "Nullifier lookups (one call)"). */
export interface CallRow {
  readonly calls: number;
  /** Per call (the sync's totals divided by its calls). */
  readonly bytesUp: number;
  readonly bytesDown: number;
  readonly roundTripMs: number;
  readonly clientBuildMs: number;
  readonly clientDecodeMs: number;
  /** The server's time for the route (decode the body, multiply, encode the answer), from its request log. */
  readonly serverMs: number | null;
  readonly clientPeakRssBytes: number | null;
  readonly serverPeakRssBytes: number | null;
}

export interface DownloadRow {
  readonly size: number;
  /** Bytes moved (0 when cached). */
  readonly bytes: number;
  readonly ms: number;
  readonly cached: boolean;
  /** The server's time in the route's handler (the file is streamed after it), from its request log. */
  readonly serverMs: number | null;
}

/** One request as the client sent it, and the server's log line for it (spec FR-154). */
export interface ObservedRequest {
  readonly method: "GET" | "POST";
  /** The route, an artifact's digest replaced by `<digest>`. */
  readonly route: string;
  readonly status: number;
  readonly bodyBytes: number;
  readonly answerBytes: number;
  readonly clientMs: number;
  /** What the server logged for it (FR-080), or null when no line was found. */
  readonly server: {
    readonly route: string;
    readonly status: number;
    readonly bodyBytes: number;
    readonly answerBytes: number;
    readonly range: string | null;
    readonly ms: number;
    readonly at: string;
  } | null;
}

/**
 * The lower paths a spend reads from the path table (Q58), as `send` reads them (`lowerPathsByPir`): the table's public
 * artifact once, then one padded call for the wallet's coins whose block was full at the snapshot (a full call of random
 * groups when it has none), every path checked against its block's root.
 */
export interface PathRead extends CallRow {
  /** Lower paths read and checked (0: the call carried random groups only). */
  readonly paths: number;
  readonly public: DownloadRow;
  /** The whole read: the public artifact, the call, the checks. */
  readonly ms: number;
  readonly requests: readonly ObservedRequest[];
}

export interface WalletRun {
  readonly label: string;
  /** How the wallet was given: a mnemonic (from the environment) or a Zswap seed file. */
  readonly source: "mnemonic" | "seed";
  readonly coins: {
    readonly found: number;
    readonly fromSnapshot: number;
    readonly fromTail: number;
    readonly spent: number;
    readonly unspent: number;
    readonly rejected: number;
    readonly tokenTypes: number;
  };
  readonly scanMatches: number;
  /** Each step's duration and the peaks while it ran. */
  readonly steps: Readonly<Record<SyncStep, { readonly ms: number; readonly clientPeakRssBytes: number | null; readonly serverPeakRssBytes: number | null }>>;
  readonly attempts: number;
  readonly totalMs: number;
  /** Wall-clock minus the time spent in requests (spec FR-151: computing time excludes waiting on the network). */
  readonly computingMs: number;
  readonly bytesUp: number;
  readonly bytesDown: number;
  readonly stateBytes: number;
  readonly peakRssBytes: number | null;
  readonly manifest: { readonly ms: number; readonly bytes: number };
  /** `readPublic` and `nullifierPublic`: the scheme's public artifacts (SimplePIR: setup data). */
  readonly downloads: Readonly<Record<"scan" | "blockRoots" | "readPublic" | "nullifierPublic", DownloadRow>>;
  readonly cacheBytes: number;
  readonly scan: { readonly ms: number; readonly entries: number; readonly threads: number; readonly microsPerOutput: number };
  readonly read: CallRow;
  readonly decrypt: { readonly ms: number; readonly accepted: number; readonly rejected: number };
  readonly nullifier: CallRow & { readonly lookups: number };
  readonly tail: {
    readonly bytes: number;
    readonly ms: number;
    readonly clientMs: number;
    readonly outputs: number;
    readonly nullifiers: number;
    readonly matches: number;
    readonly serverMs: number | null;
  };
  readonly requests: readonly ObservedRequest[];
  /** The path read after the sync; null when the snapshot has no path table or it was not asked for. */
  readonly path: PathRead | null;
}

/** The scan of the snapshot's scan file at one thread count (spec §8: "per thread count"). */
export interface ScanSweepRow {
  readonly threads: number;
  readonly entries: number;
  readonly ms: number;
  /** Wall time per output. */
  readonly microsPerOutput: number;
  /** Wall time × threads per output: the cost of one output on one thread. */
  readonly microsPerOutputPerThread: number;
  readonly peakRssBytes: number | null;
}

/** One call of `queriesPerCall` vectors, client and server in the benchmark's process (no network). */
export interface SplitCall {
  readonly vectors: number;
  readonly bytesUp: number;
  readonly bytesDown: number;
  readonly clientBuildMs: number;
  readonly serverMultiplyMs: number;
  readonly clientDecodeMs: number;
  readonly peakRssBytes: number | null;
  /** Records of the call's groups decoded and found equal to the table file's own. */
  readonly recordsChecked: number;
}

/**
 * The read table and one read call at one `pathSplit` (spec FR-153), built by the module's own builder in-process with
 * the served snapshot's scheme; and since Q58 the path table, which k sizes (the read table no longer depends on k),
 * with one path call (a spend's). `rows × cols` are the table's cells; a request selects one of `groups` groups of
 * `perGroup` records (SimplePIR: a column; IPIR+SP: a row).
 */
export interface PathSplitRun {
  readonly k: number;
  readonly snapshotId: string;
  /** Whether the build gave the served snapshot's identifier (same height, k and calls; null when k differs). */
  readonly sameAsServed: boolean | null;
  readonly recordBytes: number;
  readonly rows: number;
  readonly cols: number;
  readonly groups: number;
  readonly perGroup: number;
  readonly blocks: number;
  /** `readPublic`: the read table's public artifact (SimplePIR: setup data; IPIR+SP: masks). */
  readonly sizes: { readonly blockRoots: number; readonly readTable: number; readonly readPublic: number };
  /** Every step of the build (FR-153 reports the tree and the tables'); the path table's are null at k = 0. */
  readonly steps: Readonly<Record<BuildStepName, BuildStep | null>>;
  /** The path table at this k (Q58), with one call of its own; null at k = 0 (no lower path). */
  readonly path: {
    readonly recordBytes: number;
    readonly rows: number;
    readonly cols: number;
    readonly groups: number;
    readonly perGroup: number;
    readonly tableBytes: number;
    readonly publicBytes: number;
    readonly call: SplitCall | null;
  } | null;
  readonly buildMs: number;
  readonly threads: number;
  /** One call of `queriesPerCall` vectors, client and server in the benchmark's process (no network). */
  readonly call: SplitCall;
}

export interface ChainSync {
  readonly database: { readonly bytes: number; readonly schemas: readonly { readonly schema: string; readonly bytes: number }[] } | null;
  readonly cursor: number | null;
  readonly rate: {
    readonly heightsPerSecond: number;
    readonly heights: number;
    readonly seconds: number;
    readonly fromHeight: number;
    readonly toHeight: number;
    readonly samples: number;
    /** Gaps between samples longer than the limit (stops and restarts), left out of the rate. */
    readonly gaps: number;
    readonly windows: readonly { readonly fromHeight: number; readonly toHeight: number; readonly heightsPerSecond: number; readonly seconds: number }[];
  } | null;
  readonly runs: number | null;
  /** What the process ran besides the core, from its admin status (when given). */
  readonly modules: readonly string[] | null;
}

export interface TransferRow {
  readonly source: string;
  readonly wallet: string | null;
  readonly submitted: boolean;
  readonly txHash: string | null;
  readonly block: number | null;
  readonly bytesSubmitted: number | null;
  readonly unprovenBytes: number | null;
  readonly peakRssBytes: number | null;
  readonly timings: {
    readonly feeWalletSyncMs: number | null;
    readonly syncMs: number | null;
    readonly pathMs: number | null;
    readonly stateMs: number | null;
    readonly spendMs: number | null;
    readonly balanceMs: number | null;
    readonly proveMs: number | null;
    readonly validateMs: number | null;
    readonly toInBlockMs: number | null;
    readonly toFinalizedMs: number | null;
  };
}

export interface BenchResults {
  readonly kind: "private-shielded-sync bench";
  readonly format: typeof RESULTS_FORMAT;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly loadAverage: { readonly start: readonly number[]; readonly end: readonly number[] };
  readonly machine: Machine;
  readonly software: {
    readonly umbradb: string;
    readonly commit: string | null;
    readonly kernelDigest: string;
    readonly ledger: string;
    readonly serverModules: readonly { readonly id: string; readonly version: string }[] | null;
    readonly serverMachine: Record<string, unknown> | null;
  };
  readonly network: string;
  readonly server: {
    readonly origin: string;
    /** How the server's memory was sampled. */
    readonly memory: string;
    /** Where the server's request lines came from, and how many matched the clients' requests. */
    readonly log: string;
    readonly threads: number | null;
    /**
     * The bytes each served table says it holds (`ServerTable.heldBytes`: SimplePIR its grid's cells; IPIR+SP the
     * add-on's cells and compiled packing), from the module's admin status; null without the admin secret.
     */
    readonly heldBytes: Readonly<Record<BenchTableName, number | null>> | null;
  };
  /**
   * The snapshot the benchmark asked the server for (`--build`), and the server process's resident memory around it
   * (from the server's memory probe; null when it was not sampled): before the request, the peak until the snapshot was
   * served, and once served (the median of its peaks over 250 ms windows from 1 to 3 s after). Null without `--build`.
   */
  readonly build: {
    readonly height: number | null;
    readonly scheme: string | null;
    readonly padding: number | null;
    /** From the request to the snapshot being served, as the benchmark saw it. */
    readonly ms: number;
    readonly rssBeforeBytes: number | null;
    readonly rssPeakBytes: number | null;
    readonly rssAfterBytes: number | null;
  } | null;
  readonly snapshot: {
    readonly id: string;
    readonly height: number;
    readonly blockHash: string;
    readonly outputs: number;
    readonly nullifiers: number;
    readonly pathSplit: number;
    readonly queriesPerCall: number;
    readonly blocks: number;
    readonly artifacts: Readonly<Record<string, number>>;
    /** Each artifact's file in the module's data directory, its size on disk (`--pss-data`; null without it). */
    readonly onDisk: Readonly<Record<string, number>> | null;
    /** The PIR scheme of the snapshot's tables. */
    readonly scheme: string;
    readonly pir: Readonly<Record<string, number>>;
    /** Entries of a padded snapshot (debug, Q57): the scan file and the tables hold this many; null when not padded. */
    readonly padding: number | null;
    readonly tables: Readonly<Record<BenchTableName, TableShape | null>>;
    /** Whether the benchmark asked the server for this snapshot (`--build`). */
    readonly builtByBench: boolean;
  };
  readonly chainSync: ChainSync;
  readonly serverBuild: {
    /** `build-stats.json` of the served snapshot, or the benchmark's own build at the served `pathSplit`. */
    readonly source: string;
    readonly totalMs: number | null;
    readonly threads: number | null;
    readonly steps: Readonly<Record<BuildStepName, BuildStep | null>>;
    /** The module's read of the stored events when it started, and the build's read of its index at S. */
    readonly indexLoad: EventRead | null;
    readonly indexSlice: EventRead | null;
  } | null;
  /** The stored events of the snapshot, read with the module's own query by the benchmark. */
  readonly readEvents: EventRead | null;
  readonly wallets: readonly WalletRun[];
  readonly scanSweep: readonly ScanSweepRow[];
  readonly pathSplits: readonly PathSplitRun[];
  /** Every output in full and every nullifier of the snapshot (a padded snapshot's: its slots, noise included). */
  readonly naive: {
    readonly outputs: number;
    readonly nullifiers: number;
    readonly outputBytes: number;
    readonly nullifierBytes: number;
    readonly totalBytes: number;
  };
  readonly requestShapesIdentical: boolean | null;
  readonly transfer: TransferRow | null;
  readonly notes: readonly string[];
}
