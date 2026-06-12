import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputControlDirective, SvgControllerModule, ToastModule } from '@txc-angular/component-library';
import { NgxSliderModule } from '@angular-slider/ngx-slider';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    NgxDropzoneModule,
    NgbModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
  ],
  exports: [
    NgxSliderModule,
    NgxDropzoneModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
  ]
})
export class SharedModule { }
