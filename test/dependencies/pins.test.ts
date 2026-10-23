import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Task 0.1 of `openspec/changes/core-arch` (proposal.md "New runtime dependencies", design.md §14): the versions
// the characterization tests in this folder were run against are pinned exactly, in `package.json` and in the
// lockfile that `npm ci` installs from. `typescript` is a runtime dependency (for `umbradb config check`, design.md
// §7) and `zod` stays on major version 4 (owner decision Q45).

type Manifest = { dependencies: Record<string, string>; devDependencies: Record<string, string> };
type Lockfile = { packages: Record<string, { version: string; dev?: boolean }> };

const readJson = <T>(name: string): T =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../${name}`, import.meta.url)), "utf8")) as T;

const manifest = readJson<Manifest>("package.json");
const lockfile = readJson<Lockfile>("package-lock.json");
const locked = (name: string) => lockfile.packages[`node_modules/${name}`];

describe("dependency pins", () => {
  it("pins @electric-sql/pglite 0.5.10 and ws 8.22.0 exactly as runtime dependencies", () => {
    expect(manifest.dependencies["@electric-sql/pglite"]).toBe("0.5.10");
    expect(manifest.dependencies["ws"]).toBe("8.22.0");
    expect(locked("@electric-sql/pglite")).toMatchObject({ version: "0.5.10" });
    expect(locked("@electric-sql/pglite")?.dev).toBeUndefined();
    expect(locked("ws")).toMatchObject({ version: "8.22.0" });
    expect(locked("ws")?.dev).toBeUndefined();
  });

  it("pins esbuild 0.28.2 exactly as a development dependency", () => {
    expect(manifest.devDependencies["esbuild"]).toBe("0.28.2");
    expect(manifest.dependencies["esbuild"]).toBeUndefined();
    expect(locked("esbuild")).toMatchObject({ version: "0.28.2", dev: true });
  });

  it("has typescript as a runtime dependency only", () => {
    expect(manifest.dependencies["typescript"]).toBeDefined();
    expect(manifest.devDependencies["typescript"]).toBeUndefined();
    expect(locked("typescript")?.dev).toBeUndefined();
  });

  it("keeps zod on major version 4 as a runtime dependency", () => {
    expect(manifest.dependencies["zod"]).toMatch(/^\^4\./);
    expect(locked("zod")?.version).toMatch(/^4\./);
    expect(locked("zod")?.dev).toBeUndefined();
  });
});
