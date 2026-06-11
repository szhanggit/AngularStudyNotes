import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserAuthClaim } from '../models/security/mod-res-op.model';
import { AuthService } from '../service/security/auth.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    userClaim = new UserAuthClaim();
    isLogin : boolean = false;
    constructor (
        private router: Router,
        private readonly authSvc: AuthService
    ) { }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log("Auth Guard");
        return this.authSvc.userAuthClaim.pipe(map(data =>
          {
            if(data != null || data != undefined){
              let userStatus = data.user.userStatus;
              if(userStatus != 1)
              {
                this.router.navigate(['401']);
                return false;
              }
              else{return true}
            }
            this.router.navigate(['401']);
            return false;

          }),catchError((e) =>
          {
            this.router.navigate(['401']);
            return of(false);
          }));
    }
}
