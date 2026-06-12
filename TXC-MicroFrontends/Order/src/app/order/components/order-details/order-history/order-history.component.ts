import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { OrderActionHistory } from 'src/app/order/models/order-history.model';
import { OrderHistoryService } from 'src/app/order/services/order-history.service';

import {
  TableHeader,
  TableModel,
  TableRow,
} from 'src/app/shared/models/dumb-models/table.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  orderId!: number;
  destroy$ = new Subject();

  tableHeaders: TableHeader[] = [
    {
      headerId: 'actionHeader',
      headerName: 'Action',
    },
    {
      headerId: 'operatorHeader',
      headerName: 'Operator',
    },
    {
      headerId: 'timeHeader',
      headerName: 'Time',
    },
  ];
  tableRows: TableRow[] = [];

  get historyTableModel(): TableModel {
    return {
      tableHeaders: this.tableHeaders,
      tableRows: this.tableRows,
    };
  }
  constructor(
    public activeModal: NgbActiveModal,
    private orderHistoryService: OrderHistoryService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchOrderHistoryData();
  }

  fetchOrderHistoryData() {
    this.orderHistoryService
      .getOrderActionHistories(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (historyData: OrderActionHistory[]) => {
          if (historyData.length > 0) {
            this.assignDataToTableRows(historyData);
          } else {
            this.toast.showDanger(
              'No order found for order history.'
            );
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error while fetching order history records. Please try again later.'
          );
        }
      });
  }

  assignDataToTableRows(historyData: OrderActionHistory[]) {
    if (historyData?.length > 0) {
      historyData?.map((record: OrderActionHistory) => {
        const tableRow: TableRow = {
          data: [
            {
              value: record.result,
            },
            {
              value: record.operator,
            },
            {
              value: this.datePipe.transform(
                record.createdDateTime,
                'YYYY/MM/dd hh:mm a'
              ),
            },
          ],
        };
        this.tableRows.push(tableRow);
      });
    } else {
      this.toast.showDanger('No history data present for order.');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
