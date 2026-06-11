import { TestBed } from '@angular/core/testing';

import { MerchantGroupService } from './merchant-group.service';

describe('MerchantGroupService', () => {
  let service: MerchantGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
