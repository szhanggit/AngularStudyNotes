import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { StudentService } from './service/student.service';
import { RestDatasourceService, REST_URL } from './service/rest.datasource.service';
import { HttpRequestInterceptorService } from './service/http.request.interceptor.service';
import { ProductComponent } from './product/product.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCollapseModule,
    NgbTooltipModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [StudentService, 
    { provide: REST_URL, useValue: `https://localhost:5001/api` },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
