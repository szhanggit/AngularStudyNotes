import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { ClientComponent } from "./client/client.component";

@Injectable()
export class DefaultFirstGuard {
    private firstNavigation = true;
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.firstNavigation) {
            console.log("It is the first load with component " + route.component?.name +".");
            this.firstNavigation = false;
            if (route.component != ClientComponent) {
                this.router.navigateByUrl("/");
                return false;
            }
        }
        else
        {
            console.log("It is not the first load.");
        }
        
        return true;
    }
}