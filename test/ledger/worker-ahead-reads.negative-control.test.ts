import { afterAll, describe, expect, it } from "vitest";
import { applyBlock, at, atBlockTwo, chain, closeHosts, LONG, mapReader, serialThree, started } from "./ahead-reads.js";

/**
 * The committed negative control of `worker-ahead-reads.test.ts`, over the real worker thread and the real v9 package,
 * with the host's rule on the reads of a block applied ahead turned off (`aheadReadsCurrent: false`): block 3's apply
 * ahead is answered through the read of another request in flight, opened at block 0 and held open since. The nodes
 * block 1 wrote are missing in it, and the apply does not give the result of an apply at the block's turn: it fails,
 * or it gives another result (a missing node inside the package's check of a transaction passes for a transaction
 * that failed).
 */

afterAll(() => closeHosts());

describe("negative control: the reads of a block applied ahead, with the host's rule off", () => {
  it("control: answered through an older read of another request in flight, the apply ahead reads nodes written since as missing and does not give the result of an apply at the block's turn", { timeout: LONG }, async () => {
    const made = await chain();
    const serial = await serialThree(made);
    const all = [...made.zero.nodes, ...made.one.nodes];
    const host = started({ aheadReadsCurrent: false });
    await atBlockTwo(host, made, mapReader(all, 1n));
    const database = mapReader(all, 1n);
    host.useDatabase({ read: (body) => body(database) });
    const old = mapReader(made.zero.nodes, 0n);
    const applying = host.apply({ ...applyBlock(3n, 2), ahead: true }).catch((error: unknown) => error);
    const retaining = host.retained({ ledger: "v9", ...at(0n), stateKey: made.zero.stateKey }, old).catch((error: unknown) => error);
    const three = await applying;
    await retaining;
    // The older read was asked for nodes block 1 wrote, which it does not hold; the database's read was not asked.
    expect(old.queries.flat().some((key) => made.written.has(key))).toBe(true);
    expect(database.queries).toEqual([]);
    expect(three).not.toEqual(serial);
  });
});
