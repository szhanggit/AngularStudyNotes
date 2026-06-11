import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Tenant } from '../models/tenant.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TenantService {
  currentTenant$ = new Subject<string>();
  tenants$: Tenant[] = [];

  constructor(private authService: AuthorizationLibraryService, private http: HttpClient) {
    const currentTenantFromLocalStorage = this.GetTenantFromLocalStorage()?.name ?? '';
    this.currentTenant$.next(currentTenantFromLocalStorage);
  }

  GetTenants(): Observable<Tenant[]> {
    const currentTenant = this.GetTenantFromLocalStorage();
    this.tenants$ = [];
    this.authService.userAuthClaim.subscribe(userClaim => {
      let tenantListMin: Tenant[] = [];
      this.getTenantsInfo().subscribe((tenantsInfo: any[]) => {
        for (let ti of tenantsInfo)
          tenantListMin.push({ id: ti.tenantBasicInfoId, name: ti.name, currentUTCOffset: ti.currentUTCOffset, currencySymbol: ti.currencySymbol, companyTaxRate : ti.companyTaxRate });
        for (let id of userClaim.tenants) {
          if (id == 0) continue;
          let tenant: Tenant;
          if (currentTenant && currentTenant.id == id)
            tenant = { id: id, isSelected: true };
          else
            tenant = { id: id, isSelected: false };
          for (let t of tenantListMin)
            if (t.id == id) {
              tenant.name = t.name;
              tenant.currentUTCOffset = t.currentUTCOffset;
              tenant.currencySymbol = t.currencySymbol;
              tenant.companyTaxRate = t.companyTaxRate;
            }
          this.tenants$.push(tenant);
        }
      });
    });
    return of(this.tenants$);
  }

  GetTenantFromLocalStorage(): Tenant | null {
    const value = localStorage.getItem('tenant');
    let _tenant: Tenant;
    if (value) {
      _tenant = JSON.parse(value);
      return _tenant;
    }
    return null;
  }

  private getHeaders(type: number = 0): HttpHeaders {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }

  private getTenantsInfo(): Observable<Tenant[]> {
    const url = `https://${environment.apiUrl}api/Tnt/Tenant/TenantListMinimal`;
    return this.http.get<Tenant[]>(url, { headers: this.getHeaders() }) as Observable<Tenant[]>;
  }
}
