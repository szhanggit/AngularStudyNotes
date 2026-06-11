export interface DeliveryDetail {
    beneficiaryName: string;
    voucherQuantity: number,
    contactInfoPhoneNumber?: string,
    contactInfoEmailAddress?: string,
    faceValue?: number,
    edOrderNumber?: string,
    language?: string,
    postCode?: string,
    address: string,
    postCodeAddress: string,
}