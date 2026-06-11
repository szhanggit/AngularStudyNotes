import { Component, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "paForm",
    templateUrl: "form.component.html",
    styleUrls: ["form.component.css"]
})
export class FormComponent {
    product: Product = new Product();
    originalProduct = new Product();

    constructor(public model: Model, activeRoute: ActivatedRoute,
        public router: Router) {
        console.log("The constructor of form.component.ts");
        activeRoute.params.subscribe(params => {
            this.editing = params["mode"] == "edit";
            let id = params["id"];
            console.log("The constructor of form.component.ts => id " + id);
            if (id != null) {
                if(model.getProduct(id) == null)
                {
                    console.log("product is empty.");                    
                }
                Object.assign(this.product, model.getProduct(id) || new Product());
                Object.assign(this.originalProduct, this.product);
            }
        })
    }

    editing: boolean = false;

    submitForm(form: NgForm) {
        if (form.valid) {
            this.model.saveProduct(this.product);
            this.originalProduct = this.product;
            this.router.navigateByUrl("/");
        }
    }

    //resetForm() {
    //    this.product = new Product();
    //}
}
