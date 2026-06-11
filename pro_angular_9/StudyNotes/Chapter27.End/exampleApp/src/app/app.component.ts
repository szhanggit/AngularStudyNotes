import { Component } from "@angular/core";

@Component({
    selector: "app",
    templateUrl: "./app.component.html"
})
export class AppComponent { 
    constructor(){
        console.log("The constructor of app.component.ts");
    }
}
