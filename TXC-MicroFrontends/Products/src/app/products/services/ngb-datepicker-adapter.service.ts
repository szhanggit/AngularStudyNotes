import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDatepickerAdapterService extends NgbDateParserFormatter {

  readonly DIGITS_INFO_MM = '2.0';
  readonly DIGITS_INFO_DD = '2.0';
  readonly FORMAT_LOCALE = 'en-US';
  readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				month: parseInt(date[0], 10),
				day: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date 
      ? formatNumber(date.month, this.FORMAT_LOCALE, this.DIGITS_INFO_MM) + this.DELIMITER 
      + formatNumber(date.day, this.FORMAT_LOCALE, this.DIGITS_INFO_DD)  + this.DELIMITER 
      + date.year  
      : '';
	}
}
