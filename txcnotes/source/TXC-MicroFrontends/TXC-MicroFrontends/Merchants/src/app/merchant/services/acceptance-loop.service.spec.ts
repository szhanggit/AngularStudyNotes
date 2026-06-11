import { TestBed } from '@angular/core/testing';

import { AcceptanceLoopService } from './acceptance-loop.service';

describe('AcceptanceLoopService', () => {
  let service: AcceptanceLoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptanceLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
