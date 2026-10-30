/**
 * The one PostgreSQL image of the repository: every PostgreSQL container the tests, their Testcontainers helpers, the
 * benchmarks and the pack smoke test start is this image, so all of them run the major version PGlite embeds.
 * [Q82, A148]
 *
 * The official `postgres` image, tag `18-alpine`, pinned by the digest of its multi-platform index: PostgreSQL 18.6 on
 * Alpine 3.24.2, the index the tag named from 2026-09-21 to 2026-10-22 (`docker-library/repo-info`,
 * `repos/postgres/remote/18-alpine.md`), 33 days old when pinned on 2026-10-24. Docker pulls exactly these bytes
 * whatever the tag names later.
 *
 * To move it, change it here and in the supply-chain gate's image-pin agreement (`EXP_POSTGRES` in
 * `.github/workflows/supply-chain.yml`); `test/dependencies/postgres-image.test.ts` holds the same value and fails if
 * any file names another PostgreSQL image.
 */
export const POSTGRES_IMAGE =
  "postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873";
