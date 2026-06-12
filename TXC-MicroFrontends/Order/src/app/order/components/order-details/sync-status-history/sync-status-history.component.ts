import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryStatusService } from 'src/app/order/services/delivery-status.service';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import {
  TableHeader,
  TableModel,
  TableRow,
} from 'src/app/shared/models/dumb-models/table.model';
import { Subject, takeUntil } from 'rxjs';
import { BaseResponse, NgbdToastGlobal } from '@txc-angular/component-library';
import { SyncStatusHistory } from 'src/app/order/models/sync-status-history.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sync-status-history',
  templateUrl: './sync-status-history.component.html',
  styleUrls: ['./sync-status-history.component.scss'],
})
export class SyncStatusHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  templateType: number = TemplateTypeEnum.SMS;
  orderId!: number;
  voucherIds!: string[];
  destroy$ = new Subject();
  showScrollInsideTable = false;

  tableHeaders: TableHeader[] = [
    {
      headerId: 'actionTime',
      headerName: 'Action Time',
    },
    {
      headerId: 'actionType',
      headerName: 'Action Type',
    },
    {
      headerId: 'actionResult',
      headerName: 'Action Result',
    },
    {
      headerId: 'operatorHeader',
      headerName: 'Operator',
    },
  ];
  tableRows: TableRow[] = [];

  get syncTableModel(): TableModel {
    return {
      tableHeaders: this.tableHeaders,
      tableRows: this.tableRows,
    };
  }

  get eventType() {
    return this.templateType === TemplateTypeEnum.SMS ? 'SMS' : 'Email';
  }
  constructor(
    public activeModal: NgbActiveModal,
    private deliveryStatusService: DeliveryStatusService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.syncStatus();
    this.fetchOrderStatusHistory();
  }

  syncStatus() {
    const requestBody = {
      orderId: this.orderId,
      actionType: this.templateType,
      voucherIds: this.voucherIds,
    };
    this.deliveryStatusService
      .SyncOrderDistributionStatus(requestBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: BaseResponse) => {
          if (response.success) {
            // do logic for sync status
          } else {
            this.toast.showDanger(response.message);
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error while syncing order distribution status. Please try again later.'
          );
        },
      });
  }

  fetchOrderStatusHistory() {
    this.deliveryStatusService
      .getOrderDistributionStatusHistory(this.orderId, this.templateType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (syncHistory: SyncStatusHistory[]) => {
          if (syncHistory.length > 0) {
            this.assignDataToTableRows(syncHistory);
          } else {
            this.toast.showDanger('No order found for order history.');
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error while fetching order distribution status history records. Please try again later.'
          );
        },
      });
  }

  assignDataToTableRows(syncHistory: SyncStatusHistory[]) {
    if (syncHistory?.length > 0) {
      syncHistory?.forEach((item) => {
        const tableRow: TableRow = {
          data: [
            {
              value: this.datePipe.transform(
                item.actionTime,
                'YYYY/MM/dd hh:mm a'
              ),
            },
            { value: item.actionType },
            { value: item.actionResult },
            { value: item.operator },
          ],
        };
        this.tableRows.push(tableRow);
      });
      // check for length and display scroll inside table
      this.showScrollInsideTable = this.tableRows?.length > 6 ? true : false;
    } else {
      this.toast.showDanger(
        'No history data present for order distribution status.'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
