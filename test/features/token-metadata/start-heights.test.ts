import { z } from "zod";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UnresolvedLogSite } from "../../../src/backbone/contract-logs/contract-logs.js";
import { servedGroups, servedIdentities } from "./served-state.js";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { metadataRecord } from "../../../src/features/token-metadata/codec/index.js";
import { MetadataState, type ObservedEvent } from "./model.js";
import { FIRST_CONTRACT_LOG_HEIGHTS, TOKEN_METADATA, tokenMetadataWith } from "../../../src/features/token-metadata/token-metadata.js";
import { miscAtom } from "../../../src/features/token-metadata/log-reader.js";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import type { BlockRef } from "../../../src/runner/block-source.js";
import { inMemoryBlock } from "../../../src/runner/in-memory-source.js";
import { UmbraError } from "../../../src/db/errors.js";
import { FAST_CORE } from "../../backbone/contract-data-checks.js";
import { committed, ingest } from "../../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { tapeTest } from "../../tape/real/real-tapes.js";
import { build, type Generated, NETWORK } from "./chains.js";
import { causes, genesisRecords, post, runTo, serve, startRun, TOKENS_PATH } from "./harness.js";
import { stateResponse } from "./vector-adapter.js";

/**
 * `token-metadata` (with `token-metadata-api`) from varying start heights, on PostgreSQL 18 and PGlite.
 *
 * - **A synthetic chain started at every height that matters.** One chain covers the rules: a token described, a
 *   rejected event, a contract token, an empty block, a withdrawal, a revival, a foreign-named log, an unresolved log
 *   site and a symbol group. A database is started at genesis, at the block before the first event, at each block
 *   holding one, and past the last. For each start S, the served state after the last block equals the reference
 *   model (`./model.ts`) applied to the events at or above S, and nothing else: the module keeps no state from before
 *   its database. Its `events` rows are exactly the rejected events and unresolved sites at or above S, and the database
 *   records S as its start. **Negative control:** for a start that cuts an event (the contract token's block), the
 *   model applied to every event differs from what the module serves, so the comparison sees a start height.
 * - **Latest starts on the synthetic chain:** databases configured at four heights above the indexer's latest start
 *   all start there and hold the same rows; the negative control, the indexer without one, keeps its start.
 * - **undeployed, the local network:** a new database configured above 0 starts at 0 (the indexer's latest start
 *   there), records the in-memory node's genesis, and serves every event; a restart against another chain's node (a
 *   new local genesis) refuses with `genesis-mismatch` and leaves the database as it was.
 * - **The networks' own tapes started mid-chain** with `core-contract-logs-fast`: preprod's and mainnet's delayed
 *   upgrade tapes, configured from the tape's first usable block (on the old runtime), from the upgrade's first block F
 *   (the network's first block with contract logs) and from above F, which starts at F (the indexer's latest start).
 *   Each commits every height from its start to the tape's last, the database records that start, and the tokens
 *   route answers at the last height. A recorded tape answers `state_getMetadata` only at the heights its recording
 *   asked (its first block, and each runtime's first), and a start needs its parent's metadata, so these are the starts
 *   a tape can serve; the synthetic chain covers every other start height.
 */

// ── The synthetic chain ──────────────────────────────────────────────────────────────────────────────────────────

const event = (contract: number, domain: number, tokenKind: 1 | 2 | 3, records: Generated & { kind: "event" } extends { records: infer R } ? R : never): Generated => ({
  kind: "event",
  contract,
  domain,
  tokenKind,
  records,
});

/** Block i is at height 21 + i (`chains.ts`'s S is 20). */
const CHAIN: Generated[][][] = [
  /* 21 */ [[event(1, 1, 1, [metadataRecord.utf8("name", "Acme"), metadataRecord.utf8("symbol", "ACME"), metadataRecord.uint("decimals", 6)])]],
  /* 22 */ [[{ kind: "invalid", contract: 1, domain: 1 }], [event(2, 1, 3, [metadataRecord.utf8("name", "Zeta")])]],
  /* 23 */ [],
  /* 24 */ [[event(1, 1, 1, [metadataRecord.tombstone("name"), metadataRecord.tombstone("symbol"), metadataRecord.tombstone("decimals")])]],
  /* 25 */ [[event(1, 1, 1, [metadataRecord.utf8("name", "Acme II"), metadataRecord.utf8("symbol", "ACME")]), { kind: "foreign", contract: 2 }]],
  /* 26 */ [[event(1, 2, 2, [metadataRecord.utf8("symbol", "ACME"), metadataRecord.uint("decimals", 2)])]],
];
const { logs, events } = build(CHAIN);
const FIRST = 21;
const LAST = FIRST + CHAIN.length - 1;
const HEAD = LAST + 2;

