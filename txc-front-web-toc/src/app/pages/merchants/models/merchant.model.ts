import { Shop } from "./shop.model";

export interface Merchant {
    merchantId : number;
    name : string;
    shop : Shop[]
}
