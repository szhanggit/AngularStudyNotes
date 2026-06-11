export interface DirectDeliveryDetails {
  beneficiaryName: string;
  contactInfoEmailAddress: string;
  contactInfoPhoneNumber: string;
  faceValue: number;
  voucherQuantity: number;
  edOrderNumber: string;
  language: string;
  postCodeAddress: string;
  emailQty?: number;
  smsQty?: number;
}

export interface TotalQuantity {
  emailQty?: number;
  smsQty?: number;
  voucheryQty?: number;
  faceValue?: number;
}

export interface DirectDeliveryProperties {
  directDeliveryDetails?: DirectDeliveryDetails[];
  quantity?: TotalQuantity;
  isInit?: boolean;
}

export interface DirectDeliveryDetailsList {
  email: string;
  sms: string;
  activeDate: string;
  expiryDateType: string;
  expiryDate: string;
}