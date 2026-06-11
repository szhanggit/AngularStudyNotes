import { formatDate } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MerchantGroupSharedService } from '../../services/merchant-group-shared.service';

@Component({
	selector: 'date-picker',
	templateUrl: './date-picker.component.html',
	styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

	@Input() id: string = 'date-picker';
	@Input() placeholder: string = 'YYYY/MM/DD ~ YYYY/MM/DD';

	@Input()
	set selectedDate(date: string) {
		this._selectedDate = date;
	}
	get selectedDate() { return this._selectedDate; }

	@Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

	// Two way binding
	_selectedDate: string = '';

	hoveredDate: NgbDate | null = null;
	today: NgbDate = this.ngbCalendar.getToday();
	fromDate!: NgbDate;
	toDate: NgbDate | null = null;
	minDate: NgbDateStruct = { year: this.today.year, month: this.today.month, day: this.today.day };

	constructor(
		private ngbCalendar: NgbCalendar,
		private merchantGroupSharedService: MerchantGroupSharedService,
	) { }

	ngOnInit(): void {
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
		if (this.fromDate && this.toDate) {
			this._selectedDate = `${this.dateFormatUI(this.fromDate)} ~ ${this.dateFormatUI(this.toDate)}`;
			this.valueChange.next(this._selectedDate);
		}
	}

	dateFormatUI(date: NgbDate | null, delimiter = '/'): string {
		const displayDate = date ? date.year + delimiter + date.month + delimiter + date.day : '';
		return displayDate;
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

	onDateBlur() {
		this.valueChange.next(this._selectedDate);
	}
}
