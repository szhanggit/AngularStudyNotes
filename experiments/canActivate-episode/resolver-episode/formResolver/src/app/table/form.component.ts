import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  product: Product = new Product();
  originalProduct = new Product();

  constructor(public model: Model, activeRoute: ActivatedRoute,
        public router: Router) { 
          activeRoute.params.subscribe(params => {
            this.editing = params["mode"] == "edit";
            let id = params["id"];
            console.log("The constructor of form.component.ts => id " + id);
            if (id != null) {
                if(model.getProduct(id) == null)
                {
                    console.log("product is empty.");                    
                }
                else
                {
                    console.log("product is something.");
                }
                Object.assign(this.product, model.getProduct(id) || new Product());
                Object.assign(this.originalProduct, this.product);
            }
          })          
        }

  editing: boolean = false;

  ngOnInit(): void {
  }

  submitForm(form: NgForm) {
    if (form.valid) {
        this.model.saveProduct(this.product);
        this.originalProduct = this.product;
        this.router.navigateByUrl("/");
    }
}

}
