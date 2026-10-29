import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { it } from "vitest";
import { readTape, type Tape, tapeId } from "../../../tools/tape/index.js";

/**
 * The recorded tapes and how a test finds one. [Q123, Q130; acceptance's tape note]
 *
 * **The manifest** (`./manifest.json`, committed): one entry per tape — its name, its file name (`<name>.tape.jsonl`),
 * the network and the range of heights it holds, its SHA-256 (its `tapeId`) and size in bytes, its records, the
 * endpoint it was recorded from with the node version that node reported and the day, and why its bounds are what
 * they are. The tapes themselves are not in the repository: they are kept on the machine that recorded them, until the
 * owner decides where they are stored for CI. [TT-1, Q130]
 *
 * **The lookup** ({@link findTape}): a tape is looked for in the directory named by `UMBRADB_TAPES`, under its file
 * name. Absent — the variable unset or empty, or no such file — it is reported absent with a reason naming the tape,
 * and {@link tapeTest} skips the test with that reason (Vitest's skip: reported as skipped, never as passed). Present,
 * its size and then its SHA-256 must be the manifest's, or it is refused ({@link TapeRefusedError}): the test fails, it
 * is not skipped. Synthetic tapes the tests build themselves need none of this.
 */

/** The environment variable naming the directory that holds the recorded tapes. */
export const TAPES_ENV = "UMBRADB_TAPES";

export const MANIFEST_PATH = fileURLToPath(new URL("./manifest.json", import.meta.url));

/** Where a tape was recorded from. */
export interface RealTapeSource {
  /** The node's WebSocket endpoint. */
  readonly endpoint: string;
  /** What the node reported as its version (`system_version`). */
  readonly nodeVersion: string;
  /** The day it was recorded, `YYYY-MM-DD`. */
  readonly recorded: string;
}

/** A recorded tape, as the manifest lists it. */
export interface RealTape {
  readonly name: string;
  readonly file: string;
  /** `mainnet`, `preprod`, `preview`, `stagenet` or `custom` (the undeployed devnet). */
  readonly network: string;
  /** The heights whose every allowed node call the tape holds, inclusive. [IN-8] */
  readonly from: number;
  readonly to: number;
  readonly sha256: string;
  readonly bytes: number;
  readonly records: number;
  readonly source: RealTapeSource;
  /** Why the range is what it is: the boundary or scenario it holds. */
  readonly bounds: string;
  /** What else is known of it (the recording's rate, runtimes, boundaries, what it holds), as the recorder wrote it. */
  readonly notes?: Readonly<Record<string, unknown>>;
}

export interface RealTapeManifest {
  readonly format: "umbradb-real-tapes";
  readonly version: 1;
  readonly about: string;
  readonly tapes: readonly RealTape[];
}

/** A tape refused: present, but its size or SHA-256 is not the manifest's. */
export class TapeRefusedError extends Error {
  constructor(
    readonly tape: string,
    readonly path: string,
    readonly reason: "size" | "sha256",
    readonly expected: string,
    readonly found: string,
  ) {
    super(
      reason === "size"
        ? `tape ${tape} at ${path} is refused: its size is ${found} bytes, where the manifest records ${expected}`
        : `tape ${tape} at ${path} is refused: its SHA-256 is ${found}, where the manifest records ${expected}`,
    );
    this.name = "TapeRefusedError";
  }
}

