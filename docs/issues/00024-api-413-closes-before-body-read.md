# 00024 — The module API listener closes a refused request's connection before its client has sent the body

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 5.2b of `openspec/changes/core-arch`, when
  `test/runner/api-server.test.ts`'s "answers a body larger than its limit with 413 request-too-large, and a body that
  is not UTF-8 with 400" failed twice with `TypeError: fetch failed` in runs of `test/runner` on a loaded machine
  (passing 15 of 15 times when run alone). The code involved is task 5.2a's; task 5.2b did not change it.

## Problem

When a request body passes the listener's limit (`maxBodyBytes`, 1 MiB by default), the listener answers 413
`request-too-large` with `Connection: close` and ends the connection while the client may still be writing the rest of
the body. The client then gets `ECONNRESET` or `EPIPE` on its write, and an HTTP client that reports a failed write
before reading the response (Node.js's `fetch`, undici) never sees the 413: the client is told the request failed
rather than that its body was too large.

A scratch script posting a 1,000,000-byte body 300 times to a listener with `maxBodyBytes: 16` (the test's last
request) got the 413 244 times and `fetch failed` 56 times (`ECONNRESET` 39, `EPIPE` 17), at a load average of about 7.

## Evidence

- `src/runner/api-server.ts:216` — `readBody` stops reading at the limit (`finish({ refused: … })`), and later chunks
  are ignored, not drained.
- `src/runner/api-server.ts:234-236` — `serve` answers the refusal with `Connection: close`; Node.js closes the socket
  once the response ends, with the client's body still in flight.
- `test/runner/api-server.test.ts:665` — the request of 1,000,000 bytes whose `fetch` fails.

## Suggested fix

After a refusal for size, keep reading and discarding the request body for a bounded time or number of bytes (a
lingering close, RFC 9112 §9.6) — for example `request.resume()` and a timer that destroys the socket after 1 s or
after 16 MiB more — so the client finishes its write and reads the 413. The test then asserts the 413 for the large
body under load; a test that sends a body which never ends checks that the bound still closes the connection.
