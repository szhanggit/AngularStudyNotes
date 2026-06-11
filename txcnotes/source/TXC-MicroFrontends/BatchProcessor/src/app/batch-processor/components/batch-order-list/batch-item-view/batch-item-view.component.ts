import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableHeader } from '@txc-angular/component-library';
import { Subject } from 'rxjs';
import { STATUS_DISPLAY_PROPERTIES } from 'src/app/batch-processor/constants/status-display-properties.const';
import { BATCH_ITEM_VIEW_LIST_HEADERS, NO_RESULTS_MESSAGE } from 'src/app/batch-processor/constants/table.const';
import { BatchDomainsEnum } from 'src/app/batch-processor/enums/batch-domains.enum';
import { BatchListItem, INITIAL_PAGINATED_BATCH_LIST_STATE } from 'src/app/batch-processor/models/batch-list-state.model';
import { SearchEvent } from 'src/app/batch-processor/models/search-filters.model';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';

@Component({
  selector: 'app-batch-item-view',
  templateUrl: './batch-item-view.component.html',
  styleUrls: ['./batch-item-view.component.scss'],
})
export class BatchItemViewComponent implements OnInit, OnDestroy {
  tableData!: BatchListItem[];
  tableHeaders: TableHeader[] = BATCH_ITEM_VIEW_LIST_HEADERS;
  destroyed$ = new Subject<void>();

  statusProperties = STATUS_DISPLAY_PROPERTIES;
  total: number = 0;

  clonedTableData: BatchListItem[] = [];
  noResultsMessage = NO_RESULTS_MESSAGE;
  batchDomain = BatchDomainsEnum.OrderItemView;

  constructor(
    private batchListStateService: BatchListStateService,
    private utilityService: UtilityService,
    private eventStateService: EventStateService
  ) {}

  ngOnInit(): void {
    this.initializeBatchViewData();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.batchListStateService.setPaginatedBatchList(
      INITIAL_PAGINATED_BATCH_LIST_STATE
    );
  }

  initializeBatchViewData() {
    this.batchListStateService.getBatchItemViewList();
  }

  onSearchBatch(searchEvent: SearchEvent) {
    const filteredData = this.utilityService.filterCommonBatchTable(
      searchEvent.filters,
      searchEvent.data
    );
    this.batchListStateService.setSearchResultDetails(filteredData.length);
    setTimeout(() => {
      this.tableData = [...filteredData];
      this.total = this.tableData.length;
      this.eventStateService.batchListLoading = false;
    }, 2000);
  }
}
