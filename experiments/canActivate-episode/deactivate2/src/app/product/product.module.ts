import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
//import { MessageService } from "../message/message.service";

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule, RouterModule
  ],
  //providers: [MessageService]
})
export class ProductModule { }
