import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'create', component: CreateOrderComponent },
  { path: ':id', component: OrderDetailsComponent },
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
