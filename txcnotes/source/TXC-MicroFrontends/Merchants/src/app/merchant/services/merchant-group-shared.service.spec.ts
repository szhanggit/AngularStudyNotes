import { TestBed } from '@angular/core/testing';

import { MerchantGroupSharedService } from './merchant-group-shared.service';

describe('MerchantGroupSharedService', () => {
  let service: MerchantGroupSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantGroupSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
