/**
 * The identity of the ledger packages this build carries, checked before any of them is imported
 * (`openspec/changes/core-arch/specs/ledger/spec.md` LG-5; A97, A173; `design.md` §5.2, §11; tasks 12.2, 12.2b).
 *
 * A package is identified in the core version (CF-2, `../config/build.ts`) by its name, its version and its SHA-256:
 * the SHA-256 of the package's manifest, `vendor/ledger/<version>/SHA256SUMS` — one line `<sha256>  pkg/<file>` per
 * file of the package, sorted, as `npm run vendor:ledger` writes it (`vendor/ledger/lib.sh`) — so it commits to every
 * file's name and content, and a rebuild that matches the manifest (task 0.2's CI job) has the recorded identity. The
 * recorded values are `./releases.ts`' constants, which the browser build reads too.
 *
 * {@link verifyLedgerPackages} refuses with `package-hash-mismatch` (`design.md` §11; not retryable) when, for a
 * version the build carries, the manifest is missing or its SHA-256 is not the recorded one, a line of it is malformed,
 * or a file it lists is missing or has another SHA-256 than its line — so a package file changed by one byte refuses
 * startup, naming the version and the file. Files the manifest does not list are not part of the package and not read.
 * The check is driven by each version's manifest: a package rebuilt with other patches (question Q113) is recorded by
 * rewriting its manifest and the one constant of `./releases.ts` that a test holds equal to the manifest's SHA-256.
 *
 * `ledgerSources` (CF-4) chooses each version's source; this build carries vendored packages only, so a version whose
 * source is `released` refuses startup with `invalid-configuration` naming the setting (`./sources.ts`, question Q116).
 *
 * **Where it runs** (task 12.2b): a thread checks a version's package before it imports it, and hashes a version's
 * files once — {@link checkLedgerPackages} and {@link checkLedgerPackage} remember, per thread, each directory and
 * version whose files passed (a refusal is not remembered), since a thread imports a package once and keeps it. The
 * process calls {@link checkLedgerPackages} at startup with its `ledgerSources`, before it starts its ledger worker and
 * before block S (`../runner/process.ts`), so a changed package refuses startup; the ledger worker — and any thread
 * loading adapters through `./load.ts` — calls {@link checkLedgerPackage} before it imports a version's package. In a
 * process whose graph loads ledger packages, a file is so hashed by the main thread once, at startup, and by the
 * worker once, before the first block of its version (again by a worker started anew, LG-14), never per block or
 * request: the three packages are 35 MB, 15 to 20 ms of the main thread's startup on an idle Apple M4 Max (up to 40 ms
 * on a loaded one), and a version 4 to 7 ms of the worker's first block of it.
 *
 * Node.js only (`node:fs`, `node:crypto`). The browser build bundles `browser/src/ledger/identity.ts` in this module's
 * place, which refuses the same `ledgerSources` and reads no file: `browser/build.ts` checks every package file it
 * bundles with {@link readRecordedManifest} and {@link readPackageFile}, and the ledger worker checks the WebAssembly
 * it fetches against its manifest line.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { UmbraError } from "../db/errors.js";
import { LEDGER_RELEASES } from "./releases.js";
import { checkLedgerSource, type LedgerSourceSettings } from "./sources.js";
import type { LedgerName } from "./types.js";
import { CARRIED_LEDGERS } from "./version-table.js";

/** The repository's (or the installed package's) `vendor/ledger/`, which holds each version's manifest and package. */
export const VENDORED_LEDGER_ROOT = fileURLToPath(new URL("../../vendor/ledger/", import.meta.url));

/** The file of each version's directory that lists its package's files. */
export const MANIFEST = "SHA256SUMS";

/** A line of a manifest: a file of the package, `pkg/…`, and its SHA-256 as `0x`-prefixed lowercase hex. */
export interface ManifestLine {
  readonly sha256: string;
  readonly path: string;
}

/** The startup check's options: the vendored builds' directory, and the `core` entry's `ledgerSources`. */
export interface VerifyLedgerPackagesOptions {
  readonly root?: string;
  readonly sources?: LedgerSourceSettings;
}

