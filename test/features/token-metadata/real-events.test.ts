import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ContractLog } from "../../../src/backbone/contract-logs/contract-logs.js";
import { candidatesOf } from "../../../src/features/token-metadata/apply.js";
import { fromHex, toHex } from "../../../src/features/token-metadata/codec/index.js";
import { hasColor, tokenColor } from "../../../src/features/token-metadata/color.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { log, readStopped, runTo } from "./harness.js";
import { servedGroups, servedIdentities } from "./served-state.js";

/**
 * Real MIP-0018 events, replayed. `test/fixtures/mip0018/real-events/` holds the contract logs of two public
 * networks at the heights where 15 contracts emitted `Misc` events, byte for byte as `core-contract-logs-full` stored
 * them, with what the MIP's reference tool concludes for each contract (`mip0018 list`): how many events it accepts,
 * rejects and ignores, and each token's fields.
 *
 * - **preview:** the 10 contracts of the reference implementation's recorded cases (46 events: 31 accepted, 11
 *   rejected, 4 of other names): a rename, a withdrawal and a revival, malformed payloads, one asset in three kinds, a
 *   token family, names over 64 characters, an image with its hash.
 * - **preprod:** a token a third party published and four of the reference's example contracts deployed for this
 *   test's data, one of them renamed.
 *
 * The logs go through the module as any block's do: first its classification (`candidatesOf`), then the real process
 * on PostgreSQL 18 and PGlite, where each real height becomes the next height of an in-memory chain.
 */

interface RealLog {
  height: number;
  tx: number;
  index: number;
  contract: string;
  type: ContractLog["eventType"];
  data: string;
}
interface ReferenceField {
  key: string;
  valType: number;
  value: string;
  usable: boolean | null;
  block: number;
  record: number;
}
interface ReferenceIdentity {
  domainSep: string;
  kind: number;
  color: string | null;
  common: Record<string, string>;
  fields: ReferenceField[];
}
interface Fixture {
  network: string;
  logs: RealLog[];
  contracts: {
    label: string;
    address: string;
    reference: {
      counts: { events: number; accepted: number; rejected: number; ignored: number };
      identities: ReferenceIdentity[];
      groups: { symbol: string; members: { domainSep: string; kind: number }[] }[];
    };
  }[];
}

const load = (network: string): Fixture =>
  JSON.parse(readFileSync(new URL(`../../fixtures/mip0018/real-events/${network}.json`, import.meta.url), "utf8")) as Fixture;
const FIXTURES = [load("preview"), load("preprod")];

const BASE = 100;

/** The fixture's logs per height of an in-memory chain: each real height, in order, is the next height after BASE. */
function chainOf(fixture: Fixture): { logs: Map<bigint, ContractLog[]>; heightOf: Map<number, number>; head: number } {
  const real = [...new Set(fixture.logs.map((l) => l.height))].sort((a, b) => a - b);
  const heightOf = new Map(real.map((h, i) => [h, BASE + 1 + i]));
  const logs = new Map<bigint, ContractLog[]>();
  for (const l of fixture.logs) {
    const height = BigInt(heightOf.get(l.height)!);
    logs.set(height, [...(logs.get(height) ?? []), log(l.tx, l.index, fromHex(l.contract), fromHex(l.data), l.type)]);
  }
  return { logs, heightOf, head: BASE + real.length + 1 };
}

