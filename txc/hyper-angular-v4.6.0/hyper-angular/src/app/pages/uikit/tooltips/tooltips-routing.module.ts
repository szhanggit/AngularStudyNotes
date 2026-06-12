import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipsComponent } from './tooltips.component';

const routes: Routes = [{ path: '', component: TooltipsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TooltipsRoutingModule { }
