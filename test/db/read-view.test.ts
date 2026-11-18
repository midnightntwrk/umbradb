import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BACKENDS, TEST_CURSOR } from "./backends.js";
import {
  abortedOuterProblems,
  behindAFailureProblems,
  bodyErrorProblems,
  cannotWriteProblems,
  connectionListener,
  controlProblems,
  cursorAfterFailureProblems,
  cursorsAndPreparedProblems,
  deallocatedReadProblems,
  edgeProblems,
  failedStatementProblems,
  listenProblems,
  noSubtransactionIdProblems,
  noTransactionIdProblems,
  notifyProblems,
  preparedTextProblems,
  SCHEMA,
  secondSendingProblems,
  seesOuterRowsProblems,
  sessionAuthorizationProblems,
  sessionObjectProblems,
  settingsProblems,
  temporaryObjectProblems,
  traceProblems,
  unansweredProblems,
} from "./read-view-checks.js";

/**
 * The read view (`src/db/read-view.ts`): a read-only view inside an open write transaction, for a caller that must read
 * inside a transaction it has written in. Each guarantee is a check of `read-view-checks.ts`, run here on PostgreSQL 18
 * and PGlite 0.5.10, each on a database of its own; `read-view.negative-control.test.ts` makes the named checks fail
 * with wrong texts or a check that refuses nothing.
 */

describe.each(BACKENDS)("the read view on $name", { timeout: 120_000 }, (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const fresh = async () => (await backend.database(SCHEMA, TEST_CURSOR)).db;

  it("cannot change a persistent object: each write, ALTER, DROP, sequence change and switch to read-write fails with its SQLSTATE", async () => {
    expect(await cannotWriteProblems(await fresh())).toEqual([]);
  });

  it("lets an existing temporary sequence move, which the close does not undo, and an existing temporary table change, which it undoes", async () => {
    expect(await temporaryObjectProblems(await fresh())).toEqual([]);
  });

  it("does not undo a DEALLOCATE or a CLOSE of the session's own prepared statement and holdable cursor, and undoes an UNLISTEN", async () => {
    expect(await sessionObjectProblems(await fresh())).toEqual([]);
  });

  it("sees the outer transaction's uncommitted rows, each of 100 views exactly those written before it", async () => {
    expect(await seesOuterRowsProblems(await fresh())).toEqual([]);
  });

  it("passes a failed statement's error to the body without aborting the outer transaction, for seven kinds of failure", async () => {
    expect(await failedStatementProblems(await fresh())).toEqual([]);
  });

  it("fails three statements sent behind a slow failure with 25P02; each of them, the open and the close reaches the database once", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await behindAFailureProblems(db, sent)).toEqual([]);
  });

  it("answers the statements a settled body left unanswered inside the view, and refuses the handle while the close is pending without sending", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await unansweredProblems(db, sent)).toEqual([]);
  });

  // A statement with a parameter after DEALLOCATE ALL: PostgreSQL's session prepared its text by name, and the driver
  // sends it a second time; PGlite prepares nothing by name.
  it("waits for a write its body left unanswered that is sent a second time after DEALLOCATE ALL: no sending is behind the close, and its row is not stored", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await secondSendingProblems(db, sent, { prepares: !backend.singleQueue, first: false })).toEqual([]);
  });

  it("waits for such a write sent as the view's first statement, right behind the open", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await secondSendingProblems(db, sent, { prepares: !backend.singleQueue, first: true })).toEqual([]);
  });

  it("answers a statement with a parameter that its body awaits after DEALLOCATE ALL ahead of the close; the outer's own prepared text fails once after the view", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await deallocatedReadProblems(db, sent, !backend.singleQueue)).toEqual([]);
  });

  it("rejects with the body's own error, the same value, whatever it is", async () => {
    expect(await bodyErrorProblems(await fresh())).toEqual([]);
  });

  it("undoes every setting and role a view changes, and gives the outer its own role and local settings back", async () => {
    expect(await settingsProblems(await fresh())).toEqual([]);
  });

  it("refuses transaction control and a session authorization before sending them, each in a transaction of its own; the server refuses DO, CALL, two statements, a prepared COMMIT and the texts the check lets through", async () => {
    expect(await controlProblems(await fresh())).toEqual([]);
  });

  it("keeps the outer's cursor position and prepared statements; a cursor declared inside is gone after it", async () => {
    expect(await cursorsAndPreparedProblems(await fresh())).toEqual([]);
  });

  it("keeps the place of a cursor fetched from before a statement of the view failed; a cursor whose own fetch failed in a view stays unusable (55000)", async () => {
    expect(await cursorAfterFailureProblems(await fresh())).toEqual([]);
  });

  it("takes no transaction id over 1,000 views in a transaction that wrote nothing, and keeps the outer's clock and locks", async () => {
    expect(await noTransactionIdProblems(await fresh())).toEqual([]);
  });

  it("takes no subtransaction id over 200 views in a transaction that has its id; a writing savepoint and a view that writes a temporary table take one", async () => {
    expect(await noSubtransactionIdProblems(await fresh())).toEqual([]);
  });

  it("refuses a nested view, a handle used after its body and a transaction no backend opened; an empty view, its handle used late and COMMIT; SELECT 1 send nothing", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await edgeProblems(db, sent)).toEqual([]);
  });

  it("in an aborted transaction: an empty view sends nothing, a first statement fails with 25P02, nothing is sent after the failed open, and the commit is refused", async () => {
    const { db, sent } = await backend.counted(SCHEMA, TEST_CURSOR);
    expect(await abortedOuterProblems(db, sent)).toEqual([]);
  });

  it("undoes a LISTEN sent in a view", async () => {
    expect(await listenProblems(await fresh())).toEqual([]);
  });

  it("refuses a session authorization through a read handle and through a view, and the session keeps its login", async () => {
    // A database of its own: on PGlite a session authorization let through would stay for the engine's life.
    expect(await sessionAuthorizationProblems(await fresh())).toEqual([]);
  });

  it("does not deliver a NOTIFY sent in a view, while the outer's own is delivered after the commit", async () => {
    const { db, url, listen } = await backend.database(SCHEMA, TEST_CURSOR);
    // PostgreSQL: a listener on another connection. PGlite: a listener of the engine's one session.
    const listener = listen === undefined ? connectionListener(url as string) : { listen, stop: async () => undefined };
    expect(await notifyProblems(db, listener)).toEqual([]);
  });

  // PostgreSQL only: the block trace (PGlite records no statement in it) and prepared texts (PGlite keeps none).
  if (!backend.singleQueue) {

    it("counts a view's open and close once each in the block trace", async () => {
      expect(await traceProblems(await fresh())).toEqual([]);
    });

    it("leaves the prepared texts prepared on the writer and the read pool", async () => {
      expect(await preparedTextProblems(await fresh())).toEqual([]);
    });

    it("control: the same texts through the migrations' path stop the prepared texts' executions", async () => {
      const problems = await preparedTextProblems(await fresh(), true);
      expect(problems).toEqual([expect.stringMatching(/^executions of the prepared text: \{.*"writerInsideTheFirstView":3,/)]);
    });
  }
});
