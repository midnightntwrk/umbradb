// Internal entry point for tests (rule mutations, fuzzing). Not a stable API.
export { ALL_CODEC_RULES, type CodecRules } from './rules.js';
export { decodePayloadWith, BoundsInvariantError } from './decode.js';
export { classifyEventWith } from './classify.js';
export { checkValue, decodeUintWith } from './values.js';
