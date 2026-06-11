import { Pipe, PipeTransform } from '@angular/core';
import { OrderModeEnum } from '../enums/order-mode.enum';

@Pipe({ name: 'orderModeType' })

export class OrderModeTypePipe implements PipeTransform {
    transform(key: number): string {
        switch (key) {
            case OrderModeEnum.IndirectNonAPI:
                return 'NonAPI + Indirect';
            case OrderModeEnum.DirectNonAPI:
                return 'NonAPI + Direct';
            case OrderModeEnum.API:
                return 'API';
            case OrderModeEnum.PaperVoucher:
                return 'Paper Voucher';
            default: return 'Not Found';
        }
    }
}