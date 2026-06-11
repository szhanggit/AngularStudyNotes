import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { UnsavedGuard } from '../unsaved.guard';

const routes: Routes = [{ path: '', component: ProductComponent, canDeactivate:[UnsavedGuard] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
