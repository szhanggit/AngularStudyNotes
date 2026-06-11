import { ExpirationPolicyTypeEnum } from "../enums/expiration-policy-type.enum";
import { ProductVoucherGeneratorEnum } from "../enums/voucher-generator.enum";

export interface ExpiryScheme {
    type: number;
    displayName: string;
    id: number;
    checked?: boolean;
    productVoucherGenerator?: number,
    fixExpiryDate?: string;
    isFromModal?: boolean;
    isFixedExpiryPolicy: boolean;
}

export interface ExpirationPolicy {
    id: number,
    name: string,
    displayName: string,
    type: ExpirationPolicyTypeEnum,
    productVoucherGenerator: number,

    checked?: boolean;
    displayed?: boolean;
}
