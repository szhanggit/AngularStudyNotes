
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LoginUserTenantsResponse } from 'src/app/core/models/security/login-user-tenants-response';
import { CookieManagerService } from '../coockie-manager/cookie-manager.service';
import { CookieConstants } from 'src/app/core/models/constants/cookie-constants.model';

@Injectable()
export class TenantIdInterceptor implements HttpInterceptor {

  constructor(private cookiemngr : CookieManagerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const selectedTenant : LoginUserTenantsResponse = this.cookiemngr.getCookie(CookieConstants.currentTenant);
    if (selectedTenant) {
      request = request.clone({
          setHeaders: {
              TenantBasicInfoId: `${selectedTenant.tenantBasicInfoId}`,
              TenantName: `${selectedTenant.name}`
          }
      });
    }
    return next.handle(request);
  }
}
