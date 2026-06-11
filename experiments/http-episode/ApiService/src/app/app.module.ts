import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { StudentdetailComponent } from './studentdetail/studentdetail.component';
import { FormsModule } from '@angular/forms';
import { StudentRepo } from './Model/repository.student';
import { RestDataSource, REST_URL } from './Model/rest-data-source';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [StudentRepo, RestDataSource, { provide: REST_URL, useValue: `https://localhost:5001/api/` }],
  bootstrap: [AppComponent]
})
export class AppModule { }
