import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { TableComponent } from './table/table.component'
import { FormComponent } from './form/form.component'
import { ProductcountComponent } from './productcount/productcount.component';
import { CategorycountComponent } from './categorycount/categorycount.component';

const childRoutes: Routes = [
  {
      path: "",
      children: [{ path: "products", component: ProductcountComponent },
                 { path: "categories", component: CategorycountComponent },
                 { path: "", component: ProductcountComponent }],
  }
];

const routes: Routes = [
  {path:'login/:user', component: LoginComponent},
  {path:'table', component: TableComponent, children: childRoutes},
  {path:'form', component: FormComponent},
  {path:'form/:id', component: FormComponent},
  {path: '', redirectTo: "login"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
