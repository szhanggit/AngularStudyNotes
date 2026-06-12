import { Shop } from "./shop.model";

export interface GetShopResponse {
    data: {
        shopDetailsModel: Shop[],
        totalCount: number
    },
    message: string;
    success: boolean;
}