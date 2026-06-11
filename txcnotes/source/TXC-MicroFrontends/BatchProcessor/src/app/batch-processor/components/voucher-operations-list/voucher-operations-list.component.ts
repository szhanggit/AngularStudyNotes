import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import {
  BatchListItem,
  INITIAL_PAGINATED_BATCH_LIST_STATE,
} from '../../models/batch-list-state.model';
import { NO_RESULTS_MESSAGE } from '../../constants/table.const';
import { Subject, Subscription, filter } from 'rxjs';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { SearchEvent } from '../../models/search-filters.model';
import { UtilityService } from '../../services/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadBatchOperationsModalComponent } from './upload-batch-operations-modal/upload-batch-operations-modal.component';
import { EventStateService } from '../../services/event-state.service';
import { StatusEnum } from '../../enums/status.enum';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-voucher-operations-list',
  templateUrl: './voucher-operations-list.component.html',
  styleUrls: ['./voucher-operations-list.component.scss'],
})
export class VoucherOperationsListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  actionButtons = [
    {
      buttonText: 'Batch voucher operations',
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
    private utilityService: UtilityService,
    private modalService: NgbModal,
    private eventStateService: EventStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeVoucherListData();
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
        BatchDomainsEnum.VoucherOperations
      )
    );

    this.toastSubscriptions$.push(
      this.utilityService.listenToErrorMessage(this.toast)
    );
  }

  initializeVoucherListData() {
    this.batchListStateService.getVoucherOperationsList();
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
    this.modalService.open(UploadBatchOperationsModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  }
}
