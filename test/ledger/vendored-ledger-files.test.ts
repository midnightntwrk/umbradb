import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Task 0.2 of `openspec/changes/core-arch` (design.md §5.2, specs/ledger LG-5): what the repository records for each
// vendored ledger build — the pinned upstream source, the patches, the build pins — and that the committed package is
// exactly the one SHA256SUMS records. Task 12.2a (A159, owner decision Q139 A) adds a third: v9 as runtime 2.0 built
// it, `ledger-9.1.0.0-rc.3`. (`npm run vendor:ledger` rebuilds the packages and compares them with
// SHA256SUMS; this test checks the committed files without rebuilding.)

const ledgerDir = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

/** Every vendored ledger version: `vendor/ledger/<version>/`. */
const VERSIONS = ["v8", "v9", "v9-rc3"] as const;

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

  it("pins v9-rc3 to ledger-9.1.0.0-rc.3, the v9 ledger midnight-node 2.0.0-rc.4 (runtime 2.0) builds, as a package of its own (A159)", () => {
    expect(readUpstream("v9-rc3")).toEqual({
      repository: "https://github.com/midnightntwrk/midnight-ledger",
      // The workspace tag; the node's per-crate tag crate-ledger-9.1.0.0-rc.3 is an isolate commit of it.
      commit: "4823b5351b17cc49e30f19760dbd30a73cf95e22",
      tag: "ledger-9.1.0.0-rc.3",
      versionName: "ledger-9.1.0.0-rc.3",
      build: {
        crate: "midnight-ledger-wasm-v9",
        wasmBindgen: "0.2.108",
        dtsTemplate: "ledger-wasm/ledger-v9.template.d.ts",
        dtsName: "ledger-v9.d.ts",
      },
      package: { name: "@umbradb/vendored-ledger-v9-rc3", version: "1.0.0-rc.3" },
    });
    const directories = readdirSync(ledgerDir).filter((name) => statSync(join(ledgerDir, name)).isDirectory()).sort();
    expect(directories).toEqual([...VERSIONS].sort());
  });

  it("numbers the patches, keeps the node's storage layout, and builds the v8 to v9 translation the node pins", () => {
    for (const version of VERSIONS) {
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
    // The rc.3 package: the node that builds it carries no v8 to v9 translation, and neither does it; ledger-9.1.0.0-rc.3
    // pins wasm-bindgen 0.2.104 as ledger-8.1.2 does, moved to 0.2.108 the same way.
    const rc3 = patchText("v9-rc3");
    expect(rc3).not.toContain("da96e33d78ee9b7d3867b15c1037510d499cd909");
    expect(rc3).not.toContain("convertFromV8");
    expect(rc3).toContain('+wasm-bindgen = "=0.2.108"');
    expect(rc3).toContain("postBlockUpdateExact");
  });

  it("applies to rc.3 the v9 patches that apply there: the node store, the VM's log decoding, the exports, the exact update", () => {
    expect(patchesOf("v9-rc3")).toEqual([
      "0001-storage-core-external-node-store.patch",
      "0002-onchain-vm-public-decode-event.patch",
      "0003-ledger-wasm-node-store-exports.patch",
      "0004-wasm-bindgen-0.2.108.patch",
      "0005-ledger-wasm-exact-post-block-update.patch",
      "0006-ledger-wasm-state-trees.patch",
    ]);
    // The storage patch is v9's, byte for byte: storage-core is the same source at both tags.
    const patch = (version: string, name: string): string => readFileSync(join(ledgerDir, version, "patches", name), "utf8");
    expect(patch("v9-rc3", "0001-storage-core-external-node-store.patch")).toBe(patch("v9", "0001-storage-core-external-node-store.patch"));
  });

  it("pins the build image's toolchain by digest and checksum", () => {
    const dockerfile = readFileSync(join(ledgerDir, "Dockerfile"), "utf8");
    expect(dockerfile).toMatch(/^FROM rust@sha256:[0-9a-f]{64}$/m);
    expect(dockerfile).toMatch(/binaryen-version_133/);
    expect(dockerfile.match(/[0-9a-f]{64}/g)!.length).toBeGreaterThanOrEqual(3);
    expect(dockerfile).toContain("wasm-bindgen-cli --version 0.2.108");
  });

  it("gives every version the same export of LG-16's tree values, last (task 12.1b, A158)", () => {
    const added = (version: string): string[] => {
      const name = patchesOf(version).at(-1) as string;
      expect(name, version).toMatch(/-ledger-wasm-state-trees\.patch$/);
      return readFileSync(join(ledgerDir, version, "patches", name), "utf8")
        .split("\n")
        .filter((line) => line.startsWith("+") && !line.startsWith("+++"));
    };
    expect(added("v8")).toEqual(added("v9"));
    expect(added("v9-rc3")).toEqual(added("v9"));
    expect(added("v9").join("\n")).toContain('#[wasm_bindgen(js_name = "stateTrees")]');
  });

  for (const version of VERSIONS) {
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
