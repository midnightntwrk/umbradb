/**
 * `REPORT.md` from `results.json` (spec FR-150–154, SC-005): the setup, the table of spec §8 with the server and each
 * wallet's client on their own rows, the naive baseline (FR-152), the read table at each `pathSplit` (FR-153), the scan
 * by thread count, what the server observes (FR-154), the chain sync, the transfer and the notes.
 *
 * `section8` builds the table as cells; a cell the spec asks for that has no value is `missing`, with the reason, and
 * `missingCells` lists them (the report prints the list; the tests require it empty).
 */

import { isSchemeName, PUBLIC_ARTIFACT } from "../pir/scheme.ts";
import { BUILD_STEP_NAMES, type BenchResults, type BuildStep, type CallRow, type SplitCall, type WalletRun } from "./bench-results.ts";

/** What the snapshot's scheme calls the public artifact a wallet downloads per table (SimplePIR: setup data). */
const publicLabel = (r: BenchResults): string => (isSchemeName(r.snapshot.scheme) ? PUBLIC_ARTIFACT[r.snapshot.scheme] : "public artifact");

// ── formatting ───────────────────────────────────────────────────────────────────────────────────────────────────

const group = (n: number, digits = 0): string => n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 });

export function fmtBytes(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "?";
  const abs = Math.abs(n);
  if (abs < 1024) return `${group(n, 0)} B`;
  const units = ["KiB", "MiB", "GiB", "TiB"];
  let v = n / 1024;
  let u = 0;
  while (Math.abs(v) >= 1024 && u < units.length - 1) {
    v /= 1024;
    u++;
  }
  return `${v.toFixed(Math.abs(v) < 10 ? 2 : 1)} ${units[u]}`;
}

export function fmtMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return "?";
  if (ms < 1) return `${ms.toFixed(2)} ms`;
  if (ms < 10) return `${ms.toFixed(1)} ms`;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)} s`;
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)} min ${Math.round((ms % 60_000) / 1000)} s`;
  return `${(ms / 3_600_000).toFixed(2)} h`;
}

const fmtRate = (x: number | null | undefined, digits = 1): string => (x === null || x === undefined || !Number.isFinite(x) ? "?" : group(x, digits));
const fmtMicros = (x: number): string => (x < 10 ? x.toFixed(2) : x < 100 ? x.toFixed(1) : group(x, 0));
const short = (hex: string): string => `\`${hex.slice(0, 16)}…\``;
const plural = (n: number, one: string, many = `${one}s`): string => `${group(n)} ${n === 1 ? one : many}`;
/** `a ÷ b` with three significant digits. */
const ratio = (a: number, b: number): string => (b > 0 ? `${Number((a / b).toPrecision(3)).toLocaleString("en-US")}×` : "?");

// ── the §8 table ─────────────────────────────────────────────────────────────────────────────────────────────────

/** A cell: a value, not part of the metric (`—` in the spec's table), or asked for and missing (why). */
export type Cell = { readonly kind: "value"; readonly text: string } | { readonly kind: "na" } | { readonly kind: "missing"; readonly why: string };

const value = (text: string): Cell => ({ kind: "value", text });
const NA: Cell = { kind: "na" };
const missing = (why: string): Cell => ({ kind: "missing", why });
/** A value when every input is present, else missing. */
function needs(inputs: readonly unknown[], why: string, text: () => string): Cell {
  return inputs.every((x) => x !== null && x !== undefined && (typeof x !== "number" || Number.isFinite(x))) ? value(text()) : missing(why);
}

export const COLUMNS = ["storage", "memory", "inFlight", "computing"] as const;
export type Column = (typeof COLUMNS)[number];

export interface Section8Row {
  readonly part: string;
  readonly side: string;
  readonly cells: Readonly<Record<Column, Cell>>;
}

const row = (part: string, side: string, cells: Partial<Record<Column, Cell>>): Section8Row => ({
  part,
  side,
  cells: { storage: cells.storage ?? NA, memory: cells.memory ?? NA, inFlight: cells.inFlight ?? NA, computing: cells.computing ?? NA },
});

const noStats = "no build statistics (give --pss-data, or --db-url for an in-process build)";
const noServerMemory = "the server's memory was not sampled (give --server-container or --server-pid)";
const noServerLog = "no server log line for the request (give --server-container or --server-log)";

function buildRow(r: BenchResults, part: string, steps: readonly ("scan" | "tree" | "readTable" | "readSetup" | "pathTable" | "pathSetup" | "nullifierTable" | "nullifierSetup")[], storage: (s: Record<string, BuildStep>) => string, computing: (s: Record<string, BuildStep>) => string): Section8Row {
  const b = r.serverBuild;
  const got = steps.map((n) => b?.steps[n] ?? null);
  if (b === null || got.some((s) => s === null)) return row(part, "server", { storage: missing(noStats), memory: missing(noStats), computing: missing(noStats) });
  const s = Object.fromEntries(steps.map((n, i) => [n, got[i]!])) as Record<string, BuildStep>;
  const peaks = got.map((x) => x!.peakRssBytes);
  return row(part, "server", {
    storage: value(storage(s)),
    memory: needs(peaks, "no peak in the build statistics", () => (steps.length === 1 ? fmtBytes(peaks[0]) : steps.map((n, i) => `${label(n)} ${fmtBytes(peaks[i])}`).join("; "))),
    computing: value(computing(s)),
  });
}

const label = (step: string): string =>
  ({ scan: "scan file", tree: "tree", readTable: "table", readSetup: "setup", pathTable: "table", pathSetup: "setup", nullifierTable: "table", nullifierSetup: "setup", manifest: "manifest" })[step] ?? step;

function callRows(part: string, w: WalletRun, c: CallRow): Section8Row[] {
  const calls = c.calls > 1 ? ` (mean of ${c.calls} calls)` : "";
  return [
    row(part, `server (${w.label}'s call)`, {
      memory: needs([c.serverPeakRssBytes], noServerMemory, () => fmtBytes(c.serverPeakRssBytes)),
      computing: needs([c.serverMs], noServerLog, () => `multiply ${fmtMs(c.serverMs)} (the route's time: decode, multiply, encode)${calls}`),
    }),
    row(part, `client ${w.label}`, {
      memory: needs([c.clientPeakRssBytes], "not sampled", () => fmtBytes(c.clientPeakRssBytes)),
      inFlight: value(`${fmtBytes(c.bytesUp)} up, ${fmtBytes(c.bytesDown)} down, round trip ${fmtMs(c.roundTripMs)}${calls}`),
      computing: value(`build ${fmtMs(c.clientBuildMs)}, decode ${fmtMs(c.clientDecodeMs)}${calls}`),
    }),
  ];
}

