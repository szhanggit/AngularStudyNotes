import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { RangeslidersRoutingModule } from './rangesliders-routing.module';

// components
import { RangeslidersComponent } from './rangesliders.component';


@NgModule({
  declarations: [
    RangeslidersComponent
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    PageTitleModule,
    RangeslidersRoutingModule
  ]
})
export class RangeslidersModule { }