const NAME = /^[a-z0-9][a-z0-9.-]*$/;
const SHA256 = /^[0-9a-f]{64}$/;
const TAPE_FIELDS = ["name", "file", "network", "from", "to", "sha256", "bytes", "records", "source", "bounds", "notes"];
const SOURCE_FIELDS = ["endpoint", "nodeVersion", "recorded"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDay(text: unknown): boolean {
  if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const day = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(day.getTime()) && day.toISOString().slice(0, 10) === text;
}

const isCount = (value: unknown): boolean => Number.isSafeInteger(value) && (value as number) >= 0;

/** Every problem of `data` as a manifest, each with its path; none for a valid one. */
export function manifestProblems(data: unknown): string[] {
  if (!isRecord(data)) return ["the manifest is a JSON object"];
  const problems: string[] = [];
  if (data.format !== "umbradb-real-tapes") problems.push('format: expected "umbradb-real-tapes"');
  if (data.version !== 1) problems.push("version: expected 1");
  if (typeof data.about !== "string") problems.push("about: expected a string");
  if (!Array.isArray(data.tapes)) return [...problems, "tapes: expected a list"];
  const names = new Set<string>();
  data.tapes.forEach((tape: unknown, index) => {
    const at = `tapes[${index}]`;
    if (!isRecord(tape)) {
      problems.push(`${at}: expected an object`);
      return;
    }
    for (const key of Object.keys(tape)) if (!TAPE_FIELDS.includes(key)) problems.push(`${at}.${key}: not a field of a tape`);
    if (typeof tape.name !== "string" || !NAME.test(tape.name)) problems.push(`${at}.name: expected a name (a-z, 0-9, ., -)`);
    else if (names.has(tape.name)) problems.push(`${at}.name: ${tape.name} is listed already`);
    else names.add(tape.name);
    if (tape.file !== `${String(tape.name)}.tape.jsonl`) problems.push(`${at}.file: expected ${String(tape.name)}.tape.jsonl`);
    if (typeof tape.network !== "string" || tape.network === "") problems.push(`${at}.network: expected a network`);
    for (const key of ["from", "to", "bytes", "records"]) {
      if (!isCount(tape[key])) problems.push(`${at}.${key}: expected an integer from 0`);
    }
    if (isCount(tape.from) && isCount(tape.to) && (tape.from as number) > (tape.to as number)) {
      problems.push(`${at}.from: ${String(tape.from)} is above to ${String(tape.to)}`);
    }
    if (typeof tape.sha256 !== "string" || !SHA256.test(tape.sha256)) {
      problems.push(`${at}.sha256: expected 64 lowercase hex digits`);
    }
    if (typeof tape.bounds !== "string" || tape.bounds === "") problems.push(`${at}.bounds: expected why the range is what it is`);
    if (tape.notes !== undefined && !isRecord(tape.notes)) problems.push(`${at}.notes: expected an object`);
    const source = tape.source;
    if (!isRecord(source)) {
      problems.push(`${at}.source: expected an object`);
      return;
    }
    for (const key of Object.keys(source)) if (!SOURCE_FIELDS.includes(key)) problems.push(`${at}.source.${key}: not a field of a source`);
    if (typeof source.endpoint !== "string" || !/^wss?:\/\/\S+$/.test(source.endpoint)) {
      problems.push(`${at}.source.endpoint: expected a ws:// or wss:// URL`);
    }
    if (typeof source.nodeVersion !== "string" || source.nodeVersion === "") {
      problems.push(`${at}.source.nodeVersion: expected the version the node reported`);
    }
    if (!isDay(source.recorded)) problems.push(`${at}.source.recorded: expected the day as YYYY-MM-DD, a calendar date`);
  });
  return problems;
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

/** Reads and checks the manifest at `path`; throws listing every problem. */
export function readManifest(path: string = MANIFEST_PATH): RealTapeManifest {
  const data = JSON.parse(readFileSync(path, "utf8")) as unknown;
  const problems = manifestProblems(data);
  if (problems.length > 0) throw new Error(`the real-tape manifest is not valid: ${problems.join("; ")}`);
  return deepFreeze(data as RealTapeManifest);
}

/** The committed manifest. */
export const MANIFEST: RealTapeManifest = readManifest();

/** A tape found and checked: its file's path and bytes; `read()` parses them. [TT-1] */
export interface FoundTape {
  readonly found: true;
  readonly tape: RealTape;
  readonly path: string;
  readonly bytes: Uint8Array;
  read(): Tape;
}

export type TapeLookup = FoundTape | { readonly found: false; readonly tape: RealTape; readonly reason: string };

export interface FindTapeOptions {
  /** The directory holding the tapes; `UMBRADB_TAPES` by default. */
  readonly directory?: string | undefined;
  /** The manifest a tape named by its name is looked up in; the committed one by default. */
  readonly manifest?: RealTapeManifest;
}

/** Finds `tape` (an entry, or its name in the manifest) — see the module comment. */
export function findTape(tape: RealTape | string, options: FindTapeOptions = { directory: process.env[TAPES_ENV] }): TapeLookup {
  const manifest = options.manifest ?? MANIFEST;
  const entry = typeof tape === "string" ? manifest.tapes.find((candidate) => candidate.name === tape) : tape;
  if (entry === undefined) throw new Error(`the real-tape manifest has no tape named ${String(tape)}`);
  const named = `tape ${entry.name} (sha256 ${entry.sha256.slice(0, 12)}…)`;
  const directory = "directory" in options ? options.directory : process.env[TAPES_ENV];
  if (directory === undefined || directory === "") {
    return { found: false, tape: entry, reason: `${named} is absent: ${TAPES_ENV} is not set` };
  }
  const path = join(directory, entry.file);
  if (!existsSync(path)) return { found: false, tape: entry, reason: `${named} is absent: ${path} does not exist` };
  const size = statSync(path).size;
  if (size !== entry.bytes) throw new TapeRefusedError(entry.name, path, "size", String(entry.bytes), String(size));
  const bytes = new Uint8Array(readFileSync(path));
  const id = tapeId(bytes);
  if (id !== entry.sha256) throw new TapeRefusedError(entry.name, path, "sha256", entry.sha256, id);
  let read: Tape | undefined;
  return {
    found: true,
    tape: entry,
    path,
    bytes,
    read: () => {
      read ??= readTape(bytes);
      return read;
    },
  };
}

export interface TapeTestOptions {
  /** The test's budget; the repository's 60 s by default. A whole tape's replay sets more. */
  readonly timeoutMs?: number;
  readonly manifest?: RealTapeManifest;
}

/**
 * Registers a test that needs the recorded tape `name`: run with it when `UMBRADB_TAPES` holds it (checked by size and
 * SHA-256), skipped with the reason naming the tape otherwise — the reason is the skip's note, which the reporters show,
 * and the test's `meta.realTape`.
 */
export function tapeTest(
  name: string,
  title: string,
  body: (found: FoundTape) => Promise<void> | void,
  options: TapeTestOptions = {},
): void {
  it(
    title,
    async (context) => {
      const lookup = findTape(name, {
        directory: process.env[TAPES_ENV],
        ...(options.manifest === undefined ? {} : { manifest: options.manifest }),
      });
      if (!lookup.found) {
        (context.task.meta as Record<string, unknown>).realTape = { name, skipped: lookup.reason };
        context.skip(lookup.reason);
        return;
      }
      await body(lookup);
    },
    options.timeoutMs,
  );
}