describe.each(FIXTURES)("the real events of $network, classified", (fixture) => {
  it("each contract's events are accepted, rejected and ignored as the reference tool counts them", () => {
    const { logs } = chainOf(fixture);
    const got = new Map(fixture.contracts.map((c) => [c.address, { events: 0, accepted: 0, rejected: 0, ignored: 0 }]));
    // A block also holds the logs of contracts the fixture does not list; they are replayed and not counted here.
    for (const [height, block] of logs) {
      for (const l of block) {
        const counts = got.get(toHex(l.address));
        if (counts !== undefined && l.eventType === "Misc") counts.events++;
      }
      for (const c of candidatesOf(height, block)) {
        const counts = got.get(toHex(c.contract));
        if (counts !== undefined) counts[c.classification === "accept" ? "accepted" : "rejected"]++;
      }
    }
    for (const counts of got.values()) counts.ignored = counts.events - counts.accepted - counts.rejected;
    expect(Object.fromEntries(got)).toEqual(Object.fromEntries(fixture.contracts.map((c) => [c.address, c.reference.counts])));
    // The data is not trivial: something is accepted on every network, and preview has rejected and ignored events.
    const total = (k: "accepted" | "rejected" | "ignored") => [...got.values()].reduce((n, c) => n + c[k], 0);
    expect(total("accepted")).toBeGreaterThan(0);
    if (fixture.network === "preview") expect([total("rejected"), total("ignored")]).toEqual([11, 4]);
  });
});

describe.each(PROCESS_BACKENDS)("the real events through token-metadata on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it.each(FIXTURES.map((f) => [f.network, f] as const))("%s: every token and field is what the reference tool concludes", async (_network, fixture) => {
    const { logs, heightOf, head } = chainOf(fixture);
    const db = await backend.database();
    await runTo(db, { start: BASE, head, logs });
    const { identities, ids } = await readStopped(db, async (read) => ({
      identities: await servedIdentities(read, fixture.network),
      ids: (await read.query("SELECT id, kind, contract_address, domain_sep FROM token_metadata.tokens")).map((r) => ({
        token: `${toHex(r.contract_address as Uint8Array)}/${toHex(r.domain_sep as Uint8Array)}/${Number(r.kind)}`,
        id: toHex(r.id as Uint8Array),
      })),
    }));

    // Every token, with every field as served: type, bytes (names and symbols cut), usable, and where it was set.
    const served = Object.fromEntries(
      identities.map((i) => [
        `${i.contractAddress}/${i.domainSep}/${i.kind}`,
        Object.fromEntries(
          [...i.fields].map(([key, f]) => [key, { valType: f.valType, value: toHex(f.value), usable: f.usable ?? null, block: f.position.block, record: f.position.record }]),
        ),
      ]),
    );
    const expected = Object.fromEntries(
      fixture.contracts.flatMap((c) =>
        c.reference.identities.map((i) => [
          `${c.address}/${i.domainSep}/${i.kind}`,
          Object.fromEntries(i.fields.map((f) => [f.key, { valType: f.valType, value: f.value, usable: f.usable, block: heightOf.get(f.block), record: f.record }])),
        ]),
      ),
    );
    expect(served).toEqual(expected);

    // A token's id is the color the reference derives for kinds 1 and 2; a contract token has none there.
    const colors = new Map<string, ReferenceIdentity>(fixture.contracts.flatMap((c) => c.reference.identities.map((i): [string, ReferenceIdentity] => [`${c.address}/${i.domainSep}/${i.kind}`, i])));
    expect(ids.length).toBe(colors.size);
    for (const { token, id } of ids) {
      const reference = colors.get(token)!;
      expect([token, id]).toEqual([token, toHex(tokenColor(fromHex(reference.domainSep), fromHex(token.slice(0, 64))))]);
      expect([token, reference.color]).toEqual([token, hasColor(reference.kind) ? id : null]);
    }

    // The symbol groups of two or more members.
    const groups = servedGroups(identities).map((g) => ({ contract: g.contractAddress, symbol: g.symbol, members: g.members.map((m) => `${m.domainSep}/${m.kind}`).sort() }));
    const referenceGroups = fixture.contracts.flatMap((c) =>
      c.reference.groups.map((g) => ({ contract: c.address, symbol: g.symbol, members: g.members.map((m) => `${m.domainSep}/${m.kind}`).sort() })),
    );
    const order = (list: typeof groups) => [...list].sort((a, b) => `${a.contract}/${a.symbol}`.localeCompare(`${b.contract}/${b.symbol}`));
    expect(order(groups)).toEqual(order(referenceGroups));
  }, 300_000);
});
