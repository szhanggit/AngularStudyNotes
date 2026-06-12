import { Pipe, PipeTransform } from '@angular/core';
import { VoucherNumberTypeEnum } from '../enums/voucher-number-type.enum';

@Pipe({
  name: 'voucherNumberType',
})
export class VoucherNumberTypePipe implements PipeTransform {
  transform(value: number | string) {
    switch (value) {
      case VoucherNumberTypeEnum.PureDigital:
        return 'Pure Digital';
      case VoucherNumberTypeEnum.LetterDigital:
        return 'Letter Digital';
      default:
        return '--';
    }
  }
}
