import { ProductPrice } from "./product-price.model";

export interface GetProductPriceResp {
    data: {
        productPriceDto: ProductPrice;
    }
    message: string;
    success: boolean;
}