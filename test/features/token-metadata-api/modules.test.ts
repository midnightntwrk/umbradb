import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, post, runTo, serve, startRun, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * The two modules, through the real process on PostgreSQL 18 and PGlite: `token-metadata` creates and fills the
 * tables, `token-metadata-api` serves them.
 *
 * - The API without the indexer is refused at startup: it requires the indexer's table items.
 * - The indexer alone fills its tables and serves no tokens route (the module API's own 404).
 * - The API holds no state: added to a database whose indexer already ran (from a height above the cursor, as every
 *   added entry), it answers exactly as the API of a database that ran both modules from S.
 */

const INDEXER = TOKEN_METADATA as ModuleDeclaration;
const API = TOKEN_METADATA_API as ModuleDeclaration;
const S = 100;
const HEAD = 104;
const A = contract(1);
const DS = domain(3);
const logs = new Map([[BigInt(S + 2), blockLogs([0, A, eventData(DS, 1, commonRecords({ name: "Acme Gold", symbol: "AG", decimals: 6 }))])]]);
const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
const BODIES = [{ contract: hex(A) }, { contract: hex(A), domainSep: hex(DS) }, { contract: hex(A), domainSep: hex(DS), kind: 1 }];

describe.each(PROCESS_BACKENDS)("token-metadata and token-metadata-api on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("refuses the API without the indexer, naming the item it requires", async () => {
    const db = await backend.database();
    const handle = startRun(db, { start: S, head: HEAD, logs, modules: [API] });
    const refusal = await handle.started.then(
      () => null,
      (error: unknown) => error,
    );
    const status = handle.status();
    await handle.stop();
    expect(status.state).toBe("refused");
    expect(refusal).toMatchObject({ code: "item-no-provider" });
    expect((refusal as Error).message).toMatch(/token-metadata-(events|state)/);
  }, 240_000);

  it("fills the tables with the indexer alone, which serves no tokens route", async () => {
    const db = await backend.database();
    const answer = await serve(db, { start: S, head: HEAD, logs, modules: [INDEXER] }, (origin) => post(origin, TOKENS_PATH, { contract: hex(A) }));
    expect(answer.status).toBe(404);
    expect(answer.json).toMatchObject({ error: { code: "not-found" } });
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.tokens")).toEqual([{ n: 1 }]);
    expect(await db.query("SELECT count(*)::int AS n FROM token_metadata.fields")).toEqual([{ n: 3 }]);
  }, 240_000);

  it("answers the same when the API is added, above the cursor, to a database whose indexer already ran", async () => {
    const answersOf = (origin: string) => Promise.all(BODIES.map((body) => post(origin, TOKENS_PATH, body)));
    const both = await backend.database();
    const fromS = await serve(both, { start: S, head: HEAD + 2, logs, modules: [INDEXER, API] }, answersOf);
    const later = await backend.database();
    await runTo(later, { start: S, head: HEAD, logs, modules: [INDEXER] });
    // Every entry, the API's too, starts above the cursor when added (the past cannot change): the API from HEAD + 1.
    const moduleStart = (id: string) => (id === API.id ? HEAD + 1 : S);
    const added = await serve(later, { start: S, head: HEAD + 2, logs, moduleStart, modules: [INDEXER, API] }, answersOf);
    for (const [i, body] of BODIES.entries()) {
      const at = JSON.stringify(body);
      expect([at, added[i]!.status]).toEqual([at, 200]);
      expect([at, added[i]!.text]).toEqual([at, fromS[i]!.text]);
      expect([at, added[i]!.headers["x-umbra-height"]]).toEqual([at, fromS[i]!.headers["x-umbra-height"]]);
    }
    expect(added[2]!.json.items[0].common).toMatchObject({ name: "Acme Gold", symbol: "AG", decimals: "6" });
  }, 240_000);
});
