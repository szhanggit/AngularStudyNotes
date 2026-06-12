import { Product } from './product.model'

export interface GetSingleProductResp {
    data: {
        productBasicInfo: Product;
    }
    message: string;
    success: boolean;
}