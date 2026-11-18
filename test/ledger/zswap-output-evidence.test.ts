import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { type LedgerEvent, type LedgerPackage, ZSWAP_CIPHERTEXT_BYTES } from "../../src/ledger/types.js";
import {
  block,
  type ContractFixture,
  contractFixture,
  fixtureGas,
  hex,
  type Ledger,
  NETWORK_ID,
  RAW,
  type RawPackage,
  systemTransaction,
  T0,
  VERIFIER_KEY,
} from "./adapter-fixtures.js";
import { decompressPoint, decrypt, indexOfBytes, scaleCompactValue, serializedCiphertext } from "./evidence-checks.js";
import { runRange } from "../backbone/contract-data-checks.js";
import { cappedAt, devnetSettings, LEDGER_CORE } from "../backbone/ledger-restart.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tapeTest } from "../tape/real/real-tapes.js";

// A zswap output's preimage evidence, as each vendored package exposes it (`vendor/ledger/<version>/patches/*-ledger-
// wasm-zswap-output-evidence.patch`) and each adapter stores it (`LedgerEvent.evidence`, `LedgerEvent.ciphertext`):
// - an output to a user's keys has a ciphertext: 224 bytes whose first 32 are a point of the curve, which, with the
//   six elements in the ledger's own encoding, are the bytes the event's serialization holds, and which the
//   recipient's encryption secret decrypts: element 0 to 0, and the coin's value among the others;
// - an output a contract owns (claimed by a call of the contract) has none;
// - every other event has neither;
// - on the recorded devnet (a tape test, skipped without it), every stored zswap output has its evidence, and each
//   ciphertext's point is on the curve and its bytes are its event's.
// The transactions are built with the package's published API (`./adapter-fixtures.ts`), never through the adapter.

const LEDGERS: readonly Ledger[] = ["v8", "v9-rc3", "v9-rc5", "v9"];
const LONG = 120_000;
/** A test seed, and the coin's value: test values, not a wallet's. */
const SEED = new Uint8Array(32).fill(7);
const VALUE = 1_234_567n;

/** A proof-erased transaction whose guaranteed offer creates one output of `VALUE` to the keys of {@link SEED}. */
function outputToKeys(raw: RawPackage): { readonly bytes: Uint8Array; readonly secret: bigint } {
  const keys = raw.ZswapSecretKeys.fromSeed(SEED);
  const secret = scaleCompactValue(keys.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize());
  const token = raw.shieldedToken().raw;
  const output = raw.ZswapOutput.new(raw.createShieldedCoinInfo(token, VALUE), 0, keys.coinPublicKey, keys.encryptionPublicKey);
  const offer = raw.ZswapOffer.fromOutput(output, token, VALUE);
  const bytes = raw.Transaction.fromParts(NETWORK_ID, offer, undefined, undefined).eraseProofs().serialize();
  keys.clear();
  return { bytes, secret };
}

/**
 * A proof-erased transaction whose guaranteed offer creates an output that `contract` owns, which a call of the
 * contract claims as a receive (the VM's `claimZswapCoinReceive`, as Compact's `receiveShielded` compiles it).
 */
function outputToContract(raw: RawPackage, contract: ContractFixture): Uint8Array {
  const token = raw.shieldedToken().raw;
  const output = raw.ZswapOutput.newContractOwned(raw.createShieldedCoinInfo(token, 5n), 0, hex(contract.address));
  const offer = raw.ZswapOffer.fromOutput(output, token, 5n);
  const bytesAtom = (bytes: Uint8Array, length: number) => ({
    value: [bytes],
    alignment: [{ tag: "atom" as const, value: { tag: "bytes" as const, length } }],
  });
  const program = [
    { swap: { n: 0 } },
    { idx: { cached: true, pushPath: true, path: [{ tag: "value" as const, value: bytesAtom(Uint8Array.of(1), 1) }] } },
    { push: { storage: false, value: { tag: "cell" as const, content: bytesAtom(Buffer.from(output.commitment, "hex"), 32) } } },
    { push: { storage: false, value: { tag: "null" as const } } },
    { ins: { cached: true, n: 2 } },
    { swap: { n: 0 } },
  ];
  const effects = {
    claimedNullifiers: [],
    claimedShieldedReceives: [output.commitment],
    claimedShieldedSpends: [],
    claimedContractCalls: [],
    shieldedMints: new Map(),
    unshieldedMints: new Map(),
    unshieldedInputs: new Map(),
    unshieldedOutputs: new Map(),
    claimedUnshieldedSpends: new Map(),
  };
  const operation = new raw.ContractOperation();
  operation.verifierKey = VERIFIER_KEY;
  const empty = { value: [], alignment: [] };
  const call = new raw.ContractCallPrototype(
    hex(contract.address),
    "emit",
    operation,
    { gas: fixtureGas(raw), effects, program },
    undefined,
    [],
    empty,
    empty,
    raw.communicationCommitmentRandomness(),
    "emit",
  );
  const intent = raw.Intent.new(new Date(T0 + 60_000)).addCall(call);
  return raw.Transaction.fromParts(NETWORK_ID, offer, undefined, intent).eraseProofs().serialize();
}

