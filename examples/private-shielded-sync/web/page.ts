/**
 * The page: one card per step, each sending one message to the client's worker (`./worker.ts`) and showing what came
 * back: the main facts, then the whole answer as debug JSON. The right-hand panel lists every request the server saw.
 */

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
worker.onmessage = (event: MessageEvent<Answer>) => {
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
const kb = (n: number): string => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);
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
    const rt = m.readTable as Json;
    const nt = m.nullifierTable as Json;
    const downloads = r.downloads as Json[];
    return (
      facts([
        ["snapshot", `${short(String(r.snapshotId), 24)} at height ${m.height}`],
        ["outputs (first_free)", String(m.firstFree)],
        ["tree root", short(String(m.root), 24)],
        ["path split k", `${m.pathSplit} (blocks of ${2 ** Number(m.pathSplit)} outputs; ${m.blocks} block root(s))`],
        ["read table", `${rt.rows} × ${rt.cols} cells, ${rt.recordsPerColumn} records per column`],
        ["nullifier table", `${nt.rows} × ${nt.cols} cells, ${nt.bucketBits} bucket bits, capacity ${nt.capacity}`],
        ["vectors per call", String(m.queriesPerCall)],
        ["checks", checksHtml(r.checks)],
        ["time", `${r.ms} ms (setup matrices ${r.setupMatricesMs} ms)`],
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
        ["time", `${r.ms} ms, ${r.usPerEntry} µs per entry`],
        ["note", String(r.note)],
      ]) + (matches.length === 0 ? "" : table(["position", "scan entry (point ‖ 4 bytes of element 0)"], matches.map((m) => [String(m.position), esc(String(m.entry))])))
    );
  },
  read: (r) => {
    const calls = r.calls as Json[];
    const s = r.stats as Json;
    const records = r.records as Json[];
    return (
      facts([
        ["positions", (r.positions as number[]).join(", ") || "none: one padded call is still sent"],
        ["calls", calls.map((c) => `call ${c.call}: ${c.vectors} vectors, real columns [${(c.realColumns as number[]).join(", ")}], ${c.paddingColumns} random`).join("; ")],
        ["bytes", `${kb(Number(s.bytesUp))} up, ${kb(Number(s.bytesDown))} down`],
        ["time", `build ${s.buildMs} ms, round trip ${s.roundTripMs} ms, decode ${s.decodeMs} ms`],
      ]) +
      table(
        ["position", "commitment", "ciphertext (elements 1–5)", "lower path", "wallet's?", "database (debug)"],
        records.map((x) => {
          const db = x.database as Json | undefined;
          return [
            `${x.position}<br><small>col ${x.column}, slot ${x.slotInColumn}</small>`,
            esc(short(String(x.commitment), 24)),
            x.ciphertextElements1to5 === null ? "none (output carries no ciphertext)" : esc(short(String(x.ciphertextElements1to5), 24)),
            Array.isArray(x.lowerPath) ? `${(x.lowerPath as unknown[]).length} hashes, ${esc(String(x.lowerPathCheck))}` : esc(String(x.lowerPath)),
            x.ownership === undefined ? "derive keys to check" : x.coin ? `<span class="good">${esc(String(x.ownership))}</span><br>${esc(JSON.stringify(x.coin))}` : esc(String(x.ownership)),
            db === undefined ? "—" : `${mark(Boolean(db.equal), db.equal ? "equals the stored output" : "differs from the stored output")}<br><small>height ${db.height}, tx ${db.txIndex}, ${db.evidence}</small>`,
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
        ["calls", calls.map((c) => `call ${c.call}: ${c.vectors} vectors, real buckets [${(c.realBuckets as number[]).join(", ")}], ${c.paddingBuckets} random`).join("; ")],
        ["bytes", `${kb(Number(s.bytesUp))} up, ${kb(Number(s.bytesDown))} down`],
        ["time", `build ${s.buildMs} ms, round trip ${s.roundTripMs} ms, decode ${s.decodeMs} ms`],
        ["note", r.note === undefined ? undefined : String(r.note)],
      ]) + table(["nullifier", "bucket", "whose", "result"], (r.results as Json[]).map((x) => [esc(short(String(x.nullifier), 24)), String(x.bucket), esc(String(x.of)), esc(String(x.result))]))
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
VIEWS.generate = VIEWS.keys!;
VIEWS.snapshot = (r) => facts([["answer", JSON.stringify(r).slice(0, 400)]]);

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
  nullifiers: () => ({ nullifiers: $<HTMLTextAreaElement>("#nullifiers").value.split(/\s+/).filter(Boolean) }),
};
const STEP_OF: Record<string, string> = { generate: "keys" };
let snapshotHeight: number | null = null;
let firstFree = 0;

async function run(button: HTMLButtonElement): Promise<void> {
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
  if (name === "snapshot") answer = await buildSnapshot(progress);
  else answer = await call(STEP_OF[name] ?? name, args, progress);
  card.querySelectorAll("button").forEach((b) => (b.disabled = false));
  if (answer.ok) {
    status.className = "status ok";
    status.textContent = `done in ${answer.ms} ms`;
    out.innerHTML = (VIEWS[name]?.(answer.result!) ?? "") + `<details><summary>debug: the step's whole answer</summary><pre>${esc(abbreviated(answer.result))}</pre></details>`;
    if (name === "load") {
      const d = (answer.result!.debugEndpoints ?? null) as Json | null;
      if (d?.snapshotBuilds) $<HTMLButtonElement>('[data-run="snapshot"]').hidden = false;
    }
    if (name === "files") {
      snapshotHeight = Number((answer.result!.manifest as Json).height);
      firstFree = Number((answer.result!.manifest as Json).firstFree);
    }
  } else {
    status.className = "status bad";
    status.textContent = "failed";
    out.innerHTML = `<div class="error">${esc(answer.error ?? "failed")}</div>`;
  }
}

/** Debug: a snapshot at the module's indexed height through the page's server (which holds the admin secret). */
async function buildSnapshot(progress: (t: string) => void): Promise<Answer> {
  const t = performance.now();
  const started = await fetch("/debug/snapshot", { method: "POST" });
  const body = (await started.json()) as Json;
  if (started.status !== 202) return { id: 0, ok: false, error: `${started.status}: ${JSON.stringify(body)}` };
  const height = Number((body.building as Json).height);
  for (;;) {
    await new Promise((r) => setTimeout(r, 500));
    const s = (await (await fetch("/debug/snapshot")).json()) as Json;
    progress(`building a snapshot at ${height}…`);
    if (s.building !== null) continue;
    const last = s.last as Json | null;
    const ms = Math.round(performance.now() - t);
    if (last?.height !== height || !last.ok) return { id: 0, ok: false, error: `the build failed: ${JSON.stringify(last)}`, ms };
    return { id: 0, ok: true, result: { built: `a snapshot at height ${height}`, previousSnapshot: snapshotHeight, next: "press Get files to use it", last }, ms };
  }
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
});
void run($<HTMLButtonElement>('[data-run="load"]'));
