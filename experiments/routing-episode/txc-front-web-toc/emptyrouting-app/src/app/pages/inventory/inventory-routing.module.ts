import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { OverviewComponent } from './overview/overview.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  { path: '', component: InventoryComponent },
  {path: "overview", component: OverviewComponent},
  {path: "services", component: ServicesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
