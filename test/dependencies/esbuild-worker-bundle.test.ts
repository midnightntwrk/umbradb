import { mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "esbuild";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Task 0.1 of `openspec/changes/core-arch` (design.md §9.2 and §14): characterization test of the pinned `esbuild`
// 0.28.2 for the browser build. A worker entry that imports a `.wasm` asset bundles with zero errors and zero
// warnings, the asset is emitted under a content-hashed name, and the bundle refers to it. The sources are written
// to a temporary directory at test time and deleted afterwards.

// `(module (func (export "answer") (result i32) i32.const 42))`, assembled by hand.
const ANSWER_WASM = Uint8Array.from([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // magic, version 1
  0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7f, // type section: () -> i32
  0x03, 0x02, 0x01, 0x00, // function section: one function of type 0
  0x07, 0x0a, 0x01, 0x06, 0x61, 0x6e, 0x73, 0x77, 0x65, 0x72, 0x00, 0x00, // export "answer" = function 0
  0x0a, 0x06, 0x01, 0x04, 0x00, 0x41, 0x2a, 0x0b, // code: i32.const 42, end
]);

const WORKER_ENTRY = `
import answerWasm from "./answer.wasm";

const ready = WebAssembly.instantiateStreaming(fetch(new URL(answerWasm, import.meta.url)));

self.addEventListener("message", async () => {
  const { instance } = await ready;
  self.postMessage((instance.exports.answer as () => number)());
});
`;

let dir: string;
let outdir: string;

beforeAll(() => {
  // The real path, so the metafile's paths are relative to it (on macOS the temporary directory is a symlink).
  dir = realpathSync(mkdtempSync(join(tmpdir(), "umbradb-esbuild-")));
  outdir = join(dir, "out");
  writeFileSync(join(dir, "answer.wasm"), ANSWER_WASM);
  writeFileSync(join(dir, "core-worker.ts"), WORKER_ENTRY);
});

afterAll(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe("esbuild 0.28.2 — a worker entry with a WASM asset", () => {
  it("bundles with zero errors and warnings, emits the asset, and the bundle refers to it", async () => {
    const result = await build({
      absWorkingDir: dir,
      entryPoints: ["core-worker.ts"],
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      outdir,
      loader: { ".wasm": "file" },
      assetNames: "assets/[name]-[hash]",
      metafile: true,
      write: true,
      logLevel: "silent",
    });
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);

    const assets = readdirSync(join(outdir, "assets"));
    expect(assets).toHaveLength(1);
    const asset = assets[0]!;
    expect(asset).toMatch(/^answer-[A-Z0-9]+\.wasm$/);
    expect(new Uint8Array(readFileSync(join(outdir, "assets", asset)))).toEqual(ANSWER_WASM);

    const outputs = Object.keys(result.metafile!.outputs).sort();
    expect(outputs).toEqual([`out/assets/${asset}`, "out/core-worker.js"]);

    const bundle = readFileSync(join(outdir, "core-worker.js"), "utf8");
    expect(bundle).toContain(`"./assets/${asset}"`);
    expect(bundle).not.toMatch(/\bimport\s/);
  });

  it("emits an asset that is the unchanged module: it instantiates and its export answers 42", async () => {
    const [asset] = readdirSync(join(outdir, "assets"));
    const { instance } = await WebAssembly.instantiate(readFileSync(join(outdir, "assets", asset!)));
    expect((instance.exports.answer as () => number)()).toBe(42);
  });
});
