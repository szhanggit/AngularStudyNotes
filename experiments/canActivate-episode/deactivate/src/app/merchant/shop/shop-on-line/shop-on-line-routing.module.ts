import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopOnLineComponent } from './shop-on-line.component';

const routes: Routes = [{ path: '', component: ShopOnLineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopOnLineRoutingModule { }
