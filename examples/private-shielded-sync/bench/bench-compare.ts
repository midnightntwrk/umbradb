/**
 * Both PIR schemes side by side (spec 00058 story 3, FR-051, SC-002, SC-003): `bench.ts compare` reads the
 * `results.json` of several benchmark runs, groups them by snapshot size (the real size, or the padding) and scheme,
 * and gives, for each figure, the median over the runs' samples with its spread (smallest and largest) and the number
 * of samples. Rows are grouped as memory, space, network and time.
 *
 * - **Measured** rows name the field of `results.json` they come from; the files are listed per size.
 * - **Calculated** rows give their formula over measured rows (per-query figures: a call is `queriesPerCall` queries
 *   after a 40-byte header).
 * - A figure with no sample (the run did not measure it) is null, and SC-003's check lists it.
 *
 * Samples: a figure of the build or of the snapshot gives one sample per run; a figure of a wallet's call gives one per
 * wallet per run (the calls of wallets A and B are pooled).
 */

import { basename, dirname, relative } from "node:path";
import { SCHEME_NAMES, type SchemeName } from "../pir/scheme.ts";
import { fmtBytes, fmtMs } from "./bench-report.ts";
import { BUILD_STEP_NAMES, type BenchResults, type CallRow, type WalletRun } from "./bench-results.ts";

export interface CompareRun {
  /** The `results.json` the run wrote (absolute). */
  readonly file: string;
  readonly results: BenchResults;
}

export interface Figure {
  readonly median: number | null;
  readonly min: number | null;
  readonly max: number | null;
  /** Samples the median is over. */
  readonly n: number;
}

export type Group = "Memory" | "Space" | "Network" | "Time";
export type Unit = "bytes" | "ms" | "ratio";

export interface ComparisonRow {
  readonly group: Group;
  readonly name: string;
  /** One of the figures a short table shows (`renderComparison(c, { keyOnly: true })`). */
  readonly key: boolean;
  readonly unit: Unit;
  readonly kind: "measured" | "calculated";
  /** Measured: the field of `results.json`; calculated: the formula. */
  readonly how: string;
  readonly values: Readonly<Record<SchemeName, Figure>>;
}

export interface SizeComparison {
  /** Entries of the snapshot: its outputs, or its padding. */
  readonly entries: number;
  readonly padding: number | null;
  readonly label: string;
  /** The runs' files per scheme, relative to the comparison's folder. */
  readonly files: Readonly<Record<SchemeName, readonly string[]>>;
  /** Load average (1 min) at the runs' starts, smallest and largest. */
  readonly load: { readonly min: number | null; readonly max: number | null };
  readonly rows: readonly ComparisonRow[];
}

export interface Comparison {
  readonly kind: "private-shielded-sync scheme comparison";
  readonly queriesPerCall: number | null;
  readonly sizes: readonly SizeComparison[];
  /** SC-002 at 1,000,000 entries: IPIR+SP's per-snapshot download for the read and nullifier tables ÷ SimplePIR's. */
  readonly sc002: { readonly entries: number; readonly simplepir: number | null; readonly ipirSp: number | null; readonly ratio: number | null; readonly met: boolean | null };
  /** SC-003: the memory, space and network cells without a measured value at the real size, 100,000 and 1,000,000. */
  readonly sc003: { readonly sizes: readonly number[]; readonly missing: readonly string[]; readonly met: boolean };
}

const finite = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

function figure(samples: readonly (number | null | undefined)[]): Figure {
  const xs = samples.filter(finite).sort((a, b) => a - b);
  if (xs.length === 0) return { median: null, min: null, max: null, n: 0 };
  const mid = xs.length % 2 === 1 ? xs[(xs.length - 1) / 2]! : (xs[xs.length / 2 - 1]! + xs[xs.length / 2]!) / 2;
  return { median: mid, min: xs[0]!, max: xs[xs.length - 1]!, n: xs.length };
}

