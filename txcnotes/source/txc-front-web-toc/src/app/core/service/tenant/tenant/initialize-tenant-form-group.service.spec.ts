import { TestBed } from '@angular/core/testing';

import { InitializeTenantFormGroupService } from './initialize-tenant-form-group.service';

describe('InitializeTenantFormGroupService', () => {
  let service: InitializeTenantFormGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializeTenantFormGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
