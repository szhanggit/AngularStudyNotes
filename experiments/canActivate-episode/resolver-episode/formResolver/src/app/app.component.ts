import { Component } from '@angular/core';
import { MessageService } from "./message/message.service";
import { Message } from "./message/message.model";
import { Product } from "./model/product.model";
import { Model } from "./model/repository.model";
import { Observer } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'loadingResolver';
  constructor(private messages: MessageService, private model: Model) { }
  clickEvent(){
    console.log("clickEvent has been triggered.");
    this.messages.reportMessage(new Message("This is my test."));
  }

  getProducts(): Product[] {
    return this.model.getProducts();
  }
}
