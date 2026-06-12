export interface ResponseContractSKUCostsMerchant {
    costWithTax: number;
    skuCostContract: SkuCostContract;
    validStartDate: string;
    validEndDate: string;
}

export interface SkuCostContract {
    merchant?: Merchant;
}

export interface Merchant {
    name?: string;
    merchantId: number;
}

