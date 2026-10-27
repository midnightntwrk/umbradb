import { loadLedgerPackage } from "../../src/ledger/load.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { describeLedgerPackage } from "./adapter-suite.js";

// Task 12.2a of `openspec/changes/core-arch` (A159, A98; LG-3, LG-6; owner decision Q139 A): the adapter test suite
// against the adapter of ledger v9 as runtime 2.0 built it (`src/ledger/v9.ts`'s `createV9Rc3Adapter`,
// ledger-9.1.0.0-rc.3 from `vendor/ledger/v9-rc3`): the v9 adapter over the rc.3 package, whose `apply` reports contract
// logs as v9's does, and which carries no v8 → v9 conversion (the node that builds it, 2.0.0-rc.4, has none). Its
// genesis fixture is stagenet's, with the stagenet node's root at block 0 (`fixtures/genesis/node-roots.json`).

describeLedgerPackage({
  ledger: "v9-rc3",
  load: () => loadLedgerPackage("v9-rc3", { networkId: NETWORK_ID }),
  logs: "decoded",
});
