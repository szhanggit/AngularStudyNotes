import { TestBed } from '@angular/core/testing';

import { SecurityKeyService } from './security-key.service';

describe('SecurityKeyService', () => {
  let service: SecurityKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
