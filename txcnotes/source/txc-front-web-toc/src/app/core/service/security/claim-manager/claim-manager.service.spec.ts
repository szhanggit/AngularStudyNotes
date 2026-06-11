import { TestBed } from '@angular/core/testing';

import { ClaimManagerService } from './claim-manager.service';

describe('ClaimManagerService', () => {
  let service: ClaimManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
