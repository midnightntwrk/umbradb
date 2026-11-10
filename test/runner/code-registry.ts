import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/**
 * The refusal and halt registry. For every refusal and halt code ({@link REFUSALS_AND_HALTS}), it names the tests that
 * trigger it and check its code.
 *
 * **A registered test** ({@link REGISTRY}) is named by its file (from the repository's root) and its title, as written
 * in its `it(…)`, `test(…)` or `tapeTest(…)` call; {@link registryProblems} checks, from the files' text, that the test
 * exists and that its body — or a function of the same file its body calls by name — holds the code as a string literal
 * (what the test checks the failure's code against).
 */

/** The three lists of refusals and halts. */
export type CodeList = "refusal" | "backup" | "halt";

/** A test that triggers a code and checks it: its file, from the repository's root, and its title. */
export interface CodeTest {
  readonly file: string;
  readonly test: string;
}

/** The refusal and halt codes, by list. */
export type RefusalsAndHalts = Readonly<Record<CodeList, readonly string[]>>;

/**
 * The refusal and halt codes, by list: the startup refusals, the backup and restore refusals and the processing halts.
 * A code may be in two lists (`callback-error` refuses at startup and halts processing): each list's entry is its own,
 * keyed `<list>:<code>`. Adding a refusal or a halt adds its code here, with its test in {@link REGISTRY}.
 * `./code-registry.test.ts` checks that `REFUSAL_CODES` and `HALT_CODES` (`src/runner/failures.ts`) are exactly the
 * `UmbraError` codes of the refusal and halt lists.
 */
export const REFUSALS_AND_HALTS: RefusalsAndHalts = Object.freeze({
  refusal: Object.freeze([
    "genesis-mismatch", "cursor-hash-mismatch", "changes-past", "missing-entry", "not-plain-data",
    "invalid-configuration", "upgrade-required", "requires-resync", "migration-checksum-changed",
    "migration-missing", "migration-failed", "non-deterministic-column", "non-deterministic-table", "no-primary-key",
    "unsupported-key-type", "unsupported-column-type", "shared-item-migrations-differ", "unknown-point",
    "reserved-prefix", "bad-id", "schema-collision", "duplicate-id", "item-no-lifetime", "table-item-no-kind",
    "field-no-kind", "invalid-declaration", "item-no-provider", "providers-overlap", "graph-cycle",
    "item-not-available", "no-requirement", "cannot-start-mid-chain", "process-item-missing", "duplicate-api-route",
    "development-opt-in-required", "needs-lockstep-not-listed", "private-binding-mismatch", "public-config-changed",
    "transport-reader-can-write", "package-hash-mismatch", "writer-lock-held", "durability-fsync-off",
    "durability-pooler", "durability-full-page-writes-off", "library-setting-refused", "modules-given-twice",
    "ledger-tasks-need-modules-from", "source-refused", "network-address-conflict", "private-link-misconfigured",
    "callback-error", "listen-failed",
  ]),
  backup: Object.freeze([
    "backup-tools-missing", "private-backup-refused", "backup-format-unknown", "restore-target-not-empty",
    "backup-history-mismatch", "backup-build-mismatch", "backup-genesis-mismatch", "backup-block-not-finalized",
    "contents-hash-mismatch", "backup-root-mismatch", "private-binding-mismatch",
  ]),
  halt: Object.freeze([
    "callback-error", "database-error", "parent-mismatch", "finality-conflict", "node-requirement",
    "duplicate-block-hash", "unknown-runtime", "bad-version-digest", "pin-mismatch", "metadata-mismatch",
    "root-mismatch", "ledger-refcount-invalid", "unexpected-cursor", "writer-lock-lost",
    "truncate-not-allowed", "lockstep-behind", "report-hash-mismatch", "public-config-changed",
  ]),
});

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
 * The tests that trigger each code and check it, by `<list>:<code>` (see the module comment). A change that adds a
 * refusal or a halt adds it here with its test.
 */
