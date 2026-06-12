import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { ChartjsRoutingModule } from './chartjs-routing.module';

// components
import { ChartjsComponent } from './chartjs.component';


@NgModule({
  declarations: [
    ChartjsComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    PageTitleModule,
    ChartjsRoutingModule
  ]
})
export class ChartjsModule { }
