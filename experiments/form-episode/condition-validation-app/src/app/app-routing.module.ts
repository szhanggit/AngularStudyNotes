import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicFormOneComponent } from './basic-form-one/basic-form-one.component';
import { BasicFormTwoComponent } from './basic-form-two/basic-form-two.component';
import { BasicFormThreeComponent } from './basic-form-three/basic-form-three.component';
import { BasicFormThreeV2Component } from './basic-form-three.v2/basic-form-three.v2.component';
import { BasicFormThreeV3Component } from './basic-form-three.v3/basic-form-three.v3.component';

const routes: Routes = [
  {
    path:'b1', component: BasicFormOneComponent
  },
  {
    path:'b2', component: BasicFormTwoComponent
  },
  {
    path:'b3', component: BasicFormThreeComponent
  },
  {
    path:'b4', component: BasicFormThreeV2Component
  },
  {
    path:'b5', component: BasicFormThreeV3Component
  },
  {
    path: '**', component: BasicFormOneComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
