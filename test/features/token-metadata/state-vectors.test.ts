import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ContractLog } from "../../../src/backbone/contract-logs/contract-logs.js";
import type { LogEventType } from "../../../src/ledger/types.js";
import { servedGroups, servedIdentities } from "../../../src/features/token-metadata-api/read.js";
import { displayAmount, MetadataState } from "../../../src/features/token-metadata/state.js";
import { fromHex } from "../../../src/features/token-metadata/codec/index.js";
import { PGlite } from "@electric-sql/pglite";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { cellData, log, runTo } from "./harness.js";
import { type Json, stateInput, stateResponse } from "./vector-adapter.js";
import { compareState } from "./vector-tools/compare.js";
import { loadVectors, requestFor } from "./vector-tools/runner-core.js";

/**
 * Every MIP-0018 reference state vector (normative and informative), through `token-metadata` in the real process on
 * PostgreSQL 18 and PGlite, gives its expected state; and it equals the pure `MetadataState` on the
 * same steps.
 *
 * **How a vector becomes a chain.** Each network of a vector is a database of its own (a database holds one chain).
 * Its `apply` steps are logs at height `BASE + block`, in transaction `tx`, at the transaction's position `event`
 * (positions a vector skips are filled with `Paused` logs, which are no candidates); a `Misc` step's data is the
 * name, zero-extended to 32 bytes, then the payload, as the one atom Compact logs. A `rollback` step removes the
 * applied steps above its block before the chain is built: UmbraDB follows finalized blocks only, and the state after
 * a rollback is defined (MIP S4) as the state of the chain without the removed blocks.
 */

const BASE = 100;

interface Vector {
  readonly id: string;
  readonly normative: boolean;
  readonly request: Json;
  readonly expect: Json;
}

/** Every state vector of the reference manifest, normative and informative (no state vector has an UmbraDB version). */
const vectors: Vector[] = loadVectors({ informative: true })
  .filter((v) => v.entry.kind === "state")
  .map((v) => ({ id: v.entry.id, normative: v.entry.normative, request: requestFor(v), expect: v.data.expect as Json }));

type Step = ReturnType<typeof stateInput>["steps"][number];
type Applied = Extract<Step, { op: "apply" }>["event"];

/** The applied events left once each rollback removed the events above its block, in step order, per network. */
function chainOf(steps: readonly Step[]): Map<string, Applied[]> {
  const chains = new Map<string, Applied[]>();
  for (const step of steps) {
    if (step.op === "apply") {
      const list = chains.get(step.event.network) ?? [];
      list.push(step.event);
      chains.set(step.event.network, list);
    } else {
      chains.set(step.network, (chains.get(step.network) ?? []).filter((e) => e.position.block <= step.toBlock));
    }
  }
  return chains;
}

/** The step's log data: the name zero-extended to 32 bytes, then the payload (or both as given past 288 bytes). */
function dataOf(event: Applied): Uint8Array {
  const name = event.name.length <= 32 ? Uint8Array.from({ length: 32 }, (_, i) => event.name[i] ?? 0) : event.name;
  const bytes = new Uint8Array(name.length + event.payload.length);
  bytes.set(name, 0);
  bytes.set(event.payload, name.length);
  return cellData(bytes);
}

/** The logs per height of a network's events (see the module comment), with the last height. */
function logsOf(events: readonly Applied[]): { logs: Map<bigint, ContractLog[]>; last: number } {
  const byBlock = new Map<number, Applied[]>();
  for (const e of events) byBlock.set(e.position.block, [...(byBlock.get(e.position.block) ?? []), e]);
  const logs = new Map<bigint, ContractLog[]>();
  let last = 0;
  for (const [block, list] of byBlock) {
    last = Math.max(last, block);
    const sorted = [...list].sort((a, b) => a.position.tx - b.position.tx || a.position.event - b.position.event);
    const out: ContractLog[] = [];
    for (const tx of [...new Set(sorted.map((e) => e.position.tx))]) {
      const ofTx = sorted.filter((e) => e.position.tx === tx);
      for (let position = 0; position <= ofTx.at(-1)!.position.event; position++) {
        const event = ofTx.find((e) => e.position.event === position);
        const address = fromHex(event?.contractAddress ?? "00".repeat(32));
        const type = (event?.type ?? "Paused") as LogEventType;
        out.push(log(tx, out.length, address, event === undefined ? cellData(Uint8Array.of(1)) : dataOf(event), type));
      }
    }
    logs.set(BigInt(BASE + block), out);
  }
  return { logs, last };
}

