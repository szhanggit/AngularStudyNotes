import { TestBed } from '@angular/core/testing';

import { TenantReferencesService } from './tenant-references.service';

describe('TenantReferencesService', () => {
  let service: TenantReferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantReferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
