import { TestBed } from '@angular/core/testing';

import { TenantConfigService } from './tenant-config.service';

describe('TenantConfigService', () => {
  let service: TenantConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTenant', () => {
    it('should return correct tenant', () => {
      const result = service.getTenant('TW');
      expect(result.name).toEqual('TW');
    });
  });
});
