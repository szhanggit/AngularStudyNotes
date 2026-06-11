import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-basic-form-two',
  templateUrl: './basic-form-two.component.html',
  styleUrls: ['./basic-form-two.component.css']
})
export class BasicFormTwoComponent implements OnInit {

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

  getValidationMessages(state: any, thingName?: string) {
    let thing: string = state.path || thingName;
    let messages: string[] = [];
    if (state.errors) {
        for (let errorName in state.errors) {
            switch (errorName) {
                case "required":
                    messages.push(`You must enter a ${thing}`);
                break;
                case "minlength":
                    messages.push(`A ${thing} must be at least ${state.errors['minlength'].requiredLength} characters`);
                break;
                case "pattern":
                    messages.push(`The ${thing} contains illegal characters`);
                break;
            }
        }
    }
    return messages;
  }   

}
