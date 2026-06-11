import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot, RouterStateSnapshot,
    Router
} from "@angular/router";	
import { Observable, Subject } from "rxjs";
import { MessageService } from "./message/message.service";
import { Message } from "./message/message.model";
import { ProductComponent } from "./product/product.component";

@Injectable()
export class UnsavedGuard {

    constructor(private messages: MessageService,
                private router: Router) { }

    canDeactivate(component: ProductComponent, route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log("Before editing");
        if (component.editing) {
            console.log("After editing");
            /*if (["name", "category", "price"]
                .some(prop => component.product[prop]
                    != component.originalProduct[prop])) {*/
                let subject = new Subject<boolean>();

                let responses: [string, () => void][] = [
                    ["Yes", () => {
                        subject.next(true);
                        subject.complete();
                    }],
                    ["No", () => {
                        this.router.navigateByUrl(this.router.url);
                        subject.next(false);
                        subject.complete();
                    }]
                ];  //otice that I call the complete method on the Subject after calling the next method. Angular will wait
                    //indefinitely for the complete method to be called, effectively freezing the application.
                this.messages.reportMessage(new Message("Discard Changes?", true, responses));
                return subject;
            //}
        }
        return true;
    }
}
