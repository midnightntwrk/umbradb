import { describe, expect, it } from "vitest";
import { privateInstancesOf } from "../../src/private/instances.js";
import { Lockstep } from "../../src/private/lockstep.js";
import type { InstanceView } from "../../src/private/core-transport.js";

/**
 * The core's view of its private instances for `/status` (task 14.4; PP-9, AE-5): from its lockstep bookkeeping (every
 * listed instance, connected or not, its height as the core learned it) and its transport (every connected instance),
 * each instance once — listed ones in the list's order, then the others by id — with exactly its id, connection,
 * lockstep flag and synced height, nothing else of what the transport knows (the hash of its last block).
 */

const view = (instance: string, height: bigint, lockstep = false): InstanceView =>
  Object.freeze({ instance, lockstep, height, hash: `0x${"ab".repeat(32)}` });

describe("privateInstancesOf (PP-9)", () => {
  it("shows every listed instance from the bookkeeping, connected or not, and every other connected one", () => {
    const lockstep = new Lockstep({ listed: ["b-listed", "a-listed"] });
    lockstep.hello("a-listed", 7n, null);
    lockstep.reported("a-listed", 9n);
    const connected = [view("z-free", 3n), view("a-listed", 9n, true), view("m-free", 12n)];
    expect(privateInstancesOf(lockstep.instances(), connected)).toEqual([
      { id: "b-listed", connected: false, lockstep: true, height: null },
      { id: "a-listed", connected: true, lockstep: true, height: 9n },
      { id: "m-free", connected: true, lockstep: false, height: 12n },
      { id: "z-free", connected: true, lockstep: false, height: 3n },
    ]);
  });

  it("takes a listed instance's height from the bookkeeping, which counts only checked reports; a refused one is listed", () => {
    const lockstep = new Lockstep({ listed: ["l"] });
    lockstep.hello("l", 2n, "lockstep-behind");
    lockstep.reported("l", 8n);
    expect(privateInstancesOf(lockstep.instances(), [view("l", 8n, true)])).toEqual([{ id: "l", connected: true, lockstep: true, height: 2n }]);
    lockstep.disconnected("l");
    expect(privateInstancesOf(lockstep.instances(), [])).toEqual([{ id: "l", connected: false, lockstep: true, height: 2n }]);
  });

  it("orders the other instances by id, two views of one id (none in practice: a second hello is refused) kept in turn", () => {
    expect(privateInstancesOf([], [view("b", 2n), view("a", 1n), view("b", 3n)]).map((shown) => [shown.id, shown.height])).toEqual([
      ["a", 1n],
      ["b", 2n],
      ["b", 3n],
    ]);
  });

  it("is empty with no bookkeeping and no connection, and gives frozen instances of the four fields only", () => {
    expect(privateInstancesOf([], [])).toEqual([]);
    const [shown] = privateInstancesOf([], [view("x", 1n)]);
    expect(Object.keys(shown ?? {}).sort()).toEqual(["connected", "height", "id", "lockstep"]);
    expect(Object.isFrozen(shown)).toBe(true);
    expect(Object.isFrozen(privateInstancesOf([], []))).toBe(true);
  });
});
