import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

// What the repository records for each vendored ledger build (the pinned upstream source, the patches, the build pins),
// and that the committed package is exactly the one SHA256SUMS records. (`npm run vendor:ledger` rebuilds the packages
// and compares them with SHA256SUMS; this test checks the committed files without rebuilding, and runs the build script
// up to its build with stand-ins for what needs the network or the compiler.)
//
// There are two more builds besides v8 and v9: v9 as runtime 2.0 built it, `ledger-9.1.0.0-rc.3`, and as runtime 2.1.0
// built it, `ledger-9.1.0.0-rc.5`.

const ledgerDir = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

/** Every vendored ledger version: `vendor/ledger/<version>/`. */
const VERSIONS = ["v8", "v9", "v9-rc3", "v9-rc5"] as const;

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
/** The lines a patch adds (its `+` lines, without the file headers). */
const addedLines = (version: string, name: string): string[] =>
  readFileSync(join(ledgerDir, version, "patches", name), "utf8")
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"));
const patchText = (version: string): string =>
  patchesOf(version)
    .map((name) => readFileSync(join(ledgerDir, version, "patches", name), "utf8"))
    .join("\n");

const BUILD_SCRIPT = readFileSync(join(ledgerDir, "build-in-container.sh"), "utf8");

/** The settings the build script hands its one `cargo build` (vendor/ledger/README.md, "Rebuilding"). */
const SPEED_SETTINGS = {
  CARGO_PROFILE_WASM_OPT_LEVEL: "3",
  CFLAGS_wasm32_unknown_unknown: "-O3 -mllvm -inline-threshold=5000",
} as const;

/** The stand-in for `cargo` exits with this: the script reached its build, and stops there. */
const AT_BUILD = 97;

/**
 * Stand-ins for what needs the network or the compiler. `git`: `init` makes the directory, the fetch and the checkout
 * do nothing, `rev-parse` gives the pinned commit, `apply` records the patch and where it was applied. `jq`: the one
 * form the script uses before its build (`jq -er <path> <file>`), answered from the version's `upstream.json`. `cargo`:
 * records its arguments, its working directory and its environment, and exits.
 */
const STAND_INS: Readonly<Record<string, string>> = {
  git: `#!/usr/bin/env bash
set -euo pipefail
dir=$PWD
while [ $# -gt 0 ]; do
  case "$1" in
    -C) dir=$2; shift 2 ;;
    -c) shift 2 ;;
    *) break ;;
  esac
done
command=$1
shift
case "$command" in
  init) mkdir -p "\${@: -1}" ;;
  fetch | checkout) ;;
  rev-parse) printf '%s\\n' "$STAND_IN_COMMIT" ;;
  apply) printf 'git apply %s %s\\n' "$dir" "\${@: -1}" >> "$STAND_IN_DIR/calls" ;;
  *) echo "git stand-in: unexpected git $command $*" >&2; exit 2 ;;
esac
`,
  jq: `#!/usr/bin/env bash
set -euo pipefail
if [ $# -ne 3 ] || [ "$1" != "-er" ]; then echo "jq stand-in: unexpected jq $*" >&2; exit 2; fi
awk -F '\\t' -v path="$2" '$1 == path { print $2; found = 1 } END { exit !found }' "$STAND_IN_DIR/fields"
`,
  cargo: `#!/usr/bin/env bash
printf 'cargo %s\\n' "$*" >> "$STAND_IN_DIR/calls"
printf '%s\\n' "$@" > "$STAND_IN_DIR/cargo.args"
pwd > "$STAND_IN_DIR/cargo.cwd"
env > "$STAND_IN_DIR/cargo.env"
exit ${AT_BUILD}
`,
};

/** The stand-ins' directory, written once for the file's runs. */
let standIns: string | undefined;
function standInsDir(): string {
  if (standIns === undefined) {
    standIns = realpathSync(mkdtempSync(join(tmpdir(), "umbradb-build-stand-ins-")));
    for (const [name, text] of Object.entries(STAND_INS)) {
      writeFileSync(join(standIns, name), text);
      chmodSync(join(standIns, name), 0o755);
    }
  }
  return standIns;
}
afterAll(() => {
  if (standIns !== undefined) rmSync(standIns, { recursive: true, force: true });
});

/** `upstream.json`'s values by their jq path (`.build.crate`), for the stand-in for `jq`. */
function jqFields(value: unknown, path = ""): string[] {
  if (value !== null && typeof value === "object") return Object.entries(value).flatMap(([key, inner]) => jqFields(inner, `${path}.${key}`));
  return [`${path}\t${String(value)}`];
}

interface BuildStepRun {
  readonly status: number | null;
  readonly stderr: string;
  /** The stand-ins' calls in order (`git apply <directory> <patch>`, `cargo <arguments>`), the temporary root shown as nothing. */
  readonly calls: readonly string[];
  /** What `cargo` received, if the script reached it. */
  readonly cargo?: { readonly args: readonly string[]; readonly cwd: string; readonly env: Readonly<Record<string, string>> };
}

