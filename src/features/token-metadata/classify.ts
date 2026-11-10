/**
 * UmbraDB's classification of an observed event under MIP-0018: the codec's `classifyEvent` (`./codec/`),
 * plus the rule that every key is valid UTF-8 (MIP "Keys": keys MUST be valid UTF-8; Testing R5). An event the codec
 * accepts but whose records include a key that is not valid UTF-8 (RFC 3629, strict) is rejected whole — reason
 * `invalid-utf8`, `offset` = that record's `keyLen` byte (the first such record) — so none of its records applies.
 * The codec checks UTF-8 only for values; its own rejections are returned unchanged.
 *
 * Every UmbraDB path classifies through this function — the scan, the apply path and its recompute, the pure state
 * module and both vector adapters — never through the codec's `classifyEvent` directly.
 */
import { type Classification, classifyEvent, decodeUtf8, type ObservedMisc } from "./codec/index.js";

/** Whether `bytes` is well-formed UTF-8 (no overlong forms, surrogates, code points above U+10FFFF or truncation). */
export function isUtf8(bytes: Uint8Array): boolean {
  return decodeUtf8(bytes) !== undefined;
}

/** Classifies one observed event: the codec's result, with an accepted event rejected when a key is not UTF-8. */
export function classifyMip0018Event(event: ObservedMisc): Classification {
  const c = classifyEvent(event);
  if (c.result !== "accept") return c;
  const bad = c.records.find((r) => !isUtf8(r.key));
  return bad === undefined ? c : { result: "reject", reason: "invalid-utf8", offset: bad.offset };
}
