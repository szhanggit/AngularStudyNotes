import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { MessageService } from "./message/message.service";
import { Message } from "./message/message.model";

@Injectable()
export class TermsGuard {
    constructor(private messages: MessageService, private router: Router) { 
        console.log("Here is the constructor of terms.guard.ts");
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        console.log("Title: " + route.title);
        console.log("ComponentName: " + route.component?.name);
        console.log("Url: " + route.url);
        if (route.component?.name == "CsportalComponent") {
            return new Promise<boolean>((_) => {
                let responses: [string, () => void][] = [["Yes", () => {_(true);}], ["No", () => {_(false);}]];
                this.messages.reportMessage(new Message("Do you accept the terms & conditions?", false, responses));
            });
        } else {
            return true;
        }
    }

}