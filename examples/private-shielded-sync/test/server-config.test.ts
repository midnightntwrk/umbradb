/**
 * The module as `umbradb run` loads it (spec FR-003): `run/sync.mjs config` writes the configuration the runner's
 * container runs — the module imported by absolute path from a built checkout, `umbradb` resolved through the
 * checkout's own package name — and `umbradb config check` passes on it. That check type-checks every file the
 * configuration imports with the options Node.js's type stripping needs (`erasableSyntaxOnly`,
 * `verbatimModuleSyntax`), evaluates it, and validates the module's settings against its schema.
 *
 * The checkout is built here as `npm run build` builds one (the TypeScript compiler on `tsconfig.build.json`), beside
 * the repository's `package.json` fields, links to its installed packages and vendored ledger, and a copy of this
 * example's folders. Negative control: settings outside the schema fail the same check.
 */

import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { REPOSITORY, runNode } from "../../../test/examples/example-checks.js";

const TSC = join(REPOSITORY, "node_modules", "typescript", "bin", "tsc");
const EXAMPLE = join(REPOSITORY, "examples", "private-shielded-sync");

describe("run/sync.mjs's configuration with the module passes umbradb config check", () => {
  let root: string;
  let checkout: string;

  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "pss-config-"));
    checkout = join(root, "checkout");
    mkdirSync(join(checkout, "node_modules"), { recursive: true });
    const own = JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as Record<string, unknown>;
    const fields = ["name", "version", "type", "main", "types", "exports", "bin"];
    writeFileSync(join(checkout, "package.json"), `${JSON.stringify(Object.fromEntries(fields.map((f) => [f, own[f]])), null, 2)}\n`);
    for (const entry of readdirSync(join(REPOSITORY, "node_modules"))) {
      if (entry === ".bin" || entry.startsWith(".")) continue;
      symlinkSync(join(REPOSITORY, "node_modules", entry), join(checkout, "node_modules", entry), "dir");
    }
    symlinkSync(join(REPOSITORY, "vendor"), join(checkout, "vendor"), "dir");
    for (const folder of ["server", "shared", "pir", "kernel", "run"]) {
      cpSync(join(EXAMPLE, folder), join(checkout, "examples", "private-shielded-sync", folder), {
        recursive: true,
        filter: (source) => !source.includes(`${join("kernel", "target")}`),
      });
    }
    const built = await runNode(
      [TSC, "-p", "tsconfig.build.json", "--outDir", join(checkout, "dist"), "--declarationMap", "false", "--sourceMap", "false"],
      REPOSITORY,
      600_000,
    );
    if (built.code !== 0) throw new Error(`the package's build failed:\n${built.output}`);
  }, 900_000);

  afterAll(() => {
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
  });

  /** `sync.mjs config` with `settings` as the module's configuration, then `config check` from the output directory. */
  async function check(label: string, settings: Record<string, unknown>) {
    const out = join(root, label);
    const settingsFile = join(root, `${label}.json`);
    writeFileSync(settingsFile, JSON.stringify(settings));
    const module = join(checkout, "examples", "private-shielded-sync", "server", "module.ts");
    const previous = process.env.PSS_NODE_WS;
    process.env.PSS_NODE_WS = "ws://127.0.0.1:9";
    let written;
    try {
      written = await runNode(
        [
          join(checkout, "examples", "private-shielded-sync", "run", "sync.mjs"),
          "config",
          "--label",
          label,
          "--out",
          out,
          "--build",
          checkout,
          "--module",
          `${module}#pssModule`,
          "--module-config",
          settingsFile,
          "--module-start",
          "3400000",
        ],
        root,
      );
    } finally {
      if (previous === undefined) delete process.env.PSS_NODE_WS;
      else process.env.PSS_NODE_WS = previous;
    }
    expect(written.code, written.output).toBe(0);
    const config = readFileSync(join(out, "umbradb.config.ts"), "utf8");
    expect(config).toContain(`import { pssModule } from ${JSON.stringify(module)};`);
    expect(config).toContain("pssModule.entry({ start: 3400000, config:");
    return runNode([join(checkout, "dist", "cli", "main.js"), "config", "check", "umbradb.config.ts"], out, 300_000);
  }

  it("the module with its settings: type check, evaluation and validation pass", { timeout: 600_000 }, async () => {
    const result = await check("good", { dataDir: "pss-data", pathSplit: 16, queriesPerCall: 32, snapshotEvery: 100, adminSecret: "0123456789abcdef0123", threads: 4 });
    expect(result.output).toContain("type check (TypeScript");
    expect(result.output).toContain("passed: every check that ran passed");
    expect(result.code).toBe(0);
    expect(result.output).not.toContain("0123456789abcdef0123");
  });

  it("negative control: a path split above 20 and an unknown setting fail the check", { timeout: 600_000 }, async () => {
    const result = await check("bad", { dataDir: "pss-data", pathSplit: 21, colour: "blue" });
    expect(result.code).not.toBe(0);
    expect(result.output).toMatch(/pathSplit/);
    expect(result.output).toMatch(/colour/);
  });
});
