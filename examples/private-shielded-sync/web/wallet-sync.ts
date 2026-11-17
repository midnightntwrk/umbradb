/**
 * The Wallet tab's sync (phase 10), without the DOM: `./worker.ts` runs it for the page, and
 * `test/server-web-wallet.test.ts` runs it under Node. It runs, in order, what a wallet needs to know its balances,
 * each as the Details tab's step of the same name runs it (so the page fills those steps' cards with the answers):
 *
 * - the keys (step 1, from the mnemonic: the Zswap keys and the Dust key);
 * - the shielded sync: get the files (2), scan (3; on the GPU where the browser has WebGPU, else on the CPU), read the matches' records by PIR (4), look up their nullifiers by
 *   PIR (5), get the tail (7), the coins and balance (8);
 * - the Dust sync: get the file (9), walk the chains (10), check each chain's end by PIR (11).
 *
 * The path reads and the spend (steps 6 and 12) are not run: a wallet needs them only to spend. No debug route is asked.
 * The first step that fails stops the sync; its name and message are returned with every step that completed.
 *
 * **What it cost.** Each step's time is measured around it; its bytes and the time it waited for the server come from
 * the requests the client recorded during it (`PssHttp.records`: every request's body and answer length and its time
 * from sending to the answer's last byte). A step's requests are made one after the other, so its waiting time is
 * their sum and the rest of the step's time is the wallet's own computing. The cost is split by part: shielded (the
 * keys included) and Dust. A second sync on the same snapshot costs less: the files, the Dust chunks and the Dust check
 * table's public artifact the page holds are not downloaded again, and the opened tables are kept.
 */

import { dustStatusText } from "../client/dust.ts";
import type { PssHttp, RequestRecord } from "../client/http.ts";
import type { DustSteps } from "./dust-steps.ts";
import type { ScanEngine, ShieldedSteps } from "./shielded-steps.ts";

type Json = Record<string, unknown>;
const round = (x: number): number => Math.round(x * 100) / 100;

export type WalletSyncPart = "shielded" | "dust";

/** One step of the sync: its Details step's name and title, its part, and what runs it. */
export interface WalletSyncStep {
  readonly name: string;
  readonly label: string;
  readonly part: WalletSyncPart;
  readonly run: (progress: (text: string) => void) => Promise<Json> | Json;
}

/**
 * The sync's steps over the page's shielded and Dust steps, after `keys` (which derives the wallet's keys). The scan
 * runs on the GPU (the page's WebGPU scan) and, where the browser has no WebGPU or it does not start or fails, on the
 * CPU (the WebAssembly kernel, one thread), saying why: a GPU failure never fails the sync. `gpu: false` scans on the
 * CPU from the start.
 */
export function walletSyncSteps(o: { readonly keys: () => Promise<Json> | Json; readonly shielded: ShieldedSteps; readonly dust: DustSteps; readonly gpu?: boolean }): WalletSyncStep[] {
  return [
    { name: "keys", label: "Wallet keys", part: "shielded", run: () => o.keys() },
    { name: "files", label: "Get the files", part: "shielded", run: () => o.shielded.getFiles({ debug: false }) },
    { name: "scan", label: "Find my outputs (scan)", part: "shielded", run: (progress) => o.shielded.scan({ gpu: o.gpu ?? true, fallback: true }, progress) },
    { name: "read", label: "Fetch records by PIR", part: "shielded", run: () => o.shielded.read({}) },
    { name: "nullifiers", label: "Check nullifiers by PIR", part: "shielded", run: () => o.shielded.nullifiers({}) },
    { name: "tail", label: "Get the tail", part: "shielded", run: () => o.shielded.tail({ debug: false }) },
    { name: "summary", label: "Coins and balance", part: "shielded", run: () => o.shielded.summary() },
    { name: "dustFile", label: "Dust: get the file and my first coins", part: "dust", run: () => o.dust.getFile() },
    { name: "dustWalk", label: "Dust: walk my chains", part: "dust", run: () => o.dust.walk() },
    { name: "dustCheck", label: "Dust: check each chain by PIR", part: "dust", run: () => o.dust.check() },
  ];
}

/** What one step did and cost. */
export interface WalletSyncStepResult {
  readonly name: string;
  readonly label: string;
  readonly part: WalletSyncPart;
  readonly ok: boolean;
  /** The step's time, milliseconds. */
  readonly ms: number;
  /** Of it, waiting for the server (its requests' times) and the wallet's own computing (the rest). */
  readonly waitMs: number;
  readonly computeMs: number;
  readonly requests: number;
  /** Request bodies sent and answers received, bytes. */
  readonly up: number;
  readonly down: number;
  /** The step's answer (as the Details step shows it), or its error. */
  readonly answer?: Json;
  readonly error?: string;
}

/** Time and bytes of a set of steps. */
export interface WalletCost {
  readonly ms: number;
  readonly waitMs: number;
  readonly computeMs: number;
  readonly requests: number;
  readonly up: number;
  readonly down: number;
}

export interface ShieldedBalance {
  /** The token type, 32 bytes, hexadecimal. */
  readonly tokenType: string;
  /** The sum of its unspent coins, in the token's base units (as the command line's `balance` prints it). */
  readonly balance: string;
  readonly coins: number;
}

export interface DustChainBalance {
  /** 1, 2, … in the order the Dust steps list the chains. */
  readonly chain: number;
  /** The current coin's value now, in Specks. */
  readonly valueNow: string;
  readonly status: string;
  /** The check's outcome, as the command line words it. */
  readonly statusText: string;
  readonly seq: number;
  readonly position: string;
}

