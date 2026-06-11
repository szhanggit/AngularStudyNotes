export interface GetMerchantGroupResponse {
    data: {
        merchantGroups: {
            totalCount: number,
            items: MerchantGroup[]
        }
    },
    message: string,
    success: boolean,
}

export interface MerchantGroup {
    merchantGroupId?: number,
    merchantId?: number,
    merchant?: Merchant,
    merchantGroupMerchantMaps?: MerchantGroupMerchantMaps[],
    createdOn?: Date,
}

export interface MerchantGroupMerchantMaps {
    merchantGroupMerchantMapId?: number,
    merchantGroupId?: number,
    merchantId?: number,
    merchant?: Merchant,
    status?: boolean,
}

export interface Merchant {
    merchantId: number,
    programId?: number,
    identityCode?: string,
    name?: string,
    description?: string,
    status?: number,
}

export interface MerchantGroupView {
    merchantGroupId: number,
    merchantId: number,
    programId: number,
    name: string,
    status: number,
    merchantGroupMerchantMaps?: MerchantGroupMerchantMaps[]
}
