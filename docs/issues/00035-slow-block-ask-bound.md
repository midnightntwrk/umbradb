# 00035 — a slow-block test bounds the report from the source's ask, but the loop's window opens before the ask

- **Status:** CLOSED — fixed by task 17.5a (2026-10-27): the case bounds the report at more than 1 s after the ask,
  between the ask's 1.5 s (less the moment between the window's opening and the ask) and the queue's start's 0.6 s at
  most, and height 2's `on-parse` holds 6 s, so it still runs at the report however long height 1's commit takes.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** test
- **Severity:** med
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`test/runner/slow-block-cases.test.ts`'s case "a height whose on-parse already runs in the queue when the loop asks
for it: from the ask, that point and module" (task 5.5's slow-block watchdog, RN-17, A142) checks that the slow
report came more than `slowBlockMs` (1,500 ms) after the block source was asked for the height:
`shown[0].at - asked > 1_500`.
The loop opens the height's window, and starts its 1,500 ms timer, in `#watchHeight`, before `#begin` asks the source
for the block; the test's `asked` is taken inside the source's `block` call, a little later. So the report is raised
1,500 ms after a moment slightly before `asked`, and the check passes only while the status poll's lag (up to 20 ms)
is longer than the gap between the window opening and the ask. Under load the gap can be the longer one.

Found by task 16.1's conformance run (2026-10-27, load averages up to 28 with other lanes testing): the case failed
on PostgreSQL 18 with `expected 1499.3612500000017 to be greater than 1500`. Task 16.1 does not touch the runner, the
loop or this test; the case tells "from the ask" (about 1,500 ms after the ask) apart from "from the queue's start"
(about 600 ms after it), which a bound a few milliseconds lower still does.

## Evidence

- `test/runner/slow-block-cases.test.ts:368`: `expect(shown[0]!.at - asked).toBeGreaterThan(1_500);`
- `test/runner/slow-block-harness.ts:143` (`askedSource`): `asked.set(height, performance.now())` inside `block`.
- `src/runner/loop.ts:755`: `const watch = this.#watchHeight(height);` before `this.#begin(height, previous)`, which
  asks the source; `src/runner/loop.ts:799`–`809`: a height the queue already prepares opens its window there
  (`#open`: `watch.began = performance.now()`, `setTimeout(…, ms)`).
- `test/runner/slow-block-harness.ts:288`–`294` (`observe`): `/status` polled every 20 ms, `at` the poll's time.

## Suggested fix

Bound the report from the window's opening rather than from the ask, or keep the ask and allow the gap: for example
`expect(shown[0]!.at - asked).toBeGreaterThan(1_500 - 50)` with a comment saying the window opens just before the ask,
which still tells the ask (about 1,500 ms) from the queue's start (about 600 ms). Alternatively record `asked` from the
loop's own observer when the window opens.
