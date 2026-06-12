import { TestBed } from '@angular/core/testing';

import { RefTimeFormatService } from './ref-time-format.service';

describe('RefTimeFormatService', () => {
  let service: RefTimeFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefTimeFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
