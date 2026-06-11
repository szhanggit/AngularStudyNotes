import {
    Directive, SimpleChange, ViewContainerRef, TemplateRef, Input
} from "@angular/core";

@Directive({
    selector: "[paIf]"
})

export class PaStructureDirective {
    constructor(private container: ViewContainerRef /*
        The ViewContainerRef object is used to manage the contents of the view container, which is the part of
        the HTML document where the ng-template element appears and for which the directive is responsible.    
    */
        , private template: TemplateRef<Object>) { }
    @Input("paIf")
    expressionResult: boolean;

    ngOnChanges(changes: { [property: string]: SimpleChange }) {//Data structure storing changes. Receive change notifications.
        let change = changes["expressionResult"];
        if (!change.isFirstChange() && !change.currentValue) {//Not first change and current value is false.
            this.container.clear();
        } else if (change.currentValue) {//The current value is true.
            this.container.createEmbeddedView(this.template);
        }
    }
}