/** An unresolved log site at 25, after its block's logs, in a transaction of its own. */
const UNRESOLVED_AT = 25n;
const unresolved = new Map<bigint, UnresolvedLogSite[]>([
  [
    UNRESOLVED_AT,
    [{ transaction: 1, index: 2, address: new Uint8Array(32).fill(2), entryPoint: new TextEncoder().encode("f"), reason: "not-a-literal", segment: 1, fallible: false, call: 0, op: 3 }],
  ],
]);

/** The `events` rows at or above `start`: the rejected events and unresolved sites (accepted events leave none). */
function expectedRows(start: number): number {
  let n = 0;
  CHAIN.forEach((block, i) => {
    if (FIRST + i >= start) n += block.flat().filter((g) => g.kind === "invalid").length;
  });
  return n + (Number(UNRESOLVED_AT) >= start ? 1 : 0);
}

/** The lowest height at or above `start` holding a rejected event or an unresolved site, or null. */
function expectedLowest(start: number): number | null {
  const heights = CHAIN.flatMap((block, i) => (block.flat().some((g) => g.kind === "invalid") ? [FIRST + i] : []));
  return [...heights, Number(UNRESOLVED_AT)].filter((h) => h >= start).sort((x, y) => x - y)[0] ?? null;
}

/** A served state in a fixed order (identities by identity, fields by key), as the property test compares it. */
function ordered(identities: Parameters<typeof stateResponse>[0]): string {
  const sorted = [...identities]
    .sort((a, b) => `${a.contractAddress}/${a.domainSep}/${a.kind}`.localeCompare(`${b.contractAddress}/${b.domainSep}/${b.kind}`))
    .map((id) => ({ ...id, fields: new Map([...id.fields].sort(([a], [b]) => a.localeCompare(b))) }));
  return JSON.stringify(stateResponse(sorted, servedGroups(sorted)));
}

/** The model's served state after applying `blocks`' events in chain order. */
function modelOf(blocks: readonly ObservedEvent[][]): string {
  const model = new MetadataState();
  for (const block of blocks) for (const e of block) model.apply(e);
  return ordered(model.identities());
}

/** The model from `start`: the events of the blocks at or above it. */
const modelFrom = (start: number) => modelOf(events.filter((_, i) => FIRST + i >= start));

/** A module reading the served state inside each block's transaction, after `token-metadata`. */
function probe(seen: Map<bigint, string>): ModuleDeclaration {
  return defineModule({
    id: "token-metadata-start-probe",
    version: "1.0.0",
    side: "public",
    requires: ["token-metadata-state"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-db-write"(_p, b, w) {
        seen.set(b.height, ordered(await servedIdentities(w, NETWORK)));
      },
    },
  }) as ModuleDeclaration;
}

const STARTS = [0, FIRST - 1, ...Array.from({ length: CHAIN.length }, (_, i) => FIRST + i), LAST + 1];
const MODULES = [TOKEN_METADATA as ModuleDeclaration, TOKEN_METADATA_API as ModuleDeclaration];

describe("the synthetic chain's model from each start", () => {
  it("differs between the starts it should (the starts are not all the same state)", () => {
    expect(new Set(STARTS.map(modelFrom)).size).toBeGreaterThan(3);
  });

  it("negative control: for a start that cuts the contract token's block, every event's model differs from the start's", () => {
    expect(modelOf(events)).not.toBe(modelFrom(FIRST + 2));
  });
});

describe.each(PROCESS_BACKENDS)("token-metadata from varying start heights on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it.each(STARTS)("from S = %i serves the model of the events at or above S, stores their rows, and reports S", async (start) => {
    const db = await backend.database();
    const seen = new Map<bigint, string>();
    const answer = await serve(db, { start, head: HEAD, logs, unresolved, modules: [...MODULES, probe(seen)] }, (origin) => post(origin, TOKENS_PATH, { contract: "01".repeat(32) }));
    expect(seen.get(BigInt(HEAD)), `served state from ${start}`).toBe(modelFrom(start));
    expect(await db.query("SELECT count(*)::int AS n, min(height)::int AS lo FROM token_metadata.events")).toEqual([
      { n: expectedRows(start), lo: expectedLowest(start) },
    ]);
    expect(await db.query("SELECT start_height::int AS s FROM core_chain.identity")).toEqual([{ s: start }]);
    expect([answer.status, answer.headers["x-umbra-height"]]).toEqual([200, String(HEAD)]);
    if (start === FIRST + 2) expect(seen.get(BigInt(HEAD))).not.toBe(modelOf(events));
  }, 240_000);
});

