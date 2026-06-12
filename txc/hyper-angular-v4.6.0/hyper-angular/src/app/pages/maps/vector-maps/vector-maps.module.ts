import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { WidgetModule } from '../../../shared/widget/widget.module';
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { VectorMapsRoutingModule } from './vector-maps-routing.module';

// components
import { VectorMapsComponent } from './vector-maps.component';



@NgModule({
  declarations: [
    VectorMapsComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    WidgetModule,
    VectorMapsRoutingModule
  ]
})
export class VectorMapsModule { }
