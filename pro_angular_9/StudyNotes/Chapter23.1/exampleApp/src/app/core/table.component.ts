import { Component, Inject } from "@angular/core";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
import { MODES, SharedState, SHARED_STATE } from "./sharedState.model";
import { Observer } from "rxjs";

@Component({
    selector: "paTable",
    templateUrl: "table.component.html"
})
export class TableComponent {

    //constructor(private model: Model, private state: SharedState) { }
    constructor(private model: Model, @Inject(SHARED_STATE) public observer: Observer<SharedState>) { }

    getProduct(key: number): Product {
        return this.model.getProduct(key);
    }

    getProducts(): Product[] {
        return this.model.getProducts();
    }

    deleteProduct(key: number) {
        this.model.deleteProduct(key);
    }

    editProduct(key: number) {
        //this.state.id = key;
        //this.state.mode = MODES.EDIT;
        this.observer.next(new SharedState(MODES.EDIT, key));
    }

    createProduct() {
        //this.state.id = undefined;
        //this.state.mode = MODES.CREATE;
        this.observer.next(new SharedState(MODES.CREATE));
    }
}
