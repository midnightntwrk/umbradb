import fc from "fast-check";
import { z } from "zod";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { servedGroups, servedIdentities } from "../../../src/features/token-metadata/read.ts";
import { MetadataState, type ObservedEvent } from "../../../src/features/token-metadata/state.ts";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.ts";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { build, chainArb, NETWORK, S } from "./chains.js";
import { runTo } from "./harness.js";
import { stateResponse } from "./vector-adapter.ts";

/**
 * For generated chains — valid, invalid and foreign-named candidates, several per block and per
 * field, tombstones and withdrawals — the module's served state after every block equals the proof of concept's
 * `state.ts` applied to the same events as a reference model. A probe module reads the served state inside each
 * block's transaction, after `token-metadata` wrote it. **Negative control:** the model applying each block's events
 * in reverse log order differs from the module on the generated chains. Unresolved sites join with
 * `fast-logs-unresolved`.
 */

/**
 * A state response in a fixed order: identities by identity, each one's fields by key (the model keeps the order the
 * fields were last set in; the vectors' comparison, and this one, do not compare field order).
 */
function ordered(identities: Parameters<typeof stateResponse>[0]): string {
  const sorted = [...identities]
    .sort((a, b) => `${a.contractAddress}/${a.domainSep}/${a.kind}`.localeCompare(`${b.contractAddress}/${b.domainSep}/${b.kind}`))
    .map((id) => ({ ...id, fields: new Map([...id.fields].sort(([a], [b]) => a.localeCompare(b))) }));
  return JSON.stringify(stateResponse(sorted, servedGroups(sorted)));
}

/** A module reading the served state inside each block's transaction, after `token-metadata`. */
function probe(seen: Map<bigint, string>): ModuleDeclaration {
  return defineModule({
    id: "token-metadata-probe",
    version: "1.0.0",
    side: "public",
    requires: ["token-metadata-state"],
    provides: [{ name: "token-metadata-probe-rows", lifetimes: ["table"], table: { schema: "token_metadata_probe", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE token_metadata_probe.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b, w) {
        seen.set(b.height, ordered(await servedIdentities(w, NETWORK)));
      },
    },
  }) as ModuleDeclaration;
}

/** The model's served state after each block, applying each block's events in `order`. */
function modelStates(events: readonly ObservedEvent[][], order: "chain" | "reverse"): string[] {
  const model = new MetadataState();
  return events.map((block) => {
    const list = order === "chain" ? block : [...block].reverse().map((e, i) => ({ ...e, position: { ...e.position, tx: 0, event: i } }));
    for (const event of list) model.apply(event);
    return ordered(model.identities());
  });
}

describe.each(PROCESS_BACKENDS)("token-metadata against the reference model on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("after every block of every generated chain, the served state equals state.ts's; the reverse-order model differs somewhere", async () => {
    let reverseDiffers = 0;
    await fc.assert(
      fc.asyncProperty(chainArb, async (chain) => {
        const { logs, events, head } = build(chain);
        const seen = new Map<bigint, string>();
        const db = await backend.database();
        await runTo(db, { start: S, head, logs, modules: [TOKEN_METADATA as ModuleDeclaration, probe(seen)] });
        const module = events.map((_, i) => seen.get(BigInt(S + 1 + i)));
        expect(module).toEqual(modelStates(events, "chain"));
        if (JSON.stringify(module) !== JSON.stringify(modelStates(events, "reverse"))) reverseDiffers++;
      }),
      { seed: 18_0011, numRuns: 25 },
    );
    expect(reverseDiffers).toBeGreaterThan(0);
  }, 900_000);
});
