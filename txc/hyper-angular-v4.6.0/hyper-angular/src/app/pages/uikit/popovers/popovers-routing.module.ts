import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopoversComponent } from './popovers.component';

const routes: Routes = [{ path: '', component: PopoversComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopoversRoutingModule { }
