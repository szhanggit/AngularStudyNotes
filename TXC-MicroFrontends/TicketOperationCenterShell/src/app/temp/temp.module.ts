import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemporaryDashboardComponent } from './temporary-dashboard/temporary-dashboard.component';
import { TempRoutingModule } from './temp-routing.modules';



@NgModule({
  declarations: [
    TemporaryDashboardComponent
  ],
  imports: [
    TempRoutingModule,
    CommonModule
  ]
})
export class TempModule { }
