# Choosing a database

UmbraDB writes to PostgreSQL 18 or to PGlite, PostgreSQL compiled to WebAssembly and bundled with the package. The
`core` entry's `database` names one, as parts ([operator guide](operator-guide.md#the-database)).

| | PostgreSQL 18 | PGlite |
|---|---|---|
| For | Production: a server, a shared public database | Development, tests, demos, the browser |
| Setup | A database; a superuser, or a login with `CREATEROLE` and `CREATE` | A directory, or memory |
| Opt-in | None | `developmentOptIn: true` (it runs without `fsync`); otherwise `development-opt-in-required` |
| Processes | One writer, other readers (a private process, a backup) | One per directory (`writer-lock-held`) |
| Reads | Beside the writer, bounded by `apiReadTimeoutMs` | One queue with the writes: each waits for the other |
| Backup | `pg_dump` 18, while the indexer runs | `pglite-tools`: the indexer stopped, on SIGUSR2, or at its stop |

- **Same data on both.** Modules use the deterministic subset of PostgreSQL, so the same chain gives the same digests
  on PostgreSQL and on PGlite.
- **PostgreSQL's durability is checked at startup:** `fsync=off` and transaction poolers are refused, and
  `full_page_writes=off` unless `fullPageWritesOffAllowed` is set.
- **TLS to PostgreSQL** is the `ssl` part: `disable` by default on a loopback host or a socket directory, `require`
  elsewhere, `verify-full` to check the server's certificate.
- **The browser** always runs PGlite, in memory or in the origin's private file system (OPFS), under the development
  opt-in.
