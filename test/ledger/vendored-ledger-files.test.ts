import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Task 0.2 of `openspec/changes/core-arch` (design.md §5.2, specs/ledger LG-5): what the repository records for each
// vendored ledger build — the pinned upstream source, the patches, the build pins — and that the committed package is
// exactly the one SHA256SUMS records. (`npm run vendor:ledger` rebuilds the packages and compares them with
// SHA256SUMS; this test checks the committed files without rebuilding.)

const ledgerDir = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

interface Upstream {
  repository: string;
  commit: string;
  tag: string;
  versionName: string;
  build: { crate: string; wasmBindgen: string; dtsTemplate: string; dtsName: string };
  package: { name: string; version: string };
}

const readUpstream = (version: string): Upstream =>
  JSON.parse(readFileSync(join(ledgerDir, version, "upstream.json"), "utf8")) as Upstream;

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

const patchesOf = (version: string): string[] => readdirSync(join(ledgerDir, version, "patches")).sort();
const patchText = (version: string): string =>
  patchesOf(version)
    .map((name) => readFileSync(join(ledgerDir, version, "patches", name), "utf8"))
    .join("\n");

describe("vendored ledger builds: the recorded sources and pins", () => {
  it("pins v8 to ledger-8.1.2 and v9 to ledger-9.1.0.0-rc.5 of midnight-ledger", () => {
    const v8 = readUpstream("v8");
    expect(v8).toMatchObject({
      repository: "https://github.com/midnightntwrk/midnight-ledger",
      commit: "36d7442172136758e33009f75ff4aa56616cff40",
      tag: "ledger-8.1.2",
      versionName: "ledger-8.1.2",
      build: { crate: "midnight-ledger-wasm", wasmBindgen: "0.2.108" },
    });
    const v9 = readUpstream("v9");
    expect(v9).toMatchObject({
      repository: "https://github.com/midnightntwrk/midnight-ledger",
      commit: "67f9f97246339539af0091c4d8c6bc5ab236a191",
      tag: "ledger-9.1.0.0-rc.5",
      versionName: "ledger-9.1.0.0-rc.5",
      build: { crate: "midnight-ledger-wasm-v9", wasmBindgen: "0.2.108" },
    });
  });

  it("numbers the patches, keeps the node's storage layout, and builds the v8 to v9 translation the node pins", () => {
    for (const version of ["v8", "v9"]) {
      const patches = patchesOf(version);
      expect(patches.length).toBeGreaterThan(0);
      patches.forEach((name, i) => expect(name).toMatch(new RegExp(`^${String(i + 1).padStart(4, "0")}-[a-z0-9.-]+\\.patch$`)));
      expect(patchText(version)).toContain('features = ["layout-v2", "gc-v1"]');
    }
    const v9 = patchText("v9");
    expect(v9).toContain('rev = "da96e33d78ee9b7d3867b15c1037510d499cd909"');
    expect(v9).toContain('version = "=8.1.2"');
    // ledger-8.1.2 pins wasm-bindgen 0.2.104, whose generated bindings differ from run to run; the v8 patches move it
    // to 0.2.108, the version ledger-9.1.0.0-rc.5 pins.
    expect(patchText("v8")).toContain('+wasm-bindgen = "=0.2.108"');
  });

  it("pins the build image's toolchain by digest and checksum", () => {
    const dockerfile = readFileSync(join(ledgerDir, "Dockerfile"), "utf8");
    expect(dockerfile).toMatch(/^FROM rust@sha256:[0-9a-f]{64}$/m);
    expect(dockerfile).toMatch(/binaryen-version_133/);
    expect(dockerfile.match(/[0-9a-f]{64}/g)!.length).toBeGreaterThanOrEqual(3);
    expect(dockerfile).toContain("wasm-bindgen-cli --version 0.2.108");
  });

  for (const version of ["v8", "v9"]) {
    it(`the committed ${version} package is exactly the one SHA256SUMS records`, () => {
      const recorded = readFileSync(join(ledgerDir, version, "SHA256SUMS"), "utf8")
        .trimEnd()
        .split("\n")
        .map((line) => {
          const match = /^([0-9a-f]{64}) {2}(pkg\/.+)$/.exec(line);
          if (!match) throw new Error(`malformed SHA256SUMS line: ${line}`);
          return `${match[1]}  ${match[2]}`;
        });
      const versionDir = join(ledgerDir, version);
      const actual = filesUnder(join(versionDir, "pkg"))
        .map((path) => `${createHash("sha256").update(readFileSync(path)).digest("hex")}  ${relative(versionDir, path)}`)
        .sort((a, b) => (a.slice(66) < b.slice(66) ? -1 : 1));
      expect(actual).toEqual(recorded);
      const pkg = JSON.parse(readFileSync(join(versionDir, "pkg", "package.json"), "utf8")) as {
        upstream: { commit: string; versionName: string };
      };
      const upstream = readUpstream(version);
      expect(pkg.upstream).toMatchObject({ commit: upstream.commit, versionName: upstream.versionName });
    });
  }
});
