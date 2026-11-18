import { z } from "zod";
import { pageCursor } from "../../src/helpers/page-cursor.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { defineRoute, RouteError } from "../../src/modules/route.js";

/**
 * `test-api`: a module whose whole API is routes (`src/modules/route.ts`), over the core's blocks table, to try them
 * through the real process and its HTTP listener as any module would write them. It holds no state.
 *
 * - `getBlock`, served `GET /test-api/v1/blocks/:height`: one committed block's height and hash; `not-found`
 *   (`no-block`) above the committed height.
 * - `listBlocks`, served `GET /test-api/v1/blocks?limit=&cursor=`: the committed blocks from the newest, a page at a
 *   time (`pageCursor`).
 * - `echo`, with no `http` hint, so served `POST /test-api/echo` `{ text }`: `{ text }` back. Two texts exercise the
 *   error paths: `refuse` throws a `RouteError` (`failed-precondition`, `refused`), and `wrong-answer` returns an
 *   answer its schema refuses (the module API's 500).
 */

export const TEST_API_ID = "test-api";

const Height = z.int().min(0).max(999_999_999_999_999);
const Block = z.strictObject({ height: Height, hash: z.string().regex(/^0x[0-9a-f]{64}$/) });

const hex = (bytes: Uint8Array) => `0x${Buffer.from(bytes).toString("hex")}`;
const blockOf = (row: Record<string, unknown>) => ({ height: Number(row.height), hash: hex(row.hash as Uint8Array) });

const cursors = pageCursor(z.strictObject({ below: Height }));

export const getBlock = defineRoute({
  name: "getBlock",
  description: "One committed block's height and hash.",
  input: z.object({ height: Height }),
  output: Block,
  http: { method: "GET", path: "/v1/blocks/:height" },
  async handle({ height }, { read, height: committed }) {
    if (BigInt(height) > committed) throw new RouteError("not-found", "no-block", "no committed block at that height");
    const [row] = await read.query("SELECT height, hash FROM core_block_commit.blocks WHERE height = $1", [BigInt(height)]);
    if (row === undefined) throw new RouteError("not-found", "no-block", "no committed block at that height");
    return blockOf(row);
  },
});

export const listBlocks = defineRoute({
  name: "listBlocks",
  description: "The committed blocks from the newest, a page at a time.",
  input: z.object({ limit: z.int().min(1).max(50).default(10), cursor: z.string().optional() }),
  output: z.strictObject({ items: z.array(Block), nextCursor: z.string().nullable() }),
  http: { method: "GET", path: "/v1/blocks" },
  async handle({ limit, cursor }, { read, height }) {
    const below = cursor === undefined ? height + 1n : BigInt(cursors.decode(cursor).below);
    const rows = await read.query("SELECT height, hash FROM core_block_commit.blocks WHERE height < $1 AND height <= $2 ORDER BY height DESC LIMIT $3", [
      below,
      height,
      limit + 1,
    ]);
    const items = rows.slice(0, limit).map(blockOf);
    const last = items.at(-1);
    return { items, nextCursor: rows.length > limit && last !== undefined ? cursors.encode({ below: last.height }) : null };
  },
});

export const echo = defineRoute({
  name: "echo",
  input: z.object({ text: z.string().max(64) }),
  output: z.strictObject({ text: z.string() }),
  async handle({ text }) {
    if (text === "refuse") throw new RouteError("failed-precondition", "refused", "this text is refused");
    if (text === "wrong-answer") return { text: 42 } as unknown as { text: string };
    return { text };
  },
});

/** The `test-api` module. */
export function testApi(): ModuleDeclaration {
  return defineModule({
    id: TEST_API_ID,
    version: "1.0.0",
    side: "public",
    requires: ["blocks"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-api"(_p, api) {
        api.route(getBlock);
        api.route(listBlocks);
        api.route(echo);
      },
    },
  }) as ModuleDeclaration;
}
