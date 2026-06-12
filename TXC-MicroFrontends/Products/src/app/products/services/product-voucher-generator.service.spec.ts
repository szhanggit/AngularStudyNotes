import { TestBed } from '@angular/core/testing';

import { ProductVoucherGeneratorService } from './product-voucher-generator.service';
import { ExpirationPolicy } from '../models/expiry-scheme.model';
import { ExpirationPolicyTypeEnum } from '../enums/expiration-policy-type.enum';
import { ProductVoucherGeneratorEnum } from '../enums/voucher-generator.enum';

describe('ProductVoucherGeneratorService', () => {
  let service: ProductVoucherGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductVoucherGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isEdenredFixed should work', () => {
    expect(service.isEdenredFixed(0)).toEqual(false);
    expect(service.isEdenredFixed(1)).toEqual(true);
    expect(service.isEdenredFixed(2)).toEqual(false);
    expect(service.isEdenredFixed(3)).toEqual(true);
    expect(service.isEdenredFixed(4)).toEqual(false);
    expect(service.isEdenredFixed(5)).toEqual(true);
    expect(service.isEdenredFixed(6)).toEqual(false);
    expect(service.isEdenredFixed(7)).toEqual(true);
    expect(service.isEdenredFixed(8)).toEqual(false);
    expect(service.isEdenredFixed(9)).toEqual(true);
    expect(service.isEdenredFixed(10)).toEqual(false);
    expect(service.isEdenredFixed(11)).toEqual(true);
    expect(service.isEdenredFixed(12)).toEqual(false);
    expect(service.isEdenredFixed(13)).toEqual(true);
    expect(service.isEdenredFixed(14)).toEqual(false);
    expect(service.isEdenredFixed(15)).toEqual(true);
  });

  it('isThirdPartyFixed should work', () => {
    expect(service.isThirdPartyFixed(0)).toEqual(false);
    expect(service.isThirdPartyFixed(1)).toEqual(false);
    expect(service.isThirdPartyFixed(2)).toEqual(true);
    expect(service.isThirdPartyFixed(3)).toEqual(true);
    expect(service.isThirdPartyFixed(4)).toEqual(false);
    expect(service.isThirdPartyFixed(5)).toEqual(false);
    expect(service.isThirdPartyFixed(6)).toEqual(true);
    expect(service.isThirdPartyFixed(7)).toEqual(true);
    expect(service.isThirdPartyFixed(8)).toEqual(false);
    expect(service.isThirdPartyFixed(9)).toEqual(false);
    expect(service.isThirdPartyFixed(10)).toEqual(true);
    expect(service.isThirdPartyFixed(11)).toEqual(true);
    expect(service.isThirdPartyFixed(12)).toEqual(false);
    expect(service.isThirdPartyFixed(13)).toEqual(false);
    expect(service.isThirdPartyFixed(14)).toEqual(true);
    expect(service.isThirdPartyFixed(15)).toEqual(true);
  });

  it('isEdenredFlexable should work', () => {
    expect(service.isEdenredFlexable(0)).toEqual(false);
    expect(service.isEdenredFlexable(1)).toEqual(false);
    expect(service.isEdenredFlexable(2)).toEqual(false);
    expect(service.isEdenredFlexable(3)).toEqual(false);
    expect(service.isEdenredFlexable(4)).toEqual(true);
    expect(service.isEdenredFlexable(5)).toEqual(true);
    expect(service.isEdenredFlexable(6)).toEqual(true);
    expect(service.isEdenredFlexable(7)).toEqual(true);
    expect(service.isEdenredFlexable(8)).toEqual(false);
    expect(service.isEdenredFlexable(9)).toEqual(false);
    expect(service.isEdenredFlexable(10)).toEqual(false);
    expect(service.isEdenredFlexable(11)).toEqual(false);
    expect(service.isEdenredFlexable(12)).toEqual(true);
    expect(service.isEdenredFlexable(13)).toEqual(true);
    expect(service.isEdenredFlexable(14)).toEqual(true);
    expect(service.isEdenredFlexable(15)).toEqual(true);
  });

  it('isThirdPartyFlexable should work', () => {
    expect(service.isThirdPartyFlexable(0)).toEqual(false);
    expect(service.isThirdPartyFlexable(1)).toEqual(false);
    expect(service.isThirdPartyFlexable(2)).toEqual(false);
    expect(service.isThirdPartyFlexable(3)).toEqual(false);
    expect(service.isThirdPartyFlexable(4)).toEqual(false);
    expect(service.isThirdPartyFlexable(5)).toEqual(false);
    expect(service.isThirdPartyFlexable(6)).toEqual(false);
    expect(service.isThirdPartyFlexable(7)).toEqual(false);
    expect(service.isThirdPartyFlexable(8)).toEqual(true);
    expect(service.isThirdPartyFlexable(9)).toEqual(true);
    expect(service.isThirdPartyFlexable(10)).toEqual(true);
    expect(service.isThirdPartyFlexable(11)).toEqual(true);
    expect(service.isThirdPartyFlexable(12)).toEqual(true);
    expect(service.isThirdPartyFlexable(13)).toEqual(true);
    expect(service.isThirdPartyFlexable(14)).toEqual(true);
    expect(service.isThirdPartyFlexable(15)).toEqual(true);
  });

  it('validate should return true if selection is valid for Edenred fixed', () => {
    // case 1
    let policies = [
      {
        name: service.KEYWORD_FIX_END_OF_DAY,
        productVoucherGenerator: 15,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = true;
    let fixedExpiryDate: Date | null = new Date();
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
    // case 2
    policies = [
      {
        name: 'NoExpiration',
        productVoucherGenerator: 11,
      }
    ] as ExpirationPolicy[];
    fixedExpiryDate = null;
    result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
  });

  it('validate should return true if selection is valid for third party fixed', () => {
    // case 1
    let policies = [
      {
        name: service.KEYWORD_FIX_END_OF_DAY,
        productVoucherGenerator: 15,
      }
    ] as ExpirationPolicy[];
    let isEdenred = false;
    let isFixedExpiryPolicy = true;
    let fixedExpiryDate: Date | null = new Date();
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
    // case 2
    policies = [
      {
        name: 'NoExpiration',
        productVoucherGenerator: 11,
      }
    ] as ExpirationPolicy[];
    fixedExpiryDate = null;
    result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
  });

  it('validate should return true if selection is valid for Edenred flexible', () => {
    let policies = [
      {
        name: service.KEYWORD_FIX_END_OF_DAY,
        productVoucherGenerator: 15,
      },
      {
        productVoucherGenerator: 4,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = false;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
  });

  it('validate should return true if selection is valid for third party flexible', () => {
    let policies = [
      {
        name: service.KEYWORD_FIX_END_OF_DAY,
        productVoucherGenerator: 15,
      },
      {
        productVoucherGenerator: 8,
      }
    ] as ExpirationPolicy[];
    let isEdenred = false;
    let isFixedExpiryPolicy = false;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(true);
  });

  it('validate should return false if no policy is selected', () => {
    let policies = [
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = false;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
  });

  it('validate should return false if number of selected policy is not one for fixed', () => {
    let policies = [
      {
        productVoucherGenerator: 1,
      },
      {
        productVoucherGenerator: 4,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = true;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
  });

  it('validate should return false if selection is mixing fixed and flexible policies', () => {
    let policies = [
      {
        productVoucherGenerator: 1,
      },
      {
        productVoucherGenerator: 4,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = false;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
  });

  it('validate should return false if fixed date is not provided while selecting FixEndOfDay', () => {
    let policies = [
      {
        name: service.KEYWORD_FIX_END_OF_DAY,
        productVoucherGenerator: 15,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = true;
    let fixedExpiryDate: Date | null = null;
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
  });

  it('validate should return false if fixed date is provided while not selecting FixEndOfDay', () => {
    // case 1
    let policies = [
      {
        productVoucherGenerator: 11,
      }
    ] as ExpirationPolicy[];
    let isEdenred = true;
    let isFixedExpiryPolicy = true;
    let fixedExpiryDate: Date | null = new Date();
    let result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
    // case 2
    isFixedExpiryPolicy = false;
    result = service.validate(policies, isEdenred, isFixedExpiryPolicy, fixedExpiryDate);
    expect(result).toEqual(false);
  });
});
