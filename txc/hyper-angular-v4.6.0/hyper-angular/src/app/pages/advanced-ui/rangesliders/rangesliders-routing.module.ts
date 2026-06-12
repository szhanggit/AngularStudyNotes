import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RangeslidersComponent } from './rangesliders.component';

const routes: Routes = [{ path: '', component: RangeslidersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RangeslidersRoutingModule { }
