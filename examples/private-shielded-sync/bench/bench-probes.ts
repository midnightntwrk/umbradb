/**
 * Memory probes for the benchmark (spec FR-151: "Memory is the process's peak resident size during the step"). A probe
 * samples one process's resident memory over time; `peak(from, to)` is the largest sample in a window of wall-clock
 * time (`Date.now()` milliseconds).
 *
 * - `selfProbe`: this process, every 10 ms on the main thread, plus a sample at each `mark()`; a mark also takes the
 *   operating system's high-water mark (`maxRSS`) when it rose since the previous mark, so a peak reached while the
 *   main thread was busy is still seen at the step's end.
 * - `pidProbe`: another local process, by `ps -o rss=` (every 200 ms).
 * - `dockerProbe`: a container's memory as `docker stats` reports it (every 0.5 s; the container, not one process).
 *
 * A sparse probe's window is widened by its interval, so a step shorter than the interval still gets the samples
 * next to it.
 */

import { execFile, spawn } from "node:child_process";

export interface MemoryProbe {
  /** How it samples, for the report. */
  readonly method: string;
  /** Takes a sample now (in-process probes only). */
  mark(): void;
  /** The largest sample in `[from, to]` (widened by the interval), or null when there is none. */
  peak(from: number, to: number): number | null;
  stop(): Promise<void>;
}

class Samples {
  readonly at: number[] = [];
  readonly bytes: number[] = [];

  add(bytes: number, at = Date.now()): void {
    this.at.push(at);
    this.bytes.push(bytes);
  }

  peak(from: number, to: number, widen: number): number | null {
    let best: number | null = null;
    for (let i = 0; i < this.at.length; i++) {
      const t = this.at[i]!;
      if (t >= from - widen && t <= to + widen) best = best === null ? this.bytes[i]! : Math.max(best, this.bytes[i]!);
    }
    return best;
  }
}

/** This process's resident memory (see the module comment). */
export function selfProbe(everyMs = 10): MemoryProbe {
  const samples = new Samples();
  let highWater = process.resourceUsage().maxRSS * 1024;
  const sample = (): void => samples.add(process.memoryUsage.rss());
  sample();
  const timer = setInterval(sample, everyMs);
  timer.unref();
  return {
    method: `this process, sampled every ${everyMs} ms and at each step's start and end (with the operating system's high-water mark)`,
    mark(): void {
      sample();
      const now = process.resourceUsage().maxRSS * 1024;
      if (now > highWater) {
        samples.add(now);
        highWater = now;
      }
    },
    peak: (from, to) => samples.peak(from, to, 0),
    async stop(): Promise<void> {
      clearInterval(timer);
    },
  };
}

/** Another local process's resident memory, by `ps` (macOS and Linux). */
export function pidProbe(pid: number, everyMs = 200): MemoryProbe {
  if (!Number.isSafeInteger(pid) || pid <= 0) throw new Error(`not a process id: ${pid}`);
  const samples = new Samples();
  let stopped = false;
  let running: Promise<void> = Promise.resolve();
  const once = (): Promise<void> =>
    new Promise((resolve) => {
      execFile("ps", ["-o", "rss=", "-p", String(pid)], (error, stdout) => {
        const kib = Number(String(stdout).trim());
        if (error === null && Number.isFinite(kib) && kib > 0) samples.add(kib * 1024);
        resolve();
      });
    });
  const timer = setInterval(() => {
    if (!stopped) running = running.then(once);
  }, everyMs);
  timer.unref();
  void (running = once());
  return {
    method: `process ${pid}, \`ps -o rss=\` every ${everyMs} ms`,
    mark(): void {},
    peak: (from, to) => samples.peak(from, to, everyMs),
    async stop(): Promise<void> {
      stopped = true;
      clearInterval(timer);
      await running;
    },
  };
}

const UNITS: Record<string, number> = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, KIB: 1024, MIB: 1024 ** 2, GIB: 1024 ** 3, TIB: 1024 ** 4 };

/** `754.4MiB / 30.06GiB` (with or without terminal escapes) → bytes of the first figure, or null. */
export function parseDockerMemory(line: string): number | null {
  // `docker stats` redraws its line with terminal escapes.
  const text = line.replace(/\u001b\[[0-9;]*[A-Za-z]/g, "").trim();
  const match = /^([0-9.]+)\s*([KMGT]?i?B)\b/i.exec(text);
  if (match === null) return null;
  const unit = UNITS[match[2]!.toUpperCase()];
  return unit === undefined ? null : Math.round(Number(match[1]) * unit);
}

/** A container's memory as `docker stats` reports it (streamed; the daemon refreshes it about every 0.5–1 s). */
export function dockerProbe(container: string): MemoryProbe {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(container)) throw new Error(`not a container name: ${container}`);
  const samples = new Samples();
  const child = spawn("docker", ["stats", "--format", "{{.MemUsage}}", container], { stdio: ["ignore", "pipe", "ignore"] });
  let rest = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    const lines = (rest + chunk).split("\n");
    rest = lines.pop() ?? "";
    for (const line of lines) {
      const bytes = parseDockerMemory(line);
      if (bytes !== null) samples.add(bytes);
    }
  });
  child.on("error", () => {});
  return {
    method: `container ${container}, \`docker stats\` (refreshed about every 0.5 s; the container's memory)`,
    mark(): void {},
    peak: (from, to) => samples.peak(from, to, 1000),
    async stop(): Promise<void> {
      if (child.exitCode !== null) return;
      const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
      child.kill("SIGTERM");
      await exited;
    },
  };
}
