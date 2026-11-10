import { z } from "zod";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { UnresolvedLogSite } from "../../../src/backbone/contract-logs/contract-logs.js";
import { servedGroups, servedIdentities } from "../../../src/features/token-metadata-api/read.js";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { record } from "../../../src/features/token-metadata/codec/index.js";
import { MetadataState, type ObservedEvent } from "../../../src/features/token-metadata/state.js";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import { FAST_CORE } from "../../backbone/contract-data-checks.js";
import { committed, ingest } from "../../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { tapeTest } from "../../tape/real/real-tapes.js";
import { build, type Generated, NETWORK } from "./chains.js";
import { genesisRecords, get, serve } from "./harness.js";
import { stateResponse } from "./vector-adapter.js";

/**
 * `token-metadata` (with `token-metadata-api`) from varying start heights, on PostgreSQL 18 and PGlite.
 *
 * - **A synthetic chain started at every height that matters.** One chain covers the rules: a token described, a
 *   rejected event, a contract token, an empty block, a withdrawal, a revival, a foreign-named log, an unresolved log
 *   site and a symbol group. A database is started at genesis, at the block before the first event, at each block
 *   holding one, and past the last. For each start S, the served state after the last block equals the reference
 *   model (`state.ts`) applied to the events at or above S, and nothing else: the module keeps no state from before
 *   its database. Its `events` rows are exactly the candidates and unresolved sites at or above S, and `/v1/status`
 *   reports S. **Negative control:** for a start that cuts an event (the contract token's block), the model applied to
 *   every event differs from what the module serves, so the comparison sees a start height.
 * - **The networks' own tapes started mid-chain** with `core-contract-logs-fast`: preprod's and mainnet's delayed
 *   upgrade tapes, from the tape's first usable block, the block before the upgrade's first block F, F itself, the block
 *   after F and near the tape's end. Each commits every height to the tape's last, and `/v1/status` reports its start,
 *   the last height and the network.
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
  /* 21 */ [[event(1, 1, 1, [record.utf8("name", "Acme"), record.utf8("symbol", "ACME"), record.uint("decimals", 6)])]],
  /* 22 */ [[{ kind: "invalid", contract: 1, domain: 1 }], [event(2, 1, 3, [record.utf8("name", "Zeta")])]],
  /* 23 */ [],
  /* 24 */ [[event(1, 1, 1, [record.tombstone("name"), record.tombstone("symbol"), record.tombstone("decimals")])]],
  /* 25 */ [[event(1, 1, 1, [record.utf8("name", "Acme II"), record.utf8("symbol", "ACME")]), { kind: "foreign", contract: 2 }]],
  /* 26 */ [[event(1, 2, 2, [record.utf8("symbol", "ACME"), record.uint("decimals", 2)])]],
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

/** The candidates (accepted or rejected events, not foreign-named logs) and unresolved sites at or above `start`. */
function expectedRows(start: number): number {
  let n = 0;
  CHAIN.forEach((block, i) => {
    if (FIRST + i >= start) n += block.flat().filter((g) => g.kind !== "foreign").length;
  });
  return n + (Number(UNRESOLVED_AT) >= start ? 1 : 0);
}

/** The lowest height at or above `start` holding a candidate or an unresolved site, or null. */
function expectedLowest(start: number): number | null {
  const heights = CHAIN.flatMap((block, i) => (block.flat().some((g) => g.kind !== "foreign") ? [FIRST + i] : []));
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
    const status = await serve(db, { start, head: HEAD, logs, unresolved, modules: [...MODULES, probe(seen)] }, (origin) => get(origin, "/v1/status"));
    expect(seen.get(BigInt(HEAD)), `served state from ${start}`).toBe(modelFrom(start));
    expect(await db.query("SELECT count(*)::int AS n, min(height)::int AS lo FROM token_metadata.events")).toEqual([
      { n: expectedRows(start), lo: expectedLowest(start) },
    ]);
    expect(status.json).toMatchObject({ startHeight: start, indexedHeight: HEAD });
    if (start === FIRST + 2) expect(seen.get(BigInt(HEAD))).not.toBe(modelOf(events));
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
  { tape: "preprod-3348334-3348534", network: "preprod", last: 3_348_534, f: 3_348_434, starts: [3_348_335, 3_348_433, 3_348_434, 3_348_435, 3_348_530] },
  { tape: "mainnet-3346039-3346239", network: "mainnet", last: 3_346_239, f: 3_346_139, starts: [3_346_040, 3_346_139, 3_346_140] },
];

describe.each(PROCESS_BACKENDS)("token-metadata on the networks' tapes from varying start heights, on $name", (backend: ProcessBackend) => {
  for (const tape of TAPES) {
    for (const start of tape.starts) {
      const where = start === tape.f ? "the upgrade's first block" : start === tape.f - 1 ? "the block before it" : `${start}`;
      tapeTest(
        tape.tape,
        `${tape.network} from ${where} (${start}) commits every height to ${tape.last} and reports its start`,
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
              const status = await get(`http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`, "/v1/status");
              expect(status.status).toBe(200);
              expect(status.json).toMatchObject({ network: tape.network, startHeight: start, indexedHeight: tape.last });
            } finally {
              await run.close();
            }
            const [blocks] = await db.query("SELECT count(*)::int AS n, min(height)::int AS lo, max(height)::int AS hi FROM core_block_commit.blocks");
            expect(blocks).toEqual({ n: tape.last - start + 1, lo: start, hi: tape.last });
          } finally {
            await backend.stop();
          }
        },
        { timeoutMs: 720_000 },
      );
    }
  }
});
