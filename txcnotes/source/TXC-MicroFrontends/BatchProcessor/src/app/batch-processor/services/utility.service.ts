import { Injectable } from '@angular/core';
import { SearchFilters } from '../models/search-filters.model';
import { BatchListItem, ErrorDetails } from '../models/batch-list-state.model';
import {
  EMPTY_COMMON_FILTER,
  EMPTY_ITEM_VIEW_FILTER,
} from '../constants/table.const';
import { DatePipe } from '@angular/common';
import {
  ErrorMessage,
  NgbdToastGlobal,
  TxcDateTimeService,
} from '@txc-angular/component-library';
import { StatusEnum } from '../enums/status.enum';
import { EventStateService } from './event-state.service';
import { BatchDomainsEnum } from '../enums/batch-domains.enum';
import { SearchByEnum } from '../enums/search-by.enum';
import { TableActionEnum } from '../enums/table-action.enum';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  exactSearch: SearchByEnum[] = [
    SearchByEnum.SkuCode,
    SearchByEnum.BatchNumber,
    SearchByEnum.QuotationNumber,
    SearchByEnum.ClientOrderNumber,
  ];

  get selectedTenant() {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      return JSON.parse(tenantFromLocalStorage).name;
    }

    return '';
  }

  constructor(
    private datePipe: DatePipe,
    private eventStateService: EventStateService,
    private txcDateTimeService: TxcDateTimeService
  ) {}

  // TODO: update logic on API integration
  filterCommonBatchTable(filters: SearchFilters, tableData: BatchListItem[]) {
    const isExactSearch =
      filters.searchBy && this.exactSearch.includes(filters.searchBy);
    const searchInput = filters.searchInput?.toLowerCase().trim();
    let transformedEndDate = new Date();
    if (filters.createdOn) {
      const endDate = new Date(filters.createdOn?.endDate);
      transformedEndDate = new Date(endDate.setHours(23, 59, 59, 0));
    } else {
      filters.createdOn = { startDate: '', endDate: '' };
    }

    const isFilterEmpty =
      JSON.stringify(filters) === JSON.stringify(EMPTY_COMMON_FILTER) ||
      JSON.stringify(filters) === JSON.stringify(EMPTY_ITEM_VIEW_FILTER);
    if (isFilterEmpty) {
      return [...tableData];
    }

    return tableData.filter((item) => {
      const matchSearch = isExactSearch
        ? item[filters.searchBy!]?.toString().toLowerCase() === searchInput
        : filters.searchBy && !isExactSearch
        ? item[filters.searchBy!]
            ?.toString()
            .toLowerCase()
            .includes(searchInput ?? '')
        : !searchInput ||
          item.batchNumber.toString().includes(searchInput) ||
          item.fileName?.toLowerCase().includes(searchInput);

      const matchStatus =
        !filters.batchStatus || item.status === filters.batchStatus;
      const matchErrorReason =
        !filters.errorReason ||
        item.errorSummary?.includes(filters.errorReason) ||
        filters.errorReason === 'All';
      const matchSource = !filters.source || item.source === filters.source;
      const matchCreatedOn =
        !(filters.createdOn?.startDate && filters.createdOn?.endDate) ||
        (new Date(item.createdOn) >= new Date(filters.createdOn.startDate) &&
          new Date(item.createdOn) <= transformedEndDate);

      return (
        matchSearch &&
        matchStatus &&
        matchErrorReason &&
        matchSource &&
        matchCreatedOn
      );
    });
  }

  transformedTableData(tableData: BatchListItem[], isBatchItemView = false) {
    return [
      ...tableData.map((data) => {
        const errorSummary = data.errorSummary ?? data.errorReason?.summary!;
        const tooltipLabel = `Start: ${this.transformedDates(
          data.startTime
        )} End: ${this.transformedDates(data.endTime)}`;

        const transformedData = {
          ...data,
          errorSummary: [this.getErrorSummary(errorSummary)],
          createdOn: this.transformedDates(data.createdOn),
          tooltipLabel: tooltipLabel,
        };

        if (
          !isBatchItemView &&
          (data.status === StatusEnum.Failed ||
            data.status === StatusEnum.InitialzingError)
        ) {
          return {
            ...transformedData,
            linkConfig: {
              isLink: true,
              eventName: TableActionEnum.SelectBatch,
            },
          };
        }

        return transformedData;
      }),
    ];
  }

  getErrorSummary(data: string[]) {
    return data
      ?.map((summary) => summary)
      .toString()
      .replace(/,/g, ',\n');
  }

  transformedDates(date: string) {
    return this.datePipe.transform(date, 'yyyy/MM/dd h:mm:ss a')!;
  }

  transformErrors(initialErrors: ErrorDetails[]): ErrorMessage[] {
    return initialErrors.map((error) => {
      const rowNumbers = error.rowNumber
        .map((num, index) => `${index === 0 ? 'Row' : 'row'} ${num}`)
        .join(', ');

      return {
        type: error.errorMessage,
        description: rowNumbers,
      };
    });
  }

  listenToErrorMessage(toast: NgbdToastGlobal) {
    return this.eventStateService.commonErrorMessage$.subscribe((error) => {
      toast.showDanger(`Something went wrong. ${error}`);
    });
  }

  listenToUploadSuccess(toast: NgbdToastGlobal, batchDomain: BatchDomainsEnum) {
    return this.eventStateService.isUploadSuccess$.subscribe((res) => {
      if (res.isSuccess) {
        toast.showSuccess(this.getUploadSuccessMessage(batchDomain));
        return;
      }
      toast.showDanger(`Failed to upload the file. ${res.errorMessage}`);
    });
  }

  unsubscribeToastSubscriptions(subs: Subscription[]) {
    if (subs.length) {
      subs.forEach((sub) => sub.unsubscribe());
    }
  }

  getUploadSuccessMessage(batchDomain: BatchDomainsEnum) {
    switch (batchDomain) {
      case BatchDomainsEnum.VoucherOperations:
        return 'You’ve successfully uploaded batch voucher operations.';
      case BatchDomainsEnum.InventoryList:
        return 'You’ve successfully imported voucher number.';
      case BatchDomainsEnum.OrderList:
        return 'You’ve successfully uploaded batch order.';
      default:
        return '';
    }
  }

  getLocalDateTime(date: Date) {
    if (date) {
      const localDate = this.txcDateTimeService.getLocalDateTime(
        new Date(date).toUTCString()
      );
      return new Date(localDate).toISOString();
    }
    return null;
  }
}
