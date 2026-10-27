import type { PageRequest } from "./chrome.js";
import type { PageEvent, StatusBody } from "./browser-harness.js";

/**
 * The oracles of the browser build's criteria (task 16.1; A129–A132), each a list of problems (empty when it holds),
 * shared by the tests and their committed negative controls (`browser.negative-control.test.ts`), which run the same
 * oracle over a build that differs in one way and see it fail.
 */

/** What a page may reach (A131, BR-3): its own origin's files, and the node. */
export interface Reachable {
  /** The page's origin, `http://127.0.0.1:<port>`. */
  readonly origin: string;
  /** The node's WebSocket URL, as the page was given it. */
  readonly node: string;
  /** The build's files, relative to the origin's root. */
  readonly files: readonly string[];
}

/** A URL without a trailing `/` on an empty path, for comparing WebSocket URLs. */
const plain = (url: string): string => {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}${parsed.search}`;
};

/**
 * A131's network check: every request the page and its workers made goes to the page's origin, for the page itself or
 * a file of its build, or is a WebSocket to the node; and the node was reached. `data:` and `blob:` URLs are no network
 * request.
 */
export function networkProblems(requests: readonly PageRequest[], reachable: Reachable): string[] {
  const problems: string[] = [];
  const files = new Set(reachable.files.map((file) => `/${file}`));
  const node = plain(reachable.node);
  for (const request of requests) {
    if (request.url.startsWith("data:") || request.url.startsWith("blob:")) continue;
    if (request.kind === "websocket") {
      if (plain(request.url) !== node) problems.push(`the ${request.target} opened a WebSocket to ${request.url}, not the node`);
      continue;
    }
    const url = new URL(request.url);
    if (url.origin !== reachable.origin) {
      problems.push(`the ${request.target} requested ${request.url}, outside the page's origin and not the node`);
    } else if (url.pathname !== "/" && !files.has(url.pathname)) {
      problems.push(`the ${request.target} requested ${url.pathname}, which is no file of the page's build`);
    }
  }
  if (!requests.some((request) => request.kind === "websocket" && plain(request.url) === node)) {
    problems.push("the page never reached the node");
  }
  return problems;
}

/** A process synced to `height`: following, ready, its cursor there. */
export function syncedProblems(name: string, status: StatusBody | null, height: bigint): string[] {
  if (status === null) return [`${name} answers no /status`];
  const problems: string[] = [];
  if (status.state !== "following") problems.push(`${name} is ${status.state}, not following (reason ${JSON.stringify(status.reason)})`);
  if (status.cursor !== `${height}`) problems.push(`${name}'s cursor is ${status.cursor}, not ${height}`);
  return problems;
}

/** A129's reload: the process resumed at the cursor it had, following, with the contents hash it had there. */
export function resumeProblems(
  name: string,
  before: { readonly cursor: string | null; readonly hash: string },
  after: { readonly status: StatusBody; readonly height: string | null; readonly hash: string },
): string[] {
  const problems: string[] = [];
  if (after.status.state !== "following") problems.push(`${name} is ${after.status.state} after the reload, not following`);
  if (after.status.cursor !== before.cursor) problems.push(`${name} resumed at ${after.status.cursor}, not at its cursor ${before.cursor}`);
  if (after.height !== before.cursor) problems.push(`${name}'s contents hash after the reload was read at ${after.height}, not ${before.cursor}`);
  if (after.hash !== before.hash) problems.push(`${name}'s contents hash after the reload is ${after.hash}, not ${before.hash}`);
  return problems;
}

/**
 * A129's second tab: its core refused with `writer-lock-held`, having opened nothing, while the first tab's core kept
 * its database — still following at least at the cursor it had, with the contents hash it had there when nothing
 * more was finalized (`unchanged`).
 */
