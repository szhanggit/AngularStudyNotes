import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';


@NgModule({
  declarations: [
    PagesComponent,
    Error404Component,
    Error500Component,
    //MaintenanceComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
