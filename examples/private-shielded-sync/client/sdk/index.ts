/** The wallet SDK part of the client (`../sdk-api.ts` declares it for the rest). Needs the client's install. */

import type { SdkModule } from "../sdk-api.ts";
import { openFeeWallet, payProveSubmit, submitFinalized } from "./fee-wallet.ts";
import { proveAndValidate } from "./private-dust.ts";
import { seedsFromMnemonic } from "./seeds.ts";

export { openFeeWallet, payProveSubmit, proveAndValidate, seedsFromMnemonic, submitFinalized };

export const sdk = { seedsFromMnemonic, openFeeWallet, payProveSubmit, proveAndValidate, submitFinalized } satisfies SdkModule;
