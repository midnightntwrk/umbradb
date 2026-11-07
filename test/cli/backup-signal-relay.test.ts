import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";
import { backupSignalRelay } from "../../src/cli/run.js";

/**
 * `umbradb run`'s relay of SIGUSR2 (`src/cli/run.ts`). The command listens for SIGUSR2 from its start to its end and
 * hands the process a signal source of its own. A signal goes to the process's listener when it has one
 * (`backupOnSignal` set). Otherwise it is logged as ignored, in one line naming `backupOnSignal` that says why: startup
 * has not settled yet, `backupOnSignal` is not set, or the process has closed. [BK-1, Q173 C]
 *
 * The same check with the real command and signal is `test/backup/signal-ignored.test.ts`. [A175]
 */

function relayOf() {
  const source = new EventEmitter();
  const lines: string[] = [];
  const relay = backupSignalRelay(source, (line) => lines.push(line));
  return { source, lines, relay };
}

describe("umbradb run's SIGUSR2 relay (BK-1, Q173 C)", () => {
  it("listens on its source from the start until disposed", () => {
    const { source, relay } = relayOf();
    expect(source.listenerCount("SIGUSR2")).toBe(1);
    relay.dispose();
    expect(source.listenerCount("SIGUSR2")).toBe(0);
    relay.dispose();
    expect(source.listenerCount("SIGUSR2")).toBe(0);
  });

  it("before startup settled, without a listener: ignored, naming backupOnSignal, nothing else run", () => {
    const { source, lines } = relayOf();
    source.emit("SIGUSR2");
    expect(lines).toEqual([
      "SIGUSR2 ignored: the process is starting and has not listened for it (backupOnSignal not set or not yet read)",
    ]);
  });

  it("once startup settled, without a listener: ignored because backupOnSignal is not set, once per signal", () => {
    const { source, lines, relay } = relayOf();
    relay.settled();
    source.emit("SIGUSR2");
    source.emit("SIGUSR2");
    expect(lines).toEqual([
      "SIGUSR2 ignored: backupOnSignal is not set, so no backup is written",
      "SIGUSR2 ignored: backupOnSignal is not set, so no backup is written",
    ]);
  });

  it("with the process's listener: each signal goes to it and nothing is logged; removed, it is no longer called", () => {
    const { source, lines, relay } = relayOf();
    const calls: number[] = [];
    const listener = () => calls.push(1);
    relay.signals.on("SIGUSR2", listener);
    source.emit("SIGUSR2");
    relay.settled();
    source.emit("SIGUSR2");
    expect(calls).toEqual([1, 1]);
    expect(lines).toEqual([]);
    relay.signals.removeListener("SIGUSR2", listener);
    source.emit("SIGUSR2");
    expect(calls).toEqual([1, 1]);
    expect(lines).toEqual(["SIGUSR2 ignored: the process has closed, so no backup on signal (backupOnSignal) is written"]);
  });

  it("after dispose, a signal of the source reaches nothing", () => {
    const { source, lines, relay } = relayOf();
    const calls: number[] = [];
    relay.signals.on("SIGUSR2", () => calls.push(1));
    relay.dispose();
    source.emit("SIGUSR2");
    expect(calls).toEqual([]);
    expect(lines).toEqual([]);
  });
});
