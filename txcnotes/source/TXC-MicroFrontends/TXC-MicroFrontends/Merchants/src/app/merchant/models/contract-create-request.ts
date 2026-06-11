export interface ContractCreateRequest {
        merchantId: number;
        contractId?: number;
        contractName: string;
        contractNumber? : string;
        startDate: string;
        endDate: string;
        paymentTermId: number;
        priceOptionId: number;
        costSchemeId: number;
        costPercentage: number;
        costRoundingRuleId: number;
        costRoundingPlacesId: number;
        listSku: ContractSKURequest[];
        data? : any;
}

export interface ContractDraftEditRequest {
    contractId:number;
    contractName: string;
    startDate: string;
    endDate: string;
    paymentTermId: number;
    priceOptionId: number;
    costSchemeId: number;
    costPercentage: number;
    costRoundingRuleId: number;
    costRoundingPlaceId: number;
    merchantId: number;
}

export interface ContractSKURequest{
    skuName: string;
    skuNumber: string;
    faceValueWithTax: number;
    multiplier? : number;
    skuTypeId: number;
    skuTypeText: string;
    costWithTax: number;
    validstartDate: string;
    validEndDate: string;
    voucherNumberRuleId: number;
    voucherNumberRuleText: string;
}
export interface SkuUpdateRequest{
    skuId:number,
    skuName: string;    
    faceValueWithTax: number;
    multiplier? : number;
    contractSkuCosts: ContractSkuCosts[];
}
export interface ContractSkuCosts{
    skuCostId?:number,
    costWithTax: number;
    validstartDate: string;
    validEndDate: string;
    contractId:number,
    statusId:number;
}

export interface SkuCreateRequest{
    skuName: string;  
    skuNumber: string;  
    skuTypeId : number;  
    faceValueWithTax: number;
    multiplier? : number;
    voucherNumberRuleId : number;
    contractSkuCosts: ContractSkuCosts[];
}

export interface ContractUpdateRequest {
    contractId: number;
    contractName: string;
    startDate: string;
    endDate: string;
    paymentTermId: number;
    priceOptionId: number;
    costSchemeId: number;
    costPercentage: number;
    costRoundingRuleId: number;
    costRoundingPlaceId: number;
    sku: ContractUpdateSkuCreateRequest[];
}

export interface ContractUpdateSkuCreateRequest{
    skuName: string;  
    skuNumber: string;  
    skuTypeId : number;  
    faceValueWithTax: number;
    multiplier? : number;
    voucherNumberRuleId : number;
    skuCost: ContractSkuCosts[];

}

export interface ContractBatchSku{
    contractId:number;
    sku:SKURequest[];
}
export interface SKURequest{
    skuName: string;
    skuNumber: string;
    faceValueWithTax: number;
    multiplier? : number;
    skuTypeId: number;
    costWithTax: number;
    validstartDate: string;
    validEndDate: string;
    voucherNumberRuleId: number;
}