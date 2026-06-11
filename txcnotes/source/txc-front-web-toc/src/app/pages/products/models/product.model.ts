export interface Product {
    productId: number;
    productCode: string;
    productName: string;
    description?: string;
    productTag?: number;
    productCategory?: number;
    productIssuer?: number;
    productVersionId?: number;
    merchantSKU?: number;
    productType: number;
    generatedBy?: number;
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

    faceValueWithTax?: number;
    checked?: boolean;
}