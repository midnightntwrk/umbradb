// The MIP-0018 TokenMetadata codec of `token-metadata`: the event name, payload decoding and encoding, and the value
// rules (MIP-0018 "Event", "Payload", "Value types"). The rule that keys are valid UTF-8 is `../classify.ts`'s.
export {
  DOMAIN_SEP_SIZE,
  EVENT_NAME,
  EVENT_NAME_TEXT,
  HEADER_SIZE,
  Kind,
  MAX_VALUE_SIZE,
  MISC_EVENT_TYPE,
  NAME_SIZE,
  PAYLOAD_SIZE,
  UINT_MAX_BYTES,
  UINT_MIN_BYTES,
  ValType,
  type IgnoreReason,
  type RejectReason,
} from './constants.js';
export {
  decodePayload,
  type DecodedRecord,
  type DecodeFail,
  type DecodeOk,
  type DecodeResult,
  type Header,
  type MetadataRecord,
} from './decode.js';
export {
  commonRecords,
  encodePayload,
  InvalidHeader,
  InvalidRecord,
  PayloadTooLarge,
  record,
  recordsSize,
  withdrawRecords,
} from './encode.js';
export { classifyEvent, isMip0018Name, splitMiscData, type Classification, type ObservedMisc } from './classify.js';
export { checkValue, decodeUint, decodeUtf8, encodeUint, minimalUintWidth } from './values.js';
export { isRfc3986Uri } from './uri.js';
export { bytesEqual, fromHex, toHex, zeroExtend } from './hex.js';
