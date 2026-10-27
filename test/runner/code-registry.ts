import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { POINTS } from "../../src/modules/declaration.js";

/**
 * The refusal and halt registry (task 10.4; IN-12, A87 `[STATIC]`; `openspec/changes/core-arch/design.md` §11): for
 * every refusal and halt code §11 lists, the tests that trigger it and check its code, or — for a code whose task has
 * not run yet — the task that will add them.
 *
 * **§11's codes** ({@link section11Codes}) are the backticked words of its three paragraphs — the startup refusals
 * ("**Startup refuses**"), the backup and restore refusals ("**Backup and restore refuse**") and the processing halts
 * ("**Processing halts**") —, less the state each paragraph names (`(state \`refused\``, `(state \`halted\``) and the
 * point names (`on-start-db`, `on-start-api`: where `callback-error` happens, not codes). A code may be in two lists
 * (`callback-error` refuses at startup and halts processing): each list's entry is its own, keyed `<list>:<code>`.
 *
 * **A registered test** ({@link REGISTRY}) is named by its file (from the repository's root) and its title, as written
 * in its `it(…)`, `test(…)` or `tapeTest(…)` call; {@link registryProblems} checks, from the files' text, that the test
 * exists and that its body — or a function of the same file its body calls by name — holds the code as a string literal
 * (what the test checks the failure's code against).
 *
 * **Pending codes** ({@link PENDING}) are the codes whose tasks have not run yet, each with that task; a pending code
 * whose task `tasks.md` checks done is a problem (its task must register its test), and so is one not in the list as it
 * stood when task 10.4 made it (the test's baseline): a new §11 code comes with its test. So the list only shrinks.
 */

/** The three lists of §11. */
export type CodeList = "refusal" | "backup" | "halt";

/** A test that triggers a code and checks it: its file, from the repository's root, and its title. */
export interface CodeTest {
  readonly file: string;
  readonly test: string;
}

/** §11's codes, by list (see the module comment). */
export type Section11 = Readonly<Record<CodeList, readonly string[]>>;

const PARAGRAPHS: readonly (readonly [CodeList, string, string])[] = [
  ["refusal", "**Startup refuses**", "**Backup and restore refuse**"],
  ["backup", "**Backup and restore refuse**", "**Processing halts**"],
  ["halt", "**Processing halts**", "**The test tape's errors"],
];

/** §11's refusal and halt codes in `design` (the text of `design.md`); throws when a paragraph's heading moved. */
export function section11Codes(design: string): Section11 {
  const from = design.indexOf("## 11. Refusals and halts");
  const to = design.indexOf("## 12. ");
  if (from < 0 || to < from) throw new Error("design.md has no §11 before §12");
  const section = design.slice(from, to);
  const points = new Set<string>(POINTS);
  const lists = {} as Record<CodeList, readonly string[]>;
  for (const [list, opening, closing] of PARAGRAPHS) {
    const start = section.indexOf(opening);
    const end = section.indexOf(closing);
    if (start < 0 || end < start) throw new Error(`design §11 no longer has "${opening}" before "${closing}"`);
    const paragraph = section.slice(start, end).replace(/\(state `[a-z-]+`/g, "(state");
    const words = [...paragraph.matchAll(/`([a-z][a-z0-9-]*)`/g)].map((match) => match[1] as string);
    lists[list] = Object.freeze([...new Set(words.filter((word) => !points.has(word)))]);
  }
  return Object.freeze(lists);
}

/** A test's title and the string literals of its body and of the functions of its file the body calls by name. */
export interface TestLiterals {
  readonly title: string;
  readonly literals: ReadonlySet<string>;
}

/** A call's static text: a string literal, a template without substitutions, or a concatenation of them; else null. */
function staticText(node: ts.Expression | undefined): string | null {
  if (node === undefined) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isParenthesizedExpression(node)) return staticText(node.expression);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = staticText(node.left);
    const right = staticText(node.right);
    return left === null || right === null ? null : left + right;
  }
  return null;
}

/** The test calls a file may hold: `it`, `test`, their `.concurrent` forms, and `tapeTest` (its title second). */
const TEST_CALLS: ReadonlyMap<string, number> = new Map([
  ["it", 0],
  ["test", 0],
  ["it.concurrent", 0],
  ["test.concurrent", 0],
  ["tapeTest", 1],
]);

