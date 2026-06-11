import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbasicexComponent } from './navbasicex/navbasicex.component';
import { TemplateoutletComponent } from './templateoutlet/templateoutlet.component';
import { Toggleex1Component } from './toggleex1/toggleex1.component';
import { Toggleex2Component } from './toggleex2/toggleex2.component';
import { Tooltip1Component } from './tooltip1/tooltip1.component';

const routes: Routes = [
  {
    path:'navbasic', component: NavbasicexComponent,    
  },
  {
    path:'template', component: TemplateoutletComponent
  },
  {
    path:'t1', component: Toggleex1Component
  },
  {
    path:'t2', component: Toggleex2Component
  },
  {
    path: 'tooltip', component: Tooltip1Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
