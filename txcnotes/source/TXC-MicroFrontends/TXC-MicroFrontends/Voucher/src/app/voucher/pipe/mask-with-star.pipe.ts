import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskWithStar'
})
export class MaskWithStarPipe implements PipeTransform {

  transform(value: string, position: string = 'first-0-1'): string {
    /** READ ME: HOW TO USE
     * 
     *  'position' contain with 3 parts combine by '-': {type}-{maskStartIndex}-{maskWordCount}
     *  type: 'first' or 'last'; Default is 'first'
     *  maskStartIndex: Number; Default is '0'
     *  maskWordCount: Number; Default is '1'
     *  ex: {{ ABCDEF123456 | maskWithStar: last-3-3 }} -> ABCDEF***456
     */

    const configArray = position.split('-');
    if (value.length === 0) { return '--'};
    if (configArray.length < 3) { return value };

    const maskSymbol = '*';
    const type = configArray[0];
    const maskStartIndex = +configArray[1];
    const maskWordCount = +configArray[2];
    const starString = maskSymbol.repeat(maskWordCount)

    const valueLenth = value.length;
    if (valueLenth <= maskWordCount) {
      return starString;
    }
    if (valueLenth < (maskWordCount + maskStartIndex)) {
      return `${starString}${value.substring(valueLenth - maskWordCount, valueLenth)}`;
    }
    let maskedString;
    switch (type) {
      case 'last':
        maskedString = `${value.substring(0, valueLenth - maskWordCount - maskStartIndex)}${starString}${value.substring(valueLenth - maskStartIndex)}`
        return maskedString;
      case 'first':
        maskedString = `${value.substring(0, (maskStartIndex))}${starString}${value.substring((maskWordCount + maskStartIndex))}`;
        return maskedString;

      default:
        maskedString = `${value.substring(0, (maskStartIndex))}${starString}${value.substring((maskWordCount + maskStartIndex))}`;
        return maskedString;
    }


  }

}