// ── Latest starts: a new database configured above the module's latest start starts there ──────────────────────

/** The indexer with a latest start on the tests' (custom) network at the chain's first event block. */
const BACKFILLING = tokenMetadataWith(miscAtom, { custom: FIRST }) as ModuleDeclaration;

describe.each(PROCESS_BACKENDS)("a new database configured above the module's latest start, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("starts at the latest start whatever height it is configured at, and every such database holds the same rows", async () => {
    const rowsOf = async (configured: number) => {
      const db = await backend.database();
      const seen = new Map<bigint, string>();
      const answer = await serve(db, { start: configured, head: HEAD, logs, unresolved, modules: [BACKFILLING, TOKEN_METADATA_API as ModuleDeclaration, probe(seen)] }, (origin) =>
        post(origin, TOKENS_PATH, { contract: "01".repeat(32) }),
      );
      const [identity] = await db.query("SELECT start_height::int AS s FROM core_chain.identity");
      const events = await db.query("SELECT height::int AS h, tx_index, event_index, classification, reason FROM token_metadata.events ORDER BY 1, 2, 3");
      const fields = await db.query("SELECT encode(t.contract_address, 'hex') AS c, encode(t.domain_sep, 'hex') AS d, t.kind, encode(f.key, 'hex') AS k, encode(f.value, 'hex') AS v FROM token_metadata.tokens t JOIN token_metadata.fields f ON f.token_id = t.id AND f.kind = t.kind ORDER BY 1, 2, 3, 4");
      return { start: identity?.s, height: answer.headers["x-umbra-height"], served: seen.get(BigInt(HEAD)), events, fields };
    };
    const configured = [FIRST + 2, FIRST + 4, LAST, HEAD - 1];
    const runs = [];
    for (const height of configured) runs.push(await rowsOf(height));
    for (const [i, run] of runs.entries()) {
      expect([configured[i], run.start, run.height]).toEqual([configured[i], FIRST, String(HEAD)]);
      expect(run.served).toBe(modelFrom(FIRST));
      expect(run.events).toEqual(runs[0]!.events);
      expect(run.fields).toEqual(runs[0]!.fields);
    }
    expect(runs[0]!.events).toHaveLength(expectedRows(FIRST));
  }, 600_000);

  it("negative control: the indexer without a latest start keeps the configured start, and holds fewer events", async () => {
    const db = await backend.database();
    await serve(db, { start: FIRST + 4, head: HEAD, logs, unresolved, modules: MODULES }, async () => undefined);
    expect(await db.query("SELECT start_height::int AS s FROM core_chain.identity")).toEqual([{ s: FIRST + 4 }]);
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.events")).toEqual([{ n: expectedRows(FIRST + 4) }]);
    expect(expectedRows(FIRST + 4)).toBeLessThan(expectedRows(FIRST));
  }, 240_000);
});

// ── undeployed, the local network ───────────────────────────────────────────────────────────────────────────────

/** Another local chain's block 0: the node restarted from a new genesis. */
const OTHER_GENESIS: BlockRef = { height: 0n, hash: new Uint8Array(32).fill(0xee), parentHash: new Uint8Array(32) };
const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");

