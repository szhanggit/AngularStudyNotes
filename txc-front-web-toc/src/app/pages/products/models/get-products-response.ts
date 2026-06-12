import { Product } from './product.model'

export interface GetProductsResp {
    data: {
        productDtos: Product[];
        totalCount: number;
    }
    message: string;
    success: boolean;
}