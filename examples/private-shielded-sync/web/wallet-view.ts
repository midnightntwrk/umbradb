/**
 * What the Wallet tab shows of a sync (`./wallet-sync.ts`), as HTML strings without the DOM, so
 * `test/server-web-wallet.test.ts` renders them under Node: the balances (centre), the step that failed, and the cost
 * of the last sync (bottom). The page's own classes (`good`, `badtxt`, `note`, `error`, `mono`, `facts`) style them.
 *
 * The example knows no token's name, so a token is shown by its type, shortened. Balances are in base units, as the
 * command line's `balance` prints them; Dust in Specks, as its `dust` prints them.
 */

import { kb } from "./scheme-view.ts";
import type { WalletCost, WalletSyncResult } from "./wallet-sync.ts";

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const big = (v: string | bigint): string => BigInt(v).toLocaleString("en-US");
const shortType = (t: string): string => `${t.slice(0, 8)}…${t.slice(-4)}`;
const seconds = (ms: number): string => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${Math.round(ms)} ms`);

function table(head: string[], rows: string[][], foot?: string[]): string {
  return `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td class="mono">${c}</td>`).join("")}</tr>`)
    .join("")}</tbody>${foot === undefined ? "" : `<tfoot><tr>${foot.map((c) => `<td class="mono"><b>${c}</b></td>`).join("")}</tr></tfoot>`}</table>`;
}

/** The balances: shielded per token type, Dust per chain with the total. An empty wallet shows zeros. */
export function walletBalancesHtml(r: WalletSyncResult): string {
  const b = r.balances;
  const shielded =
    b.shielded === null
      ? `<div class="note">Not known: the shielded sync did not complete.</div>`
      : b.shielded.length === 0
        ? table(["token type", "balance", "coins"], [["none", "0", "0"]])
        : table(
            ["token type", "balance", "coins"],
            b.shielded.map((t) => [`<span title="${esc(t.tokenType)}">${esc(shortType(t.tokenType))}</span>`, big(t.balance), String(t.coins)]),
          );
  const dust =
    b.dust === null
      ? `<div class="note">Not known: the Dust sync did not complete.</div>`
      : table(
          ["chain", "value now (Specks)", "last coin"],
          b.dust.chains.length === 0
            ? [["none", "0", "no Dust chain in the era"]]
            : b.dust.chains.map((c) => [String(c.chain), big(c.valueNow), `<span class="${c.status === "checked" ? "good" : ""}">${esc(c.statusText)}</span><br><small>seq ${c.seq}, position ${esc(c.position)}</small>`]),
          ["total", big(b.dust.total), ""],
        );
  return `<h3>Shielded</h3>${shielded}<h3>Dust</h3>${dust}`;
}

/** The step that failed and its message, or nothing. */
export function walletFailureHtml(r: WalletSyncResult): string {
  if (r.failed === null) return "";
  const done = r.steps.filter((s) => s.ok).map((s) => s.label);
  return `<div class="error">${esc(`${r.failed.label} failed: ${r.failed.message}`)}</div><div class="note">${esc(done.length === 0 ? "No step completed." : `Completed before it: ${done.join(", ")}.`)}</div>`;
}

const costRow = (name: string, c: WalletCost): string[] => [esc(name), seconds(c.ms), seconds(c.computeMs), seconds(c.waitMs), kb(c.up), kb(c.down), String(c.requests)];

/** Which scan ran and its time: on the GPU, or on the CPU and why. */
export function walletScanText(r: WalletSyncResult): string {
  const s = r.scan;
  if (s === null) return "Scan: not run.";
  const n = s.entries.toLocaleString("en-US");
  if (s.gpu) return `Scan: on the GPU (WebGPU${s.device ? `, ${s.device}` : ""}), ${n} entries in ${seconds(s.ms)}.`;
  return `Scan: on the CPU (the WebAssembly kernel, one thread), ${n} entries in ${seconds(s.ms)}${s.fallback === null ? "." : `, because the GPU scan did not run: ${s.fallback}.`}`;
}

/** The last sync's cost: the totals in one line, which scan ran, then by part and by step. */
export function walletCostHtml(r: WalletSyncResult): string {
  const c = r.cost;
  const line = `Last sync: ${seconds(c.ms)} of processing (the wallet computing ${seconds(c.computeMs)}, waiting for the server ${seconds(c.waitMs)}); up ${kb(c.up)}, down ${kb(c.down)} in ${c.requests} requests.`;
  const scan = r.scan;
  const scanLine = `<div class="costline ${scan !== null && scan.fallback !== null ? "warn" : ""}" id="wallet-scan">${esc(walletScanText(r))}</div>`;
  const head = ["", "time", "computing", "waiting for the server", "up", "down", "requests"];
  const parts = table(head, [costRow("shielded (with the keys)", c.parts.shielded), costRow("Dust", c.parts.dust)], costRow("total", c));
  const steps = table(head, r.steps.map((s) => costRow(`${s.label}${s.ok ? "" : " (failed)"}`, s)));
  return `<div class="costline">${esc(line)}</div>${scanLine}${parts}<details><summary>by step</summary>${steps}</details>`;
}
