import { describe, expect, it } from "vitest";
import { isRfc3986Uri } from "../../../src/features/token-metadata/codec/index.js";

/**
 * The codec's URI check (valType 4): the RFC 3986 `URI` rule, transcribed from Appendix A into one regular expression
 * (`src/features/token-metadata/codec/uri.ts`). Each case below has the verdict the grammar gives it, and the longest
 * values a payload holds are answered in bounded time. The MIP's informative URI vectors run through the codec in
 * `vectors.test.ts`.
 */

const ACCEPTED = [
  // Accepted: a scheme, then any hier-part.
  "ipfs://bafy/x.png",
  "https://example.com/logo.png?size=64#top",
  "HTTPS://EXAMPLE.COM",
  "a:",
  "a:b",
  "urn:isbn:0451450523",
  "mailto:a@b.example",
  "data:image/png;base64,iVBORw0KGgo=",
  "http://[::1]:80/",
  "http://[2001:db8::7]/c=GB?objectClass?one",
  "http://[v1.x]/",
  "http://[V1.x]/",
  "http://1.2.3.4/",
  "http://256.1.1.1/",
  "http://user:pass@host:8080/p",
  "a:%41",
  "a:?q?/",
  "a:#f/?",
  "a://",
  "a:/",
  "a:///",
];

const REFUSED = [
  // Refused: no scheme, a bad scheme, a character outside the grammar, a bad escape or IP literal.
  "",
  "no scheme",
  "//host/path",
  "/path",
  "1a:b",
  "-a:b",
  ":b",
  "http://a b",
  "http://ä.example/logo.png",
  "http://%zz",
  "a:%4",
  "a:#f#",
  "http://[::1/",
  "http://[1:2:3:4:5:6:7:8:9]/",
  "http://[v1]/",
  "a:b\u0000",
  "a:b\n",
  "a:\\",
  "a:<b>",
  "a:{b}",
  "a:|",
  "a:^",
  "a:`",
];

describe("the codec's URI check, RFC 3986 Appendix A", () => {
  it("accepts a scheme followed by any hier-part, query and fragment", () => {
    expect(ACCEPTED.filter((text) => !isRfc3986Uri(text))).toEqual([]);
    expect(ACCEPTED.length).toBeGreaterThan(10);
  });

  it("refuses a relative reference, a bad scheme, a character outside the grammar, a bad escape or IP literal", () => {
    expect(REFUSED.filter(isRfc3986Uri)).toEqual([]);
    expect(REFUSED.length).toBeGreaterThan(10);
  });

  it("answers the longest values a payload holds in bounded time", () => {
    const worst = ["a:" + "%".repeat(217), "a://" + "[".repeat(215), "a://" + "1.".repeat(107) + "x", "a:" + "@:".repeat(108) + "\\"];
    const started = performance.now();
    for (const text of worst) isRfc3986Uri(text);
    expect(performance.now() - started).toBeLessThan(50);
  });
});
