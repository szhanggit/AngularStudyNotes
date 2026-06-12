import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {

  constructor() {
  }

  TENANTS = [
    {
      id: 2,
      name: 'IN'
    },
    {
      id: 5,
      name: 'GR'
    },
    {
      id: 6,
      name: 'SG'
    },
    {
      id: 7,
      name: 'TW'
    },
    {
      id: 9,
      name: 'GL'
    }
  ];

  getTenant(tenantName?: string | null): Tenant {
    const getFromConstants = JSON.stringify(this.TENANTS.find(tenant => tenant.name === tenantName));
    const localTenant = localStorage.getItem('tenant');
    if (localTenant) {
      return JSON.parse(localTenant) as Tenant;
    }

    return JSON.parse(getFromConstants);
  }
}

export interface Tenant {
  id: number;
  name: string;
}
