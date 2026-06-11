import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  RoutesRecognized,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { RoleList } from 'src/app/core/enums/role-list';
import { CookieConstants } from 'src/app/core/models/constants/cookie-constants.model';
import { LoginResponse } from 'src/app/core/models/security/login-response.model';
import { LoginUserTenantsResponse } from 'src/app/core/models/security/login-user-tenants-response';
import { CookieManagerService } from '../../coockie-manager/cookie-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SelectTenantGuard implements CanActivate {

  constructor(
    private cookiemngr: CookieManagerService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const selectedTenant: LoginUserTenantsResponse = this.cookiemngr.getCookie(
      CookieConstants.currentTenant
    );
    const currentUser: LoginResponse = this.cookiemngr.getCookie(
      CookieConstants.currentUser
    );

    if (
      (currentUser != null || currentUser != undefined) &&
      currentUser.roles.some((m) => m.roleId == RoleList.SuperAdmin)
    ) {
      return false;
    }

    if(selectedTenant != null || selectedTenant != undefined){
      return false;
    }

    return true;
  }
}
