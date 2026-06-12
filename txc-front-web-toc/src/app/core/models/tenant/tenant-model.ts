export class TenantModel {
    tenantBasicInfoId:number;
    name: string;
    country: string;
    countryCode: string;
    timezone: string;
    timeFormat: string;
    currencySymbol: string;
    companyTaxType?: boolean;
    companyTaxRate: string;
    effectivityDate: string;
    language: string;
    logo: string;
}
