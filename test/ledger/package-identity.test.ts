import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { CORE_VERSION_SCHEMA } from "../../src/config/core-settings.js";
import { UmbraError } from "../../src/db/errors.js";
import {
  checkPackageFiles,
  manifestSha256,
  readManifest,
  VENDORED_LEDGER_ROOT,
  verifyLedgerPackages,
} from "../../src/ledger/identity.js";
import { LEDGER_RELEASES } from "../../src/ledger/releases.js";
import { copyVendoredLedger, expectEveryPackageFileChecked, VENDORED_LEDGERS, VENDORED_ROOT } from "./version-checks.js";

/**
 * Each ledger package the build carries is identified in the core version by its name, its version and its SHA-256.
 * That SHA-256 is the hash of the package's `SHA256SUMS` manifest, which lists every file of the package with its own
 * SHA-256, as `npm run vendor:ledger` records it. Startup refuses with `package-hash-mismatch` when a package's files
 * are not the recorded ones: a file changed by one byte, a file missing, or the manifest itself changed.
 * [A97, LG-5, CF-2; acceptance §12]
 *
 * CI also rebuilds every vendored package from its pinned source and patches and checks it gets the recorded SHA-256:
 * that is `.github/workflows/vendored-ledger.yml` (`npm run vendor:ledger`, which compares each rebuilt file with
 * `SHA256SUMS`). Here, the manifest's SHA-256 is held equal to the recorded identity. [A97]
 */

const sha256 = (bytes: Uint8Array): string => `0x${createHash("sha256").update(bytes).digest("hex")}`;

describe("the core version's ledgers (CF-2, LG-5)", () => {
  it("lists each ledger version the build carries, in release order: its release, and each package's name, version and SHA-256", () => {
    const upstream = (ledger: string) =>
      JSON.parse(readFileSync(join(VENDORED_ROOT, ledger, "upstream.json"), "utf8")) as {
        versionName: string;
        package: { name: string; version: string };
      };
    // v9 as runtime 2.0 built it (rc.3) is a package of its own, between v8 and v9 (rc.5). [A159]
    expect(VENDORED_LEDGERS).toEqual(["v8", "v9-rc3", "v9"]);
    const ledgers = VENDORED_LEDGERS.map((ledger) => ({
      ledger,
      versionName: upstream(ledger).versionName,
      packages: [
        {
          name: upstream(ledger).package.name,
          version: upstream(ledger).package.version,
          sha256: sha256(readFileSync(join(VENDORED_ROOT, ledger, "SHA256SUMS"))),
        },
      ],
    }));
    expect(buildCoreVersion()).toEqual({ umbradb: "0.10.0", ledgers });
    expect(CORE_VERSION_SCHEMA.safeParse(buildCoreVersion()).success).toBe(true);
  });

  it("records each package's SHA-256 as a constant (the browser build reads no file), equal to its manifest's", () => {
    for (const ledger of VENDORED_LEDGERS) {
      const manifest = readFileSync(join(VENDORED_ROOT, ledger, "SHA256SUMS"));
      expect(LEDGER_RELEASES[ledger].packages[0].sha256, `LEDGER_RELEASES.${ledger}: npm run vendor:ledger -- --record changed it`).toBe(
        sha256(manifest),
      );
      expect(manifestSha256(manifest)).toBe(sha256(manifest));
    }
  });

  it("is a new plain object at every call", () => {
    const first = buildCoreVersion();
    const second = buildCoreVersion();
    expect(second).toEqual(first);
    expect(second.ledgers).not.toBe(first.ledgers);
    expect(second.ledgers[0]).not.toBe(first.ledgers[0]);
    expect(second.ledgers[0]?.packages).not.toBe(first.ledgers[0]?.packages);
    expect(second.ledgers[0]?.packages[0]).not.toBe(first.ledgers[0]?.packages[0]);
    (first.ledgers[0]!.packages[0] as { sha256: string }).sha256 = "0x00";
    expect(buildCoreVersion()).toEqual(second);
  });
});