export interface WalletBalances {
  /** Null when the shielded sync did not complete. */
  readonly shielded: readonly ShieldedBalance[] | null;
  /** Null when the Dust sync did not complete. */
  readonly dust: { readonly chains: readonly DustChainBalance[]; readonly total: string; readonly checkTable: string | null } | null;
}

export interface WalletSyncResult {
  readonly ok: boolean;
  /** The step that failed and its message, or null. */
  readonly failed: { readonly step: string; readonly label: string; readonly message: string } | null;
  readonly steps: readonly WalletSyncStepResult[];
  readonly balances: WalletBalances;
  /** The whole sync, and by part. */
  readonly cost: WalletCost & { readonly parts: Readonly<Record<WalletSyncPart, WalletCost>> };
  /** Which scan ran (GPU, or CPU and why) and its time; null when the scan did not complete. */
  readonly scan: (ScanEngine & { readonly ms: number; readonly entries: number }) | null;
  readonly startedAt: string;
}

function costOf(steps: readonly WalletSyncStepResult[]): WalletCost {
  const sum = (k: "ms" | "waitMs" | "computeMs" | "requests" | "up" | "down"): number => steps.reduce((t, s) => t + s[k], 0);
  return { ms: round(sum("ms")), waitMs: round(sum("waitMs")), computeMs: round(sum("computeMs")), requests: sum("requests"), up: sum("up"), down: sum("down") };
}

/** The balances the completed steps give: the summary's unspent coins by token type, the Dust check's chains. */
export function balancesOf(steps: readonly WalletSyncStepResult[]): WalletBalances {
  const answer = (name: string): Json | undefined => steps.find((s) => s.name === name && s.ok)?.answer;
  const summary = answer("summary");
  let shielded: ShieldedBalance[] | null = null;
  if (summary !== undefined) {
    const byType = new Map<string, { balance: bigint; coins: number }>();
    for (const c of summary.coins as { tokenType: string; value: string; spent: unknown }[]) {
      if (c.spent !== null) continue;
      const t = byType.get(c.tokenType) ?? { balance: 0n, coins: 0 };
      byType.set(c.tokenType, { balance: t.balance + BigInt(c.value), coins: t.coins + 1 });
    }
    shielded = [...byType.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([tokenType, t]) => ({ tokenType, balance: t.balance.toString(), coins: t.coins }));
  }
  const check = answer("dustCheck");
  let dust: WalletBalances["dust"] = null;
  if (check !== undefined) {
    const table = check.check as { id: string; commitments: number } | null;
    const chains = (check.chains as { status: string; coin: { seq: number; position: string; valueNow: string } }[]).map((c, i) => ({
      chain: i + 1,
      valueNow: c.coin.valueNow,
      status: c.status,
      statusText: dustStatusText(c as never, table?.commitments ?? null),
      seq: c.coin.seq,
      position: c.coin.position,
    }));
    dust = { chains, total: chains.reduce((t, c) => t + BigInt(c.valueNow), 0n).toString(), checkTable: table?.id ?? null };
  }
  return { shielded, dust };
}

/** Runs `steps` in order, stopping at the first that fails; what each did and cost, the balances, the totals. */
export async function runWalletSync(steps: readonly WalletSyncStep[], o: { readonly http: PssHttp; readonly progress?: (text: string) => void }): Promise<WalletSyncResult> {
  const startedAt = new Date().toISOString();
  const done: WalletSyncStepResult[] = [];
  let failed: WalletSyncResult["failed"] = null;
  for (const [i, step] of steps.entries()) {
    const head = `step ${i + 1} of ${steps.length}: ${step.label}`;
    o.progress?.(head);
    const firstRecord = o.http.records.length;
    const started = performance.now();
    let answer: Json | undefined;
    let error: string | undefined;
    try {
      answer = await step.run((text) => o.progress?.(`${head}: ${text}`));
    } catch (cause) {
      error = cause instanceof Error ? `${cause.message}${cause.cause instanceof Error ? ` (${cause.cause.message})` : ""}` : String(cause);
    }
    const ms = performance.now() - started;
    const records: readonly RequestRecord[] = o.http.records.slice(firstRecord);
    const waitMs = Math.min(ms, records.reduce((t, r) => t + r.ms, 0));
    done.push({
      name: step.name,
      label: step.label,
      part: step.part,
      ok: error === undefined,
      ms: round(ms),
      waitMs: round(waitMs),
      computeMs: round(ms - waitMs),
      requests: records.length,
      up: records.reduce((t, r) => t + r.bodyBytes, 0),
      down: records.reduce((t, r) => t + r.answerBytes, 0),
      ...(answer === undefined ? {} : { answer }),
      ...(error === undefined ? {} : { error }),
    });
    if (error !== undefined) {
      failed = { step: step.name, label: step.label, message: error };
      break;
    }
  }
  const scanStep = done.find((s) => s.name === "scan" && s.ok);
  const scanAnswer = scanStep?.answer as { scanEngine?: ScanEngine; entries?: number } | undefined;
  return {
    ok: failed === null,
    failed,
    steps: done,
    scan: scanStep === undefined || scanAnswer?.scanEngine === undefined ? null : { ...scanAnswer.scanEngine, ms: scanStep.ms, entries: scanAnswer.entries ?? 0 },
    balances: balancesOf(done),
    cost: { ...costOf(done), parts: { shielded: costOf(done.filter((s) => s.part === "shielded")), dust: costOf(done.filter((s) => s.part === "dust")) } },
    startedAt,
  };
}
