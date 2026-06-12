export interface Product {
    productId: number;
    productCode: string;
    productName: string;
    description?: string;
    productDescription?: string;
    productTag?: number;
    productCategory?: number;
    productIssuer?: number;
    productVersionId?: number;
    merchantSKU?: number;
    productType: number;
    generatedBy: number;
    createdBy?: string;
    createdOn?: string;
    status?: number;
    brandId?: number;
    externalProductCode?: string;
    merchantSKUId?: number;
    voucherIssuerId?: number;
    operationNote?: string;
    salesNote?: string;
    customerServiceNote?: string;
    stopIssueTime?: string;
    version?: number;
    lastUpdatedBy?: string;
    lastUpdatedOn?: string;
    reminderId: number;
    skuId?: number;
    acceptanceLoopId?: number;
    brandName?: string;
    faceValueWithTax?: number;
    checked?: boolean;
    multipleSelectionType: number;
    issueMerchant: number;
    merchantAcquirerId?: number;
    currentProductVersionId?: number;
    productCombo?: ProductComboProperty;
    contractSku?: any;
}

export interface ProductComboProperty {
    productComboId?: number; 
    productId?: number; 
    childProductId?: number; 
    childProductVersionId?: number; 
    sequence?: number;
    status?: number;
}
