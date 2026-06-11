import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import {
  NgbDatepicker,
  NgbDate,
  NgbDateStruct,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AbstractControl, NgControl } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';
import { DateOutputValues } from '../../models/date-picker.model';

@Component({
  selector: 'lib-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent
  extends BaseControlComponent
  implements OnInit
{
  @ViewChild('rangeDp') rangeDp!: NgbDatepicker;
  @ViewChild('rangeDpInput') rangeDpInput!: ElementRef;
  @ViewChild('simpleDp') simpleDp!: NgbDatepicker;
  @ViewChild('simpleDpInput') simpleDpInput!: ElementRef;
  @Input() disabled: boolean = false;
  @Input() type!: 'simple' | 'range';
  @Input() displayMonths: number = 1;
  @Input() clearValues!: boolean;
  @Input() disablePastDates: boolean = false;
  @Input() fieldName: string = '';
  @Input() placeholder: string = '';
  @Input() showFooter: boolean = false;
  @Input() writeFullObject: boolean = true;
  @Output() datePickerValues = new EventEmitter<DateOutputValues>();
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();

  selectedDate: string = '';
  selectedDateRange: string = '';
  hoveredDate: NgbDate | null = null;
  simpleDatePlaceholder = 'YYYY/MM/DD';
  rangeDatePlaceholder = 'YYYY/MM/DD - YYYY/MM/DD';

  hasFooter: boolean = false;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  destroyed$ = new Subject<boolean>();
  invalidInput: boolean = false;

  //for reactive form control
  disabledFormControl!: boolean;
  override value: any;

  tooltipMessage: string = '';
  controlName: string = '';

  REQUIRED_MESSAGE = 'This is a required field';
  INVALID_FORMAT_MESSAGE = 'Invalid date format';

  rangeDpRegex =
    /^(\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01]))\s*-\s*(\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01]))$/;

  simpleDpRegex =
    /^(?:(?:19|20|29)\d{2})\/(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12][0-9]|3[01])$/;

  get minDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: this.disablePastDates ? today.getFullYear() : 1970,
      month: this.disablePastDates ? today.getMonth() + 1 : 1,
      day: this.disablePastDates ? today.getDate() : 1,
    };
  }

  constructor(@Self() public controlDir: NgControl) {
    super();
    controlDir!.valueAccessor = this;
  }

  ngOnInit(): void {
    this.initializeDatepickerValues();
    this.addDateFormatValidator();
    if (this.placeholder) {
      this.simpleDatePlaceholder = this.placeholder;
      this.rangeDatePlaceholder = this.placeholder;
      this.hasFooter = this.showFooter;
    }
    this.hasFooter = this.showFooter;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnChanges() {
    this.initializeDatepickerValues();
    if (this.clearValues) {
      this.resetDatePickerValues();
    }
  }

  private initializeDatepickerValues() {
    const date =
      this.controlDir.control?.value?.selectedDateRange ||
      this.controlDir.control?.value?.simpleDate ||
      this.controlDir.control?.value;
    if (date) {
      this.writeFormattedDate(date);
    }
  }

  private writeFormattedDate(date: string) {
    let formattedDate = '';

    if (this.type === 'range') {
      const fromDate = date.split('-')[0].trim();
      const toDate = date.split('-')[1].trim();

      const formattedFromDate = this.addLeadingZeroes(fromDate);
      const formattedToDate = this.addLeadingZeroes(toDate);
      formattedDate = `${formattedFromDate} - ${formattedToDate}`;
    } else {
      formattedDate = this.addLeadingZeroes(date);
    }

    this.writeValue(formattedDate);
  }

  private addLeadingZeroes(date: string) {
    const [year, month, day] = date?.split('/');
    const formattedMonth = month.length === 1 ? `0${month}` : month;
    const formattedDay = day.length === 1 ? `0${day}` : day;

    return `${year}/${formattedMonth}/${formattedDay}`;
  }

  private addDateFormatValidator() {
    const control = this.controlDir.control;
    const validators = control?.validator
      ? [control.validator, this.dateFormatValidator()]
      : [];
    control?.setValidators(validators);
  }

  private dateFormatValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value =
        control.value?.selectedDateRange ||
        control.value?.selectedDate ||
        control.value;

      const invalidDate = { invalidDate: 'Invalid date format' };

      if (this.type === 'range') {
        if (
          (!this.rangeDpRegex.test(value) || this.isInvalidDateRange(value)) &&
          (value || value === undefined)
        ) {
          return invalidDate;
        }
      } else {
        if (!this.simpleDpRegex.test(value) || this.isPastDate(value)) {
          return invalidDate;
        }
      }

      return null;
    };
  }

  private getDateEmitOutput(date: NgbDate) {
    let dateOutputValues!: DateOutputValues;
    switch (this.type) {
      case 'simple':
        return this.getDateOutputValues(date);
      case 'range':
        return this.getRangeOutput(date, dateOutputValues);
      default:
        return;
    }
  }

  private getRangeOutput(
    date: NgbDate,
    dateOutputValues: DateOutputValues
  ): DateOutputValues {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate) {
      this.toDate = date;
      dateOutputValues = this.getDateOutputValues(this.fromDate, this.toDate);
      this.selectedDateRange = dateOutputValues.selectedDateRange!;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    return dateOutputValues;
  }

  private getDateString(date: NgbDate | null, delimiter: string = '-') {
    return `${date?.year}${delimiter}${(date?.month || '')
      .toString()
      .padStart(2, '0')}${delimiter}${(date?.day || '')
      .toString()
      .padStart(2, '0')}`;
  }

  private getDateOutputValues(
    fromOrSimpleDate: NgbDate,
    toDate: NgbDate | null = null
  ): DateOutputValues {
    return this.type == 'range'
      ? {
          selectedDateRange: `${this.getDateString(
            fromOrSimpleDate,
            '/'
          )} - ${this.getDateString(toDate, '/')}`,
          fromDate: this.formatDateToUTC(this.getDateString(fromOrSimpleDate)),
          toDate: this.formatDateToUTC(this.getDateString(toDate)),
          ngbFromDate: fromOrSimpleDate,
          ngbToDate: toDate,
        }
      : {
          simpleDate: this.getDateString(fromOrSimpleDate, '/'),
          ngbSimpleDate: fromOrSimpleDate,
        };
  }

  private formatDateToUTC(date: string) {
    return new Date(date).toISOString();
  }

  private convertToNgbDate(date: Date): NgbDate {
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  private extractedDateValuesFromString(value: string) {
    const dateStr = value.split('-');
    const fromDate = dateStr[0];
    const toDate = dateStr[1];

    return {
      selectedDateRange: value,
      simpleDate: value,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      ngbFromDate: this.convertToNgbDate(new Date(fromDate)),
      ngbToDate: this.convertToNgbDate(new Date(toDate)),
      ngbSimpleDate: this.convertToNgbDate(new Date(fromDate)),
    };
  }

  private resetDatePickerValues() {
    this.fromDate = null;
    this.toDate = null;
    this.datePickerValues.emit({
      fromDate: '',
      toDate: '',
      ngbFromDate: this.fromDate,
      ngbToDate: this.toDate,
      selectedDateRange: '',
      simpleDate: '',
    });
    this.rangeDp.writeValue(null);
    this.writeValue(null);
  }

  /**
   * Implemented from BaseControlComponent
   * @param value
   */
  writeValue(valueParam: any): void {
    let value = valueParam;
    if (typeof value === 'string') {
      value = this.extractedDateValuesFromString(value);
      if (this.type === 'range') {
        this.selectedDateRange = valueParam;
      } else {
        this.selectedDate = valueParam;
      }
    }
    if (value?.ngbFromDate && value?.ngbToDate) {
      this.fromDate = value.ngbFromDate;
      this.toDate = value.ngbToDate;
    }
    this.value = value;
    if (this.controlDir?.control?.value !== value) {
      this.controlDir?.control?.setValue(value);
    }
  }

  onInputClicked() {
    setTimeout(() => {
      if (this.type === 'range') {
        this.rangeDpInput.nativeElement.focus();
      } else {
        this.simpleDpInput.nativeElement.focus();
      }
    });
  }

  toggleTooltipWithContext(tip: NgbTooltip) {
    if (tip.isOpen()) {
      tip.close();
    } else {
      if (
        this.controlDir?.control?.invalid &&
        this.controlDir.control?.errors?.['required']
      ) {
        this.tooltipMessage = this.REQUIRED_MESSAGE;
      }

      tip.open();
    }
  }

  onDateSelection(date: NgbDate) {
    this.controlDir?.control?.markAsDirty();
    const emitValue = this.getDateEmitOutput(date);
    this.datePickerValues?.emit(emitValue);
    this.writeValue(
      this.writeFullObject
        ? emitValue
        : this.type === 'range'
        ? emitValue?.selectedDateRange
        : emitValue?.simpleDate
    );

    if (emitValue) {
      this.invalidInput = false;
    }
  }

  onRangeDatePickerInputChange(event: any) {
    const dpRangeInput = event.srcElement?.value;

    let invalidFormat = true;
    let invalidDateRange = true;

    invalidFormat = !this.rangeDpRegex.test(dpRangeInput);

    if (!invalidFormat && dpRangeInput) {
      invalidDateRange = this.isInvalidDateRange(dpRangeInput);

      if (!invalidDateRange) {
        const emitValue: DateOutputValues = {
          selectedDateRange: dpRangeInput,
          fromDate: this.formatDateToUTC(this.getDateString(this.fromDate)),
          toDate: this.formatDateToUTC(this.getDateString(this.toDate)),
          ngbFromDate: this.fromDate,
          ngbToDate: this.toDate,
        };
        this.datePickerValues.emit(emitValue);
        this.writeValue(
          this.writeFullObject ? emitValue : emitValue?.selectedDateRange
        );
      }
    }

    this.invalidInput =
      (invalidFormat || invalidDateRange) && dpRangeInput !== '';
    this.tooltipMessage = this.invalidInput ? this.INVALID_FORMAT_MESSAGE : '';
  }

  onSimpleDatePickerInputChange(event: any) {
    const dpInput = event.srcElement?.value;
    let invalidFormat = !this.simpleDpRegex.test(dpInput);
    const invalidInput = invalidFormat && dpInput !== '';

    if (!invalidInput) {
      const emitValue: DateOutputValues = {
        simpleDate: dpInput,
        ngbSimpleDate: this.convertToNgbDate(new Date(dpInput)),
      };

      this.datePickerValues.emit(emitValue);
      this.writeValue(this.writeFullObject ? emitValue : emitValue?.simpleDate);
    }

    this.invalidInput = invalidInput;
    // this.tooltipMessage = this.invalidInput ? this.INVALID_FORMAT_MESSAGE : '';
  }

  isInvalidDateRange(dpRangeInput: any) {
    const extractDates = dpRangeInput.match(this.rangeDpRegex);
    const fromDate = new Date(extractDates[1]);
    const toDate = new Date(extractDates[4]);
    this.fromDate = this.convertToNgbDate(fromDate);
    this.toDate = this.convertToNgbDate(toDate);

    return fromDate > toDate || this.isPastDate(fromDate);
  }

  isPastDate(dateParam: Date | string) {
    let date = dateParam;
    if (typeof date === 'string') {
      date = new Date(dateParam);
    }
    const currentDate = new Date();
    const dateString = this.getDateString(this.convertToNgbDate(date as Date));
    const currentDateString = this.getDateString(
      this.convertToNgbDate(currentDate)
    );

    return (
      date < currentDate &&
      this.disablePastDates &&
      dateString !== currentDateString
    );
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  setNoExpiry() {
    const noExpiry: NgbDateStruct = {
      year: 2999,
      month: 12,
      day: 31,
    };
    this.writeFormattedDate('2999/12/31 - 2999/12/31');
  }
}
