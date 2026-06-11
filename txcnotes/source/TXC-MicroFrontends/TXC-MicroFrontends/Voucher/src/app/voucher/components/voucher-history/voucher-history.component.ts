import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPagination, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { VoucherApiService } from '../../service/voucher-api.service';
import { TenantConfigService } from '../../service/tenant-config.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-voucher-history',
  templateUrl: './voucher-history.component.html',
  styleUrls: ['./voucher-history.component.scss']
})
export class VoucherHistoryComponent implements OnInit {
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(NgbNav) nav!: NgbNav;
  destroy$ = new Subject();
  voucherInfo = {
    voucherId: 112,
    voucherNumber: '4u470923770',
  };
  currentTab = 1;
  list: any = [];
  successList = [
    {
      actionTime: '2021/12/28 11:59:59 PM',
      transactionType: 'Capture',
      merchant: '',
      merchantCode: '000000000000',
      shop: 'Dummy shop',
      shopCode: '1',
      amount: 20,
      transactionCode: '00 0000001 06565321323 00000 00010656532132 30000000010 65653213230 000000 0106565 32132300 000000106565 321323 00 0 000 001 0 6565321323 000000 001065653213230 00000 0010656 5321323',
      result: '',
      operator: 'System',
      transactionTime: '2021/03/28 11:59:59 PM',
      reason: '',
      rsv1: '',
      businessDay: '2021/03/28',
    }
  ];
  failureList = [
    {
      actionTime: '2021/12/28 11:59:59 PM',
      transactionType: 'Capture',
      merchant: '',
      merchantCode: '000000000000',
      shop: 'Dummy shop',
      shopCode: '1',
      amount: 20,
      transactionCode: '00000000106565321323',
      result: '',
      operator: 'System',
      transactionTime: '2021/03/28 11:59:59 PM',
      reason: '',
      rsv1: '',
      businessDay: '2021/03/28',
    }
  ];
  constructor(
    private readonly tenantConfigService: TenantConfigService,
    public voucherApiService: VoucherApiService,
  ) { }

  ngOnInit(): void {
    this.list = this.successList;
    this.getSuccessList();
  }

  tabChanged(tabId: number) {
    this.list = [];
    if (tabId === 1) {
      this.getSuccessList();
    } else if (tabId === 2) {
      this.getFailuerList();
    }
  }

  getSuccessList() {
    const voucherId = 1;
    this.voucherApiService.getVoucherHistoryDetailsByVoucherIds(voucherId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        const list = data.denormalizedTransition.items.map((item: any) => {
          const rowData = {
            id: item.id,
            voucherIdPartitionNumber: item.voucherIdPartitionNumber,
            actionTime: item.actionTime,
            actionType: item.action,
            amount: item.amount,
            merchantId: item.merchantId,
            shopId: item.shopId,
            operator: item.operator,
            rsv1: item.rsv1,
            transactionCode: item.tranCode,
            businessDate: item.businessDate,
          }
          return rowData;
        })
        this.list = list;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  }
  getFailuerList() {
    this.voucherApiService.getVoucherHistoryByAuditLog().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        const list = data.auditLogs?.items.map((item: any) => ({
          id: item.entityId,
          voucherIdPartitionNumber: item.voucherIdPartitionNumber,
          actionTime: item.date,
          actionType: item.action,
          operator: item.who,
        }));
        this.list = list;
      },
      error: (err: any) => { },
      complete: () => { },
    });
  };

  ngAfterViewInit(): void {
    this.nav.navChange.subscribe(e => {
      this.currentTab = e.nextId;
      this.tabChanged(e.nextId);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

}
