import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { CheckoutComponent } from './checkout/checkout.component';
import { CustomersComponent } from './customers/customers.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductComponent } from './product/product.component';
import { SellersComponent } from './sellers/sellers.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: 'products', component: ProductComponent },
  { path: 'productdetails', component: ProductDetailsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'sellers', component: SellersComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
