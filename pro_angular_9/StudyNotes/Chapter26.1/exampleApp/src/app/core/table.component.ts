import { Component, Inject } from "@angular/core";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
//import { MODES, SharedState, SHARED_STATE } from "./sharedState.model";
//import { Observer } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "paTable",
    templateUrl: "table.component.html"
})
export class TableComponent {
    category: string = null;
/*    constructor(private model: Model,
        @Inject(SHARED_STATE) private observer: Observer<SharedState>) { }
*/

    constructor(public model: Model, activeRoute: ActivatedRoute) {
        activeRoute.params.subscribe(params => {
            this.category = params["category"] || null;
        })
    }

    getProduct(key: number): Product {
        return this.model.getProduct(key);
    }

    /*getProducts(): Product[] {
        return this.model.getProducts();
    }*/

    getProducts(): Product[] {
        return this.model.getProducts().filter(p => this.category == null || p.category == this.category);
    }
        
    get categories(): string[] {
        return this.model.getProducts().map(p => p.category).filter((category, index, array) => array.indexOf(category) == index);
    }

    deleteProduct(key: number) {
        this.model.deleteProduct(key);
    }

    //editProduct(key: number) {
    //    this.observer.next(new SharedState(MODES.EDIT, key));
    //}

    //createProduct() {
    //    this.observer.next(new SharedState(MODES.CREATE));
    //}
}