for (const ledger of LEDGERS) {
  describe(`${ledger}: a zswap output's preimage evidence`, () => {
    let adapter: LedgerPackage;
    const raw = RAW[ledger];
    beforeAll(async () => {
      adapter = await loadLedgerPackage(ledger, { networkId: NETWORK_ID });
    }, LONG);

    it("an output to a user's keys: its ciphertext, 224 bytes the event holds, which the recipient's secret decrypts", { timeout: LONG }, () => {
      const { bytes, secret } = outputToKeys(raw);
      const { output } = adapter.apply(adapter.emptyState(), block([bytes]));
      expect(output.results.map((result) => result.outcome)).toEqual(["success"]);
      const outputs = output.events.filter((event) => event.kind === "zswap-output");
      expect(outputs).toHaveLength(1);
      const event = outputs[0] as LedgerEvent;
      expect(event.evidence).toBe("ciphertext");
      const ciphertext = event.ciphertext as Uint8Array;
      expect(ciphertext).toBeInstanceOf(Uint8Array);
      expect(ciphertext.length).toBe(ZSWAP_CIPHERTEXT_BYTES);
      // The point is a point of the curve, and the point and the six elements are what the event's serialization holds.
      expect(decompressPoint(ciphertext.subarray(0, 32))).not.toBeNull();
      expect(indexOfBytes(event.bytes, serializedCiphertext(ciphertext))).toBeGreaterThan(0);
      // The recipient's ownership test: element 0 decrypts to 0, and the coin's value is among the others.
      const plain = decrypt(raw, ciphertext, secret);
      expect(plain[0]).toBe(0n);
      expect(plain.slice(1)).toContain(VALUE);
      // Another key's test fails.
      expect(decrypt(raw, ciphertext, secret + 1n)[0]).not.toBe(0n);
      // The event, read again by the package, says the same.
      const again = raw.Event.deserialize(event.bytes);
      const content = again.content as { preimageEvidenceKind: string; ciphertext?: Uint8Array };
      expect([content.preimageEvidenceKind, hex(content.ciphertext as Uint8Array)]).toEqual(["ciphertext", hex(ciphertext)]);
    });

    it("an output a contract owns: no evidence (none), no ciphertext", { timeout: LONG }, async () => {
      const contract = await contractFixture(raw);
      const { output } = adapter.apply(adapter.emptyState(), block([contract.deploy, outputToContract(raw, contract)]));
      expect(output.results.map((result) => result.outcome)).toEqual(["success", "success"]);
      const outputs = output.events.filter((event) => event.kind === "zswap-output");
      expect(outputs.map((event) => [hex(event.contractAddress as Uint8Array), event.evidence, event.ciphertext])).toEqual([
        [hex(contract.address), "none", null],
      ]);
      const content = raw.Event.deserialize((outputs[0] as LedgerEvent).bytes).content as { preimageEvidenceKind: string; ciphertext?: unknown };
      expect([content.preimageEvidenceKind, "ciphertext" in content]).toEqual(["none", false]);
    });

    it("every event that is no zswap output has neither evidence nor ciphertext", { timeout: LONG }, async () => {
      const contract = await contractFixture(raw);
      const { output } = adapter.apply(adapter.emptyState(), block([systemTransaction(ledger), contract.deploy]));
      expect(output.events.length).toBeGreaterThan(0);
      for (const event of output.events) {
        expect(event.kind).not.toBe("zswap-output");
        expect([event.kind, event.evidence, event.ciphertext]).toEqual([event.kind, null, null]);
      }
    });
  });
}

describe("the recorded devnet's zswap outputs, stored (skipped by name without its tape)", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;
  beforeAll(() => backend.start(), LONG);
  afterAll(() => backend.stop(), LONG);

  tapeTest(
    "devnet-v8-v9-0-235",
    "on devnet-v8-v9-0-235 (v8, then v9 as runtime 2.1.0 built it), every stored zswap output has its evidence; each ciphertext's point is on the curve and its bytes are the event's",
    async (found) => {
      const db = await backend.database();
      const ran = await runRange(db, cappedAt(found.read().records, 235n), 235n, { core: LEDGER_CORE, settings: devnetSettings(found), stop: 235n }, 900_000);
      expect(ran.status).toMatchObject({ cursor: 235n, reason: null });
      const rows = await db.query(
        `SELECT height::text AS height, kind, evidence, encode(bytes, 'hex') AS bytes, encode(ciphertext, 'hex') AS ciphertext
           FROM core_ledger_state.events ORDER BY height, tx_index, event_index`,
      );
      const outputs = rows.filter((row) => row.kind === "zswap-output");
      expect(outputs.length).toBeGreaterThan(0);
      expect(rows.filter((row) => row.kind !== "zswap-output" && (row.evidence !== null || row.ciphertext !== null))).toEqual([]);
      for (const row of outputs) {
        expect(["ciphertext", "public", "none"], `${String(row.height)}`).toContain(row.evidence);
        if (row.evidence !== "ciphertext") {
          expect(row.ciphertext).toBeNull();
          continue;
        }
        const ciphertext = Buffer.from(row.ciphertext as string, "hex");
        expect(ciphertext.length).toBe(ZSWAP_CIPHERTEXT_BYTES);
        expect(decompressPoint(ciphertext.subarray(0, 32)), `${String(row.height)}`).not.toBeNull();
        expect(indexOfBytes(Buffer.from(row.bytes as string, "hex"), serializedCiphertext(ciphertext))).toBeGreaterThan(0);
      }
    },
    { timeoutMs: 1_200_000 },
  );
});
