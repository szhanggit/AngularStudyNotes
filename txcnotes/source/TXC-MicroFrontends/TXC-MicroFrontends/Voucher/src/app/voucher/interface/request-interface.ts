export interface getInventoryListRequestInterface {
    batchNo: string | null,
    isCritical: boolean,
    startExpiryDate: string,
    endExpiryDate: string,
    startTrustAccountEndDate: string,
    endTrustAccountEndDate: string,
    startCreatedDate: string,
    endCreatedDate: string,
}