/** The tests of the file `name` whose text is `text`, each with its literals (see {@link TestLiterals}). */
export function testsIn(name: string, text: string): TestLiterals[] {
  const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true);
  const functions = new Map<string, ts.Node[]>();
  const declarations = (node: ts.Node): void => {
    if (ts.isFunctionDeclaration(node) && node.name !== undefined) {
      functions.set(node.name.text, [...(functions.get(node.name.text) ?? []), node]);
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer !== undefined &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      functions.set(node.name.text, [...(functions.get(node.name.text) ?? []), node]);
    }
    ts.forEachChild(node, declarations);
  };
  declarations(file);
  const literalsOf = (node: ts.Node, into: Set<string>): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) into.add(node.text);
    ts.forEachChild(node, (child) => literalsOf(child, into));
  };
  const tests: TestLiterals[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const at = TEST_CALLS.get(node.expression.getText(file));
      const title = at === undefined ? null : staticText(node.arguments[at]);
      const body = at === undefined ? undefined : node.arguments[at + 1];
      if (title !== null && body !== undefined) {
        const literals = new Set<string>();
        literalsOf(body, literals);
        const called = new Set<string>();
        const names = (inner: ts.Node): void => {
          if (ts.isIdentifier(inner)) called.add(inner.text);
          ts.forEachChild(inner, names);
        };
        names(body);
        for (const name of called) for (const declaration of functions.get(name) ?? []) literalsOf(declaration, literals);
        tests.push({ title, literals });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return tests;
}

const RUNNER = "test/runner";

/**
 * The tests that trigger each code and check it, by `<list>:<code>` (see the module comment). A task that adds a code
 * to §11 adds it here with its test.
 */
export const REGISTRY: Readonly<Record<string, readonly CodeTest[]>> = Object.freeze({
  // ── startup refusals ─────────────────────────────────────────────────────────────────────────────────────────────
  "refusal:genesis-mismatch": [
    {
      file: "test/backbone/chain-process.test.ts",
      test:
        "A78: a node of another network than the configured one, also on an empty database, or than the stored one " +
        "refuses with genesis-mismatch, a known network without a recorded genesis refuses, another hash at the cursor " +
        "refuses with cursor-hash-mismatch, a head below the cursor waits",
    },
    {
      file: "test/backbone/core-chain.test.ts",
      test: "compares the node's genesis hash with the configured network's at every start, on a new database too (Q120)",
    },
  ],
  "refusal:cursor-hash-mismatch": [
    {
      file: "test/backbone/chain-process.test.ts",
      test:
        "A78: a node of another network than the configured one, also on an empty database, or than the stored one " +
        "refuses with genesis-mismatch, a known network without a recorded genesis refuses, another hash at the cursor " +
        "refuses with cursor-hash-mismatch, a head below the cursor waits",
    },
    {
      file: "test/backbone/core-chain.test.ts",
      test: "refuses a node whose finalized hash at the cursor differs with cursor-hash-mismatch, the height and both hashes",
    },
  ],
  "refusal:changes-past": [
    {
      file: "test/config/history-database.test.ts",
      test: "refuses a changed data field or version of an entry starting at or below the cursor, changing nothing",
    },
  ],
  "refusal:missing-entry": [
    {
      file: "test/config/history-database.test.ts",
      test: "refuses a configuration omitting a recorded entry at or below the cursor with missing-entry, changing nothing",
    },
  ],
  "refusal:not-plain-data": [
    {
      file: `${RUNNER}/process.test.ts`,
      test: "holds configuration data to CF-1's plain data: a function refuses with not-plain-data at its path",
    },
  ],
  "refusal:invalid-configuration": [
    {
      file: "test/backbone/chain-process.test.ts",
      test: "a custom network without its genesisHash refuses at validation, before the database opens or the node is asked (CF-4)",
    },
  ],
  "refusal:upgrade-required": [
    {
      file: "test/config/history-database.test.ts",
      test: "refuses a newer and an older build of a module with upgrade-required, adding no core_chain.migrations row",
    },
  ],
  "refusal:requires-resync": [
    {
      file: `${RUNNER}/upgrade-boundary.test.ts`,
      test: "refuses a 1.1.0 that requires a resync on the database 1.0.0 wrote, with requires-resync (DB-10)",
    },
  ],
  "refusal:migration-checksum-changed": [
    {
      file: "test/db/migrate.test.ts",
      test:
        "A16: a changed checksum of an applied migration refuses startup with the module, the id and both checksums, " +
        "before any migration runs",
    },
  ],
  "refusal:migration-missing": [
    {
      file: "test/db/migrate.test.ts",
      test:
        "A16: a migration recorded as applied but missing from the build refuses startup with the module, the id and its " +
        "checksum, before any migration runs",
    },
  ],
  "refusal:migration-failed": [
    {
      file: "test/db/migrate.test.ts",
      test:
        "A16: with 001 and 002 pending and 002 failing halfway, 001 is applied and recorded, nothing of 002 is, " +
        "on-start-db did not run, and startup refuses",
    },
  ],
  ...Object.fromEntries(
    ["non-deterministic-column", "non-deterministic-table", "no-primary-key", "unsupported-key-type", "unsupported-column-type"].map(
      (code) => [
        `refusal:${code}`,
        [
          {
            file: "test/deterministic-postgresql/both-backends.test.ts",
            test: "refuses the same tables, sequences and columns with the same codes and messages on both",
          },
        ],
      ],
    ),
  ),
  "refusal:shared-item-migrations-differ": [
    { file: "test/db/schema-names.test.ts", test: "refuses two providers whose migration 001 differs, naming the item" },
  ],
  "refusal:unknown-point": [
    { file: "test/modules/declarations.test.ts", test: "refuses an unknown point on a backbone part and a core module alike" },
  ],
  "refusal:reserved-prefix": [
    { file: "test/modules/validation.test.ts", test: "checks the id before the prefix: core_x is a bad id, core-x a reserved prefix" },
  ],
  "refusal:bad-id": [
    { file: "test/modules/validation.test.ts", test: "checks the id before the prefix: core_x is a bad id, core-x a reserved prefix" },
  ],
  "refusal:schema-collision": [
    { file: "test/db/roles.test.ts", test: "refuses a schema that exists already and belongs to another role (schema-collision)" },
  ],
  "refusal:duplicate-id": [
    {
      file: "test/modules/validation.test.ts",
      test: "refuses a duplicate id as such, where the schema plan would call it a schema collision (DB-8)",
    },
  ],
  ...Object.fromEntries(
    ["item-no-lifetime", "table-item-no-kind", "field-no-kind", "no-requirement"].map((code) => [
      `refusal:${code}`,
      [{ file: "test/modules/validation.test.ts", test: "covers every cause A21 names, and each rule of MD-2 is triggered" }],
    ]),
  ),
  "refusal:invalid-declaration": [
    {
      file: `${RUNNER}/refusals.test.ts`,
      test: "an invalid declaration: refused with its code, logged with its finding, and the process ends by itself (Q137 B)",
    },
  ],
  ...Object.fromEntries(
    ["item-no-provider", "providers-overlap", "graph-cycle", "item-not-available", "cannot-start-mid-chain"].map((code) => [
      `refusal:${code}`,
      [
        {
          file: "test/modules/graph.test.ts",
          test: "covers every rule of GRAPH_RULES, and every code MD-3–MD-6 and design.md §11 give them",
        },
      ],
    ]),
  ),
  "refusal:process-item-missing": [
    {
      file: `${RUNNER}/process-context.test.ts`,
      test: "refuses startup with process-item-missing when a required process item was not published",
    },
  ],
  "refusal:duplicate-api-route": [
    {
      file: `${RUNNER}/module-api.test.ts`,
      test: "refuses two modules registering the same method and path with duplicate-api-route, naming both",
    },
  ],
  "refusal:development-opt-in-required": [
    {
      file: "test/db/durability-probe.test.ts",
      test: "A18: refuses PGlite without the development opt-in, naming PGlite and the opt-in, before anything is created",
    },
  ],
  "refusal:private-binding-mismatch": [
    {
      file: "test/private/binding.test.ts",
      test: "refuses with private-binding-mismatch against another public database, and starts against its own",
    },
    {
      file: "test/private/binding.test.ts",
      test:
        "A156 configured for another network refuses with private-binding-mismatch before any migration, and binds for its own",
    },
  ],
  "refusal:needs-lockstep-not-listed": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test:
        "A117: a needsLockstep module refuses to run when hello-ack says lockstep: false (needs-lockstep-not-listed), or with no " +
        "coreTransport, before any migration; on a listed instance it runs",
    },
    {
      file: "test/backbone/core-private-source.test.ts",
      test: "refuses a module declaring needsLockstep unless the hello-ack said lockstep, or with no transport (needs-lockstep-not-listed)",
    },
  ],
  "refusal:test-key-conflict": [
    {
      file: "test/private/keys.test.ts",
      test:
        "A123: a restart with a test key admitted at its start keeps its arrived_height; the same key with another start " +
        "refuses with test-key-conflict",
    },
    {
      file: "test/backbone/core-key-registry.test.ts",
      test: "refuses a key admitted with another start (start-changed), naming it by its place and both heights, never its bytes",
    },
  ],
  "refusal:package-hash-mismatch": [{ file: "test/ledger/package-identity.test.ts", test: "refuses a package file that is missing" }],
  "refusal:writer-lock-held": [
    {
      file: "test/db/writer-lock.test.ts",
      test: "is held before any migration: a second writer's startup refuses with writer-lock-held and creates nothing",
    },
  ],
  "refusal:durability-fsync-off": [
    {
      file: "test/db/durability-probe.test.ts",
      test:
        "A18 (B1): fsync=off refuses with durability-fsync-off before any write or migration, and the refused writer " +
        "holds no lock",
    },
  ],
  "refusal:durability-pooler": [
    {
      file: "test/db/durability-probe.test.ts",
      test: "A18: a transaction pooler — statements of one session reaching different backends — is refused with durability-pooler",
    },
  ],
  "refusal:durability-full-page-writes-off": [
    {
      file: "test/db/durability-probe.test.ts",
      test: "A18 (B3): full_page_writes=off refuses with durability-full-page-writes-off unless fullPageWritesOffAllowed is set",
    },
  ],
  "refusal:callback-error": [
    {
      file: `${RUNNER}/refusals.test.ts`,
      test: "a failing on-start-db refuses with callback-error, its point and module; the module's own SQL error with database-error",
    },
    { file: `${RUNNER}/refusals.test.ts`, test: "a failing on-start-api refuses with callback-error, its point and module" },
  ],
  "refusal:listen-failed": [
    {
      file: `${RUNNER}/refusals.test.ts`,
      test: "a module API listener that cannot listen (the port in use) refuses with listen-failed, the database released",
    },
  ],
  // ── processing halts ─────────────────────────────────────────────────────────────────────────────────────────────
  "backup:backup-tools-missing": [
    {
      file: "test/backup/backup.test.ts",
      test:
        "A124: without the tool (pg_dump 18, or pglite-tools), umbradb backup fails with backup-tools-missing, naming " +
        "what to install, and writes no file",
    },
  ],
  "backup:private-backup-refused": [
    {
      file: "test/backup/backup.test.ts",
      test:
        "A122: umbradb backup of a private database refuses with private-backup-refused without the development " +
        "opt-in, and writes no file",
    },
  ],
  ...Object.fromEntries(
    [
      "backup-format-unknown",
      "restore-target-not-empty",
      "backup-history-mismatch",
      "backup-build-mismatch",
      "backup-genesis-mismatch",
      "backup-block-not-finalized",
      "contents-hash-mismatch",
    ].map((code) => [
      `backup:${code}`,
      [
        {
          file: "test/backup/restore.test.ts",
          test:
            "A126: each restore refusal of BK-3 is triggered and checked before or after loading, as BK-3 orders them; " +
            "after every refusal the target is as it was",
        },
      ],
    ]),
  ),
  "backup:backup-root-mismatch": [
    {
      file: "test/backup/restore-ledger.test.ts",
      test:
        "A126: with core-ledger-state in the history, a stored state root at the backup's height that is not the " +
        "node's refuses with backup-root-mismatch after loading, the target empty; the node's own restores",
    },
  ],
  "halt:callback-error": [
    {
      file: `${RUNNER}/halts.test.ts`,
      test: "a block write handle kept and used in a later block halts with callback-error naming the module that kept it (DB-3)",
    },
  ],
  "halt:database-error": [
    {
      file: `${RUNNER}/halts.test.ts`,
      test: "a statement the database refuses in on-db-write halts with database-error, the module and the point",
    },
  ],
  "halt:parent-mismatch": [
    {
      file: "test/backbone/ingest.test.ts",
      test: "A79: a block whose parent hash differs from the cursor's halts with parent-mismatch, nothing of it kept",
    },
  ],
  "halt:finality-conflict": [
    {
      file: "test/backbone/ingest.test.ts",
      test: "A79: a finalized notification at or below the cursor with another hash halts with finality-conflict",
    },
  ],
  "halt:root-mismatch": [
    {
      file: "test/backbone/core-ledger-state.test.ts",
      test: "halts with root-mismatch, naming both roots, when the state's root is not the node's (LG-15)",
    },
  ],
  "halt:node-requirement": [
    {
      file: "test/backbone/ingest-faults.test.ts",
      test:
        "A84: a 'state unavailable' answer for a finalized height's events halts with node-requirement and that height, " +
        "asked once",
    },
    { file: `${RUNNER}/halts.test.ts`, test: "a node-requirement in on-fetch halts with node-requirement, the module and the point (IN-9)" },
  ],
  "halt:duplicate-block-hash": [
    {
      file: "test/backbone/chain-process.test.ts",
      test:
        "A90: one blocks and one hashes row per height; a linking block repeating a hash in another partition halts with " +
        "duplicate-block-hash; a fresh hash commits",
    },
  ],
  "halt:unknown-runtime": [
    { file: "test/ledger/version-selection.test.ts", test: "halts a spec_version that two rows cover with unknown-runtime, naming both rows" },
  ],
  "halt:bad-version-digest": [
    {
      file: "test/ledger/version-selection.test.ts",
      test: "refuses a malformed MNSV item: a payload of another length, a wrong length prefix, a truncated item",
    },
  ],
  "halt:pin-mismatch": [
    {
      file: "test/ledger/version-selection.test.ts",
      test: "checks the pin before the rows: a pinned block with an unknown runtime is a pin-mismatch",
    },
  ],
  "halt:metadata-mismatch": [
    {
      file: "test/ledger/runtime-metadata.test.ts",
      test: "halts with metadata-mismatch where the parent's runtime is not the block's MNSV version",
    },
  ],
  "halt:unexpected-cursor": [
    {
      file: `${RUNNER}/halts.test.ts`,
      test: "a block whose cursor row is not the height's halts with unexpected-cursor, naming no module or point",
    },
    {
      file: `${RUNNER}/recovery.test.ts`,
      test:
        "[[ingest.uncertain-commit-recovery]] A86: the writer's backend terminated during the COMMIT of h — after the " +
        "server committed it: the cursor is h after reconnecting, h is not processed again, on-after-db-write fires " +
        "for h; before: h is processed again from on-compute; with the cursor neither h with the block's hash nor h − 1: " +
        "processing halts with unexpected-cursor at h",
    },
  ],
  "halt:writer-lock-lost": [
    {
      file: `${RUNNER}/retries.test.ts`,
      test: "a writer that finds its lock taken when it reconnects halts with writer-lock-lost, for good (DB-11)",
    },
  ],
  "halt:truncate-not-allowed": [
    { file: `${RUNNER}/halts.test.ts`, test: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point (DB-14)" },
  ],
  "halt:fast-log-unsupported": [
    {
      file: "test/backbone/contract-data.test.ts",
      test: "A110: a log of a value read from the contract's state makes -fast halt with fast-log-unsupported at its height, naming the transaction; -full stores it",
    },
    {
      file: "test/backbone/contract-data.test.ts",
      test: "A110: any log of a partially successful transaction makes -fast halt with fast-log-unsupported (CC-3)",
    },
  ],
  "halt:lockstep-behind": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test: "A118: an instance listed after the public cursor passed it is refused with lockstep-behind, halts, and the core waits and names it",
    },
    {
      file: "test/private/lockstep-reads.test.ts",
      test: "Q142: a lockstep instance reads the public cursor again after its block's data and halts with lockstep-behind when it moved past h",
    },
  ],
  "halt:report-hash-mismatch": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test: "A117: a report hash mismatch halts that instance with report-hash-mismatch, and the core keeps waiting for it",
    },
  ],
});

