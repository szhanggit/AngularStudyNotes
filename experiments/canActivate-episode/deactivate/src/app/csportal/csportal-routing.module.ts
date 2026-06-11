import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsportalComponent } from './csportal.component';

const routes: Routes = [{ path: '', component: CsportalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CsportalRoutingModule { }
