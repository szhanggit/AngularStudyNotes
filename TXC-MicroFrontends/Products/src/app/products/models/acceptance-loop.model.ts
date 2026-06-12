export interface AcceptanceLoop {
    acceptanceLoopId: number,
    code: string,
    description: string,
    status: boolean,
    isDefault: boolean,
    createdOn:Date,
    createdBy: string,
    acceptanceLoopMerchants: any[];
    availableShops: string;
    merchantsDisplay: MerchantAggregation[];
    merchantAggregation: MerchantAggregation[],
    shopCountAvailableInAL: number;
    isExpanded?: boolean;
}

export interface GroupAcceptanceLoop extends AcceptanceLoop {
    products: ALProduct,
    merchantAggregation: MerchantAggregation[],

    isExpanded: boolean;
    merchantsDisplay: MerchantAggregation[],
}

export interface ALProduct {
    totalCount: number
}

export interface MerchantAggregation {
    acceptanceLoopMerchantId: number,
    merchantId: number,
    merchantName: string,
    availableShopCount: number,
    selectedShopCount: number,
    merchantShopCount: number,
    merchantActiveShopCount: number,
    merchantInactiveShopCount: number,
    status: boolean;
}