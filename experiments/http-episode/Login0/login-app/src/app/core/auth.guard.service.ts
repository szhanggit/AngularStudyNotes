import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from '../login/auth.service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(
      private router: Router
      , private authenticationService: AuthenticationService
      ) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const currentUser = this.authenticationService.currentUser();
      console.log("currentUser=> " + JSON.stringify(currentUser));
      if (currentUser) {            
          return true;
      }        
      
      // not logged in so redirect to login page with the return url

      this.router.navigate(['login']);
      return false;        
    
  }
}