import { TestBed } from '@angular/core/testing';

import { VoucherNumberRuleService } from './voucher-number-rule.service';

describe('VoucherNumberRuleService', () => {
  let service: VoucherNumberRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherNumberRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
