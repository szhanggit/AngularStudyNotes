import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { DatePickerType } from 'src/app/order/enums/date-picker-type.enum';
import { DateOutputValues } from 'src/app/order/models/date-output-values.model';
import { OrderService } from 'src/app/order/services/order.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit, OnDestroy {
  @ViewChild('rangeDp') rangeDp!: NgbDatepicker;

  @Input() disabled!: boolean;
  @Input() type!: DatePickerType;
  @Input() isUTC: boolean = false;
  @Input() parentClass: string = '';
  @Output() datePickerValues = new EventEmitter<DateOutputValues>();
  @Output() deleteDatesByKeyboard = new EventEmitter<void>();

  selectedDateRange: string = '';
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  datePickerType = DatePickerType;
  destroyed$ = new Subject<boolean>();
  isDateRangeInvalid: boolean = false;

  constructor(private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.clearDatePickerOnCheck();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  clearDatePickerOnCheck() {
    this.orderSvc.isClearDatePicker$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isCleared) => {
        if (isCleared) {
          this.onDatePickerReset();
        }
      });
  }

  onDateSelection(date: NgbDate) {
    this.datePickerValues.emit(this.getDateEmitOutput(date));
    if(this.isDateRangeInvalid) this.isDateRangeInvalid = false;
  }

  private getDateEmitOutput(date: NgbDate) {
    let dateOutputValues!: DateOutputValues;
    switch (this.type) {
      case DatePickerType.SIMPLE:
        return this.getDateOutputValues(date);
      case DatePickerType.RANGE:
        return this.getRangeOutput(date, dateOutputValues);
    }
  }

  private getRangeOutput(date: NgbDate, dateOutputValues: DateOutputValues) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
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
    return `${date?.year}${delimiter}${(date?.month || '').toString().padStart(2, '0')}${delimiter}${(date?.day || '').toString().padStart(2, '0')}`;
  }

  private getDateOutputValues(
    fromOrSimpleDate: NgbDate,
    toDate: NgbDate | null = null
  ): DateOutputValues {
    return this.type == this.datePickerType.RANGE
      ? {
          selectedDateRange: `${this.getDateString(
            fromOrSimpleDate,
            '/'
          )} - ${this.getDateString(toDate, '/')}`,
          fromDate: this.formatDateToUTC(this.getDateString(fromOrSimpleDate)),
          toDate: this.formatDateToUTC(this.getDateString(toDate)),
        }
      : { simpleDate: this.getDateString(fromOrSimpleDate) };
  }

  private formatDateToUTC(date: string) {
    return new Date(date).toISOString();
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

  convertToNgbDate(dateString: string): NgbDate {
    const dateParts = dateString.split('/');
  
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);
  
    return new NgbDate(year, month, day);
  }

  onDatePickerReset() {
    this.selectedDateRange = '';
    this.fromDate = null;
    this.toDate = null;
    this.rangeDp.writeValue(null);
  }

  onDeleteValues() {
    this.deleteDatesByKeyboard.emit();
    this.isDateRangeInvalid = false;
    this.onDatePickerReset();
  }
  
  onDatePickerInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value !== '' ? input.value.trim().replace(/\s+/g, '') : '';
    const regex = /^\d{4}\/\d{2}\/\d{2}-\d{4}\/\d{2}\/\d{2}$/;
    if(value !== '') {
      if (!regex.test(value)) {
        this.selectedDateRange = '';
        this.isDateRangeInvalid = true;
        // this one will be triggered when user clicks on datepicker input and press backspace
        if(event.inputType === 'deleteContentBackward') {
          this.onDeleteValues();
        }
        return;
      } else {
        const parts = value.split('-');
        const from = this.convertToNgbDate(parts[0].trim());
        const to = this.convertToNgbDate(parts[1].trim());
  
        this.selectedDateRange = value;
        this.isDateRangeInvalid = false;
  
        if(from && to) {
          if(to.after(from)) {
            this.onDateSelection(from);
            this.onDateSelection(to);
            this.fromDate = from;
            this.toDate = to;
          } else {
            this.isDateRangeInvalid = true;
          }
        }

      }
    } else {
      // this one will be triggeres when user click ctrl+a+backspace
      if(event.inputType === 'deleteContentBackward') {
        this.onDeleteValues();
      }
    }   
  }
}
