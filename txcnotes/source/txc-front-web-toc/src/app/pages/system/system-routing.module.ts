import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { CreateVendorComponent } from './components/create-vendor/create-vendor.component';
import { EditVendorComponent } from './components/edit-vendor/edit-vendor.component';

const routes: Routes = [
  {
    path: '', redirectTo:'vendor/list' ,pathMatch:'full'
  },
  {
    path: 'vendor/list',
    component: VendorListComponent
  },  
    {
    path: 'vendor/create-vendor', component: CreateVendorComponent
  }
  ,  
    {
    path: 'vendor/edit-vendor', component: EditVendorComponent
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
