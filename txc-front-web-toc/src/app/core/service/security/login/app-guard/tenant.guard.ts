import { RoleList } from '../../../../core/enums/role-list';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieConstants } from 'src/app/core/models/constants/cookie-constants.model';
import { LoginResponse } from 'src/app/core/models/security/login-response.model';
import { CookieManagerService } from '../../coockie-manager/cookie-manager.service';
import { LoginUserTenantsResponse } from 'src/app/core/models/security/login-user-tenants-response';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {

  constructor(private cookiemngr : CookieManagerService
             ,private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const selectedTenant : LoginUserTenantsResponse = this.cookiemngr.getCookie(CookieConstants.currentTenant);
      const currentUser : LoginResponse = this.cookiemngr.getCookie(CookieConstants.currentUser);

      if( (currentUser != null || currentUser != undefined)
          && currentUser.roles.some(m => m.roleId == RoleList.SuperAdmin)) {
        return true;
      }
      if(selectedTenant == null || selectedTenant == undefined){

        this.router.navigate(["/security/user-tenants"]);
        return false;
      }

    return true;
  }

}
