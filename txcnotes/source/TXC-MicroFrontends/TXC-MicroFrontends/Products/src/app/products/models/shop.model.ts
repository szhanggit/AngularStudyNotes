import { Address } from "./address.model";

export interface Shop {
    id?: number;
    shopId?: number;
    name?: string;
    shopName?: string;
    identityCode?: string;
    internalCode?: string;
    externalCode?: string;
    address?: Address;
    shopAddress?: string;
    mainPhone?: string;
    contactName?: string;
    contactName2?: string;
    contactPhone?: string;
    contactPhone2?: string;
    status?: number;
    statusString?: string;
    shopStatus?: number;
    securityKey?: string;
    lastModifier?: string;
    merchantId?: number;
    addressId?: number;
    merchantIdentityCode?: string;
}