describe("A97: startup refuses a vendored package whose files are not the recorded ones (LG-5)", () => {
  let copy: ReturnType<typeof copyVendoredLedger>;
  beforeAll(() => {
    copy = copyVendoredLedger();
  });
  afterAll(() => copy.remove());

  it("passes the committed packages", () => {
    expect(VENDORED_LEDGER_ROOT).toBe(VENDORED_ROOT);
    expect(() => verifyLedgerPackages()).not.toThrow();
    expect(() =>
      verifyLedgerPackages({ root: copy.root, sources: { v8: "vendored", "v9-rc3": "vendored", v9: "vendored", v10: "vendored" } }),
    ).not.toThrow();
  });

  it("refuses every package file, and each manifest, changed by one byte", { timeout: 120_000 }, () => {
    expectEveryPackageFileChecked(copy.root, (root) => verifyLedgerPackages({ root }));
  });

  it("names the file, the expected and the found SHA-256, and how to restore the package", () => {
    const path = join(copy.root, "v9", "pkg", "package.json");
    const recordedLine = readFileSync(join(VENDORED_ROOT, "v9", "SHA256SUMS"), "utf8")
      .split("\n")
      .find((line) => line.endsWith("  pkg/package.json")) as string;
    expect(recordedLine).toMatch(/^[0-9a-f]{64} {2}pkg\/package\.json$/);
    const original = readFileSync(path);
    writeFileSync(path, Buffer.concat([original, Buffer.from(" ")]));
    try {
      let refusal: unknown;
      try {
        verifyLedgerPackages({ root: copy.root });
      } catch (error) {
        refusal = error;
      }
      expect(refusal).toBeInstanceOf(UmbraError);
      expect((refusal as UmbraError).retryable).toBe(false);
      expect((refusal as UmbraError).details).toEqual({
        ledger: "v9",
        package: "@umbradb/vendored-ledger-v9",
        file: "pkg/package.json",
        reason: "changed",
        expected: `0x${recordedLine.slice(0, 64)}`,
        found: sha256(readFileSync(path)),
      });
      expect((refusal as UmbraError).message).toContain("pkg/package.json");
      expect((refusal as UmbraError).message).toContain("npm run vendor:ledger");
    } finally {
      writeFileSync(path, original);
    }
  });

  it("refuses a package file that is missing", () => {
    const path = join(copy.root, "v8", "pkg", "midnight_ledger_wasm_fs.js");
    const original = readFileSync(path);
    rmSync(path);
    try {
      expect(() => verifyLedgerPackages({ root: copy.root })).toThrow(
        expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ ledger: "v8", file: "pkg/midnight_ledger_wasm_fs.js", reason: "missing" }) }),
      );
    } finally {
      writeFileSync(path, original);
    }
    expect(() => verifyLedgerPackages({ root: copy.root })).not.toThrow();
  });

  it("refuses a version whose manifest is missing", () => {
    const path = join(copy.root, "v9", "SHA256SUMS");
    const original = readFileSync(path);
    rmSync(path);
    try {
      expect(() => verifyLedgerPackages({ root: copy.root })).toThrow(
        expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ ledger: "v9", file: "SHA256SUMS", reason: "missing" }) }),
      );
    } finally {
      writeFileSync(path, original);
    }
  });
});

