import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../model/auth.service";

@Injectable()
export class AuthGuard {
    constructor(private router: Router, private auth: AuthService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {        
        console.log("this.auth.authenticated: " + this.auth.authenticated);
        if (!this.auth.authenticated) {
            console.log("Authentication failed.");
            this.router.navigateByUrl("/auth");
            return false;
        }
        
        return true;
    }
}