import { ExpirationPolicy } from './product-expiration-policy.model';

export interface GetProductExpirationPolicyResp {
    data : {
        productId: number,
        fixedExpiryDate: any,
        expirationPolicyList: ExpirationPolicy[]
    }
    message: string;
    success: boolean;
}