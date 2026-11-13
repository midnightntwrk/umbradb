// valType 4: the RFC 3986 `URI` rule (MIP-0018 "Value types"; the URI definition ERC-721 `tokenURI` uses): a scheme is
// required (relative references are rejected), a fragment is allowed, and every character is ASCII (RFC 3986 has no
// non-ASCII characters; they must be percent-encoded). Values are only checked, never fetched, resolved or normalised.
//
// The check is TypeBox's `IsUri` (RFC 3986's grammar as one regular expression), held to a transcription of RFC 3986
// Appendix A by `test/features/token-metadata/uri.test.ts`, which also bounds its time on the longest values.

import { IsUri } from 'typebox/format';

/** True when `text` matches the RFC 3986 `URI` rule. */
export function isRfc3986Uri(text: string): boolean {
  return IsUri(text);
}
