import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { KeyValidateService } from './key-validate.service';

@Injectable({
  providedIn: 'root'
})
export class KeyAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private keyValidateService: KeyValidateService
) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLoggedIn = this.keyValidateService.isLogin();
      if (isLoggedIn ) {
        return true;
      }
      
      this.router.navigate(['/super-admin']);
      return false;
  }
}
