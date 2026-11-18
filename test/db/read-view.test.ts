import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BACKENDS, TEST_CURSOR } from "./backends.js";
import {
  abortedOuterProblems,
  behindAFailureProblems,
  cannotWriteProblems,
  controlProblems,
  cursorsAndPreparedProblems,
  edgeProblems,
  failedStatementProblems,
  listenProblems,
  noTransactionIdProblems,
  notifyProblems,
  preparedTextProblems,
  SCHEMA,
  seesOuterRowsProblems,
  sessionAuthorizationProblems,
  settingsProblems,
  traceProblems,
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

  it("cannot write: each write, sequence change and switch to read-write fails with its SQLSTATE", async () => {
    expect(await cannotWriteProblems(await fresh())).toEqual([]);
  });

  it("sees the outer transaction's uncommitted rows, each of 100 views exactly those written before it", async () => {
    expect(await seesOuterRowsProblems(await fresh())).toEqual([]);
  });

  it("passes a failed statement's error to the body without aborting the outer transaction, for seven kinds of failure", async () => {
    expect(await failedStatementProblems(await fresh())).toEqual([]);
  });

  it("fails three statements sent behind a slow failure with 25P02, and sends none of them again", async () => {
    expect(await behindAFailureProblems(await fresh())).toEqual([]);
  });

  it("undoes every setting and role a view changes, and gives the outer its own role and local settings back", async () => {
    expect(await settingsProblems(await fresh())).toEqual([]);
  });

  it("refuses transaction control and a session authorization before sending them, and the server refuses DO, CALL and two statements", async () => {
    expect(await controlProblems(await fresh())).toEqual([]);
  });

  it("keeps the outer's cursor position and prepared statements; a cursor declared inside is gone after it", async () => {
    expect(await cursorsAndPreparedProblems(await fresh())).toEqual([]);
  });

  it("takes no transaction id over 1,000 views in a transaction that wrote nothing, and keeps the outer's clock and locks", async () => {
    expect(await noTransactionIdProblems(await fresh())).toEqual([]);
  });

  it("refuses a nested view, a handle used after its body and a transaction no backend opened, and sends nothing for an empty view", async () => {
    expect(await edgeProblems(await fresh())).toEqual([]);
  });

  it("in an aborted transaction: an empty view resolves, a first statement fails with 25P02, and the commit is refused", async () => {
    expect(await abortedOuterProblems(await fresh())).toEqual([]);
  });

  it("undoes a LISTEN sent in a view", async () => {
    expect(await listenProblems(await fresh())).toEqual([]);
  });

  it("refuses a session authorization through a read handle and through a view, and the session keeps its login", async () => {
    // A database of its own: on PGlite a session authorization let through would stay for the engine's life.
    expect(await sessionAuthorizationProblems(await fresh())).toEqual([]);
  });

  // PostgreSQL only: another connection, the block trace (PGlite records no statement in it) and prepared texts
  // (PGlite keeps none).
  if (!backend.singleQueue) {
    it("does not deliver a NOTIFY sent in a view, while the outer's own is delivered after the commit", async () => {
      const { db, url } = await backend.database(SCHEMA, TEST_CURSOR);
      expect(await notifyProblems(db, url as string)).toEqual([]);
    });

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
