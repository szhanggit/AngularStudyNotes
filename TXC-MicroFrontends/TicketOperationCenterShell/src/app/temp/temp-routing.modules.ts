import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemporaryDashboardComponent } from './temporary-dashboard/temporary-dashboard.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'

const routes: Routes = [
  {
    path: "",
    component: TemporaryDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    NgbAlertModule
]
})
export class TempRoutingModule { }