/** The table of spec §8 (see the module comment). */
export function section8(r: BenchResults): Section8Row[] {
  const rows: Section8Row[] = [];
  const cs = r.chainSync;
  rows.push(
    row("Chain sync (core modules)", "server", {
      storage: needs([cs.database?.bytes], "no database given (--db-url)", () => `${fmtBytes(cs.database!.bytes)} database`),
      computing: needs([cs.rate?.heightsPerSecond], "no sync records given (--sync-records)", () => `${fmtRate(cs.rate!.heightsPerSecond)} heights/s (${group(cs.rate!.heights)} heights in ${fmtMs(cs.rate!.seconds * 1000)})`),
    }),
  );
  const ev = r.readEvents ?? r.serverBuild?.indexLoad ?? null;
  rows.push(
    row("Read events for a snapshot", "server", {
      memory: needs([ev?.peakRssBytes], "no database given (--db-url)", () => fmtBytes(ev!.peakRssBytes)),
      computing: needs([ev?.ms], "no database given (--db-url)", () => `${fmtMs(ev!.ms)}, ${fmtRate(ev!.rowsPerSecond, 0)} rows/s (${group(ev!.rows)} rows)`),
    }),
  );
  rows.push(buildRow(r, "Build scan file", ["scan"], (s) => fmtBytes(s.scan!.bytes), (s) => fmtMs(s.scan!.ms)));
  rows.push(
    buildRow(r, "Build tree and paths", ["tree"], (s) => `${fmtBytes(s.tree!.bytes)} block roots`, (s) => `${fmtMs(s.tree!.ms)}, ${fmtRate(s.tree!.hashesPerSecond, 0)} hashes/s (${group(s.tree!.hashes ?? 0)} hashes)`),
  );
  rows.push(
    buildRow(r, "Build read table and setup data", ["readTable", "readSetup"], (s) => `table ${fmtBytes(s.readTable!.bytes)}, setup ${fmtBytes(s.readSetup!.bytes)}`, (s) => `table ${fmtMs(s.readTable!.ms)}, setup ${fmtMs(s.readSetup!.ms)}`),
  );
  rows.push(
    buildRow(r, "Build path table and setup data", ["pathTable", "pathSetup"], (s) => `table ${fmtBytes(s.pathTable!.bytes)}, setup ${fmtBytes(s.pathSetup!.bytes)}`, (s) => `table ${fmtMs(s.pathTable!.ms)}, setup ${fmtMs(s.pathSetup!.ms)}`),
  );
  rows.push(
    buildRow(r, "Build nullifier table and setup data", ["nullifierTable", "nullifierSetup"], (s) => `table ${fmtBytes(s.nullifierTable!.bytes)}, setup ${fmtBytes(s.nullifierSetup!.bytes)}`, (s) => `table ${fmtMs(s.nullifierTable!.ms)}, setup ${fmtMs(s.nullifierSetup!.ms)}`),
  );
  for (const w of r.wallets) {
    const d = w.downloads;
    const one = (name: string, x: typeof d.scan) => `${name} ${x.cached ? "cached" : `${fmtBytes(x.bytes)} in ${fmtMs(x.ms)}`}`;
    const label = publicLabel(r);
    rows.push(
      row(`Download scan file, block roots, ${label}`, `client ${w.label}`, {
        storage: value(`${fmtBytes(w.cacheBytes)} cache`),
        inFlight: value([one("scan file", d.scan), one("block roots", d.blockRoots), one(`read ${label}`, d.readPublic), one(`nullifier ${label}`, d.nullifierPublic)].join("; ")),
      }),
    );
  }
  r.wallets.forEach((w, i) => {
    const sweep = i === 0 && r.scanSweep.length > 0 ? `; by thread count: ${r.scanSweep.map((s) => `${s.threads} → ${fmtMs(s.ms)} (${fmtMicros(s.microsPerOutput)} µs/output)`).join(", ")}` : "";
    rows.push(
      row("Scan", `client ${w.label}`, {
        memory: needs([w.steps.scan.clientPeakRssBytes], "not sampled", () => fmtBytes(w.steps.scan.clientPeakRssBytes)),
        computing:
          i === 0 && r.scanSweep.length === 0
            ? missing("no scan by thread count (--scan-threads)")
            : value(`${fmtMs(w.scan.ms)} for ${group(w.scan.entries)} outputs on ${w.scan.threads} threads (${fmtMicros(w.scan.microsPerOutput)} µs/output)${sweep}`),
      }),
    );
  });
  for (const w of r.wallets) rows.push(...callRows("Read coins (one call)", w, w.read));
  for (const w of r.wallets) rows.push(...callRows("Nullifier lookups (one call)", w, w.nullifier));
  for (const w of r.wallets) {
    rows.push(
      row("Tail", `server (served to ${w.label})`, {
        storage: value(`${fmtBytes(w.tail.bytes)} tail${w.tail.serverMs === null ? "" : ` (built and served in ${fmtMs(w.tail.serverMs)})`}`),
      }),
      row("Tail", `client ${w.label}`, {
        inFlight: value(`${fmtBytes(w.tail.bytes)} in ${fmtMs(w.tail.ms)}`),
        computing: value(`${fmtMs(w.tail.clientMs)} (${group(w.tail.outputs)} outputs scanned, ${group(w.tail.nullifiers)} nullifiers)`),
      }),
    );
  }
  for (const w of r.wallets) {
    rows.push(
      row("Whole `sync`", `client ${w.label}`, {
        storage: value(`${fmtBytes(w.stateBytes)} local state`),
        memory: needs([w.peakRssBytes], "not sampled", () => fmtBytes(w.peakRssBytes)),
        inFlight: value(`${fmtBytes(w.bytesUp)} up, ${fmtBytes(w.bytesDown)} down (${w.requests.length} requests)`),
        computing: value(`${fmtMs(w.totalMs)} wall-clock; ${fmtMs(w.computingMs)} without network waits`),
      }),
    );
  }
  const t = r.transfer;
  const notRun = "not run (no transfer record given: --transfer)";
  if (t === null) {
    rows.push(row("Transfer", "client", { memory: missing(notRun), inFlight: missing(notRun), computing: missing(notRun) }));
  } else {
    const tm = t.timings;
    const side = `client ${t.wallet ?? "(sender)"}`;
    rows.push(
      row("Transfer", side, {
        memory: needs([t.peakRssBytes], "the transfer record holds no peak memory (made before the client recorded it)", () => fmtBytes(t.peakRssBytes)),
        inFlight: needs([t.bytesSubmitted], t.txHash === null ? "not run (the record is a dry run)" : "not submitted (the record is a --no-submit run)", () => `${fmtBytes(t.bytesSubmitted)} submitted`),
        computing: needs(
          [tm.pathMs, tm.stateMs, tm.proveMs, tm.balanceMs, tm.toFinalizedMs],
          t.txHash === null ? "not run (the record is a dry run)" : "the record lacks a timing (not submitted?)",
          () => `path ${fmtMs(tm.pathMs)}, state ${fmtMs(tm.stateMs)} (+ spend ${fmtMs(tm.spendMs)}), proving ${fmtMs(tm.proveMs)}, Dust balancing ${fmtMs(tm.balanceMs)}, to finality ${fmtMs(tm.toFinalizedMs)}`,
        ),
      }),
    );
  }
  return rows;
}

