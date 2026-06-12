import { TestBed } from '@angular/core/testing';

import { MerchantSkuService } from './merchant-sku.service';

describe('MerchantSkuService', () => {
  let service: MerchantSkuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantSkuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
