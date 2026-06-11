import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';
import { FormComponent } from './form/form.component';
import { ProductcountComponent } from './productcount/productcount.component';
import { CategorycountComponent } from './categorycount/categorycount.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TableComponent,
    FormComponent,
    ProductcountComponent,
    CategorycountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
