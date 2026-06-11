import { Component, OnInit } from '@angular/core';
import { MessageService } from "../message/message.service";
import { Message } from "../message/message.model";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
import { Observer } from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private messages: MessageService, private model: Model) { }

  ngOnInit(): void {
  }

  clickEvent(){
    console.log("clickEvent has been triggered.");
    this.messages.reportMessage(new Message("This is my test."));
  }

  getProducts(): Product[] {
    return this.model.getProducts();
  }  
}
