import { loadLedgerPackage } from "../../src/ledger/load.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { describeLedgerPackage } from "./adapter-suite.js";

// The adapter test suite against the v8 adapter (`src/ledger/v8.ts`, ledger-8.1.2 from `vendor/ledger/v8`), with
// v8's own clause: no contract logs. [A98, Q54]

describeLedgerPackage({ ledger: "v8", load: () => loadLedgerPackage("v8", { networkId: NETWORK_ID }), logs: "none" });
