import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';

import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { FakeBackendProvider } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { LayoutModule } from './layouts/layout.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    QuillModule.forRoot(),
    LayoutModule,
    AppRoutingModule
  ],
  providers: [
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    FakeBackendProvider,
    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
