import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDropdownModule, NgbNavModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Select2Module } from 'ng-select2-component';

// modules
import { WidgetModule } from '../../shared/widget/widget.module';
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { AdvancedTableModule } from '../../shared/advanced-table/advanced-table.module';
import { EcommerceRoutingModule } from './ecommerce-routing.module';

// components
import { ProductComponent } from './product/product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CustomersComponent } from './customers/customers.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SellersComponent } from './sellers/sellers.component';
import { BillingComponent } from './checkout/billing/billing.component';
import { ShippingComponent } from './checkout/shipping/shipping.component';
import { PaymentComponent } from './checkout/payment/payment.component';
import { OrderSummaryComponent } from './checkout/order-summary/order-summary.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductDetailsComponent,
    OrdersComponent,
    OrderDetailsComponent,
    CustomersComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    SellersComponent,
    BillingComponent,
    ShippingComponent,
    PaymentComponent,
    OrderSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgApexchartsModule,
    Select2Module,
    PageTitleModule,
    AdvancedTableModule,
    WidgetModule,
    EcommerceRoutingModule
  ],
})
export class EcommerceModule { }
