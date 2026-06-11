export interface SyncStatusHistory {
    actionTime: string;
    actionType: string;
    actionResult: string;
    operator: string;
}

export interface SyncStatusRequest {
    orderId: number;
    actionType: number;
    voucherIds: string[];
}