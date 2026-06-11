import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatemerchantComponent } from './createmerchant.component';

const routes: Routes = [{ path: '', component: CreatemerchantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatemerchantRoutingModule { }
