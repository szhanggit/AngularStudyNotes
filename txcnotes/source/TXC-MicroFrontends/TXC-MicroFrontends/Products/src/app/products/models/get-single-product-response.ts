import { Product } from './product.model'

export interface GetSingleProductResp {
    data: {
        productBasicInfo: Product | null;
    }
    message: string;
    success: boolean;
}