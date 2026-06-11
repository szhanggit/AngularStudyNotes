import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: 'product', component: ProductComponent
  },
  {
    path:'**', component: StudentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
