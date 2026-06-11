export interface ProductExpirationPolicyUpdateRequest {
    productId: number,
    fixedExpiryDate?: string;
    isFixedExpiryPolicy: boolean;
    selectedExpirationPolicyList: SelectedExpirationPolicy[];
}

export interface SelectedExpirationPolicy {
    expirationPolicyId: number;
}