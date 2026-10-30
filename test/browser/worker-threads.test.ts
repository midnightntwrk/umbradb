import { describe, expect, it } from "vitest";

/**
 * The browser's `node:worker_threads` (`browser/src/shims/worker-threads-*.ts`), over stand-ins for a Web
 * Worker and a worker's global scope set on this test process's global: the host's `Worker` sends `workerData` first,
 * gives each message to its listeners, reports an error once and then `exit`; the worker's side takes `workerData`
 * from the first message before the entry runs, and holds every later message until `parentPort.on("message")`.
 * Chrome runs both in `browser.test.ts` (the ledger worker).
 */

type Listener = (event: { data?: unknown; message?: string; preventDefault?: () => void }) => void;

describe("the browser's node:worker_threads", () => {
  it("in the worker: workerData from the first message, later messages held until the entry listens", async () => {
    const listeners: Listener[] = [];
    const posted: unknown[] = [];
    const scope = globalThis as unknown as { addEventListener?: unknown; postMessage?: unknown };
    scope.addEventListener = (_type: string, listener: Listener) => listeners.push(listener);
    scope.postMessage = (value: unknown) => posted.push(value);
    const shim = await import("../../browser/src/shims/worker-threads-worker.js");
    const deliver = (data: unknown) => {
      for (const listener of listeners) listener({ data });
    };
    const seen: unknown[] = [];
    const running = shim.runEntry(async () => {
      seen.push(["entry", shim.workerData]);
    });
    deliver({ workerData: { memory: "shared" } });
    await running;
    expect(seen).toEqual([["entry", { memory: "shared" }]]);
    deliver({ id: 1 });
    deliver({ id: 2 });
    shim.parentPort.on("message", (value) => seen.push(value));
    deliver({ id: 3 });
    expect(seen.slice(1)).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    shim.parentPort.postMessage({ type: "answer" });
    expect(posted).toEqual([{ type: "answer" }]);
    expect(shim.parentPort.on("error", () => undefined)).toBe(shim.parentPort);
    expect(() => new shim.Worker()).toThrow(/starts no worker/);
    delete scope.addEventListener;
    delete scope.postMessage;
  });

  it("in the host: workerData first, messages to listeners, an error then exit once, terminate as exit", async () => {
    const made: FakeWorker[] = [];
    class FakeWorker {
      readonly posted: unknown[] = [];
      readonly listeners = new Map<string, Listener[]>();
      terminated = 0;
      constructor(
        readonly entry: unknown,
        readonly options: unknown,
      ) {
        made.push(this);
      }
      postMessage(value: unknown) {
        this.posted.push(value);
      }
      addEventListener(type: string, listener: Listener) {
        this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
      }
      terminate() {
        this.terminated += 1;
      }
      fire(type: string, event: Parameters<Listener>[0]) {
        for (const listener of this.listeners.get(type) ?? []) listener(event);
      }
    }
    const scope = globalThis as unknown as { Worker?: unknown };
    const before = scope.Worker;
    scope.Worker = FakeWorker;
    try {
      const { Worker } = await import("../../browser/src/shims/worker-threads-host.js");
      const worker = new Worker("ledger-worker.js", { workerData: { memory: 1 } });
      const web = made[0] as FakeWorker;
      expect(web.options).toEqual({ type: "module" });
      expect(web.posted).toEqual([{ workerData: { memory: 1 } }]);
      const events: unknown[] = [];
      worker.on("message", (value: never) => events.push(["message", value]));
      worker.once("message", (value: never) => events.push(["once", value]));
      worker.on("error", (error: never) => events.push(["error", (error as Error).message]));
      worker.on("exit", (code: never) => events.push(["exit", code]));
      web.fire("message", { data: "a" });
      web.fire("message", { data: "b" });
      worker.postMessage({ id: 1 });
      expect(web.posted.at(-1)).toEqual({ id: 1 });
      let prevented = false;
      web.fire("error", { message: "boom", preventDefault: () => (prevented = true) });
      web.fire("error", { message: "again", preventDefault: () => undefined });
      await Promise.resolve();
      expect(prevented).toBe(true);
      expect(events).toEqual([["message", "a"], ["once", "a"], ["message", "b"], ["error", "boom"], ["exit", 1]]);
      expect(web.terminated).toBe(1);
      worker.postMessage({ id: 2 });
      expect(web.posted.at(-1)).toEqual({ id: 1 });
      expect(worker.threadId).toBe(-1);

      const second = new Worker(new URL("https://page.example/ledger-worker.js"));
      const exits: unknown[] = [];
      second.once("exit", (code: never) => exits.push(code));
      expect(await second.terminate()).toBe(1);
      await second.terminate();
      await Promise.resolve();
      expect(exits).toEqual([1]);
      expect((made[1] as FakeWorker).terminated).toBe(1);
      const unused = (): void => undefined;
      second.on("message", unused).off("message", unused);
      second.unref();
      second.ref();
    } finally {
      scope.Worker = before;
    }
  });
});