export function secondTabProblems(
  second: { readonly status: StatusBody | null; readonly refused: PageEvent | undefined },
  first: { readonly status: StatusBody | null; readonly cursor: string | null; readonly hashBefore: string; readonly hashAfter: string },
): string[] {
  const problems: string[] = [];
  const code = second.refused?.error?.code ?? null;
  if (second.status?.state !== "refused") problems.push(`the second tab's core is ${second.status?.state ?? "silent"}, not refused`);
  if (code !== "writer-lock-held") problems.push(`the second tab's core was refused with ${code ?? "nothing"}, not writer-lock-held`);
  if (second.status?.cursor !== null && second.status?.cursor !== undefined) {
    problems.push(`the second tab's core read the database (cursor ${second.status.cursor}) before refusing`);
  }
  if (first.status?.state !== "following") problems.push(`the first tab's core is ${first.status?.state ?? "silent"} after the second tab opened`);
  if (first.status?.cursor !== first.cursor) problems.push(`the first tab's cursor moved from ${first.cursor} to ${first.status?.cursor}`);
  if (first.hashAfter !== first.hashBefore) problems.push(`the first tab's contents hash changed from ${first.hashBefore} to ${first.hashAfter}`);
  return problems;
}

/** A130's S: the core chose the node's finalized head at creation as S, and its database records it. */
export function startProblems(
  head: bigint,
  facts: {
    readonly chosen: number | undefined;
    readonly identityStart: string | null;
    readonly configStart: string | null;
    readonly firstBlock: string | null;
  },
): string[] {
  const problems: string[] = [];
  if (facts.chosen !== Number(head)) problems.push(`the core chose S ${facts.chosen}, not the node's finalized head ${head}`);
  if (facts.identityStart !== `${head}`) problems.push(`core_chain.identity records S ${facts.identityStart}, not ${head}`);
  if (facts.configStart !== `${head}`) problems.push(`core_chain.config records the core entry from ${facts.configStart}, not ${head}`);
  if (facts.firstBlock !== `${head}`) problems.push(`the first block committed is ${facts.firstBlock}, not S ${head}`);
  return problems;
}

/** A130's refusal: startup refused with `cannot-start-mid-chain`, naming the module. */
export function midChainProblems(module: string, status: StatusBody | null, refused: PageEvent | undefined): string[] {
  const problems: string[] = [];
  if (status?.state !== "refused") problems.push(`the core is ${status?.state ?? "silent"}, not refused`);
  const error = refused?.error;
  if (error?.code !== "cannot-start-mid-chain") problems.push(`startup refused with ${error?.code ?? "nothing"}, not cannot-start-mid-chain`);
  if ((error?.details as { module?: unknown } | null)?.module !== module) {
    problems.push(`the refusal's details name ${JSON.stringify((error?.details as { module?: unknown } | null)?.module)}, not ${module}`);
  }
  if (!(error?.message ?? "").includes(module)) problems.push(`the refusal's message does not name ${module}: ${error?.message}`);
  return problems;
}

/**
 * A132: the Chrome run reached the height the Node.js run did, following, from the same S, with an equal contents
 * hash there.
 */
export function sameHashProblems(
  chrome: { readonly start: number | undefined; readonly status: StatusBody | null; readonly height: string | null; readonly hash: string | null },
  node: { readonly start: number; readonly height: string | null; readonly hash: string },
): string[] {
  const problems: string[] = [];
  const status = chrome.status;
  if (status?.state !== "following" || status.cursor !== node.height) {
    const why = status?.reason === null || status?.reason === undefined ? "" : ` (${status.reason.code}: ${status.reason.message})`;
    problems.push(`Chrome's core is ${status?.state ?? "silent"} at ${status?.cursor ?? "no height"}${why}, not following at ${node.height}`);
  }
  if (chrome.start !== node.start) problems.push(`Chrome started at S ${chrome.start}, Node.js at ${node.start}`);
  if (chrome.height !== node.height) problems.push(`Chrome's hash is at ${chrome.height}, Node.js's at ${node.height}`);
  if (chrome.hash !== node.hash) problems.push(`Chrome's contents hash is ${chrome.hash}, Node.js's ${node.hash}`);
  return problems;
}
