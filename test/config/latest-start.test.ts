import { describe, expect, it } from "vitest";
import { withLatestStarts } from "../../src/config/latest-start.js";
import type { CheckedConfig, CheckedEntry } from "../../src/config/validate.js";

/**
 * The modules' latest starts on a validated configuration (`src/config/latest-start.ts`): a new database whose start
 * is above an enabled module's latest start on the configuration's network starts there, with the entries starting at
 * S; nothing else moves.
 */

const entry = (index: number, id: string, start: number, settings: Record<string, unknown> | null = {}, stop: number | null = null): CheckedEntry =>
  ({ index, id, start, stop, version: "1.0.0", buildVersion: true, settings, kinds: null, data: null }) as unknown as CheckedEntry;

const config = (start: number, entries: CheckedEntry[]): CheckedConfig => ({ file: null, side: "public", start, entries }) as CheckedConfig;

const S = 5_000;
const base = (network = "mainnet") =>
  config(S, [entry(0, "core", S, { network }), entry(1, "core-contract-logs-fast", S), entry(2, "token-metadata", S), entry(3, "later", S + 50)]);
const indexer = { id: "token-metadata", latestStarts: { mainnet: 1_200, preview: 300 } };

describe("withLatestStarts", () => {
  it("starts the database at the module's latest start, with every entry that starts at S; a later entry keeps its start", () => {
    const { config: got, lowered } = withLatestStarts(base(), [indexer]);
    expect(got.start).toBe(1_200);
    expect(got.entries.map((e) => [e.id, e.start])).toEqual([
      ["core", 1_200],
      ["core-contract-logs-fast", 1_200],
      ["token-metadata", 1_200],
      ["later", S + 50],
    ]);
    expect(lowered).toEqual({ from: S, to: 1_200, module: "token-metadata", network: "mainnet" });
  });

  it("takes the lowest latest start of the enabled modules", () => {
    const other = { id: "core-contract-logs-fast", latestStarts: { mainnet: 900 } };
    expect(withLatestStarts(base(), [indexer, other]).lowered).toMatchObject({ to: 900, module: "core-contract-logs-fast" });
  });

  it("leaves the configuration as it is: a network no module names, a start at or below the latest, a module not enabled", () => {
    for (const [why, cfg, declarations] of [
      ["custom network", base("custom"), [indexer]],
      ["at the latest start", config(1_200, [entry(0, "core", 1_200, { network: "mainnet" }), entry(1, "token-metadata", 1_200)]), [indexer]],
      ["below the latest start", config(0, [entry(0, "core", 0, { network: "mainnet" }), entry(1, "token-metadata", 0)]), [indexer]],
      ["not enabled", config(S, [entry(0, "core", S, { network: "mainnet" })]), [indexer]],
      ["no latest starts", base(), [{ id: "token-metadata" }]],
    ] as const) {
      const { config: got, lowered } = withLatestStarts(cfg, declarations);
      expect([why, lowered]).toEqual([why, null]);
      expect(got).toBe(cfg);
    }
  });

  it("does nothing without a core revision of the build's version at S, whose network it reads", () => {
    const cfg = config(S, [{ ...entry(0, "core", S, { network: "mainnet" }), buildVersion: false } as CheckedEntry, entry(1, "token-metadata", S)]);
    expect(withLatestStarts(cfg, [indexer]).lowered).toBeNull();
    expect(withLatestStarts(config(S, [entry(0, "core", S, null), entry(1, "token-metadata", S)]), [indexer]).lowered).toBeNull();
  });
});