/**
 * The codes whose tasks have not run yet, by `<list>:<code>`, each with the task of `tasks.md` that adds it and its test
 * (see the module comment).
 */
export const PENDING: Readonly<Record<string, string>> = Object.freeze({});

/** The tasks of `tasks.md` (its text) by id, and whether each is checked done. */
export function tasksDone(text: string): ReadonlyMap<string, boolean> {
  const tasks = new Map<string, boolean>();
  for (const match of text.matchAll(/^- \[([ x])\] (\d+\.\d+[a-z]?) /gm)) tasks.set(match[2] as string, match[1] === "x");
  return tasks;
}

/** What {@link registryProblems} checks. */
export interface RegistryInput {
  readonly codes: Section11;
  readonly registry: Readonly<Record<string, readonly CodeTest[]>>;
  readonly pending: Readonly<Record<string, string>>;
  /** The pending codes as task 10.4 left them: no other code may be pending. */
  readonly baseline: readonly string[];
  /** `tasks.md`'s tasks ({@link tasksDone}). */
  readonly tasks: ReadonlyMap<string, boolean>;
  /** A test file's text, by its path from the repository's root; null when there is no such file. */
  readonly read: (file: string) => string | null;
}

/** Every problem of the registry against §11 (see the module comment), none when each code has its test or its task. */
export function registryProblems(input: RegistryInput): string[] {
  const problems: string[] = [];
  const listed = new Set(Object.entries(input.codes).flatMap(([list, codes]) => codes.map((code) => `${list}:${code}`)));
  for (const key of listed) {
    const registered = key in input.registry;
    const pending = key in input.pending;
    if (!registered && !pending) problems.push(`${key}: no test triggers it and checks its code, and it is not pending`);
    if (registered && pending) problems.push(`${key}: registered with its test and pending both`);
  }
  for (const key of [...Object.keys(input.registry), ...Object.keys(input.pending)]) {
    if (!listed.has(key)) problems.push(`${key}: design §11 does not list it`);
  }
  const parsed = new Map<string, TestLiterals[] | null>();
  const testsOf = (file: string): TestLiterals[] | null => {
    if (!parsed.has(file)) {
      const text = input.read(file);
      parsed.set(file, text === null ? null : testsIn(file, text));
    }
    return parsed.get(file) as TestLiterals[] | null;
  };
  for (const [key, tests] of Object.entries(input.registry)) {
    const code = key.slice(key.indexOf(":") + 1);
    if (tests.length === 0) problems.push(`${key}: registered without a test`);
    for (const { file, test } of tests) {
      const found = testsOf(file);
      if (found === null) {
        problems.push(`${key}: ${file} does not exist`);
        continue;
      }
      const titled = found.filter((candidate) => candidate.title === test);
      if (titled.length === 0) problems.push(`${key}: ${file} has no test titled "${test}"`);
      else if (!titled.some((candidate) => candidate.literals.has(code))) {
        problems.push(`${key}: "${test}" (${file}) does not check the code ${code}`);
      }
    }
  }
  for (const [key, task] of Object.entries(input.pending)) {
    if (!input.baseline.includes(key)) {
      problems.push(`${key}: pending, but not among the codes pending at task 10.4: a new code of §11 comes with its test`);
    }
    const done = input.tasks.get(task);
    if (done === undefined) problems.push(`${key}: pending for task ${task}, which tasks.md does not have`);
    else if (done) problems.push(`${key}: pending for task ${task}, which tasks.md checks done: register its test`);
  }
  return problems;
}

/** The repository's root. */
export const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** A file of the repository by its path from the root, or null. */
export function readRepositoryFile(file: string): string | null {
  const path = join(ROOT, file);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}
