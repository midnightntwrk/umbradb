/**
 * The identity of the ledger packages this build carries, checked at startup (`openspec/changes/core-arch/specs/
 * ledger/spec.md` LG-5; A97; `design.md` §5.2, §11; task 12.2).
 *
 * A package is identified in the core version (CF-2, `../config/build.ts`) by its name, its version and its SHA-256:
 * the SHA-256 of the package's manifest, `vendor/ledger/<version>/SHA256SUMS` — one line `<sha256>  pkg/<file>` per
 * file of the package, sorted, as `npm run vendor:ledger` writes it (`vendor/ledger/lib.sh`) — so it commits to every
 * file's name and content, and a rebuild that matches the manifest (task 0.2's CI job) has the recorded identity. The
 * recorded values are `./releases.ts`' constants, which the browser build reads too.
 *
 * {@link verifyLedgerPackages}, run at startup before any package is loaded, refuses with `package-hash-mismatch`
 * (`design.md` §11; not retryable) when, for a version the build carries, the manifest is missing or its SHA-256 is not
 * the recorded one, a line of it is malformed, or a file it lists is missing or has another SHA-256 than its line — so a
 * package file changed by one byte refuses startup. Files the manifest does not list are not part of the package and
 * not read. The check is driven by each version's manifest: a package rebuilt with other patches (question Q113) is
 * recorded by rewriting its manifest and the one constant of `./releases.ts` that a test holds equal to the manifest's
 * SHA-256.
 *
 * `ledgerSources` (CF-4) chooses each version's source; this build carries vendored packages only, so a version whose
 * source is `released` refuses startup with `invalid-configuration` (`reason: "ledger-source-unavailable"`, question
 * Q116) — the released packages lack the exports `LedgerPackage` needs (`design.md` §5.2). `v10` has no package in
 * this build, so its source is not read.
 *
 * Node.js only (`node:fs`, `node:crypto`); the browser build (task 16.1) checks the files it fetches against the same
 * manifests.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { UmbraError } from "../db/errors.js";
import { LEDGER_RELEASES } from "./releases.js";
import type { LedgerName } from "./types.js";

/** The repository's (or the installed package's) `vendor/ledger/`, which holds each version's manifest and package. */
export const VENDORED_LEDGER_ROOT = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

/** The file of each version's directory that lists its package's files. */
export const MANIFEST = "SHA256SUMS";

/** A line of a manifest: a file of the package, `pkg/…`, and its SHA-256 as `0x`-prefixed lowercase hex. */
export interface ManifestLine {
  readonly sha256: string;
  readonly path: string;
}

/** Where a ledger version's packages come from (CF-4's `ledgerSources`). */
export type LedgerSource = "vendored" | "released";

/** The startup check's options: the vendored builds' directory, and the `core` entry's `ledgerSources`. */
export interface VerifyLedgerPackagesOptions {
  readonly root?: string;
  readonly sources?: Readonly<Partial<Record<LedgerName, LedgerSource>>>;
}

/** The SHA-256 of `bytes`, as the core version writes it: `0x` and lowercase hex. */
export function manifestSha256(bytes: Uint8Array): string {
  return `0x${createHash("sha256").update(bytes).digest("hex")}`;
}

const LINE = /^([0-9a-f]{64}) {2}(pkg\/.+)$/;

function packageName(ledger: LedgerName): string {
  return LEDGER_RELEASES[ledger as keyof typeof LEDGER_RELEASES].packages[0].name;
}

function mismatch(
  ledger: LedgerName,
  file: string,
  reason: "changed" | "missing" | "malformed",
  detail: string,
  values: { readonly expected?: string; readonly found?: string } = {},
): UmbraError {
  return new UmbraError(
    "package-hash-mismatch",
    `the vendored ledger ${ledger} package ${packageName(ledger)} is not the one this build records: ${detail} (LG-5); ` +
      `restore vendor/ledger/${ledger} as committed, or rebuild it with npm run vendor:ledger and compare`,
    { ledger, package: packageName(ledger), file, reason, ...values },
  );
}

/** The file at `path`, or null when there is none. */
function readOrNull(path: string): Buffer | null {
  try {
    return readFileSync(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/**
 * The lines of `ledger`'s manifest under `root`, once its own SHA-256 is `expected`. Throws `package-hash-mismatch`
 * for a manifest that is missing, has another SHA-256, or is not one well-formed line per file ending in a newline.
 */
export function readManifest(root: string, ledger: LedgerName, expected: string): readonly ManifestLine[] {
  const bytes = readOrNull(join(root, ledger, MANIFEST));
  if (bytes === null) throw mismatch(ledger, MANIFEST, "missing", `its ${MANIFEST} is missing`);
  const found = manifestSha256(bytes);
  if (found !== expected) {
    throw mismatch(ledger, MANIFEST, "changed", `its ${MANIFEST} has SHA-256 ${found} where the build records ${expected}`, {
      expected,
      found,
    });
  }
  const text = bytes.toString("utf8");
  const lines = text.endsWith("\n") ? text.slice(0, -1).split("\n") : [];
  const parsed = lines.map((line) => LINE.exec(line));
  const malformed = parsed.findIndex(
    (match) => match === null || (match[2] as string).split("/").some((part) => part === "" || part === "." || part === ".."),
  );
  if (lines.length === 0 || malformed !== -1) {
    throw mismatch(
      ledger,
      MANIFEST,
      "malformed",
      `its ${MANIFEST} is not one line "<sha256>  pkg/<file>" per file${malformed === -1 ? "" : ` (line ${malformed + 1})`}`,
    );
  }
  return Object.freeze(
    parsed.map((match) => Object.freeze({ sha256: `0x${(match as RegExpExecArray)[1]}`, path: (match as RegExpExecArray)[2] as string })),
  );
}

/** Checks each of `lines` against the file of `ledger`'s package under `root`. Throws `package-hash-mismatch`. */
export function checkPackageFiles(root: string, ledger: LedgerName, lines: readonly ManifestLine[]): void {
  for (const line of lines) {
    const bytes = readOrNull(join(root, ledger, line.path));
    if (bytes === null) throw mismatch(ledger, line.path, "missing", `${line.path} is missing`, { expected: line.sha256 });
    const found = manifestSha256(bytes);
    if (found !== line.sha256) {
      throw mismatch(ledger, line.path, "changed", `${line.path} has SHA-256 ${found} where ${MANIFEST} records ${line.sha256}`, {
        expected: line.sha256,
        found,
      });
    }
  }
}

/** The startup check of every ledger package the build carries: see the module comment. */
export function verifyLedgerPackages(options: VerifyLedgerPackagesOptions = {}): void {
  const root = options.root ?? VENDORED_LEDGER_ROOT;
  for (const [ledger, release] of Object.entries(LEDGER_RELEASES) as [LedgerName, (typeof LEDGER_RELEASES)["v8"]][]) {
    const source = options.sources?.[ledger] ?? "vendored";
    if (source !== "vendored") {
      throw new UmbraError(
        "invalid-configuration",
        `ledgerSources.${ledger} is ${source}, and this build carries the vendored ledger ${ledger} package only: the ` +
          "released packages lack the exports the ledger adapters need (LG-5, design.md section 5.2); set it to vendored",
        { reason: "ledger-source-unavailable", ledger, source },
      );
    }
    checkPackageFiles(root, ledger, readManifest(root, ledger, release.packages[0].sha256));
  }
}
