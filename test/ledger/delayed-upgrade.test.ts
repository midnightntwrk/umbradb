import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { contentStateOf, RuntimeMetadata } from "../../src/ledger/metadata.js";
import { builtInLedgerTable } from "../../src/ledger/networks.js";
import { selectLedgerVersion } from "../../src/ledger/version-table.js";
import { toHex } from "../../src/node/decode.js";
import { type ConnectSocket, connectWebSocket, NodeClient } from "../../src/node/index.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { FAST_CORE, FULL_CORE } from "../backbone/contract-data-checks.js";
import { committed, type Ingest, ingest } from "../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";

/**
 * Runtime 2.1's delayed upgrades (`system_version` 3) on the networks' own tapes, recorded 2026-11-09: the first block
 * of the new runtime, F, is built by it and its own state holds it, while its parent's state still holds the old one
 * (`apply_authorized_upgrade` in U only staged the code).
 *
 * - `preview-0-2000-v8-v9` from genesis with the ledger core and `core-contract-logs-full` commits every height
 *   (`core-ledger-state` checks each state root against the node's), across an earlier-form upgrade (556) and a
 *   delayed one (F = 1,572).
 * - `mainnet-3346039-3346239` and `preprod-3348334-3348534` with `core-contract-logs-fast`'s core, from the
 *   tape's first block + 1, commit every height across their delayed upgrade (F = 3,346,139 and 3,348,434), and F's
 *   chain events decode with the new runtime's metadata. Startup asks for the genesis hash and header, which a
 *   mid-chain tape does not hold: they come from `test/ledger/fixtures/networks/<network>.json`, the node's own answers.
 * - The runtime versions the process asked for are each processed block's parent's, and F's own once.
 * - **Negative controls**: the parent-only selection (the rule before delayed upgrades) halts at F on each tape.
 */

const WALK_MS = 600_000;
const quietConnect: ConnectSocket = (url, events, timers) => connectWebSocket(url, events, timers, { heartbeatMs: 3_600_000 });

interface DelayedTape {
  readonly tape: string;
  readonly network: "preview" | "mainnet" | "preprod";
  readonly start: number;
  readonly f: number;
}

const PREVIEW: DelayedTape = { tape: "preview-0-2000-v8-v9", network: "preview", start: 0, f: 1_572 };
const MAINNET: DelayedTape = { tape: "mainnet-3346039-3346239", network: "mainnet", start: 3_346_040, f: 3_346_139 };
const PREPROD: DelayedTape = { tape: "preprod-3348334-3348534", network: "preprod", start: 3_348_335, f: 3_348_434 };

/** The genesis hash's and header's records of `network`, as its node answered them (the network fixture's). */
function genesisRecords(network: string): TapeRecord[] {
  const fixture = JSON.parse(readFileSync(new URL(`./fixtures/networks/${network}.json`, import.meta.url), "utf8")) as {
    genesis: { hash: string };
    calls: TapeRecord[];
  };
  const wanted = (record: TapeRecord) =>
    "method" in record &&
    ((record.method === "chain_getBlockHash" && JSON.stringify(record.params) === "[0]") ||
      (record.method === "chain_getHeader" && JSON.stringify(record.params) === JSON.stringify([fixture.genesis.hash])));
  const records = fixture.calls.filter(wanted);
  expect(records).toHaveLength(2);
  return records;
}

/** The tape's records, with the genesis records first for a tape that does not start at 0. */
function recordsOf(found: FoundTape, delayed: DelayedTape): TapeRecord[] {
  const records = found.read().records;
  return delayed.start === 0 ? [...records] : [...genesisRecords(delayed.network), ...records];
}

/** The tape's block hash at `height` (its `chain_getBlockHash` answer). */
function hashAt(records: readonly TapeRecord[], height: number): string {
  const record = records.find((r) => "method" in r && r.method === "chain_getBlockHash" && (r.params as unknown[])[0] === height);
  if (record === undefined || !("result" in record)) throw new Error(`no hash of ${height} on the tape`);
  return record.result as string;
}

/** The last height of the tape. */
const lastOf = (found: FoundTape) => found.tape.to;

/**
 * Walks the tape's heights from `from` to F with the parent-only selection (the rule before delayed upgrades): the
 * runtime in the parent's state, or a halt. Rejects with its `metadata-mismatch` where it halts.
 */
