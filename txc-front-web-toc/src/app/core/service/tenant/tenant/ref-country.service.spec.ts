import { TestBed } from '@angular/core/testing';

import { RefCountryService } from './ref-country.service';

describe('RefCountryService', () => {
  let service: RefCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
