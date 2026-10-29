import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import { contractAddress, makeV8State, V8_PACKAGE_PATH } from "./ledger-states.js";
import { free, hex } from "./node-format.js";
import { describeNodeStoreExports } from "./node-store-suite.js";

// The vendored ledger v8 package (ledger-8.1.2 with the patches in vendor/ledger/v8/patches), exercised on the built
// package. [design §5.2]

describeNodeStoreExports("vendored ledger v8", {
  packagePath: V8_PACKAGE_PATH,
  stateTag: "ledger-state[v13]",
  api: v8,
  makeState: makeV8State,
  contractAddress,
  contractStateSerialized(state, address) {
    const contract = state.index(hex(address));
    if (!contract) throw new Error("the state has no such contract");
    const bytes = contract.serialize();
    free(contract);
    return bytes;
  },
  emptyZswapStateSerialized() {
    const zswap = new v8.ZswapChainState();
    const bytes = zswap.serialize();
    free(zswap);
    return bytes;
  },
});