export const REGISTRY: Readonly<Record<string, readonly CodeTest[]>> = Object.freeze({
  // ── startup refusals ─────────────────────────────────────────────────────────────────────────────────────────────
  "refusal:genesis-mismatch": [
    {
      file: "test/backbone/chain-process.test.ts",
      test: "a node of another network than the configured one, also on an empty database, or than the stored one refuses with genesis-mismatch, a known network without a recorded genesis refuses, another hash at the cursor refuses with cursor-hash-mismatch, a head below the cursor waits",
    },
    {
      file: "test/backbone/core-chain.test.ts",
      test: "compares the node's genesis hash with the configured network's at every start, on a new database too",
    },
  ],
  "refusal:cursor-hash-mismatch": [
    {
      file: "test/backbone/chain-process.test.ts",
      test: "a node of another network than the configured one, also on an empty database, or than the stored one refuses with genesis-mismatch, a known network without a recorded genesis refuses, another hash at the cursor refuses with cursor-hash-mismatch, a head below the cursor waits",
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
      test: "holds configuration data to the plain data: a function refuses with not-plain-data at its path",
    },
  ],
  "refusal:invalid-configuration": [
    {
      file: "test/backbone/chain-process.test.ts",
      test: "a custom network without its genesisHash refuses at validation, before the database opens or the node is asked",
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
      test: "refuses a 1.1.0 that requires a resync on the database 1.0.0 wrote, with requires-resync",
    },
  ],
  "refusal:migration-checksum-changed": [
    {
      file: "test/db/migrate.test.ts",
      test: "a changed checksum of an applied migration refuses startup with the module, the id and both checksums, before any migration runs",
    },
  ],
  "refusal:migration-missing": [
    {
      file: "test/db/migrate.test.ts",
      test: "a migration recorded as applied but missing from the build refuses startup with the module, the id and its checksum, before any migration runs",
    },
  ],
  "refusal:migration-failed": [
    {
      file: "test/db/migrate.test.ts",
      test: "with 001 and 002 pending and 002 failing halfway, 001 is applied and recorded, nothing of 002 is, on-start-db did not run, and startup refuses",
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
      test: "refuses a duplicate id as such, where the schema plan would call it a schema collision",
    },
  ],
  ...Object.fromEntries(
    ["item-no-lifetime", "table-item-no-kind", "field-no-kind", "no-requirement"].map((code) => [
      `refusal:${code}`,
      [{ file: "test/modules/validation.test.ts", test: "covers every cause, and each validation rule is triggered"}],
    ]),
  ),
  "refusal:invalid-declaration": [
    {
      file: `${RUNNER}/refusals.test.ts`,
      test: "an invalid declaration: refused with its code, logged with its finding, and the process ends by itself",
    },
  ],
  ...Object.fromEntries(
    ["item-no-provider", "providers-overlap", "graph-cycle", "item-not-available", "cannot-start-mid-chain"].map((code) => [
      `refusal:${code}`,
      [
        {
          file: "test/modules/graph.test.ts",
          test: "covers every rule of GRAPH_RULES, and every code they refuse with",
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
      test: "refuses PGlite without the development opt-in, naming PGlite and the opt-in, before anything is created",
    },
  ],
  "refusal:private-binding-mismatch": [
    {
      file: "test/private/binding.test.ts",
      test: "refuses with private-binding-mismatch against another public database, and starts against its own",
    },
    {
      file: "test/private/binding.test.ts",
      test: "configured for another network refuses with private-binding-mismatch before any migration, and binds for its own",
    },
  ],
  "refusal:public-config-changed": [
    {
      file: "test/private/accepted-hash.test.ts",
      test: "a first start records the hash; after a changed configuration a start stops with public-config-changed naming the new hash and --update-hash; updateHash set to it runs the full checks, records it and continues; another value stops; a core changed during the start stops it",
    },
  ],
  "refusal:library-setting-refused": [
    {
      file: "test/library/guarantees.test.ts",
      test: "backupAtStop, backupOnSignal and both are each refused library-setting-refused, naming the setting; nothing opened",
    },
  ],
  "refusal:modules-given-twice": [
    {
      file: "test/library/modules.test.ts",
      test: "modules with { file }, modules with modulesFrom, modulesFrom with { file }: each refused, naming both",
    },
  ],
  "refusal:ledger-tasks-need-modules-from": [
    { file: "test/library/modules.test.ts", test: "refused before anything opens, naming the module" },
  ],
  "refusal:network-address-conflict": [
    {
      file: "test/library/network.test.ts",
      test: "listen.api written and api: { port } in code is refused network-address-conflict (both); no port opened",
    },
  ],
  "refusal:private-link-misconfigured": [
    {
      file: "test/library/network.test.ts",
      test: "privateSide on a public process is refused private-link-misconfigured (wrong-side)",
    },
  ],
  "refusal:source-refused": [
    { file: "test/library/source.test.ts", test: "an instance given a hook names the hook members it carries" },
    { file: "test/library/source.test.ts", test: "an in-memory source on a private process is refused source-refused; nothing opened" },
  ],
  "refusal:transport-reader-can-write": [
    {
      file: "test/private/transport-reader.test.ts",
      test: "a login holding INSERT on a public table refuses startup, naming the table",
    },
  ],
  "refusal:needs-lockstep-not-listed": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test: "a needsLockstep module refuses to run when hello-ack says lockstep: false (needs-lockstep-not-listed), or with no privateLink, before any migration; on a listed instance it runs",
    },
    {
      file: "test/backbone/core-private-source.test.ts",
      test: "refuses a module declaring needsLockstep unless the hello-ack said lockstep, or with no transport (needs-lockstep-not-listed)",
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
      test: "fsync=off refuses with durability-fsync-off before any write or migration, and the refused writer holds no lock",
    },
  ],
  "refusal:durability-pooler": [
    {
      file: "test/db/durability-probe.test.ts",
      test: "a transaction pooler — statements of one session reaching different backends — is refused with durability-pooler",
    },
  ],
  "refusal:durability-full-page-writes-off": [
    {
      file: "test/db/durability-probe.test.ts",
      test: "full_page_writes=off refuses with durability-full-page-writes-off unless fullPageWritesOffAllowed is set",
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
      test: "without the tool (pg_dump 18, or pglite-tools), umbradb backup fails with backup-tools-missing, naming what to install, and writes no file",
    },
  ],
  "backup:private-backup-refused": [
    {
      file: "test/backup/backup.test.ts",
      test: "umbradb backup of a private database refuses with private-backup-refused without the development opt-in, and writes no file",
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
          test: "each restore refusal is triggered and checked before or after loading, in its order; after every refusal the target is as it was",
        },
      ],
    ]),
  ),
  "backup:private-binding-mismatch": [
    {
      file: "test/backup/restore-private.test.ts",
      test: "a private process's backup restores into an empty private database with the checks made against its public database and continues from its height + 1; one taken against another public database is refused with private-binding-mismatch and the binding's details.reason, the target left empty",
    },
    {
      file: "test/backup/restore-private.test.ts",
      test: "the other checks against the public database refuse before anything is loaded — its core never started, another network, its S above the backup's, its head below the backup's height, another block there — the target left empty",
    },
  ],
  "backup:backup-root-mismatch": [
    {
      file: "test/backup/restore-ledger.test.ts",
      test: "with core-ledger-state in the history, a stored state root at the backup's height that is not the node's refuses with backup-root-mismatch after loading, the target empty; the node's own restores",
    },
  ],
  "halt:callback-error": [
    {
      file: `${RUNNER}/halts.test.ts`,
      test: "a block write handle kept and used in a later block halts with callback-error naming the module that kept it",
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
      test: "a block whose parent hash differs from the cursor's halts with parent-mismatch, nothing of it kept",
    },
  ],
  "halt:finality-conflict": [
    {
      file: "test/backbone/ingest.test.ts",
      test: "a finalized notification at or below the cursor with another hash halts with finality-conflict",
    },
  ],
  "halt:root-mismatch": [
    {
      file: "test/backbone/core-ledger-state.test.ts",
      test: "halts with root-mismatch, naming both roots, when the state's root is not the node's",
    },
  ],
  "halt:node-requirement": [
    {
      file: "test/backbone/ingest-faults.test.ts",
      test: "a 'state unavailable' answer for a finalized height's events halts with node-requirement and that height, asked once",
    },
    { file: `${RUNNER}/halts.test.ts`, test: "a node-requirement in on-fetch halts with node-requirement, the module and the point"},
  ],
  "halt:duplicate-block-hash": [
    {
      file: "test/backbone/chain-process.test.ts",
      test: "one blocks and one hashes row per height; a linking block repeating a hash in another partition halts with duplicate-block-hash; a fresh hash commits",
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
      test: "[[ingest.uncertain-commit-recovery]] the writer's backend terminated during the COMMIT of h — after the server committed it: the cursor is h after reconnecting, h is not processed again, on-after-db-write fires for h; before: h is processed again from on-compute; with the cursor neither h with the block's hash nor h − 1: processing halts with unexpected-cursor at h",
    },
  ],
  "halt:writer-lock-lost": [
    {
      file: `${RUNNER}/retries.test.ts`,
      test: "a writer that finds its lock taken when it reconnects halts with writer-lock-lost, for good",
    },
  ],
  "halt:truncate-not-allowed": [
    { file: `${RUNNER}/halts.test.ts`, test: "a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point"},
  ],
  "halt:lockstep-behind": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test: "an instance listed after the public cursor passed it is refused with lockstep-behind, halts, and the core waits and names it",
    },
    {
      file: "test/private/lockstep-reads.test.ts",
      test: "a lockstep instance reads the public cursor again after its block's data and halts with lockstep-behind when it moved past h",
    },
  ],
  "halt:report-hash-mismatch": [
    {
      file: "test/private/lockstep-refusals.test.ts",
      test: "a report hash mismatch halts that instance with report-hash-mismatch, and the core keeps waiting for it",
    },
  ],
  "halt:public-config-changed": [
    {
      file: "test/private/config-hash.test.ts",
      test: "with a transport, a core restarted with a data field changed halts the private process with public-config-changed before another height; the same configuration, or only secrets changed, changes nothing; X-Umbra-Config-Hash holds no secret",
    },
  ],
  // The `ledger-refcount` change's halt code, which each check of the reclamation step raises. [R11, R19]
  "halt:ledger-refcount-invalid": [
    {
      file: "test/backbone/ledger-refcount-halts.test.ts",
      test: "a stored count lowered in a copy of the database so that a deletion takes it below 0 halts at that block with ledger-refcount-invalid (negative-count), naming the key and the height; nothing of the block is stored",
    },
    {
      file: "test/backbone/ledger-refcount-halts.test.ts",
      test: "a test package flushing a new node that references a key not stored, one rewriting a stored node with a child list that references a key not stored, and one raising the root count of a key it neither flushes nor has stored each halt at that block with ledger-refcount-invalid (missing-reference), naming the key and the height; nothing of the block is stored",
    },
    {
      file: "test/backbone/ledger-refcount-halts.test.ts",
      test: "a test seam making one of the step's statements affect one row fewer halts at that block with ledger-refcount-invalid (row-count-mismatch), naming the statement, the rows computed and affected, and the height; the block's transaction rolls back",
    },
  ],
});

/** What {@link registryProblems} checks. */
export interface RegistryInput {
  readonly codes: RefusalsAndHalts;
  readonly registry: Readonly<Record<string, readonly CodeTest[]>>;
  /** A test file's text, by its path from the repository's root; null when there is no such file. */
  readonly read: (file: string) => string | null;
}

/**
 * Every problem of the registry against the refusals and halts (see the module comment), none when each code has its
 * test.
 */
export function registryProblems(input: RegistryInput): string[] {
  const problems: string[] = [];
  const listed = new Set(Object.entries(input.codes).flatMap(([list, codes]) => codes.map((code) => `${list}:${code}`)));
  for (const key of listed) {
    if (!(key in input.registry)) problems.push(`${key}: no test triggers it and checks its code`);
  }
  for (const key of Object.keys(input.registry)) {
    if (!listed.has(key)) problems.push(`${key}: no list of refusals and halts has it`);
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
  return problems;
}

/** The repository's root. */
export const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** A file of the repository by its path from the root, or null. */
export function readRepositoryFile(file: string): string | null {
  const path = join(ROOT, file);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}
