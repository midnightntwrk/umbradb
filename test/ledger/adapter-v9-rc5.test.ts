import { loadLedgerPackage } from "../../src/ledger/load.js";
import { NETWORK_ID } from "./adapter-fixtures.js";
import { describeLedgerPackage } from "./adapter-suite.js";

// The adapter test suite against the adapter of ledger v9 as runtime 2.1.0 built it (`src/ledger/v9.ts`'s
// `createV9Rc5Adapter`, ledger-9.1.0.0-rc.5 from `vendor/ledger/v9-rc5`): the v9 adapter over the rc.5 package, whose
// `apply` reports contract logs as v9's does, with the v8 → v9 translation `midnight-node` 2.1.0-rc.4 pins.

describeLedgerPackage({
  ledger: "v9-rc5",
  load: () => loadLedgerPackage("v9-rc5", { networkId: NETWORK_ID }),
  logs: "decoded",
});
