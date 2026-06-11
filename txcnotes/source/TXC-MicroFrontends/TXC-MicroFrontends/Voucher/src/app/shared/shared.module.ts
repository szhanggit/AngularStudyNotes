import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputControlDirective, SvgControllerModule, ToastModule } from '@txc-angular/component-library';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    NgbModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
  ],
  exports: [
    NgxDropzoneModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
  ]
})
export class SharedModule { }
