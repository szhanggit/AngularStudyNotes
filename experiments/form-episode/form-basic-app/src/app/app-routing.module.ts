import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicFormOneComponent } from './basic-form-one/basic-form-one.component';
import { BasicFormTwoComponent } from './basic-form-two/basic-form-two.component';
import { BasicFormThreeComponent } from './basic-form-three/basic-form-three.component';
import { FormArrayExComponent } from './form-array-ex/form-array-ex.component';
import { FormArrayNameExComponent } from './form-array-name-ex/form-array-name-ex.component';
import { DateCtrlComponent } from './date-ctrl/date-ctrl.component';
import { RatingCtrlComponent } from './rating-ctrl/rating-ctrl.component';
import { UpimgComponent } from './upimg/upimg.component';

const routes: Routes = [
  {
    path:'one', component: BasicFormOneComponent,    
  },
  {
    path:'two', component: BasicFormTwoComponent
  },
  {
    path:'three', component: BasicFormThreeComponent
  },
  {
    path:'faname', component: FormArrayNameExComponent
  },
  {
    path:'fa', component: FormArrayExComponent
  },
  {
    path:'date', component: DateCtrlComponent
  },
  {
    path:'rate', component: RatingCtrlComponent
  },  
  {
    path:'upimg', component: UpimgComponent
  },
  {
    path:'**', redirectTo: '/one'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
