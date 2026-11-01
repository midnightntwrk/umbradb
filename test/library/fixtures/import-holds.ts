// Holds a fixture's evaluation waits on, by name: a test opens a hold, sees the fixture's import reach it, acts (a stop,
// an abort), then releases it. The registry is on `globalThis`, so the test and the fixture imported by the engine share
// it whatever module instance each has. [L32]

/** A promise and its resolve. */
interface Signal {
  readonly promise: Promise<void>;
  readonly resolve: () => void;
}

/** One hold: resolved when the fixture reached it, and the release the fixture awaits. */
interface Hold {
  readonly entered: Signal;
  readonly release: Signal;
}

/** A new {@link Signal}. */
function signal(): Signal {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const HOLDS = Symbol.for("umbradb.test.library.import-holds");

/** The holds of this process, by name. */
function holds(): Map<string, Hold> {
  const shared = globalThis as { [HOLDS]?: Map<string, Hold> };
  shared[HOLDS] ??= new Map();
  return shared[HOLDS];
}

/** Opens the hold `name`: `entered` resolves once a fixture waits at it, `release()` lets the fixture go on. */
export function openHold(name: string): { readonly entered: Promise<void>; release(): void } {
  const hold: Hold = { entered: signal(), release: signal() };
  holds().set(name, hold);
  return { entered: hold.entered.promise, release: () => hold.release.resolve() };
}

/** Waits at the hold `name` (a fixture's evaluation): tells the test it is there, then waits for its release. */
export async function waitAtHold(name: string): Promise<void> {
  const hold = holds().get(name);
  if (hold === undefined) throw new Error(`no hold ${name} is open: the test opens it before the import`);
  hold.entered.resolve();
  await hold.release.promise;
}
