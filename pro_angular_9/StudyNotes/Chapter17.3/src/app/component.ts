import { ApplicationRef, Component } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
import { ProductFormGroup, ProductFormControl } from "./form.model";

@Component({
    selector: "app",
    templateUrl: "template.html",
    //styles: ["div { border: 2px black solid; font-style:italic }"]
    styles: ["/deep/ div { border: 2px black solid; font-style:italic }"]
})
export class ProductComponent {
    model: Model = new Model();

    addProduct(p: Product) {
        console.log("addProduct in component.ts.");
        this.model.saveProduct(p);
    }  
}
