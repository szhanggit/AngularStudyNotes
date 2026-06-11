import { Directive, ElementRef, Attribute, Input, SimpleChange, Output, EventEmitter, HostListener, HostBinding } from "@angular/core";
import { Product } from "./product.model";

@Directive({
    selector: "[pa-attr]",
})
export class PaAttrDirective {
    /*constructor(element: ElementRef, @Attribute("pa-attr") bgClass: string) {
        element.nativeElement.classList.add(bgClass || "bg-success", "text-white");
    }*/

    constructor(private element: ElementRef) {
        this.element.nativeElement.addEventListener("click", e => {
            if (this.product != null) {
                this.click.emit(this.product.category);
            }
        });
    }

    @Input("pa-attr")
    bgClass: string;

    @Input("pa-product")
    product: Product;

    /*ngOnInit() {
        this.element.nativeElement.classList.add(this.bgClass || "bg-success", "text-white");
    }*/

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

    @Output("pa-category")
    click = new EventEmitter<string>();
}