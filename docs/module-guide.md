# UmbraDB module guide

How to write a module's tables and SQL so that UmbraDB's determinism rules accept them and every machine that runs the
module holds the same data.

## Time values

Store times as `timestamptz`, and write every time with an offset, `Z`. This is the preferred time type for module
tables and for anything UmbraDB itself represents (owner decisions Q68 and Q74 of the `core-arch` change).

- **`timestamptz` is allowed everywhere.** Every module table may store it, as a value and in a primary key. UmbraDB
  hashes it as its microseconds since `1970-01-01T00:00:00Z` and orders keys by time. A query reads it back as RFC 3339
  text in UTC: `2025-05-21T14:30:00Z`, with the fraction when there is one, up to microseconds
  (`2025-05-21T14:30:00.123456Z`). The text is the same in every process and on both backends, whatever the machine's
  time zone.
- **Write it with `Z`.** Write a literal as `'2025-05-21T14:30:00Z'`, or pass the time as a parameter. A time a query
  read back can be sent back unchanged, and a JavaScript `Date` is sent with `Z`.
- **Do not rely on the session's time zone.** A literal without an offset (`'2025-05-21 14:30:00'`) is read in the
  session's `TimeZone`. UmbraDB pins every session to UTC, and a module must not change it (`SET TimeZone`, `SET LOCAL
  TimeZone`): a time written without an offset would then be another instant, and UmbraDB refuses to read a
  `timestamptz` printed in another time zone (`database-error`, `reason: unreadable-result`).
- **Use `NULL` for "no time".** `infinity` and `-infinity` can be stored, but they have no microseconds since 1970, so
  the contents hash refuses them (`unencodable-row`). A time outside the years 0001 to 9999 cannot be read back
  (`unreadable-result`).
- **Take times from the block, never from the clock.** A default such as `now()` or `CURRENT_TIMESTAMP` gives each
  machine a different value, and startup refuses it (`non-deterministic-column`).
- **`bigint` is allowed** for a time as a number, for example milliseconds since 1970, the form the node gives block
  times in. Present it as `timestamptz` text where people read it.
- **A time in `text` is allowed, but it is not good practice.** Nothing checks its form, two spellings of one instant
  (`2025-05-21T14:30:00Z` and `2025-05-21T16:30:00+02:00`) hash and compare as different values, and it sorts as text,
  not by time.
- **The other date and time types are refused** at startup with `unsupported-column-type`: `timestamp` and `date` hold
  no time zone, so one value is a different instant in each time zone; a `time` or `timetz` is a time of day, not an
  instant; an `interval` compares as if a month were 30 days and a day 24 hours, so equal intervals print differently.
  Use `timestamptz`, written with `Z`; for a time of day or a length of time, `bigint` microseconds. Floating-point
  types are refused too, and a time inside `jsonb` is text, with `jsonb`'s rules.