describe.each(PROCESS_BACKENDS)("a new database on undeployed, the local network, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("starts at block 0 whatever height it is configured at, records the local node's genesis, and serves every event", async () => {
    expect(FIRST_CONTRACT_LOG_HEIGHTS.undeployed).toBe(0);
    const db = await backend.database();
    const seen = new Map<bigint, string>();
    const modules = [TOKEN_METADATA as ModuleDeclaration, TOKEN_METADATA_API as ModuleDeclaration, probe(seen)];
    const answer = await serve(db, { start: HEAD - 1, head: HEAD, logs, unresolved, modules, network: "undeployed" }, (origin) =>
      post(origin, TOKENS_PATH, { contract: "01".repeat(32) }),
    );
    expect(await db.query("SELECT start_height::int AS s, encode(genesis_hash, 'hex') AS g FROM core_chain.identity")).toEqual([
      { s: 0, g: hex(inMemoryBlock(0n).hash) },
    ]);
    expect([answer.status, answer.headers["x-umbra-height"]]).toEqual([200, String(HEAD)]);
    expect(seen.get(BigInt(HEAD))).toBe(modelFrom(0));
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.events")).toEqual([{ n: expectedRows(0) }]);
  }, 240_000);

  it("refuses a restart against a local node of another chain (a new genesis) with genesis-mismatch, and changes nothing", async () => {
    const db = await backend.database();
    await runTo(db, { start: 0, head: 3, network: "undeployed", modules: [TOKEN_METADATA as ModuleDeclaration] });
    const state = "SELECT (SELECT encode(genesis_hash, 'hex') || start_height FROM core_chain.identity) AS identity, (SELECT max(height)::int FROM core_block_commit.blocks) AS cursor";
    const before = await db.query(state);
    const handle = startRun(db, { start: 0, head: 5, network: "undeployed", blocks: [OTHER_GENESIS], modules: [TOKEN_METADATA as ModuleDeclaration] });
    let refused: unknown;
    try {
      await handle.started.then(
        () => expect.fail("expected the startup to refuse"),
        (error: unknown) => {
          refused = causes(error).find((e) => e instanceof UmbraError);
        },
      );
    } finally {
      await handle.stop();
    }
    expect(refused).toMatchObject({ code: "genesis-mismatch", details: { stored: `0x${hex(inMemoryBlock(0n).hash)}`, node: `0x${hex(OTHER_GENESIS.hash)}` } });
    expect(await db.query(state)).toEqual(before);
  }, 240_000);
});

// ── The networks' tapes, from several heights ────────────────────────────────────────────────────────────────

interface TapeStarts {
  readonly tape: string;
  readonly network: "mainnet" | "preprod";
  readonly last: number;
  readonly f: number;
  readonly starts: readonly number[];
}

const TAPES: readonly TapeStarts[] = [
  { tape: "preprod-3348334-3348534", network: "preprod", last: 3_348_534, f: 3_348_434, starts: [3_348_335, 3_348_434, 3_348_435, 3_348_530] },
  { tape: "mainnet-3346039-3346239", network: "mainnet", last: 3_346_239, f: 3_346_139, starts: [3_346_040, 3_346_139, 3_346_140] },
];

describe.each(PROCESS_BACKENDS)("token-metadata on the networks' tapes from varying start heights, on $name", (backend: ProcessBackend) => {
  for (const tape of TAPES) {
    for (const start of tape.starts) {
      // A start above the network's first contract-log block (the upgrade's first block) starts there instead.
      const actual = Math.min(start, FIRST_CONTRACT_LOG_HEIGHTS[tape.network]!);
      const where = start === tape.f ? "the upgrade's first block" : start > tape.f ? `${start}, which starts at the upgrade's first block` : "the tape's first usable block";
      tapeTest(
        tape.tape,
        `${tape.network} configured from ${where} commits every height from ${actual} to ${tape.last} and reports ${actual}`,
        async (found) => {
          await backend.start();
          try {
            const records = [...genesisRecords(tape.network), ...found.read().records];
            const db = await backend.database();
            const run = await ingest(db, records, {
              start: BigInt(start),
              stop: BigInt(tape.last),
              core: FAST_CORE,
              user: MODULES,
              settings: { network: tape.network, listen: { api: "127.0.0.1:0" } },
            });
            try {
              await committed(run, BigInt(tape.last), 600_000);
              const api = run.handle.listening().api!;
              const answer = await post(`http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`, TOKENS_PATH, { contract: "00".repeat(32) });
              expect([answer.status, answer.headers["x-umbra-height"], answer.json.items]).toEqual([200, String(tape.last), []]);
            } finally {
              await run.close();
            }
            const [blocks] = await db.query("SELECT count(*)::int AS n, min(height)::int AS lo, max(height)::int AS hi FROM core_block_commit.blocks");
            expect(blocks).toEqual({ n: tape.last - actual + 1, lo: actual, hi: tape.last });
          } finally {
            await backend.stop();
          }
        },
        { timeoutMs: 720_000 },
      );
    }
  }
});
