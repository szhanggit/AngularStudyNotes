import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantSkuRoutingModule } from './merchant-sku-routing.module';
import { MerchantSkuComponent } from './merchant-sku.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { ServicesComponent } from './services/services.component';


@NgModule({
  declarations: [
    MerchantSkuComponent,
    CreateComponent,
    DetailComponent,
    ServicesComponent
  ],
  imports: [
    CommonModule,
    MerchantSkuRoutingModule
  ]
})
export class MerchantSkuModule { }
