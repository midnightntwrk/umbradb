import type { ProcessState } from "../../../src/runner/process.js";

/**
 * AE-4's readiness, as cases (task 8.2): `GET /health/ready` decides in this order — (1) 503 while `starting`,
 * `refused`, `halted` or `stopping`; (2) 200 while `stopped`, whatever the lag; (3) otherwise (`syncing` or
 * `following`) 200 when no readiness lag is set or the lag is at or below it, 503 when the lag exceeds it. The process's
 * conditions are no rule of AE-4: they never change readiness. Each case names the rule that decides it, and is built
 * so that a decision applying another rule first gets it wrong: a halted or stopping process within its readiness lag
 * (rule 1 before rule 3), a stopped one past it (rule 2 before rule 3), a `following` one past it (rule 3 applies to
 * `following` too, which task 5.3's first rule took as always ready), and processes with conditions.
 *
 * Imports nothing of Vitest: the oracle is applied to the real decision and to the negative controls' wrong ones.
 */

/** What a readiness decision reads (the conditions only so that a wrong decision may read them). */
export interface ReadinessCase {
  readonly state: ProcessState;
  readonly lag: bigint | null;
  readonly readinessLag: number | null;
  readonly conditions: readonly string[];
  readonly ready: boolean;
  /** The rule of AE-4 that decides it. */
  readonly rule: 1 | 2 | 3;
}

/** A readiness decision under test. */
export type Decision = (facts: Omit<ReadinessCase, "ready" | "rule">) => boolean;

const NOT_READY: readonly ProcessState[] = ["starting", "refused", "halted", "stopping"];

/** AE-4's cases (see the module comment). */
export const READINESS_CASES: readonly ReadinessCase[] = [
  // Rule 1: these states are never ready — whatever the lag, also within a set readiness lag, also with none set.
  ...NOT_READY.flatMap((state) =>
    [
      [0n, 10],
      [0n, null],
      [5n, 10],
      [null, null],
      [null, 10],
      [500n, 10],
    ].map(([lag, readinessLag]) => ({
      state,
      lag: lag as bigint | null,
      readinessLag: readinessLag as number | null,
      conditions: [],
      ready: false,
      rule: 1 as const,
    })),
  ),
  // Rule 2: stopped is ready whatever the lag (A65: lag 100, readiness lag 10), also with an upgrade boundary.
  { state: "stopped", lag: 100n, readinessLag: 10, conditions: [], ready: true, rule: 2 },
  { state: "stopped", lag: 100n, readinessLag: 10, conditions: ["upgrade-required"], ready: true, rule: 2 },
  { state: "stopped", lag: 0n, readinessLag: null, conditions: [], ready: true, rule: 2 },
  { state: "stopped", lag: null, readinessLag: 10, conditions: [], ready: true, rule: 2 },
  // Rule 3, syncing: A65's readiness lag 10 and lag 500, then at the boundary.
  { state: "syncing", lag: 500n, readinessLag: 10, conditions: [], ready: false, rule: 3 },
  { state: "syncing", lag: 11n, readinessLag: 10, conditions: [], ready: false, rule: 3 },
  { state: "syncing", lag: 10n, readinessLag: 10, conditions: [], ready: true, rule: 3 },
  { state: "syncing", lag: 4n, readinessLag: 10, conditions: [], ready: true, rule: 3 },
  { state: "syncing", lag: 500n, readinessLag: null, conditions: [], ready: true, rule: 3 },
  { state: "syncing", lag: 1n, readinessLag: 0, conditions: [], ready: false, rule: 3 },
  // No head read yet: no readiness lag set is ready; a lag that cannot be compared is not within one.
  { state: "syncing", lag: null, readinessLag: null, conditions: [], ready: true, rule: 3 },
  { state: "syncing", lag: null, readinessLag: 10, conditions: [], ready: false, rule: 3 },
  // Rule 3, following: A65's following threshold 20, readiness lag 10 and lag 15 is not ready.
  { state: "following", lag: 15n, readinessLag: 10, conditions: [], ready: false, rule: 3 },
  { state: "following", lag: 10n, readinessLag: 10, conditions: [], ready: true, rule: 3 },
  { state: "following", lag: 0n, readinessLag: 0, conditions: [], ready: true, rule: 3 },
  { state: "following", lag: 2n, readinessLag: null, conditions: [], ready: true, rule: 3 },
  // Conditions are no rule: a process retrying, or one whose source stalls, is ready by rule 3 alone.
  { state: "following", lag: 2n, readinessLag: 10, conditions: ["node-retrying"], ready: true, rule: 3 },
  { state: "syncing", lag: 8n, readinessLag: 10, conditions: ["database-retrying", "finality-stall"], ready: true, rule: 3 },
  { state: "syncing", lag: 12n, readinessLag: 10, conditions: ["node-retrying"], ready: false, rule: 3 },
  // A slow block (RN-17, task 5.5) changes no readiness either.
  { state: "following", lag: 1n, readinessLag: null, conditions: ["slow-block"], ready: true, rule: 3 },
  { state: "syncing", lag: 12n, readinessLag: 10, conditions: ["slow-block"], ready: false, rule: 3 },
];

