import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { OverviewComponent } from './overview/overview.component';
import { ServicesComponent } from './services/services.component';


@NgModule({
  declarations: [
    InventoryComponent,
    OverviewComponent,
    ServicesComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule
  ]
})
export class InventoryModule { }
