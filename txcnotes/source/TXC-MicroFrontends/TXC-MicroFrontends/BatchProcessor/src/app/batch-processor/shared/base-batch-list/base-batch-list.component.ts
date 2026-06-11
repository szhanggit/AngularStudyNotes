import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import {
  ActionEvent,
  TableHeader,
  TableModel,
} from '@txc-angular/component-library';
import { BatchListItem } from '../../models/batch-list-state.model';
import { SearchEvent, SearchFilters } from '../../models/search-filters.model';
import { Subject, takeUntil } from 'rxjs';
import { StatusEnum } from '../../enums/status.enum';
import { STATUS_DISPLAY_PROPERTIES } from '../../constants/status-display-properties.const';
import {
  BATCH_LIST_HEADERS,
  NO_RESULTS_MESSAGE,
} from '../../constants/table.const';
import { EventStateService } from '../../services/event-state.service';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { TableActionEnum } from '../../enums/table-action.enum';

@Component({
  selector: 'app-base-batch-list',
  templateUrl: './base-batch-list.component.html',
  styleUrls: ['./base-batch-list.component.scss'],
})
export class BaseBatchListComponent implements OnInit, OnDestroy {
  @Output() selectedViewChange = new EventEmitter<string>();
  @Output() searchEvent = new EventEmitter<SearchEvent>();

  @Input() tableHeaders: TableHeader[] = BATCH_LIST_HEADERS;
  @Input() tableData: BatchListItem[] = [];
  @Input() statuses = StatusEnum;
  @Input() statusProperties = STATUS_DISPLAY_PROPERTIES;
  @Input() noResultsMessage = NO_RESULTS_MESSAGE;
  @Input() batchDomain!: BatchDomainsEnum;

  // pagination props
  @Input() total: number = 0;
  pageSize: number = 0;
  page: number = 0;

  clonedTableData: BatchListItem[] = [];
  destroyed$ = new Subject<void>();

  get tableModel(): TableModel {
    return {
      tableHeaders: this.tableHeaders,
      tableData: this.tableData,
    };
  }

  constructor(
    public batchListStateService: BatchListStateService,
    public eventStateService: EventStateService,
  ) {}

  ngOnInit(): void {
    this.initializePaginatedBatchList();
    this.resetView();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initializePaginatedBatchList() {
    this.batchListStateService.paginatedBatchList$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((paginatedList) => {
        const pagination = paginatedList.pagination;

        this.clonedTableData = [...paginatedList.data];
        this.tableData = [...paginatedList.data];

        this.total = pagination.total;
        this.page = pagination.currentPage;
        this.pageSize = pagination.pageSize;
        this.eventStateService.batchListLoading =
          pagination.total <= 0 ? true : false;
      });
  }

  resetView(): void {
    this.selectedViewChange.emit('');
  }

  onActionEvent(event: ActionEvent) {
    switch (event.eventName) {
      case TableActionEnum.SelectBatch:
        if (event.rowData && event.rowData.status) {
          this.batchListStateService.setSelectedItem(event.rowData);
          this.selectedViewChange.emit(event.rowData.status);
        } else {
          this.resetView();
        }
        break;

      default:
        this.resetView();
        break;
    }
  }

  onSearchBatch(event: SearchFilters) {
    this.eventStateService.batchListLoading = true;
    this.tableData = [];
    const searchEvent: SearchEvent = {
      filters: event,
      data: this.clonedTableData,
    };
    this.searchEvent.emit(searchEvent);
  }
}
