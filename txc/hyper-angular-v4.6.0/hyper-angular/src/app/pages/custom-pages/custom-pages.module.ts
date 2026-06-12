import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { CustomPagesRoutingModule } from './custom-pages-routing.module';
import { DashboardModule } from '../dashboards/dashboards.module';

// components
import { MaintenanceComponent } from './others/maintenance/maintenance.component';
import { Error500Component } from './error/error500/error500.component';
import { Error404Component } from './error/error404/error404.component';


@NgModule({
  declarations: [
    Error500Component,
    Error404Component,
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    DashboardModule,
    CustomPagesRoutingModule
  ]
})
export class CustomPagesModule { }
