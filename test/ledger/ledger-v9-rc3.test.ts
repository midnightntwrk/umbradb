import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { KNOWN_NETWORKS, builtInLedgerTable } from "../../src/ledger/networks.js";
import type { LedgerPackage } from "../../src/ledger/types.js";
import { type LedgerTable, selectLedgerVersion } from "../../src/ledger/version-table.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { V9_PACKAGE_PATH } from "./ledger-states.js";
import { carriedLoadProblems, STAGENET, stagenetReplay } from "./v9-rc3-checks.js";
import { blockWith, mnsvItem } from "./version-checks.js";

/**
 * The vendored builds include v9 at `crate-ledger-9.1.0.0-rc.3`, the ledger `midnight-node` 2.0.0-rc.4 builds for
 * runtime 2.0, as a package of its own (`vendor/ledger/v9-rc3`, the ledger version `v9-rc3`):
 * - it is reproducible by `npm run vendor:ledger` (`vendored-ledger-files.test.ts` holds the committed package to its
 *   `SHA256SUMS`; the CI job rebuilds it) and identified in the core version;
 * - the built-in tables map `spec_version` 2,000,000–2,000,999 to it and 2,001,000 on to rc.5;
 * - a state stored by the rc.3 package loads in the rc.5 package with the same root, so a 2.0 → 2.1 upgrade carries it.
 * [A159, LG-3, LG-5, Q139 A; acceptance §12]
 *
 * The oracle is stagenet's node (`./v9-rc3-checks.ts`): the rc.3 package replays its first blocks with the node's
 * roots, which the rc.5 package does not (the committed control, `ledger-v9-rc3.negative-control.test.ts`).
 */

const LONG = 240_000;
const sha256OfManifest = (): string =>
  `0x${createHash("sha256").update(readFileSync(new URL("../../vendor/ledger/v9-rc3/SHA256SUMS", import.meta.url))).digest("hex")}`;

describe("A159: v9 as runtime 2.0 built it, a ledger package of its own (LG-3, LG-5)", () => {
  let rc3: LedgerPackage;
  let rc5: LedgerPackage;
  beforeAll(async () => {
    [rc3, rc5] = await Promise.all([
      loadLedgerPackage("v9-rc3", { networkId: NETWORK_ID }),
      loadLedgerPackage("v9", { networkId: NETWORK_ID }),
    ]);
  }, LONG);

  it("is identified in the core version, between v8 and v9 (rc.5), by its release and its manifest's SHA-256", () => {
    const ledgers = buildCoreVersion().ledgers;
    expect(ledgers.map((ledger) => ledger.ledger)).toEqual(["v8", "v9-rc3", "v9"]);
    expect(ledgers[1]).toEqual({
      ledger: "v9-rc3",
      versionName: "ledger-9.1.0.0-rc.3",
      packages: [{ name: "@umbradb/vendored-ledger-v9-rc3", version: "1.0.0-rc.3", sha256: sha256OfManifest() }],
    });
    expect([rc3.ledger, rc3.versionName, Object.keys(rc3.rawPackages())]).toEqual([
      "v9-rc3",
      "ledger-9.1.0.0-rc.3",
      ["@umbradb/vendored-ledger-v9-rc3"],
    ]);
    // Its own module: not the rc.5 package under another name.
    expect(rc3.rawPackages()["@umbradb/vendored-ledger-v9-rc3"]).not.toBe(rc5.rawPackages()["@umbradb/vendored-ledger-v9"]);
    // The node that builds it (2.0.0-rc.4) carries no v8 → v9 translation: neither does it.
    expect(rc3.convertFromV8).toBeUndefined();
  });

  it("replays stagenet from its genesis state with the node's root after blocks 0 to 3 (A99 at the adapter)", { timeout: LONG }, () => {
    const replay = stagenetReplay(rc3);
    rc3.dispose(replay.state);
    expect(replay.problems).toEqual([]);
    expect(STAGENET.blocks.map((block) => block.height)).toEqual([1n, 2n, 3n]);
  });

  it("stores a state that loads in the rc.5 package, in a fresh worker, with the same root and serialization: a 2.0 → 2.1 upgrade carries it", {
    timeout: LONG,
  }, async () => {
    expect(await carriedLoadProblems(rc3, V9_PACKAGE_PATH)).toEqual([]);
  });

  it("has the built-in tables map spec_version 2,000,000–2,000,999 to it and 2,001,000 on to rc.5, on every known network", () => {
    const ledgerAt = (table: LedgerTable, specVersion: number): string =>
      selectLedgerVersion(table, blockWith(5, [mnsvItem(specVersion)])).ledger;
    for (const network of KNOWN_NETWORKS) {
      const table = builtInLedgerTable(network) as LedgerTable;
      expect([1_999_999, 2_000_000, 2_000_999, 2_001_000, 2_999_999].map((version) => ledgerAt(table, version)), network).toEqual([
        "v8",
        "v9-rc3",
        "v9-rc3",
        "v9",
        "v9",
      ]);
      expect(() => ledgerAt(table, 3_000_000), network).toThrow(expect.objectContaining({ code: "unknown-runtime" }));
    }
    expect(ledgerAt(builtInLedgerTable("stagenet") as LedgerTable, STAGENET.specVersion)).toBe("v9-rc3");
  });
});
