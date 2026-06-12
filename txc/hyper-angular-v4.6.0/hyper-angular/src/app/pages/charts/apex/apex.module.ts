import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

// modules
import { PageTitleModule } from '../../../shared/page-title/page-title.module';
import { ApexRoutingModule } from './apex-routing.module';

// components
import { ApexComponent } from './apex.component';


@NgModule({
  declarations: [
    ApexComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    PageTitleModule,
    ApexRoutingModule
  ]
})
export class ApexModule { }
