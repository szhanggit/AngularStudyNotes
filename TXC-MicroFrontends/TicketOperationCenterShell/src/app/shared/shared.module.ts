import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { LeftSideBarComponent } from './sidebar/left-side-bar.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    TopbarComponent,
    LeftSideBarComponent,
    SpinnerOverlayComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SimplebarAngularModule,
    NgbModule
  ],
  exports: [
    TopbarComponent,
    LeftSideBarComponent,
    SpinnerOverlayComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true
    }
  ]
})
export class SharedModule { }
