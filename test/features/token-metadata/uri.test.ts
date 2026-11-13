import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { isRfc3986Uri } from "../../../src/features/token-metadata/codec/index.js";
import { RFC3986_URI } from "./rfc3986.js";

/**
 * The codec's URI check (valType 4), TypeBox's `IsUri`, against the RFC 3986 `URI` rule transcribed from Appendix A
 * (`./rfc3986.ts`): the same verdict on every case below and on generated texts built from the grammar's pieces, and a
 * bounded time on the longest values a payload holds. The MIP's informative URI vectors run through the codec in
 * `vectors.test.ts`.
 */

const CASES = [
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

const PIECES = [
  "//", "/", "?", "#", ":", "@", "[", "]", "%", "%2F", "%g1", "[::1]", "[v1.x]", "[1:2:3:4:5:6:7:8]", "1.2.3.4",
  "256.1.1.1", ":80", "http:", "a:", "a", "Z", "0", "9", "-", ".", "_", "~", "!", "$", "&", "'", "(", ")", "*", "+",
  ",", ";", "=", "é", " ", "\\", "\u0000",
];

describe("the codec's URI check against RFC 3986 Appendix A", () => {
  it("agrees with the transcribed grammar on every case", () => {
    const disagree = CASES.filter((text) => isRfc3986Uri(text) !== RFC3986_URI.test(text));
    expect(disagree).toEqual([]);
    expect(CASES.filter(isRfc3986Uri).length).toBeGreaterThan(10);
    expect(CASES.filter((text) => !isRfc3986Uri(text)).length).toBeGreaterThan(10);
  });

  it("agrees with the transcribed grammar on generated texts", () => {
    const text = fc.array(fc.constantFrom(...PIECES), { maxLength: 12 }).map((pieces) => pieces.join(""));
    const withScheme = fc.tuple(fc.constantFrom("a:", "http://", "x-y.z+1:", "urn:"), text).map(([s, t]) => s + t);
    fc.assert(
      fc.property(fc.oneof(text, withScheme), (t) => isRfc3986Uri(t) === RFC3986_URI.test(t)),
      { numRuns: 50_000 },
    );
  });

  it("answers the longest values a payload holds in bounded time", () => {
    const worst = ["a:" + "%".repeat(217), "a://" + "[".repeat(215), "a://" + "1.".repeat(107) + "x", "a:" + "@:".repeat(108) + "\\"];
    const started = performance.now();
    for (const text of worst) isRfc3986Uri(text);
    expect(performance.now() - started).toBeLessThan(50);
  });
});
