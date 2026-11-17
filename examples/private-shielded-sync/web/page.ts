/**
 * The page, in two tabs over one worker (`./worker.ts`) and one wallet:
 *
 * - **Wallet** (opens first): the mnemonic and Sync, which runs the worker's `walletSync` (`./wallet-sync.ts`): the
 *   keys, the shielded sync and the Dust sync in order, the step in progress shown; then the balances
 *   (`./wallet-view.ts`) and what the sync cost. The Details tab's cards of the steps it ran are filled with their
 *   answers, and its request list with its requests.
 * - **Details**: one card per step, each sending one message to the worker and showing what came back: the main facts,
 *   then the whole answer as debug JSON. The right-hand panel lists every request the server saw. Sizes, shapes and
 *   calls are worded for the snapshot's PIR scheme (`./scheme-view.ts`, spec 00058 FR-060).
 *
 * The mnemonic field is one element, shown in the tab in view; a wallet derived or generated in Details is the Wallet
 * tab's too. Tabs follow the ARIA tabs pattern: arrow keys, Home and End move between them.
 */

import { serveCallWorkers } from "./call-workers.ts";
import { dustBytes, dustChainRows, dustSpendRows } from "./dust-view.ts";
import { callText, cellText, kb, pathTableText, tableText } from "./scheme-view.ts";
import type { WalletSyncResult } from "./wallet-sync.ts";
import { walletBalancesHtml, walletCostHtml, walletFailureHtml } from "./wallet-view.ts";
import type { SchemeName } from "../pir/scheme.ts";

type Json = Record<string, unknown>;
interface Answer {
  id: number;
  ok?: boolean;
  result?: Json;
  error?: string;
  progress?: string;
  ms?: number;
  requests?: { id: number; method: string; path: string; bodyBytes: number; status: number; answerBytes: number; ms: number }[];
}

const worker = new Worker("worker.js", { type: "module" });
let nextId = 1;
const waiting = new Map<number, { resolve: (a: Answer) => void; progress: (t: string) => void }>();
/** Starts the Web Workers the client spreads a call's work over, when it asks for them. */
const startCallWorker = serveCallWorkers(worker);
worker.onmessage = (event: MessageEvent<Answer>) => {
  if (startCallWorker(event.data)) return;
  const a = event.data;
  const w = waiting.get(a.id);
  if (w === undefined) return;
  if (a.progress !== undefined) return w.progress(a.progress);
  waiting.delete(a.id);
  addRequests(a.requests ?? []);
  w.resolve(a);
};
const call = (step: string, args: Json, progress: (t: string) => void): Promise<Answer> =>
  new Promise((resolve) => {
    const id = nextId++;
    waiting.set(id, { resolve, progress });
    worker.postMessage({ id, step, args });
  });

// ── formatting ──────────────────────────────────────────────────────────────────────────────────────────────────

const $ = <T extends HTMLElement>(sel: string, root: ParentNode = document): T => root.querySelector(sel) as T;
const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const short = (s: string, keep = 40): string => (s.length > keep + 16 ? `${s.slice(0, keep)}…${s.slice(-10)}` : s);
const abbreviated = (v: unknown): string =>
  JSON.stringify(v, (_k, x) => (typeof x === "string" && x.length > 120 ? `${x.slice(0, 64)}…${x.slice(-12)} (${x.length} chars)` : x), 2);