/** A row's definition: how one run gives its samples. */
interface RowDef {
  readonly group: Group;
  readonly name: string;
  readonly unit: Unit;
  readonly kind: "measured" | "calculated";
  readonly how: string;
  readonly samples: (r: BenchResults) => readonly (number | null | undefined)[];
}

const walletsOf = (r: BenchResults): readonly WalletRun[] => r.wallets;
const wallet = (r: BenchResults, label: string): WalletRun | undefined => r.wallets.find((w) => w.label === label);
const sum = (xs: readonly (number | null | undefined)[]): number | null => (xs.every(finite) ? (xs as number[]).reduce((a, b) => a + b, 0) : null);
const onDisk = (r: BenchResults, name: string): number | null => r.snapshot.onDisk?.[name] ?? null;
const buildPeak = (r: BenchResults): number | null => {
  const peaks = BUILD_STEP_NAMES.map((n) => r.serverBuild?.steps[n]?.peakRssBytes).filter(finite);
  return peaks.length === 0 ? null : Math.max(...peaks);
};

type CallName = "read" | "nullifier" | "path";
const callOf = (w: WalletRun, name: CallName): CallRow | null => (name === "path" ? w.path : w[name]);
const calls = (r: BenchResults, name: CallName, f: (c: CallRow) => number | null): (number | null)[] =>
  walletsOf(r).map((w) => {
    const c = callOf(w, name);
    return c === null || c.calls === 0 ? null : f(c);
  });

const TABLE_LABEL: Readonly<Record<CallName, string>> = { read: "read", nullifier: "nullifier", path: "path" };

/** The rows of the short table: the figures story 3 asks for, per call and per query, without the detail rows. */
const KEY_ROWS: ReadonlySet<string> = new Set([
  "Server: peak during the build (its own statistics)",
  "Server: resident once served",
  "Server: held by the three tables",
  "Wallet: peak during its sync (A, B)",
  "Read table file",
  "Path table file",
  "Nullifier table file",
  "Read public artifact (setup data / masks)",
  "Path public artifact",
  "Nullifier public artifact",
  "Scan file",
  "Snapshot on disk, all artifacts",
  "Wallet: once per snapshot, read and nullifier public artifacts",
  "Wallet: once per snapshot, path public artifact (first spend)",
  ...(["read", "nullifier", "path"] as const).flatMap((t) => [`${t} call: up`, `${t} call: down`, `${t}: one query up`, `${t}: one query down`]),
  ...["A", "B"].flatMap((w) => [`Wallet ${w}: whole first sync, up`, `Wallet ${w}: whole first sync, down`]),
  "Wallet A: a later sync, down (artifacts cached)",
  "Naive baseline: every output slot in full and every nullifier entry",
  "Wallet A: first sync down ÷ naive baseline",
  "Build: whole (its own statistics)",
  "Build step readSetup",
  "Build step pathSetup",
  "Build step nullifierSetup",
  ...(["read", "nullifier", "path"] as const).flatMap((t) => [`${t} call: server`, `${t}: server per query`, `${t} call: wallet builds it`, `${t}: wallet builds one query`, `${t} call: wallet decodes its answer`]),
  "Wallet A: whole first sync",
  "Wallet A: whole first sync without the scan",
  "Wallet B: whole first sync",
]);

function rowDefs(q: number): RowDef[] {
  const perQuery = (bytes: number): number => (bytes - 40) / q;
  const defs: RowDef[] = [];
  const m = (group: Group, name: string, unit: Unit, how: string, samples: RowDef["samples"]): void => void defs.push({ group, name, unit, kind: "measured", how, samples });
  const c = (group: Group, name: string, unit: Unit, how: string, samples: RowDef["samples"]): void => void defs.push({ group, name, unit, kind: "calculated", how, samples });

  // ── memory ──
  m("Memory", "Server: resident before the build", "bytes", "`build.rssBeforeBytes` (`ps`, every 200 ms)", (r) => [r.build?.rssBeforeBytes]);
  m("Memory", "Server: peak during the build (`ps`)", "bytes", "`build.rssPeakBytes` (`ps`, every 200 ms, request to served)", (r) => [r.build?.rssPeakBytes]);
  m("Memory", "Server: peak during the build (its own statistics)", "bytes", "largest `serverBuild.steps[*].peakRssBytes` (`build-stats.json`, every 10 ms)", (r) => [buildPeak(r)]);
  m("Memory", "Server: resident once served", "bytes", "`build.rssAfterBytes` (median of the 250 ms peaks 1 to 3 s after)", (r) => [r.build?.rssAfterBytes]);
  for (const t of ["read", "path", "nullifier"] as const) {
    m("Memory", `Server: held by the ${t} table (as the scheme reports)`, "bytes", `\`server.heldBytes.${t}\` (module status)`, (r) => [r.server.heldBytes?.[t]]);
  }
  c("Memory", "Server: held by the three tables", "bytes", "read + path + nullifier held", (r) => [r.server.heldBytes === null ? null : sum([r.server.heldBytes.read, r.server.heldBytes.path ?? 0, r.server.heldBytes.nullifier])]);
  m("Memory", "Wallet: peak during its sync (A, B)", "bytes", "`wallets[].peakRssBytes` (the benchmark's process)", (r) => walletsOf(r).map((w) => w.peakRssBytes));
  m("Memory", "Wallet: peak during the path read (A, B)", "bytes", "`wallets[].path.clientPeakRssBytes`", (r) => walletsOf(r).map((w) => w.path?.clientPeakRssBytes));

  // ── space ──
  for (const [name, label] of [
    ["readTable", "Read table file"],
    ["pathTable", "Path table file"],
    ["nullifierTable", "Nullifier table file"],
    ["readPublic", "Read public artifact (setup data / masks)"],
    ["pathPublic", "Path public artifact"],
    ["nullifierPublic", "Nullifier public artifact"],
    ["scan", "Scan file"],
    ["blockRoots", "Block roots"],
  ] as const) {
    m("Space", label, "bytes", `\`snapshot.onDisk.${name}\` (file size in the data directory)`, (r) => [onDisk(r, name)]);
  }
  c("Space", "Snapshot on disk, all artifacts", "bytes", "sum of `snapshot.onDisk`", (r) => [r.snapshot.onDisk === null ? null : Object.values(r.snapshot.onDisk).reduce((a, b) => a + b, 0)]);
  m("Space", "Wallet: artifact cache after its first sync (A, B)", "bytes", "`wallets[].cacheBytes`", (r) => walletsOf(r).map((w) => w.cacheBytes));

  // ── network ──
  m("Network", "Wallet: once per snapshot, read and nullifier public artifacts", "bytes", "`downloads.readPublic.bytes + downloads.nullifierPublic.bytes` (first sync)", (r) =>
    walletsOf(r).map((w) => w.downloads.readPublic.bytes + w.downloads.nullifierPublic.bytes),
  );
  m("Network", "Wallet: once per snapshot, path public artifact (first spend)", "bytes", "`wallets[].path.public.bytes`", (r) => walletsOf(r).map((w) => w.path?.public.bytes));
  m("Network", "Wallet: once per snapshot, scan file and block roots (both schemes)", "bytes", "`downloads.scan.bytes + downloads.blockRoots.bytes`", (r) => walletsOf(r).map((w) => w.downloads.scan.bytes + w.downloads.blockRoots.bytes));
  for (const t of ["read", "nullifier", "path"] as const) {
    m("Network", `${TABLE_LABEL[t]} call: up`, "bytes", `\`wallets[].${t}.bytesUp\` (per call)`, (r) => calls(r, t, (x) => x.bytesUp));
    m("Network", `${TABLE_LABEL[t]} call: down`, "bytes", `\`wallets[].${t}.bytesDown\` (per call)`, (r) => calls(r, t, (x) => x.bytesDown));
    c("Network", `${TABLE_LABEL[t]}: one query up`, "bytes", `(call up − 40) / ${q}`, (r) => calls(r, t, (x) => perQuery(x.bytesUp)));
    c("Network", `${TABLE_LABEL[t]}: one query down`, "bytes", `(call down − 40) / ${q}`, (r) => calls(r, t, (x) => perQuery(x.bytesDown)));
  }
  for (const label of ["A", "B"]) {
    m("Network", `Wallet ${label}: whole first sync, up`, "bytes", `\`wallets[${label}].bytesUp\``, (r) => [wallet(r, label)?.bytesUp]);
    m("Network", `Wallet ${label}: whole first sync, down`, "bytes", `\`wallets[${label}].bytesDown\``, (r) => [wallet(r, label)?.bytesDown]);
    c("Network", `Wallet ${label}: a later sync, down (artifacts cached)`, "bytes", "first sync down − the four artifacts' bytes", (r) => {
      const w = wallet(r, label);
      return [w === undefined ? null : w.bytesDown - Object.values(w.downloads).reduce((n, d) => n + d.bytes, 0)];
    });
  }
  c("Network", "Naive baseline: every output slot in full and every nullifier entry", "bytes", "outputs × 256 + nullifier entries × 32 (`naive.totalBytes`)", (r) => [r.naive.totalBytes]);
  c("Network", "Wallet A: first sync down ÷ naive baseline", "ratio", "`wallets[A].bytesDown / naive.totalBytes`", (r) => {
    const w = wallet(r, "A");
    return [w === undefined || r.naive.totalBytes === 0 ? null : w.bytesDown / r.naive.totalBytes];
  });

  // ── time ──
  m("Time", "Build: whole (its own statistics)", "ms", "`serverBuild.totalMs`", (r) => [r.serverBuild?.totalMs]);
  m("Time", "Build: request to served (the benchmark)", "ms", "`build.ms`", (r) => [r.build?.ms]);
  for (const step of BUILD_STEP_NAMES) {
    m("Time", `Build step ${step}`, "ms", `\`serverBuild.steps.${step}.ms\``, (r) => [r.serverBuild?.steps[step]?.ms]);
  }
  for (const t of ["read", "nullifier", "path"] as const) {
    m("Time", `${TABLE_LABEL[t]} call: server`, "ms", `\`wallets[].${t}.serverMs\` (the module's request log)`, (r) => calls(r, t, (x) => x.serverMs));
    c("Time", `${TABLE_LABEL[t]}: server per query`, "ms", `call's server time / ${q}`, (r) => calls(r, t, (x) => (x.serverMs === null ? null : x.serverMs / q)));
    m("Time", `${TABLE_LABEL[t]} call: wallet builds it`, "ms", `\`wallets[].${t}.clientBuildMs\``, (r) => calls(r, t, (x) => x.clientBuildMs));
    c("Time", `${TABLE_LABEL[t]}: wallet builds one query`, "ms", `call's build time / ${q}`, (r) => calls(r, t, (x) => x.clientBuildMs / q));
    m("Time", `${TABLE_LABEL[t]} call: wallet decodes its answer`, "ms", `\`wallets[].${t}.clientDecodeMs\``, (r) => calls(r, t, (x) => x.clientDecodeMs));
    m("Time", `${TABLE_LABEL[t]} call: round trip`, "ms", `\`wallets[].${t}.roundTripMs\``, (r) => calls(r, t, (x) => x.roundTripMs));
  }
  m("Time", "Wallet: download of the read and nullifier public artifacts", "ms", "`downloads.readPublic.ms + downloads.nullifierPublic.ms`", (r) => walletsOf(r).map((w) => w.downloads.readPublic.ms + w.downloads.nullifierPublic.ms));
  for (const label of ["A", "B"]) {
    m("Time", `Wallet ${label}: whole first sync`, "ms", `\`wallets[${label}].totalMs\``, (r) => [wallet(r, label)?.totalMs]);
    c("Time", `Wallet ${label}: whole first sync without the scan`, "ms", "`totalMs − scan.ms`", (r) => {
      const w = wallet(r, label);
      return [w === undefined ? null : w.totalMs - w.scan.ms];
    });
  }
  m("Time", "Wallet: scan of the scan file (both schemes)", "ms", "`wallets[].scan.ms`", (r) => walletsOf(r).map((w) => w.scan.ms));
  m("Time", "Wallet: path read, whole (public artifact, call, checks)", "ms", "`wallets[].path.ms`", (r) => walletsOf(r).map((w) => w.path?.ms));
  return defs;
}

const sizeLabel = (entries: number, padding: number | null, outputs: number): string =>
  padding === null ? `real size (${entries.toLocaleString("en-US")} outputs)` : `padded to ${padding.toLocaleString("en-US")} entries (${outputs.toLocaleString("en-US")} real outputs)`;

/** Groups the runs by size and scheme and aggregates every figure (see the module comment). */
export function compareRuns(runs: readonly CompareRun[], outDir: string): Comparison {
  const bySize = new Map<number, CompareRun[]>();
  for (const run of runs) {
    const s = run.results.snapshot;
    const entries = s.padding ?? s.outputs;
    bySize.set(entries, [...(bySize.get(entries) ?? []), run]);
  }
  const qs = new Set(runs.map((r) => r.results.snapshot.queriesPerCall));
  if (qs.size > 1) throw new Error(`the runs have different call sizes (${[...qs].join(", ")}): compare runs of one setting`);
  const q = runs[0]?.results.snapshot.queriesPerCall ?? 32;
  const defs = rowDefs(q);
  const rel = (file: string): string => {
    const r = relative(outDir, file);
    return r.startsWith("..") ? `${basename(dirname(file))}/${basename(file)}` : r;
  };
  const sizes: SizeComparison[] = [...bySize.entries()]
    .sort(([a], [b]) => a - b)
    .map(([entries, group]) => {
      const of = (scheme: SchemeName): CompareRun[] => group.filter((g) => g.results.snapshot.scheme === scheme);
      const padding = group[0]!.results.snapshot.padding;
      const loads = group.map((g) => g.results.loadAverage.start[0]).filter(finite);
      return {
        entries,
        padding,
        label: sizeLabel(entries, padding, group[0]!.results.snapshot.outputs),
        files: Object.fromEntries(SCHEME_NAMES.map((s) => [s, of(s).map((g) => rel(g.file))])) as Record<SchemeName, string[]>,
        load: { min: loads.length === 0 ? null : Math.min(...loads), max: loads.length === 0 ? null : Math.max(...loads) },
        rows: defs.map((d) => ({
          group: d.group,
          name: d.name,
          key: KEY_ROWS.has(d.name),
          unit: d.unit,
          kind: d.kind,
          how: d.how,
          values: Object.fromEntries(SCHEME_NAMES.map((s) => [s, figure(of(s).flatMap((g) => d.samples(g.results)))])) as Record<SchemeName, Figure>,
        })),
      };
    });
  const SC002_ENTRIES = 1_000_000;
  const at = sizes.find((s) => s.entries === SC002_ENTRIES);
  const once = at?.rows.find((r) => r.name === "Wallet: once per snapshot, read and nullifier public artifacts");
  const simple = once?.values.simplepir.median ?? null;
  const ipir = once?.values["ipir-sp"].median ?? null;
  const ratio = simple === null || ipir === null || simple === 0 ? null : ipir / simple;
  const sc003Sizes = sizes.filter((s) => s.padding === null || s.entries === 100_000 || s.entries === 1_000_000);
  const missing = sc003Sizes.flatMap((s) =>
    s.rows
      .filter((r) => r.group !== "Time")
      .flatMap((r) => SCHEME_NAMES.filter((scheme) => r.values[scheme].median === null).map((scheme) => `${s.label} / ${r.group} / ${r.name} / ${scheme}`)),
  );
  return {
    kind: "private-shielded-sync scheme comparison",
    queriesPerCall: runs.length === 0 ? null : q,
    sizes,
    sc002: { entries: SC002_ENTRIES, simplepir: simple, ipirSp: ipir, ratio, met: ratio === null ? null : ratio < 0.01 },
    sc003: { sizes: sc003Sizes.map((s) => s.entries), missing, met: sc003Sizes.length >= 3 && missing.length === 0 },
  };
}

