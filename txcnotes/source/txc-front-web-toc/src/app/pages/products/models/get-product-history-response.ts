import { Product } from './product.model'

export interface GetProductHistoryResp {
    data: {
        productHistoryList: Product[];
        totalCount: number;
    }
    message: string;
    success: boolean;
}