/**
 * Runs `script` (the build script, or a changed copy of it) on this host for `version`, up to its one `cargo build`.
 * The container's fixed paths (`/in`, `/out`, `/build`, `/opt`) are moved under a temporary directory, `/in` holding
 * the version's directory without its built package, and the stand-ins come first on the `PATH`. The environment is
 * otherwise empty, so a setting the script does not hand the build cannot come from this host's.
 */
function runBuildStep(version: string, script: string = BUILD_SCRIPT): BuildStepRun {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "umbradb-build-step-")));
  try {
    const relocated = script.replace(/(^|[\s"'=(])\/(in|out|build|opt)(?=[/\s"');]|$)/gm, (_, before: string, dir: string) => `${before}${root}/${dir}`);
    if (/(?<![\w.-])\/(?:in|out|build|opt)\b/.test(relocated)) throw new Error("a fixed path of the build script was not moved");
    writeFileSync(join(root, "build-in-container.sh"), relocated);
    cpSync(join(ledgerDir, version), join(root, "in"), { recursive: true, filter: (path) => relative(join(ledgerDir, version), path) !== "pkg" });
    mkdirSync(join(root, "out"));
    const upstream = readUpstream(version);
    writeFileSync(join(root, "fields"), `${jqFields(upstream).join("\n")}\n`);
    writeFileSync(join(root, "calls"), "");
    const ran = spawnSync("bash", [join(root, "build-in-container.sh")], {
      encoding: "utf8",
      env: { PATH: `${standInsDir()}:${process.env.PATH ?? "/usr/bin:/bin"}`, STAND_IN_DIR: root, STAND_IN_COMMIT: upstream.commit },
    });
    const shown = (text: string): string => text.split(root).join("");
    const read = (name: string): string | undefined => (existsSync(join(root, name)) ? readFileSync(join(root, name), "utf8") : undefined);
    const args = read("cargo.args");
    return {
      status: ran.status,
      stderr: shown(ran.stderr),
      calls: shown(read("calls") ?? "").split("\n").filter((line) => line !== ""),
      ...(args === undefined
        ? {}
        : {
            cargo: {
              args: args.trimEnd().split("\n"),
              cwd: shown(read("cargo.cwd") ?? "").trim(),
              env: Object.fromEntries(
                (read("cargo.env") ?? "")
                  .split("\n")
                  .filter((line) => line.includes("="))
                  .map((line) => [line.slice(0, line.indexOf("=")), shown(line.slice(line.indexOf("=") + 1))]),
              ),
            },
          }),
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** The speed settings `cargo` received in `run`, each as it received it (absent: `undefined`). */
const settingsReceived = (run: BuildStepRun): Record<string, string | undefined> =>
  Object.fromEntries(Object.keys(SPEED_SETTINGS).map((name) => [name, run.cargo?.env[name]]));

describe("vendored ledger builds: the recorded sources and pins", () => {
  it("pins v8 to ledger-8.1.2 and v9 to ledger-9.1.0.1 of midnight-ledger", () => {
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
      // The release midnight-node 2.1.101 runs (its Cargo.lock: midnight-ledger-v9 1.0.1 and the other 9.1.0.1 crates).
      commit: "a2b30128ca4b660b73a068e29b56b48ede8c9a74",
      tag: "ledger-9.1.0.1",
      versionName: "ledger-9.1.0.1",
      build: { crate: "midnight-ledger-wasm-v9", wasmBindgen: "0.2.108" },
      package: { name: "@umbradb/vendored-ledger-v9", version: "1.0.1" },
    });
  });

  it("pins v9-rc3 to ledger-9.1.0.0-rc.3, the v9 ledger midnight-node 2.0.0-rc.4 (runtime 2.0) builds, as a package of its own", () => {
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

  it("pins v9-rc5 to ledger-9.1.0.0-rc.5, the v9 ledger midnight-node 2.1.0-rc.4 (runtime 2.1.0) builds, as a package of its own", () => {
    expect(readUpstream("v9-rc5")).toEqual({
      repository: "https://github.com/midnightntwrk/midnight-ledger",
      // The workspace tag; the node's per-crate tags crate-ledger-9.1.0.0-rc.5 etc. are isolate commits of it.
      commit: "67f9f97246339539af0091c4d8c6bc5ab236a191",
      tag: "ledger-9.1.0.0-rc.5",
      versionName: "ledger-9.1.0.0-rc.5",
      build: {
        crate: "midnight-ledger-wasm-v9",
        wasmBindgen: "0.2.108",
        dtsTemplate: "ledger-wasm/ledger-v9.template.d.ts",
        dtsName: "ledger-v9.d.ts",
      },
      package: { name: "@umbradb/vendored-ledger-v9-rc5", version: "1.0.0-rc.5" },
    });
    // The translation and ledger v8 release midnight-node 2.1.0-rc.4 pins.
    const rc5 = patchText("v9-rc5");
    expect(rc5).toContain('rev = "da96e33d78ee9b7d3867b15c1037510d499cd909"');
    expect(rc5).toContain('version = "=8.1.2"');
  });

  it("numbers the patches, keeps the node's storage layout, and builds the v8 to v9 translation the node pins", () => {
    for (const version of VERSIONS) {
      const patches = patchesOf(version);
      expect(patches.length).toBeGreaterThan(0);
      patches.forEach((name, i) => expect(name).toMatch(new RegExp(`^${String(i + 1).padStart(4, "0")}-[a-z0-9.-]+\\.patch$`)));
      expect(patchText(version)).toContain('features = ["layout-v2", "gc-v1"]');
    }
    const v9 = patchText("v9");
    // The translation at the tag midnight-node 2.1.101 pins (state-translation-v8-v9-node-2.1.101), and ledger v8 8.1.3.
    expect(v9).toContain('rev = "39cfd0531524b87e53198ce136777530c29646aa"');
    expect(v9).toContain('version = "=8.1.3"');
    // ledger-8.1.2 pins wasm-bindgen 0.2.104, whose generated bindings differ from run to run; the v8 patches move it
    // to 0.2.108, the version ledger-9.1.0.1 pins.
    expect(patchText("v8")).toContain('+wasm-bindgen = "=0.2.108"');
    // The rc.3 package: the node that builds it carries no v8 to v9 translation, and neither does it; ledger-9.1.0.0-rc.3
    // pins wasm-bindgen 0.2.104 as ledger-8.1.2 does, moved to 0.2.108 the same way.
    const rc3 = patchText("v9-rc3");
    expect(rc3).not.toContain("v8-to-v9-state-translation");
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

  it("gives every version the same export of the tree values", () => {
    const added = (version: string): string[] => {
      const name = patchesOf(version).find((patch) => patch.endsWith("-ledger-wasm-state-trees.patch"));
      expect(name, version).toBeDefined();
      return addedLines(version, name as string);
    };
    expect(added("v8")).toEqual(added("v9"));
    expect(added("v9-rc3")).toEqual(added("v9"));
    expect(added("v9-rc5")).toEqual(added("v9"));
    expect(added("v9").join("\n")).toContain('#[wasm_bindgen(js_name = "stateTrees")]');
  });

  // The build script is run on this host with stand-ins for git, jq and cargo (`runBuildStep`): what is checked is the
  // environment and the arguments its one `cargo build` receives. What the compiler makes of the settings (that blst's
  // field multiplication is inlined) and what a block gains by them are not checked by a test: the packages recorded
  // with them differ from those built without them, and a rebuild gives the recorded bytes (`npm run vendor:ledger`).
  it("hands the one cargo build of every version the speed settings it asks for: opt-level 3, and -O3 with a high inline threshold for C code", () => {
    for (const version of VERSIONS) {
      const run = runBuildStep(version);
      expect(run.status, `${version}: ${run.stderr}`).toBe(AT_BUILD);
      const args = ["build", "--locked", "--profile", "wasm", "--target", "wasm32-unknown-unknown", "-p", readUpstream(version).build.crate];
      expect(run.cargo?.args, version).toEqual(args);
      expect(run.cargo?.cwd, version).toBe("/build/src");
      expect(settingsReceived(run), version).toEqual(SPEED_SETTINGS);
      expect(run.cargo?.env.RUSTC_WRAPPER, version).toBe("/build/rustc-wrapper.sh");
      // The version's patches, each applied to the source in file-name order, then the one build.
      expect(run.calls, version).toEqual([...patchesOf(version).map((name) => `git apply /build/src /in/patches/${name}`), `cargo ${args.join(" ")}`]);
    }
  });

  it("negative controls: a setting commented out, set but not exported, unset or overridden before the build is not the one cargo receives", () => {
    const changed = (from: string, to: string): string => {
      expect(BUILD_SCRIPT, from).toContain(from);
      return BUILD_SCRIPT.replace(from, to);
    };
    const optLevel = "export CARGO_PROFILE_WASM_OPT_LEVEL=3\n";
    const cflags = 'export CFLAGS_wasm32_unknown_unknown="-O3 -mllvm -inline-threshold=5000"\n';
    const build = 'RUSTC_WRAPPER="$wrapper" cargo build ';
    const scripts = {
      "opt-level commented out": changed(optLevel, `# ${optLevel}`),
      "both commented out": changed(optLevel + cflags, `# ${optLevel}# ${cflags}`),
      "opt-level set but not exported": changed(optLevel, optLevel.replace("export ", "")),
      "C flags unset before the build": changed('cd "$src"\n', 'unset CFLAGS_wasm32_unknown_unknown\ncd "$src"\n'),
      "opt-level overridden on the build's line": changed(build, `CARGO_PROFILE_WASM_OPT_LEVEL=z ${build}`),
      "C flags exported again without the inline threshold": changed('cd "$src"\n', 'export CFLAGS_wasm32_unknown_unknown="-O3"\ncd "$src"\n'),
    };
    for (const [control, script] of Object.entries(scripts)) {
      const run = runBuildStep("v9", script);
      expect(run.status, `${control}: ${run.stderr}`).toBe(AT_BUILD);
      expect(settingsReceived(run), control).not.toEqual(SPEED_SETTINGS);
    }
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
