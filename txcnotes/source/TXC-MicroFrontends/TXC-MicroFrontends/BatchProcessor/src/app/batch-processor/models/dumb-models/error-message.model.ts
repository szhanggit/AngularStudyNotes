export interface ErrorMessage {
    type: string;
    description: string;
}

export interface StatusMessage {
    header: string,
    description?: string,
    approver?: string;
    approvalTime?: string;
}