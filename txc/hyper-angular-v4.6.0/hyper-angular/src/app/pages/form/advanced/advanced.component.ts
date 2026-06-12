import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbTimeStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

// data
import { COUNTRIES, STATES } from './data';

@Component({
  selector: 'app-forms-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.scss']
})
export class AdvancedComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  // select2 config
  countries: Select2Data = [];

  // date picker config
  model!: NgbDateStruct;
  selectedDateRange: string = '';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  hidden: boolean = true;

  // timepicker config
  time!: NgbTimeStruct;
  show: boolean = true;
  meridian: boolean = true;
  spinners = true;
  customTime: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
  ctrl = new FormControl('', (control: any) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return { tooEarly: true };
    }
    if (value.hour > 13) {
      return { tooLate: true };
    }

    return null;
  });

  // typehead config
  statesList: string[] = [];
  typeaheadModel: any;
  formatter = (result: string) => result.toUpperCase();

  focus$ = new Subject<string>();
  click$ = new Subject<string>();



  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;

  constructor (private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Forms', path: '/' }, { label: 'Form Advanced', path: '/', active: true }];
    this._fetchData();
    this.time = { hour: 13, minute: 30, second: 10 };
  }


  /**
   * fetches country list
   */
  _fetchData(): void {
    this.countries = COUNTRIES;
    this.statesList = STATES;
  }

  /**
   * selects date range
   * @param date date
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.selectedDateRange = this.fromDate.month + '/' + this.fromDate.day + '/' + this.fromDate.year;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.selectedDateRange = this.fromDate.month + '/' + this.fromDate.day + '/' + this.fromDate.year + '-' + this.toDate.month + '/' + this.toDate.day + '/' + this.toDate.year
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.selectedDateRange = "";
    }
  }

  /**
   * returns true/false based on whether date is hovered or not
   * @param date date
   */
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  /**
   * returns true if date is inside selected range
   * @param date date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * returns true if date is in range
   * @param date date
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  /**
   * toggles meridian
   */
  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  /**
   * toggles spinner visibility
   */
  toggleSpinners() {
    this.spinners = !this.spinners;
  }

  /**
   * search function of typeahead 1
   */
  search1: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.statesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  /**
   * search function of typeahead 2
   */
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.statesList
        : this.statesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
}