/** The served state of a stopped process's database, read from outside it. */
async function servedState(backend: ProcessBackend, db: ProcessDatabase, network: string) {
  const read = async (query: (r: { query(sql: string): Promise<Record<string, unknown>[]> }) => Promise<unknown>) => {
    if (backend.kind === "postgres") {
      return query({ query: async (sql) => [...(await db.admin!.unsafe(sql))] as Record<string, unknown>[] });
    }
    const engine = await PGlite.create(db.directory!);
    try {
      return await query({ query: async (sql) => (await engine.query<Record<string, unknown>>(sql)).rows });
    } finally {
      await engine.close();
    }
  };
  return (await read(async (r) => servedIdentities({ query: (sql) => r.query(sql) }, network))) as Awaited<ReturnType<typeof servedIdentities>>;
}

/** A state response in a fixed order (identities by identity, groups by content), to compare two consumers exactly. */
function comparable(response: Json): Json {
  const identities = (response.identities as Json[])
    .map((id): Json => ({
      ...id,
      fields: Object.fromEntries(
        Object.entries(id.fields as Record<string, Json>).map(([key, { key_text: _k, value_text: _v, ...field }]) => [key, field]),
      ),
    }))
    .sort((a, b) => `${a.network}/${a.contractAddress}/${a.domainSep}/${a.kind}`.localeCompare(`${b.network}/${b.contractAddress}/${b.domainSep}/${b.kind}`));
  const groups = [...(response.groups as Json[])].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return { identities, groups, display: response.display };
}

describe("the vectors at hand", () => {
  it("are every state vector of the reference manifest (S1–S9 and the informative ones)", () => {
    expect(vectors.length).toBe(36);
    expect(vectors.filter((v) => v.normative).length).toBe(27);
    expect(vectors.map((v) => v.id)).toEqual(expect.arrayContaining(["S1a", "S3d", "S4a", "S4b", "S6a", "S7a", "S8", "S9d", "INF-ZEXT-S1"]));
  });
});

describe.each(PROCESS_BACKENDS)("the state vectors through token-metadata on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it.each(vectors.map((v) => [v.id, v] as const))("%s", async (_id, vector) => {
    const { steps, display } = stateInput(vector.request);
    const identities: Awaited<ReturnType<typeof servedIdentities>> = [];
    for (const [network, events] of chainOf(steps)) {
      const db = await backend.database();
      const { logs, last } = logsOf(events);
      await runTo(db, { start: BASE, head: BASE + last + 1, logs });
      identities.push(...(await servedState(backend, db, network)));
    }
    const groups = servedGroups(identities);
    const shown = display?.map((d) => {
      const identity = identities.find(
        (i) => i.network === d.ref.network && i.contractAddress === d.ref.contractAddress && i.domainSep === d.ref.domainSep && i.kind === d.ref.kind,
      );
      return { ...d, shown: displayAmount(identity?.fields, BigInt(d.raw)) };
    });
    const response = stateResponse(identities, groups, shown);
    const comparison = compareState(vector.expect, response);
    expect(comparison.failures).toEqual([]);
    expect(comparison.notApplicable).toEqual([]);
    const got = comparable(response);
    const model = new MetadataState();
    for (const step of steps) {
      if (step.op === "apply") model.apply(step.event);
      else model.rollbackTo(step.network, step.toBlock);
    }
    const modelShown = display?.map((d) => ({ ...d, shown: model.display(d.ref, BigInt(d.raw)) }));
    expect(got).toEqual(comparable(stateResponse(model.identities(), model.groups(), modelShown)));
  }, 240_000);
});
