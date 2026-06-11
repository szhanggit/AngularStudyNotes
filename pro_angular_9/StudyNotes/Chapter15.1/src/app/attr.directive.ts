import { Directive, ElementRef, Attribute, Input, HostBinding, SimpleChange } from "@angular/core";

@Directive({
    selector: "[pa-attr]",
})
export class PaAttrDirective {
    /*constructor(element: ElementRef, @Attribute("pa-attr") bgClass: string) {
        element.nativeElement.classList.add(bgClass || "bg-success", "text-white");
    }*/

    constructor(private element: ElementRef) {}

    @Input("pa-attr")
    @HostBinding("class")
    bgClass: string;

    ngOnInit() {
        this.element.nativeElement.classList.add(this.bgClass || "bg-success", "text-white");
    }

    ngOnChanges(changes: {[property: string]: SimpleChange }) {
        let change = changes["bgClass"];
        let classList = this.element.nativeElement.classList;
        if (!change.isFirstChange() && classList.contains(change.previousValue)) {
            classList.remove(change.previousValue);
        }
        if (!classList.contains(change.currentValue)) {
            classList.add(change.currentValue);
        }
    }
}