async function parentOnlyWalk(records: readonly TapeRecord[], delayed: DelayedTape, from: number): Promise<void> {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url, connect: quietConnect });
  const table = builtInLedgerTable(delayed.network)!;
  try {
    for (let h = from; h <= delayed.f; h++) {
      const hash = await client.blockHash(BigInt(h));
      const header = await client.header(hash);
      const { specVersion } = selectLedgerVersion(table, { height: header.number, hash, digest: header.digest });
      const block = { height: header.number, hash, parentHash: header.parentHash, specVersion };
      const at = contentStateOf(block);
      const runtime = (await client.runtimeVersion(at)).specVersion;
      if (runtime !== specVersion) throw new UmbraError("metadata-mismatch", `block ${h}`, { height: BigInt(h) });
    }
  } finally {
    await client.close();
    await node.close();
  }
}

/** The runtime versions `run` asked for at `state_getRuntimeVersion`, as hashes, sorted. */
const runtimeReads = (run: Ingest): string[] =>
  run.node.calls
    .filter((call) => call.method === "state_getRuntimeVersion")
    .map((call) => (call.params as string[])[0]!)
    .sort();

/** Replays `delayed` on `backend` with `core` to the tape's last height, then checks the runtime reads and F's events. */
async function replay(backend: ProcessBackend, found: FoundTape, delayed: DelayedTape, core: typeof FAST_CORE): Promise<void> {
  const records = recordsOf(found, delayed);
  const last = lastOf(found);
  const db = await backend.database();
  const run = await ingest(db, records, { start: BigInt(delayed.start), stop: BigInt(last), core, settings: { network: delayed.network } });
  try {
    await committed(run, BigInt(last), WALK_MS);
    // Each processed block's parent's runtime (block 0: its own), and F's own once.
    const parents = Array.from({ length: last - delayed.start + 1 }, (_, i) => delayed.start + i).map((h) => hashAt(records, Math.max(0, h - 1)));
    expect(runtimeReads(run)).toEqual([...parents, hashAt(records, delayed.f)].sort());
  } finally {
    await run.close();
  }
  // F's chain events decoded with the new runtime's metadata, and every height committed.
  const [events] = await db.query(`SELECT count(*)::int AS n FROM core_chain_events.events WHERE height = ${delayed.f}`);
  expect(events?.n).toBeGreaterThan(0);
  const [blocks] = await db.query("SELECT count(*)::int AS n, min(height)::text AS lo, max(height)::text AS hi FROM core_block_commit.blocks");
  expect(blocks).toEqual({ n: last - delayed.start + 1, lo: String(delayed.start), hi: String(last) });
}

describe.each(PROCESS_BACKENDS)("delayed runtime upgrades on the networks' tapes, on $name", (backend: ProcessBackend) => {
  tapeTest(
    PREVIEW.tape,
    "preview from genesis with the ledger core commits every height, across 556 and the delayed upgrade's first block 1,572",
    async (found) => {
      await backend.start();
      try {
        await replay(backend, found, PREVIEW, FULL_CORE);
      } finally {
        await backend.stop();
      }
    },
    { timeoutMs: WALK_MS + 120_000 },
  );

  for (const delayed of [MAINNET, PREPROD]) {
    tapeTest(
      delayed.tape,
      `${delayed.network} with core-contract-logs-fast's core commits every height across its delayed upgrade's first block ${delayed.f}`,
      async (found) => {
        await backend.start();
        try {
          await replay(backend, found, delayed, FAST_CORE);
        } finally {
          await backend.stop();
        }
      },
      { timeoutMs: WALK_MS + 120_000 },
    );
  }
});

describe("[NEG] the parent-only selection halts at each delayed upgrade's first block", () => {
  for (const delayed of [PREVIEW, MAINNET, PREPROD]) {
    tapeTest(
      delayed.tape,
      `halts at ${delayed.network}'s ${delayed.f}`,
      async (found) => {
        const records = recordsOf(found, delayed);
        await expect(parentOnlyWalk(records, delayed, Math.max(delayed.start, delayed.f - 5))).rejects.toMatchObject({
          code: "metadata-mismatch",
          message: `block ${delayed.f}`,
        });
      },
      { timeoutMs: 120_000 },
    );
  }
  it("names the tapes it needs", () => expect([PREVIEW, MAINNET, PREPROD].map((d) => d.tape)).toHaveLength(3));
});
