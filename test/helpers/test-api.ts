import Type from "typebox";
import { z } from "zod";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { pageCursor } from "../../src/helpers/page-cursor.js";
import { invalidRequest, RouteError, registerTypedRoutes, typedRoute } from "../../src/helpers/typed-routes.js";

/**
 * `test-api`: a module whose whole API is typed routes (`src/helpers/typed-routes.ts`), over the core's blocks table,
 * to try the helpers through the real process and its HTTP listener as any module would use them. It holds no state.
 *
 * - `GET /test-api/v1/blocks/:height`: one committed block's height and hash; 404 `no-block` above the committed height.
 * - `GET /test-api/v1/blocks?limit=&cursor=`: the committed blocks from the newest, a page at a time (`pageCursor`).
 * - `POST /test-api/v1/echo` `{ text }`: `{ text }` back. Two texts exercise the error paths: `refuse` throws a
 *   `RouteError` (409 `refused`), and `wrong-answer` returns an answer its schema refuses (the module API's 500).
 *   `slow:<ms>` answers after `<ms>` milliseconds, to fill the concurrency limit.
 */

export const TEST_API_ID = "test-api";

const strict = { additionalProperties: false } as const;
const Height = Type.String({ pattern: "^(0|[1-9][0-9]{0,14})$" });
const Hex32 = Type.String({ pattern: "^0x[0-9a-f]{64}$" });
const Block = Type.Object({ height: Height, hash: Hex32 }, strict);

const hex = (bytes: Uint8Array) => `0x${Buffer.from(bytes).toString("hex")}`;
const blockOf = (row: Record<string, unknown>) => ({ height: String(row.height), hash: hex(row.hash as Uint8Array) });

const cursors = pageCursor(Type.Object({ below: Height }, strict));

export const ROUTES = [
  typedRoute({
    method: "GET",
    path: "/v1/blocks/:height",
    input: Type.Object({ height: Height }, strict),
    response: Block,
    async handle({ height }, read) {
      if (read.height === null || BigInt(height) > read.height) throw new RouteError(404, "no-block", "no committed block at that height");
      const [row] = await read.query("SELECT height, hash FROM core_block_commit.blocks WHERE height = $1", [BigInt(height)]);
      if (row === undefined) throw new RouteError(404, "no-block", "no committed block at that height");
      return blockOf(row);
    },
  }),
  typedRoute({
    method: "GET",
    path: "/v1/blocks",
    input: Type.Object({ limit: Type.Optional(Type.String({ pattern: "^([1-9]|[1-4][0-9]|50)$" })), cursor: Type.Optional(Type.String()) }, strict),
    response: Type.Object({ items: Type.Array(Block), nextCursor: Type.Union([Type.String(), Type.Null()]) }, strict),
    async handle({ limit, cursor }, read) {
      const n = Number(limit ?? 10);
      const below = cursor === undefined ? (read.height ?? -1n) + 1n : BigInt(cursors.decode(cursor).below);
      const rows = await read.query("SELECT height, hash FROM core_block_commit.blocks WHERE height < $1 AND height <= $2 ORDER BY height DESC LIMIT $3", [
        below,
        read.height ?? -1n,
        n + 1,
      ]);
      const page = rows.slice(0, n).map(blockOf);
      const last = page.at(-1);
      return { items: page, nextCursor: rows.length > n && last !== undefined ? cursors.encode({ below: last.height }) : null };
    },
  }),
  typedRoute({
    method: "POST",
    path: "/v1/echo",
    input: Type.Object({ text: Type.String({ maxLength: 64 }) }, strict),
    response: Type.Object({ text: Type.String() }, strict),
    async handle({ text }) {
      if (text === "refuse") throw new RouteError(409, "refused", "this text is refused");
      if (text === "wrong-answer") return { text: 42 } as unknown as { text: string };
      if (text.startsWith("slow:")) {
        const ms = Number(text.slice(5));
        if (!Number.isInteger(ms) || ms < 0 || ms > 5_000) throw invalidRequest("slow: a whole number of milliseconds up to 5000");
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
      return { text };
    },
  }),
];

/** The `test-api` module, with at most `maxConcurrent` requests at once (default: the helper's). */
export function testApi(maxConcurrent?: number): ModuleDeclaration {
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
        registerTypedRoutes(api, TEST_API_ID, ROUTES, maxConcurrent === undefined ? {} : { maxConcurrent });
      },
    },
  }) as ModuleDeclaration;
}
