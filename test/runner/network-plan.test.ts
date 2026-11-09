import { describe, expect, it } from "vitest";
import { coreEntry } from "../../src/config/entries.js";
import { UmbraError } from "../../src/db/errors.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import {
  NETWORK_RULES,
  type NetworkInput,
  type NetworkRequest,
  type NetworkRule,
  type PlannedNetwork,
  planNetwork,
  resolve,
} from "../../src/runner/resolve.js";
import { coreSettings } from "./process-build.js";

/**
 * The network plan (`planNetwork`, `src/runner/resolve.ts`) `[CI][NEG]`: a network request and the addresses the
 * process's `core` revision writes, combined into one plan; the command's `"configured"` request derived from the
 * written addresses and admin's default; a host's request judged by N2–N5 (`network-address-conflict` with `both`,
 * `no-address`, `unused`; `private-link-misconfigured` with `wrong-side`, `reader-missing`). The negative control
 * plans every row without one rule: exactly that rule's refusals are gone, the plan of its rows following the same
 * reading. The engine's and `startUmbraDB`'s cases are in `test/library/network.test.ts`.
 */

const MEMORY = { kind: "pglite", memory: true } as const;
/** PostgreSQL's parts, which the plan reads only for their kind: nothing connects in these tests. */
const POSTGRES = { kind: "postgres", host: "127.0.0.1", port: 5432, user: "umbradb", name: "umbradb" } as const;
const READER = { user: "umbradb_transport", password: "reader" };

/** What a public process's configuration with `extra` `core` settings resolves to, as the plan reads it. */
function publicInput(extra: Readonly<Record<string, unknown>> = {}, database: unknown = MEMORY): NetworkInput {
  const data = { entries: [coreEntry({ start: 1, config: coreSettings(database as never, extra) as never })] };
  return resolve({ data, file: null, userModules: [] });
}

/** What a private process's configuration with `extra` `core` settings resolves to. */
function privateInput(extra: Readonly<Record<string, unknown>> = {}): NetworkInput {
  const config = { network: "preprod", database: MEMORY, instanceId: "instance-1", developmentOptIn: true, ...extra };
  return resolve({ data: { entries: [coreEntry({ start: 1, config: config as never })] }, file: null, userModules: [] });
}

/** The plan of `planned`, which must not be refused. */
function planOf(planned: PlannedNetwork) {
  if (planned.refusal !== null) throw planned.refusal;
  return planned.plan;
}

/** The refusal of `planned`, which must be refused. */
function refusalOf(planned: PlannedNetwork): UmbraError {
  if (planned.refusal === null) throw new Error(`expected a refusal, planned ${JSON.stringify(planned.plan)}`);
  return planned.refusal;
}

const connect = async (): Promise<PrivateLinkChannel> => {
  throw new Error("never called by the plan");
};

describe("the command's plan (\"configured\"): the written addresses and admin's default", () => {
  it("a public process listens at each written address, admin at 0.0.0.0:8081 when none is written", () => {
    expect(planOf(planNetwork(publicInput(), "configured"))).toEqual({
      configured: true,
      api: { mode: "none" },
      admin: { mode: "listening", address: { host: "0.0.0.0", port: 8081, text: "0.0.0.0:8081" } },
      privateLink: { mode: "none" },
    });
    const listen = { api: "127.0.0.1:7001", admin: "[::1]:7002", privateLink: "0.0.0.0:0" };
    expect(planOf(planNetwork(publicInput({ listen }), "configured"))).toEqual({
      configured: true,
      api: { mode: "listening", address: { host: "127.0.0.1", port: 7001, text: "127.0.0.1:7001" } },
      admin: { mode: "listening", address: { host: "::1", port: 7002, text: "[::1]:7002" } },
      privateLink: { mode: "listening", address: { host: "0.0.0.0", port: 0, text: "0.0.0.0:0" } },
    });
  });

  it("a private process connects to its privateLink; a listen.privateLink written on it is no surface of it", () => {
    const plan = planOf(
      planNetwork(privateInput({ privateLink: "127.0.0.1:7100", listen: { privateLink: "127.0.0.1:7101" } }), "configured"),
    );
    expect(plan.privateLink).toEqual({ mode: "connecting", address: { host: "127.0.0.1", port: 7100, text: "127.0.0.1:7100" } });
    expect(planOf(planNetwork(privateInput({ listen: { privateLink: "127.0.0.1:7101" } }), "configured")).privateLink).toEqual({
      mode: "none",
    });
  });

  it("never refuses, whatever is written: a PostgreSQL link is the schema's to judge", () => {
    const listen = { api: "127.0.0.1:7001", admin: "127.0.0.1:7002", privateLink: "127.0.0.1:7003" };
    expect(planNetwork(publicInput({ listen, transportReader: READER }, POSTGRES), "configured").refusal).toBeNull();
    expect(planNetwork(privateInput({ privateLink: "127.0.0.1:7004" }), "configured").refusal).toBeNull();
  });
});

