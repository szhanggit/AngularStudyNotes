import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductFormGroup } from '../model/form.model';

@Component({
  selector: 'app-basic-form-three',
  templateUrl: './basic-form-three.component.html',
  styleUrls: ['./basic-form-three.component.css']
})
export class BasicFormThreeComponent implements OnInit {
  formGroup2: ProductFormGroup = new ProductFormGroup();
  constructor() { }

  ngOnInit(): void {
  }

  newProduct: Product = new Product();

  get jsonProduct() {
      return JSON.stringify(this.newProduct);
  }

  addProduct(p: Product) {
      console.log("New Product: " + this.jsonProduct);
  }

  formSubmitted: boolean = false;

  submitForm() {
      //Object.keys(this.formGroup2.controls).forEach(c => this.newProduct[c] = this.formGroup2.controls[c].value);
      this.formSubmitted = true;  //This is the triggering key.
      /*if (this.formGroup2.valid) {
          this.addProduct(this.newProduct);
          this.newProduct = new Product();
          this.formGroup2.reset();
          this.formSubmitted = false;
      }*/
  }   
}
