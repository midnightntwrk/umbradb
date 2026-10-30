import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { LedgerPackage, StoredNode, VmLog } from "../../src/ledger/types.js";
import { NETWORK_ID, RAW } from "./adapter-fixtures.js";
import { expectNoV8Logs, expectRecordedRelease, expectSmallStateReloadsByKey } from "./adapter-checks.js";
import { AdapterWorkerHost } from "./adapter-worker-host.js";

/**
 * The committed negative controls of the adapter checks: wrong adapters, each of which must make the check the
 * adapter test suite runs (`adapter-checks.ts`) fail; the real adapters pass the same checks in this file's build.
 * [A98]
 *
 * - **A v8 adapter whose `decodeLogItem` returns a value** fails the check that v8 reports no contract logs (its
 *   fast-check property finds an input); so does **a v8 adapter whose `apply` reports a log**. [Q54]
 * - **A `stateKey` derived from `stateRoot`** (the 32 bytes after `stateRoot`'s first byte, which is a key only for a
 *   state above the embedding limit) fails the reload of a state under the limit: the fresh instance has no node
 *   under that key. [Q55]
 * - **An adapter reporting another package's identity** (the v8 adapter with the v9 package's `rawPackages()`, and with
 *   its `versionName` too) fails the check that `versionName` and `rawPackages()` are the recorded ones.
 */

/** The assertion error a check fails with; fails the test if the check passes or fails otherwise. */
async function assertionFailure(check: () => unknown): Promise<Error> {
  try {
    await check();
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed against a wrong adapter");
}

const FAKE_LOG: VmLog = {
  version: 0,
  eventType: "Misc",
  data: Uint8Array.of(1),
  transaction: 1,
  index: 0,
  address: new Uint8Array(32),
  entryPoint: Uint8Array.of(0x65),
  logicalSegment: 0,
  physicalSegment: 1,
};

describe("A98's negative controls", () => {
  const host = new AdapterWorkerHost();
  const store = new Map<string, StoredNode>();
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

  it("the real adapters pass every check in this file's build", { timeout: 240_000 }, async () => {
    expectRecordedRelease(v8, "v8", RAW.v8);
    expectRecordedRelease(v9, "v9", RAW.v9);
    await expectNoV8Logs(v8);
    await expectSmallStateReloadsByKey(v8, host, store);
    await expectSmallStateReloadsByKey(v9, host, new Map());
  });

  it("a v8 adapter whose decodeLogItem returns a value fails Q54's clause", { timeout: 120_000 }, async () => {
    const wrong: LedgerPackage = { ...v8, decodeLogItem: (value) => ({ version: 0, eventType: "Misc", data: value }) };
    const failure = await assertionFailure(() => expectNoV8Logs(wrong));
    expect(failure.message).toMatch(/decodeLogItem returned a log/);
  });

  it("a v8 adapter whose apply reports a log fails Q54's clause", { timeout: 120_000 }, async () => {
    const wrong: LedgerPackage = {
      ...v8,
      apply: (state, input) => {
        const applied = v8.apply(state, input);
        return { ...applied, output: { ...applied.output, logs: [FAKE_LOG] } };
      },
    };
    await assertionFailure(() => expectNoV8Logs(wrong));
  });

  it("a stateKey derived from stateRoot fails Q55's reload of a state under the embedding limit", { timeout: 240_000 }, async () => {
    for (const adapter of [v8, v9]) {
      const wrong: LedgerPackage = { ...adapter, stateKey: (state) => adapter.stateRoot(state).subarray(1, 33) };
      await assertionFailure(() => expectSmallStateReloadsByKey(wrong, host, new Map()));
      adapter.release(adapter.stateRoot(adapter.emptyState()).subarray(1, 33));
      adapter.flush();
    }
  });

  it("an adapter reporting another package's identity fails the rawPackages() check", () => {
    const otherPackages: LedgerPackage = { ...v8, rawPackages: () => v9.rawPackages() };
    expect(thrownBy(() => expectRecordedRelease(otherPackages, "v8", RAW.v8)).name).toBe("AssertionError");
    const otherRelease: LedgerPackage = { ...v8, versionName: v9.versionName, rawPackages: () => v9.rawPackages() };
    expect(thrownBy(() => expectRecordedRelease(otherRelease, "v8", RAW.v8)).name).toBe("AssertionError");
    const otherModule: LedgerPackage = {
      ...v8,
      rawPackages: () => Object.freeze({ [Object.keys(v8.rawPackages())[0]!]: RAW.v9 }),
    };
    expect(thrownBy(() => expectRecordedRelease(otherModule, "v8", RAW.v8)).name).toBe("AssertionError");
  });
});

/** The error a synchronous check throws (it must throw). */
function thrownBy(check: () => void): Error {
  try {
    check();
  } catch (error) {
    if (error instanceof Error) return error;
  }
  throw new Error("the check passed against a wrong adapter");
}
