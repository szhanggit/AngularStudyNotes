import { Injectable } from '@angular/core';
import { ProductVoucherGeneratorEnum } from '../enums/voucher-generator.enum';
import { ExpirationPolicy } from '../models/expiry-scheme.model';

@Injectable({
  providedIn: 'root'
})
export class ProductVoucherGeneratorService {

  public KEYWORD_FIX_END_OF_DAY = 'FixEndOfDay';
  public INVALID_ERROR = 'The setting of expiry schemes is invalid. Please review the expiry setting and Save again.';

  // 2^0: EdenredFixed
  // 2^1: ThirdPartyFixed
  // 2^2: EdenredFlexable
  // 2^3: ThirdPartyFlexable
  constructor() { }

  /**
   * Determines if the given voucher generator is categorized as EdenredFixed.
   * Note that there is one exception for FixedEndOfDay, which is categorized as both fixed and flexible; 
   * and further conditions are needed to distinguish between them.
   * @param voucherGenerator the ProductVoucherGenerator value from the expiry policy table. The expected value is a number between 1 and 15 (inclusive).
   * @returns true if the given generator categorized as EdenredFixed; otherwise, false.
   */
  isEdenredFixed(voucherGenerator: number): boolean {
    const mask: number = ProductVoucherGeneratorEnum.EdenredFixed;
    return (voucherGenerator & mask) > 0;
  }

  /**
   * Determines if the given voucher generator is categorized as ThirdPartyFixed.
   * Note that there is one exception for FixedEndOfDay, which is categorized as both fixed and flexible; 
   * and further conditions are needed to distinguish between them.
   * @param voucherGenerator the ProductVoucherGenerator value from the expiry policy table. The expected value is a number between 1 and 15 (inclusive).
   * @returns true if the given generator categorized as ThirdPartyFixed; otherwise, false.
   */
  isThirdPartyFixed(voucherGenerator: number): boolean {
    const mask: number = ProductVoucherGeneratorEnum.ThirdPartyFixed;
    return (voucherGenerator & mask) > 0;
  }

  /**
   * Determines if the given voucher generator is categorized as EdenredFlexable.
   * Note that there is one exception for FixedEndOfDay, which is categorized as both fixed and flexible; 
   * and further conditions are needed to distinguish between them.
   * @param voucherGenerator the ProductVoucherGenerator value from the expiry policy table. The expected value is a number between 1 and 15 (inclusive).
   * @returns true if the given generator categorized as EdenredFlexable; otherwise, false.
   */
  isEdenredFlexable(voucherGenerator: number): boolean {
    const mask: number = ProductVoucherGeneratorEnum.EdenredFlexable;
    return (voucherGenerator & mask) > 0;
  }

  /**
   * Determines if the given voucher generator is categorized as ThirdPartyFlexable.
   * Note that there is one exception for FixedEndOfDay, which is categorized as both fixed and flexible; 
   * and further conditions are needed to distinguish between them.
   * @param voucherGenerator the ProductVoucherGenerator value from the expiry policy table. The expected value is a number between 1 and 15 (inclusive).
   * @returns true if the given generator categorized as ThirdPartyFlexable; otherwise, false.
   */
  isThirdPartyFlexable(voucherGenerator: number): boolean {
    const mask: number = ProductVoucherGeneratorEnum.ThirdPartyFlexable;
    return (voucherGenerator & mask) > 0;
  }

  /**
   * Validate the selected expiration policies. 
   * Note that fixed FixEndOfDay requires a fixed expiry date; otherwise, the date should not be provided.
   * @param expiryPolicyList the selected expiration policies
   * @param isEdenredProdgram a boolean to indicate if the product belongs to Edenred program
   * @param isFixedExpiryPolicy a boolean to indicate the selection is fixed or flexible policies
   * @param fixedExpiryDate a date representing the fixedExpiryDate if there is any
   * @returns 
   */
  validate(expiryPolicyList: ExpirationPolicy[], isEdenredProdgram: boolean, isFixedExpiryPolicy: boolean, fixedExpiryDate?: Date | null): boolean {
    const isFixEndOfDaySelected = expiryPolicyList.some(x => x.name === this.KEYWORD_FIX_END_OF_DAY);
    const isDateRequired = isFixedExpiryPolicy && isFixEndOfDaySelected;
    const isGeneratorMatched = isEdenredProdgram
      ? (isFixedExpiryPolicy
        ? expiryPolicyList.every(x => this.isEdenredFixed(x.productVoucherGenerator))
        : expiryPolicyList.every(x => this.isEdenredFlexable(x.productVoucherGenerator)))
      : (isFixedExpiryPolicy
        ? expiryPolicyList.every(x => this.isThirdPartyFixed(x.productVoucherGenerator))
        : expiryPolicyList.every(x => this.isThirdPartyFlexable(x.productVoucherGenerator)));
    return isGeneratorMatched
      && (isDateRequired == (fixedExpiryDate != null))
      && ((isFixedExpiryPolicy && expiryPolicyList.length === 1)
        || (!isFixedExpiryPolicy && expiryPolicyList.length > 0));
  }
}
