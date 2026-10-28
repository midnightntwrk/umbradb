/**
 * The browser build (`openspec/changes/core-arch/specs/browser/spec.md` BR-1 to BR-4; `design.md` §9.2; task 16.1):
 * `npm run build:browser` writes `dist-browser/` — not part of the npm package — with esbuild 0.28.2 (task 0.1): the
 * page (`index.html`, `page.js`), the core and private workers (`core-worker.js`, `private-worker.js`, one process
 * each), the ledger worker (`ledger-worker.js`), PGlite's WebAssembly and data files, `pglite-tools`' `pg_dump`
 * WebAssembly (the page's backup, BK-5), and the vendored ledger packages' WebAssembly (`ledger/<version>/`). `node browser/build.ts [--configuration <module>] [--out <dir>]`; a test builds
 * its own page with its own configuration through {@link buildBrowser}.
 *
 * **The same code as Node.js.** The workers bundle UmbraDB's sources unchanged — the runner, the modules, the database
 * API on PGlite, the determinism code, the node client, the ledger worker's host and entry, the process transport —
 * and replace only what a browser does not have, each in one place:
 * - Node.js's built-in modules, for the files of `src/` that import them: `node:crypto` (SHA-256, synchronous and
 *   incremental: `./src/shims/crypto.ts`), `node:async_hooks` (no asynchronous context: PGlite's nested-call guard is
 *   off, `./src/shims/async-hooks.ts`), `node:worker_threads` (Web Workers: `./src/shims/worker-threads-*.ts`),
 *   `node:fs` (no file is read: `./src/shims/fs.ts`), `node:http`, `node:https` and `ws` for the process transport
 *   (the page's message network: `./src/net/`), `node:path` (POSIX paths from `/`); `Buffer`
 *   (`./src/shims/buffer.ts`), given to the files of `src/` that name it; `process.hrtime.bigint` (the heartbeat's
 *   clock: `performance.now()`, `./src/shims/prelude.ts`). Any other built-in module a file of UmbraDB's imports fails
 *   the build, naming it.
 * - Whole modules ({@link SUBSTITUTES}): the database's opening (PGlite in memory or OPFS, never PostgreSQL), the
 *   writer lock (Web Locks), the configuration loader (a bundled configuration, no file), the node client's socket (the
 *   browser's `WebSocket`), the module API's listener (the worker's message channel) and the ledger packages' identity
 *   check (`./src/ledger/identity.ts`: `ledgerSources` refused as in Node.js, no file read; see below).
 * - The vendored ledger packages' Node.js entries (`vendor/ledger/<version>/pkg/*_fs.js`, which read their `.wasm`
 *   synchronously): the same entry, its WebAssembly read beside the ledger worker (a synchronous request, as Node.js's
 *   `readFileSync`), checked against the package's `SHA256SUMS` (`package-hash-mismatch` otherwise) and instantiated
 *   synchronously (`./src/ledger/instantiate.ts`).
 * - PGlite's own Node.js paths (guarded at run time by PGlite) are left as they are, never reached; its Node.js file
 *   system (`fs/nodefs.js`), imported statically there, is a stub that refuses.
 * - Modules the browser does not carry ({@link UNAVAILABLE}: `umbradb backup`'s file writer, task 15.1) are bundled as
 *   stubs whose exports fail when used. The page's backup and restore (BK-5) run the same code without it: the PGlite
 *   backup's text (`src/backup/pglite-backup.ts`) and `restoreBackup` over the picked file's text (`src/backup/text.ts`).
 *
 * **The vendored packages' bytes are checked when the build reads them** (LG-5, A173; task 12.2b): each version's
 * `SHA256SUMS` against the SHA-256 the build records (`LEDGER_RELEASES`), before anything is bundled, then every file
 * of a package the bundles hold and every WebAssembly the build writes against its line of that manifest, each read
 * once, so the bytes checked are the bytes bundled. A changed file fails the build with `package-hash-mismatch` naming
 * the version and the file, and a file a manifest does not list fails it too. The packages are the repository's
 * `vendor/ledger/` unless {@link BrowserBuildOptions.ledgerRoot} names a copy (a test's).
 *
 * **The configuration** is a module the page bundles (`umbradb:configuration`): `./src/config.ts` unless given — the
 * host program's choice of modules, as a configuration file is for `umbradb run` (CF-1, MD-1).
 *
 * **Negative controls** (task 16.1's tests): `control` builds a page that differs in one way — `ignore-web-lock` takes
 * no Web Lock (`./src/db/web-lock.ts`), `plain-json-reader` reads `json` and `jsonb` with `JSON.parse` instead of the
 * lossless reader (`src/deterministic-postgresql/mapping.ts`'s `parseJsonLossless`), `foreign-request` makes the page
 * request one URL beside the node (`./src/page.ts`), `restore-skips-contents-hash` makes the page's restore skip BK-3's
 * contents hash check (`./src/process-worker.ts`).
 */

import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import ts from "typescript";

/** The repository's root. */
export const REPOSITORY = fileURLToPath(new URL("..", import.meta.url));

const BROWSER = join(REPOSITORY, "browser");
const SRC = join(REPOSITORY, "src");

/** A build that differs from the real one in one way, for a negative control (see the module comment). */
export type BrowserControl = "" | "ignore-web-lock" | "plain-json-reader" | "foreign-request" | "restore-skips-contents-hash";

/** What {@link buildBrowser} takes. */
export interface BrowserBuildOptions {
  /** The directory written (emptied first). */
  readonly outdir: string;
  /** The configuration module the page bundles; `browser/src/config.ts` unless given. */
  readonly configuration?: string;
  /** A negative control's build; none unless given. */
  readonly control?: BrowserControl;
  /** Minified output; false unless given (the page is a development setup, BR-1). */
  readonly minify?: boolean;
  /** The modules the browser does not carry ({@link UNAVAILABLE} unless given; a test's own). */
  readonly unavailable?: readonly string[];
  /**
   * The vendored ledger packages whose files the build bundles: the repository's `vendor/ledger/` unless given (a
   * test's copy, laid out as it is). The bundles resolve them in the repository and read their bytes from here.
   */
  readonly ledgerRoot?: string;
}

/** What {@link buildBrowser} wrote. */
export interface BrowserBuild {
  readonly outdir: string;
  /** Every file written, relative to `outdir`. */
  readonly files: readonly string[];
  /** Every input file of the bundles, relative to the repository (the static checks read it). */
  readonly inputs: readonly string[];
  /** The modules each bundle imports from outside itself, statically (none: each bundle holds what it runs). */
  readonly staticImports: Readonly<Record<string, readonly string[]>>;
}

/** UmbraDB's modules the browser replaces whole, by their path in the repository (see the module comment). */
export const SUBSTITUTES: Readonly<Record<string, string>> = Object.freeze({
  "src/config/database.ts": "browser/src/db/database.ts",
  "src/config/load.ts": "browser/src/config/load.ts",
  "src/db/pglite-lock.ts": "browser/src/db/web-lock.ts",
  "src/db/postgres.ts": "browser/src/db/postgres.ts",
  "src/ledger/identity.ts": "browser/src/ledger/identity.ts",
  "src/node/ws-socket.ts": "browser/src/node/web-socket.ts",
  "src/runner/api-server.ts": "browser/src/runner/api.ts",
});

/**
 * UmbraDB's modules the browser does not carry, by their path in the repository: each is bundled as a module of the
 * same value exports, every one of which fails when used ({@link unavailableModule}). `src/backup/backup.ts` (task
 * 15.1, `umbradb backup`) runs `pg_dump` and writes files; the page's own backup and restore (BK-5) use the parts that
 * do neither (see the module comment), so `restoreBackup`'s import of its `firstLine` is never called there. A path no
 * file of the build imports is never reached.
 */
export const UNAVAILABLE: readonly string[] = Object.freeze(["src/backup/backup.ts"]);

/** Node.js's built-in modules UmbraDB's files import, and what the browser gives them instead. */
const BUILTINS: Readonly<Record<string, string>> = Object.freeze({
  "node:crypto": "browser/src/shims/crypto.ts",
  "node:path": "browser/src/shims/path.ts",
  "node:async_hooks": "browser/src/shims/async-hooks.ts",
  "node:fs": "browser/src/shims/fs.ts",
  "node:http": "browser/src/net/http.ts",
  "node:https": "browser/src/net/https.ts",
  ws: "browser/src/net/ws.ts",
});

/** PGlite's files the page needs beside its bundles (PGlite fetches them relative to the bundle). */
const PGLITE_ASSETS = ["pglite.wasm", "pglite.data", "initdb.wasm"];

/** `pglite-tools`' `pg_dump` WebAssembly, which its bundled code fetches beside the bundle too (BK-5's backup). */
const PGLITE_TOOLS_ASSETS = ["pg_dump.wasm"];

/** The vendored ledger versions whose WebAssembly the ledger worker fetches. */
const LEDGERS = ["v8", "v9-rc3", "v9"] as const;

const NODE_BUILTIN = /^(node:|(assert|async_hooks|buffer|child_process|crypto|events|fs|fs\/promises|http|https|module|net|os|path|perf_hooks|stream|stream\/promises|tls|url|util|worker_threads|zlib)$)/;

/** A path inside the repository, with `/` separators. */
const repositoryPath = (file: string): string => relative(REPOSITORY, file).split("\\").join("/");

/** The TypeScript file an import of `specifier` from `importer` names (`.js` imports name `.ts` sources). */
function resolved(importer: string, specifier: string): string {
  const file = resolve(dirname(importer), specifier);
  return file.endsWith(".js") ? `${file.slice(0, -3)}.ts` : file;
}

/** The `_fs.js` entry's lines that read its WebAssembly (`vendor/ledger/build-in-container.sh` writes them). */
const FS_ENTRY_NODE_LINES = [
  /^import \{ readFileSync \} from "node:fs";\n/m,
  /^import \{ dirname, join \} from "node:path";\n/m,
  /^import \{ fileURLToPath \} from "node:url";\n/m,
];
const FS_ENTRY_INSTANCE =
  /^const wasmPath = join\(dirname\(fileURLToPath\(import\.meta\.url\)\), "([^"]+)"\);\nconst wasmModule = new WebAssembly\.Module\(readFileSync\(wasmPath\)\);\nconst wasmInstance = new WebAssembly\.Instance\(wasmModule, imports\);\n/m;

/** The vendored ledger packages' files, each checked when read (see the module comment). */
export interface CheckedLedgers {
  /** `version`'s manifest, checked against the SHA-256 the build records, as its text. */
  manifest(version: string): string;
  /** The `.wasm` files `version`'s manifest lists, by their paths in it (`pkg/…`). */
  wasm(version: string): readonly string[];
  /** The bytes of `file` (`pkg/…`) of `version`'s package, once their SHA-256 is its manifest line's. */
  read(version: string, file: string): Buffer;
}

/**
 * The packages of {@link LEDGERS} under `root`, their manifests checked now (see the module comment). Exported for its
 * tests.
 */
export async function checkedLedgers(root: string): Promise<CheckedLedgers> {
  // Imported here: when Node.js runs this file itself, `main` first resolves the sources' `.js` imports to `.ts`.
  const { readPackageFile, readRecordedManifest } = await import("../src/ledger/identity.js");
  const manifests = new Map<string, ReturnType<typeof readRecordedManifest>>(LEDGERS.map((version) => [version, readRecordedManifest(root, version)]));
  const linesOf = (version: string) => {
    const lines = manifests.get(version);
    if (lines === undefined) throw new Error(`the browser build carries no vendored ledger ${version}`);
    return lines;
  };
  return {
    manifest: (version) => linesOf(version).map((line) => `${line.sha256.slice(2)}  ${line.path}\n`).join(""),
    wasm: (version) => linesOf(version).filter((line) => /^pkg\/[^/]+\.wasm$/.test(line.path)).map((line) => line.path),
    read(version, file) {
      const line = linesOf(version).find((candidate) => candidate.path === file);
      if (line === undefined) throw new Error(`vendor/ledger/${version}/${file} is bundled, and its SHA256SUMS does not list it`);
      return readPackageFile(root, version as (typeof LEDGERS)[number], line);
    },
  };
}

/**
 * A vendored package's `_fs.js` for the browser (see the module comment): its WebAssembly fetched as
 * `ledger/<version>/<file>` beside the bundle, checked against its `SHA256SUMS` line, then instantiated.
 */
export function browserLedgerEntry(text: string, version: string, sums: string): string {
  let out = text;
  for (const line of FS_ENTRY_NODE_LINES) {
    if (!line.test(out)) throw new Error(`the vendored ledger ${version}'s _fs.js no longer has ${line}: update browser/build.ts`);
    out = out.replace(line, "");
  }
  const match = FS_ENTRY_INSTANCE.exec(out);
  if (match === null) throw new Error(`the vendored ledger ${version}'s _fs.js no longer reads its .wasm as expected: update browser/build.ts`);
  const file = match[1] as string;
  const sum = new RegExp(`^([0-9a-f]{64})  pkg/${file.replace(/[.]/g, "\\.")}$`, "m").exec(sums)?.[1];
  if (sum === undefined) throw new Error(`vendor/ledger/${version}/SHA256SUMS lists no pkg/${file}`);
  const instantiate = JSON.stringify(join(BROWSER, "src/ledger/instantiate.ts"));
  return (
    `import { instantiateLedger as __instantiateLedger } from ${instantiate};\n` +
    out.replace(
      FS_ENTRY_INSTANCE,
      `const wasmInstance = __instantiateLedger(new URL(${JSON.stringify(`./ledger/${version}/${file}`)}, globalThis.location.href), ` +
        `${JSON.stringify(sum)}, ${JSON.stringify(`${version} ${file}`)}, imports);\n`,
    )
  );
}

/**
 * The module the browser bundles in place of `name`, an unavailable module whose TypeScript source is `text` (see
 * {@link UNAVAILABLE}): the same value exports — its functions and classes failing when called or constructed, its
 * other values undefined —, so a file that imports it bundles, and fails only if it uses it.
 */
export function unavailableModule(text: string, name: string): string {
  const source = ts.createSourceFile(name, text, ts.ScriptTarget.ES2023, true);
  const exported = (node: ts.Node): boolean =>
    ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
  const fail = (what: string): string =>
    `throw new Error(${JSON.stringify(`${what} of ${name} is not available in the browser build`)});`;
  const lines: string[] = [];
  for (const statement of source.statements) {
    if (!exported(statement)) continue;
    if (ts.isFunctionDeclaration(statement) && statement.name !== undefined) {
      lines.push(`export function ${statement.name.text}() { ${fail(statement.name.text)} }`);
    } else if (ts.isClassDeclaration(statement) && statement.name !== undefined) {
      lines.push(`export class ${statement.name.text} { constructor() { ${fail(statement.name.text)} } }`);
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) lines.push(`export const ${declaration.name.text} = undefined;`);
      }
    }
  }
  return `${lines.join("\n")}\n`;
}

/** Whether `text` (a TypeScript source) names `Buffer` without importing it. */
const needsBuffer = (text: string): boolean =>
  /\bBuffer\b/.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")) && !/import[^;]*\bBuffer\b[^;]*from/.test(text);

/** The esbuild plugin of the workers' bundles (see the module comment). */
function browserPlugin(options: {
  readonly configuration: string;
  readonly worker: "host" | "worker";
  readonly control: BrowserControl;
  readonly unavailable: readonly string[];
  readonly ledgers: CheckedLedgers;
}): esbuild.Plugin {
  const workerThreads = join(BROWSER, options.worker === "host" ? "src/shims/worker-threads-host.ts" : "src/shims/worker-threads-worker.ts");
  const buffer = join(BROWSER, "src/shims/buffer.ts");
  return {
    name: "umbradb-browser",
    setup(build) {
      build.onResolve({ filter: /^umbradb:configuration$/ }, () => ({ path: options.configuration }));
      build.onResolve({ filter: /^#self$/ }, (args) => {
        const pkg = /^(.*\/vendor\/ledger\/v\d+(?:-[a-z0-9]+)?\/pkg)(\/|$)/.exec(args.importer)?.[1];
        if (pkg === undefined) return { errors: [{ text: `#self imported outside a vendored ledger package: ${args.importer}` }] };
        const entry = readdirSync(pkg).find((file) => file.endsWith("_fs.js"));
        return { path: join(pkg, entry as string) };
      });
      build.onResolve({ filter: /^\.\/fs\/nodefs\.js$/ }, (args) =>
        args.importer.includes("/@electric-sql/pglite/") ? { path: join(BROWSER, "src/shims/pglite-nodefs.ts") } : undefined,
      );
      build.onResolve({ filter: NODE_BUILTIN }, (args) => {
        // PGlite's own Node.js paths: guarded at run time, never reached in a browser.
        if (args.importer.includes("/node_modules/")) return { path: args.path, external: true };
        if (args.path === "node:worker_threads") return { path: workerThreads };
        const shim = BUILTINS[args.path];
        if (shim !== undefined) return { path: join(REPOSITORY, shim) };
        return { errors: [{ text: `${args.path}, imported by ${repositoryPath(args.importer)}, has no browser replacement (browser/build.ts)` }] };
      });
      build.onResolve({ filter: /^ws$/ }, (args) =>
        args.importer.includes("/node_modules/") ? { path: "ws", external: true } : { path: join(REPOSITORY, BUILTINS.ws as string) },
      );
      build.onResolve({ filter: /^\.\.?\// }, (args) => {
        if (args.importer.includes("/node_modules/") || args.namespace !== "file") return undefined;
        const target = resolved(args.importer, args.path);
        if (options.unavailable.includes(target)) return { path: target, namespace: "umbradb-unavailable" };
        if (!args.importer.startsWith(SRC)) return undefined;
        const substitute = SUBSTITUTES[repositoryPath(target)];
        return substitute === undefined ? undefined : { path: join(REPOSITORY, substitute) };
      });
      build.onLoad({ filter: /.*/, namespace: "umbradb-unavailable" }, (args) => ({
        contents: unavailableModule(readFileSync(args.path, "utf8"), repositoryPath(args.path)),
        loader: "js",
      }));
      // Every file of a vendored package the bundles hold, its bytes checked as read (see the module comment).
      build.onLoad({ filter: /\/vendor\/ledger\/v\d+(?:-[a-z0-9]+)?\/pkg\/.+\.js$/ }, (args) => {
        const [, version, file] = /\/vendor\/ledger\/(v\d+(?:-[a-z0-9]+)?)\/(pkg\/.+)$/.exec(args.path) as unknown as [string, string, string];
        const text = options.ledgers.read(version, file).toString("utf8");
        const contents = /^pkg\/[^/]+_fs\.js$/.test(file) ? browserLedgerEntry(text, version, options.ledgers.manifest(version)) : text;
        return { contents, loader: "js", resolveDir: dirname(args.path) };
      });
      build.onLoad({ filter: /\.ts$/ }, (args) => {
        if (!args.path.startsWith(SRC)) return undefined;
        let text = readFileSync(args.path, "utf8");
        if (options.control === "plain-json-reader" && repositoryPath(args.path) === "src/deterministic-postgresql/mapping.ts") {
          const lossless = /parse: parseJsonLossless\b/g;
          if ((text.match(lossless) ?? []).length !== 2) throw new Error("the plain-json-reader control no longer finds mapping.ts's two JSON readers");
          text = text.replace(lossless, "parse: (json: string) => JSON.parse(json)");
        }
        if (needsBuffer(text)) text = `import { Buffer } from ${JSON.stringify(buffer)};\n${text}`;
        return { contents: text, loader: "ts", resolveDir: dirname(args.path) };
      });
    },
  };
}

/** esbuild's options shared by every bundle. */
function common(options: BrowserBuildOptions): esbuild.BuildOptions {
  return {
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2023",
    outdir: options.outdir,
    minify: options.minify === true,
    sourcemap: true,
    metafile: true,
    logLevel: "silent",
    loader: { ".json": "json" },
    define: {
      __UMBRADB_BROWSER_CONTROL__: JSON.stringify(options.control ?? ""),
      "process.hrtime.bigint": "globalThis.__umbradbHrtimeBigint",
    },
  };
}

/** Builds the page into `options.outdir` (see the module comment). */
export async function buildBrowser(options: BrowserBuildOptions): Promise<BrowserBuild> {
  const outdir = resolve(options.outdir);
  const configuration = resolve(options.configuration ?? join(BROWSER, "src/config.ts"));
  const control = options.control ?? "";
  const unavailable = (options.unavailable ?? UNAVAILABLE).map((path) => (isAbsolute(path) ? path : join(REPOSITORY, path)));
  rmSync(outdir, { recursive: true, force: true });
  mkdirSync(outdir, { recursive: true });
  const ledgers = await checkedLedgers(resolve(options.ledgerRoot ?? join(REPOSITORY, "vendor/ledger")));
  const shared = common({ ...options, outdir });
  const fail = (error: unknown): never => {
    const errors = (error as { errors?: esbuild.Message[] }).errors ?? [];
    throw new Error(`the browser build failed:\n${errors.map((e) => `${e.text}${e.location === null ? "" : ` (${e.location.file}:${e.location.line})`}`).join("\n") || String(error)}`);
  };
  const page = await esbuild
    .build({ ...shared, entryPoints: { page: join(BROWSER, "src/page.ts") } })
    .catch(fail);
  const processes = await esbuild
    .build({
      ...shared,
      entryPoints: { "core-worker": join(BROWSER, "src/core-worker.ts"), "private-worker": join(BROWSER, "src/private-worker.ts") },
      plugins: [browserPlugin({ configuration, worker: "host", control, unavailable, ledgers })],
    })
    .catch(fail);
  const ledger = await esbuild
    .build({
      ...shared,
      entryPoints: { "ledger-worker": join(BROWSER, "src/ledger-worker.ts") },
      plugins: [browserPlugin({ configuration, worker: "worker", control, unavailable, ledgers })],
    })
    .catch(fail);
  const html = readFileSync(join(BROWSER, "index.html"), "utf8");
  writeFileSync(join(outdir, "index.html"), html);
  const require = createRequire(import.meta.url);
  const pglite = dirname(require.resolve("@electric-sql/pglite"));
  for (const asset of PGLITE_ASSETS) copyFileSync(join(pglite, asset), join(outdir, asset));
  const tools = dirname(require.resolve("@electric-sql/pglite-tools/pg_dump"));
  for (const asset of PGLITE_TOOLS_ASSETS) copyFileSync(join(tools, asset), join(outdir, asset));
  for (const version of LEDGERS) {
    mkdirSync(join(outdir, "ledger", version), { recursive: true });
    for (const file of ledgers.wasm(version)) writeFileSync(join(outdir, "ledger", version, basename(file)), ledgers.read(version, file));
  }
  const files = listFiles(outdir).map((file) => relative(outdir, file).split("\\").join("/"));
  const results = [processes, ledger, page];
  const inputs = results.flatMap((result) => Object.keys(result.metafile?.inputs ?? {}));
  const staticImports = Object.fromEntries(
    results.flatMap((result) =>
      Object.entries(result.metafile?.outputs ?? {})
        .filter(([output]) => output.endsWith(".js"))
        .map(([output, { imports }]) => [
          relative(outdir, resolve(output)).split("\\").join("/"),
          imports.filter((entry) => entry.kind === "import-statement").map((entry) => entry.path),
        ]),
    ),
  );
  return Object.freeze({
    outdir,
    files: Object.freeze(files.sort()),
    inputs: Object.freeze([...new Set(inputs.map((input) => (isAbsolute(input) ? repositoryPath(input) : input)))].sort()),
    staticImports: Object.freeze(staticImports),
  });
}

function listFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  );
}

/** `node browser/build.ts [--configuration <module>] [--out <dir>]`. */
async function main(args: readonly string[]): Promise<void> {
  // Node.js runs this file itself, through its type stripping: the sources it imports (the packages' identity check,
  // `checkedLedgers`) import each other by the `.js` names of the TypeScript build, here resolved to their `.ts` files,
  // as a worker run from the sources resolves them (`typeScriptEntry`, `src/ledger/worker/host.ts`).
  registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (error) {
        if (/^\.\.?\//.test(specifier) && specifier.endsWith(".js")) return nextResolve(`${specifier.slice(0, -3)}.ts`, context);
        throw error;
      }
    },
  });
  const value = (flag: string): string | undefined => {
    const at = args.indexOf(flag);
    return at < 0 ? undefined : args[at + 1];
  };
  const configuration = value("--configuration");
  const build = await buildBrowser({
    outdir: value("--out") ?? join(REPOSITORY, "dist-browser"),
    ...(configuration === undefined ? {} : { configuration }),
  });
  process.stdout.write(`wrote ${build.files.length} files to ${build.outdir}\n`);
}

if (process.argv[1] !== undefined && basename(process.argv[1]) === "build.ts" && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
