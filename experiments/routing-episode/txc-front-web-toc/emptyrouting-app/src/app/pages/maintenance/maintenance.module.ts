import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { AdminComponent } from './admin/admin.component';
import { MediaComponent } from './media/media.component';


@NgModule({
  declarations: [
    MaintenanceComponent,
    AdminComponent,
    MediaComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