describe("a host's request: what each form plans", () => {
  it("nothing asked: no listener, the handlers mounted, no link", () => {
    for (const request of [{}, { api: false, admin: false, privateLink: { publicSide: false, privateSide: false } }]) {
      expect(planOf(planNetwork(publicInput(), request))).toEqual({
        configured: false,
        api: { mode: "mounted" },
        admin: { mode: "mounted" },
        privateLink: { mode: "none" },
      });
    }
    expect(planOf(planNetwork(privateInput(), {})).privateLink).toEqual({ mode: "none" });
  });

  it("true listens at the written address; { host?, port } at the one given, 127.0.0.1 unless named, port 0 kept", () => {
    const written = publicInput({ listen: { api: "127.0.0.1:7001", admin: "0.0.0.0:7002", privateLink: "[::1]:7003" } });
    expect(planOf(planNetwork(written, { api: true, admin: true, privateLink: { publicSide: true } }))).toEqual({
      configured: false,
      api: { mode: "listening", address: { host: "127.0.0.1", port: 7001, text: "127.0.0.1:7001" } },
      admin: { mode: "listening", address: { host: "0.0.0.0", port: 7002, text: "0.0.0.0:7002" } },
      privateLink: { mode: "listening", address: { host: "::1", port: 7003, text: "[::1]:7003" } },
    });
    const given: NetworkRequest = {
      api: { port: 0 },
      admin: { host: "::1", port: 9001 },
      privateLink: { publicSide: { host: "0.0.0.0", port: 9002 } },
    };
    expect(planOf(planNetwork(publicInput(), given))).toEqual({
      configured: false,
      api: { mode: "listening", address: { host: "127.0.0.1", port: 0, text: "127.0.0.1:0" } },
      admin: { mode: "listening", address: { host: "::1", port: 9001, text: "[::1]:9001" } },
      privateLink: { mode: "listening", address: { host: "0.0.0.0", port: 9002, text: "0.0.0.0:9002" } },
    });
  });

  it("the link over channels: the public side's { channels: true }, the private side's { connect }", () => {
    expect(planOf(planNetwork(publicInput(), { privateLink: { publicSide: { channels: true } } })).privateLink).toEqual({
      mode: "channels",
    });
    expect(planOf(planNetwork(privateInput(), { privateLink: { privateSide: { connect } } })).privateLink).toEqual({
      mode: "connect",
      connect,
    });
  });

  it("a private process connects at its privateLink (true) or the address given; a listen.privateLink on it is ignored", () => {
    expect(planOf(planNetwork(privateInput({ privateLink: "127.0.0.1:7100" }), { privateLink: { privateSide: true } })).privateLink).toEqual({
      mode: "connecting",
      address: { host: "127.0.0.1", port: 7100, text: "127.0.0.1:7100" },
    });
    const ignored = privateInput({ listen: { privateLink: "127.0.0.1:7101" } });
    expect(planOf(planNetwork(ignored, { privateLink: { privateSide: { port: 7102 } } })).privateLink).toEqual({
      mode: "connecting",
      address: { host: "127.0.0.1", port: 7102, text: "127.0.0.1:7102" },
    });
    expect(planOf(planNetwork(ignored, {})).privateLink).toEqual({ mode: "none" });
  });
});

/** One refused request: the process, the request, and the refusal's code, reason and paths. */
interface Row {
  readonly name: string;
  readonly rule: NetworkRule["name"];
  readonly input: () => NetworkInput;
  readonly request: NetworkRequest;
  readonly code: "network-address-conflict" | "private-link-misconfigured";
  readonly request_: string;
  readonly setting: string | null;
}

