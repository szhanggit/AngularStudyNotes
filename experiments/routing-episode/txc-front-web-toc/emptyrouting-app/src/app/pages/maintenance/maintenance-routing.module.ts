import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';
import { AdminComponent } from './admin/admin.component';
import { MediaComponent } from './media/media.component';

const routes: Routes = [
  { path: '', component: MaintenanceComponent },
  { path: "admin", component: AdminComponent},
  { path: "media", component: MediaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
