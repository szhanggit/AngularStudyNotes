import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopOnStoreRoutingModule } from './shop-on-store-routing.module';
import { ShopOnStoreComponent } from './shop-on-store.component';


@NgModule({
  declarations: [
    ShopOnStoreComponent
  ],
  imports: [
    CommonModule,
    ShopOnStoreRoutingModule
  ]
})
export class ShopOnStoreModule { }
