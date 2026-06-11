import { VoucherTemplate } from './voucher-template.model';

export interface DeliveryDetails extends VoucherTemplate {
    emailTemplate: string,
    msgEncoding: string;
}