import { SvgControllerModule } from './components/svg-controller/svg-controller.module';
import { NgModule } from '@angular/core';
import { ToastModule } from './components/toast/toast.module';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { InputControlDirective } from './directives/input-control.directive';
import { StepperComponent } from './components/stepper/stepper.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TxcDateTimeService } from './services/txcdatetime.service';
import { TxcDateTimePipe } from './pipes/txcdatetime.pipe';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeIntl, OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateMaskInputDirective } from './directives/date-mask-input.directive';
import { HeaderComponent } from './components/header/header.component';
import { FormLibComponent } from './components/dumb/form/form.component';
import { CheckboxLibComponent } from './components/dumb/form-based/checkbox/checkbox.component';
import { TextboxLibComponent } from './components/dumb/form-based/textbox/textbox.component';
import { RadioButtonLibComponent } from './components/dumb/form-based/radio-button/radio-button.component';
import { FileInputLibComponent } from './components/dumb/form-based/file-input/file-input.component';
import { TypeaheadLibComponent } from './components/dumb/form-based/typeahead/typeahead.component';
import { DatepickerLibComponent } from './components/dumb/form-based/datepicker/datepicker.component';
import { SelectLibComponent } from './components/dumb/form-based/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeDefaultModel } from './models/owl-datetime-international.model';
import { DndDirective } from './directives/dnd.directive';
import { AttachmentService } from './services/attachment.service';


export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'YYYY/MM/DD hh:mm a',
  datePickerInput: 'YYYY/MM/DD',
  timePickerInput: 'hh:mm a',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
import { NoDataLibComponent } from './components/table/no-data/no-data.component';
import { PageSizeLibComponent } from './components/table/page-size/page-size.component';
import { PaginationLibComponent } from './components/table/pagination/pagination.component';
import { TableLibComponent } from './components/table/table.component';
import { StatusLibComponent } from './components/status/status.component';
import { LoaderLibComponent } from './components/loader/loader.component';
import { Select2Module } from 'ng-select2-component';
import { RouterModule } from '@angular/router';
import { ErrorMessageLibComponent } from './components/error-message/error-message.component';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    StepperComponent,
    TxcDateTimePipe,
    DatePickerComponent,
    DateMaskInputDirective,
    HeaderComponent,
    FormLibComponent,
    CheckboxLibComponent,
    TextboxLibComponent,
    RadioButtonLibComponent,
    FileInputLibComponent,
    TypeaheadLibComponent,
    DndDirective,
    DatepickerLibComponent,
    SelectLibComponent,
    NoDataLibComponent,
    PageSizeLibComponent,
    PaginationLibComponent,
    TableLibComponent,
    StatusLibComponent,
    LoaderLibComponent,
    ErrorMessageLibComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    InputControlDirective,
    SvgControllerModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDropdownModule,
    NgbCollapseModule,
    OwlDateTimeModule,
    Select2Module,
    RouterModule
  ],
  exports: [
    ToastModule,
    ConfirmationModalComponent,
    StepperComponent,
    InputControlDirective,
    TxcDateTimePipe,
    NgbDatepickerModule,
    DatePickerComponent,
    NgbTooltipModule,
    DateMaskInputDirective,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    FormLibComponent,
    TextboxLibComponent,
    SelectLibComponent,
    DatePickerComponent,
    NgbCollapseModule,
    CheckboxLibComponent,
    RadioButtonLibComponent,
    FileInputLibComponent,
    TypeaheadLibComponent,
    DndDirective,
    DatepickerLibComponent,
    NoDataLibComponent,
    PageSizeLibComponent,
    PaginationLibComponent,
    TableLibComponent,
    StatusLibComponent,
    LoaderLibComponent,
    NgbModule,
    Select2Module,
    ErrorMessageLibComponent
  ],
  providers: [
    TxcDateTimeService,
    AttachmentService,
    DatePipe,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    { provide: OwlDateTimeIntl, useClass: OwlDateTimeDefaultModel },
  ],
})
export class ComponentLibraryModule {}
