export interface VoucherNumberRule {
    voucherRuleID?: number;
    voucherNumberRuleId?: number;
    ruleName: string;
    voucherNumberPrefix: string;
    voucherNumberType: number | string;
    voucherNumberLength: number;
    barcodeType: DescriptionId;
    distVoucherNumUnderBarcode: string | boolean;
    generatedBy: string;
    createdDateTime: string;
    pinType?: DescriptionId;
    isUsed?: boolean;
    // ids
    algorithmId?: number;
    barcodeTypeId?: number;
    voucherGeneratorId?: number;
    voucherNumberTypeId?: number;
    pinTypeId?: number;
    // third party
    // requireExpiryDate?: string;
    // confirm if typo from new graphql endpoint
    requestExpiryDate?: string | boolean;
    displayText?: string;
    // multipartbarcode?: string;
    hasMultipleBarcode?: string | boolean;
    onDemand?: string | boolean;
    orderNumber?: string;
    vendorId?: string;
    vendorName?: string;
    vendorCode?: string;
    currencyPartnerId?: string;
    createdBy?: string;
}

interface DescriptionId {
    description: string,
    id: number
}