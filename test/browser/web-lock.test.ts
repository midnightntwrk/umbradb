import { afterEach, describe, expect, it } from "vitest";
import { acquirePgliteLock, WEB_LOCK_PREFIX } from "../../browser/src/db/web-lock.js";

/**
 * The browser's PGlite writer lock (task 16.1; BR-1, DB-11; `browser/src/db/web-lock.ts`) over Node.js's own Web
 * Locks (`navigator.locks`, Node.js 24), which behave as a browser's within one agent: held for the holder's life,
 * `ifAvailable` answering at once. Chrome runs the same code in `browser.test.ts` (A129's second tab).
 */

const scope = globalThis as { __UMBRADB_BROWSER_CONTROL__?: string };

/** Whether the Web Lock `name` is free now (asked without waiting, and given back at once). */
const free = (name: string): Promise<boolean> =>
  navigator.locks.request(name, { ifAvailable: true }, (lock) => lock !== null) as Promise<boolean>;

afterEach(() => {
  delete scope.__UMBRADB_BROWSER_CONTROL__;
});

describe("the browser's writer lock (BR-1)", () => {
  it("takes none for a database in memory", async () => {
    scope.__UMBRADB_BROWSER_CONTROL__ = "";
    expect(await acquirePgliteLock("memory://")).toBeUndefined();
    expect(await acquirePgliteLock("")).toBeUndefined();
  });

  it("holds one Web Lock per OPFS database for the worker's life, and refuses a second opening, here or elsewhere", async () => {
    scope.__UMBRADB_BROWSER_CONTROL__ = "";
    const use = await acquirePgliteLock("opfs-ahp://wl-one");
    expect(use?.file).toBe(`${WEB_LOCK_PREFIX}wl-one`);
    expect(await free(`${WEB_LOCK_PREFIX}wl-one`)).toBe(false);
    // A second opening in the same worker while the first is open.
    await expect(acquirePgliteLock("opfs-ahp://wl-one")).rejects.toMatchObject({ code: "writer-lock-held", details: { holder: "this process" } });
    // Closed and opened again: the lock it kept, still held throughout.
    use?.endUse();
    expect(await free(`${WEB_LOCK_PREFIX}wl-one`)).toBe(false);
    const again = await acquirePgliteLock("opfs-ahp://wl-one");
    expect(again?.file).toBe(`${WEB_LOCK_PREFIX}wl-one`);
    // Another holder (another tab's worker) of a second database: refused at once, not waited for.
    let release!: () => void;
    const holding = new Promise<void>((resolve) => {
      release = resolve;
    });
    let held!: () => void;
    const taken = new Promise<void>((resolve) => {
      held = resolve;
    });
    void navigator.locks.request(`${WEB_LOCK_PREFIX}wl-two`, () => {
      held();
      return holding;
    });
    await taken;
    const started = Date.now();
    await expect(acquirePgliteLock("opfs-ahp://wl-two")).rejects.toMatchObject({ code: "writer-lock-held", details: { holder: "another process" } });
    expect(Date.now() - started).toBeLessThan(5_000);
    release();
    // Once the other holder ended, this worker takes it.
    for (let attempt = 0; attempt < 100 && !(await free(`${WEB_LOCK_PREFIX}wl-two`)); attempt++) await new Promise((r) => setTimeout(r, 10));
    expect((await acquirePgliteLock("opfs-ahp://wl-two"))?.file).toBe(`${WEB_LOCK_PREFIX}wl-two`);
  });

  it("takes no lock in the negative control's build (ignore-web-lock)", async () => {
    scope.__UMBRADB_BROWSER_CONTROL__ = "ignore-web-lock";
    const use = await acquirePgliteLock("opfs-ahp://wl-three");
    expect(use?.file).toBe(`${WEB_LOCK_PREFIX}wl-three`);
    expect(await free(`${WEB_LOCK_PREFIX}wl-three`)).toBe(true);
  });
});
