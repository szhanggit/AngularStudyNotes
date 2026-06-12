import { AcceptanceLoopMerchantShop } from "./acceptance-loop-merchant-shop.model";
import { Merchant } from "./merchant.model";

export interface AcceptanceLoopMerchant {
    merchant : Merchant[],
    acceptanceLoopMerchantShops : AcceptanceLoopMerchantShop[]
}
