import { Merchant } from './merchant.model'

export interface GetMerchantResponse {
    data: {
        merchantDetails: Merchant[],
        totalCount: number
    },
    message: string;
    success: boolean;
}