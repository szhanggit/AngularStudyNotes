import { TestBed } from '@angular/core/testing';

import { RoleSmartSearchService } from './role-smart-search.service';

describe('RoleSmartSearchService', () => {
  let service: RoleSmartSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleSmartSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
