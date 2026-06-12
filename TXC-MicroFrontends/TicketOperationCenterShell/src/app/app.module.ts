import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BusinessUnitModule } from './business-unit/business-unit.module';
import { AuthorizationLibraryModule } from '@txc-angular/authorization-library';
import { SecurityModule } from './security/security.module';
import { ComponentLibraryModule } from '@txc-angular/component-library';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    BusinessUnitModule,
    AuthorizationLibraryModule,
    ComponentLibraryModule,
    SecurityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
