import { Injectable } from '@angular/core';
import { MERCHANT_CONSTANTS } from '../constants/merchants.constant';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {
  constructor() {
  }

  getTenant(tenantName?: string | null): Tenant {
    const getFromConstants = JSON.stringify(MERCHANT_CONSTANTS.TENANTS.find(tenant => tenant.name === tenantName));
    const localTenant = localStorage.getItem('tenant');
    if (localTenant) {
      return JSON.parse(localTenant) as Tenant;
    }

    return JSON.parse(getFromConstants);
  }
}
