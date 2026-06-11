import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantsRoutingModule } from './merchants-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AcceptanceLoopCreateComponent } from './components/acceptance-loop-create/acceptance-loop-create.component';
import { AcceptanceLoopListComponent } from './components/acceptance-loop-list/acceptance-loop-list.component';
import { AcceptanceLoopMerchantComponent } from './components/acceptance-loop-merchant/acceptance-loop-merchant.component';
import { AcceptanceLoopShopComponent } from './components/modals/acceptance-loop-shop/acceptance-loop-shop.component';


@NgModule({
  declarations: [
    AcceptanceLoopCreateComponent,
    AcceptanceLoopListComponent,
    AcceptanceLoopMerchantComponent,
    AcceptanceLoopShopComponent
  ],
  imports: [
    CommonModule,    
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MerchantsRoutingModule,
    NgbPaginationModule,
    NgbModule
  ]
})
export class MerchantsModule { }
