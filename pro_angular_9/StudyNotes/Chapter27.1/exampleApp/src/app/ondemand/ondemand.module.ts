import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OndemandComponent } from "./ondemand.component";
import { RouterModule } from "@angular/router";
import { FirstComponent } from "./first.component";
import { SecondComponent } from "./second.component";

/*
There can be at most one router-outlet element without a
name element, which is known as the primary outlet. This is because omitting the name attribute has the same
effect as applying it with a value of primary.
*/

let routing = RouterModule.forChild([
    {
        path: "",
        component: OndemandComponent,
        children: [
            { 
                path: "",
                children: [
                { outlet: "primary", path: "", component: FirstComponent, },
                { outlet: "left", path: "", component: SecondComponent, },
                { outlet: "right", path: "", component: SecondComponent, },
            ]},
            {
                path: "swap",
                children: [
                    { outlet: "primary", path: "", component: SecondComponent, },
                    { outlet: "left", path: "", component: FirstComponent, },
                    { outlet: "right", path: "", component: FirstComponent, },
                ]
            },
        ]
    },
]);

@NgModule({
    imports: [CommonModule, routing],
    declarations: [OndemandComponent, FirstComponent, SecondComponent],
    exports: [OndemandComponent]
})

export class OndemandModule { }