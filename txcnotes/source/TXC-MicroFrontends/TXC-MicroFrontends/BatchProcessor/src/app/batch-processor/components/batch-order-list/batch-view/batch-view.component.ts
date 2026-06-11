import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { STATUS_DISPLAY_PROPERTIES } from 'src/app/batch-processor/constants/status-display-properties.const';
import { NO_RESULTS_MESSAGE } from 'src/app/batch-processor/constants/table.const';
import { BatchDomainsEnum } from 'src/app/batch-processor/enums/batch-domains.enum';
import {
  BatchListItem,
  INITIAL_PAGINATED_BATCH_LIST_STATE,
} from 'src/app/batch-processor/models/batch-list-state.model';
import { SearchEvent } from 'src/app/batch-processor/models/search-filters.model';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';

@Component({
  selector: 'app-batch-view',
  templateUrl: './batch-view.component.html',
  styleUrls: ['./batch-view.component.scss'],
})
export class BatchViewComponent implements OnInit, OnDestroy {
  @Output() selectedViewChange = new EventEmitter<string>();

  tableData!: BatchListItem[];
  destroyed$ = new Subject<void>();

  statusProperties = STATUS_DISPLAY_PROPERTIES;
  total: number = 0;

  clonedTableData: BatchListItem[] = [];
  noResultsMessage = NO_RESULTS_MESSAGE;
  batchDomain = BatchDomainsEnum.OrderList;

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
    this.batchListStateService.getBatchViewList();
  }

  handleSelectedViewChange(selectedView: string) {
    this.selectedViewChange.emit(selectedView);
  }
  
  onSearchBatch(searchEvent: SearchEvent) {
    const filteredData = this.utilityService.filterCommonBatchTable(
      searchEvent.filters,
      searchEvent.data
    );
    setTimeout(() => {
      this.tableData = [...filteredData];
      this.total = this.tableData.length;
      this.eventStateService.batchListLoading = false;
    }, 2000);
  }
}
