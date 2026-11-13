/**
 * The tests' oracle for RFC 3986 `URI` (scheme required, fragment allowed, ASCII only): the grammar of RFC 3986
 * Appendix A transcribed rule by rule into one regular expression. The codec checks URIs with TypeBox's `IsUri`
 * (`src/features/token-metadata/codec/uri.ts`), held to this transcription by `uri.test.ts`.
 */

const unreserved = "A-Za-z0-9\\-._~";
const subDelims = "!$&'()*+,;=";
const pctEncoded = "%[0-9A-Fa-f]{2}";
const pchar = `(?:[${unreserved}${subDelims}:@]|${pctEncoded})`;
const segment = `${pchar}*`;
const segmentNz = `${pchar}+`;
const decOctet = "(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])";
const ipv4 = `${decOctet}\\.${decOctet}\\.${decOctet}\\.${decOctet}`;
const h16 = "[0-9A-Fa-f]{1,4}";
const ls32 = `(?:${h16}:${h16}|${ipv4})`;
const ipv6 =
  `(?:(?:${h16}:){6}${ls32}` +
  `|::(?:${h16}:){5}${ls32}` +
  `|(?:${h16})?::(?:${h16}:){4}${ls32}` +
  `|(?:(?:${h16}:){0,1}${h16})?::(?:${h16}:){3}${ls32}` +
  `|(?:(?:${h16}:){0,2}${h16})?::(?:${h16}:){2}${ls32}` +
  `|(?:(?:${h16}:){0,3}${h16})?::${h16}:${ls32}` +
  `|(?:(?:${h16}:){0,4}${h16})?::${ls32}` +
  `|(?:(?:${h16}:){0,5}${h16})?::${h16}` +
  `|(?:(?:${h16}:){0,6}${h16})?::)`;
// ABNF literals are case-insensitive (RFC 5234 §2.3): "v" also matches "V".
const ipvFuture = `[vV][0-9A-Fa-f]+\\.[${unreserved}${subDelims}:]+`;
const ipLiteral = `\\[(?:${ipv6}|${ipvFuture})\\]`;
const regName = `(?:[${unreserved}${subDelims}]|${pctEncoded})*`;
const host = `(?:${ipLiteral}|${ipv4}|${regName})`;
const userinfo = `(?:[${unreserved}${subDelims}:]|${pctEncoded})*`;
const authority = `(?:${userinfo}@)?${host}(?::[0-9]*)?`;
const hierPart = `(?://${authority}(?:/${segment})*|/(?:${segmentNz}(?:/${segment})*)?|${segmentNz}(?:/${segment})*|)`;
const queryOrFragment = `(?:${pchar}|[/?])*`;
const scheme = "[A-Za-z][A-Za-z0-9+\\-.]*";

/** RFC 3986 `URI`, transcribed from Appendix A. */
export const RFC3986_URI = new RegExp(`^${scheme}:${hierPart}(?:\\?${queryOrFragment})?(?:#${queryOrFragment})?$`);