// ── rendering ───────────────────────────────────────────────────────────────────────────────────────────────────

const exact = (n: number): string => `${Math.round(n).toLocaleString("en-US")} B`;

function valueText(unit: Unit, x: number, group: Group): string {
  if (unit === "ms") return fmtMs(x);
  if (unit === "ratio") return x < 0.01 ? x.toExponential(2) : x.toFixed(3);
  // Bytes: exact under 1 MiB and in the network rows (deterministic sizes); otherwise binary units.
  return group === "Network" || Math.abs(x) < 1024 * 1024 ? exact(x) : fmtBytes(x);
}

export function figureText(f: Figure, unit: Unit, group: Group): string {
  if (f.median === null) return "**not measured**";
  const v = valueText(unit, f.median, group);
  if (f.n <= 1 || f.min === f.max) return f.n > 1 ? `${v} (n ${f.n})` : v;
  return `${v} (${valueText(unit, f.min!, group)}–${valueText(unit, f.max!, group)}, n ${f.n})`;
}

const ratioText = (a: Figure, b: Figure): string => {
  if (a.median === null || b.median === null || a.median === 0) return "—";
  const r = b.median / a.median;
  return r >= 100 || r < 0.01 ? `${r.toExponential(2)}×` : `${r.toPrecision(3)}×`;
};

