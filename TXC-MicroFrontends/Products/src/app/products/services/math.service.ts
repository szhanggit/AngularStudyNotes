import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  /**
   * Round a given number to the specified decimal places.
   * @param value number to round
   * @param decimalPlaces decimal places wanted to keep after rounded
   * @returns rounded value
   */
  round(value: number, decimalPlaces: number): number {
    return Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
  }

  /**
   * Do multiplication and return a result with specified precision.
   * @param multiplier a number as multiplier
   * @param multiplicand a number as multiplicand
   * @param precision a number as precision after calculation
   * @returns a number as product with specified precision
   */
  multiply(multiplier: number, multiplicand: number, precision: number): number {
    return Number(Math.round(parseFloat((multiplier * multiplicand) + 'e' + precision)) + 'e-' + precision);
  }

  /**
   * Do the division and round it to the specified decimal places (keep the ending 0s like 20.0000).
   * @param dividend a number as dividend (could be undefined or '' as well)
   * @param divisor a number as divisor
   * @param decimalPlaces decimal places to keep after rounding. the default value is 4.
   * @returns a string represented the result after division. Some special cases:
   * 1. empty string if dividend is null or empty string
   * 2. NaN if divisor is NaN or 0
   */
  divide(dividend: number | undefined | '', divisor: number, decimalPlaces: number = 4): string {
    return dividend == null || dividend === '' ? '' :
      Number(Math.round(parseFloat((dividend / divisor) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces).toFixed(decimalPlaces);
  }

  /**
   * Divide and transform to percentage value, and round it to the specified decimal places.
   * @param dividend a number as dividend
   * @param divisor a number as divisor
   * @param decimalPlaces decimal places to keep after rounding. the default value is 2.
   * @returns percentage value rounded to the specified decimal places. Some special cases:
   * 1. undifined if divisor is null or 0
   * 2. NaN if divisor or/and dividend is NaN, but divideAndToPercentage(NaN, 0) would return undifined due to 1
   */
  divideAndToPercentage(dividend: number, divisor: number | undefined | null, decimalPlaces: number = 2): number | undefined {
    return divisor == null || (divisor != null && divisor === 0) ? undefined :
      Number(Math.round(parseFloat((dividend / divisor) + 'e' + (decimalPlaces + 2))) + 'e-' + decimalPlaces);
  }
}
