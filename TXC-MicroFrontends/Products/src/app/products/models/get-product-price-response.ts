import { ProductPrice } from "./product-price.model";

export interface GetProductPriceResp {
    data: ProductPrice;
    message: string;
    success: boolean;
}