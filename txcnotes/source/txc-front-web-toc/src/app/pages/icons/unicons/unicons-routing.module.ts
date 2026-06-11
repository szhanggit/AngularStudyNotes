import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniconsComponent } from './unicons.component';

const routes: Routes = [{ path: '', component: UniconsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniconsRoutingModule { }
