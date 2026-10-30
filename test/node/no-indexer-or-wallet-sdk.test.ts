import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import ts from "typescript";
import { afterAll, describe, expect, it } from "vitest";
import { REPOSITORY } from "./in8.js";

/**
 * No source file imports the official indexer's client or a wallet SDK, and nothing the package installs at run time
 * is one. [A83 STATIC, IN-8; CORE-ARCH FR-005]
 *
 * **What is forbidden:**
 * - **A wallet SDK:** any package of the Midnight scopes (`@midnightntwrk/`, `@midnight-ntwrk/`) whose name holds
 *   `wallet` — the wallet SDK's packages (`@midnightntwrk/wallet-sdk`, `wallet-sdk-facade`, `wallet-sdk-hd`, … at the
 *   wallet release the indexer targets, 2.1.0-rc.4) and the older `@midnight-ntwrk/wallet*` packages.
 * - **The official indexer's client:** any package of those scopes whose name holds `indexer` — the wallet SDK's
 *   `@midnightntwrk/wallet-sdk-indexer-client` and midnight-js's `@midnight-ntwrk/midnight-js-indexer-public-data-provider`
 *   — and 0.9.5's own GraphQL client of the indexer, the module `indexer-client` (now deleted), by its file name or
 *   by its class name `IndexerClient` (a copy under another name).
 * The ledger packages of those scopes (`@midnight-ntwrk/ledger-v8`, …) are the ledger, not a wallet SDK or an
 * indexer client, and stay allowed. [LG-5, LG-6]
 *
 * **Where:** every JavaScript and TypeScript file of the code that runs in the indexer — `src/` (the package), what is
 * left of 0.9.5's `chain-archive-sync/` until it is removed (OUTDATED), the vendored ledger builds (`vendor/`), and the
 * browser build and tools (`browser/`, `tools/`) once they exist; tests may use the wallet SDK as a development
 * dependency (0.9.5's live adapter does). And `package.json`'s run-time dependency lists and every package
 * `package-lock.json` installs without `--include=dev`.
 *
 * **How:** each file is parsed with the TypeScript compiler, so comments never count and every form of import is seen
 * — `import`, `import type`, `export … from`, `import x = require()`, dynamic `import()`, `require()`, and
 * `import("…")` types — plus any string literal naming a forbidden package or the module (a specifier assembled at run
 * time from such a literal), and any identifier `IndexerClient`. The negative controls below run the same scan over
 * fixture files holding each form and see it caught.
 */

const ROOTS = ["src", "chain-archive-sync", "vendor", "browser", "tools"];
const SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;
/** A forbidden package, at the start of a module specifier (a deep import included). */
const FORBIDDEN_PACKAGE = /^@(?:midnightntwrk|midnight-ntwrk)\/[^/]*(?:wallet|indexer)/;
/** 0.9.5's indexer client module, as the last segment of a module specifier. */
const INDEXER_CLIENT_MODULE = /(?:^|\/)indexer-client(?:\.[cm]?[jt]s)?$/;
/** A forbidden package or the module named anywhere inside a string. */
const FORBIDDEN_TEXT = /@(?:midnightntwrk|midnight-ntwrk)\/[^/\s"'`]*(?:wallet|indexer)|indexer-client/;

interface Finding {
  readonly file: string;
  readonly line: number;
  readonly rule: "import" | "text" | "name";
  readonly detail: string;
}

function scriptKind(file: string): ts.ScriptKind {
  if (file.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (file.endsWith(".tsx")) return ts.ScriptKind.TSX;
  return /\.[cm]?js$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS;
}

/** The module a node imports, if it is an import of any form with a literal specifier. */
function moduleSpecifier(node: ts.Node): string | undefined {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier !== undefined) {
    return ts.isStringLiteral(node.moduleSpecifier) ? node.moduleSpecifier.text : undefined;
  }
  if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
    const expression = node.moduleReference.expression;
    return ts.isStringLiteral(expression) ? expression.text : undefined;
  }
  if (ts.isCallExpression(node)) {
    const callee = node.expression;
    const importing =
      callee.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(callee) && callee.text === "require");
    const first = node.arguments[0];
    return importing && first !== undefined && ts.isStringLiteralLike(first) ? first.text : undefined;
  }
  if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
    return node.argument.literal.text;
  }
  return undefined;
}

/** What one source file holds of the forbidden list. */
function scanSource(file: string, text: string): Finding[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const findings: Finding[] = [];
  const found = (node: ts.Node, rule: Finding["rule"], detail: string) =>
    findings.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1, rule, detail });
  const visit = (node: ts.Node): void => {
    const specifier = moduleSpecifier(node);
    if (specifier !== undefined && (FORBIDDEN_PACKAGE.test(specifier) || INDEXER_CLIENT_MODULE.test(specifier))) {
      found(node, "import", specifier);
    }
    if (
      (ts.isStringLiteralLike(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) &&
      FORBIDDEN_TEXT.test(node.text)
    ) {
      found(node, "text", node.text);
    }
    if (ts.isIdentifier(node) && node.text === "IndexerClient") found(node, "name", node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return findings;
}

/** Every source file under `root`, `node_modules` left out. */
function sourceFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return (readdirSync(root, { recursive: true, encoding: "utf8" }) as string[])
    .filter((path) => !path.split(/[\\/]/).includes("node_modules") && SOURCE_FILE.test(path))
    .map((path) => join(root, path))
    .filter((path) => statSync(path).isFile());
}

/** The findings of every source file under the roots, each as `file:line rule detail`. */
function scanRoots(base: string, roots: readonly string[]): string[] {
  return roots
    .flatMap((root) => sourceFiles(join(base, root)))
    .flatMap((file) => scanSource(file, readFileSync(file, "utf8")))
    .map((finding) => `${relative(base, finding.file)}:${finding.line} ${finding.rule} ${finding.detail}`);
}

/** The forbidden packages a manifest lists as run-time dependencies. */
function runtimeDependencies(manifest: Record<string, unknown>): string[] {
  const lists = ["dependencies", "optionalDependencies", "peerDependencies"];
  return lists.flatMap((list) =>
    Object.keys((manifest[list] as Record<string, string> | undefined) ?? {}).filter(
      (name) => FORBIDDEN_PACKAGE.test(name) || INDEXER_CLIENT_MODULE.test(name),
    ),
  );
}

/** The forbidden packages a lockfile installs without the development dependencies. */
function installedAtRunTime(lock: { packages?: Record<string, { dev?: boolean }> }): string[] {
  return Object.entries(lock.packages ?? {})
    .filter(([path, entry]) => path !== "" && entry.dev !== true)
    .map(([path]) => path.slice(path.lastIndexOf("node_modules/") + "node_modules/".length))
    .filter((name) => FORBIDDEN_PACKAGE.test(name) || INDEXER_CLIENT_MODULE.test(name));
}

describe("A83 [STATIC]: no source file imports the official indexer's client or a wallet SDK (IN-8)", () => {
  it("finds none in the code that runs in the indexer, and the scan reads that code", () => {
    expect(scanRoots(REPOSITORY, ROOTS)).toEqual([]);
    // Not vacuous: the scan reads the package's sources, the node client among them, and the vendored ledger builds.
    const files = ROOTS.flatMap((root) => sourceFiles(join(REPOSITORY, root))).map((file) => relative(REPOSITORY, file));
    expect(files).toEqual(expect.arrayContaining([join("src", "node", "client.ts"), join("src", "index.ts")]));
    expect(files.some((file) => file.startsWith(join("vendor", "ledger")))).toBe(true);
    expect(files.length).toBeGreaterThan(80);
  });

  it("finds none among the run-time dependencies, nor in what the lockfile installs for run time", () => {
    const manifest = JSON.parse(readFileSync(join(REPOSITORY, "package.json"), "utf8")) as Record<string, unknown>;
    const lock = JSON.parse(readFileSync(join(REPOSITORY, "package-lock.json"), "utf8")) as {
      packages: Record<string, { dev?: boolean }>;
    };
    expect(runtimeDependencies(manifest)).toEqual([]);
    expect(installedAtRunTime(lock)).toEqual([]);
    // Not vacuous: the lockfile does hold the wallet SDK, as a development dependency (0.9.5's live test adapter).
    expect(lock.packages["node_modules/@midnightntwrk/wallet-sdk-abstractions"]?.dev).toBe(true);
    expect(Object.keys(lock.packages).length).toBeGreaterThan(100);
  });

  describe("negative controls: the same scan catches each form in fixture files", () => {
    const fixtures = mkdtempSync(join(tmpdir(), "umbradb-a83-"));
    afterAll(() => rmSync(fixtures, { recursive: true, force: true }));

    const CAUGHT: readonly { name: string; source: string; rules: Finding["rule"][] }[] = [
      { name: "import.ts", source: 'import { WalletFacade } from "@midnightntwrk/wallet-sdk-facade";\n', rules: ["import"] },
      {
        name: "import-type.ts",
        source: 'import type { X } from "@midnightntwrk/wallet-sdk-abstractions";\n',
        rules: ["import"],
      },
      { name: "re-export.ts", source: 'export * from "@midnightntwrk/wallet-sdk-indexer-client";\n', rules: ["import"] },
      { name: "deep.ts", source: 'export { a } from "@midnightntwrk/wallet-sdk-hd/dist/index.js";\n', rules: ["import"] },
      {
        name: "dynamic.ts",
        source: 'export const p = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");\n',
        rules: ["import"],
      },
      { name: "older-wallet.ts", source: 'import { WalletBuilder } from "@midnight-ntwrk/wallet";\n', rules: ["import"] },
      {
        name: "require.cjs",
        source: 'module.exports = require("../chain-archive-sync/indexer-client.js");\n',
        rules: ["import"],
      },
      { name: "import-equals.ts", source: 'import c = require("./indexer-client");\nexport default c;\n', rules: ["import"] },
      {
        name: "import-type-node.ts",
        source: 'export type W = import("@midnightntwrk/wallet-sdk-shielded").Wallet;\n',
        rules: ["import"],
      },
      {
        name: "computed.ts",
        source: 'const name = "@midnightntwrk/wallet-sdk-unshielded-wallet";\nexport const load = () => import(name);\n',
        rules: ["text"],
      },
      {
        name: "template.mjs",
        source: "const version = 2;\nexport const load = () => import(`@midnightntwrk/wallet-sdk-v${version}`);\n",
        rules: ["text"],
      },
      { name: "copied-class.ts", source: "export class IndexerClient {}\n", rules: ["name"] },
      { name: "nested/deeper/js-file.js", source: 'const sdk = require("@midnightntwrk/wallet-sdk");\n', rules: ["import"] },
    ];

    for (const fixture of CAUGHT) {
      it(`catches ${fixture.name} (${fixture.rules.join(", ")})`, () => {
        // Each fixture alone in a tree of its own, scanned exactly as the repository's roots are.
        const directory = mkdtempSync(join(fixtures, "case-"));
        const path = join(directory, "src", fixture.name);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, fixture.source);
        const findings = scanRoots(directory, ROOTS);
        expect(findings.length, `${fixture.name} was not caught`).toBeGreaterThan(0);
        for (const rule of fixture.rules) {
          expect(findings.some((finding) => finding.includes(` ${rule} `)), `${fixture.name}: ${rule}`).toBe(true);
        }
      });
    }

    it("does not catch the ledger packages, Node.js modules, or comments and documentation naming the forbidden ones", () => {
      const directory = mkdtempSync(join(fixtures, "clean-"));
      mkdirSync(join(directory, "src"));
      writeFileSync(
        join(directory, "src", "clean.ts"),
        [
          'import { LedgerState } from "@midnight-ntwrk/ledger-v9";',
          'import { WebSocket } from "ws";',
          'import { readFileSync } from "node:fs";',
          "// The indexer never imports @midnightntwrk/wallet-sdk-facade nor 0.9.5's indexer-client (IN-8).",
          "/** Not an {@link IndexerClient}: reads only from the node. */",
          'export const text = "the official indexer is not a dependency";',
          "export { LedgerState, WebSocket, readFileSync };",
          "",
        ].join("\n"),
      );
      expect(scanRoots(directory, ROOTS)).toEqual([]);
    });

    it("catches a forbidden run-time dependency in a manifest and in a lockfile, and lets development ones be", () => {
      expect(runtimeDependencies({ dependencies: { "@midnightntwrk/wallet-sdk-facade": "1.0.0", ws: "8.22.0" } })).toEqual([
        "@midnightntwrk/wallet-sdk-facade",
      ]);
      expect(runtimeDependencies({ optionalDependencies: { "@midnight-ntwrk/midnight-js-indexer-public-data-provider": "1" } }))
        .toEqual(["@midnight-ntwrk/midnight-js-indexer-public-data-provider"]);
      expect(runtimeDependencies({ devDependencies: { "@midnightntwrk/wallet-sdk-hd": "1.0.0" } })).toEqual([]);
      const lock = {
        packages: {
          "": {},
          "node_modules/ws": {},
          "node_modules/x/node_modules/@midnightntwrk/wallet-sdk-indexer-client": {},
          "node_modules/@midnightntwrk/wallet-sdk-hd": { dev: true },
          "node_modules/@midnight-ntwrk/ledger-v9": {},
        },
      };
      expect(installedAtRunTime(lock)).toEqual(["@midnightntwrk/wallet-sdk-indexer-client"]);
    });
  });
});
