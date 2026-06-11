import { Pipe, PipeTransform } from '@angular/core';
import { TEMPLATE_CONSTANTS } from '../constants/template.constant';

@Pipe({
  name: 'templatesubtype'
})
export class TemplatesubtypePipe implements PipeTransform {

  transform(key: number): string {
    switch (key) {
      case TEMPLATE_CONSTANTS.TEMPLATE_SUBTYPE[0].key:
        return TEMPLATE_CONSTANTS.TEMPLATE_SUBTYPE[0].value;
      case TEMPLATE_CONSTANTS.TEMPLATE_SUBTYPE[1].key:
        return TEMPLATE_CONSTANTS.TEMPLATE_SUBTYPE[1].value;
      default: return 'NotFound';
    }
  }

}
