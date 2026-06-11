import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tooltip1Component } from './tooltip1/tooltip1.component';

const routes: Routes = [
  {
    path: '**', component: Tooltip1Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
