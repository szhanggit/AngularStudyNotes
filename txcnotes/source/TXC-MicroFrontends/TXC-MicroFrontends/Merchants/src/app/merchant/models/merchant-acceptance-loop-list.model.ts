import { AcceptanceLoopMerchantShop } from "./acceptance-loop.model";
import { Merchant } from "./merchant.model";
import { Shop } from "./shop.model";

export interface AcceptanceLoopList {
    id: number;
    name: string;
    description: string;
    acType: string;
    merchants : Merchant[];
    merchantsDisplay : Merchant[];
    availableShops : string;
    shops : AcceptanceLoopMerchantShop[];
    productAmount : string;
    creator : string;
    createdTime : string;
    isDefault : boolean;
}
