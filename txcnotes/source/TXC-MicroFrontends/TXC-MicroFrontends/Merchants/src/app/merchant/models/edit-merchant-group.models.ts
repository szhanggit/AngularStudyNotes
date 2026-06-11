export interface EditMerchantGroupRequest {
    merchantGroupId: number,
    name?: string,
    description?: string,
    status: boolean,
    addMerchantGroupMerchants?: number[],
    removeMerchantGroupMerchants?: number[],
}