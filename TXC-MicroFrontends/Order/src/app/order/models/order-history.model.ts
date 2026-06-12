import { OrderStatusEnum } from '../enums/order-status.enum';

export interface OrderHistory {
    action: OrderStatusEnum;
    operator: string;
    time: string;
}

export interface OrderActionHistory {
    result: string;
    operator: string;
    comment: string;
    createdDateTime: string;
}