/** Every refusal of N2–N5, one row per surface it can name. */
const ROWS: readonly Row[] = [
  // N2, both: an address written and given in code, for each surface of each side.
  { name: "listen.api and api: { port }", rule: "both", input: () => publicInput({ listen: { api: "127.0.0.1:7001" } }), request: { api: { port: 9000 } }, code: "network-address-conflict", request_: "network.api", setting: "listen.api" },
  { name: "listen.admin and admin: { host, port }", rule: "both", input: () => publicInput({ listen: { admin: "127.0.0.1:7002" } }), request: { admin: { host: "127.0.0.1", port: 0 } }, code: "network-address-conflict", request_: "network.admin", setting: "listen.admin" },
  { name: "listen.privateLink and publicSide: { port }", rule: "both", input: () => publicInput({ listen: { privateLink: "127.0.0.1:7003" } }), request: { privateLink: { publicSide: { port: 0 } } }, code: "network-address-conflict", request_: "network.privateLink.publicSide", setting: "listen.privateLink" },
  { name: "privateLink and privateSide: { port }", rule: "both", input: () => privateInput({ privateLink: "127.0.0.1:7004" }), request: { privateLink: { privateSide: { port: 7004 } } }, code: "network-address-conflict", request_: "network.privateLink.privateSide", setting: "privateLink" },
  // N2, no-address: true with nothing written.
  { name: "admin: true, no listen.admin", rule: "no-address", input: () => publicInput(), request: { admin: true }, code: "network-address-conflict", request_: "network.admin", setting: "listen.admin" },
  { name: "api: true, no listen.api", rule: "no-address", input: () => publicInput(), request: { api: true }, code: "network-address-conflict", request_: "network.api", setting: "listen.api" },
  { name: "publicSide: true, no listen.privateLink", rule: "no-address", input: () => publicInput(), request: { privateLink: { publicSide: true } }, code: "network-address-conflict", request_: "network.privateLink.publicSide", setting: "listen.privateLink" },
  { name: "privateSide: true, no privateLink", rule: "no-address", input: () => privateInput(), request: { privateLink: { privateSide: true } }, code: "network-address-conflict", request_: "network.privateLink.privateSide", setting: "privateLink" },
  // N3, unused: written and not asked for, or asked for over channels.
  { name: "listen.api, api not asked for", rule: "unused", input: () => publicInput({ listen: { api: "127.0.0.1:7001" } }), request: {}, code: "network-address-conflict", request_: "network.api", setting: "listen.api" },
  { name: "listen.admin, admin: false", rule: "unused", input: () => publicInput({ listen: { admin: "127.0.0.1:7002" } }), request: { admin: false }, code: "network-address-conflict", request_: "network.admin", setting: "listen.admin" },
  { name: "listen.privateLink, the link not asked for", rule: "unused", input: () => publicInput({ listen: { privateLink: "127.0.0.1:7003" } }), request: {}, code: "network-address-conflict", request_: "network.privateLink.publicSide", setting: "listen.privateLink" },
  { name: "listen.privateLink, publicSide: { channels: true }", rule: "unused", input: () => publicInput({ listen: { privateLink: "127.0.0.1:7003" } }), request: { privateLink: { publicSide: { channels: true } } }, code: "network-address-conflict", request_: "network.privateLink.publicSide", setting: "listen.privateLink" },
  { name: "privateLink, the link not asked for", rule: "unused", input: () => privateInput({ privateLink: "127.0.0.1:7004" }), request: {}, code: "network-address-conflict", request_: "network.privateLink.privateSide", setting: "privateLink" },
  { name: "privateLink, privateSide: { connect }", rule: "unused", input: () => privateInput({ privateLink: "127.0.0.1:7004" }), request: { privateLink: { privateSide: { connect } } }, code: "network-address-conflict", request_: "network.privateLink.privateSide", setting: "privateLink" },
  // N4, wrong-side: the other side's request of the link.
  { name: "privateSide on a public process", rule: "wrong-side", input: () => publicInput(), request: { privateLink: { privateSide: { port: 7004 } } }, code: "private-link-misconfigured", request_: "network.privateLink.privateSide", setting: null },
  { name: "publicSide on a private process", rule: "wrong-side", input: () => privateInput(), request: { privateLink: { publicSide: { channels: true } } }, code: "private-link-misconfigured", request_: "network.privateLink.publicSide", setting: null },
  // N5, reader-missing: a PostgreSQL public link given in the request without transportReader.
  { name: "PostgreSQL, publicSide: { channels: true }", rule: "reader-missing", input: () => publicInput({}, POSTGRES), request: { privateLink: { publicSide: { channels: true } } }, code: "private-link-misconfigured", request_: "network.privateLink.publicSide", setting: "transportReader" },
  { name: "PostgreSQL, publicSide: { host, port }", rule: "reader-missing", input: () => publicInput({}, POSTGRES), request: { privateLink: { publicSide: { host: "127.0.0.1", port: 0 } } }, code: "private-link-misconfigured", request_: "network.privateLink.publicSide", setting: "transportReader" },
];

