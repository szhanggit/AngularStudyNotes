import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { PageTitleModule } from '../../../../shared/page-title/page-title.module';
import { PricingRoutingModule } from './pricing-routing.module';

// components
import { PricingComponent } from './pricing.component';


@NgModule({
  declarations: [
    PricingComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    WidgetModule,
    PricingRoutingModule
  ]
})
export class PricingModule { }
