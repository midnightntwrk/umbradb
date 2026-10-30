# 00053 — the exported `startProcess` cannot be called with the package alone

- **Status:** OPEN
- **Area:** bug
- **Severity:** med
- **Effort:** medium — a public API decision: which core pieces (or a ready-made builder) the package should export.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

Design §12 exports `startProcess` and `InMemoryBlockSource` for a host program, but `startProcess` takes the build's
`declarations` (`ProcessInput.declarations`, `src/runner/process.ts:255`): UmbraDB's backbone parts — `core-chain`
among them —, its core modules and the user's modules. The package exports neither the backbone parts nor the
function that assembles them for the `umbradb` command (`commandBuild`, `src/cli/build-modules.ts:81`). A host program
that installed `umbradb` can therefore not start a process: given only its own modules, startup lacks `core-chain` and
the core modules.

Found by task 17.3a while writing the module guide's "trying a module" section, whose draft showed
`startProcess({ declarations: commandBuild([statsModule]), config, source: new InMemoryBlockSource({ head }) })`.
The guide now leaves that recipe out (record question Q188).

## Evidence

- `src/runner/process.ts:249-263`: `ProcessInput.declarations` is a `DeclarationSet` with `backbone`, `core`, `user`.
- `src/cli/build-modules.ts:81-87`: `commandBuild` adds `PUBLIC_BACKBONE` and `CORE_MODULES`; neither is exported by
  `src/index.ts` (task 17.3's surface).

## Suggested fix

Either export `commandBuild` (design §12, with the item types `BlockParsed`, `ChainOutcome` and `ReadOnlyDatabase` the
guide's draft used), or let `startProcess` add the command's backbone parts and core modules itself when given only
user modules. Then restore the guide's §17 recipe and add a test that a host program starts a process from the package.