/** Every cell the spec asks for that has no value. */
export function missingCells(r: BenchResults): { part: string; side: string; column: Column; why: string }[] {
  const out: { part: string; side: string; column: Column; why: string }[] = [];
  for (const x of section8(r)) {
    for (const column of COLUMNS) {
      const c = x.cells[column];
      if (c.kind === "missing") out.push({ part: x.part, side: x.side, column, why: c.why });
    }
  }
  return out;
}

const cellText = (c: Cell): string => (c.kind === "value" ? c.text : c.kind === "na" ? "—" : `**not measured:** ${c.why}`);
const escape = (s: string): string => s.replace(/\|/g, "\\|");

function table(header: readonly string[], rows: readonly (readonly string[])[]): string {
  return [`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(escape).join(" | ")} |`)].join("\n");
}

// ── the report ───────────────────────────────────────────────────────────────────────────────────────────────────

export function renderReport(r: BenchResults): string {
  const out: string[] = [];
  const s = r.snapshot;
  const walletNames = r.wallets.map((w) => w.label).join(", ");
  out.push(`# Private shielded sync: benchmark on ${r.network}`, "");
  out.push(
    `Snapshot ${short(s.id)} at height ${group(s.height)} (block ${short(s.blockHash)}): ${plural(s.outputs, "shielded output")}, ${plural(s.nullifiers, "nullifier")}, ` +
      `\`pathSplit\` k = ${s.pathSplit}, ${s.queriesPerCall} vectors per query call${s.builtByBench ? " (built for this run)" : ""}. ` +
      `Run from ${r.startedAt} to ${r.finishedAt}; wallets ${walletNames}. Written by \`examples/private-shielded-sync/bench/bench.ts\`; every number is in \`results.json\` beside this file.`,
    "",
  );

  out.push("## Setup", "");
  const m = r.machine;
  const sm = r.software.serverMachine;
  out.push(
    table(
      ["", ""],
      [
        ["Machine", `${m.cpu}, ${m.cores} cores, ${fmtBytes(m.memoryBytes)}, ${m.platform} ${m.arch}`],
        ["Node.js (client, benchmark)", m.node],
        ["UmbraDB", `${r.software.umbradb}${r.software.commit === null ? "" : ` at \`${r.software.commit}\``}`],
        ["Scan kernel", `\`pss-kernel.wasm\` SHA-256 \`${r.software.kernelDigest.slice(0, 16)}…\``],
        ["Client ledger package", r.software.ledger],
        ["Network", r.network],
        ["Server", `${r.server.origin}${sm === null ? "" : `; its process: Node.js ${String(sm.node)}, ${String(sm.platform)} ${String(sm.arch)}, ${String(sm.cpus)} CPUs (from its build statistics)`}${r.server.threads === null ? "" : `; ${r.server.threads} PIR threads`}`],
        ["Server modules", r.software.serverModules === null ? "not read (give --status-url)" : r.software.serverModules.map((x) => `${x.id} ${x.version}`).join(", ")],
        ["Server memory", r.server.memory],
        ["Server log", r.server.log],
        ["Load average (1, 5, 15 min)", `start ${r.loadAverage.start.join(" / ")}; end ${r.loadAverage.end.join(" / ")}`],
        s.scheme === "simplepir"
          ? ["SimplePIR", `q = 2^${s.pir.logQ}, n = ${s.pir.n}, σ = ${s.pir.sigma}, ${s.pir.cellBits} bits per cell (p = ${s.pir.plainModulus})`]
          : [`PIR scheme ${s.scheme}`, Object.entries(s.pir).map(([k, v]) => `${k} ${v}`).join(", ")],
        ["Artifacts", Object.entries(s.artifacts).map(([n, b]) => `${n} ${fmtBytes(b)}`).join(", ")],
      ],
    ),
    "",
  );

  out.push("## The measurements of spec §8", "");
  out.push(
    "Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; \"without network waits\" subtracts the time spent in requests. " +
      "Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). " +
      "Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from " +
      `${r.serverBuild?.source ?? "nowhere (not measured)"}; the event read is ${r.readEvents === null ? "the module's own load at start" : "the module's query run by the benchmark against the database at the snapshot height"}. "—": not part of the metric.`,
    "",
  );
  const rows = section8(r);
  out.push(table(["Part", "Side", "Storage", "Memory (peak)", "In flight", "Computing"], rows.map((x) => [x.part, x.side, ...COLUMNS.map((c) => cellText(x.cells[c]))])), "");
  const gaps = missingCells(r);
  out.push(
    gaps.length === 0
      ? "Every cell of the table has a value."
      : `**${gaps.length} cell${gaps.length === 1 ? "" : "s"} without a value:** ${gaps.map((g) => `${g.part} / ${g.side} / ${g.column} (${g.why})`).join("; ")}.`,
    "",
  );

  out.push("## Naive baseline (FR-152)", "");
  const n = r.naive;
  out.push(
    `Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: ` +
      `${group(n.outputs)} × 256 B + ${group(n.nullifiers)} × 32 B = **${fmtBytes(n.totalBytes)}** (${group(n.totalBytes)} bytes). What each wallet's sync moved instead:`,
    "",
  );
  out.push(
    table(
      ["Wallet", "Down, first sync", "÷ naive", "Of which artifacts", "Down, later syncs (artifacts cached)", "÷ naive", "Up"],
      r.wallets.map((w) => {
        const artifacts = Object.values(w.downloads).reduce((x, d) => x + d.bytes, 0);
        const later = w.bytesDown - artifacts;
        return [w.label, fmtBytes(w.bytesDown), ratio(w.bytesDown, n.totalBytes), fmtBytes(artifacts), fmtBytes(later), ratio(later, n.totalBytes), fmtBytes(w.bytesUp)];
      }),
    ),
    "",
    "A first sync downloads the snapshot's artifacts once (the scan file, block roots and both setup matrices, the same for every wallet); a later sync against the same snapshot moves only the manifest, the query calls and the tail. " +
      "Both include the tail (outputs after the snapshot, in full, for every wallet); the baseline counts only the snapshot.",
    "",
  );

  out.push("## The read and path tables at each `pathSplit` (FR-153, Q58)", "");
  if (r.pathSplits.length === 0) {
    out.push("**Not measured:** no database was given (`--db-url`), so the read table could not be built in-process.", "");
  } else {
    out.push(
      `The served snapshot has k = ${s.pathSplit}. For each k below, the benchmark read the snapshot's stored events with the module's own query and ran the module's own builder in-process ` +
        `(${r.pathSplits[0]!.threads} threads); the build checks the core's root at the height. A read record is 98 bytes at every k (the commitment's first 16 bytes, ciphertext elements 1–5 shrunk); the k lower path hashes are in the path table, 32k bytes a record, which a wallet reads only to spend (none at k = 0). Each call is one call of ${s.queriesPerCall} vectors with client and server in the benchmark's process (no network), after one warm-up call; every record of its columns was checked against the table's own.`,
      "",
    );
    out.push(
      table(
        ["k", "Read record", "Read grid R × C (per column)", "Path record", "Path grid R × C (per column)", "Block roots", "Read table / setup", "Path table / setup", "Tree", "Tables and setups", "Peak", "Same as served"],
        r.pathSplits.map((p) => [
          String(p.k),
          `${p.recordBytes} B`,
          `${group(p.rows)} × ${group(p.cols)} (${p.perColumn})`,
          p.path === null ? "—" : `${p.path.recordBytes} B`,
          p.path === null ? "none (k = 0)" : `${group(p.path.rows)} × ${group(p.path.cols)} (${p.path.perColumn})`,
          `${fmtBytes(p.sizes.blockRoots)} (${group(p.blocks)})`,
          `${fmtBytes(p.sizes.readTable)} / ${fmtBytes(p.sizes.readPublic)}`,
          p.path === null ? "—" : `${fmtBytes(p.path.tableBytes)} / ${fmtBytes(p.path.publicBytes)}`,
          `${fmtMs(p.steps.tree!.ms)}, ${fmtRate(p.steps.tree!.hashesPerSecond, 0)} hashes/s`,
          (["readTable", "readSetup", "pathTable", "pathSetup"] as const).filter((n) => p.steps[n] !== null).map((n) => `${n} ${fmtMs(p.steps[n]!.ms)}`).join(", "),
          fmtBytes(Math.max(...(["tree", "readTable", "readSetup", "pathTable", "pathSetup"] as const).map((n) => p.steps[n]?.peakRssBytes ?? 0))),
          p.sameAsServed === null ? "—" : p.sameAsServed ? "yes (same identifier)" : "**no**",
        ]),
      ),
      "",
    );
    out.push(
      table(
        ["k", "Call", "Up", "Down", "Client build", "Server multiply", "Client decode", "Peak", "Records checked"],
        r.pathSplits.flatMap((p) => {
          const calls: [string, SplitCall][] = [["read (each sync)", p.call]];
          if (p.path?.call) calls.push(["path (each spend)", p.path.call]);
          return calls.map(([name, c]) => [String(p.k), name, fmtBytes(c.bytesUp), fmtBytes(c.bytesDown), fmtMs(c.clientBuildMs), fmtMs(c.serverMultiplyMs), fmtMs(c.clientDecodeMs), fmtBytes(c.peakRssBytes), group(c.recordsChecked)]);
        }),
      ),
      "",
    );
  }

  out.push("## The scan by thread count", "");
  if (r.scanSweep.length === 0) out.push("Not measured.", "");
  else {
    out.push(`The snapshot's scan file (${group(r.scanSweep[0]!.entries)} outputs) with ${r.wallets[0]!.label}'s key, after a warm-up of every thread.`, "");
    out.push(
      table(
        ["Threads", "Duration", "µs per output", "µs per output per thread", "Peak"],
        r.scanSweep.map((x) => [String(x.threads), fmtMs(x.ms), fmtMicros(x.microsPerOutput), fmtMicros(x.microsPerOutputPerThread), fmtBytes(x.peakRssBytes)]),
      ),
      "",
    );
  }

  out.push("## What the server observes (FR-154)", "");
  out.push(
    "Each request of each wallet's sync as the client sent it, with the line the module logged for it (route, status, body and answer lengths, `Range`, milliseconds; never a body). " +
      "This is everything a sync shows the server, beside the client's network address and the requests' timing.",
    "",
  );
  out.push(
    r.requestShapesIdentical === null
      ? "One wallet only: no comparison of request shapes."
      : r.requestShapesIdentical
        ? `The sequences of method, path and body length are **identical** for ${walletNames} (FR-142), whatever coins each holds.`
        : `**The sequences of method, path and body length differ** between ${walletNames}.`,
    "",
  );
  for (const w of r.wallets) {
    out.push(`### ${w.label}: ${w.requests.length} requests, ${w.coins.found} coins found (${w.coins.unspent} unspent), ${w.scanMatches} scan matches, ${w.coins.rejected} rejected`, "");
    out.push(
      table(
        ["#", "Request", "Status", "Body", "Answer", "Range", "Server", "Client"],
        w.requests.map((q, i) => [
          String(i + 1),
          `\`${q.method} ${q.route}\``,
          String(q.status),
          fmtBytes(q.bodyBytes),
          fmtBytes(q.answerBytes),
          q.server?.range ?? "—",
          q.server === null ? "no line" : fmtMs(q.server.ms),
          fmtMs(q.clientMs),
        ]),
      ),
      "",
    );
  }
  const routes = new Map<string, { calls: number; body: number; answer: number; ms: number; logged: number }>();
  for (const w of r.wallets) {
    for (const q of w.requests) {
      const key = `${q.method} ${q.route}`;
      const x = routes.get(key) ?? { calls: 0, body: 0, answer: 0, ms: 0, logged: 0 };
      x.calls++;
      x.body += q.bodyBytes;
      x.answer += q.answerBytes;
      if (q.server !== null) {
        x.ms += q.server.ms;
        x.logged++;
      }
      routes.set(key, x);
    }
  }
  out.push("All wallets together:", "");
  out.push(
    table(
      ["Route", "Calls", "Bodies", "Answers", "Server time"],
      [...routes.entries()].map(([k, x]) => [`\`${k}\``, String(x.calls), fmtBytes(x.body), fmtBytes(x.answer), x.logged === x.calls ? fmtMs(x.ms) : `${fmtMs(x.ms)} (${x.logged} of ${x.calls} logged)`]),
    ),
    "",
  );
  out.push(
    `A wallet sends one call to each table for every ${s.queriesPerCall} distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.`,
    "",
  );

  out.push("## Chain sync", "");
  const cs = r.chainSync;
  if (cs.database !== null) {
    out.push(`Database: ${fmtBytes(cs.database.bytes)} at cursor ${cs.cursor === null ? "?" : group(cs.cursor)}${cs.modules === null ? "" : `; the process runs ${cs.modules.join(", ")}`}.`, "");
    out.push(table(["Schema", "Size"], cs.database.schemas.map((x) => [`\`${x.schema}\``, fmtBytes(x.bytes)])), "");
  }
  if (cs.rate !== null) {
    out.push(
      `Speed: ${fmtRate(cs.rate.heightsPerSecond)} heights per second over ${group(cs.rate.heights)} heights (${group(cs.rate.fromHeight)} → ${group(cs.rate.toHeight)}) in ${fmtMs(cs.rate.seconds * 1000)} of syncing, from ${group(cs.rate.samples)} status samples` +
        `${cs.runs === null ? "" : ` over ${cs.runs} run${cs.runs === 1 ? "" : "s"}`}; ${cs.rate.gaps} gap${cs.rate.gaps === 1 ? "" : "s"} (stops) left out.`,
      "",
    );
    out.push(table(["Heights", "Heights/s", "Time"], cs.rate.windows.map((x) => [`${group(x.fromHeight)} – ${group(x.toHeight)}`, fmtRate(x.heightsPerSecond), fmtMs(x.seconds * 1000)])), "");
  }
  if (cs.database === null && cs.rate === null) out.push("Not measured.", "");

  out.push("## Transfer", "");
  const t = r.transfer;
  if (t === null) out.push("Not run: no transfer record was given (`--transfer <record written by send>`).", "");
  else {
    const tm = t.timings;
    out.push(
      `From ${t.source}${t.wallet === null ? "" : ` (wallet ${t.wallet})`}: ${t.submitted ? `finalized in block ${t.block === null ? "?" : group(t.block)}, transaction \`${t.txHash}\`` : t.txHash === null ? "a dry run (nothing proved or submitted)" : "proved and validated, not submitted"}.`,
      "",
    );
    out.push(
      table(
        ["Step", "Time"],
        [
          ["Fee wallet sync (wallet SDK, Dust)", fmtMs(tm.feeWalletSyncMs)],
          ["Sync (this client)", fmtMs(tm.syncMs)],
          ["Path build", fmtMs(tm.pathMs)],
          ["One-use state build", fmtMs(tm.stateMs)],
          ["Spend", fmtMs(tm.spendMs)],
          ["Dust balancing", fmtMs(tm.balanceMs)],
          ["Proving (and binding)", fmtMs(tm.proveMs)],
          ["Validation", fmtMs(tm.validateMs)],
          ["Submission to in block", fmtMs(tm.toInBlockMs)],
          ["Submission to finality", fmtMs(tm.toFinalizedMs)],
        ],
      ),
      "",
      `Unproven transaction ${fmtBytes(t.unprovenBytes)}; submitted ${fmtBytes(t.bytesSubmitted)}; client peak ${fmtBytes(t.peakRssBytes)}.`,
      "",
    );
  }

  out.push("## Server build steps", "");
  const b = r.serverBuild;
  if (b === null) out.push("Not measured.", "");
  else {
    out.push(`From ${b.source}; total ${fmtMs(b.totalMs)}.`, "");
    out.push(
      table(
        ["Step", "Duration", "Size", "Peak"],
        BUILD_STEP_NAMES.map((name) => {
          const x = b.steps[name];
          return [name, fmtMs(x?.ms), x?.bytes === undefined ? "—" : fmtBytes(x.bytes), fmtBytes(x?.peakRssBytes)];
        }),
      ),
      "",
    );
    if (b.indexLoad !== null) {
      out.push(
        b.indexLoad.height < 0
          ? "The module started on an empty database (no stored events to load)."
          : `The module's load of the stored events at start: ${plural(b.indexLoad.rows, "row")} up to height ${group(b.indexLoad.height)} in ${fmtMs(b.indexLoad.ms)} (peak ${fmtBytes(b.indexLoad.peakRssBytes)}).`,
        "",
      );
    }
    if (b.indexSlice !== null) out.push(`The build's read of its in-memory index at the snapshot height: ${plural(b.indexSlice.rows, "row")} in ${fmtMs(b.indexSlice.ms)}.`, "");
  }

  out.push("## Notes", "");
  const notes = [
    "Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.",
    "\"Per call\" values are a sync's totals divided by its calls.",
    "The server's time for a query route is what it logged for the request: the body decoded, the multiplication, the answer encoded.",
    "Results hold wallet labels and counts only: no keys, positions, values or nullifiers.",
    ...r.notes,
  ];
  for (const note of notes) out.push(`- ${note}`);
  out.push("");
  return out.join("\n");
}
