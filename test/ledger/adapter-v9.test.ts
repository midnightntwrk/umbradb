import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage } from "../../src/ledger/types.js";
import { hex, NETWORK_ID } from "./adapter-fixtures.js";
import { describeLedgerPackage } from "./adapter-suite.js";
import { AdapterWorkerHost, type LoadedState } from "./adapter-worker-host.js";

// The adapter test suite against the v9 adapter (`src/ledger/v9.ts`, ledger-9.1.0.0-rc.5 from `vendor/ledger/v9`),
// whose `apply` reports contract logs, and the v9-only `convertFromV8` through both adapters, since every version has
// one interface. [A98, LG-6]

describeLedgerPackage({
  ledger: "v9",
  load: () => loadLedgerPackage("v9", { networkId: NETWORK_ID }),
  logs: "decoded",
});

describe("v9 adapter: convertFromV8, from a v8 state the v8 adapter stored (LG-9)", () => {
  const host = new AdapterWorkerHost();
  let v8: LedgerPackage;
  let v9: LedgerPackage;

  beforeAll(async () => {
    [v8, v9] = await Promise.all([
      loadLedgerPackage("v8", { networkId: NETWORK_ID }),
      loadLedgerPackage("v9", { networkId: NETWORK_ID }),
    ]);
    await host.start();
  }, 240_000);
  afterAll(() => host.stop());

  it("converts the stored v8 state in a fresh worker into the same v9 state on every run", { timeout: 240_000 }, async () => {
    v8.flush();
    const state = v8.emptyState();
    const key = v8.stateKey(state);
    v8.persist(key);
    const { inserts } = v8.flush();
    const request = { op: "convert" as const, ledger: "v9" as const, networkId: NETWORK_ID, key, nodes: inserts };
    const [first, second] = await Promise.all([host.run<LoadedState>(request), host.run<LoadedState>(request)]);
    expect(first.error).toBeUndefined();
    expect(first.result).toEqual(second.result);
    expect(first.result!.stateKey).toHaveLength(32);
    expect(hex(first.result!.stateRoot)).not.toBe(hex(v8.stateRoot(state)));
    expect(v9.ledger).toBe("v9");

    const missing = await host.run<LoadedState>({ ...request, nodes: [] });
    expect(missing.error).toMatch(/no node/);

    // In this thread, through the same call: the same v9 state.
    const stored = new Map(inserts.map((node) => [hex(node.key), node]));
    const here = v9.convertFromV8!(key, { get: (wanted) => stored.get(hex(wanted)) ?? null });
    expect(hex(v9.stateRoot(here))).toBe(hex(first.result!.stateRoot));
    expect(hex(v9.stateKey(here))).toBe(hex(first.result!.stateKey));
  });
});
