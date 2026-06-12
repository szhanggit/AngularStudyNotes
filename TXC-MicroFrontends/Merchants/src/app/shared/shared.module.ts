import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { InputControlDirective, ToastModule, SvgControllerModule, ComponentLibraryModule } from '@txc-angular/component-library';
import { DatePickerRangeComponent } from './date-picker-range/date-picker-range.component';


@NgModule({
  declarations: [
    DatePickerRangeComponent,
  ],
  imports: [
    CommonModule,
    NgxSliderModule,
    NgbModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
    ComponentLibraryModule,
  ],
  exports: [
    NgxSliderModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
    DatePickerRangeComponent,
    ComponentLibraryModule 
  ]
})
export class SharedModule { }
