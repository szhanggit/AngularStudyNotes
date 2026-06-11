import { TestBed } from '@angular/core/testing';

import { MerchantPermissionService } from './merchant-permission.service';

describe('MerchantPermissionService', () => {
  let service: MerchantPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchantPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
