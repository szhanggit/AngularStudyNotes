import { Injectable } from '@angular/core';
import { StateService } from '@txc-angular/component-library';
import {
  BATCH_LIST_STATE,
  BatchListItem,
  BatchListState,
  PaginatedBatchList,
} from '../../models/batch-list-state.model';
import { BatchListService } from '../data/batch-list.service';
import { EventStateService } from '../event-state.service';

@Injectable({
  providedIn: 'root',
})
export class BatchListStateService extends StateService<BatchListState> {
  paginatedBatchList$ = this.select((state) => state.paginatedBatchList);
  selectedItem$ = this.select((state) => state.selectedItem);
  searchResults$ = this.select((state) => state.searchResultDetails);
  merchantBySkuCode$ = this.select((state) => state.merchantBySkuCode);

  constructor(
    private batchListService: BatchListService,
    private eventStateService: EventStateService
  ) {
    super(BATCH_LIST_STATE);
  }

  setPaginatedBatchList(paginatedBatchList: PaginatedBatchList) {
    this.setState({ paginatedBatchList: paginatedBatchList });
  }

  getMerchantBySkuCode(skuCode: string) {
    this.batchListService.getMerchantBySkuCode(skuCode).subscribe({
      next: (res) => {
        this.setState({ merchantBySkuCode: res });
      },
      error: (error) => {
        this.eventStateService.commonErrorMessage = error.error.message;
      },
    });
  }
 
  // TODO: refactor to one method only if single endpoint will be used.
  getInventoryList() {
    this.batchListService.getInventoryList().subscribe((res) => {
      setTimeout(() => {
        this.setState({ paginatedBatchList: res });
      }, 3000);
    });
  }

  getVoucherOperationsList() {
    this.batchListService.getVoucherOperationsList().subscribe((res) => {
      setTimeout(() => {
        this.setState({ paginatedBatchList: res });
      }, 3000);
    });
  }

  getBatchViewList() {
    this.batchListService.getBatchViewList().subscribe((res) => {
      setTimeout(() => {
        this.setState({ paginatedBatchList: res });
      }, 3000);
    });
  }

  getBatchItemViewList() {
    this.batchListService.getBatchItemViewList().subscribe((res) => {
      setTimeout(() => {
        this.setState({ paginatedBatchList: res });
      }, 3000);
    });
  }

  setSelectedItem(item: BatchListItem) {
    this.setState({ selectedItem: item });
  }

  setSearchResultDetails(totalItems: number) {
    this.setState({ searchResultDetails: { total: totalItems } });
  }
}
