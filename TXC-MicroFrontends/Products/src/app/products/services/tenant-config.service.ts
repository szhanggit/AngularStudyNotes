import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PRODUCT_CONSTANTS } from '../constants/product-constants';
import { TenantConfiguration } from '../models/tenant-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class TenantConfigService {

  private get tenantId() : number {
    return this.getTenant().id;
  }

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  getTenant(tenantName?: string | null): Tenant {
    const getFromConstants = JSON.stringify(PRODUCT_CONSTANTS.TENANTS.find(tenant => tenant.name === tenantName));
    const localTenant = localStorage.getItem('tenant');
    if (localTenant) {
      return JSON.parse(localTenant) as Tenant;
    }

    return JSON.parse(getFromConstants);
  }

  fetchLocalTimeFromUTC() {
    let selectedTenantUTC!: string;
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      return JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
    return selectedTenantUTC;
  }
  
  getTenantConfigurations(): Observable<TenantConfiguration[]> {
    const url = `https://${environment.apiUrl}api/Tnt/TenantConfig?tenantId=${this.tenantId}`;
    return this.httpClient.get(url) as Observable<TenantConfiguration[]>;
  }

}
