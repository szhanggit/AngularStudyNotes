import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { AuthMe } from '../models/auth-me.model';
import { UserAuthClaim } from '../models/user-auth-claim.model';
import { ResponseModel } from '../models/response-model.model';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationLibraryService {
  isLoading = new Subject<boolean>();
  // azure ad
  authme = new BehaviorSubject<AuthMe>(new AuthMe());
  adToken!: string;
  expiresOn!: Date;
  // user auth 
  userAuthClaim = new BehaviorSubject<UserAuthClaim>(new UserAuthClaim());
  userName!: string;
  modules!: number | number[];
  operations!: number[];
  resources!: number[];

  constructor(private readonly httpClient: HttpClient) {
  }

  // get user ad token from the reverse proxies url /auth.me
  getAdToken(landingUrl: string, amm_url: string, tenant_id?: number) {
    this.httpClient
      .get(`${landingUrl}/.auth/me`)
      .pipe(
        map((res: any) => {
          if ((res as AuthMe[]) && res.length > 0) {
            return (res[0] as AuthMe);
          }
          return null;
        })
      )
      .subscribe({
        next: (data) => {
          if (data == null || data == undefined) {
            document.location.href = `${landingUrl}/error/401`;
            return;
          }

          const utcNow = new Date(Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
            new Date().getUTCHours(),
            new Date().getUTCMinutes(),
            new Date().getUTCSeconds(),
            new Date().getUTCMilliseconds()
          ));

          if (!data.expires_on || new Date(data.expires_on) < utcNow) {
            this.login(landingUrl);
            return;
          }

          this.authme.next(data!);
          this.adToken = data.access_token;
          this.expiresOn = new Date(data.expires_on);
          this.getAmmUserAuth(data.access_token, amm_url, tenant_id);
        },
        error: (e) => {
          this.login(landingUrl);
        },
        complete: () => { },
      });
  }

  //get the user permission claim/matrix from AMM
  getAmmUserAuth(adToken: string, url: string, tenant_id?: number) {
    this.adToken = adToken;
    let _tenant_id: number = tenant_id ?? 0;
    const headers = new HttpHeaders()
      .set('X-MS-TOKEN-AAD-ACCESS-TOKEN', adToken)
      .set('TenantBasicInfoId', _tenant_id.toString());
    this.isLoading.next(true);
    this.httpClient
      .get(url, { headers })
      .pipe(
        map((res: any) => {
          if ((res as ResponseModel) && res.data) {
            return (res.data as UserAuthClaim);
          }
          return null;
        })
      )
      .subscribe({
        next: (data) => {
          if (data == null || data == undefined) {
            return;
          }
          this.userAuthClaim.next(data!);
          this.userName = data.user.userName ?? '';
          this.modules = data.modules;
          this.resources = data.resources
          this.operations = data.operations;
        },
        error: (e) => {
          document.location.href = `/error/401`;
        },
        complete: () => {
          this.isLoading.next(false);
        }
      });
  }

  // prepare the header to add the token on the function call to avoid getting unauthorized error
  getAMMHeaders(tenant?: Tenant): HttpHeaders {
    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (!tenant) {
      if (tenantFromLocalStorage) {
        tenant = JSON.parse(tenantFromLocalStorage) as Tenant;
      } else {
        throw new Error('No tenant selected');
      }
    }

    return new HttpHeaders()
      //commented hardcoded content-type.
      //.set('content-type', 'application/json')
      .set('TenantName', tenant.name)
      .set('TenantBasicInfoId', tenant.id.toString())
      .set('TX2UserName', this.userName)
      .set('X-MS-TOKEN-AAD-ACCESS-TOKEN', this.adToken);
  }

  hasResource(userResource: number): boolean {
    return this.resources.includes(userResource);
  }

  // get the operation flag to let elements show or hide
  getElementOperationFlag(userOperations: number[]): boolean {
    for (const userOperation of userOperations) {
      if (this.operations.some(operation => operation === userOperation))
        return true;
    }
    return false;
  }

  // logout
  logout(landingUrl: string) {
    this.authme.next(new AuthMe());
    this.userAuthClaim.next(new UserAuthClaim());
    this.userName = '';
    this.adToken = '';
    this.operations = [];
    document.location.href = `${landingUrl}/.auth/logout?post_logout_redirect_uri=/move`;
  }

  // loging
  login(landingUrl: string) {
    document.location.href = `${landingUrl}/.auth/login/aad?post_login_redirect_uri=/move`;
  }
}
