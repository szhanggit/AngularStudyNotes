export interface MerchantAddressBody {
    merchant: MerchantBody;
    address: AddressBody;
}

interface IMerchantBody {
    programId: number;
    name: string;
    externalCode: string;
    invoiceRegisterNumber: string;
    securityKey: string;
    status: number;
    tX1MerchantUID: string;
    isAutoCreateReimbursement: boolean;
    autoCreateReimbursementIntervalType: number;
    reimbursementTaxType: number;
    reimbursementReceivers: string;
    sameKeyWithShop: boolean;
    mamEmail: string;
    reimbursementType: number;
    merchantAutoType: number;
    notificationMerchantCode: string;
    merchantEmail: string;
    merchantAcquirerId: number;
    needConsumerScan: boolean;
    memo: string;
    issuerType: number;
    modifier: string;
    isLegacyMerchant: boolean;
    mainContact: string;
    mainPhone: string;
    autoCreateReimbursementDay: number;
    description: string;
    categoryId: number;
    merchantContactEmailList: any[] | string[];
    edenredContactEmailList: any[] | string[];
}

export class MerchantBody {
    programId: number;
    name: string;
    externalCode: string;
    invoiceRegisterNumber: string;
    securityKey: string;
    status: number;
    tX1MerchantUID: string;
    isAutoCreateReimbursement: boolean = false;
    autoCreateReimbursementIntervalType: number;
    reimbursementTaxType: number;
    reimbursementReceivers: string;
    sameKeyWithShop: boolean = false;
    mamEmail: string;
    reimbursementType: number;
    merchantAutoType: number;
    notificationMerchantCode: string;
    merchantEmail: string;
    merchantAcquirerId: number;
    needConsumerScan: boolean = false;
    memo: string;
    issuerType: number;
    modifier: string;
    isLegacyMerchant: boolean = false;
    mainContact: string;
    mainPhone: string;
    autoCreateReimbursementDay?: number | null;
    description: string;
    categoryId: number;
    merchantContactEmailList: any[] | string[] = [];
    edenredContactEmailList: any[] | string[] = [];

    id?: number;
    constructor(merchantBody?: IMerchantBody) {
        this.programId = merchantBody?.programId ?? 0;
        this.name = merchantBody?.name ?? '';
        this.externalCode = merchantBody?.externalCode ?? '';
        this.invoiceRegisterNumber = merchantBody?.invoiceRegisterNumber ?? '';
        this.securityKey = merchantBody?.securityKey ?? '';
        this.status = merchantBody?.status ?? 0;
        this.tX1MerchantUID = merchantBody?.tX1MerchantUID ?? "";
        this.isAutoCreateReimbursement = merchantBody?.isAutoCreateReimbursement ?? false;
        this.autoCreateReimbursementIntervalType = merchantBody?.autoCreateReimbursementIntervalType ?? 0;
        this.autoCreateReimbursementDay = merchantBody?.autoCreateReimbursementDay ?? null;
        this.reimbursementTaxType = merchantBody?.reimbursementTaxType ?? 0;
        this.reimbursementReceivers = merchantBody?.reimbursementReceivers ?? "";
        this.sameKeyWithShop = merchantBody?.sameKeyWithShop ?? false;
        this.mamEmail = merchantBody?.mamEmail ?? "";
        this.reimbursementType = merchantBody?.reimbursementType ?? 0;
        this.merchantAutoType = merchantBody?.merchantAutoType ?? 0;
        this.notificationMerchantCode = merchantBody?.notificationMerchantCode ?? "";
        this.merchantEmail = merchantBody?.merchantEmail ?? "";
        this.merchantAcquirerId = merchantBody?.merchantAcquirerId ?? 0;
        this.needConsumerScan = merchantBody?.needConsumerScan ?? false;
        this.memo = merchantBody?.memo ?? "";
        this.issuerType = merchantBody?.issuerType ?? 0;
        this.modifier = merchantBody?.modifier ?? "";
        this.isLegacyMerchant = merchantBody?.isLegacyMerchant ?? false;
        this.mainContact = merchantBody?.mainContact ?? "";
        this.mainPhone = merchantBody?.mainPhone ?? "";
        this.autoCreateReimbursementDay = merchantBody?.autoCreateReimbursementDay;
        this.description = merchantBody?.description ?? "";
        this.categoryId = merchantBody?.categoryId ?? 0;
        this.merchantContactEmailList = merchantBody?.merchantContactEmailList ?? [];
        this.edenredContactEmailList = merchantBody?.edenredContactEmailList ?? [];
    }
}

export class AddressBody {
    id: number = 0;
    detailAddressLine: string = "";
    district: string = "";
    cityId: number = 0;
    stateOrProvinceId: number = 0;
    postcode: string = "";
    countryId: number = 0;
    longitude: number = 0;
    latitude: number = 0;
    status: number = 0
}