export interface ClientList {
    id: number;
    clientName: string;
    invoiceRegisterNumber: string;
    voucherIssuerId: number;
    voucherIssuer: DictionaryDropdownModel[];
    identityCode: string;
    status: number;
}

export interface ClientDetailEdit {
    clientName: string;
}


export interface DictionaryDropdownModel{
    dictionaryId: number;
    displayName: string;
}

export interface ClientHistoryList {
    id: number;
    clientName: string;
    createdOn: Date;    
    createdBy: string;
    status: number;
}
export interface Contact{
    position?:string;
    name?:string;
    email?:string;
    mobileNumber?:string;
}

//CReate Client Request Payload
export interface ClientCreateRequest {
    ClientId:number,
    clientName: string,
    invoiceRegisterNumber: string,
    voucherIssuerId: number,
    businessTypeId: number,
    status: number,
    securityAlgorithm: number,
    logoMediaId: number,
    bannerMediaId: number,
    emailHeaderMediaId: number | null,
    emailFooterMediaId: number | null,
    mandatoryAutoBilling: boolean,
    invoiceTitle: string,
    subURL: string,
    emailProviderCode: string,
    emailSenderName: string,
    emailSenderAddress: string,
    applyEmailSubject: boolean | null,
    smsProviderCode: string,
    smsSenderName: string,
    smsEntityId: string,
    salesEmail: string,
    memo: string,
    description: string,
    detailAddressLine: string,
    district: string,
    cityId: number,
    stateOrProvinceId: number,
    postcode: string,
    countryId: number,
    longitude: number | null,
    latitude: number | null,
    addressStatus: number,
    statusSubscriptionEnabled: boolean,
    statusProviderId: number,
    createClientContacts: ClientCreateContactRequest[]
    updateClientContacts:ClientUpdateContactRequest[]
  }
  
  //Request Payload for Multi contact
  export interface ClientCreateContactRequest
  {
      position: string,
      name: string,
      email: string,
      mobileNo: string,
  }

  export interface ClientUpdateContactRequest 
  {
      clientContactId: number,
      position: string,
      name: string,
      email: string,
      mobileNo: string,
      isActive:boolean,
      isUpdated:boolean
  }
  export interface emailProviderList {
    providerCode: string;
    name: string;
	isDefaultVendorForTenant: boolean;
	vendorCode: string;
}

export interface smsProviderList {
    providerCode: string;
    name: string;
	isDefaultVendorForTenant: boolean;
	vendorCode: string;
}
export interface ClientUpdateSecurityKeyRequest 
  {
      clientId: number,
      securityAlgorithm: number     
  }