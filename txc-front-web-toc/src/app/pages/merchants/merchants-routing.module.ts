import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptanceLoopCreateComponent } from './components/acceptance-loop-create/acceptance-loop-create.component';
import { AcceptanceLoopListComponent } from './components/acceptance-loop-list/acceptance-loop-list.component';
import { AcceptanceLoopMerchantComponent } from './components/acceptance-loop-merchant/acceptance-loop-merchant.component';

const routes: Routes = [
  {
    path: '', redirectTo:'acceptance-loop/list' ,pathMatch:'full'
  },
  {
    path: 'acceptance-loop/list', component: AcceptanceLoopListComponent
  },
  {
    path: 'acceptance-loop/create', component: AcceptanceLoopCreateComponent
  },
  {
    path: 'acceptance-loop/edit/:id', component: AcceptanceLoopCreateComponent
  },
  {
    path: 'acceptance-loop/select-merchant', component: AcceptanceLoopMerchantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantsRoutingModule { }
