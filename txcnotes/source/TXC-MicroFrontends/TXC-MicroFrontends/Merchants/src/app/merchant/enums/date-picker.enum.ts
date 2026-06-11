import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export enum DatePickerType {
  RANGE = 'range',
  SIMPLE = 'simple',
}

export interface DateOutputValues {
  selectedDateRange?: string;
  fromDate?: string;
  toDate?: string;
  ngbFromDate?: NgbDate | null;
  ngbToDate?: NgbDate | null;
  ngbSimpleDate?: NgbDate | null;
  simpleDate?: string;
}
