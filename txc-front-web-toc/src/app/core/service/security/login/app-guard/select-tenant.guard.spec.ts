import { TestBed } from '@angular/core/testing';

import { SelectTenantGuard } from './select-tenant.guard';

describe('SelectTenantGuard', () => {
  let guard: SelectTenantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SelectTenantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
