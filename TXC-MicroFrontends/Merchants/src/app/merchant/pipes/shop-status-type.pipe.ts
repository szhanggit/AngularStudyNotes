import { Pipe, PipeTransform } from '@angular/core';
import { SHOP_CONSTANT } from '../constants/shop.constant';

@Pipe({
  name: 'shopStatusType'
})
export class ShopStatusTypePipe implements PipeTransform {

  transform(key?: number): string {
    switch(key) {
      case SHOP_CONSTANT.STATUS[0].key:  return SHOP_CONSTANT.STATUS[0].value;
      case SHOP_CONSTANT.STATUS[1].key:  return SHOP_CONSTANT.STATUS[1].value;
      default:  return 'unknown';
    }
  }

}
