

export enum VoucherStatusEnum {
    ALL = 'All',
    ISSUED = 'Issued',
    ACTIVATED = 'Activated',
    USED = 'Used',
    BLOCKED = 'Blocked',
    EXPIRED = 'Expired',
    TRASHED = 'Trashed',
    INVALID = 'Invalid',
}

export enum emailStatusEnum {
    ALL = 'All',
    SENT_TO_DIVE = 'Sent to Dive',
    PROCESSING = 'Processing',
}

export enum smsStatusEnum {
    ALL = 'All',
    SENT_TO_DIVE = 'Sent to Dive',
    PROCESSING = 'Processing',
}

export enum StockLevelEnum {
    NORMAL = 'NORMAL',
    CRITICAL = 'CRITICAL',
}

export enum VoucherTypeEnum {
    NORMAL,
    MOTHER,
    CHILD,
}

/**
 * For voucher status is not Trashed, Association status should be "Associated (id=1)".
 * If the child voucher has been Trashed due to "Association (id=1)", show "Disassociated" in this column.
 * If the child voucher has been Trashed due to "Expired (id=2)", show "Expired return" in this column.
 */
export enum AssociationStatusEnum {
    ASSOCIATED = 'Associated',
    DISASSOCIATED = 'Disassociated',
    EXPIRED = 'Expired return',
}

