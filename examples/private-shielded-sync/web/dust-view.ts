/**
 * What the step page shows of the Dust steps (spec 00062; `./dust-steps.ts` makes the answers), as HTML strings without
 * the DOM, so `test/server-web-dust.test.ts` renders them under Node: each chain as the command line prints it, and a
 * Dust sync's bytes split as the command line splits them. The page's own classes (`good`, `badtxt`, `status run`,
 * `note`, `mono`) style them.
 */

import { kb } from "./scheme-view.ts";

type Json = Record<string, unknown>;

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const short = (s: string, keep = 40): string => (s.length > keep + 16 ? `${s.slice(0, keep)}…${s.slice(-10)}` : s);
const mark = (ok: boolean, text: string): string => `<span class="${ok ? "good" : "badtxt"}">${ok ? "✓" : "✗"} ${esc(text)}</span>`;
const big = (v: unknown): string => BigInt(String(v)).toLocaleString("en-US");

function table(head: string[], rows: string[][]): string {
  return `<table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td class="mono">${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

/** A Dust chain, as the command line prints it (`../client/dust.ts` `dustChainSummary`). */
export function dustChainRows(chains: Json[], checked: boolean, commitments: number | null): string {
  if (chains.length === 0) return `<div class="note">This wallet has no first coin in the era: no Dust chain.</div>`;
  const status = (c: Json): string => {
    const coin = c.coin as Json;
    if (c.status === "checked") return mark(true, `checked: the record at position ${coin.position} is the last coin's commitment`);
    if (c.status === "not-checkable") return `<span class="status run">not checkable yet: the check table covers positions below ${commitments ?? "?"}</span>`;
    if (c.status === "no-spend") return esc("nothing to check: the first coin is public");
    return esc(checked ? "not checked (no check table)" : "not checked yet (step 11)");
  };
  return table(
    ["chain", "first coin", "spends found (file entries)", "check", "false matches dropped", "current coin"],
    chains.map((c, i) => {
      const coin = c.coin as Json;
      const dropped = c.droppedEntries as number[];
      return [
        String(i + 1),
        `height ${Number(c.firstCoinHeight).toLocaleString("en-US")}<br><small>generation index ${esc(String(c.generationIndex))}, ${big(c.nightValue)} Stars of Night${c.dtime === null ? "" : `, Night spent at ${esc(String(c.dtime))}`}</small>`,
        `${c.spends}${(c.entries as number[]).length === 0 ? "" : `<br><small>${(c.entries as number[]).join(", ")}</small>`}`,
        status(c),
        `${dropped.length}${dropped.length === 0 ? "" : `<br><small>entries ${dropped.join(", ")}</small>`}`,
        `seq ${coin.seq}, position ${coin.position}<br><small>created ${esc(String(coin.ctime))}<br>value at creation ${big(coin.valueAtCreation)} Specks<br>value now ${big(coin.valueNow)} Specks<br>commitment ${esc(short(String(coin.commitment), 18))}</small>`,
      ];
    }),
  );
}

/** The bytes of a Dust sync, split as the command line prints them (`../client/dust.ts` `dustTransfer`). */
export function dustBytes(b: Json): string {
  const c = b.check as Json;
  return `${kb(Number(b.down))} down in ${b.requests} requests (manifest ${kb(Number(b.manifest))}, chunks ${kb(Number(b.chunks))}, coins ${kb(Number(b.coins))}, parameters ${kb(Number(b.parameters))}, check ${kb(Number(c.manifest) + Number(c.publicArtifact) + Number(c.callsDown))}); ${kb(Number(b.up))} up`;
}

