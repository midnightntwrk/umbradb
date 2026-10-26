import { loadLedgerPackage } from "../../src/ledger/load.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { describeLedgerPackage } from "./adapter-suite.js";

// Task 12.1 of `openspec/changes/core-arch` (A98): the adapter test suite against the v8 adapter (`src/ledger/v8.ts`,
// ledger-8.1.2 from `vendor/ledger/v8`), with v8's clause of owner decision Q54: no contract logs.

describeLedgerPackage({ ledger: "v8", load: () => loadLedgerPackage("v8", { networkId: NETWORK_ID }), logs: "none" });
