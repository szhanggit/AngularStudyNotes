import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NO_RESULTS_MESSAGE } from '../../constants/table.const';
import {
  BatchListItem,
  INITIAL_PAGINATED_BATCH_LIST_STATE,
} from '../../models/batch-list-state.model';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { Subject, Subscription, filter } from 'rxjs';
import { SearchEvent } from '../../models/search-filters.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ImportVoucherNumberModalComponent } from './import-voucher-number-modal/import-voucher-number-modal.component';
import { UtilityService } from '../../services/utility.service';
import { EventStateService } from '../../services/event-state.service';
import { StatusEnum } from '../../enums/status.enum';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  actionButtons = [
    {
      buttonText: 'Import voucher number',
      buttonClass: 'btn-primary',
      buttonAction: () => this.openModalWindow(),
    },
  ];
  destroyed$ = new Subject<void>();
  selectedView: string = '';
  tableData!: BatchListItem[];
  total: number = 0;
  statuses = StatusEnum;

  clonedTableData: BatchListItem[] = [];
  noResultsMessage = NO_RESULTS_MESSAGE;
  toastSubscriptions$: Subscription[] = [];

  constructor(
    private batchListStateService: BatchListStateService,
    private modalService: NgbModal,
    private utilityService: UtilityService,
    private eventStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeInventoryListData();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.selectedView = '';
      });
  }

  ngAfterViewInit(): void {
    this.initializeToastSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.batchListStateService.setPaginatedBatchList(
      INITIAL_PAGINATED_BATCH_LIST_STATE
    );

    this.utilityService.unsubscribeToastSubscriptions(this.toastSubscriptions$);
  }

  initializeToastSubscriptions() {
    this.toastSubscriptions$.push(
      this.utilityService.listenToUploadSuccess(
        this.toast,
        BatchDomainsEnum.InventoryList
      )
    );

    this.toastSubscriptions$.push(
      this.utilityService.listenToErrorMessage(this.toast)
    );
  }

  initializeInventoryListData() {
    this.batchListStateService.getInventoryList();
  }

  handleSelectedViewChange(selectedView: string) {
    this.selectedView = selectedView;
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

  openModalWindow() {
    this.modalService.open(ImportVoucherNumberModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  }
}