function facts(rows: [string, unknown][]): string {
  return `<dl class="facts">${rows
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${typeof v === "string" && v.startsWith("<") ? v : esc(String(v))}</dd>`)
    .join("")}</dl>`;
}
const mark = (ok: boolean, text: string): string => `<span class="${ok ? "good" : "badtxt"}">${ok ? "✓" : "✗"} ${esc(text)}</span>`;
const checksHtml = (checks: unknown): string =>
  Array.isArray(checks) ? checks.map((c) => mark(!/DIFFER|NO$|NOT|FAILED/.test(String(c)), String(c))).join("<br>") : "";

function table(head: string[], rows: string[][]): string {
  return `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td class="mono">${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

const totals = { requests: 0, up: 0, down: 0 };
function addRequests(list: NonNullable<Answer["requests"]>): void {
  const body = $("#requests");
  for (const r of list) {
    totals.requests++;
    totals.up += r.bodyBytes;
    totals.down += r.answerBytes;
    const tr = document.createElement("tr");
    tr.dataset.exchange = String(r.id);
    tr.title = "show the whole request and answer";
    const path = r.path.replace("/pss/v1", "").replace(/\/blob\/([0-9a-f]{12})[0-9a-f]+/, "/blob/$1…");
    tr.innerHTML = `<td class="mono">${esc(`${r.method} ${path}`)}${r.status >= 400 ? ` <span class="badtxt">${r.status}</span>` : ""}</td><td>${kb(r.bodyBytes)}</td><td>${kb(r.answerBytes)}</td><td>${r.ms.toFixed(1)}</td>`;
    body.appendChild(tr);
  }
  $("#totals").innerHTML = facts([
    ["requests", totals.requests],
    ["bytes up", kb(totals.up)],
    ["bytes down", kb(totals.down)],
  ]).replace(/^<dl class="facts">|<\/dl>$/g, "");
}

// ── what each step shows ────────────────────────────────────────────────────────────────────────────────────────

const VIEWS: Record<string, (r: Json) => string> = {
  load: (r) => {
    const k = r.kernel as Json;
    const l = r.ledger as Json;
    const d = r.debugEndpoints as Json | null;
    return facts([
      ["scan kernel", `${kb(Number(k.bytes))}, SHA-256 ${short(String(k.sha256), 16)} (committed), ${k.ms} ms`],
      ["ledger", `${l.package}, ${kb(Number(l.bytes))}, ${l.ms} ms`],
      ["WebGPU", r.webgpu ? "available" : "not available in this browser"],
      ["server", String(r.server)],
      ["debug routes", d === null ? "none (start serve.ts with --db-url to compare with the database)" : `database ${d.database ? `on (cursor ${String(d.cursor)})` : "off"}, snapshot builds ${d.snapshotBuilds ? "on" : "off"}`],
    ]);
  },
  keys: (r) =>
    facts([
      ["derived from", String(r.source)],
      ["shielded address", String(r.shieldedAddress)],
      ["coin public key", String(r.coinPublicKey)],
      ["encryption public key", String(r.encryptionPublicKey)],
      ["scan secret", String(r.scanSecret)],
      ["checks", checksHtml(r.checks)],
      ["time", `${r.ms} ms`],
    ]) + (r.generatedMnemonic ? `<div class="warnbox">New test wallet. Its mnemonic (keep it to reuse the wallet):<br><code>${esc(String(r.generatedMnemonic))}</code></div>` : ""),
  files: (r) => {
    const m = r.manifest as Json;
    const s = m.scheme as SchemeName;
    const downloads = r.downloads as Json[];
    const w = r.ipirWasm as Json | undefined;
    const ipir = s === "ipir-sp";
    return (
      facts([
        ["snapshot", `${short(String(r.snapshotId), 24)} at height ${m.height}`],
        ["PIR scheme", ipir ? "IPIR+SP: the wallet downloads two masks per table, and every request carries its own key" : undefined],
        ["outputs (first_free)", String(m.firstFree)],
        ["table size (debug)", m.padding ? `padded to ${Number(m.padding).toLocaleString("en-US")} entries: the outputs spread among noise in the scan file and ${ipir ? "the tables" : "both tables"}` : undefined],
        ["tree root", short(String(m.root), 24)],
        ["path split k", `${m.pathSplit} (blocks of ${2 ** Number(m.pathSplit)} outputs; ${m.blocks} block root(s))`],
        ["read table", tableText(s, "read", m.readTable as Json)],
        ["path table", m.pathTable ? tableText(s, "path", m.pathTable as Json) : "none (path split 0)"],
        ["nullifier table", tableText(s, "nullifier", m.nullifierTable as Json)],
        [ipir ? "requests per call" : "vectors per call", String(m.queriesPerCall)],
        ["wallet's WebAssembly", w === undefined ? undefined : `pss-ipir.wasm, ${kb(Number(w.bytes))}, SHA-256 ${short(String(w.sha256), 16)} (committed), fetched and compiled in ${w.ms} ms (once per page); a call's requests are made on ${Number(w.threads) > 1 ? `${w.threads} worker threads, each with its own instance` : "one thread"}`],
        ["checks", checksHtml(r.checks)],
        ["time", ipir ? `${r.ms} ms (tables opened ${r.openTablesMs} ms)` : `${r.ms} ms (setup matrices ${r.setupMatricesMs} ms)`],
      ]) + table(["file", "size", "ms", "SHA-256"], downloads.map((d) => [esc(String(d.name)), kb(Number(d.bytes)), String(d.ms), esc(String(d.sha256))]))
    );
  },
  scan: (r) => {
    const matches = r.matches as Json[];
    return (
      facts([
        ["engine", String(r.engine)],
        ["entries tested", String(r.entries)],
        ["matches", matches.length === 0 ? "none (no output in this snapshot is the wallet's)" : String(matches.length)],
        ["matches in the padding", Array.isArray(r.noiseMatches) ? `${(r.noiseMatches as number[]).join(", ")} (noise slots, dropped)` : undefined],
        ["time", `${r.ms} ms, ${r.usPerEntry} µs per entry`],
        ["note", String(r.note)],
      ]) + (matches.length === 0 ? "" : table(["position", "scan entry (point ‖ 4 bytes of element 0)"], matches.map((m) => [`${m.position}${m.slot !== m.position ? `<br><small>slot ${m.slot}</small>` : ""}`, esc(String(m.entry))])))
    );
  },
  read: (r) => {
    const calls = r.calls as Json[];
    const s = r.stats as Json;
    const records = r.records as Json[];
    return (
      facts([
        ["positions", (r.positions as number[]).join(", ") || "none: one padded call is still sent"],
        ["calls", calls.map(callText).join("; ")],
        ["bytes", `${kb(Number(s.bytesUp))} up, ${kb(Number(s.bytesDown))} down`],
        ["time", `build ${s.buildMs} ms, round trip ${s.roundTripMs} ms, decode ${s.decodeMs} ms`],
      ]) +
      table(
        ["position", "commitment, first 16 bytes", "elements 1–5, shrunk (82 bytes)", "wallet's?", "database (debug)"],
        records.map((x) => {
          const elements = x.elementsShrunk === null ? "" : String(x.elementsShrunk);
          return [
            `${x.position}<br><small>${x.tableIndex === undefined ? "" : `table index ${x.tableIndex}, `}${cellText(x)}</small>`,
            esc(String(x.commitmentPrefix)),
            x.elementsShrunk === null ? "none (output carries no ciphertext)" : esc(short(String(x.elementsShrunk), 24)),
            x.ownership === undefined ? "derive keys to check" : x.coin ? `<span class="good">${esc(String(x.ownership))}</span><br>${esc(JSON.stringify(x.coin))}` : esc(String(x.ownership)),
            databaseRoutes
              ? `<button class="secondary small" data-compare="${x.position}" data-commitment="${esc(String(x.commitmentPrefix))}" data-elements="${esc(elements)}">Compare</button>`
              : "—",
          ];
        }),
      )
    );
  },
  nullifiers: (r) => {
    const calls = r.calls as Json[];
    const s = r.stats as Json;
    return (
      facts([
        ["lookups", String(r.lookups)],
        ["calls", calls.map(callText).join("; ")],
        ["bytes", `${kb(Number(s.bytesUp))} up, ${kb(Number(s.bytesDown))} down`],
        ["time", `build ${s.buildMs} ms, round trip ${s.roundTripMs} ms, decode ${s.decodeMs} ms`],
        ["note", r.note === undefined ? undefined : String(r.note)],
      ]) + table(["nullifier", "bucket", "whose", "result"], (r.results as Json[]).map((x) => [esc(short(String(x.nullifier), 24)), String(x.bucket), esc(String(x.of)), esc(String(x.result))]))
    );
  },
  paths: (r) => {
    const calls = r.calls as Json[];
    const s = r.stats as Json;
    const d = r.download as Json | null;
    const t = r.table as Json;
    const sch = (r.scheme ?? "simplepir") as SchemeName;
    return (
      facts([
        ["positions", (r.positions as number[]).join(", ")],
        ["path table", pathTableText(sch, t)],
        [sch === "simplepir" ? "setup data" : "masks", d === null ? "already downloaded for this snapshot" : `${kb(Number(d.bytes))} downloaded in ${d.ms} ms (once per snapshot, only to spend)`],
        ["calls", calls.length === 0 ? "none: no position in a full block" : calls.map(callText).join("; ")],
        ["bytes", `${kb(Number(s.bytesUp))} up, ${kb(Number(s.bytesDown))} down`],
        ["time", `build ${s.buildMs} ms, round trip ${s.roundTripMs} ms, decode ${s.decodeMs} ms`],
      ]) +
      table(["position", "lower path", "check"], (r.records as Json[]).map((x) => [
        `${x.position}${x.column === undefined && x.row === undefined ? "" : `<br><small>${cellText(x)}</small>`}`,
        Array.isArray(x.lowerPath) ? `${(x.lowerPath as unknown[]).length} hashes: ${esc(short(String((x.lowerPath as string[])[0]), 16))} …` : "—",
        mark(!/FAILED|NOT/.test(String(x.result)), String(x.result)),
      ]))
    );
  },
  tail: (r) => {
    const h = r.header as Json;
    const paths = r.paths;
    return (
      facts([
        ["tail height", `${h.height} (first_free ${h.firstFree})`],
        ["tail root", short(String(h.root), 24)],
        ["size", `${kb(Number(r.bytes))}: ${r.outputs} new output(s), ${r.nullifiers} spend(s)`],
        ["checks", checksHtml(r.checks)],
        ["wallet's coins in the tail", Array.isArray(r.walletCoinsInTail) ? (r.walletCoinsInTail.length === 0 ? "none" : JSON.stringify(r.walletCoinsInTail)) : String(r.walletCoinsInTail)],
        ["time", `fetch ${r.fetchMs} ms, client ${r.clientMs} ms`],
      ]) + (Array.isArray(paths) ? table(["position", "full path", "ms"], paths.map((p: Json) => [String(p.position), mark(!String(p.result).startsWith("FAILED"), String(p.result)), String(p.ms ?? "")])) : `<div class="note">${esc(String(paths))}</div>`)
    );
  },
  summary: (r) => {
    const coins = r.coins as Json[];
    const balance = r.unspentBalanceByTokenType as Record<string, string>;
    return (
      (coins.length === 0 ? `<div class="note">No coin found yet.</div>` : table(["position", "token type", "value", "nullifier", "spent"], coins.map((c) => [String(c.position), esc(short(String(c.tokenType), 16)), String(c.value), esc(short(String(c.nullifier), 16)), c.spent === null ? "no" : esc(JSON.stringify(c.spent))]))) +
      facts(Object.entries(balance).map(([t, v]) => [`balance ${short(t, 16)}`, v] as [string, unknown]))
    );
  },
};
VIEWS.dustFile = (r) => {
  const m = r.manifest as Json;
  const p = r.parameters as Json;
  const chunks = r.chunks as Json[];
  const firsts = r.firstCoins as Json[];
  return (
    facts([
      ["Dust file", `to height ${Number(m.height).toLocaleString("en-US")} (era from ${Number(m.eraHeight).toLocaleString("en-US")}), ${Number(m.entries).toLocaleString("en-US")} entries in ${m.chunks} chunks of ${m.chunkEntries}, ${m.prefixBytes}-byte prefixes`],
      ["chunks", `${r.chunksFromCache} from the page's cache, ${r.chunksDownloaded} downloaded (${kb(Number(r.chunkBytesDownloaded))})`],
      ["parameters", `${p.nightDustRatio} Specks per Star, decay ${p.generationDecayRate}, grace ${p.dustGracePeriodSeconds} s (${p.source === "initial" ? "the ledger's initial ones" : `changed at ${p.changedAt}`})`],
      ["Dust key", `…${r.keyEnds} (last digits; the key is a public key)`],
      ["first coins in the era", firsts.length === 0 ? "none" : firsts.map((f) => `height ${f.height}, position ${f.position}`).join("; ")],
      ["generation updates", String((r.updates as Json[]).length)],
      ["bytes", dustBytes(r.bytes as Json)],
      ["checks", checksHtml(r.checks)],
      ["note", String(r.note)],
      ["time", `${r.ms} ms`],
    ]) + table(["chunk", "entries", "heights", "size", "from", "ms"], chunks.map((c) => [String(c.n), `${c.first} … ${Number(c.first) + Number(c.count) - 1}`, `${c.firstHeight} … ${c.lastHeight}`, kb(Number(c.bytes)), c.cached ? "cache" : "server", String(c.ms)]))
  );
};
VIEWS.dustWalk = (r) =>
  facts([
    ["entries searched", Number(r.entries).toLocaleString("en-US")],
    ["chains", String((r.chains as Json[]).length)],
    ["note", String(r.note)],
    ["time", `${r.ms} ms`],
  ]) + dustChainRows(r.chains as Json[], false, null);
VIEWS.dustCheck = (r) => {
  const c = r.check as Json | null;
  const b = r.bytes as Json;
  const cb = b.check as Json;
  const batches = r.batches as Json[];
  const sch = (c?.scheme ?? "simplepir") as SchemeName;
  return (
    facts([
      ["check table", c === null ? `none served: ${String(r.checkUnavailable)}` : `${short(String(c.id), 16)}: ${SCHEME_NAME[sch] ?? sch}, height ${Number(c.height).toLocaleString("en-US")}, ${Number(c.commitments).toLocaleString("en-US")} commitments, ${c.groups} groups of ${c.perGroup}`],
      [sch === "simplepir" ? "setup data" : "masks", c === null ? undefined : `${kb(Number((c.publicArtifact as Json).bytes))}, ${(c.publicArtifact as Json).cached ? "from the page's cache" : "downloaded (once per check table)"}`],
      ["calls", c === null ? "none" : `${r.calls} call${r.calls === 1 ? "" : "s"} of ${c.queriesPerCall} requests: ${batches.map((x, i) => `call ${i + 1} reads ${x.readable} chain end(s)${(x.positions as number[]).length > Number(x.readable) ? ` (${(x.positions as number[]).length - Number(x.readable)} beyond the table)` : ""}, the rest random`).join("; ")}`],
      ["check bytes", `${kb(Number(cb.callsUp))} up, ${kb(Number(cb.callsDown))} down in the calls; manifest ${kb(Number(cb.manifest))} and ${sch === "simplepir" ? "setup data" : "masks"} ${kb(Number(cb.publicArtifact))} down`],
      ["Dust sync in all", dustBytes(b)],
      ["time", `${r.ms} ms`],
    ]) + dustChainRows(r.chains as Json[], true, c === null ? null : Number(c.commitments))
  );
};
VIEWS.dustSpend = (r) => facts(dustSpendRows(r));
VIEWS.generate = VIEWS.keys!;
const padded = (s: Json): string => (s.padding ? `, tables padded to ${Number(s.padding).toLocaleString("en-US")} entries` : "");
const SCHEME_NAME: Record<string, string> = { simplepir: "SimplePIR", "ipir-sp": "IPIR+SP" };
const schemeOf = (s: Json): string => (typeof s.scheme === "string" ? `, ${SCHEME_NAME[s.scheme] ?? s.scheme}` : "");
VIEWS.reload = (r) => {
  const now = r.snapshot as Json;
  const before = r.previous as Json | null;
  const steps = ((r.last as Json | undefined)?.steps ?? null) as Record<string, number> | null;
  return facts([
    ["new snapshot", `${short(String(now.id), 24)} at height ${now.height}, ${now.firstFree} outputs${schemeOf(now)}${padded(now)}`],
    ["previous", before === null ? "none" : `${short(String(before.id), 24)} at height ${before.height}, ${before.firstFree} outputs${schemeOf(before)}${padded(before)}`],
    ["build and wait", `${(Number(r.ms) / 1000).toFixed(1)} s`],
    ["build steps", steps === null ? undefined : Object.entries(steps).map(([k, ms]) => `${k} ${(ms / 1000).toFixed(1)} s`).join(", ")],
  ]);
};

// ── wiring ──────────────────────────────────────────────────────────────────────────────────────────────────────

function parsePositions(text: string): number[] {
  const out: number[] = [];
  for (const part of text.split(/[\s,;]+/).filter(Boolean)) {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (m === null) throw new Error(`not a position or range: ${part}`);
    const a = Number(m[1]);
    const b = m[2] === undefined ? a : Number(m[2]);
    for (let p = Math.min(a, b); p <= Math.max(a, b); p++) out.push(p);
    if (out.length > 512) throw new Error("at most 512 positions at a time");
  }
  return out;
}

const ARGS: Record<string, () => Json> = {
  keys: () => ({ mnemonic: $<HTMLTextAreaElement>("#mnemonic").value, seedHex: $<HTMLInputElement>("#seed").value }),
  generate: () => ({ generate: true }),
  scan: () => ({ gpu: $<HTMLInputElement>("#gpu").checked }),
  read: () => ({ positions: parsePositions($<HTMLInputElement>("#positions").value) }),
  paths: () => ({ positions: parsePositions($<HTMLInputElement>("#path-positions").value) }),
  nullifiers: () => ({ nullifiers: $<HTMLTextAreaElement>("#nullifiers").value.split(/\s+/).filter(Boolean) }),
};
const STEP_OF: Record<string, string> = { generate: "keys" };
let firstFree = 0;
/** Whether the page's server reads the database (`serve.ts --db-url`): the read rows then offer "Compare". */
let databaseRoutes = false;
/** Steps running now: one worker serves both tabs, so Sync waits for the Details steps and they for it. */
let running = 0;
const busy = (delta: number): void => {
  running += delta;
  $<HTMLButtonElement>("#wallet-sync").disabled = running > 0;
};

async function run(button: HTMLButtonElement): Promise<void> {
  busy(1);
  try {
    await runStep(button);
  } finally {
    busy(-1);
  }
}

async function runStep(button: HTMLButtonElement): Promise<void> {
  const name = button.dataset.run!;
  const card = button.closest("section")!;
  const status = $(".status", card);
  const out = $(".out", card);
  let args: Json;
  try {
    args = ARGS[name]?.() ?? {};
  } catch (error) {
    out.innerHTML = `<div class="error">${esc(String(error instanceof Error ? error.message : error))}</div>`;
    return;
  }
  card.querySelectorAll("button").forEach((b) => (b.disabled = true));
  status.className = "status run";
  status.textContent = "running…";
  out.innerHTML = `<div class="progress"></div>`;
  const progress = (t: string) => ($(".progress", out).textContent = t);
  let answer: Answer;
  if (name === "reload") return reload(card, status);
  answer = await call(STEP_OF[name] ?? name, args, progress);
  card.querySelectorAll("button").forEach((b) => (b.disabled = false));
  if (answer.ok) {
    status.className = "status ok";
    status.textContent = `done in ${answer.ms} ms`;
    out.innerHTML = (VIEWS[name]?.(answer.result!) ?? "") + `<details><summary>debug: the step's whole answer</summary><pre>${esc(abbreviated(answer.result))}</pre></details>`;
    if (name === "load") {
      const d = (answer.result!.debugEndpoints ?? null) as Json | null;
      if (d?.snapshotBuilds) $("#reload-row").hidden = false;
      databaseRoutes = Boolean(d?.database);
    }
    if (name === "files") {
      firstFree = Number((answer.result!.manifest as Json).firstFree);
    }
    // A wallet generated here is the Wallet tab's too.
    if (name === "generate" && typeof answer.result!.generatedMnemonic === "string") $<HTMLTextAreaElement>("#mnemonic").value = answer.result!.generatedMnemonic;
  } else {
    status.className = "status bad";
    status.textContent = "failed";
    out.innerHTML = `<div class="error">${esc(answer.error ?? "failed")}</div>`;
  }
}

/**
 * Debug: builds a new snapshot on the server (`POST /debug/reload-snapshot`, through the page's server, which holds
 * the admin secret), then gets its files. The later steps' answers belonged to the old snapshot, so they are cleared.
 */
async function reload(card: HTMLElement, status: HTMLElement): Promise<void> {
  const out = $(".reload-out", card);
  const text = $<HTMLInputElement>("#snapshot-height").value.trim();
  const padding = $<HTMLSelectElement>("#snapshot-padding").value;
  const scheme = $<HTMLSelectElement>("#snapshot-scheme").value;
  if (text !== "" && !/^\d+$/.test(text)) {
    out.innerHTML = `<div class="error">the height is a whole number</div>`;
    return;
  }
  card.querySelectorAll("button").forEach((b) => (b.disabled = true));
  status.className = "status run";
  status.textContent = "building a snapshot…";
  const kind = scheme === "" ? "a snapshot" : scheme === "ipir-sp" ? "an IPIR+SP snapshot" : `a ${SCHEME_NAME[scheme] ?? scheme} snapshot`;
  const what = `${kind} at ${text === "" ? "the synced height" : text}${padding === "" ? "" : `, padded to ${Number(padding).toLocaleString("en-US")} entries`}`;
  out.innerHTML = `<div class="progress">building ${what} and waiting for it…</div>`;
  // While the build runs, the server's status names the step in progress and the steps done (a padded build is long).
  const started = performance.now();
  const poll = setInterval(async () => {
    const s = (await fetch("/debug/snapshot").then((x) => x.json()).catch(() => null)) as Json | null;
    const b = s?.building as Json | null | undefined;
    if (!b) return;
    const done = Object.entries((b.done ?? {}) as Record<string, number>).map(([k, ms]) => `${k} ${(ms / 1000).toFixed(1)} s`);
    const now = b.step ? `${b.step} for ${((Date.now() - Date.parse(String(b.stepStartedAt))) / 1000).toFixed(0)} s` : "preparing";
    const p = $(".progress", out);
    if (p) p.textContent = `building ${what}: ${now}${done.length > 0 ? `; done: ${done.join(", ")}` : ""} (${((performance.now() - started) / 1000).toFixed(0)} s in all)`;
  }, 1000);
  let r: Response;
  let body: Json;
  try {
    const request: Json = { ...(text === "" ? {} : { height: Number(text) }), ...(padding === "" ? {} : { padding: Number(padding) }), ...(scheme === "" ? {} : { scheme }) };
    r = await fetch("/debug/reload-snapshot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
    body = (await r.json()) as Json;
  } catch (error) {
    r = new Response(null, { status: 502 });
    body = { error: String(error) };
  }
  clearInterval(poll);
  card.querySelectorAll("button").forEach((b) => (b.disabled = false));
  if (!r.ok) {
    status.className = "status bad";
    status.textContent = "reload failed";
    const e = body.error;
    const message = typeof e === "string" ? e : typeof (e as Json | undefined)?.message === "string" ? String((e as Json).message) : JSON.stringify(e ?? body);
    out.innerHTML = `<div class="error">${esc(message)}</div>`;
    return;
  }
  out.innerHTML = VIEWS.reload!(body) + `<details><summary>debug: the server's answer</summary><pre>${esc(abbreviated(body))}</pre></details>`;
  for (const id of ["#step-scan", "#step-read", "#step-nullifiers", "#step-paths", "#step-tail", "#step-summary"]) {
    const section = $(id);
    $(".out", section).innerHTML = `<div class="note">The snapshot changed: run this step again.</div>`;
    const s = $(".status", section);
    s.className = "status";
    s.textContent = "";
  }
  await run($<HTMLButtonElement>('[data-run="files"]'));
}

async function fill(button: HTMLButtonElement): Promise<void> {
  const what = button.dataset.fill!;
  if (what === "positions") {
    const n = firstFree;
    if (n === 0) return void ($("#step-read .out").innerHTML = `<div class="error">get the files first</div>`);
    const picks = new Set<number>();
    while (picks.size < Math.min(5, n)) picks.add(Math.floor(Math.random() * n));
    $<HTMLInputElement>("#positions").value = [...picks].sort((a, b) => a - b).join(", ");
  } else if (what === "random-nullifiers") {
    const lines = Array.from({ length: 3 }, () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join(""));
    const box = $<HTMLTextAreaElement>("#nullifiers");
    box.value = [box.value.trim(), ...lines].filter(Boolean).join("\n");
  } else if (what === "spends") {
    const a = await call("sampleSpends", { n: 5 }, () => {});
    if (!a.ok) return void ($("#step-nullifiers .out").innerHTML = `<div class="error">${esc(a.error ?? "")}</div>`);
    const spends = (a.result!.spends as Json[]).map((s) => String(s.nullifier));
    const box = $<HTMLTextAreaElement>("#nullifiers");
    box.value = [box.value.trim(), ...spends].filter(Boolean).join("\n");
  }
}

/**
 * Debug, one read row: reads the stored output at the row's position (`/debug/output`) and compares its commitment and
 * ciphertext elements 1–5 with what the PIR read returned. The cell then shows the result and the lookup's time.
 */
async function compare(button: HTMLButtonElement): Promise<void> {
  const cell = button.closest("td")!;
  const { compare: position, commitment, elements } = button.dataset;
  button.disabled = true;
  button.textContent = "comparing…";
  const t = performance.now();
  try {
    const r = await fetch(`/debug/output?position=${position}`);
    const db = (await r.json()) as Json;
    const ms = Math.round(performance.now() - t);
    if (!r.ok) throw new Error(String(db.error ?? r.status));
    // The record's form of the stored output: the commitment's first 16 bytes; of the ciphertext (point, elements 0–5,
    // 32 bytes each), element 1's first byte, element 2, element 3's first byte, element 4, element 5's first 16 bytes.
    const ct = db.ciphertext === null ? null : String(db.ciphertext);
    const dbElements = ct === null ? "" : ct.slice(128, 130) + ct.slice(192, 256) + ct.slice(256, 258) + ct.slice(320, 384) + ct.slice(384, 416);
    const equal = String(db.commitment).slice(0, 32) === commitment && dbElements === elements;
    cell.innerHTML = `${mark(equal, equal ? "equals the stored output" : "differs from the stored output")}<br><small>height ${db.height}, tx ${db.txIndex}, ${esc(String(db.evidence))}; lookup ${ms} ms</small>`;
  } catch (error) {
    button.disabled = false;
    button.textContent = "Compare";
    cell.querySelector(".error")?.remove();
    cell.insertAdjacentHTML("beforeend", `<div class="error">${esc(error instanceof Error ? error.message : String(error))}</div>`);
  }
}

// ── the Wallet tab ──────────────────────────────────────────────────────────────────────────────────────────────

/** The Details card of each step the Wallet sync runs. */
const CARD_OF: Record<string, string> = {
  keys: "#step-keys",
  files: "#step-files",
  scan: "#step-scan",
  read: "#step-read",
  nullifiers: "#step-nullifiers",
  tail: "#step-tail",
  summary: "#step-summary",
  dustFile: "#step-dust-file",
  dustWalk: "#step-dust-walk",
  dustCheck: "#step-dust-check",
};

/** Fills a Details card with what the Wallet sync's step did, as the card's own button would. */
function fillCard(step: WalletSyncResult["steps"][number]): void {
  const card = $(CARD_OF[step.name]!);
  const status = $(".status", card);
  const out = $(".out", card);
  if (step.ok) {
    status.className = "status ok";
    status.textContent = `done in ${step.ms} ms (by the Wallet tab's sync)`;
    out.innerHTML = (VIEWS[step.name]?.(step.answer!) ?? "") + `<details><summary>debug: the step's whole answer</summary><pre>${esc(abbreviated(step.answer))}</pre></details>`;
    if (step.name === "files") firstFree = Number((step.answer!.manifest as Json).firstFree);
  } else {
    status.className = "status bad";
    status.textContent = "failed (in the Wallet tab's sync)";
    out.innerHTML = `<div class="error">${esc(step.error ?? "failed")}</div>`;
  }
}

/** The loading of the client (step 0), which a sync waits for. */
let loaded: Promise<void> = Promise.resolve();

async function walletSync(): Promise<void> {
  const status = $("#wallet-status");
  const progress = $("#wallet-progress");
  const failure = $("#wallet-failure");
  busy(1);
  const steps = [...document.querySelectorAll<HTMLButtonElement>("#panel-details button[data-run]")];
  steps.forEach((b) => (b.disabled = true));
  status.className = "status run";
  status.textContent = "syncing…";
  failure.innerHTML = "";
  progress.textContent = "waiting for the client to load";
  try {
    await loaded;
    if ($("#step-load .status").classList.contains("bad")) throw new Error("the client did not load (Details, step 0)");
    progress.textContent = "starting";
    // The keys from the shared field (step 1's); the worker scans on the GPU where WebGPU starts, else on the CPU.
    const answer = await call("walletSync", ARGS.keys!(), (t) => (progress.textContent = t));
    if (!answer.ok) throw new Error(answer.error ?? "failed");
    const r = answer.result as unknown as WalletSyncResult;
    for (const s of r.steps) fillCard(s);
    $("#wallet-balances .out").innerHTML = walletBalancesHtml(r);
    $("#wallet-cost .out").innerHTML = walletCostHtml(r);
    failure.innerHTML = walletFailureHtml(r);
    status.className = r.ok ? "status ok" : "status bad";
    status.textContent = r.ok ? `synced in ${(r.cost.ms / 1000).toFixed(1)} s` : `failed at ${r.failed!.label}`;
    progress.textContent = "";
  } catch (error) {
    status.className = "status bad";
    status.textContent = "failed";
    progress.textContent = "";
    failure.innerHTML = `<div class="error">${esc(error instanceof Error ? error.message : String(error))}</div>`;
  } finally {
    steps.forEach((b) => (b.disabled = false));
    busy(-1);
  }
}

// ── the tabs ────────────────────────────────────────────────────────────────────────────────────────────────────

const TABS = ["wallet", "details"] as const;

/** Shows one tab: its panel in view, the other hidden (each keeps its state), the mnemonic field moved into it. */
function showTab(name: (typeof TABS)[number], focus = false): void {
  for (const t of TABS) {
    const tab = $<HTMLButtonElement>(`#tab-${t}`);
    const on = t === name;
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
    $(`#panel-${t}`).hidden = !on;
    if (on && focus) tab.focus();
  }
  $(`#mnemonic-slot-${name}`).appendChild($("#mnemonic"));
}

for (const t of TABS) {
  const tab = $<HTMLButtonElement>(`#tab-${t}`);
  tab.addEventListener("click", () => showTab(t));
  tab.addEventListener("keydown", (event) => {
    const at = TABS.indexOf(t);
    const to =
      event.key === "ArrowRight" ? TABS[(at + 1) % TABS.length] : event.key === "ArrowLeft" ? TABS[(at + TABS.length - 1) % TABS.length] : event.key === "Home" ? TABS[0] : event.key === "End" ? TABS[TABS.length - 1] : undefined;
    if (to === undefined) return;
    event.preventDefault();
    showTab(to, true);
  });
}
$("#wallet-sync").addEventListener("click", () => void walletSync());
showTab("wallet");

// ── one request, whole ──────────────────────────────────────────────────────────────────────────────────────────

const SHOW_ALL_LIMIT = 4 * 1024 * 1024;

function bodyHtml(id: number, side: "request" | "response", b: Json): string {
  const bytes = Number(b.bytes);
  if (bytes === 0) return `<div class="note">No body.</div>`;
  const shown = Number(b.shown);
  const parts = [
    facts([
      ["size", `${kb(bytes)} (${bytes} bytes)`],
      ["content type", String(b.contentType || "—")],
      ["SHA-256", String(b.sha256)],
    ]),
  ];
  if (b.decoded) parts.push(`<h4>Decoded</h4><pre>${esc(JSON.stringify(b.decoded, null, 2))}</pre>`);
  parts.push(`<h4>${b.text !== undefined ? "Body" : "Body (hex: offset, 16 bytes, ASCII)"}</h4><pre class="dump">${esc(String(b.text ?? b.hex))}</pre>`);
  const buttons = [`<button class="secondary" data-download="${id}:${side}">Download all ${kb(bytes)}</button>`];
  if (shown < bytes) {
    parts.push(`<div class="note">Showing the first ${kb(shown)} of ${kb(bytes)}.</div>`);
    if (bytes <= SHOW_ALL_LIMIT) buttons.unshift(`<button class="secondary" data-showall="${id}">Show all</button>`);
  }
  parts.push(`<div class="row">${buttons.join("")}</div>`);
  return parts.join("");
}

const headersHtml = (h: Record<string, string>): string =>
  Object.keys(h).length === 0 ? `<div class="note">None set by the client.</div>` : facts(Object.entries(h).map(([k, v]) => [k, v] as [string, unknown]));

async function openExchange(id: number, all = false): Promise<void> {
  const dialog = $<HTMLDialogElement>("#exchange");
  $(".head h3", dialog).textContent = `request ${id}: loading…`;
  $(".body", dialog).innerHTML = "";
  if (!dialog.open) dialog.showModal();
  const a = await call("exchange", { id, all }, () => {});
  if (!a.ok) {
    $(".body", dialog).innerHTML = `<div class="error">${esc(a.error ?? "failed")}</div>`;
    return;
  }
  const r = a.result!;
  $(".head h3", dialog).textContent = `#${r.id}  ${r.method} ${r.path}  →  ${r.status}  (${r.ms} ms, ${String(r.at).replace("T", " ").slice(0, 23)})`;
  $(".body", dialog).innerHTML =
    `<h4>Out: the request</h4>${headersHtml(r.requestHeaders as Record<string, string>)}${bodyHtml(id, "request", r.request as Json)}` +
    `<h4 style="margin-top: 22px">In: the answer</h4><div class="note">Headers as the page received them through its server (serve.ts adds cache-control and the two cross-origin headers; connection, date and transfer-encoding are the transport's). The body is the module's, byte for byte.</div>${headersHtml(r.responseHeaders as Record<string, string>)}${bodyHtml(id, "response", r.response as Json)}`;
}

async function download(spec: string): Promise<void> {
  const [id, side] = spec.split(":");
  const a = await call("exchangeBytes", { id: Number(id), side }, () => {});
  if (!a.ok) return;
  const url = URL.createObjectURL(new Blob([a.result!.bytes as ArrayBuffer], { type: "application/octet-stream" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = String(a.result!.name);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

document.addEventListener("click", (event) => {
  const el = event.target as HTMLElement;
  const row = el.closest<HTMLElement>("tr[data-exchange]");
  if (row !== null) return void openExchange(Number(row.dataset.exchange));
  const dialogButton = el.closest<HTMLButtonElement>("dialog button");
  if (dialogButton !== null) {
    if (dialogButton.dataset.close !== undefined) $<HTMLDialogElement>("#exchange").close();
    else if (dialogButton.dataset.showall) void openExchange(Number(dialogButton.dataset.showall), true);
    else if (dialogButton.dataset.download) void download(dialogButton.dataset.download);
    return;
  }
  const target = el.closest("button");
  if (target === null) return;
  if (target.dataset.run) void run(target);
  else if (target.dataset.fill) void fill(target);
  else if (target.dataset.compare) void compare(target);
});
loaded = run($<HTMLButtonElement>('[data-run="load"]'));
