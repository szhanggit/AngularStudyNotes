import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { StringSplitByCapitalLetterPipe } from '../pipes/string-split-by-capital-letter.pipe';
import { Select2Module } from 'ng-select2-component';
import { CommonTableFilterComponent } from './common-table-filter/common-table-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ComponentLibraryModule,
  SvgControllerModule,
  OwlDateTimeDefaultModel,
} from '@txc-angular/component-library';
import {
  OwlDateTimeModule,
  OwlDateTimeIntl,
  OWL_DATE_TIME_FORMATS,
} from '@danielmoncada/angular-datetime-picker';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { SourcePipe } from '../pipes/source.pipe';
import { UtilityService } from '../services/utility.service';
import { BatchListStateService } from '../services/state/batch-list-state.service';
import { BatchListService } from '../services/data/batch-list.service';
import { BaseBatchListComponent } from './base-batch-list/base-batch-list.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'YYYY/MM/DD hh:mm a',
  datePickerInput: 'YYYY/MM/DD',
  timePickerInput: 'hh:mm a',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    StringSplitByCapitalLetterPipe,
    CommonTableFilterComponent,
    SourcePipe,
    BaseBatchListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Select2Module,
    SvgControllerModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbModule,
    ComponentLibraryModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonTableFilterComponent,
    StringSplitByCapitalLetterPipe,
    NgbModule,
    Select2Module,
    SvgControllerModule,
    ComponentLibraryModule,
    ReactiveFormsModule,
    SvgControllerModule,
    NgbDatepickerModule,
    FormsModule,
    NgbCollapseModule,
    SourcePipe,
    BaseBatchListComponent,
  ],
  providers: [
    BatchListService,
    BatchListStateService,
    UtilityService,
    DatePipe,
    SourcePipe,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    { provide: OwlDateTimeIntl, useClass: OwlDateTimeDefaultModel },
  ],
})
export class SharedModule {}