/** The SHA-256 of `bytes`, as the core version writes it: `0x` and lowercase hex. */
export function manifestSha256(bytes: Uint8Array): string {
  return `0x${createHash("sha256").update(bytes).digest("hex")}`;
}

const LINE = /^([0-9a-f]{64}) {2}(pkg\/.+)$/;

function packageName(ledger: LedgerName): string {
  return LEDGER_RELEASES[ledger as keyof typeof LEDGER_RELEASES].packages[0].name;
}

/** The SHA-256 this build records for `ledger`'s manifest (`./releases.ts`). */
function recordedSha256(ledger: LedgerName): string {
  return LEDGER_RELEASES[ledger as keyof typeof LEDGER_RELEASES].packages[0].sha256;
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

/** `ledger`'s manifest under `root`, once its SHA-256 is the one this build records. See {@link readManifest}. */
export function readRecordedManifest(root: string, ledger: LedgerName): readonly ManifestLine[] {
  return readManifest(root, ledger, recordedSha256(ledger));
}

/**
 * The bytes of the file of `ledger`'s package under `root` that `line` lists, once their SHA-256 is the line's: what a
 * check of the bytes it then uses reads (the browser build's). Throws `package-hash-mismatch`.
 */
export function readPackageFile(root: string, ledger: LedgerName, line: ManifestLine): Buffer {
  const bytes = readOrNull(join(root, ledger, line.path));
  if (bytes === null) throw mismatch(ledger, line.path, "missing", `${line.path} is missing`, { expected: line.sha256 });
  const found = manifestSha256(bytes);
  if (found !== line.sha256) {
    throw mismatch(ledger, line.path, "changed", `${line.path} has SHA-256 ${found} where ${MANIFEST} records ${line.sha256}`, {
      expected: line.sha256,
      found,
    });
  }
  return bytes;
}

/** Checks each of `lines` against the file of `ledger`'s package under `root`. Throws `package-hash-mismatch`. */
export function checkPackageFiles(root: string, ledger: LedgerName, lines: readonly ManifestLine[]): void {
  for (const line of lines) readPackageFile(root, ledger, line);
}

/** One version's package under `root`: its manifest against the recorded SHA-256, then every file it lists. */
export function verifyLedgerPackage(ledger: LedgerName, root: string = VENDORED_LEDGER_ROOT): void {
  checkPackageFiles(root, ledger, readRecordedManifest(root, ledger));
}

/** The startup check of every package the build carries, every file read at each call (see the module comment). */
export function verifyLedgerPackages(options: VerifyLedgerPackagesOptions = {}): void {
  const root = options.root ?? VENDORED_LEDGER_ROOT;
  for (const ledger of CARRIED_LEDGERS) {
    checkLedgerSource(ledger, options.sources);
    verifyLedgerPackage(ledger, root);
  }
}

/** The directories and versions whose files passed in this thread (see the module comment). */
const verified = new Set<string>();

/**
 * {@link verifyLedgerPackage}, its files read until they pass in this thread (see the module comment): what a thread
 * calls before it imports `ledger`'s package (`./load.ts`). Throws `package-hash-mismatch`.
 */
export function checkLedgerPackage(ledger: LedgerName, options: { readonly root?: string } = {}): void {
  const root = resolve(options.root ?? VENDORED_LEDGER_ROOT);
  const key = `${ledger}\u0000${root}`;
  if (verified.has(key)) return;
  verifyLedgerPackage(ledger, root);
  verified.add(key);
}

/**
 * {@link verifyLedgerPackages}, each version's files read until they pass in this thread, `options.sources` at every
 * call (see the module comment): the process's startup check (`../runner/process.ts`). Throws `invalid-configuration`
 * or `package-hash-mismatch`.
 */
export function checkLedgerPackages(options: VerifyLedgerPackagesOptions = {}): void {
  for (const ledger of CARRIED_LEDGERS) {
    checkLedgerSource(ledger, options.sources);
    checkLedgerPackage(ledger, options.root === undefined ? {} : { root: options.root });
  }
}
