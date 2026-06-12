import { TestBed } from '@angular/core/testing';

import { Tenant, TenantConfigService } from './tenant-config.service';

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
      localStorage.removeItem('tenant');
      const result = service.getTenant('TW');
      expect(result.name).toEqual('TW');
    });
  });

  describe('getTenant', () => {
    it('should return correct tenant', () => {
      const tenant = {
        tenantId: 7,
        name: 'TW',
      };
      localStorage.setItem('tenant', JSON.stringify(tenant));
      const result = service.getTenant('TW');
      expect(result.name).toEqual('TW');
    });
  });
});
