import { TestBed } from '@angular/core/testing';

import { RefTimeZoneService } from './ref-time-zone.service';

describe('RefTimeZoneService', () => {
  let service: RefTimeZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefTimeZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
