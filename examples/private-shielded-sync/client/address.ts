/**
 * Shielded addresses (spec FR-120): bech32m (BIP-350) strings `mn_shield-addr_<network>1…` whose 64-byte payload is
 * the coin public key followed by the encryption public key, as the wallet SDK's `ShieldedAddress` codec writes them
 * (`@midnightntwrk/wallet-sdk-address-format`). Midnight addresses are longer than BIP-173's 90 characters, so no
 * overall length limit applies. Mainnet addresses carry no network segment.
 */

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
const BECH32M_CONST = 0x2bc830a3;

function polymod(values: readonly number[]): number {
  let chk = 1;
  for (const v of values) {
    const top = chk >>> 25;
    chk = (((chk & 0x1ffffff) << 5) ^ v) >>> 0;
    for (let i = 0; i < 5; i++) if ((top >>> i) & 1) chk = (chk ^ GENERATOR[i]!) >>> 0;
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const out: number[] = [];
  for (const c of hrp) out.push(c.charCodeAt(0) >>> 5);
  out.push(0);
  for (const c of hrp) out.push(c.charCodeAt(0) & 31);
  return out;
}

function convertBits(data: Uint8Array | readonly number[], from: number, to: number, pad: boolean): number[] {
  let acc = 0;
  let bits = 0;
  const out: number[] = [];
  const max = (1 << to) - 1;
  for (const v of data) {
    if (v < 0 || v >> from !== 0) throw new Error("invalid value for bit conversion");
    acc = (acc << from) | v;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >> bits) & max);
    }
    acc &= (1 << bits) - 1;
  }
  if (pad) {
    if (bits > 0) out.push((acc << (to - bits)) & max);
  } else if (bits >= from || ((acc << (to - bits)) & max) !== 0) {
    throw new Error("invalid padding in bech32m data");
  }
  return out;
}

export function bech32mEncode(hrp: string, data: Uint8Array): string {
  if (hrp.length === 0 || /[^\x21-\x7e]/.test(hrp) || hrp !== hrp.toLowerCase()) throw new Error(`invalid bech32m prefix: ${hrp}`);
  const words = convertBits(data, 8, 5, true);
  const mod = polymod([...hrpExpand(hrp), ...words, 0, 0, 0, 0, 0, 0]) ^ BECH32M_CONST;
  const checksum = Array.from({ length: 6 }, (_, i) => (mod >>> (5 * (5 - i))) & 31);
  return `${hrp}1${[...words, ...checksum].map((w) => CHARSET[w]).join("")}`;
}

export function bech32mDecode(text: string): { hrp: string; data: Uint8Array } {
  if (text !== text.toLowerCase() && text !== text.toUpperCase()) throw new Error("bech32m string mixes cases");
  const s = text.toLowerCase();
  const sep = s.lastIndexOf("1");
  if (sep < 1 || sep + 7 > s.length) throw new Error("not a bech32m string");
  const hrp = s.slice(0, sep);
  if (/[^\x21-\x7e]/.test(hrp)) throw new Error("invalid bech32m prefix");
  const words: number[] = [];
  for (const c of s.slice(sep + 1)) {
    const w = CHARSET.indexOf(c);
    if (w < 0) throw new Error(`invalid bech32m character ${c}`);
    words.push(w);
  }
  if (polymod([...hrpExpand(hrp), ...words]) !== BECH32M_CONST) throw new Error("bech32m checksum mismatch");
  return { hrp, data: Uint8Array.from(convertBits(words.slice(0, -6), 5, 8, false)) };
}

export interface ShieldedAddress {
  /** 32 bytes, hex. */
  readonly coinPublicKey: string;
  /** 32 bytes, hex. */
  readonly encryptionPublicKey: string;
}

const prefixOf = (network: string): string => (network === "mainnet" ? "mn_shield-addr" : `mn_shield-addr_${network}`);

/** Parses a shielded address for `network`; refuses another network, type or payload size. */
export function parseShieldedAddress(text: string, network: string): ShieldedAddress {
  const { hrp, data } = bech32mDecode(text);
  if (hrp !== prefixOf(network)) throw new Error(`expected a ${prefixOf(network)} address, got ${hrp}`);
  if (data.length !== 64) throw new Error(`a shielded address carries 64 bytes, got ${data.length}`);
  const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
  return { coinPublicKey: hex(data.subarray(0, 32)), encryptionPublicKey: hex(data.subarray(32)) };
}

export function formatShieldedAddress(address: ShieldedAddress, network: string): string {
  const data = Buffer.concat([Buffer.from(address.coinPublicKey, "hex"), Buffer.from(address.encryptionPublicKey, "hex")]);
  if (data.length !== 64) throw new Error("a shielded address needs two 32-byte keys");
  return bech32mEncode(prefixOf(network), new Uint8Array(data));
}