const escape = (s: string): string => s.replace(/\|/g, "\\|");

/** The side-by-side tables, one per size (only the key rows with `keyOnly`), then SC-002 and SC-003 (Markdown). */
export function renderComparison(c: Comparison, options: { readonly keyOnly?: boolean } = {}): string {
  const out: string[] = [];
  for (const s of c.sizes) {
    out.push(`### ${s.label[0]!.toUpperCase()}${s.label.slice(1)}`, "");
    const files = SCHEME_NAMES.map((scheme) => `${scheme}: ${s.files[scheme].length === 0 ? "no run" : s.files[scheme].map((f) => `\`${f}\``).join(", ")}`).join("; ");
    out.push(
      `Runs: ${files}. Load average (1 min) at the runs' starts: ${s.load.min === null ? "?" : `${s.load.min}–${s.load.max}`}. ` +
        `Each figure is the median over its samples, then the smallest and largest and the number of samples (n). M: measured, the field of \`results.json\` named; C: calculated by the formula given.`,
      "",
    );
    out.push("| Group | Figure | SimplePIR | IPIR+SP | IPIR+SP ÷ SimplePIR | How |", "|---|---|---|---|---|---|");
    for (const r of s.rows) {
      if (options.keyOnly === true && !r.key) continue;
      const a = r.values.simplepir;
      const b = r.values["ipir-sp"];
      out.push(
        `| ${r.group} | ${escape(r.name)} | ${escape(figureText(a, r.unit, r.group))} | ${escape(figureText(b, r.unit, r.group))} | ${ratioText(a, b)} | ${r.kind === "measured" ? "M" : "C"}: ${escape(r.how)} |`,
      );
    }
    out.push("");
  }
  const sc2 = c.sc002;
  out.push(
    `**SC-002** (at ${sc2.entries.toLocaleString("en-US")} entries, IPIR+SP's per-snapshot download for the read and nullifier tables under 1% of SimplePIR's): ` +
      (sc2.ratio === null
        ? "not checked: no runs of both schemes at that size."
        : `${exact(sc2.ipirSp!)} against ${exact(sc2.simplepir!)}, ${(sc2.ratio * 100).toFixed(3)}%: **${sc2.met ? "met" : "not met"}**.`),
    "",
  );
  const sc3 = c.sc003;
  out.push(
    `**SC-003** (a measured value in every memory, space and network cell at the real size, 100,000 and 1,000,000): ` +
      (sc3.met ? "**met**." : `**not met**${sc3.sizes.length < 3 ? ` (sizes compared: ${sc3.sizes.join(", ")})` : ""}${sc3.missing.length === 0 ? "" : `; without a value: ${sc3.missing.join("; ")}`}.`),
    "",
  );
  return out.join("\n");
}
