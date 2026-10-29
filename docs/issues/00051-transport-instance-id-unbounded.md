# 00051 — The transport's instance id is any text: line breaks reach the core's log

- **Status:** CLOSED — fixed 2026-10-29: one rule (`src/private/instance-id.ts`: 1 to 128 of `[A-Za-z0-9._:-]`) bounds a
  `hello`'s `instance`, `instanceId` and `lockstepInstances`; any other id fails the message schema or is refused at
  startup.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

A private process names itself in its `hello` with `instance`, which the schema takes as any non-empty string: no
length bound beyond the 64 MiB message, and any characters, line breaks and control characters included. The core
writes the id into its log lines as received — the connection, the disconnection, every close and, since task 14.2b,
every refused read — and shows it in `/status` (`privateInstances`). A peer of a plain (unauthenticated) transport, or
any peer with a trusted certificate under mutual TLS (issue 00045: the id is not bound to the certificate), can send an
id holding `\n` and a forged line, so the core's log shows a line the core never wrote; a very long id fills each line
and the status answer. A `read`'s `id` is bounded (1 to 128 characters) but not its characters either; it is not
logged.

Found while building task 14.2b (2026-10-28), whose refusal log line names the instance as the other lines do; the
names task 14.2b adds itself (a refused statement's first word or function) are reported in printable ASCII, at most 64
characters (`src/private/read-gate.ts`).

## Evidence

- `src/private/messages.ts:97`: `instance: z.string().min(1)` — no maximum, no character rule.
- `src/private/core-transport.ts:273`, `:321`, `:338`, `:347`, `:369`, `:469`, `:481`: log lines holding
  `hello.instance` as received.
- `src/private/instances.ts`: the id in `/status`'s `privateInstances`.

## Suggested fix

Give one id rule to `hello.instance`, the `core` entry's `instanceId` and its `lockstepInstances`
(`src/config/core-settings.ts:178`, `:188`: any non-empty text today) — DB-8's `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, say,
within 1 to 128 characters —, so a `hello` with any other id fails its schema and closes the connection (PP-4), and a
configuration naming one is refused at startup. Bound `read.id` to printable ASCII as well. Together with issue 00045,
an id would then be both well formed and bound to its certificate.
