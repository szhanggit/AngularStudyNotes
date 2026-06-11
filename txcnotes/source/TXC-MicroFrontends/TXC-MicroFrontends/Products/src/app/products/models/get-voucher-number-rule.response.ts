import { VoucherNumberRule } from "./voucher-number-rule.model";

export interface GetVoucherNumberRuleResponse {
    data: {
        merchantID: number;
        voucherNumberRule: VoucherNumberRule[];
        totalCount: number;
    },
    message: string;
    success: boolean;
}