# Building from source

The [README](../README.md)'s quick start installs the package attached to a
[GitHub release](https://github.com/midnightntwrk/umbradb/releases). This page builds that package yourself, or runs
UmbraDB straight from a clone. Both need Node.js 24 or later and git.

## Build the package and install it

```sh
git clone https://github.com/midnightntwrk/umbradb
cd umbradb && npm ci && npm run build && npm pack      # writes umbradb-0.10.0.tgz
cd .. && mkdir my-indexer && cd my-indexer
npm init -y && npm pkg set type=module
npm install ../umbradb/umbradb-0.10.0.tgz
```

The tarball holds what a release's tarball holds: `npm pack` follows `package.json`'s `files`. From here the README's
quick start goes on as written: `umbradb.config.ts`, then `npx umbradb config check umbradb.config.ts` and
`npx umbradb run`.

To build a release's version, check out its tag (`git checkout v0.10.0-rc.1`) before `npm ci`. Its tarball's SHA-256
(`shasum -a 256 umbradb-0.10.0.tgz`) can be compared with the one the release lists; a different npm or Node.js
version may give a different tarball from the same sources.

## Run from a clone

Without packing anything: build once, then run the command from `dist/`.

```sh
git clone https://github.com/midnightntwrk/umbradb
cd umbradb && npm ci && npm run build
node dist/cli/main.js config check umbradb.config.ts
node dist/cli/main.js run                                # reads ./umbradb.config.ts; Ctrl-C stops it
```

A configuration file inside the clone can `import … from "umbradb"`: Node.js resolves the package's own name through
its `exports`. `npx umbradb` does not work here, because the package's own command is not in its own
`node_modules/.bin`; write `node dist/cli/main.js` instead.
[`examples/stats-module/run.sh`](../examples/stats-module/run.sh) runs the example this way.

After pulling new commits, run `npm ci && npm run build` again.

## Build commands

```sh
npm ci
npm run build             # dist/ and the umbradb command
npm run build:browser     # dist-browser/: the browser page
npm run web               # builds the page and serves it on 127.0.0.1:8090
npm run typecheck         # the sources, the tests and examples/stats-module
```

The tests, and what they need (Docker, Chrome), are in the README's "Project status, development and links".
