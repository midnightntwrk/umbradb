/**
 * Builds the step-by-step page into `web/dist/` (or `--out <dir>`):
 *
 *     npm ci --ignore-scripts --prefix examples/private-shielded-sync/client   # once: the client's packages
 *     node examples/private-shielded-sync/web/build.ts
 *
 * - `page.js` (`./page.ts`) and `worker.js` (`./worker.ts`, the client), bundled by the repository's esbuild for the
 *   browser, with `node:crypto` and the other Node.js modules the client's files import replaced by `./shims/`, and
 *   Node.js's `Buffer` injected (`buffer`);
 * - `index.html` (`./page.html`) and `explain.html` (`./explain.html`, how each step works);
 * - `pss-kernel.wasm` (the scan kernel; the worker checks its SHA-256 against the committed one, built in as
 *   `KERNEL_DIGEST`), `pss-ipir.wasm` (the wallet's IPIR+SP math, `../ipir/pss-ipir.wasm`; fetched only for an IPIR+SP
 *   snapshot and checked against its committed SHA-256, built in as `IPIR_DIGEST`) and `ledger-v9.wasm` (from the
 *   client's install of `@midnightntwrk/ledger-v9`);
 * - beside each `.html`, `.js` and `.wasm` file, its brotli (`.br`, quality 11) and gzip (`.gz`, level 9) copy, which
 *   `./serve.ts` sends to a browser that accepts it: about 12 MB of files load as about 5 MB.
 *
 * The client's packages (`@scure/bip39`, `@midnightntwrk/wallet-sdk-hd`, `@noble/hashes`, the ledger) resolve from
 * `client/node_modules`. No type check runs here; `npx tsc -p examples/private-shielded-sync/web` does that.
 */

import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { build, type Plugin } from "esbuild";

const HERE = dirname(fileURLToPath(import.meta.url));
const EXAMPLE = resolve(HERE, "..");
const CLIENT_MODULES = join(EXAMPLE, "client", "node_modules");
const LEDGER = join(CLIENT_MODULES, "@midnightntwrk", "ledger-v9");
const { values } = parseArgs({ options: { out: { type: "string" } } });
const out = resolve(values.out ?? join(HERE, "dist"));

try {
  readFileSync(join(LEDGER, "package.json"));
} catch {
  throw new Error("the client's packages are not installed: npm ci --ignore-scripts --prefix examples/private-shielded-sync/client");
}

/** `virtual:ledger-v9` and the snippets' `#self` (see `./ledger-v9.ts`). */
function ledgerPlugin(): Plugin {
  const snippetDir = readdirSync(join(LEDGER, "snippets"))[0]!;
  const snippets = readdirSync(join(LEDGER, "snippets", snippetDir)).filter((f) => f.endsWith(".js")).sort();
  const bg = "./midnight_ledger_wasm_v9_bg.js";
  const lines = [
    `export * from ${JSON.stringify(bg)};`,
    `import * as bg from ${JSON.stringify(bg)};`,
    ...snippets.map((f, i) => `import * as s${i} from ${JSON.stringify(`./snippets/${snippetDir}/${f}`)};`),
    "const IMPORTS = {",
    `  ${JSON.stringify(bg)}: bg,`,
    ...snippets.map((f, i) => `  ${JSON.stringify(`./snippets/${snippetDir}/${f}`)}: s${i},`),
    "};",
    "export async function initLedger(url) {",
    "  const bytes = await (await fetch(url)).arrayBuffer();",
    "  const { instance } = await WebAssembly.instantiate(bytes, IMPORTS);",
    "  bg.__wbg_set_wasm(instance.exports);",
    "  instance.exports.__wbindgen_start();",
    "  return { ledger: bg, bytes: bytes.byteLength };",
    "}",
  ];
  return {
    name: "ledger-v9",
    setup(b) {
      b.onResolve({ filter: /^(virtual:ledger-v9|#self)$/ }, () => ({ path: "ledger-v9", namespace: "virtual-ledger" }));
      b.onLoad({ filter: /.*/, namespace: "virtual-ledger" }, () => ({ contents: lines.join("\n"), loader: "js", resolveDir: LEDGER }));
    },
  };
}

const node = join(HERE, "shims", "node.ts");
mkdirSync(out, { recursive: true });
/** The SHA-256 a `.sha256` file beside a committed `.wasm` records. */
const committedDigest = (path: string): string => {
  const digest = readFileSync(path, "utf8").trim().split(/\s+/)[0] ?? "";
  if (!/^[0-9a-f]{64}$/.test(digest)) throw new Error(`no SHA-256 in ${path}`);
  return digest;
};
const kernelDigest = committedDigest(join(EXAMPLE, "kernel", "pss-kernel.wasm.sha256"));
const ipirDigest = committedDigest(join(EXAMPLE, "ipir", "pss-ipir.wasm.sha256"));
const common = {
  bundle: true,
  format: "esm" as const,
  platform: "browser" as const,
  target: "es2022",
  sourcemap: true,
  nodePaths: [CLIENT_MODULES],
  alias: {
    "node:crypto": join(HERE, "shims", "crypto.ts"),
    "node:fs": node,
    "node:url": node,
    "node:path": node,
    "node:events": node,
    "node:os": node,
    "node:worker_threads": node,
  },
  inject: [join(HERE, "shims", "buffer.ts")],
  define: { global: "globalThis", KERNEL_DIGEST: JSON.stringify(kernelDigest), IPIR_DIGEST: JSON.stringify(ipirDigest) },
  logLevel: "warning" as const,
};
await build({ ...common, entryPoints: { worker: join(HERE, "worker.ts") }, outdir: out, plugins: [ledgerPlugin()] });
await build({ ...common, entryPoints: { page: join(HERE, "page.ts") }, outdir: out });
copyFileSync(join(HERE, "page.html"), join(out, "index.html"));
copyFileSync(join(HERE, "explain.html"), join(out, "explain.html"));
copyFileSync(join(EXAMPLE, "kernel", "pss-kernel.wasm"), join(out, "pss-kernel.wasm"));
copyFileSync(join(EXAMPLE, "ipir", "pss-ipir.wasm"), join(out, "pss-ipir.wasm"));
copyFileSync(join(LEDGER, "midnight_ledger_wasm_v9_bg.wasm"), join(out, "ledger-v9.wasm"));
// Compressed copies, made once here at the highest settings (serve.ts only picks one).
let plain = 0;
let brotli = 0;
for (const name of readdirSync(out)) {
  if (!/\.(html|js|wasm)$/.test(name)) continue;
  const bytes = readFileSync(join(out, name));
  const br = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 11, [constants.BROTLI_PARAM_SIZE_HINT]: bytes.length } });
  writeFileSync(join(out, `${name}.br`), br);
  writeFileSync(join(out, `${name}.gz`), gzipSync(bytes, { level: 9 }));
  plain += bytes.length;
  brotli += br.length;
}
process.stdout.write(`built ${out} (${(plain / 1048576).toFixed(1)} MB; ${(brotli / 1048576).toFixed(1)} MB with brotli)\n`);
