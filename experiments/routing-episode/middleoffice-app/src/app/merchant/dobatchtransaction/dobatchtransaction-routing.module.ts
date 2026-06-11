import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DobatchtransactionComponent } from './dobatchtransaction.component';

const routes: Routes = [{ path: '', component: DobatchtransactionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DobatchtransactionRoutingModule { }
