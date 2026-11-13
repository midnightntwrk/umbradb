/**
 * The node's JSON-RPC over HTTP, for what `send` checks before it spends (from the transfer spike's `zswap-events.ts`):
 * the finalized head, and the node's own Zswap root after a block (`midnight_zswapStateRoot`, the untagged field
 * element in SCALE compact form, answered as a JSON byte array), a second source for the tail's root.
 */

import { decodeScaleCompact, bigIntToLe32 } from "./tree.ts";

export async function nodeRpc<T>(nodeHttp: string, method: string, params: unknown[] = []): Promise<T> {
  let res: Response;
  try {
    res = await fetch(nodeHttp, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
  } catch (cause) {
    throw new Error(`the node at ${nodeHttp} is unreachable (${method})`, { cause });
  }
  const body = (await res.json()) as { result?: T; error?: unknown };
  if (body.error !== undefined) throw new Error(`${method}: ${JSON.stringify(body.error)}`);
  return body.result as T;
}

export interface BlockRef {
  readonly hash: string;
  readonly height: number;
}

export async function finalizedHead(nodeHttp: string): Promise<BlockRef> {
  const hash = await nodeRpc<string>(nodeHttp, "chain_getFinalizedHead");
  const header = await nodeRpc<{ number: string }>(nodeHttp, "chain_getHeader", [hash]);
  return { hash, height: parseInt(header.number, 16) };
}

/** The node's Zswap root after block `blockHash` (`0x…`), as 32 bytes little-endian. */
export async function zswapRootAt(nodeHttp: string, blockHash: string): Promise<Uint8Array> {
  const raw = Uint8Array.from(await nodeRpc<number[]>(nodeHttp, "midnight_zswapStateRoot", [blockHash]));
  const [value, end] = decodeScaleCompact(raw, 0);
  if (end !== raw.length) throw new Error("midnight_zswapStateRoot: trailing bytes");
  return bigIntToLe32(value);
}
