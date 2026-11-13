/**
 * Where Preprod's Dust event timeline reaches the ledger 9 fork (protocol version ≥ 2,000,000), ported from the
 * transfer spike (`experiments/00053-transfer-spike/d/dust-timeline.ts`, decision Q13).
 *
 * The wallet SDK's `skipLedgerV8DustHistory` runs the same binary search (one short `dustLedgerEvents(id)` subscription
 * per halving) but gives up after 30 s, and through Blockfrost it times out and silently replays all 1.89 M Dust events
 * from genesis (2–4 hours). This runs the search without the limit, caches the answer (public data: one event id and
 * one version) beside the client's other cached files, and the fee wallet hands it to the Dust wallet as its
 * `dustTimelineStartProbe`.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { type Client, createClient } from "graphql-ws";

export interface DustTimelineAnswer {
  /** Last Dust event id below the boundary. */
  readonly cursor: string;
  /** Protocol version of the first Dust event at or after the boundary. */
  readonly version: string;
  readonly boundary: string;
  readonly probes: number;
  readonly ms: number;
  readonly foundAt: string;
}

interface Position {
  readonly id: number;
  readonly version: bigint;
  readonly maxId: number;
}

const firstFrom = (client: Client, id: number | null): Promise<Position> =>
  new Promise((resolve, reject) => {
    let done = false;
    const dispose = client.subscribe<{ dustLedgerEvents: { id: number; maxId: number; protocolVersion: number } }>(
      { query: "subscription ($id: Int) { dustLedgerEvents(id: $id) { id maxId protocolVersion } }", variables: { id } },
      {
        next: (msg) => {
          if (done) return;
          done = true;
          dispose();
          const e = msg.data!.dustLedgerEvents;
          resolve({ id: e.id, version: BigInt(e.protocolVersion), maxId: e.maxId });
        },
        error: (err) => {
          if (!done) reject(err instanceof Error ? err : new Error(JSON.stringify(err)));
        },
        complete: () => {
          if (!done) reject(new Error(`dustLedgerEvents(${id}) completed without an event`));
        },
      },
    );
  });

export async function findDustTimelineStart(wsUrl: string, cacheFile: string, boundary = 2_000_000n): Promise<DustTimelineAnswer> {
  if (existsSync(cacheFile)) {
    const cached = JSON.parse(readFileSync(cacheFile, "utf8")) as DustTimelineAnswer;
    if (cached.boundary === boundary.toString()) return cached;
  }
  const t0 = performance.now();
  const client = createClient({ url: wsUrl, lazy: false, retryAttempts: 3 });
  let probes = 0;
  const probe = async (id: number | null): Promise<Position> => {
    probes += 1;
    return firstFrom(client, id);
  };
  try {
    const first = await probe(null);
    const last = await probe(first.maxId);
    if (first.version >= boundary || last.version < boundary) throw new Error("the Dust timeline does not cross the boundary");
    // As the SDK's narrowToBoundary: everything below `low` is below the boundary, `atHigh` is not.
    let low = first.id + 1;
    let high = last.id;
    let atHigh = last;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      const p = await probe(middle);
      if (p.version >= boundary) {
        high = middle;
        atHigh = p;
      } else {
        low = p.id + 1;
      }
    }
    const answer: DustTimelineAnswer = {
      cursor: String(low - 1),
      version: atHigh.version.toString(),
      boundary: boundary.toString(),
      probes,
      ms: Math.round(performance.now() - t0),
      foundAt: new Date().toISOString(),
    };
    writeFileSync(cacheFile, JSON.stringify(answer, null, 2));
    return answer;
  } finally {
    await client.dispose();
  }
}
