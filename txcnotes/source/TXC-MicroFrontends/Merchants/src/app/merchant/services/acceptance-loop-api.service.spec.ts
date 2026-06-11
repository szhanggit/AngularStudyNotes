import { TestBed } from '@angular/core/testing';

import { AcceptanceLoopApiService } from './acceptance-loop-api.service';

describe('AcceptanceLoopApiService', () => {
  let service: AcceptanceLoopApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptanceLoopApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
