import { z } from "zod";
import { describe, expect, it } from "vitest";
import { commandBuild, CORE_MODULES, PUBLIC_BACKBONE } from "../../src/cli/build-modules.js";
import { privateIntake } from "../../src/backbone/core-private-source/index.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { coreEntry, versionEntry } from "../../src/config/entries.js";
import { plainData } from "../../src/config/plain-data.js";
import { processCoreEntry } from "../../src/config/process.js";
import { redactor } from "../../src/config/redact.js";
import { configSecrets, validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import {
  inferSide,
  knownSecrets,
  refusalSecrets,
  resolve,
  resolveConfig,
  resolveDeclarations,
  resolveSide,
} from "../../src/runner/resolve.js";
import { coreSettings } from "./process-build.js";

/**
 * The resolver (`src/runner/resolve.ts`) `[CI]`: the one place where a build's declarations and its configuration are
 * assembled, for the engine, `umbradb config check`, `umbradb backup`, `umbradb restore` and the browser demo. Each
 * stage gives what the steps it replaces gave, and throws their refusals unchanged, carrying the loaded configuration's
 * secrets for the caller's redaction.
 *
 * Also the secrets known before the validation (`knownSecrets`), for a refusal that comes before it: by the kinds the
 * build's modules declare, fail closed for an entry whose module is not known yet or not readable.
 */

const MEMORY = { kind: "pglite", memory: true } as const;
/** A node URL with credentials, and a TLS key: the core entry's secrets the refusals must be redactable of. */
const NODE = "ws://reader:pw-RESOLVE-node@127.0.0.1:9/node";
const KEY = "-----BEGIN PRIVATE KEY-----pw-RESOLVE-key-----END PRIVATE KEY-----";
const TLS = { certificate: "cert-RESOLVE", key: KEY, trustedRoots: ["root-RESOLVE"] };

/** A user module `id` with one operational setting. */
const userModule = (id: string): ModuleDeclaration =>
  defineModule({
    id,
    version: "1.2.0",
    side: "public",
    requires: ["block-header"],
    provides: [],
    startsMidChain: true,
    migrations: [],
    points: {},
    configSchema: z.object({ pollMs: z.number().int().default(1).meta({ kind: "operational" }) }),
  });

/** A public configuration on PGlite in memory, with `extra` `core` settings and further entries. */
function publicData(extra: Readonly<Record<string, unknown>> = {}, entries: readonly unknown[] = []) {
  return { entries: [coreEntry({ start: 1, config: coreSettings(MEMORY, { node: NODE, tls: TLS, ...extra }) as never }), ...entries] };
}

/** A private configuration on PGlite in memory, with `extra` `core` settings. */
function privateData(extra: Readonly<Record<string, unknown>> = {}) {
  const settings = { network: "preprod", database: MEMORY, instanceId: "instance-1", developmentOptIn: true, tls: TLS, ...extra };
  return { entries: [coreEntry({ start: 1, config: settings as never })] };
}

/** What `body` throws. */
function thrown(body: () => unknown): unknown {
  try {
    body();
  } catch (error) {
    return error;
  }
  throw new Error("expected it to throw");
}

const ids = (parts: readonly { readonly id: string }[]) => parts.map((part) => part.id);

describe("the side (inferSide, resolveSide)", () => {
  it("private when a core entry has instanceId and none has node; public otherwise", () => {
    const entry = (config: Record<string, unknown>) => ({ id: "core", start: 0, config });
    expect(inferSide({ entries: [entry({ instanceId: "a" })] })).toBe("private");
    expect(inferSide({ entries: [entry({ instanceId: "a" }), entry({ node: "ws://n" })] })).toBe("public");
    expect(inferSide({ entries: [entry({ node: "ws://n" })] })).toBe("public");
    expect(inferSide({ entries: [entry({})] })).toBe("public");
    expect(inferSide({ entries: [{ id: "m", start: 0, config: { instanceId: "a" } }] })).toBe("public");
    expect(inferSide({ entries: "none" })).toBe("public");
    expect(inferSide(null)).toBe("public");
    expect(inferSide({ entries: [null, { id: "core", config: null }, entry({ instanceId: "a" })] })).toBe("private");
  });

  it("resolveSide keeps a side given, and infers it from the data otherwise", () => {
    expect(resolveSide(privateData())).toBe("private");
    expect(resolveSide(privateData(), "public")).toBe("public");
    expect(resolveSide(publicData(), "private")).toBe("private");
    expect(resolveSide(publicData())).toBe("public");
  });
});

describe("resolveDeclarations: the command's build for a side, validated", () => {
  it("a public build: UmbraDB's backbone and core modules, then the user modules in their order, the same objects", () => {
    const stats = userModule("stats");
    const prices = userModule("prices");
    const build = resolveDeclarations({ userModules: [prices, stats], side: "public" });
    expect(build.backbone).toEqual(PUBLIC_BACKBONE);
    expect(build.core).toEqual(CORE_MODULES);
    expect(build.user).toEqual([prices, stats]);
    expect(build.user[1]).toBe(stats);
    expect(build).toEqual(validateDeclarations(commandBuild([prices, stats])));
  });

  it("a private build: core-chain, the private backbone of the intake given, the admin parts, no core module", () => {
    const intake = privateIntake();
    const build = resolveDeclarations({ userModules: [], side: "private", intake });
    expect(ids(build.backbone)).toEqual(["core-chain", "core-private-source", "core-digest", "core-health", "core-status", "core-config"]);
    expect(build.backbone[1]).toBe(intake.part);
    expect(build.core).toEqual([]);
  });

  it("throws validateDeclarations' refusal unchanged: a user module listed twice, at its second place", () => {
    const stats = userModule("stats");
    const error = thrown(() => resolveDeclarations({ userModules: [stats, stats], side: "public" }));
    const expected = thrown(() => validateDeclarations(commandBuild([stats, stats])));
    expect(error).toBeInstanceOf(UmbraError);
    expect(error).toMatchObject({ code: "duplicate-id" });
    expect((error as UmbraError).details).toEqual((expected as UmbraError).details);
    expect((error as UmbraError).message).toBe((expected as UmbraError).message);
  });

  it("validates a test's build given in place of the command's", () => {
    const stats = userModule("stats");
    const build = resolveDeclarations({ userModules: [], side: "public", build: { backbone: [...PUBLIC_BACKBONE], core: [], user: [stats] } });
    expect(build.core).toEqual([]);
    expect(build.user).toEqual([stats]);
  });
});

describe("resolveConfig: plain data, validation, the process's core revision and its written addresses", () => {
  const declarations = resolveDeclarations({ userModules: [], side: "public" });

  it("gives what validateConfig and processCoreEntry give, with the side inferred from the data", () => {
    const data = publicData({ listen: { api: "127.0.0.1:7001" } });
    const resolved = resolveConfig({ data, file: "/a/umbradb.config.ts", declarations });
    const checked = validateConfig({ config: { file: "/a/umbradb.config.ts", data: plainData(data) }, declarations, side: "public" });
    expect(resolved.checked).toEqual(checked);
    expect(resolved.side).toBe("public");
    expect(resolved.core).toEqual(processCoreEntry(checked));
    expect(resolved.checked.file).toBe("/a/umbradb.config.ts");
  });

  it("the written addresses, before the schema's defaults: admin null when not written, though the settings have 0.0.0.0:8081", () => {
    const silent = resolveConfig({ data: publicData(), file: null, declarations });
    expect((silent.core.settings?.listen as { admin: string }).admin).toBe("0.0.0.0:8081");
    expect(silent.surfaces).toEqual({ api: null, admin: null, privateLink: null });
    const written = resolveConfig({
      data: publicData({ listen: { api: "127.0.0.1:7001", admin: "127.0.0.1:7002", privateLink: "127.0.0.1:7003" } }),
      file: null,
      declarations,
    });
    expect(written.surfaces).toEqual({ api: "127.0.0.1:7001", admin: "127.0.0.1:7002", privateLink: "127.0.0.1:7003" });
  });

  it("the addresses of the process's own core revision: the latest of the build's version, not an earlier one", () => {
    const later = coreEntry({ start: 50, config: coreSettings(MEMORY, { listen: { api: "127.0.0.1:7050" } }) as never });
    const data = { entries: [...publicData({ listen: { api: "127.0.0.1:7001" } }).entries, later] };
    const resolved = resolveConfig({ data, file: null, declarations });
    expect(resolved.core.index).toBe(1);
    expect(resolved.surfaces.api).toBe("127.0.0.1:7050");
  });

  it("a private process connects at privateLink; a listen.privateLink written there is no surface of it", () => {
    const build = resolveDeclarations({ userModules: [], side: "private" });
    const resolved = resolveConfig({
      data: privateData({ privateLink: "127.0.0.1:7004", listen: { privateLink: "127.0.0.1:7005", api: "127.0.0.1:7006" } }),
      file: null,
      declarations: build,
    });
    expect(resolved.side).toBe("private");
    expect(resolved.surfaces).toEqual({ api: "127.0.0.1:7006", admin: null, privateLink: "127.0.0.1:7004" });
  });

  it("throws validateConfig's refusal unchanged, carrying the configuration's secrets (configSecrets) for the redaction", () => {
    const data = publicData({}, [{ id: "stats", start: 1, version: "1.2.0", config: { pollMs: 5 } }]);
    const error = thrown(() => resolveConfig({ data, file: "/a/umbradb.config.ts", declarations }));
    const plain = plainData(data);
    const expected = thrown(() => validateConfig({ config: { file: "/a/umbradb.config.ts", data: plain }, declarations, side: "public" }));
    expect(error).toBeInstanceOf(UmbraError);
    expect((error as UmbraError).code).toBe("invalid-configuration");
    expect((error as UmbraError).message).toBe((expected as UmbraError).message);
    expect((error as UmbraError).details).toEqual((expected as UmbraError).details);
    const secrets = refusalSecrets(error);
    expect(secrets).toEqual(configSecrets({ config: { file: "/a/umbradb.config.ts", data: plain }, declarations, side: "public" }));
    expect(secrets).toEqual(expect.arrayContaining([NODE, KEY]));
    expect(redactor(secrets).text(`a text naming ${NODE} and ${KEY}`)).not.toMatch(/pw-RESOLVE/);
  });

  it("throws processCoreEntry's refusal unchanged (no core revision of the build's version), carrying the secrets", () => {
    const version = { ...buildCoreVersion(), umbradb: "0.0.1" } as never;
    const data = { entries: [versionEntry({ id: "core", start: 1, version, config: { node: NODE } as never })] };
    const error = thrown(() => resolveConfig({ data, file: "/a/versions.config.ts", declarations }));
    const checked = validateConfig({ config: { file: "/a/versions.config.ts", data }, declarations, side: "public" });
    const expected = thrown(() => processCoreEntry(checked));
    expect(error).toMatchObject({ code: "invalid-configuration", details: { reason: "no-build-core-revision" } });
    expect((error as UmbraError).message).toBe((expected as UmbraError).message);
    expect(refusalSecrets(error)).toEqual(configSecrets({ config: { file: "/a/versions.config.ts", data }, declarations, side: "public" }));
  });

  it("the negative controls' choice of the core revision is used when given, and its refusal carries the secrets", () => {
    const data = publicData({ listen: { api: "127.0.0.1:7001" } });
    const refusal = new UmbraError("invalid-configuration", "a control's refusal", { reason: "no-build-core-revision" });
    const error = thrown(() =>
      resolveConfig({
        data,
        file: null,
        declarations,
        processCore: () => {
          throw refusal;
        },
      }),
    );
    expect(error).toBe(refusal);
    expect(refusalSecrets(error)).toEqual(expect.arrayContaining([NODE, KEY]));
  });

  it("holds the data to the plain-data rules first: a function refuses not-plain-data at its path, with no secrets read", () => {
    const data = publicData({ onError: () => 0 });
    const error = thrown(() => resolveConfig({ data, file: "/a/umbradb.config.ts", declarations }));
    expect(error).toMatchObject({ code: "not-plain-data", details: { path: "entries[0].config.onError" } });
    expect(refusalSecrets(error)).toEqual([]);
  });

  it("a value thrown that is not an object carries no secrets; neither does a refusal the resolver did not throw", () => {
    expect(refusalSecrets("a string")).toEqual([]);
    expect(refusalSecrets(new Error("other"))).toEqual([]);
  });
});

describe("resolve: the declarations, then the configuration, and how the engine reads the chain", () => {
  it("a public build: its declarations, the checked configuration, no private intake, the node as its source", () => {
    const stats = userModule("stats");
    const data = publicData({}, [{ id: "stats", start: 1, version: "1.2.0", config: { pollMs: 5 } }]);
    const resolved = resolve({ data, file: null, userModules: [stats] });
    expect(resolved.declarations.user).toEqual([stats]);
    expect(ids(resolved.declarations.backbone)).toEqual(ids(PUBLIC_BACKBONE));
    expect(resolved.side).toBe("public");
    expect(resolved.privateIntake).toBeNull();
    expect(resolved.sourceKind).toBe("node");
    expect(resolved.checked.entries.map((entry) => entry.id)).toEqual(["core", "stats"]);
    expect(resolved.core.id).toBe("core");
  });

  it("a private build: a new intake, its part in the backbone, the intake as its source", () => {
    const resolved = resolve({ data: privateData(), file: null, userModules: [] });
    expect(resolved.side).toBe("private");
    expect(resolved.sourceKind).toBe("private");
    expect(resolved.privateIntake).not.toBeNull();
    expect(resolved.declarations.backbone[1]).toBe(resolved.privateIntake?.part);
    const given = privateIntake();
    expect(resolve({ data: privateData(), file: null, userModules: [], intake: given }).privateIntake).toBe(given);
  });

  it("a test's build in place of the command's: no intake is made for it", () => {
    const build = { backbone: commandBuild([], { side: "private", intake: privateIntake() }).backbone, core: [], user: [] };
    const resolved = resolve({ data: privateData(), file: null, userModules: [], declarations: build });
    expect(resolved.privateIntake).toBeNull();
    expect(resolved.sourceKind).toBe("private");
  });

  it("stops at the declarations: their refusal unchanged, before the configuration is validated, with no secrets", () => {
    const error = thrown(() => resolve({ data: { entries: "not validated" }, file: null, userModules: [{ id: "Bad" }] }));
    expect(error).toMatchObject({ code: "invalid-declaration" });
    expect(refusalSecrets(error)).toEqual([]);
  });

  it("then the configuration: its refusal unchanged, with its secrets", () => {
    const data = publicData({}, [{ id: "stats", start: 1, version: "1.2.0", config: {} }]);
    const error = thrown(() => resolve({ data, file: null, userModules: [] }));
    expect(error).toMatchObject({ code: "invalid-configuration", details: { reason: "invalid-entries" } });
    expect(refusalSecrets(error)).toEqual(expect.arrayContaining([NODE, KEY]));
  });

  it("a side given wins over the data's (config check's --side): a private field in a public core entry is named as such", () => {
    const error = thrown(() => resolve({ data: privateData(), file: null, userModules: [], side: "public" }));
    expect(error).toMatchObject({ code: "invalid-configuration" });
    expect(JSON.stringify((error as UmbraError).details)).toContain("instanceId");
  });
});

describe("knownSecrets: the data's secrets before the validation", () => {
  /** A user module entry of `module` holding `config`. */
  const entryOf = (id: string, config: Readonly<Record<string, unknown>>) => ({ id, start: 1, version: "1.2.0", config });
  const secretModule = defineModule({
    ...userModule("keyed"),
    configSchema: z.object({
      apiKey: z.string().meta({ kind: "secret" }),
      table: z.string().meta({ kind: "data" }),
    }),
  });
  const data = publicData({}, [entryOf("keyed", { apiKey: "pw-KNOWN-key", table: "plain-KNOWN-table" })]);

  it("with the user modules known: each entry's by its module's kinds, as the validation reads them", () => {
    const secrets = knownSecrets(data, [secretModule]);
    expect(secrets).toEqual(expect.arrayContaining([NODE, KEY, "pw-KNOWN-key"]));
    expect(secrets).not.toContain("plain-KNOWN-table");
    // The validation's own reading of them, once the build is validated, is the same.
    const declarations = resolveDeclarations({ userModules: [secretModule], side: "public" });
    expect([...secrets].sort()).toEqual([...configSecrets({ config: { data: plainData(data) }, declarations, side: "public" })].sort());
  });

  it("with the user modules not known yet, or not readable as declarations: every string of an entry of no module the build holds", () => {
    for (const modules of [null, [null]]) {
      const secrets = knownSecrets(data, modules);
      expect(secrets).toEqual(expect.arrayContaining([NODE, KEY, "pw-KNOWN-key", "plain-KNOWN-table"]));
    }
  });

  it("data that is not plain data: the secrets of what is plain in it, read without a getter; never a throw", () => {
    const plain = [...knownSecrets(data, [secretModule])].sort();
    // A value the plain-data rules refuse, at the core entry, in a module's entry and as an entry: left out, the rest read.
    let reads = 0;
    const refused = (value: unknown) => {
      const copy = structuredClone(data) as { entries: unknown[] };
      const core = copy.entries[0] as { config: Record<string, unknown> };
      core.config.tipCap = value;
      (copy.entries[1] as { config: Record<string, unknown> }).config.onError = () => undefined;
      copy.entries.push(new Date(0));
      return copy;
    };
    for (const value of [1.5, -1, 10n, Symbol("s"), new Map(), undefined]) {
      expect([...knownSecrets(refused(value), [secretModule])].sort(), String(value)).toEqual(plain);
    }
    // A getter is never called; a cycle and an array's hole are left out.
    const withGetter = refused(1.5) as { entries: unknown[] };
    Object.defineProperty((withGetter.entries[0] as { config: object }).config, "apiReadTimeoutMs", {
      enumerable: true,
      get: () => {
        reads += 1;
        return 5;
      },
    });
    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    withGetter.entries.push(cycle);
    withGetter.entries.length += 1;
    expect([...knownSecrets(withGetter, [secretModule])].sort()).toEqual(plain);
    expect(reads).toBe(0);
    // Data that cannot be read at all, or holds nothing plain: none.
    expect(knownSecrets({ entries: [() => undefined] }, [])).toEqual([]);
    expect(knownSecrets(new Proxy({}, { ownKeys: () => { throw new Error("trap"); } }), null)).toEqual([]);
    expect(knownSecrets(null, null)).toEqual([]);
    expect(knownSecrets(() => undefined, null)).toEqual([]);
  });
});