/** One case in words, for a problem's message. */
export const caseText = (c: Omit<ReadinessCase, "ready" | "rule">): string =>
  `${c.state}, lag ${c.lag ?? "null"}, readiness lag ${c.readinessLag ?? "none"}` +
  (c.conditions.length === 0 ? "" : `, conditions ${c.conditions.join(" ")}`);

/** The oracle: every case `decide` gets wrong, with its rule. */
export function readinessProblems(decide: Decision): string[] {
  return READINESS_CASES.flatMap((c) => {
    const decided = decide({ state: c.state, lag: c.lag, readinessLag: c.readinessLag, conditions: c.conditions });
    return decided === c.ready ? [] : [`rule ${c.rule}: ${caseText(c)} decided ${decided ? 200 : 503}, not ${c.ready ? 200 : 503}`];
  });
}

/**
 * AE-4 as the spec words it, for answers observed through a process: the readiness an answer with this state, lag
 * (decimal text, as `/health/ready` shows it) and readiness lag must have.
 */
export function ae4(state: string, lag: string | null, readinessLag: number | null): boolean {
  if (state === "starting" || state === "refused" || state === "halted" || state === "stopping") return false;
  if (state === "stopped") return true;
  return readinessLag === null || (lag !== null && BigInt(lag) <= BigInt(readinessLag));
}

/** The lag within a readiness lag (rule 3's test). */
const within = (lag: bigint | null, readinessLag: number | null): boolean =>
  readinessLag === null || (lag !== null && lag <= BigInt(readinessLag));

/**
 * The negative controls' decisions: AE-4's rules applied in another order, or with a rule AE-4 does not have. Rule 1
 * and rule 2 apply to disjoint states, so the two in either order decide alike: that swap has no control.
 */
export const WRONG_DECISIONS: Readonly<Record<string, Decision>> = {
  /** Rule 3 first, for every state: the lag decides wherever a readiness lag is set. */
  "rule 3 before rules 1 and 2": ({ state, lag, readinessLag }) =>
    readinessLag !== null && lag !== null ? lag <= BigInt(readinessLag) : !NOT_READY.includes(state),
  /** Rule 3 before rule 2: a stopped process past its readiness lag is not ready. */
  "rule 3 before rule 2": ({ state, lag, readinessLag }) =>
    !NOT_READY.includes(state) && (state === "stopped" ? readinessLag === null || (lag !== null && lag <= BigInt(readinessLag)) : within(lag, readinessLag)),
  /** Task 5.3's first rule: `following` is ready before the lag is looked at. */
  "following before rule 3": ({ state, lag, readinessLag }) =>
    state === "following" || state === "stopped" || (state === "syncing" && within(lag, readinessLag)),
  /** A rule AE-4 does not have: any condition makes the process not ready. */
  "conditions as a rule": ({ state, lag, readinessLag, conditions }) =>
    conditions.length === 0 && (state === "stopped" || ((state === "syncing" || state === "following") && within(lag, readinessLag))),
};
