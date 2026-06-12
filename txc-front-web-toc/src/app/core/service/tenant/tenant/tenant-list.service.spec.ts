import { TestBed } from '@angular/core/testing';

import { TenantListService } from './tenant-list.service';

describe('TenantListService', () => {
  let service: TenantListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
