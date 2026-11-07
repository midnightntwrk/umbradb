import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE, LEDGER_STATE_ITEM } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { commandBuild } from "../../src/cli/build-modules.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";

/**
 * The runtime mark-and-sweep removed, read from the sources and the build's declarations. [R18 STATIC, LG-11, LG-14]
 *
 * - `src/backbone/core-ledger-state/sweep.ts` does not exist, and no file under `src/` names the sweep's step, its
 *   reset, its budget, its grey picker or its three tables ({@link SWEEP_NAMES}, as whole words);
 * - the `ledger-state` item's tables are exactly `nodes`, `root_counts`, `states`, `ref_counts`, `unreferenced`;
 * - every part UmbraDB declares, on either side, that has migrations has exactly one, `001`, and the parts that have
 *   none ({@link WITHOUT_MIGRATIONS}) still have none.
 */

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** The names no file under `src/` may hold once the sweep is gone. */
const SWEEP_NAMES: readonly string[] = [
  "sweepStep",
  "sweepReset",
  "SWEEP_BUDGET",
  "GreyPicker",
  "core_ledger_state.sweep",
  "core_ledger_state.grey",
  "core_ledger_state.marks",
];

/** The parts with no migration, on either side: the block source and the three admin parts. */
const WITHOUT_MIGRATIONS: readonly string[] = ["core-block-fetch", "core-config", "core-health", "core-status"];

/** The files under `src/`, relative to the repository, with `/` separators. */
function sourceFiles(): string[] {
  return readdirSync(path.join(ROOT, "src"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(ROOT, path.join(entry.parentPath, entry.name)).split(path.sep).join("/"))
    .sort();
}

/** Each of {@link SWEEP_NAMES} that `text` holds as a whole word, in the list's order. */
function sweepNamesIn(text: string): string[] {
  const word = (name: string): RegExp => new RegExp(`(?<![\\w$.])${name.replace(/\./g, "\\.")}(?![\\w$])`);
  return SWEEP_NAMES.filter((name) => word(name).test(text));
}

/** Every part a build of `side` declares: its backbone and its core modules. */
function partsOf(side: "public" | "private"): readonly ModuleDeclaration[] {
  const build = commandBuild([], { side });
  return [...build.backbone, ...build.core] as ModuleDeclaration[];
}

describe("R18 [STATIC]: the runtime sweep removed (LG-11, LG-14)", () => {
  it("R18: src/backbone/core-ledger-state/sweep.ts does not exist, and no file under src/ names the sweep's step, reset, budget, grey picker or tables", () => {
    // The scan finds each name in a planted line, and none in a name that only begins like one.
    expect(sweepNamesIn(SWEEP_NAMES.map((name) => `x ${name};`).join("\n"))).toEqual(SWEEP_NAMES);
    expect(sweepNamesIn("sweepSteps core_ledger_state.sweeps GreyPickers my_SWEEP_BUDGET")).toEqual([]);

    expect(existsSync(path.join(ROOT, "src/backbone/core-ledger-state/sweep.ts"))).toBe(false);
    const files = sourceFiles();
    expect(files).toContain("src/backbone/core-ledger-state/refcount.ts");
    const named = files.flatMap((file) =>
      sweepNamesIn(readFileSync(path.join(ROOT, file), "utf8")).map((name) => `${file} names ${name}`),
    );
    expect(named).toEqual([]);
  });

  it("R18: the ledger-state item's tables are exactly nodes, root_counts, states, ref_counts, unreferenced", () => {
    const item = CORE_LEDGER_STATE.provides.find((provided) => provided.name === LEDGER_STATE_ITEM);
    expect(item?.table?.schema).toBe("core_ledger_state");
    expect([...(item?.table?.tables ?? [])].sort()).toEqual(
      ["nodes", "ref_counts", "root_counts", "states", "unreferenced"],
    );
  });

  it("R18: every part UmbraDB declares that has migrations has exactly one, 001, and the parts that have none still have none", () => {
    const parts = new Map<string, readonly string[]>();
    for (const side of ["public", "private"] as const) {
      for (const part of partsOf(side)) parts.set(part.id, part.migrations.map((migration) => migration.id));
    }
    // Both sides' backbones, every core module, and the private source.
    for (const id of ["core-chain", "core-digest", "core-ledger-state", "core-private-source", "core-contract-logs-full"]) {
      expect(parts.has(id), id).toBe(true);
    }
    const without = [...parts].filter(([, ids]) => ids.length === 0).map(([id]) => id).sort();
    expect(without).toEqual(WITHOUT_MIGRATIONS);
    const others = [...parts].filter(([, ids]) => ids.length > 0 && (ids.length !== 1 || ids[0] !== "001"));
    expect(others.map(([id, ids]) => `${id}: ${ids.join(", ")}`)).toEqual([]);
  });
});
