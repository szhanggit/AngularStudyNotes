import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbCalendar,NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss']
})
export class DatePickerRangeComponent implements OnInit {

  @Input() delimiter: string = '/';
  @Input() fromDate!: NgbDate | undefined;
  @Input() toDate!: NgbDate | undefined;
  @Input() totalCalendarDisplay: number = 2;
  @Output() onDateChange:EventEmitter<any>= new EventEmitter();
  @ViewChild('datepicker') datepicker!: NgbInputDatepicker;
  @Input() set startDate(date: string) {
     this._startDate = date; }
  @Input() set endDate(date: string) {
      this._endDate = date; }
  @Input() set period(date: any) {
       this._period = date; }
  hoveredDate: NgbDate | null = null;

  today!: NgbDate;  
  _startDate: string = '';
  _endDate: string = '';
  _period: any;
  constructor(calendar: NgbCalendar,) {
    this.today = new NgbDate(calendar.getToday().year, calendar.getToday().month, calendar.getToday().day);   
   }

  ngOnInit(): void {
    if(this.totalCalendarDisplay==1)
    {
    if(this._startDate != null && this._startDate != "")
    {
       const currentSelectedDate=new Date(this._startDate);
       this.fromDate =new NgbDate((currentSelectedDate).getFullYear(), (currentSelectedDate).getMonth() + 1, (currentSelectedDate).getDate());
       if(this.fromDate < this.today)
       {
        this.fromDate = this.today;
       }
      }
    if(this._endDate != null && this._endDate != "")
    {
       const currentSelectedEndDate=new Date(this._endDate);
      
       this.fromDate =new NgbDate((currentSelectedEndDate).getFullYear(), (currentSelectedEndDate).getMonth() + 1, (currentSelectedEndDate).getDate());
    }
  }
  }

  open(): void{ 
    let dateRange = this._period.split("~"); 
    if (dateRange.length == 2) {      
      let startDate: Date = new Date(dateRange[0].trimEnd().trimStart());
      let endDate: Date = new Date(dateRange[1].trimEnd().trimStart());
      this.fromDate = new NgbDate(startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate());      
      this.toDate = new NgbDate(endDate.getFullYear(),endDate.getMonth()+1,endDate.getDate());
      this.datepicker.startDate = new NgbDate(startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate());          
    }
    this.datepicker.open();
  }

  onDateSelection(date: NgbDate) {
    if(this.totalCalendarDisplay==2)
    {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    }  else if (this.fromDate && this.toDate && date.equals(this.fromDate)) {
			this.toDate = date;
		}else {
      this.toDate = undefined;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.onDateChange.emit({
        dateText : this.toModel(this.fromDate) + ' ~ ' + this.toModel(this.toDate),
        fromDate : this.fromDate,
        toDate : this.toDate
      });
    }
  }
  else
  {
    if(date)
      {
      this.onDateChange.emit({
        dateText : this.toModel(date),
        toDate : date,
        fromDate : null
      });
      }
  }
  }

  toModel(date: NgbDate | null): string | null {
    return date ? date.year + this.delimiter + date.month + this.delimiter + date.day : null;
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
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

}
