import { TestBed } from '@angular/core/testing';

import { BusinessUnitGuard } from './business-unit.guard';

describe('BuGuard', () => {
  let guard: BusinessUnitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BusinessUnitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
