import { TestBed } from '@angular/core/testing';

import { BusinessUnitsAsRefService } from './business-units-as-ref.service';

describe('BusinessUnitsAsRefService', () => {
  let service: BusinessUnitsAsRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessUnitsAsRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
