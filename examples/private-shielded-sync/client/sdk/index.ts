/** The wallet SDK part of the client (`../sdk-api.ts` declares it for the rest). Needs the client's install. */

import type { SdkModule } from "../sdk-api.ts";
import { openFeeWallet, payProveSubmit } from "./fee-wallet.ts";
import { seedsFromMnemonic } from "./seeds.ts";

export { openFeeWallet, payProveSubmit, seedsFromMnemonic };

export const sdk = { seedsFromMnemonic, openFeeWallet, payProveSubmit } satisfies SdkModule;
