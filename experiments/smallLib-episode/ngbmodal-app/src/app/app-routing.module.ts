import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbasicexComponent } from './navbasicex/navbasicex.component';
import { TemplateoutletComponent } from './templateoutlet/templateoutlet.component';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';

const routes: Routes = [
  {
    path:'navbasic', component: NavbasicexComponent,    
  },
  {
    path:'template', component: TemplateoutletComponent
  },
  {
    path:'modelbasic', component: ModalBasicComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
