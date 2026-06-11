export interface VoucherNumberRule {
    voucherNumberRuleId?: number;
    ruleName: string;
    voucherNumberPrefix: string;
    voucherNumberType: string;
    voucherNumberLength: number;
    barcodeType: DescriptionId;
    distVoucherNumUnderBarcode: string | boolean;
    generatedBy: string;
    createdDateTime: string;
    pinType?: DescriptionId;
    isUsed?: boolean;
    // ids
    algorithmId?: number;
    voucherGenerator: DescriptionId;
    // third party
    // TODO: confirm if typo from new graphql endpoint
    requestExpiryDate?: string | boolean;
    displayText?: string;
    hasMultipleBarcode?: string | boolean;
    onDemand?: string;
    orderNumber?: string;
    vendor: VendorData;
    currencyPartnerId?: string;
    createdBy?: string;
}

interface DescriptionId {
    description: string,
    id: number
}

interface VendorData {
    id?: string;
    name?: string;
    vendorCode?: string;
}