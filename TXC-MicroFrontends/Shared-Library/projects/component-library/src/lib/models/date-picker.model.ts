import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface DateOutputValues {
  selectedDateRange?: string;
  fromDate?: string;
  toDate?: string;
  ngbFromDate?: NgbDate | null;
  ngbToDate?: NgbDate | null;
  ngbSimpleDate?: NgbDate | null;
  simpleDate?: string;
}
