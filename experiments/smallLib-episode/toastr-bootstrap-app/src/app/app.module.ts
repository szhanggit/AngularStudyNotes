import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NgbTooltipModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { BootstrapExComponent } from './bootstrap-ex/bootstrap-ex.component';
import { ToastsContainerExComponent } from './bootstrap-ex/toasts-container-ex/toasts-container-ex.component';
import { NgTemplateOutlet } from '@angular/common';
import { BootstrapTXCComponent } from './bootstrap-txc/bootstrap-txc.component';
import { ToastsContainerTXCComponent } from './bootstrap-txc/toasts-container-txc/toasts-container-txc.component';
import { TxcFormComponent } from './txc-form/txc-form.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SystemExceptionComponent } from './system-exception/system-exception.component';
import { TokenInterceptor } from './system-exception/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BootstrapExComponent,
    ToastsContainerExComponent,
    BootstrapTXCComponent,
    ToastsContainerTXCComponent,
    TxcFormComponent,
    RoleManagementComponent,
    SystemExceptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbToastModule,
    NgTemplateOutlet
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
