import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { TenantService } from 'src/app/business-unit/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  backendBaseUrl: string;

  private readonly refreshMinutes = 40;
  // 10 years token. do not edit it.
  private readonly ACCESS_TOKEN = '';
  constructor(
    private readonly authorizationLibraryService: AuthorizationLibraryService,
    private readonly tenantService: TenantService
  ) {
    let splited = window.location.toString().split('\/');
    this.backendBaseUrl = splited[0] + "//" + environment.apiUrl + "api/";
  }

  updateToken() {
    const tenantId = this.tenantService.GetTenantFromLocalStorage()?.id ?? 0;
    if (!environment.isLocal) {
      this.authorizationLibraryService.getAdToken(environment.landingUrl, this.backendBaseUrl + 'auth', tenantId);
      return;
    }
    this.authorizationLibraryService.getAmmUserAuth(this.ACCESS_TOKEN, this.backendBaseUrl + 'auth', tenantId);
  }

  getRefreshTokenUrl(): string {
    return `https://login.microsoftonline.com/${environment.adTenantId}/oauth2/v2.0/authorize?client_id=${environment.adClientId}&redirect_uri=${encodeURIComponent(environment.landingUrl + '/.auth/login/aad/callback')}&nonce=${this.generateNonce(32)}}&response_type=code+id_token&scope=openid+profile+email&prompt=none`;
  }

  canRefreshToken(): boolean {
    if (this.authorizationLibraryService.expiresOn) {
      const utcNow = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        new Date().getUTCHours(),
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds(),
        new Date().getUTCMilliseconds()
      )).getTime();
      const expirationTime = this.authorizationLibraryService.expiresOn.getTime();
      const timeDifference = expirationTime - utcNow;
      const minutesDifference = timeDifference / 1000 / 60;
      return minutesDifference <= this.refreshMinutes;
    }
    return false;
  }

  isTokenExpired(): boolean {
    if (this.authorizationLibraryService.expiresOn) {
      const utcNow = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        new Date().getUTCHours(),
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds(),
        new Date().getUTCMilliseconds()
      )).getTime();
      const expirationTime = this.authorizationLibraryService.expiresOn.getTime();
      return expirationTime <= utcNow;
    }
    return true;
  }

  isAuthorized(): boolean {
    if (this.authorizationLibraryService.adToken
      && this.authorizationLibraryService.userName)
      return true;
    return false;
  }

  login() {
    this.authorizationLibraryService.login(environment.landingUrl);
  }

  private generateNonce(length: number): string {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }
}