describe("a host's request: the refusals of N2–N5", () => {
  it.each(ROWS)("$name: refused $code ($rule), naming the request and the setting", (row) => {
    const refusal = refusalOf(planNetwork(row.input(), row.request));
    expect(refusal).toBeInstanceOf(UmbraError);
    expect(refusal.code).toBe(row.code);
    expect(refusal.details).toMatchObject({ reason: row.rule, request: row.request_, setting: row.setting });
    expect(refusal.details.problems).toEqual([
      { code: row.code, reason: row.rule, surface: expect.any(String), request: row.request_, setting: row.setting },
    ]);
    expect(refusal.message).toContain(row.request_);
    if (row.setting !== null) expect(refusal.message).toContain(row.setting);
  });

  it("a written address the request uses is no conflict: true with it written, or false of the other side", () => {
    const listen = { api: "127.0.0.1:7001", admin: "127.0.0.1:7002", privateLink: "127.0.0.1:7003" };
    expect(planNetwork(publicInput({ listen }), { api: true, admin: true, privateLink: { publicSide: true, privateSide: false } }).refusal).toBeNull();
    expect(planNetwork(privateInput(), { privateLink: { publicSide: false } }).refusal).toBeNull();
  });

  it("with transportReader, a PostgreSQL public link in the request is planned; PGlite needs none", () => {
    for (const publicSide of [{ channels: true as const }, { host: "127.0.0.1", port: 0 }]) {
      expect(planNetwork(publicInput({ transportReader: READER }, POSTGRES), { privateLink: { publicSide } }).refusal).toBeNull();
      expect(planNetwork(publicInput(), { privateLink: { publicSide } }).refusal).toBeNull();
    }
  });

  it("every problem of a request is listed, the first one's code, reason and paths the refusal's own", () => {
    const input = publicInput({ listen: { api: "127.0.0.1:7001" } }, POSTGRES);
    const refusal = refusalOf(
      planNetwork(input, { admin: true, privateLink: { publicSide: { channels: true }, privateSide: { port: 1 } } }),
    );
    expect(refusal.code).toBe("network-address-conflict");
    expect(refusal.details).toMatchObject({ reason: "no-address", surface: "admin", request: "network.admin", setting: "listen.admin" });
    expect((refusal.details.problems as readonly { readonly reason: string }[]).map((problem) => problem.reason)).toEqual([
      "no-address",
      "unused",
      "wrong-side",
      "reader-missing",
    ]);
    expect(refusal.message).toMatch(/^the network request was refused \(4 problems\): /);
  });

  it("names no address and no secret: the messages are made of paths, the side and the revision's start", () => {
    const secret = "pw-NETWORK-reader";
    const input = publicInput({ listen: { api: "10.1.2.3:7001" }, tls: { certificate: "c", key: secret, trustedRoots: [] } });
    const refusal = refusalOf(planNetwork(input, { api: { host: "10.9.9.9", port: 9000 } }));
    expect(refusal.message).not.toContain("10.1.2.3");
    expect(refusal.message).not.toContain("10.9.9.9");
    expect(refusal.message).not.toContain(secret);
    expect(refusal.message).toContain("the core revision from 1");
  });
});

describe("negative control: the plan without one rule lets exactly that rule's rows through", () => {
  it("has rows for every rule, each refused by its own rule only", () => {
    expect(new Set(ROWS.map((row) => row.rule))).toEqual(new Set(NETWORK_RULES.map((rule) => rule.name)));
  });

  for (const removed of NETWORK_RULES) {
    it(`without ${removed.name}`, () => {
      const rules = NETWORK_RULES.filter((rule) => rule !== removed);
      for (const row of ROWS) {
        const planned = planNetwork(row.input(), row.request, rules);
        if (row.rule === removed.name) expect(planned.refusal, row.name).toBeNull();
        else expect(planned.refusal?.details.reason, row.name).toBe(row.rule);
      }
    });
  }

  it("the plan of a request a removed rule let through: the address in code wins, true with none written listens nowhere", () => {
    const none: readonly NetworkRule[] = [];
    expect(planOf(planNetwork(publicInput({ listen: { api: "127.0.0.1:7001" } }), { api: { port: 9000 } }, none)).api).toEqual({
      mode: "listening",
      address: { host: "127.0.0.1", port: 9000, text: "127.0.0.1:9000" },
    });
    expect(planOf(planNetwork(publicInput(), { admin: true }, none)).admin).toEqual({ mode: "mounted" });
    expect(planOf(planNetwork(privateInput(), { privateLink: { privateSide: true } }, none)).privateLink).toEqual({ mode: "none" });
    expect(planOf(planNetwork(publicInput(), { privateLink: { privateSide: { port: 1 } } }, none)).privateLink).toEqual({
      mode: "none",
    });
  });
});