describe("the manifest (`SHA256SUMS`: `<sha256>  pkg/<file>` per line, sorted)", () => {
  let root: string;
  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), "umbradb-12.2-manifest-"));
    mkdirSync(join(root, "v8", "pkg"), { recursive: true });
  });
  afterAll(() => rmSync(root, { recursive: true, force: true }));

  const write = (text: string): string => {
    writeFileSync(join(root, "v8", "SHA256SUMS"), text);
    return sha256(Buffer.from(text));
  };

  it("reads each line's SHA-256 and path", () => {
    const line = `${"ab".repeat(32)}  pkg/a.js`;
    const expected = write(`${line}\n${"cd".repeat(32)}  pkg/snippets/b/inline0.js\n`);
    expect(readManifest(root, "v8", expected)).toEqual([
      { sha256: `0x${"ab".repeat(32)}`, path: "pkg/a.js" },
      { sha256: `0x${"cd".repeat(32)}`, path: "pkg/snippets/b/inline0.js" },
    ]);
  });

  it("refuses a manifest whose own SHA-256 is not the recorded one, before reading its lines", () => {
    write(`${"ab".repeat(32)}  pkg/a.js\n`);
    expect(() => readManifest(root, "v8", `0x${"00".repeat(32)}`)).toThrow(
      expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ file: "SHA256SUMS", reason: "changed" }) }),
    );
  });

  for (const [name, text] of [
    ["an empty manifest", ""],
    ["a line without two spaces", `${"ab".repeat(32)} pkg/a.js\n`],
    ["a short hash", `${"ab".repeat(31)}  pkg/a.js\n`],
    ["upper-case hex", `${"AB".repeat(32)}  pkg/a.js\n`],
    ["a path outside pkg/", `${"ab".repeat(32)}  vendor/a.js\n`],
    ["a path climbing out of pkg/", `${"ab".repeat(32)}  pkg/../SHA256SUMS\n`],
    ["a path through \".\"", `${"ab".repeat(32)}  pkg/./a.js\n`],
    ["a path with an empty part", `${"ab".repeat(32)}  pkg//a.js\n`],
    ["an empty path", `${"ab".repeat(32)}  pkg/\n`],
    ["no final newline", `${"ab".repeat(32)}  pkg/a.js`],
    ["an empty line", `${"ab".repeat(32)}  pkg/a.js\n\n`],
  ] as const) {
    it(`refuses ${name} as malformed, even when its SHA-256 is recorded`, () => {
      const expected = write(text);
      expect(() => readManifest(root, "v8", expected)).toThrow(
        expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ file: "SHA256SUMS", reason: "malformed" }) }),
      );
    });
  }

  it("lets a read failure other than a missing file through as it is (a directory where a file is listed)", () => {
    mkdirSync(join(root, "v8", "pkg", "dir.js"), { recursive: true });
    expect(() => checkPackageFiles(root, "v8", [{ sha256: sha256(Buffer.from("")), path: "pkg/dir.js" }])).toThrow(
      expect.objectContaining({ code: "EISDIR" }),
    );
  });

  it("checks exactly the files it is given", () => {
    writeFileSync(join(root, "v8", "pkg", "a.js"), "a");
    const lines = [{ sha256: sha256(Buffer.from("a")), path: "pkg/a.js" }];
    expect(() => checkPackageFiles(root, "v8", lines)).not.toThrow();
    expect(() => checkPackageFiles(root, "v8", [...lines, { sha256: sha256(Buffer.from("b")), path: "pkg/b.js" }])).toThrow(
      expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ file: "pkg/b.js", reason: "missing" }) }),
    );
    expect(() => checkPackageFiles(root, "v8", [{ sha256: sha256(Buffer.from("b")), path: "pkg/a.js" }])).toThrow(
      expect.objectContaining({ code: "package-hash-mismatch", details: expect.objectContaining({ file: "pkg/a.js", reason: "changed" }) }),
    );
  });
});

describe("ledgerSources (LG-5; question Q116)", () => {
  it("refuses startup for a released package: this build carries vendored ones only", () => {
    for (const ledger of VENDORED_LEDGERS) {
      let refusal: unknown;
      try {
        verifyLedgerPackages({ sources: { [ledger]: "released" } });
      } catch (error) {
        refusal = error;
      }
      expect(refusal, ledger).toBeInstanceOf(UmbraError);
      expect((refusal as UmbraError).code).toBe("invalid-configuration");
      expect((refusal as UmbraError).details).toEqual({ reason: "ledger-source-unavailable", ledger, source: "released" });
      expect((refusal as UmbraError).message).toContain("vendored");
    }
  });

  it("does not refuse v10's source: this build carries no v10 package to load", () => {
    expect(() => verifyLedgerPackages({ sources: { v10: "released" } })).not.toThrow();
  });
});
