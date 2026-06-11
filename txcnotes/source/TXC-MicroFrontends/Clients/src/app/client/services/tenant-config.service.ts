import { Injectable } from '@angular/core';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { CLIENT_CONSTANTS } from '../constants/clients.constant';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {

  constructor() { }

  getTenant(tenantName?: string | null): Tenant {
    const getFromConstants = JSON.stringify(CLIENT_CONSTANTS.TENANTS.find(tenant => tenant.name === tenantName));
    const localTenant = localStorage.getItem('tenant');
    if (localTenant) {
      return JSON.parse(localTenant) as Tenant;
    }

    return JSON.parse(getFromConstants);
  }
}
